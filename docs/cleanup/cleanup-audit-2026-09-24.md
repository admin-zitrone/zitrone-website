# Cleanup audit — 2026-09-24

Scope: **audit only** (read-only). Nothing was edited, deleted, uninstalled or committed
during the audit. The repository snapshot and validation results are recorded for
reproducibility.

---

## Executive summary

**In plain words.** The site works and type-checks cleanly, but the repo still carries the
leftovers of how it was built: old versions of home-page sections that were replaced but
never deleted, a smooth-scroll library that was switched off, screenshots and one-off
scripts committed by accident, and several documents that describe an older project
("On It", Next 15, Maven) as if it were current. A new technical team would lose time
working out which of two similar files is the real one.

**How much can go (verified, no visual change):**

| What | Count | Size |
|---|---|---|
| Dead React components / hooks | 12 files | ~1,620 lines |
| Dead motion scripts (`src/design-system/motion/*.js`) | 6 files | ~1,040 lines |
| Dead one-off scripts | 5 files (3 in `scripts/`, 2 in `.artifacts/`) | ~80 lines |
| Unused dependencies | 3 runtime + 2 dev (`lenis`, `@next/third-parties`, `@vercel/blob`, `dotenv`, `eslint-config-prettier`) | — |
| Unused exports | ~20 fully dead, ~25 used only inside their own file | — |
| Committed clutter | `.artifacts/` (15 files, **12.2 MB**), duplicate audit at root, 4 overlapping button docs (952 lines), stale skills + a broken symlink | — |
| CSS left behind by the dead components (needs review) | ~107 class selectors | — |

**Current health (baseline):** typecheck passes; asset check passes; design audit passes
(963 known-debt violations held); **lint fails (1 error)**; **contract tests fail (3 of 74)**.
CI would therefore be red today on any PR.

**Proposed commit plan (in order, each small and reversible, each gated by
`tsc` + `lint` + `test:contracts` + `assets:check` + `design:audit`, and `build` + `test:visual` at the end of each category):**

1. `chore: remove unused home section components and hooks` — 5 files in `src/app/_components/home/` (+ `ArrowLineIcon`, which becomes dead).
2. `chore: remove unused shared components` — 6 files in `src/components/` + `src/lib/use-scroll-carousel.ts`.
3. `chore: remove unused motion helpers` — 6 files in `src/design-system/motion/`, and rewrite `motion/README.md`.
4. `chore: remove one-off debug scripts` — `scripts/check-contact-email-db.mjs`, `scripts/payload/check-media-urls.ts`, `.artifacts/{seq,unpin}.mjs` (decide on `render-contact-email-previews.mjs`, see below).
5. `refactor: drop unused exports` — delete ~20 dead exports, make ~25 module-private.
6. `build: remove unused dependencies` — `npm uninstall lenis @next/third-parties @vercel/blob dotenv` (+ lockfile). Decide `eslint-config-prettier`: wire it in or remove it.
7. `chore: untrack .artifacts and ignore generated snapshots` — `git rm --cached -r .artifacts`, add `/.artifacts/` to `.gitignore` (files stay on disk).
8. `docs: archive stale and duplicate docs` — root audit duplicate, button docs, stale README/registry/decisions, stale skills + broken symlink.
9. `refactor: one import path for home and blog types` (dedupe re-export facades).
10. *(separate, needs sign-off)* orphaned CSS selectors, literal `/img/` paths → asset registry, file renames, big-file splits, formatting-only commit.

Commits 1–4 are **certain** and change no output. Before any of them, the owner may want
the lint error and 3 contract failures fixed first so the gates start green (see Baseline).

---

## Baseline checks (2026-09-24, before any change)

| Check | Result | Detail |
|---|---|---|
| `npx tsc --noEmit` | **PASS** | 0 errors |
| `npm run lint` | **FAIL** | 34 problems: **1 error**, 33 warnings |
| `npm run test:contracts` | **FAIL** | 74 tests: 71 pass, **3 fail** |
| `npm run assets:check` | **PASS** | 250 assets, 39 clients, generated files consistent |
| `npm run design:audit` | **PASS** | 963 known-debt violations held at baseline (808 primitive leaks, 3 raw measures, 13 focus-ring, 125 typography wiring, 14 column templates) |

