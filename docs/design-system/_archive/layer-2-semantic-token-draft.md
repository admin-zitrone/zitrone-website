# Layer 2 Semantic Token Draft

Layer 2 gives product meaning to Layer 1 primitives. It is where raw values become roles like surface, text, action, section spacing, and display type.

This draft is based on the Maven page anatomy and the Layer 1 primitive audits. It should change as real section specimens prove or reject each role.

Governed token families and promotion statuses now live in [Token governance register](token-governance-register.md). This draft remains the role proposal and mapping layer.

## Promotion Rule

A primitive becomes a semantic token only when:

1. The role appears repeatedly in Maven-like page anatomy.
2. The value passes contrast or readability requirements for the role.
3. The role is stable enough that components can depend on it.
4. The token name describes purpose, not appearance.

Example: `--primitive-color-green-950` can become `--color-text-primary` because it repeatedly behaves like primary text on light/warm surfaces. `--primitive-color-green-700` should not automatically become a button background because white text on it is not strong enough for normal-size text.

## Color Roles

Detailed usage, state, category, and contrast rules: [Color semantics](color-semantics.md).

| Semantic token | Primitive value | Status | Usage rule |
| --- | --- | --- | --- |
| `--color-surface-page` | `--primitive-color-natural-100` | Candidate | Default warm page surface. |
| `--color-surface-navigation` | `--primitive-color-natural-100` | Candidate | Sticky navigation and page chrome surface. |
| `--color-surface-container` | `--primitive-color-white` | Candidate | Default component/container surface. |
| `--color-surface-container-muted` | `--primitive-color-natural-50` | Candidate | Quiet component/container surface. |
| `--color-surface-container-strong` | `--primitive-color-natural-200` | Candidate | Stronger warm component/container surface. |
| `--color-surface-section-warm` | `--primitive-color-natural-50` | Candidate | Light editorial section surface. |
| `--color-surface-section-warm-strong` | `--primitive-color-natural-200` | Candidate | Stronger warm section or media placeholder surface. |
| `--color-surface-section-soft` | `--primitive-color-green-50` | Candidate | Soft green section or supporting surface. |
| `--color-surface-section-brand` | `--primitive-color-green-900` | Candidate | Brand section background that must support white text. |
| `--color-surface-inverse` | `--primitive-color-green-950` | Candidate | Deep inverse section/background. |
| `--color-text-primary` | `--primitive-color-green-950` | Candidate | Primary text on light or warm surfaces. |
| `--color-text-secondary` | `--primitive-color-grey-green-700` | Candidate | Secondary body copy and supporting metadata on warm pages. |
| `--color-text-muted` | `--primitive-color-grey-green-500` | Candidate, limited | Quiet metadata on white containers or large non-critical text. Do not use for normal body text on `natural-100`. |
| `--color-text-inverse` | `--primitive-color-white` | Candidate | Text on inverse/brand surfaces. |
| `--color-text-inverse-secondary` | `--primitive-color-green-100` | Candidate | Supporting copy and kickers on dark green sections. |
| `--color-text-link` | `--primitive-color-green-900` | Candidate | Text links on light and warm surfaces. |
| `--color-text-link-hover` | `--primitive-color-green-950` | Candidate | Text link hover on light and warm surfaces. |
| `--color-text-action` | `--primitive-color-green-900` | Candidate | Text links and action labels on light surfaces. |
| `--color-text-accent` | `--primitive-color-green-700` | Candidate, limited | Large accents or non-critical emphasis. Avoid normal white-on-green action text. |
| `--color-border-subtle` | `--primitive-color-grey-green-200` | Candidate | Dividers and low-emphasis card borders. |
| `--color-border-default` | `--primitive-color-grey-green-300` | Candidate | Standard container and UI boundaries. |
| `--color-border-strong` | `--primitive-color-green-950` | Candidate | Interactive outlines and strong borders. |
| `--color-border-inverse` | `rgb(255 255 255 / 0.6)` | Candidate | Visible borders on dark green sections. |
| `--color-border-inverse-subtle` | `rgb(255 255 255 / 0.2)` | Candidate | Quiet dividers on dark green sections. |
| `--color-focus-ring` | `--primitive-color-green-900` | Candidate | Keyboard focus outline on light and warm surfaces. |
| `--color-focus-ring-inverse` | `--primitive-color-green-500` | Candidate | Keyboard focus outline on dark green surfaces. |

Action roles are split into primary, secondary, inverse primary, inverse secondary, and disabled token groups. Layer 3 button tokens consume those groups in `src/design-system/tokens/component.css`.

## Service Accent Roles

