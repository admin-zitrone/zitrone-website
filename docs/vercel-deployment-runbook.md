# Vercel Deployment Runbook

> **Sustituido el 30-sep-2026.** Describe la etapa con Sanity, rutas de `Documents/On It` y el formulario de facturación, que ya no existen. Release y rollback vigentes: [README.md](../README.md#release-and-rollback); transferencia de proyecto: [vercel-handoff.md](vercel-handoff.md); dominios: [domain-migration-checklist.md](domain-migration-checklist.md). Se conserva como historial.

This runbook is written for:
- launch preparation
- preview deployment setup
- client handoff
- AI agents handling deployment tasks later

Use this together with:
- [docs/environment-readiness-checklist.md](/Users/a1085/Documents/On%20It/docs/environment-readiness-checklist.md)
- [docs/observability-taxonomy.md](/Users/a1085/Documents/On%20It/docs/observability-taxonomy.md)
- [docs/sanity-handoff-runbook.md](/Users/a1085/Documents/On%20It/docs/sanity-handoff-runbook.md)

## Goal

Deploy the Zitrone site to Vercel with:
- predictable previews
- validated environment configuration
- CMS readiness
- observability hooks
- a handoff path to client-owned infrastructure

## What Vercel Owns in This Project

Vercel should manage:
- deployment lifecycle
- preview URLs
- production domain mapping
- environment variables
- build/runtime logs
- Web Analytics and Speed Insights
- optional cron or future serverless integrations

## Pre-Deployment Commands

Always run before configuring or promoting a deployment:

```bash
npm run env:check
npm run lint
npm run build
```

Before a real launch or production promotion:

```bash
npm run env:check -- --launch
```

## Current Platform Dependencies

The app depends on:
- Next.js App Router
- next-intl
- Sanity integration
- Sentry integration scaffold
- Vercel Analytics and Speed Insights

Key files:
- [next.config.ts](/Users/a1085/Documents/On%20It/next.config.ts)
- [playwright.config.ts](/Users/a1085/Documents/On%20It/playwright.config.ts)
- [src/app/robots.ts](/Users/a1085/Documents/On%20It/src/app/robots.ts)
- [src/app/sitemap.ts](/Users/a1085/Documents/On%20It/src/app/sitemap.ts)
- [src/env/public.ts](/Users/a1085/Documents/On%20It/src/env/public.ts)
- [src/env/server.ts](/Users/a1085/Documents/On%20It/src/env/server.ts)

## Preview Deployment Checklist

1. Create or link the Vercel project.
2. Set preview environment variables.
3. Confirm `NEXT_PUBLIC_SITE_URL` matches the preview deployment URL strategy.
4. Keep `SANITY_STUDIO_ENABLED=false` unless preview editors explicitly need Studio.
5. Run preview smoke checks:
   - `/es`
   - `/en`
   - `/en/blog`
   - `/es/privacy-notice`
   - `/en/billing`

Recommended validation:

```bash
npm run test:e2e
```

## Production Deployment Checklist

1. Point `NEXT_PUBLIC_SITE_URL` to the real production domain.
2. Run:
   - `npm run env:check -- --launch`
3. Confirm production secrets exist:
   - Sanity preview/revalidate secrets
   - Sentry DSNs
   - optional billing webhook credentials
4. Confirm Studio exposure policy:
   - usually `SANITY_STUDIO_ENABLED=false`
5. Confirm robots/sitemap output is correct.
6. Confirm custom domain and HTTPS are active.
7. Confirm analytics and monitoring are receiving events after deploy.

## Required Environment Variables

At minimum for a real production deployment:
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SANITY_DATASET`
- `NEXT_PUBLIC_SANITY_API_VERSION`

If Sanity content is live:
- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `SANITY_API_READ_TOKEN`
- `SANITY_PREVIEW_SECRET`
- `SANITY_REVALIDATE_SECRET`

If Sentry is live:
- `NEXT_PUBLIC_SENTRY_DSN`
- `SENTRY_DSN`
- `SENTRY_ENVIRONMENT`

If source map upload is expected:
- `SENTRY_AUTH_TOKEN`
- `SENTRY_ORG`
- `SENTRY_PROJECT`

If billing delivery is live:

## Ownership Recommendation

For final delivery, Vercel should belong to the client.

Recommended pattern:
- build initially in a temporary owner account if needed
- move production ownership to the client before launch
- invite engineering collaborators instead of centralizing ownership in a freelancer or agency account

## Deploy Promotion Logic

Treat environments like this:
- local: engineering only
- preview: review and QA
- production: client-facing canonical deployment

Do not treat preview deploys as implicit production approval.

## Observability Expectations

After deployment, verify:
- Vercel Analytics is active
- Speed Insights is active
- Sentry events arrive if DSNs are configured
- billing submit events are visible
- locale navigation works

Reference:
- [docs/observability-taxonomy.md](/Users/a1085/Documents/On%20It/docs/observability-taxonomy.md)

## Security Notes

Current security hardening already includes:
- CSP and security headers
- Studio gating
- draft-mode redirect sanitization
- revalidate tag sanitization
- trusted-origin checks on billing request submission

Relevant files:
- [next.config.ts](/Users/a1085/Documents/On%20It/next.config.ts)
- [src/lib/security.ts](/Users/a1085/Documents/On%20It/src/lib/security.ts)

## AI Agent Workflow

If you are an AI agent assigned to deployment work:

1. Read:
   - [docs/vercel-deployment-runbook.md](/Users/a1085/Documents/On%20It/docs/vercel-deployment-runbook.md)
   - [docs/environment-readiness-checklist.md](/Users/a1085/Documents/On%20It/docs/environment-readiness-checklist.md)

2. Run:
   - `npm run env:check`
   - `npm run build`

3. For launch preparation, run:
   - `npm run env:check -- --launch`

4. If variables are missing:
   - update `.env.local` locally
   - update Vercel project envs later
   - do not bypass the env layer with direct `process.env` reads

5. After deploy, verify:
   - public home loads
   - localized routes load
   - blog loads
   - billing form returns the expected fallback or workflow response
   - no accidental exposure of Studio if it is meant to stay disabled

## Done Definition

Vercel handoff is considered healthy when:
- env validation passes in launch mode
- build passes
- smoke/e2e checks pass
- preview deployment is stable
- production domain is correct
- monitoring is connected
- the client team can manage environment variables and deployment ownership
