# Instrucciones para Claude — cierre de auditoría y revisión por Codex

Fecha: 30 de septiembre de 2026. Proyecto: `Zitrone Website`.

## Objetivo y división del trabajo

Implementa las correcciones de la auditoría, verifica el resultado y prepara una entrega profesional que Codex pueda revisar de forma independiente. El usuario eligió a Claude para implementar y a Codex para revisar al terminar. No declares aprobación por parte de Codex ni del cliente.

Completa todo el trabajo local y reversible que puedas. No te detengas al entregar un plan ni preguntes de nuevo si puedes seguir con cada corrección ordinaria. Si un punto requiere información externa, registra la pregunta, prepara una propuesta concreta y continúa con los puntos independientes. Nunca interpretes falta de respuesta como aprobación.

Hay dos hitos distintos:

1. **Listo para revisión de Codex:** implementación local, pruebas, manuales y pendientes externos claramente documentados.
2. **Listo para entrega al cliente:** además del anterior, aceptación operativa, owners, cuentas, publicación/corte y comprobaciones reales autorizadas.

No marques el segundo hito completo solo porque el primero pase.

## 1. Inicio y alcance

Trabaja en `/Users/a1085/Documents/Zitrone/Zitrone Website`.

Lee en este orden:

1. `AGENTS.md`, instrucciones aplicables y `CLAUDE.md` si existe.
2. `DELIVERY.md`: prevalece la evaluación del 30 de septiembre sobre estados históricos contradictorios.
3. `docs/delivery-readiness-audit-2026-09-30.md` y `docs/audit-evidence-2026-09-30.txt`.
4. `docs/delivery-progress.md`: contexto y decisiones ya tomadas.
5. Según el área: `DESIGN.md`, `ASSETS.md`, `EMAILS.md`, `docs/accessibility.md` y los manuales citados en la auditoría.
6. Documentación instalada de Next antes de cambiar APIs del framework; documentación oficial actual de proveedores cuando corresponda.

Registra rama, commit, Node y estado de Git. El baseline auditado fue `7d67dac` en `design-system/type-unification`; no hagas reset para volver a él. Puede haber trabajo posterior del usuario y documentos aún sin commit. Presérvalos y distingue tus cambios. Usa Node 24 para comprobar paridad con CI/Vercel, si está disponible; si no, registra la diferencia.

No rediseñes el sitio, cambies servicios/cobertura ni hagas una limpieza general. Conserva ES/EN, slugs, contenido aprobado, identidad visual, atribución y flujos existentes. Crea commits pequeños por tema si las reglas de la sesión lo permiten; no mezcles reformateo masivo con lógica. No hagas push o publicación por inferencia.

## 2. Corregir calidad y accesibilidad — A-01 / A-06

Archivos iniciales:

- `src/app/_components/home/home-page.tsx`, `OperatingServiceWidget`.
- `src/design-system/components/marketing.css` y tokens de `src/design-system/`.
- Componente que renderiza `.ds-service-spotlight-dot`.
- `tests/e2e/accessibility.spec.ts` y `scripts/design-system-audit.baseline`.

Acciones:

1. Resolver el efecto que llama `setAnimated(true)` directamente. Corregir el ciclo de estado según su necesidad real; no desactivar lint ni envolverlo arbitrariamente en un timeout para silenciarlo. Conservar reducción de movimiento, limpieza de timers y comportamiento al cambiar props.
2. Sustituir las referencias nuevas a primitivas y los valores tipográficos fuera de contrato por tokens semánticos/componentes coherentes. Reutilizar roles existentes cuando correspondan. No crear un token por cada valor solo para esquivar la regla.
3. Corregir contraste de `.ds-operating-profile-day-meals`: el resultado previo fue 3.72:1 para texto normal frente a 4.5:1 requerido.
4. Ampliar el área interactiva/separación de los puntos del carrusel: eran 8 × 8 px. Se puede conservar un punto visual pequeño dentro de un control accesible. Revisar foco, clic, teclado y layout móvil.
5. La excepción de acentos verdes es una decisión de marca registrada. No extender sus selectores ni filtrar nuevas infracciones. Preparar alternativa conforme y registrar la decisión pendiente si cambiarla requiere aprobación de marca. No afirmar conformidad WCAG completa mientras persista.

