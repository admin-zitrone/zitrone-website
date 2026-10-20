#!/bin/zsh
# Local replay of .github/workflows/ci.yml on a clean archive of HEAD, Node 24, no .env.
set -u
S=/private/tmp/claude-501/-Users-a1085/bf8cab36-616f-4b4a-b645-8d43eb5e2eea/scratchpad
REPO="/Users/a1085/Documents/Zitrone/Zitrone Website"
W=$S/ci-copy; L=$S/ci-logs
rm -rf $W $L; mkdir -p $W $L
cd "$REPO"; SHA=$(git rev-parse --short HEAD); git archive HEAD | tar -x -C $W
export PATH=$S/node-v24.21.0-darwin-arm64/bin:$PATH
cd $W; [[ $(node -v) == v24.* ]] || { echo "wrong node $(node -v)"; exit 1 }
echo "sha=$SHA node=$(node -v) start=$(date -u +%FT%TZ)" > $L/00-meta.log
step() { local n=$1; shift; local t0=$SECONDS; "$@" > $L/$n.log 2>&1; local rc=$?; echo "$n rc=$rc $((SECONDS-t0))s" | tee -a $L/00-summary.log; return 0; }
step 01-npm-ci npm ci
step 02-env-check npm run env:check
step 03-lint npm run lint
step 04-tsc npx tsc --noEmit
step 05-assets npm run assets:check
step 06-email npm run email:check
step 07-design npm run design:audit
step 08-contracts npm run test:contracts
step 09-build npm run build
step 10-e2e npm run test:e2e
# isolated-api job, URL mode against the local throwaway container
U=$(docker inspect zitrone-staging-pg --format '{{range .Config.Env}}{{println .}}{{end}}' | sed -n 's/^POSTGRES_USER=//p')
P=$(docker inspect zitrone-staging-pg --format '{{range .Config.Env}}{{println .}}{{end}}' | sed -n 's/^POSTGRES_PASSWORD=//p')
export TEST_PG_URL="postgres://$(node -p 'encodeURIComponent(process.argv[1])' "$U"):$(node -p 'encodeURIComponent(process.argv[1])' "$P")@127.0.0.1:55432/postgres"
step 11-test-scripts npm run test:scripts
step 12-test-api npm run test:api
step 13-test-cache npm run test:cache
unset TEST_PG_URL
for i in 1 2 3 4; do rm -rf .next; step 15-build-fresh-$i npm run build; done
echo "end=$(date -u +%FT%TZ)" >> $L/00-meta.log
