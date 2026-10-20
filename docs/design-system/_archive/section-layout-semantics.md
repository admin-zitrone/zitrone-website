# Section And Layout Semantics

This document defines the first reusable section and layout roles for the Maven rebuild. It sits after Layer 2 semantic tokens and before full components.

The goal is to make page specimens behave like the Maven reference: full-width themed sections, constrained containers, measured headlines, readable body copy, explicit column variants, and CTA clusters.

## Implementation Files

- Source layout CSS: `src/design-system/layout/sections.css`
- Specimen styles: `src/design-system/styles/sections-preview.css`
- Preview: `preview/design-system/sections.html`

## Core Rule

Sections own background and vertical rhythm. Rounded section breaks and framed section surfaces are optional transition devices. Containers own width. Layout primitives own columns and gutters. Components own their internal details.

This keeps the system scalable because a services section, stats section, proof band, and footer can share layout behavior without sharing component styling.

## Rhythm Model

Maven-like pages need a small number of repeatable rhythm roles, not a unique margin for every block.

| Rhythm role | Token | Current value | Use |
| --- | --- | --- | --- |
| Tight content gap | `--space-content-gap-tight` | `space-2` | Tags, compact metadata, service tag to heading. |
| Default content gap | `--space-content-gap` | `space-4` | Standard stacked content. |
| Loose content gap | `--space-content-gap-loose` | `space-6` | Kicker, heading, copy, and CTA rhythm. |
| Cluster gap | `--space-cluster-gap` | `space-3` | Button groups and inline nav clusters. |
| Grid gap | `--space-grid-gap` | `space-5` | Stats and standard cards. |
| Large grid gap | `--space-grid-gap-large` | `space-6` | Services and bigger card groups. |
| Split gap | `--space-split-gap` | `space-9` | Default two-column section gap. |
| Large split gap | `--space-split-gap-large` | `space-11` | Feature and story splits. |
| Section head to body | `--space-section-head-to-body` | `space-9` | Gap from centered section header to cards/stats. |
| Mobile section head to body | `--space-section-head-to-body-small` | `space-7` | Smaller gap from section header to body on narrow screens. |
| Section surface gap | `--space-section-surface-gap` | `space-2` | Vertical breathing room between stacked rounded section surfaces. |
| Section break overlap | `--size-section-break-overlap` | `clamp(3rem, 6vw, 5rem)` | How far a rounded bottom section visually drops into the next section. |
| Card inset | `--space-card-inset` | `space-5` | Service/card interior padding. |

## Layout Roles

| Role | CSS API | What it controls |
| --- | --- | --- |
| Section | `.ds-section` | Full-width band, tone, vertical spacing. |
| Section band | `.ds-band` | Shared background owner for one or more adjacent sections before the next surface begins. |
| Section surface | `.ds-section-surface` | Rounded bento-like inner surface that carries section tone inside page margins. |
| Rounded break | `.ds-section[data-break="rounded-bottom"]` | Full-width section with oversized bottom radius that visually overlaps the next section background. |
| Top break | `.ds-section[data-break="rounded-top"]` | Full-width section with oversized top radius that visually sits over the previous section background. |
| Band rounded break | `.ds-band[data-break="rounded-bottom"]` | Shared outgoing background with oversized lower corners that sits above the next section. |
| Band top break | `.ds-band[data-break="rounded-top"]` | Shared incoming background with oversized upper corners that sits over the previous section. |
| Container | `.ds-container` | Main page width and page margin. |
| Narrow container | `.ds-container[data-width="narrow"]` | Content that should not fill the full broad page container. |
| Readable container | `.ds-container[data-width="readable"]` | Narrow text-first content. |
| Bleed | `.ds-bleed` | Full viewport-width content inside a constrained parent. |
| Stack | `.ds-stack` | Vertical rhythm between related elements. |
| Cluster | `.ds-cluster` | Wrapping horizontal groups such as CTA buttons. |
| Split | `.ds-split` | Two-column desktop layout that collapses to one column. |
| Grid | `.ds-grid` | Responsive card/stat/service grids. |
| Card rail | `.ds-card-rail` | Mobile horizontal card rail that becomes a grid on desktop. |
| Column variant | `data-columns="2-col|3-col|4-col|6/6|5/7|4/8|editorial"` | Named explicit column structure. |
| Medium override | `data-columns-medium="2-col|3-col|4-col|6/6|5/7|4/8"` | Earlier breakpoint promotion when the section needs it. |
| Gutter override | `data-gutter="tight|loose"` | Shared column-gap contract across grid, split, and rail. |
| Column span | `data-span="content|support|full|1..12"` | Child span rule inside editorial columns. |
| Column start | `data-start="1..12"` | Child start rule inside editorial columns. |
| Heading | `.ds-heading` | Maven-like display heading role. |
| Copy | `.ds-copy` | Larger section copy with readable measure. |

