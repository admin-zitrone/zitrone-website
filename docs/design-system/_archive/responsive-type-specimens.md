# Responsive Type Specimens

This is a Layer 1 type audit. It checks raw font-size primitives inside fixed-width specimens before we create semantic type roles.

Layer 1 rule: do not use viewport-based font sizing. Later layers can select different fixed primitives at specific breakpoints.

## Starter Specimens

| Test width | Primitive | Family | Current observation |
| --- | --- | --- | --- |
| `20rem` | `font-size-8` / `3.875rem` | Open Sans | Needs careful phrase length control on narrow widths. |
| `32rem` | `font-size-10` / `5.125rem` | Open Sans | Better for short display phrases; risky for long headings. |
| `44rem` | `font-size-11` / `5.25rem` | Noto Serif Display | Promising as an accent specimen, but needs line-height and weight tests. |
| `52rem` | `font-size-12` / `10rem` | Open Sans | Best treated as an extreme display primitive, not a general heading size. |

## Promotion Gates

- Test real headline lengths, not only short labels.
- Test mobile, tablet, and desktop widths with fixed primitives selected per breakpoint.
- Compare Open Sans and Noto Serif Display at the same size and line height.
- Confirm fallback fonts do not cause layout shifts large enough to break sections.
- Keep letter spacing at `0` until a specimen proves a new raw value is necessary.

## What This Means For Replication

The Maven reference uses very large display sizes. We can replicate the feel only if we decide where those sizes survive responsively. That decision belongs in Layer 2 semantic type roles, not in the primitive tokens themselves.
