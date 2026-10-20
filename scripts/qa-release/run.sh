#!/bin/zsh
# Isolated QA of the release candidate (docs/plan-qa-aislado-2026-10-18.md).
#
#   QA_SHA=<40-hex> zsh scripts/qa-release/run.sh init          -> prints QA_RUN=<dir>
#   QA_RUN=<dir> zsh scripts/qa-release/run.sh <step>
#
# Steps, in order. [P] reads production (needs QA_PROD_READ_AUTHORIZED=<run id>),
# [W] reads the published site or its public Blob files (GET/HEAD only).
#   init          clean detached checkouts of QA_SHA (x2) and OLD_REF, npm ci --offline
#   catalog   [P] server version, catalog; validate against inventory + snapshot
#   extract   [P] schema dump of public; data dump of the validated tables only
#   restore       own Postgres container (tmpfs); phased restore; remap; checks; free-text scan
#   states        rollout steps 3-5 on copies: orig -> mig, plus rb (rollback). No seed:
#                 the home stays in the code files (the default without
#                 HOME_CONTENT_SOURCE=cms; the runner does not set it), so
#                 the published state is "migrated, not seeded"
#   mirror    [W] Blob host from the copy's media library; mirror of the media the copy uses
#   build         next build of the candidate (mig)
#   serve         next start: mig on :3105
#   compare   [W] deployment check; sitemap; approved vs mig
#   sweep         visual-sweep + motion-check (candidate), motion-check [W] (approved)
#   integrations  lead, CMS hooks, media, GTM; network summary
#   evidence      exports the sanitized reports (a fixed list) to QA_EVIDENCE_DIR,
#                 with the verdict; allowed after a failure, to keep the diagnosis
#   (pause)       the user classifies every PENDING check from the private
#                 captures; the decisions go to work/classification.md (no
#                 content: check, page, width, category, decision)
#   cleanup       stops and deletes only what this run created (needs evidence
#                 exported after a classification that names every PENDING
#                 check, or QA_DISCARD=<run id>)
#
# Every automatic criterion is recorded in $QA_RUN/status.tsv (PASS, FAIL,
# PENDING = needs the user's classification, INFO, SKIPPED) by criteria.mjs
# or need(); a FAIL stops the step. The verdict is never "approved" while a
# check FAILs, is missing, or is PENDING.
#
# Directories: private/ holds the source copy and everything raw (catalog,
# dumps, CMS captures, link and home exports, screenshots, logs) and never
# leaves the run; work/ holds the sanitized reports, the only files evidence
# can export.
# Dry run without production: `dryrun-source` after init builds a stand-in
# source database inside the QA container; then catalog/extract read it.
#
# Isolation: every QA process starts from `env -i` with only the variables in
# qa() below, inside a checkout without .env files, under egress-guard.mjs
# (loopback only; Blob answered from the mirror). Only prod-read.mjs sees the
# source credential. The runner must be the committed one: init refuses if this
# file differs from the candidate's copy.
set -euo pipefail
setopt null_glob
exec 3>&1   # record() reports here even when a step's output is redirected

HERE=${0:A:h}
STEP=${1:-}
die() { print -u2 "qa-release: $*"; exit 1 }
say() { print "== $*" }

