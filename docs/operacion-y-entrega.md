# Operación y entrega

> **Destino de la entrega actualizado13-oct:** Arroba recibirá hosting en su equipo Vercel y la administración de los servicios que confirme. [Plan rector](plan-entrega-arroba-2026-10-13.md). La tabla siguiente describe servicios de origen y datos a completar; no implica conservarlos bajo cuentas de desarrollo. Verificar cada recurso separado del traslado de Vercel.


Paquete operativo para Zitrone, preparado el 30 de septiembre de 2026. Las celdas *Pendiente* no se llenan con supuestos: las completa el cliente o quien tenga la información, con nombre y fecha. Ningún secreto va en este documento.

Índice del paquete: [docs/README.md](README.md#paquete-de-entrega).

## Cuentas y responsables

| Servicio | Para qué | Owner | Suplente | Acceso del cliente | MFA | Facturación / renovación / costo | Alertas a |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Repositorio Git | Código | Pendiente | Pendiente | Pendiente | Pendiente | Pendiente | — |
| Vercel, equipo **Zitrone**, proyecto `zitrone-website` | Hosting, variables, logs, dominios `zitrone.mx` / `www` | Pendiente (deploys actuales hechos por la cuenta `opina-8590`) | Pendiente | Pendiente | Pendiente | Pendiente (plan no verificado) | Pendiente |
| Vercel anterior (cuenta ajena) | Sitio anterior en `zitrone.com.mx`, apps internas | Pendiente | Pendiente | — | — | — | — |
| Neon Postgres | CMS y leads | Pendiente | Pendiente | Pendiente | Pendiente | Pendiente | Pendiente |
| Vercel Blob | Imágenes subidas al CMS | Pendiente | Pendiente | Pendiente | — | Pendiente | — |
| Resend (`send.zitrone.mx`) | Correos de leads | Pendiente | Pendiente | Pendiente | Pendiente | Pendiente | Pendiente |
| Sentry | Errores | Pendiente | Pendiente | Pendiente | Pendiente | Pendiente | Pendiente |
| Google Workspace | Correo `zitrone.com.mx` | TI Zitrone / Arroba (por confirmar) | Pendiente | Cliente | — | Cliente | — |
| GTM-TSTDVS4, GA4 G-E48BCCXZEC, Ads AW-779424827, Search Console | Medición | Pendiente | Pendiente | Pendiente | Pendiente | — | — |
| DNS `zitrone.com.mx` | Zona y correo | Arroba Systems (confirmado por Raúl Carlón) | Pendiente | — | — | — | — |
| DNS / registrador `zitrone.mx` | GoDaddy (NS `domaincontrol.com`) | Pendiente | Pendiente | Pendiente | Pendiente | Pendiente | — |
| Admin del CMS (`/admin`) | Contenido y leads | Pendiente | Pendiente | Pendiente | — | — | — |

Clave temporal de Resend expuesta en un chat anterior: **revocación no acreditada**. Quien administre Resend debe confirmar en el panel (API Keys) que esa clave ya no existe y anotar fecha y nombre aquí. No pegar la clave.

## Release y rollback del sitio

Procedimiento técnico: [README.md](../README.md#release-and-rollback). Resumen: el sitio se publica con `vercel --prod` desde una copia limpia en el commit aprobado, después de los gates. El rollback del frontend es *Instant Rollback* al deployment anterior en Vercel; **no** deshace cambios de base de datos ni de contenido.

## Respaldo y restauración (base de datos y medios)

Separado del rollback del frontend.

| | Base de datos (Neon) | Medios (Vercel Blob) |
| --- | --- | --- |
| Qué contiene | Contenido del CMS, usuarios, **leads** | Imágenes subidas por el CMS (las del sitio viven en el repositorio, `public/img`) |
| Respaldo del proveedor | Neon conserva historial para restaurar a un punto en el tiempo; la ventana depende del plan. **Ventana real no verificada.** | Sin versionado automático conocido. **No verificado.** |
| Respaldo propio propuesto | `pg_dump -Fc` diario o antes de cada migración, guardado cifrado fuera de Neon; retención a acordar | Copia periódica del contenido del store; retención a acordar |
| Frecuencia / retención | Pendiente de decisión del cliente | Pendiente |
| Responsable | Pendiente | Pendiente |

### Restauración probada (simulacro con datos sintéticos)

`zsh scripts/backup-restore-drill.sh` crea una base local desechable, aplica las migraciones, siembra un usuario, un lead y un artículo sintéticos, toma un `pg_dump -Fc`, lo restaura con `pg_restore --no-owner` en otra base vacía y compara conteos y el registro del lead. Resultado del 30-sep-2026: `RESULT match` (pg_dump 16.15). Las bases se borran al terminar. **No** se restauró una copia real de Neon: requiere autorización y una base destino aislada.

Restaurar una copia real (cuando se autorice):

1. Crear una base **nueva** (rama de Neon o base aparte), nunca encima de producción.
2. `pg_restore --no-owner --dbname "$DESTINO" respaldo.dump` con una versión de `pg_restore` igual o mayor a la del servidor.
3. Verificar `npm run payload:migrate:status` contra esa base y revisar leads y artículos.
4. Cambiar `DATABASE_URL` en Vercel solo si se decide promover esa base, y volver a desplegar.

Estado de migraciones en la base alojada (lectura, 30-sep): aplicadas 10 de 11; pendiente `20260930_042253_remove_billing_page` (borra las tablas del formulario de facturación retirado). Esta remediación no agrega migraciones.

## Operación de leads

| Tema | Política actual | Pendiente |
| --- | --- | --- |
| Dónde llegan | Cada envío se guarda primero en el CMS (`Contact requests`) y después se notifica por correo a `opina@zitrone.com.mx` con confirmación al visitante | Prueba real de inbox y respuesta, autorizada |
| Quién atiende | Dos personas atienden `opina@` (dato del usuario) | Nombres, suplente y horario |
| Tiempo de respuesta | — | Acordar (p. ej. mismo día hábil) |
| Quién ve leads en el CMS | **Admin** y el rol **sales** (decisión del usuario, 7-oct-2026): leer, cambiar estado y notas, exportar CSV. Sales no edita contenido ni borra leads; los editores no ven leads. Los datos enviados no se pueden modificar. | Crear las cuentas `sales` de las dos personas de ventas (las crea un admin) tras aplicar la migración `20261008_133454_sales_role` |
| Revisión de envíos fallidos | `npm run email:retry` lista estados; `-- ZC-folio --send` reintenta. Hacerlo **dentro de 23 horas**: después el sistema marca `review` y hay que conciliar en Resend antes de reenviar | Responsable y frecuencia (propuesta: diaria) |
| Rebotes | Sin webhook; se revisan en el panel de Resend | Responsable |
| Retención | Sin política definida | Plazo de conservación y borrado de leads |
| Abuso / rate limit | Límite de 5 envíos por 10 min por IP **por instancia** (no compartido); cuerpo máximo 16 KB medido sobre el flujo | Ver propuesta abajo |

Exactamente-una-vez no está garantizado: si se pierde la respuesta HTTP y el visitante reintenta, puede crearse un segundo lead (los correos de un mismo lead sí se deduplican). Ventas debe esperar duplicados ocasionales.

### Guion de prueba real (para autorizar; no ejecutado)

1. Acordar fecha, destinatarios (`opina@` y un buzón de visitante controlado) y volumen: **4 envíos** (contacto ES, contacto EN, home ES, home EN), marcados "PRUEBA" en el mensaje.
2. En el deployment definitivo, enviar los 4. Anotar los folios.
3. `npm run email:retry -- ZC-folio` para cada uno: estado `accepted` e IDs del proveedor.
4. Confirmar llegada en `opina@` (incluida la carpeta de spam) y en el buzón de visitante; responder desde Workspace y comprobar que la respuesta llega al visitante.
5. Revisar en GTM Preview / GA4 DebugView un `generate_lead` por envío ([guion](analytics/gtm-activation.md#guion-de-verificación-para-quien-tenga-acceso)).
6. Marcar los 4 leads como `closed` con nota "prueba".

### Propuesta para el rate limit (requiere decisión)

El límite en memoria de `src/lib/rate-limit.ts` solo frena ráfagas que caen en la misma instancia. Antes de campañas, la opción sin servicio nuevo es una regla de **Vercel Firewall** (rate limiting) sobre `POST /api/contact-request`, por IP, con el mismo umbral (5 por 10 minutos) y acción *deny* o *challenge*. Se configura en el panel del proyecto; verificar antes que el plan del equipo la incluye. No se activó.

## Facturación

**Decisión final del usuario, reconfirmada el 12-oct-2026: el flujo de facturación del sitio está eliminado.** Solo queda el enlace "Facturación" del pie, que abre un correo a `facturacion@zitrone.com.mx` y `contabilidad@zitrone.com.mx` pidiendo RFC y ticket de compra (commit `5b2bad4`). El correo es la solución final, no un fallback temporal.

No hay formulario, API, webhook, carga de archivos, cola ni automatización de facturación por desarrollar, reactivar o aceptar como parte de esta entrega. La atención del correo ocurre fuera del sitio. BILL-01 está cerrado; no depende de diseñar o aprobar un proceso de Finanzas. La migración `remove_billing_page` conserva únicamente la limpieza de tablas obsoletas, con el procedimiento de respaldo habitual.

## Capacitación y soporte

| Tema | Estado |
| --- | --- |
| Sesión de capacitación (CMS, leads, recuperación de correos) | Pendiente de agendar |
| Material | [manual-contenido.md](manual-contenido.md), esta guía |
| Periodo de soporte, alcance, tiempos de respuesta, canal | Pendiente de acordar |
| Limitaciones conocidas | Ver "Riesgos" en [claude-remediation-results.md](claude-remediation-results.md) |

## Acta de aceptación (pendiente de firma)

| Campo | Valor |
| --- | --- |
| Versión entregada (commit + deployment) | Pendiente |
| Gates verdes asociados a ese commit | Pendiente (ver resultados del 30-sep para el commit de remediación) |
| Excepciones aceptadas | Contraste del acento verde en titulares sobre fondos claros (2.1–2.25:1), decisión de marca del 23-sep: Pendiente de aceptar por escrito |
| Afirmaciones aprobadas | [registro-de-afirmaciones.md](registro-de-afirmaciones.md): Pendiente |
| Pendientes conocidos al entregar | Pendiente |
| Acepta por Zitrone (nombre, cargo, fecha) | |
| Entrega por el proveedor (nombre, fecha) | |
