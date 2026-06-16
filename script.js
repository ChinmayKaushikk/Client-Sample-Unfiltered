/* ==========================================
   PRODUCTS DATABASE
========================================== */

const products = [
{
id:1,
title:"Rebel Oversized Tee",
price:799,
oldPrice:1199,
rating:4.8,
stock:12,
img:"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800",
cat:"tee",
badge:"NEW"
},
{
id:2,
title:"Urban Essential Hoodie",
price:1499,
oldPrice:1999,
rating:4.9,
stock:7,
img:"https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800",
cat:"hoodie",
badge:"SALE"
},
{
id:3,
title:"Edge Runner Sneakers",
price:2499,
oldPrice:3499,
rating:4.7,
stock:4,
img:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
cat:"sneaker",
badge:"LIMITED"
}
];

/* ==========================================
   LOCAL STORAGE
========================================== */

let cart =
JSON.parse(localStorage.getItem("cart")) || [];

let wishlist =
JSON.parse(localStorage.getItem("wishlist")) || [];

let currentProduct = null;

/* ==========================================
   PAGE LOAD
========================================== */

window.addEventListener("load", () => {

const loader = document.getElementById("loader");

if(loader){
setTimeout(()=>{
loader.style.opacity="0";
loader.style.visibility="hidden";
},1200);
}

loadTheme();

renderProducts(products);

updateCart();

});

/* ==========================================
   RENDER PRODUCTS
========================================== */

function renderProducts(list){

const container =
document.getElementById("productList");

if(!container) return;

container.innerHTML="";

list.forEach(product=>{

const discount =
Math.round(
((product.oldPrice-product.price)
/
product.oldPrice)*100
);

container.innerHTML += `

<div class="product">

<div class="badge">
${product.badge}
</div>

<div
class="wishlist"
onclick="toggleWish(${product.id})"
>
❤️
</div>

<img
src="${product.img}"
alt="${product.title}"
onclick="openModal(${product.id})"
>

<div class="rating">
⭐ ${product.rating}
</div>

<h3>${product.title}</h3>

<div class="price-box">

<span class="price">
₹${product.price}
</span>

<span class="old-price">
₹${product.oldPrice}
</span>

<span class="discount">
${discount}% OFF
</span>

</div>

<div class="stock">

Only ${product.stock} left

</div>

<div class="card-buttons">

<button
onclick="openModal(${product.id})"
>
View
</button>

<button
onclick="quickAdd(${product.id})"
>
+ Cart
</button>

</div>

</div>

`;

});

}

/* ==========================================
   PRODUCT MODAL
========================================== */

function openModal(id){

currentProduct =
products.find(p=>p.id===id);

if(!currentProduct) return;

document.getElementById("productModal")
.style.display="flex";

document.getElementById("modalImg")
.src=currentProduct.img;

document.getElementById("modalTitle")
.innerText=currentProduct.title;

document.getElementById("modalPrice")
.innerText="₹"+currentProduct.price;

}

function closeModal(){

const modal =
document.getElementById("productModal");

if(modal){
modal.style.display="none";
}

}

/* ==========================================
   ADD TO CART
========================================== */

function addToCart(){

if(!currentProduct) return;

const quantity =
parseInt(
document.getElementById("qty").value
);

const size =
document.getElementById("sizeSelect").value;

cart.push({
...currentProduct,
qty:quantity,
size:size
});

localStorage.setItem(
"cart",
JSON.stringify(cart)
);

updateCart();

showToast("Added to cart");

closeModal();

}

function quickAdd(id){

const product =
products.find(
p=>p.id===id
);

if(!product) return;

cart.push({

...product,
qty:1,
size:"M"

});

localStorage.setItem(
"cart",
JSON.stringify(cart)
);

updateCart();

showToast(
`${product.title} added`
);

}

/* ==========================================
   UPDATE CART
========================================== */

function updateCart(){

const count =
document.getElementById("cartCount");

const cartItems =
document.getElementById("cartItems");

const cartTotal =
document.getElementById("cartTotal");

if(count)
count.innerText = cart.length;

if(!cartItems) return;

cartItems.innerHTML="";

if(cart.length===0){

cartItems.innerHTML=`

<div class="empty-cart">

🛒

<h3>
Your Cart Is Empty
</h3>

<p>
Start exploring products.
</p>

</div>

`;

if(cartTotal){

cartTotal.innerText="0";

}

return;

}

let total=0;

cart.forEach((item,index)=>{

total += item.price * item.qty;

cartItems.innerHTML += `

<div class="cart-item">

<div>

<h4>${item.title}</h4>

<p>
₹${item.price}
</p>

<p>
Size: ${item.size}
</p>

</div>

<div class="qty-controls">

<button onclick="changeQty(${index},-1)">
-
</button>

<span>
${item.qty}
</span>

<button onclick="changeQty(${index},1)">
+
</button>

</div>

<button
class="remove-btn"
onclick="removeCartItem(${index})"
>
🗑
</button>

</div>

`;

});

if(cartTotal){
const finalTotal =
total -
(total*discount/100);

cartTotal.innerText =
finalTotal.toFixed(0);
}

}

