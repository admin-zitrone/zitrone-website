# Design system — single source of truth

Zitrone has **one** design system. It lives in **this repo** at `src/design-system/` and
cascades into everything: the website, the deck system, and the human brand book. There is
no other copy. If a file elsewhere disagrees with `src/design-system/`, that file is wrong.

```
src/design-system/
  tokens/
    primitives.css        ← LAYER 1: raw values (color ramps, type, space, shape, motion)
    semantic.css          ← LAYER 2: roles (surfaces, text hierarchy, actions, layout, type roles)
    component.css         ← LAYER 3: per-component APIs (button, card, nav, carousel, section…)
    index.css             ← imports the three layers, in order
  components/marketing.css  component grammar (.ds-* classes) — consumes layer 3 only
  layout/sections.css       section/container/grid grammar
  motion/                    reveal & interaction scripts (mirrored by React hooks in src/hooks)
  styles/                    base, fonts, page-level preview styles
        │
        │  imported by src/app/globals.css              → the WEBSITE
        │  node scripts/design-tokens-data.mjs           → src/design-system/tokens.generated.json
        │      (auto-runs on predev / prebuild)          → the BRAND BOOK at /design-system
        ▼
../zitrone-deck-system/                                  → the DECK SYSTEM
        npm run tokens:sync   regenerates the SYNCED block in its tokens.css from
                              THIS repo's primitives.css (auto-runs on deck build)
```

## The three layers (change at the right one)

| Layer | File | Naming | Rule |
|-------|------|--------|------|
| 1 Primitives | `tokens/primitives.css` | `--primitive-*` | Raw values only. New values enter the system here, nowhere else. |
| 2 Semantic | `tokens/semantic.css` | `--color-*`, `--type-*`, `--space-*`, `--size-*`, `--layout-*`, `--radius-*`, `--motion-*` | Roles that reference layer 1. Responsive step-downs live here (`@media` blocks re-point roles). |
| 3 Component | `tokens/component.css` | `--button-*`, `--card-*`, `--nav-*`, `--carousel-*`… | Per-component APIs that reference layer 2 (or 1 where a component pins a primitive deliberately). |

- **Component/layout CSS never consumes `--primitive-*` directly** — the audit fails the build on leaks.
- **Component CSS never sets a raw `font-size`, `line-height`, `letter-spacing` or `font-weight`.**
  Text resolves to a `--type-*` role (see "Type scale" below). Consuming a semantic type role
  directly in component CSS is allowed and preferred — it is what makes a role change reach
  every page.
- **Never hardcode a value** that a token already governs. If no token fits, promote one.
- A visual change = a token change. Editing `marketing.css` to restyle something a token
  controls is drift.

## Core brand rules (non-negotiable)

- **Type:** Manrope for everything (`--font-display`, `--font-body`); Noto Serif Display is
  the *accent only* — stats, quotes, italic accent words (`--type-accent-word-*`).
- **No black.** Ink is `ocean-950 #00292A`. No pure `#000` anywhere.
- **No red / traffic-light colors.** Caution is warm taupe territory, not red.
  *Open conflict (2026-08):* form validation needs an error colour that reads as
  an error, so `--color-text-danger` (`danger-600 #A02A1F`, a deep brick) was
  added for that one purpose. It is scoped to billing field validation and is
  never decorative. If the no-red rule must hold absolutely, this token is the
  thing to redesign — note that colour is already not the sole carrier of the
  error state (there is always a message and a border), so a warmer hue is
  viable as long as it clears 4.5:1 on `natural-50` and `natural-100`.
- **Lime is an accent, not a surface for text.** Lime text/fills pair with ocean-700/800/900
  surfaces only; lime on natural/warm surfaces fails contrast.
- **Service verticals:** Comedor = ocean · Workplace Fuel (café/pantry) = lime ·
  Momentos/Catering = natural. Category identity only — never general decoration
  (`--color-accent-service-*`).
- Text hierarchy and selection colors carry documented WCAG ratios in `semantic.css` —
  keep new pairings at AA minimum and document the ratio in the same comment style.
- **Never fade text toward transparent** (`color-mix(..., transparent)`) or dim a
  text container with `opacity` to make it quieter — step down the ramp instead.
  This was the largest source of contrast debt found in the 2026-08 audit.
- **Accents resolve by surface:** use `--color-text-accent`, which is the
  light-surface accent and swaps to `ocean-300` on brand/inverse sections. The
  vivid `--color-text-accent-brand` is for dark surfaces only. See
  [docs/accessibility.md](./docs/accessibility.md).
