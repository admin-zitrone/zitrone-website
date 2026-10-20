/**
 * Image audit: what the site actually ships, plus the state of the library.
 *
 *   node scripts/image-audit.mjs                          # live www.zitrone.mx
 *   BASE=http://127.0.0.1:3105 node scripts/image-audit.mjs   # a local `next start`
 *   ONLY=live|repo  PAGES=/es,/en/services  OUT=docs/evidence/image-audit
 *
 * Live pass: every sitemap page (or PAGES) at mobile (390, DPR 3) and desktop
 * (1440, DPR 2). Records every image response (bytes, format, cache header,
 * optimizer or raw) and every <img> in the DOM (intrinsic vs rendered size,
 * loading/fetchpriority, alt, above the fold, LCP), plus raster CSS
 * backgrounds. Scrolls to the bottom so lazy images load.
 *
 * Repo pass: every raster under public/img (bytes, dimensions, format, alpha)
 * and naming against the ASSETS.md rules. Read-only: nothing is written
 * outside OUT.
 *
 * Writes OUT/<date>/results.json and OUT/<date>/report.md. Exit code is 0;
 * severity lives in the report (FAIL / WARN / INFO).
 */
import { mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs"
import { join, relative, extname, basename } from "node:path"
import { chromium } from "playwright"
import sharp from "sharp"

const BASE = (process.env.BASE ?? "https://www.zitrone.mx").replace(/\/$/, "")
const ONLY = process.env.ONLY ?? "all"
const DATE = new Date().toISOString().slice(0, 10)
const OUT = join(process.env.OUT ?? "docs/evidence/image-audit", DATE)
const CONCURRENCY = Number(process.env.CONCURRENCY ?? 3)
mkdirSync(OUT, { recursive: true })

// Budgets. Bytes are transfer size of a single image as served.
const KB = 1024
const BUDGET = {
  imgWarn: 150 * KB,
  imgFail: 400 * KB,
  lcpWarn: 120 * KB,
  pageWarn: 1500 * KB, // all images on one page, one viewport, after full scroll
  pageFail: 3000 * KB,
  oversizeRatio: 1.5, // intrinsic width > rendered CSS width * DPR * ratio
  minCacheSeconds: 7 * 24 * 3600,
  sourceWarn: 1 * 1024 * KB, // library originals (optimizer input)
  sourceFail: 3 * 1024 * KB,
  sourceMaxEdge: 3200,
}
const VIEWPORTS = [
  { name: "mobile", width: 390, height: 844, dpr: 3, mobile: true },
  { name: "desktop", width: 1440, height: 900, dpr: 2, mobile: false },
]

const findings = [] // { sev, rule, where, detail }
const flagged = new Set()
// One finding per page/viewport: several <img> sharing a URL (loop clones,
// cached srcset reuse) would otherwise repeat the same line.
const flag = (sev, rule, where, detail) => {
  const key = `${sev}|${rule}|${where}|${detail}`
  if (flagged.has(key)) return
  flagged.add(key)
  findings.push({ sev, rule, where, detail })
}
const kb = (n) => `${Math.round(n / KB)} KB`

// ---------------------------------------------------------------- live pass

async function pageList() {
  if (process.env.PAGES) return process.env.PAGES.split(",").map((p) => BASE + p.trim())
  const xml = await (await fetch(`${BASE}/sitemap.xml`)).text()
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((m) => m[1].replace("https://www.zitrone.mx", BASE))
    .filter((u) => !u.endsWith(".xml"))
}

function formatOf(contentType, url) {
  const ct = (contentType ?? "").split(";")[0].trim()
  if (ct.startsWith("image/")) return ct.slice(6)
  return extname(new URL(url).pathname).slice(1) || "unknown"
}

async function auditPage(browser, url, vp) {
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: vp.dpr,
    isMobile: vp.mobile,
    hasTouch: vp.mobile,
  })
  // Keep third parties (GTM/GA) out of the numbers.
  await ctx.route(/^https?:\/\/(?!www\.zitrone\.mx|zitrone\.mx|127\.0\.0\.1|localhost|[^/]*vercel-storage\.com)/, (r) => r.abort())
  const page = await ctx.newPage()
  const responses = []
  let recording = true
  page.on("response", async (res) => {
    if (!recording || res.request().resourceType() !== "image") return
    const h = res.headers()
    let bytes = Number(h["content-length"] ?? 0)
    if (!bytes) bytes = await res.body().then((b) => b.length).catch(() => 0)
    responses.push({
      url: res.url(),
      status: res.status(),
      format: formatOf(h["content-type"], res.url()),
      bytes,
      cache: h["cache-control"] ?? "",
      optimized: res.url().includes("/_next/image"),
    })
  })
  page.on("requestfailed", (req) => {
    if (req.resourceType() === "image" && !req.failure()?.errorText.includes("ABORTED"))
      responses.push({ url: req.url(), status: 0, failed: req.failure()?.errorText })
  })

  await page.addInitScript(() => {
    window.__lcp = null
    new PerformanceObserver((list) => {
      const e = list.getEntries().at(-1)
      window.__lcp = { url: e.url || null, tag: e.element?.tagName ?? null, size: e.size }
    }).observe({ type: "largest-contentful-paint", buffered: true })
  })
  const nav = await page.goto(url, { waitUntil: "load", timeout: 60000 })
  // Read image preloads from the server HTML: that is what the browser acts
  // on, and React may drop the <link> from the DOM after hydration.
  const html = (await nav?.text().catch(() => "")) ?? ""
  const htmlPreloads = [...html.matchAll(/<link[^>]*rel="preload"[^>]*as="image"[^>]*>/g)].map((m) => m[0].replaceAll("&amp;", "&"))
  await page.waitForTimeout(1500)

  // Snapshot of what is above the fold before any scrolling.
  const aboveFold = await page.evaluate(() =>
    [...document.images]
      .filter((i) => {
        const r = i.getBoundingClientRect()
        // Hidden nav menus and inactive carousel slides are not "above the fold".
        return r.bottom > 0 && r.top < innerHeight && r.width > 0 &&
          i.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true })
      })
      .map((i) => i.currentSrc || i.src),
  )
  const lcp = await page.evaluate(() => window.__lcp)

  // What a visitor pays before scrolling: the number that matters for the
  // first screen and for anyone who leaves early.
  const initialBytes = responses.reduce((sum, x) => sum + (x.bytes ?? 0), 0)

  // Scroll to the bottom in steps so lazy images and backgrounds load.
  await page.evaluate(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight * 0.7) {
      scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 250))
    }
    scrollTo(0, document.documentElement.scrollHeight)
  })
  await page.waitForLoadState("networkidle").catch(() => {})
  await page.waitForTimeout(800)
  recording = false

  const dom = await page.evaluate(async () => {
    // With srcset, naturalWidth is density-corrected; decode the delivered
    // file on its own to get its real pixel width. Only for images the page
    // already loaded (served from cache): probing an unloaded lazy image would
    // fetch its 3840w fallback `src` and pollute the byte counts.
    const pixelWidth = async (img) => {
      const src = img.currentSrc
      if (!src || !img.complete || src.startsWith("data:")) return 0
      const probe = new Image()
      probe.src = src
      await probe.decode().catch(() => {})
      return probe.naturalWidth
    }
    const imgs = await Promise.all([...document.images].map(async (i) => {
      const cs = getComputedStyle(i)
      return {
        src: i.currentSrc || i.src,
        alt: i.getAttribute("alt"),
        loading: i.getAttribute("loading"),
        fetchpriority: i.getAttribute("fetchpriority"),
        hasSrcset: i.hasAttribute("srcset"),
        sizes: i.getAttribute("sizes"),
        hasDims: i.hasAttribute("width") && i.hasAttribute("height"),
        absolute: cs.position === "absolute" || cs.position === "fixed",
        naturalW: await pixelWidth(i),
        naturalH: i.naturalHeight,
        renderW: Math.round(i.getBoundingClientRect().width),
        visible: i.getBoundingClientRect().width > 0 && i.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true }),
        complete: i.complete,
      }
    }))
    const bgs = []
    for (const el of document.querySelectorAll("body *")) {
      const bg = getComputedStyle(el).backgroundImage
      if (!bg || bg === "none") continue
      for (const m of bg.matchAll(/url\("?([^")]+)"?\)/g)) {
        if (/^data:|\.svg(\?|$)/i.test(m[1])) continue
        bgs.push({ url: new URL(m[1], location.href).href, renderW: Math.round(el.getBoundingClientRect().width), cls: String(el.className).slice(0, 80) })
      }
    }
    const preloads = [...document.querySelectorAll('link[rel="preload"][as="image"]')].map((l) => l.href || l.getAttribute("imagesrcset"))
    return { imgs, bgs, preloads }
  })
  await ctx.close()
  // A DNS/network blip mid-crawl looks like dozens of broken images; let the
  // caller retry the page instead of reporting them.
  const netFail = responses.filter((x) => x.status === 0 && /ERR_(NAME_NOT_RESOLVED|NETWORK|INTERNET|CONNECTION|TIMED_OUT)/.test(x.failed ?? ""))
  if (netFail.length) throw Object.assign(new Error(`network: ${netFail[0].failed}`), { transient: true })
  dom.preloads = [...dom.preloads, ...htmlPreloads]
  return { url, viewport: vp.name, dpr: vp.dpr, initialBytes, responses, aboveFold, lcp, ...dom }
}