/* ==========================================
   REMOVE CART ITEM
========================================== */

function removeCartItem(index){

cart.splice(index,1);

localStorage.setItem(
"cart",
JSON.stringify(cart)
);

updateCart();

showToast("Item removed");

}

/* ==========================================
   CART SIDEBAR
========================================== */

const cartIcon =
document.getElementById("cartIcon");

if(cartIcon){

cartIcon.addEventListener("click",()=>{

document
.getElementById("cartSidebar")
.classList.toggle("show");

});

}

const closeCart =
document.getElementById("closeCart");

if(closeCart){

closeCart.addEventListener(
"click",
()=>{

document
.getElementById("cartSidebar")
.classList.remove("show");

});

}

/* ==========================================
   SEARCH
========================================== */

const search =
document.getElementById("search");

if(search){

search.addEventListener("input",(e)=>{

const value =
e.target.value.toLowerCase();

const filtered =
products.filter(product =>
product.title
.toLowerCase()
.includes(value)
);

renderProducts(filtered);

});

}

/* ==========================================
   DARK MODE
========================================== */

function loadTheme(){

const savedTheme =
localStorage.getItem("theme");

if(savedTheme === "dark"){
document.body.classList.add("dark");
}

}

const themeToggle =
document.getElementById("themeToggle");

if(themeToggle){

themeToggle.addEventListener("click",()=>{

document.body.classList.toggle("dark");

const isDark =
document.body.classList.contains("dark");

localStorage.setItem(
"theme",
isDark ? "dark" : "light"
);

showToast(
isDark
? "Dark Mode Enabled"
: "Light Mode Enabled"
);

});

}

/* ==========================================
   WISHLIST
========================================== */

function toggleWish(id){

const exists =
wishlist.includes(id);

if(exists){

wishlist =
wishlist.filter(item => item !== id);

showToast("Removed from wishlist");

}else{

wishlist.push(id);

showToast("Added to wishlist ❤️");

}

localStorage.setItem(
"wishlist",
JSON.stringify(wishlist)
);

}

/* ==========================================
   TOAST NOTIFICATION
========================================== */

function showToast(message){

const toast =
document.getElementById("toast");

if(!toast) return;

toast.innerText = message;

toast.style.display = "block";

setTimeout(()=>{

toast.style.display = "none";

},2000);

}

/* ==========================================
   SECTION NAVIGATION
========================================== */

function showSection(id){

const sections =
document.querySelectorAll("main section");

sections.forEach(section=>{

section.classList.remove("active");

});

const selected =
document.getElementById(id);

if(selected){

selected.classList.add("active");

window.scrollTo({
top:0,
behavior:"smooth"
});

}

}

/* ==========================================
   PRODUCT FILTERS
========================================== */

function filterProducts(category){

if(category === "all"){

renderProducts(products);

return;

}

const filtered =
products.filter(product =>
product.cat === category
);

renderProducts(filtered);

}

/* ==========================================
   FAQ ACCORDION
========================================== */

const faqItems =
document.querySelectorAll(".faq-item");

faqItems.forEach(item=>{

item.addEventListener("click",()=>{

const paragraph =
item.querySelector("p");

if(!paragraph) return;

const visible =
paragraph.style.display === "block";

document
.querySelectorAll(".faq-item p")
.forEach(p=>{

p.style.display = "none";

});

paragraph.style.display =
visible ? "none" : "block";

});

});

/* ==========================================
   NEWSLETTER
========================================== */

const newsletterBtn =
document.querySelector(".newsletter button");

if(newsletterBtn){

newsletterBtn.addEventListener("click",()=>{

const input =
document.querySelector(
".newsletter input"
);

if(!input) return;

const email =
input.value.trim();

if(email === ""){

showToast(
"Please enter your email"
);

return;

}

let subscribers =
JSON.parse(
localStorage.getItem("subscribers")
) || [];

if(subscribers.includes(email)){

showToast(
"Already subscribed"
);

return;

}

subscribers.push(email);

localStorage.setItem(
"subscribers",
JSON.stringify(subscribers)
);

input.value = "";

showToast(
"Subscribed Successfully 🎉"
);

});

}

/* ==========================================
   CONTACT FORM
========================================== */

const contactForm =
document.querySelector("form");

if(contactForm){

contactForm.addEventListener(
"submit",
(e)=>{

e.preventDefault();

const inputs =
contactForm.querySelectorAll(
"input, textarea"
);

let valid = true;

inputs.forEach(input=>{

if(input.value.trim()===""){
valid = false;
}

});

if(!valid){

showToast(
"Please fill all fields"
);

return;

}

const contactMessages =
JSON.parse(
localStorage.getItem("messages")
) || [];

contactMessages.push({

name: inputs[0].value,
email: inputs[1].value,
message: inputs[2].value,
date: new Date().toLocaleString()

});

localStorage.setItem(
"messages",
JSON.stringify(contactMessages)
);

contactForm.reset();

showToast(
"Message Sent Successfully ✅"
);

});

}

