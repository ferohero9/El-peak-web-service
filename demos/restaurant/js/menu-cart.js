/* ==============================================================
   Al-Noor Kitchen — menu + cart (demo template by El-Peak)

   IMPORTANT: this is a DEMO. Nothing here opens WhatsApp or any
   messaging service. "Place Order via WhatsApp" only shows an
   in-drawer preview of the message a real site would send.
   ============================================================== */
(function () {
  'use strict';

  /* --------------------------------------------------------------
     ✏️ EDIT YOUR MENU HERE — id, name, desc, price (EGP), category,
     img (demo assets folder) and imgAlt. Rendered into the matching
     [data-menu-list] container in index.html.
     -------------------------------------------------------------- */
  var MENU = [
    // Appetizers
    { id: 'hummus',     name: 'Creamy Hummus',        desc: 'Silky chickpea purée whipped with tahini, lemon and our own olive oil, served with warm flatbread.',            price: 85,  category: 'appetizers', img: 'assets/r-hummus.jpg',     imgAlt: 'Bowl of creamy hummus swirled with olive oil and topped with chickpeas and parsley' },
    { id: 'falafel',    name: 'Crispy Falafel',       desc: 'Golden chickpea-and-herb fritters — crisp outside, fluffy inside — with a sesame tahini dip.',                  price: 70,  category: 'appetizers', img: 'assets/r-falafel.jpg',    imgAlt: 'Plate of golden crispy falafel balls with tahini dipping sauce and fresh herbs' },
    { id: 'fattoush',   name: 'Fattoush Salad',       desc: 'Crunchy romaine, tomato and radish tossed with sumac, fresh mint and toasted pita chips.',                      price: 90,  category: 'appetizers', img: 'assets/r-fattoush.jpg',   imgAlt: 'Fresh fattoush salad with romaine, tomatoes, radish and crisp pita chips' },
    { id: 'vineleaves', name: 'Stuffed Vine Leaves',  desc: 'Hand-rolled vine leaves filled with herbed rice, slow-cooked with lemon and olive oil until glossy.',           price: 80,  category: 'appetizers', img: 'assets/r-vineleaves.jpg', imgAlt: 'Rolls of stuffed vine leaves arranged in a circle with lemon wedges' },
    // Main Courses
    { id: 'shawarma',   name: 'Chicken Shawarma Wrap', desc: 'Marinated chicken carved straight off the spit, wrapped with garlic sauce, pickles and fries.',                price: 120, category: 'mains',      img: 'assets/r-shawarma.jpg',   imgAlt: 'Chicken shawarma wrap sliced open showing garlic sauce, pickles and fries' },
    { id: 'kebab',      name: 'Lamb Kebab Plate',     desc: 'Charcoal-grilled minced lamb kebabs with grilled tomato, onion salad and saffron rice.',                        price: 175, category: 'mains',      img: 'assets/r-kebab.jpg',      imgAlt: 'Charcoal-grilled lamb kebab skewers served over saffron rice with grilled tomato' },
    { id: 'mixedgrill', name: 'Mixed Grill Feast',    desc: 'A sharing platter of shish tawook, lamb kebab and kofta with house mezze and fresh bread — feeds two.',         price: 260, category: 'mains',      img: 'assets/r-mixedgrill.jpg', imgAlt: 'Large mixed grill platter with chicken tawook, lamb kebab and kofta skewers' },
    { id: 'mandi',      name: 'Lamb Mandi',           desc: 'Slow-roasted lamb over smoky basmati rice with toasted almonds, raisins and house mandi spices.',               price: 210, category: 'mains',      img: 'assets/r-mandi.jpg',      imgAlt: 'Fall-apart roasted lamb served on a bed of smoky mandi rice with almonds' },
    // Desserts
    { id: 'baklava',    name: 'Pistachio Baklava',    desc: 'Layered filo pastry filled with crushed pistachios and finished with a light orange-blossom syrup.',            price: 60,  category: 'desserts',   img: 'assets/r-baklava.jpg',    imgAlt: 'Diamond pieces of pistachio baklava stacked on a small plate' },
    { id: 'kunafa',     name: 'Cheese Kunafa',        desc: 'Warm, stretchy cheese under shredded golden pastry with rose syrup and crushed pistachio.',                     price: 70,  category: 'desserts',   img: 'assets/r-kunafa.jpg',     imgAlt: 'Round golden cheese kunafa topped with crushed pistachios and syrup' },
    // Beverages
    { id: 'minttea',    name: 'Fresh Mint Tea',       desc: 'Pot of green tea packed with fresh mint leaves, poured high and served hot.',                                   price: 35,  category: 'beverages',  img: 'assets/r-minttea.jpg',    imgAlt: 'Glass pot of fresh mint tea with green mint leaves steeping inside' },
    { id: 'lemonade',   name: 'Mint Lemonade',        desc: 'Hand-blended whole lemons whizzed with fresh mint and crushed ice — the Levantine classic.',                    price: 45,  category: 'beverages',  img: 'assets/r-lemonade.jpg',   imgAlt: 'Tall frothy glass of mint lemonade garnished with a mint sprig' }
  ];

  var CATEGORY_LABELS = {
    appetizers: 'Appetizers',
    mains: 'Main Courses',
    desserts: 'Desserts',
    beverages: 'Beverages'
  };

  var STORAGE_KEY = 'alnoor-cart';
  var MAX_QTY = 99;

  /* DOM handles */
  var els = {
    banner: document.getElementById('demoBanner'),
    catBar: document.getElementById('catBar'),
    chips: Array.prototype.slice.call(document.querySelectorAll('.chip[data-target]')),
    sections: Array.prototype.slice.call(document.querySelectorAll('.menu-section')),
    fab: document.getElementById('cartFab'),
    fabCount: document.getElementById('fabCount'),
    fabSubtotal: document.getElementById('fabSubtotal'),
    overlay: document.getElementById('cartOverlay'),
    drawer: document.getElementById('cartDrawer'),
    drawerClose: document.getElementById('drawerClose'),
    confirmClose: document.getElementById('confirmClose'),
    cartView: document.getElementById('cartView'),
    confirmView: document.getElementById('confirmView'),
    cartLines: document.getElementById('cartLines'),
    cartCountLabel: document.getElementById('cartCountLabel'),
    subtotalAmt: document.getElementById('subtotalAmt'),
    custName: document.getElementById('custName'),
    custPhone: document.getElementById('custPhone'),
    phoneErr: document.getElementById('phoneErr'),
    placeHint: document.getElementById('placeHint'),
    placeBtn: document.getElementById('placeOrderBtn'),
    clearBtn: document.getElementById('clearCartBtn'),
    confirmTitle: document.getElementById('confirmTitle'),
    orderMsg: document.getElementById('orderMsg'),
    backToMenuBtn: document.getElementById('backToMenuBtn'),
    newOrderBtn: document.getElementById('newOrderBtn'),
    specialsChip: document.getElementById('specialsChip'),
    cartStatus: document.getElementById('cartStatus'),
    toast: document.getElementById('toast'),
    year: document.getElementById('year')
  };

  /** @type {Map<string, number>} cart item id → quantity */
  var cart = new Map();

  var reduceMotion = window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : { matches: false };

  var lastFocused = null;
  var toastTimer = null;
  var bumpTimer = null;

  /* ==============================================================
     Helpers
     ============================================================== */

  /**
   * Format a number as Egyptian pounds ("EGP 1,250").
   * @param {number} n
   * @returns {string}
   */
  function money(n) {
    return 'EGP ' + Number(n).toLocaleString('en-EG');
  }

  /**
   * Look up a menu item by id.
   * @param {string} id
   * @returns {Object|null}
   */
  function getItem(id) {
    for (var i = 0; i < MENU.length; i++) {
      if (MENU[i].id === id) return MENU[i];
    }
    return null;
  }

  /**
   * Escape a string for safe interpolation into innerHTML.
   * @param {string} s
   * @returns {string}
   */
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
    });
  }

  /**
   * Show a short toast message (bottom-centre, aria-live polite).
   * @param {string} message
   * @returns {void}
   */
  function showToast(message) {
    if (!els.toast) return;
    els.toast.textContent = message;
    els.toast.classList.add('is-visible');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      els.toast.classList.remove('is-visible');
    }, 2400);
  }

  /**
   * Announce a cart update to screen readers via the live region.
   * @param {string} message
   * @returns {void}
   */
  function announce(message) {
    if (els.cartStatus) els.cartStatus.textContent = message;
  }

  /* ==============================================================
     Persistence (localStorage wrapped in try/catch)
     ============================================================== */

  /**
   * Load the cart from localStorage, ignoring anything invalid.
   * @returns {void}
   */
  function loadCart() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      var parsed = JSON.parse(raw);
      var key;
      for (key in parsed) {
        if (Object.prototype.hasOwnProperty.call(parsed, key)) {
          var qty = parseInt(parsed[key], 10);
          if (getItem(key) && qty > 0) {
            cart.set(key, Math.min(qty, MAX_QTY));
          }
        }
      }
    } catch (err) {
      /* storage unavailable or corrupt — start with an empty cart */
      cart.clear();
    }
  }

  /**
   * Persist the cart to localStorage (silently ignored on failure).
   * @returns {void}
   */
  function saveCart() {
    try {
      var obj = {};
      cart.forEach(function (qty, id) { obj[id] = qty; });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
    } catch (err) {
      /* private mode / quota — cart simply won't persist */
    }
  }

  /* ==============================================================
     Menu rendering
     ============================================================== */

  /**
   * Build the HTML for a single menu item row card.
   * @param {Object} item - entry from MENU
   * @returns {string} HTML markup
   */
  function menuItemHTML(item) {
    return '' +
      '<article class="menu-item">' +
        '<img class="menu-item__photo" src="' + esc(item.img) + '" alt="' + esc(item.imgAlt) + '" width="140" height="140" loading="lazy">' +
        '<div class="menu-item__body">' +
          '<h3 class="menu-item__name">' + esc(item.name) + '</h3>' +
          '<p class="menu-item__desc">' + esc(item.desc) + '</p>' +
          '<div class="menu-item__foot">' +
            '<span class="menu-item__price">' + money(item.price) + '</span>' +
            '<button class="menu-item__add" type="button" data-add="' + esc(item.id) + '" aria-label="Add ' + esc(item.name) + ' to your order">' +
              '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" focusable="false">' +
                '<path d="M12 5v14M5 12h14"/>' +
              '</svg>' +
            '</button>' +
          '</div>' +
        '</div>' +
      '</article>';
  }

  /**
   * Render every menu section from the MENU array.
   * @returns {void}
   */
  function renderMenu() {
    var lists = document.querySelectorAll('[data-menu-list]');
    Array.prototype.forEach.call(lists, function (list) {
      var cat = list.getAttribute('data-menu-list');
      var html = '';
      MENU.forEach(function (item) {
        if (item.category === cat) html += menuItemHTML(item);
      });
      list.innerHTML = html;
    });
  }

  /* ==============================================================
     Cart state
     ============================================================== */

  /**
   * Total number of items (sum of quantities) in the cart.
   * @returns {number}
   */
  function cartCount() {
    var n = 0;
    cart.forEach(function (qty) { n += qty; });
    return n;
  }

  /**
   * Cart subtotal in dollars.
   * @returns {number}
   */
  function cartSubtotal() {
    var total = 0;
    cart.forEach(function (qty, id) {
      var item = getItem(id);
      if (item) total += item.price * qty;
    });
    return total;
  }

  /**
   * Add one unit of an item, then sync all cart UI.
   * @param {string} id
   * @returns {void}
   */
  function addToCart(id) {
    var item = getItem(id);
    if (!item) return;
    var next = Math.min((cart.get(id) || 0) + 1, MAX_QTY);
    cart.set(id, next);
    saveCart();
    renderCart();
    bumpFab();
    showToast('Added ' + item.name + ' to your order');
    announce(cart.size + ' kinds of dishes, ' + cartCount() + ' items, subtotal ' + money(cartSubtotal()));
    if (els.placeHint) els.placeHint.hidden = true;
  }

  /**
   * Set an exact quantity (0 removes the line).
   * @param {string} id
   * @param {number} qty
   * @returns {void}
   */
  function setQty(id, qty) {
    if (!getItem(id)) return;
    qty = Math.max(0, Math.min(qty, MAX_QTY));
    if (qty === 0) {
      cart.delete(id);
    } else {
      cart.set(id, qty);
    }
    saveCart();
    renderCart();
    announce('Order updated: ' + cartCount() + ' items, subtotal ' + money(cartSubtotal()));
  }

  /**
   * Remove a line entirely.
   * @param {string} id
   * @returns {void}
   */
  function removeItem(id) {
    var item = getItem(id);
    cart.delete(id);
    saveCart();
    renderCart();
    if (item) showToast(item.name + ' removed');
    announce('Order updated: ' + cartCount() + ' items, subtotal ' + money(cartSubtotal()));
  }

  /**
   * Empty the cart.
   * @returns {void}
   */
  function clearCart() {
    cart.clear();
    saveCart();
    renderCart();
    showToast('Order cleared');
    announce('Order cleared');
  }

  /* ==============================================================
     Cart rendering (drawer, line items, badges)
     ============================================================== */

  /**
   * Build the HTML for one cart line item.
   * @param {string} id
   * @param {number} qty
   * @returns {string} HTML markup
   */
  function cartLineHTML(id, qty) {
    var item = getItem(id);
    if (!item) return '';
    return '' +
      '<li class="cart-line" data-id="' + esc(id) + '">' +
        '<img class="cart-line__thumb" src="' + esc(item.img) + '" alt="' + esc(item.imgAlt) + '" width="56" height="56" loading="lazy">' +
        '<p class="cart-line__name">' + esc(item.name) + '</p>' +
        '<button class="cart-line__remove" type="button" data-action="remove" aria-label="Remove ' + esc(item.name) + ' from your order">' +
          '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" focusable="false">' +
            '<path d="M6 6l12 12M18 6L6 18"/>' +
          '</svg>' +
        '</button>' +
        '<div class="cart-line__controls">' +
          '<span class="qty" role="group" aria-label="Quantity of ' + esc(item.name) + '">' +
            '<button class="qty__btn" type="button" data-action="dec" aria-label="Decrease quantity of ' + esc(item.name) + '">' +
              '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" focusable="false"><path d="M5 12h14"/></svg>' +
            '</button>' +
            '<span class="qty__num" aria-hidden="true">' + qty + '</span>' +
            '<button class="qty__btn" type="button" data-action="inc" aria-label="Increase quantity of ' + esc(item.name) + '">' +
              '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" focusable="false"><path d="M12 5v14M5 12h14"/></svg>' +
            '</button>' +
          '</span>' +
          '<span class="cart-line__total">' + money(item.price * qty) + '</span>' +
        '</div>' +
      '</li>';
  }

  /**
   * Re-render the drawer line items + every count/subtotal badge.
   * @returns {void}
   */
  function renderCart() {
    var count = cartCount();
    var subtotal = cartSubtotal();

    /* Drawer line items */
    if (els.cartLines) {
      if (count === 0) {
        els.cartLines.innerHTML =
          '<li class="cart-empty">' +
            '<svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' +
              '<path d="M6.4 8.6h11.2l-.9 10.1a1.9 1.9 0 0 1-1.9 1.7H9.2a1.9 1.9 0 0 1-1.9-1.7L6.4 8.6z"/>' +
              '<path d="M9.1 8.6V7.2a2.9 2.9 0 0 1 5.8 0v1.4"/>' +
            '</svg>' +
            '<strong>Your order is empty</strong>' +
            'Add something delicious from the menu.' +
          '</li>';
      } else {
        var html = '';
        cart.forEach(function (qty, id) { html += cartLineHTML(id, qty); });
        els.cartLines.innerHTML = html;
      }
    }

    /* Drawer subtotal + count label */
    if (els.subtotalAmt) els.subtotalAmt.textContent = money(subtotal);
    if (els.cartCountLabel) {
      els.cartCountLabel.textContent = count === 1 ? '1 item' : count + ' items';
    }

    /* Floating pill */
    if (els.fabCount) els.fabCount.textContent = String(count);
    if (els.fabSubtotal) els.fabSubtotal.textContent = money(subtotal);
    if (els.fab) {
      els.fab.setAttribute('aria-label', 'Open your order — ' + count + (count === 1 ? ' item, ' : ' items, ') + money(subtotal));
    }

    /* Empty cart hides any stale "place order" hint */
    if (count > 0 && els.placeHint) els.placeHint.hidden = true;
  }

  /**
   * Play the little bounce on the floating cart pill after an add.
   * @returns {void}
   */
  function bumpFab() {
    if (!els.fab || reduceMotion.matches) return;
    if (bumpTimer) clearTimeout(bumpTimer);
    els.fab.classList.remove('is-bumping');
    void els.fab.offsetWidth; /* restart the CSS animation */
    els.fab.classList.add('is-bumping');
    bumpTimer = setTimeout(function () {
      els.fab.classList.remove('is-bumping');
    }, 550);
  }

  /* ==============================================================
     Drawer open / close (overlay, Escape, light focus trap)
     ============================================================== */

  /**
   * Open the cart drawer and move focus into it.
   * @returns {void}
   */
  function openDrawer() {
    if (!els.drawer) return;
    lastFocused = document.activeElement;
    showCartView();
    els.drawer.classList.add('is-open');
    els.drawer.setAttribute('aria-hidden', 'false');
    if (els.overlay) {
      els.overlay.classList.add('is-open');
      els.overlay.setAttribute('aria-hidden', 'false');
    }
    document.body.classList.add('no-scroll');
    els.drawer.focus();
  }

  /**
   * Close the cart drawer and restore focus to the trigger.
   * @returns {void}
   */
  function closeDrawer() {
    if (!els.drawer) return;
    els.drawer.classList.remove('is-open');
    els.drawer.setAttribute('aria-hidden', 'true');
    if (els.overlay) {
      els.overlay.classList.remove('is-open');
      els.overlay.setAttribute('aria-hidden', 'true');
    }
    document.body.classList.remove('no-scroll');
    if (lastFocused && typeof lastFocused.focus === 'function') {
      lastFocused.focus();
    }
    lastFocused = null;
  }

  /**
   * Switch the drawer back to the cart/details view.
   * @returns {void}
   */
  function showCartView() {
    if (els.confirmView) els.confirmView.hidden = true;
    if (els.cartView) els.cartView.hidden = false;
  }

  /**
   * Show the confirmation view inside the drawer.
   * @returns {void}
   */
  function showConfirmView() {
    if (els.cartView) els.cartView.hidden = true;
    if (els.confirmView) els.confirmView.hidden = false;
    if (els.drawer) els.drawer.scrollTop = 0;
  }

  /**
   * Light focus trap: keep Tab cycling inside the drawer while open.
   * @param {KeyboardEvent} e
   * @returns {void}
   */
  function trapFocus(e) {
    if (!els.drawer || !els.drawer.classList.contains('is-open')) return;
    var focusable = els.drawer.querySelectorAll(
      'button, input, [href], pre[tabindex="0"], [tabindex]:not([tabindex="-1"])'
    );
    var visible = Array.prototype.filter.call(focusable, function (el) {
      return el.offsetParent !== null;
    });
    if (visible.length === 0) return;
    var first = visible[0];
    var last = visible[visible.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  /* ==============================================================
     Order message (DEMO PREVIEW — never sent anywhere)
     ============================================================== */

  /**
   * Compose the plain-text order message exactly as the template
   * formats it. On a live El-Peak site this opens WhatsApp
   * pre-filled — in this demo it is only displayed.
   * @returns {string}
   */
  function composeOrderMessage() {
    var lines = ['Hello! I\'d like to place an order:'];
    cart.forEach(function (qty, id) {
      var item = getItem(id);
      if (item) lines.push('- ' + qty + 'x ' + item.name + ' (' + money(item.price) + ')');
    });
    lines.push('Total: ' + money(cartSubtotal()));
    var phone = els.custPhone ? els.custPhone.value.trim() : '';
    if (phone) lines.push('Phone: ' + phone);
    return lines.join('\n');
  }

  /**
   * Handle "Place Order via WhatsApp": validate, then show the
   * in-drawer confirmation preview. No real message is sent.
   * @returns {void}
   */
  function placeOrder() {
    if (cartCount() === 0) {
      if (els.placeHint) {
        els.placeHint.hidden = false;
        els.placeHint.setAttribute('tabindex', '-1');
        els.placeHint.focus();
      }
      showToast('Your order is empty');
      return;
    }

    /* Phone is optional — but if filled, it needs ≥7 digits */
    var phone = els.custPhone ? els.custPhone.value.trim() : '';
    var digits = phone.replace(/\D/g, '');
    if (phone && digits.length < 7) {
      if (els.phoneErr) els.phoneErr.hidden = false;
      if (els.custPhone) {
        els.custPhone.setAttribute('aria-invalid', 'true');
        els.custPhone.focus();
      }
      return;
    }
    if (els.phoneErr) els.phoneErr.hidden = true;
    if (els.custPhone) els.custPhone.removeAttribute('aria-invalid');

    /* Greeting uses the first name when provided */
    var name = els.custName ? els.custName.value.trim() : '';
    var firstName = name ? name.split(/\s+/)[0] : '';
    if (els.confirmTitle) {
      els.confirmTitle.textContent = firstName ? 'Shukran, ' + firstName + '!' : 'Shukran!';
    }
    if (els.orderMsg) els.orderMsg.textContent = composeOrderMessage();

    showConfirmView();
  }

  /**
   * "Start a new order": clear the cart and return to the menu.
   * @returns {void}
   */
  function startNewOrder() {
    clearCart();
    if (els.custName) els.custName.value = '';
    if (els.custPhone) els.custPhone.value = '';
    closeDrawer();
  }

  /* ==============================================================
     Category chips — smooth scroll + scrollspy
     ============================================================== */

  /**
   * Smooth-scroll to a menu section, honouring reduced motion.
   * @param {string} id - section id
   * @returns {void}
   */
  function scrollToSection(id) {
    var target = document.getElementById(id);
    if (!target) return;
    target.scrollIntoView({
      behavior: reduceMotion.matches ? 'auto' : 'smooth',
      block: 'start'
    });
  }

  /**
   * Highlight the chip that belongs to a section.
   * @param {string} id - section id
   * @returns {void}
   */
  function setActiveChip(id) {
    els.chips.forEach(function (chip) {
      var active = chip.getAttribute('data-target') === id;
      chip.classList.toggle('is-active', active);
      if (active) {
        chip.setAttribute('aria-current', 'true');
      } else {
        chip.removeAttribute('aria-current');
      }
    });
  }

  /**
   * Set up the IntersectionObserver scrollspy for menu sections.
   * @returns {void}
   */
  function initScrollSpy() {
    if (!('IntersectionObserver' in window) || els.sections.length === 0) return;
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          setActiveChip(entry.target.id);
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });
    els.sections.forEach(function (section) { spy.observe(section); });
  }

  /* ==============================================================
     Sticky offsets — keep the chip bar docked under the banner
     ============================================================== */

  /**
   * Measure the demo banner + chip bar and publish their heights
   * as CSS custom properties used for sticky positioning and
   * scroll-margin.
   * @returns {void}
   */
  function syncStickyOffsets() {
    if (!document.documentElement || !els.banner || !els.catBar) return;
    var root = document.documentElement.style;
    root.setProperty('--banner-h', els.banner.offsetHeight + 'px');
    root.setProperty('--bar-h', els.catBar.offsetHeight + 'px');
  }

  /* ==============================================================
     Event wiring
     ============================================================== */

  /**
   * Bind all delegated + direct event listeners.
   * @returns {void}
   */
  function bindEvents() {
    /* "Add" buttons (delegated — the menu is rendered dynamically) */
    document.addEventListener('click', function (e) {
      var addBtn = e.target.closest ? e.target.closest('[data-add]') : null;
      if (addBtn) {
        addToCart(addBtn.getAttribute('data-add'));
        return;
      }

      /* Qty steppers + remove inside cart lines */
      var actionBtn = e.target.closest ? e.target.closest('[data-action]') : null;
      if (actionBtn) {
        var line = actionBtn.closest('.cart-line');
        if (line) {
          var id = line.getAttribute('data-id');
          var action = actionBtn.getAttribute('data-action');
          var qty = cart.get(id) || 0;
          if (action === 'inc') setQty(id, qty + 1);
          if (action === 'dec') setQty(id, qty - 1);
          if (action === 'remove') removeItem(id);
        }
      }
    });

    /* Category chips: smooth scroll + immediate active state */
    els.chips.forEach(function (chip) {
      chip.addEventListener('click', function (e) {
        e.preventDefault();
        var id = chip.getAttribute('data-target');
        setActiveChip(id);
        scrollToSection(id);
      });
    });

    /* Floating pill opens the drawer */
    if (els.fab) els.fab.addEventListener('click', openDrawer);

    /* Close affordances */
    if (els.drawerClose) els.drawerClose.addEventListener('click', closeDrawer);
    if (els.confirmClose) els.confirmClose.addEventListener('click', closeDrawer);
    if (els.overlay) els.overlay.addEventListener('click', closeDrawer);

    /* Escape closes; Tab is trapped while open */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && els.drawer && els.drawer.classList.contains('is-open')) {
        closeDrawer();
      }
      if (e.key === 'Tab') trapFocus(e);
    });

    /* Drawer actions */
    if (els.placeBtn) els.placeBtn.addEventListener('click', placeOrder);
    if (els.clearBtn) els.clearBtn.addEventListener('click', clearCart);
    if (els.backToMenuBtn) els.backToMenuBtn.addEventListener('click', closeDrawer);
    if (els.newOrderBtn) els.newOrderBtn.addEventListener('click', startNewOrder);

    /* Clear the phone error as soon as the field is corrected */
    if (els.custPhone) {
      els.custPhone.addEventListener('input', function () {
        if (els.phoneErr) els.phoneErr.hidden = true;
        els.custPhone.removeAttribute('aria-invalid');
      });
    }

    /* Specials chip — demo only, no messaging backend */
    if (els.specialsChip) {
      els.specialsChip.addEventListener('click', function () {
        showToast('Demo preview — ask your waiter on the real site!');
      });
    }

    /* Keep sticky offsets correct on resize */
    var resizeTimer = null;
    window.addEventListener('resize', function () {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(syncStickyOffsets, 150);
    });
  }

  /* ==============================================================
     Init
     ============================================================== */

  /**
   * Boot the page: render menu, restore cart, wire events.
   * @returns {void}
   */
  function init() {
    renderMenu();
    loadCart();
    renderCart();
    bindEvents();
    initScrollSpy();
    syncStickyOffsets();

    /* Re-measure once the hero image has a layout impact */
    window.addEventListener('load', syncStickyOffsets);

    if (els.year) els.year.textContent = String(new Date().getFullYear());
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
