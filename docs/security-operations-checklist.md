# Security Operations Checklist

> **Nota del 30-sep-2026: `/api/billing-request` y los secretos de Sanity ya no existen.** Las comprobaciones vigentes del endpoint de contacto (429, 413 medido sobre el flujo, origen) y de permisos de leads están en `npm run test:contracts` y `npm run test:api`; la propuesta de rate limit compartido, en [operacion-y-entrega.md](operacion-y-entrega.md#propuesta-para-el-rate-limit-requiere-decisión).

## Release smoke checks

Run these checks on each production release:

- `www.zitrone.mx/en` returns normal public security headers
- `/admin` returns `X-Robots-Tag: noindex, nofollow`
- `/studio` returns `X-Robots-Tag: noindex, nofollow` when enabled
- `/api/draft-mode/enable?secret=invalid` returns `401`
- `/api/revalidate` with invalid signature returns `401`
- Billing workflow was deleted; do not test or restore `/api/billing-request`. The footer email link is the final billing implementation.

## Secret rotation checklist

Review and rotate independently by environment:

- `PAYLOAD_SECRET`
- `SANITY_PREVIEW_SECRET`
- `SANITY_REVALIDATE_SECRET`
- `RESEND_API_KEY`
- `BLOB_READ_WRITE_TOKEN`
- `SENTRY_AUTH_TOKEN`

Rules:

- do not reuse the same value across local, preview, and production
- rotate immediately after suspected exposure
- update the corresponding integration or webhook sender before switching production traffic
- verify post-rotation:
  - Payload admin login works
  - preview works with the new secret only
  - Sanity revalidation works with the new secret only

## Platform review

- confirm `NEXT_PUBLIC_SITE_URL` points to production
- confirm only required origins are listed in `APP_ALLOWED_ORIGINS`
- review Vercel Firewall / WAF rules for `/admin` and `/studio`
- review Blob token scope and whether write access is broader than necessary
