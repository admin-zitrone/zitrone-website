# Inventario del repositorio para entrega

15-oct-2026 19:34 (-0600). Paso 1 y 2 del [plan de organización](plan-organizacion-repositorio.md). Lectura local; **sin `git fetch`**: las referencias `origin/*` son las guardadas en este equipo (último fetch 15-oct 18:18), no certifican el remoto actual. Otras sesiones siguen activas, así que los SHA de abajo son una foto de ese momento.

## Ramas y worktrees

Base de comparación: `HEAD` del checkout principal = `design-system/type-unification` @ `255eec2`.

| Rama | SHA | Worktree | Commits fuera de HEAD | Estado | Propuesta |
| --- | --- | --- | --- | --- | --- |
| `design-system/type-unification` | 255eec2 | `Zitrone Website` | — | 53 por delante de su upstream (sin push). Contiene todo `main` local y `home-flow-redesign`. | Candidata a rama de integración. |
| `analytics/handoff-prep` | 32969c5 | `zitrone-analytics-wt` | 1 (32969c5, GTM solo producción) | Sin upstream. Worktree limpio. | Revisión Codex, después integrar el commit. |
| `perf/images-loading` | 7b25f05 | `zitrone-images-wt` | 5 | Sin upstream. Worktree con cambios sin commit: `.claude/agents/image-auditor.md` (M), `scripts/image-audit-compare.mjs` (nuevo). | Tarea activa; esperar cierre y medición comparable (modalidad 2 §1). |
| `feat/article-calendly` | 4475fb5 | `Zitrone Website-article` | 5 (plantilla de artículo estilo Calendly, CTA por artículo) | Sin upstream, último commit 24-sep. Worktree limpio. | **Decidido 15-oct: entra** y sustituye el diseño actual del artículo. Integrada en `integrate/article-redesign` (ver abajo). |
| `codex/services-orbit-and-revalidation` | f61fe32 | — | 18 (SEO de servicios, seguridad de endpoints, checkpoint de home) | Mayo 2026, 2 por delante de su upstream. | Revisar si su contenido ya llegó por otra vía; si no, decidir. No borrar. |
| `main` | ad17ec9 | — | 0 | 21 detrás de `origin/main`. | Actualizar solo al final, vía PR. |
| `home-flow-redesign` | a528bea | — | 0 | Integrada en HEAD. | Retirable tras la entrega (no ahora). |
| `claude/vibrant-babbage-49b4b2` | b605635 | — | 0 | Integrada; mayo 2026. | Retirable tras la entrega (no ahora). |

`origin/main` (927a557) tiene un único commit fuera de HEAD: el merge de `home-flow-redesign`, cuyo lado fusionado ya está en HEAD. No aporta contenido nuevo, pero el PR final debe partir de `origin/main` actualizado tras un fetch autorizado.

## Cambios sin commit en el checkout principal

Pertenecen a otras sesiones; **no se tocaron**: `DELIVERY.md`, `docs/README.md`, `docs/delivery-progress.md`, `docs/domain-migration-checklist.md`, `docs/operacion-y-entrega.md`, `docs/pendientes-entrega-2026-10-12.md`, `docs/vercel-handoff.md` y los documentos nuevos de plan/handoff/revisión (`docs/plan-*.md`, `docs/handoff-arroba-*`, `docs/mensaje-arroba-*`, `docs/instrucciones-claude-modalidad-2.md`, `docs/revision-*.md`, `docs/analytics/preparacion-handoff-2026-10-15.md`, `docs/evidence/arroba-handoff-2026-10-12/`).

Cambios de esta sesión: `README.md` (ver abajo) y este archivo.

**18-oct:** incorporados a `release/2026-10` de forma selectiva (commit `4f73cab`, sin cambios de contenido): plan rector, ficha técnica, plan de organización, revisiones de fuentes/imágenes/analytics, evidencia de dominios del 12-oct, revisiones R7–R11 y sus entradas en el tracker. Se quedan fuera del repositorio, sin tocarlos: `docs/mensaje-arroba-2026-10-12.md` (respuesta a Arroba sin enviar) y `docs/instrucciones-claude-modalidad-2.md` (instrucciones de trabajo para Claude). El checkout principal conserva sus cambios.

## Auditoría de secretos y datos (contenido actual e historial completo)

