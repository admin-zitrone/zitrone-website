# Component Grammar

Status: in progress.

This file defines the reusable component families that sit on top of our semantic tokens and layout primitives. The goal is not to make isolated pretty blocks. The goal is to define the exact page grammar we need to rebuild the Maven-like website in a consistent, repeatable way.

## Core Rules

- Components must consume semantic and component tokens, not raw color or spacing values.
- Each component should have a stable internal order so the same content reads the same way across sections.
- One component should do one job. Pills are not kickers, kickers are not tags, and proof cards are not stat cards.
- Action hierarchy stays strict: one primary action per group, with a secondary companion only when needed.
- Dark sections must switch to inverse-ready component variants instead of ad hoc overrides.

## Current Source

- Spec tokens: `src/design-system/tokens/component.css`
- Live grammar styles: `src/design-system/components/marketing.css`
- Working specimen: `preview/design-system/sections.html`
- Media rules: `docs/design-system/media-semantics.md`

## Component Families

### Button Variants

Classes:

- `.ds-button`
- `.ds-button[data-variant="secondary"]`
- `.ds-button[data-variant="inverse-primary"]`
- `.ds-button[data-variant="inverse-secondary"]`

Rules:

- Use primary for the highest-priority action in a group.
- Use secondary only as the companion action, never as the dominant action beside another secondary.
- Use inverse variants only on dark green or inverse surfaces.
- Keep button groups to one primary and one secondary in hero, services, and CTA sections.
- Disabled buttons should communicate unavailability, not uncertainty.

### Pill, Tag, and Kicker

Classes:

- `.ds-pill`
- `.ds-service-tag`
- `.ds-kicker`

Rules:

- `ds-pill` is for compact contextual framing, especially in hero or announcement moments.
- `ds-service-tag` is only for semantic service categories inside service cards.
- `ds-kicker` introduces a section before the heading and should stay short, calm, and consistent.
- Pills use outline treatment and tone switching; kickers use quiet text-only framing; service tags use category surface, text, and border roles.
- Do not swap these roles just because they share compact typography.

### Nav and Header

Classes:

- `.ds-nav`
- `.ds-nav-inner`
- `.ds-nav-brand`
- `.ds-nav-links`
- `.ds-nav-link`

Rules:

- Header grammar is brand first, navigation second, optional utility action later.
- The bar remains sticky and wraps into a stacked layout on smaller screens.
- Navigation links should stay lightweight so the hero remains the loudest voice on the page.

### Hero Text and Media Composition

Classes:

- Section shell from layout semantics
- `.ds-nav`
- `.ds-pill`
- `.ds-heading[data-size="hero"]`
- `.ds-hero-copy`
- `.ds-button`

Rules:

- Hero order is pill, heading, copy, then actions.
- Hero composition may also include a masthead and a proof ribbon, but those are governed subfamilies, not page-local improvisations.
- The hero copy measure stays narrower than the heading measure.
- Hero width, frame behavior, heading measure, copy measure, content layer, and action spacing should all resolve through hero/media component tokens.
- Hero frame may be editorial full-bleed or contained bento, but the mode must be explicit; imported operational heroes should use the contained bento frame with inset on all four sides.
- Media should be part of the section surface or a paired media panel, never a decorative floating card.
- A hero masthead that sits on media must consume navigation grammar and inverse-ready tokens instead of becoming a separate styling universe.
- A hero proof ribbon should be treated as a credibility subfamily that can host chips, logos, or marquee behavior without disturbing the main reading order.
- The hero must feel like a page-opening composition, not a generic marketing card.
- Imported heroes from older projects should be translated through the system layers described in `hero-transfer-model.md`, not copied as one-off markup and CSS.

### Service Cards

Classes:

- `.ds-service-card`
- `.ds-service-accent`
- `.ds-service-tag`
- `.ds-card-title`
- `.ds-card-copy`

Rules:

- Service cards always use a semantic category accent, not arbitrary decorative color.
- Internal order is accent dot, title, support copy, then CTA.
- On mobile they should work as a rail; on larger screens they become a grid.
- Overlay, dot, tag type, copy measure, and responsive media height belong to the service-card contract.
- The rail-to-grid handoff should use the shared layout contract, typically `.ds-card-rail[data-grid-from="desktop"][data-columns="4-col"]`.
- Card titles stay short enough to preserve even rhythm across the row.
- The Maven homepage pattern uses repeated full-media cards with the same internal content order; the interaction changes by breakpoint, not by promoting one card into a different featured layout.

