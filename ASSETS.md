# Assets — single source of truth

Zitrone has **one** asset library, served from **one** tree, indexed by **one** registry,
shared by both the website and the deck system. No duplication, no per-deck copies.

```
public/img/                 ← THE single canonical library (organized by ownership)
  shared/                     used by BOTH website + decks (the efficient core)
    services/<section>/         service & deck photography (comedor, cafeteria, catering, …)
    clients/                    client logos
      wide/  mono/              horizontal lockups · monochrome (ribbon / dark bg)
    brand/                      Zitrone identity
    media/                      press logos
    food/   hero/   service-detail/   featured-spread.jpg
  site/                       website-ONLY chrome (decks never use these)
    operations/  testimonials/  service-cards/  hero-dining-hall.jpg
  deck/                       reserved for deck-ONLY assets (currently none)

assets.manifest.json        ← THE registry: files[] · clients[] · media[] · brand[]  (+ tags)
        │  node scripts/assets-sync.mjs   (auto-runs on predev / prebuild)
        ▼
src/lib/assets.generated.ts         typed map the site imports (assetSrc, assetsByTag, CLIENTS…)
deck-system/data/brands.json        deck logo wall — only if a deck-system/ folder exists (not here)
```

There is **no separate "master" tree** — `public/img` is the master. An image exists once.
The deck system and the website both reference `public/img` paths (diageo, bacardi, amazon,
the website… all point at the same files). `assets-sync` validates the library, folds the deck
section photos into the index, and generates the consumers. It does **not** copy anything.

## How to…

**Use an image on the website** — by id, never a literal path:
```ts
import { assetSrc, asset } from "@/lib/assets.generated"
<img src={assetSrc("food-pizza-station")} alt={asset("food-pizza-station").alt} />
```

**Add / replace an image**
1. Drop the file directly into the right `public/img/{shared|site}/<bucket>/` with a clean
   kebab name. (Shared if both site + decks may use it; site if it's website-only chrome.)
2. If the website references it, add a `files[]` entry to `assets.manifest.json`
   (`id`, `public`, `alt`, `tags`). Deck section photos under `shared/services/<section>/`
   are folded in automatically — no manifest entry needed.
3. `npm run assets:sync`.

**Add a client** (cascades to the deck logo wall)
1. Drop the logo in `public/img/shared/clients/<id>.svg` (+ `wide/<id>.svg` / `mono/<id>.svg`).
2. Add a `clients[]` entry (`id`, `name`, `logo`, optional `logoWide`/`logoMono`/`photo`/`scale`,
   `wallRow`, `lead`).
3. `npm run assets:sync` → `brands.json` regenerates; the wall updates next deck build.

**Logo variants** — by folder, never by suffix: `clients/<brand>.svg` (mark),
`clients/wide/<brand>.svg` (lockup), `clients/mono/<brand>.svg` (monochrome).

**Find the canonical image for a topic**: filter `tags` / `assetsByTag("equipment:coffee-machines")`.

## Rules

- **`assets.manifest.json` + the `public/img` library are the source of truth.**
- **Add-only.** Never rename or delete a file under `public/img`: the sales decks (a
  separate private repository, not part of the website handoff) load images from
  `https://www.zitrone.mx/img/...`. Add a new file and switch references instead.
  `src/lib/assets.generated.ts` and `deck-system/data/brands.json` are generated — never hand-edit.
- `npm run assets:check` fails the build if a referenced file is missing or a generated file is stale.
- Every name is lowercase kebab, descriptive — no spaces, `_`, CAPS, `()`/`&`, bare numbers
  (`01.jpg`), or tool dumps (`ChatGPT Image…`). One library, organized, no duplication.
