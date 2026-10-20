# Resultados de la remediación (Claude) — para revisión de Codex

| | |
| --- | --- |
| Fecha | 30 de septiembre de 2026 (America/Mexico_City) |
| Rama | `design-system/type-unification` |
| Baseline auditado | `7d67dac` |
| Commit de código verificado | Ronda 1: `69c2fb2a5b265da874bebfc2a51b8ee2c82e95e6`. **Ronda 2 (R1–R4): `4776a34`** (ver sección siguiente) |
| Node | **25.8.1** local. CI y Vercel usan 24.x; no hay Node 24 instalado en esta máquina. Diferencia no verificada. |
| Entorno | macOS, `next build` + `next start` locales; `.env.local` apunta al CMS alojado (solo lectura en builds); Docker `zitrone-staging-pg` (Postgres 16) para bases desechables |

**Decisión: listo para revisión de Codex. No es aceptación final.** No se desplegó, no se migró ni escribió en la base alojada, no se tocó DNS/GTM/Ads, no se envió correo ni mensajes a terceros. Lecturas externas hechas: `vercel project/domains inspect`, `vercel ls`, `dig`, `curl` a los cuatro hosts, `payload migrate:status` y un conteo de artículos publicados en el CMS alojado.

## Decisión final de facturación — 12 de octubre de 2026

El usuario reconfirma que el flujo de facturación del sitio está **eliminado**, no pendiente ni diferido. La solución final es únicamente el enlace de correo. No se debe proponer formulario, API, webhook, cola, carga de archivos o automatización como trabajo de entrega. BILL-01 cerrado. La migración `remove_billing_page` es limpieza de tablas antiguas, no desarrollo de un flujo. Esta decisión sustituye cualquier pendiente de facturación descrito en informes anteriores.

## Ronda 3 — correcciones a la revisión de Codex (R5, R6), 12 de octubre de 2026

Revisión: [codex-review-2026-10-11.md](codex-review-2026-10-11.md). Evidencia: `evidence/r5-r6-2026-10-12/`. Node 25.8.1 local; CI no se ha ejecutado en GitHub (nada empujado).

| # | Corrección | Commit | Prueba |
| --- | --- | --- | --- |
| R5 (P1) | `scripts/lib/test-pg-url.mjs` valida `TEST_PG_URL` (esquema postgres, solo 127.0.0.1/localhost, sin query ni fragmento, una base, usuario obligatorio) y emite valores normalizados. `test-db.sh` lo ejecuta como comando propio y sale antes de definir `psql_admin` si falla; `psql_admin` construye el cliente `pg` solo con esos campos (nunca la URL original), en entorno vacío y con el guard de red. Modo Docker se detiene si no resuelve el contenedor. Los runners arman `DATABASE_URL` con los valores normalizados | `60228aa` | `test:scripts` **12/12**: 9 URLs rechazadas (host remoto, URL malformada, `?host=`, `?hostaddr=`, otras opciones, otro esquema, host parecido a loopback, sin usuario, ruta anidada) salen con código ≠ 0, **cero conexiones** y **cero llamadas a docker**; URL local válida conecta solo a 127.0.0.1; modo Docker válido y con contenedor ausente. 11 de 12 fallan con el helper anterior. Reproducción de Codex: ya no imprime `VALIDATION_DID_NOT_STOP`. `test:api` 30/30 en modo Docker y en modo URL; `test:cache` 4/4 en modo URL (ruta de CI) y en Docker |
| R6 (P2) | Informe de performance acotado: se conserva el resultado de movimiento (sin efecto en LCP en contacto y home), LCP = FCP con throttling real como observación; el CSS global pasa a **candidato sin demostrar**; se retira la cifra de ahorro gzip; se corrige "fuentes no mueven la primera pintura" (bloquear fuentes sí retrasa el FCP simulado; solo el `preload` de la serif no influye); se declara qué variantes no son reproducibles desde el repo | este commit | [performance-mobile-2026-10-07.md](performance-mobile-2026-10-07.md) |

Sin resolver, fuera de R5/R6: el build de `test:cache` en modo Docker falló una vez con `next/font/google queries have exactly one entry` (Turbopack, build consecutivo) y pasó al repetir; Codex vio el mismo error. Log conservado (`test-cache-docker-intermittent-font-failure.log`). Causa no investigada.

