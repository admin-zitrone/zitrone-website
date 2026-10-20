import json, glob, os, statistics, collections, sys
d=sys.argv[1]
rows=collections.defaultdict(list); meta={}
for f in sorted(glob.glob(os.path.join(d,'*.json'))):
    if f.endswith('summary.json'): continue
    r=json.load(open(f)); a=r['audits']
    base=os.path.basename(f)[:-5]; key=base.rsplit('_',1)[0]
    rows[key].append({'score':round(r['categories']['performance']['score']*100),
      'lcp':a['largest-contentful-paint']['numericValue'],'cls':a['cumulative-layout-shift']['numericValue'],
      'tbt':a['total-blocking-time']['numericValue'],'fcp':a['first-contentful-paint']['numericValue'],
      'si':a['speed-index']['numericValue'],'lcpEl':(a.get('largest-contentful-paint-element',{}).get('details',{}).get('items') or [{}])[0].get('items',[{}])[0].get('node',{}).get('selector','') if a.get('largest-contentful-paint-element') else ''})
    meta={'lighthouse':r['lighthouseVersion'],'userAgent':r['environment']['hostUserAgent'],'benchmarkIndex':r['environment'].get('benchmarkIndex'),
          'throttling':{k:r['configSettings']['formFactor']+':'+json.dumps(r['configSettings']['throttling']) for k in ['x']}['x']}
out={'meta':meta,'results':{}}
lines=['| Ruta | Dispositivo | n | Score (mediana, rango) | LCP s | CLS | TBT ms | FCP s | SI s |','|---|---|---|---|---|---|---|---|---|']
for key,runs in rows.items():
    route,ff=key.rsplit('_',1)
    med=lambda k: statistics.median([x[k] for x in runs]); rng=lambda k: (min(x[k] for x in runs), max(x[k] for x in runs))
    out['results'][key]={'runs':runs}
    lines.append(f"| /{route.replace('_','/')} | {ff} | {len(runs)} | {med('score'):.0f} ({rng('score')[0]}–{rng('score')[1]}) | {med('lcp')/1000:.2f} ({rng('lcp')[0]/1000:.2f}–{rng('lcp')[1]/1000:.2f}) | {med('cls'):.3f} | {med('tbt'):.0f} ({rng('tbt')[0]:.0f}–{rng('tbt')[1]:.0f}) | {med('fcp')/1000:.2f} | {med('si')/1000:.2f} |")
json.dump(out,open(os.path.join(d,'summary.json'),'w'),indent=1)
print(json.dumps(meta,indent=1)); print('\n'.join(lines))
for key,runs in rows.items(): print(key,'LCP element:',runs[0]['lcpEl'])
