# Zitrone Platform Audit

> Actualización de alcance, 12-oct-2026: el usuario eliminó el flujo de facturación del sitio; el enlace de correo es la solución definitiva. Las propuestas o pendientes de formulario/API/automatización de facturación de esta auditoría son históricos y no forman parte del trabajo actual. BILL-01 está cerrado; ver [DELIVERY.md](../DELIVERY.md).

Date: 2026-04-30  
Auditor: Codex, acting as senior software / web platform engineer  
Scope: current React/Next.js marketing site, blog, legal pages, and billing request flow

## Executive Summary

The project is in a strong prototype-to-foundation state, but it is not yet at a professional launch standard for a company that may support 1,000+ employees, multiple internal stakeholders, and future CMS-driven content operations.

What is already good:

- The app builds and lints successfully.
- The codebase is on a modern stack: Next.js App Router, React 19, TypeScript, `next-intl`.
- There is already a real design-token layer in `src/design-system/`.
- The billing flow is no longer just static copy; it already has a server route and a structured request model.
- SEO, sitemap, robots, and JSON-LD exist in a first-pass form.

What is still missing before this can be considered robust and professional:

- The content model is still code-first and hardcoded, not editorially scalable.
- The billing flow is not yet operationally robust; it is still a structured front-end shell around a webhook/mail fallback.
- There is no automated test layer, no CI pipeline, and no release guardrails.
- There is no analytics, error monitoring, or operational observability.
- There are navigation and information architecture issues across non-home pages.
- The design-system and preview system boundaries are still blurred, which raises long-term maintenance risk.

Recommended overall status: `Amber / Pre-launch foundation`, not `Green / production mature`.

## Overall Rating

| Area | Status | Notes |
| --- | --- | --- |
| Visual system foundation | Amber | Good tokens and direction, but still inconsistent page-level application |
| Frontend architecture | Amber | Solid modern base, but content and page composition are still too coupled |
| Content architecture / CMS readiness | Red | Hardcoded content is the biggest strategic blocker |
| Billing operations flow | Red | Not yet a robust workflow; no persistence, uploads, queue, or SLA status model |
| Security / compliance | Amber | Basic headers exist, but no CSP, abuse protection, or submission hardening |
| Accessibility | Amber | Good intent, but no formal audit or regression coverage |
| SEO / structured data | Amber | Core pieces exist, but there are accuracy and completeness gaps |
| QA / testing / CI | Red | No automated tests, no CI, no release gate |
| Observability / analytics | Red | No instrumentation or business telemetry |
| DX / maintainability | Amber | TypeScript + tokens help, but docs and boundaries are still inconsistent |

## Critical Findings

### 1. Billing and legal pages reuse home-only anchor navigation, which creates broken cross-page navigation

Severity: High

Evidence:

- `src/app/[locale]/billing/page.tsx:54`
- `src/app/[locale]/billing/page.tsx:61`
- `src/app/[locale]/privacy-notice/page.tsx:64`
- `src/app/[locale]/privacy-notice/page.tsx:71`
- `src/app/_components/home/content/en.ts:109`
- `src/app/_components/home/content/es.ts:109`

Why this matters:

The billing and privacy pages render the home navigation, but the home navigation items are section anchors such as `#services`, `#outcomes`, and `#cta`. On non-home pages those anchors target the current document, not the localized home page, so navigation behavior is wrong and users can get stuck.

What to do:

- Introduce page-aware navigation helpers.
- Convert home-only anchors into localized absolute routes like `/es#services` and `/en#services` when rendered outside the home page.
- Separate `site nav model` from `home section anchor model`.

### 2. The billing flow is not yet a real business workflow

Severity: High

Evidence:

- `src/app/api/billing-request/route.ts:47`
- `src/app/api/billing-request/route.ts:51`
- `src/app/lib/billing.ts:190`
- `src/app/[locale]/billing/billing-form.tsx:69`

Why this matters:

