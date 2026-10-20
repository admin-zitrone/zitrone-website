#!/bin/zsh
# The exact Lighthouse protocol behind docs/evidence/remediation-2026-09-30/perf.
#
#   npm run build && npx next start --hostname 127.0.0.1 --port 3105 &
#   zsh scripts/lighthouse-runs.sh <out-dir> [base-url]
#   python3 scripts/lighthouse-summary.py <out-dir>
#
# 4 routes x mobile/desktop x 3 runs, Lighthouse 12.8.2 (fetched with npx),
# default mobile throttling (4x CPU, 150ms RTT, ~1.6 Mbps) and the desktop
# preset. Google tag domains are blocked so test visits never reach the
# client's GA4/Ads: the results exclude GTM's cost. Uses the Chrome that
# Playwright installed unless CHROME_PATH is set.
set -euo pipefail
OUT=${1:?output dir}
BASE=${2:-http://127.0.0.1:3105}
mkdir -p "$OUT"
: ${CHROME_PATH:=$(ls -d ~/Library/Caches/ms-playwright/chromium-*/chrome-mac*/Google\ Chrome\ for\ Testing.app/Contents/MacOS/Google\ Chrome\ for\ Testing 2>/dev/null | tail -1)}
export CHROME_PATH
for route in es es/services/comedor-corporativo es/blog/comida-en-la-oficina-y-retencion-de-talento es/contact; do
  for ff in mobile desktop; do
    for run in 1 2 3; do
      name=$(print -r -- $route | tr '/' '_')_${ff}_$run
      extra=(); [[ $ff == desktop ]] && extra=(--preset=desktop)
      npx --yes lighthouse@12.8.2 "$BASE/$route" $extra --only-categories=performance \
        --output=json --output-path="$OUT/$name.json" --chrome-flags="--headless=new --no-sandbox" \
        --blocked-url-patterns='*googletagmanager.com*' --blocked-url-patterns='*google-analytics.com*' \
        --blocked-url-patterns='*googleadservices.com*' --blocked-url-patterns='*doubleclick.net*' \
        --blocked-url-patterns='*google.com/*' --quiet
    done
  done
done
