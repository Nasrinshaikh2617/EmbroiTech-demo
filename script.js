/******************************************
 * EmbroiTech static demo script.js
 * - data array (products)
 * - render grid
 * - search + filters + category chips
 * - cart (localStorage)
 * - checkout -> order (localStorage)
 ******************************************/

// ---------- Sample product data ----------
const products = [
  { id: 1, title: "Floral Kurti Embroidery", type: ["floral","kurti"], price: 399, img:"https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=800&q=60" },
  { id: 2, title: "Geometric Jacket Pattern", type: ["geometric","modern"], price: 599, img:"https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=800&q=60" },
  { id: 3, title: "Mirror Work Saree Border", type: ["mirror","traditional"], price: 749, img:"https://images.unsplash.com/photo-1535428924167-0ef1a8b0a0c6?auto=format&fit=crop&w=800&q=60" },
  { id: 4, title: "Anarkali Floral Embroidery", type: ["anarkali","floral"], price: 899, img:"https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=800&q=60" },
  { id: 5, title: "Contemporary Saree Blouse", type: ["modern","traditional"], price: 499, img:"https://images.unsplash.com/photo-1520975918702-2b26d2f9b7d1?auto=format&fit=crop&w=800&q=60" },
  { id: 6, title: "Lehenga Embroidery Motif", type: ["traditional","lehenga"], price: 1299, img:"https://images.unsplash.com/photo-1519377345644-937ef9754740?auto=format&fit=crop&w=800&q=60" },
  { id: 7, title: "Mirror Work Dupatta", type: ["mirror","traditional"], price: 299, img:"https://images.unsplash.com/photo-1535385791394-1c2f3da2f6b9?auto=format&fit=crop&w=800&q=60" },
  { id: 8, title: "Floral Border Motif", type: ["floral","saree"], price: 199, img:"https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=800&q=60" },
  { id: 9, title: "Geometric Lines Panel", type: ["geometric"], price: 349, img:"https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=60" },
  { id:10, title: "Kurti Neckline Work", type: ["kurti"], price: 259, img:"https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=60" }
];

// ---------- DOM refs ----------
const grid = document.getElementById('grid');
const searchBar = document.getElementById('searchBar');
const filters = document.querySelectorAll('.filter');
const categoryButtons = document.getElementById('categoryButtons');

const cartButton = document.getElementById('cartButton');
const cartCount = document.getElementById('cartCount');
const cartModal = document.getElementById('cartModal');
const cartItemsDiv = document.getElementById('cartItems');
const cartSubtotalSpan = document.getElementById('cartSubtotal');
const closeCart = document.getElementById('closeCart');
const continueShopping = document.getElementById('continueShopping');
const checkoutBtn = document.getElementById('checkoutBtn');

const checkoutModal = document.getElementById('checkoutModal');
const closeCheckout = document.getElementById('closeCheckout');
const checkoutForm = document.getElementById('checkoutForm');
const backToCart = document.getElementById('backToCart');

const orderModal = document.getElementById('orderModal');
const orderDetails = document.getElementById('orderDetails');
const closeOrder = document.getElementById('closeOrder');
const orderDone = document.getElementById('orderDone');

const clearSearchBtn = document.getElementById('clearSearch');

// ---------- helpers ----------
function $(sel){ return document.querySelector(sel); }
function formatINR(n){ return parseFloat(n).toFixed(2); }

// ---------- CART (localStorage) ----------
let cart = JSON.parse(localStorage.getItem('embroi_cart') || '[]');
updateCartUI();

function saveCart(){ localStorage.setItem('embroi_cart', JSON.stringify(cart)); }

function addToCart(productId){
  const p = products.find(x=>x.id===productId);
  if(!p) return;
  const existing = cart.find(i=>i.id===productId);
  if(existing) existing.qty++;
  else cart.push({ id: p.id, title: p.title, price: p.price, img: p.img, qty: 1 });
  saveCart(); updateCartUI();
}

function removeFromCart(productId){
  cart = cart.filter(i=>i.id!==productId);
  saveCart(); updateCartUI(); renderCartItems();
}
function changeQty(productId, delta){
  const item = cart.find(i=>i.id===productId);
  if(!item) return;
  item.qty = Math.max(1, item.qty + delta);
  saveCart(); updateCartUI(); renderCartItems();
}

function cartSubtotal(){
  return cart.reduce((s,i)=> s + i.price * i.qty, 0);
}

function updateCartUI(){
  cartCount.textContent = cart.reduce((s,i)=> s + i.qty, 0);
}

// ---------- RENDER GRID ----------
function createCard(p){
  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `
    <img src="${p.img}" alt="${p.title}">
    <div class="card-body">
      <div>
        <h4>${p.title}</h4>
        <p style="color:#666">Categories: ${p.type.join(', ')}</p>
      </div>
      <div class="meta">
        <div>₹ ${formatINR(p.price)}</div>
        <div>
          <button class="btn secondary" data-id="${p.id}" onclick="viewDetail(${p.id})">View</button>
          <button class="btn primary" data-id="${p.id}" onclick="addToCartHandler(${p.id})">Add to cart</button>
        </div>
      </div>
    </div>
  `;
  return card;
}

function renderGrid(items){
  grid.innerHTML = '';
  if(items.length === 0) grid.innerHTML = '<p style="padding:20px;">No results found.</p>';
  items.forEach(p => grid.appendChild(createCard(p)));
}

// quick view (simple alert or modal)
window.viewDetail = function(id){
  const p = products.find(x=>x.id===id);
  if(!p) return;
  alert(`${p.title}\\nCategories: ${p.type.join(', ')}\\nPrice: ₹${p.price}\\n\\n(This is a prototype quick-view.)`);
};