## Container Roles

| Role | Token | Current value | Use |
| --- | --- | --- | --- |
| Main container | `--size-container-main` | `94.5rem` | Broad page sections. |
| Narrow container | `--size-container-narrow` | `55rem` | Shorter editorial or product copy modules. |
| Readable container | `--size-container-readable` | `50ch` | Text-first CTA and long-form content. |
| Section surface frame inset | `--size-section-surface-frame-inset` | `space-3` | Outer inset that keeps rounded section surfaces off the viewport edge. |
| Page margin | `--size-page-margin` | `clamp(space-5, 5vw, space-9)` | Responsive page edge spacing. Layout may scale with viewport; type may not. Breakpoint overrides: `space-7` at ≤64rem, `space-5` at ≤40rem. |
| Carousel card min | `--size-carousel-card-min` | `17rem` | Small mobile card rail floor. |
| Carousel card max | `--size-carousel-card-max` | `23rem` | Mobile card rail ceiling. |

## Column And Gutter Tokens

| Token | Current value | Use |
| --- | --- | --- |
| `--layout-column-gutter-tight` | `space-content-gap` | Tight repeated-card or grouped-footer columns. |
| `--layout-column-gutter` | `space-grid-gap` | Default grid/split gutter. |
| `--layout-column-gutter-loose` | `space-grid-gap-large` | Airier split and section-level column separation. |
| `--layout-grid-template-2-col` | `repeat(2, minmax(0, 1fr))` | Standard two-column grid. |
| `--layout-grid-template-3-col` | `repeat(3, minmax(0, 1fr))` | Proof/footer/service group grids. |
| `--layout-grid-template-4-col` | `repeat(4, minmax(0, 1fr))` | Outcome/stat or service desktop grids. |
| `--layout-split-columns-6-6` | `6fr / 6fr` | Symmetric split. |
| `--layout-split-columns-5-7` | `5fr / 7fr` | Copy-led feature split. |
| `--layout-split-columns-4-8` | `4fr / 8fr` | Narrow intro plus broader content/support column. |
| `--layout-grid-template-editorial` | `repeat(12, minmax(0, 1fr))` | Formal editorial/content grid. |
| `--layout-editorial-content-span` | `7` | Default primary content span inside editorial grid. |
| `--layout-editorial-support-span` | `5` | Default secondary/support span inside editorial grid. |
| `--radius-section-surface` | `2rem` | Rounded band radius for section-to-section background transitions. |
| `--radius-section-break` | `clamp(3rem, 7vw, 4.5rem)` | Bottom radius of the rounded section break. |
| `--image-surface-section-*` | Tone-based layered fills | Optional layered fills for rounded section surfaces, so the band can feel more like a surfaced bento than a flat paint stripe. |

## Section Surface Frames

Use `data-surface="frame"` plus an inner `.ds-section-surface` when a section should read as a rounded band rather than a full-bleed page stripe.

- The outer `.ds-section` still owns tone and pattern spacing.
- The inner `.ds-section-surface` paints that tone on a rounded surface with consistent outer inset.
- The inner `.ds-section-surface` can carry either a flat fill or a layered fill through the section-surface background-image tokens.
- Containers and layout primitives still live inside the surface.
- Adjacent framed sections collapse to a single inter-section gap so the page reads as a calm stack of bentos instead of unrelated cards.

This is the right tool when the reference page transitions between colors through rounded surfaces instead of edge-to-edge stripes.

