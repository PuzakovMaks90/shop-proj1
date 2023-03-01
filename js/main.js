const doc = document;
const rootEl = doc.querySelector('#root');
const url = {
    products: 'http://localhost:3000/products',
    category: 'http://localhost:3000/category'
};

render('shop');
pageToggle();

function render(page) {
    switch (page) {
        case 'shop':
            shopPage({url});
            break;
        case 'cart':
            rootEl.innerHTML = cartPage( {title: 'CART PAGE'} );
            break;
        case 'admin':
            rootEl.innerHTML = adminPage( {title: 'ADMIN PAGE'} );
            break;
        case 'single':
            rootEl.innerHTML = singleProductPage( {title: 'SINGLE PRODUCT PAGE'} );
            break;
        default:
            shopPage({url});
    }
}

function shopPage(props) {
    getProdData(props.url)
        .then(prodList => renderProdList(prodList));
}

function cartPage(props) {
    const {title} = props;
    return `
        <h1>${ title }</h1>
    `;
}

function adminPage(props) {
    const {title} = props;
    return `
        <h1>${ title }</h1>
    `;
}

function singleProductPage(props) {
    const {title} = props;
    return `
        <h1>${ title }</h1>
    `;
}

function pageToggle() {
    const btns = doc.querySelectorAll('.menu-item button');
    btns.forEach(btn => {
        btn.onclick = e => {
            const page = e.target.dataset.page;
            console.log(page);
            togglePageActive(page);
            render(page);
        }
    });
}

function togglePageActive(activePage) {
    const btns = doc.querySelectorAll('.menu-item button');
    btns.forEach(btn => {
        const page = btn.dataset.page;
        page == activePage 
            ? btn.classList.add('active')
            : btn.classList.remove('active');
    });
}

async function getProdData(url) {
    let response = await fetch(url.category);
    const category = await response.json();
    response = await fetch(url.products);
    const products = await response.json()

    const prodList = products.map(prod => {
        const cat = category.find(cat => prod.category == cat.id);
        prod.category = cat;
        return prod;
    });

    return prodList;
}

function renderProdList(prodList) {
    const parent = doc.createElement('div');
    let prodListHtml = '<ul class="product-list">';

    prodList.forEach(prod => prodListHtml += renderProd(prod));
    prodListHtml += '<ul>';

    parent.innerHTML = prodListHtml;
    parent.className = "products";

    rootEl.innerHTML = '';
    rootEl.append(parent);
    
    doc.querySelectorAll('.product').forEach(item => item.onclick = (e) => {
        render('single');
    });

    doc.querySelectorAll('.category').forEach(item => item.onclick = (e) => {
        e.stopPropagation();
        const cat = e.target.dataset.cat;
        console.log(cat);
    });

    doc.querySelectorAll('.product-in-cart').forEach(item => item.onclick = (e) => {
        e.stopPropagation();
        const prodId = e.target.dataset.id;
        console.log(prodId);
    });
}

function renderProd(props) {
    const { id, title, price, img, category } = props;
    return prodsHtml = `
        <li class="product">
            <button class="category" data-cat="${category.name}">${category.local}</button>
            <div class="product-img">
                <img src="./img/products/${img}" alt="">
            </div>
            <div class="product-title">${title}</div>
            <div class="product-price-block">
                <span class="product-price">${price}</span>
                <button class="product-in-cart" data-id="${id}">в корзину</button>
            </div>
        </li>
    `;
}
