# Leads → Google Sheet (complementary copy)

The CMS (`/admin` → Leads → Contact requests) is the record of truth for every
inquiry. This sheet is a *copy* for the sales team; if the sheet is unavailable
the visitor and the CMS record are unaffected and the row is re-pushed later.

## One-time setup (5 minutes, no code knowledge needed)

1. Create a Google Sheet (e.g. "Zitrone · Leads web") in the Zitrone Google Workspace.
2. Menu **Extensions → Apps Script**. Delete the sample code and paste the content of
   [`docs/google-sheets/leads-webhook.gs`](./google-sheets/leads-webhook.gs).
3. In the first line replace `CHANGE-ME-long-random-text` with a long random text
   (a password manager can generate one). Keep it; it is the shared secret.
4. **Deploy → New deployment → type: Web app** · Execute as: **Me** · Who has access:
   **Anyone** → Deploy. Authorize when asked. Copy the **Web app URL** (ends in `/exec`).
5. Give the site both values as environment variables:
   - `LEADS_SHEET_WEBHOOK_URL` = the `/exec` URL
   - `LEADS_SHEET_WEBHOOK_SECRET` = the secret from step 3

"Anyone" only means the URL accepts requests; without the secret the script answers
`forbidden` and writes nothing. The sheet itself stays private to whoever you share it with.

## Behaviour

- One row per lead, columns: Fecha, Folio, Idioma, Nombre, Empresa, Correo, Teléfono,
  Personas, Servicios, Resumen, Origen, CTA, Página, Landing, Referrer, utm_*.
- Idempotent on **Folio**: pushing the same lead twice never duplicates the row.
- Failure is reported to Sentry as `CONTACT_SHEET_MIRROR_FAILED`; nothing is shown to the visitor.
- Re-push: `npm run leads:sheet -- ZC-reference` (one lead) or `npm run leads:sheet -- --all`
  (latest 100; duplicates are skipped by the sheet). Without arguments it only lists.

## CSV export (independent of the sheet)

While signed in to `/admin`, open `/api/leads/export` to download every lead as
`zitrone-leads-YYYY-MM-DD.csv` (UTF-8 with BOM; opens directly in Excel/Sheets).
Includes Estado and Notas internas. Anonymous requests get 401.
