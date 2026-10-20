#!/bin/zsh
# Backup/restore drill with synthetic data only (docs/operacion-y-entrega.md).
# Creates a source database, migrates and seeds it, takes a pg_dump custom
# backup, restores it into a second empty database and compares row counts.
# Both databases are local *_api_test databases and are dropped at the end.
#   zsh scripts/backup-restore-drill.sh [output-dir]
set -euo pipefail

CONTAINER=${API_TEST_PG_CONTAINER:-zitrone-staging-pg}
OUT=${1:-${TMPDIR:-/tmp}}
SRC=drill_src_api_test
DST=drill_dst_api_test
PG_USER=$(docker inspect "$CONTAINER" --format '{{range .Config.Env}}{{println .}}{{end}}' | sed -n 's/^POSTGRES_USER=//p')
PG_PASS=$(docker inspect "$CONTAINER" --format '{{range .Config.Env}}{{println .}}{{end}}' | sed -n 's/^POSTGRES_PASSWORD=//p')
PG_PORT=$(docker port "$CONTAINER" 5432/tcp | head -1 | sed 's/.*://')
url() { print "postgres://$PG_USER:$PG_PASS@127.0.0.1:$PG_PORT/$1" }
admin() { docker exec "$CONTAINER" psql -q -U "$PG_USER" -d postgres -c "$1" >/dev/null }

for db in $SRC $DST; do admin "DROP DATABASE IF EXISTS $db WITH (FORCE)"; done
trap 'for db in '"$SRC $DST"'; do admin "DROP DATABASE IF EXISTS $db WITH (FORCE)"; done' EXIT
admin "CREATE DATABASE $SRC"
admin "CREATE DATABASE $DST"

# Same isolation as the API suites: empty environment (no provider
# credentials inherited) and the loopback-only network guard in every Node
# process. File URL because NODE_OPTIONS splits on the space in this path.
GUARD=$(node -p 'require("node:url").pathToFileURL("tests/api/network-guard.mjs").href')
isolated() {
  local db=$1; shift
  env -i PATH="$PATH" HOME="$HOME" TMPDIR="${TMPDIR:-/tmp}" NODE_ENV=test \
    NODE_OPTIONS="--import=$GUARD" DATABASE_URL="$(url $db)" \
    PAYLOAD_SECRET=drill-secret-not-real PAYLOAD_DISABLE_REVALIDATE=true \
    PAYLOAD_CONFIG_PATH=src/payload/payload.config.ts "$@"
}
isolated $SRC node node_modules/payload/bin.js migrate >/dev/null
before=$(isolated $SRC npx tsx scripts/backup-restore-drill.ts seed 2>/dev/null | grep '^COUNTS')
print "source  $before"

stamp=$(date +%Y%m%d-%H%M%S)
docker exec "$CONTAINER" pg_dump -U "$PG_USER" -d $SRC -Fc -f /tmp/drill.dump
docker cp "$CONTAINER":/tmp/drill.dump "$OUT/drill-$stamp.dump"
print "backup  $OUT/drill-$stamp.dump ($(du -h "$OUT/drill-$stamp.dump" | cut -f1)) pg_dump $(docker exec "$CONTAINER" pg_dump --version | awk '{print $3}')"

docker exec "$CONTAINER" pg_restore -U "$PG_USER" -d $DST --no-owner /tmp/drill.dump
after=$(isolated $DST npx tsx scripts/backup-restore-drill.ts count 2>/dev/null | grep '^COUNTS')
print "restore $after"
docker exec "$CONTAINER" rm -f /tmp/drill.dump

[[ "${before#COUNTS }" == "${after#COUNTS }" ]] && print "RESULT match" || { print "RESULT mismatch"; exit 1 }
