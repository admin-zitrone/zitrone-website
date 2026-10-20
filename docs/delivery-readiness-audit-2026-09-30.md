# Auditoría de entrega — Zitrone, 30 de septiembre de 2026

> Actualización de alcance, 12-oct-2026: el usuario eliminó el flujo de facturación del sitio; el enlace de correo es la solución definitiva. Las propuestas o pendientes de formulario/API/automatización de facturación de esta auditoría son históricos y no forman parte del trabajo actual. BILL-01 está cerrado; ver [DELIVERY.md](../DELIVERY.md).

## Dictamen

**La versión actual tiene una base funcional comprobada, pero todavía no está lista para una entrega final sin reservas.** No hace falta rehacer el sitio. Hace falta cerrar regresiones, permisos de datos, decisiones de contenido y una entrega operativa verificable.

Revisión del commit `7d67dac6796446eeb512ed3040ffa7c3560273ed`, rama `design-system/type-unification`, inicialmente sin cambios locales. Incluye cambios hasta el 29 de septiembre, posteriores al chat del blog. Este informe sustituye las conclusiones de septiembre 7 y 24 únicamente en los puntos comprobados aquí; no convierte observaciones antiguas de producción en evidencia actual.

## Alcance y límites

Revisados: código, historial, configuración, CI, pruebas, blog/CMS, leads, analytics, redirects y documentación de entrega. Ejecutadas pruebas locales; no se desplegó, migró la base, modificó DNS, envió correo ni sometió un lead real. No se inspeccionaron valores de secretos ni datos personales. El build usa la configuración local y puede leer el CMS configurado; no es un build hermético ni prueba el entorno del cliente.

Browser falló al inicializar (`node:process` no permitido). Se usaron las suites Chromium del repositorio. Esto no equivale a revisión visual manual, VoiceOver ni certificación WCAG. No se midieron Lighthouse/Core Web Vitals ni se verificaron paneles privados, permisos de cuentas o restauraciones. El dominio público no se usó para diagnosticar este checkout; el tracker indica que debe verificarse al liberar la versión elegida.

## Evidencia de esta revisión

| Control | Resultado | Qué demuestra |
| --- | --- | --- |
| `npm run test:contracts` | **76/76 pasan** | Contratos locales, incluidos blog, SEO, consentimiento y protección de roles. No prueba API de permisos contra una base aislada. |
| `npx tsc --noEmit` | **Pasa** | Tipos de este checkout. |
| `npm run lint` | **Falla: 1 error, 0 warnings** | `home-page.tsx:219`, estado actualizado directamente dentro del efecto. |
| `npm run design:audit` | **Falla: 2 categorías** | 566 usos de primitivas frente a 519 permitidos (+47); 38 valores tipográficos directos frente a 0 permitidos. |
| `npm run assets:check` | **Pasa después del prebuild** | 250 assets y 39 clientes consistentes. Un primer check coincidió con la escritura del generador y no es evidencia fiable de un defecto del checkout. |
| `npm run email:check` | **Pasa** | 12 colores coinciden con tokens. |
| `npm run env:check` | **Pasa en modo runtime** | Validador limitado; no verifica acceso a Neon/Resend/Blob ni entrega de correo. No hay credenciales de build Sentry en ese contexto. |
| `npm run build` | **Pasa fuera del sandbox** | Compilación, tipos y generación local. El intento inicial quedó bloqueado más de 5 minutos; se detuvo solo ese proceso y se repitió. |
| `npm run test:contact` | **26/26 pasan** | ES/EN, tres pasos por servicio, comedor, varios servicios, reintentos, doble envío, jerarquía geográfica y profiler de home. POST interceptados. |
| `npm run test:migration` | **30/30 pasan** | Suite aislada, no certifica DNS/SSL ni recepción en Google. |
| `npm run test:a11y` | **17 pasan / 4 fallan** | Gate automatizado; tiene una excepción explícita de contraste. |

El build vuelve a advertir sobre la futura semántica SSL de las URLs Postgres. Revisar con el owner la configuración explícita de verificación del certificado; no se cambiaron credenciales. El navegador también advierte sobre proporciones CSS del logo Amazon: requiere revisión visual, no se ha demostrado deformación.

## Hallazgos priorizados y aceptación

### A-01 · P0 de entrega · Los controles obligatorios volvieron a fallar

