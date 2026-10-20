/**
 * Stories / Testimonials — tabbed auto-play carousel
 *
 * Each section with [data-stories] gets an independent instance.
 * Tabs rotate every `--stories-duration` (default 8 s).
 * Hover or focus pauses the timer; leaving resumes it.
 *
 * DOM contract:
 *   [data-stories]            Section root
 *     [data-stories-tabs]     Component wrapper
 *       [data-stories-tab]    Tab buttons  (.is-active)
 *         [data-stories-fill] Progress bar fill inside each tab
 *       [data-stories-panel]  Content panels (.is-active / hidden)
 */
;(function storiesInit() {
  'use strict';

  const DURATION_DEFAULT = 8000; // ms

  document.querySelectorAll('[data-stories]').forEach((section) => {
    const tabs   = [...section.querySelectorAll('[data-stories-tab]')];
    const panels = [...section.querySelectorAll('[data-stories-panel]')];
    if (!tabs.length || !panels.length) return;

    let current = 0;
    let timer   = null;
    let paused  = false;

    // Read CSS custom property for duration (seconds → ms)
    const durationSec = parseFloat(
      getComputedStyle(section).getPropertyValue('--stories-duration') || '8'
    );
    const duration = durationSec * 1000 || DURATION_DEFAULT;

    function activate(index) {
      // Deactivate all
      tabs.forEach((t) => {
        t.classList.remove('is-active');
        t.setAttribute('aria-selected', 'false');
        const fill = t.querySelector('[data-stories-fill]');
        if (fill) {
          fill.style.animation = 'none';
          fill.style.width = '0%';
        }
      });
      panels.forEach((p) => {
        p.classList.remove('is-active');
        p.hidden = true;
      });

      // Activate target
      current = index;
      const tab   = tabs[current];
      const panel = panels[current];

      tab.classList.add('is-active');
      tab.setAttribute('aria-selected', 'true');

      panel.classList.add('is-active');
      panel.hidden = false;

      // Restart fill animation via reflow
      const fill = tab.querySelector('[data-stories-fill]');
      if (fill) {
        fill.style.animation = 'none';
        void fill.offsetWidth; // force reflow
        fill.style.animation = '';
      }
    }

    function next() {
      activate((current + 1) % tabs.length);
    }

    function startTimer() {
      clearInterval(timer);
      timer = setInterval(() => {
        if (!paused) next();
      }, duration);
    }

    // Click / keyboard
    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => {
        activate(i);
        startTimer(); // restart timer on manual switch
      });
    });

    // Pause on hover / focus within
    const wrapper = section.querySelector('[data-stories-tabs]') || section;
    wrapper.addEventListener('mouseenter', () => { paused = true; });
    wrapper.addEventListener('mouseleave', () => { paused = false; });
    wrapper.addEventListener('focusin',    () => { paused = true; });
    wrapper.addEventListener('focusout',   () => { paused = false; });

    // Reduced motion: disable auto-play
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) return;
    mq.addEventListener('change', (e) => {
      if (e.matches) clearInterval(timer);
      else startTimer();
    });

    // Boot
    activate(0);
    startTimer();
  });
})();
