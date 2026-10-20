# Activación de analytics del revamp

Receta única vigente desde el 30 de septiembre de 2026. Pendiente de ejecutar por quien tenga acceso a GTM-TSTDVS4, GA4 G-E48BCCXZEC y Google Ads AW-779424827. Nada de esto se ha publicado; el estado publicado de GTM debe leerse el día del cambio.

Paquete de recepción (entornos, consentimiento, estrategia de page_view, datos personales, migración, rollback): [paquete-medicion.md](paquete-medicion.md). GTM solo carga en el build de producción servido desde `www.zitrone.mx`/`zitrone.mx`; Tag Assistant no conectará en previews ni en URLs temporales.

## Fuente única de conversión

La conversión es el evento **`generate_lead`** que la propia web empuja al dataLayer **solo cuando el lead quedó guardado** (respuesta 201). Validación, errores 4xx/5xx, fallos de red y el honeypot 202 no lo emiten. Lleva `lead_id` (folio), `form_id` (`contact` | `profiler`), `language`, `lead_interest`, `lead_headcount` y la atribución CTA; nunca nombre, correo, teléfono, empresa ni mensaje. Contrato completo: [analytics-tracking.md](../analytics-tracking.md). Lo comprueban `tests/e2e/contact.spec.ts` y `profiler-submission.spec.ts` (un evento por lead guardado, cero en 202/errores, uno con doble envío).

**Sustituida:** la receta anterior de este documento (22 de septiembre) creaba en GTM un trigger sobre `contact_request_accepted` y una tag GA4 que lo renombraba a `generate_lead`. No usarla: sumada a la importación de abajo contaría cada lead dos veces. `contact_request_accepted` sigue llegando al dataLayer como evento de diagnóstico; **ninguna tag de conversión debe dispararse con él.**

## Pasos

1. **Exportar** la versión publicada y anotar número, fecha, propiedad GA4 y acción de Ads. Comparar con el snapshot de [migration-validation-2026-09-22.md](../migration-validation-2026-09-22.md); si cambió, revisar el diff antes de editar. Esa exportación es el rollback de GTM, independiente del rollback del sitio.
2. **Importar** `docs/gtm/zitrone-lead-tracking.gtm.json` en un workspace nuevo (Merge → Rename conflicting). Añade variables Data Layer, un trigger Custom Event (regex `cta_click|contact_click|lead_form_start|lead_form_step|generate_lead`) y una tag GA4 Event que reenvía el nombre del evento.
3. **Ads:** apuntar la tag de conversión existente (id 779424827, label JqU6COCq65ABELuo1PMC, tag id 9) a un trigger Custom Event `generate_lead` con exactamente ese nombre, y Transaction ID = `{{DLV - lead_id}}` para que Ads deduplique un mismo folio. Confirmar antes con quien opera campañas qué acción representa ese label. Mantener un solo Conversion Linker.
4. **Pausar** en el sitio nuevo la tag GA4 `form_submit` (id 16) y el trigger por clic en clase CSS del sitio anterior. Si el contenedor sigue cargando en `zitrone.com.mx` antes del corte, limitar esas tags a ese hostname y retirarlas después del corte.
5. **GA4:** marcar `generate_lead` como evento clave; desactivar Enhanced Measurement → Form interactions; activar redacción de datos para correo y el parámetro `q` de la búsqueda del blog; crear las dimensiones listadas en analytics-tracking.md. Si Ads usa la conversión nativa del paso 3 como principal, **no** importar además el evento clave de GA4 como otra conversión principal para las mismas campañas.
6. **Enhanced Conversions:** revisar por separado. No activar captura de datos de usuario por suposición; requiere consentimiento `ad_user_data` y decisión explícita sobre qué datos se envían.
7. **Preview / DebugView** con el guion de abajo; publicar solo si todo coincide. Registrar versión publicada, fecha y evidencia en el tracker.

## Guion de verificación (para quien tenga acceso)

Hacer en Tag Assistant Preview contra el deployment definitivo, con consentimiento aceptado y luego rechazado. Los leads de prueba los recibe el inbox de ventas: avisar antes, marcar el mensaje como prueba y acordar cuántos se envían.

| Acción | Esperado en Preview | Esperado en GA4 DebugView / Ads |
| --- | --- | --- |
| Enviar sin datos válidos | Sin `generate_lead` | Nada |
| Respuesta 422/429/502 o red caída | Sin `generate_lead`; el visitante puede reintentar | Nada |
| Lead guardado (201), ES y EN, contacto y home | Un `generate_lead` con `lead_id`; tag Ads y tag GA4 disparadas una vez | Un `generate_lead`; una conversión Ads (latencia de horas) |
| Doble clic en Enviar | Un solo POST y un solo `generate_lead` | Un evento |
| Rechazar analytics/marketing | `generate_lead` en dataLayer; tags respetan consent mode | Sin cookies de Ads/GA; modelado según consentimiento |
| home → servicio → contacto → cambio de idioma, atrás/adelante | Una page_view por vista (estrategia única: historial de GA4, sin tag manual) | URL y **título de la página nueva**; localmente el título cambia después del cambio de URL, ver paquete §3 |
| Entrar por URL vieja con UTM/gclid | Parámetros conservados tras redirect | Atribución en la plataforma, no solo en la URL |

Las pruebas locales bloquean Google; prueban el dataLayer, no la recepción en GA4/Ads. Producción mantiene `url_passthrough`, así que `_gl` puede aparecer en URLs.

## Fuentes

- [Google: conversiones Ads en GTM](https://support.google.com/tagmanager/answer/6105160?hl=en)
- [Google: transaction ID y duplicados](https://support.google.com/google-ads/answer/6386790?hl=en)
- [Google: eventos recomendados](https://support.google.com/analytics/answer/9267735?hl=en)