**Confirmado.** [home-page.tsx](../src/app/_components/home/home-page.tsx), componente `OperatingServiceWidget`, ejecuta `setAnimated(true)` dentro de un efecto. Lint lo rechaza. El [control de diseño](../scripts/design-system-audit.sh) detecta 85 ocurrencias por encima de los límites en dos categorías, principalmente en `marketing.css`.

Impacto: esta versión no pasa la secuencia de CI definida en `.github/workflows/ci.yml`. No se ha inspeccionado el último run remoto; se reproduce localmente el fallo que lo bloquearía. Un build exitoso no lo compensa.

**Cierre:** corregir el efecto y expresar los estilos nuevos mediante tokens semánticos/componentes. Mantener decisiones visuales aprobadas; no aumentar la tolerancia solo para ocultar errores. Ejecutar los gates y asociar un resultado verde al commit final. Responsable propuesto: desarrollo.

### A-02 · P0 de entrega · La inmutabilidad de leads solo existe en el panel

**Confirmado por código, no explotado.** [contact-requests.ts](../src/payload/collections/contact-requests.ts) permite `update` a cualquier usuario autenticado. Nombre, correo, mensaje, folio y atribución tienen `admin.readOnly`, pero no restricciones de escritura de campo ni un hook de inmutabilidad. Solo `emailDelivery` tiene la protección explícita. La descripción promete que los datos recibidos no se reescriben.

Además, [export](../src/app/api/leads/export/route.ts) permite exportar todos los leads a cualquier usuario autenticado, usando `overrideAccess: true`. Puede ser una política intencional, pero no existe separación entre editor de contenidos y operador de ventas en ese endpoint.

**Cierre:** decidir roles de contenido/ventas; impedir por API cambios a los datos originales; permitir únicamente estado y notas según rol; limitar lectura/exportación a quienes la necesitan. Probar anónimo/editor/operador/admin en base aislada, incluidos intentos de modificación. No confundir esto con la escalación de rol de septiembre 7: esa protección ya existe y sus contratos pasan.

### A-03 · P1 antes de presentación · Un contador aparenta información en vivo

**Confirmado.** ES/EN usan `ribbonStat.value: 15000` con “Comidas servidas hoy” / “Meals served today”. [hero-daily-stat.tsx](../src/app/_components/home/hero-daily-stat.tsx) mueve el valor alrededor de 15,000 mediante `Math.random()`, sin fuente del día. El texto para lectores de pantalla conserva el número fijo.

**Cierre:** usar una cifra diaria/promedio aprobada con período y fuente, sin incrementos ficticios, o conectar un dato real y mostrar cuándo se actualizó. Revisar también autorización de métricas de servicio, certificaciones, testimonios, logos y cobertura. No se verificó la exactitud comercial de esas afirmaciones.

### A-04 · P1 · CMS y repositorio no tienen una frontera de edición suficientemente clara

**Confirmado por código.** El blog ya tiene título/description SEO, checklists, enlaces y CTA en ambos modelos. Hay migraciones del 24/25 de septiembre y slugs localizados. No está perdido el trabajo anterior.

Pero [blog.ts](../src/payload/loaders/blog.ts) usa contenido estático cuando no encuentra un post publicado, cuando no hay resultados o cuando falla la consulta. Un artículo estático despublicado puede seguir visible por el fallback. Listados y páginas individuales tampoco tienen exactamente la misma condición de fallback. No debe prometerse al editor que “despublicar” retira inequívocamente una entrada.

La home mezcla CMS y contenido de código; algunos overrides se ignoran deliberadamente. El README dice que Payload es la fuente de verdad y después manda sincronizarlo desde código. También conserva rutas absolutas a `Documents/On It`.

**Cierre:** matriz editable/código por sección y entorno; política explícita para errores frente a despublicación; prueba de editar/publicar/despublicar/recuperar en staging; comprobar estado de migraciones y contenido en el entorno destino. No ejecutar `release:home:prod` como validación: sincroniza CMS y despliega.

### A-05 · P1 · Dos recetas de Google pueden contabilizar el mismo lead

**Confirmado en documentación; estado publicado desconocido hoy.** [gtm-activation.md](analytics/gtm-activation.md) transforma `contact_request_accepted` en `generate_lead`. [analytics-tracking.md](analytics-tracking.md) y el JSON importable escuchan el `generate_lead` que ya emite la app. Instalar ambos caminos puede duplicar la conversión.

