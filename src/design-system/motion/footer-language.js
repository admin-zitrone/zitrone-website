/**
 * footer-language.js
 * Language picker toggle for the site footer.
 * Handles open/close, Escape key, and click-outside.
 *
 * Usage: add data-footer-lang-menu to the wrapper element,
 * data-footer-lang-pill to the trigger button, and
 * data-footer-lang-dropdown to the dropdown panel.
 */
(function () {
  'use strict';

  document.querySelectorAll('[data-footer-lang-menu]').forEach(function (menu) {
    const pill     = menu.querySelector('[data-footer-lang-pill]');
    const dropdown = menu.querySelector('[data-footer-lang-dropdown]');
    if (!pill || !dropdown) return;

    function open() {
      menu.classList.add('is-open');
      pill.setAttribute('aria-expanded', 'true');
    }

    function close() {
      menu.classList.remove('is-open');
      pill.setAttribute('aria-expanded', 'false');
    }

    function toggle() {
      if (menu.classList.contains('is-open')) {
        close();
      } else {
        open();
      }
    }

    pill.addEventListener('click', toggle);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });

    document.addEventListener('mousedown', function (e) {
      if (!menu.contains(e.target)) close();
    });
  });
})();
