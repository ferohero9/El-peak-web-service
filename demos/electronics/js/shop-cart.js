/* ==============================================================
   Nile Mobiles — catalog + cart (demo template by El-Peak)

   IMPORTANT: this is a DEMO. Nothing here opens WhatsApp or any
   messaging service. "Send order via WhatsApp" only shows an
   in-sheet preview of the message a real site would send.
   ============================================================== */
(function () {
  'use strict';

  /* --------------------------------------------------------------
     ✏️ EDIT YOUR PRODUCTS HERE — id, name, brand, cat (phones /
     tablets / accessories), price + old (EGP), specs chips, stock,
     badge ('deal' | 'new' | ''), img (demo assets folder), imgAlt.
     Rendered into #productGrid in index.html.
     -------------------------------------------------------------- */
  var PRODUCTS = [
    // Phones
    { id: 'orbi-x9',      name: 'Orbi X9 Pro',        brand: 'orbi',   cat: 'phones',      price: 32999, old: 34999, stock: true,  badge: 'deal', specs: ['6.7" AMOLED', '12/256GB', '5G'],        img: 'assets/e-phone-onyx.jpg',  imgAlt: 'Premium black flagship smartphone with triple camera on a light studio background' },
    { id: 'nova-air',     name: 'Nova Air 5G',        brand: 'nova',   cat: 'phones',      price: 18499, old: 0,     stock: true,  badge: '',     specs: ['6.5" OLED', '8/128GB', '5G'],           img: 'assets/e-phone-pearl.jpg', imgAlt: 'White pearl smartphone lying flat on a beige studio background' },
    { id: 'zenith-fold',  name: 'Zenith Fold',        brand: 'zenith', cat: 'phones',      price: 54999, old: 0,     stock: true,  badge: 'new',  specs: ['7.8" foldable', '16/512GB', '5G'],      img: 'assets/e-phone-fold.jpg',  imgAlt: 'Foldable smartphone half open standing on a dark desk' },
    { id: 'orbi-lite',    name: 'Orbi Lite 4G',       brand: 'orbi',   cat: 'phones',      price: 9999,  old: 0,     stock: false, badge: '',     specs: ['6.2" LCD', '4/64GB', '4G'],             img: 'assets/e-phone-aurora.jpg', imgAlt: 'Mid-range smartphone with a green-blue gradient back cover' },
    // Tablets
    { id: 'nova-tab',     name: 'Nova Tab 11',        brand: 'nova',   cat: 'tablets',     price: 21499, old: 0,     stock: true,  badge: '',     specs: ['11" 120Hz', '8/128GB', 'Stylus'],       img: 'assets/e-tablet.jpg',      imgAlt: 'Modern tablet with a stylus pen on a white desk' },
    { id: 'zenith-pad',   name: 'Zenith Pad Mini',    brand: 'zenith', cat: 'tablets',     price: 13999, old: 15499, stock: true,  badge: 'deal', specs: ['8.4" IPS', '6/128GB'],                  img: 'assets/e-pad-mini.jpg',    imgAlt: 'Compact tablet standing on a wooden desk showing a colorful wallpaper' },
    // Accessories
    { id: 'pulso-buds',   name: 'Pulso Buds 3',       brand: 'pulso',  cat: 'accessories', price: 2899,  old: 0,     stock: true,  badge: '',     specs: ['ANC', '32h battery', 'IPX5'],           img: 'assets/e-earbuds.jpg',     imgAlt: 'White wireless earbuds next to an open charging case' },
    { id: 'orbi-fit2',    name: 'Orbi Watch Fit 2',   brand: 'orbi',   cat: 'accessories', price: 5499,  old: 0,     stock: true,  badge: 'new',  specs: ['1.9" AMOLED', 'GPS', '14 days'],        img: 'assets/e-watch.jpg',       imgAlt: 'Black smartwatch with a bright fitness dashboard on screen' },
    { id: 'pulso-power',  name: 'Pulso Power 20K',    brand: 'pulso',  cat: 'accessories', price: 1750,  old: 0,     stock: true,  badge: '',     specs: ['20,000mAh', '22.5W', 'USB-C'],          img: 'assets/e-powerbank.jpg',   imgAlt: 'Slim black power bank with a USB-C cable on a gray surface' },
    { id: 'pulso-boom',   name: 'Pulso Boom Mini',    brand: 'pulso',  cat: 'accessories', price: 2199,  old: 2599,  stock: true,  badge: 'deal', specs: ['16W', 'IPX7', '24h battery'],           img: 'assets/e-speaker.jpg',     imgAlt: 'Portable Bluetooth speaker with dark fabric finish' }
  ];

  var CAT_LABELS = { phones: 'Phones', tablets: 'Tablets', accessories: 'Accessories' };
  var BRAND_LABELS = { orbi: 'Orbi', nova: 'Nova', zenith: 'Zenith', pulso: 'Pulso' };

  /* ---------- tiny DOM helpers ---------- */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  /** Escape user/data strings before inserting into innerHTML. */
  function esc(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /** Format a number as whole Egyptian pounds: "EGP 12,345". */
  function money(n) {
    return 'EGP ' + Number(n).toLocaleString('en-EG');
  }

  /* ==============================================================
     CATALOG RENDERING
     ============================================================== */
  var grid = $('#productGrid');
  var resultLine = $('#resultLine');
  var state = { q: '', cat: 'all', brand: 'all', sort: 'featured' };

  /** Build the HTML for one product card. */
  function productCard(p) {
    var badge = '';
    if (!p.stock) badge = '<span class="badge badge--out">Out of stock</span>';
    else if (p.badge === 'deal') badge = '<span class="badge badge--deal">Deal</span>';
    else if (p.badge === 'new') badge = '<span class="badge badge--new">New</span>';

    var specs = p.specs.map(function (s) { return '<span>' + esc(s) + '</span>'; }).join('');
    var oldPrice = p.old ? '<span class="price-old">' + esc(money(p.old)) + '</span>' : '';
    var action = p.stock
      ? '<button class="btn btn--lime" type="button" data-add="' + esc(p.id) + '" aria-label="Add ' + esc(p.name) + ' to cart">Add to cart</button>'
      : '<button class="btn btn--ghost" type="button" disabled>Out of stock</button>';

    return (
      '<article class="product' + (p.stock ? '' : ' is-out') + '">' +
        '<div class="product__media">' + badge +
          '<img src="' + esc(p.img) + '" alt="' + esc(p.imgAlt) + '" width="800" height="600" loading="lazy" decoding="async">' +
        '</div>' +
        '<div class="product__body">' +
          '<p class="product__brand">' + esc(BRAND_LABELS[p.brand] || p.brand) + ' · ' + esc(CAT_LABELS[p.cat] || p.cat) + '</p>' +
          '<h3 class="product__name">' + esc(p.name) + '</h3>' +
          '<div class="specs">' + specs + '</div>' +
          '<p class="price-row"><span class="price">' + esc(money(p.price)) + '</span>' + oldPrice + '</p>' +
          action +
        '</div>' +
      '</article>'
    );
  }

  /** Apply current filters/sort and re-render the grid. */
  function renderGrid() {
    var q = state.q.trim().toLowerCase();
    var list = PRODUCTS.filter(function (p) {
      if (state.cat !== 'all' && p.cat !== state.cat) return false;
      if (state.brand !== 'all' && p.brand !== state.brand) return false;
      if (q && (p.name + ' ' + p.brand + ' ' + p.specs.join(' ')).toLowerCase().indexOf(q) === -1) return false;
      return true;
    });

    if (state.sort === 'price-asc') list.sort(function (a, b) { return a.price - b.price; });
    else if (state.sort === 'price-desc') list.sort(function (a, b) { return b.price - a.price; });
    else if (state.sort === 'name') list.sort(function (a, b) { return a.name.localeCompare(b.name); });

    if (!list.length) {
      grid.innerHTML = '<p class="empty-note">Nothing matches "' + esc(state.q) + '" — try another search or clear the filters.</p>';
    } else {
      grid.innerHTML = list.map(productCard).join('');
    }

    var label = state.cat === 'all' ? 'products' : CAT_LABELS[state.cat].toLowerCase();
    resultLine.textContent = 'Showing ' + list.length + ' ' + label;
  }

  /** Wire up search, category chips, brand + sort selects. */
  function initFilters() {
    $('#searchInput').addEventListener('input', function (e) {
      state.q = e.target.value; renderGrid();
    });
    $('#brandSelect').addEventListener('change', function (e) {
      state.brand = e.target.value; renderGrid();
    });
    $('#sortSelect').addEventListener('change', function (e) {
      state.sort = e.target.value; renderGrid();
    });
    $all('.chip').forEach(function (chip) {
      chip.addEventListener('click', function () {
        $all('.chip').forEach(function (c) {
          c.classList.remove('is-active');
          c.setAttribute('aria-pressed', 'false');
        });
        chip.classList.add('is-active');
        chip.setAttribute('aria-pressed', 'true');
        state.cat = chip.getAttribute('data-cat');
        renderGrid();
      });
    });
  }

  /* ==============================================================
     CART
     ============================================================== */
  var cart = {}; // { productId: qty }
  var sheet = $('#cartSheet');
  var cartPill = $('#cartPill');
  var lastFocus = null;

  /** @returns {number} total item count in the cart. */
  function cartCount() {
    return Object.keys(cart).reduce(function (sum, id) { return sum + cart[id]; }, 0);
  }

  /** @returns {number} cart subtotal in EGP. */
  function cartTotal() {
    return Object.keys(cart).reduce(function (sum, id) {
      var p = PRODUCTS.find(function (x) { return x.id === id; });
      return p ? sum + p.price * cart[id] : sum;
    }, 0);
  }

  /** Sync the header pill + total row after any cart change. */
  function syncCartBadge() {
    $('#cartCount').textContent = String(cartCount());
    var total = cartTotal();
    $('#cartTotal').textContent = money(total);
    $('#cartTotalRow').hidden = total === 0;
  }

  /** Render the cart item rows (or the empty state). */
  function renderCart() {
    var list = $('#cartList');
    var ids = Object.keys(cart);
    $('#cartEmpty').hidden = ids.length > 0;
    list.innerHTML = ids.map(function (id) {
      var p = PRODUCTS.find(function (x) { return x.id === id; });
      if (!p) return '';
      return (
        '<li class="cart-item">' +
          '<img src="' + esc(p.img) + '" alt="" width="56" height="56">' +
          '<div><p class="cart-item__name">' + esc(p.name) + '</p>' +
            '<p class="cart-item__unit">' + esc(money(p.price)) + ' each</p></div>' +
          '<div class="qty">' +
            '<button type="button" data-dec="' + esc(id) + '" aria-label="Decrease quantity of ' + esc(p.name) + '">−</button>' +
            '<output aria-label="Quantity of ' + esc(p.name) + '">' + cart[id] + '</output>' +
            '<button type="button" data-inc="' + esc(id) + '" aria-label="Increase quantity of ' + esc(p.name) + '">+</button>' +
          '</div>' +
          '<button type="button" class="cart-item__remove" data-remove="' + esc(id) + '">Remove</button>' +
        '</li>'
      );
    }).join('');
    syncCartBadge();
  }

  /** Add one unit of a product, show a toast, nudge the pill. */
  function addToCart(id) {
    cart[id] = (cart[id] || 0) + 1;
    renderCart();
    var p = PRODUCTS.find(function (x) { return x.id === id; });
    toast(p.name + ' added to cart');
  }

  /** Open the cart sheet and remember focus for restoration. */
  function openSheet() {
    lastFocus = document.activeElement;
    sheet.hidden = false;
    document.body.style.overflow = 'hidden';
    cartPill.setAttribute('aria-expanded', 'true');
    $('.sheet__close', sheet).focus();
  }

  /** Close the cart sheet and restore focus + scroll. */
  function closeSheet() {
    sheet.hidden = true;
    document.body.style.overflow = '';
    cartPill.setAttribute('aria-expanded', 'false');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  /* ==============================================================
     ORDER (DEMO ONLY — never opens WhatsApp)
     ============================================================== */

  /** Compose the WhatsApp message text a real site would send. */
  function composeMessage(name, phone, address, pay, notes) {
    var lines = ['Hello Nile Mobiles! I\'d like to place an order:', ''];
    Object.keys(cart).forEach(function (id) {
      var p = PRODUCTS.find(function (x) { return x.id === id; });
      lines.push('- ' + cart[id] + 'x ' + p.name + ' (' + money(p.price) + ')');
    });
    lines.push('');
    lines.push('Total: ' + money(cartTotal()));
    lines.push('Name: ' + name);
    lines.push('Phone: ' + phone);
    lines.push('Address: ' + address);
    lines.push('Payment: ' + pay);
    if (notes) lines.push('Notes: ' + notes);
    return lines.join('\n');
  }

  /** Validate the order form; @returns {string|null} first error. */
  function validateForm(name, phone, address) {
    if (!name.trim()) return 'Please tell us your name.';
    if (phone.replace(/\D/g, '').length < 7) return 'Please enter a valid phone number.';
    if (!address.trim()) return 'Please enter your delivery address (or write "store pickup").';
    return null;
  }

  /** Handle a valid submit: show the in-sheet order preview. */
  function handleOrderSubmit(e) {
    e.preventDefault();
    var name = $('#ofName').value;
    var phone = $('#ofPhone').value;
    var address = $('#ofAddress').value;
    var pay = $('#ofPay').value;
    var notes = $('#ofNotes').value;

    var err = validateForm(name, phone, address);
    var errBox = $('#formError');
    if (err) {
      errBox.textContent = err + ' (Demo — fill it in to see the preview.)';
      errBox.hidden = false;
      return;
    }
    errBox.hidden = true;

    $('#previewName').textContent = name.trim().split(' ')[0] || 'friend';
    $('#previewMsg').textContent = composeMessage(name.trim(), phone.trim(), address.trim(), pay, notes.trim());
    $('#cartStep').hidden = true;
    $('#previewStep').hidden = false;
    $('.sheet__panel').scrollTop = 0;
  }

  /** Reset back to the empty cart + form state. */
  function resetOrder() {
    cart = {};
    renderCart();
    $('#orderForm').reset();
    $('#cartStep').hidden = false;
    $('#previewStep').hidden = true;
    closeSheet();
    toast('Cart cleared — demo mode');
  }

  /* ==============================================================
     TOAST
     ============================================================== */
  var toastTimer = null;

  /** Show a short-lived polite toast message. */
  function toast(msg) {
    var el = $('#toast');
    el.textContent = msg;
    el.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.hidden = true; }, 2600);
  }

  /* ==============================================================
     WIRING
     ============================================================== */
  function init() {
    renderGrid();
    initFilters();
    renderCart();

    // Add-to-cart buttons (delegated — grid re-renders often)
    grid.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-add]');
      if (btn) addToCart(btn.getAttribute('data-add'));
    });

    // Cart item controls (delegated)
    $('#cartList').addEventListener('click', function (e) {
      var inc = e.target.closest('[data-inc]');
      var dec = e.target.closest('[data-dec]');
      var rem = e.target.closest('[data-remove]');
      if (inc) { cart[inc.getAttribute('data-inc')] += 1; renderCart(); }
      else if (dec) {
        var id = dec.getAttribute('data-dec');
        cart[id] -= 1;
        if (cart[id] <= 0) delete cart[id];
        renderCart();
      } else if (rem) { delete cart[rem.getAttribute('data-remove')]; renderCart(); }
    });

    cartPill.addEventListener('click', openSheet);
    $all('[data-sheet-close]').forEach(function (el) {
      el.addEventListener('click', closeSheet);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !sheet.hidden) closeSheet();
    });

    $('#orderForm').addEventListener('submit', handleOrderSubmit);
    $('#resetOrderBtn').addEventListener('click', resetOrder);

    // Visit-card WhatsApp button — demo only, shows a toast
    $('#waDemoBtn').addEventListener('click', function () {
      toast('Demo preview — no real WhatsApp message is sent');
    });

    // Footer year
    var yearEl = $('#year');
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());

    // Header shadow once the page scrolls
    var header = $('#shopHeader');
    window.addEventListener('scroll', function () {
      header.style.boxShadow = window.scrollY > 8 ? '0 4px 0 rgba(18,21,15,0.12)' : 'none';
    }, { passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
