# Paquete de medición para la recepción (modalidad 2)

15-oct-2026. Cierra la preparación local pedida en [preparacion-handoff-2026-10-15.md](preparacion-handoff-2026-10-15.md). Rama `analytics/handoff-prep`, base `146b966`. **No se tocó GTM, GA4, Google Ads ni Vercel, no se publicó ninguna etiqueta y no se envió ningún evento a Google.** Las pruebas corren con la red bloqueada fuera de `127.0.0.1`.

Hay dos hitos y este documento solo cubre el primero:

1. **Preparación local verificada** (este paquete, pendiente de revisión de Codex sobre el SHA final integrado).
2. **Activación externa comprobada en destino** (administrador de Zitrone/Arroba, con Tag Assistant y DebugView).

Tener el script instalado o pasar las pruebas del dataLayer no significa que la medición esté completa.

## 1. Medición solo en producción final

**Antes:** el layout cargaba GTM con `NODE_ENV === "production"`. Esa condición también se cumple en los builds preview de Vercel y en un `next start` local, así que las visitas a previews y QA llegaban a la propiedad real.

**Ahora** ([src/lib/analytics/measurement.ts](../../src/lib/analytics/measurement.ts)) se exigen dos condiciones:

| Entorno | Resultado |
| --- | --- |
| Producción en el dominio canónico (`www.zitrone.mx` o `zitrone.mx`) | Carga `gtm.js` |
| Producción vista por su URL `*.vercel.app` o un proyecto receptor temporal | No carga (`window.__zitroneGtm = "host-not-allowed"`) |
| Preview de Vercel, `vercel dev`, build local, CI, Playwright | El loader no se genera |
| Producción con `GTM_MEASUREMENT=off` | El loader no se genera (interruptor de emergencia) |

En todos los casos el dataLayer y los valores predeterminados de consentimiento siguen presentes, así que las pruebas y Tag Assistant leen los eventos aunque Google no reciba nada.

**Configuración en el proyecto receptor** (solo nombres, sin valores secretos):

| Variable | Entorno | Valor esperado |
| --- | --- | --- |
| `VERCEL_ENV` | sistema, la pone Vercel | `production` solo en despliegues de producción |
| `NEXT_PUBLIC_SITE_URL` | Production | `https://www.zitrone.mx`. Define el host permitido. |
| `GTM_MEASUREMENT` | opcional | Sin definir. `off` apaga la medición en el siguiente build. |

Ambas condiciones se fijan en el build: un cambio de variable requiere redeploy.

**Consecuencia que debe aceptar el administrador:** Tag Assistant no conectará en una URL temporal del receptor. La validación previa al corte se hace sobre el dominio que sirva este código en producción. Si hace falta validar en una URL temporal, la opción es añadir ese host de forma explícita y temporal. No existe un interruptor que fuerce la carga en previews.

**Comprobación:** `tests/contracts/measurement-contract.test.ts` ejecuta el loader real contra hosts permitidos y rechazados y recorre la matriz de entornos. `tests/e2e/measurement.spec.ts` verifica que el servidor de pruebas no pide nada a Google, no genera el loader y mantiene el dataLayer. En el sitio publicado: `window.__zitroneGtm` en la consola.

## 2. Consentimiento

### Conducta actual (sin cambios)

- **EEE, Reino Unido y Suiza:** todo denegado por defecto salvo `security_storage`, con `wait_for_update: 500`.
- **Resto del mundo, México incluido:** todo **concedido por defecto**. Las etiquetas pueden usar cookies de analítica y publicidad **antes** de que la persona elija. No es un consentimiento previo global y no debe presentarse así.
- El banner aparece a todos los visitantes. La decisión se guarda en la cookie `zitrone_consent` durante 182 días, se reproduce como `consent update` antes de `gtm.js` en cada carga y se invalida al subir `CONSENT_VERSION`.
- Categorías: analítica (`analytics_storage`, `functionality_storage`) y marketing (`ad_storage`, `ad_user_data`, `ad_personalization`, `personalization_storage`).
- `url_passthrough` y `ads_data_redaction` activos.

**Decisión pendiente del cliente:** confirmar que el aviso de privacidad y la política de Zitrone aceptan el modelo regional. La alternativa sería denegar por defecto en todas las regiones, lo que reduce la medición observada y se apoya en el modelado de Google. No se cambió nada sin esa validación.

### Pruebas de la decisión

| Caso | Prueba |
| --- | --- |
| Aceptar todo | `consent.spec.ts` (persistencia y reproducción al recargar) |
| Rechazar todo | `consent.spec.ts` (envía `update`, no solo oculta el banner) |
| Elección parcial | `consent.spec.ts`; `measurement.spec.ts` (analítica sí, publicidad no; persiste al recargar) |
| Cambio de decisión | `measurement.spec.ts`: aceptar → reabrir → rechazar (y al revés); el panel reabierto muestra la elección guardada; la nueva elección llega a Google y se reproduce en la siguiente carga, también en el otro idioma |
| Cerrar sin guardar | `measurement.spec.ts`: Escape no registra una decisión nueva |
| Reapertura desde el footer | `consent.spec.ts` |

