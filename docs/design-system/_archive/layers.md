# Layer Architecture

Design systems stay easier to grow when every layer has a narrow job.

## Layer 1: Primitives

Raw design ingredients.

Examples: green 950, space 4, radius 2, duration 3, sans display font family.

Primitives do not know about buttons, cards, heroes, forms, or pages.

## Layer 2: Semantic Tokens

Intentful aliases that explain how primitives are used.

Examples: page background, primary text, muted text, brand action background, focus ring, section padding.

Semantic tokens should answer: "what role is this value playing?"

Current working draft: [Layer 2 semantic token draft](layer-2-semantic-token-draft.md).

## Layer 3: Component Tokens

Small APIs for reusable components.

Examples: button primary background, button primary text, button border radius, card image radius, nav height.

Component tokens should map to semantic tokens where possible.

## Layer 4: Base Styles

Site-wide defaults.

Examples: body background, body text, heading rhythm, link focus, image display, reduced-motion behavior.

## Layer 5: Layout Primitives

Reusable geometry.

Examples: container, section, stack, cluster, split, responsive grid, full-bleed media.

## Layer 6: Components

Reusable interactive or visual units.

Examples: button, text link, nav item, logo list, program card, stat, testimonial, carousel controls.

## Layer 7: Sections

Page regions composed from layout primitives and components.

Examples: header, hero, services carousel, outcomes band, story/testimonial, CTA, footer.

## Layer 8: Pages

Purposeful compositions of sections, content, media, SEO metadata, and analytics boundaries.

## Promotion Rule

Start specific while researching. Promote a value upward only after it is reused or clearly belongs to the global language.