These are not generic decoration colors. They are reserved for Maven-like service/category identification until component testing proves the exact mapping. Each category has a vivid accent, a soft surface, a safe text color, and a border color.

| Token | Primitive value | Current intent |
| --- | --- | --- |
| `--color-accent-brand` | `--primitive-color-green-700` | Zitrone brand accent for large-only or non-text emphasis. |
| `--color-accent-service-dining` | `--primitive-color-teal-500` | Dining/service accent candidate. |
| `--color-accent-service-dining-surface` | `--primitive-color-teal-50` | Dining tag/container surface candidate. |
| `--color-accent-service-dining-text` | `--primitive-color-teal-800` | Dining tag text candidate. |
| `--color-accent-service-dining-border` | `--primitive-color-teal-700` | Dining tag border candidate. |
| `--color-accent-service-cafe` | `--primitive-color-blue-500` | Cafe/service accent candidate. |
| `--color-accent-service-cafe-surface` | `--primitive-color-blue-50` | Cafe tag/container surface candidate. |
| `--color-accent-service-cafe-text` | `--primitive-color-blue-900` | Cafe tag text candidate. |
| `--color-accent-service-cafe-border` | `--primitive-color-blue-700` | Cafe tag border candidate. |
| `--color-accent-service-pantry` | `--primitive-color-purple-500` | Pantry/service accent candidate. |
| `--color-accent-service-pantry-surface` | `--primitive-color-purple-50` | Pantry tag/container surface candidate. |
| `--color-accent-service-pantry-text` | `--primitive-color-purple-900` | Pantry tag text candidate. |
| `--color-accent-service-pantry-border` | `--primitive-color-purple-700` | Pantry tag border candidate. |
| `--color-accent-service-catering` | `--primitive-color-yellow-400` | Catering/service accent candidate. |
| `--color-accent-service-catering-surface` | `--primitive-color-yellow-50` | Catering tag/container surface candidate. |
| `--color-accent-service-catering-text` | `--primitive-color-green-950` | Catering tag text candidate because yellow text options are weaker. |
| `--color-accent-service-catering-border` | `--primitive-color-yellow-700` | Catering tag border candidate. |

## Typography Roles

The type system must select fixed primitives per breakpoint. It should not use viewport-scaled font sizes.

| Semantic token | Primitive value | Usage rule |
| --- | --- | --- |
| `--font-display` | `--primitive-font-family-sans-display` | Large Maven-like marketing headings. |
| `--font-body` | `--primitive-font-family-sans-text` | Body and interface text. |
| `--font-serif-accent` | `--primitive-font-family-serif-display` | Stat numerals, quote text, CTA card display moments, and highlighted heading words. |
| `--font-label` | `--primitive-font-family-sans-text` | Product labels, kickers, nav labels, and pills. |
| `--font-code` | `--primitive-font-family-monospace` | Token names, code, diagnostics, and documentation metadata. |
| `--type-display-hero-size` | `--primitive-font-size-9` | Desktop hero/page display candidate. |
| `--type-display-hero-size-small` | `--primitive-font-size-6` | Mobile hero/page display candidate. |
| `--type-heading-measure-tight` | `11ch` | Very short display heading measure. |
| `--type-heading-measure-default` | `20ch` | Default Maven-like section heading measure. |
| `--type-heading-measure-wide` | `35ch` | Wider complex claim heading measure. |
| `--type-section-heading-size` | `--primitive-font-size-7` | Desktop section heading candidate. |
| `--type-section-heading-size-small` | `--primitive-font-size-5` | Mobile section heading candidate. |
| `--type-card-heading-size` | `--primitive-font-size-5` | Desktop card and proof module headings. |
| `--type-card-heading-size-small` | `--primitive-font-size-4` | Mobile card and proof module headings. |
| `--type-stat-number-size` | `--primitive-font-size-9` | Desktop outcome/stat numbers in the serif display family. |
| `--type-stat-number-size-small` | `--primitive-font-size-6` | Mobile outcome/stat numbers. |
| `--type-quote-size` | `--primitive-font-size-5` | Desktop quote display text in the serif display family. |
| `--type-quote-size-small` | `--primitive-font-size-4` | Mobile quote display text. |
| `--type-body-large-size` | `--primitive-font-size-2` | Intro copy and larger section body. |
| `--type-body-size` | `--primitive-font-size-1` | Default paragraph and UI copy. |
| `--type-label-size` | `--primitive-font-size-0` | Labels, metadata, and small UI text. |
| `--type-button-size` | `--primitive-font-size-2` | Primary and secondary button labels. |
| `--type-accent-word-*` | `--font-serif-accent`, italic, 400 | Highlighted words inside large headings. |

