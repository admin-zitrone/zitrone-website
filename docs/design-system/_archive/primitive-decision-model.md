# Primitive Decision Model

This is the operating model for Layer 1. It keeps the system scalable by separating facts, hypotheses, and rules.

## The Problem

If we say "use the serif for hero headlines" or "use green 700 for buttons" inside Layer 1, the design system becomes fragile. Those are not primitive facts. They are usage decisions.

Layer 1 should answer:

- What raw values exist?
- Where did each value come from?
- Is the value observed, inferred, generated, or rejected?
- Does the value belong in a clean scale?
- What needs to be tested before it can become semantic?

Layer 2 should answer:

- Which value is primary text?
- Which value is the page surface?
- Which font family is used for headings?
- Which color is used for action states?

## Primitive Maturity States

| State | Meaning | Can ship in CSS? | Can use in components? |
| --- | --- | --- | --- |
| `observed` | Extracted directly from the reference or selected from a verified source. | Yes | Only through semantic tokens later. |
| `inferred` | Chosen because it fills a scale gap or supports a likely need. | Yes, if documented | Not yet. |
| `generated` | Programmatically created from a seed value. | Only after visual review | Not yet. |
| `candidate` | Useful enough to inspect, not proven enough to rely on. | Yes in preview | Not yet. |
| `rejected` | Kept in research notes, not source tokens. | No | No. |

For this project, the current Layer 1 tokens are mostly `candidate` and `inferred`, not final system decisions.

## Promotion Gates

A primitive can move toward semantic usage only when it passes these checks:

1. Provenance: we know if it came from the reference, a font source, a measured pattern, or an intentional replacement.
2. Scale fit: it sits cleanly beside neighboring values.
3. Accessibility: color and typography values can pass their likely contrast and readability tests.
4. Responsiveness: type, spacing, and layout primitives work at mobile and desktop widths.
5. Implementation: the value can be expressed consistently in CSS and future token formats.
6. Naming: the primitive name stays raw; the usage name is created later as a semantic token.

## Font Decision Rules

These are not component rules yet. They are Layer 1 gates for deciding whether the font primitives are strong enough.

| Font primitive | Current source | Layer 1 gate | Layer 2 candidate hypothesis |
| --- | --- | --- | --- |
| `--primitive-font-family-sans-text` | Open Sans | Must prove readability for paragraphs, labels, and UI text at 14px, 16px, and 18px. | Likely maps to body and interface text. |
| `--primitive-font-family-sans-display` | Open Sans | Must prove it can carry larger display sizes without feeling generic or weak. | May map to headings if the serif is too expressive. |
| `--primitive-font-family-serif-display` | Noto Serif Display | Must prove it works in short editorial moments and does not hurt readability. | May map to accent words, quotes, or special display treatments. |
| `--primitive-font-family-monospace` | System monospace | Must remain technical and utilitarian. | Likely maps to token labels, code, or diagnostics only. |

The actual rule "use this font for this UI role" belongs in Layer 2, after specimens and content tests.

## Color Decision Rules

These are Layer 1 gates, not semantic roles.

| Color family | Current role in Layer 1 | What must be proven before semantic use |
| --- | --- | --- |
| Green | Brand-like family from the reference. | Which steps are observed, which are generated, and which pairs pass contrast. |
| Natural | Warm surface-like family. | Whether it is a complete ramp or only a few surface primitives. |
| Neutral | Utility neutral family. | Whether pure neutral and green-tinted neutral should be separate scales. |
| Grey-green | Muted support family. | Whether it is a real ramp or a set of extracted one-offs. |
| Accent colors | Sparse supporting families. | Which accents are actually needed and which are noise from the source. |

The actual rule "use this green for buttons" belongs in Layer 2 as a semantic action token, then Layer 3 as a component token.

## Replicable Workflow

1. Extract raw values from the reference into research notes.
2. Classify each value as observed, inferred, generated, candidate, or rejected.
3. Normalize values into families and scales.
4. Build specimens for each primitive family.
5. Run accessibility and responsiveness checks.
6. Freeze a stable primitive set.
7. Create semantic tokens from proven primitives.
8. Create component tokens from semantic tokens.

This prevents the project from becoming a copy of one page. It becomes a system that can generate many consistent pages.
