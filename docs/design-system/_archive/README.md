# Design-System Plan

This folder describes the design system we will build. It should stay readable and framework-neutral until implementation choices are confirmed.

## Structure

- [Layer architecture](layers.md): how primitives become pages.
- [Layer 1 primitives](layer-1-primitives.md): the raw token families we are refining first.
- [Layer 2 semantic token draft](layer-2-semantic-token-draft.md): how raw primitives become reusable page roles.
- [Color semantics](color-semantics.md): reusable surface, text, action, focus, overlay, and service category color roles.
- [Typography semantics](typography-semantics.md): reusable type roles, measures, weights, and responsive step-downs.
- [Section and layout semantics](section-layout-semantics.md): reusable section, container, grid, and heading roles for Zitrone marketing pages.
- [Responsive behavior semantics](responsive-behavior-semantics.md): explicit breakpoint, collapse, type step-down, crop, rail/grid, and CTA wrap rules.
- [Media semantics](media-semantics.md): reusable ratio, crop, focal-point, overlay, and decorative/content media rules.
- [Motion and interaction semantics](motion-interaction-semantics.md): reusable reveal, sticky-nav, hover, carousel, parallax, focus, and reduced-motion rules.
- [Component grammar](component-grammar.md): reusable marketing component families and the page grammar they create together.
- [Hero transfer model](hero-transfer-model.md): how we absorb an older hero into governed tokens, grammar, and content boundaries.
- [Primitive decision model](primitive-decision-model.md): how raw values become stable system decisions.
- [Foundation documentation model](foundation-documentation-model.md): how each foundation page should be structured.
- [Documentation and governance](documentation-governance.md): the required entry contract, promotion statuses, evidence rules, and ownership model.
- [Enforcement audit](enforcement-audit.md): the executable guardrails that protect the token/component contract from drift.
- [Promotion review: 2026-04-13](promotion-review-2026-04-13.md): the first stable-core promotion decisions for the design system.
- [Token model](token-model.md): how we name and promote values.
- [Token governance register](token-governance-register.md): governed token families with purpose, rules, evidence, implementation, and promotion status.
- [Component governance register](component-governance-register.md): governed component families with purpose, rules, evidence, implementation, and promotion status.
- [Foundations](foundations.md): color, type, spacing, radius, layout, motion.
- [Color foundation](foundations-color.md): raw color evidence, checks, and promotion gates.
- [Typography foundation](foundations-typography.md): raw type evidence, specimens, and promotion gates.
- [Contrast matrix](contrast-matrix.md): primitive and semantic color pair checks.
- [Responsive type specimens](responsive-type-specimens.md): fixed-width type checks before semantic type roles.
- [Component inventory](component-inventory.md): the component map we plan to implement.
- [Rebuild principles](rebuild-principles.md): how to learn from the reference without copying generated code.

Historical reference evidence is archived under [legacy research](../research/maven-clinic/README.md). The active system should be treated as Zitrone-owned and Zitrone-specific.

## Proposed Layers

1. Tokens: color, type, space, radius, shadow, border, z-index, motion.
2. Base: reset, font loading strategy, body text, link defaults, focus style.
3. Layout: container, section, stack, cluster, grid, full-bleed media.
4. Components: Button, Nav, Hero, ServiceCard, Carousel, Testimonial, CTA, Footer.
5. Sections/pages: composed from documented components.

## Build Order

1. Establish primitives.
2. Promote primitives into semantic tokens.
3. Define layout primitives.
4. Build one component at a time.
5. Compose sections from components.
6. Compose pages from sections.