Los commits `a550ac5` y `d3463a8` (verde de marca, decisión del usuario del 11-oct) no forman parte de R5/R6; `d3463a8` tiene su propia corrida de `test:a11y` (21/21).

## Decisiones del usuario aplicadas (7–8 de octubre de 2026)

| Decisión | Resultado | Commit | Evidencia |
| --- | --- | --- | --- |
| Rol de ventas en vez de admin-only | Rol `sales`: lee leads, cambia estado/notas, exporta; no edita contenido ni borra leads. Contenido y **globals** ahora solo admin/editor (los globals antes no tenían regla de update: cualquier usuario autenticado podía editarlos). Migración `20261008_133454_sales_role` (aditiva; `down` se niega si existen usuarios sales), generada y probada solo en base desechable | `5c4b200` | `test:api` **30/30** (6 nuevas de roles) |
| Cifra: mantener "Comidas diarias…" | Sin cambio de código; registro de afirmaciones actualizado. La cifra sigue pendiente de confirmación de Zitrone | este commit | `registro-de-afirmaciones.md` fila 1 |
| Acento verde | **Revertido** (11-oct): el usuario rechaza lime-600/lime-700, no son colores de marca. El acento vuelve a `lime-500` en todo el sitio y se restaura la excepción de contraste documentada en la suite (fondos claros 2.1–2.25:1), pendiente de aceptación por escrito | `480de85` revertido | a11y con excepción, como el 30-sep |
| Ruta de `zitrone.com.mx` | **Sin decidir** por el usuario; la ficha de corte y el mensaje a Arroba siguen sin enviar | — | — |

Para desplegar el rol sales hace falta aplicar `20261008_133454_sales_role` (y la pendiente `20260930_042253_remove_billing_page`) en la base alojada, con respaldo previo y autorización. Luego un admin crea las cuentas de ventas.

Gates finales en `480de85` + documentos: lint ✓ · tsc ✓ · design:audit ✓ · contratos 83/83 · test:api 30/30 · test:cache 4/4 · test:a11y 21/21 · test:e2e 61/61.

## Seguimiento tras la aprobación de Codex (7 de octubre de 2026)

| Pendiente de Codex | Estado | Commit | Evidencia |
| --- | --- | --- | --- |
| `test:api` y `test:cache` en CI | DONE local; **sin ejecutar en GitHub** (nada empujado) | `08d5df9` | Job `isolated-api` con `postgres:16-alpine` y Node 24. Runners aceptan `TEST_PG_URL` (cliente `pg` del proyecto) o el contenedor Docker. Probado en ambos modos |
| Validar con Node 24 | DONE local | `08d5df9` | Node 24.21.0 (descarga verificada por checksum, no instalada en el sistema): lint, tsc, contratos 83/83, API 24/24, caché 4/4, E2E 61/61 (`evidence/followups-2026-10-07/node24-*.log`) |
| Causa del LCP móvil | PARCIAL: movimiento descartado en las rutas medidas; causa previa a la primera pintura sin demostrar (acotado el 12-oct, R6) | `101b6a8` | [performance-mobile-2026-10-07.md](performance-mobile-2026-10-07.md): reducir movimiento no cambia el LCP (contacto y home); LCP = FCP con throttling real; la hoja de estilos global (53–66 % sin usar) es un candidato, sin intervención que lo demuestre |

Nota honesta: en 6 corridas de `test:api` tras el refactor del runner hubo **1 fallo intermitente** (la primera, en modo Docker) cuya salida no se conservó; las 5 siguientes (Docker y URL) pasaron 24/24. No reproducido.

## Ronda 2 — correcciones a la revisión de Codex (R1–R4), 2 de octubre de 2026

Revisión: [codex-review-2026-10-01.md](codex-review-2026-10-01.md) (commit `9e725d0`, sin cambios). Commit verificado: **`4776a34`**. Evidencia: `evidence/remediation-r1-r4-2026-10-02/`. Node 25.8.1 local. Nada desplegado; la base alojada no se usó (ni en lectura) en esta ronda.

