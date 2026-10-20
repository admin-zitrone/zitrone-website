/**
 * service-system.js
 * Full-bleed care carousel with chip navigation and theme-aware section states.
 * Ported from Zitrone, adapted for the On It design system.
 *
 * Usage: add data-service-system to the section root.
 */
(function () {
  'use strict';

  const SLIDE_MS = 780;

  function init(section) {
    const viewport = section.querySelector('[data-svc-viewport]');
    const track    = section.querySelector('[data-svc-track]');
    const cards    = [...section.querySelectorAll('[data-svc-card]')];
    const chips    = [...section.querySelectorAll('[data-svc-chip]')];
    const prevBtn  = section.querySelector('[data-svc-prev]');
    const nextBtn  = section.querySelector('[data-svc-next]');
    const progress = section.querySelector('[data-svc-progress]');
    const linkedThemeTargets = [
      ...document.querySelectorAll('#profiler, #profiler .semantic-profiler-shell'),
    ];

    if (!track || !cards.length) return;

    let current = 0;
    let isDragging = false;
    let dragStart = 0;
    let dragDelta = 0;
    let baseX = 0;
    let pressedCardIndex = -1;

    /* ── Position helpers ───────────────────────────────────── */
    function cardWidth()  { return cards[current]?.offsetWidth || cards[0].offsetWidth; }
    function compactCardWidth() {
      const compactCard = cards.find((card) => !card.classList.contains('is-active')) || cards[0];

      return compactCard.offsetWidth;
    }
    function stageGap()   { return parseFloat(getComputedStyle(track).gap) || 0; }
    function offsetFor(i) { return -(i * (compactCardWidth() + stageGap())); }
    function clampIndex(i) { return Math.max(0, Math.min(i, cards.length - 1)); }
    function surfaceThemeFor(i) { return i % 2 === 0 ? 'dining' : 'pantry'; }

    function setX(x, animate) {
      track.style.transition = animate
        ? `transform ${SLIDE_MS}ms cubic-bezier(0.18, 0.88, 0.28, 1)`
        : 'none';
      track.style.transform = `translateX(${x}px)`;
    }

    /* ── State update ───────────────────────────────────────── */
    function goTo(index, animate = true) {
      index = clampIndex(index);
      current = index;
      baseX   = offsetFor(current);
      const theme = surfaceThemeFor(current);

      setX(baseX, animate);

      cards.forEach((c, i) => {
        const isActive = i === current;
        c.classList.toggle('is-active', isActive);
        c.setAttribute('aria-pressed', String(isActive));
      });

      chips.forEach((chip, i) => {
        chip.classList.toggle('is-active', i === current);
        chip.setAttribute('aria-pressed', String(i === current));
      });
      section.dataset.svcTheme = theme;
      linkedThemeTargets.forEach((target) => {
        target.dataset.svcTheme = theme;
      });

      if (prevBtn) {
        prevBtn.disabled = current === 0;
      }

      if (nextBtn) {
        nextBtn.disabled = current === cards.length - 1;
      }

      if (progress) {
        progress.style.setProperty('--svc-progress-ratio', String((current + 1) / cards.length));
        progress.setAttribute('aria-valuenow', String(current + 1));
        progress.setAttribute('aria-valuetext', `Service layer ${current + 1} of ${cards.length}`);
      }
    }

    if (progress) {
      progress.setAttribute('role', 'progressbar');
      progress.setAttribute('aria-label', 'Service layers progress');
      progress.setAttribute('aria-valuemin', '1');
      progress.setAttribute('aria-valuemax', String(cards.length));
    }

    /* ── Arrow buttons ──────────────────────────────────────── */
    prevBtn?.addEventListener('click', () => { goTo(current - 1); });
    nextBtn?.addEventListener('click', () => { goTo(current + 1); });

    /* ── Chip clicks ────────────────────────────────────────── */
    chips.forEach((chip, i) => {
      chip.addEventListener('click', () => { goTo(i); });
    });

    /* ── Card clicks ────────────────────────────────────────── */
    cards.forEach((card, i) => {
      card.setAttribute('role', 'button');
      card.setAttribute('aria-pressed', String(i === current));

      card.addEventListener('click', () => {
        if (i !== current) goTo(i);
      });

      card.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;

        event.preventDefault();
        goTo(i);
      });
    });

    /* ── Drag (pointer events) ──────────────────────────────── */
    viewport?.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return;
      const pressedCard = e.target.closest('[data-svc-card]');
      isDragging = true;
      dragStart  = e.clientX;
      dragDelta  = 0;
      pressedCardIndex = cards.indexOf(pressedCard);
      viewport.setPointerCapture(e.pointerId);
      viewport.classList.add('is-dragging');
      setX(baseX, false);
    });

    viewport?.addEventListener('pointermove', (e) => {
      if (!isDragging) return;
      dragDelta = e.clientX - dragStart;
      setX(baseX + dragDelta, false);
    });

    function endDrag() {
      if (!isDragging) return;
      isDragging = false;
      viewport?.classList.remove('is-dragging');

      const threshold = cardWidth() * 0.2;
      const tapTargetIndex = pressedCardIndex;
      pressedCardIndex = -1;

      if (Math.abs(dragDelta) < 8 && tapTargetIndex > -1 && tapTargetIndex !== current) {
        goTo(tapTargetIndex);
      }
      else if (dragDelta < -threshold) goTo(current + 1);
      else if (dragDelta >  threshold) goTo(current - 1);
      else setX(baseX, true);
    }

    viewport?.addEventListener('pointerup',     endDrag);
    viewport?.addEventListener('pointercancel', endDrag);

    /* ── Init ───────────────────────────────────────────────── */
    // Two rAF passes — first settles layout, second reads dimensions
    requestAnimationFrame(() => requestAnimationFrame(() => {
      goTo(0, false);
    }));

    /* ── Reposition on resize ───────────────────────────────── */
    let resizeRaf;
    window.addEventListener('resize', () => {
      cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(() => {
        baseX = offsetFor(current);
        setX(baseX, false);
      });
    });
  }

  document.querySelectorAll('[data-service-system]').forEach(init);
})();