Lint detail:
- Error: `src/app/_components/home/hero-daily-stat.tsx:43` — `setState` synchronously inside an effect (react-hooks rule). Real bug-class issue, not cleanup.
- 29 of the 33 warnings are unused `payload`/`req` args in `src/migrations/*` (generated, off-limits). Fix at the lint config (ignore `src/migrations/**` or relax the rule there), not in the files.
- Remaining warnings: unused `sections` in `src/app/[locale]/layout.tsx:55`; unused `contactMailto` import in `home/content/en.ts:2` and `es.ts:2`; `<img>` in `services/service-detail-template.tsx:381`.

Contract failures (content copy exceeds the service-page reading budgets — content work, not cleanup):
- `es/comedor-corporativo` hero lede is 22 words, budget 12.
- `standard/es` operating-standard intro is over 14 words.
- `es/comedor-corporativo` FAQ 2 opens with "el" (search-phrasing rule).

Not run (per scope): `npm run build`, Playwright.

---

## 1. Unused files

Verification for every item: `grep` for filename and exported symbol across `src scripts tests`, the whole repo root, `next.config.ts`, `package.json` scripts, `.github/workflows/ci.yml`, `playwright*.config.ts`, CSS `@import` graph, `<Script src>` usage (only one: the GTM URL), and the sibling repo `../zitrone-deck-system` (which consumes only `src/design-system/tokens/primitives.css`, `public/` and `public/assets-index.json`).

### 1a. React components and hooks

| Item | Lines | Evidence | Confidence | Risk |
|---|---|---|---|---|
| `src/app/_components/home/service-system-slider.tsx` | 543 | `ServiceSystemSlider` has 0 importers. The only name match is the **Payload block config** `src/payload/blocks/service-system-slider.ts` (a different file, keep it). Superseded by `service-showcase.tsx`. | certain | none |
| `src/app/_components/home/services-carousel.tsx` | 98 | `ServicesCarousel` 0 importers; `src/payload/blocks/services-carousel.ts` is the separate CMS block (keep). | certain | none |
| `src/app/_components/home/services-orbit.tsx` | 169 | 0 importers, no string refs. | certain | none |
| `src/app/_components/home/system-tabs.tsx` | 276 | `SystemTabs` 0 importers; the live "operating system" step UI is inline in `home-page.tsx` (reads `systemTabs` content). | certain | none |
| `src/app/_components/home/use-responsive-menu-panel.ts` | 73 | 0 references. | certain | none |
| `src/components/cards.tsx` | 148 | None of `ServiceCard`/`ServiceMediaCard`/`StatCard`/`ProofCard`/`StoryCard` components are imported (`ServiceCard` hits are a same-named *type* in `content/types.ts`). Also flagged dead in the 2026-07-01 handoff audit. | certain | none |
| `src/components/logo-mark.tsx` | 13 | 0 importers (flagged in 07-01 audit). | certain | none |
| `src/components/media-frame.tsx` | 34 | 0 importers. `--media-frame-*` tokens still exist in `component.css` (see §6). | certain | none |
| `src/components/progressive-blur.tsx` | 7 | 0 importers. | certain | none |
| `src/components/scroll-bento-shrink.tsx` | 68 | 0 importers (flagged in 07-01 audit). | certain | none |
| `src/components/smooth-scroll-provider.tsx` | 25 | 0 importers. Only consumer of `lenis`. Lenis was deliberately removed (native-scroll rule in the project brief). | certain | none |
| `src/lib/use-scroll-carousel.ts` | 164 | 0 references. | certain | none |

After removal, `ArrowLineIcon` in `home/feature-icons.tsx` becomes dead (only used by `service-system-slider.tsx`).

### 1b. Motion scripts (`src/design-system/motion/*.js`)

