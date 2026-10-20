# Zitrone · Plan completo de entrega a Arroba Systems

Actualizado 15 de octubre de 2026 · Versión 3 del modelo de entrega · Plan preparado; ejecución externa no iniciada.

Estado de la integración y de la release: [DELIVERY.md](../DELIVERY.md) e [inventario del repositorio](inventario-repositorio-2026-10-15.md).

## 1. Qué se entrega y a quién

**Desarrollo entrega el sitio y su operación técnica a Arroba, que lo recibe en su equipo de Vercel y se encarga de alojamiento, dominios y DNS.** Zitrone conserva la titularidad del proyecto y designa a sus responsables comerciales y de contenido. El usuario no necesita acceso al DNS para preparar esta entrega.

Este es el modelo solicitado por el usuario. El 15-oct Raúl precisó la segunda modalidad: recibir el repositorio con la versión de entrega en main y desplegar desde su Vercel. Esa es la ruta de este plan. Falta comunicarle la elección y concretar equipo receptor, servicios asociados y alcance de soporte. No se da esa aceptación por obtenida.

Este plan sustituye la propuesta del 12-oct de mantener el sitio en nuestro equipo y añadir allí los .com.mx. **No se añadirán esos dominios al proyecto de origen para preparar la entrega.** Arroba generará y aplicará los registros que solicite su proyecto receptor. Las observaciones DNS del 12-oct son una referencia, no instrucciones de cambio.

### Alcance final

- Web ES/EN, servicios, blog, páginas legales disponibles, navegación y formularios de contacto.
- Código fuente, historial disponible, versión identificable y procedimiento de publicación.
- CMS Payload, base de datos, imágenes y operación de solicitudes comerciales.
- Accesos por rol, configuración, integración de correo, medición y diagnóstico que se utilicen.
- Redirecciones, dominios, HTTPS, recuperación, documentación y capacitación.
- **Facturación: enlace de correo únicamente.** El formulario/API/flujo fue eliminado; no es pendiente ni parte de esta entrega.
- No se incluye rediseñar la web, crear nuevas funciones, migrar Workspace o reconstruir aplicaciones internas. Se mantienen fuera del corte las optimizaciones no necesarias para operar la versión aceptada.

### Arquitectura objetivo

| Elemento | Destino definido |
| --- | --- |
| Dirección principal | https://www.zitrone.mx, coherente con el código actual |
| Direcciones secundarias | zitrone.mx, zitrone.com.mx y www.zitrone.com.mx → principal, con redirecciones permanentes y equivalencia de rutas |
| Hosting | Equipo de Vercel receptor indicado por Arroba; proyecto con nombre acordado, preferentemente zitrone-website |
| Código | Repositorio bajo control de Zitrone, con acceso operativo de Arroba; acordar organización concreta |
| CMS/datos/medios/correo del formulario | Recursos con titular, administrador y continuidad acreditados; preferentemente conservar los recursos existentes al trasladar su administración |
| DNS y Workspace | Arroba; conservar correo y subdominios ajenos a la web |
| Leads | Persistencia en CMS y notificación a opina@zitrone.com.mx; ventas atiende con cuentas sales |

## 2. Responsabilidades

| Actividad | Desarrollo entrega | Arroba recibe / ejecuta | Zitrone / Raúl confirma |
| --- | --- | --- | --- |
| Código y release | Repositorio, commit/tag, pruebas, inventario y defectos conocidos | Acceso, clonación, compilación y publicación reproducibles | Titular y autorización de entrega |
| Vercel | Repositorio y configuración reproducible para despliegue receptor | Equipo destino, plan/costos, hosting y administración | Responsable comercial y presupuesto |
| Datos y medios | Inventario, respaldo, migraciones y guía de recuperación | Accesos duraderos, continuidad, respaldo y restauración | Tratamiento/retención de datos y responsables |
| Contacto y correo | Integración y procedimiento de seguimiento | Credenciales, monitorización y recuperación técnica | Ventas confirma recepción y atención |
| DNS / dominios | Mapa de rutas y pruebas esperadas | Obtiene registros de Vercel destino, aplica DNS, verifica HTTPS y conserva Workspace | Raúl coordina y acuerda ventana |
| Medición | Identificadores, receta y guion de verificación | Accesos/configuración si acepta ese servicio; en otro caso, owner de marketing designado | Quién administra Google y recibe reportes |
| Aceptación | Evidencia y documentación final | Demostración de operación independiente | Firma/aceptación de contenidos, excepciones y soporte |