El enlace del footer queda tapado por la página hasta el final del scroll. Otra sesión tiene sin commit una corrección de foco (`marketing.css` y `consent.spec.ts` en el checkout principal) que **no** forma parte de esta rama. Las pruebas de esta rama activan el enlace con el teclado y no dependen de esa corrección.

### Datos personales fuera de `generate_lead`

| Origen | Estado | Acción |
| --- | --- | --- |
| `generate_lead` y demás eventos del contrato | Sin nombre, correo, teléfono, empresa ni mensaje; `lead_interest` sale de una lista cerrada | Comprobado en E2E (`PII_SAMPLES`) |
| Formularios | Envío por `POST`; ningún dato del formulario pasa a la URL | Revisado |
| Búsqueda del blog `?q=` | Texto libre en la URL. GA4 lo recibe en `page_location` y, si la búsqueda en el sitio está activa, como `search_term` | **Administrador:** activar la redacción de datos (correo y parámetro `q`) del flujo web o desactivar la búsqueda en el sitio |
| `link_url` en `cta_click` | Los `mailto:`/`tel:` son contactos de Zitrone, no del visitante | Ninguna |
| `?src=` en enlaces internos | Identificador de CTA, sin datos personales | Ninguna |
| Etiquetas antiguas del contenedor | `form_submit` por clic en clase CSS; Enhanced Conversions puede estar en modo automático, que **lee los campos del formulario de la página** | **Administrador:** revisar antes de publicar (paso 6 de [gtm-activation.md](gtm-activation.md)) |
| Medición mejorada de GA4 | Las interacciones con formularios contarían doble | **Administrador:** desactivarlas |
| `navigation_started` (diagnóstico) | Incluye la URL, con `?q=` si existe, y va a Vercel Analytics | Aceptado como diagnóstico interno; no lo lee ninguna tag de Google |

## 3. Estrategia de page_view

**Propuesta para validar con el administrador:** una sola fuente, la medición mejorada de GA4 «cambios de página según eventos del historial del navegador». No añadir ninguna tag manual de page_view mientras esté activa.

**Evidencia local** (`measurement.spec.ts`, guarda `history.json` como adjunto):

| Navegación | Cambios de URL | URL | Título en el instante del cambio |
| --- | --- | --- | --- |
| Entrada directa `/en` | 0 (carga normal) | correcta | correcto |
| `/en` → servicio (enlace interno) | 1 `pushState` | `/en/services/corporate-dining` | **el de la página anterior** |
| Atrás | 1 `popstate` | `/en` | **el de la página anterior** |
| Adelante | 1 `popstate` | `/en/services/corporate-dining` | **el de la página anterior** |
| Cambio de idioma (menú del footer) | 1 `pushState`, navegación del cliente, sin recarga | `/es/services/comedor-corporativo` | **el de la página anterior** |
| CTA a contacto | 1 `pushState` | `/es/contact?src=nav` | **el de la página anterior** |

Hay un cambio de URL por navegación, así que no se esperan vistas duplicadas. Pero Next actualiza `document.title` **después** del cambio de historial. Si GA4 lee el título en ese instante, las vistas de navegación interna llevarán el título de la página anterior. La prueba fija la secuencia de URLs y solo registra los títulos, porque el resultado real depende de cuándo lea GA4.

**Criterio en DebugView:** en cada navegación interna, `page_title` debe coincidir con la página nueva. Si no coincide, cambiar de forma coordinada a la estrategia manual: el sitio empuja un evento de vista cuando el título ya está actualizado, en GTM se desactiva la medición por historial y se apaga la vista automática de la tag de configuración. Nunca las dos a la vez. Ese cambio no está implementado, porque hacerlo sin el administrador duplicaría las vistas.

## 4. Plantilla de importación contra el contrato

**Defecto encontrado y corregido.** La tag GA4 de `docs/gtm/zitrone-lead-tracking.gtm.json` envía las 17 variables en cada evento, pero cada push solo limpiaba sus propias claves. Como GTM fusiona los pushes en un modelo persistente:

- `generate_lead` llevaba `link_url`, `cta_text`, `cta_target`, `page_type` y `outbound` del último clic.
- El siguiente `cta_click` llevaba el `lead_id`, `form_id` y `lead_interest` del lead anterior.

Ahora `pushDataLayer` envía siempre las 17 claves y deja en `undefined` las que el evento no usa ([data-layer.ts](../../src/lib/analytics/data-layer.ts), `DATA_LAYER_PARAMS`).

**Pruebas:**

