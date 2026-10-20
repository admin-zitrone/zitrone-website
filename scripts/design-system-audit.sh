#!/bin/zsh

set -euo pipefail

SCRIPT_DIR=${0:A:h}
REPO_ROOT=${SCRIPT_DIR:h}

cd "$REPO_ROOT"

# Resolve ripgrep. Interactive shells may alias `rg` to the Claude Code bundled
# binary via a profile function; scripts don't inherit that, and a missing rg
# used to make every check pass vacuously. Fail loudly instead.
if command -v rg >/dev/null 2>&1; then
  rg() { command rg "$@" }
elif [[ -x "$HOME/.local/bin/claude" ]]; then
  rg() { ARGV0=rg "$HOME/.local/bin/claude" "$@" }
else
  print "ERROR: ripgrep (rg) not found — audit cannot run. Install ripgrep (brew install ripgrep)."
  exit 1
fi

# ── Ratchet ────────────────────────────────────────────────────────────────
#
# The contract in DESIGN.md was written down but never enforced, and the debt
# it describes grew from ~670 leaks to ~1400 while everyone believed the rule
# held. Demanding a clean audit today would mean blocking every commit until a
# multi-week refactor lands, so instead each check records how many violations
# exist right now. A check fails only when its count goes UP.
#
# Debt can therefore be paid down at any pace, but never re-accumulated.
#
#   zsh scripts/design-system-audit.sh                    check (CI runs this)
#   zsh scripts/design-system-audit.sh --update-baseline  re-record after cleanup
#
BASELINE_FILE="$SCRIPT_DIR/design-system-audit.baseline"

typeset -i update_baseline=0
if [[ "${1:-}" == "--update-baseline" ]]; then
  update_baseline=1
fi

typeset -A baseline
if [[ -f "$BASELINE_FILE" ]]; then
  while IFS='=' read -r key value; do
    [[ -z "$key" || "$key" == '#'* ]] && continue
    baseline[$key]=$value
  done < "$BASELINE_FILE"
fi

typeset -A observed
typeset -a check_order

typeset -i failures=0
typeset -i debt=0
typeset -i improved=0

pass() {
  print "PASS  $1"
}

fail() {
  print "FAIL  $1"
  failures+=1
}

run_check() {
  local id="$1"
  local name="$2"
  local description="$3"
  local mode="$4"
  local pattern="$5"
  shift 5

  local -a args
  args=("$@")

  local output

  if [[ "$mode" == "fixed" ]]; then
    output=$(rg -n -F "$pattern" "${args[@]}" || true)
  else
    output=$(rg -n "$pattern" "${args[@]}" || true)
  fi

  local -i count=0
  if [[ -n "$output" ]]; then
    count=$(print -r -- "$output" | wc -l | tr -d ' ')
  fi

  local -i allowed=${baseline[$id]:-0}

  observed[$id]=$count
  check_order+=("$id")

  if (( count > allowed )); then
    fail "$name"
    print "  $description"
    print "  Violations: $count (baseline allows $allowed) — $(( count - allowed )) new."
    print "  Fix the new ones, or if this was a deliberate change:"
    print "    zsh scripts/design-system-audit.sh --update-baseline"
    print ""
    # Only the tail is shown: with hundreds of known-debt hits, printing every
    # line buries the handful that are actually new.
    print -r -- "$output" | tail -20 | sed 's/^/    /'
    print ""
  elif (( count < allowed )); then
    pass "$name"
    print "  Improved: $count violations, down from $allowed. Re-record with --update-baseline."
    improved+=1
    debt+=$count
  elif (( count > 0 )); then
    pass "$name"
    print "  Known debt held at $count violations."
    debt+=$count
  else
    pass "$name"
  fi
}

print "Design-system audit"
print "Repo: $REPO_ROOT"
print ""

run_check \
  "primitive-leaks" \
  "no primitive leaks in reusable component/layout css" \
  "Reusable components and layout files should not consume primitive tokens directly." \
  "regex" \
  'primitive-' \
  src/design-system/components \
  src/design-system/layout \
  -g '*.css'

