# Zitrone — release work tracker

## Current state — 2026-10-18

- **Release:** `release/2026-10`, draft PR #5 to `main`. Contains everything accepted for delivery (fonts, images, analytics, CMS home parity; the article redesign was reverted on 19 Oct at the user's request, see below) plus repository cleanup. CI (Node 24, `validate` + `isolated-api`) green on GitHub for `397ec9f` (run 39143752328). Later commits include QA tooling and documentation and need their own CI run once pushed. The Vercel preview fails: Preview has the production `DATABASE_URL` and no `PAYLOAD_SECRET`; isolating Preview is pending configuration, not a protection to rely on.
- **Sequence decided by the user (18 Oct):** QA of the final version, backup and hosted migration; then publish on the origin by merging to `main` (auto-deploys zitrone.mx); then Arroba receives the same published files in a new private repository, under a different commit SHA; the correspondence is recorded (procedure step 10). Single procedure: [docs/cms-home-rollout.md](docs/cms-home-rollout.md).
- **Not done:** merge, deploy, hosted migration, seed, Vercel or DNS changes, messages to Arroba. Codex review of the final SHA pending.
- **Pending for publication/handoff (19 Oct):** the Vercel team `zitrone` is on **Hobby**, which Vercel limits to personal, non-commercial use; zitrone.mx is a company site. The commercial plan (Pro or Arroba's own account), who holds it and who pays must be agreed before or as part of the handoff. Neon `zitrone-cms` is on the Vercel Marketplace **Free** plan (100 CU-hours/project, 0.5 GB). Neither plan has a payment method, so no charges; exceeding a limit restricts the affected resource instead.
- **Decided 18 Oct:** deck material (`public/decks`, `public/pdf`) and the three commercial documents (`docs/services`) are removed from the website, with a verified private copy; Arroba gets a new private repository created from the published version, and this one stays restricted with its full history (not created yet). The user confirms none of the 91 public deck/photo URLs was shared ([inventory](docs/inventario-repositorio-2026-10-15.md#historial-y-separación-de-presentaciones-18-oct)).
- Gap list: [docs/pendientes-entrega-2026-10-12.md](docs/pendientes-entrega-2026-10-12.md). Docs index: [docs/README.md](docs/README.md).

## Arroba receives hosting — clarified receiving procedure, 2026-10-15

**User clarification supersedes the 12-Oct architecture:** Arroba is to receive and host the website in its own Vercel team, then configure domains/DNS. Do not add .com.mx to the origin project as a handoff prerequisite. [Complete delivery plan](docs/plan-entrega-arroba-2026-10-13.md), [corrected technical sheet](docs/handoff-arroba-2026-10-12.md); the unsent reply to Arroba is kept outside the repository.

- Primary route clarified by Raúl on 15-Oct: deliver repository with reviewed release on main; recipient imports and deploys in its Vercel. Existing-project transfer is optional only by joint agreement. Communicating the selected modality, target team, technical owner and dependency/support acceptance remain pending. Do not assume the working branch is already ready on main.
- Plan covers release/code, separate data/media/mail dependencies, secure access, backups and recovery, destination build, domain cutover, operational tests, observation and signed acceptance. Billing workflow remains removed; mailto only.
- Canonical remains www.zitrone.mx. Arroba generates exact DNS/verification values from its destination project, preserving Workspace and internal apps. Public observations saved on12-Oct remain historical evidence, not change instructions.
- Next: share the prepared plan/message with Raúl (not sent here), obtain recipient details, and prepare the release package. No transfer, domain mutation, deployment, hosted migration or email was performed. Planning is not final acceptance.


## Delivery gap list — 2026-10-12, Claude

**Not ready to deliver.** Current list of what is really missing, each item tagged local work / user decision / external action, with concrete external steps prepared for approval (none executed): [docs/pendientes-entrega-2026-10-12.md](docs/pendientes-entrega-2026-10-12.md). No billing workflow item: BILL-01 is closed.

- **New finding:** production (`www.zitrone.mx`, `zitrone.mx`) was redeployed on 2026-10-12 at 18:27 CST by account `opina-8590`, not by Claude and not logged here. No Git metadata; its CSS matches `d3463a8` or later, so the sales-role code (`5c4b200`) is live. Hosted migration state (`sales_role`, `remove_billing_page`) is unknown: Claude's read-only query was denied. First step E0: user identifies the deploy and the migration state.
- Local CI replay of both CI jobs on a clean archive of `63a5d0a`, no `.env`, Node 24.21.0: all green (E2E 61/61, API 30/30, cache 4/4, guard 12/12, contracts 83/83). Google-font build failure reproduced in 1 of 4 fresh builds. Visual baselines (2026-09-04) are stale: 60/60 differ, so `test:visual` currently detects nothing.
- Next: user answers E0 and approves (or not) E1 push/PR for the real GitHub CI run.

## Billing decision — 2026-10-12, user confirmed

**BILL-01 CLOSED / REMOVED.** The website billing workflow was deliberately deleted. The final implementation is the footer email link only. No billing form, API, webhook, uploads, queue, automation or future billing workflow is requested, deferred or part of this delivery. Do not reopen it as a scope question or release blocker. The existing `remove_billing_page` migration only removes obsolete database tables; it does not represent unfinished billing functionality. Older audits and progress entries describe superseded requirements.

## R5/R6 independently accepted — 2026-10-12, Codex

**R5 and R6 closed in the reviewed local scope** (`60228aa`, `52419f5`). [Focused re-review](docs/codex-r5-r6-review-2026-10-12.md); [independent evidence](docs/evidence/codex-r5-r6-review-2026-10-12/).

- Guard regressions **12/12**, API integration via local TEST_PG_URL **30/30**, targeted lint and script syntax checks pass. No new finding in these commits.
- Performance wording now separates observed results from the unproven CSS hypothesis and discloses reproduction limits. Root-cause diagnosis/optimization remains separate unfinished work.
- No independent GitHub/Node24 run, cache/E2E rerun or review of later brand changes in this focused pass. Existing font-build flake and operational/manual release checks remain open. No deployment or hosted writes.
- Next: proceed to CI and remaining delivery checks; no further R5/R6 correction requested. This supersedes the “awaiting re-review” status below, not the release acceptance criteria.

## R5/R6 addressed — 2026-10-12, Claude

R5 (`60228aa`): TEST_PG_URL refused before any SQL unless plain loopback; helper tests in CI. R6: performance report narrowed to what was measured. Results: [docs/claude-remediation-results.md](docs/claude-remediation-results.md#ronda-3--correcciones-a-la-revisión-de-codex-r5-r6-12-de-octubre-de-2026). Awaiting Codex re-review. Nothing deployed.

## Current scoped review — 2026-10-12, Codex

**Changes requested for `734b83c..f9f4923`.** [Independent review and Claude instructions](docs/codex-review-2026-10-11.md); [evidence](docs/evidence/codex-review-2026-10-11/).

- **R5 (P1):** TEST_PG_URL validation does not stop the shell on rejection; query parameters can also override the validated host. Administrative DROP/CREATE operations can connect outside loopback before the network guard. Fix and test refusal before any connection/SQL.
- **R6 (P2):** qualify the performance report: motion comparison is useful for the tested routes, but exclusive CSS causality and gzip savings are not established by the saved evidence. Preserve reproducible commands/data or narrow the claims.
- Exact-commit isolated copy: lint/design pass; API **30/30**, real cache **4/4** through local TEST_PG_URL; full E2E **61/61**, no retries, after starting with a fresh build cache. Node 25.8.1; GitHub/Node 24 not independently rerun. Initial font-build failure preserved in evidence.
- No new blocker found in sales permissions or lime-600 implementation in that commit. **Later commits reverted the accent to lime-500 at the user's request; this review does not certify those changes.** HEAD at resumption: d3463a8.
- Next: Claude addresses R5/R6, then focused re-review. Existing R1–R4 acceptance remains historical; hosted migrations, domain cutover, manual and operational acceptance still need their documented checks. No deployment or hosted writes performed.

## Current review — 2026-10-05, Codex

**R1–R4 verified and accepted locally; final client release is not accepted yet.** Reviewed `9e725d0..eedd965` (code `4776a34`). [Independent round-2 review](docs/codex-rereview-2026-10-05.md); [evidence](docs/evidence/codex-rereview-2026-10-05/).

- Independent reruns: lint clean; 83/83 contracts; 24/24 API; 4/4 real Next cache; **61/61 full E2E**, ordinary command without local retries, successful production build/types.
- R1 cache tags/publication, R2 settled-motion scans, R3 controlled stream failure and R4 isolated provider calls are closed in the tested local scope. This supersedes previous change requests and red-suite observations for those fixes.
- Remaining: API/cache gates in CI with ephemeral Postgres and Node 24; measured mobile LCP investigation; user decisions (lead role, meals wording, green accent, legacy domain); manual QA and external operational handoff. No deployment authorization.
- Next: address CI and performance follow-ups, obtain recorded decisions and operational acceptance; do not reopen R1–R4 without new evidence.

## Independent review — 2026-10-01, Codex

**Changes requested; not accepted for release.** Review of `7d67dac..c9325ad`: [findings and instructions for Claude](docs/codex-review-2026-10-01.md), [evidence](docs/evidence/codex-review-2026-10-01/).

- Verified independently: lint, design, assets/email gates; 81 contracts; 21 local API tests; production build/types; 21 page-accessibility tests within E2E; 27 dedicated contact tests.
- Full E2E: **56/61**, five form-state contrast failures. QA completion remains open.
- Return to Claude: **R1** correct blog layout cache invalidation and test actual warmed pages; **R2** stabilize final-state contrast scans and pass the full suite; **R3** handle request stream read failures; **R4** isolate provider credentials/network in API/drill runners.
- Admin-only leads, public figure wording, green-accent exception and legacy-domain route remain user decisions. No external changes authorized by this review.
- Next action: Claude implements R1–R4 on top of the reviewed commits and supplies new evidence for focused Codex review.

## User decisions applied — 2026-10-08, Claude

Sales role for leads (`5c4b200`, needs migration `20261008_133454_sales_role` on the hosted DB before deploy); "Comidas diarias…" wording kept (figure still needs client confirmation); accent green: lime-600 applied in `480de85`, then rejected by the user on 2026-10-11 and reverted (lime-500 stays; contrast exception to be accepted in writing). Old-domain route: still undecided. All gates green (API 30/30, E2E 61/61). Nothing deployed.

## Follow-ups after Codex approval — 2026-10-07, Claude

Codex approved R1–R4 locally (2026-10-05). Since then: CI job `isolated-api` runs test:api + test:cache on a Postgres service with Node 24 (`08d5df9`, not yet run on GitHub); full gate set green under Node 24.21.0 locally; mobile performance studied (`101b6a8`, narrowed 2026-10-12 per R6): reduced motion does not change LCP on the two routes measured; LCP = FCP under real throttling (3.2–3.5 s); what delays first paint is not established (the global 458 KB stylesheet is a candidate, untested). Still open: the four user decisions, external/operational acceptance. Nothing deployed.

## Round 2 — Codex R1–R4 fixed, 2026-10-02, Claude (awaiting Codex re-review)

R1 blog cache invalidation (real-cache test 4/4, old hook fails), R2 full E2E 61/61 four consecutive runs, R3 body read failures controlled, R4 test runners with empty env + loopback-only network guard. Verified commit `4776a34`; see the round-2 section of [claude-remediation-results.md](docs/claude-remediation-results.md). Not accepted; nothing deployed. Four user decisions still open. Next: Codex re-reviews `9e725d0..HEAD`.

## Remediation status — 2026-09-30, Claude (awaiting Codex review)

Implemented locally on `design-system/type-unification` up to code commit `69c2fb2`; details, gates and evidence in [claude-remediation-results.md](docs/claude-remediation-results.md). **Ready for Codex review, not accepted.** Nothing deployed; hosted DB, DNS, GTM and mail untouched (read-only checks only).

- **QA-01 / A-01, A-06: DONE locally.** Lint clean, design gate passes with lower baseline, a11y 21/21. Green-accent exception unchanged; `lime-600` alternative prepared (brand decision pending). VoiceOver/zoom/keyboard manual pass still TODO.
- **DATA-01 / A-02: VERIFY.** Leads admin-only, submitted fields immutable through the API, export without access bypass; 9 real-REST tests on a throwaway DB. Pending: confirm admin-only vs a sales role (editors lose lead access on deploy).
- **COPY-01 / A-03: VERIFY.** Simulated "served today" ticker removed; claims register created, nothing approved.
- **CMS-01 / A-04: VERIFY.** CMS decides which posts exist; lifecycle and outage tested locally. Pending: staging demo and training.
- **ANALYTICS-01 / A-05: VERIFY.** Single `generate_lead` recipe, E2E-proven counts; GTM/GA4/Ads execution needs access. Three E2E suites now network-isolated (they could hit live GA4).
- **LEAD-01 / A-07: TODO/BLOCKED.** Body cap fixed; shared rate limit = Vercel Firewall proposal; owners, inbox test, Resend key revocation pending.
- **SEO-01 / domains: BLOCKED** on Arroba/previous Vercel owner; single cutover sheet + unsent message ready. Integrity-policy decision pending.
- **OPS-01: TODO.** Handoff package indexed in [docs/README.md](docs/README.md#paquete-de-entrega); synthetic backup/restore drill passes; all client data cells pending.
- E2E full suite: 60/61 at best; load-sensitive flakes documented (no 61/61 run on this machine). Local Node 25.8.1, not 24.
- Next exact action: user asks Codex to review (`revisa el trabajo de Claude`); then decisions listed under "Decisiones del usuario" in the results.

## Current assessment — 2026-09-30

Execution handoff: the user chose Claude to implement and Codex to review after completion. Follow [the detailed Claude brief](docs/claude-remediation-brief-2026-09-30.md); save results in `docs/claude-remediation-results.md`. This records assignment, not completion or external-change authorization.

Read [the September 30 audit](docs/delivery-readiness-audit-2026-09-30.md) first for current release readiness. Audited clean commit `7d67dac` on `design-system/type-unification`. The September 11 date below is historical; no new delivery deadline is agreed. Older current-handoff bullets and completed QA labels below do not supersede the fresh results.

- **Release not accepted.** Build/typecheck pass; 76 contracts, 26 contact and 30 migration tests pass. Lint fails (1 error), design gate fails (2 categories), accessibility has 17 passes / 4 failures.
- **QA-01 reopened: TODO**, next owner development: fix the home effect, new token violations, contrast and carousel touch targets. Audit A-01/A-06.
- **DATA-01: TODO**, release blocker: immutable lead data is only UI-read-only; define editor/lead-export permissions and enforce/test API boundaries. Audit A-02.
- **COPY-01 / CMS-01: TODO/VERIFY:** replace the simulated “served today” claim; make unpublish/fallback behavior and editing ownership explicit. Audit A-03/A-04.
- **BILL-01: CLOSED / REMOVED** (user reconfirmed 2026-10-12): form/API deleted in `5b2bad4`; the email link is the final implementation. No website billing workflow or finance-workflow acceptance remains in the delivery backlog.
- **SEO-01 / ANALYTICS-01 / OPS-01: VERIFY:** coordinate exact project-domain records with Arroba; reconcile contradictory claim instructions and duplicate conversion recipes; collect client ownership, inbox, recovery and support evidence. No current DNS/dashboard acceptance claimed.
- Next exact action: close A-01/A-06 and A-02, then validate CMS/content decisions and assemble the client handoff packet. This audit changed documentation only; it did not deploy, send messages or change accounts/DNS/database.

## Start here

Objective: prepare Zitrone for professional client delivery by the end of this week. Working deadline: **Friday, September 11, 2026, America/Mexico_City**. Friday is a planning assumption; no exact delivery hour was supplied. This is a target, not a readiness guarantee.

Read these files in order:

1. [AGENTS.md](AGENTS.md) and the applicable project rules it links to.
2. This tracker: current status, next task and acceptance criteria.
3. [Progress log](docs/delivery-progress.md): what changed, checks, decisions and handoff notes.
4. [September 7 audit](docs/delivery-readiness-audit-2026-09-07.md): detailed baseline evidence; consult the relevant finding instead of repeating the entire audit.

These are portable Markdown files. Any assistant or developer with access to this checkout can use them. The files are the shared memory; a previous chat is not required. Keep secrets, credentials, personal lead data and private customer messages out of them.

## Current handoff

- 2026-09-22, Codex: SEO-01 local migration preparation IN PROGRESS; scope: host/path redirects, local verification, and GTM activation instructions. No DNS, production, Google account or mail mutations authorized by this batch.

- 2026-09-22, Codex: current read-only domain/analytics validation in [migration audit](docs/migration-validation-2026-09-22.md). Migration not signed off: published GTM v9 still triggers Ads/GA4 form_submit from a legacy CSS click, not contact_request_accepted. Preserve corporate mail DNS; obtain zone inventory and coordinated cutover/rollback before domain reassignment. This dated audit supersedes older domain assumptions for its scope.

- Active resumption: **LEAD-01**, Claude (2026-09-14). Staging path built and verified without touching hosted DB/opina@/production (see docs/contact-email-delivery.md). Awaiting user inbox confirmation and go-live approval.
- Phase: SEC-01 and QA-01 recorded closed by Claude; SEO-01 and the contact-page portion of UX-01 verified locally by Codex. The site is still in development; deployment verification remains for handoff.
- Latest user revision completed locally, UX-01 (Codex, Sep 10–11): contact supports multiple services, active headcount without an unsure toggle, automatic dining questions when comedor is selected, and shared home/contact per-meal counters. Final 24 browser tests pass; 45 contracts pass. Location hierarchy preserved. Await user review; notification/persistence acceptance and wider release checks remain open.
- Latest completed local batch: **UX-01 / location hierarchy**, Codex (2026-09-09/10). Home/contact share state/entity → municipality/borough selection, constrained to six inherited regions and 38 specific zones. 24 browser tests and 45 contracts pass. No national expansion or statewide coverage claim. Next: user review of the local selector and client approval of exact zones; remaining homepage-profiler acceptance and ANALYTICS-01 stay open. Resend remains paused.
- Deployment posture: verify against `npm run dev`, never against the live domain. The live site is a stale build and its behaviour says nothing about this checkout. REL-01 is a launch-day checklist item, not a P0.
- Last observed checkout commit: `c391793` (`Extract BlogCard into a scoped component`). The worktree contains additional changes; the commit alone does not represent the audit snapshot.
- Release decision: **not ready**. No production deployment or successful live form submission was performed during the audit.
- Production drift confirmed 2026-09-07 and consciously accepted for now: the deployed homepage's primary CTA is a `mailto:` to a feedback address and does not reach the contact form. This checkout already fixes that. Deploying resolves it whenever the user chooses to ship; it is not a development blocker. The one live-site risk to watch: if the client is shown the live URL before handoff, they see the stale CTA.
- Browser availability: interactive Browser runtime still had no connections Sep 8; the repository's isolated Chromium test runner works with approved local-server permissions. `npm run test:contact` runs mocked submissions against a dev server, without real lead/email writes.
- Preserve the pre-existing pantry photography and generated-file changes. Inspect `git status` and diffs before editing or committing. Do not clean or revert unrelated work.

## Work rules

- Work one clearly bounded ticket at a time, following dependencies. Assign an owner before editing. If multiple tools/people work concurrently, claim separate files or agree the boundaries first.
- Use these statuses: `TODO`, `IN PROGRESS`, `BLOCKED`, `VERIFY`, `DONE`, `DEFERRED`. `VERIFY` means implementation exists but acceptance evidence is incomplete. `BLOCKED` requires a specific dependency and next action; continue other unblocked work.
- Do not mark a ticket done because code compiles. Attach the evidence specified by its acceptance criterion, including the environment and date. Production claims need production evidence.
- Save progress after each meaningful result and before handing off. Record unsuccessful checks and remaining limitations honestly.
- Keep confirmed facts, source-analysis risks and untested hypotheses distinct. Recheck time-sensitive observations and anything invalidated by subsequent changes.
- Follow the current user's authorization. Routine scoped implementation and relevant tests can proceed when authorized; this tracker is not blanket approval to deploy, change production data, send real messages, change DNS or overwrite CMS content.
- Never paste environment values into the log. Refer to a provider, setting name, account owner or secure storage location only.
- Do not weaken checks just to obtain green output. Content rules may be revised with a documented product rationale; do not treat arbitrary word limits as universal SEO laws.
- Favor focused fixes that protect inquiries, permissions, usability and delivery confidence. Broad redesign or removal of every historical token violation is not necessary to begin release validation.

## Work queue

Priorities: **P0** = blocks release acceptance; **P1** = complete/verify for professional handoff; **P2** = proposed follow-up unless evidence raises its priority. No open risk is silently accepted because the deadline is close.

| ID | Priority | Status | Owner | Work and acceptance evidence |
| --- | --- | --- | --- | --- |
| SEC-01 | P0 | DONE | Claude (2026-09-07) | Protect the CMS role field and legitimate bootstrap path. An editor can update allowed profile fields but cannot promote their own role; administrators retain intended permissions. Verify through isolated API-level tests. Start at `src/payload/collections/users.ts`. |
| REL-01 | LAUNCH-DAY | DEFERRED | Claude (2026-09-07) | Not a current blocker: the site is still in development and production is an older build, so every production observation in the audit describes that old build, not this work. Verify on the day of handoff, after the deliverable is final — deploy (`vercel --prod`, run manually; this project does not deploy from git), then confirm both locale contact routes, the nav/hero CTA destination and the deployed commit identity. **Do not diagnose production before then.** Diagnosis already recorded: `/es/contact` 404s only because the Spanish route is localized to `/es/contacto` (200); the live build's CTA is a `mailto:` to a feedback inbox, while this checkout correctly points it at the contact form. |
| LEAD-01 | P0 | DONE (verify inbox) | Claude + user (2026-09-17) | LIVE: production deploy via manual `vercel --prod`; `email_delivery` migration applied to Neon; rotated Resend key + sender vars in Vercel production. First live inquiry `ZC-20260917-4R4YSW` persisted in Neon and both emails accepted by Resend (sales → opina@, confirmation → sebastian@). Remaining: user confirms receipt at opina@ and deletes old Resend key. Google Sheets mirror deferred (code shipped, env unset = off). |
| BILL-01 | — | DONE | User decision, reconfirmed 2026-10-12 | Website billing workflow removed, not deferred. Email link only is final. No form/API/webhook/automation to build or accept. Old database-table cleanup is maintenance, not an open feature. |
| QA-01 | P0 | DONE | Claude (2026-09-07) | Resolve three content-contract failures and email palette drift. Pass the release's required build/type/lint/content/asset/email checks. Record any intentionally revised editorial rule. |
| UX-01 | P1 | VERIFY | Codex (2026-09-11) | Contact allows multiple services; comedor automatically adds dining questions, other services retain the short path. Active headcount, shared meal counters, and shared limited-coverage location hierarchy implemented. Final 24 Chromium tests cover ES/EN, multi-service briefs, individual meal counts, home-counter regression, location reset, errors/retries and duplicate guards. 45 contracts pass. Remaining: full homepage submission/recovery acceptance, manual accessibility, client review and real delivery under LEAD-01. |
| DATA-01 | P1 | TODO | Unassigned | Enforce immutable lead fields and appropriate read/update permissions at the API boundary. Verify editor/admin/anonymous cases, shared abuse controls and actual request limits. Review dependencies and approved data retention. |
| SEO-01 | P1 | VERIFY | Codex (2026-09-07) | Local implementation complete: translated profile metadata/sitemap/navigation agree; contact included; conflicting middleware hreflang headers removed. Seven SEO tests pass, 40 contracts total; TypeScript and scoped lint pass. Local sitemap has 62 entries; both contacts and all four profiles return 200 with correct metadata. Remaining: production crawl, Search Console and domain-migration checks at handoff. |
| COPY-01 | P1 | TODO | Unassigned | Deliver an evidence-based buyer/search-intent-to-page map and clear opening message. Obtain approval for coverage, service facts, pricing, claims, testimonials and logos. Prioritize homepage and service pages; no invented statistics or rankings. |
| ANALYTICS-01 | P1 | TODO | Unassigned | Wire and verify contact start/progress/error/accepted-lead tracking and attribution. Count durable acceptance as conversion; avoid personal data in analytics. Verify actual property events and consent behavior, and define the business report. |
| A11Y-01 | P1 | TODO | Unassigned | Include contact and critical form/menu/consent states in accessibility checks. Verify keyboard focus, error associations, zoom/reflow and screen-reader usability in both languages. Record tested routes/devices and unresolved findings. |
| VISUAL-01 | P1 | TODO | Unassigned | Fresh mobile/desktop visual and interaction review of key templates and states, both languages. Check typography, spacing, crops, overflow, CTA hierarchy and motion. Establish reproducible screenshot verification. |
| PERF-01 | P1 | TODO | Unassigned | Measure production-like mobile/desktop performance; address demonstrated bottlenecks. Align overwritten asset paths with immutable caching. Save lab results and field-monitoring plan; distinguish lab data from real-user Core Web Vitals. |
| CMS-01 | P1 | TODO | Unassigned | Document editable vs code-owned content, prevent accidental editorial overwrite, and demonstrate edit/publish/revalidation/recovery. Refresh stale Sanity/On It references in active runbooks. |
| OPS-01 | P1 | TODO | Unassigned | Confirm client access/ownership, operating costs, secrets management, monitoring recipients, backups, restore and deployment rollback. Deliver training, support responsibilities and known limitations. |
| DS-01 | P2 | TODO | Unassigned | Reduce historical token debt by coherent component; improve CSS/form module boundaries and component documentation. Maintain a regression limit and visual evidence. Elevate any discovered accessibility or functional defect to P0/P1. |

## Critical dependencies

- REL-01 production acceptance depends on deployment access, understanding the deployed version, and the intended release passing QA-01. It must not ship a known SEC-01 problem.
- LEAD-01 depends on a sales owner/destination and verified persistence; UX-01 and ANALYTICS-01 must share its submission contract.
- BILL-01 is closed: the website only links to billing email; there is no billing-workflow dependency.
- A11Y-01 and VISUAL-01 should run after relevant UX changes, then again only for affected surfaces after subsequent edits.
- PERF-01 needs a production-like build. SEO-01 needs final route/content behavior. OPS-01 and final acceptance need the chosen release and client account owners.

## Week plan

This schedule is provisional until production access and client approvals are known. Escalate a missed dependency on the day it threatens delivery; do not conceal it until Friday.

| Date | Intended outcome |
| --- | --- |
| Mon Sep 7 | Establish tracker; begin SEC-01 and production diagnosis; collect sales/access dependencies. |
| Tue Sep 8 | Close security and lead-delivery blockers; restore failing checks; billing workflow subsequently removed (BILL-01 closed). |
| Wed Sep 9 | Complete critical inquiry UX, tracking, localized SEO and message/claim review. |
| Thu Sep 10 | Verify mobile/desktop, accessibility, performance, CMS publishing and operational recovery. Freeze discretionary features. |
| Fri Sep 11 | Validate the release candidate, resolve remaining blockers, perform authorized release and production checks, deliver training and handoff evidence. |

Protect the Thursday/Friday verification window. If scope exceeds capacity, propose explicit deferrals with impact and client acceptance; security, broken inquiries and misleading delivery claims remain release blockers.

## Inputs to obtain early

Record decisions here or in the progress log; do not repeatedly ask after an answer is recorded.

| Input | Current state | Needed for |
| --- | --- | --- |
| Sales lead owner and destination | opina@zitrone.com.mx confirmed by user; two people handle inquiries. Google Workspace retained. User reports send.zitrone.mx verified via GoDaddy; temporary key present locally. Implementation complete; hosted DB addition and real inbox/reply tests pending approval. Individual response/recovery ownership remains open. | LEAD-01 |
| Billing | Final: email link only; website workflow deleted, not deferred | BILL-01 closed |
| Deployment/provider access and release authority | Not established by the audit | REL-01, OPS-01 |
| Approved service geography, claims, pricing and brand permissions | User confirms limited major-city coverage, not nationwide. Preserved existing CDMX, Estado de México, Hidalgo, Querétaro, Nuevo León and Jalisco selections; 38 specific zones. Exact per-zone/per-service approval still pending. Other claims/pricing/permissions not verified. | COPY-01 |
| Analytics/Search Console access | Not verified | ANALYTICS-01, SEO-01 |
| Client handoff hour and reviewers | Friday end-of-week assumed; exact time unknown | Final acceptance |

## Release acceptance

- [ ] No unresolved P0 tickets.
- [ ] P1 tickets have evidence or an explicit, documented acceptance of a narrowly scoped limitation; do not declare safety/operability issues optional to meet a date.
- [ ] Exact release passes required checks; successful local build is not substituted for deployment validation.
- [ ] Spanish and English inquiry journeys work through receiving-team handling.
- [ ] CMS permission boundaries and recovery are verified.
- [ ] Key mobile/desktop, accessibility, content and privacy checks are recorded.
- [ ] Performance and analytics baselines are recorded without unsupported scores or promises.
- [ ] Client can access, operate, maintain and recover the agreed deliverable.
- [ ] Release identity, remaining risks, support owner and follow-up backlog are handed over.

## Resume prompt

> Open this project and read AGENTS.md, DELIVERY.md and docs/delivery-progress.md. Continue the highest-priority unblocked item of the current release (see "Current state" at the top). Preserve existing work, make focused changes, verify acceptance, and update the tracker and progress log before stopping. Do not repeat completed work or assume old production observations are still current. Follow the current session's authorization for external changes.


### 15-Oct active implementation coordination

Sources/fonts and image optimization are in progress in separate worktrees; neither combined release nor main readiness is certified. Follow the modality 2 coordination notes (working notes, kept outside the repository): finish scoped changes, independent review, integrate and test one SHA, then prepare recipient deployment. No external actions performed in this planning pass.

Image branch preliminary review: [findings](docs/revision-imagenes-2026-10-15.md). Hold acceptance pending hero readiness/error handling and reproducible final evidence; do not deploy this branch directly.

Font change 146b966: implementation inspected; [review](docs/revision-fuentes-2026-10-15.md) requests licenses and reproducible evidence. Reported cookie-footer failure keeps complete E2E acceptance open; gap 8 now reflects implementation rather than an unmade decision.

Analytics preparation reviewed 15-Oct: [local vs receiver checklist](docs/analytics/preparacion-handoff-2026-10-15.md). NODE_ENV-only GTM gating also includes previews/local production builds; explicit environment isolation remains to implement. Consent footer and page-view strategy/receiver validation remain open. No live Google state verified.

Repository handoff organization: [plan](docs/plan-organizacion-repositorio.md). Initial local inspection found stale main references, parallel worktrees and outdated admin-only README. Preserve history and active work; audit tracked content/history, consolidate docs and prepare one reviewed release. No remote/history mutation performed.

## Codex release review — 6f5aa1f

See [review](docs/codex-release-review-2026-10-17.md): R7 migration transition/rollback, R8 missing home-cache CI gate, R9 unsupported production visual-equivalence claim. Contracts independently 94/94 on Node 25; broader suites not repeated. No merge/deploy/migration.


## 2026-10-18 — Codex re-review a18cd87

[Report](docs/codex-r7-r9-rereview-2026-10-18.md): R8 configuration accepted, R9 wording corrected, R7 partial. New R10: down casts seeded new icons to old enums and can fail; rehearsal lacks new-home seed. R11: README still commands vercel --prod despite automatic main deployment; destination/origin sequence unresolved. Latest PR checks pending; Vercel preview fails. Read-only review, no migrations, deploy or Vercel mutations.


## Codex cleanup review — 18 Oct

[Review](docs/codex-cleanup-review-2026-10-18.md): cleanup accepted in inspected scope; independent backup verification 94/94, clean token generation, CI confirmed for 397ec9f. a7b72c3 is documentation only. Recipient new repository will have a different SHA for the same published snapshot; record correspondence. QA/publication approval still pending.


## 2026-10-18 — Isolated QA plan review

Reviewed e38efb9 locally, no production access. See docs/codex-qa-plan-review-2026-10-18.md: clean env files/build, explicit DB guards, read-only browser/server boundaries, minimal content export and FK restoration, pre/post-seed comparison and scoped cleanup required before execution. No push needed for local review.


## 2026-10-18 — QA plan revision 2 and runner (not run against production)

Addressed the five points of codex-qa-plan-review-2026-10-18.md in docs/plan-qa-aislado-2026-10-18.md and scripts/qa-release/. Clean detached checkouts; a credential-holding extractor separate from QA processes; an explicit DB URL guard; a positive table inventory validated against the migration snapshot; phased restore with a synthetic-user remap; a free-text scan; Node egress guard plus a Blob mirror, so servers stay loopback-only; a parsed-hostname browser policy (reads only to the approved site, mutations simulated, service workers blocked); separate orig/mig/seed/rb states with the seed's changes listed for acceptance; real-motion check; scoped cleanup. tests/scripts/qa-release.test.ts covers the policy, guard, validator, scan and summary (24 tests).

Dry run of the full runner on a local stand-in source, with no production access: every step passed except mirror/compare, which read the published site and were skipped. It found that rollout step 4's pre-migration capture must use the published code (fixed in cms-home-rollout.md), plus four runner bugs (fixed). CI on fa652b1 failed once on a flaky stdout assertion in blog-cms-outage.test.ts; the rerun passed, and 2f6878a makes the test read the fixture's marker line. Local commits only; nothing pushed. Execution needs the user's single authorization (plan, section Autorización).


## 2026-10-18 — QA runner review 37cb394

See docs/codex-qa-runner-review-2026-10-18.md. R12 invalid catalog still enables extract; R13 required criteria log failures without rejecting; R14 raw CMS snapshots copied into versionable evidence. Local policy tests independently 24/24 on Node 25, shell syntax passes. No runner execution or production reads. Corrections required before grouped QA authorization.


## 2026-10-19 — QA runner R12–R14 and dry run on the final SHA (no production)

Fixed R12–R14 from codex-qa-runner-review-2026-10-18.md. An extract now needs a successful catalog of the same run (gate.mjs: run, SHA, source fingerprint and file hashes). Every criterion is a status.tsv row, and a FAIL stops the step. The verdict cannot pass with a FAIL, a missing check or a PENDING item. Raw CMS exports, screenshots and logs stay in private/, and evidence copies a fixed list of sanitized reports. The negative tests are in tests/scripts/qa-release-gates.test.ts; test:scripts is 43/43.

The dry runs also found and fixed four problems. The CLIs silently did nothing under a real-path mismatch (macOS /var vs /private/var). Cleanup left both servers running while reporting success. The sweep criterion read nonexistent fields, so the 72-page claim of revision 2 did not cover console errors or HTTP status. The embeddings check failed because the warning is printed once per process.

Final dry run on 4c342db, from init to cleanup, on a stand-in source: verdict INCOMPLETO, as designed. Only the five checks that read the published site are missing, plus the PENDING seed links. A synthetic confidential marker reached 0 evidence files. No production or published-site reads; local commits only.


## Codex R12–R14 accepted — 19 Oct

[Scoped acceptance](docs/codex-r12-r14-acceptance-2026-10-19.md): runner 4c342db / plan 7e52a0b ready for grouped QA authorization. Specific tests independently 31/31 on Node 25; full local rehearsal not repeated. No production access. Classify private visual/seed differences before cleanup. This is not release or execution approval.


## Classification pause and grouped authorization — 19 Oct

Per Codex's acceptance condition 3, `run.sh cleanup` now refuses while any PENDING check is unclassified: it needs work/classification.md naming every PENDING check (no content, only check, page, width, category, decision) and an evidence export newer than it; re-exporting to the run's own destination replaces it. QA_DISCARD remains the only bypass. New negative test in qa-release-gates.test.ts (specific tests 32/32, test:scripts 44/44 on Node 24). Plan revision 3.1 states the grouped authorization: exact candidate SHA, reference deployment, reads P1/P2/W1–W4/D1 only, the pause, sanitized evidence in a local commit; excludes production writes, branches/roles/previews, push, merge, deploy and real email. Not executed.


## 2026-10-19 — Scoped acceptance of QA pause 88b2de6

Reviewed cleanup/evidence pause; 8/8 gate tests independently pass on Node 25. No new blocker for requesting grouped authorization of plan 3.1. Record actual user classification before cleanup; presence of check names is not human approval. No production reads or QA execution. See codex-r12-r14-acceptance-2026-10-19.md (docs/ from repository root).


## Service usage check before QA — 19 Oct

Read-only, through the Vercel API; no plan or service changed. Vercel team `zitrone`: Hobby, no contract. 1–19 Oct: 1.4 GB outgoing transfer, ~88K edge requests, ~25K function invocations, Blob 0.53 GB stored and 3,630 simple operations, all well under the published Hobby limits; image-optimization usage not available from this API. Neon `zitrone-cms`: Marketplace Free plan, `usageQuotaExceeded: false`, status available; CU-hours used and current storage are not exposed by the Vercel API and still need to be read in the Neon console. Next: the user confirms the Neon margin, then the single QA authorization on 88b2de6. Commercial Vercel plan recorded as pending for publication/handoff (Hobby is non-commercial only).


## Isolated QA run 1 on 88b2de6 — 19 Oct: stopped by a scanner false positive

Authorized by the user in chat (scope of plan revision 3.1, Neon margin unverified, pause before cleanup; no production writes, push, merge or publication). Run 20261019-1223-6c78. `catalog` and `extract` PASS (read-only session, approved tables only), `restore:counts` PASS (178 tables), then `restore:free-text` FAIL: 102 "phones" ending in 64, all in the `_uuid` column of four version tables (FAQ answers, privacy notice intro/sections/paragraphs). Inspected in the local copy: every value is a 24-hex Payload row id whose digit runs look like a phone; no personal data. The run stopped as designed before using the copy; verdict FALLIDO; sanitized evidence in docs/evidence/qa-release-2026-10-19/. Nothing pending to classify, so cleanup ran: 0 containers, worktrees, servers, temporaries; zitrone-staging-pg untouched. Fix: the scanner's phone pattern no longer matches inside a longer letter-and-digit token (regression test added). A new run needs a new authorization on the new SHA.


## Home stays in code; no seed — 19 Oct

User decision: the home, navigation and footer stay in the code files; changes are asked of Claude (repository edits) and Arroba deploys. Payload stays only for the blog, the privacy notice and leads. Code: the home now reads the code files unless `HOME_CONTENT_SOURCE=cms` (before, `static` had to be set; a new project without it, e.g. Arroba's, would have read an unseeded CMS). Removed `getResolvedBlogLayout` (unused; it read CMS header/footer). Checked: navigation and footer of every page, blog and privacy included, come from `getResolvedHomeContent`. Procedure: steps 6 (seed) and 9 (CMS home switch) are not run. QA runner (plan revision 3.2): no `seed` state; `mig` is built, served (:3105), swept and compared with the approved site; rollback starts from `mig`; the runner leaves HOME_CONTENT_SOURCE unset to test the default. Local: tsc, contracts 94/94, test:scripts 44/44, test:cache:home 5/5 (now with =cms), test:cache 4/4. QA run 2 needs a new authorization on the new SHA.


## Dry run without seed — 19 Oct

First no-seed dry run (c7a713a) stopped at integrations:embeddings: the stand-in's FAQs, written by the published code's seed, have empty Spanish answers (old seed bug), so re-saving in Spanish fails validation. Fixed in 8e832c5: touch saves the first document/locale that validates and reports the rest as INFO (integrations:cms-invalid). Dry run on 8e832c5: INCOMPLETO as designed (only the 4 published-site checks missing), 34 PASS, 0 PENDING, marker in 0 evidence files, no leftovers. If production has the same FAQ data, the real QA will show it as INFO; the site does not display CMS FAQs, but editing such a FAQ in /admin would fail until its Spanish answer is filled.


## Isolated QA run 2 on 0893616 — 19 Oct: production data passes states; stopped at mirror

Started by the user from the prompt. With production data: catalog, extract, restore counts, free-text scan and every states check PASS (3 pending migrations, all applied; migration changes no visible link with old or new code; migrate:down + migrate gives the same home). Stopped silently at `mirror`: it looked for the Blob host in the published /es HTML, which no longer has Blob URLs (home from code files); the copy's media library has 738 files in one store. Nothing pending; cleanup complete, no leftovers. Fix: host from the copy's media table (with a FAIL row and message), W2 = sitemap.xml only; migrate:status colors stripped before counting (report and all-migrated check). QA run 3 needs a new run on the new SHA.


## Isolated QA run 3 on 898db63 — 19 Oct: stopped at mirror; broken size variants in Blob

Production data again passes catalog, extract, restore and every states check (12 applied, 1 pending before; all applied after). mirror took the Blob host from the copy and downloaded all 738 media-library originals; mirror:complete failed on 93 "missing" paths. Cause: the runner built Blob URLs from filenames (Blob names carry a random suffix), and many size variants (thumbnail/card/feature/hero) point in the database to unsuffixed URLs that do not exist in Blob (739 references, 93 distinct paths). Production finding: only /admin thumbnails are affected; the site reads media.url (originals, all present). Fix: mirror-media downloads stored URLs only, copies each file under its stored filename, tags entries required/size; mirror:complete fails only on a missing required file, size misses are INFO. Cleanup complete. Next: QA run 4 on the new SHA (mirror is not exercised by the dry run).


## Isolated QA run 4 on b07c889 — 19 Oct: one truncated Blob URL

Production passes catalog, extract, restore and states again. mirror:complete failed on 1 required file; 92 size variants INFO. Cause: the text URL pattern stops at ")", cutting the three El Universal logo names. Fix: the media library's URL columns are read whole. Checked offline against this run's copy with fetch stubbed: new URL set = old minus the truncated one plus the 3 full ones; 738 required (one per original). Cleanup complete. Next: QA run 5.


## Isolated QA run 5 on b17d097 — 19 Oct: complete; article redesign reverted by the user

First complete run: every automatic criterion passes with production data and the published site. One PENDING (50 of 80 visual comparisons above 0.1 %), classified by the user (docs/evidence/qa-release-2026-10-19-run5/classification.md): blog articles = defect, the article must look like the published one -> redesign merge c5ab832 reverted in 84e51e6 (keeping the 24px index target); privacy notice = accepted, must stay legible -> two privacy-only rules in 84e51e6 (its legibility came from the redesign CSS); recompressed photos = accepted; empty 'Carritos de servicio' card = capture artifact (verified in a browser) -> visual-compare waits for every rendered image (cb41b05). Checked locally after the revert: article identical to the published code (page, toc, content, marketing.css except 4 a11y lines), privacy hero two columns on desktop and one on mobile; tsc, contracts 94/94, test:scripts 44/44. Next: QA run 6.


## Isolated QA run 6 on b39c38d — 19 Oct: Carritos capture fixed, repeat

Every automatic criterion passes again (38 PASS; INFO: 92 size variants, 160 Vercel-only console errors, FAQ #5 es invalid). One PENDING: 50 of 80 visual comparisons above 0.1 %. Articles now match the published design (remaining diffs: 24px index spacing and photo recompression), privacy legible, photos recompressed; the 'Carritos de servicio' card was still empty on /services desktop. User decision: "carritos: investiga" (docs/evidence/qa-release-2026-10-19-run6/classification.md; articles, privacy and photos not classified in this run). Cause found: with request interception the browser cache is off, and the full-page capture re-evaluates srcset; the card, which shares the hero photo already in memory at 1920w, switched to it and was captured before painting it. Not a site defect (a normal browser always shows it). Fix in the capture tool only: each image keeps the source chosen for the viewport before the load/decode waits (981c3c4); against this run's server the card was empty in 2 of 2 captures without it and showed the photo in 2 of 2 with it, ES and EN. Cleanup complete. Next: QA run 7.


## Isolated QA run 7 on c9ad178 — 19 Oct: complete, accepted by the user

Every automatic criterion passes (38 PASS; INFO: 92 size variants, 160 Vercel-only console errors, FAQ #5 es invalid). One PENDING: 50 of 80 visual comparisons above 0.1 %, classified by the user (docs/evidence/qa-release-2026-10-19-run7/classification.md, reply "si se ve bien"): articles match the published design (only the 24px index spacing and photo recompression), privacy notice legible, recompressed photos, and the 'Carritos de servicio' card now shows its photo on both sides (/services 2.3 % -> 1.0 %, recompression only) - all accepted by the user: no pending visual defects per the classification. Limits: the automatic verdict stays PENDIENTE DE CLASIFICACIÓN (the acceptance is the user's, in classification.md); integrations:cms-invalid reports FAQ #5 (es) failing validation (Answer 1 > Paragraph, empty answer from the old seed). Content debt outside the static home (the site does not render CMS FAQs): owner Zitrone/Arroba content, to fix in /admin before that FAQ is edited in the CMS; the hooks check covers the documents it saved, not every CMS document. Note: the run was launched three times at once; the two duplicates (20261019-1905-03fd stopped at serve on the busy port, 20261019-1908-8ba2 stopped by hand during states) were cleaned up by the user with run.sh cleanup (the second with QA_DISCARD, nothing to classify); production only received the read-only catalog/extract reads of each. Cleanup complete. Next, each needing explicit authorization: Codex final review, CI on the final SHA, backup, hosted migration, merge, Arroba repo.


## Codex review — 105eb80

See docs/codex-final-review-105eb80.md. No new blocker to pushing for CI in reviewed scope; gates 8/8 independently pass on Node 25. QA7 c9ad178 and 105eb80 differ only by docs/evidence. Align stale seeded/switch wording; retain invalid ES FAQ as documented content debt, not an all-CMS acceptance. No production or external changes. Applied: README home row and cms-home-rollout step 1 now say no seed/no CMS switch; run 7 conclusion narrowed to no pending visual defects, FAQ #5 es recorded as content debt with owner. The push that follows is not the repo's first: PR #5 and earlier CI exist; the final SHA gets its own CI.

Wording for the handoff (Codex, 19 Oct): maintenance is described as changes made in the repository through review, tests and publication, so Arroba can maintain the site with its own team and tools; README, manual-contenido, cms-home-rollout and the QA plan updated. Earlier entries that say "asked of Claude" record the decision as taken. Next after green CI, for authorization: backup with a recovery check, real state and exact list of pending migrations, a window without CMS edits, migration without seed with checks and rollback procedure. The merge stays separate (it publishes automatically) until those checks are resolved.


## Codex — revisión de scripts de producción, 19 octubre 2026

Revisión estática sobre checkout `6a45920`: [informe](docs/codex-production-scripts-review-2026-10-19.md). A reportado en ejecución por el usuario; resultado no verificado aquí. Antes de B: comparar contenido/enlaces antes y después, exigir prueba de finalización satisfactoria de A además del checksum, y precisar referencia compatible/garantías de solo lectura y conteos. No se ejecutaron scripts ni consultas de producción. Siguiente: revisar resultado de A y corregir B antes de migrar; no repetir A automáticamente.

Claude, 19 Oct: A finished LISTO (3 expected pending; full dump of 178 tables, counts source = copy = restored; capture with reference 255eec2). B corrected per the review: it checks A's log (LISTO, same folder, no DETENIDO) besides the checksum and the three count files; verifies on the server that status and probes run read-only (only `payload migrate` writes); before migrating, row counts and the header/footer/home export must equal the backup; after, row counts may differ only by the dropped billing_page tables, +3 payload_migrations rows and new empty tables, the 255eec2 reference export must be byte-identical and the visible links/CTA equal with both the reference and the final code. 255eec2 is described as the compatible reference, not the exact deployed code. Any stop after the migration leaves it applied and goes to Claude for the rollback procedure in cms-home-rollout.


Codex, revisión de B corregido (19 Oct): correcciones principales presentes y sintaxis zsh válida; sin nuevo bloqueo de implementación en el alcance revisado. Ver codex-production-scripts-review-2026-10-19.md. Precisar antes de ejecutar que los conteos no comparan todo el contenido y que un fallo DURANTE el paso 3 puede dejar algunas migraciones confirmadas (Payload confirma cada archivo por separado); detenerse y verificar estado, sin repetición ni rollback automático. A satisfactorio reportado por Claude, no verificado independientemente aquí. No ejecuté A/B ni consulté producción.

Codex re-review of B (19 Oct): no other blocker. Precision: equal row counts do not prove identical content in all 178 tables; content is compared only for header, footer, home and visible links. A failure during the migration step can leave some of the three applied (Payload records each one separately): stop, check which finished, decide recovery; never rerun B or roll back automatically. B's failure message now says so.

Production migration, 19 Oct 2026 21:36 (B, run once by the user, final code 6a45920, no seed): A's record checked; read-only confirmed on the server for status and probes; before migrating, rows and header/footer/home equal to the backup. Migrated; 0 pending; payload_migrations +3. The six billing_page tables were empty (0 rows) when dropped; 10 new tables, empty; the other 172 tables keep their row counts. The 255eec2 reference reads a byte-identical header/footer/home export and the same visible links/CTA (es 3, en 26); the final code sees the same links. www.zitrone.mx: 8/8 URLs 200. Evidence in the private backup folder ~/Documents/Zitrone/respaldos/zitrone-cms-20261019-2125. Vercel preview on PR #5 keeps failing as expected (no PAYLOAD_SECRET by decision). Nothing published; merge (step 7) awaits its own authorization. This entry changes the SHA: the merge SHA needs its own green CI.