Arroba debe designar un responsable técnico y un suplente. Desarrollo designa quién entrega el repositorio y acompaña la recepción; Zitrone designa quién autoriza el corte. No se comparten cuentas personales como sustituto de estos accesos.

## 3. Situación conocida y límites

Referencia: consulta del 12-oct por la noche, no una nueva certificación de producción.

- Proyecto de origen: zitrone-website, equipo Zitrone, ID prj_nsMWJdqhkAswimnns9Ps3YJsUToQ; Next.js/Payload y Node 24.x.
- Deployment observado: dpl_73pEEgsqV4WGLi17cLSB1ZtodEM2, Ready, 12-oct a las 18:27, hora de Ciudad de México. No hay correspondencia de Git acreditada para ese deployment.
- www.zitrone.mx y zitrone.mx asociados al origen. Los dos .com.mx no están asociados a ese proyecto; siguen atendidos por otra asociación Vercel.
- La revisión R5/R6 fue aprobada. Claude reportó una réplica de CI en Node 24 sobre 63a5d0a; esto no sustituye el CI real ni verifica cualquier commit posterior.
- Pendientes conocidos: estado actual de migraciones alojadas, recepción real de leads, accesos definitivos, prueba de recuperación real, QA manual y CI remoto.
- Hay un fallo intermitente de compilación de fuentes. Las referencias de capturas visuales están desactualizadas; no se aceptará una regeneración automática como prueba de calidad.
- El verde lime-500 sobre fondos claros mantiene una excepción de contraste. Aceptarla por escrito documenta la limitación; **no convierte el sitio en conforme con WCAG AA**.
- La causa del LCP móvil sigue sin demostrarse; el CSS es un candidato. No se promete una mejora de velocidad que no se haya medido.

## 4. Fase 0 — Confirmar recepción con Arroba

**Responsables:** usuario/Raúl y responsable de Arroba. Desarrollo aporta el paquete.

Enviar el mensaje de recepción (preparado fuera del repositorio), con el resumen de este plan. Solicitar en una sola respuesta:

1. Aceptación del hosting y operación técnica; nombre y correo del responsable y suplente.
2. Slug/ID del equipo Vercel receptor, plan disponible y correo al que conceder la invitación.
3. Organización/repositorio Git que utilizarán y permisos de Zitrone.
4. Permisos y procedimiento para recibir el repositorio y desplegar main; acordar protección de rama y quién autoriza futuras publicaciones.
5. Quién administrará Neon, Blob, Resend y monitorización; quién asume costos; identificar recursos compartidos que no deban transferirse completos.
6. Quién controla la asociación Vercel actual de .com.mx y quién puede modificar el DNS de zitrone.mx (no presumir que Arroba administra ambos).
7. Ventana propuesta y contacto de incidencias; alcance de soporte después de la entrega.

**Salida H0:** responsable, equipo receptor y ruta de recepción confirmados por escrito. No pedir al usuario claves DNS ni generar registros en el equipo de origen.

## 5. Fase 1 — Congelar una versión entregable

**Responsable:** desarrollo. Arroba revisa resultados.

