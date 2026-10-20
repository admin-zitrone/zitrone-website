# Evidence for R5/R6 (Claude, 2026-10-12)

Node 25.8.1, macOS, working tree at the R5 commit 60228aa (plus the R6 docs commit). Postgres: local Docker `zitrone-staging-pg`; URL mode used TEST_PG_URL pointing at the same container on 127.0.0.1 (credentials not logged).

- repro-db-validation-fixed.log: Codex's repro script and the `?host=` case through the helper, after the fix.
- test-scripts.log: tests/scripts/test-db-helper.test.ts (12/12).
- test-api-docker.log, test-api-url.log: test:api 30/30 in each mode.
- test-cache-url.log: test:cache 4/4 (CI path). test-cache-docker-rerun.log: 4/4.
- test-cache-docker-intermittent-font-failure.log: the first Docker-mode run, failed in `next build` with `next/font/google queries have exactly one entry` (after the database was created and seeded); not a DB-helper failure, cause not investigated.
- lint.log, tsc.log, test-contracts.log (83/83).
No GitHub Actions run; no Node 24 rerun in this round.
