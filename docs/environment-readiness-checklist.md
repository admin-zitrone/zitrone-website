# Environment Readiness Checklist

> **Sustituido el 30-sep-2026.** Las variables Sanity y de facturación ya no existen. Variables vigentes por nombre: [.env.example](../.env.example) y [README.md](../README.md#setup); validación: `npm run env:check`. Se conserva como historial.

This document is written for both humans and AI agents working on the Zitrone site.

Use it before:
- configuring a new Vercel project
- connecting Sanity
- connecting Sentry
- preparing a production launch
- handing off the project to a client team

## Canonical Validation Commands

Run these from the project root:

```bash
npm run env:check
npm run build
npm run lint
```

For a stricter launch gate:

```bash
npm run env:check -- --launch
```

Interpretation:
- `env:check` validates runtime configuration shape and consistency
- `env:check -- --launch` also fails if the app still points to localhost or if launch-critical secrets are missing

## Source of Truth

Environment parsing and validation live in:
- [src/env/shared.ts](/Users/a1085/Documents/On%20It/src/env/shared.ts)
- [src/env/public.ts](/Users/a1085/Documents/On%20It/src/env/public.ts)
- [src/env/server.ts](/Users/a1085/Documents/On%20It/src/env/server.ts)

Do not reintroduce scattered `process.env` access when adding new integrations.
New variables should be added to the env layer first, then consumed from there.

## Preview Environment Minimum

These values are recommended for a Vercel preview or internal review deployment.

Required:
- `NEXT_PUBLIC_SITE_URL`
  - Must be the preview URL, not localhost
- `NEXT_PUBLIC_SANITY_DATASET`
  - Usually `production` unless a dedicated preview dataset is used
- `NEXT_PUBLIC_SANITY_API_VERSION`
- `SANITY_STUDIO_ENABLED`
  - `false` unless the preview deployment explicitly needs Studio

Optional but recommended:
- `NEXT_PUBLIC_SANITY_PROJECT_ID`
  - Required if preview should read CMS content
- `SANITY_REVALIDATE_SECRET`
  - Required if Sanity webhooks are connected
- `SANITY_PREVIEW_SECRET`
  - Required if draft preview is enabled
- `NEXT_PUBLIC_SENTRY_DSN`
- `SENTRY_DSN`
- `SENTRY_ENVIRONMENT`
- `APP_ALLOWED_ORIGINS`
  - Add extra browser origins only if needed

Optional depending on billing workflow:

## Production Minimum

These are the minimum values expected before launch.

Required:
- `NEXT_PUBLIC_SITE_URL`
  - Must be the final public domain
- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `NEXT_PUBLIC_SANITY_API_VERSION`
- `SANITY_REVALIDATE_SECRET`
- `SANITY_PREVIEW_SECRET`
- `SANITY_STUDIO_ENABLED`
  - Usually `false` unless Studio is intentionally exposed behind access controls

Recommended:
- `SANITY_API_READ_TOKEN`
  - Required for draft mode and preview reads
- `NEXT_PUBLIC_SENTRY_DSN`
- `SENTRY_DSN`
- `SENTRY_ENVIRONMENT`
- `SENTRY_TRACES_SAMPLE_RATE`
- `NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE`

Conditional:
- `SENTRY_AUTH_TOKEN`
- `SENTRY_ORG`
- `SENTRY_PROJECT`
  - Required only if source map upload is expected in build

  - Required only when the billing workflow should deliver automatically

## Current Launch Gate Behavior

`npm run env:check -- --launch` currently enforces:
- `NEXT_PUBLIC_SITE_URL` cannot point to `localhost` or `127.0.0.1`
- `SANITY_STUDIO_ENABLED=true` requires `NEXT_PUBLIC_SANITY_PROJECT_ID`
- if Sanity is enabled, preview and revalidate secrets should exist

If launch policy changes, update:
- [src/env/server.ts](/Users/a1085/Documents/On%20It/src/env/server.ts)
- [src/env/public.ts](/Users/a1085/Documents/On%20It/src/env/public.ts)

## AI Agent Workflow

If you are an AI agent picking up this repo:

1. Read:
   - [docs/environment-readiness-checklist.md](/Users/a1085/Documents/On%20It/docs/environment-readiness-checklist.md)
   - [.env.example](/Users/a1085/Documents/On%20It/.env.example)
   - [src/env/public.ts](/Users/a1085/Documents/On%20It/src/env/public.ts)
   - [src/env/server.ts](/Users/a1085/Documents/On%20It/src/env/server.ts)

2. Run:
   - `npm run env:check`

3. If preparing launch, run:
   - `npm run env:check -- --launch`

4. If adding a new provider:
   - add variables to `.env.example`
   - parse and validate them in `src/env/public.ts` or `src/env/server.ts`
   - consume them from the env layer, not directly from `process.env`
   - update this checklist if the provider becomes launch-critical

## Variable Ownership Guidance

For final client delivery, these accounts should ideally belong to the client:
- Vercel
- Sanity
- Sentry
- analytics providers
- billing workflow integrations

This repo can be configured first in a temporary owner account, but production credentials should move to client-owned infrastructure before launch.