| R-ID | Estado | Causa confirmada | Cambio | Commit | Prueba / evidencia |
| --- | --- | --- | --- | --- | --- |
| R1 · caché del blog | DONE (local) | `revalidatePath('/es/blog','layout')` registra `_N_T_/es/blog/layout`; las páginas llevan `_N_T_/[locale]/blog/layout` (revalidatePath trabaja sobre la estructura de rutas). Nada se invalidaba. También `revalidateBlogIndex` (categorías, ajustes del sitio) solo tocaba el índice | Una llamada `revalidatePath('/[locale]/blog','layout')` + `/sitemap.xml`; categorías/ajustes usan el mismo árbol | `40c7bc9` | `npm run test:cache`: build + `next start` contra base desechable, hooks activos; artículo ES/EN precalentado con `x-nextjs-cache: HIT`; editar → visible en la 1.ª visita; despublicar → 404 ES y EN en la 1.ª visita, fuera del índice, sitemap y feed; republicar → vuelve. **4/4**; con el hook anterior **1/4** (HIT con contenido viejo tras editar): `test-cache-against-old-hook.log` |
| R2 · E2E completo | DONE (local) | Las suites de contacto/ubicación corren con movimiento normal y axe muestreaba controles a mitad de transición (2.46, 3.35, 3.48:1). Una vez estables pasan AA | `scanSettled()` (`tests/e2e/fixtures/axe.ts`): espera una condición real (ninguna animación/transición finita activa en el elemento, dentro o en un ancestro; bucles infinitos ignorados; timeout si nunca se asienta). Sin reglas quitadas, sin excepciones nuevas, sin sleeps; las jornadas siguen con movimiento normal. `playwright.config.ts` fija `NEXT_PUBLIC_SITE_URL=https://www.zitrone.mx` para el servidor de pruebas | `8324a2b` | `test:e2e` **61/61 cuatro veces seguidas** (3 en `8324a2b`, carga del sistema hasta ~13; 1 en `4776a34`), sin variables extra |
| R3 · lectura del cuerpo | DONE | `reader.read()` fuera del try: un cuerpo que falla a medias rechazaba fuera del manejo de la ruta | `read_failed` capturado, `releaseLock` en `finally`, ruta responde 400 `INVALID_BODY`; 413 y error de persistencia sin cambio | `6cbfc49` | 2 contratos nuevos (stream que falla tras el primer chunk; respuesta de la ruta). Contratos **83/83** |
| R4 · aislamiento | DONE | Runners heredaban el entorno (p. ej. `OPENAI_API_KEY` → hook de embeddings) | `env -i` en `test:api` y en el simulacro de respaldo; `NODE_OPTIONS` precarga `tests/api/network-guard.mjs` (rechaza y registra fetch/TCP/TLS no loopback) en el proceso de prueba, el CLI de migración y procesos hijos. `test:cache` usa el mismo guard en `next start` y vacía las credenciales también para `next build` | `595c5fd` | `network-isolation.test.ts`: sin credenciales heredadas; fetch externo rechazado; guardar un artículo con clave OpenAI falsa → intento a `api.openai.com` bloqueado y el guardado sigue. `test:api` **24/24** |
| Lighthouse reproducible | DONE | Faltaba el comando exacto | `scripts/lighthouse-runs.sh` + `scripts/lighthouse-summary.py` | `4776a34` | — (cifras de la ronda 1 no se volvieron a medir) |

Límites de R4, explícitos: el guard cubre red de Node (fetch, `net`, `tls`); no aísla el sistema de archivos ni Docker. `next build` en `test:cache` no lleva el guard (necesita descargar Google Fonts), pero corre con todas las credenciales de proveedores vacías y no guarda contenido.

Gates en `4776a34` (logs en la carpeta de evidencia): env:check ✓ · lint 0/0 · tsc ✓ · email:check ✓ · design:audit ✓ (511 en baseline) · contratos 83/83 · test:api 24/24 · test:cache 4/4 · test:contact 27/27 · test:migration 31/31 · **test:e2e 61/61** · assets:check ✓ (tras build). El build vuelve a escribir la fecha en `tokens.generated.json`; se restauró.

Pendiente de la revisión (seguimiento, no R): `test:api`/`test:cache` en CI con Postgres efímero; comparativo controlado para atribuir el LCP móvil a la animación; manual, operación y dominios como antes. Las cuatro decisiones del usuario siguen abiertas.

## Resumen