function analyzeLive(results) {
  const seenBytes = new Map() // url -> response, for the library-wide heaviest list
  for (const r of results) {
    const where = `${r.url.replace(BASE, "") || "/"} [${r.viewport}]`
    const byUrl = new Map(r.responses.map((x) => [x.url, x]))
    const total = r.responses.reduce((s, x) => s + (x.bytes ?? 0), 0)
    r.totalBytes = total
    if (total > BUDGET.pageFail) flag("FAIL", "page-image-weight", where, `${kb(total)} of images (budget ${kb(BUDGET.pageFail)})`)
    else if (total > BUDGET.pageWarn) flag("WARN", "page-image-weight", where, `${kb(total)} of images (target < ${kb(BUDGET.pageWarn)})`)

    for (const x of r.responses) {
      seenBytes.set(x.url, x)
      const name = shortUrl(x.url)
      if (x.failed || x.status >= 400) { flag("FAIL", "broken-image", where, `${name} → ${x.failed ?? x.status}`); continue }
      if (x.format === "svg+xml" || x.format === "svg") continue
      if (x.bytes > BUDGET.imgFail) flag("FAIL", "heavy-image", where, `${name} ${kb(x.bytes)} ${x.format}`)
      else if (x.bytes > BUDGET.imgWarn) flag("WARN", "heavy-image", where, `${name} ${kb(x.bytes)} ${x.format}`)
      if (!x.optimized && ["jpeg", "jpg", "png", "gif"].includes(x.format))
        flag("WARN", "unoptimized-raster", where, `${name} served raw as ${x.format} (${kb(x.bytes)}), bypasses next/image (no AVIF/WebP, no resizing)`)
      const maxAge = Number(/max-age=(\d+)/.exec(x.cache)?.[1] ?? 0)
      if (x.status === 200 && maxAge < BUDGET.minCacheSeconds && !/immutable/.test(x.cache))
        flag("WARN", "short-cache", where, `${name} cache-control: "${x.cache || "none"}"`)
    }

    for (const i of r.imgs) {
      if (!i.src || i.src.startsWith("data:") || /\.svg(\?|$)/i.test(i.src)) continue
      const name = shortUrl(i.src)
      const above = r.aboveFold.includes(i.src)
      if (i.alt === null) flag("WARN", "missing-alt", where, `${name} has no alt attribute`)
      if (i.visible && i.naturalW && i.renderW) {
        const needed = i.renderW * r.dpr
        if (i.naturalW > needed * BUDGET.oversizeRatio)
          flag("WARN", "oversized", where, `${name} intrinsic ${i.naturalW}px for ${i.renderW}px slot @${r.dpr}x (needs ~${needed}px)${i.sizes ? ` sizes="${i.sizes}"` : " (no sizes attr)"}`)
        else if (i.naturalW < i.renderW && i.renderW > 200)
          flag("WARN", "undersized", where, `${name} intrinsic ${i.naturalW}px stretched to ${i.renderW}px CSS (blurry even at 1x)`)
      }
      if (above && i.loading === "lazy") flag("WARN", "lazy-above-fold", where, `${name} is above the fold but loading="lazy"`)
      if (!above && i.visible && i.loading !== "lazy") flag("INFO", "eager-below-fold", where, `${name} below the fold but not lazy`)
      if (!i.hasDims && !i.absolute && i.visible) flag("INFO", "no-dimensions", where, `${name} has no width/height (layout-shift risk)`)
      if (!i.hasSrcset && byUrl.get(i.src)?.bytes > 50 * KB) flag("INFO", "no-srcset", where, `${name} has no srcset; every device gets the same file`)
    }

    if (r.lcp?.url && !r.lcp.url.startsWith("data:")) {
      // Several <img> can share one URL (the browser reuses a cached larger
      // srcset candidate, e.g. hidden nav thumbnails), so take the largest
      // visible match: that is the element that painted the LCP.
      const lcpImg = r.imgs
        .filter((i) => i.src === r.lcp.url)
        .sort((a, b) => Number(b.visible) - Number(a.visible) || b.renderW - a.renderW)[0]
      const res = byUrl.get(r.lcp.url)
      const name = shortUrl(r.lcp.url)
      if (lcpImg?.loading === "lazy") flag("FAIL", "lcp-lazy", where, `LCP image ${name} is loading="lazy"`)
      // Preload links carry the optimizer URL encoded (imagesrcset), so match
      // on the encoded source path.
      const lcpPath = new URL(r.lcp.url).searchParams.get("url") ?? new URL(r.lcp.url).pathname
      const preloaded = r.preloads.some((p) => p && (p.includes(encodeURIComponent(lcpPath)) || p.includes(lcpPath)))
      if (lcpImg && lcpImg.fetchpriority !== "high" && !preloaded)
        flag("WARN", "lcp-not-prioritized", where, `LCP image ${name} has no fetchpriority="high"/preload`)
      if (!lcpImg) flag("WARN", "lcp-css-background", where, `LCP is a CSS background (${name}); the browser discovers it late and it cannot be prioritized`)
      if (res?.bytes > BUDGET.lcpWarn) flag("WARN", "lcp-heavy", where, `LCP image ${name} is ${kb(res.bytes)} (target < ${kb(BUDGET.lcpWarn)})`)
    }

    for (const b of r.bgs) {
      const res = byUrl.get(b.url)
      if (!res) continue
      if (!res.optimized) flag("WARN", "css-background-raster", where, `${shortUrl(b.url)} as CSS background (${kb(res.bytes)}, ${b.renderW}px wide): not responsive, not AVIF/WebP. Element .${b.cls.split(" ")[0]}`)
    }
  }
  return [...seenBytes.values()].filter((x) => x.bytes).sort((a, b) => b.bytes - a.bytes).slice(0, 20)
}

