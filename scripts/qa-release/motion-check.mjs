/**
 * Real behaviour, without the styles visual-compare injects to freeze pages:
 * motion, lazy loading, fonts and keyboard focus, on one base URL.
 *
 *   BASE=<url> OUT=<file.json> node scripts/qa-release/motion-check.mjs
 *
 * Per locale home (1440 and 390 px):
 * - moves: the first viewport changes between 1 s and 8 s with motion
 *   allowed, and does not under prefers-reduced-motion;
 * - lazy: after a slow scroll every <img> has decoded (naturalWidth > 0);
 * - fonts: the three preloaded brand faces are loaded;
 * - focus: the first eight Tab stops each show an outline or ring.
 * Run against the approved site and the candidate; run.sh compares both files.
 * Network: scripts/qa-release/browser-policy.mjs.
 */
import { createHash } from "node:crypto"
import { writeFileSync } from "node:fs"
import { chromium } from "playwright"
import { applyPolicy, policyFor } from "./browser-policy.mjs"

const BASE = (process.env.BASE ?? "http://127.0.0.1:3105").replace(/\/$/, "")
const OUT = process.env.OUT ?? "motion.json"
const CONSENT = encodeURIComponent(JSON.stringify({ analytics: "denied", marketing: "denied", v: 1 }))
const hash = (buffer) => createHash("sha256").update(buffer).digest("hex").slice(0, 16)

const browser = await chromium.launch()
async function open(path, width, reducedMotion) {
  const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion, serviceWorkers: "block" })
  await context.addCookies([{ name: "zitrone_consent", value: CONSENT, url: BASE }])
  await applyPolicy(context, policyFor(BASE))
  const page = await context.newPage()
  await page.goto(BASE + path, { waitUntil: "load", timeout: 90_000 })
  return { context, page }
}

const results = []
for (const locale of ["es", "en"]) {
  for (const width of [1440, 390]) {
    const row = { locale, width }
    for (const reducedMotion of ["no-preference", "reduce"]) {
      const { context, page } = await open(`/${locale}`, width, reducedMotion)
      await page.waitForTimeout(1000)
      const first = hash(await page.screenshot())
      await page.waitForTimeout(7000)
      const second = hash(await page.screenshot())
      row[reducedMotion === "reduce" ? "movesReduced" : "moves"] = first !== second
      if (reducedMotion === "no-preference") {
        await page.evaluate(async () => {
          for (let y = 0; y < document.body.scrollHeight; y += 300) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 150)) }
          scrollTo(0, 0)
        })
        await page.waitForTimeout(1500)
        row.brokenImages = await page.evaluate(() => [...document.images].filter((img) => img.currentSrc && img.complete && img.naturalWidth === 0).map((img) => new URL(img.currentSrc).pathname).slice(0, 10))
        row.fonts = await page.evaluate(async () => {
          await document.fonts.ready
          return ["Manrope", "Noto Serif Display"].map((family) => [...document.fonts].some((f) => f.family.replace(/"/g, "").startsWith(family) && f.status === "loaded"))
        })
        const focus = []
        for (let i = 0; i < 8; i += 1) {
          await page.keyboard.press("Tab")
          focus.push(await page.evaluate(() => {
            const el = document.activeElement
            if (!el || el === document.body) return null
            const s = getComputedStyle(el)
            return (s.outlineStyle !== "none" && parseFloat(s.outlineWidth) > 0) || (s.boxShadow && s.boxShadow !== "none")
          }))
        }
        row.focusVisible = focus
      }
      await context.close()
    }
    results.push(row)
    console.log(JSON.stringify(row))
  }
}
await browser.close()
writeFileSync(OUT, JSON.stringify({ base: BASE, date: new Date().toISOString(), results }, null, 2) + "\n")