- `measurement-contract.test.ts`: variables de la plantilla = `DATA_LAYER_PARAMS`; la tag reenvía cada clave con su nombre; el trigger cubre exactamente los cinco eventos y nunca `contact_request_accepted`; una secuencia clic → lead → clic no arrastra valores. Contra el código anterior, esta última prueba falla.
- `contact.spec.ts` y `profiler-submission.spec.ts`, en ES y EN: el modelo fusionado de GTM en el `generate_lead` no conserva claves de clic.
- Ya existentes: lead guardado (201) = un evento; 202, 422, 502 y error de red = ninguno; doble envío = un POST y un evento; formularios de contacto y home.

## 5. Guion de migración (UTM y gclid)

Modelo: redirección a un único sitio (`www.zitrone.mx`). No hay dos sitios navegables, así que no se configura cross-domain por defecto.

**Automatizado:**

- `tests/contracts/domain-redirects.test.ts`: `zitrone.com.mx` (http/https, con y sin www) → canónico, conservando `utm_source`, `utm_campaign` con acentos, `gclid` y `gbraid`.
- `tests/e2e/domain-migration.spec.ts`: rutas antiguas → páginas reales con `utm_source` y `gclid` conservados.

**Manual el día del corte** (parámetros sintéticos, sin campañas reales):

1. `https://zitrone.com.mx/<ruta antigua>?utm_source=corte-prueba&utm_medium=qa&gclid=TEST-CORTE`: una sola redirección 301/308 al canónico, con los tres parámetros.
2. Mismo caso con `http://` y con `www.`.
3. En Tag Assistant: `page_location` del primer page_view con los parámetros, y la atribución en GA4 Tiempo real como `corte-prueba / qa`.
4. Anotar la hora para excluir esas sesiones de los informes.

`url_passthrough` se mantiene. Cuando se deniega el consentimiento, es lo que conserva `gclid` en la URL. Retirarlo es decisión del administrador según la configuración efectiva, no por cómo se ven las URLs.

## 6. Inventario para el administrador

**IDs por confirmar en las cuentas:** GTM `GTM-TSTDVS4`; GA4 `G-E48BCCXZEC`; Google Ads `AW-779424827`, conversión con label `JqU6COCq65ABELuo1PMC` (tag id 9 en la versión v9 del contenedor). Confirmar titular, permisos y qué acción representa ese label.

**Qué entrega el repositorio:**

- Una **plantilla importable** (17 variables, 1 trigger, 1 tag GA4), no un contenedor completo.
- La importación **no** reemplaza ni revisa las tags existentes de configuración GA4, Ads, Conversion Linker, `form_submit` ni Enhanced Conversions. Su estado lo verifica el administrador.

**Eventos y dimensiones:** [analytics-tracking.md](../analytics-tracking.md). Receta y guion de Preview: [gtm-activation.md](gtm-activation.md).

**Reversión:**

| Capa | Cómo |
| --- | --- |
| Sitio | `GTM_MEASUREMENT=off` + redeploy apaga la carga sin tocar GTM; o revertir el commit |
| GTM | Exportar la versión publicada antes de importar y volver a publicarla |
| GA4 / Ads | Desmarcar el evento clave y restaurar el trigger anterior de la conversión |

**Responsables:**

| Tarea | Responsable |
| --- | --- |
| Código, pruebas y este paquete | Nosotros (revisión de Codex) |
| Permisos, exportación, revisión de tags antiguas y Enhanced Conversions, importación, Preview/DebugView, publicación y versión de rollback | Administrador de las cuentas de Zitrone |
| Leads reales de prueba y aviso al inbox de ventas | Zitrone |
| Política de consentimiento | Zitrone |

No crear otra propiedad ni contenedor para suplir la falta de acceso.

## 7. Ejecución local

Worktree aislado, `next build` + `next start` en el puerto 3200 (otra sesión usaba Playwright en paralelo). Node **25.8.1**: Node 24 no está instalado en esta máquina y CI usa 24. Hay que repetirlo en Node 24 sobre el SHA integrado.

| Comando | Resultado |
| --- | --- |
| `npx tsc --noEmit` | sin errores |
| `npm run lint` | sin errores |
| `npm run test:contracts` | 94/94 (83 anteriores + 11 nuevas) |
| `npm run test:scripts` | 12/12 |
| `npm run test:e2e` (excepto visual) | 66/66 |

No se ejecutaron `test:api`, `test:cache` ni `test:visual`: esta rama no toca API, caché ni estilos.

## Pendientes

**Locales:**

- Integrar sobre el SHA final y repetir en Node 24.
- La corrección de foco del footer depende de la otra sesión.

**Administrador:**

- Todo lo de la sección 6.
- DebugView del título en navegación interna (sección 3).
- Redacción de `q` (sección 2).

**Cliente:**

- Validar la política de consentimiento regional.
