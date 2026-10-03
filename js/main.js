/* ============================================================
   El-Peak — Main Agency Script
   Vanilla ES6+. No dependencies. cPanel-ready.
   Modules: theme, nav, scrollspy, filters, modal, reveal,
   WhatsApp link builder (REAL — main site only), contact form.
   ============================================================ */
'use strict';

(function () {
  document.documentElement.classList.add('js');

  /**
   * Real WhatsApp number (international format, digits only —
   * no "+", spaces or dashes).
   * This is the ONLY real WhatsApp integration; demo template
   * sites intentionally ship with dummy buttons.
   * @const {string}
   */
  var WHATSAPP_NUMBER = '201012464714';
  var DEFAULT_WA_MESSAGE = "Hi! I'm interested in a website for my business";

  /** Themed storage key for the light/dark preference. */
  var THEME_KEY = 'elpeak-theme';

  /* ----------------------------------------------------------
     Helper — tiny shorthand
     ---------------------------------------------------------- */
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  /* ----------------------------------------------------------
     1. THEME TOGGLE (light / dark, persisted)
     ---------------------------------------------------------- */
  function initTheme() {
    var toggle = $('#themeToggle');
    if (!toggle) return;

    function apply(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      toggle.setAttribute('aria-pressed', String(theme === 'dark'));
      try { localStorage.setItem(THEME_KEY, theme); } catch (e) { /* private mode */ }
    }

    apply(document.documentElement.getAttribute('data-theme') || 'light');

    toggle.addEventListener('click', function () {
      var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      apply(next);
    });
  }

  /* ----------------------------------------------------------
     2. MOBILE NAVIGATION
     ---------------------------------------------------------- */
  function initNav() {
    var header = $('#siteHeader');
    var toggle = $('#navToggle');
    var nav = $('#siteNav');
    if (!header || !toggle || !nav) return;

    function close() {
      header.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open navigation menu');
    }

    toggle.addEventListener('click', function () {
      var open = header.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
    });

    // Close when a nav link is chosen (mobile), on Escape, on outside click.
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && header.classList.contains('is-open')) {
        close();
        toggle.focus();
      }
    });
    document.addEventListener('click', function (e) {
      if (header.classList.contains('is-open') && !header.contains(e.target)) close();
    });

    // Subtle shadow once the page is scrolled.
    var onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ----------------------------------------------------------
     3. SCROLLSPY — highlight the nav pill of the visible section
     ---------------------------------------------------------- */
  function initScrollSpy() {
    var links = $$('.nav-link');
    if (!links.length || !('IntersectionObserver' in window)) return;

    var map = {};
    links.forEach(function (link) {
      var id = (link.getAttribute('href') || '').replace('#', '');
      if (id) map[id] = link;
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var link = map[entry.target.id];
        if (!link) return;
        if (entry.isIntersecting) {
          links.forEach(function (l) { l.classList.remove('is-active'); l.removeAttribute('aria-current'); });
          link.classList.add('is-active');
          link.setAttribute('aria-current', 'true');
        }
      });
    }, { rootMargin: '-38% 0px -55% 0px' });

    Object.keys(map).forEach(function (id) {
      var section = document.getElementById(id);
      if (section) observer.observe(section);
    });
  }

  /* ----------------------------------------------------------
     4. DEMO FILTER TABS
     ---------------------------------------------------------- */
  function initFilters() {
    var tabs = $$('.demo-tab');
    var cards = $$('#demoGrid .demo-card');
    if (!tabs.length || !cards.length) return;

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var filter = tab.getAttribute('data-filter');
        tabs.forEach(function (t) {
          var active = t === tab;
          t.classList.toggle('is-active', active);
          t.setAttribute('aria-selected', String(active));
        });
        cards.forEach(function (card) {
          var show = filter === 'all' || card.getAttribute('data-category') === filter;
          card.style.display = show ? '' : 'none';
        });
      });
    });
  }

  /* ----------------------------------------------------------
     5. DEMO PREVIEW MODAL (iframe)
     ---------------------------------------------------------- */
  function initModal() {
    var modal = $('#demoModal');
    var frame = $('#modalFrame');
    var title = $('#modalTitle');
    var openTab = $('#modalOpenTab');
    var loading = $('.modal-loading', modal);
    if (!modal || !frame) return;

    var lastFocus = null;

    function open(demoUrl, demoTitle) {
      if (demoUrl && !demoUrl.endsWith('.html') && !demoUrl.includes('#')) {
        demoUrl = demoUrl.replace(/\/?$/, '/index.html');
      }
      lastFocus = document.activeElement;
      title.textContent = demoTitle || 'Demo preview';
      openTab.href = demoUrl;
      loading.classList.add('is-loading');
      frame.src = demoUrl;
      modal.hidden = false;
      document.body.classList.add('modal-open');
      $('.modal-close', modal).focus();
    }

    function close() {
      modal.hidden = true;
      document.body.classList.remove('modal-open');
      frame.src = 'about:blank';
      loading.classList.remove('is-loading');
      if (lastFocus) lastFocus.focus();
    }

    frame.addEventListener('load', function () {
      loading.classList.remove('is-loading');
    });

    $$('[data-demo]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        open(btn.getAttribute('data-demo'), btn.getAttribute('data-demo-title'));
      });
    });

    $$('[data-modal-close]', modal).forEach(function (el) {
      el.addEventListener('click', close);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !modal.hidden) close();
    });
  }

  /* ----------------------------------------------------------
     6. SCROLL REVEAL + score ring animation
     ---------------------------------------------------------- */
  function initReveal() {
    var items = $$('.reveal');
    if (!items.length) return;

    if (!('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-visible'); });
      fillRing();
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        // The ring lives inside the revealed hero-side wrapper (or IS the card).
        if (entry.target.id === 'scoreCard' || entry.target.querySelector && entry.target.querySelector('#ringArc')) {
          fillRing();
        }
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.18 });

    items.forEach(function (el) { observer.observe(el); });

    /** Animates the uptime ring from 0% to 99.9%. */
    function fillRing() {
      var arc = $('#ringArc');
      if (!arc) return;
      // 2π × 30 ≈ 188.5; 99.9% leaves a hairline gap.
      requestAnimationFrame(function () {
        arc.style.strokeDashoffset = '0.19';
      });
    }
  }

  /* ----------------------------------------------------------
     7. WHATSAPP LINK BUILDER (REAL — this is the live site)
     Every [data-wa] anchor gets a fresh, encoded wa.me URL.
     ---------------------------------------------------------- */
  function initWhatsAppLinks() {
    $$('[data-wa]').forEach(function (link) {
      var message = link.getAttribute('data-wa-message') || DEFAULT_WA_MESSAGE;
      link.href = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(message);
      link.target = '_blank';
      link.rel = 'noopener';
    });
  }

  /* ----------------------------------------------------------
     8. CONTACT FORM → composes a WhatsApp message (no backend)
     ---------------------------------------------------------- */
  function initContactForm() {
    var form = $('#contactForm');
    if (!form) return;

    var hint = $('#cfHint');

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var name = $('#cfName').value.trim();
      var type = $('#cfType').value;
      var msg = $('#cfMsg').value.trim();

      if (!name || !msg) {
        hint.textContent = 'Please add your name and a short note about what you need.';
        hint.classList.add('is-error');
        (!name ? $('#cfName') : $('#cfMsg')).focus();
        return;
      }

      hint.classList.remove('is-error');
      hint.textContent = 'Opening WhatsApp with your message pre-filled…';

      var text =
        "Hi! I'm " + name + '.\n' +
        'Business type: ' + type + '\n\n' +
        msg;

      var url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(text);

      // window.open without features can return null in some browsers;
      // fall back to a programmatic anchor click.
      var win = null;
      try { win = window.open(url, '_blank'); } catch (err) { /* blocked */ }
      if (win) { win.opener = null; } else {
        var a = document.createElement('a');
        a.href = url;
        a.target = '_blank';
        a.rel = 'noopener';
        document.body.appendChild(a);
        a.click();
        a.remove();
      }
      form.reset();
    });
  }

  /* ----------------------------------------------------------
     9. FOOTER YEAR
     ---------------------------------------------------------- */
  function initYear() {
    var year = $('#year');
    if (year) year.textContent = String(new Date().getFullYear());
  }

  /* ----------------------------------------------------------
     Boot
     ---------------------------------------------------------- */
  function init() {
    initTheme();
    initNav();
    initScrollSpy();
    initFilters();
    initModal();
    initReveal();
    initWhatsAppLinks();
    initContactForm();
    initYear();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
