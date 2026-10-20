#!/usr/bin/env zsh
# Reproduces this folder. Run from the repo root of the candidate checkout.
#
# Prerequisites (both builds use the same local optimizer, so bytes compare):
#   base      git worktree add --detach ../zitrone-images-base f5796950eb75727388313ead0855bcf3aeaba227
#             cp -c -R node_modules ../zitrone-images-base/node_modules   # Turbopack rejects a symlink
#             (cd ../zitrone-images-base && npm run build && npx next start -p 3106)
#   candidate npm run build && npx next start -p 3105                     # at 4624c683c4e18e3185b2c944abd004385d59c250
# Never run test:visual in either folder while its server is up: it rebuilds .next in place.
set -euo pipefail
E=docs/evidence/image-audit/2026-10-16-base-vs-candidate
PAGES=$(curl -s https://www.zitrone.mx/sitemap.xml | grep -o '<loc>[^<]*' | sed 's#<loc>https://www.zitrone.mx##' | grep -v '\.xml$' | paste -sd, -)
echo "$PAGES" | tr , '\n' > $E/pages.txt

# 1. Image audit, both builds in parallel (38 pages x mobile 390@3x + desktop 1440@2x).
BASE=http://127.0.0.1:3106 PAGES="$PAGES" ONLY=live CONCURRENCY=2 OUT=$E/raw-base node scripts/image-audit.mjs > $E/raw-base.log 2>&1 &
BASE=http://127.0.0.1:3105 PAGES="$PAGES" ONLY=live CONCURRENCY=2 OUT=$E/raw-candidate node scripts/image-audit.mjs > $E/raw-candidate.log 2>&1
wait
for side in base candidate; do
  d=$(ls -d $E/raw-$side/*/ | head -1)
  mv $d/report.md $E/report-$side.md
  gzip -9 -c $d/results.json > $E/results-$side.json.gz
  rm -rf $E/raw-$side
done
node scripts/image-audit-compare.mjs $E/results-base.json.gz $E/results-candidate.json.gz > $E/comparison.md

# 2. Hero rotator under cold cache, a late frame, a failed frame and throttling (candidate).
BASE=http://127.0.0.1:3105 node scripts/hero-rotation-check.mjs $E/hero-rotation.json > $E/hero-rotation.txt || echo "hero-rotation-check: FAILED (exit $?)" >> $E/hero-rotation.txt

# 3. Full-page visual comparison base vs candidate.
BASE_A=http://127.0.0.1:3106 BASE_B=http://127.0.0.1:3105 OUT=$E/visual node scripts/visual-compare.mjs > $E/visual.txt