// add to cart handler (global)
window.addToCartHandler = function(id){
  addToCart(id);
  alert('Added to cart');
};

// initial render
renderGrid(products);

// ---------- FILTER + SEARCH ----------
function getActiveFilters(){
  return Array.from(filters).filter(f => f.checked).map(f => f.value);
}

function applyFiltersAndSearch(){
  const q = searchBar.value.trim().toLowerCase();
  const active = getActiveFilters();
  let results = products.filter(p => {
    const matchSearch = q==='' || p.title.toLowerCase().includes(q) || p.type.join(' ').includes(q);
    const matchFilter = active.length === 0 || active.some(a => p.type.includes(a));
    return matchSearch && matchFilter;
  });

  // sort (simple)
  const sortVal = document.getElementById('sortSelect')?.value;
  if(sortVal === 'name-asc') results.sort((a,b)=> a.title.localeCompare(b.title));
  if(sortVal === 'name-desc') results.sort((a,b)=> b.title.localeCompare(a.title));

  renderGrid(results);
}

// events
searchBar.addEventListener('input', applyFiltersAndSearch);
filters.forEach(f => f.addEventListener('change', applyFiltersAndSearch));
document.getElementById('sortSelect')?.addEventListener('change', applyFiltersAndSearch);

// category chips
const categories = ['floral','geometric','mirror','kurti','anarkali','traditional','modern'];
categories.forEach(cat=>{
  const chip = document.createElement('span');
  chip.className = 'chip';
  chip.textContent = cat;
  chip.onclick = ()=> {
    // toggle filter box
    const f = Array.from(filters).find(x=>x.value===cat);
    if(f){ f.checked = !f.checked; applyFiltersAndSearch(); }
  };
  categoryButtons.appendChild(chip);
});

// ---------- CART MODAL RENDER ----------
function renderCartItems(){
  cartItemsDiv.innerHTML = '';
  if(cart.length===0){
    cartItemsDiv.innerHTML = '<p>Your cart is empty.</p>';
    cartSubtotalSpan.textContent = '0.00';
    return;
  }
  cart.forEach(item=>{
    const row = document.createElement('div');
    row.className = 'cart-row';
    row.innerHTML = `
      <img src="${item.img}" />
      <div style="flex:1;">
        <strong>${item.title}</strong><br/>
        ₹ ${formatINR(item.price)} x ${item.qty}
      </div>
      <div class="qty">
        <button class="btn" onclick="changeQty(${item.id}, -1)">-</button>
        <span>${item.qty}</span>
        <button class="btn" onclick="changeQty(${item.id}, 1)">+</button>
        <button class="btn" style="margin-left:8px;" onclick="removeFromCart(${item.id})">Remove</button>
      </div>
    `;
    cartItemsDiv.appendChild(row);
  });
  cartSubtotalSpan.textContent = formatINR(cartSubtotal());
}

// show cart modal
cartButton.addEventListener('click', ()=>{
  renderCartItems();
  cartModal.classList.remove('hidden');
});
closeCart.addEventListener('click', ()=> cartModal.classList.add('hidden'));
continueShopping.addEventListener('click', ()=> cartModal.classList.add('hidden'));

// checkout workflow
checkoutBtn.addEventListener('click', ()=>{
  cartModal.classList.add('hidden');
  checkoutModal.classList.remove('hidden');
});
closeCheckout.addEventListener('click', ()=> checkoutModal.classList.add('hidden'));
backToCart.addEventListener('click', ()=> { checkoutModal.classList.add('hidden'); cartModal.classList.remove('hidden'); });

// submit order
checkoutForm.addEventListener('submit', (e)=>{
  e.preventDefault();
  if(cart.length===0){ alert('Your cart is empty'); return; }
  const form = new FormData(checkoutForm);
  const order = {
    id: 'ORD' + Date.now(),
    date: new Date().toLocaleString(),
    customer: {
      name: form.get('name'),
      email: form.get('email'),
      phone: form.get('phone'),
      address: form.get('address')
    },
    items: cart,
    subtotal: cartSubtotal()
  };
  // store order in localStorage (mock)
  const allOrders = JSON.parse(localStorage.getItem('embroi_orders') || '[]');
  allOrders.push(order);
  localStorage.setItem('embroi_orders', JSON.stringify(allOrders));
  // clear cart
  cart = []; saveCart(); renderCartItems(); updateCartUI();

  checkoutModal.classList.add('hidden');
  showOrderModal(order);
});

function showOrderModal(order){
  orderDetails.innerHTML = `
    <p><strong>Order ID:</strong> ${order.id}</p>
    <p><strong>Date:</strong> ${order.date}</p>
    <p><strong>Customer:</strong> ${order.customer.name} (${order.customer.email})</p>
    <p><strong>Subtotal:</strong> ₹ ${formatINR(order.subtotal)}</p>
    <h4>Items</h4>
    <ul>${order.items.map(i=>`<li>${i.title} × ${i.qty} — ₹ ${formatINR(i.price*i.qty)}</li>`).join('')}</ul>
  `;
  orderModal.classList.remove('hidden');
}

closeOrder.addEventListener('click', ()=> orderModal.classList.add('hidden'));
orderDone.addEventListener('click', ()=> orderModal.classList.add('hidden'));

// clear search button
clearSearchBtn.addEventListener('click', ()=>{
  searchBar.value = '';
  applyFiltersAndSearch();
});

applyFiltersAndSearch();
