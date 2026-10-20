# Zitrone — delivery progress and handoff log

Current work and statuses: [DELIVERY.md](../DELIVERY.md).

Append a concise entry after each meaningful result. Keep previous findings intact; add corrections or superseding evidence with a date. Record changes and checks, not private reasoning or chat transcripts. Link to artifacts and commits when available. Never include secrets or customer submission data.

## Entry template

```text
Date/time and timezone:
Agent/person:
Ticket(s):
Outcome and status:
Changes / files / commit:
Checks and evidence (environment, command or method, result):
Decisions and authorizations:
Remaining risks / dependencies:
Next exact action:
```

## 2026-09-07 — audit completed

- Agent: Codex.
- Outcome: baseline audit completed; application remediation not started.
- Artifact: [delivery-readiness-audit-2026-09-07.md](delivery-readiness-audit-2026-09-07.md).
- Checks: build and TypeScript passed, 68 static pages generated; lint had 0 errors/29 warnings; content contracts 23 passed/3 failed; assets passed; email palette failed for two values; design audit passed against a baseline of 978 existing violations.
- Production read-only checks: `/es` 200; `/es/contact` 404 via HEAD and GET; `/en/contact` 200; sampled Spanish services routes 200. Robots and sitemap served. Live homepage CSP differs from this checkout. Exact production release was not identified.
- Security finding: CMS self-update access and unprotected role field indicate an editor-to-admin escalation path. No live exploit attempted.
- Workflow findings: accepted contact leads are persisted, but the reviewed path has no notification; billing automation and actual receipt not verified; contact funnel event declarations are not fully wired.
- Limits: no available browser connection, no fresh E2E/visual/accessibility/performance signoff, no account-ownership verification, no live test submissions, no production changes.
- Worktree: pre-existing pantry image replacements and generated artifacts preserved. Normal build generators ran; token generation metadata changed. No application fixes were made.
- Next action: protect CMS roles with meaningful isolated permission checks; diagnose production contact mismatch separately.

## 2026-09-07 — portable release tracker established

- Agent: Codex.
- User intent: preserve the audit so Codex or Claude can continue across sessions, focus effort on the most important issues, and prepare the project by the end of this week.
- Working target: Friday, September 11, 2026, America/Mexico_City. Exact handoff time is not yet supplied.
- Changes: created root `DELIVERY.md` with stable ticket IDs, priorities, statuses, dependencies, acceptance criteria, release checklist and resume prompt; created this progress log; linked the tracker from `AGENTS.md` and the docs index.
- Cross-tool entry: existing `CLAUDE.md` imports `AGENTS.md`; kept that arrangement and avoided a second conflicting task list.
- Status: all remediation tickets remain TODO. Audit/planning completion is not implementation completion.
- Storage: files saved in this local repository. No commit, push, remote backup, deployment or background/scheduled worker was created by this step.
- Next action: resume SEC-01. Obtain sales recipient/owner, billing scope and production access while proceeding with independent local work.

## 2026-09-07 — SEC-01 and QA-01 closed; REL-01 re-diagnosed