**Cierre:** elegir una única receta actual, retirar la alternativa del manual activo y validar en Preview/DebugView: 201 = una conversión; error/202 = cero; reintento no duplica. Confirmar consentimiento, propiedad y Ads principal. El resultado de GTM del 22 de septiembre es histórico, no una comprobación de la versión publicada hoy. La desactivación de GTM en desarrollo permanece; `url_passthrough` sigue activo en producción, por lo que `_gl` puede seguir apareciendo allí.

### A-06 · P0 del gate / P1 de remediación · Accesibilidad falla en home

**Confirmado en build de producción local:** fallan home EN, home ES, home a 320 px y la prueba con menú móvil abierto. Las dos primeras detectan `.ds-operating-profile-day-meals` con contraste 3.72:1 frente a 4.5:1 requerido para ese texto. Las cuatro detectan controles `.ds-service-spotlight-dot` de 8 × 8 px y separación insuficiente. La prueba con menú abierto señala el carrusel de fondo, no un defecto demostrado en los botones del menú. Revisada su captura de fallo. Corregir contraste y ampliar área interactiva/separación manteniendo el punto visual; repetir gate. Las otras 17 pruebas pasan.

La suite filtra errores de contraste en determinados acentos verdes por decisión de marca del 23 de septiembre. [accessibility.md](accessibility.md) documenta 2.1–2.25:1 en superficies claras, por debajo de su objetivo de texto grande. Un resultado verde de esa suite no significa conformidad completa. No se cambió la decisión visual durante la auditoría.

**Cierre:** acordar color conforme o registrar claramente la excepción en la aceptación; revisión manual teclado/VoiceOver, zoom y móvil; revisar plantillas ES/EN y estados del formulario. El manual aún dice que no hay CI, pero sí existe y ejecuta `test:e2e`, que incluye accesibilidad.

### A-07 · P1 · Recepción y recuperación operativa pendientes de acreditar

El código guarda leads y snapshots antes de notificar; tiene reintentos y recuperación manual. El log del 17 de septiembre registra aceptación de Resend, no evidencia actual de llegada al inbox. [contact-email-delivery.md](contact-email-delivery.md) reconoce que no hay webhook ni worker programado y exige revisar/reintentar dentro de 23 horas.

**Cierre:** owner y suplente de ventas, frecuencia de revisión, respuesta esperada, una prueba autorizada de inbox/respuesta, revisión de rebotes y simulación de recuperación. Confirmar revocación de la clave temporal expuesta mencionada en el historial sin copiarla. Google Sheets quedó diferido: no tratar su ausencia como una regresión.

[rate-limit.ts](../src/lib/rate-limit.ts) sigue usando un `Map` por proceso. No garantiza un límite compartido entre instancias. Verificar protección del proveedor o implantar contador compartido y probarla antes de campañas. La comprobación de tamaño depende de `Content-Length`; documentar/verificar también los límites reales del alojamiento.

## Dominio: lo que debe recibir Arroba Systems

Raúl confirma que Arroba administra el DNS de `zitrone.com.mx`. Eso permite coordinar los registros sin transferir el registrador ni el correo. **No hay en esta auditoría un TXT/A/CNAME nuevo y verificado que se pueda enviar como instrucción de ejecución.** No inventar una IP ni copiar una receta genérica.