1. Lint y gate de diseño vuelven a pasar; contraste y áreas táctiles de la home corregidos; a11y 21/21.
2. Leads: lectura/edición/borrado/exportación solo admin; los datos enviados son inmutables por API (no solo en el panel); probado contra la API REST real de Payload en una base desechable.
3. El contador "servidas hoy" con incrementos aleatorios se retiró.
4. Blog: con CMS configurado, el CMS decide qué existe; despublicar retira; un fallo de DB ya no se disfraza de contenido estático.
5. Una sola receta de conversión (`generate_lead`) y pruebas E2E de conteo.
6. Cuerpo del endpoint de contacto limitado sobre el flujo real.
7. Paquete de entrega: README portátil, manual de contenido, registro de afirmaciones, operación (cuentas, respaldo con simulacro, leads, facturación, soporte, acta), ficha de corte de dominios y mensaje para Arroba sin enviar.
8. Hallazgo nuevo corregido: tres suites E2E sin aislamiento de red podían enviar visitas al GA4 real desde una build de producción local o CI.

## Matriz de hallazgos

| ID | Estado | Causa | Cambio | Commit | Prueba / evidencia | Pendiente |
| --- | --- | --- | --- | --- | --- | --- |
| A-01 lint | DONE | `setAnimated(true)` dentro del efecto | `animated` derivado de `useSyncExternalStore` (reduced motion); servidor renderiza el cuadro fijo; el intervalo solo corre si hay movimiento; cambiar a reduced motion detiene la rotación | `7893475` | `npm run lint` 0 errores / 0 warnings | — |
| A-01 diseño | DONE | 47 primitivas y 38 valores tipográficos nuevos en el bloque de widgets | Familia `--operating-widget-*` en `tokens/component.css` que reutiliza roles semánticos donde existen; 1.35→1.4 y -0.02em→tight-1 ajustados a la escala | `e054210` | `design:audit` pasa; baseline bajó: primitivas 519→491, focus-ring 11→10, grid 10→9 | Revisión visual del cliente de los widgets (cambio de tono, ver A-06) |
| A-06 contraste | DONE | Texto secundario de tarjetas blancas = ocean al 58 % alfa (3.72:1) | Rol sólido `--color-text-secondary` (rgb 78,100,105; ≈6.3:1 en blanco) | `e054210` | a11y 21/21; captura `es_closeup_operating-steps_1440.png` | Aprobación visual |
| A-06 targets | DONE | Puntos de 8×8 px | Control de 24×24 con tinta de 8 px (content-box + background-clip, patrón de `accessibility.md`); separación visual 16 px | `e054210` | Medido en navegador: 24×24 (activo 44×24); `*_closeup_spotlight-dots_*.png` | — |
| A-06 excepción verde | VERIFY | Decisión de marca 23-sep (2.1–2.25:1) | Sin cambio. Alternativa preparada: `lime-600` en superficies claras (3.51–4.15:1), documentada en `accessibility.md` | `331f613` | Cálculo en `accessibility.md` | Decisión de marca; hasta entonces no hay conformidad AA completa |
| A-06 manual | TODO | — | Barrido automatizado (ver Visual) | — | — | VoiceOver, zoom 200 %, teclado completo |
| Logo Amazon | DONE (sin cambio) | Aviso dev de Next: a 1280 px el chip de la vitrina renderiza 92.1×27.8 px y la altura redondea al atributo 28, así que Next ve solo el ancho cambiado | Ninguno: proporción renderizada 3.31 = SVG; no hay deformación. No se tocaron logos aprobados | — | Sondeo con Playwright a 390/1280/1440 | — |
| A-02 | VERIFY | `update` para cualquier usuario autenticado; `admin.readOnly` solo en UI; export con `overrideAccess` para cualquiera | Política única `src/payload/access/leads.ts` (admin-only, propuesta conservadora); `access` de campo `create/update: false` en todo campo enviado/atribución; hook `beforeChange` que restaura esos campos en updates con usuario; export consulta como el usuario (`overrideAccess: false`), 401/403 con `no-store` | `a4201d0` | `test:api` 9 tests de leads (5 fallan sobre el código anterior: `logs/test-api-against-pre-fix-leads.log`) | Confirmar si hace falta rol de ventas; impacto: **editores pierden acceso a leads** al desplegar |
| A-03 | VERIFY | `Math.random()` presentado como "hoy" | Cuenta una vez y queda fija; etiqueta vuelve a "Comidas diarias en grandes empresas" / "Meals served daily at great companies" (redacción previa del repo) | `2fdde7c` | Capturas `*_home_768/1440.jpg` | Aprobar cifra (registro fila 1). El usuario eligió "hoy" el 29-sep; revertir requiere una fuente diaria real |
| A-03 registro | VERIFY | — | `docs/registro-de-afirmaciones.md`, 13 filas, ninguna aprobada | `331f613` | — | Aprobación del cliente |
| A-04 | VERIFY | Fallback estático al no encontrar/fallar | `getBlogContentSource()`: `static` sin `DATABASE_URL` o forzado; `cms` = el CMS decide; errores se propagan; slugs sin fallback de idioma; publicar revalida `/sitemap.xml` | `366483a` | `test:api`: ciclo borrador→publicar→editar→despublicar→republicar→borrar con un slug real del código; outage por loader en proceso aparte | Prueba en staging del cliente; capacitación |
| A-04 matriz | DONE | README contradictorio | `docs/manual-contenido.md` (código/CMS/mezcla y qué sobrescribe cada sync) | `331f613` | — | — |
| A-05 | VERIFY | Dos recetas (transformar `contact_request_accepted` y escuchar `generate_lead`) | `gtm-activation.md` = receta única sobre `generate_lead` (Transaction ID = `lead_id`), tags a pausar, guion Preview/DebugView | `e9edc00` | E2E: 1 `generate_lead` sin PII por 201; 0 en 502/422 y 202; 1 con doble envío | Ejecución en GTM/GA4/Ads con acceso; recepción real no comprobada |
| A-05 aislamiento | DONE | `accessibility`, `smoke`, `inquiry-location` no usaban el fixture de red | Pasan a `fixtures/isolated` | `69c2fb2` | E2E corridas 1, 2 y 5 | — |
| A-07 cuerpo | DONE | Solo `Content-Length` | `readJsonWithLimit` cuenta el flujo y corta a 16 KB (413) | `ce05c48` | 5 contratos (chunked, Content-Length subestimado) | Límite de plataforma de Vercel no verificado |
| A-07 rate limit | BLOCKED | `Map` por instancia | Sin cambio. Propuesta: regla de Vercel Firewall en `POST /api/contact-request` (5/10 min/IP) | — | `operacion-y-entrega.md` | Decisión y verificar que el plan la incluye |
| A-07 operación | TODO | — | Política documentada: persistencia antes de correo, reintentos, ventana de 23 h, duplicados posibles | `331f613` | — | Owner/suplente, frecuencia, retención, prueba real de inbox, **revocación de la clave temporal de Resend no acreditada** |
| Dominios | BLOCKED | Documentos contradictorios (claim) | Ficha de corte única con observaciones del 30-sep, regla de no reclamar el dominio raíz, dos caminos, mensaje a Arroba (no enviado) | `331f613` | Lecturas `vercel`/`dig`/`curl` | Registros exactos, owner del Vercel anterior, ventana |
| SEO | TODO | — | Documento de integridad: decisión pendiente registrada | `331f613` | `test:migration` 31/31 | Crawl del deployment final, Search Console, inventario de URLs |
| Performance | VERIFY | — | Medición (sin optimizaciones: el LCP móvil apunta a la animación de entrada, que es visual y requiere aprobación) | — | `perf/summary.json` | Ver Performance |
| Documentación | DONE | README con `Documents/On It`, Sanity, facturación; `.env.example` sin versionar | README portátil; `.env.example` versionado y limpio; avisos de sustitución en manuales viejos; índice único en `docs/README.md` | `331f613` | — | — |
| Operación / entrega | TODO | — | `operacion-y-entrega.md` (cuentas, respaldo + simulacro, leads, facturación, soporte, acta) | `331f613` | Simulacro `logs/backup-restore-drill.log` | Todo dato del cliente |