- **Dark surfaces declare `data-tone="inverse"` (or `"brand"`)** on any element, not only
  `<Section>`/`<Band>`. The tone re-points what sits inside it:
  - **Text hierarchy is neutral, three tiers:** title `--color-text-inverse` (white) >
    lead/intro `--color-text-inverse-lead` > supporting copy `--color-text-inverse-support`.
    No teal or lime for running text on dark grounds.
  - **Icon tiles become neutral glass:** `--color-icon-tile-inverse-surface` (white 8%) with a
    white glyph. On light grounds tiles keep their service/brand accent pair.
- **Icon tile contract:** every icon tile paints
  `background: var(--icon-tile-surface, <light fill>)` and
  `color: var(--icon-tile-icon, <light glyph>)`. Never hard-set a tile colour; the tone
  context supplies the dark version. Controls (buttons, nav icons) are not tiles.

## Type scale (one scale, site-wide)

Unified 2026-09-24: the home page's reference-template scale is the only scale. There are no
page-level or section-level type overrides (the old `.semantic-shell` home-only scale is gone).

| Role | Use | Desktop → phone |
|------|-----|-----------------|
| `display-hero` | page H1 (hero) | fluid ~88px → 36px |
| `section-heading` | section H2 (also blog/article titles, FAQ heading) | 48px → 28px |
| `card-heading` | subheadings, legal/article H2, large card names | 38px → 20px |
| `title` | card, step and panel titles | 26px → 20px |
| `title-small` | small titles, FAQ questions, blog-card titles | 18px → 20px |
| `body-large` | ledes, intros | 18px → 16px |
| `body` | running copy | 16px |
| `support` | copy under a point/card title | 16px → 15px |
| `body-small` | secondary copy, UI text | 14px |
| `label` / `meta` / `nav` | kickers, tags, metadata, nav | 14px |
| `caption` | fine print, micro labels | 12px |

Each role carries `-size`, `-line-height`, `-weight` and (headings) `-letter-spacing`.
Responsive steps are re-pointed only in the `@media` blocks of `semantic.css`.
**To change body copy everywhere, change `--type-body-size`. Nothing else.**
Buttons: `.ds-button` (`<Button>`) is the only button; don't restyle a link into a lookalike.

## How to…

**Change a color / type role / spacing** — edit the right layer, then:
```sh
zsh scripts/design-system-audit.sh        # token-contract enforcement (must pass)
npm run build                             # site consumes it via globals.css
# decks: the private deck repo (not part of the website handoff) picks the
# change up with its own `npm run tokens:sync`; nothing to run here.
```

**See the system as a human** — open `/design-system` (the brand book). It is generated
from the token files on every build; it cannot drift. Don't hand-edit its data
(`src/design-system/tokens.generated.json` is generated).

**Style something in the deck system** — decks consume this repo's primitives through
their own `tokens.css` (SYNCED block, regenerated by `tokens:sync`) plus a hand-authored
`--deck-*` semantic layer. Deck-side rules live in the deck repo's `AGENTS.md`.

## What is generated (never hand-edit)

- `src/design-system/tokens.generated.json` — by `scripts/design-tokens-data.mjs`
- the brand book page content at `/design-system` — renders from that JSON
- `../zitrone-deck-system/tokens.css` SYNCED block — by its `sync-tokens.mjs`

## Enforcement

`zsh scripts/design-system-audit.sh` — greps for contract violations (primitive leaks in
component CSS, stale aliases, raw governed values, focus-ring bypasses, direct semantic
wiring in component grammar). It must pass before calling design work done.

> **Status (2026-09-24):** raw typography = **0** (enforced, `raw-typography` check). ~700 dead
> rules from retired page generations were pruned. Remaining ratcheted debt: ~520 primitive
> leaks (mostly colour/space in `marketing.css`), 10 local grid templates, 11 focus bypasses.
> Next cleanup passes, same pattern: spacing roles, then grid/column templates, then colour.
>
> **Known debt (2026-07-02):** the audit ran vacuously for weeks (missing `rg` made every
> check pass empty — now fixed to fail loudly). The June service-page/blog build-out
> accumulated ~670 primitive leaks in `marketing.css` plus a handful of raw-measure/
> focus/grid violations. Cleaning those is a dedicated refactor project. Until then:
> **do not add new violations** — new CSS must consume layer-2/3 tokens only.

## History

`docs/design-system/_archive/` holds the 2026 planning-era docs that *designed* this
system. They are historical: correct on philosophy, stale on specifics. The live token
files + this file + the brand book are current truth.