- Registrar HEAD, rama y cambios locales; acordar un commit de entrega y dejar el checkout limpio. Crear tag de release cuando se apruebe la versión. El tag, commit y deployment deben quedar vinculados en el acta.
- Preparar la versión final en `main` mediante revisión del diff completo, comprobación de secretos y CI del PR. No asumir que la rama de trabajo ya coincide con main. Registrar el SHA final de main y su tag; Arroba debe desplegar exactamente esa versión. Este plan no ejecuta ni autoriza por sí solo push, merge o publicación.
- Resolver la falta de trazabilidad del despliegue actual identificando su fuente o preparando un despliegue nuevo desde el commit aprobado. No deducir el commit solo por apariencia o CSS.
- Ejecutar los checks pertinentes del repositorio sobre esa versión y Node 24: lint, tipos, assets/email/design, contratos, guard de scripts, API, caché, E2E y migración de rutas. Registrar resultados con fecha/entorno. API/caché usan Postgres desechable. Caché y E2E se ejecutan secuencialmente porque ambos escriben .next.
- Ejecutar los jobs validate e isolated-api en GitHub mediante el mecanismo acordado. Subir código/crear PR requiere la autorización de publicación del repositorio; las pruebas no necesitan secretos de producción.
- Resolver o documentar un procedimiento reproducible frente al fallo de fuentes: un build fallido bloquea esa publicación. Si se cambia a fuentes locales, conservar diseño/licencia y volver a verificar la versión cambiada.
- Revisar manualmente móvil y escritorio, teclado, foco, zoom 200%, formularios y contenido ES/EN. Aprobar capturas de referencia antes de actualizar baselines; no interpretar diferencias masivas como aprobación visual.
- Registrar contraste, cifras/testimonios aprobados y el tratamiento de URLs legales retiradas, especialmente política de integridad. Redirigir a home no acredita que el documento legal siga disponible.

**Salida H1:** candidato identificado, pruebas vigentes y defectos/excepciones explícitos. Las pruebas antiguas sirven de historial, no certifican una versión nueva.

## 6. Fase 2 — Armar el paquete que se entrega

**Responsable:** desarrollo; Arroba confirma que puede abrirlo y utilizarlo.

| Entregable | Contenido mínimo | Forma de entrega / evidencia |
| --- | --- | --- |
| Código | Repositorio, historial, commit/tag, package-lock, código, public/img, migraciones y tests | Invitación al repositorio; clone del commit por Arroba |
| Paquete alternativo | Si no pueden recibir el repo: archivo generado del commit, identificador y SHA-256 | Canal acordado; nunca incluir .env, .next, node_modules, dumps ni credenciales en un ZIP público |
| Configuración | Node 24, Next.js, comandos, raíz del proyecto, regiones/configuración que se usen, origen canónico | README y export/inventario de ajustes sin secretos |
| Servicios | IDs/URLs administrativas, owner origen/destino, costos, recursos compartidos y validación de acceso | Inventario de sección7 completado |
| Variables | Nombre, finalidad, entorno, proveedor, quién configura y referencia al secreto | Tabla sin valores; secretos mediante gestor seguro o acceso al proveedor |
| Datos/medios | Respaldo cifrado, manifiesto de archivos, fecha, conteos y hashes apropiados | Acceso restringido; nunca en Git ni adjuntos de correo ordinario |
| Operación | CMS, roles, leads, reintentos, recuperación, monitoreo y soporte | Manuales y demostración del receptor |
| Dominios | Hosts, mapa de rutas, DNS previo, asociación anterior y rollback | Arroba completa la ficha con registros del proyecto destino |
| Aceptación | Resultados, versión, excepciones, responsables y fechas | Acta de sección12 |

Material existente: [README](../README.md), [manual de contenido](manual-contenido.md), [operación](operacion-y-entrega.md), [correo de contacto](contact-email-delivery.md), [receta GTM](analytics/gtm-activation.md), [fuentes y assets](../ASSETS.md). Este plan prevalece sobre instrucciones antiguas de titularidad/destino.

**Salida H2:** paquete accesible y completo; ningún servicio crítico depende exclusivamente de la cuenta personal de desarrollo.

## 7. Inventario de servicios y configuración

Completar ID real, owner, suplente, acceso verificado, costo/renovación y método de recuperación para cada fila. Un token que funciona hoy no acredita administración futura.