## Gates (commit `69c2fb2`, 30-sep-2026, Node 25.8.1)

| Comando | Exit | Resultado |
| --- | --- | --- |
| `npm run env:check` | 0 | runtime OK, sin credenciales de build Sentry |
| `npm run lint` | 0 | 0 errores, 0 warnings |
| `npx tsc --noEmit` | 0 | OK |
| `npm run email:check` | 0 | 12 colores coinciden |
| `npm run design:audit` | 0 | pasa; deuda 511 en baseline |
| `npm run test:contracts` | 0 | 81/81 (76 previos + 5 nuevos) |
| `npm run build` | 0 | 48 páginas; avisos `sslmode` de pg (conocidos) |
| `npm run assets:check` (tras build) | 0 | 250 assets, 39 clientes |
| `npm run test:api` | 0 | 21/21 |
| `npm run test:contact` | 0 | 27/27 (26 previos + 202) |
| `npm run test:migration` | 0 | 31/31 |
| `npm run test:a11y` | 0 | 21/21 (sobre `e054210`, antes de aislar la suite; dentro de E2E también 21/21) |
| `npm run test:e2e` corrida 1 | 1 | 60/61. Falla: canonical `localhost:3000` porque `.env.local` define `NEXT_PUBLIC_SITE_URL=http://localhost:3000`; en CI no existe ese archivo |
| `npm run test:e2e            # el config fija la URL canónica desde la ronda 2` corrida 2 | 1 | 59/61: dos timeouts de clic (consent, contacto pantry); ambas pasan al repetirlas (`--last-failed` 2/2) |
| corrida 3 | 1 | 49/61 en 17.4 min con carga del sistema ~19: timeouts y axe muestreando colores a mitad de animación. No representativa |
| corrida 4 | 1 | No arrancó: build + start superó el timeout de 120 s del webServer (carga) |
| corrida 5 | 1 | 60/61: `es: catering` — axe vio un `<select>` a 3.35:1 a mitad de transición. Pasa siempre en `test:contact` (reduced motion) |