- Agent: Claude (Opus 5).
- Ticket SEC-01 — **DONE**. Added field-level `access.create`/`access.update` on `role` in `src/payload/collections/users.ts` (admins only; `!user` kept for Payload's first-user bootstrap, which collection-level `create` still gates), plus a `beforeChange` hook that reverts any role change attempted by a non-admin. Evidence: new `tests/contracts/users-access-contract.test.ts`, 6 assertions covering admin/editor/anonymous on both access functions and the hook. Local, 2026-09-07, all passing. Not yet exercised against a live Payload instance.
- Ticket QA-01 — **DONE**. All 27 contract tests pass; `email:check` OK; `assets:check` OK; `lint` 0 errors / 29 pre-existing warnings; `npm run build` succeeds.
  - Editorial rules revised, with rationale recorded in the test file: FAQ count `exactly 4` → range `4–8` (pantry and café deliberately answer more long-tail questions, which is a search asset, not a defect); `faqAnswer` budget 45 → 90 words (45 was calibrated on short four-FAQ sets; catalogue and equipment answers are lists, and the scannability rule that matters — a lead sentence of ≤20 words — is enforced separately and was tightened, not relaxed); FAQ opener whitelist extended with `en/de/hay/es/cual/cuales/which`, all natural search openers that the list simply missed.
  - Copy edited only to satisfy those rules, preserving every fact: pantry FAQ 1 and 3 and the EN twins got a direct lead sentence; the Lirika/Krea/Aulika machine specs were tightened; three `resolves` points trimmed to the 12-word card budget; the `cafe-y-agua` hero lede trimmed to 12 words. No fact was removed and nothing was invented.
  - Email palette: `src/emails/tokens.ts` synced to the design system — `secondary` `#5E747A` → `#4E6469`, `action` `#93BA36` → `#0C5068`. **Visual review needed**: `action` moves email eyebrow text from lime to dark teal. Flag if the intent was to keep brand lime in email.
- Ticket REL-01 — **BLOCKED on a deploy decision. The September 7 audit's premise was wrong and is superseded.** `/es/contact` returns 404 because the Spanish contact route is localized to `/es/contacto`, which returns 200. Nothing links to `/es/contact`.
  - The real defect, confirmed by fetching the live ES homepage: the deployed build's nav and hero primary CTA is `mailto:opina@zitrone.com.mx` and the "Contacto" link is an in-page anchor to the footer. There is no link to the contact form anywhere on the live homepage, in either locale. Production is an older build than this checkout, where the same CTA is `contactHref('nav')` → `/contact?src=nav` → `/es/contacto`.
  - Consequence: every live visitor's primary call to action opens their mail client addressed to a feedback inbox. This is a larger conversion problem than a 404 would have been, and it also means LEAD-01's "no notification" finding is currently moot in production — no form submissions can be reaching anyone.
  - Next action: user decides whether to deploy this checkout (`vercel --prod`, run manually — this project does not deploy from git). Do not deploy without that go-ahead.
- Files changed: `src/payload/collections/users.ts`, `tests/contracts/users-access-contract.test.ts` (new), `tests/contracts/service-page-contract.test.ts`, `src/app/[locale]/services/service-targets.ts`, `src/emails/tokens.ts`.
- Not done: no commit, no deployment, no CMS or production change. Pre-existing pantry photography and generated files left untouched.

## 2026-09-07 — REL-01 demoted to a launch-day check

- Agent: Claude (Opus 5), after the user pointed out the site is not final.
- Correction to the entry above: REL-01 was treated as a current P0. It is not. The site is still in development and production runs an older build, so the audit's production observations describe that old build rather than the work in progress. Diagnosing or deploying production now has no effect on the deliverable.
- Standing rule for this project until handoff: **verify against `npm run dev`, not against the live domain.** Deploy once, on handoff day, then verify the deployed build.
- Residual risk to watch, not to act on: if the client is given the live URL before handoff, they see a stale build whose primary CTA is a `mailto:` to a feedback inbox and which cannot reach the contact form.
- Status change: REL-01 `BLOCKED` → `DEFERRED (launch-day)`. Priority `P0` → `LAUNCH-DAY`.
- Next action: UX-01.

## 2026-09-07 — SEO-01 implemented and verified locally

- Agent: Codex. Re-read Claude's incoming handoff during this session and preserved its source changes. SEC-01/QA-01 were already implemented by Claude, so Codex took SEO-01 as separate work. No production changes were made.
- Outcome: SEO-01 is **VERIFY**, with local code acceptance complete and deployment/Search Console/migration verification still outstanding.
- Changes: added `src/app/lib/blog-profile-alternates.ts` so author/reviewer metadata, sitemap entries and language navigation resolve actual translated names through shared article slugs. Missing or ambiguous relationships omit the unproven SEO alternate; navigation can fall back to the translated blog index. Added `localizedAlternates` to `src/app/lib/seo.ts`.
- Sitemap: separated deterministic assembly into `src/app/lib/site-sitemap.ts` for testing; `src/app/sitemap.ts` still loads CMS content and now loads both locales together. Added both contact pages and included default editorial credits consistently with the profile pages.
- Additional defect found in local HTTP verification: next-intl's automatically generated Link headers still pointed to untranslated profile slugs, contradicting the corrected HTML. Set `alternateLinks: false` in `src/i18n/routing.ts`; HTML metadata and sitemap supply the actual alternates. Confirmed locale routing still works and framework font/style preload headers remain present.
- Evidence: `npm run test:contracts` **40/40 passed**, including seven new SEO tests for reciprocal translated author/reviewer URLs, missing and ambiguous counterparts, default credits, contact entries, sitemap destination existence and locale middleware behavior. `npx tsc --noEmit` passed. Scoped ESLint across all changed SEO files passed. `git diff --check` passed.
- Runtime evidence: `npm run dev -- --hostname 127.0.0.1 --port 3102`; read-only HTTP requests returned a 200 sitemap with 62 entries, and 200 for `/es/contact`, `/en/contact`, both localized author profiles and both reviewer profiles. All six pages had expected self-canonicals and locale alternates; the second verification confirmed conflicting hreflang response headers were removed. The configured local canonical origin is `http://localhost:3000`, independent of the temporary test server's port; production origin must be checked at handoff.
- Correction to prior route notes: **this checkout's** Spanish canonical route is `/es/contact`, confirmed by routing config, generated metadata and local HTTP 200. Do not carry the older live deployment's `/es/contacto` behavior into local sitemap assumptions. No further production diagnosis was pursued after reading the revised handoff.
- Limits: these are HTTP/metadata and contract checks, not browser interaction or a fresh production build. Claude's security checks passed in the combined suite, but are callback-level contracts; an isolated authenticated API acceptance test is still not evidenced in this log. Do not describe them as a completed live/API penetration test.
- Dependencies requested from user: sales notification recipient/owner and whether billing must be automated or may use an agreed manual email workflow. No answer received during this work; no messages, lead records or production writes were generated.
- Next action: UX-01 and ANALYTICS-01 remain local implementation priorities; LEAD-01/BILL-01 require the receiving workflow details to complete end-to-end acceptance. Verify final security API behavior before release.

## 2026-09-08 — email and domain architecture discussed

- User-confirmed facts: two people handle new inquiries; existing company email uses Google Workspace on `zitrone.com.mx`; the user purchased `zitrone.mx` and wants visitors using either domain to reach the new website.
- Recommendation, **not yet approved or configured**: choose `www.zitrone.mx` as the canonical website and permanently redirect old website URLs to their new equivalents at launch, with migration/Search Console checks. Keep existing Google email on `zitrone.com.mx` and preserve its mail/authentication DNS records. Website redirects do not require a mailbox migration.
- For two inquiry handlers: recommend a Google Groups Collaborative Inbox at a client-approved sales address (example only: `ventas@zitrone.com.mx`), with both people as members, shared conversation history/assignment, and permissions for external inquiries while restricting conversation visibility. If `opina@` is an existing mailbox they already share, delegated access is an alternative; do not recreate or replace it blindly.
- Resend recommendation: automated sender on `send.zitrone.mx`; customer confirmation Reply-To points to the monitored Google sales address. Resend account should be client-controlled. Domain verification and reply testing remain undone.
- Optional later brand alignment: add `zitrone.mx` as a user alias domain in the existing Google Workspace so the same users/groups can also receive at the shorter domain; no new Workspace organization or mailbox migration is needed for that alias approach. A future primary-domain replacement would require a separate migration decision.
- Sources checked: [Google domain aliases](https://knowledge.workspace.google.com/admin/domains/add-a-user-alias-domain-or-secondary-domain?hl=en), [Collaborative Inbox](https://support.google.com/a/users/answer/10375787?hl=en), [Resend verified domains](https://resend.com/docs/dashboard/domains/introduction), [Google site moves](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes).
- No DNS, Workspace, account, email-sending, site-deployment or application changes made. Pending: chosen sales address, two responsible users, Workspace admin coordination, billing workflow, and approval of the proposed domain arrangement.

## 2026-09-08 — Resend paused; first contact UX corrections verified

- Agent: Codex. User confirmed `opina@zitrone.com.mx` is the existing sales address; two people handle inquiries. User explicitly asked to pause Resend until creating the account and continue independent work. Google Workspace and DNS remain untouched. Account ownership under this address was recommended, not configured.
- UX-01 first batch: extras, notes and marketing-source answers are optional; company is visibly optional. Subsidy percentage is serialized only for a yes answer, including a valid zero. Name/email errors are associated with inputs and receive focus; steps and success receive focus without stealing focus on initial page load. The submit button allows validation instead of silently disabling on invalid input. Server field errors are localized; failed submissions preserve answers. A synchronous guard prevents simultaneous duplicate submissions; Back is disabled while sending.
- Files: contact form and localized content; new `tests/e2e/contact.spec.ts`, `playwright.contact.config.ts`, and `npm run test:contact`; accessibility documentation updated.
- Verification: all **5 isolated Chromium tests passed** against local `npm run dev` on port 3102 (ES 390px mobile, EN desktop). Tests cover local invalid fields, simulated 502 and 422 responses followed by 201 recovery, applicable/no/undecided subsidy, focus, and duplicate submit events. Axe scans scoped to final error-state forms reported no violations. All POST requests were intercepted: no database records or emails were created.
- Other checks: 40/40 contract tests passed; TypeScript, scoped ESLint and diff whitespace check passed; design audit passed with existing 978-violation baseline unchanged. No fresh production build or full-site accessibility signoff claimed.
- Test setup: interactive Browser runtime reported no connected browsers after documented discovery; used the repository's isolated Playwright test runner. Initial sandbox port binding failed with EPERM; reran with user-approved escalation. Initial authored test omitted selecting a city suggestion; interrupted, corrected it, and subsequent runs passed.
- Limits: client-side duplicate prevention is not server-side idempotency. Real persistence/notification and reply acceptance remain LEAD-01 dependencies. CMS API security acceptance, all-page accessibility, manual screen-reader and visual review remain outstanding.
- Next action: user said continue. Continue UX-01 with a shorter, service-appropriate contact inquiry; preserve the detailed dining path as an optional qualification flow. The separate homepage profiler is not yet covered by this batch.

## 2026-09-08 — service-first contact inquiry locally verified

- Agent: Codex. User asked to continue; completed the next bounded UX-01 batch. Status **VERIFY**: contact-page implementation is locally verified; the separate homepage profiler and real delivery still need acceptance.
- UX decision implemented: default to three steps (service → location/approximate size → contact), with six existing service choices plus help choosing/other. Reused the site's current service names and design-system controls; no new CSS/token values or service claims. Detailed dining qualification remains available through an explicit optional toggle and is never required for coffee, catering or other services.
- Accuracy/conversion: `interest` now records the chosen service instead of incorrectly using a menu tier. Untouched headcount is unknown rather than an assumed slider value; location may be unknown or a custom city, without implying approved coverage. Catering asks about guests and suggests event details; coffee/water suggests equipment-related context. Switching service or opting out of dining details excludes hidden schedule/menu/facility/budget/subsidy state from the submitted brief.
- Shared control boundary: `ProfilerCombobox` gains opt-in `allowCustomValue`, used only on the contact page. Existing callers keep suggestion-only behavior. Expanded/controls ARIA values now reflect whether a suggestion list actually exists. Homepage-profiler regression coverage remains required.
- Final checks: **20/20 Chromium tests passed** via `npm run test:contact` (local `npm run dev`, port 3102). Includes all six services + unsure in both locales, ES at 390×844 and EN desktop, detailed dining, validation/recovery, duplicate in-flight guard, and switching dining → coffee without stale answers. All inquiry requests intercepted; no persistence/email claim. Scoped axe scans passed for service selection, site details and final error states in both locales.
- Other evidence: **40/40 contracts passed**, TypeScript/scoped lint/diff checks passed; design audit retains the 978 baseline with no new violations. The contract runner again hit sandbox IPC EPERM and passed after approved escalation. No production build, deployment, live-domain requests, real submissions or emails performed.
- Visual evidence: reviewed six generated screenshots (service/site/contact × ES mobile/EN desktop), with no clipped form labels/controls observed in these captures. Reproduce with `npm run test:contact`; screenshots are ignored/generated under `test-results/contact-{es,en}-catering-can-use-the-three-step-inquiry/`. This is not full visual signoff, 320px/zoom testing or a substitute for manual VoiceOver review. Full-page screenshots capture the fixed navbar at the current scroll offset.
- Files: contact form, contact locale content, shared combobox, isolated test/config, package script, accessibility doc and delivery tracker. All changes remain local/uncommitted; existing pantry, SEO and Claude changes preserved. Test-owned server was shut down by the runner.
- Next exact action: inspect the remaining homepage profiler against these accepted inquiry behaviors and add isolated mocked-submission coverage, then proceed with consent-aware conversion instrumentation (ANALYTICS-01). Keep Resend setup paused until the user creates the account; do not request the confirmed sales address again.

## 2026-09-09/10 — limited-coverage location hierarchy implemented

- Agent: Codex. User found mixed city/municipality/borough options, requested general-to-specific form logic, then clarified the client operates only in selected major cities. User authorized continuing. Scope: location selection in home and contact only; no national expansion, billing rewrite or further inquiry-flow redesign.
- Replaced the flat `profilerPlaces` list with `src/app/lib/inquiry-locations.ts`: six inherited entities (CDMX, Estado de México, Nuevo León, Jalisco, Querétaro, Hidalgo), containing the same 38 specific locations. The former generic “Ciudad de México, CDMX” entry is now the parent entity, not a duplicate child. Names are inherited commercial choices, not a verified official geographic catalog. Client confirmation of each zone and service remains pending.
- New shared `InquiryLocationFields` component renders state/entity first, then only its municipality/borough choices. All local options are available; no six-suggestion cutoff. A parent change clears its child; incomplete/unknown/mismatched combinations serialize as invalid. Explicit “Aún por definir” is available for the child and is recorded as such, not as statewide coverage. An availability note clarifies that location and service must be confirmed.
- Both entry points use the same structured selection and formatter, keeping their existing submission contract. Contact's free-city entry from the previous batch is no longer used; this supersedes that part of the September 8 log. Contact retains its existing overall “location to be defined” option. Billing fiscal/purchase-location fields are intentionally unaffected.
- Verification: **24/24 browser tests passed** against the existing dev preview at `http://127.0.0.1:3000`; **45/45 contracts passed**. Four new location journeys cover home/contact × ES/EN, all six parent option sets, child reset, back-navigation persistence, explicit undecided child, and real keyboard type-ahead selection after Tab focus. Scoped axe checks passed. Reviewed four generated screenshots (ES 390px mobile, EN desktop); labels and controls fit the tested layouts.
- Test limitation investigated: initial ArrowDown/Enter and Space/ArrowDown/Enter popup sequences did not select an option in this headless macOS run. Kept actual keyboard-selection coverage by using native type-ahead (`m` selects Miguel Hidalgo) after Tab. This does not constitute manual popup/VoiceOver/Safari acceptance.
- Other checks: TypeScript passed; scoped lint has zero errors and one pre-existing `ALL_STEPS` warning in the homepage profiler; design audit passed with unchanged 978 debt baseline; diff whitespace check passed. No CSS/token values were added. Reused existing field styling and layout classes.
- `playwright.contact.config.ts` now also runs `inquiry-location.spec.ts` and optionally attaches to an existing explicitly loopback-only URL via `PLAYWRIGHT_CONTACT_BASE_URL`. Reproduction: `PLAYWRIGHT_CONTACT_BASE_URL=http://127.0.0.1:3000 npm run test:contact`. Every inquiry POST is intercepted or aborted; no real database writes or emails. Local server remains running for user review; it was not restarted by these tests.
- Local source changes and tracker are uncommitted. Existing photography, SEO, permission and prior form changes preserved. No deployment, DNS/Workspace changes, Resend setup or production requests.
- Next: let the user review `/es#profiler` and `/es/contact`; obtain exact zone/service approval without treating the inherited list as client-verified. Remaining homepage-profiler submission/recovery acceptance, broader accessibility and conversion tracking are not closed by this location batch.

## 2026-09-10/11 — contact revised from direct user feedback

- Agent: Codex. User explicitly requested multi-selection on contact, an immediately adjustable headcount without “Todavía no sé”, removal of “Agregar detalles del comedor”, and the same per-meal counters as home. User subsequently asked to continue; completed that bounded revision, not a deployment or broad redesign.
- Contact now allows multiple named services. Help choosing/other remains exclusive to concrete service choices. All selected names are retained in the full brief. To respect the existing 40-character `interest` cap without a database migration, multi-service requests use `interest: "multiple"`; single-service requests retain their prior ID. A future structured multi-service CMS field/reporting change is separate work.
- Removed contact's headcount-unsure state/control and unused localized copy. Slider starts enabled at the same 150-person default as home; visitors can adjust it immediately. This intentionally supersedes the prior unknown-by-default behavior based on the user's review.
- Removed the dining-details opt-in. Selecting comedor automatically includes its schedule/menu/facility/terms questions; requests without comedor still avoid those questions. Removing comedor excludes previously answered dining details from the brief. The user-requested removal does not mean that all dining qualification questions disappeared.
- Extracted `ProfilerMealShifts` into the existing shared controls module and use it in home and contact. The same plus/minus/direct-entry counter now appears for breakfast, lunch, dinner and night shift. Contact preserves separate counts, defaults untouched counts to the selected headcount, blocks continuation for a selected zero quantity, and omits deselected meals from its brief. Existing homepage behavior preserved.
- Narrow-layout issue found during screenshot review: contact's inherited day row could clip Sunday and a meal label could overlap its counter. Added scoped wrapping rules for contact in `marketing.css`, with no new governed values. Added geometry assertions for day containment and label/counter separation.
- Evidence: final **24/24 browser tests passed** on the existing localhost:3000 dev server, with every inquiry request intercepted or aborted. Includes ES mobile/EN desktop multi-service submissions containing all six service names, independent 20/80/40 meal quantities, removal of night-shift counts, actual +/- controls, location hierarchy/reset, retries/validation and home-stepper regression. Scoped axe scans passed. The test count remains 24 because the two old short-dining cases were replaced by the two new multi-service/meal-count cases; detailed dining still has both-locale coverage.
- **45/45 contracts passed**. TypeScript passed. Scoped lint: zero errors, one pre-existing ALL_STEPS warning in the homepage profiler. Design audit and diff whitespace check passed; existing 978 design-debt baseline unchanged. Reviewed final meal screenshots in ES mobile and EN desktop; fixed navbar/skip link can appear over the top of element captures at their current scroll offset, so these are not full-page navigation/visual signoff.
- Files: contact form/content, shared profiler controls, homepage profiler integration, scoped contact CSS, contact/location browser tests and delivery/accessibility docs. Initial TypeScript run correctly caught an obsolete test reference to the removed dining toggle; updated the tests to the authorized behavior and reran successfully.
- No real emails, lead writes, Resend configuration, DNS changes or deployment. Work remains local/uncommitted; user preview remains running at port 3000. Other worktree changes preserved.
- Next: user review of `/es/contact`. Release is still not signed off: LEAD-01 real persistence/notification acceptance, billing scope, client coverage approval and the other open tracker items remain. Do not treat passing mocked form tests as proof that sales receives inquiries.

## 2026-09-11 — LEAD-01 resumed; Safari connection blocked

- Agent: Codex. User reports Resend account created, onboarding open in Safari, and requests completing the email workflow through that browser. This supersedes the September 8 account-creation pause.
- Read-only code check: contact-request POST persists through Payload but has no notification call; Payload config enables the Resend adapter only when its API key exists. No secret values inspected. Creating the account alone does not enable inquiry emails.
- Computer Use skill used for requested Safari access. Initial inspection failed with native pipe startup error; retry returned explicit client/server version mismatch and instruction to relaunch the ChatGPT app. No Safari page contents obtained; no browser fallback or account mutation attempted.
- Only delivery documentation changed. No application code, credentials, DNS, Google Workspace, lead records, email sends or deployment changed. Existing dirty worktree preserved.
- Next exact action: user relaunches ChatGPT app, keeps Safari open to Resend, then resumes. Inspect actual onboarding/domain state; configure the proposed sending subdomain only with appropriate authorization, connect inquiry notifications/confirmation, and verify real receipt and reply routing before closing LEAD-01. API key/persistent-access UI actions require confirmation at action time; do not paste secrets into chat or this log.

## 2026-09-11 — Resend domain verified by user; local key entry prepared

- Agent: Codex. Safari control still returned version mismatch after user restarted; continued with user screenshots and dashboard text, not another browser or account automation.
- User supplied Resend dashboard text showing `send.zitrone.mx` verified, provider GoDaddy, North Virginia region, DKIM and sending SPF/MX verified. This is user-supplied dashboard evidence, not an independent DNS/mail-receipt test. Guided user to leave receiving disabled and click/open tracking off; those toggle states are not independently verified.
- User reports API key created after instructions for `Zitrone website — local`, Sending access, restricted to `send.zitrone.mx`. Actual key permissions have not been independently inspected. No private key requested or received in chat.
- Presence-only local check found all three Resend settings absent. Confirmed `.env.local` ignored by Git and not tracked; added an empty RESEND_API_KEY field plus verified-domain sender defaults for user to fill privately. Existing environment contents preserved and not printed.
- Application notification implementation, recovery, actual receipt/reply tests and production configuration remain open. No emails, lead writes, production deployment or agent-driven DNS changes. LEAD-01 now IN PROGRESS rather than blocked on account creation/Safari.
- Next: user enters key into the prepared local field and saves; then implement and test inquiry notifications/confirmation without exposing secrets or confusing local acceptance with deployment.

## 2026-09-11 — temporary Resend key configured locally

- User supplied a key in chat and, after being advised to revoke/replace it, explicitly requested using it temporarily. Saved it only in the existing Git-ignored `.env.local`; no key value copied into tracked documentation or application source.
- Presence-only check confirms a nonempty key and expected verified-domain sender; `.env.local` remains ignored and untracked. No provider authentication, sending permissions or delivery verified by this check.
- Security follow-up: rotate this chat-exposed key before client handoff/production configuration. User accepted temporary local use, not permanent production use.
- No helper script created, external API request, test email, lead write or deployment performed. Next: implement inquiry notifications/confirmation and recovery, then request approval for real test recipients and verify delivery/replies. LEAD-01 remains IN PROGRESS.


## 2026-09-14 — LEAD-01 implementation and activation preparation

- User asked to resume the saved Resend work. Preserved prior authorization for temporary local key use. Presence-only check confirms Resend key/sender and Payload settings remain configured; no secret value printed or modified.
- Both UI entry points already call `/api/contact-request`. Added a common pipeline: persist inquiry plus exact sales/confirmation snapshots, send through Resend with distinct idempotency keys, save provider acceptance per recipient. Reply-To routes sales replies to the submitted visitor and confirmation replies to opina@zitrone.com.mx. New bilingual template reuses existing email layout/tokens and preserves the full submitted brief without inferring recommendations from free text.
- Partial send failure keeps the durable lead accepted. HTTP 429/5xx/network failures get bounded automatic retries; manual recovery skips accepted messages and reuses exact persisted bodies/keys. Failures in status updates remain recoverable; errors contain safe codes only. Recovery older than 23 hours stops for manual review because provider deduplication expires at 24 hours. No cron/webhook configured; manual recovery ownership and actual inbox delivery are still release dependencies.
- Prepared nullable JSONB `email_delivery` migration, snapshot and generated Payload types. Field writes are denied to normal API users; server override is used for submission/recovery. Read-only SQL transaction against the configured hosted DB confirms all six previous migrations applied and no new column. No migration or lead writes executed. Current checkout requires this migration before real submissions.
- Verification: 53/53 contracts; 26/26 intercepted Chromium journeys on isolated localhost:3102, including two new complete home-profiler failure/retry tests in ES/EN. TypeScript passes after moving the read-only pg utility to JavaScript (installed pg has no direct TS declarations). Email palette check passes; scoped lint has no application errors. Initial sandbox blocks on preview IPC, browser startup and DB network were rerun through approved escalation. Existing Next image-quality/size warnings remain outside this change.
- Generated eight email previews (four new), rendered all four new templates with network blocked, and reviewed ES mobile/EN desktop captures without horizontal overflow. No actual mail-client or inbox claim. Saved recovery, read-only schema inspection and explicit-opt-in smoke-test scripts. `npm run email:test` ran in preview-only mode; the real test is two marked inquiry records and four messages, all to the already confirmed sales mailbox.
- Next approval is concrete: apply the sole pending additive migration to the configured hosted database, then execute the prepared two-inquiry/four-email test from localhost:3000. Check saved records/provider IDs, obtain inbox receipt and reply evidence. A distinct controlled visitor inbox is needed for a complete sales-to-visitor reply acceptance. No production deployment/DNS/Workspace changes. Temporary chat-exposed key still needs rotation before production/handoff.
- Runbook: docs/contact-email-delivery.md. LEAD-01 remains VERIFY, not DONE. Browser HTTP-response-loss deduplication, scheduled recovery/webhook monitoring and full email-client rendering are not silently claimed by these tests.

## 2026-09-14 — LEAD-01 staging isolation and real send

- Agent: Claude. User instructed: move forward without disrupting current workflows; publish only after approval. Codex's proposal to migrate the hosted DB and email opina@ was therefore replaced by an isolated staging path.
- Started Colima and a throwaway `postgres:16-alpine` container (`zitrone-staging-pg`, port 55432); applied all seven migrations to it. Hosted Neon database unchanged (its `email_delivery` column is still pending, confirmed by `npm run email:retry` failing safely with `errorMissingColumn` when pointed at it).
- Added `CONTACT_SALES_EMAIL` (`getSalesInbox()`): overrides the sales `to:` / confirmation `reply_to:`; invalid or unset → `opina@zitrone.com.mx`. Contract test added (54/54 pass). Public footer contact still shows opina@.
- `.env.development.local` (ignored) carries the two staging overrides; `email:test` / `email:retry` now load it via `--env-file-if-exists`. Fixed `retry-contact-emails.ts` never exiting (pg pool kept the loop alive).
- Real send on staging: `ZC-20260915-QWLS9Z` and `ZC-20260915-OKNXVB` persisted locally; 4/4 messages `accepted` by Resend with provider IDs, all addressed to sebastian@1085.mx. TypeScript, scoped lint and 26/26 browser journeys pass against the staging server.
- Open: user confirms the four emails arrived (incl. Reply-To); go-live approval; key rotation; hosted migration; `vercel --prod`.


## 2026-09-16 — email footer/brand fixes and company address correction

- Agent: Claude. User reported the logo rendering as a broken image in the received email and asked whether the footer followed best practices; also corrected the company address (Google Business listing: Zitrone Natural, Calle 3 13-1, Alce Blanco, 53370 Naucalpan de Juárez, Edo. Méx., tel. 55 1205 4000) for **all** website and materials.
- Root cause of the broken logo: templates used `https://zitrone.mx/...`, which 307-redirects to `www`; mail image proxies drop redirected images. New `src/emails/company.ts` sets `EMAIL_BASE_URL = https://www.zitrone.mx` and is the single source for name, address, phone, email and socials used by all three templates.
- Footer now: wordmark → social icons (customer emails only) → company name + address + email · phone → "why you receive this" line → Privacy notice · zitrone.mx → legal. Visitor confirmation gained the hero photo like the profiler brief; internal sales notice stays plain.
- Address replaced in: site footer (ES/EN), all email footers, **not** the privacy notice: user confirmed its Leandro Valle 44 address is the registered legal domicile, so the legal text stays unchanged (reverted same day).
- Resent staging test (`ZC-20260916-BU280W`, `ZC-20260916-6RZN1G`) to sebastian@1085.mx; 4/4 accepted. 54/54 contracts, tsc, email:check, previews pass. Deck-system repo checked: no occurrences of the old address.

## 2026-09-16 — email UX pass, lead control: Google Sheet mirror + CSV export

- Email UX (user feedback, staging previews at :4322): lime accent CTA buttons; sales = "Responder al prospecto" (mailto prospect, folio in subject); visitor = "Escríbenos si tienes dudas" (mailto opina@); summary lines as label/value rows; card bottom rounded over the ink footer; footer = logo · socials (customer only) · address · email · phone · privacy · zitrone.mx · ©; "Zitrone Natural", reason line and folio note removed at user request. Legal domicile in privacy notice left unchanged (legal ≠ commercial).
- Lead control (user chose "everything + Google Sheets copy"): `src/lib/leads/sheet-mirror.ts` posts each lead to an Apps Script web app after the CMS write (idempotent on Folio, 8 s timeout, never throws, Sentry warning on failure). `docs/google-sheets/leads-webhook.gs` + `docs/leads-google-sheet.md` are the user's 5-step setup. `npm run leads:sheet` lists/re-pushes. `GET /api/leads/export` = authenticated CSV (BOM, formula-injection-safe) verified in a real browser session on staging (401 anonymous, 200 attachment when signed in).
- Verification: tsc, scoped lint, 57/57 contracts (3 new). Final staging emails `ZC-20260916-YUPM1E` / `ZC-20260916-HE0MPF` accepted. Staging admin user created in the local DB only.
- Open: user creates the sheet + script and provides the two env values (staging first, then Vercel production at go-live). New env vars: LEADS_SHEET_WEBHOOK_URL, LEADS_SHEET_WEBHOOK_SECRET (optional; unset = off).

## 2026-09-17 — GO-LIVE (user-approved), Google Sheets deferred

- User approved publishing and asked to skip the Google Sheet for now. Local `next build` passed (69 pages) beforehand.
- User created a production Resend key; auto-mode blocked secret/DB/deploy writes, so the user ran the three commands themselves in-session: `vercel env add RESEND_API_KEY production --sensitive` (+ Claude added RESEND_FROM_ADDRESS / RESEND_FROM_NAME), `npm run payload:migrate` against hosted Neon (`Migrated: 20260914_160000_contact_email_delivery`), and `vercel --prod`.
- Post-deploy checks: /es/contact, /en/contact, /es, /admin → 200; `POST /api/contact-request` now live (422 on empty body, was 404); footer/JSON-LD show the new Naucalpan address.
- First live test inquiry `ZC-20260917-4R4YSW` (marked "prueba técnica", visitor = sebastian@1085.mx): persisted in Neon, sales + confirmation `accepted` with Resend IDs. Sales notice went to the real opina@ inbox as agreed.
- Pending user actions: confirm receipt at opina@, delete the old Resend key "Zitrone website — local" (chat-exposed), mark the test lead as closed in /admin. Google Sheets: code shipped but inactive until LEADS_SHEET_WEBHOOK_* are set.


## 2026-09-17 — lead funnel events wired for Google Ads conversions

- Agent: Claude (Opus 5).
- Context: client asked whether Google Ads needs changes for the new site. GTM-TSTDVS4, GA4 and AW-779424827 are already loaded with Consent Mode; but the contact funnel events declared in `src/lib/observability/events.ts` were never emitted by the contact form or the home profiler, so GTM had no lead conversion signal.
- Changes: `contact-form.tsx` and `profiler-section.tsx` now push `contact_form_viewed`, `contact_form_submit_attempt`, `contact_request_accepted` and the validation/delivery/client error events to `dataLayer` (and Vercel Analytics) with `form: "contact" | "profiler"`, `interest`, `requestId`, `code`. `submitContactRequest` now surfaces the server `code` (or `HTTP_<status>`); `contactFunnelFailureEvent` classifies failures.
- Evidence: `PLAYWRIGHT_CONTACT_BASE_URL=http://127.0.0.1:3000 npm run test:contact` → 26 passed; both specs assert the exact event sequence across 502 → 422 → 201.
- Google-side work still pending (needs Ads/GTM access): conversion action on `contact_request_accepted` (Custom Event trigger in GTM), campaign final URLs → zitrone.mx, GTM triggers filtering by legacy paths, Search Console/GA4 stream for the new host.


## 2026-09-22 — domain and analytics validation (Codex)

- Read-only audit requested by user; report: [migration-validation-2026-09-22.md](migration-validation-2026-09-22.md). Public DNS/HTTP, GTM resource and authenticated Vercel domain listing checked. No production changes or test messages.
- Published GTM v9 Ads conversion and GA4 form_submit depend on legacy CSS click; no contact_request_accepted trigger. Saved public resource as evidence. ANALYTICS-01 remains unaccepted.
- Google Workspace MX/SPF/DMARC observed; full DNS export, DKIM inventory, private analytics verification and actual mail tests remain pending. TXT ownership verification is a possible Vercel migration path; old provider release is not proven mandatory.
- New canonical/sitemap and one legacy redirect with campaign parameters verified. Apex new domain still 307. Full route/SSL/rollback acceptance remains open.
- Preserved pre-existing DELIVERY.md and next.config.ts edits. No application code changed.

## 2026-09-24 — Vercel ownership and transfer clarified

- Arroba Systems administers the legacy domain DNS. No direct GoDaddy/Arroba access is required for the application team.
- Vercel inspection found only `zitrone.mx` under team `zitrone`. Attempting to add `zitrone.com.mx` without DNS verification returned `domain_not_owned`; no `--force`, DNS, mail, or production changes were made.
- Next exact action: from the Vercel dashboard, start Connect External/Claim for `zitrone.com.mx` in project `zitrone-website`; give Arroba the exact `_vercel` TXT record shown. After propagation, verify the root and `www` hostnames and then pass any A/CNAME values Vercel displays. Preserve MX/SPF/DKIM/DMARC/nameservers.
- The existing public A/CNAME may already be Vercel-compatible, so do not ask Arroba to replace them until Vercel explicitly requires it. The legacy project association and GTM access remain separate dependencies.

## 2026-09-24 — local release-readiness pass

- Read-only Vercel inventory: encrypted production variables exist for Resend, Payload, Neon/Postgres, Vercel Blob and `NEXT_PUBLIC_SITE_URL`; values were not exported or printed. Handoff runbook: [docs/vercel-handoff.md](vercel-handoff.md).
- Improvements: explicit Next image quality allow-list `[75, 92]`; removed unused metadata/content imports. No domain, DNS, Google, database or production changes.
- Verification: `npm run test:contracts` → 74/74; `npm run build` → success, 69 routes; `npm run assets:check` and `npm run email:check` → pass; `npm run env:check` → pass with runtime mode and no build Sentry credentials; `npm run lint` → 0 errors and 0 warnings after excluding generated Payload migrations and fixing authored warnings.
- Build reports a PostgreSQL SSL-mode compatibility warning from existing Neon connection URLs. Handoff requires confirming `sslmode=verify-full` (or Neon’s current recommended equivalent) in the receiving Vercel environment before transfer; no secret values were changed.
- The repeat of `npm run test:migration` was blocked by an already-running Next dev server holding the local `.next/dev` lock; the earlier isolated run passed 30/30. No process was stopped because it may belong to the user's active session.


## 2026-09-24 — per-button lead attribution + GA4 dataLayer contract

- Agent: Claude (Opus 5.5). Requested by user: every CTA must say where a lead came from (page + section + button), with GA4/GTM best practice.
- Changes: `CtaTracker` (one delegated listener) describes every link click as page_type + section + cta_id + target and pushes `cta_click` / `contact_click`; `data-track-section` markers on nav, nav-menu, nav-promo, nav-mobile, hero, stories, service-carousel, footer, footer-cta. Story panel CTAs now distinct (`home-proof-panel-<client>`). Lead attribution is scoped per form (nav CTA no longer credited to a later profiler submit), adds utm_term/content, ad click id, 90-day first touch (consent-aware) and GA4 client/session ids. Forms push `lead_form_start`, `lead_form_step`, `generate_lead`. CMS fields + migration `20260924_020124_lead_cta_attribution` (additive), sheet columns appended (Apps Script updated to label new columns), sales email gets a "De dónde llegó" block.
- Evidence: tsc clean; contract tests 69/70 (the failure is pre-existing FAQ copy in service-targets.ts); e2e profiler/contact/consent 27/28 (the failure is a pre-existing select color-contrast axe violation on the catering step). Real browser run on :3000: 81 home links all attributed; staged lead ZC-20260924-VPNYQ5 carried google/cpc + home-faq/faq end to end.
- Migration applied to local staging and, with user approval on 2026-09-24, to hosted Neon (batch 7; 8 columns verified, 4 existing leads intact). Code is NOT deployed yet.
- Pending (needs client GTM/GA4 access): import docs/gtm/zitrone-lead-tracking.gtm.json, register custom dimensions, mark generate_lead key event, re-point the Ads conversion. See docs/analytics-tracking.md.


## 2026-09-30 — latest-checkout delivery audit

- Agent: Codex. User requested an updated professional handoff audit after recent changes, including Arroba/Vercel domain context.
- Audited initially clean `7d67dac`, branch `design-system/type-unification`. Report: [September 30 audit](delivery-readiness-audit-2026-09-30.md); [evidence](audit-evidence-2026-09-30.txt). This supersedes old readiness statements for the freshly checked scope.
- Pass: build, TypeScript, 76 contracts, 26 mocked contact journeys, 30 migration/consent tests, generated assets, email palette, limited runtime environment validator.
- Fail: lint 1 error; design gate +47 primitive references and +38 raw typography values; a11y 17 passed / 4 failed (home meal text contrast and 8px carousel hit areas).
- Source findings: lead field immutability lacks API enforcement; any CMS user can export leads; today-counter is simulated; unpublished static blog entries can return via fallback; manuals conflict on domains, conversion setup and billing (now manual mailto).
- Browser initialization failed; used repository Chromium suites, inspected one failure screenshot. No full visual, screen-reader, performance, production or inbox signoff. Initial sandbox build stalled, stopped only own process, passed outside sandbox. First assets check overlapped prebuild generator; sequential check passed; do not record the transient as a source regression.
- Updated DELIVERY.md current assessment and docs index; historical entries retained. Restored only audit-generated token timestamp. No application fixes, deployment, DNS/account/database writes or messages.
- Next: A-01/A-06 quality regressions and A-02 lead permissions, then content/CMS decisions and concrete handoff evidence.


## 2026-09-30 — implementation delegated by user to Claude

- User chose Claude for remediation and Codex for independent review after Claude completes the list.
- Created [detailed execution brief](claude-remediation-brief-2026-09-30.md): phased work, acceptance criteria, isolated API tests, final gates, visual/performance evidence, operational/domain handoff and required result report. Linked from DELIVERY.md.
- No application changes or external operations. Codex review begins when the user returns with Claude’s result; no background supervision is active.

## 2026-09-30 — Claude remediation of the September 30 audit

- Agent: Claude. Followed [the brief](claude-remediation-brief-2026-09-30.md). Results: [claude-remediation-results.md](claude-remediation-results.md). Evidence: `evidence/remediation-2026-09-30/`.
- Commits `7893475`..`69c2fb2` (code) plus a documentation commit. Codex's audit files committed unchanged in `81e47dd`.
- Code: widget effect (lint), widget tokens + AA secondary text + 24px dots, admin-only immutable leads + safe export, fixed hero figure, CMS-authoritative blog, streamed body cap, single conversion recipe with E2E counts, network isolation for three E2E suites.
- Tests added: `npm run test:api` (21: leads by actor, blog lifecycle, CMS outage) on a throwaway local Postgres; 5 body-limit contracts; conversion assertions in contact/profiler E2E; 202 no-conversion test.
- Read-only external checks: Vercel project/domains, prod deployment list, public DNS/redirects, hosted migration status (10/11; `remove_billing_page` pending), published blog count (3 per locale).
- Failed/flaky commands and resolution: first `test:api` hung on open handles → `--test-force-exit`; Payload cookie auth needs `Sec-Fetch-Site` under CSRF; E2E canonical failure caused by local `NEXT_PUBLIC_SITE_URL` → rerun with production URL; E2E flakes under system load (timeouts, axe mid-transition) recorded, not hidden; one transient Turbopack font build error passed on retry.
- Decisions proposed, not confirmed: admin-only leads, removal of "hoy" wording, blog policy, GTM recipe, domain path A/B, lime-600 accent, Firewall rate rule.
- Superseded here: the 24-Sep "Verify & Claim" domain proposal is replaced by the cutover sheet in `domain-migration-checklist.md` (no root-domain claim).
- No deploy, DB write, DNS, GTM, email or third-party message.


## 2026-10-01 — independent Codex review of Claude remediation

- User requested review of `7d67dac..c9325ad`; initially clean worktree. Report: [codex-review-2026-10-01.md](codex-review-2026-10-01.md).
- Independent positives: 81 contracts, 21 isolated API tests, 27 dedicated contact tests, lint/design/assets/email gates, production build/types. E2E 56/61; all 21 page accessibility tests pass, five form contrast scans fail.
- Requested changes R1–R4: blog invalidation tags do not match compiled route tags; full E2E gate remains red; request-stream read rejection escapes; API/drill environment can inherit embedding credentials. Targeted reproductions saved with sanitized logs in `evidence/codex-review-2026-10-01/`.
- API tests used Docker disposable database, with embeddings/Sentry DSNs explicitly blank. Started/checked Colima and existing Postgres container; kept existing infrastructure running. Build read configured CMS. No deployment, hosted DB write, DNS, GTM or email.
- No application fixes (Claude retains implementation). Restored only generator date changed by build. Four user decisions remain pending. Next: Claude fixes review findings, Codex reviews new commits.

## 2026-10-02 — Claude, Codex review round (R1–R4)

- Committed Codex's review unchanged (`9e725d0`). Fixes in separate commits: R3 `6cbfc49`, R4 `595c5fd`, R1 `40c7bc9`, R2 `8324a2b`, Lighthouse protocol `4776a34`.
- R1 confirmed with a new real-cache test (`npm run test:cache`, build + start against a throwaway CMS, hooks on): fixed 4/4; previous hook 1/4 (stale cache HIT after edit).
- R2: settled-motion axe scans, canonical URL pinned in Playwright config; full E2E 61/61 four runs in a row.
- R4: `env -i` + `tests/api/network-guard.mjs` for test:api, test:cache (server) and the backup drill; fake-key test proves the embeddings call is blocked.
- Gates on `4776a34` all green; evidence in `evidence/remediation-r1-r4-2026-10-02/`. Hosted DB not used. Build-stamped token date restored.
- Open: CI integration of test:api/test:cache, LCP attribution study, the four user decisions, external/operational items.


## 2026-10-05 — Codex approves R1–R4 in local scope

- Re-review of `9e725d0..eedd965`, code `4776a34`, resumed after October 2. [Report](codex-rereview-2026-10-05.md); logs in `evidence/codex-rereview-2026-10-05/`.
- Independent checks pass: lint, 83 contracts, 24 isolated API, 4 actual-cache lifecycle tests, full E2E **61/61** with normal command and no local retries. Production build/typecheck included in E2E.
- Cache edit visible on first request; unpublish 404 ES/EN on first request; republish succeeds. Fake OpenAI credential is refused by the network guard in the real hook test.
- No new blocking finding in reviewed changes; R1–R4 accepted locally. Release not accepted: CI API/cache integration, Node 24 validation, mobile performance, manual/operational checks and four user decisions remain.
- No product edits/deployment/hosted writes/DNS/GTM/mail. Cache/API used disposable local DBs; default E2E build could read configured hosted CMS. Restored only generated token date.

## 2026-10-07 — Claude, follow-ups after Codex approval

- Committed Codex re-review unchanged (`734b83c`). User commits `32d4b0e`, `dd39ac0` preserved.
- CI (`08d5df9`): `scripts/lib/test-db.sh` (TEST_PG_URL or Docker); new `isolated-api` job (postgres:16-alpine, Node 24). Verified both modes locally; not run on GitHub.
- Node 24.21.0 locally: lint, tsc, contracts 83/83, API 24/24, cache 4/4, E2E 61/61.
- Perf (`101b6a8`): controlled study; animation, JS and fonts ruled out; LCP = FCP with real throttling; render-blocking global CSS (53–66% unused). Proposal: split marketing.css per surface. Earlier attribution corrected in results.
- One unexplained intermittent test:api failure in 6 runs (output not kept); 5 subsequent runs green.

## 2026-10-08 — Claude, user decisions applied

- User chose: sales role, keep "Comidas diarias…", lime-600 accent, old domain undecided.
- `5c4b200`: access/roles.ts; sales reads/updates status+notes/exports leads, no content, no delete; content collections + globals restricted to admin/editor (globals had no update rule); migration 20261008_133454_sales_role (local only); 6 new API tests (30/30).
- `480de85`: accent lime-600 on light, lime-500 on dark/photo surfaces, lime-700 for the phone footer heading (20px); exception filter removed from a11y suite; 72-view contrast sweep 0 failures.
- Pending for deploy: hosted migrations (billing removal + sales role) with backup and authorization; create sales accounts.

## 2026-10-11 — Claude, accent reverted

- User rejected lime-600/lime-700 ("not part of brand styles"); `480de85` reverted. Accent back to lime-500 everywhere; a11y contrast exception filter restored; exception must be accepted in writing at handoff.


## 2026-10-12 — Codex review of follow-ups and decisions

- Reviewed `734b83c..f9f4923`; changes requested: **R5 P1** local-DB validation bypass in scripts/lib/test-db.sh (nonzero validator swallowed by eval; pg query host override), **R6 P2** unsupported definitive CSS attribution and incomplete performance reproduction. [Full report and instructions](codex-review-2026-10-11.md).
- After detecting concurrent commits, tested an isolated git archive of f9f4923 rather than the changing shared worktree. Node 25.8.1: lint/design pass; API30/30 and cache4/4 via TEST_PG_URL; E2E61/61 without retries after a fresh build cache, production/types pass. Initial font-build failures retained; no GitHub or independent Node24 run claimed.
- Sales rules and lime-600 changes in the requested range have no additional blocker identified. Later user-directed lime-500 revert and icon changes are outside scope; current HEAD at resumption d3463a8 was preserved.
- Evidence: evidence/codex-review-2026-10-11/. Product code unchanged. No deploy, hosted DB writes, DNS/GTM/mail. Shared initial E2E build could read configured CMS; isolated snapshot had no .env and used static content for E2E. API/cache used disposable local PostgreSQL only.
- Next: Claude fixes R5 and narrows or substantiates R6, then submits a focused diff. Release/manual/operational acceptance remains open.

## 2026-10-12 — Claude, R5/R6

- R5 `60228aa`: TEST_PG_URL validated by scripts/lib/test-pg-url.mjs (loopback, no query); helper exits before psql_admin on rejection; pg client built from normalized fields with network guard; tests/scripts (test:scripts 12/12, in CI isolated-api). test:api 30/30 Docker + URL; test:cache 4/4 URL + Docker (one intermittent next/font build failure, rerun green, logged).
- R6: performance report narrowed (motion result kept; CSS = untested candidate; no gzip figure; fonts not ruled out; non-reproducible variants declared).
- Next: Codex focused re-review of the R5/R6 commits.


## 2026-10-12 — Codex accepts R5/R6 in focused re-review

- Reviewed 60228aa and 52419f5 at clean HEAD 52419f5. [Report](codex-r5-r6-review-2026-10-12.md); evidence in evidence/codex-r5-r6-review-2026-10-12/.
- R5: independent guard regressions12/12, local URL-mode API30/30, targeted lint and syntax checks pass. Rejected URLs stop before SQL; admin client receives normalized fields and network guard.
- R6: unsupported causal/gzip claims removed; measurement and reproduction limits disclosed. Documentation finding closed; performance diagnosis/optimization still pending.
- No new finding, no application edits, push/deploy, hosted DB writes or DNS/GTM/mail. Node25.8.1 local. Cache/E2E evidence inspected, not rerun; GitHub/Node24 still not independently executed.
- Next: remaining CI and delivery acceptance tasks. Later lime-500 decision and documented contrast exception unchanged.


## 2026-10-12 — User confirms billing workflow deletion; BILL-01 closed

- User explicitly does not want a website billing workflow. Email link only is final, not a fallback, deferred feature or unresolved scope decision.
- Verified source: no billing page/form/API or CMS billingPage global remains active; ES/EN home/blog footer links use mailto. Retained email settings and legacy URL redirects support that final behavior. Historical migrations remain for schema history and obsolete-table cleanup; no hosted DB change made.
- Closed BILL-01 and removed billing-workflow dependencies from the active queue. Updated README, delivery index, operations guide and remediation results; removed obsolete billing API checks from security checklist. Added supersession notices to old audits without changing their original evidence.
- No new application behavior, email sending, deployment or database mutation. Documentation/link/source checks only; no tests needed for this clarification. Existing unrelated working-tree changes preserved.

## 2026-10-12 — Claude, delivery gap list and local CI replay

- Committed Codex's R5/R6 acceptance and billing-closure docs as delivered (`63a5d0a`). BILL-01 closed; no billing item in the new list.
- Gap list: [pendientes-entrega-2026-10-12.md](pendientes-entrega-2026-10-12.md), 37 items tagged local / decision / external, and external steps E0–E9 prepared for approval. None executed.
- New finding (read-only `vercel ls/inspect`, `curl`): production redeployed 2026-10-12 18:27 CST by `opina-8590`, not by Claude, not logged; CSS matches `d3463a8`+; no Git metadata. Hosted migration state unknown (Claude's read-only query denied by the session's permission policy).
- Local CI replay, clean `git archive` of `63a5d0a`, no `.env`, Node 24.21.0: lint/tsc/assets/email/design pass; contracts 83/83; build; E2E 61/61 no retries; test:scripts 12/12; API 30/30; cache 4/4. Font-download build failure reproduced in 1 of 4 fresh builds (951 s, Noto Serif Display from fonts.gstatic.com). A first replay ran under Node 25.8.1 by mistake (missing Node 24 binary); kept only for the visual result.
- `test:visual`: 60/60 differ from the 2026-09-04 baselines (12–55 % pixels); baselines are stale, not regenerated without user visual approval.
- No push, deploy, hosted DB access, DNS/GTM/mail. Evidence: `evidence/delivery-checks-2026-10-12/`.
- Next: user answers E0; approves or declines E1 (push + PR for GitHub CI).


## 2026-10-12 — Codex defines the Arroba handoff from live configuration

- User delegated the handoff definition to Codex. Defined www.zitrone.mx as principal and project-level association of old apex/www to zitrone-website, existing team Zitrone. No project/team, registrar, nameserver or Workspace transfer required; external activation still pending.
- Live read-only checks: production Ready, created12-oct18:27 CST, dpl_73pEEgsqV4WGLi17cLSB1ZtodEM2. Vercel project domains exclude both .com.mx hosts. DNS config API accepts existing A76.76.21.21 and www CNAME cname.vercel-dns.com (no-change). MX/SPF/DMARC baseline recorded; public DNS is not a full zone inventory. Some DNS queries timed out; Vercel supplied NS configuration. ES/EN200; old apex200; old www308 to old apex; zitrone.mx307 to www. Two legacy paths redirect308 on new host preserving synthetic utm_source.
- Prepared handoff-arroba-2026-10-12.md (architecture, responsibility, exact baseline, sequence, acceptance, recovery), mensaje-arroba-2026-10-12.md (unsent) and evidence/arroba-handoff-2026-10-12/. Updated old domain/transfer docs and gap list to avoid requesting an unnecessary project transfer or another A/B choice.
- Remaining: obtain exact per-host verification from Vercel before issuing an executable DNS annex; coordinate prior-project owner, window and recovery. Adding/verifying an already-live host can change routing, so no association was made during read-only preparation. No external mutations, database access, messages or forms submitted.


## 2026-10-13 — User clarifies Arroba receives the hosting; full handoff plan

- Corrected Codex's 12-Oct interpretation: user intends Arroba to receive and host the project in Arroba's Vercel, then manage domains/DNS. No need to add .com.mx to the origin project. Arroba must confirm technical receipt; the WhatsApp exchange only established DNS/Workspace administration.
- Created plan-entrega-arroba-2026-10-13.md: ownership/responsibilities, receiver intake, release freeze, deliverables, provider/env inventory, data/Blob recovery and continuity, primary transfer plus conditional new-import route, DNS cutover, twelve acceptance tests, rollback, observation, training, support and signoff.
- Rewrote technical sheet and unsent Raúl message, corrected Vercel/domain docs, tracker/gap list and delivery index. Billing stays removed/mailto only. Historic live observations retained with date; no current state silently assumed.
- Consulted official Vercel transfer documentation: integrations and Blob require separate handling. No code/product edits, domain addition, transfer, deployment, hosted migration, permission change or message sent. Next: share plan for Arroba to confirm recipient team, owner and dependencies; prepare release package locally.


## 2026-10-15 — Raúl clarifies repository/main receiving procedure

- Updated the primary handoff route to repository delivery with reviewed main, followed by recipient import and deployment in its Vercel, as described by Raúl. Existing-project transfer is now optional only by joint agreement.
- Added explicit main/PR/CI/SHA traceability and recipient preview validation before resources/domain cutover. Updated plan, technical sheet, unsent reply, Vercel guide, domain checklist, gap list and index.
- Modality reply and receiver details/support remain pending. No assertion that main is already ready or that recipient accepted all dependencies. Billing remains mailto only.
- Documentation only; no merge, push, deploy, DNS change, hosted data write or message sent. Existing unrelated CSS edits preserved.


## 2026-10-15 — Coordinate active Claude work with modality 2

- Read current worktree status, local-font source and image audit script. Fonts and image work remain in progress; no final code approval or benchmark reproduction claimed.
- Added instrucciones-claude-modalidad-2.md with scoped task completion, comparable measurements, font license/visual checks, combined-version testing, release packaging and recipient cutover responsibilities. Linked from plan.
- Image first-load sample is a bounded pre-scroll measurement, not proof of faster Core Web Vitals. Did not run competing builds, modify implementation, merge, deploy or contact the receiver.


## 2026-10-15 — Preliminary image branch review

Read f579695..ce5b77e in clean perf/images-loading worktree. Recorded review in revision-imagenes-2026-10-15.md: timer-driven hero lacks readiness gate; final before/after evidence absent from committed report; direct vercel --prod instruction conflicts with recipient deployment plan. No benchmark reproduction, integration or external action.


## 2026-10-15 — Font commit 146b966 preliminary review

Inspected local CSS, six font files, three preloads and removal of Google font imports. No functional defect identified in static inspection; did not rerun benchmarks/build/browser. Font licenses and reproducible final evidence remain to be supplied. Updated gap 8 to implemented, verification pending. Reported cookie footer interception remains a release QA issue independent of font attribution. See revision-fuentes-2026-10-15.md. No code or external changes.


## 2026-10-15 — Analytics preparation audit

Inspected GTM loading, consent bootstrap, lead events, import JSON and activation recipe; consulted official Google consent and SPA measurement docs. Added analytics/preparacion-handoff-2026-10-15.md. Identified NODE_ENV-only gating as insufficient preview isolation; documented regional consent defaults, cookie reopening issue, single page-view strategy and receiver acceptance. No code edits, Google access, real events or external writes.


## 2026-10-15 — Repository organization plan

Read status, branches, recent history, root layout, README and ignore rules. Added plan-organizacion-repositorio.md and linked handoff plan. References not fetched; no full architecture/secret audit claimed. Preserve ongoing font/cookie/image/analytics work. No history rewrite, branch deletion, integration, push or deployment.


## 2026-10-15 — Claude, home/navigation/footer editable in the CMS (branch `cms/home-parity`)

- User asked that Zitrone can edit the site in Payload; first pass = home + navigation + footer (services pages and contact = phase 2; profiler stays in code).
- Found: CMS mode dropped ~200 fields per locale; seed wiped Spanish text in shared arrays (FAQ answers, footer links), duplicated media on every run and could match the wrong same-named file; header/footer edits only revalidated the home URLs.
- Fixed: schema (migration `20261016_042603_home_cms_parity`, hand-edited to keep every link), seed, loaders, site-wide revalidation; one code→CMS path (`payload:seed:home`), `payload:check:home` = full parity check; removed `payload:sync:home*` and `release:home:prod`.
- Local evidence `evidence/cms-home-2026-10-15/`: parity 0 differences ES/EN, coverage 0, `test:cache:home` 5/5 (negative control fails as expected), migration up/down/up 29/29 links, CMS vs static builds identical text. No hosted DB, Blob, push or deploy.
- Next: review; then production steps in [cms-home-rollout.md](cms-home-rollout.md) — step 0 needs a decision on the held `remove_billing_page` migration.


## 2026-10-17 — Codex release review of 6f5aa1f

Reviewed integrated code and recorded R7–R9 in codex-release-review-2026-10-17.md. Independently ran contracts 94/94 (Node 25); initial sandbox socket failure resolved by approved rerun. Migration changes link storage and drops old columns; requires explicit compatibility/rollback validation. Home cache test absent from CI. Dirty production equivalence claim needs qualification/visual evidence. No broad suite replay or external mutation; only review docs changed.


## 2026-10-18 — Codex re-review a18cd87

[Report](codex-r7-r9-rereview-2026-10-18.md): R8 configuration accepted, R9 wording corrected, R7 partial. New R10: down casts seeded new icons to old enums and can fail; rehearsal lacks new-home seed. R11: README still commands vercel --prod despite automatic main deployment; destination/origin sequence unresolved. Latest PR checks pending; Vercel preview fails. Read-only review, no migrations, deploy or Vercel mutations.


## 2026-10-18 — Claude, repository cleanup for the handoff and clean-checkout validation

- Base `7e09c24` (R10/R11, pushed to PR #5 with the user's authorization; PR still draft). Commits: `92ca493` untrack `.artifacts` and the root audit copy; `2b24264` remove unused Lenis; `b192ac2` package `zitrone-website`, Node `24.x` + `.nvmrc`; `4f73cab` Codex's handoff plan, reviews and tracker entries, unchanged; `4e1f06a` docs index, publish sequence A, deck-repo boundary, inventory and gap list; `b6aae32` builds no longer rewrite `tokens.generated.json`.
- History review: see [inventory](inventario-repositorio-2026-10-15.md#historial-y-separación-de-presentaciones-18-oct). Open user decisions: `public/decks` + `public/pdf` (served publicly, no consumer), `docs/services` price catalogue, and whether Arroba gets this repository with history or a new one from the published snapshot.
- Clean clone of `4e1f06a`, Node 24.22.0 (official binary, checksum verified), no `.env`, sequential: `npm ci`, env:check, lint, tsc, assets/email checks, design audit, contracts 94/94, scripts 12/12, build, E2E 67/67, contact 27/27, migration 32/32, api 30/30, cache 4/4, cache:home 5/5. Only diff afterwards: the token date, fixed in `b6aae32`; rebuild at `b6aae32` leaves the tree clean.
- No merge, deploy, hosted DB, Vercel/DNS change or push of these commits.


## 2026-10-18 — Independent cleanup review

See codex-cleanup-review-2026-10-18.md. Backup 94/94 matches Git; token generator leaves tree clean; GitHub validate/isolated-api pass on 397ec9f. No new functional cleanup blocker found. Correct same-SHA wording for new snapshot repository and stale CI summary. a7b72c3 is documentation only; no push/merge/deploy performed. QA and hosted operations remain pending.


## 2026-10-18 — Isolated QA plan review

Reviewed e38efb9 locally, no production access. See codex-qa-plan-review-2026-10-18.md: clean env files/build, explicit DB guards, read-only browser/server boundaries, minimal content export and FK restoration, pre/post-seed comparison and scoped cleanup required before execution. No push needed for local review.


## 2026-10-18 — QA plan revision 2 and runner (not run against production)

Addressed the five points of codex-qa-plan-review-2026-10-18.md in docs/plan-qa-aislado-2026-10-18.md and scripts/qa-release/. Clean detached checkouts; a credential-holding extractor separate from QA processes; an explicit DB URL guard; a positive table inventory validated against the migration snapshot; phased restore with a synthetic-user remap; a free-text scan; Node egress guard plus a Blob mirror, so servers stay loopback-only; a parsed-hostname browser policy (reads only to the approved site, mutations simulated, service workers blocked); separate orig/mig/seed/rb states with the seed's changes listed for acceptance; real-motion check; scoped cleanup. tests/scripts/qa-release.test.ts covers the policy, guard, validator, scan and summary (24 tests).

Dry run of the full runner on a local stand-in source, with no production access: every step passed except mirror/compare, which read the published site and were skipped. It found that rollout step 4's pre-migration capture must use the published code (fixed in cms-home-rollout.md), plus four runner bugs (fixed). CI on fa652b1 failed once on a flaky stdout assertion in blog-cms-outage.test.ts; the rerun passed, and 2f6878a makes the test read the fixture's marker line. Local commits only; nothing pushed. Execution needs the user's single authorization (plan, section Autorización).


## 2026-10-18 — QA runner review 37cb394

See codex-qa-runner-review-2026-10-18.md. R12 invalid catalog still enables extract; R13 required criteria log failures without rejecting; R14 raw CMS snapshots copied into versionable evidence. Local policy tests independently 24/24 on Node 25, shell syntax passes. No runner execution or production reads. Corrections required before grouped QA authorization.


## 2026-10-19 — QA runner R12–R14 and dry run on the final SHA (no production)

Fixed R12–R14 from codex-qa-runner-review-2026-10-18.md. An extract now needs a successful catalog of the same run (gate.mjs: run, SHA, source fingerprint and file hashes). Every criterion is a status.tsv row, and a FAIL stops the step. The verdict cannot pass with a FAIL, a missing check or a PENDING item. Raw CMS exports, screenshots and logs stay in private/, and evidence copies a fixed list of sanitized reports. The negative tests are in tests/scripts/qa-release-gates.test.ts; test:scripts is 43/43.

The dry runs also found and fixed four problems. The CLIs silently did nothing under a real-path mismatch (macOS /var vs /private/var). Cleanup left both servers running while reporting success. The sweep criterion read nonexistent fields, so the 72-page claim of revision 2 did not cover console errors or HTTP status. The embeddings check failed because the warning is printed once per process.

Final dry run on 4c342db, from init to cleanup, on a stand-in source: verdict INCOMPLETO, as designed. Only the five checks that read the published site are missing, plus the PENDING seed links. A synthetic confidential marker reached 0 evidence files. No production or published-site reads; local commits only.


## 2026-10-19 — Codex accepts R12–R14 in reviewed scope

Reviewed runner through 4c342db and revision 3 plan 7e52a0b. Specific policy/gate tests 31/31 independently pass on Node 25; shell syntax/diff checks pass. No complete Docker replay or production access. See codex-r12-r14-acceptance-2026-10-19.md. Ready to prepare grouped QA authorization; classify private evidence before cleanup. Updated stale statement that all later commits were documentation-only.


## 2026-10-19 — Classification pause and grouped authorization

Per Codex's acceptance condition 3, `run.sh cleanup` now refuses while any PENDING check is unclassified: it needs work/classification.md naming every PENDING check (no content, only check, page, width, category, decision) and an evidence export newer than it; re-exporting to the run's own destination replaces it. QA_DISCARD remains the only bypass. New negative test in qa-release-gates.test.ts (specific tests 32/32, test:scripts 44/44 on Node 24). Plan revision 3.1 states the grouped authorization: exact candidate SHA, reference deployment, reads P1/P2/W1–W4/D1 only, the pause, sanitized evidence in a local commit; excludes production writes, branches/roles/previews, push, merge, deploy and real email. Not executed.


## 2026-10-19 — Scoped acceptance of QA pause 88b2de6

Reviewed cleanup/evidence pause; 8/8 gate tests independently pass on Node 25. No new blocker for requesting grouped authorization of plan 3.1. Record actual user classification before cleanup; presence of check names is not human approval. No production reads or QA execution. See codex-r12-r14-acceptance-2026-10-19.md (docs/ from repository root).


## 2026-10-19 — Service usage check before QA

Read-only, through the Vercel API; no plan or service changed. Vercel team `zitrone`: Hobby, no contract. 1–19 Oct: 1.4 GB outgoing transfer, ~88K edge requests, ~25K function invocations, Blob 0.53 GB stored and 3,630 simple operations, all well under the published Hobby limits; image-optimization usage not available from this API. Neon `zitrone-cms`: Marketplace Free plan, `usageQuotaExceeded: false`, status available; CU-hours used and current storage are not exposed by the Vercel API and still need to be read in the Neon console. Next: the user confirms the Neon margin, then the single QA authorization on 88b2de6. Commercial Vercel plan recorded as pending for publication/handoff (Hobby is non-commercial only).


## 2026-10-19 — Isolated QA run 1 on 88b2de6: stopped at the free-text scan

Authorized by the user in chat (scope of plan revision 3.1, Neon margin unverified, pause before cleanup; no production writes, push, merge or publication). Run 20261019-1223-6c78. `catalog` and `extract` PASS (read-only session, approved tables only), `restore:counts` PASS (178 tables), then `restore:free-text` FAIL: 102 "phones" ending in 64, all in the `_uuid` column of four version tables (FAQ answers, privacy notice intro/sections/paragraphs). Inspected in the local copy: every value is a 24-hex Payload row id whose digit runs look like a phone; no personal data. The run stopped as designed before using the copy; verdict FALLIDO; sanitized evidence in docs/evidence/qa-release-2026-10-19/. Nothing pending to classify, so cleanup ran: 0 containers, worktrees, servers, temporaries; zitrone-staging-pg untouched. Fix: the scanner's phone pattern no longer matches inside a longer letter-and-digit token (regression test added). A new run needs a new authorization on the new SHA.


## 2026-10-19 — Home stays in the code files; seed dropped

User decision: the home, navigation and footer stay in the code files; changes are asked of Claude (repository edits) and Arroba deploys. Payload stays only for the blog, the privacy notice and leads. Code: the home now reads the code files unless `HOME_CONTENT_SOURCE=cms` (before, `static` had to be set; a new project without it, e.g. Arroba's, would have read an unseeded CMS). Removed `getResolvedBlogLayout` (unused; it read CMS header/footer). Checked: navigation and footer of every page, blog and privacy included, come from `getResolvedHomeContent`. Procedure: steps 6 (seed) and 9 (CMS home switch) are not run. QA runner (plan revision 3.2): no `seed` state; `mig` is built, served (:3105), swept and compared with the approved site; rollback starts from `mig`; the runner leaves HOME_CONTENT_SOURCE unset to test the default. Local: tsc, contracts 94/94, test:scripts 44/44, test:cache:home 5/5 (now with =cms), test:cache 4/4. QA run 2 needs a new authorization on the new SHA.


## 2026-10-19 — Dry run without seed on 8e832c5

First no-seed dry run (c7a713a) stopped at integrations:embeddings: the stand-in's FAQs, written by the published code's seed, have empty Spanish answers (old seed bug), so re-saving in Spanish fails validation. Fixed in 8e832c5: touch saves the first document/locale that validates and reports the rest as INFO (integrations:cms-invalid). Dry run on 8e832c5: INCOMPLETO as designed (only the 4 published-site checks missing), 34 PASS, 0 PENDING, marker in 0 evidence files, no leftovers. If production has the same FAQ data, the real QA will show it as INFO; the site does not display CMS FAQs, but editing such a FAQ in /admin would fail until its Spanish answer is filled.


## 2026-10-19 — QA run 2 on 0893616: stopped at mirror (runner)

Started by the user from the prompt. With production data: catalog, extract, restore counts, free-text scan and every states check PASS (3 pending migrations, all applied; migration changes no visible link with old or new code; migrate:down + migrate gives the same home). Stopped silently at `mirror`: it looked for the Blob host in the published /es HTML, which no longer has Blob URLs (home from code files); the copy's media library has 738 files in one store. Nothing pending; cleanup complete, no leftovers. Fix: host from the copy's media table (with a FAIL row and message), W2 = sitemap.xml only; migrate:status colors stripped before counting (report and all-migrated check). QA run 3 needs a new run on the new SHA.


## 2026-10-19 — QA run 3 on 898db63: mirror criterion too strict; size-variant finding

Production data again passes catalog, extract, restore and every states check (12 applied, 1 pending before; all applied after). mirror took the Blob host from the copy and downloaded all 738 media-library originals; mirror:complete failed on 93 "missing" paths. Cause: the runner built Blob URLs from filenames (Blob names carry a random suffix), and many size variants (thumbnail/card/feature/hero) point in the database to unsuffixed URLs that do not exist in Blob (739 references, 93 distinct paths). Production finding: only /admin thumbnails are affected; the site reads media.url (originals, all present). Fix: mirror-media downloads stored URLs only, copies each file under its stored filename, tags entries required/size; mirror:complete fails only on a missing required file, size misses are INFO. Cleanup complete. Next: QA run 4 on the new SHA (mirror is not exercised by the dry run).


## 2026-10-19 — QA run 4 on b07c889: stopped at mirror (truncated URL)

Production passes catalog, extract, restore and states again. mirror:complete failed on 1 required file; 92 size variants INFO. Cause: the text URL pattern stops at ")", cutting the three El Universal logo names. Fix: the media library's URL columns are read whole. Checked offline against this run's copy with fetch stubbed: new URL set = old minus the truncated one plus the 3 full ones; 738 required (one per original). Cleanup complete. Next: QA run 5.


## 2026-10-19 — QA run 5: first complete run; user classification

First complete run: every automatic criterion passes with production data and the published site. One PENDING (50 of 80 visual comparisons above 0.1 %), classified by the user (docs/evidence/qa-release-2026-10-19-run5/classification.md): blog articles = defect, the article must look like the published one -> redesign merge c5ab832 reverted in 84e51e6 (keeping the 24px index target); privacy notice = accepted, must stay legible -> two privacy-only rules in 84e51e6 (its legibility came from the redesign CSS); recompressed photos = accepted; empty 'Carritos de servicio' card = capture artifact (verified in a browser) -> visual-compare waits for every rendered image (cb41b05). Checked locally after the revert: article identical to the published code (page, toc, content, marketing.css except 4 a11y lines), privacy hero two columns on desktop and one on mobile; tsc, contracts 94/94, test:scripts 44/44. Next: QA run 6.


## 2026-10-19 — QA run 6: Carritos capture fixed; repeat

Every automatic criterion passes again (38 PASS; INFO: 92 size variants, 160 Vercel-only console errors, FAQ #5 es invalid). One PENDING: 50 of 80 visual comparisons above 0.1 %. Articles now match the published design (remaining diffs: 24px index spacing and photo recompression), privacy legible, photos recompressed; the 'Carritos de servicio' card was still empty on /services desktop. User decision: "carritos: investiga" (docs/evidence/qa-release-2026-10-19-run6/classification.md; articles, privacy and photos not classified in this run). Cause found: with request interception the browser cache is off, and the full-page capture re-evaluates srcset; the card, which shares the hero photo already in memory at 1920w, switched to it and was captured before painting it. Not a site defect (a normal browser always shows it). Fix in the capture tool only: each image keeps the source chosen for the viewport before the load/decode waits (981c3c4); against this run's server the card was empty in 2 of 2 captures without it and showed the photo in 2 of 2 with it, ES and EN. Cleanup complete. Next: QA run 7.


## 2026-10-19 — QA run 7: complete, accepted by the user

Every automatic criterion passes (38 PASS; INFO: 92 size variants, 160 Vercel-only console errors, FAQ #5 es invalid). One PENDING: 50 of 80 visual comparisons above 0.1 %, classified by the user (docs/evidence/qa-release-2026-10-19-run7/classification.md, reply "si se ve bien"): articles match the published design (only the 24px index spacing and photo recompression), privacy notice legible, recompressed photos, and the 'Carritos de servicio' card now shows its photo on both sides (/services 2.3 % -> 1.0 %, recompression only) - all accepted by the user: no pending visual defects per the classification. Limits: the automatic verdict stays PENDIENTE DE CLASIFICACIÓN (the acceptance is the user's, in classification.md); integrations:cms-invalid reports FAQ #5 (es) failing validation (Answer 1 > Paragraph, empty answer from the old seed). Content debt outside the static home (the site does not render CMS FAQs): owner Zitrone/Arroba content, to fix in /admin before that FAQ is edited in the CMS; the hooks check covers the documents it saved, not every CMS document. Note: the run was launched three times at once; the two duplicates (20261019-1905-03fd stopped at serve on the busy port, 20261019-1908-8ba2 stopped by hand during states) were cleaned up by the user with run.sh cleanup (the second with QA_DISCARD, nothing to classify); production only received the read-only catalog/extract reads of each. Cleanup complete. Next, each needing explicit authorization: Codex final review, CI on the final SHA, backup, hosted migration, merge, Arroba repo.


## Codex review — 105eb80

See codex-final-review-105eb80.md. No new blocker to pushing for CI in reviewed scope; gates 8/8 independently pass on Node 25. QA7 c9ad178 and 105eb80 differ only by docs/evidence. Align stale seeded/switch wording; retain invalid ES FAQ as documented content debt, not an all-CMS acceptance. No production or external changes. Applied: README home row and cms-home-rollout step 1 now say no seed/no CMS switch; run 7 conclusion narrowed to no pending visual defects, FAQ #5 es recorded as content debt with owner. The push that follows is not the repo's first: PR #5 and earlier CI exist; the final SHA gets its own CI.

Wording for the handoff (Codex, 19 Oct): maintenance is described as changes made in the repository through review, tests and publication, so Arroba can maintain the site with its own team and tools; README, manual-contenido, cms-home-rollout and the QA plan updated. Earlier entries that say "asked of Claude" record the decision as taken. Next after green CI, for authorization: backup with a recovery check, real state and exact list of pending migrations, a window without CMS edits, migration without seed with checks and rollback procedure. The merge stays separate (it publishes automatically) until those checks are resolved.


## Codex — revisión de scripts de producción, 19 octubre 2026

Revisión estática sobre checkout `6a45920`: [informe](codex-production-scripts-review-2026-10-19.md). A reportado en ejecución por el usuario; resultado no verificado aquí. Antes de B: comparar contenido/enlaces antes y después, exigir prueba de finalización satisfactoria de A además del checksum, y precisar referencia compatible/garantías de solo lectura y conteos. No se ejecutaron scripts ni consultas de producción. Siguiente: revisar resultado de A y corregir B antes de migrar; no repetir A automáticamente.

Claude, 19 Oct: A finished LISTO (3 expected pending; full dump of 178 tables, counts source = copy = restored; capture with reference 255eec2). B corrected per the review: it checks A's log (LISTO, same folder, no DETENIDO) besides the checksum and the three count files; verifies on the server that status and probes run read-only (only `payload migrate` writes); before migrating, row counts and the header/footer/home export must equal the backup; after, row counts may differ only by the dropped billing_page tables, +3 payload_migrations rows and new empty tables, the 255eec2 reference export must be byte-identical and the visible links/CTA equal with both the reference and the final code. 255eec2 is described as the compatible reference, not the exact deployed code. Any stop after the migration leaves it applied and goes to Claude for the rollback procedure in cms-home-rollout.


Codex, revisión de B corregido (19 Oct): correcciones principales presentes y sintaxis zsh válida; sin nuevo bloqueo de implementación en el alcance revisado. Ver codex-production-scripts-review-2026-10-19.md. Precisar antes de ejecutar que los conteos no comparan todo el contenido y que un fallo DURANTE el paso 3 puede dejar algunas migraciones confirmadas (Payload confirma cada archivo por separado); detenerse y verificar estado, sin repetición ni rollback automático. A satisfactorio reportado por Claude, no verificado independientemente aquí. No ejecuté A/B ni consulté producción.

Codex re-review of B (19 Oct): no other blocker. Precision: equal row counts do not prove identical content in all 178 tables; content is compared only for header, footer, home and visible links. A failure during the migration step can leave some of the three applied (Payload records each one separately): stop, check which finished, decide recovery; never rerun B or roll back automatically. B's failure message now says so.

Production migration, 19 Oct 2026 21:36 (B, run once by the user, final code 6a45920, no seed): A's record checked; read-only confirmed on the server for status and probes; before migrating, rows and header/footer/home equal to the backup. Migrated; 0 pending; payload_migrations +3. The six billing_page tables were empty (0 rows) when dropped; 10 new tables, empty; the other 172 tables keep their row counts. The 255eec2 reference reads a byte-identical header/footer/home export and the same visible links/CTA (es 3, en 26); the final code sees the same links. www.zitrone.mx: 8/8 URLs 200. Evidence in the private backup folder ~/Documents/Zitrone/respaldos/zitrone-cms-20261019-2125. Vercel preview on PR #5 keeps failing as expected (no PAYLOAD_SECRET by decision). Nothing published; merge (step 7) awaits its own authorization. This entry changes the SHA: the merge SHA needs its own green CI.