Método: búsqueda por patrones (claves Stripe, Resend, AWS, GitHub, Slack, Google, Vercel Blob, Neon `npg_`, JWT, claves privadas PEM, URLs Postgres con contraseña, `PAYLOAD_SECRET=`) en el árbol versionado, en archivos sin seguimiento no ignorados y en cada commit de todas las ramas. No hay gitleaks/trufflehog instalados; esto es una revisión por patrones, no una garantía.

- **Credenciales propias: ninguna encontrada.** Todas las URLs Postgres con contraseña del contenido actual y del historial apuntan a `127.0.0.1` o `localhost` (CI, pruebas aisladas, simulacro de respaldo). Son contraseñas de contenedores desechables.
- **Archivos sensibles:** el único `.env*` versionado en toda la historia es `.env.example`, sin valores secretos. Ningún `.pem`, `.key`, dump SQL ni base de datos versionado. `.decks-password.txt` nunca entró en este repositorio.
- **Material de terceros en el historial:** `References/` (páginas guardadas de sitios externos: Nutrisense, MoldCo) estuvo versionada en commits antiguos (cfc9e64 … 5ad321c) y ya no está en el árbol. Su JavaScript incluye tokens públicos de esos sitios (clave de Google Maps de navegador, JWT de configuración). No son credenciales de Zitrone. No se reescribe historia; se menciona por transparencia y licencias.
- **Datos personales:** `docs/delivery-progress.md` contiene el correo del desarrollador como destinatario de pruebas. `src/emails/samples.ts` usa dos correos de ejemplo con dominios reales de terceros (`grupoherradura.mx`, `estudio-ruiz.mx`); `docs/sections-copy-map.md` cita un correo `@maven.com` de una referencia de diseño. Propuesta: cambiar los de `samples.ts` a `example.invalid` (cambio de producto pequeño, pendiente de aprobación).

## Residuos y configuración local versionados

Estado al 18-oct:

| Ruta | Observación | Propuesta |
| --- | --- | --- |
| `.claude/skills/deck-export` | Enlace simbólico roto a `../../deck-system/…`. | Retirado en `b4e5896`. |
| `.claude/skills/deck-builder`, `.agents/skills/deck-builder` | Skills del sistema de decks, ya separado. | Retiradas en `b4e5896`; `asset-manager` se queda. |
| `.artifacts/*.png`, `.artifacts/seq.mjs`, `.artifacts/unpin.mjs` | Capturas y scripts sueltos de trabajo. | Retirados del índice en `92ca493`; `/.artifacts/` ignorado. Los archivos siguen en disco. |
| `.artifacts/home-release/*.json` | Los escribía `scripts/payload/home-release-lib.ts`, retirado en `8b24af7`; ya no los lee nada. | Retirados del índice en `92ca493`. |
| `zitrone-platform-audit-2026-04-30.md` (raíz) | Casi duplicado de `docs/zitrone-platform-audit-2026-04-30.md` (difieren desde la línea 3). | La de `docs/` es la de raíz más la nota del 12-oct. Raíz retirada en `92ca493`. |
| `docs/services/CATALOGO ZITRONE 2026.pdf` (9 MB) | Catálogo comercial con precios por persona (11 páginas). Junto a dos `.docx` de testimonios y niveles de servicio que cita `service-page-contract.md`. Ningún build o prueba los usa. | Retirados (decisión del 18-oct; ver [historial](#historial-y-separación-de-presentaciones-18-oct)). |
| `tests/e2e/visual.spec.ts-snapshots/*-darwin.png` | Baselines visuales solo para macOS. | Documentar que `test:visual` no corre en CI Linux. |

## Reproducibilidad

- ~~`package.json` se llama `on-it-workspace` y no declara `engines`~~. Hecho en `b192ac2`: `zitrone-website`, `engines.node` `24.x` (formato de Vercel; el proyecto origen usa 24.x) y `.nvmrc`.
- ~~`lenis` y `smooth-scroll-provider.tsx` sin consumidores~~. Retirados en `2b24264`; el lockfile solo pierde `lenis`.
- Instalación y build sin dependencias externas al repositorio: ningún archivo de código o configuración usa rutas absolutas ni carpetas hermanas (solo comentarios y documentos históricos). `assets-sync` escribe en `deck-system/` únicamente si esa carpeta existe, y no existe.
- `ai` y `@ai-sdk/openai` se usan en `src/ai/embeddings.ts` (hooks de FAQ y blog); sin `OPENAI_API_KEY` (ya en `.env.example`) el embedding se omite con un aviso. Añadida a la tabla de variables del README; falta en el inventario de servicios como proveedor opcional.

## Historial y separación de presentaciones (18-oct)

Método: rutas y contenido de todos los objetos alcanzables desde `release/2026-10` (192 commits) y desde las ramas de GitHub; búsqueda de precios, propuestas, nómina y Consejo en los blobs de texto (sin `References/`). Revisión por patrones, no exhaustiva.

- **Repositorio de presentaciones:** separado (`zitrone-deck-system`, privado). El árbol de la release no lo necesita para instalar, compilar ni probar. Las propuestas con precios de clientes, el deck del Consejo y la nómina **nunca estuvieron en el historial de GitHub** de este repositorio; solo dos plantillas genéricas (`deck-system/README.md`, `deck-system/zitrone-master-deck-slides.html`, 18-jun). La rama local `codex/services-orbit-and-revalidation` tiene 104 archivos de `deck-system/` en commits que nunca se subieron: no hacer push de esa rama.
- **En el árbol actual, servidos públicamente por zitrone.mx (200 OK, comprobado):** `public/decks/comedor-deck.html` (deck comercial de comedor, sin precios) y `public/pdf/bacardi/` y `public/pdf/diageo/` (90 fotos optimizadas para propuestas de esos clientes; el repo de decks las llama artefactos generados). Ningún archivo del sitio los usa y decks.zitrone.mx solo reenvía `/img/*`. **Retirados del árbol el 18-oct** (decisión del usuario); siguen en línea hasta que se publique la release. Las 91 URLs que desaparecerán están listadas junto a la copia privada; el usuario confirma (18-oct) que no se compartieron; no hacen falta sustitutos.
- **En el árbol y en el historial:** `docs/services/CATALOGO ZITRONE 2026.pdf` (precios) y los dos `.docx`, desde `5ad321c` (18-jun). Retirarlos del árbol no los quita del historial.
- **Solo en el historial:** `References/` (páginas guardadas de terceros, ver arriba), `src/sanity/` (CMS anterior), notas de investigación de Maven Clinic.
- **Copia privada:** los 94 archivos retirados (deck, 90 fotos, 3 documentos) se extrajeron de Git a una carpeta privada fuera de los repositorios, con `SHA256SUMS` comprobado 94/94. Pendiente moverlos a su destino: deck y fotos al repositorio de presentaciones; documentos al espacio privado de Zitrone. Los documentos nunca fueron públicos (404). Ubicación de la copia (equipo de desarrollo): `~/Documents/Zitrone/archivo-retirado-web-2026-10-18/`, con `LEEME.md`, `SHA256SUMS` y `URLS-PUBLICAS.txt`. Al trasladarla, no mezclarla con los cambios sin commit de otras sesiones en el repositorio de presentaciones.
- **Decisión del 18-oct:** Arroba recibe un repositorio privado nuevo creado desde la versión publicada; este se conserva restringido con su historial. Todavía no se crea.
- **Propuesta original:** si el catálogo no debe llegar a Arroba, entregar un repositorio privado nuevo creado desde el snapshot publicado, con un único commit inicial que cite el SHA de origen, y conservar este repositorio restringido como historial completo. Si Zitrone acepta que Arroba vea el catálogo (es material comercial propio), entregar este repositorio tal cual. No se ha creado nada ni cambiado remotos.

## Pendientes de decisión

1. ~~¿`feat/article-calendly` entra en esta entrega?~~ Sí (usuario, 15-oct). Rama local `integrate/article-redesign` en el worktree `zitrone-article-int-wt`, desde `255eec2`: merge `c5ab832` (conserva los 5 commits originales; conflictos resueltos dejando el texto vigente y sin estilos de facturación) + `606462f` (enlaces del índice a 24px; el merge rompía axe target-size en el Aviso de Privacidad, que comparte el índice). Validado con Node 25.8.1 local (CI usa 24) sin base de datos: lint, tsc, assets/email checks, design audit, 83/83 contratos, build, accessibility + smoke 26/26, capturas ES/EN escritorio/móvil sin scroll horizontal. Pendiente: revisión Codex y E2E completa sobre la combinación final.
2. ~~¿`codex/services-orbit-and-revalidation` tiene trabajo no recuperado?~~ Revisado 15-oct: es histórica. Todos los archivos de código que añadió (órbita de servicios, release/sync de home, JSON-LD, rate limit, revalidación, páginas de servicio) ya existen en la base. Solo faltan `deck-system/` y `src/app/deck-system/` (retirados a propósito al separar el repo de decks) y dos imágenes renombradas. No se integra; se conserva como referencia.
3. ~~¿Las skills de decks se entregan?~~ No (usuario, 15-oct, opción A): el repo `1085mx/zitrone-deck-system` contiene propuestas con precios de clientes y el deck del Consejo, y no se entrega a Arroba. Commit `b4e5896` en `integrate/article-redesign` retira `deck-builder` (`.claude` y `.agents`) y el enlace roto `deck-export`; `asset-manager` se conserva porque gobierna las imágenes del sitio. `deck-builder` sigue recuperable en el historial; el repo de decks no tiene copia propia.
4. ~~Fetch autorizado~~ Hecho 15-oct con autorización del usuario (`git fetch origin --prune`). GitHub no tenía cambios nuevos: `origin/main` sigue en 927a557 (13-ago) y `origin/design-system/type-unification` en 963de51 (24-sep). Solo se retiró la referencia local de `origin/chore/delivery-clean`, ya borrada en GitHub. Implicación: GitHub no contiene nada de lo hecho desde el 24-sep; los despliegues a producción posteriores salieron de esta máquina.

## Versión en producción y decisiones del 17-oct

- **zitrone.mx hoy** (consulta de solo lectura a Vercel): despliegue `dpl_C4cjcDJvz9UEwqs8z1n4pSM3hJv3`, creado el 15-oct 18:19 desde `4563464` (`design-system/type-unification`) con cambios sin commit (`gitDirty`). Usa todavía fuentes de `next/font/google`. El usuario indica que esta versión es la aprobada por el cliente.
- **Diferencias de `release/2026-10` frente a producción (expectativa, sin verificar):** por el contenido de los commits, el único cambio visible previsto era el rediseño del artículo. **Actualización 19-oct:** el usuario pidió en el QA mantener el artículo publicado; el rediseño se revirtió (`84e51e6`) y el cambio visible previsto pasa a ser el aviso de privacidad legible. Los demás bloques no deberían cambiar lo que se ve: fuentes autoalojadas (archivos idénticos), foco de teclado en el pie, imágenes optimizadas y rotación del hero que espera la carga, GTM solo en producción, home/navegación/pie editables en CMS (sin efecto mientras `HOME_CONTENT_SOURCE=static`), documentación. **Pendiente de QA visual** contra el deployment aprobado, ES/EN, escritorio/móvil (R9 de Codex). No es comparable todavía: producción incluye cambios sin commit, y header/pie salen del CMS alojado incluso con la home en `static`. Hacerlo sobre un preview con los datos reales ya migrados, guardar las diferencias aceptadas y no regenerar baselines sin inspeccionarlas.
- **Rediseño del artículo:** visible y no aprobado por el cliente; el usuario decide mantenerlo en la entrega (17-oct, opción B).
- **Facturación:** el usuario confirma que no se necesita (solo enlace de correo). La migración destructiva `20260930_042253_remove_billing_page` puede aplicarse, con respaldo previo de la base.
- **Orden de despliegue:** migrar antes de desplegar. Ensayado el 18-oct con la migración en modo *expand* (conserva las columnas viejas): el código nuevo falla sobre el esquema viejo, el código anterior funciona sobre el esquema migrado mientras no se edite header/pie, y tras editarlos la vuelta atrás requiere `migrate:down`. Ver [cms-home-rollout.md](cms-home-rollout.md#vuelta-atrás) y la [evidencia](evidence/cms-home-migration-rehearsal-2026-10-18/README.md).

## Acciones externas

- `git fetch` autorizado (solo lectura).
- Respaldo autorizado por el usuario: push sin forzar de `design-system/type-unification` (963de51..255eec2), `integrate/article-redesign` (b4e5896), `analytics/handoff-prep` (32969c5) y `perf/images-loading` (d8403df). Escaneo previo de los 69 commits nuevos: solo valores de prueba (Postgres local, `PAYLOAD_SECRET` del simulacro). No dispara CI (solo PR y main) ni despliegues.
- Lectura de metadatos del despliegue de producción en Vercel (17-oct).
- Ninguna otra: sin push a main, borrado de ramas, reescritura de historia, despliegues ni cambios en servicios.