Lectura honesta (ronda 1, sustituida por la ronda 2 arriba): **no hay una corrida E2E completa 61/61 en esta máquina.** Cada prueba pasó en al menos una corrida y las fallas no se repiten, pero la suite principal es sensible a la carga: no fuerza reduced motion y axe puede muestrear transiciones. CI usa `retries: 2`. Recomendación (no aplicada, para no cambiar el alcance de las pruebas sin revisión): `reducedMotion: "reduce"` en las suites de formulario del config principal, o esperar al fin de las transiciones antes de axe.

Logs: `docs/evidence/remediation-2026-09-30/logs/`. El primer intento de build con URL de producción falló una vez con un error de Turbopack en `next/font/google` y pasó al repetir (`build-ci-url.log`).

## Pruebas API (base local `zitrone_api_test`, datos sintéticos)

| Actor | Acción | Esperado | Observado |
| --- | --- | --- | --- |
| Anónimo | listar / leer / PATCH / DELETE lead | 403 | 403 |
| Anónimo | crear lead vía CMS | 403 | 403 |
| Anónimo | exportar CSV | 401, `no-store` | 401, `no-store` |
| Editor | listar / leer / PATCH / DELETE | 403 | 403 |
| Editor | exportar | 403 sin datos | 403, sin correo del lead en el cuerpo |
| Editor | cambiarse a admin | rol sigue `editor` | `editor` |
| Admin | listar / leer | 200 | 200 |
| Admin | PATCH estado + notas + nombre, correo, mensaje, folio, origen, UTM, clickId, idioma, emailDelivery | 200; solo estado y notas cambian | Igual: los 22 campos enviados y `emailDelivery` intactos |
| Admin | exportar | 200 CSV, `no-store`, `=` neutralizado | Igual |
| Admin | borrar | 200 | 200 |
| Servidor (sin usuario, `overrideAccess`) | crear lead; actualizar `emailDelivery` (ruta de contacto / script de reintento) | permitido | permitido |
| Blog | borrador / publicar / editar / despublicar / republicar / borrar | ver `manual-contenido.md` | índice, página, relacionados, sitemap, feed y pareja ES/EN coinciden |
| Blog | CMS caído (puerto cerrado) | los tres loaders lanzan error | `REJECTED` ×3 |

Las sesiones se autentican por `POST /api/users/login` real; la cookie se envía con `Sec-Fetch-Site: same-origin` porque el CSRF de Payload lo exige sin `Origin` (como un navegador en `/admin`). Ejecutar: `npm run test:api` (crea y borra la base). Requiere Colima + `zitrone-staging-pg`.

## Visual y accesibilidad

