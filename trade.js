var fetchResults;
var listOfProducts
fetch("https://jsonblob.com/api/jsonBlob/c4905cf2-8947-11ea-813a-8f58e2a28273")
.then(e => e.json())
.then(e => {
    fetchResults = e
    listOfProducts = fetchResults.products;
    listOfProducts.forEach(e => {
        showProduct(e);
    })
    fromLS();
});

function fromLS(){
    for(let i = 0;i< window.localStorage.length/2;i++){
        let name = localStorage.getItem(`item${i}`);
        let quantity = localStorage.getItem(`quantity${i}`);
        let product = listOfProducts.find(e => e.name == name);
        var productContainer = document.createElement('div');
        productContainer.classList.add("shopping-cart-product");
        productContainer.innerHTML = `<div class="product-info"><div><h3>${name}</h3><p>${product.price} &times; ${quantity}</p></div><img src="${product.image}" /></div><div class="product-count"><button onclick="productMinus(this)">-</button><span>${quantity}</span><button onclick="productPlus(this)">+</button></div>`
        document.querySelector(".shopping-cart-products").appendChild(productContainer);
    }
}

function addItem(){
    let productName = document.querySelector('.name').value;
    let productDescription = document.querySelector('.description').value;
    let productImage = document.querySelector('.image').value;
    let productPrice = document.querySelector('.price').value;
    listOfProducts[listOfProducts.length] = {
        name:productName.toUpperCase(),
        description:productDescription,
        image:productImage,
        price:productPrice
    }
    fetchResults.products = listOfProducts;
    fetch("https://jsonblob.com/api/jsonBlob/c4905cf2-8947-11ea-813a-8f58e2a28273",{
        method:"PUT",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(fetchResults)
    })
    showProduct(listOfProducts[listOfProducts.length-1]);
}
function showProduct(e){
    var container = document.createElement('div');
    container.classList.add('product');
    var image = document.createElement('img');
    image.src = e.image;
    var name = document.createElement('p');
    name.innerText = e.name;
    var price = document.createElement('p');
    price.innerText = e.price;
    var buttons = '<button class="details-button" onclick="openModalWindow(this)">Details</button><button class="buy-button" onclick="buyProduct(this)">Buy</button>';
    container.appendChild(image);
    container.appendChild(name);
    container.appendChild(price);
    container.innerHTML += buttons;
    document.querySelector('.list-products').appendChild(container);
}

function openModalWindow(e){
    var product = listOfProducts.find(el => {
        return el.name == e.parentNode.children[1].innerText
    });
    document.querySelector('.m-image').src = product.image;
    document.querySelector('.m-name').innerText = product.name;
    document.querySelector('.m-price').innerText = product.price;
    document.querySelector('.m-details').innerText = product.description;
    document.querySelector('.modal-window').classList.toggle('active');
}
function closeModalWindow(e){
    document.querySelector('.modal-window').classList.toggle('active');
}

function buyProduct(e){
    var inChartN = document.querySelectorAll('.product-info');
    var inChart = Array.prototype.slice.call(inChartN);
    if(!inChart.some(el =>{
        return el.firstElementChild.firstElementChild.innerText.toUpperCase() == e.parentNode.children[1].innerText;
    })){
    var product = listOfProducts.find(el =>{
        return el.name == e.parentNode.children[1].innerText
    })
    var productContainer = document.createElement('div');
    productContainer.classList.add("shopping-cart-product");
    productContainer.innerHTML = `<div class="product-info"><div><h3>${product.name}</h3><p>${product.price} &times; 1</p></div><img src="${product.image}" /></div><div class="product-count"><button onclick="productMinus(this)">-</button><span>1</span><button onclick="productPlus(this)">+</button></div>`
    document.querySelector(".shopping-cart-products").appendChild(productContainer);}
}

function productPlus(e){
    var count = Number(e.parentNode.children[1].innerText);
    if(count < 10) count ++
    e.parentNode.children[1].innerText = count;
    var a =e.parentNode.parentNode.firstElementChild.firstElementChild.children[1].innerText.split(" ");
    a[a.length-1] = count;
    var b= a[0]+" " + a[1]+ " "+a[2];
    e.parentNode.parentNode.firstElementChild.firstElementChild.children[1].innerText= b;
}
function productMinus(e){
    var count = Number(e.parentNode.children[1].innerText);
    count--
    e.parentNode.children[1].innerText = count;
    var a =e.parentNode.parentNode.firstElementChild.firstElementChild.children[1].innerText.split(" ");
    a[a.length-1] = count;
    var b= a[0]+" " + a[1]+ " "+a[2];
    e.parentNode.parentNode.firstElementChild.firstElementChild.children[1].innerText= b;
    if(count == 0) e.parentNode.parentNode.remove();
}

function updateTotal(){
    var a = document.querySelectorAll('.product-info > div > p');
    var b = Array.prototype.slice.call(a);
    var sum = b.reduce((total,elem) => {
        return total + Number(elem.innerText.split(" ")[0]) * Number(elem.innerText.split(" ")[2])
    },0);
    var total = document.querySelector('.shopping-cart-summary').firstElementChild.firstElementChild;
    total.innerText = "$"+sum;
}

setInterval(updateTotal,500);

function purchased(){
    alert("Purchase sucsesful")
}

window.onbeforeunload = function(){
    var names = document.querySelectorAll('.product-info > div > h3');
    var priceAndQuantity = this.Array.prototype.slice.call(document.querySelectorAll('.product-info >div > p'));
    var quantity = priceAndQuantity.map(e =>{
        return e.innerText.split(' ')[2];
    })
    for(let i =0; i < localStorage.length/2;i++){
        if(names[i] == undefined){
            localStorage.removeItem(`item${i}`);
            localStorage.removeItem(`quantity${i}`); 
        }
    }
    console.log(quantity)
    names.forEach((e,i) => {
        window.localStorage.setItem(`item${i}`,`${e.innerText}`);
    })
    quantity.forEach((e,i) => {
        window.localStorage.setItem(`quantity${i}`, `${e}`);
    })
}