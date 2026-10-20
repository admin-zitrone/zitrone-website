# Responsive Behavior Semantics

Status: in progress.

This file defines how the Maven-style rebuild adapts across breakpoints. The goal is not to say "mobile friendly." The goal is to define which layouts collapse, which type roles step down, when rails become named grids, how hero crops shift, and how action groups wrap.

## Why This Layer Exists

Responsive behavior is one of the clearest places where weak systems fall apart. If breakpoints only live inside scattered media queries, the page may still fit smaller screens, but it will not feel intentional or repeatable.

The rebuild needs stable answers to these questions:

- When does a split layout become one column?
- When does a card rail stop scrolling and become a grid?
- Which text roles lose size first?
- How does the hero keep the right subject in frame?
- When do action groups stay inline versus stack?

## Current Source

- Responsive token remaps: `src/design-system/tokens/semantic.css`
- Structural responsive rules: `src/design-system/layout/sections.css`
- Component responsive rules: `src/design-system/components/marketing.css`
- Live specimen: `preview/design-system/sections.html`

## Breakpoint Roles

| Role | Current breakpoint | What changes here |
| --- | --- | --- |
| Wide | `64rem` and up | Split layouts can become multi-column, mobile rails can become grids, stats can expand to full desktop density. |
| Medium | `48rem` to `63.99rem` | Navigation stacks, carousel controls change layout, proof/footer groups can move to two columns, hero crop shifts for tablet. |
| Compact | `40rem` to `47.99rem` | Display type steps further down, action groups begin stacking, page margins tighten. |
| Narrow | Below `40rem` | CTA groups stack fully, card heading/body relationships compress, sections use smallest rhythm pattern. |

## Section Collapse Rules

### Hero

- The hero remains a single text-over-media composition at all sizes.
- The content width tightens progressively through `.ds-hero-layout`.
- The hero media crop shifts at medium and compact sizes so the subject stays readable behind the copy.

### Services

- Services use a card rail below wide layouts.
- The rail becomes a grid at `64rem` through `data-grid-from="desktop"`.
- Carousel controls only matter below that grid handoff.

### Proof

- The proof section uses `data-collapse="desktop"` with `data-columns="5/7"` on the outer split.
- It stays one column below `64rem`.
- Its internal proof-card list uses `.ds-grid[data-columns="3-col"][data-columns-medium="2-col"]`, so it becomes:
  - `1` column by default
  - `2` columns at `48rem`
  - `3` columns at `64rem`

### Outcomes

- Stats use `.ds-grid[data-columns="4-col"][data-columns-medium="2-col"]` plus the `stats` semantic role.
- They become:
  - `1` column by default
  - `2` columns at `48rem`
  - `4` columns at `64rem`

### Stories

- The story section uses `data-collapse="desktop"` with `data-columns="4/8"`.
- It stays stacked below `64rem` so quote and support media remain readable.

### CTA

- CTA remains centered at all sizes.
- Action groups use `data-wrap="center-stack-compact"` so buttons stack only on compact/narrow screens.

### Footer

- Footer stays single-column by default.
- The top-level footer split becomes `4/8` only at desktop.
- Link groups use `.ds-grid[data-columns="3-col"][data-columns-medium="2-col"]`, so they become:
  - `2` columns at `48rem`
  - `3` columns at `64rem`

## Typography Step-Down Rules

Responsive type should be token-driven, not viewport-scaled.

| Role | Desktop | Medium | Compact/Narrow |
| --- | --- | --- | --- |
| Hero display | `--type-display-hero-size` desktop value | `--type-display-hero-size-medium` | `--type-display-hero-size-small` |
| Hero measure | `16ch` | `15ch` | `12ch` |
| Section heading | `--type-section-heading-size` desktop value | `--type-section-heading-size-medium` | `--type-section-heading-size-small` |
| Section heading measure | `20ch` | `18ch` | `16ch` |
| Card heading | Desktop value | Holds | `--type-card-heading-size-small` |
| Stat number | Desktop value | `--type-stat-number-size-medium` | `--type-stat-number-size-small` |
| Quote | Desktop value | Holds | `--type-quote-size-small` |
| Body large | Desktop value | Holds | Falls back to body size |
| Button text | Desktop value | Holds | `--type-button-size-small` |

## Card, Rail, and Grid Rules

### Rails

- `.ds-card-rail` is the mobile-first repeated-card pattern.
- A rail should stay a rail until the system explicitly promotes it to a grid through `data-grid-from`.
- Current rule:
  - `data-grid-from="desktop"` becomes a grid at `64rem`

### Structured Grids

- Use `.ds-grid[data-grid="stats"]` when the responsive column count must be explicit rather than auto-fit.
- Use `.ds-grid[data-columns="2-col|3-col|4-col"]` when the section truly needs a named explicit card or link grid.
- Use `.ds-grid[data-columns="editorial"]` when content needs a formal 12-column composition with `data-span` and `data-start` rules.
- Proof and footer are no longer allowed to hide their column counts in component CSS; they consume shared grid primitives now.

## Navigation Rules

- Desktop nav stays in one row.
- At medium and below:
  - the nav inner layout stacks
  - links become full-width and left-aligned
  - link gaps tighten for denser wrapping
- Sticky behavior remains active at all sizes.

This means the nav changes structure before the content areas do, which matches the way Maven-like pages preserve hero clarity.

## Hero Crop Rules

- Desktop hero uses the default hero focal point.
- Medium hero uses `--media-object-position-hero-medium`.
- Compact and narrow hero use `--media-object-position-hero-small`.
- Hero height also steps down from desktop to medium to compact so the opening screen stays purposeful instead of over-tall.

## CTA Group Wrap Rules

Use cluster wrap roles instead of ad hoc mobile overrides.

| Role | Behavior |
| --- | --- |
| `data-wrap="stack-compact"` | Inline until compact, then stack and stretch buttons full width |
| `data-wrap="center-stack-compact"` | Same stack rule, but keeps centered CTA intent |

Current usage:

- Hero actions: `stack-compact`
- Closing CTA actions: `center-stack-compact`

## Current Grammar Hooks

Classes:

- `.ds-hero-layout`
- `.ds-split`
- `.ds-grid`
- `.ds-card-rail`
- `.ds-cluster`

Attributes:

- `data-collapse="tablet|desktop"`
- `data-columns="2-col|3-col|4-col|6/6|5/7|4/8|editorial"`
- `data-columns-medium="2-col|3-col|4-col|6/6|5/7|4/8"`
- `data-grid="stats"`
- `data-grid-from="tablet|desktop"`
- `data-wrap="stack-compact|center-stack-compact"`
- `data-span="content|support|full|1..12"`
- `data-start="1..12"`

## Maven Mapping

1. Hero stays editorial and media-led at every width
2. Services stay swipeable until there is enough room for real cards
3. Proof and story sections refuse cramped two-column half-states
4. Stats gain density progressively instead of collapsing unpredictably
5. CTA actions only stack when that improves clarity

## What Still Comes Next

- Utility nav behavior if the final Maven recreation needs a header CTA
- Section-by-section breakpoint calibration against the exact live reference
- Responsive behavior for real story tab content once story switching is implemented