`scripts/visual-sweep.mjs` contra `next start` (build de producción), red externa bloqueada: 9 rutas × ES/EN × 320/390/768/1440 = 72 páginas, todas 200, **0 con overflow horizontal, 0 imágenes rotas**, sin errores de consola salvo los scripts de Vercel Insights (solo existen en Vercel). Estados: menú móvil abierto (ES/EN), banner de consentimiento sin decisión, home con reduced motion (página completa), validación/error/éxito del contacto ES/EN a 390 y 1440 (POST simulado), primeras 8 paradas de teclado con indicador de foco visible. Capturas en `evidence/remediation-2026-09-30/screens/`. Revisadas a ojo: hero ES/EN a 390/768/1440, tarjeta de comidas, puntos del carrusel.

No comprobado: VoiceOver, zoom 200 %, recorrido completo solo con teclado, Safari/Firefox, dispositivos reales. El sitemap local muestra `localhost:3000` por la misma variable local.

## Performance

Lighthouse 12.8.2, Chrome for Testing 149 headless, Mac mini (benchmarkIndex 3700), `next start` local (sin CDN de Vercel), presets estándar: móvil = 4× CPU, 150 ms RTT, ~1.6 Mbps; escritorio = preset desktop. 3 corridas por fila. **Dominios de Google bloqueados** (GTM, GA, Ads) para no mandar visitas de prueba al GA4 del cliente: estos números excluyen el costo del contenedor GTM, que en producción carga `lazyOnload`.

| Ruta | Disp. | Score mediana (rango) | LCP s mediana (rango) | CLS | TBT ms mediana (rango) |
| --- | --- | --- | --- | --- | --- |
| /es | móvil | 74 (73–75) | 7.60 (7.04–11.96) | 0.000 | 103 (26–122) |
| /es | escritorio | 94 | 1.55 | 0.001 | 0 |
| /es/services/comedor-corporativo | móvil | 80 (79–81) | 5.36 (5.23–5.54) | 0.000 | 31 |
| /es/services/comedor-corporativo | escritorio | 99 | 1.03 | 0.000 | 0 |
| /es/blog/comida-en-la-oficina-y-retencion-de-talento | móvil | 83 (74–83) | 4.63 (4.61–5.04) | 0.000 | 38 (27–320) |
| /es/blog/… | escritorio | 98 | 1.11 | 0.000 | 40 |
| /es/contact | móvil | 75 | 4.69 (4.66–5.00) | 0.000 | 334 (306–344) |
| /es/contact | escritorio | 99 | 0.99 | 0.000 | 44 |

> **Corregido el 7-oct-2026:** la atribución de abajo a la animación fue refutada por un comparativo controlado; las cifras de esta tabla son del modo simulado de Lighthouse y sobrestiman. Ver [performance-mobile-2026-10-07.md](performance-mobile-2026-10-07.md): con throttling real LCP = FCP (3.17 s contacto, 3.46 s home). Qué retrasa la primera pintura no está demostrado; la hoja de estilos global de 458 KB es un candidato (acotado el 12-oct, R6).

Elementos LCP: imagen del hero (home), imagen del rotador (servicio), imagen de portada (artículo), H1 de texto (contacto). En contacto el FCP es 1.37 s y el LCP del H1 4.69 s: el retraso es de la animación de entrada, no de la red. Coincide con el diagnóstico de julio (LCP de la home por la animación del hero, pendiente de aprobación visual). **No se optimizó**: cambiar la coreografía de entrada es una decisión visual. TBT de contacto (~330 ms) merece revisión del bundle del formulario. Sin datos de campo: INP y Core Web Vitals reales deben leerse en Vercel Speed Insights o CrUX del dominio final; no se inventan aquí.

## Cambios de schema / configuración y cómo revertirlos

- **Sin migraciones nuevas.** Los permisos de leads son configuración de colección (access + hook); revertir = revertir `a4201d0`.
- Política del blog: revertir `366483a`, o `BLOG_CONTENT_SOURCE=static` para volver a los archivos del código sin desplegar código nuevo.
- Variables nuevas: solo `BLOG_CONTENT_SOURCE` (opcional). `.gitignore` ahora versiona `.env.example`.
- Base alojada: 10/11 migraciones aplicadas; pendiente `20260930_042253_remove_billing_page` (de antes de esta remediación).

## Decisiones del usuario

Confirmadas antes (tracker): `opina@` como destino; dos personas atienden; cobertura limitada a 6 regiones / 38 zonas; facturación manual por correo; Google Sheets diferido; cifra = 15,000 comidas (no personas).

