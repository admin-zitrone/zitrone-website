#!/bin/zsh
# Rehearses the home CMS migration (20261016_042603_home_cms_parity) and its
# rollback on a throwaway local database, crossing the previous release's code
# with the new code:
#
#   1. old code: migrate + seed               -> old schema, real content
#   2. new code reads the old schema           -> must FAIL: migrate before deploying
#   3. new code: migrate                       -> links copied, old columns kept
#   4. old code reads                          -> same links: code-only rollback
#                                                 works while header/footer are unedited
#   5. new code reads, saves header/footer     -> same links
#   6. old code reads                          -> must DIFFER: after edits the old
#                                                 columns are stale, so rollback
#                                                 needs migrate:down first
#   7. new code: migrate:down; old code reads, saves -> same links
#   8. new code: migrate again; new code reads -> same links (roll forward)
#
#   After the seed (docs/cms-home-rollout.md step 3), on the same database:
#   9. new code: payload:seed:home             -> baseline B (links, home content)
#  10. new code: edit ES + EN, export          -> edits visible; export = change capture
#  11. new code: migrate:down                  -> must succeed with the new icons;
#      old code reads home and header/footer, saves -> edits kept; EN service
#      links fall back to the ES path (one path per link in the old schema)
#  12. new code: migrate + seed:home           -> links and home content = baseline B;
#                                                 the edits survive only in the export
#
#   OLD_REF=255eec2 OUT=<dir> zsh scripts/rehearse-home-migration.sh
#
# "Same links" = the labelled links the site renders, per locale. Rewrites save
# English only: the old seed leaves Spanish navigation labels empty, so saving
# Spanish fails validation with either code (fixed in the new seed).
#
# Same isolation as test:api (scripts/lib/test-db.sh): local Docker Postgres
# or TEST_PG_URL, a database named *_api_test, empty environment, loopback-only
# network guard, no Blob token (new-code uploads go to a temporary
# PAYLOAD_MEDIA_DIR; the old code, which lacks it, writes inside its temporary
# worktree). The old code
# runs from a temporary detached worktree that shares this checkout's
# node_modules (same lockfile). Never touches the hosted database.
set -euo pipefail
cd "${0:A:h}/.."
source scripts/lib/test-db.sh

OLD_REF=${OLD_REF:-255eec2}
OUT=${OUT:-$(mktemp -d)}
DB=home_migration_api_test
NEW_DIR=$PWD
OLD_DIR=$(mktemp -d)/old
MEDIA_DIR=$(mktemp -d)
mkdir -p "$OUT"

cleanup() {
  psql_admin "DROP DATABASE IF EXISTS $DB WITH (FORCE)" || true
  git -C "$NEW_DIR" worktree remove --force "$OLD_DIR" 2>/dev/null || true
  rm -rf "$MEDIA_DIR"
}
trap cleanup EXIT

psql_admin "DROP DATABASE IF EXISTS $DB WITH (FORCE)"
psql_admin "CREATE DATABASE $DB"

git worktree add --detach --quiet "$OLD_DIR" "$OLD_REF"
ln -s "$NEW_DIR/node_modules" "$OLD_DIR/node_modules"
cp scripts/payload/probe-site-globals.ts "$OLD_DIR/scripts/payload/"

# run <old|new> <command...>: clean environment inside that code's checkout.
run() {
  local dir=$NEW_DIR
  [[ $1 == old ]] && dir=$OLD_DIR
  shift
  (cd "$dir" && env -i \
    PATH="$PATH" HOME="$HOME" TMPDIR="${TMPDIR:-/tmp}" LANG="${LANG:-en_US.UTF-8}" \
    NODE_OPTIONS="--import=$GUARD" \
    DATABASE_URL="postgres://$PG_USERINFO@$PG_HOST:$PG_PORT/$DB" \
    PAYLOAD_SECRET="rehearsal-secret-not-a-real-secret" \
    PAYLOAD_DISABLE_REVALIDATE=true \
    PAYLOAD_CONFIG_PATH=src/payload/payload.config.ts \
    PAYLOAD_MEDIA_DIR="$MEDIA_DIR" \
    "$@")
}
# read <old|new> <file>: shown links per locale into $OUT/<file>.
read_links() { run "$1" npx tsx scripts/payload/probe-site-globals.ts read "$OUT/$2" > "$OUT/${2%.json}.log" 2>&1 }
write_back() { run "$1" npx tsx scripts/payload/probe-site-globals.ts write > "$OUT/$2" 2>&1 }
# same <file>: the links the site shows equal step 1's, in both locales.
# same <file> [base]: shown links (and header CTA label) equal <base>'s.
same() {
  node -e '
    const [a, b] = process.argv.slice(1).map((f) => require(f))
    const counts = (d) => Object.entries(d).map(([l, v]) => `${l} ${Object.keys(v.shown).length} shown/${v.unlabeled} unlabeled`).join(", ")
    const ok = ["es", "en"].every((l) => JSON.stringify(a[l].shown) === JSON.stringify(b[l].shown) && a[l].ctaLabel === b[l].ctaLabel)
    const base = process.argv[1].split("/").pop()
    console.log(`  ${process.argv[2].split("/").pop()}: ${ok ? "same shown links as " + base : "DIFFERENT from " + base} (${counts(b)})`)
    process.exit(ok ? 0 : 1)
  ' "$OUT/${2:-1-old-schema.json}" "$OUT/$1"
}
# after_down <file>: the old schema has ONE path per link for both locales and
# migrate:down keeps the Spanish one. Labels and ES must equal step 10; an EN
# path may differ only by being that link's ES path (the localized service
# slugs, which next.config redirects to the EN slug).
after_down() {
  node -e '
    const [ed, b] = process.argv.slice(1).map((f) => require(f))
    let swapped = 0, bad = []
    for (const l of ["es", "en"]) {
      if (ed[l].ctaLabel !== b[l].ctaLabel) bad.push(`${l} CTA label`)
      const keys = new Set([...Object.keys(ed[l].shown), ...Object.keys(b[l].shown)])
      for (const k of keys) {
        if (ed[l].shown[k] === b[l].shown[k]) continue
        const label = (ed[l].shown[k] ?? "").split(" -> ")[0]
        const esPath = (ed.es.shown[k] ?? "").split(" -> ")[1]
        if (l === "en" && b.en.shown[k] === `${label} -> ${esPath}`) swapped++
        else bad.push(`${l} ${k}`)
      }
    }
    console.log(`  ${process.argv[2].split("/").pop()}: ${bad.length ? "DIFFERENT: " + bad.join(", ") : "labels, edits and ES links as step 10; " + swapped + " EN links now use the ES path"}`)
    process.exit(bad.length ? 1 : 0)
  ' "$OUT/10-edited.json" "$OUT/$1"
}
home() { run "$1" npx tsx scripts/payload/probe-site-globals.ts home "$OUT/$2" > "$OUT/${2%.json}.log" 2>&1 }
seed_home() { run new env PAYLOAD_SEED_SCOPE=home npx tsx scripts/payload/seed.ts > "$OUT/$1" 2>&1 }

