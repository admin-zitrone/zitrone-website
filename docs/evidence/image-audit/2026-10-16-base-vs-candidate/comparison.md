# Image audit comparison

Base: http://127.0.0.1:3106 (2026-10-16) · Candidate: http://127.0.0.1:3105 (2026-10-16)

First load = image bytes received before any scrolling (1.5 s after the `load` event). Full = after scrolling to the bottom in 0.7-viewport steps every 250 ms, then network idle + 0.8 s. LCP = bytes of the image the browser reported as Largest Contentful Paint.

## Totals

| | Base | Candidate | Change |
|---|---|---|---|
| First load, all 76 page views | 54427 KB | 41665 KB | -23% |
| Full scroll, all 76 page views | 56937 KB | 46634 KB | -18% |

## Per page (KB)

| Page | First base | First cand | Δ | Full base | Full cand | Δ | LCP base | LCP cand |
|---|---|---|---|---|---|---|---|---|
| /en [desktop] | 4145 | 1071 | -74% | 4477 | 2139 | -52% | 375 | 256 |
| /en [mobile] | 2241 | 432 | -81% | 2351 | 1050 | -55% | 85 | 85 |
| /en/blog [desktop] | 355 | 355 | 0% | 355 | 355 | 0% | 63 | 63 |
| /en/blog [mobile] | 167 | 167 | 0% | 167 | 167 | 0% | 63 | 63 |
| /en/blog/afternoon-slump-office-pantry [desktop] | 580 | 580 | 0% | 635 | 635 | 0% | 43 | 43 |
| /en/blog/afternoon-slump-office-pantry [mobile] | 242 | 242 | 0% | 363 | 363 | 0% | 43 | 43 |
| /en/blog/authors/zitrone-operations-team [desktop] | 342 | 342 | 0% | 342 | 342 | 0% | 33 | 33 |
| /en/blog/authors/zitrone-operations-team [mobile] | 167 | 167 | 0% | 167 | 167 | 0% | - | - |
| /en/blog/category/building-a-program [desktop] | 555 | 555 | 0% | 555 | 555 | 0% | 63 | 63 |
| /en/blog/category/building-a-program [mobile] | 133 | 133 | 0% | 133 | 133 | 0% | 63 | 63 |
| /en/blog/category/culture-retention [desktop] | 545 | 545 | 0% | 545 | 545 | 0% | 58 | 58 |
| /en/blog/category/culture-retention [mobile] | 123 | 123 | 0% | 123 | 123 | 0% | 58 | 58 |
| /en/blog/category/wellbeing-and-productivity [desktop] | 515 | 258 | -50% | 515 | 258 | -50% | 43 | 43 |
| /en/blog/category/wellbeing-and-productivity [mobile] | 93 | 93 | 0% | 93 | 93 | 0% | 43 | 43 |
| /en/blog/office-food-employee-retention [desktop] | 511 | 511 | 0% | 560 | 560 | 0% | 58 | 58 |
| /en/blog/office-food-employee-retention [mobile] | 207 | 207 | 0% | 313 | 313 | 0% | 58 | 58 |
| /en/blog/reviewers/zitrone-food-safety-and-operations [desktop] | 342 | 342 | 0% | 342 | 342 | 0% | 33 | 33 |
| /en/blog/reviewers/zitrone-food-safety-and-operations [mobile] | 167 | 167 | 0% | 167 | 167 | 0% | - | - |
| /en/blog/workplace-food-program-that-works [desktop] | 427 | 427 | 0% | 473 | 473 | 0% | 63 | 63 |
| /en/blog/workplace-food-program-that-works [mobile] | 162 | 162 | 0% | 263 | 263 | 0% | 63 | 63 |
| /en/contact [desktop] | 213 | 213 | 0% | 213 | 213 | 0% | - | - |
| /en/contact [mobile] | 2 | 2 | 0% | 2 | 2 | 0% | - | - |
| /en/privacy-notice [desktop] | 213 | 213 | 0% | 213 | 213 | 0% | - | - |
| /en/privacy-notice [mobile] | 2 | 2 | 0% | 2 | 2 | 0% | - | - |
| /en/services [desktop] | 1579 | 1389 | -12% | 1586 | 1395 | -12% | 106 | 106 |
| /en/services [mobile] | 906 | 906 | 0% | 1110 | 1110 | 0% | 59 | 59 |
| /en/services/coffee-water [desktop] | 894 | 797 | -11% | 901 | 804 | -11% | 129 | 129 |
| /en/services/coffee-water [mobile] | 381 | 381 | 0% | 393 | 393 | 0% | 61 | 61 |
| /en/services/corporate-cafe [desktop] | 1663 | 1362 | -18% | 1695 | 1368 | -19% | 338 | 338 |
| /en/services/corporate-cafe [mobile] | 782 | 782 | 0% | 794 | 794 | 0% | 161 | 161 |
| /en/services/corporate-catering [desktop] | 1413 | 1173 | -17% | 1419 | 1180 | -17% | 157 | 157 |
| /en/services/corporate-catering [mobile] | 802 | 802 | 0% | 814 | 814 | 0% | 105 | 105 |
| /en/services/corporate-dining [desktop] | 1711 | 1460 | -15% | 1718 | 1466 | -15% | 210 | 210 |
| /en/services/corporate-dining [mobile] | 839 | 839 | 0% | 850 | 850 | 0% | 85 | 85 |
| /en/services/pantry-restocking [desktop] | 1637 | 1268 | -23% | 1643 | 1275 | -22% | 72 | 72 |
| /en/services/pantry-restocking [mobile] | 717 | 717 | 0% | 728 | 728 | 0% | 43 | 43 |
| /en/services/service-carts [desktop] | 1012 | 944 | -7% | 1018 | 951 | -7% | 266 | 266 |
| /en/services/service-carts [mobile] | 577 | 577 | 0% | 589 | 589 | 0% | 266 | 266 |
| /es [desktop] | 3904 | 1071 | -73% | 4240 | 2139 | -50% | 375 | 256 |
| /es [mobile] | 2190 | 432 | -80% | 2300 | 1050 | -54% | 85 | 85 |
| /es/blog [desktop] | 355 | 355 | 0% | 355 | 355 | 0% | 63 | 63 |
| /es/blog [mobile] | 167 | 167 | 0% | 167 | 167 | 0% | 63 | 63 |
| /es/blog/authors/equipo-de-operaciones-zitrone [desktop] | 342 | 342 | 0% | 342 | 342 | 0% | 33 | 33 |
| /es/blog/authors/equipo-de-operaciones-zitrone [mobile] | 167 | 167 | 0% | 167 | 167 | 0% | - | - |
| /es/blog/caida-de-las-3pm-pantry-de-oficina [desktop] | 580 | 580 | 0% | 635 | 635 | 0% | 43 | 43 |
| /es/blog/caida-de-las-3pm-pantry-de-oficina [mobile] | 242 | 242 | 0% | 363 | 363 | 0% | 43 | 43 |
| /es/blog/category/building-a-program [desktop] | 555 | 555 | 0% | 555 | 555 | 0% | 63 | 63 |
| /es/blog/category/building-a-program [mobile] | 133 | 133 | 0% | 133 | 133 | 0% | 63 | 63 |
| /es/blog/category/culture-retention [desktop] | 545 | 545 | 0% | 545 | 545 | 0% | 58 | 58 |
| /es/blog/category/culture-retention [mobile] | 123 | 123 | 0% | 123 | 123 | 0% | 58 | 58 |
| /es/blog/category/wellbeing-and-productivity [desktop] | 515 | 515 | 0% | 515 | 515 | 0% | 43 | 43 |
| /es/blog/category/wellbeing-and-productivity [mobile] | 93 | 93 | 0% | 93 | 93 | 0% | 43 | 43 |
| /es/blog/comida-en-la-oficina-y-retencion-de-talento [desktop] | 511 | 511 | 0% | 560 | 560 | 0% | 58 | 58 |
| /es/blog/comida-en-la-oficina-y-retencion-de-talento [mobile] | 207 | 207 | 0% | 313 | 313 | 0% | 58 | 58 |
| /es/blog/como-construir-un-programa-de-alimentacion-corporativa [desktop] | 427 | 427 | 0% | 473 | 473 | 0% | 63 | 63 |
| /es/blog/como-construir-un-programa-de-alimentacion-corporativa [mobile] | 162 | 162 | 0% | 263 | 263 | 0% | - | - |
| /es/blog/reviewers/seguridad-alimentaria-y-operaciones-zitrone [desktop] | 342 | 342 | 0% | 342 | 342 | 0% | 33 | 33 |
| /es/blog/reviewers/seguridad-alimentaria-y-operaciones-zitrone [mobile] | 167 | 167 | 0% | 167 | 167 | 0% | - | - |
| /es/contact [desktop] | 213 | 213 | 0% | 213 | 213 | 0% | - | - |
| /es/contact [mobile] | 2 | 2 | 0% | 2 | 2 | 0% | - | - |
| /es/privacy-notice [desktop] | 213 | 213 | 0% | 213 | 213 | 0% | - | - |
| /es/privacy-notice [mobile] | 2 | 2 | 0% | 2 | 2 | 0% | - | - |
| /es/services [desktop] | 1579 | 1389 | -12% | 1586 | 1395 | -12% | 106 | 106 |
| /es/services [mobile] | 906 | 906 | 0% | 1110 | 1110 | 0% | 59 | 59 |
| /es/services/cafe-y-agua [desktop] | 894 | 797 | -11% | 901 | 804 | -11% | 129 | 129 |
| /es/services/cafe-y-agua [mobile] | 381 | 381 | 0% | 393 | 393 | 0% | 61 | 61 |
| /es/services/cafeteria-corporativa [desktop] | 1663 | 1362 | -18% | 1670 | 1368 | -18% | 338 | 338 |
| /es/services/cafeteria-corporativa [mobile] | 782 | 782 | 0% | 794 | 794 | 0% | 161 | 161 |
| /es/services/carritos-de-servicio [desktop] | 1012 | 944 | -7% | 1018 | 951 | -7% | 266 | 266 |
| /es/services/carritos-de-servicio [mobile] | 577 | 577 | 0% | 589 | 589 | 0% | 266 | 266 |
| /es/services/catering-corporativo [desktop] | 1413 | 1173 | -17% | 1419 | 1180 | -17% | 157 | 157 |
| /es/services/catering-corporativo [mobile] | 802 | 802 | 0% | 814 | 814 | 0% | 105 | 105 |
| /es/services/comedor-corporativo [desktop] | 1711 | 1460 | -15% | 1718 | 1466 | -15% | 210 | 210 |
| /es/services/comedor-corporativo [mobile] | 839 | 839 | 0% | 850 | 850 | 0% | 85 | 85 |
| /es/services/pantry-y-restocking [desktop] | 1637 | 1268 | -23% | 1643 | 1275 | -22% | 72 | 72 |
| /es/services/pantry-y-restocking [mobile] | 717 | 717 | 0% | 728 | 728 | 0% | 43 | 43 |

## Findings by rule

| Rule | Base | Candidate |
|---|---|---|
| FAIL heavy-image | 4 | 0 |
| FAIL lcp-lazy | 4 | 0 |
| FAIL page-image-weight | 2 | 0 |
| INFO eager-below-fold | 80 | 11 |
| WARN heavy-image | 66 | 54 |
| WARN lazy-above-fold | 21 | 8 |
| WARN lcp-heavy | 16 | 16 |
| WARN lcp-not-prioritized | 4 | 0 |
| WARN oversized | 14 | 2 |
| WARN page-image-weight | 10 | 2 |
| WARN undersized | 18 | 18 |