Propuestas en esta remediación, **sin confirmar**: leads solo admin; retirar "servidas hoy" (el usuario lo había elegido el 29-sep); CMS autoritativo para el blog; receta GTM única; camino A o B para `zitrone.com.mx`; `lime-600` como alternativa del acento; regla de Vercel Firewall.

## Trabajo externo pendiente

| Acción | Owner | Depende de | Impacto si no |
| --- | --- | --- | --- |
| Confirmar rol de ventas o admin-only | Cliente / usuario | — | Editores sin acceso a leads tras desplegar |
| Aplicar migración `remove_billing_page` en Neon, con respaldo previo | Desarrollo, con autorización | Respaldo | Tablas huérfanas, sin efecto visible |
| Deploy del commit aprobado (`vercel --prod`) | Desarrollo, con autorización | Revisión de Codex + gates | Producción sigue con la versión del 29-sep 23:36 (sin commit asociado) |
| Importar/ajustar GTM, Ads, GA4 según receta y guion | Owner de GTM/Ads | Acceso | Conversiones siguen en el trigger CSS antiguo |
| Prueba real de inbox (4 envíos) | Ventas + desarrollo | Autorización y destinatarios | Recepción no acreditada |
| Confirmar revocación de la clave temporal de Resend | Admin de Resend | Acceso | Riesgo de envío no autorizado |
| Ficha de corte: registros exactos, owner del Vercel anterior, ventana | Arroba + cliente | Mensaje (borrador listo) | Corte bloqueado |
| Aprobar afirmaciones, logos, testimonios | Comercial Zitrone | Registro | Riesgo reputacional/legal |
| Documento de integridad: texto o retiro | Cliente / legal | — | URL legal redirige a home |
| Cuentas, MFA, costos, respaldo, retención, soporte, capacitación, acta | Cliente + proveedor | — | Sin entrega operativa |
| Regla de rate limit | Desarrollo con aprobación | Plan Vercel | Límite solo por instancia |
| VoiceOver / zoom / teclado manual | QA | — | Sin evidencia manual |

## Riesgos no resueltos

- Producción sirve un deployment del 29-sep sin commit asociado; nada de esta remediación está publicado.
- E2E principal sensible a carga (ver Gates); sin corrida 61/61 completa.
- Node 24 no probado localmente.
- Un reintento del visitante tras perder la respuesta HTTP puede crear un lead duplicado.
- `payload:sync:blog:prod` republica artículos despublicados que tengan archivo en código.
- Despublicar retira ambos idiomas a la vez (sin estado por idioma).
- Builds locales leen el CMS alojado (solo lectura); un build con el CMS caído ahora **falla** en vez de publicar contenido estático. Es intencional.

## Evidencia guardada

`docs/evidence/remediation-2026-09-30/`: `screens/` (96 capturas + `results.json`), `perf/summary.json` (24 corridas con métricas por corrida), `logs/` (todos los gates, corridas E2E, pruebas contra código anterior, simulacro de respaldo). Sin PII real ni secretos (escaneado). Los JSON completos de Lighthouse no se versionaron (~9 MB); se regeneran con el comando de abajo.

## Cómo reproducir

```bash
git checkout 69c2fb2        # o el commit siguiente (solo documentos)
npm ci
npm run env:check && npm run lint && npx tsc --noEmit && npm run email:check
npm run design:audit && npm run test:contracts
npm run build && npm run assets:check
colima start && docker start zitrone-staging-pg && npm run test:api && npm run test:cache
npm run test:contact && npm run test:migration
npm run test:e2e            # el config fija la URL canónica desde la ronda 2
# comprobar que las pruebas detectan lo arreglado:
git show 7d67dac:src/payload/collections/contact-requests.ts > /tmp/old.ts   # comparar, o revertir y correr test:api
zsh scripts/backup-restore-drill.sh
npx next start --hostname 127.0.0.1 --port 3105 &
BASE=http://127.0.0.1:3105 OUT=/tmp/sweep node scripts/visual-sweep.mjs
zsh scripts/lighthouse-runs.sh /tmp/lh && python3 scripts/lighthouse-summary.py /tmp/lh
```

No usar `release:home:prod` ni comandos `*:prod` de escritura para verificar.
