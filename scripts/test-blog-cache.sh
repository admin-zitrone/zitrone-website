#!/bin/zsh
# Blog publishing through Next's real cache (tests/cache/blog-cache.test.ts).
#
#   npm run test:cache
#
# 1. Creates zitrone_cache_api_test in a local Postgres (TEST_PG_URL or the
#    zitrone-staging-pg container, see scripts/lib/test-db.sh),
#    migrates it and seeds one admin + one ES/EN post (synthetic).
# 2. `next build` against that database (writes .next: rebuild before other
#    production runs), with every provider credential set empty so nothing in
#    .env.local can reach the build.
# 3. `next start` on :3110 with revalidation hooks ENABLED and the loopback
#    network guard, then runs the test, stops the server and drops the DB.
# Never uses the hosted database.
set -euo pipefail
source "${0:A:h}/lib/test-db.sh"

DB=zitrone_cache_api_test
PORT=${CACHE_TEST_PORT:-3110}

if command -v lsof >/dev/null && lsof -iTCP:$PORT -sTCP:LISTEN >/dev/null 2>&1; then
  print "port $PORT is in use; set CACHE_TEST_PORT"; exit 1
fi

SERVER_PID=""
cleanup() {
  [[ -n "$SERVER_PID" ]] && kill "$SERVER_PID" 2>/dev/null || true
  # Whatever still listens on the port is this run's server.
  command -v lsof >/dev/null && { lsof -ti tcp:$PORT -sTCP:LISTEN 2>/dev/null | xargs kill 2>/dev/null || true }
  psql_admin "DROP DATABASE IF EXISTS $DB WITH (FORCE)"
}
trap cleanup EXIT
psql_admin "DROP DATABASE IF EXISTS $DB WITH (FORCE)"
psql_admin "CREATE DATABASE $DB"

# Empty values win over .env.local: Next only fills variables that are unset.
base_env() {
  env -i PATH="$PATH" HOME="$HOME" TMPDIR="${TMPDIR:-/tmp}" LANG="${LANG:-en_US.UTF-8}" \
    DATABASE_URL="postgres://$PG_USERINFO@$PG_HOST:$PG_PORT/$DB" \
    PAYLOAD_SECRET="cache-test-secret-not-real" \
    PAYLOAD_CONFIG_PATH=src/payload/payload.config.ts \
    NEXT_PUBLIC_SITE_URL=https://www.zitrone.mx HOME_CONTENT_SOURCE=static \
    OPENAI_API_KEY= RESEND_API_KEY= BLOB_READ_WRITE_TOKEN= CONTACT_SALES_EMAIL= \
    SENTRY_DSN= NEXT_PUBLIC_SENTRY_DSN= SENTRY_AUTH_TOKEN= NEXT_TELEMETRY_DISABLED=1 \
    "$@"
}

base_env NODE_ENV=test NODE_OPTIONS="--import=$GUARD" PAYLOAD_DISABLE_REVALIDATE=true \
  node node_modules/payload/bin.js migrate >/dev/null
SEED=$(base_env NODE_ENV=test NODE_OPTIONS="--import=$GUARD" PAYLOAD_DISABLE_REVALIDATE=true \
  npx tsx tests/cache/seed.ts 2>/dev/null | sed -n 's/^SEED //p')
print "seed: $SEED"

print "building against the throwaway CMS…"
base_env node node_modules/next/dist/bin/next build >"${TMPDIR:-/tmp}/zitrone-cache-build.log" 2>&1 || { tail -30 "${TMPDIR:-/tmp}/zitrone-cache-build.log"; exit 1 }

base_env NODE_OPTIONS="--import=$GUARD" node node_modules/next/dist/bin/next start --hostname 127.0.0.1 --port $PORT \
  >"${TMPDIR:-/tmp}/zitrone-cache-server.log" 2>&1 &
SERVER_PID=$!
for i in {1..60}; do curl -sf -o /dev/null "http://127.0.0.1:$PORT/es" && break; sleep 1; done

CACHE_TEST_BASE="http://127.0.0.1:$PORT" CACHE_TEST_SEED="$SEED" \
  npx tsx --test --test-force-exit tests/cache/blog-cache.test.ts
