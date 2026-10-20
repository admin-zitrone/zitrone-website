# Brand fonts

Self-hosted since 2026-10-15 (commit `146b966`). Declared in `src/app/fonts.css`, latin files preloaded by `src/app/fonts.ts`.

| File | Family | Version (name table) | Subset | Source |
| --- | --- | --- | --- | --- |
| `manrope-v20-latin.woff2` | Manrope, variable `wght` 200–800 | 4.504 | latin | Google Fonts API, `fonts.gstatic.com/s/manrope/v20/` |
| `manrope-v20-latin-ext.woff2` | same | 4.504 | latin-ext | same |
| `noto-serif-display-v29-latin.woff2` | Noto Serif Display, variable `wght` 100–900 | 2.003 | latin | `fonts.gstatic.com/s/notoserifdisplay/v29/` |
| `noto-serif-display-v29-latin-italic.woff2` | same, italic | 2.003 | latin | same |
| `noto-serif-display-v29-latin-ext.woff2` | same | 2.003 | latin-ext | same |
| `noto-serif-display-v29-latin-ext-italic.woff2` | same, italic | 2.003 | latin-ext | same |

The files are the ones `next/font/google` downloaded at build time, unmodified (byte-identical; SHA-256 in `docs/evidence/fonts-2026-10-15/hashes.txt`). They are Google's own latin and latin-ext subsets.

## Licence

Both families are licensed under the SIL Open Font License 1.1. Neither licence declares a Reserved Font Name.

- Manrope: Copyright 2019 The Manrope Project Authors (https://github.com/googlefonts/manrope). Designer: Mikhail Sharanda. Licence: [OFL-manrope.txt](OFL-manrope.txt).
- Noto Serif Display: Copyright 2016 Google Inc. All Rights Reserved. Licence: [OFL-notoserifdisplay.txt](OFL-notoserifdisplay.txt).

Licence texts taken from `github.com/google/fonts` (`ofl/manrope/OFL.txt`, `ofl/notoserifdisplay/OFL.txt`) on 2026-10-15. Copyright lines match the fonts' embedded name tables.

## Changing a font

Add the new files under a new versioned name (served `immutable` for a year, see `next.config.ts`), update `src/app/fonts.css` and `src/app/fonts.ts`, and keep the licence files current. `public/` is append-only: leave old files in place.