function shortUrl(u) {
  try {
    const url = new URL(u)
    if (url.pathname === "/_next/image") {
      const p = url.searchParams
      return `${p.get("url")} (w=${p.get("w")}, q=${p.get("q")})`
    }
    return url.pathname
  } catch { return u }
}

async function livePass() {
  const urls = await pageList()
  console.log(`live: ${urls.length} pages x ${VIEWPORTS.length} viewports on ${BASE}`)
  const browser = await chromium.launch()
  const jobs = urls.flatMap((u) => VIEWPORTS.map((vp) => [u, vp]))
  const results = []
  let next = 0
  await Promise.all(Array.from({ length: CONCURRENCY }, async () => {
    while (next < jobs.length) {
      const [u, vp] = jobs[next++]
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          results.push(await auditPage(browser, u, vp))
          process.stdout.write(".")
          break
        } catch (e) {
          if (attempt === 3) flag("FAIL", "page-error", `${u} [${vp.name}]`, String(e.message).split("\n")[0])
          else await new Promise((r) => setTimeout(r, 3000))
        }
      }
    }
  }))
  await browser.close()
  console.log("")
  results.sort((a, b) => (a.url + a.viewport).localeCompare(b.url + b.viewport))
  return { results, heaviest: analyzeLive(results) }
}

