# Pendientes reales para entregar — 12 de octubre de 2026

> **Actualización 13-oct:** [plan de entrega vigente](plan-entrega-arroba-2026-10-13.md). Arroba recibe hosting en su Vercel y administra DNS. Las acciones se preparan con su equipo receptor; no se agregan .com.mx al origen como requisito. La ejecución externa sigue pendiente.


> **Actualización 18-oct (Claude).** Cambios de estado desde esta lista; el resto de filas sigue vigente.
>
> - **Versión publicada (E0):** zitrone.mx sirve `dpl_C4cjcDJvz9UEwqs8z1n4pSM3hJv3`, creado el 15-oct desde `4563464` con cambios sin commit. El usuario indica que es la versión aprobada. Detalle en el [inventario](inventario-repositorio-2026-10-15.md#versión-en-producción-y-decisiones-del-17-oct).
> - **Release (E1, filas 6 y 8):** todo lo aceptado está en `release/2026-10`, PR #5 en borrador hacia `main`. El CI con Node 24 pasa en GitHub. Fuentes autoalojadas con licencias (`public/fonts/`, evidencia `evidence/fonts-2026-10-15/`).
> - **Secuencia decidida:** QA de la versión final, respaldo y migración; después publicar fusionando a `main`, y entregar a Arroba los mismos archivos publicados en un repositorio nuevo, con la correspondencia de SHA registrada. [Procedimiento](cms-home-rollout.md).
> - **Abierto antes de publicar:** QA visual contra el deployment aprobado (R9), revisión de Codex del SHA final, estado de migraciones (fila 2), respaldo y restauración (filas 19–20), migración y publicación (fila 4). La fila 3 queda resuelta por `release/2026-10`.

Claude, commit de referencia `63a5d0a` (rama `design-system/type-unification`). Sustituye las listas de pendientes de informes anteriores donde se contradigan. **El proyecto no está listo para entregar.** Las pruebas locales pasan, pero falta lo que solo se demuestra en producción o con el cliente: la versión publicada, la base alojada, la recepción real de leads, los accesos, el respaldo y los dominios.

Facturación no aparece en esta lista: el flujo del sitio fue eliminado y el enlace de correo es definitivo (BILL-01 cerrado). La migración `remove_billing_page` aparece solo como limpieza de tablas antiguas.

Cada fila lleva un tipo:

- **Local**: lo hace desarrollo en este checkout, sin tocar nada externo.
- **Decisión**: la toma el usuario o Zitrone; desarrollo aplica el resultado.
- **Externa**: requiere acceso a un servicio (Vercel, Neon, Resend, GitHub, Google, DNS) o enviar algo real. Se ejecuta solo con aprobación explícita y siguiendo [los pasos de abajo](#pasos-externos-preparados-para-aprobación).

## Hallazgo nuevo: hay un despliegue a producción sin registrar

Lectura de solo consulta (`vercel ls`, `vercel inspect`, `curl`, 12-oct 19:10 CST):

- `www.zitrone.mx` y `zitrone.mx` apuntan a un despliegue de producción creado el **12-oct-2026 a las 18:27 CST** por la cuenta `opina-8590`. No lo hizo Claude y no aparece en DELIVERY.md ni en el log de progreso.
- El despliegue no trae metadatos de Git. Su CSS publicado contiene los tokens de `d3463a8` (hovers y etiquetas en lime-500, icono de servicio en lime-600), así que incluye al menos hasta ese commit. A esa hora el HEAD local era `52419f5`, con documentos de Codex sin commit. **No se puede afirmar qué commit exacto está publicado.**
- Por lo tanto, el código del rol `sales` (`5c4b200`) ya está en producción. Si la migración `20261008_133454_sales_role` no se aplicó en Neon, crear o asignar cuentas `sales` fallará. Claude intentó leer el estado de migraciones de la base alojada en modo solo lectura y **el permiso fue denegado**; el estado es desconocido.
- Comprobado en vivo: `/es`, `/es/contact`, `/en/contact`, `/admin` y el sitemap responden 200; `/api/billing-request` responde 404 (correcto); la cinta dice "Comidas diarias en grandes empresas: 15,000". No se envió ningún formulario.

Esto pasa al primer lugar de la lista ([paso E0](#e0-identificar-la-versión-publicada-y-el-estado-de-la-base)).

## Lista

### Versión publicada y release

| # | Pendiente | Tipo | Quién | Estado |
| --- | --- | --- | --- | --- |
| 1 | Identificar quién publicó el despliegue de las 18:27, desde qué commit y si se aplicaron migraciones antes | Externa | Usuario | Abierto (E0) |
| 2 | Leer el estado de migraciones en Neon: `sales_role` y `remove_billing_page` | Externa (lectura) | Usuario o Claude con permiso | Abierto (E0) |
| 3 | Definir el commit de entrega (release candidate) y congelar cambios discrecionales | Decisión | Usuario | Abierto |
| 4 | Publicar ese commit desde una copia limpia, con smoke test y registro de commit + URL de despliegue | Externa | Usuario o Claude con aprobación | Abierto (E3) |
| 5 | Llenar el acta de aceptación con versión, gates y excepciones | Local + Decisión | Claude redacta; Zitrone firma | Abierto |

### CI en GitHub

| # | Pendiente | Tipo | Quién | Estado |
| --- | --- | --- | --- | --- |
| 6 | Correr el CI real (jobs `validate` e `isolated-api`, Node 24). La rama tiene 46 commits sin subir; el último CI en GitHub es del 14-ago. Requiere push y PR | Externa | Usuario aprueba push/PR | Abierto (E1) |
| 7 | Réplica local del CI en copia limpia, Node 24.21.0, sin `.env` | Local | Claude | **Hecho** (ver [resultados](#verificación-local-de-hoy)) |
| 8 | Fuentes autoalojadas en 146b966; eliminadas importaciones de next/font/google. Completar licencias, evidencia reproducible y validación de la versión integrada. Fallo de cookies 60/61 reportado se investiga por separado. [Revisión](revision-fuentes-2026-10-15.md) | Local | Claude implementa; Codex revisa | Implementado; cierre de verificación pendiente |

### Operación de leads

| # | Pendiente | Tipo | Quién | Estado |
| --- | --- | --- | --- | --- |
| 9 | Prueba real de recepción: 4 envíos (contacto ES/EN, home ES/EN) a `opina@` y un buzón de visitante, con respuesta desde Workspace | Externa | Usuario autoriza; ventas confirma | Abierto (E5) |
| 10 | Crear las cuentas `sales` de las dos personas de ventas (después de la migración) | Externa | Admin del CMS | Abierto (E4) |
| 11 | Nombres, suplente, horario y tiempo de respuesta de quien atiende leads | Decisión | Zitrone | Abierto |
| 12 | Responsable y frecuencia de revisión de envíos fallidos (`email:retry`, ventana de 23 h) y rebotes en Resend | Decisión | Zitrone | Abierto |
| 13 | Política de retención y borrado de leads | Decisión | Zitrone | Abierto |
| 14 | Regla de Vercel Firewall para limitar `POST /api/contact-request` (5 por 10 min por IP), o aceptar por escrito el límite por instancia | Decisión + Externa | Usuario | Abierto (E9) |
| 15 | Confirmar que la clave de Resend expuesta ya no existe | Externa | Admin de Resend | Abierto (E6) |

### Accesos y cuentas

| # | Pendiente | Tipo | Quién | Estado |
| --- | --- | --- | --- | --- |
| 16 | Owner, suplente, MFA y costos de cada servicio (tabla en [operacion-y-entrega.md](operacion-y-entrega.md#cuentas-y-responsables)): GitHub, Vercel, Neon, Blob, Resend, Sentry, GTM/GA4/Ads/Search Console, DNS | Decisión | Zitrone | Abierto, todas las celdas vacías |
| 17 | Confirmar recepción de hosting, equipo Vercel y responsables de Arroba; preparar repositorio/main validado para importación y despliegue por Arroba | Decisión + Externa | Arroba + desarrollo + Zitrone | Pendiente de respuesta de Arroba; [plan vigente](plan-entrega-arroba-2026-10-13.md) |
| 18 | Revisar que las URLs de Neon usen `sslmode=verify-full` (aviso de `pg` en el build) | Externa | Owner de Neon | Abierto |

### Respaldo y restauración

| # | Pendiente | Tipo | Quién | Estado |
| --- | --- | --- | --- | --- |
| 19 | Respaldo real de Neon (`pg_dump -Fc`) antes de cualquier migración, guardado cifrado fuera de Neon | Externa | Usuario aprueba | Abierto (E2) |
| 20 | Restauración real de ese respaldo en una base aislada (rama de Neon), no en producción | Externa | Usuario aprueba | Abierto; solo existe el simulacro sintético del 30-sep |
| 21 | Ventana de recuperación de Neon según el plan, y respaldo de Vercel Blob | Externa (lectura de panel) | Owner de Neon/Vercel | No verificado |
| 22 | Frecuencia, retención y responsable de respaldos | Decisión | Zitrone | Abierto |

### Dominios y medición

| # | Pendiente | Tipo | Quién | Estado |
| --- | --- | --- | --- | --- |
| 23 | www.zitrone.mx principal; Arroba conecta los cuatro hosts en su proyecto receptor y gestiona DNS | Externa | Arroba, con validación de desarrollo | Arquitectura corregida13-oct; registros exactos los genera el destino, no el proyecto de origen |
| 24 | Compartir plan completo, ficha y mensaje de recepción con Raúl/Arroba | Externa (mensaje) | Usuario / Raúl | Mensaje preparado sin enviar (fuera del repositorio) |
| 25 | `zitrone.mx` responde 307; cambiar a 308 en Vercel → Domains si se busca permanencia | Externa | Usuario | Abierto |
| 26 | Documento de integridad (`/es/politica-de-integridad`): publicar texto aprobado o retirar por escrito | Decisión | Zitrone | Abierto |
| 27 | Inventario de URLs antiguas (Search Console, campañas, QR) y equivalencia de nosotros/clientes/diferenciadores | Externa + Decisión | Quien tenga Search Console | Abierto |
| 28 | GTM: importar la receta `generate_lead`, apuntar Ads, pausar el `form_submit` viejo, publicar tras Preview ([gtm-activation.md](analytics/gtm-activation.md)) | Externa | Quien tenga acceso a GTM | Abierto (E7) |
| 29 | Search Console: verificar ambos dominios; cambio de dirección después del corte | Externa | Zitrone | Abierto (E8) |
| 30 | Política regional de consentimiento (hoy concede por defecto fuera de EEE/UK/CH) | Decisión | Zitrone / legal | Abierto |

### Contenido, marca y calidad

| # | Pendiente | Tipo | Quién | Estado |
| --- | --- | --- | --- | --- |
| 31 | Aprobar las 13 afirmaciones del [registro](registro-de-afirmaciones.md): cifra de 15,000 comidas, 17 años, Distintivo H, testimonios y logos con permiso, cobertura por zona, café de Chiapas/Veracruz, revisor del blog | Decisión | Zitrone | Ninguna aprobada |
| 32 | Aceptar por escrito la excepción de contraste del verde lime-500 sobre fondos claros (titulares, hovers, etiquetas café/despensa) | Decisión | Zitrone | Abierto |
| 33 | Color del chip de blog "Bienestar y productividad" (hoy lime-700): excepción, lime-500 con excepción de contraste u otro estilo de marca | Decisión | Usuario | Abierto |
| 34 | Revisión manual de accesibilidad: teclado, VoiceOver, zoom 200–400 %, ES/EN | Local | Claude o QA | Abierto |
| 35 | Revisión visual de plantillas clave ES/EN en móvil y escritorio. `test:visual` hoy: **60/60 fallan** contra referencias del 4-sep, anteriores al rediseño de la home, los iconos y los colores (12–55 % de píxeles distintos). La puerta visual está desactualizada y hoy no detecta regresiones. Paso: el usuario revisa capturas actuales; solo con su visto bueno se regeneran referencias (`test:visual:update`) | Local + Decisión | Claude captura; usuario aprueba | Abierto |
| 36 | Performance: el CSS global sigue siendo hipótesis. Siguiente paso: comparativo con una variante de CSS por ruta, con comandos y trazas guardados. **Sin refactor hasta que el comparativo lo demuestre** | Local | Claude | Abierto |
| 37 | Capacitación (CMS, leads, recuperación de correos), periodo de soporte y canal | Decisión | Zitrone | Sin agendar |

## Verificación local de hoy

Réplica de los dos jobs de `.github/workflows/ci.yml` sobre un `git archive` limpio de `63a5d0a`: sin `.env`, Node **24.21.0** (binario oficial verificado con SHASUMS256), `npm ci`, y Postgres local desechable vía `TEST_PG_URL` como en CI. Script y logs: [evidence/delivery-checks-2026-10-12/](evidence/delivery-checks-2026-10-12/).

| Paso de CI | Resultado |
| --- | --- |
| npm ci, env:check, lint, tsc, assets, email, design:audit | Pasan (design: deuda 511 sin crecer) |
| test:contracts | 83/83 |
| build | Pasa |
| test:e2e (incluye axe en 21 páginas) | **61/61**, sin reintentos |
| test:scripts (guard de base de prueba) | 12/12 |
| test:api | 30/30 |
| test:cache | 4/4 |
| 4 builds extra desde cero (`rm -rf .next`) | 3 pasan; **1 falla por la fuente de Google** (fila 8) |

Observaciones:

- Un build desde cero tardó 6.6 min en la fase de TypeScript (los otros, segundos). Sin explicación; no falló.
- `test:visual` (corrida aparte, Node 25.8.1): **60/60 distintos** de las referencias del 4-sep (fila 35). No es un resultado de regresión sino de referencias viejas.
- Esto **no** sustituye el CI de GitHub (fila 6): mismo código y versión de Node, pero Linux, red y caché distintos.
- No cubre: revisión manual de accesibilidad, recepción real de correos, producción, base alojada, GTM ni dominios.

## Pasos externos preparados para aprobación

Ninguno se ha ejecutado. Cada paso necesita un "sí" explícito del usuario para ese paso; aprobar uno no aprueba los siguientes. Ninguno usa `release:home:prod` ni comandos `*:prod`.

### E0. Identificar la versión publicada y el estado de la base

- **Quién:** el usuario (o Claude si se le da permiso de lectura de producción).
- **Qué:** (1) confirmar quién ejecutó el despliegue del 12-oct 18:27 CST y desde qué commit; (2) leer, sin escribir, las migraciones aplicadas en Neon.
- **Comando de lectura propuesto** (sesión de solo lectura; no inicializa Payload, así que no puede empujar esquema):
  `PGOPTIONS='-c default_transaction_read_only=on' psql "$DATABASE_URL" -At -c "select name from payload_migrations order by created_at desc limit 5"`
- **Esperado:** aparecen `20261008_133454_sales_role` y `20260930_042253_remove_billing_page`. Si faltan, el paso E2 es urgente, porque el código publicado ya espera el rol `sales`.

### E1. CI real en GitHub

- **Requiere:** aprobación para `git push origin design-system/type-unification` y abrir un PR hacia `main`. El CI se dispara con `pull_request`; también existe `workflow_dispatch`.
- **Antes:** confirmar que el repositorio no tiene secretos en el historial nuevo (la réplica local corre sin `.env`, así que el CI no los necesita).
- **Esperado:** `validate` (lint, tsc, assets, email, design, contratos, build, E2E) e `isolated-api` (guard, API, caché) en verde con Node 24. Guardar el enlace del run en DELIVERY.md.
- **No incluye:** merge a `main` ni despliegue.

### E2. Respaldo y migraciones alojadas

- **Requiere:** aprobación explícita y ventana acordada. Solo si E0 muestra migraciones pendientes.
- **Pasos:**
  1. `pg_dump -Fc "$DATABASE_URL_UNPOOLED" -f zitrone-AAAAMMDD.dump`, guardado cifrado fuera de Neon. Anotar tamaño y hora.
  2. (Recomendado) restaurar ese dump en una rama de Neon y revisar conteos de leads y artículos.
  3. `npm run payload:migrate:status` con la URL alojada para listar pendientes; confirmar que solo aparecen las dos esperadas.
  4. `npm run payload:migrate`.
  5. Repetir el paso 3: sin pendientes.
- **Reversión:** restaurar el dump en una base nueva y cambiar `DATABASE_URL` solo si se decide promoverla. `remove_billing_page` borra tablas sin uso; `sales_role` agrega un valor de rol.

### E3. Publicación del release candidate

- **Requiere:** commit elegido (fila 3), E1 en verde, E2 hecho, aprobación del día y hora.
- **Pasos:** `git worktree add ../zitrone-release <commit>`; copiar `.vercel/project.json`; `vercel --prod` desde esa copia. Anotar URL de despliegue y commit en DELIVERY.md.
- **Smoke:** `/es`, `/en`, un servicio, un artículo, `/es/contact`, `/en/contact`, sitemap, `/admin` (login), un redirect antiguo.
- **Reversión:** Instant Rollback al despliegue anterior en Vercel. No deshace la base.

### E4. Cuentas de ventas

- **Requiere:** E2 aplicado; nombres y correos de las dos personas.
- **Pasos:** un admin crea dos usuarios con rol `sales` en `/admin`. Cada persona entra y comprueba que ve leads, puede cambiar estado y notas, exportar CSV, y no puede editar contenido ni borrar leads.

### E5. Prueba real de leads

- **Requiere:** aprobación, fecha y aviso a ventas. Guion completo en [operacion-y-entrega.md](operacion-y-entrega.md#guion-de-prueba-real-para-autorizar-no-ejecutado).
- **Resumen:** 4 envíos marcados "PRUEBA" en el despliegue definitivo; `npm run email:retry -- ZC-folio` muestra `accepted`; llegada a `opina@` (y spam) y al buzón de visitante; respuesta desde Workspace llega; un `generate_lead` por envío en GTM Preview; leads cerrados con nota "prueba".

### E6. Clave de Resend

- **Quién:** admin de Resend. En API Keys, confirmar que la clave expuesta ya no existe; anotar fecha y nombre en operacion-y-entrega.md. No pegar la clave.

### E7. GTM, GA4 y Ads

- **Quién:** quien tenga acceso a GTM-TSTDVS4, GA4 y Ads. Pasos 1–7 de [gtm-activation.md](analytics/gtm-activation.md): exportar la versión publicada (es el rollback), importar la receta, apuntar la conversión de Ads a `generate_lead`, pausar el `form_submit` viejo, Preview y luego publicar. Coordinar con E5 para que los envíos de prueba sirvan de verificación.

### E8. Dominios y Search Console

- **Arquitectura vigente:** Arroba recibe hosting y genera/aplica los registros de su destino. Confirmar recepción, equipo y ventana con Arroba; seguir fases4–6 del [plan completo](plan-entrega-arroba-2026-10-13.md). No preparar asociaciones .com.mx en origen.
- **Pasos:** seguir la secuencia y aceptación de [handoff-arroba-2026-10-12.md](handoff-arroba-2026-10-12.md). No tocar NS, MX, SPF, DKIM ni DMARC; no reclamar `zitrone.com.mx` a nivel equipo. Después del corte: cambio de dirección en Search Console y sitemap nuevo.

### E9. Límite de envíos en Vercel Firewall

- **Requiere:** decisión de la fila 14 y confirmar que el plan lo incluye. Regla sobre `POST /api/contact-request`, por IP, 5 por 10 minutos, acción *deny* o *challenge*. Probar con un envío normal que el formulario sigue funcionando.
