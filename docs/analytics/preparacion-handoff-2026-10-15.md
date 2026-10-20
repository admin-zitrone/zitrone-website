# Preparación de medición para modalidad 2 — 15-oct-2026

Revisión estática de layout, bootstrap de consentimiento, eventos, receta GTM y guía de activación. No se consultó la cuenta ni se certificó el contenedor publicado. No se enviaron eventos reales.

## Ya preparado

- GTM-TSTDVS4 integrado, dataLayer inicializado y consentimiento declarado antes de cargar el contenedor.
- Contrato generate_lead para solicitudes guardadas, con metadatos del formulario y sin campos personales del formulario en ese evento.
- Plantilla docs/gtm/zitrone-lead-tracking.gtm.json y receta única docs/analytics/gtm-activation.md: retirar conversión por clic antigua, evitar doble conversión con el evento diagnóstico, revisar Ads y probar recepción.

## Trabajo previo nuestro

1. Separar medición real de previews/pruebas. El layout solo comprueba NODE_ENV=production, condición también válida en builds preview y next start local. Implementar activación explícita por entorno con producción final habilitada y previews/local deshabilitados por defecto; documentar configuración receptor y comprobar ambos casos. Mantener disponible dataLayer para pruebas sin cargar Google. No asumir que los tests que bloquean Google protegen las visitas manuales a previews.
2. Resolver reapertura de preferencias de cookies y probar aceptar, rechazar, elección parcial, persistencia y cambio de decisión. El bootstrap observado deniega por defecto para regiones estrictas y concede fuera de ellas. Documentar esa conducta y obtener validación de la política del cliente; no presentar como consentimiento previo global ni cambiar política silenciosamente. Revisar datos personales también en URLs, etiquetas antiguas y captura automática, no solo el payload generate_lead.
3. Definir una sola estrategia page_view para navegación Next. Propuesta inicial para validar con administrador: medición automática de cambios de historial de GA4; no añadir simultáneamente otra tag manual para las mismas vistas. Si la validación muestra títulos/URLs incorrectos, cambiar coordinadamente a estrategia manual. Comprobar entrada directa, navegación interna, atrás/adelante y cambio de idioma con una vista por navegación y URL/título correctos. Su recepción final exige DebugView.
4. Revisar plantilla de importación contra contrato actual y probar localmente eventos válidos/errores/doble envío, ES/EN y formularios home/contacto. Registrar resultados en el SHA integrado. Revisar que parámetros de un evento no se arrastren al siguiente y que no se envíen campos libres ni datos personales a Analytics.
5. Preparar guion de migración con rutas antiguas y UTM/gclid sintéticos; preservar parámetros tras redirección. El modelo previsto es redirección a un único sitio, no dos sitios navegables que requieran configurar cross-domain por defecto. Revisar url_passthrough con el administrador según la configuración efectiva, sin borrarlo solo por estética de las URLs.
6. Consolidar paquete: IDs actuales por confirmar, plantilla importable (no contenedor completo), eventos, dimensiones, estrategia de vistas, consentimiento, filtros de entorno, pruebas, rollback y responsables. Revisar especialmente las tags existentes de configuración, Ads, Conversion Linker y captura automática; la importación no las reemplaza ni garantiza su estado.

## Dependencias de administrador

Confirmar titular/permisos/IDs, exportar configuración vigente, revisar tags antiguas y Enhanced Conversions, importar en workspace, validar Tag Assistant/DebugView, publicar y guardar versión/rollback. Coordinar leads reales de prueba y recepción. No cambiar GTM ni crear otra propiedad para suplir falta de acceso.

## Criterio de cierre

Dos hitos: preparación local verificada sobre SHA final y activación externa comprobada en destino. No llamar completa la medición por tener el script instalado o pasar tests de dataLayer. Queda pendiente implementación de aislamiento de entornos y cierre de cookies; no se hicieron cambios de producto en esta revisión.

Referencias oficiales consultadas:
- https://developers.google.com/analytics/devguides/collection/ga4/single-page-applications
- https://developers.google.com/analytics/devguides/collection/ga4/views
- https://developers.google.com/tag-platform/security/guides/consent
