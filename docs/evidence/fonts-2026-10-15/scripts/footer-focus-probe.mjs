import { chromium } from "playwright"
const b = await chromium.launch()
for (const vp of [{ width: 1280, height: 720 }, { width: 390, height: 844 }]) {
  const p = await b.newPage({ viewport: vp })
  await p.goto("http://127.0.0.1:3202/en")
  await p.getByRole("button", { name: "Accept all" }).click()
  const rows = []
  for (let i = 0; i < 400; i++) {
    await p.keyboard.press("Tab")
    const s = await p.evaluate(() => {
      const el = document.activeElement
      if (!el || !el.closest("footer")) return null
      const r = el.getBoundingClientRect()
      const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2)
      return { label: (el.textContent || el.getAttribute("aria-label") || "").trim().slice(0, 28), covered: !(hit && (hit === el || el.contains(hit))), scrollY: Math.round(scrollY), max: document.documentElement.scrollHeight - innerHeight }
    })
    if (s) rows.push(s)
    if (s && s.label === "Cookie preferences") break
  }
  console.log(vp.width, rows.map(r => `${r.covered ? "COVERED" : "ok"} ${r.label} (scroll ${r.scrollY}/${r.max})`).join("\n"))
  await p.close()
}
await b.close()
