/* =================================
   MAIN JS - LE VELOURS (DEMO)
   ================================= */

document.addEventListener("DOMContentLoaded", function () {

  initAddToCart();
  initNavbarProfile();
  initAvatar();
  protectProfilePage();
  loadProfile();
  loadProductDetail();
  loadOrderHistory();

});

/* =================================
   ADD TO CART
================================= */
function initAddToCart() {
  document.addEventListener("click", function (e) {
    if (e.target && e.target.id === "addCart") {
      addToCart(); 
    }
  });
}

function addToCart() {
  const data = localStorage.getItem("selectedProduct");
  if (!data) return;

  const product = JSON.parse(data);

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  cart.push(product);

  localStorage.setItem("cart", JSON.stringify(cart));

  showCartPopup();
}

function showCartPopup() {
  document.getElementById("cartPopup")?.classList.add("active");
}

function closePopup() {
  document.getElementById("cartPopup")?.classList.remove("active");
}

/* =================================
   NAVBAR PROFILE BUTTON
================================= */
function initNavbarProfile() {
  const btn = document.getElementById("profileBtn");
  if (!btn) return;

  btn.addEventListener("click", function (e) {
    e.preventDefault();
    const isLogin = localStorage.getItem("isLogin");
    window.location.href =
      isLogin === "true" ? "profile.html" : "login.html";
  });
}

/* =================================
   NAVBAR AVATAR
================================= */
function initAvatar() {
  const navAvatar = document.getElementById("navAvatar");
  const avatar = localStorage.getItem("avatar");

  if (navAvatar && avatar) {
    navAvatar.src = avatar;
  }
}

/* =================================
   PROTECT PROFILE PAGE
================================= */
function protectProfilePage() {
  if (window.location.pathname.includes("profile.html")) {
    if (localStorage.getItem("isLogin") !== "true") {
      window.location.href = "login.html";
    }
  }
}

/* =================================
   LOGIN
================================= */
function login() {
  const email = document.getElementById("loginEmail")?.value;
  const password = document.getElementById("loginPassword")?.value;

  if (!email || !password) {
    alert("Email dan password wajib diisi");
    return;
  }

  const regEmail = localStorage.getItem("regEmail");
  const regPassword = localStorage.getItem("regPassword");

  // BELUM REGISTER
  if (!regEmail || !regPassword) {
    alert("Akun belum terdaftar. Silakan register terlebih dahulu.");
    window.location.href = "register.html";
    return;
  }

  // SALAH EMAIL / PASSWORD
  if (email !== regEmail || password !== regPassword) {
    alert("Email atau password salah");
    return;
  }

  // LOGIN BERHASIL
  localStorage.setItem("isLogin", "true");
  localStorage.setItem("email", regEmail);
  localStorage.setItem("name", localStorage.getItem("regName"));

  window.location.href = "profile.html";
}

/* =================================
   REGISTER
================================= */
function register() {
  const name = document.getElementById("regName")?.value;
  const email = document.getElementById("regEmail")?.value;
  const password = document.getElementById("regPassword")?.value;

  if (!name || !email || !password) {
    alert("Semua field wajib diisi");
    return;
  }

  localStorage.setItem("regName", name);
  localStorage.setItem("regEmail", email);
  localStorage.setItem("regPassword", password);

  alert("Registrasi berhasil. Silakan login ✨");
  window.location.href = "login.html";
}

/* =================================
   LOAD PROFILE DATA
================================= */
function loadProfile() {
  const nameEl = document.getElementById("profileName");
  const emailEl = document.getElementById("profileEmail");
  const profileImg = document.getElementById("profileImg");

  const name = localStorage.getItem("name");
  const email = localStorage.getItem("email");
  const avatar = localStorage.getItem("avatar");

  if (nameEl && name) nameEl.textContent = name;
  if (emailEl && email) emailEl.textContent = email;
  if (profileImg && avatar) profileImg.src = avatar;
}

/* =================================
   SAVE PROFILE
================================= */
function saveProfile() {
  const nameInput = document.getElementById("nameInput");
  const emailInput = document.getElementById("emailInput");

  if (nameInput?.value) localStorage.setItem("name", nameInput.value);
  if (emailInput?.value) localStorage.setItem("email", emailInput.value);

  alert("Profil berhasil diperbarui ✨");
  loadProfile();
  initAvatar();
}

/* =================================
   CHANGE PROFILE PHOTO
================================= */
function changePhoto(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function () {
    localStorage.setItem("avatar", reader.result);
    loadProfile();
    initAvatar();
  };
  reader.readAsDataURL(file);
}

/* =================================
   LOGOUT
================================= */
function logout() {
  localStorage.removeItem("isLogin");
  window.location.href = "login.html";
}