print "1. old code ($OLD_REF): migrate + seed"
run old node node_modules/payload/bin.js migrate > "$OUT/1-migrate.log" 2>&1
# The old seed creates its client user with a random password that fails the
# password policy about half the time; create that user first so it skips it.
cat > "$OLD_DIR/scripts/payload/rehearsal-user.ts" <<'TS'
import { getPayload } from "payload"
import config from "@payload-config"
const payload = await getPayload({ config })
await payload.create({
  collection: "users",
  data: { email: "opina@zitrone.com.mx", name: "Zitrone", role: "admin", password: "Rehearsal-Only-1!" },
})
process.exit(0)
TS
run old npx tsx scripts/payload/rehearsal-user.ts > "$OUT/1-user.log" 2>&1
run old npx tsx scripts/payload/seed.ts > "$OUT/1-seed.log" 2>&1
read_links old 1-old-schema.json; same 1-old-schema.json

print "2. new code on the old schema (expected to fail)"
if read_links new 2-new-code-old-schema.json; then
  print -u2 "  unexpected: the new code read the old schema"; exit 1
fi
print "  failed as expected: $(grep -o 'probe read failed: .\{0,80\}' "$OUT/2-new-code-old-schema.log")"

print "3. new code: migrate"
run new node node_modules/payload/bin.js migrate > "$OUT/3-migrate.log" 2>&1

print "4. old code on the migrated schema, before any edit (code-only rollback)"
read_links old 4-old-code-migrated.json; same 4-old-code-migrated.json

print "5. new code reads and saves header/footer"
read_links new 5-new-code.json; same 5-new-code.json
write_back new 5-new-code-write.log

print "6. old code after that save (expected to differ)"
read_links old 6-old-code-after-edit.json
if same 6-old-code-after-edit.json; then
  print -u2 "  unexpected: old columns still match after a save with the new code"; exit 1
fi
print "  differs as expected: rollback after edits needs migrate:down"

print "7. new code: migrate:down; old code reads and saves"
run new node node_modules/payload/bin.js migrate:down > "$OUT/7-migrate-down.log" 2>&1
read_links old 7-old-code-after-down.json; same 7-old-code-after-down.json
write_back old 7-old-code-write.log

print "8. new code: migrate again; new code reads (roll forward)"
run new node node_modules/payload/bin.js migrate > "$OUT/8-migrate.log" 2>&1
read_links new 8-new-code.json; same 8-new-code.json

print "9. new code: seed:home"
seed_home 9-seed.log
read_links new 9-after-seed.json; same 9-after-seed.json 9-after-seed.json
home new 9-home.json

print "10. new code: edit ES + EN, export"
run new npx tsx scripts/payload/probe-site-globals.ts edit > "$OUT/10-edit.log" 2>&1
read_links new 10-edited.json
grep -q "rehearsal es" "$OUT/10-edited.json" && grep -q "rehearsal en" "$OUT/10-edited.json" \
  || { print -u2 "  edits not visible"; exit 1 }
run new npx tsx scripts/payload/probe-site-globals.ts export "$OUT/10-export.json" > "$OUT/10-export.log" 2>&1
print "  edits visible in ES and EN; export written"

print "11. new code: migrate:down after seed and edits; old code reads and saves"
run new node node_modules/payload/bin.js migrate:down > "$OUT/11-migrate-down.log" 2>&1
print "  migrate:down OK"
read_links old 11-old-code.json; after_down 11-old-code.json
home old 11-old-home.json
print "  old code reads home: $(grep -c '"icon": "spark"' "$OUT/11-old-home.json") feature icons now spark"
write_back old 11-old-code-write.log

print "12. new code: migrate + seed:home (roll forward)"
run new node node_modules/payload/bin.js migrate > "$OUT/12-migrate.log" 2>&1
seed_home 12-seed.log
read_links new 12-new-code.json; same 12-new-code.json 9-after-seed.json
home new 12-home.json
if cmp -s "$OUT/9-home.json" "$OUT/12-home.json"; then print "  home content = baseline B"
else print -u2 "  home content differs from baseline B"; diff "$OUT/9-home.json" "$OUT/12-home.json" | head -20 >&2; exit 1; fi
grep -q "rehearsal es" "$OUT/10-export.json" && grep -q "rehearsal en" "$OUT/10-export.json" \
  && print "  ES/EN edits recoverable from 10-export.json"

print "OK. Evidence in $OUT"
