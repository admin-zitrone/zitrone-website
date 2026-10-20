# Color Foundation

Color controls hierarchy, brand recognition, surface warmth, service accent moments, and accessibility.

## About

The Maven reference relies on warm natural surfaces, deep green text, brighter green emphasis, and a small set of accent families. Our rebuild should mirror that behavior in real page sections, not only in isolated swatches.

This page documents Layer 1 color only: raw values, provenance, contrast checks, and promotion gates. Semantic roles such as page surface, text primary, button background, link, status, or service category belong to Layer 2.

Layer 2 color rules are documented in [Color semantics](color-semantics.md).

## Layer Scope

Belongs in Layer 1:

- Raw color ramps.
- Observed reference values and candidate gap-fill values.
- Contrast pair evidence.
- Alpha and overlay inventory.
- Notes about family completeness.

Does not belong in Layer 1:

- `text-primary`
- `surface-page`
- `button-background`
- `link-active`
- service-category color roles
- feedback roles such as success, warning, error, or info

## Principles

- Mirror Maven through repeated behavior, not one-off screenshots.
- Keep names raw until the value earns a semantic role.
- Treat bright colors as accents until evidence proves a broader role.
- Always pair color decisions with contrast evidence.
- Keep generated colors marked as candidates until we prove they are needed.

## Primitive Inventory

Detailed provenance is tracked in [Layer 1 token inventory](../research/maven-clinic/layer-1-token-inventory.md).

| Family | Current primitives | Source status | Current interpretation |
| --- | --- | --- | --- |
| Green | `50`, `100`, `200`, `300`, `400`, `500`, `600`, `700`, `800`, `900`, `950` | Mixed observed and candidate | Core Maven brand ramp. |
| Natural | `50`, `100`, `200`, `300`, `400` | Mixed observed and candidate | Warm surface ramp. |
| Neutral | `50` through `950`, with gaps | Candidate | Utility neutrals and text testing. |
| Grey-green | `100`, `200`, `300`, `500`, `700` | Candidate | Muted support text and divider candidates. |
| Teal | `50`, `500`, `700`, `800` | Observed | Accent family from the reference. |
| Blue | `50`, `500`, `700`, `900` | Observed | Accent family from the reference. |
| Purple | `50`, `500`, `700`, `900` | Observed | Accent family from the reference. |
| Yellow | `50`, `100`, `400`, `500`, `600`, `700`, `800` | Observed | Accent family from the reference. |

## Specimens

Current preview specimens:

- Raw color ramps in [Layer 1 primitive preview](../../preview/design-system/primitives.html#color).
- Raw contrast cards in [Layer 1 primitive preview](../../preview/design-system/primitives.html#contrast).
- Maven-like page mirror in [Layer 1 primitive preview](../../preview/design-system/primitives.html#page-mirror).
- Current semantic section specimen in [Layer 2 section specimens](../../preview/design-system/sections.html).

The page mirror matters because a color that works in a swatch can fail in a real section once type scale, spacing, media, and surface depth are combined.

## Accessibility Checks

Starter checks are tracked in [Contrast matrix](contrast-matrix.md).

Important current findings:

| Pair | Contrast | Meaning before promotion |
| --- | --- | --- |
| `green-950` on `natural-100` | `11.82:1` | Strong dark-on-warm candidate. |
| `green-900` on `natural-100` | `7.06:1` | Strong dark-on-warm candidate. |
| `green-700` on `natural-100` | `3.47:1` | Large-text-only candidate. |
| `white` on `green-700` | `4.19:1` | Large-text-only candidate. |
| `white` on `yellow-800` | `4.00:1` | Large-text-only candidate. |

## Promotion Gates

A color primitive can become a semantic color only when:

- Its source state is documented as observed, candidate, generated, or rejected.
- Its contrast pairings are known for normal text and large text.
- Its role appears repeatedly in Maven-like page specimens.
- It does not duplicate a nearby color without a documented reason.
- It can support hover, focus, disabled, and border-adjacent states later.

## Open Questions

- Should alpha green and alpha black values become raw color tokens or opacity tokens?
- Do the generated green and natural ramp gaps survive real page specimens?
- Which accent families remain brand accents, and which become service or content-category roles in Layer 2?
- Does Maven’s warm natural surface need more steps before page sections are built?
