#!/bin/zsh
set -u
S=/private/tmp/claude-501/-Users-a1085/bf8cab36-616f-4b4a-b645-8d43eb5e2eea/scratchpad
export PATH=$S/node-v24.21.0-darwin-arm64/bin:$PATH
node -v
: skip A
grep -E '[0-9]+ (passed|failed)' $S/fa-visual.log
: keep
cd $S/fb && npm ci >/dev/null 2>&1 && npx playwright test --config playwright.visual.config.ts > $S/fb-visual.log 2>&1; echo "B (local fonts) vs A rc=$?"
grep -E '[0-9]+ (passed|failed|flaky)' $S/fb-visual.log
grep -c 'fonts.gstatic' $S/fb/.next/static/css/*.css 2>/dev/null | head -3