Checked specifically for non-import loading: no `<Script src>` (the only one loads GTM), no `new URL(..., import.meta.url)`, no string path in `src`, `scripts`, `next.config.ts`, `package.json`, no copy into `public/`, and no reference in `../zitrone-deck-system` (only an archived HTML there). All mentions are in `docs/design-system/_archive/*` and in `motion/README.md`, which still points at `preview/design-system/sections.html` — a directory that no longer exists. React hooks in `src/hooks/` (`use-reveal`, `use-title-reveal`, `use-hero-parallax`) are the live replacements.

| Item | Lines | Confidence | Risk |
|---|---|---|---|
| `footer-language.js` | 46 | certain | none |
| `marketing-interactions.js` | 390 | certain | none |
| `service-system.js` | 182 | certain | none |
| `stories-tabs.js` | 109 | certain | none |
| `system-tabs.js` | 153 | certain | none |
| `title-reveal.js` | 163 | certain | none |

Follow-up: `motion/README.md` must be rewritten (or folder removed) in the same commit; `DESIGN.md` line "motion/ reveal & interaction scripts (mirrored by React hooks in src/hooks)" should then point to `src/hooks/`.

### 1c. Scripts and one-offs

| Item | Evidence | Confidence | Risk |
|---|---|---|---|
| `scripts/check-contact-email-db.mjs` | Not in `package.json`/CI/docs. Imports `pg`, which is **not a declared dependency** (only transitive). One-off readiness check. | certain | none |
| `scripts/payload/check-media-urls.ts` | Not referenced anywhere; prints one media doc (debug). | certain | none |
| `.artifacts/seq.mjs`, `.artifacts/unpin.mjs` | Ad-hoc hero screenshot scripts; import `playwright` (not a declared dep). | certain | none |
| `scripts/render-contact-email-previews.mjs` | Not in `package.json`, but **documented** in `docs/contact-email-delivery.md:61` as the email-preview QA step. Either add `"email:preview:shots"` to `package.json` or delete it and the doc line. | needs-human | low |

---

## 2. Dependencies

| Package | Evidence | Confidence | Risk |
|---|---|---|---|
| `lenis` | Only imported by dead `smooth-scroll-provider.tsx`. Scroll-hijacking is banned. | certain (after 1a) | none |
| `@next/third-parties` | 0 imports; `[locale]/layout.tsx:114` comment explains it was replaced by a hand-rolled `lazyOnload` `<Script>` for LCP. | certain | none |
| `@vercel/blob` | 0 direct imports. `@payloadcms/storage-vercel-blob` declares `@vercel/blob@2.3.1` as its **own dependency** (not a peer), so it stays installed transitively. Remove the direct entry. Verify `npm run build` afterwards. | likely | low |
| `dotenv` (dev) | 0 imports; scripts use `tsx --env-file`. | certain | none |
| `eslint-config-prettier` (dev) | 0 references; `eslint.config.mjs` does not include it. Prettier is configured (`.prettierrc`) but no `format` script exists. Decide: wire it in (recommended if you adopt Prettier as a CI check) or remove. | needs-human | none |
| `pg`, `playwright` (undeclared) | Imported by one-off scripts above; removing those scripts resolves it. | — | — |

Kept (verified used): `ai` + `@ai-sdk/openai` (`src/ai/embeddings.ts`, used by `faqs`/`blog-posts` collections), `graphql` (Payload peer), `sharp` (Payload/Next image), `prettier-plugin-tailwindcss` (`.prettierrc`).

---

## 3. Unused exports

knip found 31 export groups (excluding generated `assets.generated.ts` and `payload-types.ts`, which are off-limits and fixed only at their generators). Each was checked for in-file use and for importers.

**Fully dead (delete):**