/* ==========================================
   CLOSE MODAL ON OUTSIDE CLICK
========================================== */

window.addEventListener("click",(e)=>{

const modal =
document.getElementById(
"productModal"
);

if(
modal &&
e.target === modal
){

closeModal();

}

});

/* ==========================================
   ESC KEY CLOSE MODAL
========================================== */

document.addEventListener(
"keydown",
(e)=>{

if(e.key === "Escape"){

closeModal();

}

});

/* ==========================================
   CART PAGE SUPPORT
========================================== */

function renderCartPage(){

const cartContainer =
document.getElementById("cartItems");

const totalElement =
document.getElementById("total");

if(!cartContainer || !totalElement)
return;

cartContainer.innerHTML = "";

let total = 0;

cart.forEach((item,index)=>{

total +=
item.price * item.qty;

cartContainer.innerHTML += `

<div class="cart-item">

<div>

<h4>${item.title}</h4>

<p>
Size: ${item.size}
</p>

<p>
Qty: ${item.qty}
</p>

</div>

<button
class="remove-btn"
onclick="removeCartItem(${index})"
>
Remove
</button>

</div>

`;

});

totalElement.innerText = total;

}

renderCartPage();

/* ==========================================
   RECENTLY VIEWED PRODUCTS
========================================== */

function saveRecentlyViewed(id){

let viewed =
JSON.parse(
localStorage.getItem("recent")
) || [];

viewed =
viewed.filter(
item => item !== id
);

viewed.unshift(id);

viewed = viewed.slice(0,5);

localStorage.setItem(
"recent",
JSON.stringify(viewed)
);

}

const oldOpenModal =
openModal;

openModal = function(id){

saveRecentlyViewed(id);

oldOpenModal(id);

};

const sortProducts =
document.getElementById(
"sortProducts"
);

if(sortProducts){

sortProducts.addEventListener(
"change",
(e)=>{

let sorted =
[...products];

switch(e.target.value){

case "low":

sorted.sort(
(a,b)=>
a.price-b.price
);

break;

case "high":

sorted.sort(
(a,b)=>
b.price-a.price
);

break;

case "rating":

sorted.sort(
(a,b)=>
b.rating-a.rating
);

break;

}

renderProducts(sorted);

});

}

function changeQty(index,value){

cart[index].qty += value;

if(cart[index].qty < 1){

cart[index].qty = 1;

}

localStorage.setItem(
"cart",
JSON.stringify(cart)
);

updateCart();

}

let discount = 0;

function applyCoupon(){

const code =
document
.getElementById("couponInput")
.value
.toUpperCase();

if(code==="SAVE10"){

discount=10;

showToast(
"10% Discount Applied"
);

}

else if(code==="WELCOME20"){

discount=20;

showToast(
"20% Discount Applied"
);

}

else{

discount=0;

showToast(
"Invalid Coupon"
);

}

updateCart();

}

function renderRecentProducts(){

const container =
document.getElementById(
"recentProducts"
);

if(!container) return;

const ids =
JSON.parse(
localStorage.getItem("recent")
) || [];

container.innerHTML="";

ids.forEach(id=>{

const product =
products.find(
p=>p.id===id
);

if(!product) return;

container.innerHTML += `

<div class="product">

<img
src="${product.img}"
>

<h3>
${product.title}
</h3>

<p>
₹${product.price}
</p>

</div>

`;

});

}

renderRecentProducts();

function renderWishlist(){

const container =
document.getElementById(
"wishlistContainer"
);

if(!container) return;

container.innerHTML="";

if(wishlist.length===0){

container.innerHTML=`

<div class="empty-cart">

❤️

<h3>
Wishlist Empty
</h3>

<p>
Save products you love.
</p>

</div>

`;

return;

}

wishlist.forEach(id=>{

const product =
products.find(
p=>p.id===id
);

if(!product) return;

container.innerHTML += `

<div class="product">

<img
src="${product.img}"
alt="${product.title}"
>

<h3>
${product.title}
</h3>

<p>
₹${product.price}
</p>

<div class="card-buttons">

<button
onclick="quickAdd(${product.id})"
>
Move To Cart
</button>

<button
onclick="removeWishlist(${product.id})"
>
Remove
</button>

</div>

</div>

`;

});

}

function removeWishlist(id){

wishlist =
wishlist.filter(
item => item !== id
);

localStorage.setItem(
"wishlist",
JSON.stringify(wishlist)
);

renderWishlist();

showToast(
"Removed From Wishlist"
);

}

renderWishlist();

/* ==========================================
   END OF SCRIPT.JS
========================================== */