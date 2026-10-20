# Migración web de Zitrone

> **Modelo vigente, 13-oct-2026:** Arroba recibe el sitio en su Vercel y se encarga de los dominios/DNS. [Plan completo](plan-entrega-arroba-2026-10-13.md), [ficha actualizada](handoff-arroba-2026-10-12.md).
>
> No añadir .com.mx al proyecto de origen ni generar allí el anexo DNS. Arroba obtiene los valores exactos desde su proyecto receptor y coordina las asociaciones anteriores. La ruta principal, precisada el 15-oct por Raúl, es entregar repositorio/main y desplegar en el Vercel receptor. Transferir el proyecto existente requiere un acuerdo distinto.
>
> El material siguiente es referencia histórica de DNS/rutas. Sus decisiones de equipo receptor, A/B, canónico y mensajes quedan sustituidas por el plan del 13-oct; los datos observados no son una orden de cambio. Conservar Workspace y aplicaciones internas.

Documento único de dominios y corte. Ficha actualizada el 30 de septiembre de 2026 (Claude, lectura sin cambios); el resto del checklist es del 22 de septiembre (Codex). [vercel-handoff.md](vercel-handoff.md) cubre la recepción y despliegue del proyecto y remite aquí para dominios. La preparación local NO equivale a autorización de corte ni a validación de Google o correo.

## Ficha de corte (pendiente de completar con Arroba y el Vercel anterior)

**Observado el 30-sep-2026, solo lectura** (`vercel domains inspect`, `dig`, `curl`). Es una foto de ese día, no una configuración aprobada.

| Dato | Observado / estado | Quién completa |
| --- | --- | --- |
| Canónico | `https://www.zitrone.mx` (intención del código, `NEXT_PUBLIC_SITE_URL`) | Cliente confirma |
| Proyecto receptor | `zitrone-website`, equipo **Zitrone**, Node 24.x. Tiene asignados `zitrone.mx` y `www.zitrone.mx`. | Desarrollo |
| `zitrone.mx` | Registrador externo; NS `ns39/ns40.domaincontrol.com` (GoDaddy). `https://zitrone.mx` → **307** a `https://www.zitrone.mx/` (redirect del dominio en Vercel, no 308) | Owner GoDaddy |
| `www.zitrone.mx` | CNAME a `*.vercel-dns-017.com`; `/` → 307 a `/es` | — |
| `zitrone.com.mx` | NS `ns75/ns76.domaincontrol.com`; A `76.76.21.21` (Vercel); responde **200** con el sitio anterior. **No** está en el equipo Zitrone: lo sirve otra cuenta Vercel. | Arroba + owner del Vercel anterior |
| `www.zitrone.com.mx` | CNAME `cname.vercel-dns.com`; 308 → `https://zitrone.com.mx/` | Igual |
| Correo | MX de Google Workspace en `zitrone.com.mx` (aspmx.l.google.com y alternos). No tocar MX, SPF, DKIM, DMARC ni NS. | TI / Arroba |
| Subdominios internos | `intranet`, `activos`, `satisfaccion`, `operaciones`, `menu-uber` con TXT en `_vercel.zitrone.com.mx` (hallazgo del 22-sep). No reverificados hoy. | Arroba confirma inventario completo |
| Registros exactos a crear | **Ninguno conocido.** Los TXT/A/CNAME los genera Vercel cuando se añade el hostname al proyecto definitivo; copiar valor, TTL y fecha aquí. No inventar ni usar IP genérica. | Desarrollo, al añadir el host |
| Ventana, TTL previo, rollback | Pendiente | Cliente + Arroba |

### Qué no hay que hacer

