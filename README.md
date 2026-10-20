# Zitrone Website

Next.js (App Router) marketing site for Zitrone, with Payload CMS (Postgres on
Neon, media on Vercel Blob) for the blog, privacy notice and lead records.
Spanish and English, localized slugs. Hosted on Vercel, project
`zitrone-website` in the Zitrone team (origin). Handoff plan: the final
version is first published on the origin project from `main`; the receiving
team (Arroba) then gets the same files in a new private repository (a
different commit SHA, same tree; correspondence recorded in
[docs/cms-home-rollout.md](docs/cms-home-rollout.md), step 10) and deploys it
in its own Vercel project. See [docs/vercel-handoff.md](docs/vercel-handoff.md).

Delivery status and open items: [DELIVERY.md](DELIVERY.md). Handoff package
index: [docs/README.md](docs/README.md#paquete-de-entrega).

## Billing

Invoice requests use the footer email link only. The website billing form, API and CMS page were deliberately removed; no billing automation or workflow is pending or planned in this delivery. This is the final user decision, reconfirmed on 2026-10-12. Historical billing migrations are retained for database history and cleanup.

## What lives where

| Content | Source in production |
| --- | --- |
| Home, navigation, footer | CMS-ready: the `home` global, `header`/`footer`/`siteSettings` globals and the logos, services, stories and FAQs collections reproduce the code content exactly (`npm run payload:check:home`). The site reads the code files (`src/app/_components/home/content/{es,en}.ts`) unless `HOME_CONTENT_SOURCE=cms`; by the 19-Oct decision this release does not seed or switch the home to the CMS (changes are made in the repository through review, tests and publication), see [docs/cms-home-rollout.md](docs/cms-home-rollout.md). |
| Services pages, contact page | Code: `src/app/[locale]/services/`, `src/app/lib/contact-content.ts`. |
| Blog (which posts exist and their text) | CMS. Static article files only fill empty fields of a published post, or stand in for the CMS in local development without a database. |
| Privacy notice | CMS, with the code text for empty fields |
| Leads | CMS collection `contactRequests` (roles `admin` and `sales`; see [CMS](#cms)) |

Full matrix and editor guide: [docs/manual-contenido.md](docs/manual-contenido.md).

## Setup

Requirements: Node.js **24** (`.nvmrc`, `engines`; same as CI and Vercel), npm, and for
the isolated API tests Docker/Colima with a Postgres 16 container.

```bash
npm ci
cp .env.example .env.local     # fill in values; never commit them
npm run env:check
npm run dev                    # http://localhost:3000
```

Configuration is by environment variable; names and purpose are in
[.env.example](.env.example). The ones that change behaviour:

| Variable | Effect |
| --- | --- |
| `DATABASE_URL` | Payload/Postgres. Unset = no CMS: blog from code files, leads cannot be saved. |
| `PAYLOAD_SECRET` | Payload auth signing. |
| `HOME_CONTENT_SOURCE` | Unset or any value other than `cms` = home, navigation and footer from the code files (production). `cms` = from the CMS, not used (decision of 19 Oct 2026). |
| `BLOG_CONTENT_SOURCE` | `static` forces the committed blog articles even with a database. |
| `RESEND_API_KEY`, `RESEND_FROM_ADDRESS`, `RESEND_FROM_NAME` | Lead notification email ([EMAILS.md](EMAILS.md), [docs/contact-email-delivery.md](docs/contact-email-delivery.md)). |
| `CONTACT_SALES_EMAIL` | Local/staging only: reroutes sales notifications. Never set in production. |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin (`https://www.zitrone.mx` in production). |
| `BLOB_READ_WRITE_TOKEN` | CMS media uploads. |
| `SENTRY_*`, `NEXT_PUBLIC_SENTRY_*` | Error reporting. |
| `OPENAI_API_KEY` | Optional. Embeddings for blog posts and FAQs on save (`src/ai/embeddings.ts`). Unset = skipped with a log warning. |

`.env.development.local` (git-ignored) is loaded by `next dev` only; use it to
point local development at a throwaway database instead of the hosted one.
`.env.production-cms` is used only by the `*:prod` Payload scripts.

## Checks

Run in this order (as CI does, `.github/workflows/ci.yml`). Do not run two
builds or two browser suites at once: they share `.next` and ports.

```bash
npm run env:check
npm run lint
npx tsc --noEmit
npm run assets:check        # not while a build's prebuild is writing
npm run email:check
npm run design:audit        # ratchet: fails only if token debt grows
npm run test:contracts      # unit/contract tests, no network
npm run build
npm run test:e2e            # builds, serves :3100, all Playwright suites incl. a11y
npm run test:a11y           # accessibility gate alone
npm run test:contact        # contact + profiler journeys, dev server :3102, POSTs mocked
npm run test:migration      # domain redirects/forms, isolated browser
npm run test:scripts        # test DB guard: refuses non-loopback Postgres
npm run test:api            # real Payload REST against a throwaway local DB
npm run test:cache          # blog publish/unpublish through a real build + Next cache
```

`test:api` creates `zitrone_api_test` in a local Postgres (`TEST_PG_URL`,
as CI does with a service container, or the `zitrone-staging-pg` Docker
container), applies all migrations, runs `tests/api/*` (lead permissions, blog
publishing lifecycle, CMS outage, network isolation) and drops the database.
Isolation, and its limits: `TEST_PG_URL` must be a plain
`postgres://user:pass@127.0.0.1|localhost:port[/db]` URL (no query
parameters) or the runner stops before any SQL (`npm run test:scripts` checks
this); the harness refuses any database that is not local and named
`*_api_test`; the runner starts every process from an empty
environment (no provider keys from your shell or `.env*` files) and preloads
`tests/api/network-guard.mjs`, which refuses fetch/TCP/TLS to anything but
loopback. It does not sandbox the filesystem or Docker. The backup drill
(`scripts/backup-restore-drill.sh`) uses the same isolation.

Visual sweep of a running production build (`npm run build && npx next start
--port 3105`): `BASE=http://127.0.0.1:3105 OUT=<dir> node scripts/visual-sweep.mjs`.

## CMS

```bash
npm run payload:migrate:status:prod   # read-only: pending migrations on the hosted DB
npm run payload:migrate               # apply migrations to DATABASE_URL (check which DB first)
npm run payload:migrate:create        # new migration after a schema change
npm run payload:check:home:prod       # read-only: does the hosted CMS home render exactly like the code? (0 differences)
npm run payload:check:home:prod -- --coverage   # read-only: text the home still reads from code
npm run payload:seed:home:prod        # copy the code home, navigation, footer and FAQs into the hosted CMS
npm run payload:sync:blog:prod -- --dry-run   # what a blog sync would overwrite
npm run test:cache:home               # CMS-mode build: edits reach the site, drafts do not (throwaway DB)
```

`payload:sync:blog:prod` overwrites the text of every post that has a code
file **and republishes it**. `payload:seed*` overwrites CMS content from code
(home scope: home, header, footer, site settings, FAQs, logos, services,
stories). Run them only when the code is the approved version.

CMS roles (table in `src/payload/access/roles.ts`): `admin` (everything),
`editor` (site content, no leads), `sales` (reads leads, changes status and
notes, exports CSV; no content editing, cannot delete leads). Only an admin
can change roles. The `sales` role needs migration
`20261008_133454_sales_role` on the target database before deploying.

## Release and rollback

The origin Vercel project is connected to this GitHub repository (checked
2026-10-18): production branch `main`, deployments on push enabled, custom
domains assigned automatically. **A merge or push to `main` deploys
zitrone.mx.** Every other branch gets a preview build; previews currently
fail because the Preview environment has `DATABASE_URL` (the production
database) but no `PAYLOAD_SECRET`. Do not add it to Preview without first
pointing Preview at a separate database. The failing previews are a
configuration still to fix (separate database and services for Preview), not
a safeguard. Past production deploys were made
with `vercel --prod` from a local checkout. The receiving team decides how its
own project deploys.

One procedure for this release, in Spanish, with publication, migrations and
recovery: [docs/cms-home-rollout.md](docs/cms-home-rollout.md). In short: QA in
an isolated environment, backup and change capture, migrate **before**
publishing, then publish by **one** mechanism: merge to `main` (origin) or the
receiving team's deploy. Do not also run `vercel --prod`. Then smoke-check.

Rollback: Vercel → Deployments → previous production deployment → **Instant
Rollback**. After the home seed or header/footer edits, run
`payload migrate:down` first (see the procedure). Neither step restores
database content; that comes from the backup.

## Outside this repository

The Zitrone sales decks live in a separate private repository that is not
part of this handoff. They load images from `https://www.zitrone.mx/img/...`
and read `public/assets-index.json`, so files under `public/img` are
add-only: do not rename or delete them (see [ASSETS.md](ASSETS.md)). Nothing
in this repository's install, build or tests depends on that repository.

## More

- Design system: [DESIGN.md](DESIGN.md) · assets: [ASSETS.md](ASSETS.md) · email: [EMAILS.md](EMAILS.md)
- Accessibility rules: [docs/accessibility.md](docs/accessibility.md)
- Analytics contract and GTM recipe: [docs/analytics-tracking.md](docs/analytics-tracking.md), [docs/analytics/gtm-activation.md](docs/analytics/gtm-activation.md)
- Domains and cutover: [docs/domain-migration-checklist.md](docs/domain-migration-checklist.md)
- Payload hooks call `revalidatePath()` at runtime; CLI scripts set `PAYLOAD_DISABLE_REVALIDATE=true` because there is no Next cache outside the app.
