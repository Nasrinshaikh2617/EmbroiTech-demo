// Expanded embroidery design & clothing dataset
const designs = [
  { title: "Floral Embroidery", type: "floral", img: "https://picsum.photos/200?random=21" },
  { title: "Geometric Shapes", type: "geometric", img: "https://picsum.photos/200?random=22" },
  { title: "Mirror Work Pattern", type: "mirror", img: "https://picsum.photos/200?random=23" },
  { title: "Traditional Kurti Design", type: "kurti", img: "https://picsum.photos/200?random=24" },
  { title: "Anarkali Dress Embroidery", type: "anarkali", img: "https://picsum.photos/200?random=25" },
  { title: "Saree Border Embroidery", type: "traditional", img: "https://picsum.photos/200?random=26" },
  { title: "Lehenga Embroidery", type: "traditional", img: "https://picsum.photos/200?random=27" },
  { title: "Modern Fusion Jacket", type: "modern", img: "https://picsum.photos/200?random=28" },
  { title: "Floral Border", type: "floral", img: "https://picsum.photos/200?random=29" },
  { title: "Geometric Lines", type: "geometric", img: "https://picsum.photos/200?random=30" },
  { title: "Mirror Work Dupatta", type: "mirror", img: "https://picsum.photos/200?random=31" },
  { title: "Kurti with Neck Embroidery", type: "kurti", img: "https://picsum.photos/200?random=32" },
  { title: "Anarkali Gown Design", type: "anarkali", img: "https://picsum.photos/200?random=33" },
  { title: "Saree Pallu Work", type: "traditional", img: "https://picsum.photos/200?random=34" },
  { title: "Contemporary Saree Blouse", type: "modern", img: "https://picsum.photos/200?random=35" }
];

const gallery = document.getElementById("gallery");
const searchBar = document.getElementById("searchBar");
const filters = document.querySelectorAll(".filter");

// Render designs
function renderDesigns(items) {
  gallery.innerHTML = "";
  if (items.length === 0) {
    gallery.innerHTML = "<p>No designs found. Try another keyword.</p>";
    return;
  }
  items.forEach(d => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <img src="${d.img}" alt="${d.title}">
      <p>${d.title}</p>
    `;
    gallery.appendChild(card);
  });
}

// Filter + search logic
function filterDesigns() {
  const searchText = searchBar.value.toLowerCase();
  const activeFilters = Array.from(filters)
    .filter(f => f.checked)
    .map(f => f.value);

  let filtered = designs.filter(d => 
    d.title.toLowerCase().includes(searchText) &&
    (activeFilters.length === 0 || activeFilters.includes(d.type))
  );

  renderDesigns(filtered);
}

// Event listeners
searchBar.addEventListener("input", filterDesigns);
filters.forEach(f => f.addEventListener("change", filterDesigns));

// Initial render
renderDesigns(designs);
