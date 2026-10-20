# Motion and Interaction Semantics

Status: in progress.

This file defines how motion and interaction should behave in the Maven-style rebuild. The goal is to make motion part of the system, not a set of one-off flourishes added after layout and components are already finished.

## Why This Layer Exists

The Maven reference feels polished because behavior reinforces the content hierarchy:

- The navigation bar tightens as the page scrolls.
- Hero media has gentle depth instead of a static flat backdrop.
- Service content behaves like a mobile rail before becoming a desktop grid.
- Titles and cards enter with calm, sequenced reveals instead of popping into place.
- Hover and focus states feel intentional, not browser-default.

Without named motion rules, the rebuild will drift into inconsistent timing, mismatched hover energy, and inaccessible interactions.

## Current Source

- Motion tokens: `src/design-system/tokens/semantic.css`
- Component motion API: `src/design-system/tokens/component.css`
- Global scroll and focus defaults: `src/design-system/styles/base.css`
- Live motion/component rules: `src/design-system/components/marketing.css`
- Title reveal helper: `src/design-system/motion/title-reveal.js`
- Interaction helper: `src/design-system/motion/marketing-interactions.js`
- Working specimen: `preview/design-system/sections.html`

## Core Rules

- Motion should clarify hierarchy, not compete with content.
- Decorative motion must degrade cleanly to a still state.
- Timing should stay calm and readable. This system is not built around snappy dashboard motion.
- Hover is enhancement only. Focus-visible is required.
- Scroll effects must stay subtle enough that layout still feels stable.

## Motion Roles

### Hover States

Current roles:

- Buttons lift slightly and gain shadow.
- Cards and media panels lift slightly on fine-pointer devices only.
- Tabs and carousel controls use the same gentle lift language.

Rules:

- Use one hover lift distance across interactive surfaces.
- Do not invent a stronger hover pattern for one card family unless its role truly changes.
- Hover should never be the only signal that something is interactive.

### Sticky Navigation

Current roles:

- The nav stays sticky from the top of the viewport.
- After a short scroll threshold, the nav compresses, softens its border, gains blur, and picks up a light shadow.

Rules:

- Sticky behavior should support orientation, not dominate the page.
- The scrolled state must remain readable over light content and warm surfaces.
- The nav must still work as a plain sticky bar when blur is unavailable.

### Reveal Timing

There are two reveal families:

1. Title reveal: word-by-word heading choreography for major editorial moments
2. Section reveal: fade-up reveal for cards, media, and grouped supporting content

Rules:

- Use title reveal only for major headings, not every section title.
- Use fade-up reveal for repeated content blocks that benefit from sequencing.
- Reveal distance should stay small so the layout still feels anchored.
- Stagger should be short and even, not theatrical.

### Carousel Behavior

Current specimen behavior:

- Service cards form a horizontally scrollable rail on smaller screens.
- Previous/next controls and progress dots appear only when the rail actually scrolls.
- Controls stay hidden on desktop once the rail becomes a normal grid.
- The rail track becomes keyboard reachable when it scrolls, with left/right and home/end stepping.
- Progress exposes an explicit `progressbar` state so the active position is announced semantically, not only visually.

Rules:

- Carousel behavior belongs to repeated content families, not to every section.
- Controls should reflect actual state: disabled at the ends, active progress visible, hidden when unnecessary.
- Motion for carousel navigation must use smooth scrolling only when reduced motion is not requested.
- Keyboard navigation should match the visible order of cards and never trap focus.

### Scroll and Parallax

Current role:

- Hero media gets a shallow scroll offset to create depth while the content remains stable.

Rules:

- Parallax is decorative only.
- Keep the offset small enough that the image still feels grounded.
- Never require parallax to preserve crop integrity or readability.
- Touch and reduced-motion experiences must still feel complete without it.

### Reduced Motion

Rules:

- Smooth scrolling becomes instant.
- Reveal elements become immediately visible.
- Hover lift and decorative transforms are neutralized.
- Hero parallax is disabled.
- Title reveal falls back to readable static text.

Reduced motion should not produce a degraded or unfinished page. It should produce a calmer version of the same page.

### Focus-Visible

Current rules:

- Global focus-visible is defined in base styles.
- Buttons, nav links, nav brand, tabs, carousel controls, dots, and footer links use explicit focus-visible treatment.
- Scrollable carousel tracks also use explicit focus-visible treatment once they become keyboard reachable.
- Inverse sections switch to inverse-ready focus rings.

Rules:

- Focus-visible must be stronger than hover.
- Rings should follow semantic tone, especially on dark sections.
- Never remove focus styling without replacing it.

## Current Grammar Hooks

Classes:

- `.ds-reveal`
- `.ds-nav`
- `.ds-nav-inner`
- `.ds-carousel`
- `.ds-carousel-controls`
- `.ds-carousel-button`
- `.ds-carousel-progress`
- `.ds-carousel-dot`
- `.ds-title-reveal`
- `.ds-hero-media`

Attributes:

- `data-reveal="fade-up"`
- `data-reveal-state="idle|visible"`
- `data-nav-state="top|scrolled"`
- `data-carousel`
- `data-carousel-track`
- `data-carousel-prev`
- `data-carousel-next`
- `data-carousel-progress`

## Maven Mapping

1. Hero: title reveal plus shallow decorative parallax
2. Services: mobile card rail with controls, desktop grid without controls
3. Proof and outcomes: quiet sequenced card reveals
4. Stories and CTA: editorial heading motion used sparingly for emphasis
5. Full page: sticky nav, calm hover language, clear keyboard focus

## What Still Comes Next

- Real tab content switching for story tabs
- Hero image cycling rules if the final Maven recreation needs them
- Carousel drag affordances and autoplay rules if a later section truly needs them
- More precise section-by-section timing calibration against the reference