| Export | File | Confidence |
|---|---|---|
| `articleJsonLd` | `src/app/lib/json-ld-articles.ts` + re-export in `json-ld.tsx` | certain — one definition, re-exported by the barrel, never called; `blogPostingJsonLd` is the one in use. (Not really a duplicate; it is one dead function exported twice.) |
| `ArrowLineIcon` | `home/feature-icons.tsx` | certain after §1a |
| `ProfilerCombobox`, `needsStyleStep` | `home/profiler-controls.tsx`, `home/profiler-logic.ts` | certain |
| `refName`, `groupsOf` | `src/app/design-system/lib.ts` | certain |
| `buildContactMessage` | `src/app/lib/contact.ts` | certain |
| `COMPANY_NAME` | `src/emails/company.ts` | likely (check `email:check`) |
| `sanitizeInternalPath`, `sanitizeLocaleCandidate`, `sanitizeTagPart` | `src/lib/security.ts` | likely — security helpers never called; confirm they aren't planned for the contact route |
| `revalidateBlogIndexGlobal` | `src/payload/hooks/revalidate.ts` | needs-human — Payload hook; confirm it is not meant to be registered on the blog global |
| `getPathname` | `src/i18n/navigation.ts` | likely (next-intl boilerplate; harmless to keep) |
| `getResolvedBlogLayout`, `searchFaqs` | `src/payload/loaders/blog.ts` + `loaders/index.ts` barrel | likely |
| `assetPath` | `home/home-data.ts` | certain (content files import a *different* `assetPath` from `content/shared.ts`) |
| `expectedHomeReleaseSignals` | `scripts/payload/release-home-verifier.ts` | likely |

**Used only inside their own file (drop the `export`, keep the code):** `internalLink`, `getBlogCategorySlug`, `postIsoDate`, `getBlogAuthorProfile`, `getBlogReviewerProfile`, `getServiceTargetBySlug`, `ProfilerStepper`, `CONTACT_INTERESTS`, `footerContactMap`, `LogoChip`, `CardRail`, `sectionVariants`, `Band`, `COMPANY_ADDRESS/PHONE/SOCIALS`, `EMAIL_COLOR`, `EMAIL_FONT_STACK`, `escapeHtml`, `EMAIL_TOKEN_SOURCE`, `EnvValidationError`, `stripLocale`, `GA4_MEASUREMENT_ID`, `EMPTY_ATTRIBUTION`, `crossLocaleSlugRedirects`, `getRequestIp`, `parseContentLength`, `resolvePayloadHref`. Confidence **likely** (small chance a test or script imports them by a path knip missed — re-run `tsc` after).

**Shared UI primitives with no users** (`Pill`, `Stack`, `Split`, `SectionHead`, `Quote` in `src/components/{button,layout,typography}.tsx`): **needs-human** — they are design-system API surface shown in the brand book intent; decide keep-as-API vs delete.

---

## 4. Duplicate types and helpers

| Finding | Evidence | Confidence | Risk |
|---|---|---|---|
| Home types reachable by two paths | Types are **defined once** in `home/content/types.ts` (56 types) and **re-exported** by `home/home-data.ts`. 12 files import from `home-data`, 20 from `content/types`. Not duplicated definitions, but two import paths for the same thing. Pick `content/types.ts`, drop the re-export block. | likely | low |
| Blog types reachable by two paths | Same pattern: defined in `blog/content/types.ts`, re-exported by `blog/articles.ts`. | likely | low |
| Types for dead components | `ServicesOrbitItem`, `ServicesCarouselLabels`, `ServiceSystemLabels`, `SystemTabsLabels` etc. in `content/types.ts`. **Content keys `systemTabs`, `servicesCarousel`, `serviceSystem`, `storiesTabs` are still used** by live components, Payload loaders, seed/sync scripts and contract tests — do not remove data, only types proven orphaned after §1a. | needs-human | low |
| `articleJsonLd` "in two files" | One function + one barrel re-export (see §3). | certain | none |
| `json-ld.tsx` barrel | Re-exports four `json-ld-*.ts` modules plus the `JsonLd` component. Acceptable (10 importers), keep. | — | — |

---

## 5. Repo clutter and stale docs