- **No reclamar `zitrone.com.mx` a nivel equipo** (Verify & Claim). Movería el dominio raíz y con él la verificación de los subdominios internos de otra cuenta. Vercel permite verificar por TXT un hostname concreto en un proyecto de otro equipo sin mover el dominio raíz ([docs](https://vercel.com/docs/domains/working-with-domains)). El log del 24-sep que proponía el claim queda sustituido por esta ficha.
- No mover registrador, NS ni correo. No borrar primero el dominio en la cuenta anterior.

### Dos caminos para `zitrone.com.mx` y `www` (elegir uno con el cliente)

| | A. Redirect en el proyecto anterior | B. Asignar los hosts a `zitrone-website` |
| --- | --- | --- |
| Quién actúa | Owner del Vercel anterior | Desarrollo + Arroba (TXT de verificación por hostname) |
| Cambio DNS | Ninguno | Solo el TXT que pida Vercel; A/CNAME ya apuntan a Vercel |
| Rutas antiguas | 308 al home o a la misma ruta en `www.zitrone.mx`; el mapa de rutas del código actúa en el segundo salto | El mapa `src/lib/domain-redirects.ts` actúa en un salto |
| Reversión | Quitar el redirect en el proyecto anterior | Quitar los hosts del proyecto nuevo; el anterior debe poder volver a asignarlos |
| Riesgo | Dependemos de la otra cuenta para cambios futuros | Requiere que la cuenta anterior libere los hostnames |

Aceptación en cualquier caso: HTTPS válido en los cuatro hosts, destino final 200, redirects permanentes sin bucles, canonical y sitemap con `www.zitrone.mx`, UTM/gclid conservados, formulario ES/EN, correo enviando y recibiendo, apps internas respondiendo, y el 307 de `zitrone.mx` sustituido por 308 si se busca permanencia (ajuste en Vercel → Domains, no en código).

### Mensaje para Raúl / Arroba (borrador, **no enviado**)

> Hola Raúl. Estamos cerrando la versión de entrega del sitio en Vercel. Antes de pedir cualquier registro necesitamos dos cosas: (1) confirmar qué cuenta de Vercel tiene hoy asignados zitrone.com.mx y www.zitrone.com.mx, y quién la administra; (2) el inventario completo de la zona de zitrone.com.mx, incluidos los subdominios internos, para no tocarlos. No vamos a modificar NS, MX, SPF, DKIM ni DMARC. Cuando el proyecto definitivo nos dé los registros exactos (normalmente un TXT de verificación), les mandamos una tabla con tipo, nombre, valor y TTL, la ventana propuesta y cómo revertir. El sitio principal será www.zitrone.mx y las direcciones anteriores redirigirán a él.

## Documento de integridad

`/es/politica-de-integridad` y `/en/integrity-policy` redirigen hoy a la home por reglas heredadas. Una redirección a la home **no** conserva un documento legal. Decisión pendiente del cliente: entregar el texto aprobado para publicarlo, o confirmar por escrito su retiro. Hasta entonces, el corte no debe darse por equivalente para esas URLs.

## Arquitectura y alcance

- Sitio canónico: https://www.zitrone.mx.
- Hosts web de entrada: zitrone.mx, zitrone.com.mx y www.zitrone.com.mx.
- Reglas ejecutables: `src/lib/domain-redirects.ts`, importadas por `next.config.ts`.
- Primero se resuelven rutas conocidas y slugs traducidos hacia el destino final; luego raíz → /es; el resto conserva la ruta en el dominio canónico. Respuestas 308 y parámetros de campaña preservados.
- Las reglas solo reclaman esos tres hosts exactos, no subdominios internos. Las rutas desconocidas de servicios ya no se mandan genéricamente al índice.
- zitrone.com.mx permanece registrado/renovado y conserva Google Workspace. No migrar registrador, nameservers, correo ni otros servicios como parte de este cambio.

## Hallazgo 22-sep: subdominios internos en Vercel

- El DNS de zitrone.com.mx lo administra Arroba Systems (partner de Google Workspace de Zitrone), según Raúl Carlón.
- `_vercel.zitrone.com.mx` tiene TXT de verificación para intranet, activos, satisfaccion, operaciones y menu-uber. Los cinco resuelven a Vercel y responden (operaciones pide login). Son apps internas en uso, probablemente en la misma cuenta Vercel ajena que sirve el sitio viejo.
- NO reclamar el dominio raíz a nivel equipo (Connect External → Verify & Claim) hasta confirmar qué pasa con esos subdominios: el claim transfiere el dominio a nuestro equipo.
- Preferido: que el dueño de la cuenta Vercel actual configure zitrone.com.mx y www como redirect 308 hacia https://www.zitrone.mx en su propio proyecto. Cero cambios DNS; las reglas de rutas antiguas también aplican en www.zitrone.mx (dos saltos en vez de uno).
- A/CNAME de @ y www ya apuntan a Vercel: no hay que pedir registros DNS a Arroba para el sitio.

## Lo preparado localmente

- [x] Reglas host + ruta y preservación de parámetros de campañas.
- [x] Rutas plantilla `/_global/*` que el sitio viejo servía con 200 (about, clients, contact, differentiators, integrity, privacy, service) mapeadas a su equivalente ES.
- [x] Contratos del motor Next para HTTP/HTTPS, los tres hosts, URLs conocidas, ausencia de bucles y hosts excluidos.
- [x] Suite `npm run test:migration` para probar rutas reales/canonical, formularios ES/EN y consentimiento. Bloquea tráfico externo del navegador y envíos sin mock.
- [x] Guarda de conversiones: éxito persistido 201; acknowledgements 202 de honeypot no emiten contact_request_accepted.
- [x] [Instrucciones exactas para activar GTM](analytics/gtm-activation.md).

## Pendientes que bloquean el corte

- [ ] Acceso/control de zona DNS y exportación COMPLETA, incluidos todos los selectores DKIM, verificaciones y subdominios.
- [ ] Responsable de TI confirma buzones, aliases, grupos, servicios y dependencias. Las consultas DNS públicas no sustituyen ese inventario.
- [ ] Inventario de URLs desde Search Console, campañas, backlinks y QR; el manifiesto de Next antiguo no enumera todos los slugs dinámicos ni demuestra tráfico.
- [ ] Revisar equivalencia editorial de /es/nosotros, /es/clientes, /es/diferenciadores y sus pares EN (destino actual home).
- [ ] Resolver /es/politica-de-integridad y /en/integrity-policy: las reglas heredadas apuntan a home, pero no conservan un documento legal. Restaurar contenido aprobado o acordar retiro explícito antes de migrar.
- [ ] Configurar y verificar GTM/GA4/Ads con acceso a sus paneles; las pruebas locales no envían datos a Google.
- [ ] Confirmar política regional de consentimiento: el código actual concede por defecto fuera de EEE/UK/CH. No fue cambiado ni certificado legalmente en esta preparación.
- [ ] Verificar propiedades de ambos dominios en Search Console.
- [ ] Congelar release, validar build y acordar ventana, participantes y rollback con proveedor anterior.

## Configuración Vercel en la ventana autorizada

1. Guardar proyecto/despliegue/asociaciones y export DNS de origen. Disponer de una vía concreta para volver a servir el proyecto anterior, no solo de una captura de su IP.
2. Preparar y desplegar la versión revisada con NEXT_PUBLIC_SITE_URL=https://www.zitrone.mx. Confirmar contacto ES/EN, canonical, sitemap, HTTPS y destino de leads.
3. Verificar/trasladar cada hostname al proyecto adecuado, siguiendo los TXT exactos que Vercel solicite. Verificación de equipo y de proyecto pueden ser separadas. No pedir al proveedor borrar primero el dominio activo.
4. Asociar los hosts a la aplicación para que el mapa host + ruta pueda ejecutarse. Un redirect global de Vercel ocurre antes y puede saltarse este mapa o introducir un segundo salto. El 307 actual de zitrone.mx debe sustituirse por la estrategia aquí documentada; no se arregla solo desplegando código si Vercel sigue interceptándolo.
5. Conservar zona y registros ajenos al sitio: NS, MX, SPF, DKIM, DMARC y servicios. Añadir únicamente los TXT de verificación necesarios y modificar A/AAAA/CNAME de @/www solo si el proyecto lo requiere. No sustituir la zona, asumir una IP genérica ni usar wildcard.
6. Validar HTTPS en ambos hosts viejos y todas las variantes HTTP/HTTPS. Comprobar saltos reales, destino final 200, canonical, parámetros UTM/gclid/gbraid/wbraid y ausencia de bucles. Las pruebas locales no certifican edge Vercel/SSL.
7. Ejecutar pruebas coordinadas de envío Y recepción con TI antes/después, incluyendo opina, buzones representativos y aliases; comparar registros de correo y otros servicios. Probar lead real solo con destinatarios y alcance acordados.
8. Con redirects activos y validados, cambio de dirección en Search Console y sitemap nuevo. Actualizar URLs de campañas y enlaces controlados. Mantener redirects al menos un año; renovar dominio viejo mientras sostenga correo o enlaces.

## Reversión y seguimiento

- Ante fallo web/SSL: recuperar asociación al proyecto/despliegue anterior y los registros web anteriores si cambiaron. Revertir DNS no basta cuando solo cambió la asociación Vercel.
- Ante cambio accidental de correo: TI restaura exactamente los registros afectados desde el export; verificar envío/recepción y colas. No improvisar valores.
- GTM tiene rollback independiente: publicar versión anterior exportada, coordinando consecuencias de volver al trigger viejo.
- Revisar inmediatamente, al día siguiente y durante las semanas siguientes: errores 404/SSL, leads persistidos, entrega, conversiones, atribución y Search Console. Anotar responsable y evidencia; no prometer posicionamiento invariable.

## Evidencia y pruebas

- [Auditoría pública y de código del 22 de septiembre](migration-validation-2026-09-22.md).
- `npm run test:contracts`: motor Next y contratos de negocio, sin red.
- `npm run test:migration`: loopback 3102, navegador aislado, formulario simulado; NO envía correos ni prueba recepción en GA4/Ads.
- `npx tsc --noEmit` y `npm run build`: verificaciones del release local, no despliegan.
- No usar `release:home:prod` como prueba inocua: puede sincronizar CMS y desplegar producción.
