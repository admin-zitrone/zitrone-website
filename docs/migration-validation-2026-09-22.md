# Validación de migración — 2026-09-22

Estado: NO aprobar todavía el cambio de dominio ni dar analytics por terminado. Auditoría de lectura; sin cambios de DNS, Vercel, GTM, campañas, correo o producción, y sin enviar formularios/correos de prueba.

## Evidencia actual

- zitrone.com.mx: A 76.76.21.21, HTTP 200, server Vercel. www: CNAME cname.vercel-dns.com y 308 al apex viejo.
- NS: ns75/ns76.domaincontrol.com. Identifica infraestructura DNS, no demuestra registrador, titular o cuenta accesible.
- MX: aspmx.l.google.com (1), alt1/alt2 (5), alt3/alt4 (10). SPF: v=spf1 include:_spf.google.com ~all. DMARC publicado p=none. Sin respuesta CAA en apex. DKIM y zona completa NO verificados.
- Vercel domains ls --scope zitrone lista únicamente zitrone.mx. No identifica al propietario del alojamiento viejo ni es inventario exhaustivo de asociaciones de proyectos.
- zitrone.mx responde 307 hacia www.zitrone.mx: pendiente hacerlo permanente. El 307 de / hacia /es es una decisión distinta de localización.
- HTML nuevo /es incluye GTM-TSTDVS4 y canonical https://www.zitrone.mx/es. URLs del sitemap usan www.zitrone.mx.
- HTML inicial viejo /es no contiene IDs GTM/GA/Ads; no prueba ausencia de tags cargados por JavaScript.
- GET nuevo /es/servicios/cafeteria?utm_source=migration_audit&gclid=audit termina 200 en /es/services/cafeteria-corporativa conservando ambos parámetros. Prueba de muestra, no certificación del mapa completo.
- next.config.ts contiene redirects relativos de rutas antiguas; NO configura por sí solo la asignación ni redirección entre dominios.

## Bloqueo concreto de analytics

Snapshot público de GTM guardado en gtm-public-resource-2026-09-22.json (resource versión 9).
Google tag G-E48BCCXZEC presente. Ads conversionId 779424827 presente.
Las tags Ads (tag_id 9) y GA4 form_submit (tag_id 16) usan gtm.click + igualdad exacta de gtm.elementClasses con styles__Button-sc-1q4vzjf-0 dOFLwW. Esa clase no aparece en src del nuevo proyecto.
El contenedor publicado no contiene contact_request_accepted, aunque el formulario y profiler locales emiten ese evento tras respuesta exitosa. Hace falta conectar y publicar el trigger correcto, comprobar recepción en GA4/Ads, deduplicación y tratamiento de errores. No basta con instalar GTM.
Consentimiento local: denegado por defecto para EEE/UK/CH, concedido fuera de esas regiones (incluido México); decisión guardada actualiza señales. Verificar aceptación/rechazo/revocación y navegación en navegador; presencia de Consent Mode no certifica comportamiento de cada tag ni cumplimiento legal.
No se inspeccionaron paneles privados GA4, Ads, GTM ni Search Console.

## Arquitectura objetivo

www.zitrone.mx sirve el nuevo sitio; zitrone.mx y ambas variantes de zitrone.com.mx redirigen permanentemente a la URL equivalente del nuevo sitio. Un destino canónico, contenedor y flujo GA4 acordados. El dominio zitrone.com.mx sigue registrado, renovado y mantiene Google Workspace y todos sus otros servicios.
No hace falta cross-domain tracking si el dominio viejo solo redirige sin cargar una página medida; revisar por separado si sobreviven recorridos reales entre dominios.
Mantener propiedad histórica cuando sea la correcta. No prometer fusión retroactiva de propiedades distintas: conservar acceso y combinar informes externos si corresponde. G-... es ID de medición; AW-... ID de tag/conversión, no sustituyen identificar las cuentas administrativas.

## Condiciones antes del cambio

1. Exportar zona DNS COMPLETA y guardar configuración actual de Vercel/SSL. Inventariar servicios, aliases, subdominios, DKIM, verificaciones, campañas y URLs con el responsable del cliente. Consultar nombres comunes no es un inventario.
2. Preservar NS, MX, SPF, DKIM, DMARC, registros de servicios y verificaciones. Solo añadir TXT de verificación específico si se requiere y ajustar exclusivamente web @/www según instrucciones del proyecto Vercel. No asumir que la IP antigua es la recomendada para el nuevo proyecto.
3. Acordar método de traslado con Vercel/proveedor. Vercel permite reclamar mediante TXT; puede requerir verificación adicional por hostname/proyecto. No pedir borrar primero el dominio en uso. Reclamar/asignar es un cambio operativo que debe coordinarse.
4. Validar TODAS las rutas viejas conocidas y de tráfico: HTTP/HTTPS, apex/www, ES/EN, UTM/gclid, destino 200, canonical, sin bucles y preferentemente un salto. Revisar destinos genéricos a home, especialmente política de integridad: contenido sin equivalente requiere decisión explícita.
5. Configurar GTM con éxito confirmado como señal de conversión; verificar una conversión por lead, no por clic, sin doble conteo Ads nativo/importado. Revisar page_view en navegación cliente, consentimiento, datos personales y conversiones mejoradas. Revisar URLs finales de campañas.
6. Verificar Search Console de ambos dominios, sitemap y cambio de dirección después de activar redirects. Mantener redirects al menos un año y dominio viejo renovado mientras use correo/enlaces.
7. Definir ventana, responsable y rollback real con proveedor anterior: valores DNS, asociación de dominios y despliegue recuperable. Si cambia solo asociación Vercel, revertir DNS no basta.
8. Antes/después: comparación de registros, pruebas coordinadas de recepción Y envío de buzones representativos (incluido opina), aliases/grupos y formulario. No realizadas en esta auditoría; requieren participación/autorización del cliente. Monitorizar entrega, HTTPS, 404, conversiones y Search Console tras cambio.

## Correcciones a documentos anteriores

Checklist de julio está desactualizado: /es/contacto ahora redirige a /es/contact en código, no home; no dar por probado propietario de Vercel; no prometer cero cambios DNS ni liberación obligatoria. La instrucción de no tocar TXT significa preservar existentes: añadir uno específico de verificación puede ser necesario.

## Fuentes oficiales

- https://vercel.com/docs/domains/working-with-domains/claim-domain-ownership
- https://vercel.com/docs/domains/set-up-custom-domain
- https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes
- https://developers.google.com/tag-platform/security/guides/consent