APPROVED=${QA_APPROVED_BASE:-https://www.zitrone.mx}
APPROVED_DPL=${QA_APPROVED_DEPLOYMENT:-dpl_C4cjcDJvz9UEwqs8z1n4pSM3hJv3}
SOURCE_ENV=${QA_SOURCE_ENV_FILE:-${HERE:h:h:h}/Zitrone Website/.env.production-cms}
# The only files `evidence` exports (from work/), and only if present.
EXPORT=(validation.md restore.md free-text.md states-report.md states-links.md mirror-report.md
  approved-deployment.txt pages-approved.txt pages-candidate.txt pages-diff.txt
  visual-approved-vs-mig.json visual-dry-self.json
  sweep-results.json motion-approved.json motion-candidate.json motion-diff.txt integrations.md network.md
  classification.md)

load() {
  [[ -n ${QA_RUN:-} && -f $QA_RUN/state.env ]] || die "QA_RUN must be a run directory created by init"
  source $QA_RUN/state.env
  CAND=$QA_RUN/wt/cand-seed   # the candidate's scripts; cand-mig is the one built and served
  P=$QA_RUN/private W=$QA_RUN/work
  GUARD_URL=$(node -p 'require("node:url").pathToFileURL(process.argv[1]).href' $CAND/scripts/qa-release/egress-guard.mjs)
}
setstate() { print -r -- "$1=${(q)2}" >> $QA_RUN/state.env; typeset -g "$1=$2" }
created() { print -r -- "$*" >> $QA_RUN/created }
dbname() { print "qa_${RUN_TAG}_$1_api_test" }
db_url() { print "postgres://qa:$PG_PASS@127.0.0.1:$PG_PORT/$(dbname $1)" }
# record <check> <PASS|FAIL|PENDING|INFO|SKIPPED> <detail>
record() { print -r -- "$1	$2	${3//$'\t'/ }" >> $QA_RUN/status.tsv; print -r -- "  [$2] $1: $3" >&3 }
# need <check> <command...>: PASS if it succeeds; otherwise FAIL and stop.
need() {
  local check=$1; shift
  if "$@"; then record $check PASS "ok"; else record $check FAIL "falló: ${*[1,3]}"; die "$check failed"; fi
}
criteria() { node $CAND/scripts/qa-release/criteria.mjs "$1" $QA_RUN "${@:2}" || die "criteria $1: FAIL (status.tsv)" }
authorized() { [[ ${QA_PROD_READ_AUTHORIZED:-} == $RUN_ID ]] || die "production read not authorized for $RUN_ID (QA_PROD_READ_AUTHORIZED)" }

# Explicit guard for every database URL handed to a QA process: this run's
# container port on 127.0.0.1, one of this run's database names, no options.
assert_db_url() {
  QA_URL=$1 PORT=$PG_PORT TAG=$RUN_TAG node -e '
    const u = new URL(process.env.QA_URL), e = process.env
    const ok = u.protocol === "postgres:" && u.hostname === "127.0.0.1" && u.port === e.PORT && !u.search
      && new RegExp(`^/qa_${e.TAG}_(orig|mig|seed|rb|source)_api_test$`).test(u.pathname)
    if (!ok) { console.error("qa-release: refusing database URL " + u.pathname); process.exit(1) }'
}

# qa [+VAR=value...] <state> <checkout> <log-name> <command...>: a QA process,
# with optional extra variables.
qa() {
  local -a extra
  while [[ $1 == +* ]]; do extra+=("${1#+}"); shift; done
  local state=$1 dir=$2 log=$3; shift 3
  local url=$(db_url $state)
  assert_db_url $url
  mkdir -p $QA_RUN/media-$state
  (cd $dir && exec env -i \
    PATH="$PATH" HOME="$QA_RUN/home" TMPDIR="$QA_TMP" LANG=en_US.UTF-8 \
    NODE_OPTIONS="--import=$GUARD_URL" QA_EGRESS_LOG="$QA_RUN/egress/$log.jsonl" \
    QA_BLOB_HOST="${BLOB_HOST:-}" QA_BLOB_MIRROR="$QA_RUN/mirror" \
    DATABASE_URL="$url" PAYLOAD_SECRET="$PAYLOAD_SECRET_QA" \
    PAYLOAD_CONFIG_PATH=src/payload/payload.config.ts PAYLOAD_MEDIA_DIR="$QA_RUN/media-$state" \
    PAYLOAD_DISABLE_REVALIDATE=true NODE_ENV=production \
    NEXT_PUBLIC_SITE_URL=https://www.zitrone.mx NEXT_TELEMETRY_DISABLED=1 \
    npm_config_update_notifier=false npm_config_offline=true \
    "${extra[@]}" "$@")
}
# browser <log-name> <command...>: Playwright scripts. Real HOME only for the
# browser binaries; network decided by browser-policy.mjs.
browser() {
  local log=$1; shift
  (cd $CAND && exec env -i PATH="$PATH" HOME="$HOME" TMPDIR="$QA_TMP" LANG=en_US.UTF-8 \
    QA_BROWSER_LOG="$QA_RUN/egress/browser-$log.jsonl" QA_BLOB_HOST="${BLOB_HOST:-}" QA_BLOB_MIRROR="$QA_RUN/mirror" \
    QA_LOCAL_MUTATIONS="${QA_LOCAL_MUTATIONS:-}" "$@")
}
plain() { sed $'s/\e\\[[0-9;]*m//g' $1 }   # migrate:status colors its table
# Rows of the migrate:status table whose Ran column is $2 (Yes or No); log lines do not count.
ran() { plain $1 | grep -c " $2 │" || true }
psql_local() { docker exec -i $PG_CONTAINER psql -X -q -v ON_ERROR_STOP=1 -U qa -d ${2:-postgres} -c "$1" }
psql_value() { docker exec -i $PG_CONTAINER psql -X -At -v ON_ERROR_STOP=1 -U qa -d $2 -c "$1" }
createdb() {
  [[ -z $(psql_value "SELECT 1 FROM pg_database WHERE datname = '$(dbname $1)'" postgres) ]] || die "database $(dbname $1) already exists"
  psql_local "CREATE DATABASE $(dbname $1)${2:+ TEMPLATE $(dbname $2)}"
}
clean_checkout() {
  local dir=$1
  [[ -z $(git -C $dir status --porcelain --ignored) ]] || die "$dir is not a clean checkout"
  local envs=($dir/.env*(N:t))
  [[ ${envs[*]} == .env.example || -z ${envs[*]} ]] || die "$dir has env files: ${envs[*]}"
  [[ ! -e $dir/.next ]] || die "$dir has a previous build"
}

case $STEP in
init)
  [[ ${QA_SHA:-} =~ '^[0-9a-f]{40}$' ]] || die "QA_SHA must be a full commit SHA"
  OLD_REF=${OLD_REF:-255eec2}
  [[ $(node -v) == v24.* ]] || die "Node 24 required ($(node -v))"
  docker info >/dev/null 2>&1 || die "Docker is not running"
  REPO=$(git -C $HERE rev-parse --show-toplevel)
  git -C $REPO cat-file -e "$QA_SHA^{commit}" || die "unknown commit $QA_SHA"
  RUN_ID=$(date +%Y%m%d-%H%M)-$(openssl rand -hex 2)
  ROOT=${QA_RUN_ROOT:-${TMPDIR:-/tmp}/zitrone-qa}
  mkdir -p -m 700 $ROOT
  QA_RUN=$ROOT/$RUN_ID
  mkdir -m 700 $QA_RUN || die "$QA_RUN exists"
  (cd $QA_RUN && mkdir -m 700 private work logs egress home wt)
  : > $QA_RUN/created; : > $QA_RUN/state.env; chmod 600 $QA_RUN/state.env
  setstate RUN_ID $RUN_ID; setstate RUN_TAG ${RUN_ID//-/_}; setstate REPO $REPO
  setstate CAND_SHA $QA_SHA; setstate OLD_SHA $(git -C $REPO rev-parse "$OLD_REF^{commit}")
  setstate PAYLOAD_SECRET_QA $(openssl rand -hex 32)
  created "dir $QA_RUN"
  # Short on purpose: tsx and Next create unix sockets under TMPDIR (104-byte limit).
  setstate QA_TMP ${QA_TMP_ROOT:-/tmp}/zqa-$RUN_ID
  mkdir -m 700 $QA_TMP || die "$QA_TMP exists"
  created "tmp $QA_TMP"
  for name ref in cand-mig $CAND_SHA cand-seed $CAND_SHA old $OLD_SHA; do
    git -C $REPO worktree add --detach --quiet $QA_RUN/wt/$name $ref
    created "worktree $QA_RUN/wt/$name"
    clean_checkout $QA_RUN/wt/$name
    [[ $(git -C $QA_RUN/wt/$name rev-parse HEAD) == $ref ]] || die "$name is not at $ref"
  done
  cmp -s ${0:A} $QA_RUN/wt/cand-seed/scripts/qa-release/run.sh || die "this runner differs from the one committed at $CAND_SHA"
  for name in cand-mig cand-seed old; do
    say "npm ci --offline ($name)"
    (cd $QA_RUN/wt/$name && env -i PATH="$PATH" HOME="$HOME" npm_config_offline=true npm_config_update_notifier=false \
      npm ci --no-audit --no-fund > $QA_RUN/logs/npm-ci-$name.log 2>&1) || die "npm ci --offline failed for $name (see logs); the cache lacks a package"
  done
  cp $QA_RUN/wt/cand-seed/scripts/payload/probe-site-globals.ts $QA_RUN/wt/old/scripts/payload/
  print "QA_RUN=$QA_RUN"
  ;;

pg-up)
  load
  [[ -n ${PG_MAJOR:-} ]] || die "run catalog (or dryrun-source) first"
  [[ -z ${PG_CONTAINER:-} ]] || die "container already created"
  setstate PG_CONTAINER zitrone-qa-$RUN_ID
  setstate PG_PASS $(openssl rand -hex 24)
  POSTGRES_PASSWORD=$PG_PASS docker run -d --name $PG_CONTAINER -e POSTGRES_USER=qa -e POSTGRES_PASSWORD \
    -p 127.0.0.1::5432 --tmpfs /var/lib/postgresql/data postgres:$PG_MAJOR-alpine > /dev/null
  created "container $PG_CONTAINER"
  until docker exec $PG_CONTAINER pg_isready -U qa -q 2>/dev/null; do sleep 1; done
  sleep 2
  setstate PG_PORT $(docker port $PG_CONTAINER 5432/tcp | head -1 | sed 's/.*://')
  say "postgres $PG_MAJOR on 127.0.0.1:$PG_PORT ($PG_CONTAINER, tmpfs)"
  ;;

