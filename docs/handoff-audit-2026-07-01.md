# Zitrone Website — Handoff Readiness Audit

> Actualización de alcance, 12-oct-2026: el usuario eliminó el flujo de facturación del sitio; el enlace de correo es la solución definitiva. Las propuestas o pendientes de formulario/API/automatización de facturación de esta auditoría son históricos y no forman parte del trabajo actual. BILL-01 está cerrado; ver [DELIVERY.md](../DELIVERY.md).

> **Addendum (same day, post-fix session):** P0 items 1, 4 and 5 below are now FIXED and verified locally, plus a regression the e2e suite surfaced: navbar anchor links (`#outcomes` etc.) were broken on every non-home page and now resolve to the localized home (`/en#outcomes`) — fixed in `site-navbar.tsx#resolveHref`. Homepage image weight measured 14.41MB → 2.73MB (−81%). next 16.2.3→16.2.10, payload 3.84.1→3.85.2, vulnerabilities 33 (5 high) → 9 (0 high, all transitive). Verification: build ✅ 65 pages · lint 0 errors ✅ · contracts 5/5 ✅ · e2e 6/6 ✅. Still open: P0 #2 (domain migration) and #3 (git/deploy pipeline), and the P1/P2 lists. **Changes are NOT yet deployed** — the working tree also holds unfinished copy edits.

Date: 2026-07-01
Scope: full audit for client handoff — performance, SEO + domain migration, security, code health, delivery operations.
Method: static code review + production build + live measurement of `https://www.zitrone.mx` (Playwright network probe, curl header checks).

## Executive Summary

The platform is in far better shape than a typical "no expert" self-assessment suggests. Since the April 2026 audit, most of its critical findings were actually fixed: Payload CMS replaced hardcoded-only content, Sentry + Vercel Analytics + Speed Insights are wired, a real CSP and full security-header set ships on every response, Payload access control is correct, the billing API has rate limiting/origin checks/size caps, CI exists, and 65 pages prerender statically.

The site is **not slow because of architecture** — TTFB on the live homepage is ~380ms and the HTML is served static from CDN. It is slow because of **one concrete bug**: six service-card images are rendered as CSS `background-image`, bypassing Next.js image optimization, shipping **~12.5MB of the homepage's 14.4MB image weight** as raw multi-megabyte JPEGs.

Status: **Amber — launch-capable after a short, well-defined punch list.** Nothing found requires re-architecture. The riskiest open item is not code at all: it's the unexecuted domain migration (zitrone.com.mx still serves the old site with no redirects) and the operational handoff (manual laptop deploys, secrets on one machine, dirty git state).

## Evidence Snapshot

| Check | Result |
| --- | --- |
| `npm run build` | ✅ passes, 65 static pages, only blog index/category/feed dynamic |
| `npm run test:contracts` | ❌ 4/5 pass — 1 stale assertion (old `Zitrone_logo-dark.svg` filename) |
| `npm run lint` | ⚠️ 85k problems — 99.9% from stale `.claude/worktrees/**`; real: 4 errors, 16 warnings |
| `npm run assets:check` | ✅ OK — 197 assets, 38 clients, generated files consistent |
| `npm audit --omit=dev` | ❌ 33 vulnerabilities (5 high, incl. `ws`) |
| Live homepage weight | ❌ 14.4MB images / 51 requests (full scroll, 1440×2x viewport) |
| Live TTFB / DOMContentLoaded | ✅ 384ms / 727ms |
| zitrone.com.mx | ❌ still serving old site (200, on Vercel), zero redirects |
| Secrets in git | ✅ none tracked; `.env*` ignored |
| Git state | ❌ dirty working tree (14 modified, 6 untracked), `main` 5 commits behind `chore/delivery-clean`, deploys manual from laptop |

---

## P0 — Fix before client handoff

### 1. Homepage ships ~12.5MB of unoptimized service-card images (the "super slow")

`src/app/_components/home/service-system-slider.tsx` renders card imagery via a CSS custom property (`style="--image-url:url(/img/site/service-cards/pantry.jpg)"`), so the six files load raw from `public/`:

- `pantry.jpg` 2.9MB, `corporate-cafe.jpg` 2.4MB, `grab-and-go.jpg` 2.4MB, `corporate-dining.jpg` 1.9MB, `coffee-and-water.jpg` 1.8MB, `catering.jpg` 1.1MB

Everything else on the page goes through `/_next/image` correctly (srcset present — it renders as `srcSet` in the HTML; `sizes` attributes are sane).

**Fix (either works):**
- Replace the CSS-background pattern with `next/image` `fill` + `object-fit: cover`, or
- Re-export those six masters at ~1600px WebP (~150–250KB each) through the asset SSOT pipeline (`assets.manifest.json` + `assets-sync`).

Expected impact: homepage image weight drops from ~14.4MB to ~2MB.

### 2. Domain migration is designed but not executed

