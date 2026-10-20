# Motion

Home for original motion helpers.

Rules:

- Start with CSS transitions when possible.
- Use timelines only for choreography.
- Keep reduced-motion behavior in the same module as the motion helper.
- Keep vendor demos out of source.

## Current Helpers

- `title-reveal.js`: observes `[data-title-reveal="words"]` headings, waits for fonts, and marks them visible when they enter the viewport. The CSS in `layout/sections.css` owns the actual word animation and reduced-motion behavior.
- `marketing-interactions.js`: handles sticky nav state, hero parallax, fade-up reveal targets, and mobile carousel controls for the live section specimen. The CSS in `components/marketing.css` owns the visible motion language and reduced-motion fallbacks.