| Servicio | Qué se conserva/entrega | Comprobación del receptor |
| --- | --- | --- |
| GitHub | Código e historial; configuración CI y permisos | Clonar, abrir PR y consultar CI; no conectar producción automática hasta acordar rama/controles |
| Vercel | Proyecto y ajustes; entornos, dominios, logs y alertas | Acceder, desplegar versión conocida y ejecutar rollback web |
| Neon/Postgres | Contenido CMS, usuarios, leads y registro de migraciones | Acceso del owner; consulta de migraciones; backup y restauración en base separada |
| Vercel Blob | Store de medios CMS, permisos y URLs almacenadas | Leer imágenes, subir una imagen sintética y retirarla sin afectar medios reales |
| public/img | Biblioteca estática y manifiesto versionados | Assets de home/servicios/blog cargan en el destino |
| Resend | Proyecto/cuenta, dominio remitente, clave del receptor y registros de autenticación | Dominio verificado, correo aceptado y recibido; panel de fallos accesible |
| Workspace | Buzones actuales, aliases y respuesta comercial | Arroba conserva servicio; ventas recibe y responde |
| Sentry / Vercel Analytics / Speed Insights | Accesos, identificadores y configuración utilizada | Owner recibe alertas y puede consultar incidencias/mediciones; archivar logs relevantes antes de transferir |
| GTM/GA4/Ads/Search Console | Contenedores/propiedades, permisos y configuración aprobada | Owner designado; una conversión por lead real, sin duplicados ni datos personales |
| DNS/registradores | Ambas zonas y renovaciones, asociaciones Vercel previas | Exportación de zona y recuperación; MX/SPF/DKIM/DMARC conservados |
| CMS | Usuarios nominativos admin/editor/sales | Sales trabaja leads sin editar contenido; editor sin acceso a leads |
| OpenAI / integraciones opcionales | Verificar uso real y gasto antes de conservarlas | No habilitar ni crear cuentas por defecto si no forman parte del funcionamiento acordado |

### Variables a inventariar, sin valores

| Grupo | Nombres / política |
| --- | --- |
| Sitio | NEXT_PUBLIC_SITE_URL=https://www.zitrone.mx; HOME_CONTENT_SOURCE=static; BLOG_CONTENT_SOURCE según política CMS de producción; APP_ALLOWED_ORIGINS si se usa |
| CMS | DATABASE_URL y conexiones adicionales realmente utilizadas; PAYLOAD_SECRET. No reinicializar el CMS ni ejecutar seed como instalación en producción |
| Correo | RESEND_API_KEY, RESEND_FROM_ADDRESS, RESEND_FROM_NAME y cualquier variable de destinatario utilizada por la versión entregada; comprobar destino efectivo opina@ |
| Medios | BLOB_READ_WRITE_TOKEN y store asociado; confirmar vigencia después de mover el recurso |
| Diagnóstico | SENTRY_DSN/NEXT_PUBLIC_SENTRY_DSN; SENTRY_AUTH_TOKEN, SENTRY_ORG, SENTRY_PROJECT si se publican sourcemaps; demás valores realmente utilizados |
| Bootstrap/opcionales | PAYLOAD_ADMIN_EMAIL/PASSWORD y OPENAI_API_KEY: identificar uso y retirar dependencia innecesaria del entorno final; no crear admins automáticos ni habilitar llamadas externas durante pruebas |

Inventariar Development, Preview y Production por separado. Preview no debe escribir en datos reales ni enviar correos a clientes. Si una variable pública cambia, comprobar la build que la incorpora. Mantener PAYLOAD_SECRET para la continuidad inicial, salvo rotación expresamente coordinada y efecto de sesiones documentado. Rotar claves personales después de validar las credenciales del receptor y su rollback; no revocar una clave antes de tener sustitución funcional.

## 8. Fase 3 — Preparar datos y demostrar recuperación

**Responsables:** desarrollo y administrador receptor de datos.

1. Leer el registro real de migraciones sin ejecutar sincronización automática. Verificar en particular sales_role y la limpieza remove_billing_page. No afirmar estado actual por el reporte de septiembre.
2. Tomar respaldo cifrado de DB y copia/manifiesto de Blob; registrar hora, conteos y lugar de custodia. Probar restauración en una base distinta con notificaciones, embeddings y demás efectos externos deshabilitados.
3. Preferir mantener los mismos recursos y trasladar su administración cuando el proveedor lo permita: evita una copia de datos innecesaria y cambios de URLs. Verificar cada integración por separado.
4. Si hace falta una base nueva: probar migraciones sobre copia; planear un intervalo de congelación de escrituras y copia final/delta. Durante ese intervalo el formulario no debe informar éxito si no puede guardar. Garantizar un único destino de escritura y conciliar todos los leads recibidos alrededor del corte antes de reabrirlo.
5. Si cambia el store de imágenes: preservar las URLs o actualizar referencias en CMS; comparar inventario y probar imágenes representativas. No basta con copiar los archivos.
6. Aplicar las migraciones necesarias solo con respaldo, destino confirmado y ventana autorizada. No ejecutar payload:seed*, sync:home*, sync:blog* ni release:home:prod como pasos rutinarios de entrega: pueden sobrescribir o republicar contenido. Única excepción prevista (18-oct): `payload:seed:home:prod` en la publicación de `release/2026-10`, una sola vez, después del respaldo y de la captura de header/pie/home ([procedimiento](cms-home-rollout.md), pasos 4–6). `sync:home*` y `release:home:prod` ya no existen.

