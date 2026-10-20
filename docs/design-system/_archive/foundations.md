# Foundations

This file documents Layer 1 only: raw values that can be reused later. It should explain the design intent clearly enough for a designer to critique it and the implementation path clearly enough for an engineer to ship it.

Source tokens live in `src/design-system/tokens/primitives.css`. Preview font loading lives in `src/design-system/styles/fonts.css`.

See `primitive-decision-model.md` for the rule that keeps this layer scalable: Layer 1 can define raw materials and test gates, but usage rules belong to Layer 2.

Observed Maven values are tracked in [Layer 1 token inventory](../research/maven-clinic/layer-1-token-inventory.md). This file documents the foundation we are building from that evidence.

Future foundation pages should follow [Foundation documentation model](foundation-documentation-model.md) so each section has a clear purpose, scope, specimens, checks, and promotion gates.

Deep dives:

- [Color foundation](foundations-color.md)
- [Typography foundation](foundations-typography.md)

## How Senior Designers Tackle Layer 1

World-class product and systems designers usually do not start by naming buttons, cards, or page sections. They start by proving the raw materials.

1. Collect reference values: colors, font sizes, spacing, radii, shadows, motion timings, and breakpoints.
2. Normalize them into scales: remove duplicates, group near-matches, and mark uncertain values.
3. Test the scale in specimens: ramps, type sheets, spacing sheets, motion samples, and contrast checks.
4. Keep names raw: `green-700`, `font-size-5`, `space-8`, not `cta-green`, `hero-title`, or `card-gap`.
5. Promote meaning later: only after primitives are stable should we create semantic tokens like `text-primary` or component tokens like `button-background`.

## Font Primitives

We are replacing the reference brand fonts with open-source Google Fonts for this rebuild. This is a source decision, not a usage rule:

| Primitive | Font | Why |
| --- | --- | --- |
| `--primitive-font-family-sans-display` | Open Sans | Reliable, readable, OFL licensed, broad language support, variable weight range. |
| `--primitive-font-family-sans-text` | Open Sans | Keeps the first pass practical and reduces font-pair complexity. |
| `--primitive-font-family-serif-display` | Noto Serif Display | Gives us a high-contrast display/accent family without depending on licensed brand fonts. |
| `--primitive-font-family-monospace` | System monospace stack | Used for token labels and technical specimens only. |

Sources:

- [Open Sans on Google Fonts](https://fonts.google.com/specimen/Open+Sans)
- [Open Sans Google Fonts metadata](https://github.com/google/fonts/blob/main/ofl/opensans/METADATA.pb)
- [Noto Serif Display on Google Fonts](https://fonts.google.com/noto/specimen/Noto+Serif+Display)
- [Noto Serif Display Google Fonts metadata](https://github.com/google/fonts/blob/main/ofl/notoserifdisplay/METADATA.pb)

Implementation note: the current preview loads fonts from Google Fonts CDN. For a production app, we should use the framework's optimized font loader if available, or self-host the font files to reduce external runtime dependency.

### Font Promotion Gates

| Question | Layer 1 answer we need | Why |
| --- | --- | --- |
| Is Open Sans strong enough for text? | Test 14px, 16px, and 18px in paragraphs, labels, and dense UI specimens. | Good fonts fail systems when small sizes are not validated. |
| Is Open Sans strong enough for display? | Test 38px, 48px, 76px, 82px, 84px, and 160px in real headline-length phrases. | A readable text face can feel plain at display sizes. |
| Is Noto Serif Display a system font or an accent? | Test short phrases, emphasized words, quotes, and two-line display samples. | Serif display faces can become noisy if overused. |
| Which weights are actually needed? | Compare 300, 400, 600, 700, 800 for Open Sans and 100-900 for Noto Serif Display. | Fewer weights improve performance and consistency. |
| Can we ship the font reliably? | Decide between CDN, framework loader, or self-hosting. | Design decisions must survive the actual app environment. |

Possible Layer 2 hypothesis, not a Layer 1 rule: Open Sans likely becomes body/interface text; Noto Serif Display likely becomes a restrained editorial accent. We should not encode that as a rule until specimens prove it.

## Type Scale

The type scale is more than font-size tokens. A complete Layer 1 typography foundation needs font families, supported weights, raw sizes, line heights, letter spacing, fallback behavior, and viewport test rules.

Responsive checks are tracked in [Responsive type specimens](responsive-type-specimens.md).

| Token | Value | Pixel equivalent | Notes |
| --- | --- | --- | --- |
| `--primitive-font-size-00` | `0.75rem` | 12px | Metadata, captions, dense labels. |
| `--primitive-font-size-0` | `0.875rem` | 14px | Small interface text. |
| `--primitive-font-size-1` | `1rem` | 16px | Safe base text size. |
| `--primitive-font-size-2` | `1.125rem` | 18px | Comfortable paragraph size. |
| `--primitive-font-size-3` | `1.25rem` | 20px | Small emphasis. |
| `--primitive-font-size-4` | `1.5rem` | 24px | Medium emphasis. |
| `--primitive-font-size-5` | `2.375rem` | 38px | Source label `h4`; raw display candidate only. |
| `--primitive-font-size-6` | `3rem` | 48px | Source label `h3`; raw display candidate only. |
| `--primitive-font-size-7` | `3.5rem` | 56px | Source label `h2`; raw display candidate only. |
| `--primitive-font-size-8` | `3.875rem` | 62px | Source label `h1`; raw display candidate only. |
| `--primitive-font-size-9` | `4.75rem` | 76px | Observed small display candidate. |
| `--primitive-font-size-10` | `5.125rem` | 82px | Source label `h1` in alternate scale; raw display candidate only. |
| `--primitive-font-size-11` | `5.25rem` | 84px | Observed medium display candidate. |
| `--primitive-font-size-12` | `10rem` | 160px | Observed maximum display candidate. |

Rules:

- Do not use viewport-based font sizing in Layer 1.
- Later layers can choose different fixed primitives at breakpoints.
- Validate `font-size-8` through `font-size-12` on narrow screens before they become semantic display roles.
- Keep letter spacing at `0` until we have a clear reason to add a new raw value.
- The reference CSS includes negative letter-spacing values, but this rebuild intentionally keeps Layer 1 letter spacing at `0` until we prove a different value is necessary and accessible.
- Test fallback fonts visually, because Open Sans and Noto Serif Display have different metrics.

## Font Weights

| Token | Value | Support note |
| --- | --- | --- |
| `--primitive-font-weight-thin` | `100` | Noto Serif Display supports this range; Open Sans does not. |
| `--primitive-font-weight-light` | `300` | Supported by both selected families. |
| `--primitive-font-weight-regular` | `400` | Supported by both selected families. |
| `--primitive-font-weight-medium` | `500` | Supported by both selected families. |
| `--primitive-font-weight-semibold` | `600` | Supported by both selected families. |
| `--primitive-font-weight-bold` | `700` | Supported by both selected families. |
| `--primitive-font-weight-extra-bold` | `800` | Supported by both selected families. |
| `--primitive-font-weight-black` | `900` | Noto Serif Display supports this range; Open Sans does not. |

## Line Height

| Token | Value | Use in Layer 1 |
| --- | --- | --- |
| `--primitive-line-height-none` | `1` | Single-line specimens and icons with text alignment tests. |
| `--primitive-line-height-tight` | `1.1` | Compact display specimen. |
| `--primitive-line-height-compact` | `1.2` | Multi-line display specimen. |
| `--primitive-line-height-regular` | `1.3` | Short readable text specimen. |
| `--primitive-line-height-relaxed` | `1.4` | Comfortable text specimen. |
| `--primitive-line-height-loose` | `1.5` | Longer readable text specimen. |

Layer 1 only defines the raw options. Later semantic type styles decide which line height belongs to headings, paragraphs, labels, or navigation.

## Color

The current color families are reference-informed, not final. They need a full extraction pass before they become stable.

| Family | Current state | Needed next |
| --- | --- | --- |
| Green | Expanded first pass. | Confirm each value is observed, useful, or intentionally generated. |
| Natural | Incomplete warm neutral ramp. | Fill or remove gaps and check against background use. |
| Neutral | Basic neutral ramp. | Separate pure neutrals from green-tinted neutrals if needed. |
| Grey-green | Sparse ramp. | Decide whether this is a full family or a few one-off primitives. |
| Accents | Observed teal, blue, purple, and yellow families. | Confirm whether each family should remain raw primitives once semantic usage is mapped. |

Technical rule: contrast checks happen before semantic naming. We can test raw color pairs, but we should not call a color `text-primary` until Layer 2.

Starter contrast checks are tracked in [Contrast matrix](contrast-matrix.md).

### Color Promotion Gates

| Question | Layer 1 answer we need | Why |
| --- | --- | --- |
| Is the value observed or generated? | Mark each color with provenance before treating it as stable. | Prevents a random sampled color from becoming a system dependency. |
| Is the family a true ramp? | Check whether each step has useful visual distance from its neighbors. | A scale with weak steps creates inconsistent choices. |
| Which pairs pass contrast? | Test raw foreground/background pairs before assigning semantic names. | Accessibility should shape semantic tokens, not happen after them. |
| Which values are duplicates? | Merge near-identical colors unless there is a clear reason to keep both. | Duplicate colors make a system hard to maintain. |
| Which accent families are actually needed? | Remove accent colors that do not support repeatable use. | Fewer, stronger accents scale better than many one-offs. |

Possible Layer 2 hypothesis, not a Layer 1 rule: the dark greens likely support text and inverse surfaces, the natural ramp likely supports page surfaces, and brighter greens likely support brand/action roles. We need contrast and usage tests before turning those into semantic tokens.

## Spacing

Current spacing uses a 4px-based rem scale:

`0, 1px, 4, 8, 12, 16, 24, 32, 48, 64, 80, 96, 120, 144, 160, 192, 240px`

Why it works as a first pass:

- It gives enough density for small interface spacing.
- It gives enough large values for editorial page rhythm.
- It remains easy to inspect and implement in CSS.

Needed next: measure actual reference sections, grids, and content offsets before promoting any spacing value into a semantic role.

## Shape And Borders

| Token group | Purpose |
| --- | --- |
| `--primitive-radius-*` | Raw corner radius options. |
| `--primitive-border-width-*` | Raw border widths. |

Implementation constraint to remember later: repeated UI elements in this project should stay at `8px` radius or less unless a later design decision explicitly justifies more. Layer 1 can still keep larger raw radius values for inspection.

## Shadow

The current shadow scale is conservative:

| Token | Purpose |
| --- | --- |
| `--primitive-shadow-0` | No shadow. |
| `--primitive-shadow-1` | Low depth specimen. |
| `--primitive-shadow-2` | Medium depth specimen. |
| `--primitive-shadow-3` | High depth specimen. |

Needed next: extract real shadows from the reference and test them on the actual surface colors. Shadows that work on white may fail on green or natural surfaces.

## Motion

| Token | Value |
| --- | --- |
| `--primitive-duration-0` | `0ms` |
| `--primitive-duration-1` | `120ms` |
| `--primitive-duration-2` | `200ms` |
| `--primitive-duration-3` | `320ms` |
| `--primitive-duration-4` | `500ms` |
| `--primitive-duration-5` | `800ms` |
| `--primitive-ease-linear` | `linear` |
| `--primitive-ease-1` | `cubic-bezier(0.2, 0, 0, 1)` |
| `--primitive-ease-in` | `cubic-bezier(0.4, 0, 1, 1)` |
| `--primitive-ease-out` | `cubic-bezier(0, 0, 0.2, 1)` |
| `--primitive-ease-in-out` | `cubic-bezier(0.4, 0, 0.2, 1)` |

Needed next: test motion on actual interactions before naming a duration as reveal, hover, carousel, or page transition.

## Breakpoints, Ratios, And Layers

| Token group | Purpose |
| --- | --- |
| `--primitive-breakpoint-*` | Raw viewport thresholds for later layout decisions. |
| `--primitive-ratio-*` | Raw aspect-ratio options. |
| `--primitive-z-index-*` | Raw layering values. |

Needed next: derive breakpoints from actual layout changes, not generic defaults. Ratios and z-index values should stay raw until we know which components or layouts need them.

## What Is Still Missing

- Complete the full color inventory and expand the contrast matrix beyond starter pairs.
- Expand responsive type specimens across mobile, tablet, and desktop widths.
- Real reference measurements for spacing and layout rhythm.
- Real reference shadow and motion extraction.
- Structured token export if we need Figma, Style Dictionary, or multi-platform output.
