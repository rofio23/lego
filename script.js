
"use strict";

// ======================================
// BRICKSTORE - BOUTIQUE DE SIMULATION
// ======================================

// Catalogue de démonstration
const products = [
  {
    id: 1,
    reference: "42171",
    name: "Mercedes-AMG F1 W14 E Performance",
    category: "Technic",
    price: 219.99,
    pieces: 1642,
    age: "18+",
    badge: "POPULAIRE"
  },
  {
    id: 2,
    reference: "75375",
    name: "Millennium Falcon",
    category: "Star Wars",
    price: 84.99,
    pieces: 921,
    age: "18+",
    badge: "COUP DE CŒUR"
  },
  {
    id: 3,
    reference: "60419",
    name: "La prison sur l'île",
    category: "City",
    price: 99.99,
    pieces: 980,
    age: "7+",
    badge: ""
  },
  {
    id: 4,
    reference: "76924",
    name: "Mercedes-AMG G 63 et SL 63",
    category: "Speed Champions",
    price: 49.99,
    pieces: 808,
    age: "10+",
    badge: "POPULAIRE"
  },
  {
    id: 5,
    reference: "10307",
    name: "La Tour Eiffel",
    category: "Icons",
    price: 499.99,
    pieces: 10001,
    age: "18+",
    badge: "PREMIUM"
  },
  {
    id: 6,
    reference: "42154",
    name: "Ford GT 2022",
    category: "Technic",
    price: 119.99,
    pieces: 1466,
    age: "18+",
    badge: ""
  },
  {
    id: 7,
    reference: "75379",
    name: "R2-D2",
    category: "Star Wars",
    price: 99.99,
    pieces: 1050,
    age: "10+",
    badge: "POPULAIRE"
  },
  {
    id: 8,
    reference: "60430",
    name: "Le vaisseau spatial interstellaire",
    category: "City",
    price: 19.99,
    pieces: 240,
    age: "6+",
    badge: ""
  },
  {
    id: 9,
    reference: "10328",
    name: "Le bouquet de roses",
    category: "Icons",
    price: 59.99,
    pieces: 822,
    age: "18+",
    badge: "CADEAU"
  },
  {
    id: 10,
    reference: "76922",
    name: "BMW M4 GT3 et BMW M Hybrid V8",
    category: "Speed Champions",
    price: 49.99,
    pieces: 676,
    age: "9+",
    badge: ""
  },
  {
    id: 11,
    reference: "42146",
    name: "Grue sur chenilles Liebherr LR 13000",
    category: "Technic",
    price: 449.99,
    pieces: 2883,
    age: "18+",
    badge: "PREMIUM"
  },
  {
    id: 12,
    reference: "75376",
    name: "Tantive IV",
    category: "Star Wars",
    price: 79.99,
    pieces: 654,
    age: "18+",
    badge: ""
  }
];

// ======================================
// SAUVEGARDE LOCALE
// ======================================

function loadSaved(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

let cart = loadSaved("brickstore_cart", {});
let favorites = loadSaved("brickstore_favorites", []);

if (!cart || typeof cart !== "object" || Array.isArray(cart)) {
  cart = {};
}

if (!Array.isArray(favorites)) {
  favorites = [];
}

let currentCategory = "Tous";
let searchTerm = "";
let maxPrice = 500;
let sortMode = "default";
let showFavoritesOnly = false;
let toastTimer;

// ======================================
// ELEMENTS HTML
// ======================================

const grid = document.getElementById("productsGrid");
const searchInput = document.getElementById("searchInput");
const categorySelect = document.getElementById("categorySelect");
const priceRange = document.getElementById("priceRange");
const priceValue = document.getElementById("priceValue");
const sortSelect = document.getElementById("sortSelect");
const cartPanel = document.getElementById("cartPanel");
const overlay = document.getElementById("overlay");
const cartItems = document.getElementById("cartItems");
const toast = document.getElementById("toast");

const euro = value => new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR"
}).format(value);

function productImage(reference) {
  return `https://www.lego.com/cdn/cs/set/assets/blt/` +
    `placeholder`;
}

// Images publiques du catalogue LEGO
function imageUrl(reference) {
  return `https://images.lego.com/is/image/LEGO/${reference}?wid=500&hei=500&fit=constrain`;
}