`docs/domain-migration-checklist.md` is a good plan; none of its cutover steps have run:

- `zitrone.com.mx` returns 200 on Vercel (last-modified 2026-06-30) with **no redirects** to `zitrone.mx`.
- Its `sitemap.xml` is an empty 38-byte stub — there is **no legacy URL inventory** to build the 301 map from. Pull the old site's indexed URLs from Google Search Console (or crawl it) before cutover; do not mass-redirect to the homepage.
- Since the old site is already on Vercel, redirects are easy: point `zitrone.com.mx` + `www.zitrone.com.mx` at the new project (or a redirect-only project) with per-path 308s preserving locale (`/` → `/es`, old service pages → closest `/es/services/...` equivalent).
- Verify both properties in Search Console, submit `https://www.zitrone.mx/sitemap.xml`, keep redirects ≥12 months.

Open question to resolve with the client: who controls `zitrone.com.mx` DNS and its Vercel project?

### 3. Deployment is a laptop, not a pipeline

- Deploys happen via local `vercel --prod`; GitHub `main` is 5 commits behind the working branch; working tree has 14 modified + 6 untracked files. CI (`.github/workflows/ci.yml` — lint, build, Playwright smoke) is well-built but is not the gate for what reaches production.
- **Before handoff:** commit/clean the tree, merge to `main`, connect the Vercel project to the GitHub repo so production deploys from `main`, and keep `release:home:prod` only for the CMS-sync step. A senior-team handoff cannot depend on one person's laptop state.

### 4. Failing contract test + real lint errors

- `tests/contracts/home-contracts.test.ts:53` still asserts the pre-SSOT filename `Zitrone_logo-dark.svg`; code now serves `/img/shared/brand/zitrone-logo-dark.svg`. Update the assertion — a red suite at handoff destroys trust in the whole suite.
- 4 genuine eslint errors, all "setState synchronously within an effect → cascading renders": `caladan-navbar.tsx:140,146`, `service-system-slider.tsx:151`, `system-tabs.tsx:100`. These cause render thrash on exactly the components involved in scroll/interaction (with Lenis smooth-scroll on top) — they are part of the "feels slow", fix them.
- Local `npm run lint` output is unusable (85k problems) because stale `.claude/worktrees/**` get linted. Delete the three stale worktrees and add `.claude/**` to `globalIgnores` in `eslint.config.mjs`.

### 5. Dependency vulnerabilities

`npm audit --omit=dev`: 33 vulnerabilities (3 low, 25 moderate, **5 high** — including `ws` uninitialized-memory disclosure). Run `npm audit fix`, rebuild, re-run tests. Schedule this as a recurring client-side task (document in runbook).

---

## P1 — Should fix for a "best-in-class" handoff

### Security

- **Rate limiter is per-instance memory** (`src/lib/rate-limit.ts` uses a module-level `Map`). On serverless every cold start/parallel instance gets its own bucket, so the billing-request limit is only advisory. Move to a durable store (Upstash Redis / Vercel KV) or add a Vercel WAF rate rule; at minimum document the limitation.
- **Production secrets live on this laptop** (`.env.production-cms`: prod `DATABASE_URL`, `PAYLOAD_SECRET`, `PAYLOAD_ADMIN_PASSWORD`, Blob token). At handoff: rotate all of them, move operational tasks to Vercel envs, and never hand the file over as-is.
- `payload.config.ts:60` falls back to `secret: ""` if `PAYLOAD_SECRET` is unset — make it throw instead.
- Live responses carry `access-control-allow-origin: *` that is **not** set anywhere in the repo — it's coming from Vercel project settings. Remove it in the dashboard; page HTML never needs wildcard CORS.
- `pg` warns that `sslmode=require` currently aliases `verify-full` and will weaken in the next major — pin `sslmode=verify-full` in the connection strings.
- Payload admin account inventory: verify only intended users exist in the `users` collection before transfer (admin password currently comes from seed env).

### SEO

- **Sanity ghost `/studio`** still referenced in three places (proxy matcher `src/proxy.ts:8`, `robots.ts:10`, `next.config.ts:94`) — dead config, remove.
- `/design-system` deploys publicly. It's robots-disallowed but not `noindex` (disallow ≠ deindex). Add an `X-Robots-Tag: noindex` header for it (like `/admin` has), or exclude the page from production builds.
- **x-default mismatch:** next-intl's middleware emits a `Link` header with `x-default → https://www.zitrone.mx/` while page metadata declares `x-default → /es`. Pick one (recommend the root `/`, which 307s by cookie/locale) — either disable next-intl `alternateLinks` or align `localeAlternates()`.
- Apex `zitrone.mx → www` redirect is 307; make it 308/301 (Vercel domain settings).
- Minor: sitemap `lastModified` uses build time for static pages (was flagged in April, still true); `feed.xml` doesn't belong in the sitemap.

