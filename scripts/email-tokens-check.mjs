#!/usr/bin/env node
/**
 * Guards the hand-copied email palette against the design system.
 *
 * Email clients cannot read custom properties, so `src/emails/tokens.ts`
 * inlines every governed colour as a hex literal. That copy is the failure
 * mode: change a token and the emails keep shipping the old brand with
 * nothing to notice. This resolves each declared source variable through
 * the token files and fails loudly on any drift.
 *
 * Run: npm run email:check
 */

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..')

const TOKEN_FILES = [
  'src/design-system/tokens/primitives.css',
  'src/design-system/tokens/semantic.css',
  'src/design-system/tokens/component.css',
]

const EMAIL_TOKENS = 'src/emails/tokens.ts'

/** Every `--name: value;` declaration across the token files. */
function readDeclarations() {
  const declarations = new Map()

  for (const file of TOKEN_FILES) {
    const css = readFileSync(join(repoRoot, file), 'utf8')
    /* Only the first (root) definition counts: later ones are theme
       overrides, and email has no themes. */
    for (const match of css.matchAll(/(--[a-z0-9-]+)\s*:\s*([^;]+);/gi)) {
      const [, name, value] = match
      if (!declarations.has(name)) declarations.set(name, value.trim())
    }
  }

  return declarations
}

/** Follows `var(--a)` chains down to a literal. */
function resolve(name, declarations, seen = new Set()) {
  if (seen.has(name)) throw new Error(`circular token reference at ${name}`)
  seen.add(name)

  const value = declarations.get(name)
  if (value === undefined) return null

  const varMatch = value.match(/^var\(\s*(--[a-z0-9-]+)\s*\)$/i)
  if (varMatch) return resolve(varMatch[1], declarations, seen)

  return value
}

const normalise = (value) => value.trim().toLowerCase()

function readEmailPalette() {
  const source = readFileSync(join(repoRoot, EMAIL_TOKENS), 'utf8')

  const paletteBlock = source.match(/export const EMAIL_COLOR = \{([\s\S]*?)\n\} as const/)
  const sourceBlock = source.match(
    /export const EMAIL_TOKEN_SOURCE[^{]*\{([\s\S]*?)\n\}/,
  )

  if (!paletteBlock || !sourceBlock) {
    throw new Error(
      `could not parse ${EMAIL_TOKENS} — the check needs EMAIL_COLOR and EMAIL_TOKEN_SOURCE to keep their shape`,
    )
  }

  const entries = (block) =>
    new Map(
      [...block.matchAll(/^\s*([A-Za-z0-9_]+)\s*:\s*'([^']+)'/gm)].map((m) => [m[1], m[2]]),
    )

  return { palette: entries(paletteBlock[1]), sources: entries(sourceBlock[1]) }
}

function main() {
  const declarations = readDeclarations()
  const { palette, sources } = readEmailPalette()
  const problems = []

  for (const [key, literal] of palette) {
    const variable = sources.get(key)

    if (!variable) {
      problems.push(`${key}: no source variable declared in EMAIL_TOKEN_SOURCE`)
      continue
    }

    const resolved = resolve(variable, declarations)

    if (resolved === null) {
      problems.push(`${key}: ${variable} does not exist in the token files`)
      continue
    }

    if (normalise(resolved) !== normalise(literal)) {
      problems.push(`${key}: ${variable} is now ${resolved}, email still uses ${literal}`)
    }
  }

  for (const key of sources.keys()) {
    if (!palette.has(key)) problems.push(`${key}: declared as a source but absent from EMAIL_COLOR`)
  }

  if (problems.length > 0) {
    console.error('email:check FAILED — the email palette has drifted from the design system\n')
    for (const problem of problems) console.error(`  · ${problem}`)
    console.error(`\nUpdate the literals in ${EMAIL_TOKENS} to match, then re-run.`)
    process.exit(1)
  }

  console.log(`email:check OK — ${palette.size} colours match their design-system tokens.`)
}

main()