Detailed typography behavior: [Typography semantics](typography-semantics.md).

## Layout Roles

| Semantic token | Value | Usage rule |
| --- | --- | --- |
| `--size-container-main` | `94.5rem` | Broad page container observed in reference values. |
| `--size-container-narrow` | `55rem` | Narrower editorial/product modules observed in reference values. |
| `--size-container-readable` | `50ch` | Long-form text measure. |
| `--size-container-heading` | `20ch` | Large headline measure. |
| `--size-page-margin` | `clamp(var(--primitive-space-5), 5vw, var(--primitive-space-9))` | Responsive page edge margin. This can scale layout, not type. Breakpoint overrides: `space-7` (3rem) at ≤64rem, `space-5` (1.5rem) at ≤40rem. |
| `--size-carousel-card-min` | `17rem` | Mobile card rail minimum item width. |
| `--size-carousel-card-max` | `23rem` | Mobile card rail maximum item width. |
| `--space-content-gap-tight` | `--primitive-space-2` | Compact content rhythm. |
| `--space-content-gap` | `--primitive-space-4` | Default stack rhythm. |
| `--space-content-gap-loose` | `--primitive-space-6` | Kicker, heading, copy, and CTA rhythm. |
| `--space-grid-gap` | `--primitive-space-5` | Standard grid/card gap. |
| `--space-grid-gap-large` | `--primitive-space-6` | Services and larger card group gap. |
| `--space-split-gap` | `--primitive-space-9` | Default split-section column gap. |
| `--space-split-gap-large` | `--primitive-space-11` | Feature and story split gap. |
| `--space-section-head-to-body` | `--primitive-space-9` | Gap between section header and the body/card area. |
| `--space-section-head-to-body-small` | `--primitive-space-7` | Mobile gap between section header and the body/card area. |
| `--space-section-small` | `--primitive-space-9` | Compact section rhythm. |
| `--space-section-medium` | `--primitive-space-11` | Default section rhythm. |
| `--space-section-large` | `--primitive-space-13` | Large hero/feature rhythm. |
| `--space-section-hero-block` | `--primitive-space-15` | Hero section vertical rhythm. |
| `--space-section-services-block` | `--primitive-space-13` | Services/platform band rhythm. |
| `--space-section-proof-block` | `--primitive-space-13` | Feature/proof split rhythm. |
| `--space-section-stats-block` | `--primitive-space-12` | Stats/outcomes rhythm. |
| `--space-section-story-block` | `--primitive-space-12` | Story/testimonial rhythm. |
| `--space-section-cta-block` | `--primitive-space-13` | Closing CTA rhythm. |
| `--space-section-footer-block` | `--primitive-space-9` | Footer rhythm. |

## Shape And Motion Roles

| Semantic token | Primitive value | Usage rule |
| --- | --- | --- |
| `--radius-control` | `--primitive-radius-2` | Buttons and form controls. |
| `--radius-card` | `--primitive-radius-2` | Cards and containers. |
| `--radius-media` | `--primitive-radius-2` | Image/media panels. |
| `--radius-pill` | `--primitive-radius-2` | Chips and tags for now; keep radius capped at 8px. |
| `--motion-duration-reveal` | `--primitive-duration-5` | Large content reveal candidate. |
| `--motion-duration-control` | `--primitive-duration-3` | Hover/focus/control transition candidate. |
| `--motion-title-reveal-*` | `--primitive-duration-5`, 30ms, 5px equivalent | Word-split title reveal candidate with reduced-motion fallback. |
| `--motion-ease-standard` | `--primitive-ease-1` | Default easing candidate. |

## Component Implications

Layer 3 should consume this layer instead of raw primitives:

- Buttons use action and control-radius roles.
- Cards use surface, border, card radius, and card heading roles.
- Sections use surface, section spacing, container, heading measure, and text roles.
- Service cards use service accent roles only for category identification.
- Stats use stat type roles, not arbitrary display sizes.
- Major headings can use `.ds-title-reveal` and `.ds-heading-accent` when the page pattern calls for Maven-like word reveal and secondary serif emphasis.

## Next Decisions

- Confirm mobile type mapping by replacing the weak Section-scale Specimen with real hero/services/stat section specimens.
- Broaden contrast checks beyond the starter action, focus, service accent, and inverse combinations now captured in [Color semantics](color-semantics.md).
- Refine the Noto Serif Display role after more story, CTA, and stat specimens prove its exact boundaries.
- Convert the page anatomy into section tokens before building components.

Current section/layout work: [Section and layout semantics](section-layout-semantics.md).
