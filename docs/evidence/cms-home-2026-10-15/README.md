# Evidence: home, navigation and footer in the CMS (2026-10-15)

Base commit `255eec2`, branch `cms/home-parity`. Local only: Postgres 16 in
the `zitrone-staging-pg` Docker container (throwaway databases `cms_parity`,
`cms_rehearsal`, `zitrone_home_cache_api_test`), Node v25.8.1 (CI uses 24; not
replayed on 24). No hosted database, Blob, Vercel, push or deploy.

| File | Command | Result |
| --- | --- | --- |
| `parity.txt` | `npm run payload:check:home` after migrate + full seed | 0 differences ES / EN |
| `coverage.txt` | `npm run payload:check:home -- --coverage` | 0 text fields read from code outside the declared code-owned paths |
| `test-cache-home.txt` | `npm run test:cache:home` | 5/5 |
| `migration-links-l0..l3.txt` | see below | l0 = l1 = l2 = l3 |

## Migration rehearsal (links preserved)

1. Detached worktree at `255eec2` (current production code): `payload migrate`
   + `scripts/payload/seed.ts` into `cms_rehearsal`.
2. `l0`: every header/footer link path per locale row, read from the shared
   columns (29 rows: 26 `en`, 3 `es` — the old seed had already wiped most
   Spanish rows, the bug fixed here).
3. `payload migrate` with this branch → `l1` (read from the new per-locale
   columns); `payload migrate:down` → `l2` (shared columns again);
   `payload migrate` → `l3`. All four files are identical.

## Negative control

`src/payload/hooks/revalidate.ts` temporarily restored to `255eec2` and
`npm run test:cache:home` rerun: 3 pass, 2 fail — "a header navigation edit
reaches every page" and "a footer edit reaches every page", both with
`/es/services never reached the expected state (status 200, cache HIT)`.
Restored afterwards.

## CMS mode vs static mode

Two production builds on `cms_parity` (`HOME_CONTENT_SOURCE` empty, then
`static`), Playwright Chromium, reduced motion, full-page screenshots of `/es`
and `/en` at 1440×900 and 390×844:

| View | Visible text | Broken images | Height | Pixels differing (>60/765) |
| --- | --- | --- | --- | --- |
| desktop /es | identical | 0 / 0 | 8262 / 8262 | 0.07 % |
| desktop /en | identical | 0 / 0 | 8192 / 8192 | 0.07 % |
| mobile /es | identical | 0 / 0 | 8249 / 8249 | 0.00 % |
| mobile /en | identical | 0 / 0 | 8158 / 8158 | 0.00 % |

The desktop differences sit inside photos (hero, proof); side-by-side crops
show no visible change. Cause: the CMS stores raster uploads as WebP q82.

## Also run

`npx tsc --noEmit`, `npm run lint`, `test:contracts` 83/83, `test:scripts`
12/12, `test:api` 30/30, `test:cache` 4/4. Not run: E2E, a11y, visual
baselines (stale since 2026-09-04).