// Image de remplacement si une référence n'est pas accessible
const fallbackImage =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg"
      width="400" height="400" viewBox="0 0 400 400">
      <rect width="400" height="400" fill="#f5f5f5"/>
      <rect x="90" y="150" width="220" height="130"
        rx="14" fill="#e32636"/>
      <rect x="110" y="130" width="45" height="35"
        rx="7" fill="#ff5360"/>
      <rect x="175" y="130" width="45" height="35"
        rx="7" fill="#ff5360"/>
      <rect x="240" y="130" width="45" height="35"
        rx="7" fill="#ff5360"/>
      <text x="200" y="220" text-anchor="middle"
        font-family="Arial" font-size="35"
        font-weight="bold" fill="white">BRICKS</text>
    </svg>
  `);

// ======================================
// AFFICHAGE DES PRODUITS
// ======================================

function renderProducts() {
  let list = products.filter(product => {
    const matchesCategory =
      currentCategory === "Tous" ||
      product.category === currentCategory;

    const matchesSearch =
      `${product.name} ${product.category} ${product.reference}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesPrice = product.price <= maxPrice;

    const matchesFavorites =
      !showFavoritesOnly || favorites.includes(product.id);

    return matchesCategory &&
      matchesSearch &&
      matchesPrice &&
      matchesFavorites;
  });

  if (sortMode === "priceAsc") {
    list.sort((a, b) => a.price - b.price);
  } else if (sortMode === "priceDesc") {
    list.sort((a, b) => b.price - a.price);
  } else if (sortMode === "name") {
    list.sort((a, b) => a.name.localeCompare(b.name, "fr"));
  }

  document.getElementById("resultsCount").textContent =
    `${list.length} set${list.length > 1 ? "s" : ""} disponible${list.length > 1 ? "s" : ""}`;

  if (list.length === 0) {
    grid.innerHTML = `
      <div class="empty-results">
        <h3>🔍 Aucun produit trouvé</h3>
        <p>Essaie une autre recherche ou modifie les filtres.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = list.map(product => {
    const isFavorite = favorites.includes(product.id);

    return `
      <article class="product-card">
        <div class="product-image">
          ${product.badge ? `
            <span class="product-badge">${product.badge}</span>
          ` : ""}

          <button class="favorite ${isFavorite ? "active" : ""}"
            data-favorite="${product.id}"
            aria-label="${isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}"
            aria-pressed="${isFavorite}">
            ${isFavorite ? "♥" : "♡"}
          </button>

          <img src="${imageUrl(product.reference)}"
            alt="Boîte du set ${product.name}"
            loading="lazy"
            onerror="this.onerror=null;this.src='${fallbackImage}'">
        </div>

        <div class="product-info">
          <span class="product-category">${product.category}</span>
          <h3>${product.name}</h3>

          <div class="product-meta">
            🧩 ${product.pieces.toLocaleString("fr-FR")} pièces
            · ${product.age}
            <br>
            Réf. ${product.reference}
          </div>

          <div class="product-bottom">
            <span class="product-price">${euro(product.price)}</span>
            <button class="add-btn" data-add="${product.id}">
              + Ajouter
            </button>
          </div>
        </div>
      </article>
    `;
  }).join("");
}

// ======================================
// PANIER
// ======================================

function saveCart() {
  localStorage.setItem("brickstore_cart", JSON.stringify(cart));
}

function addToCart(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;

  cart[id] = Math.min((Number(cart[id]) || 0) + 1, 99);

  saveCart();
  updateCart();
  showToast(`🧱 ${product.name} ajouté au panier !`);
}

function changeQuantity(id, amount) {
  if (!cart[id]) return;

  cart[id] = Math.max(0, Math.min(99, Number(cart[id]) + amount));

  if (cart[id] === 0) {
    delete cart[id];
  }

  saveCart();
  updateCart();
}

function removeFromCart(id) {
  delete cart[id];
  saveCart();
  updateCart();
  showToast("Produit retiré du panier");
}

function updateCart() {
  const entries = Object.entries(cart).filter(([id, qty]) =>
    products.some(p => p.id === Number(id)) &&
    Number.isInteger(Number(qty)) &&
    Number(qty) > 0
  );

  const count = entries.reduce((sum, [, qty]) => sum + Number(qty), 0);

  const total = entries.reduce((sum, [id, qty]) => {
    const product = products.find(p => p.id === Number(id));
    return sum + product.price * Number(qty);
  }, 0);

  document.getElementById("cartCount").textContent = count;
  document.getElementById("cartTotal").textContent = euro(total);

  document.getElementById("checkoutBtn").disabled = count === 0;
  document.getElementById("clearCartBtn").disabled = count === 0;

  if (entries.length === 0) {
    cartItems.innerHTML = `
      <div class="empty-results">
        <h3>🛒 Ton panier est vide</h3>
        <p>Ajoute des sets pour commencer !</p>
      </div>
    `;
    return;
  }

  cartItems.innerHTML = entries.map(([id, qty]) => {
    const product = products.find(p => p.id === Number(id));

    return `
      <div class="cart-item">
        <img src="${imageUrl(product.reference)}"
          alt="${product.name}"
          onerror="this.onerror=null;this.src='${fallbackImage}'">

        <div class="cart-item-details">
          <h4>${product.name}</h4>
          <strong>${euro(product.price * Number(qty))}</strong>

          <div class="quantity-controls">
            <button data-decrease="${id}" aria-label="Diminuer">−</button>
            <span>${qty}</span>
            <button data-increase="${id}" aria-label="Augmenter">+</button>
            <button class="remove-btn" data-remove="${id}">
              Supprimer
            </button>
          </div>
        </div>
      </div>
    `;
  }).join("");
}

function openCart() {
  cartPanel.classList.add("open");
  overlay.classList.add("show");
  cartPanel.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  document.getElementById("closeCart").focus();
}

function closeCart() {
  cartPanel.classList.remove("open");
  overlay.classList.remove("show");
  cartPanel.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  document.getElementById("cartBtn").focus();
}

// ======================================
// FAVORIS
// ======================================

function toggleFavorite(id) {
  if (favorites.includes(id)) {
    favorites = favorites.filter(value => value !== id);
    showToast("Retiré des favoris");
  } else {
    favorites.push(id);
    showToast("❤️ Ajouté aux favoris");
  }

  localStorage.setItem("brickstore_favorites", JSON.stringify(favorites));
  updateFavorites();
  renderProducts();
}

function updateFavorites() {
  document.getElementById("favoritesCount").textContent =
    favorites.length;
}

document.getElementById("favoritesBtn").addEventListener("click", () => {
  showFavoritesOnly = !showFavoritesOnly;

  document.getElementById("favoritesBtn").style.color =
    showFavoritesOnly ? "#e32636" : "";

  renderProducts();
  document.getElementById("catalogue").scrollIntoView();
});

// ======================================
// RECHERCHE ET FILTRES
// ======================================

document.getElementById("searchForm").addEventListener("submit", event => {
  event.preventDefault();
  document.getElementById("catalogue").scrollIntoView();
});

searchInput.addEventListener("input", event => {
  searchTerm = event.target.value.trim();
  renderProducts();
});

function setCategory(category) {
  currentCategory = category;
  categorySelect.value = category;

  document.querySelectorAll(".nav-link").forEach(button => {
    button.classList.toggle(
      "active",
      button.dataset.category === category
    );
  });

  renderProducts();
}

document.getElementById("navCategories").addEventListener("click", event => {
  const button = event.target.closest("[data-category]");
  if (!button) return;

  setCategory(button.dataset.category);
  document.getElementById("catalogue").scrollIntoView();
});

categorySelect.addEventListener("change", event => {
  setCategory(event.target.value);
});

priceRange.addEventListener("input", event => {
  maxPrice = Number(event.target.value);
  priceValue.textContent = euro(maxPrice);
  renderProducts();
});

sortSelect.addEventListener("change", event => {
  sortMode = event.target.value;
  renderProducts();
});

document.getElementById("resetBtn").addEventListener("click", () => {
  searchTerm = "";
  maxPrice = 500;
  sortMode = "default";
  showFavoritesOnly = false;

  searchInput.value = "";
  priceRange.value = "500";
  priceValue.textContent = euro(500);
  sortSelect.value = "default";
  document.getElementById("favoritesBtn").style.color = "";

  setCategory("Tous");
});

// ======================================
// GESTION DES CLICS
// ======================================

grid.addEventListener("click", event => {
  const addButton = event.target.closest("[data-add]");
  const favoriteButton = event.target.closest("[data-favorite]");

  if (addButton) {
    addToCart(Number(addButton.dataset.add));
  }

  if (favoriteButton) {
    toggleFavorite(Number(favoriteButton.dataset.favorite));
  }
});

cartItems.addEventListener("click", event => {
  const decrease = event.target.closest("[data-decrease]");
  const increase = event.target.closest("[data-increase]");
  const remove = event.target.closest("[data-remove]");

  if (decrease) {
    changeQuantity(Number(decrease.dataset.decrease), -1);
  }

  if (increase) {
    changeQuantity(Number(increase.dataset.increase), 1);
  }

  if (remove) {
    removeFromCart(Number(remove.dataset.remove));
  }
});

document.getElementById("cartBtn").addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);

document.addEventListener("keydown", event => {
  if (event.key === "Escape" && cartPanel.classList.contains("open")) {
    closeCart();
  }
});

// ======================================
// SIMULATION DE COMMANDE
// ======================================

document.getElementById("checkoutBtn").addEventListener("click", () => {
  if (Object.keys(cart).length === 0) return;

  const orderNumber = "BS-" + Date.now().toString().slice(-8);

  cart = {};
  saveCart();
  updateCart();
  closeCart();

  showToast(`✅ Commande fictive ${orderNumber} validée !`);
});

document.getElementById("clearCartBtn").addEventListener("click", () => {
  cart = {};
  saveCart();
  updateCart();
  showToast("Panier vidé");
});

// ======================================
// NOTIFICATIONS
// ======================================

function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("show");

  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

// ======================================
// DEMARRAGE
// ======================================

renderProducts();
updateCart();
updateFavorites();

console.log("🧱 BrickStore est prêt !");

