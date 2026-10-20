/**
 * Title Reveal — Design System Motion
 * ─────────────────────────────────────
 * Automatically splits heading text into per-word <span> wrappers,
 * then animates them in with a staggered blur-to-visible effect
 * when they scroll into view.
 *
 * Usage:
 *   <h2 class="ds-heading ds-title-reveal"
 *       data-title-reveal="words"
 *       aria-label="Full heading text">
 *     Full heading text
 *   </h2>
 *
 * Words can also be pre-wrapped in <span> tags (legacy support).
 * Accent words use <span class="ds-heading-accent">, <strong>, or <em>.
 */
(function () {
  const targets = Array.from(
    document.querySelectorAll('[data-title-reveal="words"]')
  );

  if (!targets.length) return;

  const reduceMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ── Word-splitting ──────────────────────────────────────
     Walks all child nodes. Text nodes are split on whitespace
     and each word is wrapped in a <span>. Existing element
     nodes (strong, em, span with ds-heading-accent, br, etc.)
     are preserved as-is — they become their own animated unit. */
  function splitWords(el) {
    // Already has span children — skip (pre-wrapped headings)
    const existingSpans = el.querySelectorAll(":scope > span");
    if (existingSpans.length > 0) return;

    const fragment = document.createDocumentFragment();
    const childNodes = Array.from(el.childNodes);

    // Separating space, unless the fragment already ends in one
    function appendSpace() {
      const last = fragment.lastChild;
      if (!last) return;
      if (last.nodeType === Node.TEXT_NODE && /\s$/.test(last.textContent)) {
        return;
      }
      fragment.appendChild(document.createTextNode(" "));
    }

    childNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        let text = node.textContent;
        // Whitespace-only node — preserve a single separating space
        if (text.trim() === "") {
          appendSpace();
          return;
        }
        // Punctuation that runs straight out of the previous word — an accent
        // word's trailing comma, a tagline's final period — belongs to that
        // word. Each word is an inline-block, so leaving the comma to become
        // its own span lets a line break land between the two.
        const previous = fragment.lastChild;
        if (
          !/^\s/.test(text) &&
          previous &&
          previous.nodeType === Node.ELEMENT_NODE &&
          previous.tagName === "SPAN"
        ) {
          const lead = (/^\S+/.exec(text) || [])[0];
          if (lead) {
            previous.appendChild(document.createTextNode(lead));
            text = text.slice(lead.length);
            if (text === "") return;
          }
        }
        // Preserve whitespace separating this text from a previous segment
        if (/^\s/.test(text)) {
          appendSpace();
        }
        // Split text on whitespace, wrap each word
        const words = text.split(/\s+/).filter(Boolean);
        words.forEach((word, i) => {
          const span = document.createElement("span");
          span.textContent = word;
          fragment.appendChild(span);
          // Add a text space between words for proper wrapping
          if (i < words.length - 1) {
            fragment.appendChild(document.createTextNode(" "));
          }
        });
        // Preserve whitespace separating this text from the next segment
        if (/\s$/.test(text)) {
          fragment.appendChild(document.createTextNode(" "));
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        if (node.tagName === "BR") {
          // Preserve line breaks
          fragment.appendChild(node.cloneNode());
        } else {
          // Wrap element nodes (strong, em, span.ds-heading-accent) inside a
          // span so they get the reveal animation. Clone rather than rebuild,
          // so the element keeps its tag and class and any punctuation
          // absorbed above stays outside it.
          appendSpace();
          const wrapper = document.createElement("span");
          wrapper.appendChild(node.cloneNode(true));
          fragment.appendChild(wrapper);
        }
      }
    });

    el.textContent = "";
    el.appendChild(fragment);
  }

  /* ── Split all targets ─────────────────────────────────── */
  targets.forEach(splitWords);

  /* ── Reveal state management ───────────────────────────── */
  const reveal = (target) => {
    target.dataset.revealState = "visible";
  };

  if (!reduceMotion) {
    targets.forEach((target) => {
      target.dataset.revealState = "idle";
    });
  }

  const start = () => {
    if (reduceMotion || !("IntersectionObserver" in window)) {
      targets.forEach(reveal);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          reveal(entry.target);
          observer.unobserve(entry.target);
        });
      },
      {
        rootMargin: "0px 0px -15% 0px",
        threshold: 0.01,
      }
    );

    targets.forEach((target) => {
      observer.observe(target);
    });
  };

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(start).catch(start);
    return;
  }

  start();
})();