// ---------------------------------------------------------------- repo pass

const NAME_OK = /^[a-z0-9]+(-[a-z0-9]+)*$/
const RASTER = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"])

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const p = join(dir, d.name)
    if (d.name.startsWith(".")) return []
    return d.isDirectory() ? [p, ...walk(p)] : [p]
  })
}

async function repoPass() {
  const root = "public/img"
  const entries = walk(root)
  const manifest = readFileSync("assets.manifest.json", "utf8")
  const files = []
  for (const p of entries) {
    const rel = relative("public", p)
    const isDir = statSync(p).isDirectory()
    const stem = isDir ? basename(p) : basename(p, extname(p))
    const ext = extname(p).toLowerCase()
    if (!NAME_OK.test(stem) || /^\d+$/.test(stem)) flag("WARN", "naming", `/${rel}`, `${isDir ? "folder" : "file"} name breaks ASSETS.md rules (lowercase kebab, descriptive)`)
    if (!isDir && extname(p) !== ext) flag("INFO", "naming", `/${rel}`, "uppercase extension")
    if (isDir || !RASTER.has(ext)) continue
    const bytes = statSync(p).size
    let meta = {}
    try { meta = await sharp(p).metadata() } catch { flag("FAIL", "corrupt-file", `/${rel}`, "sharp cannot read it") }
    const edge = Math.max(meta.width ?? 0, meta.height ?? 0)
    const inManifest = manifest.includes(rel)
    files.push({ path: `/${rel}`, bytes, width: meta.width, height: meta.height, format: meta.format, alpha: meta.hasAlpha, inManifest })
    if (bytes > BUDGET.sourceFail) flag("WARN", "heavy-source", `/${rel}`, `${kb(bytes)}, ${meta.width}x${meta.height}. Optimizer input; fine if only served via next/image, a problem anywhere it is served raw (CSS background, emails, decks)`)
    else if (bytes > BUDGET.sourceWarn) flag("INFO", "heavy-source", `/${rel}`, `${kb(bytes)}, ${meta.width}x${meta.height}`)
    if (edge > BUDGET.sourceMaxEdge) flag("INFO", "huge-dimensions", `/${rel}`, `${meta.width}x${meta.height}; nothing on the site renders wider than ~2900px at 2x`)
    if (meta.format === "png" && !meta.hasAlpha && bytes > 300 * KB) flag("WARN", "png-photo", `/${rel}`, `${kb(bytes)} opaque PNG; a photo should be JPEG/WebP source`)
    if (meta.format === "png" && meta.hasAlpha && bytes > 500 * KB) flag("INFO", "heavy-png-alpha", `/${rel}`, `${kb(bytes)} PNG with transparency; consider WebP/AVIF with alpha`)
  }
  files.sort((a, b) => b.bytes - a.bytes)
  return { count: files.length, totalBytes: files.reduce((s, f) => s + f.bytes, 0), heaviest: files.slice(0, 25) }
}

