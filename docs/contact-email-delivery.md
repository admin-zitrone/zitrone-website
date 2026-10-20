# Inquiry email delivery

Both `/api/contact-request` callers (Contact and the home profiler) use the same flow:

1. Normalize/validate the inquiry and apply the existing origin, honeypot and rate controls.
2. Save the lead and both exact email snapshots in one Payload create.
3. Send a sales notification to **opina@zitrone.com.mx**, with Reply-To set to the visitor.
4. Send the localized confirmation to the visitor, with Reply-To set to **opina@zitrone.com.mx**.
5. Save each provider acceptance ID independently. Once the lead exists, notification or telemetry failure does not turn success into a request to submit again.

Sender: `RESEND_FROM_NAME <RESEND_FROM_ADDRESS>`, defaulting to `Zitrone <hola@send.zitrone.mx>`. `RESEND_API_KEY` stays server-side. The key currently in ignored `.env.local` is approved for temporary local use only; rotate before production/handoff. No changes to Google Workspace or incoming mail are needed.

## Staging (isolated) — verified September 14, 2026

Nothing here touches the hosted Neon database, `opina@zitrone.com.mx`, Google Workspace or production.

- `.env.development.local` (Git-ignored, loaded only by `next dev` and by `email:test` / `email:retry`) overrides two values: `DATABASE_URL` → local throwaway Postgres, and `CONTACT_SALES_EMAIL` → `sebastian@1085.mx`. Delete the file to point local dev back at the hosted database and the real sales inbox.
- Local Postgres: Colima + Docker container `zitrone-staging-pg` (`postgres:16-alpine`, port 55432, db `zitrone_staging`). Recreate with `colima start && docker start zitrone-staging-pg`; all seven migrations (including `email_delivery`) were applied to it with `DATABASE_URL=… npm run payload:migrate`.
- `CONTACT_SALES_EMAIL` reroutes the sales notification `to:` and the confirmation `reply_to:`; it falls back to `opina@` when unset or invalid (contract-tested). Production never sets it.
- Evidence: `npm run email:test -- --send` on staging created `ZC-20260915-QWLS9Z` (ES contact) and `ZC-20260915-OKNXVB` (EN home); all four messages show `accepted` with Resend provider IDs via `npm run email:retry -- <ref>`. Inbox receipt at sebastian@1085.mx is the remaining human check for this stage.

## Go-live (only after approval)

1. Rotate the chat-exposed Resend key; create a production key (Sending access, `send.zitrone.mx`).
2. Set `RESEND_API_KEY`, `RESEND_FROM_ADDRESS=hola@send.zitrone.mx`, `RESEND_FROM_NAME=Zitrone` on the Vercel project (production). Do **not** set `CONTACT_SALES_EMAIL`.
3. Apply the pending `email_delivery` migration to the hosted Neon database (`npm run payload:migrate` with the hosted `DATABASE_URL`; additive, nullable).
4. `vercel --prod` (manual, per project convention), then one marked test inquiry per surface and confirm receipt at opina@.

## Activation checkpoint — September 14, 2026 (hosted database — superseded by staging above until approval)

Code and mocked tests are complete. **Not activated or deployed.** A read-only check of the database configured in `.env.local` found all six previous migrations applied and no `email_delivery` column. The prepared migration `20260914_160000_contact_email_delivery` adds one nullable JSONB field; it does not rewrite or send historical leads. Its down migration deletes email history and must not be used as a routine rollback.

The new checkout requires this migration before real form submissions. The currently deployed older build does not use the new column. Get approval for the hosted database addition and real acceptance test, then:

1. Apply only the pending migration with the project's `npm run payload:migrate` command (verify the selected environment and pending migration first).
2. Start the local preview: `npm run dev -- --hostname 127.0.0.1 --port 3000`.
3. `npm run email:test` describes the smoke test without sending. `npm run email:test -- --send` submits two marked test inquiries to the local endpoint, ES contact and EN home source. Each generates a sales email and a confirmation; **all four go only to opina@zitrone.com.mx**. No real prospect address is used. This script tests the endpoint; the browser tests separately exercise both UIs.
4. Run `npm run email:retry -- ZC-reference` for each returned reference to inspect persistence and provider IDs. This command is read-only without `--send`.
5. Verify both records and four emails in Resend and the inbox, including junk. Check Reply-To headers and an actual reply in Google Workspace. All-recipient test headers point to the same sales inbox; a distinct controlled visitor inbox is still needed to prove an actual sales-to-visitor reply beyond the mocked header assertions.
6. Production activation remains a separate deployment/configuration step. Local acceptance is not production acceptance.

## Failure and recovery

Transient network, HTTP 429 and HTTP 5xx failures get up to three attempts per message with bounded delay and a five-second request timeout. Permanent provider rejection is not retried immediately. Missing key leaves the saved inquiry and pending/failed email snapshot available for recovery.

`npm run email:retry` lists status for the latest 100 records that have a snapshot; it does not print message bodies, addresses or credentials. It does not process historical records without snapshots.

To retry one approved request, run `npm run email:retry -- ZC-reference --send`. Already accepted messages are skipped. The exact persisted recipient, content, sender and idempotency key are reused. Email settings/template changes do not silently change an already queued message.

[Resend retains idempotency keys for 24 hours](https://resend.com/docs/dashboard/emails/idempotency-keys). Recovery stops at 23 hours after snapshot creation and marks unresolved messages `review`. Reconcile those with Resend before any manual resend. Do not reset statuses or regenerate keys blindly; a timeout may have occurred after acceptance. Concurrent recovery runs can repeat provider requests inside this window, but reuse the same keys and bodies.

`accepted` means Resend accepted the API request, **not that an inbox received it**. Bounces and inbox delivery currently require dashboard/inbox review; no webhook or scheduled recovery worker has been configured. Sentry receives only a safe status code and request reference for notification failures. Operational ownership and monitoring frequency must be agreed before release; manual recovery should run within the 23-hour window.

A browser retry after an ambiguous lost HTTP response can still create a second lead. Server-side submission deduplication is not part of this email change; per-message provider retries are deduplicated.

## Local evidence

- `npm run test:contracts`: 53 passed, including provider timeout/429 retries, safe errors, durable-first ordering, partial failures, recovery after status-save failure, exact replay and expired-window handling.
- `npm run test:contact`: 26 passed on isolated localhost:3102. All inquiry POSTs intercepted; covers ES/EN contact plus complete home-profiler failure/retry journeys.
- TypeScript and scoped application/test lint pass; `npm run email:check` passes.
- `npm run email:preview` renders the new sales/confirmation templates in ES/EN alongside existing templates. `node scripts/render-contact-email-previews.mjs` produces screenshots with all network traffic blocked. Reviewed ES mobile at 390px and EN desktop at 900px; no horizontal overflow. This is browser preview QA, not Gmail/Outlook/Apple Mail rendering acceptance.
