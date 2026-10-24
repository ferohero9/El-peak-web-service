/* ==========================================================================
   El-Peak Studio · main.js
   Shared by /index.html (English) and /ar/index.html (Arabic, RTL), and
   loaded (harmlessly, every init guards its markup) by the legal and 404
   pages for the footer year.

   Vanilla JavaScript, no dependencies. CSP-safe by construction:
   - no eval, no inline event handlers;
   - dynamic styling only via classes and CSSOM writes
     (element.style.x = value), never style="" attributes;
   - user input is always inserted with textContent, never innerHTML
     (innerHTML is used only for one constant, hardcoded SVG string).

   Every price on the site lives in PRICES.
   Every string the script generates lives in STR (en + ar), so the Arabic
   page composes Arabic WhatsApp messages, correctly URL-encoded.

   Modules: header state · scrollspy + sliding indicator · mobile sheet
   (focus trap, scroll lock, Escape) · reveal on scroll · demo filtering
   (FLIP / View Transitions) + quick previews · process line draw
   (IntersectionObserver fallback for scroll-driven CSS) · estimator ·
   brief form (chips, adaptive placeholder, auto-grow, live preview,
   popup-blocked fallback) · copy-to-clipboard with legacy fallback ·
   sticky mobile CTA bar · footer year.
   ========================================================================== */
