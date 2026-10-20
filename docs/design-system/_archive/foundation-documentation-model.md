# Foundation Documentation Model

Use this model for every foundation page. The goal is to make the design system easy to scan, easy to implement, and hard to misuse.

The SLDS and Spectrum references are useful because they separate navigation, overview, rules, token lists, accessibility, and usage guidance. We should borrow that structure, not their visual identity, copy, or token names.

## Page Structure

Each foundation page should follow this order:

1. **Title**: the foundation name, such as Color or Typography.
2. **Short purpose**: one sentence explaining what the foundation controls.
3. **About**: why this foundation matters for the Maven rebuild.
4. **Layer scope**: what belongs in Layer 1, and what must wait for Layer 2 or Layer 3.
5. **Principles**: short rules that explain how to make decisions.
6. **Primitive inventory**: raw tokens, values, source status, and notes.
7. **Specimens**: visual tests that show the primitives in real conditions.
8. **Accessibility checks**: contrast, legibility, motion safety, fallback behavior, or other relevant checks.
9. **Governance entry**: purpose, usage rules, do/don't guidance, source evidence, implementation file, and promotion status.
10. **Promotion gates**: what must be true before a primitive becomes a semantic token.
11. **Open questions**: what still needs evidence before the foundation is stable.

## Navigation Model

Each preview should include a left navigation for:

- Overview
- Color
- Contrast
- Typography
- Responsive type
- Space
- Shape, shadow, motion
- Layout constants

This gives the system a stable map as it grows. Later, when Layer 2 starts, the same pattern can become:

- Semantic color
- Semantic typography
- Semantic spacing
- Layout roles
- Component token roles

## Layer 1 Writing Rules

- Say "raw primitive" when a value has no assigned meaning yet.
- Say "observed" only when the value exists in the Maven reference inventory.
- Say "candidate" when a value is generated to fill a scale gap.
- Avoid semantic words like button, link, page surface, alert, success, or hero unless the sentence explicitly says that those belong to a later layer.
- Pair every broad statement with an implementation consequence.

## Example: Typography

Purpose:
Typography controls hierarchy, readability, brand voice, and content density.

Layer 1 scope:
Font families, weights, sizes, line heights, letter spacing, fallback stacks, and raw specimens.

Not Layer 1:
Heading levels, body styles, caption styles, button type, navigation type, and editorial accent usage.

Promotion gate:
A type primitive can become a semantic style only after we test it across viewport widths, phrase lengths, weights, line heights, and fallback fonts.

## Example: Color

Purpose:
Color controls hierarchy, brand recognition, surface depth, and emphasis.

Layer 1 scope:
Raw ramps, provenance, contrast ratios, alpha values, and family completeness.

Not Layer 1:
Text roles, surface roles, action roles, link roles, service-category roles, and feedback roles.

Promotion gate:
A color primitive can become a semantic color only after we know its provenance, contrast pairings, ramp relationship, and whether it represents repeated Maven behavior.
