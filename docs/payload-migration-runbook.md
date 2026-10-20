# Payload Migration Runbook

> **Histórico: la migración de Sanity a Payload ya está hecha y el global `billingPage` fue retirado (migración `20260930_042253`).** Comandos vigentes: [README.md](../README.md#cms); respaldo antes de migrar: [operacion-y-entrega.md](operacion-y-entrega.md#respaldo-y-restauración-base-de-datos-y-medios).

Steps to complete the migration from Sanity to Payload once a Postgres database is provisioned.

## Status — what is already in place

The following code has been scaffolded and committed. None of it requires a database to exist:

- Payload v3.84.1 packages installed
- `src/payload/payload.config.ts` — postgres adapter, lexical editor, en/es localization, all globals + collections registered
- `src/payload/globals/` — `siteSettings`, `header`, `footer`, `home` (block-based), `billingPage`, `privacyNotice`
- `src/payload/collections/` — `users`, `media`, `services`, `stories`, `logos`, `faqs` (with embedding hook), `blogPosts` (with embedding hook), `blogCategories`
- `src/payload/blocks/` — `hero`, `servicesCarousel`, `proofBento`, `featuredMedia`, `operatingSystem`, `serviceSystemSlider`, `profiler`, `stories`, `faq`, `cta`
- `src/payload/fields/` — shared `seo`, `link`, `titleWords` field groups
- `src/app/(payload)/` — admin route at `/admin`, REST API at `/api`
- `next.config.ts` wrapped with `withPayload`; `/admin` CSP carved out
- `src/payload/loaders/` — Payload-powered loaders mirroring the Sanity loader API (currently fall through to the existing Sanity loaders until data is seeded and shape mappings are completed)
- `src/ai/embeddings.ts` — AI SDK embedding helper (OpenAI `text-embedding-3-small`); auth resolved by AI SDK (OIDC on Vercel via `vercel env pull`)
- `scripts/payload/seed.ts` — seeds globals + FAQs from existing TS content

## Prerequisites — to do once

1. **Provision Postgres on Neon via Vercel Marketplace**
   - Vercel dashboard → project → Storage → Create Database → Marketplace → Neon
   - Free tier, region close to users (`aws-us-east-1` or similar)
   - Vercel auto-injects `DATABASE_URL` and pooled variants
2. **Pull env locally**: `vercel env pull .env.local`
3. **Confirm `.env.local` has** `DATABASE_URL`, `PAYLOAD_SECRET`, `PAYLOAD_ADMIN_EMAIL`, `PAYLOAD_ADMIN_PASSWORD`
4. (Optional, for AI features) `vercel env pull` provisions `VERCEL_OIDC_TOKEN` for the AI SDK

## Migration sequence

### 1. Generate the Payload import map and migrations
```bash
npm run payload:generate-importmap
npm run payload:migrate:create initial
npm run payload:migrate
```
Creates Postgres tables for all collections and globals.

### 2. Bootstrap the admin user + seed initial data
```bash
npm run payload:seed
```
Creates the admin user from `PAYLOAD_ADMIN_EMAIL` / `PAYLOAD_ADMIN_PASSWORD`, then writes `siteSettings`, `header`, `footer`, FAQs, and `home` meta from the existing TypeScript content files.

### 3. Log in and verify
- Visit `http://localhost:3000/admin`, sign in
- Confirm globals show seeded data in both `es` and `en`
- Confirm FAQs collection shows the seeded questions

### 4. Upload media + build the home page
The seed script intentionally does not auto-upload media. From admin:
- Upload all logos (`/public/logos/*.svg`) into Media; set alt text in both locales
- Create Logo entries for each, with `usageContext` set
- Upload service detail images, hero photo, story photos
- Open the **Home page** global → **Sections** → compose blocks: Hero, Services carousel, Proof bento, Featured media, Operating system, Service system slider, Profiler, Stories, FAQ
- Each block field maps to the corresponding section component's props

### 5. Wire the loaders
Once each global/collection is mapped, replace the fall-through inside `src/payload/loaders/*.ts`. Replace the `void` placeholders with actual mapping logic from Payload doc shape → existing `HomeContent` / `ResolvedSiteSettings` types.

Then in the route handlers, swap the import:
```ts
// before
import { getResolvedHomeContent } from "@/sanity/loaders"
// after
import { getResolvedHomeContent } from "@/payload/loaders"
```
Files to update: `src/app/[locale]/page.tsx`, `src/app/[locale]/layout.tsx`, `src/app/[locale]/billing/page.tsx`, `src/app/[locale]/privacy-notice/page.tsx`, `src/app/[locale]/blog/page.tsx`, `src/app/[locale]/blog/[slug]/page.tsx`.

### 6. Smoke-test in dev
```bash
npm run dev
```
Visit `/`, `/en`, `/es/billing`, `/es/blog`, `/es/privacy-notice`. Verify both locales render. Submit the billing form. Click through the home page in admin and live-edit any text.

### 7. Run the e2e suite
```bash
npm run test:e2e
```

### 8. Remove Sanity
Once fully verified:
```bash
rm -rf src/sanity src/app/studio sanity.config.ts sanity.cli.ts
npm uninstall sanity next-sanity @sanity/vision @sanity/image-url
```
Update `next.config.ts` CSP `connect-src` to remove `*.sanity.io` entries (if any remain). Remove Sanity env vars from `.env.example` and the deployment.

Update docs:
- Delete `docs/sanity-handoff-runbook.md`, `docs/sanity-content-operations.md`, `docs/zitrone-sanity-cms-plan.md`
- Update `docs/vercel-deployment-runbook.md` to reference Neon + Payload instead of Sanity
- Update `docs/environment-readiness-checklist.md`

### 9. Switch the revalidation webhook
The current `src/app/api/revalidate/route.ts` validates a Sanity webhook signature. Replace with a Payload `afterChange` hook that calls `revalidateTag(...)` directly. Easier path: add `afterChange` to each collection/global in Payload and call `revalidateTag()` from the hook, then delete the route entirely.

## AI-native follow-ups

After migration is stable:

1. **Enable pgvector**: in Neon console → SQL Editor → `CREATE EXTENSION IF NOT EXISTS vector;`
2. **Add a `vector(1536)` column** to `faqs` and `blogPosts` mirroring the JSON `embedding` field, plus an HNSW index
3. **Add a `searchFaqs(query, locale)` function** in `src/payload/loaders/blog.ts` that runs a vector cosine query (already stubbed in the loader)
4. **Build an MCP server** exposing `searchFaqs`, `searchServices`, `createDraft` so Claude / Cursor can read and write your CMS

## Rollback

If anything goes wrong: `git reset --hard cfc9e64` returns to the pre-migration snapshot. Sanity will continue to function exactly as before because it has not been touched.
