/**
 * Visual comparison of two running builds (base vs candidate), page by page.
 *
 *   BASE_A=http://127.0.0.1:3106 BASE_B=http://127.0.0.1:3105 OUT=<dir> node scripts/visual-compare.mjs
 *   PAGES=/es,/en/services (optional; default: the image-heavy page types)
 *   BASE_A may be the published site; see scripts/qa-release/browser-policy.mjs
 *   for what each side may request.
 *
 * Settles each page the way tests/e2e/visual.spec.ts does (consent answered,
 * reduced motion so rotators stand still, scroll to the bottom and back so
 * lazy and near-viewport images load, reveals pinned, each image held at the
 * source chosen for the viewport, animations off, wait
 * until the document height is stable), takes a full-page screenshot of both
 * builds and counts differing pixels (per-channel sum > 30 of 765).
 *
 * Writes OUT/visual.json and, for pages that differ by more than 0.1 %, JPEG
 * copies of both screenshots plus a diff mask (changed pixels in red).
 */
import { mkdirSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { chromium } from "playwright"
import sharp from "sharp"
import { applyPolicy, policyFor } from "./qa-release/browser-policy.mjs"

const A = (process.env.BASE_A ?? "http://127.0.0.1:3106").replace(/\/$/, "")
const B = (process.env.BASE_B ?? "http://127.0.0.1:3105").replace(/\/$/, "")
const OUT = process.env.OUT ?? "docs/evidence/visual-compare"
mkdirSync(OUT, { recursive: true })

const PAGES = process.env.PAGES?.split(",") ?? [
  "/es", "/en",
  "/es/services", "/es/services/comedor-corporativo", "/es/services/carritos-de-servicio",
  "/es/blog", "/es/blog/category/culture-retention", "/es/blog/authors/equipo-de-operaciones-zitrone",
]
const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 },
]

async function shoot(browser, base, path, vp) {
  const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, reducedMotion: "reduce", serviceWorkers: "block" })
  await context.addCookies([{
    name: "zitrone_consent",
    value: encodeURIComponent(JSON.stringify({ analytics: "granted", marketing: "granted", v: 1 })),
    url: base,
  }])
  // Third parties (GTM/GA) stay out of both screenshots; a published base
  // only receives reads (scripts/qa-release/browser-policy.mjs).
  await applyPolicy(context, policyFor(base))
  const page = await context.newPage()
  await page.goto(base + path, { waitUntil: "load", timeout: 90000 })
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += innerHeight) {
      scrollTo(0, y)
      await new Promise((r) => requestAnimationFrame(() => setTimeout(r, 120)))
    }
    scrollTo(0, 0)
  })
  await page.evaluate(() => {
    for (const el of document.querySelectorAll("[data-reveal]")) el.dataset.revealState = "visible"
  })
  await page.addStyleTag({
    content: `*,*::before,*::after{animation-delay:0s!important;animation-duration:0s!important;transition-duration:0s!important;transition-delay:0s!important;caret-color:transparent!important}
      [data-reveal]{opacity:1!important;transform:none!important;filter:none!important}`,
  })
  await page.evaluate(() => document.fonts.ready)
  await page.waitForLoadState("networkidle").catch(() => {})
  // Each image keeps the source the browser chose for this viewport. The
  // full-page capture re-evaluates srcset, and an image that switched then
  // (the services card that shares the hero's photo, which is already in
  // memory at 1920w) was captured before the new source was painted: an
  // empty "Carritos de servicio" card (QA 19 Oct 2026, run 6).
  await page.evaluate(() => {
    for (const img of document.images) {
      if (!img.srcset || !img.currentSrc) continue
      const src = img.currentSrc
      img.removeAttribute("srcset")
      img.removeAttribute("sizes")
      img.src = src
    }
  })
  // Every rendered image finished and decoded: the first request to a local
  // next start optimizes the image on demand, and a capture taken before it
  // showed an empty card (QA 19 Oct 2026, "Carritos de servicio").
  await page.waitForFunction(() => [...document.images].every((i) => i.getBoundingClientRect().width === 0 || (i.complete && i.naturalWidth > 0)), null, { polling: 200, timeout: 30000 }).catch(() => {})
  await page.evaluate(() => Promise.all([...document.images].filter((i) => i.complete && i.naturalWidth > 0).map((i) => i.decode().catch(() => {}))))
  await page.waitForFunction(() => {
    const w = window
    const h = document.documentElement.scrollHeight
    if (h === w.__h) w.__s = (w.__s ?? 0) + 1
    else { w.__h = h; w.__s = 0 }
    return w.__s >= 5
  }, null, { polling: 100, timeout: 20000 }).catch(() => {})
  const png = await page.screenshot({ fullPage: true, animations: "disabled" })
  await context.close()
  return png
}