run_check \
  "stale-aliases" \
  "no stale banned token aliases" \
  "Old aliases like service-media-min-height should not survive after token promotion." \
  "fixed" \
  'service-media-min-height' \
  src/design-system \
  docs/design-system \
  -g '*.css' \
  -g '*.md'

run_check \
  "raw-measures" \
  "no raw governed measure values in component/layout css" \
  "Hero widths, hero copy measure, panel heights, carousel progress widths, and responsive service-card heights should resolve through governed tokens." \
  "regex" \
  'max-width:\s*38ch|max-width:\s*min\(100%,\s*40rem\)|max-width:\s*min\(100%,\s*34rem\)|max-width:\s*min\(100%,\s*30rem\)|min-height:\s*26rem|min-height:\s*20rem|min-width:\s*10rem|max-width:\s*18rem|--service-card-media-min-height:\s*28rem|--service-card-media-min-height:\s*26rem' \
  src/design-system/components \
  src/design-system/layout \
  -g '*.css'

run_check \
  "focus-ring-bypass" \
  "no generic focus ring bypass in marketing components" \
  "Governed components should use component-specific focus tokens rather than shared generic focus declarations." \
  "regex" \
  'box-shadow:\s*0 0 0 var\(--focus-ring-width\)|outline:\s*[0-9]+px solid var\(--color-focus-ring\)' \
  src/design-system/components/marketing.css

run_check \
  "raw-typography" \
  "no raw font-size / line-height / letter-spacing / font-weight in component css" \
  "Every text style resolves to a --type-* role in tokens/semantic.css (or a component token that aliases one). Raw values are how the site drifted to 16 body sizes; change the role instead." \
  "regex" \
  '^\s*(?:font-size|letter-spacing|font-weight|line-height):\s*(?!(?:0|1|inherit|normal);)(?:clamp\(|calc\(|min\(|max\(|[0-9.-])' \
  -P \
  src/design-system/components \
  src/design-system/layout \
  src/design-system/styles \
  -g '*.css'

run_check \
  "stat-typography-wiring" \
  "no direct stat typography wiring in marketing component grammar" \
  "Stat cards should consume the stat-card component token family instead of binding directly to semantic stat-number roles inside component CSS." \
  "regex" \
  'font-family:\s*var\(--type-stat-number-family\)|font-size:\s*var\(--type-stat-number-size(?:-small)?\)|font-weight:\s*var\(--type-stat-number-weight\)|line-height:\s*var\(--type-stat-number-line-height\)' \
  src/design-system/components/marketing.css

run_check \
  "grid-templates" \
  "no proof/footer column templates in marketing component grammar" \
  "Proof and footer column counts should come from shared layout primitives, not component-local grid templates." \
  "regex" \
  'grid-template-columns:\s*repeat\(3,\s*minmax\(0,\s*1fr\)\)|grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)|grid-template-columns:\s*minmax\(0,\s*1fr\)\s+auto|grid-template-columns:\s*repeat\(3,\s*minmax\(10rem,\s*1fr\)\)' \
  src/design-system/components/marketing.css

print ""

if (( update_baseline == 1 )); then
  {
    print "# Design-system audit ratchet."
    print "# Violations currently tolerated per check. These may only go DOWN."
    print "# Regenerate after a cleanup: zsh scripts/design-system-audit.sh --update-baseline"
    for id in $check_order; do
      print "$id=${observed[$id]}"
    done
  } > "$BASELINE_FILE"
  print "Baseline re-recorded to $BASELINE_FILE"
  print ""
fi

if (( failures > 0 )); then
  print "Audit failed with $failures regression(s) — the contract moved backwards."
  exit 1
fi

if (( debt > 0 )); then
  print "Audit passed. Known debt: $debt violation(s) held at baseline."
  if (( improved > 0 )); then
    print "$improved check(s) improved — re-record with --update-baseline to lock the gain in."
  fi
else
  print "Audit passed. No debt: the design-system contract is clean."
fi
