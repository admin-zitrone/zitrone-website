# Layer 1 Primitives

Layer 1 is the raw material layer. It should contain values, not decisions about where those values are used.

## What Belongs Here

- Color scales
- Opacity values
- Font families
- Font weights
- Font sizes
- Line heights
- Letter spacing
- Spacing scale
- Radius scale
- Border widths
- Shadow values
- Motion durations and easing curves
- Breakpoints
- Raw size values
- Aspect ratios
- Z-index values

## What Does Not Belong Here

- `text-primary`
- `surface-page`
- `button-primary-background`
- `card-radius`
- `hero-padding`
- `nav-height`

Those belong to later layers because they describe meaning or components.

## Current Layer 1 Status

| Primitive family | Status |
| --- | --- |
| Color | Expanded first pass with starter contrast checks |
| Opacity | Expanded first pass |
| Font families | Open-source Google Fonts selected |
| Font weights | Expanded first pass |
| Font sizes | Expanded first pass with starter responsive specimens |
| Line heights | Expanded first pass |
| Letter spacing | Intentionally fixed at `0` for now |
| Spacing | Expanded first pass |
| Radius | Expanded first pass |
| Border widths | Started |
| Shadows | Started, conservative |
| Motion | Expanded first pass |
| Breakpoints | Started |
| Raw sizes | Started |
| Aspect ratios | Started |
| Z-index | Started |

## Robustness Rules

1. A primitive can be reused by many later layers, so do not name it after a component.
2. A primitive should be easy to compare against nearby values.
3. A primitive scale should avoid random gaps unless a reference value justifies the gap.
4. A primitive can be marked as reference-informed without being a final brand decision.
5. A primitive should not carry product meaning. Meaning starts in Layer 2.
6. A primitive needs provenance: observed, inferred, generated, candidate, or rejected.
7. A primitive needs a promotion gate before it becomes a semantic role.

## What We Should Not Do

- Do not say "Noto Serif Display is the hero font" in Layer 1.
- Do not say "green 700 is the button color" in Layer 1.
- Do not add a color just because it looks close enough.
- Do not keep two near-identical colors unless both have a documented reason.
- Do not let a one-page screenshot define the whole system.

Instead, document the hypothesis, test it in specimens, then promote it in Layer 2.

## Missing Before Layer 1 Is Stable

| Area | What is still missing | Why it matters |
| --- | --- | --- |
| Color extraction | Build a complete inventory of every observed reference color, then decide which colors become primitives. | Avoids inventing colors or keeping duplicate near-matches. |
| Color ramps | Fill or remove gaps in the natural, grey-green, teal, blue, purple, and yellow ramps. | Makes nearby values easier to compare and use consistently. |
| Contrast audit | Run contrast checks across raw color pairs without naming semantic roles yet. | Shows which primitives can safely support later text and surface roles. |
| Font source | Decide whether production should use a framework font loader or self-hosted font files. | Prevents the token system from depending on a runtime CDN call. |
| Type metrics | Check fallback behavior for the sans, serif, and monospace primitives. | Keeps layouts stable if the brand fonts fail or are replaced. |
| Type scale | Compare the raw font-size ramp against the reference at mobile and desktop widths. | Helps us avoid a scale that looks close in one viewport but breaks in another. |
| Spacing scale | Validate the spacing ramp against actual section, grid, and content measurements. | Keeps the rhythm grounded in the reference instead of arbitrary increments. |
| Size scale | Decide whether `--primitive-size-*` should stay separate from `--primitive-space-*`. | Avoids maintaining two scales that mean the same thing. |
| Shadow values | Extract shadow values from the reference and decide whether the current 0-3 scale is enough. | Prevents arbitrary elevation choices from leaking into components. |
| Motion values | Compare durations and easing against the reference interactions. | Keeps later motion roles consistent instead of taste-based. |
| Breakpoints | Derive breakpoints from observed layout changes, not generic defaults. | Makes responsive behavior match the source design system more closely. |
| Token format | Add a machine-readable token source if we need export to Figma, Style Dictionary, or another platform. | CSS is useful now, but a structured source becomes safer at scale. |
