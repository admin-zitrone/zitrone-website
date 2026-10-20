# Token Governance Register

Status: in progress.

This register governs the semantic and component-facing token families currently in the Maven rebuild. For scalability, we govern token families as explicit groups. Every token listed under a group inherits the same documentation contract until we need a more granular entry.

## Surface And Container Tokens

- Covered tokens:
  `--color-surface-page`, `--color-surface-navigation`, `--color-surface-container`, `--color-surface-container-muted`, `--color-surface-container-strong`, `--color-surface-section-warm`, `--color-surface-section-soft`, `--color-surface-section-brand`, `--color-surface-inverse`, `--color-surface-disabled`, `--image-surface-section-*`
- Purpose:
  Define the page, section, and container backgrounds that create Maven-like warmth, depth, and dark-brand contrast.
- Usage rules:
  Use page and section surfaces for full-width bands. Use section-surface image tokens only to add calm layered depth inside rounded framed sections. Use container surfaces for cards, panels, controls, and grouped content.
- Do:
  Keep warm surfaces light, brand sections dark green, and inverse sections deepest green.
- Don't:
  Do not use container surfaces as text colors or use brand/inverse surfaces as decoration without content hierarchy.
- Accessibility constraints:
  Every surface must pair with a documented text role that preserves readable contrast. Dark surfaces require inverse-ready text and focus tokens.
- Source evidence from Maven:
  Warm off-white page surfaces, deep green hero/brand sections, and white card surfaces are all documented in [design-system-audit](../research/maven-clinic/design-system-audit.md) and reflected in the saved page anatomy.
- Implementation files:
  `src/design-system/tokens/semantic.css`, `src/design-system/layout/sections.css`, `src/design-system/components/marketing.css`
- Promotion status:
  Needs test

## Text, Link, And Border Tokens

- Covered tokens:
  `--color-text-primary`, `--color-text-secondary`, `--color-text-muted`, `--color-text-inverse`, `--color-text-inverse-secondary`, `--color-text-link`, `--color-text-link-hover`, `--color-text-action`, `--color-border-subtle`, `--color-border-default`, `--color-border-strong`, `--color-border-inverse`, `--color-border-inverse-subtle`
- Purpose:
  Create a reliable hierarchy for readable copy, navigation, links, metadata, and structural outlines.
- Usage rules:
  Use primary text for main copy, inverse text on dark sections, and secondary text for supporting copy only where contrast remains safe.
- Do:
  Use link tokens for interactive text and border tokens for actual boundaries.
- Don't:
  Do not use muted text for essential body copy or use border tokens as filled surfaces.
- Accessibility constraints:
  Link and text pairings must remain readable on their intended surfaces. Inverse text roles must be used on brand/inverse sections. Subtle borders cannot replace visible focus indicators.
- Source evidence from Maven:
  Deep green body text, grey-green secondary copy, pale borders, and white-on-green dark sections are observed in [design-system-audit](../research/maven-clinic/design-system-audit.md) and the page anatomy.
- Implementation files:
  `src/design-system/tokens/semantic.css`, `src/design-system/components/marketing.css`, `docs/design-system/contrast-matrix.md`
- Promotion status:
  Needs test

## Action And Focus Tokens

- Covered tokens:
  `--color-action-primary-*`, `--color-action-secondary-*`, `--color-action-inverse-primary-*`, `--color-action-inverse-secondary-*`, `--color-action-disabled-*`, `--color-focus-ring`, `--color-focus-ring-inverse`, `--focus-ring-width`
- Purpose:
  Define action hierarchy and keyboard visibility for light and dark contexts.
- Usage rules:
  Primary is the strongest action, secondary is its companion, inverse variants are reserved for dark sections, and disabled roles only communicate true unavailability. Stateful families should define default, hover, active, and focus companions instead of leaving those decisions inside component CSS.
- Do:
  Keep focus tokens semantically paired to section tone.
- Don't:
  Do not invent ad hoc button colors per section or remove focus-visible styling.
- Accessibility constraints:
  Action states must preserve readable contrast, and focus-visible must remain stronger than hover. Disabled states must stay legible without pretending to be interactive.
- Source evidence from Maven:
  Maven uses green and inverse button hierarchies, white-on-dark action bands, and visible outline/hover treatment in the saved UI patterns documented in [design-system-audit](../research/maven-clinic/design-system-audit.md).