## Rounded Section Break

Use `data-break="rounded-bottom"` when a full-width section should end with oversized bottom corners and visually extend into the next section.

```html
<section class="ds-section" data-tone="warm" data-pattern="proof" data-break="rounded-bottom">
  <div class="ds-container" data-width="narrow">...</div>
</section>
```

- The section itself keeps its full-width background.
- The bottom-left and bottom-right radius become intentionally oversized.
- The section gets extra bottom depth and a negative bottom margin so it visually sits over the next section.
- The next section starts underneath as a normal full-width section.
- Use this when the reference shows a rounded section break, not an inner bento or card.

If multiple adjacent sections share the same outgoing surface, the preferred contract is a band that owns both the color and the curve:

```html
<div class="ds-band" data-tone="soft" data-break="rounded-bottom">
  <section class="ds-section" data-pattern="stats" data-surface="frame">...</section>
  <section class="ds-section" data-pattern="proof">...</section>
</div>

<section class="ds-section" data-tone="brand" data-pattern="story">...</section>
```

- The outgoing surface owns the rounded lower edge.
- Only the lower edge bends. The top edge of the next section stays flat.
- The next section should not fake the transition. It only provides the background that shows through below.
- Custom themed sections should set `--section-background` or `--band-background`, not a raw `background`, so the break logic keeps working.

Use `data-break="rounded-top"` when the incoming section should be the one that overlaps upward and owns the seam instead.

```html
<section class="ds-section" data-tone="brand" data-pattern="story" data-break="rounded-top">
  <div class="ds-container">...</div>
</section>
```

- This is the inverse transition and should be treated as the exception, not the default.
- The incoming section owns the rounded upper edge and sits on top of the previous section.
- Use this when the reference clearly shows the next surface rising into the previous one rather than the previous one dropping down.

## Named Column Variants

The system now supports a small official set of named column variants instead of burying ratios inside individual sections.

| Variant | API | Use |
| --- | --- | --- |
| Two column | `.ds-grid[data-columns="2-col"]` | Balanced repeated-card groups or secondary content columns. |
| Three column | `.ds-grid[data-columns="3-col"]` | Proof cards, footer groups, or compact feature lists. |
| Four column | `.ds-grid[data-columns="4-col"]` | Desktop stat grids and repeated service cards. |
| Six / six | `.ds-split[data-columns="6/6"]` | Symmetric editorial or product split. |
| Five / seven | `.ds-split[data-columns="5/7"]` | Feature/proof split where copy leads and media follows. |
| Four / eight | `.ds-split[data-columns="4/8"]` | Intro + broader support area, especially footer or story layouts. |
| Editorial | `.ds-grid[data-columns="editorial"]` | Formal 12-column content/support composition with span/start rules. |

## Editorial And Content Column System

Use the editorial grid when a section needs more control than a simple split or equal-card grid.

- The editorial grid uses 12 equal columns.
- Primary content usually spans `7` columns from start `1`.
- Supporting content usually spans `5` columns from start `8`.
- Use `data-span="content"` and `data-span="support"` for the default content/support pairing.
- Use `data-span="1..12"` and `data-start="1..12"` only when a section needs a more custom composition.
- Use `data-span="full"` when a child should break across the whole editorial width.

This gives us a formal content column system without forcing every section into a generic 50/50 split.

## Proof And Footer Decision

Proof and footer layouts are now treated as shared layout primitives for their column behavior.

- `ds-proof-grid` and `ds-footer-groups` keep their semantic names because they describe content meaning.
- Their column counts now come from shared `.ds-grid` variants instead of section-specific `grid-template-columns` rules.
- `ds-footer-grid` now consumes the shared `.ds-split[data-columns="4/8"]` layout contract for the top-level brand/navigation split.

So the decision is: proof and footer remain section patterns semantically, but their columns and gutters belong to the shared layout layer.

## Tone Roles