Aceptación: lint sin errores ni warnings nuevos; gate de diseño sin nuevas regresiones respecto a la baseline; suite de accesibilidad verde sin ocultar fallos; capturas comparables ES/EN, móvil/escritorio. Investigar el aviso de proporciones del logo Amazon y corregirlo si se reproduce, sin sustituir fotografía/logos aprobados.

## 3. Proteger leads y exportaciones — A-02

Archivos iniciales: `src/payload/collections/contact-requests.ts`, `src/payload/collections/users.ts`, `src/app/api/leads/export/route.ts`, ruta de contacto y código de recuperación de emails.

Define una matriz explícita antes de implementar:

| Actor | Política a implementar/verificar |
| --- | --- |
| Anónimo | No leer, modificar, borrar ni exportar leads; contacto solo mediante endpoint validado. |
| Editor de contenido | Sin acceso a leads/exportación, salvo decisión comercial explícita distinta. |
| Ventas | Solo si se necesita ese rol: lectura, estado, notas y exportación conforme a política aprobada. |
| Admin | Gestión autorizada; los datos originales de la consulta siguen inmutables por API ordinaria. |
| Proceso servidor confiable | Crear lead y mantener entrega/reintentos mediante permisos internos delimitados. |

Si no está decidido un rol de ventas, preparar admin-only como propuesta local conservadora, documentar el impacto y pedir confirmación antes de aplicar cambios de roles a cuentas reales. No introducir un rol y su migración sin una necesidad concreta.

Implementar restricciones reales en servidor/campos/hooks, no solo `admin.readOnly`. Proteger identidad, mensaje, folio, origen y atribución. Revisar todos los campos anidados y evitar que el endpoint CSV haga bypass involuntario de la política. Conservar protección contra fórmulas CSV y `Cache-Control: no-store`.

Pruebas obligatorias: API real de Payload con usuarios ficticios y DB aislada. Demostrar lectura/exportación/actualización por actor, intento de cambiar datos originales, cambios válidos de estado/notas, creación interna y recuperación de email. No basta inspeccionar strings del código o ejecutar funciones de permisos sin API. Verificar que la protección de roles existente sigue funcionando. Documentar cómo ejecutar y limpiar las pruebas sin tocar datos reales.

## 4. Corregir afirmaciones y frontera CMS — A-03 / A-04

### Contador y contenido

Eliminar los incrementos aleatorios presentados como “hoy”. Si no hay fuente aprobada para la cifra, usar el texto no cuantitativo ya existente como alternativa; no convertir 15,000 en un promedio aparentemente validado. No construir una integración de datos en vivo sin necesidad acordada. Mantener equivalencia visual/lectores de pantalla y ES/EN.

Preparar registro de afirmaciones: página, texto, fuente o aprobación existente, owner, fecha y estado. Incluir cifras, certificaciones, casos, testimonios, logos y zonas. No inventar fuentes ni reinterpretar una afirmación como certificación más amplia.

### CMS

Revisar `src/payload/loaders/blog.ts`, modelos, hooks, sitemap/RSS/categorías, slugs y migraciones del 24/25 de septiembre. Definir una política coherente de publicación y fallback. Distinguir explícitamente: desarrollo sin CMS, CMS operativo sin publicaciones, post despublicado/borrado y fallo de conexión. Evitar que un fallback estático resucite contenido retirado; documentar cómo se comportan los fallos sin convertir un error de DB en “todo fue despublicado”.

Probar en DB aislada: editar, publicar, cambiar idioma, despublicar, borrar y recuperar; verificar índice, página, relacionados, sitemap/RSS y caché. Confirmar que un borrador no se publica por fallback, que no aparecen enlaces a páginas retiradas y que sigue funcionando la pareja ES/EN. Conservar el trabajo de títulos SEO, listas, enlaces y CTAs del blog.

Entregar una matriz de propiedad por sección: código, CMS o mezcla; qué hace un sync y qué puede sobrescribir. No aplicar migraciones o sync a Neon alojado como parte de una prueba local. Preparar archivos de migración y revisión cuando haga falta.

## 5. Unificar analytics y operación — A-05 / A-07

### Analytics

Conciliar `docs/analytics/gtm-activation.md`, `docs/analytics-tracking.md`, `docs/gtm/zitrone-lead-tracking.gtm.json` y emisores del frontend. Elegir una única fuente de conversión; preferir el `generate_lead` ya emitido si su contrato es correcto. No borrar otros eventos útiles sin revisar consumidores.