dryrun-source)
  # Stand-in for production, local only: the previous release's code migrates
  # and seeds it, then fake leads/users are added to prove they are not copied.
  load
  [[ -z ${PG_MAJOR:-} ]] && setstate PG_MAJOR 16
  [[ -n ${PG_CONTAINER:-} ]] || QA_RUN=$QA_RUN zsh ${0:A} pg-up
  source $QA_RUN/state.env
  createdb source
  OLD=$QA_RUN/wt/old
  qa source $OLD dry-migrate node node_modules/payload/bin.js migrate > $QA_RUN/logs/dry-migrate.log 2>&1
  # As in scripts/rehearse-home-migration.sh: the old seed's own user creation
  # fails the password policy about half the time, so create it first.
  cat > $OLD/scripts/payload/qa-dry-user.ts <<'TS'
import { getPayload } from "payload"
import config from "@payload-config"
const payload = await getPayload({ config })
await payload.create({ collection: "users", data: { email: "opina@zitrone.com.mx", name: "Zitrone", role: "admin", password: "Dry-Run-Only-1!" } })
process.exit(0)
TS
  qa source $OLD dry-user node_modules/.bin/tsx scripts/payload/qa-dry-user.ts > $QA_RUN/logs/dry-user.log 2>&1
  qa source $OLD dry-seed node_modules/.bin/tsx scripts/payload/seed.ts > $QA_RUN/logs/dry-seed.log 2>&1
  # The old seed stores the English slug in both locales; production's Spanish
  # slugs were set after the slug-localization migration. Same pairs as
  # scripts/visual-sweep.mjs.
  psql_local "UPDATE blog_posts_locales l SET slug = m.es FROM (VALUES
      ('workplace-food-program-that-works', 'como-construir-un-programa-de-alimentacion-corporativa'),
      ('afternoon-slump-office-pantry', 'caida-de-las-3pm-pantry-de-oficina'),
      ('office-food-employee-retention', 'comida-en-la-oficina-y-retencion-de-talento')) AS m(en, es)
    WHERE l._locale = 'es' AND l.slug = m.en" $(dbname source)
  psql_local "INSERT INTO contact_requests (name, email) SELECT 'Dry Run ' || g, 'lead' || g || '@example.invalid' FROM generate_series(1, 3) g" $(dbname source)
  print "DATABASE_URL=postgres://qa:$PG_PASS@127.0.0.1:5432/$(dbname source)?sslmode=disable" > $QA_RUN/private/dryrun-source.env
  chmod 600 $QA_RUN/private/dryrun-source.env
  setstate DRY_RUN 1
  say "stand-in source ready; run catalog/extract with QA_SOURCE_ENV_FILE=$QA_RUN/private/dryrun-source.env QA_SOURCE_DOCKER_NETWORK=container:$PG_CONTAINER"
  ;;

