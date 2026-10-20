import test from "node:test"
import assert from "node:assert/strict"

import {
  getServiceCta,
  getServiceStandard,
  getServiceTargets,
  getServiceTemplateContent,
  type ServiceTarget,
  type ServiceTemplateContent,
} from "@/app/[locale]/services/service-targets"
import { faqPageJsonLd } from "@/app/lib/json-ld"

/* The service page contract — see docs/services/service-page-contract.md.
 *
 * Every section answers exactly one buyer question, in a fixed word budget, and
 * no fact appears in two sections. A service opts in by setting
 * `faqScope: "service"`; these tests then hold it to the contract, so the
 * remaining services can be migrated one at a time without drifting. */

const LOCALES = ["es", "en"] as const

/* Reading budgets. The page is scanned, not read: the title of a block carries
 * the message and the line under it only qualifies it. */
const BUDGET = {
  /* The promise-led hero (2026-09-23) pairs the promise with who runs the
     service, two short sentences, so the lede budget went from 12 to 24. */
  lede: 24,
  resolvesPointCopy: 12,
  standardIntro: 18,
  standardPointCopy: 10,
  /* 45 words was calibrated on a four-FAQ set of short answers. Catalogue and
     equipment questions ("what's included", "which machine") are answered with
     a list, where completeness beats brevity for search and for the buyer. The
     scannability rule that matters is the lead sentence, enforced separately
     below; this cap only catches runaway copy. */
  faqAnswer: 90,
}

const RESOLVES_POINTS = 3
const STANDARD_POINTS = 4
/* Four FAQs is the floor: viabilidad, riesgo, encaje, dinero. Services with a
   broad catalogue (pantry, café) answer more long-tail buyer questions, which is
   an asset for search, so the ceiling is eight rather than four. */
const FAQS_MIN = 4
const FAQS_MAX = 8

/* The four questions a buyer asks before signing, in the order they ask them:
   viabilidad, riesgo, encaje, dinero. Each FAQ is written the way someone types
   it into Google — a full natural question, not a heading. */
const FAQ_OPENERS = [
  // es
  "necesitamos", "necesito", "como", "cuanto", "cuantas", "cuantos", "que", "quien",
  "cuando", "donde", "puede", "pueden", "se", "en", "de", "hay", "es", "cual", "cuales", "por",
  // en
  "do", "does", "how", "what", "who", "when", "where", "can", "is", "are", "which", "why",
]

/** The first sentence must answer; the rest explains. */
function firstSentence(value: string) {
  return value.split(/(?<=[.?!])\s/)[0] ?? value
}

const STOPWORDS = new Set([
  // es
  "el","la","los","las","un","una","unos","unas","de","del","al","a","en","y","o","u","que","con",
  "por","para","su","sus","tu","tus","se","lo","es","son","no","mas","como","cada","todo","todos",
  "toda","todas","dia","dias","nuestro","nuestra","nuestros","nuestras",
  // en
  "the","a","an","of","to","in","and","or","for","with","your","our","we","it","is","are","that",
  "on","by","every","all","from","at","as","be",
])

function words(value: string) {
  return value.trim().split(/\s+/).filter(Boolean)
}

function contentWords(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2 && !STOPWORDS.has(word))
}

/** Three consecutive content words — a distinctive phrase, not a stock one. */
function shingles(value: string) {
  const tokens = contentWords(value)
  const result = new Set<string>()
  for (let i = 0; i + 3 <= tokens.length; i += 1) {
    result.add(tokens.slice(i, i + 3).join(" "))
  }
  return result
}

function migratedServices() {
  const rows: {
    locale: string
    target: ServiceTarget
    template: ServiceTemplateContent
  }[] = []

  for (const locale of LOCALES) {
    for (const target of getServiceTargets(locale)) {
      const template = getServiceTemplateContent(locale, target.theme)
      if (template.faqScope === "service") rows.push({ locale, target, template })
    }
  }

  return rows
}

test("at least one service has adopted the section contract", () => {
  assert.ok(
    migratedServices().length > 0,
    "no service sets faqScope: 'service' — the contract has no coverage",
  )
})

test("contract services carry the 'what it solves' zone", () => {
  for (const { locale, target, template } of migratedServices()) {
    const where = `${locale}/${target.slug}`
    assert.ok(template.resolves, `${where}: missing 'resolves' (what does it solve)`)
  }
})

test("every service is under the contract", () => {
  for (const locale of LOCALES) {
    for (const target of getServiceTargets(locale)) {
      const template = getServiceTemplateContent(locale, target.theme)
      assert.equal(
        template.faqScope,
        "service",
        `${locale}/${target.slug}: every service page renders the same contract`,
      )
    }
  }
})

test("every zone stays inside its reading budget", () => {
  for (const { locale, target, template } of migratedServices()) {
    const where = `${locale}/${target.slug}`
    const check = (label: string, value: string, budget: number) => {
      const count = words(value).length
      assert.ok(
        count <= budget,
        `${where}: ${label} is ${count} words, budget is ${budget} — "${value}"`,
      )
    }

    check("hero lede", target.lede, BUDGET.lede)
    template.resolves!.points.forEach((point, index) =>
      check(`resolves point ${index + 1}`, point.copy, BUDGET.resolvesPointCopy),
    )
    template.faqs.forEach((faq, index) =>
      check(`faq answer ${index + 1}`, faq.answer, BUDGET.faqAnswer),
    )
  }
})