async function diff(pngA, pngB) {
  const [ma, mb] = await Promise.all([sharp(pngA).metadata(), sharp(pngB).metadata()])
  if (ma.width !== mb.width || ma.height !== mb.height)
    return { sameSize: false, sizeA: `${ma.width}x${ma.height}`, sizeB: `${mb.width}x${mb.height}` }
  const [ra, rb] = await Promise.all([sharp(pngA).removeAlpha().raw().toBuffer(), sharp(pngB).removeAlpha().raw().toBuffer()])
  const mask = Buffer.alloc(ra.length)
  let changed = 0
  for (let i = 0; i < ra.length; i += 3) {
    const d = Math.abs(ra[i] - rb[i]) + Math.abs(ra[i + 1] - rb[i + 1]) + Math.abs(ra[i + 2] - rb[i + 2])
    if (d > 30) { changed += 1; mask[i] = 255 } else { mask[i] = mask[i + 1] = mask[i + 2] = Math.round(ra[i] * 0.25 + 180) }
  }
  const total = ra.length / 3
  return { sameSize: true, size: `${ma.width}x${ma.height}`, changedPixels: changed, changedPct: +((changed / total) * 100).toFixed(3), mask, width: ma.width, height: ma.height }
}

// A page that hangs once (e.g. a dropped DB connection on a local server) is
// retried; if it keeps failing it is recorded, and the run continues.
async function shootWithRetry(browser, base, path, vp) {
  let lastError
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      return await shoot(browser, base, path, vp)
    } catch (error) {
      lastError = error
    }
  }
  throw lastError
}

const browser = await chromium.launch()
const results = []
for (const path of PAGES) {
  for (const vp of VIEWPORTS) {
    let a, b
    try {
      ;[a, b] = [await shootWithRetry(browser, A, path, vp), await shootWithRetry(browser, B, path, vp)]
    } catch (error) {
      results.push({ path, viewport: vp.name, error: String(error.message).split("\n")[0] })
      console.log(`${path} [${vp.name}] ERROR ${String(error.message).split("\n")[0]}`)
      continue
    }
    const d = await diff(a, b)
    const name = `${path.replace(/^\//, "").replace(/\//g, "_") || "root"}-${vp.name}`
    const row = { path, viewport: vp.name, ...d }
    delete row.mask
    if (!d.sameSize || d.changedPct > 0.1) {
      await sharp(a).jpeg({ quality: 70 }).toFile(join(OUT, `${name}-base.jpg`))
      await sharp(b).jpeg({ quality: 70 }).toFile(join(OUT, `${name}-candidate.jpg`))
      if (d.mask) await sharp(d.mask, { raw: { width: d.width, height: d.height, channels: 3 } }).jpeg({ quality: 70 }).toFile(join(OUT, `${name}-diff.jpg`))
      row.files = [`${name}-base.jpg`, `${name}-candidate.jpg`, d.mask ? `${name}-diff.jpg` : null].filter(Boolean)
    }
    delete row.width
    delete row.height
    results.push(row)
    console.log(`${path} [${vp.name}] ${d.sameSize ? `${d.changedPct}% changed` : `size ${d.sizeA} vs ${d.sizeB}`}`)
  }
}
await browser.close()
writeFileSync(join(OUT, "visual.json"), JSON.stringify({ base: A, candidate: B, date: new Date().toISOString(), results }, null, 2))
