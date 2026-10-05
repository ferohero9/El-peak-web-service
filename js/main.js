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
  var LANGUAGE_KEY = 'elpeak-language';
  var activeLanguage = 'en';

  var translations = {
    ar: {
      navServices: 'الخدمات', navDemos: 'النماذج', navHosting: 'الاستضافة', navPricing: 'الأسعار', navContact: 'تواصل معنا',
      whatsApp: 'واتساب', heroEyebrow: 'استوديو تصميم مواقع · مصر',
      heroTitle: 'مواقع مخصصة للمشاريع المحلية — <span class="grad">مصممة لتبقى ملكك</span>',
      heroSub: 'قوائم طعام، وكتالوجات خدمات، ومتاجر للمطاعم والعيادات والمحلات والورش — <strong>نستعين بالذكاء الاصطناعي ثم نراجع العمل بعناية قبل التسليم.</strong> يمكن أن تصل الطلبات إلى واتسابك مباشرة، من دون طبقات عمولات المنصات. سعر بناء واضح واستضافة cPanel عادية.',
      startWhatsApp: 'ابدأ عبر واتساب', viewDemos: 'استعرض النماذج', scoreNumber: 'نطاق', scoreLabel: 'واضح للمشروع',
      chipDirect: 'طلبات مباشرة عبر واتساب', chipEthical: 'للمشاريع الأخلاقية فقط', chipFiles: 'ملفاتك تُسلَّم إليك', chipReview: 'بمساعدة الذكاء الاصطناعي · مراجعة بشرية',
      stat1Number: 'اتفاق', stat1Label: 'على النطاق قبل البدء', stat2Number: 'تواصل', stat2Label: 'مباشر مع العملاء', stat3Number: 'مراجعة', stat3Label: 'قبل التسليم', stat4Number: 'للجوال', stat4Label: 'أولاً بشكل افتراضي',
      servicesEyebrow: 'الخدمات', servicesTitle: 'ما الذي نبنيه؟', servicesSub: 'كل مشروع موقع ثابت وخفيف، نستعين بأدوات الذكاء الاصطناعي فيه ونراجعه قبل التسليم. ويمكن تشغيله على استضافة عادية من دون قاعدة بيانات.',
      service1Title: 'قوائم طلبات عبر واتساب', service1Copy: 'قوائم تفاعلية للمطاعم والمقاهي والمخابز وعربات الطعام. يختار العميل الأصناف ويُجهّز الطلب كرسالة واتساب.',
      service1Item1: 'سلة طلبات من دون قاعدة بيانات', service1Item2: 'تعمل على الاستضافة المشتركة العادية', service1Item3: 'تحديثات مباشرة للأسعار والأصناف', tryRestaurant: 'جرّب نموذج المطعم',
      service2Title: 'كتالوجات خدمات ومواعيد', service2Copy: 'قوائم واضحة بأسعار وطلبات حجز مباشرة للعيادات والنوادي وورش السيارات ومراكز التعليم والخياطة.',
      service2Item1: 'طلبات حجز عبر واتساب', service2Item2: 'قوائم خدمات وأسعار واضحة', service2Item3: 'نماذج استفسار بسيطة', tryClinic: 'جرّب نموذج العيادة',
      service3Title: 'متاجر وكتالوجات إلكترونية', service3Copy: 'واجهات متاجر للإلكترونيات والأجهزة المنزلية والعطور والحرف، مع بحث وفلاتر وسلة ترسل الطلب عبر واتساب.',
      service3Item1: 'فلاتر للبحث والعلامة والسعر', service3Item2: 'معارض منتجات وحالة المخزون', service3Item3: 'رسائل طلب مباشرة بلا إعداد بوابة دفع', tryElectronics: 'جرّب نموذج متجر الإلكترونيات',
      service4Title: 'صفحات هبوط ومعارض أعمال', service4Copy: 'مواقع صفحة واحدة لشركات الخدمات والاستشاريين والمصممين والمقاولين، مصممة لتسهّل على العملاء التواصل معك.',
      service4Item1: 'نماذج استفسار', service4Item2: 'خرائط ومناطق خدمة', service4Item3: 'بيانات التواصل في الواجهة', tryContractor: 'جرّب نموذج المقاول',
      aiTitle: 'بمساعدة الذكاء الاصطناعي ثم مراجعة بشرية', aiCopy: 'نستخدم أدوات الذكاء الاصطناعي خلال التصميم والبناء، ثم نراجع المحتوى والتخطيط والتفاعلات قبل تسليم الموقع.',
      demosEyebrow: 'نماذج تفاعلية', demosTitle: 'نماذج جاهزة للاستكشاف', demosSub: 'أمثلة تفاعلية لكل منها هوية تصميم مختلفة. افتح أحدها وتخيله بعلامتك ومحتواك وأسعارك.',
      tabAll: 'كل النماذج', tabFood: 'طعام وشراب', tabRetail: 'تجزئة ومتاجر', tabHealth: 'صحة وخدمات', tabCorporate: 'شركات',
      tagFood: 'سلة تفاعلية', tagRetail: 'سلة وفلاتر', tagHealth: 'نموذج حجز', tagCorporate: 'نموذج استفسار',
      demo1Title: 'قائمة مطعم عبر واتساب', demo1Copy: 'قائمة رقمية بأقسام وصور وأسعار وسلة تُجهّز رسالة طلب مرتبة عبر واتساب.',
      demo2Title: 'متجر إلكترونيات وهواتف', demo2Copy: 'نموذج متجر فيه بحث وفلاتر للعلامة والفئة وحالة المخزون وسلة تُجهّز طلب واتساب.',
      demo3Title: 'صفحة حجز عيادة', demo3Copy: 'خدمات بأسعار واضحة ونموذج طلب موعد يجهّز رسالة لإرسالها للعيادة.',
      demo4Title: 'صفحة هبوط لمقاول', demo4Copy: 'موقع صفحة واحدة للمقاولين وشركات الخدمات: أعمال سابقة ومناطق خدمة ونموذج استفسار جاهز لواتساب.',
      quickPreview: 'معاينة سريعة', viewLive: 'افتح النموذج',
      hostingEyebrow: 'تقنية بسيطة', hostingTitle: 'مبني لاستضافة cPanel العادية', hostingSub: 'موقعك مجموعة ملفات خفيفة. ارفعها إلى استضافة مشتركة متوافقة مثل Hostinger أو Namecheap، ويمكن تشغيلها من دون قاعدة بيانات.',
      perk1Title: 'خفيف بحكم التصميم', perk1Copy: 'الملفات الثابتة تجعل الإعداد صغيراً ومباشراً.', perk2Title: 'جاهز لـ HTTPS', perk2Copy: 'يمكننا إعداد SSL عندما يكون ضمن خطة الاستضافة.',
      perk3Title: 'أجزاء أقل للتعامل معها', perk3Copy: 'لا تحتاج هذه المواقع الثابتة إلى إضافات أو قاعدة بيانات.', perk4Title: 'خيارات بريد الأعمال', perk4Copy: 'توفر البريد يعتمد على خطة الاستضافة التي تختارها.',
      perk5Title: 'دعم حسب خطة الاستضافة', perk5Copy: 'شروط وتوفر الدعم يحددهما مزود الاستضافة الذي تختاره.', perk6Title: 'نسخ احتياطي يحتاج تأكيداً', perk6Copy: 'نساعدك على مراجعة خيارات النسخ الاحتياطي المتاحة في خطتك.',
      step1Title: 'شاركنا نبذة عن مشروعك', step1Copy: 'أخبرنا عن نشاطك عبر واتساب ونتفق على نطاق العمل.', step2Title: 'نبني ونُعدّ الموقع', step2Copy: 'نصمم الموقع ونرفعه إلى cPanel ونختبر أهم المسارات معك.', step3Title: 'تستلم الملفات', step3Copy: 'عند اكتمال العمل تُسلَّم ملفات الموقع لتحتفظ بها.',
      pricingEyebrow: 'أسعار واضحة', pricingTitle: 'رسوم بناء واضحة مع إضافات اختيارية', pricingSub: 'رسوم بناء واحدة، مع استضافة ونطاق سنويين عند الحاجة، وتحديثات محتوى اختيارية عندما تتغير معلوماتك. لا تتضمن هذه الباقة اشتراكاً في منصة.',
      availableNow: 'متاح الآن', package1Title: 'الباقة 1 — موقع ثابت متكامل', oneTimeFee: 'رسوم بناء لمرة واحدة', package1Note: 'للمطاعم والمقاهي والمتاجر والعيادات وكتالوجات الخدمات والمشاريع المحلية الصغيرة.',
      package1Item1: 'تخطيط ثابت مخصص من صفحة واحدة ومتجاوب ومصمم للجوال أولاً', package1Item2: 'رسائل طلب واستفسار تفاعلية عبر واتساب بالأصناف المختارة وملاحظات العميل', package1Item3: 'تصفية الفئات والتحكم في الأصناف غير المتاحة عبر JavaScript', package1Item4: 'موقع على الخريطة وروابط اجتماعية وأزرار تواصل', package1Item5: 'مُعد للاستضافة المشتركة العادية عبر cPanel', package1Item6: 'يمكن أن تصل الطلبات إلى واتسابك مباشرة',
      hostingNote: 'الاستضافة والنطاق يُحتسبان بشكل منفصل: <strong>500 جنيه مصري/سنة</strong> — راجع الإضافات أدناه.', startWebsite: 'ابدأ موقعك عبر واتساب',
      hostingAddonTitle: 'استضافة ونطاق سنويان', hostingAddonNote: 'يُحتسبان بشكل منفصل لكل موقع.', updatesTitle: 'تحديثات محتوى عند الطلب', updatesNote: 'لكل طلب تحديث — اطلبه فقط عند الحاجة.', pricingFootnote: 'كل الأسعار بالجنيه المصري. يتم الدفع لنا مباشرة، كاملاً أو على مرحلتين متفق عليهما. نعمل فقط مع المشاريع التي تعمل بأمانة وأخلاق.',
      contactEyebrow: 'تواصل معنا', contactTitle: 'اطلب عرض سعر', contactCopy: 'أخبرنا عن نشاطك وسنعود إليك بجدول زمني وعرض سعر.', briefTitle: 'أرسل نبذة سريعة', nameLabel: 'اسمك <span aria-hidden="true">*</span>', businessType: 'نوع النشاط', needsLabel: 'ماذا تحتاج؟ <span aria-hidden="true">*</span>', sendWhatsApp: 'أرسل عبر واتساب', formDisclaimer: 'يفتح واتساب ورسالتك جاهزة — هذا النموذج لا يخزن معلوماتك على خادم.'
    }
  };

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
     1b. LANGUAGE TOGGLE (English / Arabic, persisted)
     ---------------------------------------------------------- */
  function initLanguage() {
    var toggle = $('#languageToggle');
    var label = $('#languageToggleLabel');
    if (!toggle || !label) return;

    function apply(language) {
      activeLanguage = language;
      var isArabic = language === 'ar';
      document.documentElement.lang = language;
      document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
      document.documentElement.classList.toggle('is-arabic', isArabic);
      toggle.setAttribute('aria-pressed', String(isArabic));
      toggle.setAttribute('aria-label', isArabic ? 'Switch to English' : 'التبديل إلى العربية');
      label.textContent = isArabic ? 'English' : 'العربية';

      $$('[data-i18n]').forEach(function (el) {
        var key = el.getAttribute('data-i18n');
        var value = isArabic && translations.ar[key] ? translations.ar[key] : el.getAttribute('data-i18n-default');
        if (!el.hasAttribute('data-i18n-default')) el.setAttribute('data-i18n-default', el.textContent.trim());
        if (!isArabic) value = el.getAttribute('data-i18n-default');
        if (value) el.textContent = value;
      });

      $$('[data-i18n-html]').forEach(function (el) {
        var htmlKey = el.getAttribute('data-i18n-html');
        if (!el.hasAttribute('data-i18n-html-default')) el.setAttribute('data-i18n-html-default', el.innerHTML);
        el.innerHTML = isArabic && translations.ar[htmlKey] ? translations.ar[htmlKey] : el.getAttribute('data-i18n-html-default');
      });

      DEFAULT_WA_MESSAGE = isArabic ? 'مرحباً! أنا مهتم بموقع إلكتروني لمشروعي.' : "Hi! I'm interested in a website for my business";
      try { localStorage.setItem(LANGUAGE_KEY, language); } catch (e) { /* private mode */ }
      initWhatsAppLinks();
    }

    var saved = 'en';
    try { saved = localStorage.getItem(LANGUAGE_KEY) || 'en'; } catch (e) { /* private mode */ }
    apply(saved === 'ar' ? 'ar' : 'en');
    toggle.addEventListener('click', function () { apply(activeLanguage === 'ar' ? 'en' : 'ar'); });
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

    /** Keeps the optional hero ornament ready for themes that use it. */
    function fillRing() {
      var arc = $('#ringArc');
      if (!arc) return;
      // 2π × 30 ≈ 188.5; leave a small decorative gap.
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
        hint.textContent = activeLanguage === 'ar' ? 'أضف اسمك ونبذة قصيرة عما تحتاجه.' : 'Please add your name and a short note about what you need.';
        hint.classList.add('is-error');
        (!name ? $('#cfName') : $('#cfMsg')).focus();
        return;
      }

      hint.classList.remove('is-error');
      hint.textContent = activeLanguage === 'ar' ? 'يجري فتح واتساب ورسالتك جاهزة…' : 'Opening WhatsApp with your message pre-filled…';

      var text = activeLanguage === 'ar'
        ? 'مرحباً! أنا ' + name + '.\n' + 'نوع النشاط: ' + type + '\n\n' + msg
        : "Hi! I'm " + name + '.\n' + 'Business type: ' + type + '\n\n' + msg;

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
     8b. CUSTOM GLASSMORPHIc SELECT
     ---------------------------------------------------------- */
  function initCustomSelect() {
    var wraps = $$('.custom-select-wrap');
    if (!wraps.length) return;

    wraps.forEach(function (wrap) {
      var nativeSelect = $('.custom-select-native', wrap);
      var trigger = $('.custom-select-trigger', wrap);
      var dropdown = $('.custom-select-dropdown', wrap);
      var valueEl = $('.custom-select-value', wrap);
      var options = $$('.custom-select-option', dropdown);
      var field = wrap.closest('.field');

      if (!nativeSelect || !trigger || !dropdown) return;

      var highlightedIndex = -1;

      function open() {
        dropdown.hidden = false;
        requestAnimationFrame(function () {
          dropdown.classList.add('is-open');
          trigger.classList.add('is-active');
          trigger.setAttribute('aria-expanded', 'true');
          if (field) field.style.zIndex = '40';
        });

        highlightedIndex = -1;
        options.forEach(function (opt, idx) {
          if (opt.classList.contains('is-selected')) {
            highlightedIndex = idx;
          }
        });
        if (highlightedIndex < 0) highlightedIndex = 0;
        highlight(highlightedIndex);
      }

      function close() {
        dropdown.classList.remove('is-open');
        trigger.classList.remove('is-active');
        trigger.setAttribute('aria-expanded', 'false');
        if (field) field.style.zIndex = '';
        setTimeout(function () {
          if (!dropdown.classList.contains('is-open')) {
            dropdown.hidden = true;
          }
        }, 200);
        clearHighlight();
      }

      function toggle() {
        if (dropdown.classList.contains('is-open')) {
          close();
        } else {
          $$('.custom-select-dropdown.is-open').forEach(function (d) {
            d.classList.remove('is-open');
            setTimeout(function () {
              if (!d.classList.contains('is-open')) d.hidden = true;
            }, 200);
            var t = d.parentElement && d.parentElement.querySelector('.custom-select-trigger');
            if (t) {
              t.classList.remove('is-active');
              t.setAttribute('aria-expanded', 'false');
            }
          });
          open();
        }
      }

      function selectOption(opt) {
        if (!opt) return;
        var val = opt.getAttribute('data-value');
        nativeSelect.value = val;
        valueEl.textContent = val;

        options.forEach(function (o) {
          var isSel = o === opt;
          o.classList.toggle('is-selected', isSel);
          o.setAttribute('aria-selected', String(isSel));
          o.setAttribute('tabindex', isSel ? '0' : '-1');
        });

        var evt;
        try {
          evt = new Event('change', { bubbles: true });
        } catch (err) {
          evt = document.createEvent('Event');
          evt.initEvent('change', true, false);
        }
        nativeSelect.dispatchEvent(evt);

        close();
        trigger.focus();
      }

      function highlight(index) {
        options.forEach(function (opt, i) {
          var isHl = i === index;
          opt.classList.toggle('is-highlighted', isHl);
          if (isHl) {
            opt.scrollIntoView({ block: 'nearest' });
          }
        });
        highlightedIndex = index;
      }

      function clearHighlight() {
        options.forEach(function (opt) {
          opt.classList.remove('is-highlighted');
        });
        highlightedIndex = -1;
      }

      trigger.addEventListener('click', function (e) {
        e.preventDefault();
        toggle();
      });

      options.forEach(function (opt) {
        opt.addEventListener('click', function () {
          selectOption(opt);
        });
      });

      trigger.addEventListener('keydown', function (e) {
        var isOpen = dropdown.classList.contains('is-open');

        if (e.key === 'ArrowDown' || e.key === 'Down') {
          e.preventDefault();
          if (!isOpen) {
            open();
          } else {
            var next = highlightedIndex + 1;
            if (next >= options.length) next = 0;
            highlight(next);
          }
        } else if (e.key === 'ArrowUp' || e.key === 'Up') {
          e.preventDefault();
          if (!isOpen) {
            open();
          } else {
            var prev = highlightedIndex - 1;
            if (prev < 0) prev = options.length - 1;
            highlight(prev);
          }
        } else if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (isOpen && highlightedIndex >= 0 && highlightedIndex < options.length) {
            selectOption(options[highlightedIndex]);
          } else {
            toggle();
          }
        } else if (e.key === 'Escape') {
          if (isOpen) {
            e.preventDefault();
            close();
          }
        } else if (e.key === 'Tab') {
          if (isOpen) {
            close();
          }
        }
      });

      var form = wrap.closest('form');
      if (form) {
        form.addEventListener('reset', function () {
          setTimeout(function () {
            var defaultOpt = options[0];
            if (defaultOpt) {
              selectOption(defaultOpt);
            }
          }, 0);
        });
      }
    });

    document.addEventListener('click', function (e) {
      if (!e.target.closest('.custom-select-wrap')) {
        $$('.custom-select-dropdown.is-open').forEach(function (d) {
          d.classList.remove('is-open');
          setTimeout(function () {
            if (!d.classList.contains('is-open')) d.hidden = true;
          }, 200);
          var t = d.parentElement && d.parentElement.querySelector('.custom-select-trigger');
          if (t) {
            t.classList.remove('is-active');
            t.setAttribute('aria-expanded', 'false');
          }
          var f = d.closest('.field');
          if (f) f.style.zIndex = '';
        });
      }
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
    initLanguage();
    initNav();
    initScrollSpy();
    initFilters();
    initModal();
    initReveal();
    initWhatsAppLinks();
    initContactForm();
    initCustomSelect();
    initYear();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
