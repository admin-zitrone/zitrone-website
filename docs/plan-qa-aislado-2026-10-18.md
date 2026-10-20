# Plan de QA aislado de la versión final

Revisión 3.2, 19-oct-2026: sin seed, porque la home se queda en los archivos del código (decisión del usuario del 19-oct, ver [Sin seed](#sin-seed-revisión-32)). Revisión 3.1: los cinco ajustes de [la revisión del plan](codex-qa-plan-review-2026-10-18.md), R12–R14 de [la revisión del runner](codex-qa-runner-review-2026-10-18.md) ([aceptadas](codex-r12-r14-acceptance-2026-10-19.md)) y la pausa de clasificación antes de limpiar que pide esa aceptación. Runner: `scripts/qa-release/run.sh` y sus piezas en `scripts/qa-release/`. **No se ha ejecutado contra producción.** Se ensayó completo con una base sustituta local (ver [Ensayo en seco](#ensayo-en-seco-19-oct-sin-producción)). Se ejecuta con una única autorización, descrita en [Autorización](#autorización). Esa autorización no cubre migrar la base alojada, fusionar ni publicar.

La versión que se prueba es el SHA final de `release/2026-10` que se vaya a fusionar, con el runner ya incluido. El runner se niega a correr si su archivo difiere del que está en ese commit.

## Qué cambió con la revisión de Codex

| Punto de Codex | Cómo lo resuelve el runner |
| --- | --- |
| 1. Entorno limpio real | **Checkouts:** cada uno es nuevo y separado (`git worktree add --detach`): dos del candidato (uno por estado de la base) y uno del código publicado. `init` comprueba en cada uno que `git status --ignored` está vacío, que no hay `.env*` salvo `.env.example` y que no hay `.next`. Después instala con `npm ci --offline` (desde la caché, sin red). Tras cada build comprueba que no cambió ningún archivo versionado.<br>**Credencial:** el extractor (`prod-read.mjs`) es el único proceso que la lee. Nunca arranca la app, Payload ni un cliente Node. Ningún proceso de QA recibe un `--env-file`.<br>**Base:** cada URL que recibe un proceso pasa por `assert_db_url`: `127.0.0.1`, el puerto del contenedor de esta ejecución, uno de sus nombres de base y ninguna opción. Esto no depende del sufijo `_api_test` ni de `test-db.sh`. |
| 2. Lecturas sin efectos | **Navegador** (`browser-policy.mjs`): decide por hostname ya parseado. Hacia el sitio aprobado y su Blob solo salen GET/HEAD. Los demás métodos (balizas de analítica, envíos del formulario) se contestan en local con 204 y no salen. Todo lo demás se aborta, Google incluido. Los service workers quedan bloqueados para que nada eluda la intercepción. En local solo se permiten las mutaciones acordadas.<br>**Servidor y scripts** (`egress-guard.mjs`): solo loopback. Las lecturas de Blob se contestan desde un espejo local descargado antes, así que el servidor no sale a la red ni siquiera para optimizar imágenes.<br>**Registro:** cada intento queda anotado como `blocked`, `mirror`, `simulated`, `local` o `transmitted`. `transmitted` solo puede aparecer en el lado aprobado y para lecturas; `summarize-egress.mjs` falla si no es así. |
| 3. Extracción mínima | **Inventario positivo** (`inventory.json`): 174 tablas de contenido y 14 solo de estructura. Antes de exportar, `validate-catalog.mjs` compara el catálogo de producción con el snapshot de su última migración, tabla por tabla y columna por columna.<br>**Se detiene si encuentra:** una tabla desconocida, columnas distintas, vistas, un historial de migraciones que no es prefijo del repositorio, o una clave de una tabla copiada hacia leads.<br>**Restauración por fases**, con error fatal: estructura sin restricciones; datos en una transacción; remapeo de referencias a usuarios hacia usuarios sintéticos con el mismo id; restricciones e índices en una transacción.<br>**Escaneo de texto libre:** recorre la copia y solo acepta los correos y teléfonos que ya publica el código.<br>**Sesión:** de solo lectura (`default_transaction_read_only=on`, comprobado en el catálogo). El estado de migraciones se lee con SQL, sin iniciar Payload. |
| 4. Comparación reproducible | **Estados separados:** `orig` (como producción), `mig` (migrada, sin seed: lo que se publicará) y `rb` (vuelta atrás).<br>**Comparación:** aprobado contra `mig`; cada diferencia se clasifica y la acepta el usuario.<br>**Registro:** la fecha de la copia, el SHA del candidato y el deployment aprobado, comprobado antes de comparar.<br>**Movimiento real:** además de las capturas congeladas, `motion-check.mjs` mide movimiento, carga diferida, fuentes y foco sin estilos inyectados, en los dos sitios. |
| 5. Permisos y limpieza | **Lecturas:** todas las externas están enumeradas abajo. El costo no se da por cero.<br>**Recursos:** directorio privado y nombres únicos por ejecución; nada se reutiliza.<br>**Limpieza:** borra solo lo anotado en el manifiesto de esa ejecución y exige guardar la evidencia antes. |

## Revisión del runner (R12–R14)

| Punto | Corrección | Prueba negativa (`tests/scripts/qa-release-gates.test.ts`) |
| --- | --- | --- |
| R12. La extracción podía seguir tras un catálogo rechazado | **Al empezar, `catalog` borra la aprobación anterior.**<br>`validate-catalog.mjs` solo escribe la lista de tablas si no hay motivos para detenerse.<br>`gate.mjs` liga la aprobación (`private/catalog.ok`) a la ejecución, al SHA, a la huella de la fuente (host, puerto, base y usuario, sin contraseña) y al hash del catálogo, el inventario, la lista y el remapeo.<br>`extract` y `restore` la verifican, y `prod-read.mjs dump` rechaza otra fuente. | Con un `prod-read` falso y sin credenciales: el catálogo inválido deja `extract` rechazado sin invocar el volcado. También lo rechaza un catálogo modificado tras aprobarlo, un catálogo que falla al repetirse o otra ejecución. |
| R13. Criterios que solo imprimían | `criteria.mjs` convierte cada criterio en una fila PASS, FAIL, PENDING o INFO de `status.tsv`. Un FAIL detiene el paso.<br>**Veredicto:** FALLIDO, INCOMPLETO (falta o se omitió un criterio obligatorio), PENDIENTE DE CLASIFICACIÓN o CRITERIOS AUTOMÁTICOS CUMPLIDOS. Nunca "aprobado" con un FAIL, un faltante o un PENDING. `evidence` se puede guardar tras un fallo. | Respuesta 500, 0 o 2 leads, sin `EMAIL_NOT_CONFIGURED`, GTM presente, paridad o cobertura distintas de 0 o sin salida, home distinta tras volver a avanzar, página 404, desbordamiento, error de consola real, comparación con error y espejo incompleto. |
| R14. Capturas del CMS en la evidencia | **Privado (`private/`):** capturas del CMS, exportaciones de enlaces y home, detalle enlace por enlace, capturas de pantalla, registros y salidas de red.<br>**`work/`:** solo informes saneados (conteos, hashes, porcentajes, códigos).<br>`evidence` copia una lista fija de nombres, sin recursión. | Un marcador confidencial en la captura, en el detalle, en una captura de pantalla, en un registro y en un archivo suelto de `work/` no aparece en el paquete. |

**Otras correcciones de esta revisión:**

- **Los CLI terminaban con 0 sin hacer nada** cuando su ruta pasaba por un symlink o por el `TMPDIR` de macOS (`/var` → `/private/var`). Ahora comparan rutas reales.
- **La limpieza dejaba los servidores encendidos** por la misma causa y aun así informaba éxito. Ahora compara rutas reales y falla si queda un servidor de la ejecución escuchando.
- **El criterio del barrido usaba nombres de campo inexistentes.** Por eso el "72 páginas sin incidencias" de la revisión 2 no comprobaba consola ni estado HTTP. Ahora se excluyen por nombre solo los dos scripts que Vercel sirve únicamente en su plataforma.
- **Los ganchos de embeddings se guardan uno por proceso:** el aviso se imprime una sola vez por proceso.
- **Las misses del espejo se responden con 404,** y un espejo incompleto falla.
- **La contraseña del administrador sintético quedaba con permisos 644;** ahora es 600.

## Recursos

- Esta computadora, con:
  - Docker;
  - Node 24.22.0;
  - Chromium de Playwright;
  - la caché de npm, para `npm ci --offline`.
- Un contenedor Postgres propio por ejecución, `zitrone-qa-<id>`:
  - con la misma versión mayor que Neon;
  - en `127.0.0.1` y en un puerto aleatorio;
  - con datos en memoria (`tmpfs`), así que la copia no llega al disco;
  - sin tocar `zitrone-staging-pg`.
- Directorio de ejecución `$TMPDIR/zitrone-qa/<id>`, en modo 700, más un temporal corto `/tmp/zqa-<id>`.
- **Sin rama de Neon, sin preview de Vercel y sin cambios en ningún servicio.**

## Lecturas fuera de esta computadora

| # | Qué | Paso | Método | Volumen esperado |
| --- | --- | --- | --- | --- |
| P1 | Neon: versión del servidor y catálogo. Solo nombres, tamaños, claves, migraciones aplicadas y conteos de las tablas copiables; ninguna fila | `catalog` | Sesión de solo lectura | Kilobytes |
| P2 | Neon: `pg_dump` de la estructura de `public` y de los datos de las tablas validadas | `extract` | Sesión de solo lectura | Lo que diga P1. El ensayo con datos de seed dio 11.5 MiB en el servidor y 0.75 MB de volcado |
| W1 | Vercel: `vercel inspect www.zitrone.mx`, para confirmar que producción sigue en `dpl_C4cjcDJvz9UEwqs8z1n4pSM3hJv3` | `compare` | API de lectura | Una consulta |
| W2 | Sitio publicado: `sitemap.xml` | `compare` | GET | 1 página |
| W3 | Blob público: una descarga de los archivos que usa la copia | `mirror` | GET sin token | Lo que diga el espejo: N archivos y MiB, registrados |
| W4 | Sitio publicado en el navegador: el lado aprobado de la comparación y la prueba de movimiento | `compare`, `sweep` | Solo GET/HEAD | Unas 84 cargas de página (19 por idioma × 2 idiomas × 2 anchos, más 8), con sus imágenes optimizadas, en su mayoría ya en caché |
| D1 | Docker Hub: imagen `postgres:<versión de Neon>-alpine`, solo si no está ya descargada | `catalog` | Descarga | Unos 100 MB, una vez |

Nada más sale de la máquina. Payload intenta enviar telemetría desde cada proceso, y el guard la bloquea. En el ensayo hubo 48 intentos, todos a `telemetry.payloadcms.com` y todos bloqueados.

**Costos:** no se crea ningún recurso de pago. Sí hay uso de servicios existentes: transferencia y unos minutos de cómputo en Neon, unas 160 visitas con sus imágenes en Vercel y una descarga de Blob. Por estos volúmenes se espera que quepa en lo incluido en cada plan, pero **no está verificado**: hay que revisar el plan y el uso del mes de Neon y Vercel antes de autorizar.

## Comandos

Desde el checkout de `release/2026-10`, con Node 24 en el `PATH`:

```sh
QA_SHA=<sha final> zsh scripts/qa-release/run.sh init          # imprime QA_RUN=<dir>
export QA_RUN=<dir>
QA_PROD_READ_AUTHORIZED=<id> zsh scripts/qa-release/run.sh catalog   # P1 (+D1); se detiene si no valida
QA_PROD_READ_AUTHORIZED=<id> zsh scripts/qa-release/run.sh extract   # P2
zsh scripts/qa-release/run.sh restore        # contenedor propio; restauración por fases; conteos; escaneo
zsh scripts/qa-release/run.sh states         # pasos 3–6 del procedimiento y vuelta atrás sobre copias
zsh scripts/qa-release/run.sh mirror         # W2, W3
zsh scripts/qa-release/run.sh build          # el candidato (mig)
zsh scripts/qa-release/run.sh serve          # mig :3105
zsh scripts/qa-release/run.sh compare        # W1, W2, W4
zsh scripts/qa-release/run.sh sweep          # candidato; W4 para el movimiento del aprobado
zsh scripts/qa-release/run.sh integrations
QA_EVIDENCE_DIR=docs/evidence/qa-release-<fecha> zsh scripts/qa-release/run.sh evidence
# PAUSA: el usuario clasifica cada PENDING con las capturas privadas; las decisiones van a work/classification.md
QA_EVIDENCE_DIR=docs/evidence/qa-release-<fecha> zsh scripts/qa-release/run.sh evidence   # reexporta con la clasificación
zsh scripts/qa-release/run.sh cleanup
```

**Pausa antes de limpiar.** Las capturas de pantalla, el detalle de enlaces y las exportaciones de home están en el directorio privado, y la limpieza los borra. Por eso `cleanup` se niega mientras haya un criterio PENDING sin clasificar:

- exige `work/classification.md` y que nombre cada criterio PENDING;
- exige que `evidence` se haya vuelto a ejecutar después de escribirla, para que entre en el paquete (reexportar al mismo destino de la ejecución lo reemplaza; otro directorio existente nunca);
- la clasificación no lleva contenido: criterio, página, ancho, categoría (esperada, defecto, pendiente de decisión) y decisión del usuario.

Mientras se decide, la sesión queda detenida con su directorio privado en modo 700. Si la decisión tarda, se pueden parar los servidores y el contenedor sin borrar el directorio. Solo `QA_DISCARD=<id>` permite limpiar sin clasificar, y en ese caso no hay aceptación visual. Probado en `qa-release-gates.test.ts`: con PENDING sin clasificar, con una clasificación incompleta y sin reexportar, `cleanup` se niega y conserva las capturas.

`<id>` es el que imprime `init`. Sin `QA_PROD_READ_AUTHORIZED=<id>`, `catalog` y `extract` se niegan y no leen nada (probado). Cualquier paso que falle detiene la ejecución.

## Protección de datos

- **Solo se copia lo que el inventario declara contenido:** páginas, blog, servicios, FAQs, historias, logos, medios, header, pie, ajustes y aviso de privacidad, con sus versiones, más `payload_migrations`.
- **De estas tablas solo se copia la estructura, con 0 filas comprobadas tras restaurar:**
  - `users` y `users_sessions`;
  - `contact_requests`;
  - `payload_preferences*` y `payload_locked_documents*`;
  - `payload_kv`;
  - las 6 tablas de facturación.
- El esquema actual no tiene claves de tablas de contenido hacia `users` ni hacia `contact_requests`. Si apareciera una hacia `users`, se remapea a usuarios sintéticos `qa-user-<id>@example.invalid`. Una hacia cualquier otra tabla de solo estructura detiene la ejecución.
- **Si el escaneo de texto libre encuentra un correo o teléfono que no publica el código del candidato, se detiene antes de usar la copia.** El informe lo muestra enmascarado.
- **Credencial:** se lee de `.env.production-cms` en el checkout principal. Llega a `pg_dump` y `psql` como variables `PG*` dentro de `docker run`, nunca en la línea de comandos ni en registros. Los errores sustituyen el host por `<source>`.
- **Archivos privados de la ejecución** (`private/`, en modo 700): catálogo, volcados, contraseña del administrador sintético, capturas y exportaciones del CMS, detalle de enlaces, capturas de pantalla. También los registros (`logs/`, `egress/`). Nunca entran en la evidencia ni en el repositorio, y se borran en la limpieza.
- **Evidencia versionable:** solo la lista fija de informes saneados de `work/`, más `status.tsv` y un README con el veredicto. Las capturas de pantalla de las comparaciones se revisan en el directorio privado. Solo pasan al repositorio si el usuario las revisa y lo pide.
- **La copia local se trata como privada durante toda la sesión.** El inventario y el escaneo reducen la exposición, pero no garantizan que el contenido libre carezca de nombres o material interno.
- **Correo:** el único lead lo crea la prueba, con `qa-lead-<id>@example.invalid`, y vive solo en la copia.

## Comprobaciones y criterio

- **Fase B (contenido y migración), en `restore` y `states`:**
  - conteos iguales a la fuente y tablas de solo estructura vacías;
  - escaneo de texto libre limpio;
  - estado de migraciones antes y después;
  - migración sobre `mig`;
  - los enlaces visibles de header y pie iguales a producción tras migrar, con el código anterior y con el nuevo; si no, la ejecución se detiene (`compare-states.mjs`);
  - sin seed (paso 6 del procedimiento: no se ejecuta);
  - en `rb`: `migrate:down`, código anterior, y migrar de nuevo, que debe dar la misma home que `mig`.
- **Fase A (visual):** las 19 páginas del sitemap por idioma, a 1440 y 390 px.
  - La comparación aprobado contra `mig` clasifica cada diferencia como esperada (el aviso de privacidad legible y la recompresión de fotos), defecto o pendiente de decisión. El artículo debe coincidir con el publicado.
  - Barrido del candidato en 4 anchos: desbordamiento, imágenes rotas, consola, menú móvil, cookies, validación del formulario, movimiento reducido y foco.
  - `motion-check` en los dos sitios debe dar los mismos valores.
  - No se regeneran las baselines.
- **Fase C (integraciones):**
  - el lead entra por el endpoint real y queda en la copia, con `EMAIL_NOT_CONFIGURED`;
  - la copia a Google Sheets no está configurada;
  - guardar un FAQ y una entrada registra `embedding skipped`;
  - los medios de la copia quedan en el directorio temporal;
  - GTM no aparece en el HTML;
  - el resumen de red da 0 envíos fuera de la política.
- **Resultado esperado:**
  - la única diferencia visible frente al aprobado es el aviso de privacidad legible;
  - migración y vuelta atrás correctas;
  - 0 salidas no permitidas.

  Cualquier otra cosa se reporta antes de pedir la autorización de respaldo, migración y publicación.

## Sin seed (revisión 3.2)

El 19-oct el usuario decidió que la home, la navegación y el pie se quedan en los archivos del código; los cambios se realizan en el repositorio mediante revisión, pruebas y publicación, y Arroba despliega. Payload queda para el blog, el aviso de privacidad y los leads. Consecuencias:

- **Código:** la home sale de los archivos salvo `HOME_CONTENT_SOURCE=cms`. Antes hacía falta `HOME_CONTENT_SOURCE=static`; un proyecto nuevo sin la variable habría leído un CMS sin seed. Se borró `getResolvedBlogLayout`, sin uso, que leía header y pie del CMS.
- **Procedimiento:** el paso 6 (seed) y el 9 (activar la home desde el CMS) no se ejecutan ([cms-home-rollout.md](cms-home-rollout.md)). Menos escrituras en producción: ni la reescritura de home, header, pie, ajustes y FAQs ni las ~84 imágenes nuevas en Blob.
- **Runner:** sin estado `seed`. Se construye y sirve `mig` en :3105, que es lo que se publica; barrido, movimiento e integraciones van contra él. Una sola comparación, aprobado contra `mig`. Desaparecen `states:parity`, `states:coverage`, `states:seed-links` y las comparaciones con `seed`. La vuelta atrás parte de `mig`. El runner no define `HOME_CONTENT_SOURCE`: prueba el comportamiento por defecto. En el ensayo, una comparación local de `mig` consigo mismo (`visual:dry-self`, fuera de los obligatorios) ejercita la herramienta.

**Ensayo en seco sin seed (19-oct, `8e832c5`, base sustituta, sin producción):** veredicto INCOMPLETO, como corresponde: faltan solo `mirror:complete`, `sitemap:approved`, `visual:approved-vs-mig:errors` y `sweep:motion`, que leen el sitio publicado. 34 PASS, 0 PENDING. INFO: `integrations:cms-invalid`, una FAQ que no valida en español (las respuestas en español quedaron vacías por el bug del seed anterior; el sitio no muestra FAQs del CMS); la prueba de ganchos guarda la siguiente que valida. El marcador confidencial en 0 de los 12 archivos de evidencia; limpieza sin restos. El primer ensayo sin seed (`c7a713a`) se detuvo en esa FAQ, y por eso se cambió `touch`.

## Ejecución 1 (19-oct, sobre `88b2de6`)

Autorizada por el usuario. `catalog`, `extract` y `restore:counts` pasaron. `restore:free-text` se detuvo en 102 falsos positivos: identificadores de fila de Payload (`_uuid`, 24 caracteres hexadecimales) leídos como teléfonos. Sin datos personales. Limpieza completa. Corregido en `3a8f177`. Evidencia: [qa-release-2026-10-19](evidence/qa-release-2026-10-19/README.md).

## Ejecución 2 (19-oct, sobre `0893616`)

Lanzada por el usuario. Con los datos de producción pasaron `catalog`, `extract`, `restore:counts`, `restore:free-text` y todo `states`: 3 migraciones pendientes, todas aplicadas; migrar no cambia ningún enlace con el código anterior ni con el nuevo; la vuelta atrás da la misma home. Se detuvo en `mirror`, sin mensaje: buscaba el host de Blob en el HTML de `/es`, que ya no tiene ninguna URL de Blob porque la home sale de los archivos. La copia sí: 738 medios, todos en un mismo store. Sin nada pendiente de clasificar; limpieza completa. Evidencia: [qa-release-2026-10-19-run2](evidence/qa-release-2026-10-19-run2/README.md).

Corregido después: `mirror` toma el host de la biblioteca de medios de la copia (y falla con mensaje y fila en `status.tsv`); W2 queda solo en `sitemap.xml`. El conteo de migraciones del informe salía en 0 por los colores de `migrate:status`; ahora se quitan antes de contar, también en la comprobación `states:all-migrated`.

## Ejecución 3 (19-oct, sobre `898db63`)

Lanzada por el usuario. Con los datos de producción pasaron otra vez `catalog`, `extract`, `restore` y todo `states` (antes 12 aplicadas y 1 pendiente en el formato corregido del informe). `mirror` tomó el host de Blob de la copia y descargó los 738 originales de la biblioteca de medios sin fallos, pero falló `mirror:complete` con 93 "no encontrados". **No son archivos del sitio:**

- el runner convertía cada nombre de archivo en una URL de Blob, y los objetos de Blob llevan un sufijo aleatorio;
- las variantes de tamaño (miniatura, tarjeta, destacado, hero) de muchos medios apuntan en la base a URLs sin sufijo que no existen en Blob: 739 referencias, 93 rutas distintas. **Hallazgo de producción:** solo afecta a las miniaturas del `/admin`; el sitio usa `media.url`, el original (`src/payload/loaders/shared.ts`), y los 738 existen.

Sin nada pendiente de clasificar; limpieza completa. Evidencia: [qa-release-2026-10-19-run3](evidence/qa-release-2026-10-19-run3/README.md).

Corregido después: `mirror-media.mjs` ya no inventa URLs a partir de nombres; descarga las URLs guardadas y copia cada archivo a la carpeta local con el nombre que tiene en la base. Cada entrada del espejo lleva un papel: `size` para las variantes de tamaño, `required` para todo lo demás. `mirror:complete` falla solo si falta un `required`; las variantes rotas quedan como INFO (`mirror:size-variants`). El ensayo en seco omite `mirror` porque lee Blob, así que este cambio se prueba por primera vez en la ejecución 4.

## Ejecución 4 (19-oct, sobre `b07c889`)

Lanzada por el usuario. Producción pasa otra vez `catalog`, `extract`, `restore` y `states`. `mirror:complete` falló con 1 archivo obligatorio "no encontrado", y `mirror:size-variants` registró 92 variantes de tamaño como INFO. El faltante era otro error del runner: la expresión que busca URLs en el texto corta en `)`, y tres logos de El Universal tienen paréntesis en el nombre (`El_Universal_(México)_Logo-….svg`). Se pedía una URL truncada. Evidencia: [qa-release-2026-10-19-run4](evidence/qa-release-2026-10-19-run4/README.md).

Corregido después: las columnas de URL de la biblioteca de medios se leen completas, sin la expresión. Comprobado sin red contra la copia de esta ejecución, con `fetch` sustituido por una respuesta local: el conjunto nuevo es el anterior menos la URL truncada y más las tres completas; 738 obligatorios, uno por original.

## Ejecución 5 (19-oct, sobre `b17d097`)

Lanzada por el usuario. **Primera ejecución completa:** todos los criterios automáticos pasan con los datos de producción y el sitio publicado (catálogo, extracción, restauración, escaneo, migración y vuelta atrás, espejo con 848 archivos y 92 variantes de tamaño como INFO, build, sitemap con las mismas 40 páginas, barrido de 72 páginas y 10 estados sin errores, movimiento igual al aprobado, lead, ganchos, GTM y red). Un PENDING: 50 de 80 comparaciones visuales por encima del 0.1 %.

Clasificación del usuario ([classification.md](evidence/qa-release-2026-10-19-run5/classification.md)):

- **Artículos (12): defecto.** El artículo debe verse como el publicado. Se revirtió el rediseño (`84e51e6`, merge `c5ab832`), manteniendo el objetivo táctil de 24 px del índice.
- **Aviso de privacidad (4): aceptado,** debe verse legible como en el candidato. Su legibilidad venía del CSS del rediseño; tras revertirlo, dos reglas propias del aviso le dan el ancho completo en la cabecera (`84e51e6`).
- **Fotos recomprimidas (32): aceptadas.**
- **"Carritos de servicio" sin foto (2): artefacto de captura,** comprobado en navegador. El usuario pide que aparezca siempre: `visual-compare` espera ahora a que cada imagen visible esté cargada y decodificada (`cb41b05`).

Limpieza completa. Siguiente: ejecución 6 sobre el SHA con estos cambios.

## Ejecución 6 (19-oct, sobre `b39c38d`)

Lanzada por el usuario. Todos los criterios automáticos pasan otra vez. Un PENDING: 50 de 80 comparaciones visuales por encima del 0.1 %. Los artículos ya se ven como el publicado (solo cambian el espaciado de 24 px del índice y la compresión de las fotos), el aviso se lee bien y las fotos solo están recomprimidas. La tarjeta "Carritos de servicio" seguía sin foto en /services, escritorio.

Decisión del usuario ([classification.md](evidence/qa-release-2026-10-19-run6/classification.md)): **"carritos: investiga"**. Artículos, aviso y fotos no se clasificaron en esta ejecución.

Causa: con la intercepción de peticiones el navegador no usa caché, y la captura de página completa vuelve a elegir la fuente de cada imagen. La tarjeta comparte la foto del encabezado, ya cargada a 1920w; cambiaba a esa copia y se capturaba antes de pintarla. No es un defecto del sitio: en un navegador normal la foto aparece siempre. Corregido solo en la herramienta: cada imagen conserva la fuente elegida para el tamaño de pantalla antes de las esperas de carga y decodificación (`981c3c4`). Comprobado contra el servidor de esta ejecución: sin el cambio, tarjeta vacía en 2 de 2 capturas; con el cambio, foto en 2 de 2, en español e inglés.

Limpieza completa. Siguiente: ejecución 7.

## Ejecución 7 (19-oct, sobre `c9ad178`)

Lanzada por el usuario. Todos los criterios automáticos pasan. Un PENDING: 50 de 80 comparaciones visuales por encima del 0.1 %. Clasificación del usuario ([classification.md](evidence/qa-release-2026-10-19-run7/classification.md)), respuesta "si se ve bien":

- **Artículos, autores y revisores (24): aceptados.** Mismo diseño que el publicado; solo cambian el espaciado de 24 px del índice y la compresión de las fotos.
- **Aviso de privacidad (4): aceptado,** legible.
- **Fotos recomprimidas: aceptadas.**
- **"Carritos de servicio": con foto en ambos lados.** En /services solo queda la recompresión (2.3 % en la ejecución 6, 1.0 % ahora).

La ejecución se lanzó tres veces a la vez. Las dos copias sobrantes (`20261019-1905-03fd`, detenida en `serve` por el puerto ocupado, y `20261019-1908-8ba2`, detenida a mano durante `states`) las limpió el usuario con `run.sh cleanup`; la segunda con `QA_DISCARD`, sin nada que clasificar. A producción solo llegaron las lecturas de solo lectura de `catalog` y `extract` de cada una.

Limpieza completa. Resultado: **sin defectos visuales pendientes según la clasificación del usuario.** Límites: el veredicto automático sigue en PENDIENTE DE CLASIFICACIÓN (la aceptación es del usuario, en `classification.md`); `integrations:cms-invalid` informa que la FAQ #5 en español no valida (Answer 1 > Paragraph, respuesta vacía del seed anterior). Es deuda de contenido fuera de la home estática, que no muestra FAQs del CMS: responsable, contenido de Zitrone/Arroba; corregirla en `/admin` antes de editar esa FAQ en el CMS. La prueba de ganchos cubre los documentos que guardó, no todos los del CMS. Siguiente, con autorización explícita para cada paso: revisión final de Codex, CI sobre el SHA final, respaldo, migración alojada, merge y repositorio de Arroba.

## Ensayo en seco (19-oct, sin producción, flujo con seed de la revisión 3.1)

Se ejecutó completo, del principio a la limpieza, sobre el SHA final del runner (`4c342db`), con un `TMPDIR` normal de macOS.

- **Fuente sustituta:** dentro del contenedor de la ejecución. La crearon el código publicado (`255eec2`), con migración y seed, y los slugs en español de producción. Se le añadieron 3 leads, 1 usuario y un marcador confidencial sintético, sin dígitos, en 8 filas: el pie y el CTA de los artículos.
- **Pasos omitidos:** `mirror` y las comparaciones contra el aprobado, que leen el sitio publicado. Quedan como SKIPPED.

| Paso | Resultado (`status.tsv`) |
| --- | --- |
| `catalog`, `extract` | PASS: coincide con el inventario y el snapshot de `sales_role`; sesión de solo lectura; volcado de 164 tablas aprobadas |
| `restore` | PASS: conteos iguales, leads y usuarios con 0 filas; escaneo de texto libre limpio |
| `states` | **PASS:** paridad 0/0, cobertura 0/0, avance tras la vuelta atrás igual; migrar no cambia ningún enlace con ninguno de los dos códigos.<br>**PENDING:** 23 enlaces cambiados por el seed (seed anterior sin etiquetas en español).<br>**INFO:** la captura con el código nuevo falla sobre el esquema anterior. |
| `build`, `serve` | PASS |
| Visual `mig` contra `seed` | PASS: 8 comparaciones, 0 errores, 0 páginas por encima del 0.1 % |
| `sweep` | **PASS:** 72 páginas (200, sin desbordamiento, sin imágenes rotas, sin errores de consola reales); 10 estados sin errores.<br>**INFO:** 160 errores excluidos, todos de los scripts `/_vercel/insights` y `/_vercel/speed-insights`. |
| `integrations` | PASS: lead `201`, exactamente 1, con `EMAIL_NOT_CONFIGURED`; 2 guardados con 2 `embedding skipped`; GTM ausente; red sin salidas fuera de la política |
| Veredicto | **INCOMPLETO.** Faltan `mirror:complete`, `sitemap:approved`, las dos comparaciones contra el aprobado y `sweep:motion`. Además queda el PENDING del seed. |
| `evidence` | 12 archivos de la lista fija; el marcador aparece en 0 de ellos (y en la captura privada) |
| `cleanup` | 0 contenedores, worktrees, servidores escuchando, temporales y directorio; `zitrone-staging-pg` intacto |

**Lo que detectaron los ensayos de esta revisión, ya corregido:**

- **La base sustituta servía los artículos en español con 404,** por los slugs del seed anterior. El nuevo criterio del barrido lo detuvo.
- **El criterio de embeddings fallaba con un solo proceso.**
- **El escaneo detuvo un marcador con 12 dígitos seguidos,** que parece un teléfono. Es el comportamiento esperado; el marcador del ensayo ya no tiene dígitos.
- **La limpieza dejaba servidores encendidos con un `TMPDIR` en `/var`.**

**Hallazgos de la revisión 2 que siguen vigentes:**

- **Paso 4 del [procedimiento](cms-home-rollout.md):** la captura previa a migrar se hace con el código publicado.
- **Payload intenta enviar telemetría desde cada proceso,** y el guard la bloquea.

**Lo que el ensayo no cubre:**

- **Producción con `remove_billing_page` pendiente,** si es el caso: la fuente sustituta ya venía sin facturación.
- **La comparación con el sitio aprobado y el espejo de Blob:** ambos leen el sitio publicado.

## Límites declarados

- **El guard de Node cubre `fetch`, TCP y TLS, no DNS ni UDP.** La app no usa ninguno de los dos para proveedores.
- **La política del navegador no ve WebSockets.** El sitio no los usa.
- **Las imágenes del candidato llevan URLs locales** (`/api/media/file/...`) en vez de las de Blob: sin token, Payload sirve los medios desde el directorio. Los archivos son los mismos.
- **La sesión de solo lectura no la impone un rol:** la aplica la sesión. Crear un rol de solo lectura en Neon sería una escritura en el servicio, y no se hace sin una autorización aparte.

## Autorización

Una sola autorización para ejecutar este plan sobre un SHA exacto de `release/2026-10`, que debe ser el que contiene este runner (`init` se niega si `run.sh` difiere del de ese commit). El texto que se autoriza indica:

- el SHA candidato, completo, de 40 caracteres;
- el deployment de referencia del sitio aprobado (hoy `dpl_C4cjcDJvz9UEwqs8z1n4pSM3hJv3`); `compare` se detiene si producción ya no está en él.

Cubre:

1. Las lecturas P1, P2, W1–W4 y D1 de la tabla de lecturas, y nada más fuera de esta computadora.
2. Todo lo demás, que es local: contenedor propio, checkouts temporales, builds, servidores en `127.0.0.1`, navegador.
3. La pausa: detenerse tras `integrations` y `evidence`, presentar al usuario cada PENDING con sus capturas privadas, y limpiar solo después de su clasificación.
4. Copiar a `docs/evidence/qa-release-<fecha>/` la evidencia saneada (la lista fija de `evidence`, más `classification.md`), en un commit local revisable. Las capturas de pantalla y las exportaciones del CMS se quedan en el directorio privado y se borran con `cleanup`.

No cubre:

- escribir en Neon, Blob, Resend, Google ni Vercel, ni migrar o sembrar la base alojada;
- crear ramas, roles, previews o variables;
- push, merge, despliegue ni publicación;
- enviar correo real o mensajes a Arroba.

Si un paso falla, la ejecución se detiene, se guarda la evidencia del fallo y se reporta. Corregir y repetir requiere una autorización nueva sobre el nuevo SHA.

**Un veredicto favorable del QA no aprueba la publicación.** Respaldo, migración alojada, CI del SHA final y merge siguen siendo pasos aparte, cada uno con su autorización.
