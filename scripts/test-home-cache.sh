#!/bin/zsh
# Home, navigation and footer editing through Next's real cache
# (tests/cache/home-cache.test.ts).
#
#   npm run test:cache:home
#
# Same isolation as test-blog-cache.sh, but the build runs in CMS mode
# (HOME_CONTENT_SOURCE=cms), the mode production does not use (docs/cms-home-rollout.md):
# 1. Creates zitrone_home_cache_api_test in a local Postgres, migrates it and
#    seeds it from the code content (`payload:seed:home`) plus one admin.
# 2. Checks code/CMS parity on that database, then `next build` against it.
# 3. `next start` on :3111 with revalidation hooks ENABLED and the loopback
#    network guard, runs the test, stops the server and drops the DB.
# Never uses the hosted database.
set -euo pipefail
source "${0:A:h}/lib/test-db.sh"

DB=zitrone_home_cache_api_test
PORT=${HOME_CACHE_TEST_PORT:-3111}
MEDIA_DIR=$(mktemp -d "${TMPDIR:-/tmp}/zitrone-home-cache-media.XXXXXX")

if command -v lsof >/dev/null && lsof -iTCP:$PORT -sTCP:LISTEN >/dev/null 2>&1; then
  print "port $PORT is in use; set HOME_CACHE_TEST_PORT"; exit 1
fi

SERVER_PID=""
cleanup() {
  [[ -n "$SERVER_PID" ]] && kill "$SERVER_PID" 2>/dev/null || true
  command -v lsof >/dev/null && { lsof -ti tcp:$PORT -sTCP:LISTEN 2>/dev/null | xargs kill 2>/dev/null || true }
  psql_admin "DROP DATABASE IF EXISTS $DB WITH (FORCE)"
  rm -rf "$MEDIA_DIR"
}
trap cleanup EXIT
psql_admin "DROP DATABASE IF EXISTS $DB WITH (FORCE)"
psql_admin "CREATE DATABASE $DB"

# Empty values win over .env.local: Next only fills variables that are unset.
base_env() {
  env -i PATH="$PATH" HOME="$HOME" TMPDIR="${TMPDIR:-/tmp}" LANG="${LANG:-en_US.UTF-8}" \
    DATABASE_URL="postgres://$PG_USERINFO@$PG_HOST:$PG_PORT/$DB" \
    PAYLOAD_SECRET="home-cache-test-secret-not-real" \
    PAYLOAD_CONFIG_PATH=src/payload/payload.config.ts PAYLOAD_MEDIA_DIR="$MEDIA_DIR" \
    NEXT_PUBLIC_SITE_URL=https://www.zitrone.mx HOME_CONTENT_SOURCE=cms \
    OPENAI_API_KEY= RESEND_API_KEY= BLOB_READ_WRITE_TOKEN= CONTACT_SALES_EMAIL= \
    PAYLOAD_ADMIN_EMAIL= PAYLOAD_ADMIN_PASSWORD= \
    SENTRY_DSN= NEXT_PUBLIC_SENTRY_DSN= SENTRY_AUTH_TOKEN= NEXT_TELEMETRY_DISABLED=1 \
    "$@"
}

base_env NODE_ENV=test NODE_OPTIONS="--import=$GUARD" PAYLOAD_DISABLE_REVALIDATE=true \
  node node_modules/payload/bin.js migrate >/dev/null
print "seeding the home from the code content…"
base_env NODE_ENV=test NODE_OPTIONS="--import=$GUARD" PAYLOAD_DISABLE_REVALIDATE=true PAYLOAD_SEED_SCOPE=home \
  npx tsx scripts/payload/seed.ts >"${TMPDIR:-/tmp}/zitrone-home-cache-seed.log" 2>&1 || { tail -30 "${TMPDIR:-/tmp}/zitrone-home-cache-seed.log"; exit 1 }
base_env NODE_ENV=test NODE_OPTIONS="--import=$GUARD" PAYLOAD_DISABLE_REVALIDATE=true \
  npx tsx tests/cache/home-seed.ts
base_env NODE_ENV=test NODE_OPTIONS="--import=$GUARD" \
  npx tsx scripts/payload/check-home-parity.ts >"${TMPDIR:-/tmp}/zitrone-home-cache-parity.log" 2>&1 || { tail -40 "${TMPDIR:-/tmp}/zitrone-home-cache-parity.log"; exit 1 }
print "parity: the CMS home matches the code content"

print "building against the throwaway CMS (CMS mode)…"
base_env node node_modules/next/dist/bin/next build >"${TMPDIR:-/tmp}/zitrone-home-cache-build.log" 2>&1 || { tail -30 "${TMPDIR:-/tmp}/zitrone-home-cache-build.log"; exit 1 }

base_env NODE_OPTIONS="--import=$GUARD" node node_modules/next/dist/bin/next start --hostname 127.0.0.1 --port $PORT \
  >"${TMPDIR:-/tmp}/zitrone-home-cache-server.log" 2>&1 &
SERVER_PID=$!
for i in {1..60}; do curl -sf -o /dev/null "http://127.0.0.1:$PORT/es" && break; sleep 1; done

HOME_CACHE_TEST_BASE="http://127.0.0.1:$PORT" \
  npx tsx --test --test-force-exit tests/cache/home-cache.test.ts