Los documentos locales se contradicen: el checklist advierte sobre los subdominios internos; el log del 24 propone Claim a nivel de equipo. Vercel distingue propiedad de dominio y asignación a proyecto. Su documentación actual permite verificar por TXT un hostname en un proyecto de otro equipo, conservando el dominio raíz en el equipo original. No se deduce que sea necesario reclamar todo el dominio. [Fuente oficial](https://vercel.com/docs/domains/working-with-domains).

Preparar una única ficha, revisada con Arroba y el administrador del Vercel anterior:

| Dato | Estado / quién lo completa |
| --- | --- |
| Canónico | `https://www.zitrone.mx`, intención actual del código; confirmar aceptación del cliente. |
| Hosts a centralizar | `zitrone.mx`, `zitrone.com.mx`, `www.zitrone.com.mx`; comprobar asignaciones actuales en Vercel. |
| Proyecto/equipo receptor | Runbook menciona `zitrone-website` / Zitrone; falta verificar owners y si realmente hace falta transferir. |
| Registros exactos | Tipo, nombre, valor, TTL y propósito copiados de la configuración del proyecto definitivo, con fecha y evidencia. Pendiente. |
| Dependencias | Inventario de zona/subdominios y responsables; los datos públicos del 22 son históricos. |
| Cambio | Elegir asignación de los hosts al nuevo proyecto o redirect en el anterior; documentar tratamiento de rutas, campañas y rollback. |
| Correo | Conservar NS, MX, SPF, DKIM, DMARC y subdominios ajenos al sitio. |
| Aceptación | HTTPS, destinos 200, redirects permanentes sin bucles, canonical/sitemap, parámetros de campañas, formularios, correo y apps internas. |

La transferencia de proyecto tiene revisión independiente de integraciones, variables y responsables. [Guía oficial de transferencia](https://vercel.com/docs/projects/transferring-projects). El objetivo es centralizar la web, no mover por defecto Google Workspace ni aplicaciones internas.

Borrador para Raúl/Arroba, **no enviado**:

> Estamos cerrando la versión de entrega en Vercel. Antes de pasar los registros, necesitamos confirmar el proyecto que hoy tiene asociados zitrone.com.mx y www, y coordinar esos dos hosts sin afectar correo ni subdominios internos. Después les compartimos una tabla con los TXT/A/CNAME exactos que solicite el proyecto definitivo, la ventana de cambio y el procedimiento de reversión. El sitio principal previsto es www.zitrone.mx; las URLs anteriores conservarán sus redirecciones.

## Paquete profesional pendiente

| Entregable | Criterio concreto | Responsable propuesto |
| --- | --- | --- |
| Versión aceptada | Commit + deployment + QA verde + limitaciones aceptadas | Desarrollo + cliente |
| Manual técnico portátil | Setup con Node 24 (CI/Vercel; auditoría ejecutada con Node 25.8.1), configuración por nombre, comandos seguros, release/rollback | Desarrollo |
| Manual de contenido | Qué se edita, idiomas, publicación/despublicación y recuperación demostradas | Desarrollo + contenido |
| Accesos y costos | Owners y suplentes de repo/Vercel/Neon/Blob/Resend/Google/DNS; MFA, facturación, límites y renovación | Cliente + TI |
| Respaldo | Frecuencia/retención y restauración probada de DB y medios; no basta rollback del frontend | TI + desarrollo |
| Operación de leads | Inbox, respuestas, fallos, reintentos, permisos y retención aprobados | Ventas + TI |
| Facturación | Proceso manual aprobado hacia facturacion/contabilidad; actualizar manuales que aún describen formulario/API eliminados | Finanzas + desarrollo |
| SEO y migración | Crawl del deployment final, inventario de URLs anteriores, Search Console y documento de integridad resuelto | SEO + TI |
| Performance | Baseline móvil/escritorio de build representativo; métricas y fecha, sin prometer mejoras no medidas | Desarrollo |
| Capacitación y soporte | Sesión de operación, responsables, alcance, tiempos y período de soporte acordados | Cliente + proveedor |

No se encontraron evidencias actuales suficientes para dar estos entregables por aceptados. Eso no prueba que las cuentas o respaldos no existan; significa que no están acreditados en esta revisión.

## Orden recomendado de cierre

1. Corregir A-01 y A-02; definir contador y política de despublicación.
2. Unificar manuales activos, receta de analytics y ficha de dominios; completar owners.
3. Verificar visual/accesibilidad/performance y CMS en staging; conservar límites de los resultados.
4. Congelar commit, aprobar contenido y excepciones, registrar respaldo y rollback.
5. Ejecutar liberación/corte coordinados; comprobar versión, DNS/SSL, inbox, conversiones y SEO en destino.
6. Entregar accesos, manuales, capacitación y acta de aceptación con pendientes explícitos.

## Archivos de evidencia y efectos locales

Resumen de fallos automatizados: [evidencia del 30 de septiembre](audit-evidence-2026-09-30.txt). Logs completos temporales: `/tmp/zitrone-audit-{contracts,lint,types,build,contact,migration,a11y}.log`; capturas de fallos en `test-results/` (ignoradas por Git y reemplazables por otra ejecución). El prebuild regeneró assets/tokens; se restauró únicamente la fecha generada que cambió durante esta auditoría. No hay cambios intencionales al producto. Los cambios entregados son este informe, evidencia y actualización de los puntos de entrada del tracker.
