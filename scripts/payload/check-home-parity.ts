/**
 * Full home parity check: renders the home content the way the site does in
 * CMS mode (getResolvedHomeContent) and diffs it, field by field, against the
 * static content files. Any difference means setting HOME_CONTENT_SOURCE=cms
 * `static` would change what visitors see.
 *
 * Images are compared by source path: the CMS serves /api/media/file/<path>.webp
 * (or a Blob URL) for the static /img/<path>.jpg, which is the same picture.
 *
 * With --coverage it instead lists the text fields that still come from code:
 * every string in the static content is tainted before the loader runs, so any
 * tainted string in its output was not read from the CMS. Fields the site keeps
 * in code on purpose are listed in CODE_OWNED.
 *
 *   npm run payload:check:parity               # local DB from .env.local
 *   npm run payload:check:parity -- --coverage
 */
import { getHomeContent as getStaticHomeContent } from "../../src/app/_components/home/home-data"

process.env.HOME_CONTENT_SOURCE = "cms"

// The loaders fall back to the static content on any CMS error, which would make
// this check pass without reading the CMS at all. Treat those fallbacks as failures.
const fallbacks: unknown[] = []
const warn = console.warn
console.warn = (...args: unknown[]) => {
  if (typeof args[0] === "string" && args[0].startsWith("[payload/")) fallbacks.push(args)
  warn(...args)
}

type Diff = { path: string; source: unknown; cms: unknown }

const MEDIA_URL = /^(\/api\/media\/file\/|https:\/\/[^/]+\.blob\.vercel-storage\.com\/|\/img\/)/

/* The seed names each upload after its path under public/img
   (/img/shared/clients/mono/att.svg -> shared-clients-mono-att.svg), so both
   sides reduce to that name without the extension. */
function imageStem(value: string) {
  const path = value.split("?")[0]
  const name = path.startsWith("/img/")
    ? path.slice("/img/".length).replace(/\//g, "-")
    : (path.split("/").pop() ?? path)
  return name.replace(/\.[a-z0-9]+$/i, "")
}

function normalize(value: unknown): unknown {
  // An empty optional string renders like an absent one (the CMS stores neither).
  if (value === "") return undefined
  if (typeof value === "string" && MEDIA_URL.test(value) && /\.(jpe?g|png|webp|avif|svg)(\?|$)/i.test(value)) {
    return `image:${imageStem(value)}`
  }
  return value
}

function diff(source: unknown, cms: unknown, path: string, out: Diff[]) {
  const a = normalize(source)
  const b = normalize(cms)
  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b)) return void out.push({ path, source: a, cms: b })
    if (a.length !== b.length) out.push({ path: `${path}.length`, source: a.length, cms: b.length })
    for (let i = 0; i < Math.min(a.length, b.length); i++) diff(a[i], b[i], `${path}[${i}]`, out)
    return
  }
  if (a && b && typeof a === "object" && typeof b === "object") {
    const keys = new Set([...Object.keys(a), ...Object.keys(b)])
    for (const key of keys) {
      diff((a as Record<string, unknown>)[key], (b as Record<string, unknown>)[key], `${path}.${key}`, out)
    }
    return
  }
  if (a !== b) out.push({ path, source: a, cms: b })
}

const TAINT = "\u00a7code\u00a7"

/**
 * Paths kept in code on purpose:
 * - the profiler encodes service logic;
 * - the step visuals (widget, badge) chart sourced figures and are matched to
 *   the CMS step by key;
 * - the service names and URLs are shared with the service pages, which are
 *   not in the CMS yet.
 */
const CODE_OWNED = [
  /^home\.componentLabels\.profiler\./,
  /^home\.profiler/,
  /^home\.systemTabs\[\d+\]\.visual(Widget|Badge)\b/,
  /^home\.serviceLinks\./,
]

function taint(value: unknown): void {
  if (!value || typeof value !== "object") return
  for (const [key, child] of Object.entries(value)) {
    if (typeof child === "string") (value as Record<string, unknown>)[key] = `${TAINT}${child}`
    else taint(child)
  }
}

function findTainted(value: unknown, path: string, out: string[]) {
  if (typeof value === "string") {
    if (value.includes(TAINT)) out.push(path)
    return
  }
  if (!value || typeof value !== "object") return
  for (const [key, child] of Object.entries(value)) {
    findTainted(child, Array.isArray(value) ? `${path}[${key}]` : `${path}.${key}`, out)
  }
}

async function coverage() {
  const { getResolvedHomeContent } = await import("../../src/payload/loaders/home-content")
  let total = 0
  for (const locale of ["es", "en"] as const) {
    taint(getStaticHomeContent(locale))
    const paths: string[] = []
    findTainted(await getResolvedHomeContent(locale), "home", paths)
    const codeOnly = paths.filter((path) => !CODE_OWNED.some((re) => re.test(path)))
    total += codeOnly.length
    const grouped = new Map<string, number>()
    for (const path of codeOnly) {
      const key = path.replace(/\[\d+\]/g, "[]")
      grouped.set(key, (grouped.get(key) ?? 0) + 1)
    }
    console.log(`\n${locale}: ${codeOnly.length} text field(s) still read from code`)
    for (const [key, count] of grouped) console.log(`  ${count.toString().padStart(3)}  ${key}`)
  }
  if (fallbacks.length > 0) {
    console.error(`\n${fallbacks.length} loader fallback(s) to static content: the CMS was not read.`)
    process.exit(1)
  }
  process.exit(total > 0 ? 1 : 0)
}

async function main() {
  if (process.argv.includes("--coverage")) return coverage()
  const { getResolvedHomeContent } = await import("../../src/payload/loaders/home-content")
  let total = 0
  for (const locale of ["es", "en"] as const) {
    const source = getStaticHomeContent(locale)
    const cms = await getResolvedHomeContent(locale)
    const diffs: Diff[] = []
    diff(source, cms, "home", diffs)
    total += diffs.length
    console.log(`\n${locale}: ${diffs.length} difference(s)`)
    for (const d of diffs) {
      console.log(`  ${d.path}\n    code: ${JSON.stringify(d.source)}\n    cms:  ${JSON.stringify(d.cms)}`)
    }
  }
  if (fallbacks.length > 0) {
    console.error(`\n${fallbacks.length} loader fallback(s) to static content: the CMS was not read.`)
    process.exit(1)
  }
  process.exit(total > 0 ? 1 : 0)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
