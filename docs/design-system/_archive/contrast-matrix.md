# Contrast Matrix

This started as a Layer 1 audit for primitive color pairs. It now also tracks the Layer 2 semantic pairs that have been promoted into the current section specimen.

Passing as a raw pair means a pair can be considered later in Layer 2. It does not mean the pair is a final text, surface, action, or component decision until it appears in the semantic checks.

## Thresholds

| Threshold | Meaning |
| --- | --- |
| `3.0:1` | WCAG AA for large text and graphical objects. |
| `4.5:1` | WCAG AA for normal text. |
| `7.0:1` | WCAG AAA for normal text. |

## Starter Pairs

| Foreground primitive | Background primitive | Contrast | Layer 1 result |
| --- | --- | --- | --- |
| `green-950` | `natural-100` | `11.82:1` | AAA candidate for normal text. |
| `green-950` | `green-50` | `14.00:1` | AAA candidate for normal text. |
| `green-950` | `green-100` | `12.01:1` | AAA candidate for normal text. |
| `green-900` | `natural-100` | `7.06:1` | AAA candidate for normal text. |
| `green-700` | `natural-100` | `3.47:1` | Large-text-only candidate. |
| `neutral-900` | `natural-100` | `14.39:1` | AAA candidate for normal text. |
| `white` | `green-950` | `14.30:1` | AAA candidate for inverse text. |
| `white` | `green-900` | `8.53:1` | AAA candidate for inverse text. |
| `white` | `green-700` | `4.19:1` | Large-text-only candidate; do not use for normal text without adjustment. |
| `green-950` | `teal-50` | `13.39:1` | AAA candidate for normal text. |
| `green-950` | `blue-50` | `12.08:1` | AAA candidate for normal text. |
| `green-950` | `purple-50` | `12.03:1` | AAA candidate for normal text. |
| `green-950` | `yellow-100` | `12.85:1` | AAA candidate for normal text. |
| `white` | `teal-800` | `5.05:1` | AA candidate for normal text. |
| `white` | `blue-900` | `9.61:1` | AAA candidate for normal text. |
| `white` | `purple-900` | `12.30:1` | AAA candidate for normal text. |
| `white` | `yellow-800` | `4.00:1` | Large-text-only candidate; do not use for normal text without adjustment. |
| `green-950` | `green-500` | `9.57:1` | AAA candidate for normal text. |

## Early Implications

- `green-950` is a strong raw foreground candidate across light natural, green, and accent surfaces.
- `green-700` on light warm surfaces does not pass normal-text AA, even if it feels brand-correct visually.
- White on `green-700` is not strong enough for normal text. It may work for large text or bold display treatment, but Layer 2 must be careful.
- White on `yellow-800` is also large-text-only in this starter set.
- The light accent surfaces can support dark green foregrounds well, but this does not make them semantic alert, service, or category colors yet.

## Layer 2 Semantic Pair Checks

These checks belong to the current candidate roles documented in [Color semantics](color-semantics.md). They are listed here so future work can see which primitive failures drove the semantic decisions.

| Semantic pair | Foreground | Background | Contrast | Result |
| --- | --- | --- | --- | --- |
| Primary text on page | `green-950` | `natural-100` | `11.82:1` | AAA normal text. |
| Secondary text on page | `grey-green-700` | `natural-100` | `10.47:1` | AAA normal text. |
| Muted text on page | `grey-green-500` | `natural-100` | `4.16:1` | Do not use for normal body text on warm page surfaces. |
| Link text on page | `green-900` | `natural-100` | `7.06:1` | AAA normal text. |
| Link hover on page | `green-950` | `natural-100` | `11.82:1` | AAA normal text. |
| White text on brand section | `white` | `green-900` | `8.53:1` | AAA normal text. |
| White text on inverse section | `white` | `green-950` | `14.30:1` | AAA normal text. |
| Inverse secondary text on brand section | `green-100` | `green-900` | `7.17:1` | AAA normal text. |
| Focus ring on page | `green-900` | `natural-100` | `7.06:1` | Visible focus candidate. |
| Inverse focus ring on brand section | `green-500` | `green-900` | `5.71:1` | Visible focus candidate. |
| Primary action text | `white` | `green-900` | `8.53:1` | AAA normal text. |
| Primary action hover text | `white` | `green-950` | `14.30:1` | AAA normal text. |
| Secondary action text | `green-900` | `natural-50` | `8.31:1` | AAA normal text. |
| Secondary action hover text | `green-950` | `green-100` | `12.01:1` | AAA normal text. |
| Inverse primary action text | `green-950` | `white` | `14.30:1` | AAA normal text. |
| Inverse secondary action hover text | `green-950` | `white` | `14.30:1` | AAA normal text. |
| Disabled action text | `grey-green-700` | `natural-300` | `8.44:1` | Readable disabled action text. |
| Fertility tag text | `teal-800` | `teal-50` | `4.73:1` | AA normal text. |
| Maternity tag text | `blue-900` | `blue-50` | `8.12:1` | AAA normal text. |
| Parenting tag text | `purple-900` | `purple-50` | `10.34:1` | AAA normal text. |
| Menopause tag text | `green-950` | `yellow-50` | `13.11:1` | AAA normal text. |

## Missing Before Promotion

- Test every foreground candidate against every surface candidate.
- Include hover, focus, disabled, and border-adjacent states later in Layer 2.
- Test text at the actual font sizes and weights we plan to use, especially `300` light display text.
- Document any pair we reject so future component work does not rediscover the same failure.
