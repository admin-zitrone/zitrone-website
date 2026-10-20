# Sourced by the isolated test runners. Resolves a throwaway-capable Postgres
# on 127.0.0.1 and defines psql_admin. Two modes:
#
# - TEST_PG_URL set (CI: a postgres service container), e.g.
#   postgres://postgres:postgres@127.0.0.1:5432/postgres. Validated by
#   scripts/lib/test-pg-url.mjs (loopback only, no query parameters); the
#   original string is never passed to a client. Admin commands go through the
#   project's own `pg` client with the network guard loaded.
# - otherwise the local Docker container (default zitrone-staging-pg, see
#   docs/contact-email-delivery.md), admin commands through docker exec.
#
# A rejected URL or an unresolved container stops the sourcing shell (exit 1)
# before psql_admin exists, so no admin SQL can run. Afterwards PG_HOST,
# PG_PORT, PG_USER, PG_PASS and PG_USERINFO are set; build connection URLs as
# postgres://$PG_USERINFO@$PG_HOST:$PG_PORT/<db>. The databases the runners
# create end in _api_test, which tests/api/harness.ts requires.

# File URL: NODE_OPTIONS splits on spaces and checkout paths can contain one.
GUARD=$(node -p 'require("node:url").pathToFileURL("tests/api/network-guard.mjs").href') || exit 1

if [[ -n "${TEST_PG_URL:-}" ]]; then
  PG_ASSIGNMENTS=$(node scripts/lib/test-pg-url.mjs) || { print -u2 "test-db: refusing TEST_PG_URL"; exit 1 }
  eval "$PG_ASSIGNMENTS"
  unset PG_ASSIGNMENTS
  # Empty environment: no PG* variable can add options. TEST_DB_NODE_OPTIONS
  # and CONNECT_LOG are hooks for tests/scripts/test-db-helper.test.ts.
  psql_admin() {
    env -i PATH="$PATH" HOME="$HOME" NODE_OPTIONS="${TEST_DB_NODE_OPTIONS:-} --import=$GUARD" ${CONNECT_LOG:+CONNECT_LOG=$CONNECT_LOG} \
      SQL="$1" PG_HOST="$PG_HOST" PG_PORT="$PG_PORT" PG_USER="$PG_USER" PG_PASS="$PG_PASS" node -e '
      const { Client } = require("pg")
      const e = process.env
      const c = new Client({ host: e.PG_HOST, port: Number(e.PG_PORT), user: e.PG_USER, password: e.PG_PASS, database: "postgres" })
      c.connect().then(() => c.query(e.SQL)).then(() => c.end(), (err) => { console.error(err.message); process.exit(1) })
    '
  }
else
  CONTAINER=${API_TEST_PG_CONTAINER:-zitrone-staging-pg}
  PG_HOST=127.0.0.1
  PG_USER=$(docker inspect "$CONTAINER" --format '{{range .Config.Env}}{{println .}}{{end}}' | sed -n 's/^POSTGRES_USER=//p')
  PG_PASS=$(docker inspect "$CONTAINER" --format '{{range .Config.Env}}{{println .}}{{end}}' | sed -n 's/^POSTGRES_PASSWORD=//p')
  PG_PORT=$(docker port "$CONTAINER" 5432/tcp | head -1 | sed 's/.*://')
  if [[ -z "$PG_USER" || ! "$PG_PORT" =~ '^[0-9]+$' ]]; then
    print -u2 "test-db: container $CONTAINER not found, not running or without a published 5432 port"
    exit 1
  fi
  PG_USERINFO=$(PG_USER="$PG_USER" PG_PASS="$PG_PASS" node -p 'encodeURIComponent(process.env.PG_USER) + ":" + encodeURIComponent(process.env.PG_PASS)') || exit 1
  psql_admin() { docker exec "$CONTAINER" psql -q -U "$PG_USER" -d postgres -c "$1" >/dev/null }
fi