| Item | Evidence | Action | Confidence | Risk |
|---|---|---|---|---|
| `.artifacts/` (15 tracked files, **12.2 MB**) | 7 deck contact sheets (1.3–2.4 MB each, deck-system leftovers from the 2026-06-18 split), 2 hero screenshots, 2 scripts, 4 `home-release/*.json` snapshots **generated** by `scripts/payload/home-release-lib.ts:112` on every release. | `git rm --cached -r .artifacts`, add `/.artifacts/` to `.gitignore`. Files stay on disk; history still holds the 12 MB (a history rewrite is not recommended). | certain | none |
| `zitrone-platform-audit-2026-04-30.md` at root | Byte-identical to `docs/zitrone-platform-audit-2026-04-30.md`. | Delete root copy; move docs copy to `docs/_archive/`. | certain | none |
| `docs/button-*.md` (4 files, 952 lines) | April 2026 planning notes; reference `/Users/a1085/Documents/On It/...`, `preview/design-system/sections.html` (gone) and "`@vibecoding/ui`". Superseded by `DESIGN.md` + `component.css` button tokens. | Move to `docs/_archive/`. | certain | none |
| `.agents/skills/` vs `.claude/skills/` | `asset-manager/SKILL.md` identical in both; `deck-builder/SKILL.md` differs. Both `deck-builder` versions describe `deck-system/fixed/` inside this repo, which was split out 2026-06-18. | Remove `.agents/`; move `deck-builder` to `../zitrone-deck-system` (or delete). | likely | none |
| `.claude/skills/deck-export` | **Broken symlink** → `../../deck-system/skills/deck-export` (folder no longer exists). | Delete. | certain | none |
| `README.md` | Links to `/Users/a1085/Documents/On It/...`; says Payload is the production homepage source of truth, but production runs `HOME_CONTENT_SOURCE=static` (`src/payload/loaders/home-content.ts:37`). No mention of tests, CI, design system, env setup. | Rewrite (see §7). | certain | none |
| `src/README.md` | Describes `src/app` as "a small workspace shell" for the "Maven design-system"; points at `preview/design-system/` (gone). | Rewrite or delete. | certain | none |
| `docs/registry.md` | Links to `research/maven-clinic/*` (does not exist); last touched 2026-05-04. | Rewrite as the docs index or merge into `docs/README.md`. | certain | none |
| `docs/decisions/0001–0003` | Describe the "On It" workspace and Next.js 15 (repo is Next 16). | Keep as ADR history but mark **Superseded**; add a current ADR. | needs-human | none |
| `docs/project-brief.md`, `docs/sections-copy-map.md`, `docs/vercel-deployment-runbook.md`, `docs/environment-readiness-checklist.md`, `docs/handoff-audit-2026-07-01.md` | Contain `On It` absolute paths. Some content may still be current. | Review and fix paths; archive dated audits (`handoff-audit-2026-07-01`, `delivery-readiness-audit-2026-09-07`, `migration-validation-2026-09-22`) into `docs/audits/` once closed. | needs-human | none |
| `docs/gtm-public-resource-2026-09-22.json` vs `docs/gtm/` | Two GTM exports in two places; `docs/analytics-tracking.md` vs `docs/analytics/gtm-activation.md` likewise split. | Consolidate under `docs/analytics/`. | likely | none |
| `docs/services/CATALOGO ZITRONE 2026.pdf` (9.0 MB) + 2 `.docx` | Client source material committed as binaries in a code repo. | needs-human — move to shared drive, keep a link. | needs-human | none |
| `public/decks/*.html` | Old deck HTML inside the shared `public/`. **Boundary: `public/` is append-only.** Report only. | needs-human | — |

---

## 6. Orphaned CSS (needs-human)

Removing the §1a components leaves **~107 class selectors** in
`src/design-system/components/marketing.css` / `styles/*.css` whose only JSX users are the
dead files, e.g. the whole `ds-service-system-*` / `ds-service-system-study-*` family,
`ds-service-orbit-*`, `ds-system-tabs-*`, `ds-service-hover-*`, `ds-service-media-*`,
`ds-stat-card`, `ds-proof-card`, `ds-story-card`, `ds-progressive-blur`, `ds-media-frame`.

Why needs-human: classes can be built dynamically (template strings), used by the
`/design-system` brand book, or by CMS-rendered markup. This is also the likely biggest
single size win (marketing.css is 15,789 lines) and would shrink the design-audit debt.
Do it as a separate commit with `test:visual` + a manual pass of `/design-system`, and
update the audit baseline with `design:audit:update` only after the count goes **down**.

---

