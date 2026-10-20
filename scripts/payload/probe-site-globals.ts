/**
 * Reads (and optionally rewrites unchanged) the header and footer globals in
 * every locale through Payload's local API, and prints every link path it
 * finds as sorted JSON. Used by scripts/rehearse-home-migration.sh, which runs
 * it with the current code and with the previous release's code against the
 * same throwaway database. It must therefore only use APIs both releases
 * share: getPayload, findGlobal, updateGlobal.
 *
 *   probe-site-globals.ts read <file>  -> writes {"es": {...}, "en": {...}} to <file>
 *   probe-site-globals.ts write        -> rewrites each global with its own data
 *                                         (locale WRITE_LOCALE, default en)
 *   probe-site-globals.ts edit         -> appends " [rehearsal <locale>]" to the
 *                                         header CTA label in es and en
 *   probe-site-globals.ts export <file> -> header, footer and home per locale,
 *                                         without timestamps (change capture)
 *   probe-site-globals.ts home <file>  -> home per locale without ids or
 *                                         timestamps (content comparison)
 *
 * Per locale, `shown` maps each link that has a label (the only ones the site
 * renders: the loaders drop unlabeled items) to "label -> path"; `unlabeled`
 * counts stored paths without a label in that locale. Payload logs to stdout,
 * so the JSON goes to a file.
 *
 * Exit code 1 (message on stderr) when Payload cannot read or write.
 */
import { writeFileSync } from "node:fs"
import { getPayload } from "payload"
import config from "@payload-config"

const LOCALES = ["es", "en"] as const
const GLOBALS = ["header", "footer"] as const
const LINK_KEY = /(Href|anchor)$/

type Json = null | boolean | number | string | Json[] | { [key: string]: Json }

type Links = { shown: Record<string, string>; unlabeled: number; ctaLabel?: string }

function collectLinks(value: Json, path: string, out: Links) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => collectLinks(item, `${path}[${index}]`, out))
  } else if (value && typeof value === "object") {
    const label = typeof value.label === "string" ? value.label.trim() : ""
    for (const [key, child] of Object.entries(value)) {
      if (LINK_KEY.test(key) && typeof child === "string" && child !== "") {
        if (label) out.shown[`${path}.${key}`] = `${label} -> ${child}`
        else out.unlabeled += 1
      } else {
        collectLinks(child, `${path}.${key}`, out)
      }
    }
  }
}

function stripMeta(value: Json, drop = ["createdAt", "updatedAt", "globalType"]): Json {
  if (Array.isArray(value)) return value.map((item) => stripMeta(item, drop))
  if (value && typeof value === "object") {
    const copy: Record<string, Json> = {}
    for (const [key, child] of Object.entries(value)) {
      if (drop.includes(key)) continue
      copy[key] = stripMeta(child, drop)
    }
    return copy
  }
  return value
}

async function dump(slugs: readonly string[], drop?: string[]) {
  const out: Record<string, Record<string, Json>> = {}
  for (const locale of LOCALES) {
    out[locale] = {}
    for (const slug of slugs) {
      const doc = (await payload.findGlobal({ slug: slug as "header", locale, depth: 0 })) as unknown as Json
      out[locale][slug] = stripMeta(doc, drop)
    }
  }
  return out
}

const mode = process.argv[2] ?? "read"
const payload = await getPayload({ config })

try {
  if (mode === "export" || mode === "home") {
    const data =
      mode === "export"
        ? await dump(["header", "footer", "home"])
        : await dump(["home"], ["id", "createdAt", "updatedAt", "globalType", "_status"])
    writeFileSync(process.argv[3], `${JSON.stringify(data, null, 2)}\n`)
    process.exit(0)
  }
  if (mode === "edit") {
    for (const locale of LOCALES) {
      const header = (await payload.findGlobal({ slug: "header", locale, depth: 0 })) as unknown as {
        primaryCta?: { label?: string }
      }
      const label = `${header.primaryCta?.label ?? ""} [rehearsal ${locale}]`
      await payload.updateGlobal({
        slug: "header",
        locale,
        depth: 0,
        data: { ...(stripMeta(header as Json) as Record<string, Json>), primaryCta: { ...header.primaryCta, label } },
      })
    }
    process.stdout.write("edit ok: header CTA label in es, en\n")
    process.exit(0)
  }
  const result: Record<string, Links> = {}
  for (const locale of LOCALES) {
    const links: Links = { shown: {}, unlabeled: 0 }
    for (const slug of GLOBALS) {
      const doc = (await payload.findGlobal({ slug, locale, depth: 0 })) as unknown as Json
      if (mode === "write" && locale === (process.env.WRITE_LOCALE ?? "en")) {
        await payload.updateGlobal({
          slug,
          locale,
          depth: 0,
          data: stripMeta(doc) as Record<string, unknown>,
        })
      }
      collectLinks(doc, slug, links)
      if (slug === "header") {
        const cta = (doc as { primaryCta?: { label?: string } } | null)?.primaryCta
        if (cta?.label) links.ctaLabel = cta.label
      }
    }
    links.shown = Object.fromEntries(
      Object.entries(links.shown).sort(([a], [b]) => a.localeCompare(b)),
    )
    result[locale] = links
  }
  if (mode === "read") writeFileSync(process.argv[3], `${JSON.stringify(result, null, 2)}\n`)
  else process.stdout.write(`write ok: ${GLOBALS.join(", ")} in ${process.env.WRITE_LOCALE ?? "en"}\n`)
  process.exit(0)
} catch (error) {
  process.stderr.write(`probe ${mode} failed: ${error instanceof Error ? error.message : String(error)}\n`)
  process.exit(1)
}
