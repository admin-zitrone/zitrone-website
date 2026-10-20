#!/bin/zsh
# Controlled comparison: does the entrance motion cause the slow mobile LCP?
#
#   npm run build && npx next start --hostname 127.0.0.1 --port 3105 &
#   zsh scripts/lighthouse-motion-compare.sh <out-dir> [runs] [base-url]
#
# Same build, same server, same Lighthouse 12.8.2 mobile settings as
# scripts/lighthouse-runs.sh; the only variable is Chrome's
# --force-prefers-reduced-motion, which makes the site collapse its reveal
# animations (globals.css). Runs alternate between the two conditions so
# machine load drifts affect both equally. Google tag domains are blocked.
set -euo pipefail
OUT=${1:?output dir}; RUNS=${2:-5}; BASE=${3:-http://127.0.0.1:3105}
mkdir -p "$OUT"
: ${CHROME_PATH:=$(ls -d ~/Library/Caches/ms-playwright/chromium-*/chrome-mac*/Google\ Chrome\ for\ Testing.app/Contents/MacOS/Google\ Chrome\ for\ Testing 2>/dev/null | tail -1)}
export CHROME_PATH
for route in es es/contact; do
  for run in $(seq 1 $RUNS); do
    for motion in normal reduced; do
      flags="--headless=new --no-sandbox"
      [[ $motion == reduced ]] && flags="$flags --force-prefers-reduced-motion"
      name=$(print -r -- $route | tr '/' '_')_${motion}_$run
      npx --yes lighthouse@12.8.2 "$BASE/$route" --only-categories=performance \
        --output=json --output-path="$OUT/$name.json" --chrome-flags="$flags" \
        --blocked-url-patterns='*googletagmanager.com*' --blocked-url-patterns='*google-analytics.com*' \
        --blocked-url-patterns='*googleadservices.com*' --blocked-url-patterns='*doubleclick.net*' \
        --blocked-url-patterns='*google.com/*' --quiet
    done
  done
done
