# Evidencia de imágenes: base vs candidato (16-oct-2026)

Responde a los pendientes 1 y 2 de `docs/revision-imagenes-2026-10-15.md` (repositorio principal). No se integró ni desplegó nada; los commits quedan para revisión en `perf/images-loading` (modalidad 2: despliega Arroba).

| | SHA | Qué es |
|---|---|---|
| Base | `f5796950eb75727388313ead0855bcf3aeaba227` | Punto de partida de la rama (antes de cualquier cambio de imágenes) |
| Candidato | `4624c683c4e18e3185b2c944abd004385d59c250` | Código medido. Los commits posteriores de la rama solo agregan esta carpeta y scripts de medición |

Entorno (`environment.txt`): macOS 26.5.2, Apple M4 Pro, Node 25.8.1, Next.js 16.2.10, Playwright 1.59.1, Chromium 147.0.7727.15. Ambas versiones con `npm run build` + `next start` locales (base en :3106, candidato en :3105), mismo `node_modules` (clon APFS), mismo `.env.local`. Horarios de ejecución en `timing.txt`.

## Cómo reproducir

`run.sh` contiene los comandos exactos que generaron esta carpeta, incluidas las instrucciones para levantar ambas versiones. Pasos:

1. `scripts/image-audit.mjs` contra las 38 rutas del sitemap de producción (`pages.txt`), móvil 390 px @3x y escritorio 1440 px @2x, en ambas versiones en paralelo.
2. `scripts/image-audit-compare.mjs results-base.json.gz results-candidate.json.gz` → `comparison.md`.
3. `scripts/hero-rotation-check.mjs` contra el candidato → `hero-rotation.txt` / `.json`.
4. `scripts/visual-compare.mjs` base vs candidato → `visual.txt`, `visual/`.

El paso 4 se volvió a ejecutar aparte (ver `timing.txt`): en el primer intento el servidor base perdió la conexión a Postgres (`read ETIMEDOUT`) y una página no terminó de cargar en 90 s. Desde entonces el script reintenta cada página y, si sigue fallando, la registra en vez de abortar.

## Muestreo

- **Primera carga:** bytes de imágenes recibidos antes de desplazarse (1.5 s después del evento `load`), por página y viewport.
- **Completa:** tras desplazarse hasta el final en pasos de 0.7 viewport cada 250 ms, más network idle y 0.8 s.
- **LCP:** bytes de la imagen que el navegador reportó como Largest Contentful Paint.
- Terceros (GTM/GA) bloqueados; contexto nuevo (caché fría) por página.
- Salidas crudas: `results-*.json.gz` (cada respuesta de imagen, cada `<img>` en el DOM, LCP, preloads), `report-*.md`, `raw-*.log`.

## Resultados

| | Base | Candidato | Cambio |
|---|---|---|---|
| Primera carga, 76 vistas (38 páginas × 2 viewports) | 54 427 KB | 41 665 KB | −23 % |
| Desplazamiento completo, 76 vistas | 56 937 KB | 46 634 KB | −18 % |
| Inicio móvil, primera carga | 2 190 KB | 432 KB | −80 % |
| Inicio escritorio, primera carga | 3 904 KB | 1 071 KB | −73 % |
| Imagen LCP del inicio, escritorio | 375 KB | 256 KB | −32 % |
| Hallazgos FAIL | 10 | 0 | |

Tabla completa por página y por regla en `comparison.md`. Las páginas de servicio bajan 7–23 % en escritorio y no cambian en móvil, donde ya recibían el tamaño correcto.

## Hero bajo carga lenta y errores (pendiente 1)

`hero-rotation.txt`: 13/13 PASS (y 13/13 en tres corridas consecutivas previas). Cada escenario usa caché fría, escritorio 1440 @2x, y muestrea cada 200 ms:

- **normal:** recorre los 4 cuadros; cada cuadro estaba cargado al activarse; cada foto conserva su palabra acentuada.
- **late:** la respuesta del 3.er cuadro se retiene 14 s. La foto anterior y su palabra se mantienen hasta que llega (aparece a los ~20.4 s en vez de ~12 s) y la rotación sigue.
- **error:** la petición del 4.º cuadro se aborta. Nunca se muestra, la rotación lo salta y vuelve al primero.
- **slow3g:** 400 kbps / 400 ms RTT durante toda la visita. Ningún cuadro se activa sin estar cargado. El primero se sostiene ~46 s hasta que el segundo está listo.

El primer cuadro se excluye de "cargado al activarse": viene activo desde el servidor (es el LCP), así que en red lenta está activo antes de terminar de cargar. Así funcionaba ya en la base.

Dos defectos que encontró esta prueba quedaron corregidos en `7b25f05` y `4624c68`: los manejadores en línea hacían que `next/image` reasignara `img.src` de todos los cuadros en cada rotación, y `onError` lo reasignaba en el cuadro LCP al hidratar.

## Comparación visual

`visual.txt`: 16 capturas de página completa (8 rutas × escritorio y móvil), con movimiento reducido, consentimiento respondido y la página recorrida antes de capturar, igual que `tests/e2e/visual.spec.ts`. Diez son idénticas píxel a píxel y ninguna cambia de altura. Las seis diferencias son remuestreo dentro de fotos, por el `sizes` corregido:

| Ruta | Cambio | Causa verificada |
|---|---|---|
| `/es`, `/en` escritorio | 0.17 % | Tarjeta del carrusel de servicios: misma foto y encuadre, archivo más chico (antes ~1.5–3× el ancho necesario) |
| `/es/services/comedor-corporativo` móvil | 1.5 % | Rotador de "El servicio": la base descargaba 640w para un hueco de 356 px CSS a 1×; el candidato descarga 384w |
| `/es/services/carritos-de-servicio` móvil | 0.27 % | Mismo rotador |
| `/es/blog/category/culture-retention` móvil | 0.07 % | Imagen principal con `sizes` nuevo |

Base, candidato y máscara de diferencias de las capturas que cambian más de 0.1 % están en `visual/`. Las líneas base de `tests/e2e/visual.spec.ts-snapshots` están desactualizadas: el inicio falla también en la base, con la misma altura que el candidato. Por eso se comparó base contra candidato directamente.

## Alcance y límites

- Son bytes de un optimizador local. Los de Vercel son distintos (el AVIF local pesa más), así que esto no certifica producción. Solo la comparación base/candidato es válida. Tras el despliegue de Arroba, `npm run images:audit` contra el sitio publicado da las cifras reales.
- Menos bytes de imágenes no implica la misma reducción en el tiempo total de carga. No se midió LCP en tiempo ni con red limitada, salvo en el hero.
- La comparación visual se hizo a 1× (densidad por defecto). El cambio de selección de `srcset` en pantallas 2–3× se ve en `comparison.md`.
- `docs/evidence/image-audit/2026-10-15/report.md` es la auditoría anterior del sitio publicado (www.zitrone.mx). Se conserva como referencia de producción y no es comparable byte a byte con esta carpeta.
- Fuera de alcance, documentado como mejora editorial: `carrito-zitrone` (vertical, 1134 px, se estira en el hero de escritorio), `cafeteria/coffee-bar` (pesa por detalle real: mural de líneas), y las tres portadas del blog (1200×630, tamaño de vista previa social).