### Feature and Proof Cards

Classes:

- `.ds-proof-grid`
- `.ds-proof-card`
- `.ds-proof-title`
- `.ds-proof-copy`
- `.ds-media-panel`

Rules:

- Proof cards support a feature narrative, so they should be compact, factual, and scannable.
- Use them for evidence, platform capabilities, and supporting claims.
- Pair them with a media panel when the section needs product or care-model proof.
- Proof-card border, fill, title tone, and copy measure belong to the proof-card contract, not the generic card layer.
- Proof-grid column counts belong to the shared layout layer, typically `.ds-grid[data-columns="3-col"][data-columns-medium="2-col"]`.

### Stat Cards

Classes:

- `.ds-stat-card`
- `.ds-stat-number`
- `.ds-card-copy`

Rules:

- Stat cards are number-first.
- The number should be the loudest element, with the explanation staying brief and readable.
- Use these for outcomes and validation, not for long explanatory content.
- The serif number family, breakpoint step-down, and support-copy measure belong to the stat-card contract.
- Their repeated layout should use the shared explicit column grammar, not an isolated section-only grid.

### Testimonial and Story Cards

Classes:

- `.ds-story-card`
- `.ds-quote`
- `.ds-story-meta`

Rules:

- Story cards are quote-first and should feel human before they feel analytical.
- Meta text should identify the story context without competing with the quote.
- Keep supporting brand evidence visually quieter than the testimonial itself.

### Tabs and Logo Rows

Classes:

- `.ds-tab-row`
- `.ds-tab`
- `.ds-logo-row`
- `.ds-logo-chip`

Rules:

- Tabs are for choosing context, story, or employer views.
- Logo rows are for supporting evidence and brand trust, not for primary navigation.
- A selected tab should be obvious through surface treatment, not only color.
- Tabs and logo chips should use compact component tokens for type and focus rather than borrowing arbitrary label styles.
- Logo rows should stay low-noise and never overpower the story or CTA around them.

### CTA Blocks

Classes:

- `.ds-cta-block`
- `.ds-kicker`
- `.ds-heading`
- `.ds-copy`
- `.ds-button`

Rules:

- CTA blocks use the same text order as hero, but with tighter scope and stronger conversion intent.
- Keep the message singular and the action set small.
- Use centered composition only when the surrounding section tone supports it.

### Carousel Rail and Controls

Classes:

- `.ds-carousel`
- `.ds-carousel-controls`
- `.ds-carousel-button`
- `[data-carousel-track]`
- `[data-carousel-progress]`

Rules:

- Carousel rails are mobile-first repeated-content containers, not a default section treatment.
- The track should be keyboard reachable when it truly scrolls, with left/right and home/end navigation.
- Controls must expose accurate disabled states and progress semantics.
- Once the content can responsibly become a grid, the rail should collapse back into normal layout instead of pretending to be a carousel forever.
- The final desktop grid should be named explicitly through `data-columns`, not left to auto-fit guesswork.

### Footer Link Groups

Classes:

- `.ds-footer-grid`
- `.ds-footer-brand`
- `.ds-footer-copy`
- `.ds-footer-groups`
- `.ds-footer-group`
- `.ds-footer-group-title`
- `.ds-footer-links`

Rules:

- Footer grammar is brand summary plus grouped navigation, not one undifferentiated link cloud.
- Group titles should label the information architecture clearly.
- Footer brand, group-title, and link styles should come from footer tokens.
- Footer links should stay readable and low-friction, with enough grouping to scan quickly.
- Footer columns should consume shared layout primitives: top-level `4/8` split, then grouped `3-col` / `2-col` link grids.

## Maven Mapping

These are the component families we need to replicate the Maven-like page structure:

1. Hero: `pill + hero heading + body copy + primary/secondary CTA`
2. Services: `section head + CTA group + service card rail/grid`
3. Platform proof: `copy block + proof cards + media panel`
4. Outcomes: `section head + stat card grid`
5. Stories: `story intro + tabs/logo row + testimonial card`
6. Closing CTA: `centered CTA block`
7. Footer: `brand block + grouped link columns`

## What Still Comes Next

- Utility/header CTA slot
- Hero masthead and hero proof-ribbon subfamilies
- Interactive tab behavior
- Real story-content swapping behind the tab row
- Dropdown or mega-nav patterns if the final information architecture needs them
- Form controls and conversion forms
