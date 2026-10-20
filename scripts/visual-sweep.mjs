/**
 * Visual QA sweep against a running production build (next start), not dev.
 *
 *   BASE=http://127.0.0.1:3105 OUT=docs/evidence/<dir>/screens node scripts/visual-sweep.mjs
 *
 * For every route x locale x viewport: viewport screenshot (JPEG), horizontal
 * overflow, images that failed to load after scrolling, console errors. Plus
 * states: mobile menu open, consent banner, contact validation error and
 * success (POST mocked, nothing sent), home under reduced motion, keyboard
 * focus visibility for the first tab stops. Writes results.json next to the
 * screenshots. External requests are blocked so nothing reaches Google.
 */
import { mkdirSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { chromium } from "playwright"
import { applyPolicy, policyFor } from "./qa-release/browser-policy.mjs"

const BASE = process.env.BASE ?? "http://127.0.0.1:3105"
const OUT = process.env.OUT ?? "docs/evidence/visual"
mkdirSync(OUT, { recursive: true })

const ROUTES = {
  es: ["", "/services", "/services/comedor-corporativo", "/blog",
    "/blog/como-construir-un-programa-de-alimentacion-corporativa",
    "/blog/caida-de-las-3pm-pantry-de-oficina",
    "/blog/comida-en-la-oficina-y-retencion-de-talento", "/contact", "/privacy-notice"],
  en: ["", "/services", "/services/corporate-dining", "/blog",
    "/blog/workplace-food-program-that-works", "/blog/afternoon-slump-office-pantry",
    "/blog/office-food-employee-retention", "/contact", "/privacy-notice"],
}
const VIEWPORTS = [320, 390, 768, 1440]
const CONSENT = { name: "zitrone_consent", value: encodeURIComponent(JSON.stringify({ analytics: "denied", marketing: "denied", v: 1 })), domain: "127.0.0.1", path: "/" }

const results = { base: BASE, date: new Date().toISOString(), pages: [], states: [] }
const browser = await chromium.launch()

async function newPage(width, { consent = true, reducedMotion = "no-preference" } = {}) {
  const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion, serviceWorkers: "block" })
  if (consent) await context.addCookies([CONSENT])
  await applyPolicy(context, policyFor(BASE))
  const page = await context.newPage()
  const errors = []
  page.on("console", (m) => { if (m.type() === "error" && !/net::ERR_FAILED|ERR_BLOCKED|Failed to load resource/.test(m.text())) errors.push(m.text().slice(0, 160)) })
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message.slice(0, 160)}`))
  return { context, page, errors }
}

async function scrollThrough(page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)) }
    window.scrollTo(0, 0)
  })
  await page.waitForTimeout(400)
}

const slug = (s) => s.replace(/^\//, "").replace(/\//g, "_") || "home"

for (const locale of process.env.STATES_ONLY ? [] : ["es", "en"]) {
  for (const route of ROUTES[locale]) {
    for (const width of VIEWPORTS) {
      const { context, page, errors } = await newPage(width)
      let response
      try {
        response = await page.goto(`${BASE}/${locale}${route}`, { waitUntil: "load", timeout: 45_000 })
      } catch (error) {
        results.pages.push({ locale, route: route || "/", width, status: "navigation-failed", error: String(error).slice(0, 160), overflowPx: 0, brokenImages: [], consoleErrors: [] })
        await context.close()
        continue
      }
      await page.waitForTimeout(500)
      await scrollThrough(page)
      const metrics = await page.evaluate(() => ({
        overflowPx: document.documentElement.scrollWidth - window.innerWidth,
        brokenImages: [...document.images].filter((i) => i.complete && i.naturalWidth === 0 && !i.src.startsWith("data:")).map((i) => i.currentSrc || i.src).slice(0, 5),
        title: document.title,
      }))
      const file = `${locale}_${slug(route)}_${width}.jpg`
      await page.screenshot({ path: join(OUT, file), type: "jpeg", quality: 55 })
      results.pages.push({ locale, route: route || "/", width, status: response?.status(), ...metrics, consoleErrors: errors, file })
      await context.close()
    }
  }
}

// States
for (const locale of ["es", "en"]) {
  { // mobile menu open
    const { context, page, errors } = await newPage(390)
    await page.goto(`${BASE}/${locale}`, { waitUntil: "load" })
    const opener = page.locator("button[aria-controls][aria-expanded]:visible").first()
    await opener.click()
    await page.waitForTimeout(500)
    const file = `${locale}_state_menu-open_390.jpg`
    await page.screenshot({ path: join(OUT, file), type: "jpeg", quality: 55 })
    results.states.push({ locale, state: "mobile menu open", expanded: await opener.getAttribute("aria-expanded"), consoleErrors: errors, file })
    await context.close()
  }
  { // consent banner on first visit
    const { context, page, errors } = await newPage(390, { consent: false })
    await page.goto(`${BASE}/${locale}`, { waitUntil: "load" })
    await page.waitForTimeout(500)
    const file = `${locale}_state_consent-banner_390.jpg`
    await page.screenshot({ path: join(OUT, file), type: "jpeg", quality: 55 })
    const dialog = page.getByRole("dialog").or(page.getByRole("region", { name: /cookie|privacidad|privacy|consent/i }))
    results.states.push({ locale, state: "consent banner (no stored choice)", visible: (await dialog.count()) > 0, consoleErrors: errors, file })
    await context.close()
  }
  { // home, reduced motion
    const { context, page, errors } = await newPage(1440, { reducedMotion: "reduce" })
    await page.goto(`${BASE}/${locale}`, { waitUntil: "load" })
    await scrollThrough(page)
    const file = `${locale}_state_home-reduced-motion_1440.jpg`
    await page.screenshot({ path: join(OUT, file), type: "jpeg", quality: 55, fullPage: true })
    results.states.push({ locale, state: "home, prefers-reduced-motion", consoleErrors: errors, file })
    await context.close()
  }
  { // keyboard focus on the first tab stops
    const { context, page } = await newPage(1440)
    await page.goto(`${BASE}/${locale}`, { waitUntil: "load" })
    const stops = []
    for (let i = 0; i < 8; i++) {
      await page.keyboard.press("Tab")
      stops.push(await page.evaluate(() => {
        const el = document.activeElement
        if (!el || el === document.body) return { tag: "body" }
        const cs = getComputedStyle(el)
        const visible = (cs.outlineStyle !== "none" && parseFloat(cs.outlineWidth) > 0) || cs.boxShadow !== "none"
        return { tag: el.tagName.toLowerCase(), text: (el.getAttribute("aria-label") || el.textContent || "").trim().slice(0, 40), focusIndicator: visible }
      }))
    }
    results.states.push({ locale, state: "keyboard: first 8 tab stops on home", stops })
    await context.close()
  }
}

// Contact error and success, mocked API (nothing is sent)
for (const width of [390, 1440]) {
  const { context, page, errors } = await newPage(width)
  let calls = 0
  await page.route("**/api/contact-request", (route) => {
    calls += 1
    return route.fulfill({ status: calls === 1 ? 502 : 201, json: calls === 1 ? { ok: false } : { ok: true, requestId: "ZC-VISUAL-QA" } })
  })
  await page.goto(`${BASE}/es/contact`, { waitUntil: "load" })
  const form = page.locator("form.ds-contact-form")
  // Fast path through the steps: choose the first service, then advance.
  const next = form.getByRole("button", { name: /siguiente|continuar/i })
  for (let step = 0; step < 6 && (await next.count()); step++) {
    const choice = form.locator("button[aria-pressed='false']").first()
    if (await choice.count()) await choice.click().catch(() => {})
    await next.first().click().catch(() => {})
    await page.waitForTimeout(150)
  }
  const send = form.getByRole("button", { name: /enviar/i }).first()
  const reachedSend = (await send.count()) > 0
  if (reachedSend) {
    await send.click()
    await page.waitForTimeout(300)
    await page.screenshot({ path: join(OUT, `es_state_contact-validation_${width}.jpg`), type: "jpeg", quality: 55 })
    await form.getByRole("textbox").first().fill("QA Visual")
    await form.locator("input[type=email]").first().fill("qa@example.invalid")
    await send.click()
    await page.waitForTimeout(500)
    await page.screenshot({ path: join(OUT, `es_state_contact-error_${width}.jpg`), type: "jpeg", quality: 55 })
    await send.click()
    await page.waitForTimeout(800)
    await page.screenshot({ path: join(OUT, `es_state_contact-success_${width}.jpg`), type: "jpeg", quality: 55 })
  }
  results.states.push({ locale: "es", state: `contact validation/error/success (mocked) ${width}`, reachedSend, mockedCalls: calls, consoleErrors: errors })
  await context.close()
}

await browser.close()
writeFileSync(join(OUT, process.env.STATES_ONLY ? "results-states.json" : "results.json"), JSON.stringify(results, null, 2))
const flagged = results.pages.filter((p) => p.status !== 200 || p.overflowPx > 1 || p.brokenImages.length || p.consoleErrors.length)
console.log(`pages: ${results.pages.length}, flagged: ${flagged.length}`)
for (const p of flagged) console.log(JSON.stringify(p))
for (const s of results.states) console.log(JSON.stringify(s))