**Salida H3:** acceso y recuperación probados, estrategia de datos sin pérdida, esquema compatible y medios verificables. La limpieza de tablas de facturación es mantenimiento, no un flujo a construir.

## 9. Fase 4 — Recibir el sitio en Vercel de Arroba

### Ruta principal: repositorio y main → despliegue de Arroba

Es el mecanismo descrito por Raúl el 15-oct para la segunda modalidad. Desarrollo entrega el repositorio con historial, la versión revisada en `main`, tag y configuración documentada. Acordar la organización receptora y garantizar acceso y titularidad de Zitrone. Compartir código no transfiere automáticamente datos, cuentas ni credenciales.

1. Arroba verifica acceso al repositorio y el SHA aprobado, e importa el proyecto en su equipo de Vercel con Next.js/Node 24, `npm ci` y `npm run build`.
2. Configura variables y dependencias por entorno mediante acceso seguro. Acordar la rama de producción, protección de main y permisos de publicación antes de activar despliegues automáticos.
3. Valida una URL temporal con datos aislados y sin correos ni efectos reales no autorizados. Registra equipo, proyecto, deployment y SHA. Desarrollo acompaña la corrección de diferencias de configuración.
4. Una vez aprobadas las pruebas, coordina la conexión de los recursos definitivos y el movimiento de dominios en la ventana acordada. Evitar dos sitios escribiendo a copias divergentes de la base; aplicar el plan de continuidad de la fase 3.
5. Mantener el proyecto original y sus recursos recuperables hasta cerrar aceptación y rollback. No dar de baja servicios solo porque el nuevo build haya pasado.

### Alternativa excepcional: transferir el proyecto Vercel existente