No mantener simultáneamente una transformación de `contact_request_accepted` a `generate_lead` y el envío directo del mismo éxito. Los manuales deben indicar qué receta sustituye a cuál y qué tags antiguos pausar. No publicar/importar GTM ni marcar conversiones de cuentas reales como parte implícita del trabajo local.

Pruebas: 201 persistido = un evento de conversión por envío aceptado; validación, error y honeypot 202 = cero; doble clic y reintento de error no duplican el mismo éxito. Conservar atribución y consentimiento; no enviar PII al analytics. Separar evidencia dataLayer de recepción comprobada en GA4/Ads. Preparar guion Preview/DebugView para el owner con acceso.

### Leads y recuperación

Verificar persistencia antes de email, éxito parcial, fallos del proveedor, idempotencia y la ventana de recuperación. Usar proveedor simulado por defecto. No prometer exactly-once si no está garantizado en todo el recorrido. Preparar guion de prueba real con destinatarios y volumen explícitos para autorización posterior.

Resolver o dejar una decisión concreta para el rate limiter por instancia: verificar protección compartida existente del proveedor en lectura, o preparar mecanismo compartido con pruebas. No contratar un servicio ni activar configuración externa sin autorización aplicable. Revisar límites de cuerpo reales, además de `Content-Length`. No ampliar esto a una reescritura de infraestructura.

Documentar responsable/suplente, frecuencia, respuesta, rebotes, recuperación y retención. Confirmar por evidencia la revocación de la clave temporal histórica; no mostrarla. Google Sheets permanece diferido salvo instrucción nueva.

## 6. Preparar dominios y entrega operativa

No asumir que la web pública representa este checkout. Revisar datos actuales en lectura cuando haya acceso; fecharlos y distinguirlos del historial.

Unificar `docs/vercel-handoff.md`, `docs/domain-migration-checklist.md`, runbook de deployment y tracker. Separar:

- Registrador/DNS administrado por Arroba.
- Asignación de @/www a un proyecto Vercel.
- Propiedad del dominio a nivel equipo.
- Transferencia del proyecto y sus integraciones.
- Correo Google Workspace y aplicaciones internas.

No recomendar reclamar todo el dominio sin verificar necesidad e impacto. No tocar NS/MX/SPF/DKIM/DMARC ni subdominios internos. No inventar TXT/A/CNAME. Crear ficha de corte con registros exactos obtenidos del proyecto definitivo, o marcar esos valores pendientes si no hay acceso. Incluir owner, ventana, TTL, origen/destino, HTTPS, rutas antiguas, campañas y reversión de asignaciones además de DNS. Preparar mensaje a Arroba; no enviarlo sin instrucción del usuario.

Resolver/documentar la política de integridad heredada: no declarar equivalente una redirección de documento legal a home. Obtener contenido aprobado o decisión explícita de retiro. Verificar inventario de URLs y Search Console al liberar.

Actualizar README portátil con setup/Node/configuración por nombre/comandos/pruebas; quitar referencias activas a `Documents/On It`, Sanity o formulario/API de facturación eliminados cuando ya no apliquen. Preservar auditorías históricas y anotar sustitución; no reescribir evidencia antigua como si fuera actual. Facturación es manual por correo; no reconstruir automatización sin alcance nuevo.

Preparar el paquete de entrega con:

1. Manual técnico y release/rollback.
2. Manual de edición/publicación por idioma y límites del CMS.
3. Matriz de cuentas/owners/suplentes, acceso del cliente, renovación, costos reales y alertas; pendientes identificados, sin secretos.
4. Procedimiento de respaldo/restauración de DB y medios, separado de rollback del frontend. Demostración en entorno aislado con datos sintéticos si no hay autorización para restaurar copias reales.
5. Operación de leads/facturación y guion de pruebas de inbox/respuesta.
6. Capacitación, soporte, limitaciones y acta de aceptación pendiente de firma.

No llenar owners, costos, fechas o aprobaciones con supuestos. Reutilizar manuales existentes actualizados y un índice único; evitar documentos duplicados que vuelvan a contradecirse.

## 7. Validación final y performance

Guardar evidencia asociada al commit o snapshot final, con entorno, fecha, comandos y resultado. Ejecutar según dependencias, sin builds concurrentes ni suites que compitan por `.next` o el mismo puerto. No correr `assets:check` mientras `prebuild` escribe sus archivos. No detener procesos del usuario.