test("every zone holds the shape the layout expects", () => {
  for (const { locale, target, template } of migratedServices()) {
    const where = `${locale}/${target.slug}`
    assert.equal(
      template.resolves!.points.length,
      RESOLVES_POINTS,
      `${where}: 'what it solves' must carry exactly ${RESOLVES_POINTS} outcomes`,
    )
    assert.ok(
      template.faqs.length >= FAQS_MIN && template.faqs.length <= FAQS_MAX,
      `${where}: ${template.faqs.length} FAQs — cover at least viability, risk, fit and money (${FAQS_MIN}), and stay under ${FAQS_MAX}`,
    )
  }
})

test("no fact is repeated across two sections", () => {
  for (const { locale, target, template } of migratedServices()) {
    const where = `${locale}/${target.slug}`
    const zones: Record<string, string> = {
      hero: target.lede,
      resolves: [
        ...template.resolves!.points.flatMap((point) => [point.title, point.copy]),
      ].join(" "),
      standard: [
        getServiceStandard(locale).intro,
        ...getServiceStandard(locale).points.flatMap((point) => [point.title, point.copy]),
      ].join(" "),
    }

    const seen = new Map<string, string>()
    for (const [zone, text] of Object.entries(zones)) {
      for (const phrase of shingles(text)) {
        const owner = seen.get(phrase)
        assert.ok(
          owner === undefined,
          `${where}: "${phrase}" appears in both '${owner}' and '${zone}' — one fact, one zone`,
        )
        seen.set(phrase, zone)
      }
    }
  }
})

test("contract services stay structurally aligned across locales", () => {
  const byTheme = new Map<string, ServiceTemplateContent[]>()
  for (const { target, template } of migratedServices()) {
    byTheme.set(target.theme, [...(byTheme.get(target.theme) ?? []), template])
  }

  for (const [theme, templates] of byTheme) {
    assert.equal(
      templates.length,
      LOCALES.length,
      `${theme}: adopted the contract in ${templates.length} locale(s); it must be all ${LOCALES.length}`,
    )
    const [first, ...rest] = templates
    for (const other of rest) {
      assert.equal(other.resolves!.points.length, first.resolves!.points.length, `${theme}: outcome count differs`)
      assert.equal(other.faqs.length, first.faqs.length, `${theme}: FAQ count differs`)
    }
  }
})

test("the operating standard is one shared block, identical in shape per locale", () => {
  for (const locale of LOCALES) {
    const standard = getServiceStandard(locale)
    const where = `standard/${locale}`
    assert.equal(
      standard.points.length,
      STANDARD_POINTS,
      `${where}: 'how we work' must carry exactly ${STANDARD_POINTS} points`,
    )
    assert.ok(
      words(standard.intro).length <= BUDGET.standardIntro,
      `${where}: intro is over ${BUDGET.standardIntro} words`,
    )
    standard.points.forEach((point, index) =>
      assert.ok(
        words(point.copy).length <= BUDGET.standardPointCopy,
        `${where}: point ${index + 1} is over ${BUDGET.standardPointCopy} words — "${point.copy}"`,
      ),
    )
  }
})

test("FAQs are written the way a buyer searches", () => {
  for (const { locale, target, template } of migratedServices()) {
    const where = `${locale}/${target.slug}`
    template.faqs.forEach((faq, index) => {
      const at = `${where}: faq ${index + 1}`
      assert.ok(faq.question.trim().endsWith("?"), `${at}: must be a question, not a heading`)
      const opener = (words(faq.question)[0] ?? "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[^a-z]/g, "")
      assert.ok(
        FAQ_OPENERS.includes(opener),
        `${at}: opens with "${opener}" — write it as someone would type it into Google`,
      )
      const questionWords = words(faq.question).length
      assert.ok(
        questionWords >= 5 && questionWords <= 14,
        `${at}: ${questionWords} words — long-tail, but still one question`,
      )
      const lead = words(firstSentence(faq.answer)).length
      assert.ok(
        lead <= 20,
        `${at}: the answer's first sentence is ${lead} words; it must answer directly, then explain`,
      )
    })

    const questions = new Set(template.faqs.map((faq) => faq.question.toLowerCase()))
    assert.equal(questions.size, template.faqs.length, `${where}: duplicate question`)
  }
})

test("service hero CTAs stay simple and informational", () => {
  const FORBIDDEN = ["demo", "agendar", "book", "schedule", "llamada", "call", "cotiza"]

  for (const locale of LOCALES) {
    const cta = getServiceCta(locale)
    const labels = [cta.hero.label]

    for (const label of labels) {
      const lower = label.toLowerCase()
      for (const word of FORBIDDEN) {
        assert.ok(
          !lower.includes(word),
          `cta/${locale}: "${label}" promises a flow the mailto cannot deliver`,
        )
      }
      const count = words(label).length
      assert.ok(count <= 2, `cta/${locale}: "${label}" is ${count} words, keep it under 2`)
    }
  }
})

test("FAQ markup matches the FAQs the page renders", () => {
  for (const { locale, target, template } of migratedServices()) {
    const schema = faqPageJsonLd(template.faqs)
    assert.equal(schema["@type"], "FAQPage")
    assert.equal(
      schema.mainEntity.length,
      template.faqs.length,
      `${locale}/${target.slug}: FAQPage must list exactly the rendered FAQs`,
    )
  }
})