| Section tone | Token source | Use |
| --- | --- | --- |
| `warm` | `--color-surface-section-warm` | Editorial or proof sections on light warm surfaces. |
| `soft` | `--color-surface-section-soft` | Supporting data or gentle green sections. |
| `brand` | `--color-surface-section-brand` | Dark brand bands with inverse text. |
| `inverse` | `--color-surface-inverse` | Deep conversion, hero, or high-emphasis sections. |

## Size Roles

Generic sizes still exist, but page sections should prefer pattern roles when we know the section type.

| Section pattern | Token source | Mobile token | Use |
| --- | --- | --- | --- |
| `hero` | `--space-section-hero-block` | `--space-section-hero-block-small` | Image-backed hero with overlaid copy. |
| `services` | `--space-section-services-block` | `--space-section-services-block-small` | Dark services/platform band with card rail/grid. |
| `proof` | `--space-section-proof-block` | `--space-section-proof-block-small` | Feature/proof split with media. |
| `stats` | `--space-section-stats-block` | `--space-section-stats-block-small` | Outcome/stat card sections. |
| `story` | `--space-section-story-block` | `--space-section-story-block-small` | Testimonial/story split. |
| `cta` | `--space-section-cta-block` | `--space-section-cta-block-small` | Closing conversion section. |
| `footer` | `--space-section-footer-block` | `--space-section-footer-block-small` | Footer rhythm. |

## Maven Mapping

| Maven reference pattern | Our role |
| --- | --- |
| Dark hero with text over media | `.ds-section[data-tone="inverse"][data-size="hero"]` plus hero media styles. |
| Services platform band | `.ds-section[data-tone="brand"][data-pattern="services"][data-surface="frame"]` with `.ds-card-rail` service cards. |
| Feature/proof content with media | `.ds-section[data-tone="warm"][data-pattern="proof"][data-surface="frame"]` with `.ds-split[data-layout="feature"][data-columns="5/7"]`. |
| Outcomes and stats | `.ds-section[data-tone="soft"][data-pattern="stats"][data-surface="frame"]` with `.ds-grid` stat items. |
| Member story/testimonial | `.ds-section[data-tone="warm"][data-pattern="story"][data-surface="frame"]` with `.ds-split[data-layout="story"][data-columns="4/8"]`. |
| Layered rounded testimonial transition | Cream section with `.ds-section[data-break="rounded-bottom"]` followed by a normal brand section underneath. |
| Closing CTA | `.ds-section[data-tone="inverse"][data-pattern="cta"][data-surface="frame"]` with readable container and CTA cluster. |
| Footer | `.ds-section[data-tone="warm"][data-pattern="footer"][data-surface="frame"]` with `.ds-split[data-columns="4/8"]` plus footer link grid. |

## Responsive Rules

- Type uses fixed semantic tokens per breakpoint. It does not scale with viewport width.
- `.ds-split[data-collapse="desktop"]` becomes two columns at `64rem`. `.ds-split[data-collapse="tablet"]` can promote earlier at `48rem`.
- `.ds-grid[data-columns-medium="*"]` can promote an explicit card/link grid at `48rem` before the desktop variant arrives.
- `.ds-grid[data-columns="2-col|3-col|4-col"]` becomes explicit at `64rem` instead of relying on auto-fit guesses.
- `.ds-split[data-columns="6/6|5/7|4/8"]` is the named asymmetry contract for editorial sections.
- `.ds-grid[data-grid="stats"]` uses explicit `1 -> 2 -> 4` columns across base, medium, and wide breakpoints.
- `.ds-card-rail[data-grid-from="desktop"][data-columns="4-col"]` stays a horizontal rail until `64rem`, then becomes a named explicit grid.
- Pattern spacing steps down through responsive token remaps, with compact section patterns using the `*-small` rhythm tokens.
- Rounded section surfaces use fixed inset and radius tokens so color transitions feel intentional instead of section-local decoration.
- Hero text sits over media, not in a floating card.
- Full-bleed behavior should belong to the section background or `.ds-bleed`, not to arbitrary negative margins inside components.
- Hero content width and hero image crop both tighten across medium and compact breakpoints so the opening composition stays readable.

## What This Unlocks

This layer now provides a stable page-rhythm base for the first website work. The next move is not inventing more spacing rules, but letting later section and page work consume this layout contract consistently.
