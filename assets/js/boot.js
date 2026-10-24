/* El-Peak Studio · boot.js
   Runs synchronously in <head> before first paint. Its only job is to mark
   that JavaScript is available, so reveal/hidden states (scoped to html.js
   in main.css) never hide content when JS is disabled or fails to load.
   CSP-safe: external file, no inline code. */
(function () {
  'use strict';
  document.documentElement.classList.add('js');
})();