The current billing implementation is a good prototype, but it does not persist requests, does not store attachments, does not create an internal work queue, and falls back to `mailto:` when no webhook is configured. That is still operationally fragile for finance, accounting, support, and auditing.

What to do:

- Persist every request in a database.
- Add required attachments for ticket / folio evidence and Constancia de Situación Fiscal.
- Add statuses such as `received`, `validated`, `needs correction`, `issued`, `closed`.
- Add audit trail fields: who reviewed, when, why rejected, invoice number, PAC/ERP reference.
- Replace email fallback as the primary operational path.

### 3. The site content model is still hardcoded in TypeScript and is not scalable for an editorial or marketing team

Severity: High

Evidence:

- `src/app/_components/home/content/en.ts`
- `src/app/_components/home/content/es.ts`
- `src/app/[locale]/blog/content/en.ts`
- `src/app/[locale]/blog/content/es.ts`
- `src/app/lib/billing-content.ts`
- `src/app/lib/privacy-content.ts`

Size evidence:

- `src/app/_components/home/content/en.ts` = 677 lines
- `src/app/_components/home/content/es.ts` = 680 lines
- `src/app/[locale]/blog/content/en.ts` = 978 lines
- `src/app/[locale]/blog/content/es.ts` = 979 lines

Why this matters:

This is manageable for a prototype, but it does not scale for marketing, legal, operations, billing, blog publishing, or translation review. It also makes versioning, approvals, and content ownership much harder.

What to do:

- Move content to Sanity or a comparable CMS.
- Model `site settings`, `home page`, `blog index`, `blog post`, `legal page`, `billing page`, `navigation`, and `footer` as schemas.
- Store dates as ISO values, not inferred from display strings.
- Define editor roles and preview flow before business users begin entering content.

### 4. There is no automated quality gate

Severity: High

Evidence:

- `package.json:5`
- repository has no `.github/workflows/`
- repository search shows no test files

Why this matters:

The project currently has `dev`, `build`, `start`, and `lint`, but no unit tests, component tests, end-to-end tests, visual regression checks, or CI enforcement. This is risky for a site with localization, multiple content surfaces, and an operational form.

What to do:

- Add CI on every PR.
- Add Playwright coverage for home, blog, billing, privacy, and locale switching.
- Add smoke tests for navigation, form submission behavior, and metadata generation.
- Add visual regression for core marketing sections.

### 5. Observability is currently absent

Severity: High

Evidence:

- `package.json:11`
- `src/app/layout.tsx:1`
- repository search shows no `instrumentation.ts`, Sentry, analytics, PostHog, Segment, or OpenTelemetry

Why this matters:

Once the site is live, you need to know whether leads are converting, whether billing requests are failing, which pages are breaking, and whether a release introduced runtime issues. Right now there is no technical or product telemetry.

What to do:

- Add runtime error monitoring.
- Add business analytics for CTA, billing request start, billing request completion, blog engagement, locale usage.
- Add webhook delivery monitoring and alerting.
- Add uptime checks for critical pages and API routes.

## Area-by-Area Audit

### Experience and Information Architecture

Current state:

- The home page has a clear visual direction and a strong token base.
- The billing page has improved, but it is still using a content-led explanation pattern rather than a true product flow.
- Navigation logic is not yet page-aware.

Issues:

- Cross-page navigation is inconsistent because home anchors are reused on non-home pages.
- The billing page still explains too much and validates too little at the interface level.
- Some pages are compositionally mature; others still feel like adapted sections rather than first-class product pages.

Recommendation:

- Define page archetypes explicitly: `marketing landing`, `resource index`, `article`, `legal`, `transactional form`.
- Give each archetype its own navigation rules, hero rules, content density rules, and CTA model.
- Avoid reusing home IA blindly on transactional pages.

### Design System and Frontend Architecture

Current state:

- The token system is one of the strongest parts of the repo.
- `globals.css` imports token, layout, component, and preview styles.
- Preview and production boundaries are still mixed.

Evidence:

- `src/app/globals.css:1`
- `src/app/globals.css:5`
- `src/design-system/styles/sections-preview.css:1`
- `src/README.md:3`
- `src/app/design-system/page.tsx:23`
- `public/design-system/motion/*`
- `src/design-system/motion/*`

Issues:

- Production app styles still import preview-oriented CSS.
- Preview assets and live app assets coexist in ways that will confuse future contributors.
- Motion assets exist in both `src/` and `public/`, which creates drift risk.
- Repo docs still describe the app as a shell around previews, which no longer matches the current product direction.

Recommendation:

- Draw a strict boundary between `design-system source`, `preview artifacts`, and `production app`.
- Decide whether the design system is a true internal package or simply a folder convention.
- Remove duplicated motion files or make one side generated.
- Rewrite the repo docs to reflect the actual architecture.

### Content Architecture and CMS Readiness

Current state:

- Content is typed, localized, and reasonably organized.
- But it is stored directly in code as large locale files.

Issues:

- Content authors cannot work independently of engineers.
- Translation workflows are entirely manual.
- Legal and billing copy changes require deployments.
- Blog dates rely on parsing display text instead of canonical date fields.

Evidence:

- `src/app/[locale]/blog/articles.ts:51`
- `src/app/[locale]/blog/content/types.ts:14`
- `messages/en.json:1`
- `messages/es.json:1`

Observation:

`next-intl` is mostly being used for shell UI, while the real localized content still lives in giant TypeScript objects. This means you have localization infrastructure without a true localization workflow.

Recommendation:

- Move content and translations into Sanity.
- Use structured fields, not freeform code objects.
- Store canonical dates, slugs, SEO fields, OG images, and author metadata directly in the CMS.

### Billing Workflow and Internal Operations

Current state:

- Good validation start: RFC, ZIP, email, and required fields.
- Structured request payload already exists.

Issues:

- No attachments.
- No database.
- No back-office review UI.
- No queue or SLA.
- No idempotency protection.
- No rate limiting or bot protection.
- API returns field errors but the UI does not render inline field-level validation states.

Evidence:

- `src/app/lib/billing.ts:62`
- `src/app/api/billing-request/route.ts:32`
- `src/app/[locale]/billing/billing-form.tsx:82`
- `src/app/[locale]/billing/billing-form.tsx:105`

Recommendation:

- Add file upload support for ticket and Constancia.
- Add a `billing_requests` table and internal admin queue.
- Add field-level server error rendering in the UI.
- Add webhook retries, dead-letter handling, and alerting.
- Add abuse protection such as Turnstile and rate limiting.

### Security, Privacy, and Compliance

Current state:

- Basic headers are present.

Evidence:

- `next.config.ts:6`

Issues:

- No Content Security Policy.
- No explicit form abuse mitigation.
- No server-side persistence strategy for privacy-sensitive fiscal data.
- No visible data retention or deletion policy in application behavior.

Recommendation:

- Add CSP and review external domains used by fonts, images, CMS, analytics, and billing integrations.
- Define retention policy for fiscal submissions.
- Encrypt sensitive submission storage at rest.
- Restrict billing admin access and log internal actions.

### SEO and Structured Data

Current state:

- Canonicals, alternates, sitemap, robots, and JSON-LD exist.

Issues:

- Structured data references `/zitrone-logo.svg`, but the file does not exist.
- `sameAs` is empty in organization schema.
- Sitemap uses build time for static page freshness instead of content-level timestamps.
- Billing and legal pages have first-pass metadata but still need richer OG strategy.

Evidence:

- `src/app/lib/json-ld.tsx:21`
- `src/app/lib/json-ld.tsx:35`
- `src/app/lib/seo.ts:3`
- `src/app/sitemap.ts:6`
- public asset search shows no `zitrone-logo.svg`

Recommendation:

- Add a real brand logo asset for schema and social cards.
- Populate `sameAs` with official social profiles.
- Tie `lastModified` to content source once CMS exists.
- Add page-specific OG image logic for blog, billing, and legal pages.

### Accessibility

Current state:

- The codebase uses semantic headings, labels, and some ARIA patterns.
- There is visible effort toward accessible naming.

Issues:

- There is no documented accessibility audit process.
- No automated accessibility testing is present.
- Billing validation is not yet surfaced inline with `aria-invalid`, described errors, and focus management.

Evidence:

- `src/app/[locale]/billing/billing-form.tsx:45`
- `src/app/[locale]/billing/billing-form.tsx:295`

Recommendation:

- Add automated a11y checks in CI.
- Implement field-level error UI and focus-to-error behavior.
- Run keyboard-only, screen-reader, reduced-motion, and zoom audits on core templates.

### Performance

Current state:

- App is static-heavy and should perform reasonably well as-is.

Issues:

- Some images are intentionally marked `unoptimized`, which is fine for a prototype but should be reviewed before production.
- Large content blobs in code increase bundle maintenance risk over time.
- There is no analytics or performance monitoring to confirm real-world behavior.

Evidence:

- `src/app/_components/home/stories-tabs.tsx:115`
- `src/app/_components/home/hero-section.tsx:237`
- `src/app/_components/home/home-page.tsx:167`

Recommendation:

- Review all `unoptimized` images before launch.
- Add Web Vitals or equivalent RUM.
- Confirm image sizes, responsive sources, and LCP behavior on home and blog.

### QA, Release Engineering, and Operations

Current state:

- Manual `lint` and `build` checks are working.

Issues:

- No CI.
- No deployment promotion workflow.
- No preview checklist.
- No production readiness runbook.

Evidence:

- `package.json:5`
- no `.github/workflows/`

Recommendation:

- Add GitHub Actions or equivalent.
- Add preview deployment checklist.
- Add release checklist for content, legal, analytics, billing, SEO, and redirects.
- Add rollback guidance.

### Documentation and Team Onboarding

Current state:

- Documentation exists, but it is not aligned with the current app state.

Evidence:

- `README.md:1`
- `src/README.md:3`

Issues:

- Root README still describes a default Create Next App scaffold.
- `src/README.md` still describes `src/app` as a shell around previews.
- This will slow down new engineers and create architectural confusion.

Recommendation:

- Rewrite top-level docs around the actual production app.
- Document content ownership, route map, design-system boundaries, deployment model, and CMS plan.

## Recommended Delivery Plan

### Phase 1: Foundation Hardening

- Fix cross-page navigation on billing and privacy.
- Clean production/design-system boundary.
- Add real repository docs.
- Add CI with lint + build + smoke tests.
- Add basic analytics and error monitoring.

### Phase 2: Billing Workflow MVP

- Add DB-backed billing requests.
- Add uploads for ticket and Constancia.
- Add internal status model.
- Add Turnstile/rate limiting.
- Add admin queue or integration to internal ops tooling.

### Phase 3: CMS and Editorial System

- Model content in Sanity.
- Add preview mode and revalidation.
- Migrate home, blog, legal, and billing copy out of TypeScript.
- Add authors, timestamps, SEO controls, and locale workflows.

### Phase 4: Production Maturity

- Add test coverage for core templates and workflows.
- Add accessibility test suite.
- Add performance monitoring and release dashboards.
- Add runbooks for marketing, billing, and engineering.

## Best Realistic Architecture for This Project

If the goal is a professional, scalable implementation for a serious company, the most realistic target stack is:

- Next.js for frontend and localized routing.
- Sanity for content and editorial control.
- Vercel for previews, deployment, and environment management.
- Database-backed billing intake for structured request tracking.
- File storage for billing evidence uploads.
- Internal admin queue or workflow integration for billing review.
- Analytics + error monitoring + uptime monitoring from day one.

## Final Assessment

This project already has enough good engineering decisions to become a strong production platform. The risk is not that it is “bad”; the risk is that it is still half prototype, half production foundation. That is exactly the dangerous middle state where teams launch something that looks finished but is still operationally fragile.

If you harden the workflow, move content out of code, add release quality gates, and separate the preview/design-system layer from the live product, this can absolutely become a professional, scalable site.
