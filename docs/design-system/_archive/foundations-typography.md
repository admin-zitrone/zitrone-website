# Typography Foundation

Typography controls hierarchy, readability, editorial voice, content density, and how calm the Maven rebuild feels.

## About

The Maven reference uses very large display sizes, light weights, tight display rhythm, and a serif accent family. Our rebuild replaces licensed reference fonts with Open Sans and Noto Serif Display so the system is implementable while preserving the broad typographic behavior.

This page documents Layer 1 typography only: raw families, weights, sizes, line heights, letter spacing, fallback behavior, and specimens. Semantic type styles such as heading, body, caption, button, navigation, and editorial accent belong to Layer 2.

## Layer Scope

Belongs in Layer 1:

- Font family primitives.
- Font weight primitives.
- Raw font-size scale.
- Raw line-height scale.
- Letter-spacing primitives.
- Fallback font behavior.
- Responsive type specimens.

Does not belong in Layer 1:

- heading levels
- display styles
- body text roles
- caption styles
- button type
- navigation type
- quote or editorial accent rules

## Principles

- Use raw sizes from the Maven reference before inventing a new scale.
- Test phrase length and fallback metrics before assigning any size to a semantic role.
- Keep letter spacing at `0` unless a specimen proves a new value is necessary.
- Treat `font-size-12` as an extreme display primitive until it survives real section tests.
- Preserve readability before trying to match a screenshot exactly.

## Primitive Inventory

Detailed provenance is tracked in [Layer 1 token inventory](../research/maven-clinic/layer-1-token-inventory.md).

| Primitive group | Current values | Source status | Current interpretation |
| --- | --- | --- | --- |
| Sans display | Open Sans | Replacement | Practical substitute for the reference primary display font. |
| Sans text | Open Sans | Replacement | Practical substitute for interface and paragraph text. |
| Serif display | Noto Serif Display | Replacement | Practical substitute for the reference serif accent family. |
| Monospace | system monospace stack | Replacement | Technical labels and specimens. |
| Weights | `100`, `300`, `400`, `500`, `600`, `700`, `800`, `900` | Mixed observed and font-supported | Raw range; later layers should reduce this. |
| Sizes | `0.75rem` through `10rem` | Mixed observed and candidate | Maven-informed scale with extreme display values. |
| Line heights | `1`, `1.1`, `1.2`, `1.3`, `1.4`, `1.5` | Observed | Raw line-height options. |
| Letter spacing | `0` | Intentional rebuild rule | Negative values observed but not adopted yet. |

## Font Size Scale

| Token | Value | Pixel equivalent | Layer 1 note |
| --- | --- | --- | --- |
| `font-size-00` | `0.75rem` | 12px | Candidate for metadata. |
| `font-size-0` | `0.875rem` | 14px | Observed small text. |
| `font-size-1` | `1rem` | 16px | Observed small heading/base text. |
| `font-size-2` | `1.125rem` | 18px | Observed button-small value. |
| `font-size-3` | `1.25rem` | 20px | Observed medium text. |
| `font-size-4` | `1.5rem` | 24px | Observed large text. |
| `font-size-5` | `2.375rem` | 38px | Observed source `h4` label, still raw. |
| `font-size-6` | `3rem` | 48px | Observed source `h3` label, still raw. |
| `font-size-7` | `3.5rem` | 56px | Observed source `h2` label, still raw. |
| `font-size-8` | `3.875rem` | 62px | Observed source `h1` label, still raw. |
| `font-size-9` | `4.75rem` | 76px | Observed display-small value. |
| `font-size-10` | `5.125rem` | 82px | Observed alternate `h1` value. |
| `font-size-11` | `5.25rem` | 84px | Observed display-medium value. |
| `font-size-12` | `10rem` | 160px | Observed maximum display value. |

## Specimens

Current preview specimens:

- Raw type scale in [Layer 1 primitive preview](../../preview/design-system/primitives.html#typography).
- Responsive type checks in [Layer 1 primitive preview](../../preview/design-system/primitives.html#responsive-type).
- Maven-like page mirror in [Layer 1 primitive preview](../../preview/design-system/primitives.html#page-mirror).

The page mirror matters because Maven’s typography depends on section scale. A display size that looks balanced in a token row can become unusable when paired with real copy, media, and page margins.

## Accessibility Checks

- Test `300` light text carefully, especially when paired with lower-contrast colors.
- Keep paragraph widths readable; target roughly `45ch` to `70ch` in content-heavy blocks.
- Test fallback fonts because Open Sans, Noto Serif Display, Arial, and Georgia have different metrics.
- Do not rely on negative tracking to create brand feel until we have a legibility proof.
- Avoid viewport-based font sizing in Layer 1.

## Promotion Gates

A type primitive can become a semantic type style only when:

- It has been tested at mobile, tablet, and desktop section widths.
- It has been tested with real phrase lengths, not only labels.
- Its line-height and weight pairings are documented.
- Its fallback metrics do not break the section layout.
- Its color pair passes the needed contrast threshold.

## Open Questions

- Is Open Sans strong enough for Maven-like display moments, or should display lean more on Noto Serif Display?
- Which weights can be removed from implementation to improve performance?
- Does `font-size-12` belong only to rare campaign/editorial moments?
- Which sizes become semantic type roles in Layer 2?
