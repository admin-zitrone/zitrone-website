"""Summarizes scripts/lighthouse-motion-compare.sh output.

    python3 scripts/lighthouse-motion-summary.py <out-dir>

Per route and condition: median and range of LCP, FCP, TBT and score, plus
Lighthouse's LCP phase breakdown (TTFB, resource load delay, load time,
element render delay). A render delay that disappears under reduced motion
points at the reveal animation; one that stays points elsewhere.
"""
import glob, json, os, statistics, sys, collections

d = sys.argv[1]
rows = collections.defaultdict(list)
for f in sorted(glob.glob(os.path.join(d, "*.json"))):
    if f.endswith("summary.json"):
        continue
    r = json.load(open(f))
    a = r["audits"]
    key = os.path.basename(f)[:-5].rsplit("_", 1)[0]
    phases = {}
    for item in (a.get("largest-contentful-paint-element", {}).get("details", {}).get("items") or []):
        for row in item.get("items", []):
            if "phase" in row:
                phases[row["phase"]] = row.get("timing")
    rows[key].append({
        "lcp": a["largest-contentful-paint"]["numericValue"],
        "fcp": a["first-contentful-paint"]["numericValue"],
        "tbt": a["total-blocking-time"]["numericValue"],
        "score": round(r["categories"]["performance"]["score"] * 100),
        "phases": phases,
    })

med = lambda xs: statistics.median(xs)
print("| Route | Motion | n | LCP s median (range) | FCP s | TBT ms | Score | TTFB | Load delay | Load time | Render delay |")
print("|---|---|---|---|---|---|---|---|---|---|---|")
summary = {}
for key in sorted(rows):
    runs = rows[key]
    route, motion = key.rsplit("_", 1)
    ph = lambda name: med([r["phases"].get(name, 0) or 0 for r in runs])
    lcps = [r["lcp"] for r in runs]
    line = (f"| /{route.replace('_', '/')} | {motion} | {len(runs)} | {med(lcps)/1000:.2f} ({min(lcps)/1000:.2f}–{max(lcps)/1000:.2f}) "
            f"| {med([r['fcp'] for r in runs])/1000:.2f} | {med([r['tbt'] for r in runs]):.0f} | {med([r['score'] for r in runs]):.0f} "
            f"| {ph('TTFB'):.0f} | {ph('Load Delay'):.0f} | {ph('Load Time'):.0f} | {ph('Render Delay'):.0f} |")
    print(line)
    summary[key] = runs
json.dump(summary, open(os.path.join(d, "summary.json"), "w"), indent=1)
