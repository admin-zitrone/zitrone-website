# Performance móvil: qué se midió y qué falta demostrar

7 de octubre de 2026, Claude; acotado el 12 de octubre tras la revisión de Codex (R6, [codex-review-2026-10-11.md](codex-review-2026-10-11.md)). Responde al pendiente de Codex ("comparativo controlado para atribuir el LCP móvil"). Build de producción local (`next start`), Lighthouse 12.8.2, perfil móvil (4× CPU, slow 4G), dominios de Google bloqueados (sin costo de GTM). Resúmenes por corrida: `evidence/followups-2026-10-07/perf/` (medianas abajo).

## Lo que está medido

| Experimento (mismo build y servidor), mediana | /es/contact LCP | /es/contact FCP | /es LCP | /es FCP |
| --- | --- | --- | --- | --- |
| Simulado (Lantern, por defecto), movimiento normal, 5 corridas | 4.22 s | 1.35 s | 6.77 s | 1.36 s |
| Simulado, `--force-prefers-reduced-motion`, 5 | 4.14 s | 1.35 s | 6.77 s | 1.35 s |
| Simulado, fuentes web bloqueadas, 3 | 5.35 s | **3.16 s** | — | — |
| Simulado, JS de la app bloqueado, 3 | — | — | 6.92 s | 1.66 s |
| Throttling real (DevTools), movimiento normal, 3 | 3.17 s | 3.17 s | 3.46 s | 3.46 s |
| Throttling real, movimiento reducido, 3 | 3.16 s | 3.16 s | 3.46 s | 3.46 s |
| Throttling real, fuente serif sin `preload`, 3 | 3.17 s | 3.17 s | 3.47 s | 3.47 s |

Conclusiones que estos datos sostienen, solo para estas dos rutas y estas condiciones:

1. **Reducir el movimiento no cambia el LCP** de forma apreciable: con throttling real, contacto 3165 → 3164 ms y home 3461 → 3462 ms; en modo simulado, contacto 4.22 → 4.14 s y home sin cambio. La hipótesis de julio y del informe del 30-sep (la animación de entrada como causa del LCP móvil) no se confirma en estas rutas.
2. Con throttling real, el LCP coincide con el FCP en ambas rutas: después de la primera pintura no hay retraso adicional del elemento LCP. Esto **no** identifica qué causa la demora previa a la primera pintura (~2.6 s entre TTFB y FCP).
3. El modo simulado da LCP más altos (4.1–6.9 s) que el throttling real (3.2–3.5 s) con el mismo build. Las cifras móviles del 30-sep (4.6–7.6 s) son de modo simulado.
4. Quitar el `preload` de la fuente serif no cambia FCP ni LCP. Es una intervención distinta de bloquear todas las fuentes, que **sí** retrasa la primera pintura en modo simulado (contacto FCP 1.35 → 3.16 s). Las fuentes no quedan descartadas como contribución al tiempo de pintura.

## Candidato a investigar (no demostrado)

Una sola hoja de estilos global, render-blocking en todas las páginas: 458 KB sin comprimir (≈68 KB gzip medido en local). Lighthouse reporta 66 % sin usar en contacto y 53 % en home. Es un candidato razonable para la demora previa a la primera pintura, pero **no hay una intervención sobre el CSS** en este estudio, ni trazas conservadas que cuantifiquen su peso frente a red, HTML o fuentes. El porcentaje sin usar tampoco equivale a bytes gzip que se ahorrarían dividiendo por ruta (las reglas comunes se repiten y comprimen distinto), así que no se da una cifra de ahorro.

Para convertirlo en diagnóstico haría falta, con comandos y configuración guardados: un comparativo que intervenga sobre el CSS conservando el contenido y el aspecto visual (p. ej. una variante con solo el CSS usado por la ruta), trazas de rendimiento con el elemento LCP identificado y la cascada de red, y bytes comprimidos medidos de cada variante.

## Reproducibilidad

- Reproducible con scripts versionados: el comparativo normal / movimiento reducido en modo simulado (`scripts/lighthouse-motion-compare.sh`, `scripts/lighthouse-motion-summary.py`; corridas base con `scripts/lighthouse-runs.sh`).
- **No** versionadas: las variantes con throttling real (DevTools), sin JS, sin fuentes y sin `preload` de la serif. Se ejecutaron con comandos ad hoc que no se conservaron. Los JSON guardados son resúmenes (LCP, FCP, TBT, puntaje, fases), sin configuración, elemento LCP, cascada ni cobertura CSS; no permiten reconstruir esas variantes.

## Recomendación (no aplicada)

Objetivo razonable: FCP/LCP móvil < 2.5 s en laboratorio con throttling real, confirmado con datos de campo (Speed Insights/CrUX) tras publicar.

- No hace falta tocar la coreografía de animación por rendimiento en estas rutas.
- Antes de cualquier refactor, hacer el comparativo de CSS descrito arriba. Si confirma el efecto, dividir `marketing.css` por superficie (home, servicios, blog, contacto, común) o extraer CSS crítico inline; ambas son cambios estructurales del sistema de diseño que requieren `npm run test:visual` y revisión visual de las 9 plantillas ES/EN, sin mezclarse con otros cambios.

Límites: localhost sin CDN ni compresión Brotli de Vercel; sin GTM; un solo equipo (Mac mini); dos rutas. Los números de producción serán distintos.
