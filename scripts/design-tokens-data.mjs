#!/usr/bin/env node
/* ═══════════════════════════════════════════════════════════════════════
   DESIGN TOKENS DATA — parses the three token layers into one JSON file
   so the /design-system brand book renders from the REAL tokens and can
   never drift from the system.

   Source : src/design-system/tokens/{primitives,semantic,component}.css
   Output : src/design-system/tokens.generated.json   (never hand-edit)

   Usage  : node scripts/design-tokens-data.mjs        (auto-runs on
            predev / prebuild, next to assets-sync)
   ═══════════════════════════════════════════════════════════════════════ */

import { readFileSync, writeFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const TOKENS_DIR = resolve(ROOT, "src/design-system/tokens")
const OUT = resolve(ROOT, "src/design-system/tokens.generated.json")

const LAYERS = [
  { id: "primitives", file: "primitives.css" },
  { id: "semantic", file: "semantic.css" },
  { id: "component", file: "component.css" },
]

/** Return the body of the FIRST top-level :root block (base values only —
 *  responsive @media re-points are a documented behavior, not base data). */
function firstRootBlock(css) {
  const start = css.indexOf(":root")
  if (start === -1) return ""
  const open = css.indexOf("{", start)
  let depth = 0
  for (let i = open; i < css.length; i++) {
    if (css[i] === "{") depth++
    else if (css[i] === "}") {
      depth--
      if (depth === 0) return css.slice(open + 1, i)
    }
  }
  return ""
}

/** Parse a :root body into groups of tokens, using section comments as
 *  group boundaries. Multi-line comments become the group note. */
function parseGroups(body) {
  const groups = []
  let current = { name: "General", note: "", tokens: [] }
  // Tokenize into comments and declarations, in order.
  const re = /\/\*([\s\S]*?)\*\/|(--[\w-]+)\s*:\s*([^;]+);/g
  let m
  while ((m = re.exec(body))) {
    if (m[1] !== undefined) {
      const text = m[1].replace(/[─═—│]+/g, " ").replace(/\s+/g, " ").trim()
      if (!text) continue
      // First sentence = group name, remainder = note.
      const dot = text.indexOf(".")
      const name = (dot === -1 ? text : text.slice(0, dot)).trim()
      const note = dot === -1 ? "" : text.slice(dot + 1).trim()
      if (current.tokens.length) groups.push(current)
      current = { name, note, tokens: [] }
    } else {
      current.tokens.push({
        name: m[2],
        value: m[3].replace(/\s+/g, " ").trim(),
      })
    }
  }
  if (current.tokens.length) groups.push(current)
  return groups
}

// ── Parse all layers ─────────────────────────────────────────────────────
const layers = {}
const registry = new Map() // token name -> raw value (across all layers)
for (const { id, file } of LAYERS) {
  const css = readFileSync(resolve(TOKENS_DIR, file), "utf8")
  const groups = parseGroups(firstRootBlock(css))
  layers[id] = { file: `src/design-system/tokens/${file}`, groups }
  for (const g of groups) for (const t of g.tokens) registry.set(t.name, t.value)
}

// ── Resolve var() chains to final values ─────────────────────────────────
function resolveValue(value, seen = new Set()) {
  return value.replace(/var\((--[\w-]+)(?:\s*,\s*([^()]*))?\)/g, (whole, name, fallback) => {
    if (seen.has(name)) return whole // circular — leave as-is
    const next = registry.get(name)
    if (next === undefined) return fallback !== undefined ? fallback.trim() : whole
    return resolveValue(next, new Set([...seen, name]))
  })
}

let count = 0
for (const layer of Object.values(layers)) {
  for (const g of layer.groups) {
    for (const t of g.tokens) {
      const resolved = resolveValue(t.value)
      if (resolved !== t.value) t.resolved = resolved.replace(/\s+/g, " ").trim()
      count++
    }
  }
}

// The date only moves when the tokens do, so a build leaves the file (and the
// checkout) unchanged unless a token file changed.
let previous = null
try {
  previous = JSON.parse(readFileSync(OUT, "utf8"))
} catch {}
const now = new Date()
const generatedAt =
  previous && JSON.stringify(previous.layers) === JSON.stringify(layers)
    ? previous.generatedAt
    : [
        now.getFullYear(),
        String(now.getMonth() + 1).padStart(2, "0"),
        String(now.getDate()).padStart(2, "0"),
      ].join("-")
const json = JSON.stringify({ generatedAt, layers }, null, 2)
writeFileSync(OUT, json + "\n", "utf8")
console.log(`design-tokens-data: ${count} tokens → src/design-system/tokens.generated.json`)