Gates mínimos, revisar scripts actuales antes de ejecutarlos:

```bash
npm run env:check
npm run lint
npx tsc --noEmit
npm run assets:check
npm run email:check
npm run design:audit
npm run test:contracts
npm run build
npm run test:contact
npm run test:migration
npm run test:a11y
```

Además: pruebas API aisladas añadidas para A-02/A-04 y suite E2E completa correspondiente a CI, comprobando primero que no mande datos reales. Inspeccionar y documentar cualquier fallo de infraestructura en lugar de marcarlo como aprobado. No reducir conteos eliminando pruebas ni actualizar snapshots para ocultar una regresión.

Revisión visual: home, servicios, blog/3 artículos, contacto, privacidad, menú/consentimiento y estados de error/éxito en ES/EN. Viewports al menos 320, 390, 768 y 1440 px; verificar overflow, cortes, foco, teclado, zoom, imágenes y movimiento reducido. Guardar capturas representativas. Una prueba automatizada verde no sustituye VoiceOver/manual; dejar lo no comprobado como pendiente.

Performance: medir build de producción local o staging representativo, no `next dev`. Guardar herramienta/versión, dispositivo, throttling, rutas, fecha y al menos tres ejecuciones comparables; reportar mediana y variación. Revisar home, servicio, blog/artículo y contacto. Separar LCP/CLS/TBT de laboratorio de INP/Core Web Vitals de usuarios reales; no inventar INP de campo ni puntaje 100 como criterio obligatorio. Optimizar solo problemas medidos y repetir las mediciones afectadas. No desactivar analytics de producción para inflar resultados sin explicar el escenario.

## 8. Handoff para revisión independiente

Crear `docs/claude-remediation-results.md` con esta estructura:

```text
Fecha / rama / commit final o snapshot exacto / Node / entorno
Resumen de cambios y decisión: listo para revisión, no aceptación final

Matriz A-01 a A-07 + dominios + SEO + performance + documentación/operación:
ID | estado | causa | cambio | archivos/commit | prueba/evidencia | pendiente

Resultados de todos los gates: comando, entorno, fecha, exit code, conteos
Pruebas API: actores, acciones y resultados esperados/observados
Visual/accesibilidad: rutas, viewports, hallazgos y excepciones
Performance: configuración, resultados, limitaciones
Cambios de schema/configuración y cómo revertirlos
Decisiones del usuario: confirmadas frente a propuestas
Trabajo externo pendiente: acción exacta, owner, dependencia, impacto
Riesgos y problemas que no se resolvieron
Índice del paquete profesional y evidencia guardada
Pasos para que Codex reproduzca la verificación
```

Estados: `DONE` solo con evidencia suficiente para ese alcance; `VERIFY` para implementación con aceptación externa pendiente; `BLOCKED` con dependencia exacta; `TODO` para trabajo restante. No escribir “todo terminado” si quedan items externos o excepciones sin aceptación. No afirmar “producción funciona” por mocks, build o HTTP 200.

Actualizar `DELIVERY.md` y `docs/delivery-progress.md` tras cada etapa significativa. Registrar comandos fallidos y su resolución. Guardar logs/capturas útiles en un lugar persistente indicado por el informe, sin PII/secretos; `/tmp` solo no es un handoff reproducible. No commitear videos enormes o exportaciones de DB.

Al terminar, informar al usuario qué quedó listo para revisión por Codex, dónde está el informe y qué decisiones externas siguen pendientes. No desplegar para aparentar cierre. La revisión posterior comprobará diffs y comportamiento, no solo el texto de este informe.

## Límites de esta instrucción

Las correcciones locales, documentación y pruebas aisladas son el trabajo solicitado. Deploy, transferencia de proyectos/dominios, cambios DNS, publicación GTM/Ads, migraciones/sync en bases alojadas, envío real de correo y mensajes a terceros se realizan únicamente con autorización aplicable y alcance concreto. Primero preparar la propuesta revisable y continuar trabajo independiente; no pedir permiso otra vez para acciones ya autorizadas en la sesión.

Codex no está supervisando en segundo plano: el usuario retomará la conversación cuando Claude entregue su informe. Esta guía establece los criterios para esa revisión posterior.