- Implementation files:
  `src/design-system/tokens/semantic.css`, `src/design-system/tokens/component.css`, `src/design-system/components/marketing.css`, `src/design-system/styles/base.css`
- Promotion status:
  Stable

## Detail, Layer, And Elevation Tokens

- Covered tokens:
  `--border-width-default`, `--border-width-strong`, `--focus-outline-width`, `--focus-outline-offset`, `--layer-content`, `--layer-sticky`, `--elevation-sticky`, `--elevation-raised`, `--effect-backdrop-blur-sticky`
- Purpose:
  Capture the small but repeatable structural details that make sticky surfaces, hover elevation, outlines, and micro-boundaries consistent.
- Usage rules:
  Use these tokens to support component contracts whenever a component needs a layer, elevation, border-width, or backdrop effect that appears in more than one place.
- Do:
  Keep these details tokenized so components stop reaching directly into primitive z-index, shadow, blur, and border values.
- Don't:
  Do not hardcode local box-shadow, z-index, border-width, or focus-outline values in reusable components when a governed support token exists.
- Accessibility constraints:
  Elevation and blur can support hierarchy but cannot replace readable contrast, clear focus, or real boundaries.
- Source evidence from Maven:
  Sticky navigation, subtle hover lift, pale one-pixel boundaries, and frosted scrolled-header behavior are observed in [design-system-audit](../research/maven-clinic/design-system-audit.md) and the saved page capture.
- Implementation files:
  `src/design-system/tokens/semantic.css`, `src/design-system/tokens/component.css`, `src/design-system/components/marketing.css`
- Promotion status:
  Stable

## Service Accent Tokens

- Covered tokens:
  `--color-accent-brand`, `--color-accent-service-dining*`, `--color-accent-service-cafe*`, `--color-accent-service-pantry*`, `--color-accent-service-catering*`
- Purpose:
  Give Maven-like service families stable category identity without turning the whole system decorative.
- Usage rules:
  Use these tokens only for service/category accents, tags, and supporting category surfaces.
- Do:
  Pair each vivid accent with its matching surface, text, and border token.
- Don't:
  Do not reuse service-category accents as generic buttons, section backgrounds, or arbitrary charts.
- Accessibility constraints:
  Each accent family must use its paired text token. Menopause uses dark text on yellow because lighter pairings are weaker.
- Source evidence from Maven:
  Category accent colors such as dining teal and pantry purple are directly observed in the services area of the local capture and preserved as Zitrone service-category semantics.
- Implementation files:
  `src/design-system/tokens/semantic.css`, `src/design-system/components/marketing.css`, `preview/design-system/sections.html`
- Promotion status:
  Candidate

## Typography Role Tokens

- Covered tokens:
  `--font-display`, `--font-body`, `--font-serif-accent`, `--font-label`, `--font-code`, `--type-display-hero-*`, `--type-section-heading-*`, `--type-card-heading-*`, `--type-stat-number-*`, `--type-quote-*`, `--type-body-*`, `--type-support-*`, `--type-meta-*`, `--type-brand-*`, `--type-legal-*`, `--type-label-*`, `--type-nav-*`, `--type-button-*`, `--type-accent-word-*`
- Purpose:
  Define the reusable type roles that make Maven-like editorial hierarchy reproducible, including the quieter support/meta/brand text that holds the system together.
- Usage rules:
  Use sans display for major headings, body for copy/UI, serif accent for editorial emphasis and stat/quote moments, support for secondary explanatory copy, meta for compact labels and chips, and brand/legal roles where identity or small print need explicit discipline.
- Do:
  Step type down through fixed breakpoint tokens and use the accent serif only in intentional editorial moments.
- Don't:
  Do not scale type with viewport width or use the serif accent as a default heading family.
- Accessibility constraints:
  Body text must keep readable measures and regular weights. Large display type may use lighter weights. Accent words must not be the only carrier of meaning.
- Source evidence from Maven:
  The reference shows primary sans display headings, serif emphasis in editorial moments, mono utility usage, and measured large-type hierarchy as documented in [design-system-audit](../research/maven-clinic/design-system-audit.md) and [page anatomy](../research/maven-clinic/page-anatomy.md).
- Implementation files:
  `src/design-system/tokens/semantic.css`, `src/design-system/layout/sections.css`, `docs/design-system/typography-semantics.md`
- Promotion status:
  Stable

## Layout, Rhythm, And Container Tokens

