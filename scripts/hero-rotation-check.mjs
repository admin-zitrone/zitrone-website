/**
 * Hero rotator under adverse loading: proves the crossfade never activates a
 * frame that is not loaded and decoded, holds the current photo + accent word
 * while the next one is late, and skips frames that fail.
 *
 *   BASE=http://127.0.0.1:3105 node scripts/hero-rotation-check.mjs [out.json]
 *
 * Every scenario runs in a fresh browser context (cold cache), desktop 1440 @2x,
 * and samples the DOM every 200 ms. Scenarios:
 *   normal   no interference
 *   late     the 3rd frame's image response is held for 14 s (> 2 intervals)
 *   error    the 4th frame's image request is aborted
 *   slow3g   CDP throttling: 400 kbps down, 400 ms RTT, for the whole visit
 * Exit code 1 if any check fails.
 */
import { writeFileSync } from "node:fs"
import { chromium } from "playwright"

const BASE = (process.env.BASE ?? "http://127.0.0.1:3105").replace(/\/$/, "")
const PATH = process.env.HERO_PATH ?? "/es"
const OUT = process.argv[2]
const LATE_FRAME = "buffet-line" // 3rd frame of the home hero
const ERROR_FRAME = "food-hall-service" // 4th frame

const sample = () => {
  const imgs = [...document.querySelectorAll("img[data-rotator]")]
  const active = imgs.find((i) => i.dataset.active === "true")
  const src = decodeURIComponent(active?.currentSrc ?? "")
  return {
    mounted: imgs.length,
    active: src.match(/hero\/([a-z0-9-]+)\./)?.[1] ?? null,
    activeLoaded: Boolean(active?.complete && active.naturalWidth > 0),
    word: document.querySelector(".semantic-hero-zitrone-accent")?.textContent?.trim() ?? null,
  }
}

async function run(browser, name, { setup, seconds }) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 })
  const page = await context.newPage()
  const requested = []
  page.on("request", (r) => {
    const m = decodeURIComponent(r.url()).match(/img\/site\/hero\/([a-z0-9-]+)\./)
    if (m) requested.push(m[1])
  })
  await setup?.(page, context)
  const t0 = Date.now()
  await page.goto(BASE + PATH, { waitUntil: "domcontentloaded", timeout: 120000 })
  const timeline = []
  while (Date.now() - t0 < seconds * 1000) {
    const s = await page.evaluate(sample)
    const last = timeline.at(-1)
    if (!last || last.active !== s.active || last.word !== s.word || last.mounted !== s.mounted || last.activeLoaded !== s.activeLoaded)
      timeline.push({ t: Date.now() - t0, ...s })
    await page.waitForTimeout(200)
  }
  await context.close()
  return { name, requested: [...new Set(requested)], timeline }
}

const checks = []
const check = (scenario, ok, what) => checks.push({ scenario, ok, what })

// The accent word must change together with the photo: map each photo to the
// word shown once it has been active for a moment, and require a 1:1 mapping.
function checkSync(r) {
  const settled = new Map()
  for (let i = 0; i < r.timeline.length; i += 1) {
    const s = r.timeline[i]
    const next = r.timeline[i + 1]
    if (!s.active || !s.word) continue
    // only states that lasted > 1.5 s (skip the word's own swap animation)
    if (next && next.t - s.t < 1500) continue
    if (!settled.has(s.active)) settled.set(s.active, new Set())
    settled.get(s.active).add(s.word)
  }
  const words = [...settled.values()]
  check(r.name, words.every((w) => w.size === 1), `accent word stable per photo: ${JSON.stringify([...settled].map(([k, v]) => [k, [...v]]))}`)
}

function activations(r) {
  return r.timeline.filter((s, i) => i === 0 || s.active !== r.timeline[i - 1].active)
}

// Rotations only: the first frame is server-rendered as active (it is the LCP
// image), so on a slow network it is legitimately active before it loads.
const rotations = (acts) => acts.slice(1)

const browser = await chromium.launch()
const results = []

// normal
{
  const r = await run(browser, "normal", { seconds: 27 })
  results.push(r)
  const acts = activations(r)
  check("normal", acts.length >= 4, `rotates through frames: ${acts.map((a) => a.active).join(" → ")}`)
  check("normal", rotations(acts).every((a) => a.activeLoaded), "every rotated-in frame was loaded when it became active")
  checkSync(r)
}

// late frame
{
  let release
  const held = new Promise((resolve) => (release = resolve))
  const r = await run(browser, "late", {
    seconds: 30,
    setup: async (page) => {
      await page.route((url) => decodeURIComponent(url.toString()).includes(`hero/${LATE_FRAME}.`), async (route) => {
        setTimeout(release, 14000)
        await held
        await route.continue()
      })
    },
  })
  results.push(r)
  const acts = activations(r)
  const lateAct = acts.find((a) => a.active === LATE_FRAME)
  const prev = acts[acts.indexOf(lateAct) - 1]
  check("late", Boolean(lateAct), `late frame eventually shown: ${acts.map((a) => `${a.active}@${a.t}`).join(" → ")}`)
  check("late", rotations(acts).every((a) => a.activeLoaded), "never activated a frame that was not loaded")
  // its normal slot is t≈12 s; it must not appear before the held response (14 s + decode)
  check("late", lateAct ? lateAct.t >= 14000 : false, `held the previous photo (${prev?.active}) until the late frame arrived (shown at ${lateAct?.t} ms, slot was ~12000 ms)`)
  checkSync(r)
}

// failed frame
{
  const r = await run(browser, "error", {
    seconds: 34,
    setup: async (page) => {
      await page.route((url) => decodeURIComponent(url.toString()).includes(`hero/${ERROR_FRAME}.`), (route) => route.abort("failed"))
    },
  })
  results.push(r)
  const acts = activations(r)
  check("error", !acts.some((a) => a.active === ERROR_FRAME), `failed frame never shown: ${acts.map((a) => a.active).join(" → ")}`)
  check("error", acts.length >= 4 && acts.at(-1).active !== acts.at(-2).active, "rotation continues past the failed frame")
  check("error", rotations(acts).every((a) => a.activeLoaded), "never activated a frame that was not loaded")
  checkSync(r)
}

// throttled
{
  const r = await run(browser, "slow3g", {
    seconds: 60,
    setup: async (page, context) => {
      const cdp = await context.newCDPSession(page)
      await cdp.send("Network.enable")
      await cdp.send("Network.emulateNetworkConditions", { offline: false, latency: 400, downloadThroughput: 50_000, uploadThroughput: 50_000 })
    },
  })
  results.push(r)
  const acts = activations(r)
  check("slow3g", rotations(acts).every((a) => a.activeLoaded), `never activated a frame that was not loaded: ${acts.map((a) => `${a.active}@${a.t}`).join(" → ")}`)
  checkSync(r)
}

await browser.close()

for (const c of checks) console.log(`${c.ok ? "PASS" : "FAIL"}  [${c.scenario}] ${c.what}`)
if (OUT) writeFileSync(OUT, JSON.stringify({ base: BASE, path: PATH, date: new Date().toISOString(), checks, results }, null, 2))
process.exit(checks.every((c) => c.ok) ? 0 : 1)
