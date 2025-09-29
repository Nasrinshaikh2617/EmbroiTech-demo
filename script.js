// Sample embroidery design data
const designs = [
  { title: "Floral Embroidery", type: "floral", img: "https://picsum.photos/200?random=11" },
  { title: "Geometric Pattern", type: "geometric", img: "https://picsum.photos/200?random=12" },
  { title: "Traditional Motif", type: "traditional", img: "https://picsum.photos/200?random=13" },
  { title: "Modern Fusion", type: "modern", img: "https://picsum.photos/200?random=14" },
  { title: "Floral Border", type: "floral", img: "https://picsum.photos/200?random=15" },
  { title: "Geometric Lines", type: "geometric", img: "https://picsum.photos/200?random=16" },
  { title: "Cultural Embroidery", type: "traditional", img: "https://picsum.photos/200?random=17" },
  { title: "Contemporary Style", type: "modern", img: "https://picsum.photos/200?random=18" }
];

const gallery = document.getElementById("gallery");
const searchBar = document.getElementById("searchBar");
const filters = document.querySelectorAll(".filter");

// Render designs
function renderDesigns(items) {
  gallery.innerHTML = "";
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
