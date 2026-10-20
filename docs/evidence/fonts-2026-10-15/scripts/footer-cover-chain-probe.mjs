import { chromium } from "playwright"
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1280, height: 720 } })
await p.goto("http://127.0.0.1:3202/en")
await p.getByRole("button", { name: "Accept all" }).click()
const chain = (sel) => p.evaluate((sel) => {
  let el = sel === "btn" ? [...document.querySelectorAll("button")].find(b => b.textContent.trim() === "Cookie preferences") : document.elementFromPoint(640, 650)
  const out = []
  while (el && el !== document.documentElement) { const cs = getComputedStyle(el); const r = el.getBoundingClientRect(); out.push(`${el.tagName}.${String(el.className).split(" ")[0]} pos=${cs.position} z=${cs.zIndex} top=${Math.round(r.top)} h=${Math.round(r.height)}`); el = el.parentElement }
  return out.join("\n")
}, sel)
console.log("BUTTON CHAIN\n" + await chain("btn")); console.log("\nHIT CHAIN at 640,650\n" + await chain("hit"))
console.log("\nscrollY", await p.evaluate(() => scrollY), "innerH", 720)
await b.close()
