# Typography Semantics

This document defines the first Layer 2 typography behavior for the Maven rebuild. It translates raw font primitives into reusable type roles that sections and components can consume.

## Core Rule

Typography roles describe behavior, not only size. A role must include family, size, weight, line height, measure, and responsive step-downs when needed.

The Maven reference gives us three product typography families: primary sans, secondary display serif, and a code-like/mono utility face. In this rebuild, Open Sans stands in for the primary sans, Noto Serif Display stands in for the secondary display serif, and the system mono stack stands in for code or token documentation.

## Family Roles

| Token | Source | Use |
| --- | --- | --- |
| `--font-display` | Open Sans | Hero, section, and card display typography. |
| `--font-body` | Open Sans | Paragraphs, interface copy, nav, controls. |
| `--font-serif-accent` | Noto Serif Display | Stat numerals, quote text, CTA card display moments, and highlighted words inside large headings. |
| `--font-label` | Open Sans | Product labels, kickers, nav labels, pills. |
| `--font-code` | System monospace | Token names, code, diagnostics, documentation metadata. |

## Type Roles

| Role | Token family | Desktop | Medium | Compact/Narrow | Weight | Line height | Measure |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hero display | `--type-display-hero-*` | `font-size-9` | `font-size-8` | `font-size-6` | 300 | 1.1 | `16ch -> 15ch -> 12ch` |
| Section heading | `--type-section-heading-*` | `font-size-7` | `font-size-6` | `font-size-5` | 300 | 1.1 | `20ch -> 18ch -> 16ch` |
| Tight display heading | `--type-heading-measure-tight` | Role-specific | Role-specific | Role-specific | Role-specific | Role-specific | `11ch` |
| Wide heading | `--type-heading-measure-wide` | Role-specific | Role-specific | Role-specific | Role-specific | Role-specific | `35ch` |
| Card heading | `--type-card-heading-*` | `font-size-5` | Holds | `font-size-4` | 300 | 1.3 | `20ch -> 18ch` |
| Stat number | `--type-stat-number-*` | `font-size-9` | `font-size-8` | `font-size-6` | 400 | 1.1 | Component-owned |
| Quote | `--type-quote-*` | `font-size-5` | Holds | `font-size-4` | 400 | 1.1 | `35ch -> 24ch` |
| Body large | `--type-body-large-*` | `font-size-2` | Holds | Steps to body size | 400 | 1.5 | `45ch -> 34ch` |
| Body | `--type-body-*` | `font-size-1` | Holds | Holds | 400 | 1.5 | `50ch` |
| Label | `--type-label-*` | `font-size-0` | Holds | Holds | 600 | 1.3 | Short phrases only |
| Nav | `--type-nav-*` | `font-size-0` | Holds | Holds | 600 | 1.3 | Short labels only |
| Button | `--type-button-*` | `font-size-2` | Holds | `font-size-1` | 500 | 1.5 | One line |
| Accent word | `--type-accent-word-*` | Inherits parent size | Inherits parent size | Inherits parent size | 400 | Inherits parent | Short word or phrase |

## Responsive Rules

- Do not scale font size with viewport width.
- Choose a fixed semantic size for each breakpoint.
- Hero display steps from `font-size-9` to `font-size-8` at medium widths, then to `font-size-6` on compact/narrow screens.
- Section headings step from `font-size-7` to `font-size-6` at medium widths, then to `font-size-5` on compact/narrow screens.
- Card headings step from `font-size-5` to `font-size-4` on compact/narrow screens.
- Quote text steps from `font-size-5` to `font-size-4` on compact/narrow screens.
- Body-large copy becomes default body size on compact/narrow screens.
- Stat numbers step from `font-size-9` to `font-size-8` at medium widths, then to `font-size-6` on compact/narrow screens.
- Use `11ch`, `20ch`, and `35ch` measures intentionally. Tight is for punchy headings, default is for Maven-like section headlines, and wide is for complex product claims that would otherwise wrap too aggressively.

## Accent Word Rule

Yes, the word in the other font belongs in the design system. In the Maven reference, emphasized words inside large headings are marked as heading `strong` and styled with the secondary display serif, italic, and regular weight.

Use this pattern through `--type-accent-word-*` and `.ds-heading-accent`.

- Use it for one selected word or a very short phrase inside a large heading.
- Use it to create editorial rhythm, not to mark general importance.
- Do not use it in paragraphs, nav, labels, or buttons.
- Do not use bold as the visual treatment for this pattern; the serif italic is the treatment.

## Title Reveal Rule

Maven uses a word-split heading reveal for major headings. The reference starts the whole heading at `opacity: 0`, waits for fonts, splits text into words, then animates each word from opacity `0`, blur `5px`, and `y: 5px` to visible with a `0.03s` stagger. Reduced motion resolves immediately to visible text.

In this rebuild, the first reusable version is `data-title-reveal="words"` with `.ds-title-reveal` and `src/design-system/motion/title-reveal.js`. It is a progressive typography motion pattern: text remains readable without JavaScript, the helper waits for fonts, and `prefers-reduced-motion` resolves immediately to visible text.

## Usage Rules

- HTML heading level and visual type style are separate decisions. Use the right `h1` to `h6` for document structure, then apply the correct type role.
- Use `--font-label` for product labels and kickers. Use `--font-code` only for token names, code, or documentation metadata.
- Use `--font-serif-accent` for stat numerals, quote text, CTA card display moments, and highlighted heading words. It is not the default heading family.
- Keep letter spacing at `0`.
- Keep long paragraph measures near `45ch` to `70ch`; use shorter measures for display headlines.
- Do not use light weight for long body copy.
- Use light weight for large primary-sans display headings, regular weight for body and serif display, medium weight for buttons, and semibold for labels and nav.

## Implementation

- Semantic tokens live in `src/design-system/tokens/semantic.css`.
- Section-level consumption lives in `src/design-system/layout/sections.css`.
- Title reveal behavior lives in `src/design-system/motion/title-reveal.js`.
- Current Maven-like specimen lives in `preview/design-system/sections.html`.