catalog)
  load; authorized
  # Any earlier approval dies first: a failed repeat must not leave one (R12).
  rm -f $P/catalog.ok $P/catalog.json $W/data-tables.txt $W/remap.json
  num=$(QA_SOURCE_ENV_FILE=$SOURCE_ENV node $CAND/scripts/qa-release/prod-read.mjs version $RUN_ID) || { record catalog FAIL "versión no leída"; die "catalog: version" }
  [[ -n ${PG_MAJOR:-} ]] || setstate PG_MAJOR $(( num / 10000 ))
  QA_SOURCE_ENV_FILE=$SOURCE_ENV node $CAND/scripts/qa-release/prod-read.mjs catalog $RUN_ID $P/catalog.json || { record catalog FAIL "catálogo no leído"; die "catalog: read" }
  if node $CAND/scripts/qa-release/validate-catalog.mjs $P/catalog.json $W $CAND/src/migrations; then
    node $CAND/scripts/qa-release/gate.mjs approve $QA_RUN $RUN_ID $CAND_SHA
    record catalog PASS "coincide con el inventario y el snapshot"
  else
    record catalog FAIL "no coincide (validation.md); extract bloqueado"
    die "catalog rejected; extract stays blocked"
  fi
  ;;

extract)
  load; authorized
  FP=$(node $CAND/scripts/qa-release/gate.mjs check $QA_RUN $RUN_ID $CAND_SHA) || die "extract refused: no valid catalog approval for this run"
  QA_SOURCE_FINGERPRINT=$FP QA_SOURCE_ENV_FILE=$SOURCE_ENV node $CAND/scripts/qa-release/prod-read.mjs dump $RUN_ID $P $W/data-tables.txt $PG_MAJOR
  ls -l $P/*.dump | awk '{print "  " $5 " bytes " $NF}'
  record extract PASS "volcado de las tablas aprobadas"
  ;;

restore)
  load
  [[ -s $P/data.dump ]] || die "extract first"
  node $CAND/scripts/qa-release/gate.mjs check $QA_RUN $RUN_ID $CAND_SHA > /dev/null || die "restore refused: catalog approval changed"
  [[ -n ${PG_CONTAINER:-} ]] || { QA_RUN=$QA_RUN zsh ${0:A} pg-up; source $QA_RUN/state.env }
  createdb orig
  DB=$(dbname orig)
  restore() { docker exec -i $PG_CONTAINER pg_restore --exit-on-error --no-owner --no-privileges -U qa -d $DB "$@" }
  say "1/4 structure without constraints (pre-data)"
  psql_local "DROP SCHEMA public CASCADE" $DB   # the dump recreates it
  restore --section=pre-data < $QA_RUN/private/schema.dump
  say "2/4 data of the validated tables, one transaction"
  restore --data-only --single-transaction < $QA_RUN/private/data.dump
  say "3/4 remap references to users onto synthetic users"
  SQL=$(node -e '
    const r = require(process.argv[1])
    if (!r.length) process.exit(0)
    const ids = r.flatMap(({ table, columns }) => columns.map((c) => `SELECT "${c}" AS id FROM public."${table}"`)).join(" UNION ")
    console.log(`INSERT INTO public.users (id, email, name, role) SELECT id, $$qa-user-$$ || id || $$@example.invalid$$, $$QA synthetic$$, $$editor$$ FROM (${ids}) s WHERE id IS NOT NULL`)
  ' $W/remap.json)
  [[ -n $SQL ]] && psql_local "$SQL" $DB
  say "4/4 constraints and indexes (post-data), one transaction: any violation is fatal"
  restore --section=post-data --single-transaction < $QA_RUN/private/schema.dump
  # Local only: align every serial sequence with its table.
  psql_local "DO \$\$ DECLARE r record; BEGIN
    FOR r IN SELECT s.relname seq, t.relname tbl, a.attname col FROM pg_depend d
      JOIN pg_class s ON s.oid = d.objid AND s.relkind = 'S' JOIN pg_class t ON t.oid = d.refobjid
      JOIN pg_attribute a ON a.attrelid = t.oid AND a.attnum = d.refobjsubid LOOP
      EXECUTE format('SELECT setval(%L, COALESCE((SELECT max(%I) FROM public.%I), 0) + 1, false)', 'public.' || r.seq, r.col, r.tbl);
    END LOOP; END \$\$" $DB
  say "checks: counts against the catalog; schema-only tables empty"
  docker exec -i $PG_CONTAINER psql -X -At -U qa -d $DB -c "SELECT json_object_agg(relname, (xpath('/row/n/text()', query_to_xml(format('SELECT count(*) AS n FROM public.%I', relname), false, true, '')))[1]::text::bigint) FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace WHERE n.nspname = 'public' AND c.relkind = 'r'" > $QA_RUN/private/restored-counts.json
  need restore:counts node -e '
    const [cat, got, inv, remap] = process.argv.slice(1, 5).map((f) => require(f))
    const bad = []
    const synthetic = remap.length ? "users" : null
    for (const [t, info] of Object.entries(cat.tables)) {
      if (info.rows !== null && got[t] !== info.rows) bad.push(`${t}: ${got[t]} rows, source ${info.rows}`)
      if (info.rows === null && got[t] !== 0 && t !== synthetic) bad.push(`${t}: schema-only table has ${got[t]} rows`)
    }
    const lines = [`# Restauración: ${Object.keys(got).length} tablas`, "", bad.length ? `## DETENIDO\n\n${bad.map((b) => `- ${b}`).join("\n")}` : "Conteos iguales a la fuente; tablas de solo estructura vacías" + (synthetic ? `; users = ${got.users} sintéticos` : "") + ".", ""]
    require("node:fs").writeFileSync(process.argv[5], lines.join("\n"))
    console.log(lines.join("\n")); process.exit(bad.length ? 1 : 0)
  ' $QA_RUN/private/catalog.json $QA_RUN/private/restored-counts.json $CAND/scripts/qa-release/inventory.json $W/remap.json $W/restore.md
  say "free-text scan"
  need restore:free-text qa orig $CAND scan node scripts/qa-release/scan-free-text.mjs $W/data-tables.txt $W/free-text.md
  ;;

states)
  load
  OLD=$QA_RUN/wt/old
  E=$P/states; mkdir -p -m 700 $E   # CMS captures and exports: private (R14)
  probe() { qa $1 $2 $3 node_modules/.bin/tsx scripts/payload/probe-site-globals.ts "${@:4}" > $QA_RUN/logs/$3.log 2>&1 }
  say "step 3 on orig: migration status (new code)"
  need states:status-before qa orig $CAND status-orig node node_modules/payload/bin.js migrate:status > $E/3-status-orig.txt 2>&1
  say "step 4 on orig: capture (the procedure now says: published code)"
  if probe orig $CAND capture-new export $E/4-capture-new-code.json; then record states:capture-new-code INFO "la captura con el código nuevo funcionó sobre el esquema anterior"
  else record states:capture-new-code INFO "la captura con el código nuevo falla sobre el esquema anterior, como indica el procedimiento"; fi
  need states:capture probe orig $OLD capture-old export $E/4-capture-old-code.json
  say "baseline: production code on orig"
  need states:baseline-links probe orig $OLD b0-old-read read $E/b0-old-links.json
  need states:baseline-home probe orig $OLD b0-old-home home $E/b0-old-home.json
  say "step 5: migrate (copy mig)"
  createdb mig orig
  need states:migrate qa mig $CAND migrate-mig node node_modules/payload/bin.js migrate > $E/5-migrate.log 2>&1
  need states:status-after qa mig $CAND status-mig node node_modules/payload/bin.js migrate:status > $E/5-status-after.txt 2>&1
  (( $(ran $E/5-status-after.txt No) == 0 && $(ran $E/5-status-after.txt Yes) > 0 )) \
    || { record states:all-migrated FAIL "quedan migraciones sin aplicar, o el estado no se pudo leer"; die "pending migrations after migrate" }
  record states:all-migrated PASS "todas aplicadas"
  need states:old-code-migrated probe mig $OLD b5-old-read read $E/b5-old-code-migrated.json
  need states:new-code-migrated probe mig $CAND b5-new-read read $E/b5-new-code-migrated.json
  print -rn -- "Qa-$(openssl rand -hex 16)-x9!" > $P/admin-password   # meets Payload's password policy
  chmod 600 $P/admin-password
  need states:admin qa +QA_ADMIN_PASSWORD_FILE=$P/admin-password mig $CAND admin node_modules/.bin/tsx scripts/qa-release/payload-task.ts admin > $QA_RUN/logs/admin.log 2>&1
  need states:migrated-home probe mig $CAND b5-new-home home $E/b5-new-home.json
  say "step 6 (seed:home) is not applied: the home stays in the code files"
  say "rollback on a third copy (rb): migrate:down, old code, migrate again"
  createdb rb mig
  need states:rb-migrate-down qa rb $CAND rb-down node node_modules/payload/bin.js migrate:down > $E/rb2-migrate-down.log 2>&1
  need states:rb-old-after-down probe rb $OLD rb3-old-read read $E/rb3-old-code-after-down.json
  need states:rb-old-home probe rb $OLD rb3-old-home home $E/rb3-old-home.json
  need states:rb-migrate qa rb $CAND rb-up node node_modules/payload/bin.js migrate > $E/rb4-migrate.log 2>&1
  need states:rb-new-home probe rb $CAND rb4-new-home home $E/rb4-new-home.json
  criteria states $E/b5-new-home.json $E/rb4-new-home.json
  node $CAND/scripts/qa-release/compare-states.mjs $E $QA_RUN || die "links changed by migration alone (private/states/summary.md)"
  # Sanitized: counts and hashes only; the content stays in private/states.
  { print "# Estados de la copia ($RUN_ID)"; print
    print -r -- "- Migraciones antes: $(ran $E/3-status-orig.txt Yes) aplicadas, $(ran $E/3-status-orig.txt No) pendientes; después: $(ran $E/5-status-after.txt Yes) aplicadas, $(ran $E/5-status-after.txt No) pendientes"
    print -r -- "- Sin seed: la home se sirve desde los archivos del código (por defecto, sin HOME_CONTENT_SOURCE)"
    print; print "SHA-256 de las exportaciones privadas (contenido en private/states, no exportado):"; print
    for f in $E/*.json; do print -r -- "- ${f:t}: $(shasum -a 256 $f | cut -c1-16)"; done } > $W/states-report.md
  ;;

mirror)
  load
  [[ ${DRY_RUN:-} == 1 ]] && { record mirror:complete SKIPPED "ensayo: no se lee el sitio publicado"; exit 0 }
  # The Blob store comes from the copy's media library: since the home renders
  # from the code files, the published HTML has no Blob URL (QA run 2, 19 Oct).
  host=$(psql_value "SELECT DISTINCT substring(url from '^https://([a-z0-9]+[.]public[.]blob[.]vercel-storage[.]com)/') FROM media WHERE url LIKE 'https://%'" $(dbname mig)) \
    || { record mirror:complete FAIL "no se pudo leer la biblioteca de medios de la copia"; die "mirror: media query failed" }
  [[ $(print -l $host | grep -c .) -eq 1 && -n $host ]] || { record mirror:complete FAIL "se esperaba un store de Blob en la copia: ${host:-ninguno}"; die "expected one Blob store in the copy's media, got: ${host:-none}" }
  setstate BLOB_HOST $host
  # Unguarded on purpose: the one process that reads Blob (GET, no token).
  (cd $CAND && env -i PATH="$PATH" HOME="$QA_RUN/home" QA_BLOB_HOST=$BLOB_HOST DATABASE_URL=$(db_url mig) \
    node scripts/qa-release/mirror-media.mjs $QA_RUN/mirror $QA_RUN/media-mirror)
  created "dir $QA_RUN/mirror"
  cp -Rn $QA_RUN/media-mirror/. $QA_RUN/media-mig/ 2>/dev/null || true
  print -r -- "# Espejo de Blob: $(grep -c ' required ' $QA_RUN/mirror/missing.txt || true) archivo(s) que usa el sitio no encontrados; $(grep -c ' size ' $QA_RUN/mirror/missing.txt || true) variante(s) de tamaño no encontradas (solo miniaturas del admin)" > $W/mirror-report.md
  criteria mirror $QA_RUN/mirror/manifest.json
  ;;

build)
  load
  for state in mig; do
    say "build $state"
    qa $state $QA_RUN/wt/cand-$state build-$state npm run build > $QA_RUN/logs/build-$state.log 2>&1 || { record build FAIL "$state no compila"; die "build $state failed (logs/build-$state.log)" }
    [[ -z $(git -C $QA_RUN/wt/cand-$state status --porcelain) ]] || { record build FAIL "$state cambió archivos versionados"; die "build $state changed tracked files" }
  done
  record build PASS "el candidato compila sin cambiar archivos versionados"
  ;;

serve)
  load
  for state port in mig 3105; do
    lsof -nP -iTCP:$port -sTCP:LISTEN >/dev/null 2>&1 && die "port $port is busy"
    qa +APP_ALLOWED_ORIGINS=http://127.0.0.1:$port $state $QA_RUN/wt/cand-$state serve-$state \
      node_modules/.bin/next start -H 127.0.0.1 -p $port > $QA_RUN/logs/serve-$state.log 2>&1 &
    created "pid $! $port"
    for i in {1..90}; do curl -fsS -o /dev/null --max-time 2 http://127.0.0.1:$port/es 2>/dev/null && break; sleep 1; done
    curl -fsS -o /dev/null --max-time 5 http://127.0.0.1:$port/es || { record serve FAIL "$state no arranca"; die "$state did not start on :$port" }
    say "$state on http://127.0.0.1:$port"
  done
  record serve PASS "el candidato responde en :3105"
  ;;

compare)
  load
  if [[ ${DRY_RUN:-} == 1 ]]; then
    for c in sitemap:approved visual:approved-vs-mig:errors; do record $c SKIPPED "ensayo: no se lee el sitio publicado"; done
    say "visual dry-self (local only: exercises visual-compare and the browser policy)"
    browser compare-dry-self env BASE_A=http://127.0.0.1:3105 BASE_B=http://127.0.0.1:3105 PAGES=${QA_DRY_PAGES:-/es,/en,/es/contact,/en/blog} OUT=$P/visual-dry-self \
      node scripts/visual-compare.mjs > $QA_RUN/logs/visual-dry-self.log 2>&1 || { record visual:dry-self:errors FAIL "visual-compare falló"; die "visual-compare failed" }
    cp $P/visual-dry-self/visual.json $W/visual-dry-self.json
    criteria visual dry-self $W/visual-dry-self.json
    exit 0
  fi
  say "approved deployment (Vercel metadata, read only)"
  vercel inspect ${APPROVED#https://} --scope zitrone > $W/approved-deployment.txt 2>&1 || { record approved-deployment FAIL "vercel inspect falló"; die "vercel inspect failed" }
  grep -q $APPROVED_DPL $W/approved-deployment.txt || { record approved-deployment FAIL "producción ya no sirve $APPROVED_DPL"; die "production no longer serves $APPROVED_DPL" }
  record approved-deployment PASS $APPROVED_DPL
  curl -fsS --max-time 30 -A zitrone-qa "$APPROVED/sitemap.xml" | grep -oE '<loc>[^<]+' | sed -E 's#<loc>https?://[^/]+##' | sort > $W/pages-approved.txt
  curl -fsS --max-time 30 http://127.0.0.1:3105/sitemap.xml | grep -oE '<loc>[^<]+' | sed -E 's#<loc>https?://[^/]+##' | sort > $W/pages-candidate.txt
  diff $W/pages-approved.txt $W/pages-candidate.txt > $W/pages-diff.txt || true
  criteria sitemap $W/pages-diff.txt $W/pages-approved.txt
  PAGES=$(paste -sd, $W/pages-approved.txt)
  for name a b in approved-vs-mig $APPROVED http://127.0.0.1:3105; do
    say "visual $name"
    # Screenshots stay in private/; only the numbers go to work/ (R14).
    browser compare-$name env BASE_A=$a BASE_B=$b PAGES=$PAGES OUT=$P/visual-$name node scripts/visual-compare.mjs > $QA_RUN/logs/visual-$name.log 2>&1 \
      || { record visual:$name:errors FAIL "visual-compare falló"; die "visual-compare $name failed" }
    cp $P/visual-$name/visual.json $W/visual-$name.json
    criteria visual $name $W/visual-$name.json
  done
  ;;

sweep)
  load
  browser sweep env BASE=http://127.0.0.1:3105 OUT=$P/sweep node scripts/visual-sweep.mjs > $QA_RUN/logs/sweep.log 2>&1 || { record sweep:pages FAIL "visual-sweep falló"; die "visual-sweep failed" }
  cp $P/sweep/results.json $W/sweep-results.json
  browser motion-candidate env BASE=http://127.0.0.1:3105 OUT=$W/motion-candidate.json node scripts/qa-release/motion-check.mjs > $QA_RUN/logs/motion-candidate.log 2>&1 \
    || { record sweep:motion FAIL "motion-check del candidato falló"; die "motion-check failed" }
  if [[ ${DRY_RUN:-} == 1 ]]; then
    record sweep:motion SKIPPED "ensayo: no se mide el sitio publicado"
    criteria sweep $W/sweep-results.json
  else
    browser motion-approved env BASE=$APPROVED OUT=$W/motion-approved.json node scripts/qa-release/motion-check.mjs > $QA_RUN/logs/motion-approved.log 2>&1 \
      || { record sweep:motion FAIL "motion-check del aprobado falló"; die "motion-check failed" }
    node -e '
      const [a, b] = process.argv.slice(1).map((f) => require(f).results)
      const keys = ["moves", "movesReduced", "brokenImages", "fonts", "focusVisible"]
      const diffs = a.flatMap((r, i) => keys.filter((k) => JSON.stringify(r[k]) !== JSON.stringify(b[i][k])).map((k) => `${r.locale} ${r.width}px ${k}: approved ${JSON.stringify(r[k])}, candidate ${JSON.stringify(b[i][k])}`))
      console.log(diffs.length ? diffs.join("\n") : "motion, lazy images, fonts and focus: same as the approved site")
    ' $W/motion-approved.json $W/motion-candidate.json > $W/motion-diff.txt
    criteria sweep $W/sweep-results.json $W/motion-diff.txt
  fi
  ;;

integrations)
  load
  LEAD=qa-lead-$RUN_ID@example.invalid
  say "lead through the real form endpoint (local, mig copy)"
  code=$(curl -sS -o $QA_RUN/logs/lead-response.json -w '%{http_code}' --max-time 60 http://127.0.0.1:${QA_LEAD_PORT:-3105}/api/contact-request \
    -H 'Content-Type: application/json' -H "Origin: http://127.0.0.1:${QA_LEAD_PORT:-3105}" \
    --data "{\"locale\":\"es\",\"sourcePath\":\"/es/contact\",\"name\":\"QA aislado\",\"company\":\"QA\",\"email\":\"$LEAD\",\"phone\":\"\",\"interest\":\"multiple\",\"headcount\":\"150\",\"website\":\"\",\"source\":\"qa-release\",\"message\":\"QA aislado $RUN_ID\"}" || print 000)
  qa mig $CAND lead node_modules/.bin/tsx scripts/qa-release/payload-task.ts lead $LEAD > $QA_RUN/logs/lead.log 2>&1 || true
  say "CMS hooks: re-save a FAQ and a post (embeddings must be skipped)"
  : > $QA_RUN/logs/touch.log
  for c in faqs blogPosts; do
    qa mig $CAND touch-$c node_modules/.bin/tsx scripts/qa-release/payload-task.ts touch $c >> $QA_RUN/logs/touch.log 2>&1 || true
  done
  gtm=$(curl -fsS http://127.0.0.1:3105/es | grep -c googletagmanager || true)
  { print "# Integraciones ($RUN_ID)"; print
    print -r -- "- Lead: HTTP $code; $(grep -o 'QA_TASK leads.*' $QA_RUN/logs/lead.log || print 'sin respuesta de la tarea')"
    print -r -- "- Copia a Google Sheets: no configurada (sin LEADS_SHEET_WEBHOOK_*)"
    print -r -- "- CMS: $(grep -o 'QA_TASK touch [^ ]* #[0-9]*' $QA_RUN/logs/touch.log | tr '\n' ' '); $(grep -c 'embedding skipped' $QA_RUN/logs/touch.log) 'embedding skipped'"
    print -r -- "- Medios de la copia en disco: $(ls $QA_RUN/media-mig | wc -l | tr -d ' '); GTM en el HTML del candidato: $gtm" } > $W/integrations.md
  failed=0
  criteria integrations $code $QA_RUN/logs/lead.log $QA_RUN/logs/touch.log $gtm || failed=1
  if node $CAND/scripts/qa-release/summarize-egress.mjs $QA_RUN/egress ${APPROVED#https://} "${BLOB_HOST:-none}" $W/network.md > /dev/null; then record network PASS "ninguna salida fuera de la política"
  else record network FAIL "salidas fuera de la política (network.md)"; failed=1; fi
  (( failed == 0 )) || die "integrations: FAIL (status.tsv)"
  ;;

evidence)
  load
  DEST=${QA_EVIDENCE_DIR:?set QA_EVIDENCE_DIR, e.g. docs/evidence/qa-release-<date>}
  # Re-exporting to this run's own earlier destination replaces it (e.g. after the classification).
  if [[ -e $DEST ]]; then
    [[ ${EVIDENCE_DEST:-} == ${DEST:A} ]] || die "$DEST exists"
    rm -rf -- $DEST
  fi
  VERDICT=$(node $CAND/scripts/qa-release/criteria.mjs status $QA_RUN)
  mkdir -p $DEST
  # Positive list only (R14): no recursive copy, nothing from private/, logs/ or egress/.
  for f in $EXPORT; do [[ -f $W/$f ]] && cp $W/$f $DEST/; done
  [[ -f $QA_RUN/status.tsv ]] && cp $QA_RUN/status.tsv $DEST/
  captured=$( [[ -f $P/catalog.json ]] && node -p 'require(process.argv[1]).capturedAt' $P/catalog.json || print "sin copia" )
  { print "# QA aislado, ejecución $RUN_ID"; print
    print -r -- "**Veredicto: $VERDICT**"; print
    print -r -- "- Candidato: \`$CAND_SHA\`; código anterior: \`$OLD_SHA\`"
    print -r -- "- Sitio aprobado: $APPROVED ($APPROVED_DPL)"
    print -r -- "- Copia de la fuente: $captured${DRY_RUN:+ (ensayo con fuente local, sin producción)}"
    print -r -- "- Detalle por criterio: status.tsv. PENDING = necesita clasificación del usuario$( [[ -f $W/classification.md ]] && print '; decisiones en classification.md' )."
    print -r -- "- Solo informes saneados de una lista fija. Capturas del CMS, exportaciones de enlaces y home, capturas de pantalla, volcados y registros quedan en el directorio privado de la ejecución y se borran con cleanup." } > $DEST/README.md
  [[ ${EVIDENCE_DEST:-} == ${DEST:A} ]] || setstate EVIDENCE_DEST ${DEST:A}
  touch $QA_RUN/evidence.done
  say "evidence in $DEST: $VERDICT"
  ;;

cleanup)
  load
  if [[ ${QA_DISCARD:-} != $RUN_ID ]]; then
    [[ -f $QA_RUN/evidence.done ]] || die "save evidence first (or QA_DISCARD=$RUN_ID)"
    # Pause before cleanup: the private captures are what the user classifies.
    pending=(${(f)"$(node $CAND/scripts/qa-release/criteria.mjs pending $QA_RUN)"})
    if (( ${#pending} )); then
      [[ -f $W/classification.md ]] || die "classify first: ${pending[*]} (work/classification.md); the private captures are still in $QA_RUN"
      for c in $pending; do grep -qF -- $c $W/classification.md || die "classification.md does not cover $c"; done
      [[ $QA_RUN/evidence.done -nt $W/classification.md ]] || die "run evidence again so the classification is exported"
    fi
  fi
  [[ $QA_RUN == */zitrone-qa/$RUN_ID ]] || die "unexpected run directory $QA_RUN"
  REAL_RUN=${QA_RUN:A}   # lsof reports real paths (/var/folders -> /private/var/folders)
  ours() { local c=$(lsof -a -p $1 -d cwd -Fn 2>/dev/null | sed -n 's/^n//p'); [[ $c == $REAL_RUN/* || $c == $QA_RUN/* ]] }
  for line in ${(Oa)${(f)"$(< $QA_RUN/created)"}}; do
    kind=${line%% *}; rest=${line#* }
    case $kind in
      pid) pid=${rest%% *}; port=${rest#* }
        kill $pid 2>/dev/null || true
        for p in $(lsof -nP -t -iTCP:$port -sTCP:LISTEN 2>/dev/null); do
          ours $p && kill $p
        done ;;
      container) [[ $rest == zitrone-qa-$RUN_ID ]] && docker rm -f $rest > /dev/null 2>&1 || true ;;
      worktree) [[ $rest == $QA_RUN/wt/* ]] && git -C $REPO worktree remove --force $rest 2>/dev/null || true ;;
      tmp) [[ $rest == */zqa-$RUN_ID ]] && rm -rf -- $rest ;;
      dir) ;;
    esac
  done
  sleep 2
  left=()
  for p in $(lsof -nP -t -iTCP:3105 -iTCP:3106 -sTCP:LISTEN 2>/dev/null); do ours $p && left+=$p; done
  (( ${#left} == 0 )) || die "servers of this run still listening: ${left[*]}"
  rm -rf -- $QA_RUN
  git -C $REPO worktree prune
  [[ -z $(docker ps -aq --filter name=zitrone-qa-$RUN_ID) ]] || die "container still present"
  git -C $REPO worktree list | grep -q -- $RUN_ID && die "worktree still registered"
  [[ ! -e $QA_RUN ]] || die "run directory still present"
  say "removed: servers, container (with its databases), worktrees, dumps, mirror, media and $QA_RUN"
  ;;

*) die "usage: run.sh <init|catalog|extract|restore|states|mirror|build|serve|compare|sweep|integrations|evidence|cleanup|dryrun-source>" ;;
esac