(function () {
  'use strict';

  /* ------------------------------------------------------------------
     Config · single source of every price
  ------------------------------------------------------------------ */
  const PRICES = { build: 1500, hosting: 500, update: 400 };
  const WA_NUMBER = '201012464714';
  const MSG_MAX = 600;
  const LANG = ((document.documentElement.getAttribute('lang') || 'en').slice(0, 2) === 'ar') ? 'ar' : 'en';
  const RTL = (document.documentElement.getAttribute('dir') || 'ltr') === 'rtl';
  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ------------------------------------------------------------------
     Strings · everything the script writes, both languages.
     Static widget labels live in each page's <template> markup;
     only generated content and messages come from here.
  ------------------------------------------------------------------ */
  const STR = {
    en: {
      copied: 'Copied',
      panel: { openLabel: 'Open menu', closeLabel: 'Close menu' },
      qty: { plus: 'Increase quantity', minus: 'Decrease quantity' },
      filter: {
        status: function (n, total) { return 'Showing ' + n + ' of ' + total + ' demos.'; }
      },
      est: {
        yearOff: 'Not selected',
        msg: function (hosting, updates) {
          let m = "Hi! I'm planning a website for my business:\n- Complete website build · EGP 1,500 (one time)";
          if (hosting) { m += "\n- Hosting and domain · EGP 500 / year"; }
          if (updates > 0) { m += "\n- Content update requests · " + updates + " × EGP 400 (only when I ask for them)"; }
          return m;
        }
      },
      form: {
        errName: 'Please tell me your name.',
        errType: 'Choose the closest fit.',
        errMsg: 'Give me at least a sentence to work with.',
        opened: 'Opened in WhatsApp',
        ready: 'Message ready',
        sendLabel: 'Open in WhatsApp',
        blocked: 'WhatsApp did not open automatically. Use the button below.',
        ellipsis: '…',
        placeholders: {
          restaurant: 'Tell me about your menu, your prices and your opening hours.',
          store: 'Which products should the catalog show?',
          clinic: 'Which services and opening hours should the page list?',
          contractor: 'What kinds of projects should the page showcase?',
          other: 'What does your business need from a website?'
        },
        typeLabels: { restaurant: 'Restaurant', store: 'Shop or store', clinic: 'Clinic', contractor: 'Contractor', other: 'Something else' },
        msg: function (name, type, text) {
          return "Hi, I'm " + name + ".\nBusiness: " + type + "\n\n" + text;
        }
      },
    },

    ar: {
      copied: 'تم النسخ',
      panel: { openLabel: 'فتح القائمة', closeLabel: 'إغلاق القائمة' },
      qty: { plus: 'زيادة الكمية', minus: 'تقليل الكمية' },
      filter: {
        status: function (n, total) { return 'عرض ' + n + ' من ' + total + ' نماذج تجريبية.'; }
      },
      est: {
        yearOff: 'غير محددة',
        msg: function (hosting, updates) {
          let m = 'مرحبًا! أخطط لموقع إلكتروني لمشروعي:\n- موقع كامل · EGP 1,500 (دفعة واحدة)';
          if (hosting) { m += '\n- الاستضافة والدومين · EGP 500 سنويًا'; }
          if (updates > 0) { m += '\n- طلبات تحديث المحتوى · ' + updates + ' × EGP 400 (عند طلبها فقط)'; }
          return m;
        }
      },
      form: {
        errName: 'من فضلك اكتب اسمك.',
        errType: 'اختر الأقرب إلى نشاطك.',
        errMsg: 'اكتب جملة واحدة على الأقل حتى أفهم احتياجك.',
        opened: 'تم الفتح في واتساب',
        ready: 'الرسالة جاهزة',
        sendLabel: 'افتح في واتساب',
        blocked: 'لم يُفتح واتساب تلقائيًا. استخدم الزر في الأسفل.',
        ellipsis: '…',
        placeholders: {
          restaurant: 'حدّثني عن قائمة الطعام والأسعار ومواعيد العمل.',
          store: 'ما المنتجات التي سيعرضها الكتالوج؟',
          clinic: 'ما الخدمات ومواعيد العمل التي ستعرضها الصفحة؟',
          contractor: 'ما أنواع المشروعات التي ستعرضها الصفحة؟',
          other: 'ما الذي يحتاجه نشاطك من موقع إلكتروني؟'
        },
        typeLabels: { restaurant: 'مطعم', store: 'متجر', clinic: 'عيادة', contractor: 'مقاولات وتشطيبات', other: 'نشاط آخر' },
        msg: function (name, type, text) {
          return 'مرحبًا، أنا ' + name + '.\nنوع النشاط: ' + type + '\n\n' + text;
        }
      },
    }
  };
  const S = STR[LANG];

  /* ------------------------------------------------------------------
     Helpers
  ------------------------------------------------------------------ */
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function el(tag, cls, text) {
    const n = document.createElement(tag);
    if (cls) { n.className = cls; }
    if (text != null) { n.textContent = text; }
    return n;
  }
  /* Currency and numerals stay identical on both language versions
     (EGP with Western digits). */
  function fmt(n) { return 'EGP ' + n.toLocaleString('en-US'); }
  /* encodeURIComponent handles Arabic and emoji correctly in wa.me links. */
  function waLink(text) { return 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(text); }

  let liveRegion = null;
  let liveTimer = null;
  function announce(text) {
    if (!liveRegion) {
      liveRegion = el('p', 'sr-only');
      liveRegion.setAttribute('aria-live', 'polite');
      document.body.appendChild(liveRegion);
    }
    liveRegion.textContent = '';
    window.clearTimeout(liveTimer);
    liveTimer = window.setTimeout(function () { liveRegion.textContent = text; }, 80);
  }

  function legacyCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.top = '-1000px';
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch (err) { ok = false; }
    document.body.removeChild(ta);
    return ok;
  }
  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).catch(function () { return legacyCopy(text); });
    }
    return Promise.resolve(legacyCopy(text));
  }
  function flashCopied(btn) {
    btn.classList.add('is-copied');
    window.clearTimeout(btn._copyTimer);
    btn._copyTimer = window.setTimeout(function () { btn.classList.remove('is-copied'); }, 1600);
  }


  /* ------------------------------------------------------------------
     Header · stuck state
  ------------------------------------------------------------------ */
  function initHeader() {
    const header = $('#siteHeader');
    if (!header) { return; }
    let ticking = false;
    function update() { header.classList.toggle('is-stuck', (window.scrollY || 0) > 4); ticking = false; }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

  /* ------------------------------------------------------------------
     Scrollspy · aria-current on nav links, sliding clay indicator
  ------------------------------------------------------------------ */
  function initScrollspy() {
    const nav = $('#nav');
    if (!nav) { return; }
    const links = $$('.nav-link', nav);
    const ind = $('.nav-ind', nav);
    if (!links.length) { return; }

    function moveInd() {
      if (!ind) { return; }
      const cur = nav.querySelector('.nav-link[aria-current="true"]');
      if (!cur) { ind.classList.remove('is-on'); return; }
      ind.style.setProperty('--nx', cur.offsetLeft + 'px');
      ind.style.setProperty('--nw', String(cur.offsetWidth / 8));
      ind.classList.add('is-on');
    }
    function setActive(id) {
      links.forEach(function (a) {
        if (a.getAttribute('href') === '#' + id) { a.setAttribute('aria-current', 'true'); }
        else { a.removeAttribute('aria-current'); }
      });
      moveInd();
    }

    if ('IntersectionObserver' in window) {
      const spy = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) { setActive(e.target.id); } });
      }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });
      links.forEach(function (a) {
        const section = document.getElementById(a.getAttribute('href').slice(1));
        if (section) { spy.observe(section); }
      });
      const hero = $('.hero');
      if (hero) {
        const heroSpy = new IntersectionObserver(function (entries) {
          entries.forEach(function (e) { if (e.isIntersecting) { setActive('home'); } });
        }, { rootMargin: '-40% 0px -55% 0px' });
        heroSpy.observe(hero);
      }
    }
    window.addEventListener('resize', moveInd);
    if (document.fonts && document.fonts.ready) { document.fonts.ready.then(moveInd); }
  }

  /* ------------------------------------------------------------------
     Mobile sheet · focus trap, scroll lock without layout shift,
     Escape and scrim to close, closes on link tap
  ------------------------------------------------------------------ */
  const panelState = { open: false };
  function initPanel() {
    const toggle = $('#navToggle');
    const panel = $('#navPanel');
    const scrim = $('#navScrim');
    if (!toggle || !panel) { return; }

    function focusables() {
      return $$('a, button', panel).filter(function (n) { return !n.disabled && n.offsetParent !== null; });
    }
    function open() {
      panelState.open = true;
      /* compensate the scrollbar so locking does not shift the layout */
      document.documentElement.style.setProperty('--sbw',
        (window.innerWidth - document.documentElement.clientWidth) + 'px');
      document.documentElement.classList.add('is-locked');
      panel.classList.add('is-open');
      if (scrim) { scrim.classList.add('is-on'); }
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', S.panel.closeLabel);
      const f = focusables();
      if (f.length) { f[0].focus(); }
      updateCtabar();
    }
    function close(returnFocus) {
      panelState.open = false;
      document.documentElement.classList.remove('is-locked');
      panel.classList.remove('is-open');
      if (scrim) { scrim.classList.remove('is-on'); }
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', S.panel.openLabel);
      if (returnFocus !== false) { toggle.focus(); }
      updateCtabar();
    }

    toggle.addEventListener('click', function () { if (panelState.open) { close(); } else { open(); } });
    if (scrim) { scrim.addEventListener('click', function () { close(); }); }
    $$('a', panel).forEach(function (a) { a.addEventListener('click', function () { close(false); }); });

    document.addEventListener('keydown', function (e) {
      if (!panelState.open) { return; }
      if (e.key === 'Escape') { e.preventDefault(); close(); return; }
      if (e.key === 'Tab') {
        const f = focusables();
        if (!f.length) { return; }
        const first = f[0], last = f[f.length - 1];
        if (f.indexOf(document.activeElement) === -1) { e.preventDefault(); first.focus(); return; }
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    window.addEventListener('resize', function () {
      if (panelState.open && window.innerWidth >= 940) { close(false); }
    });
  }

  /* ------------------------------------------------------------------
     Reveal on scroll · one pass per element, four flavors (up, wipe,
     draw, settle). Without JS the CSS never hides anything.
  ------------------------------------------------------------------ */
  function initReveal() {
    const els = $$('[data-reveal]');
    if (!els.length) { return; }
    if (REDUCED.matches || !('IntersectionObserver' in window)) {
      els.forEach(function (n) { n.classList.add('is-in'); });
      return;
    }
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          const el = e.target.__revealEl || e.target;
          el.classList.add('is-in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.01, rootMargin: '0px 0px 80px 0px' });

    els.forEach(function (n) {
      const obsTarget = (n.getAttribute('data-reveal') === 'wipe' && n.closest('.demo-card'))
        ? n.closest('.demo-card')
        : n;
      obsTarget.__revealEl = n;
      io.observe(obsTarget);
    });
  }

  /* ------------------------------------------------------------------
     Demos · counts, filtering with View Transition or FLIP, aria-live
     status, empty state, quick-preview expanders with staggered specs
  ------------------------------------------------------------------ */
  function initDemos() {
    const track = $('#demosTrack');
    if (!track) { return; }
    const cards = $$('.demo-card', track);
    const chips = $$('.filter-set .chip');
    const status = $('#filterStatus');
    const emptyBox = $('#demoEmpty');
    const total = cards.length;

    const counts = { all: total };
    cards.forEach(function (c) {
      const s = c.getAttribute('data-sector');
      counts[s] = (counts[s] || 0) + 1;
    });
    $$('.filter-set .count').forEach(function (n) {
      const k = n.getAttribute('data-count');
      if (counts[k] != null) { n.textContent = String(counts[k]); }
    });

    function applyFilter(key) {
      let visible = 0;
      cards.forEach(function (c) {
        const show = key === 'all' || c.getAttribute('data-sector') === key;
        c.hidden = !show;
        if (show) {
          visible++;
          const media = $('.demo-media', c);
          if (media) { media.classList.add('is-in'); }
        }
      });
      if (emptyBox) { emptyBox.hidden = visible !== 0; }
      if (status) { status.textContent = S.filter.status(visible, total); }
    }
    /* FLIP: record positions, mutate, invert with transform, play. */
    function flip(mutate) {
      const firstRects = cards.map(function (c) { return c.getBoundingClientRect(); });
      mutate();
      cards.forEach(function (c, i) {
        if (c.hidden) { return; }
        const f = firstRects[i];
        const l = c.getBoundingClientRect();
        const dx = f.left - l.left, dy = f.top - l.top;
        if (!dx && !dy) { return; }
        c.style.transition = 'none';
        c.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
        window.requestAnimationFrame(function () {
          c.style.transition = 'transform 320ms cubic-bezier(.2,.7,.2,1)';
          c.style.transform = '';
        });
        c.addEventListener('transitionend', function clear() {
          c.removeEventListener('transitionend', clear);
          c.style.transition = '';
          c.style.transform = '';
        });
      });
    }
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        const key = chip.getAttribute('data-filter');
        chips.forEach(function (c) { c.setAttribute('aria-pressed', String(c === chip)); });
        const mutate = function () { applyFilter(key); };
        if (document.startViewTransition && !REDUCED.matches) { document.startViewTransition(mutate); }
        else if (!REDUCED.matches) { flip(mutate); }
        else { mutate(); }
      });
    });

    /* quick previews: build spec rows once from data-specs, stagger in */
    $$('.qp-btn').forEach(function (btn) {
      const card = btn.closest('.demo-card');
      const box = document.getElementById(btn.getAttribute('aria-controls'));
      if (!card || !box) { return; }
      const list = $('.demo-specs', box);
      let built = false;
      btn.addEventListener('click', function () {
        const open = card.classList.toggle('is-open');
        btn.setAttribute('aria-expanded', String(open));
        if (open && !built && list) {
          const specs = (card.getAttribute('data-specs') || '').split('|');
          specs.forEach(function (s, i) {
            const li = el('li', null, s.trim());
            li.style.setProperty('--i', String(i));
            list.appendChild(li);
          });
          built = true;
          window.requestAnimationFrame(function () {
            window.requestAnimationFrame(function () { list.classList.add('is-ready'); });
          });
        }
      });
    });
  }

  /* ------------------------------------------------------------------
     Process line · CSS scroll-driven animation where supported; this
     IntersectionObserver + scroll fallback covers the rest, and simply
     draws the line fully under reduced motion.
  ------------------------------------------------------------------ */
  function initSteps() {
    const steps = $('#processSteps');
    const draw = steps ? $('.steps-draw', steps) : null;
    if (!steps || !draw) { return; }
    const cssOwns = window.CSS && window.CSS.supports && window.CSS.supports('animation-timeline', 'view()');
    if (cssOwns) { return; }
    if (REDUCED.matches || !('IntersectionObserver' in window)) {
      draw.style.setProperty('--p', '1');
      return;
    }
    let ticking = false;
    function update() {
      ticking = false;
      const r = steps.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const start = vh * 0.85;
      const end = vh * 0.35 - r.height;
      const p = (start - r.top) / (start - end);
      draw.style.setProperty('--p', Math.max(0, Math.min(1, p)).toFixed(3));
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
    }, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  /* ------------------------------------------------------------------
     Estimator · due now is always the build only. Hosting is yearly,
     updates are charged only when requested. Never any other figure.
  ------------------------------------------------------------------ */
  function initEstimator() {
    const box = $('#estimator');
    if (!box) { return; }
    const hosting = $('#estHosting');
    const minus = $('#estMinus');
    const plus = $('#estPlus');
    const countEl = $('#estCount');
    const nowEl = $('#estNow');
    const yearEl = $('#estYear');
    const updEl = $('#estUpd');
    const send = $('#estSend');
    if (!hosting || !minus || !plus || !countEl || !send) { return; }
    let updates = 0;

    function render() {
      countEl.textContent = String(updates);
      minus.disabled = updates <= 0;
      plus.disabled = updates >= 6;
      if (nowEl) { nowEl.textContent = fmt(PRICES.build); }
      if (yearEl) { yearEl.textContent = hosting.checked ? fmt(PRICES.hosting) : S.est.yearOff; }
      if (updEl) { updEl.textContent = fmt(PRICES.update); }
      send.setAttribute('href', waLink(S.est.msg(hosting.checked, updates)));
    }
    minus.addEventListener('click', function () { updates = Math.max(0, updates - 1); render(); });
    plus.addEventListener('click', function () { updates = Math.min(6, updates + 1); render(); });
    hosting.addEventListener('change', render);
    render();
  }

  /* ------------------------------------------------------------------
     Brief form · quick chips, adaptive placeholder, auto-grow, counter,
     live preview, validation with polite error announcements, WhatsApp
     handoff with popup-blocked fallback, copy-message fallback.
     No-JS fallback: the form GETs wa.me with the raw message field.
  ------------------------------------------------------------------ */
  function initForm() {
    const form = $('#briefForm');
    if (!form) { return; }
    const nameF = $('#fName');
    const typeF = $('#fType');
    const msgF = $('#fMsg');
    const countEl = $('#msgCount');
    const preview = $('#msgPreview');
    const copyBtn = $('#copyMsg');
    const sendBtn = $('#formSend');
    const sendLabel = $('#formSendLabel');
    const fallback = $('#waFallback');
    const fallbackLink = $('#waFallbackLink');
    if (!nameF || !typeF || !msgF) { return; }

    function message(forPreview) {
      let n = nameF.value.trim();
      let t = typeF.value ? (S.form.typeLabels[typeF.value] || typeF.value) : '';
      let x = msgF.value.trim();
      if (forPreview) {
        if (!n) { n = S.form.ellipsis; }
        if (!t) { t = S.form.ellipsis; }
        if (!x) { x = S.form.ellipsis; }
      }
      return S.form.msg(n, t, x);
    }
    function fieldOf(input) { return input.closest('.field'); }
    function clearError(input) { const f = fieldOf(input); if (f) { f.classList.remove('has-error'); } }
    function grow() {
      msgF.style.height = 'auto';
      msgF.style.height = Math.min(msgF.scrollHeight, 320) + 'px';
    }
    function refresh() {
      if (countEl) { countEl.textContent = msgF.value.length + ' / ' + MSG_MAX; }
      if (preview) { preview.textContent = message(true); }
      if (sendBtn) { sendBtn.classList.remove('is-done'); }
      if (sendLabel) { sendLabel.textContent = S.form.sendLabel; }
    }

    $$('.qchip').forEach(function (chip) {
      chip.addEventListener('click', function () {
        let t = msgF.value;
        if (t && !/\s$/.test(t)) { t += ' '; }
        msgF.value = t + chip.getAttribute('data-insert');
        clearError(msgF);
        msgF.focus();
        grow();
        refresh();
      });
    });

    typeF.addEventListener('change', function () {
      msgF.placeholder = S.form.placeholders[typeF.value] || S.form.placeholders.other;
      clearError(typeF);
    });
    nameF.addEventListener('input', function () { clearError(nameF); refresh(); });
    msgF.addEventListener('input', function () { clearError(msgF); grow(); refresh(); });

    /* keep the focused field visible when the on-screen keyboard opens */
    [nameF, typeF, msgF].forEach(function (input) {
      input.addEventListener('focus', function () {
        window.setTimeout(function () {
          input.scrollIntoView({ block: 'center', behavior: REDUCED.matches ? 'auto' : 'smooth' });
        }, 250);
      });
    });

    /* errors appear on submit and clear on input; announce politely */
    $$('.err', form).forEach(function (e) { e.setAttribute('aria-live', 'polite'); });

    function validate() {
      let ok = true, firstBad = null;
      function check(input, bad) {
        const f = fieldOf(input);
        if (!f) { return; }
        if (bad) { f.classList.add('has-error'); ok = false; if (!firstBad) { firstBad = input; } }
        else { f.classList.remove('has-error'); }
      }
      check(nameF, !nameF.value.trim());
      check(typeF, !typeF.value);
      check(msgF, !msgF.value.trim());
      if (firstBad) { firstBad.focus(); }
      return ok;
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (fallback) { fallback.hidden = true; }
      if (!validate()) { return; }
      const url = waLink(message(false));
      let win = null;
      try { win = window.open(url, '_blank', 'noopener'); } catch (err) { win = null; }
      sendBtn.classList.add('is-done');
      if (win) {
        sendLabel.textContent = S.form.opened;
        announce(S.form.opened);
      } else {
        sendLabel.textContent = S.form.ready;
        if (fallback && fallbackLink) {
          fallbackLink.setAttribute('href', url);
          fallback.hidden = false;
          fallbackLink.focus();
        }
        announce(S.form.blocked);
      }
    });

    if (copyBtn) {
      const copyLabel = copyBtn.querySelector('span');
      const copyLabelOrig = copyLabel ? copyLabel.textContent : '';
      copyBtn.addEventListener('click', function () {
        copyText(message(true)).then(function () {
          if (copyLabel) { copyLabel.textContent = S.copied; }
          window.clearTimeout(copyBtn._copyTimer);
          copyBtn._copyTimer = window.setTimeout(function () {
            if (copyLabel) { copyLabel.textContent = copyLabelOrig; }
          }, 1600);
          announce(S.copied);
        });
      });
    }

    msgF.placeholder = S.form.placeholders.other;
    grow();
    refresh();
  }

  /* ------------------------------------------------------------------
     Copy buttons (contact rows) · clipboard with legacy fallback
  ------------------------------------------------------------------ */
  function initCopyButtons() {
    $$('.copy-btn[data-copy]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        copyText(btn.getAttribute('data-copy')).then(function () {
          flashCopied(btn);
          announce(S.copied);
        });
      });
    });
  }

  /* ------------------------------------------------------------------
     Sticky mobile CTA bar · appears past the hero, hides over the
     contact form, the footer, or while the nav sheet is open
  ------------------------------------------------------------------ */
  const ctabarState = { pastHero: false, contact: false, footer: false };
  function updateCtabar() {
    const bar = $('#ctabar');
    if (!bar) { return; }
    const on = ctabarState.pastHero && !ctabarState.contact && !ctabarState.footer && !panelState.open;
    bar.classList.toggle('is-on', on);
  }
  function initCtabar() {
    const bar = $('#ctabar');
    if (!bar || !('IntersectionObserver' in window)) { return; }
    function watch(node, key, invert) {
      if (!node) { return; }
      const io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          ctabarState[key] = invert ? !e.isIntersecting : e.isIntersecting;
          updateCtabar();
        });
      }, { threshold: 0.05 });
      io.observe(node);
    }
    watch($('.hero'), 'pastHero', true);
    watch($('.form-card'), 'contact', false);
    watch($('.site-footer'), 'footer', false);
    updateCtabar();
  }

  /* ------------------------------------------------------------------
     Footer year · static 2026 in the markup, replaced with the live
     year when the script runs
  ------------------------------------------------------------------ */
  function initYear() {
    const y = $('#fyear');
    if (y) { y.textContent = String(new Date().getFullYear()); }
  }

  /* ------------------------------------------------------------------
     Boot · every init guards its own markup, so the same file serves
     the home pages and the simpler legal and 404 pages
  ------------------------------------------------------------------ */
  initHeader();
  initScrollspy();
  initPanel();
  initReveal();
  initDemos();
  initSteps();
  initEstimator();
  initForm();
  initCopyButtons();
  initCtabar();
  initYear();
})();