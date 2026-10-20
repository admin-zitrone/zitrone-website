import test from "node:test"
import assert from "node:assert/strict"

import { getServiceTargets } from "@/app/[locale]/services/service-targets"
import { homeContentEn } from "@/app/_components/home/content/en"
import { homeContentEs } from "@/app/_components/home/content/es"
import { SERVICE_KEYS, SERVICE_NAMES } from "@/lib/service-names"

/* Service names contract.
 *
 * A service has one name per locale, defined in lib/service-names.ts. Any link
 * or title that points at a service page must carry that name, so the navbar,
 * home cards, footer, profiler and the page H1 never disagree. */

const HOME = { es: homeContentEs, en: homeContentEn } as const

for (const locale of ["es", "en"] as const) {
  const names = SERVICE_NAMES[locale]
  const nameBySlug = new Map(
    getServiceTargets(locale).map((target) => [target.slug, names[target.theme].name]),
  )

  test(`${locale}: every service page is titled with its canonical name`, () => {
    const targets = getServiceTargets(locale)
    assert.deepEqual(
      targets.map((target) => target.theme).sort(),
      [...SERVICE_KEYS].sort(),
    )
    for (const target of targets) assert.equal(target.title, names[target.theme].name)
  })

  test(`${locale}: every home link or title pointing at a service uses its canonical name`, () => {
    const mismatches: string[] = []
    const visit = (node: unknown, path: string) => {
      if (Array.isArray(node)) return node.forEach((item, i) => visit(item, `${path}[${i}]`))
      if (!node || typeof node !== "object") return
      const record = node as Record<string, unknown>
      const slug = typeof record.href === "string" ? record.href.match(/^\/services\/([^/#?]+)$/)?.[1] : undefined
      const expected = slug ? nameBySlug.get(slug) : undefined
      if (expected) {
        for (const field of ["label", "title"] as const) {
          const value = record[field]
          if (typeof value === "string" && value !== expected) {
            mismatches.push(`${path}.${field} = "${value}" (expected "${expected}")`)
          }
        }
      }
      for (const [key, value] of Object.entries(record)) visit(value, `${path}.${key}`)
    }
    visit(HOME[locale], "home")
    assert.deepEqual(mismatches, [])
  })
}