## 7. Structure & professionalism

### Naming inconsistencies

- **Package name** is `on-it-workspace` (old project codename). Should be `zitrone-website`.
- **`caladan-navbar.tsx`** — codename; wrapped by `app/_components/site-navbar.tsx`. Two navbar files for one navbar. Merge/rename to `site-navbar`.
- **`sections-preview*.css`** (3 files, 3,316 lines) are imported by `globals.css` and ship to production; "preview" is misleading. Rename to e.g. `styles/home-sections.css`.
- **Two CSS class prefixes**: `ds-*` (477 unique classes in TSX) and `semantic-*` (124 unique). Document the rule or converge on one.
- `src/app/[locale]/blog/_blog-search.tsx` — the only underscore-prefixed file (Next treats `_` as private folders, not files; the prefix does nothing). Rename to `blog-search.tsx`.
- Filenames are otherwise consistently kebab-case (good).

### Folder organization

| Problem | Today | Suggested |
|---|---|---|
| Two `lib` folders | `src/app/lib/` (16 files: page content, JSON-LD, SEO, sitemap) vs `src/lib/` (analytics, consent, email, leads, observability, security…) | `src/lib/` for runtime logic; move page copy (`*-content.ts`) to `src/content/` and SEO/JSON-LD to `src/lib/seo/`. |
| Three component homes | `src/components/` (shared UI), `src/design-system/components/` (only `blog-card` + CSS), `src/app/_components/` (site chrome + `home/`) | Shared UI in `src/components/`; design-system folder = tokens/CSS only (move `blog-card` to `src/components/`); route-private pieces colocated under their route. |
| Loose hooks | `src/hooks/` (3) + hooks inside `home/` + `src/lib/use-scroll-carousel.ts` (dead) | All shared hooks in `src/hooks/`. |
| Home content | `home/content/{en,es}.ts` (~1,345 lines each), plus `content/shared.ts` | Fine as a pattern; see literal paths below. |

### Governance leaks

- **130 literal `/img/...` paths in `src`** despite the "import by id" rule: `service-detail-template.tsx` (41), `home/content/shared.ts` (27), `content/en.ts` (26), `content/es.ts` (26), `[locale]/layout.tsx` (2, favicon), `site-footer.tsx`, `caladan-navbar.tsx`, `logo-mark.tsx` (dead), emails (5; emails need absolute URLs, likely acceptable). needs-human, low risk refactor to `assetSrc()`.
- Hardcoded hex in TSX: 5 occurrences in `global-error.tsx` and `[locale]/layout.tsx` (probably theme-color / error page without CSS; acceptable, document).
- Raw `<button>` elements: 49 in 20 files (many are legitimate controls — tabs, carousels — but worth a pass against `src/components/button.tsx`).

### Oversized files (>400 lines, excluding generated)

| Lines | File |
|---|---|
| 15,789 | `src/design-system/components/marketing.css` |
| 1,498 | `src/design-system/styles/sections-preview.css` |
| 1,349 | `src/app/_components/home/content/es.ts` |
| 1,344 | `src/app/_components/home/content/en.ts` |
| 1,230 | `src/app/[locale]/services/service-targets.ts` |
| 1,147 | `scripts/payload/seed.ts` |
| 1,099 | `src/design-system/styles/sections-preview-profiler.css` |
| 993 | `src/app/[locale]/blog/content/es.ts` |
| 992 | `src/app/[locale]/blog/content/en.ts` |
| 991 | `src/app/_components/home/profiler-section.tsx` |
| 867 | `src/design-system/tokens/component.css` |
| 781 | `src/design-system/layout/sections.css` |
| 763 | `src/app/[locale]/contact/contact-form.tsx` |
| 719 | `src/design-system/styles/sections-preview-proof.css` |
| 683 | `src/app/design-system/page.tsx` |
| 582 | `src/app/design-system/brand-book.css` |
| 566 | `src/app/_components/home/content/types.ts` |
| 555 | `src/app/[locale]/services/service-detail-template.tsx` |
| 543 | `src/app/_components/home/service-system-slider.tsx` (dead) |
| 531 | `src/app/[locale]/billing/billing-form.tsx` |
| 516 | `src/design-system/tokens/semantic.css` |
| 493 | `src/components/caladan-navbar.tsx` |
| 490 | `src/app/_components/home/service-showcase.tsx` |
| 468 | `src/app/_components/home/outcomes-carousel.tsx` |
| 425 | `src/app/_components/home/profiler-controls.tsx` |
| 418 | `src/emails/layout.ts` |