Solo se utiliza si ambas partes acuerdan cambiar el mecanismo anterior. Revisar permisos, plan, dominios y variables antes de confirmar: puede afectar inmediatamente a los .mx publicados. Según Vercel, integraciones y Blob requieren atención separada; trasladar el proyecto no garantiza trasladar todos sus servicios. [Documentación de transferencia](https://vercel.com/docs/projects/transferring-projects).

**Salida H4:** Arroba puede administrar, compilar, desplegar y recuperar la versión aprobada; IDs, SHA y evidencia quedan registrados. Esto no equivale todavía a aceptación del corte de dominios.

## 10. Fase 5 — Dominios y corte, a cargo de Arroba

**Responsable de ejecución:** Arroba. Desarrollo verifica rutas y funcionamiento. Raúl coordina al administrador de la web anterior.

- Arroba guarda zona completa y asociaciones Vercel anteriores. Identifica al administrador actual de .com.mx y a quien controla .mx; acuerda ventana y rollback.
- Arroba comprueba los cuatro hosts en el proyecto receptor, añade/verifica los que falten y obtiene allí los registros/verificaciones exactos. No toma los valores observados en origen como una orden de cambio ni usa un wildcard para capturar subdominios internos.
- Conserva NS y todo lo ajeno al sitio: MX, SPF, DKIM, DMARC, verificaciones y apps internas (intranet, activos, satisfaccion, operaciones, menu-uber y las demás del inventario).
- Coordina la asociación de los hosts ya usados por otra cuenta. No borra primero la web activa ni reclama todo el dominio raíz de otra cuenta sin evaluar sus apps. Un TXT de verificación también puede activar la nueva asociación: colocarlo en la ventana acordada.
- Ejecuta solo los A/AAAA/CNAME/TXT solicitados por el receptor, con nombre/valor/TTL registrados. Si el DNS ya es correcto, no lo cambia innecesariamente. El usuario no necesita credenciales DNS.
- Conserva www.zitrone.mx como principal. Los hosts secundarios deben redirigir permanentemente; el mapa de rutas de la app debe actuar sin ser anulado por una redirección global incorrecta. Corregir el 307 temporal de zitrone.mx.
- Comprueba HTTP/HTTPS en las cuatro direcciones, certificados, rutas ES/EN y parámetros de campaña. Las URLs válidas terminan en 200; las desconocidas pueden dar 404 apropiado, sin convertir todo en home.
- Después del corte validado, el owner de Search Console actualiza propiedades/sitemap y realiza cambio de dirección si corresponde. Marketing actualiza enlaces de campañas, QR y perfiles bajo su control.

**Salida H5:** una única web principal, rutas verificadas, correo y apps sin afectación; registros anteriores/nuevos y hora de corte guardados por Arroba.

## 11. Fase 6 — Pruebas de aceptación y reversión

| ID | Prueba en destino final | Evidencia / criterio de aprobación | Responsable |
| --- | --- | --- | --- |
| A1 | Versión y publicación | Commit/tag, ID deployment, fecha y equipo destino coinciden con acta | Desarrollo + Arroba |
| A2 | Cuatro hosts | HTTPS válido; redirecciones permanentes sin bucles; principal ES/EN 200 | Arroba |
| A3 | URLs antiguas | Contacto/servicio/blog, URL desconocida y UTM de prueba; equivalencia, sin pérdida de parámetros | Desarrollo |
| A4 | SEO | Canonical/sitemap con www.zitrone.mx; hreflang coherente; sitio público indexable, admin protegido de indexación | Desarrollo + Arroba |
| A5 | Contenido | Artículos, imágenes, legales, links y facturación mailto correctos | Zitrone + desarrollo |
| A6 | CMS | Admin/editor/sales con permisos previstos; ejercicio sintético de contenido en entorno aislado | Arroba |
| A7 | Leads reales | Cuatro envíos autorizados y marcados PRUEBA: contacto ES/EN y home ES/EN; folios en CMS, correo a ventas y visitante; respuesta desde Workspace recibida | Arroba + ventas |
| A8 | Medición | Consentimiento y una conversión generate_lead por envío aceptado, sin datos personales ni duplicados | Owner de Google |
| A9 | Operación | Alertas, logs, reintentos de correo y recuperación demostrables por receptor | Arroba |
| A10 | DNS/correo/apps | Zona comparada; buzones y subdominios internos siguen funcionando | Arroba |
| A11 | Recuperación | Restauración de copia en entorno aislado y procedimiento de rollback web/dominios comprobado | Arroba + desarrollo |
| A12 | Experiencia | Revisión manual móvil/escritorio/teclado/zoom; excepciones registradas y aceptadas | Zitrone + desarrollo |

No enviar pruebas reales sin coordinar destinatarios y volumen. Registrar folios, no exponer datos de clientes en logs públicos. Marcar los leads de prueba para no confundirlos con ventas reales.

### Cuándo detener o revertir

Detener ante sitio incorrecto, HTTPS inválido, bucles, pérdida/fallo de persistencia de leads, datos incompatibles o interrupción de correo/apps. Ante pérdida de datos, actuar inmediatamente; para otras incidencias no resueltas en 15 minutos, iniciar la recuperación acordada en lugar de prolongar el corte sin límite.

- **Código:** volver al deployment estable en el equipo receptor si está disponible. En la ruta de proyecto nuevo, restaurar asociaciones hacia el proyecto de origen conservado.
- **Transferencia de equipo:** no asumir que el proyecto original seguirá operativo en origen. Verificar antes de mover que el receptor puede recuperar un deployment previo y quién puede transferir de vuelta si fuera necesario.
- **DNS/asociaciones:** Arroba restaura solo los registros cambiados y coordina asociaciones Vercel; cambiar DNS no revierte por sí solo el propietario/asignación del hostname.
- **Base de datos:** el rollback web no deshace migraciones. No restaurar encima de producción ni descartar leads posteriores; restaurar en otra base, conciliar escrituras y promover con autorización.
- **Credenciales:** mantener acceso operativo de recuperación hasta comprobar las nuevas credenciales y documentar su retirada.

El responsable del corte decide ejecución/pausa y registra incidente, acciones y resultado. Los 15 minutos son un umbral propuesto para acordar en H0, no un SLA contractual.

## 12. Fase 7 — Cierre, soporte y acta

- Observación de web/contacto/errores inmediatamente, a las 24 y 48 horas. Arroba es el responsable técnico; desarrollo acompaña durante el periodo de soporte acordado, no indefinidamente.
- Capacitación propuesta de 60–90 minutos: publicar contenido, atender leads, roles, recuperación de correos, consultar errores y escalar incidencias. Arroba debe poder repetir los procedimientos.
- Registrar horario, contacto, severidades, tiempos de respuesta y costos de soporte aceptados. No convertir estas propuestas en obligaciones sin acuerdo.
- Retirar accesos temporales cuando haya continuidad y rollback; no borrar proyectos/recursos antiguos ni respaldos durante la ventana de observación. Su fecha de retiro se acuerda y se registra; conservar el dominio viejo por correo/enlaces.

### Acta que se completa al terminar

| Campo | Valor / evidencia a completar |
| --- | --- |
| Release | Commit, tag, repositorio |
| Hosting receptor | Equipo, proyecto, ID deployment, fecha |
| Recursos definitivos | IDs de DB/Blob/Resend y owners; sin secretos |
| Dominios | Cuatro hosts, asociaciones y registros modificados |
| Pruebas | A1–A12 con resultado, fecha y evidencia; ninguna casilla se marca por anticipado |
| Recuperación | Ubicación restringida de respaldo, fecha de restauración probada, responsable |
| Excepciones | Contraste de marca, limitaciones reales y pendientes acordados; no se declara AA si persiste incumplimiento |
| Soporte | Canal, responsable, suplente, horario y periodo acordado |
| Recepción técnica | Nombre/firma/fecha de Arroba |
| Aceptación de Zitrone | Nombre/firma/fecha del responsable cliente |
| Cierre de desarrollo | Nombre/fecha, accesos temporales retirados o justificados |

**La entrega está completa cuando Arroba puede mantener el sitio sin depender de una cuenta personal de desarrollo, los servicios funcionan en destino y Zitrone recibe la evidencia y acepta las limitaciones.** No basta una página visible o un ZIP recibido.

## 13. Secuencia propuesta y siguiente acción

| Orden | Actividad | Dependencia |
| --- | --- | --- |
| 1 | Enviar plan/mensaje y recibir datos de Arroba (H0) | Coordinación del usuario/Raúl |
| 2 | Cerrar versión y preparar paquete (H1/H2) | Puede avanzarse localmente mientras responde Arroba |
| 3 | Preparar servicios, backup y restauración (H3) | Accesos y acuerdo de responsables |
| 4 | Ensayo de recepción y revisión de configuración | Entorno aislado y candidato aprobado |
| 5 | Despliegue receptor y corte de dominios (H4/H5) | Ventana autorizada, rollback y responsables presentes |
| 6 | Aceptación A1–A12 y observación 24/48 h | Destino definitivo funcionando |
| 7 | Firma, soporte y cierre de accesos | Resultados y excepciones acordados |

No se fija una fecha de publicación hasta conocer disponibilidad de Arroba y resolver las dependencias. Preparar este plan no ejecuta transferencias, despliegues, migraciones, DNS, envíos ni cambios de permisos.

**Siguiente paso concreto:** compartir el mensaje actualizado y este plan con Raúl para que Arroba confirme recepción, equipo destino y responsable técnico. Desarrollo prepara el paquete; Arroba obtiene después los DNS exactos desde su Vercel. No necesitamos añadir .com.mx al equipo de origen.

## Preparación del repositorio

Antes del paquete final, completar el [plan de organización del repositorio](plan-organizacion-repositorio.md): inventario, revisión de secretos/historial, documentación vigente, integración, CI y release reproducible. No reescribir historial por estética ni interferir con tareas activas.
