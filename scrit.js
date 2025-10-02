// Sample designs (with categories)
const designs = [
  { name: "Floral Kurti", category: ["floral", "kurti"], img: "https://i.ibb.co/2StsXrk/floral.jpg" },
  { name: "Geometric Anarkali", category: ["geometric", "anarkali"], img: "https://i.ibb.co/10N0V2t/geometric.jpg" },
  { name: "Mirror Work Saree", category: ["mirror", "saree"], img: "https://i.ibb.co/MR8WfMf/mirror.jpg" },
  { name: "Designer Lehenga", category: ["lehenga"], img: "https://i.ibb.co/3YWDz8B/lehenga.jpg" }
];

const grid = document.getElementById("designGrid");
const searchBar = document.getElementById("searchBar");
const filters = document.querySelectorAll(".filter");
const cartBtn = document.getElementById("cartBtn");
const cartSidebar = document.getElementById("cartSidebar");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");

let cart = [];

// Display designs
function displayDesigns(list) {
  grid.innerHTML = "";
  list.forEach(item => {
    const div = document.createElement("div");
    div.className = "design";
    div.innerHTML = `
      <img src="${item.img}" alt="${item.name}">
      <h3>${item.name}</h3>
      <button onclick="addToCart('${item.name}')">Add to Cart</button>
    `;
    grid.appendChild(div);
  });
}

// Add to Cart
function addToCart(name) {
  cart.push(name);
  cartItems.innerHTML = cart.map(c => `<li>${c}</li>`).join("");
  cartCount.innerText = cart.length;
}

// Toggle Cart
cartBtn.addEventListener("click", () => {
  cartSidebar.classList.toggle("active");
});

// Search Function
searchBar.addEventListener("input", () => {
  const query = searchBar.value.toLowerCase();
  const filtered = designs.filter(d =>
    d.name.toLowerCase().includes(query) ||
    d.category.some(cat => cat.includes(query))
  );
  displayDesigns(filtered);
});

// Filter Function
filters.forEach(f => {
  f.addEventListener("change", () => {
    const selected = [...filters].filter(chk => chk.checked).map(chk => chk.value);
    const filtered = selected.length
      ? designs.filter(d => d.category.some(cat => selected.includes(cat)))
      : designs;
    displayDesigns(filtered);
  });
});

// Initial load
displayDesigns(designs);