/* =================================
   FILTER BRAND (PILL MENU)
================================= */
function filterBrand(brand, el) {
  const products = document.querySelectorAll(".product");
  const pills = document.querySelectorAll(".pill");

  // ganti pill aktif
  pills.forEach(p => p.classList.remove("active"));
  el.classList.add("active");

  // filter produk
  products.forEach(product => {
    const productBrand = product.dataset.brand;

    if (brand === "all" || productBrand === brand) {
      product.style.display = "block";
    } else {
      product.style.display = "none";
    }
  });
}


/* =================================
   SELECT PRODUCT (FROM CATALOG)
================================= */
function selectProduct(name, brand, price, image, desc) {
  const product = {
    name,
    brand,
    price,
    image,
    desc
  };

  localStorage.setItem("selectedProduct", JSON.stringify(product));
}


/* =================================
   LOAD PRODUCT DETAIL
================================= */
function loadProductDetail() {
  const data = localStorage.getItem("selectedProduct");
  if (!data) return;

  const product = JSON.parse(data);

  const nameEl = document.getElementById("productName");
  const brandEl = document.getElementById("productBrand");
  const priceEl = document.getElementById("productPrice");
  const imgEl = document.getElementById("productImage");
  const descEl = document.getElementById("productDesc");

  if (nameEl) nameEl.textContent = product.name;
  if (brandEl) brandEl.textContent = product.brand;
  if (priceEl) priceEl.textContent = product.price;
  if (imgEl) imgEl.src = product.image;
  if (descEl) descEl.textContent = product.desc;
}

function renderCart() {
  const cartItemsEl = document.getElementById("cartItems");
  const cartFooter = document.getElementById("cartFooter");
  const cartTotalEl = document.getElementById("cartTotal");

  if (!cartItemsEl) return;

  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  cartItemsEl.innerHTML = "";

  if (cart.length === 0) {
    cartItemsEl.innerHTML =
      `<p class="empty-cart">Keranjang kosong. Tambahkan produk dari katalog.</p>`;
    cartFooter.style.display = "none";
    return;
  }

  let total = 0;

  cart.forEach((item, index) => {
    total += item.price;

    cartItemsEl.innerHTML += `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}">
        <div>
          <h5>${item.name}</h5>
          <p class="price">Rp ${item.price.toLocaleString()}</p>
        </div>
        <button class="remove-btn" onclick="removeFromCart(${index})">Hapus</button>
      </div>
    `;
  });

  cartTotalEl.textContent = "Rp " + total.toLocaleString();
  cartFooter.style.display = "block";
}

function removeFromCart(index) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

/* auto jalan saat halaman cart dibuka */
document.addEventListener("DOMContentLoaded", renderCart);

const checkoutForm = document.getElementById("checkoutForm");

if (checkoutForm) {
  checkoutForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length === 0) return;

    const order = {
      id: "ORD-" + Date.now(),
      date: new Date().toLocaleDateString("id-ID"),
      items: cart,
      status: "Diproses",
      total: cart.length + " item"
    };

    let history = JSON.parse(localStorage.getItem("orderHistory")) || [];
    history.push(order);

    localStorage.setItem("orderHistory", JSON.stringify(history));
    localStorage.removeItem("cart");

    alert("🎉 Pesanan berhasil! Terima kasih sudah berbelanja.");
    window.location.href = "order-history.html";
  });
}


const showBtn = document.getElementById("showEmailForm");
const closeBtn = document.getElementById("closeForm");
const form = document.getElementById("contactForm");

if (showBtn && form) {
  showBtn.addEventListener("click", () => {
    form.classList.remove("hidden");
    form.scrollIntoView({ behavior: "smooth" });
  });
}

if (closeBtn && form) {
  closeBtn.addEventListener("click", () => {
    form.classList.add("hidden");
  });
}

if (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    alert("Terima kasih, Pesan kamu sudah kami terima.");
    form.reset();
    form.classList.add("hidden");
  });
}

function loadOrderHistory() {
  const container = document.getElementById("orderList");
  if (!container) return;

  const orders = JSON.parse(localStorage.getItem("orderHistory")) || [];

  if (orders.length === 0) {
    container.innerHTML = `<p class="text-muted">Belum ada pesanan.</p>`;
    return;
  }

  container.innerHTML = "";

  orders.reverse().forEach(order => {
    const div = document.createElement("div");
    div.className = "order-card";

    div.innerHTML = `
      <div class="order-header">
        <strong>${order.id}</strong>
        <span>${order.date}</span>
      </div>

      <ul class="order-items">
        ${order.items.map(item => `
          <li>${item.name} - ${item.price}</li>
        `).join("")}
      </ul>

      <div class="order-footer">
        <span>Status: <b>${order.status}</b></span>
        <span>Total: <b>${order.total}</b></span>
      </div>
    `;

    container.appendChild(div);
  });
}