// ---------------------------------------------------------------- report

function report(live, repo) {
  const order = { FAIL: 0, WARN: 1, INFO: 2 }
  findings.sort((a, b) => order[a.sev] - order[b.sev] || a.rule.localeCompare(b.rule) || a.where.localeCompare(b.where))
  const count = (s) => findings.filter((f) => f.sev === s).length
  const lines = [
    `# Image audit ${DATE}`,
    "",
    `Base: ${BASE} · FAIL ${count("FAIL")} · WARN ${count("WARN")} · INFO ${count("INFO")}`,
    "",
  ]
  if (live) {
    lines.push("## Image weight per page", "", "First load = before any scrolling; full = after scrolling to the bottom.", "", "| Page | Mobile first load | Mobile full | Desktop first load | Desktop full | LCP (mobile) |", "|---|---|---|---|---|---|")
    const pages = [...new Set(live.results.map((r) => r.url))]
    for (const u of pages) {
      const m = live.results.find((r) => r.url === u && r.viewport === "mobile")
      const d = live.results.find((r) => r.url === u && r.viewport === "desktop")
      lines.push(`| ${u.replace(BASE, "") || "/"} | ${m ? kb(m.initialBytes) : "-"} | ${m ? kb(m.totalBytes) : "-"} | ${d ? kb(d.initialBytes) : "-"} | ${d ? kb(d.totalBytes) : "-"} | ${m?.lcp?.url ? shortUrl(m.lcp.url) : m?.lcp?.tag ?? "text"} |`)
    }
    lines.push("", "## Heaviest images served", "", "| Bytes | Format | Optimized | Image |", "|---|---|---|---|")
    for (const x of live.heaviest) lines.push(`| ${kb(x.bytes)} | ${x.format} | ${x.optimized ? "yes" : "**no**"} | ${shortUrl(x.url)} |`)
    lines.push("")
  }
  if (repo) {
    lines.push(`## Library (public/img): ${repo.count} rasters, ${kb(repo.totalBytes)}`, "", "| Bytes | Size | Format | In manifest | File |", "|---|---|---|---|---|")
    for (const f of repo.heaviest.slice(0, 15)) lines.push(`| ${kb(f.bytes)} | ${f.width}x${f.height} | ${f.format} | ${f.inManifest ? "yes" : "no"} | ${f.path} |`)
    lines.push("")
  }
  lines.push("## Findings", "")
  // Collapse the same rule+detail across pages so the list stays readable.
  const grouped = new Map()
  for (const f of findings) {
    const key = `${f.sev}|${f.rule}|${f.detail}`
    if (!grouped.has(key)) grouped.set(key, { ...f, wheres: [] })
    grouped.get(key).wheres.push(f.where)
  }
  for (const g of grouped.values()) {
    const w = g.wheres.length > 3 ? `${g.wheres.slice(0, 3).join(", ")} +${g.wheres.length - 3} more` : g.wheres.join(", ")
    lines.push(`- **${g.sev}** \`${g.rule}\` ${g.detail} — ${w}`)
  }
  return lines.join("\n") + "\n"
}

const live = ONLY === "repo" ? null : await livePass()
const repo = ONLY === "live" ? null : await repoPass()
writeFileSync(join(OUT, "results.json"), JSON.stringify({ base: BASE, date: DATE, budget: BUDGET, findings, live, repo }, null, 2))
writeFileSync(join(OUT, "report.md"), report(live, repo))
const c = (s) => findings.filter((f) => f.sev === s).length
console.log(`FAIL ${c("FAIL")} · WARN ${c("WARN")} · INFO ${c("INFO")} → ${join(OUT, "report.md")}`)