Content files (`content/*.ts`, `service-targets.ts`) being long is expected (data). The
real mixed-concern candidates are `marketing.css` (split per component), `profiler-section.tsx`,
`contact-form.tsx`, `billing-form.tsx` and `caladan-navbar.tsx` (state + markup + effects).

### Code-quality markers (excluding generated files)

| Marker | Count |
|---|---|
| `any` | 11, all in `scripts/payload/*` (Payload query results) — acceptable in scripts, add a typed helper later |
| `@ts-ignore` / `@ts-expect-error` / `@ts-nocheck` | 0 |
| `eslint-disable` | 6 in 5 files (4 × `react-hooks/exhaustive-deps` in `contact-form`, `profiler-section` ×2, `caladan-navbar`; 2 × `no-img-element`, one in dead `cards.tsx`) — the `exhaustive-deps` ones deserve a justification comment each |
| `console.log` | 0 in `src`; 53 in 15 `scripts/` files (CLI output, fine) |
| `TODO` / `FIXME` / `HACK` | 0 |
| `"use client"` files | 53 |

### Team-readiness gaps

| Gap | Detail | Suggested fix |
|---|---|---|
| README | Stale paths and wrong source-of-truth claim (see §5); no setup/env/test/deploy overview. | Rewrite: what the app is, stack, `npm` scripts table, env setup (`.env.example`), tests, where docs live (link `AGENTS.md`, `DESIGN.md`, `ASSETS.md`, `EMAILS.md`, `DELIVERY.md`), deploy procedure. |
| CI is red | Lint (1 error) and contract tests (3 failures) would fail any PR today. | Fix before handoff; the team must inherit a green pipeline. |
| CI coverage | Runs on PRs and pushes to `main`/`master` only. Production is deployed from a laptop (`vercel --prod`) from feature branches, so CI never gates a release. No `test:a11y`, `test:visual` in CI. | Deploy only from `main` after CI; add a11y to CI. |
| Lint noise | 29/33 warnings come from generated migrations. | Add `src/migrations/**` to `globalIgnores`. |
| No knip config | knip needs manual interpretation (payload-types, assets.generated, Payload blocks). | Add `knip.json` with entries for Next/Payload/scripts and ignore generated files; add `npx knip` to CI once clean. |
| No formatting check | `.prettierrc` exists but no `format`/`format:check` script, not in CI, `eslint-config-prettier` unwired. Code style is mixed (single vs double quotes: `.prettierrc` says single, most files use double). | One formatting-only commit, then `format:check` in CI. |
| Undeclared deps in scripts | `pg`, `playwright` used by one-off scripts. | Resolved by deleting those scripts. |
| Committed binaries | 12 MB `.artifacts`, 9 MB PDF in `docs/services`. | See §5. |

---

## Needs-human list (do not touch without a decision)

1. `scripts/render-contact-email-previews.mjs` — keep as an npm script or delete with its doc line.
2. `eslint-config-prettier` — wire in or remove.
3. `revalidateBlogIndexGlobal` and the unused `security.ts` sanitizers — intended or dead?
4. Unused design-system primitives `Pill`, `Stack`, `Split`, `SectionHead`, `Quote`.
5. ~107 orphaned CSS selectors (§6).
6. Orphaned home content *types* after §1a (content data stays).
7. `docs/decisions/*`, dated audits, client binaries in `docs/services/`.
8. `public/decks/*.html` and any other `public/` candidates (append-only boundary).
9. 130 literal `/img/` paths → `assetSrc()` migration.
10. Renames (`on-it-workspace`, `caladan-navbar`, `sections-preview*.css`, `_blog-search.tsx`) — pure-move commits, separate from logic.
