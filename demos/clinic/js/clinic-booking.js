/* ==========================================================================
   Noor Dental Clinic — booking flow (demo template by El-Peak)
   Vanilla JS · no frameworks · no CDNs.
   --------------------------------------------------------------------------
   IMPORTANT: This is a DEMO. Nothing on this page opens WhatsApp or sends
   any message anywhere. The form only validates, previews the composed
   message text and shows a success panel.
   --------------------------------------------------------------------------
   1) Data (SERVICES + inline icons)
   2) Tiny helpers (reduced motion, smooth scroll, toast, dates)
   3) Services rendering (grid + select)
   4) Booking form (validation → success panel → reset)
   5) Init
   ========================================================================== */
(function () {
  'use strict';

  /* ========================================================================
     1) DATA
     ======================================================================== */

  // ✏️ EDIT SERVICES HERE — change names, prices, photos and descriptions.
  // `img: null` services render as mint icon-tile cards (icon: 'tooth' | 'shield').
  /**
   * The clinic's six services, rendered into the services grid and the
   * booking form's <select>.
   * @type {Array<{id:string, name:string, desc:string, priceLabel:string, img:?string, imgAlt:?string, icon:?string}>}
   */
  const SERVICES = [
    {
      id: 'hygiene',
      name: 'Hygiene & Cleaning',
      desc: 'Example service copy for a cleaning visit. Confirm the treatment details with your clinic before publishing.',
      priceLabel: 'from EGP 300',
      img: 'assets/c-cleaning.jpg',
      imgAlt: 'Dental hygiene instruments — scaler and polishing brush — arranged on a calm teal background',
      icon: null
    },
    {
      id: 'braces',
      name: 'Braces & Orthodontics',
      desc: 'Example service copy for braces and aligners. Replace it with the clinic’s real consultation and treatment details.',
      priceLabel: 'Ask for consultation details',
      img: 'assets/c-braces.jpg',
      imgAlt: 'Dental model showing metal orthodontic brackets fitted on teeth',
      icon: null
    },
    {
      id: 'whitening',
      name: 'Teeth Whitening',
      desc: 'Example service copy for whitening. Confirm suitability, process and results with a qualified clinician.',
      priceLabel: 'from EGP 900',
      img: 'assets/c-whitening.jpg',
      imgAlt: 'Teeth whitening kit with LED whitening tray and whitening strips',
      icon: null
    },
    {
      id: 'kids',
      name: 'Kids Dentistry',
      desc: 'Example service copy for children’s appointments. Add the clinic’s actual approach and available services.',
      priceLabel: 'from EGP 250',
      img: 'assets/c-kids.jpg',
      imgAlt: "Colourful children's toothbrushes and a dental care set on a mint background",
      icon: null
    },
    {
      id: 'fillings',
      name: 'Tooth-Coloured Fillings',
      desc: 'Example service copy for fillings. Add the materials and options the clinic actually offers.',
      priceLabel: 'from EGP 400',
      img: null,
      imgAlt: null,
      icon: 'tooth'
    },
    {
      id: 'emergency',
      name: 'Emergency Care',
      desc: 'Example service copy for urgent care. Add your actual availability and emergency instructions.',
      priceLabel: 'Ask about availability',
      img: null,
      imgAlt: null,
      icon: 'shield'
    }
  ];

  /** Inline SVG icon set (stroke = currentColor, 24px viewBox). */
  const ICONS = {
    tooth:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' +
      '<path d="M8.4 3.5c-2.6 0-4.2 2-3.7 5 .6 3.6 1.8 9 3.7 10 1.4.7 1.4-2.7 2.3-5 .4-1.3 2.2-1.3 2.6 0 .9 2.3.9 5.7 2.3 5 1.9-1 3.1-6.4 3.7-10 .5-3-1.1-5-3.7-5-1.4 0-1.9 1-3.6 1s-2.2-1-3.6-1z"/></svg>',
    shield:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' +
      '<path d="M12 3l7 2.6v5.1c0 4.6-3 8.5-7 10.3-4-1.8-7-5.7-7-10.3V5.6L12 3z"/><path d="M9 12l2.2 2.2L15.4 10"/></svg>'
  };

  /** Slot radio values mapped to human-readable labels. */
  const SLOT_LABELS = {
    morning: 'Morning',
    afternoon: 'Afternoon',
    evening: 'Evening'
  };

  /* ========================================================================
     2) TINY HELPERS
     ======================================================================== */

  /**
   * True when the visitor prefers reduced motion.
   * @returns {boolean}
   */
  function prefersReducedMotion() {
    return Boolean(window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }

  /**
   * Smooth-scroll an element into view, unless reduced motion is preferred.
   * @param {HTMLElement} el target element
   * @returns {void}
   */
  function smoothScrollTo(el) {
    if (!el) { return; }
    el.scrollIntoView({
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      block: 'start'
    });
  }

  let toastTimer = null;

  /**
   * Show a transient toast message (aria-live="polite" region).
   * @param {string} message text to announce and display
   * @returns {void}
   */
  function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) { return; }
    toast.textContent = message;
    toast.classList.add('is-show');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      toast.classList.remove('is-show');
    }, 3200);
  }

  /**
   * Today's date as a local-timezone ISO string (YYYY-MM-DD).
   * @returns {string}
   */
  function todayISO() {
    const d = new Date();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return d.getFullYear() + '-' + mm + '-' + dd;
  }

  /**
   * Format an ISO date (YYYY-MM-DD) for humans, e.g. "Fri, Oct 3, 2025".
   * @param {string} iso local ISO date string
   * @returns {string} formatted date, or the raw input if unparseable
   */
  function formatDisplayDate(iso) {
    const parsed = new Date(iso + 'T00:00:00');
    if (isNaN(parsed.getTime())) { return iso; }
    return parsed.toLocaleDateString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
    });
  }

  /**
   * Strip spaces, dashes, dots and parentheses; count the remaining digits.
   * @param {string} value raw phone input value
   * @returns {number} digit count
   */
  function countPhoneDigits(value) {
    const cleaned = value.replace(/[\s\-().]/g, '');
    const digits = cleaned.match(/\d/g);
    return digits ? digits.length : 0;
  }

  /* ========================================================================
     3) SERVICES RENDERING (grid + select)
     ======================================================================== */

  /**
   * Build one service card. With a photo: photo-topped card. Without: a mint
   * icon-tile card. Both end with a coral "Book this service" button.
   * @param {{id:string,name:string,desc:string,priceLabel:string,img:?string,imgAlt:?string,icon:?string}} svc service record
   * @returns {HTMLElement} the finished <article class="svc-card">
   */
  function createServiceCard(svc) {
    const card = document.createElement('article');
    card.className = 'svc-card';

    const media = svc.img
      ? '<div class="svc-media"><img src="' + svc.img + '" alt="' + svc.imgAlt + '" ' +
        'width="800" height="500" loading="lazy" decoding="async"></div>'
      : '<div class="svc-tile" aria-hidden="true">' + (ICONS[svc.icon] || ICONS.tooth) + '</div>';

    card.innerHTML =
      media +
      '<div class="svc-body">' +
        '<h3 class="svc-name">' + svc.name + '</h3>' +
        '<p class="svc-desc">' + svc.desc + '</p>' +
        '<p class="svc-price">' + svc.priceLabel + '</p>' +
        '<button type="button" class="svc-book" data-book="' + svc.id + '" ' +
          'aria-label="Book ' + svc.name + ' (' + svc.priceLabel + ')">' +
          'Book this service' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" ' +
          'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' +
          '<path d="M4 12h15M13 6l6 6-6 6"/></svg>' +
        '</button>' +
      '</div>';
    return card;
  }

  /**
   * Render every service into #svcGrid and populate the booking <select>.
   * @returns {void}
   */
  function renderServices() {
    const grid = document.getElementById('svcGrid');
    const select = document.getElementById('bkService');
    if (grid) {
      const frag = document.createDocumentFragment();
      SERVICES.forEach(function (svc) { frag.appendChild(createServiceCard(svc)); });
      grid.appendChild(frag);
    }
    if (select) {
      SERVICES.forEach(function (svc) {
        const opt = document.createElement('option');
        opt.value = svc.id;
        opt.textContent = svc.name + ' — ' + svc.priceLabel;
        select.appendChild(opt);
      });
    }
  }

  /**
   * Handle clicks on any "Book this service" button: pre-select the service,
   * confirm via toast, then scroll to the booking form.
   * @param {MouseEvent} event delegated grid click
   * @returns {void}
   */
  function onGridClick(event) {
    const btn = event.target.closest('[data-book]');
    if (!btn) { return; }
    const select = document.getElementById('bkService');
    if (select) {
      select.value = btn.getAttribute('data-book');
      clearFieldError(select, 'bkServiceErr');
      select.focus({ preventScroll: true });
    }
    showToast('Service selected — pick a time below');
    smoothScrollTo(document.getElementById('booking'));
  }

  /* ========================================================================
     4) BOOKING FORM (validation → success panel → reset)
     ======================================================================== */

  /**
   * Show one field's inline error and flag the control with aria-invalid.
   * @param {HTMLElement} input the invalid control
   * @param {string} errId id of the <p class="field__error" role="alert">
   * @param {string} message human-readable error text
   * @returns {void}
   */
  function setFieldError(input, errId, message) {
    const err = document.getElementById(errId);
    if (err) {
      err.textContent = message;
      err.hidden = false;
    }
    if (input) {
      input.setAttribute('aria-invalid', 'true');
    }
  }

  /**
   * Clear one field's inline error and aria-invalid flag.
   * @param {?HTMLElement} input the control (may be null for radio groups)
   * @param {string} errId id of the error paragraph
   * @returns {void}
   */
  function clearFieldError(input, errId) {
    const err = document.getElementById(errId);
    if (err) {
      err.textContent = '';
      err.hidden = true;
    }
    if (input) {
      input.removeAttribute('aria-invalid');
    }
  }

  /**
   * Validate the whole booking form.
   * @returns {HTMLElement|null} first invalid control, or null when valid
   */
  function validateBookingForm() {
    const name = document.getElementById('bkName');
    const phone = document.getElementById('bkPhone');
    const service = document.getElementById('bkService');
    const date = document.getElementById('bkDate');
    const slot = document.querySelector('input[name="slot"]:checked');
    let firstInvalid = null;

    function fail(input, errId, message) {
      setFieldError(input, errId, message);
      if (!firstInvalid) { firstInvalid = input; }
    }

    // 1) Name — non-empty
    if (!name.value.trim()) {
      fail(name, 'bkNameErr', 'Please tell us your name.');
    } else {
      clearFieldError(name, 'bkNameErr');
    }

    // 2) Phone — at least 7 digits after stripping spaces/dashes
    if (countPhoneDigits(phone.value) < 7) {
      fail(phone, 'bkPhoneErr', 'Please enter a phone number with at least 7 digits.');
    } else {
      clearFieldError(phone, 'bkPhoneErr');
    }

    // 3) Service — one selected
    if (!service.value) {
      fail(service, 'bkServiceErr', 'Please choose the care you need.');
    } else {
      clearFieldError(service, 'bkServiceErr');
    }

    // 4) Date — set, and not in the past
    if (!date.value) {
      fail(date, 'bkDateErr', 'Please pick a date for your visit.');
    } else if (date.value < todayISO()) {
      fail(date, 'bkDateErr', 'Please pick today or a future date — we can\'t book the past.');
    } else {
      clearFieldError(date, 'bkDateErr');
    }

    // 5) Slot — one radio chosen (focus the first radio on error)
    const firstRadio = document.querySelector('input[name="slot"]');
    if (!slot) {
      fail(firstRadio, 'bkSlotErr', 'Please pick a time of day.');
    } else {
      clearFieldError(null, 'bkSlotErr');
    }

    return firstInvalid;
  }

  /**
   * Find the selected service record.
   * @param {string} id service id from the <select>
   * @returns {Object} matching service record (fallback: first service)
   */
  function findService(id) {
    return SERVICES.find(function (svc) { return svc.id === id; }) || SERVICES[0];
  }

  /**
   * Compose the appointment request message preview (plain text only —
   * nothing is transmitted anywhere from this demo page).
   * @param {{name:string, phone:string, service:Object, date:string, slot:string, notes:string}} data booking data
   * @returns {string} multi-line message text
   */
  function composeMessage(data) {
    return [
      'Hello Noor Dental Clinic!',
      'I would like to request an appointment.',
      '',
      'Service: ' + data.service.name + ' (' + data.service.priceLabel + ')',
      'Date: ' + formatDisplayDate(data.date),
      'Time: ' + SLOT_LABELS[data.slot],
      '',
      'Name: ' + data.name,
      'Phone: ' + data.phone,
      'Notes: ' + (data.notes ? data.notes : '—')
    ].join('\n');
  }

  /**
   * Fill the success panel: name, summary rows and the message preview.
   * @param {Object} data validated booking data
   * @returns {void}
   */
  function renderSuccess(data) {
    document.getElementById('bkSuccessName').textContent = data.name;

    const summary = document.getElementById('bkSummary');
    summary.innerHTML = '';
    const rows = [
      ['Service', data.service.name + ' (' + data.service.priceLabel + ')'],
      ['Date', formatDisplayDate(data.date)],
      ['Time', SLOT_LABELS[data.slot]],
      ['Name', data.name],
      ['Phone', data.phone],
      ['Notes', data.notes ? data.notes : '—']
    ];
    rows.forEach(function (row) {
      const wrap = document.createElement('div');
      wrap.className = 'sum-row';
      const dt = document.createElement('dt');
      dt.textContent = row[0];
      const dd = document.createElement('dd');
      dd.textContent = row[1];
      wrap.appendChild(dt);
      wrap.appendChild(dd);
      summary.appendChild(wrap);
    });

    document.getElementById('bkMessage').textContent = composeMessage(data);
  }

  /**
   * Submit handler: validate → swap the form for the success panel (demo only,
   * no messages are sent) or focus the first invalid field.
   * @param {SubmitEvent} event form submit event
   * @returns {void}
   */
  function onSubmit(event) {
    event.preventDefault();

    const firstInvalid = validateBookingForm();
    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    const slotInput = document.querySelector('input[name="slot"]:checked');
    const data = {
      name: document.getElementById('bkName').value.trim(),
      phone: document.getElementById('bkPhone').value.trim(),
      service: findService(document.getElementById('bkService').value),
      date: document.getElementById('bkDate').value,
      slot: slotInput ? slotInput.value : 'morning',
      notes: document.getElementById('bkNotes').value.trim()
    };

    renderSuccess(data);

    document.getElementById('bookingForm').hidden = true;
    const success = document.getElementById('bkSuccess');
    success.hidden = false;

    const title = document.getElementById('bkSuccessTitle');
    title.focus();
    smoothScrollTo(document.getElementById('booking'));
  }

  /**
   * Reset the booking flow back to an empty form (demo "Make another booking").
   * @returns {void}
   */
  function resetBooking() {
    const form = document.getElementById('bookingForm');
    form.reset();
    ['bkNameErr', 'bkPhoneErr', 'bkServiceErr', 'bkDateErr', 'bkSlotErr']
      .forEach(function (id) { clearFieldError(null, id); });
    ['bkName', 'bkPhone', 'bkService', 'bkDate']
      .forEach(function (id) { document.getElementById(id).removeAttribute('aria-invalid'); });
    setMinDate();

    document.getElementById('bkSuccess').hidden = true;
    form.hidden = false;
    document.getElementById('bkName').focus();
    smoothScrollTo(document.getElementById('booking'));
  }

  /**
   * Wire the form: min date, live error clearing, submit + reset buttons.
   * @returns {void}
   */
  function initBookingForm() {
    const form = document.getElementById('bookingForm');
    if (!form) { return; }

    setMinDate();

    // Clear a field's error as soon as the visitor fixes it.
    [['bkName', 'bkNameErr'], ['bkPhone', 'bkPhoneErr'],
     ['bkService', 'bkServiceErr'], ['bkDate', 'bkDateErr']]
      .forEach(function (pair) {
        const input = document.getElementById(pair[0]);
        input.addEventListener('input', function () {
          clearFieldError(input, pair[1]);
        });
      });
    Array.prototype.forEach.call(
      document.querySelectorAll('input[name="slot"]'),
      function (radio) {
        radio.addEventListener('change', function () {
          clearFieldError(null, 'bkSlotErr');
        });
      }
    );

    form.addEventListener('submit', onSubmit);

    const again = document.getElementById('bkAgain');
    if (again) {
      again.addEventListener('click', resetBooking);
    }
  }

  /* ========================================================================
     5) INIT
     ======================================================================== */

  /**
   * Set the date input's minimum to today (local timezone).
   * @returns {void}
   */
  function setMinDate() {
    const date = document.getElementById('bkDate');
    if (date) {
      date.min = todayISO();
    }
  }

  /**
   * Keep the footer year current (static fallback stays in the HTML).
   * @returns {void}
   */
  function initFooterYear() {
    const year = document.getElementById('fYear');
    if (year) {
      year.textContent = String(new Date().getFullYear());
    }
  }

  /**
   * Boot the demo booking page.
   * @returns {void}
   */
  function init() {
    renderServices();

    const grid = document.getElementById('svcGrid');
    if (grid) {
      grid.addEventListener('click', onGridClick);
    }

    initBookingForm();
    initFooterYear();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
