/* =================================
   MAIN JS - LE VELOURS (DEMO)
   ================================= */

document.addEventListener("DOMContentLoaded", function () {

  initAddToCart();
  initNavbarProfile();
  initAvatar();
  protectProfilePage();
  loadProfile();

});

/* =================================
   ADD TO CART (DEMO)
================================= */
function initAddToCart() {
  document.addEventListener("click", function (e) {
    if (e.target && e.target.id === "addCart") {
      alert("Produk ditambahkan ke keranjang (demo).");
    }
  });
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