### Performance (beyond P0)

- **Blog index and category pages are the only dynamic public routes** (ƒ in the build) because they read `searchParams` for search/filtering. Each hit = a Payload/Postgres query with a 4s timeout fallback. Either make them static and filter client-side (the search UI is already a client component), or accept it but knowing the blog index depends on Neon latency.
- `public/` is 259MB because it doubles as the deck-system asset source. Only referenced files are fetched by users, but every deploy uploads it all. Masters >2MB (`bebidas-fridge.jpg` 26MB, `buffet-islas.jpg` 18.5MB, `venue.jpg` 18.4MB) should never sit in `public/` at those sizes — resize on ingestion through the asset pipeline. Remember `public/` is append-only (shared contract) — resize in place, don't rename.

### Dead code

- **Write-only AI feature:** Payload hooks in `faqs.ts` and `blog-posts.ts` call `embedText()` (OpenAI embeddings) and store vectors that nothing ever reads (no consumer anywhere in `src/`). `OPENAI_API_KEY` isn't even set in prod, so it silently no-ops. Remove the hooks + `src/ai/` + `ai` + `@ai-sdk/openai` deps (or write down the roadmap feature they were for).
- **Unused components (0 importers):** `src/components/hero.tsx`, `cards.tsx`, `footer.tsx`, `faq.tsx`, `media-frame.tsx`, `scroll-bento-shrink.tsx`, `logo-mark.tsx`. Delete.
- **Stray files:** `public/service-detail-01..06.jpg` — untracked, referenced nowhere, violate the asset SSOT naming rules. Remove (or ingest properly via `assets.manifest.json` if the upcoming copy changes need them).
- Uncommitted `docs/services/Testimoniales Zitrone 2025.docx` — decide: source material into `docs/` (commit) or keep out of the repo.

---

## P2 — Nice to have / polish

- Rename `caladan-navbar.tsx` → `site-navbar-shell.tsx` (or similar): "Caladan" is leftover template naming a new team won't understand.
- `package.json` name is `on-it-workspace`; README still links absolute paths under `/Users/a1085/Documents/On It/...`. Rename the package to `zitrone-website` and fix README paths — first thing a senior reviewer will notice.
- `README.md` should gain a short "what the CMS controls vs what is static" section: production runs `HOME_CONTENT_SOURCE=static`, so **Payload edits do not appear on the homepage** — publishing = edit repo content files → `release:home:prod`. If the client expects "CMS = I edit and it's live," this must be explicit or renegotiated before handoff (it will read as "the CMS is broken").
- Raw `<img>` for logos in `service-detail-template.tsx:466` — fine for SVGs, but be consistent with the rest of the codebase (`next/image` + `unoptimized`).
- Vercel CLI is outdated locally (50.x vs 54.x) — upgrade before the final deploys.
- Consider adding `/admin` to `robots.ts` disallow for belt-and-suspenders (it already gets `X-Robots-Tag: noindex`).

---

## What is already genuinely good (don't touch)

- **Security headers**: full CSP (public + stricter admin variant), HSTS w/ preload, X-Frame-Options, COOP/CORP, Permissions-Policy — better than most agency sites.
- **Payload access control**: public read for content, authenticated writes, admin-only deletes, drafts hidden from anonymous, users collection locked down. CSRF/CORS allowlists set.
- **Billing API**: validation, rate-limit intent, origin check, content-length cap, Sentry capture, structured observability events, graceful webhook fallback.
- **SEO plumbing**: per-page canonicals + hreflang via `generateMetadata`, sitemap with locale alternates, JSON-LD (Organization, LocalBusiness, WebSite, WebPage, FAQPage, service catalog), 65 prerendered pages.
- **Env discipline**: typed validated env modules (`src/env/*`), grouped-credential validation, `.env.example` documented, nothing secret in git.
- **Ops docs**: domain-migration checklist, payload migration runbook, deployment runbook, security-operations checklist, this-and-April audits. Rare for a project this size.
- **Asset SSOT**: manifest + sync + check tooling passing.

## Suggested execution order

1. Fix service-card images + the 4 setState-in-effect errors → redeploy → re-measure (target: <2.5MB images, no cascading-render warnings).
2. Fix contract test, eslint ignores, `npm audit fix` → all checks green locally and in CI.
3. Clean git (commit/merge to `main`), connect Vercel↔GitHub, retire laptop deploys.
4. Dead-code sweep (components, AI embeddings, /studio remnants, stray files, renames, README/package.json).
5. Finish copy changes (your pending work) on the now-clean base.
6. Domain cutover per `docs/domain-migration-checklist.md`: build legacy URL map from Search Console → 308 redirects → submit sitemap → monitor.
7. Handoff package: rotate secrets, transfer Vercel/GitHub/Neon/Blob/Resend/Sentry/Search Console access, document CMS-vs-static content model, admin account inventory.
