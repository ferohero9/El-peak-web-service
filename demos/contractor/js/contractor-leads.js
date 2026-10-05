/*!
 * Bunyan Contracting — demo lead handling
 * Part of the El-Peak demo template collection.
 *
 * DEMO ONLY: nothing on this page sends a real WhatsApp message.
 * The only live WhatsApp integration in the El-Peak portfolio
 * lives on the main agency page (../../index.html).
 *
 * Vanilla JS. No dependencies. Runs deferred after DOM parse.
 */
'use strict';

(function () {

  /* ============================================================
     ✏️ EDIT SERVICES HERE — rendered into the #services grid.
     Keep titles short (uppercase via CSS); descriptions to ~2 lines.
     ============================================================ */
  var SERVICES = [
    {
      title: 'New Builds',
      description: 'A sample service card for ground-up residential and commercial construction. Replace with your actual scope and credentials.'
    },
    {
      title: 'Renovations & Remodels',
      description: 'A sample service card for home and unit renovations, ready to be tailored to your team’s process.'
    },
    {
      title: 'Kitchen & Bathroom Fit-Outs',
      description: 'A sample service card for tiling, plumbing, joinery and lighting work.'
    },
    {
      title: 'Office Fit-Outs',
      description: 'A sample service card for partitions, flooring, MEP and joinery for workplaces.'
    },
    {
      title: 'Landscaping & Exteriors',
      description: 'A sample service card for gardens, pergolas, façades and external finishes.'
    },
    {
      title: 'Maintenance Contracts',
      description: 'A sample service card for recurring maintenance plans and repair requests.'
    }
  ];

  /* ============================================================
     Constants + module state
     ============================================================ */

  /** Toast auto-hide delay in ms. @const {number} */
  var TOAST_MS = 4000;

  /** Minimum number of digits a plausible phone number needs. @const {number} */
  var MIN_PHONE_DIGITS = 7;

  /** Field configs for the lead form: id, error element id, validator, message. @const {Array} */
  var LEAD_FIELDS = [
    {
      id: 'leadName',
      errorId: 'leadNameError',
      message: 'Please tell us your name.',
      validate: function (value) { return value.trim().length > 0; }
    },
    {
      id: 'leadPhone',
      errorId: 'leadPhoneError',
      message: 'Please enter a phone number with at least ' + MIN_PHONE_DIGITS + ' digits.',
      validate: function (value) { return countDigits(value) >= MIN_PHONE_DIGITS; }
    },
    {
      id: 'leadType',
      errorId: 'leadTypeError',
      message: 'Please choose a project type.',
      validate: function (value) { return value !== ''; }
    },
    {
      id: 'leadBudget',
      errorId: 'leadBudgetError',
      message: 'Please choose a budget range.',
      validate: function (value) { return value !== ''; }
    }
  ];

  /** Handle returned by setTimeout for the toast auto-hide. @type {?number} */
  var toastTimer = null;

  /* ============================================================
     Services grid
     ============================================================ */

  /**
   * Render the SERVICES array into #servicesGrid as numbered cards.
   * Each card gets a zero-padded mono index (01–06) and a reveal class.
   * @returns {void}
   */
  function renderServices() {
    var grid = document.getElementById('servicesGrid');
    if (!grid) { return; }

    grid.textContent = ''; // clear the no-JS fallback text node if any

    SERVICES.forEach(function (service, index) {
      var card = document.createElement('article');
      card.className = 'service-card reveal';

      var num = document.createElement('p');
      num.className = 'service-index mono';
      num.setAttribute('aria-hidden', 'true');
      num.textContent = pad2(index + 1);

      var title = document.createElement('h3');
      title.textContent = service.title;

      var desc = document.createElement('p');
      desc.className = 'service-desc';
      desc.textContent = service.description;

      card.appendChild(num);
      card.appendChild(title);
      card.appendChild(desc);
      grid.appendChild(card);
    });
  }

  /**
   * Zero-pad a number to two digits ("1" -> "01").
   * @param {number} n - Positive integer below 100.
   * @returns {string} Two-digit string.
   */
  function pad2(n) {
    return (n < 10 ? '0' : '') + String(n);
  }

  /* ============================================================
     Header: scrolled state + mobile navigation
     ============================================================ */

  /**
   * Add .is-scrolled to the header once the page scrolls past 8px,
   * giving it a solid background and shadow.
   * @returns {void}
   */
  function initHeaderScroll() {
    var header = document.getElementById('siteHeader');
    if (!header) { return; }

    var update = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
  }

  /**
   * Wire the mobile hamburger: toggles .nav-open on the header,
   * keeps aria-expanded / aria-label in sync, closes on Escape
   * (restoring focus to the toggle) and on nav link activation.
   * @returns {void}
   */
  function initMobileNav() {
    var header = document.getElementById('siteHeader');
    var toggle = document.getElementById('navToggle');
    var nav = document.getElementById('primaryNav');
    if (!header || !toggle || !nav) { return; }

    var isOpen = function () {
      return header.classList.contains('nav-open');
    };

    var setOpen = function (open) {
      header.classList.toggle('nav-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
    };

    toggle.addEventListener('click', function () {
      setOpen(!isOpen());
    });

    nav.addEventListener('click', function (event) {
      if (event.target && typeof event.target.closest === 'function' && event.target.closest('a')) {
        setOpen(false);
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && isOpen()) {
        setOpen(false);
        toggle.focus();
      }
    });

    // Reset the drawer state when the viewport grows into desktop
    var mql = window.matchMedia('(min-width: 768px)');
    var onChange = function (mq) {
      if (mq.matches) { setOpen(false); }
    };
    if (typeof mql.addEventListener === 'function') {
      mql.addEventListener('change', onChange);
    } else if (typeof mql.addListener === 'function') {
      mql.addListener(onChange); // older Safari
    }
  }

  /* ============================================================
     Toast
     ============================================================ */

  /**
   * Show a transient toast message in the aria-live="polite" region.
   * Safe to call repeatedly — any pending hide timer is reset.
   * @param {string} message - Text to announce.
   * @returns {void}
   */
  function showToast(message) {
    var toast = document.getElementById('toast');
    if (!toast) { return; }

    toast.textContent = message;
    toast.classList.add('is-visible');

    if (toastTimer !== null) {
      window.clearTimeout(toastTimer);
    }
    toastTimer = window.setTimeout(function () {
      toast.classList.remove('is-visible');
      toastTimer = null;
    }, TOAST_MS);
  }

  /* ============================================================
     Lead form (DEMO — submits nowhere)
     ============================================================ */

  /**
   * Count digit characters in a string (ignores spaces, +, dashes…).
   * @param {string} value - Raw phone input.
   * @returns {number} Number of digits.
   */
  function countDigits(value) {
    return String(value).replace(/\D/g, '').length;
  }

  /**
   * Show an inline error for one field: unhide the role="alert"
   * paragraph, set its text, mark the input aria-invalid.
   * @param {{id: string, errorId: string, message: string}} field - Field config.
   * @returns {void}
   */
  function setFieldError(field) {
    var input = document.getElementById(field.id);
    var error = document.getElementById(field.errorId);
    if (!input || !error) { return; }

    error.textContent = field.message;
    error.hidden = false;
    input.classList.add('is-invalid');
    input.setAttribute('aria-invalid', 'true');
  }

  /**
   * Clear the inline error state for one field.
   * @param {{id: string, errorId: string}} field - Field config.
   * @returns {void}
   */
  function clearFieldError(field) {
    var input = document.getElementById(field.id);
    var error = document.getElementById(field.errorId);
    if (!input || !error) { return; }

    error.textContent = '';
    error.hidden = true;
    input.classList.remove('is-invalid');
    input.removeAttribute('aria-invalid');
  }

  /**
   * Clear every configured field error at once.
   * @returns {void}
   */
  function clearAllErrors() {
    LEAD_FIELDS.forEach(clearFieldError);
  }

  /**
   * Validate the lead form. On the first invalid field, show its
   * inline error and return null so the caller can focus it.
   * @param {HTMLFormElement} form - The lead form element.
   * @returns {?{name: string, phone: string, type: string, budget: string}} Data, or null when invalid.
   */
  function validateLeadForm(form) {
    var data = {};
    var firstInvalid = null;

    LEAD_FIELDS.forEach(function (field) {
      var input = document.getElementById(field.id);
      var value = input ? input.value : '';
      var valid = input ? field.validate(value) : true;

      if (valid) {
        clearFieldError(field);
        data[field.id.replace('lead', '').toLowerCase()] = value.trim();
      } else {
        setFieldError(field);
        if (!firstInvalid) { firstInvalid = input; }
      }
    });

    if (firstInvalid) {
      firstInvalid.focus();
      return null;
    }

    return data;
  }

  /**
   * Compose the demo lead summary shown in the success panel.
   * DEMO ONLY — this text is never transmitted anywhere and no
   * WhatsApp URL is ever built or opened by this template.
   * @param {{name: string, phone: string, type: string, budget: string, message: string}} data - Collected form data.
   * @returns {string} Multi-line message preview.
   */
  function buildLeadMessage(data) {
    var lines = [
      'NEW PROJECT REQUEST — BUNYAN CONTRACTING',
      '',
      'NAME: ' + data.name,
      'PHONE: ' + data.phone,
      'TYPE: ' + data.type,
      'BUDGET: ' + data.budget
    ];

    if (data.message) {
      lines.push('DETAILS: ' + data.message);
    }

    lines.push('', '(demo preview — nothing was sent)');
    return lines.join('\n');
  }

  /**
   * Handle a valid lead submit: swap the form for the success panel,
   * inject the composed message (via textContent — XSS-safe), move
   * focus to the panel and fire the demo toast.
   * @param {SubmitEvent} event - Submit event from the lead form.
   * @returns {void}
   */
  function handleLeadSubmit(event) {
    event.preventDefault();

    var form = event.currentTarget;
    var data = validateLeadForm(form);
    if (!data) { return; }

    data.message = (document.getElementById('leadMessage') || {}).value || '';
    data.message = data.message.trim();

    var preview = document.getElementById('leadPreview');
    if (preview) {
      preview.textContent = buildLeadMessage(data); // textContent: no HTML injection
    }

    var success = document.getElementById('formSuccess');
    if (success) {
      success.hidden = false;
      success.focus();
    }
    if (form) {
      form.hidden = true;
    }

    showToast("We'll be in touch — demo only");
  }

  /**
   * Return from the success panel to a clean, empty form.
   * @returns {void}
   */
  function resetToForm() {
    var success = document.getElementById('formSuccess');
    var form = document.getElementById('leadForm');

    if (success) { success.hidden = true; }
    if (form) {
      form.reset();
      form.hidden = false;
    }
    clearAllErrors();

    var name = document.getElementById('leadName');
    if (name) { name.focus(); }
  }

  /**
   * Initialise the lead form: submit handler, "submit another"
   * button, and live error-clearing as the user fixes fields.
   * @returns {void}
   */
  function initLeadForm() {
    var form = document.getElementById('leadForm');
    if (!form) { return; }

    form.addEventListener('submit', handleLeadSubmit);

    var resetButton = document.getElementById('resetFormBtn');
    if (resetButton) {
      resetButton.addEventListener('click', resetToForm);
    }

    LEAD_FIELDS.forEach(function (field) {
      var input = document.getElementById(field.id);
      if (!input) { return; }
      var clear = function () { clearFieldError(field); };
      input.addEventListener('input', clear);
      input.addEventListener('change', clear); // selects
    });
  }

  /* ============================================================
     Reveal-on-scroll
     ============================================================ */

  /**
   * Reveal .reveal elements as they enter the viewport.
   * Respects prefers-reduced-motion (everything shows instantly)
   * and falls back to "always visible" without IntersectionObserver.
   * @returns {void}
   */
  function initReveal() {
    var elements = document.querySelectorAll('.reveal');
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion || !('IntersectionObserver' in window)) {
      elements.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    elements.forEach(function (el) { observer.observe(el); });
  }

  /* ============================================================
     Footer year
     ============================================================ */

  /**
   * Keep the footer copyright year current.
   * @returns {void}
   */
  function initFooterYear() {
    var el = document.getElementById('footerYear');
    if (el) {
      el.textContent = String(new Date().getFullYear());
    }
  }

  /* ============================================================
     Init
     ============================================================ */

  /**
   * Boot the demo page. Order matters: services are rendered
   * before the reveal observer so the cards animate in too.
   * @returns {void}
   */
  function init() {
    renderServices();
    initHeaderScroll();
    initMobileNav();
    initLeadForm();
    initReveal();
    initFooterYear();
  }

  init();
})();
