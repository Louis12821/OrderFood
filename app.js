/* 好食點餐 — 前端邏輯 */
(function () {
  "use strict";

  const STORAGE_KEY = "orderfood_cart";
  // cart: { [dishId]: quantity }
  let cart = loadCart();

  // ---- DOM 參照 ----
  const menuGrid = document.getElementById("menuGrid");
  const categoryTabs = document.getElementById("categoryTabs");
  const cartCount = document.getElementById("cartCount");
  const cartItems = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");
  const cartPanel = document.getElementById("cartPanel");
  const cartOverlay = document.getElementById("cartOverlay");
  const checkoutModal = document.getElementById("checkoutModal");
  const modalTotal = document.getElementById("modalTotal");
  const toast = document.getElementById("toast");

  let activeCategory = "全部";

  // ---- 初始化 ----
  renderTabs();
  renderMenu();
  renderCart();

  // ---- 事件綁定 ----
  document.getElementById("cartToggle").addEventListener("click", openCart);
  document.getElementById("cartClose").addEventListener("click", closeCart);
  cartOverlay.addEventListener("click", closeCart);
  document.getElementById("checkoutBtn").addEventListener("click", openCheckout);
  document.getElementById("checkoutCancel").addEventListener("click", closeCheckout);
  document.getElementById("checkoutForm").addEventListener("submit", submitOrder);

  // ---- 菜單分類 ----
  function getCategories() {
    const set = new Set(MENU.map((d) => d.category));
    return ["全部", ...set];
  }

  function renderTabs() {
    categoryTabs.innerHTML = "";
    getCategories().forEach((cat) => {
      const btn = document.createElement("button");
      btn.className = "tab" + (cat === activeCategory ? " active" : "");
      btn.textContent = cat;
      btn.addEventListener("click", () => {
        activeCategory = cat;
        renderTabs();
        renderMenu();
      });
      categoryTabs.appendChild(btn);
    });
  }

  function renderMenu() {
    const dishes = activeCategory === "全部"
      ? MENU
      : MENU.filter((d) => d.category === activeCategory);

    menuGrid.innerHTML = "";
    dishes.forEach((d) => {
      const card = document.createElement("div");
      card.className = "dish-card";
      card.innerHTML = `
        <div class="dish-img">${d.emoji}</div>
        <div class="dish-body">
          <div class="dish-name">${escapeHtml(d.name)}</div>
          <div class="dish-desc">${escapeHtml(d.desc)}</div>
          <div class="dish-foot">
            <span class="dish-price">$${d.price}</span>
            <button class="add-btn" aria-label="加入購物車">+</button>
          </div>
        </div>`;
      card.querySelector(".add-btn").addEventListener("click", () => addToCart(d.id));
      menuGrid.appendChild(card);
    });
  }

  // ---- 購物車操作 ----
  function addToCart(id) {
    cart[id] = (cart[id] || 0) + 1;
    saveCart();
    renderCart();
    const dish = MENU.find((d) => d.id === id);
    showToast(`已加入「${dish.name}」`);
  }

  function changeQty(id, delta) {
    cart[id] = (cart[id] || 0) + delta;
    if (cart[id] <= 0) delete cart[id];
    saveCart();
    renderCart();
  }

  function cartEntries() {
    return Object.keys(cart).map((id) => {
      const dish = MENU.find((d) => d.id === Number(id));
      return { dish, qty: cart[id] };
    }).filter((e) => e.dish);
  }

  function cartTotalAmount() {
    return cartEntries().reduce((sum, e) => sum + e.dish.price * e.qty, 0);
  }

  function totalQty() {
    return Object.values(cart).reduce((a, b) => a + b, 0);
  }

  function renderCart() {
    const entries = cartEntries();
    cartCount.textContent = totalQty();

    if (entries.length === 0) {
      cartItems.innerHTML = '<p class="cart-empty">購物車是空的，快去挑些美食吧！</p>';
    } else {
      cartItems.innerHTML = "";
      entries.forEach((e) => {
        const row = document.createElement("div");
        row.className = "cart-item";
        row.innerHTML = `
          <span class="cart-item-emoji">${e.dish.emoji}</span>
          <div class="cart-item-info">
            <div class="cart-item-name">${escapeHtml(e.dish.name)}</div>
            <div class="cart-item-price">$${e.dish.price} × ${e.qty} = $${e.dish.price * e.qty}</div>
          </div>
          <div class="qty-controls">
            <button class="qty-btn" data-act="dec">−</button>
            <span>${e.qty}</span>
            <button class="qty-btn" data-act="inc">+</button>
          </div>`;
        row.querySelector('[data-act="dec"]').addEventListener("click", () => changeQty(e.dish.id, -1));
        row.querySelector('[data-act="inc"]').addEventListener("click", () => changeQty(e.dish.id, 1));
        cartItems.appendChild(row);
      });
    }

    const total = cartTotalAmount();
    cartTotal.textContent = `$${total}`;
    modalTotal.textContent = `$${total}`;
  }

  // ---- 面板 / 對話框 ----
  function openCart() { cartPanel.classList.add("open"); cartOverlay.classList.add("open"); }
  function closeCart() { cartPanel.classList.remove("open"); cartOverlay.classList.remove("open"); }

  function openCheckout() {
    if (totalQty() === 0) { showToast("購物車是空的喔！"); return; }
    checkoutModal.classList.add("open");
  }
  function closeCheckout() { checkoutModal.classList.remove("open"); }

  function submitOrder(e) {
    e.preventDefault();
    const data = new FormData(e.target);
    const name = data.get("name");
    // 此處僅做前端示範；實際應送往後端 API
    cart = {};
    saveCart();
    renderCart();
    closeCheckout();
    closeCart();
    e.target.reset();
    showToast(`${name}，您的訂單已送出，感謝您的訂購！`);
  }

  // ---- 工具 ----
  function loadCart() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
    catch (_) { return {}; }
  }
  function saveCart() { localStorage.setItem(STORAGE_KEY, JSON.stringify(cart)); }

  let toastTimer;
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));
  }
})();
