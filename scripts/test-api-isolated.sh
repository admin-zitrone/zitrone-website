#!/bin/zsh
# Isolated API suites (tests/api): create a throwaway database in the local
# Docker Postgres, apply every migration, run the suites, drop the database.
#
#   npm run test:api
#
# Needs a local Postgres: TEST_PG_URL (CI service container) or Colima/Docker
# with the `zitrone-staging-pg` container (scripts/lib/test-db.sh). Never touches the hosted Neon database:
# DATABASE_URL is forced to the local *_api_test database, and the harness
# refuses anything else. The suites run with an empty environment and a
# loopback-only network guard (tests/api/network-guard.mjs): no email,
# embedding, upload or telemetry request can leave the machine.
set -euo pipefail
source "${0:A:h}/lib/test-db.sh"

DB=zitrone_api_test


psql_admin "DROP DATABASE IF EXISTS $DB WITH (FORCE)"
psql_admin "CREATE DATABASE $DB"
trap 'psql_admin "DROP DATABASE IF EXISTS '"$DB"' WITH (FORCE)"' EXIT

# Clean environment: nothing from the caller's shell or .env files reaches
# the suites, so no provider credential (OpenAI, Resend, Blob, Sentry…) can be
# inherited. Every Node process, including Payload's CLI and child processes,
# preloads the loopback-only network guard.
isolated() {
  env -i \
    PATH="$PATH" HOME="$HOME" TMPDIR="${TMPDIR:-/tmp}" LANG="${LANG:-en_US.UTF-8}" \
    NODE_ENV=test \
    NODE_OPTIONS="--import=$GUARD" \
    DATABASE_URL="postgres://$PG_USERINFO@$PG_HOST:$PG_PORT/$DB" \
    PAYLOAD_SECRET="api-test-secret-not-a-real-secret" \
    PAYLOAD_DISABLE_REVALIDATE=true \
    PAYLOAD_CONFIG_PATH=src/payload/payload.config.ts \
    "$@"
}

isolated node node_modules/payload/bin.js migrate >/dev/null
isolated npx tsx --test --test-concurrency=1 --test-force-exit tests/api/*.test.ts