- Covered tokens:
  `--size-container-*`, `--size-hero-layout-*`, `--size-measure-hero-copy`, `--size-measure-service-card-content`, `--size-measure-support-copy`, `--size-carousel-progress-*`, `--size-panel-media*`, `--size-service-card-media-*`, `--size-page-margin*`, `--size-section-surface-frame-inset*`, `--size-section-break-overlap*`, `--size-carousel-card-*`, `--space-content-gap-*`, `--space-grid-gap*`, `--space-split-gap*`, `--space-rail-padding-block-end`, `--space-section-head-to-body*`, `--space-section-surface-gap*`, `--space-card-inset`, `--space-card-gap`, `--space-stat-*`, `--space-quote-*`, `--space-section-*`, `--layout-column-gutter*`, `--layout-grid-template-*`, `--layout-split-columns-*`, `--layout-editorial-*`, `--radius-section-surface*`, `--radius-section-break*`
- Purpose:
  Define the repeatable page rhythm that keeps sections coherent before component detail takes over.
- Usage rules:
  Use these tokens for section spacing, rounded section-surface frames, rounded section breaks, container widths, repeated measures, panel heights, rail behavior, interior rhythm, named column variants, and editorial span defaults.
- Do:
  Keep section-level spacing in layout tokens and component internals in component tokens.
- Don't:
  Do not hardcode bespoke margins for each section once a layout role already exists.
- Accessibility constraints:
  Rhythm must preserve readable grouping and prevent cramped content on small screens. Rails must still expose full cards without clipping essential content.
- Source evidence from Maven:
  Repeated spacing ramps, wide containers, rail widths, and section-space patterns are recorded in [design-system-audit](../research/maven-clinic/design-system-audit.md) and [layer-1-token-inventory](../research/maven-clinic/layer-1-token-inventory.md).
- Implementation files:
  `src/design-system/tokens/semantic.css`, `src/design-system/layout/sections.css`, `docs/design-system/section-layout-semantics.md`
- Promotion status:
  Stable

## Responsive Tokens

- Covered tokens:
  `--breakpoint-compact`, `--breakpoint-medium`, `--breakpoint-wide`, `--media-object-position-hero-medium`, `--media-object-position-hero-small`, `--media-hero-min-height*`, the `*-medium` and `*-small` responsive type and rail tokens
- Purpose:
  Make responsive behavior explicit instead of hiding breakpoint intent inside isolated media queries.
- Usage rules:
  Use these tokens to step type, crop media, tighten page margins, and resize rails before layout and components consume them.
- Do:
  Keep responsive changes token-driven where the same breakpoint logic affects more than one layer.
- Don't:
  Do not let components invent private breakpoint values for shared behavior.
- Accessibility constraints:
  Responsive remaps must preserve readable type sizes, safe tap targets, and subject visibility in media crops.
- Source evidence from Maven:
  The reference keeps hero imagery focused, rails usable, and headings measured across viewport sizes; our current interpretation is documented in [responsive behavior semantics](responsive-behavior-semantics.md) and derived from the local capture.
- Implementation files:
  `src/design-system/tokens/semantic.css`, `src/design-system/layout/sections.css`, `src/design-system/components/marketing.css`
- Promotion status:
  Candidate

## Motion Tokens

- Covered tokens:
  `--motion-duration-hover`, `--motion-duration-nav`, `--motion-duration-control`, `--motion-duration-carousel`, `--motion-duration-reveal`, `--motion-reveal-*`, `--motion-title-reveal-*`, `--motion-hover-lift-distance`, `--motion-nav-scroll-threshold`, `--motion-media-parallax-distance`, `--motion-ease-standard`
- Purpose:
  Provide one motion vocabulary for hover, reveal, sticky nav, carousel, and hero depth behavior.
- Usage rules:
  Use these tokens for calm sequencing and subtle UI energy, never for decorative chaos.
- Do:
  Reuse the same hover and reveal timing language across components.
- Don't:
  Do not introduce unrelated durations and offsets when a motion role already exists.
- Accessibility constraints:
  All motion roles must support reduced-motion fallbacks that still produce a complete interface.
- Source evidence from Maven:
  GSAP reveal, SplitText timing, ScrollTrigger behavior, and hero/service motion patterns are documented in [design-system-audit](../research/maven-clinic/design-system-audit.md).
- Implementation files:
  `src/design-system/tokens/semantic.css`, `src/design-system/components/marketing.css`, `src/design-system/motion/title-reveal.js`, `src/design-system/motion/marketing-interactions.js`
- Promotion status:
  Candidate
