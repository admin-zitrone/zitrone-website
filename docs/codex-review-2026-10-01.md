# Revisión independiente de la remediación de Claude

Fecha: 1 de octubre de 2026. Rango revisado: `7d67dac..c9325ad`; HEAD observado `c9325adffb83da2478036c0abe9503b7fe3af16f`, rama `design-system/type-unification`, inicialmente limpia. Node local 25.8.1. Revisión de diffs, código, evidencia y ejecución independiente; no basada únicamente en el informe.

**Dictamen: solicitar correcciones antes de aprobar la remediación.** La protección de leads y las correcciones de home tienen evidencia positiva. Persisten un defecto de invalidación del blog, un gate E2E rojo y dos problemas menores en los nuevos mecanismos de lectura/pruebas. Las cuatro decisiones del usuario siguen pendientes; esta revisión no las aprueba por él.

## Hallazgos que devolver a Claude

### R1 · P1 · Despublicar no invalida las páginas generadas del blog

Ubicación: `src/payload/hooks/revalidate.ts:39–44`, `tests/api/blog-publishing.test.ts`, `scripts/test-api-isolated.sh:28`.

El hook llama `revalidatePath('/es/blog', 'layout')` y su equivalente EN. En Next 16.2.10 eso registra `_N_T_/es/blog/layout`. Las páginas compiladas contienen `_N_T_/[locale]/blog/layout`, además del tag de su URL completa. **Los tags no coinciden.**

Comprobación independiente: ejecuté la función real `revalidatePath` de Next con su almacenamiento de contexto, y comparé las invalidaciones con `x-next-cache-tags` de `.next/server/app/es/blog/comida-en-la-oficina-y-retencion-de-talento.meta`. El patrón `'/[locale]/blog', 'layout'` sí produce un tag presente. El resultado está guardado en la evidencia.

Consecuencia: la consulta del loader deja de encontrar el artículo despublicado, pero la página ya generada y el índice pueden seguir sirviendo su contenido anterior. El sitemap ahora sí recibe su invalidación separada, con lo que puede incluso discrepar de las páginas. También afecta ediciones/altas, no solo despublicación.

La ruta de invalidación incorrecta es heredada del baseline; la remediación modificó este hook y promete que publicar/despublicar funciona en el sitio, pero no cerró esta parte de A-04. Las pruebas nuevas pasan porque consultan loaders en proceso y el runner fuerza `PAYLOAD_DISABLE_REVALIDATE=true`. No prueban el cache de Next.

**Corrección solicitada:** invalidar el patrón real del layout (`/[locale]/blog` con tipo `layout`) o los destinos concretos apropiados, conservando sitemap y verificando las rutas derivadas. Añadir una prueba sobre `next build`/`next start` contra DB local aislada, con hooks habilitados: precalentar índice/artículo, editar/despublicar mediante API de la app, volver a consultar y comprobar desaparición/404 tras la revalidación prevista; repetir al publicar de nuevo. Verificar ES/EN, sitemap y feed. No usar la base alojada para esta prueba. Corregir el manual si la política de caché incluye una ventana de contenido anterior.

### R2 · P1 de aceptación · La suite E2E completa sigue roja

Ubicación: `tests/e2e/contact.spec.ts:224–226`, escaneo axe en `tests/e2e/inquiry-location.spec.ts`, `playwright.config.ts`.

Repetí sin modificaciones:

```bash
NEXT_PUBLIC_SITE_URL=https://www.zitrone.mx npm run test:e2e
```

Resultado: **56 pasan / 5 fallan**, exit 1, 61 pruebas, sin retries locales. Build previo exitoso. Fallan catering ES/EN y ubicación ES-home, ES-contact, EN-home. Todas reportan contraste; no hubo timeout como causa de esos cinco fallos. Catering midió 2.46:1 y 3.48:1 en selects. Los otros casos también muestrean texto/controles del formulario. Las 21 pruebas de `accessibility.spec.ts` pasan dentro de esta corrida.

La comparación independiente `npm run test:contact` dio **27/27** en su configuración dedicada (dev, un worker, reduced motion). Respalda investigar las transiciones, pero cambia más de una variable y no prueba por sí sola que toda la causa sea la animación.

Claude ya declaró honestamente la inestabilidad: no es un hallazgo ocultado. Pero pasar cada prueba en ejecuciones distintas no satisface el gate completo. La configuración dedicada de contacto usa reduced motion, mientras la principal no lo fuerza. No atribuir todo a carga del equipo ni aumentar retries como solución.

**Corrección solicitada:** hacer determinista el escaneo de colores finales, esperando una condición real de fin de transición o aplicando reduced motion a las verificaciones de contraste, y conservar pruebas explícitas del comportamiento con movimiento normal. No añadir sleeps arbitrarios, quitar reglas o ampliar excepciones. Conseguir una corrida completa verde del commit final. Revisar cualquier contraste que persista una vez estable. Hacer reproducible la URL canónica de test sin depender de `.env.local` personal.

### R3 · P2 · Un fallo del stream escapa del control de errores de contacto

Ubicación: `src/lib/security.ts:161–180` y llamada desde `src/app/api/contact-request/route.ts:60`.

`readJsonWithLimit()` captura errores de `JSON.parse`, pero no de `reader.read()`. Antes, la ruta capturaba todo el `await request.json()`. Ahora una interrupción/error del cuerpo rechaza la promesa fuera del manejo de la ruta, en vez de devolver el JSON de error controlado. No invalida la mejora del límite de bytes, pero introduce esta regresión de recuperación.

Reproduje con un `ReadableStream` que llama `controller.error(...)`: resultado `UNHANDLED: simulated stream failure`. Sin red ni DB.

**Corrección solicitada:** capturar fallos de lectura/cancelación, liberar el reader en `finally` y mapear a una respuesta controlada apropiada. Mantener 413 para exceso de bytes y no convertir errores internos de persistencia en errores de JSON. Añadir contrato para fallo después de recibir un chunk, además de los cinco casos actuales.

### R4 · P2 · El aislamiento API no neutraliza todos los proveedores externos

Ubicación: `scripts/test-api-isolated.sh:26–33`, `scripts/backup-restore-drill.sh:25`, hook de `src/payload/collections/blog-posts.ts` y `src/ai/embeddings.ts`.

Los runners anulan Resend/Blob, pero heredan `OPENAI_API_KEY`. La creación/edición de artículos sintéticos ejecuta `embedText`; con una clave configurada puede enviar esos textos al proveedor y consumir cuota. La guarda de DB local protege Neon, no la red. No afirmo que Claude haya enviado solicitudes: su ejecución pudo no tener clave. El problema es reproducible cuando el entorno sí la contiene.

Comprobé el camino con una clave ficticia y `fetch` simulado en memoria: `embedText('Synthetic draft')` intentó `https://api.openai.com/v1/embeddings`. No salió ninguna solicitud de esa comprobación. En mi corrida API anulé explícitamente OpenAI y DSN de Sentry desde el comando.

**Corrección solicitada:** entorno de pruebas explícito sin credenciales de proveedores y una guarda de red que falle ante cualquier destino no local; aplicar también al simulacro de respaldo. Añadir una prueba con credenciales ficticias heredadas para demostrar que los hooks no escapan. Documentar el alcance real del aislamiento.

## Comprobaciones positivas

| Comprobación independiente | Resultado |
| --- | --- |
| Lint | 0 errores / 0 warnings |
| Contratos | 81/81 |
| Sistema de diseño | Pasa; baseline efectivamente disminuye, no se relajó |
| Assets | Pasa, antes de regeneración |
| Paleta email | Pasa |
| API local aislada | 21/21; sesiones REST de Payload, lead/admin/editor/anónimo, CSV, blog y outage |
| Build + tipos | Pasan dentro de E2E |
| Accesibilidad de páginas | 21/21 dentro de E2E; excepción verde conocida sigue activa |
| Contacto dedicado | 27/27, dev/un worker/reduced motion |
| E2E completo | 56/61; cinco fallos descritos en R2 |

La implementación de admin-only está centralizada y la exportación ya respeta acceso de colección. Los campos originales permanecen inmutables en las pruebas API; estado/notas y escrituras internas de email funcionan. El contador ya no usa incrementos aleatorios ni la etiqueta “hoy”. La receta de analytics se unificó y hay aserciones de 201/202/reintento/doble clic. Los documentos distinguen pendientes externos y no afirman aceptación final.

## Cobertura pendiente y recomendaciones de seguimiento

- **API en CI:** `.github/workflows/ci.yml` no ejecuta `test:api`. Integrarlo con Postgres efímero de CI; no depender de Colima ni de un contenedor personal. De lo contrario las regresiones de permisos/publicación pasarían el pipeline existente.
- **Performance:** las cifras Lighthouse entregadas son resultados locales con Google bloqueado, no mediciones de producción. El comando reproducible de Lighthouse prometido no está incluido en la sección “Cómo reproducir”; solo remite a parámetros. Guardar script/configuración exactos para repetir las 24 corridas. No verifiqué de nuevo esos números ni acepto como probada la causalidad “es solo la animación”; hace falta un comparativo controlado para esa conclusión. Los LCP móviles altos siguen pendientes.
- **Manual/operación:** faltan VoiceOver, zoom/teclado completos, pruebas de inbox, respaldo real, acceso del cliente, owners/costos, rate limit compartido y corte de dominio. El simulacro sintético no sustituye la recuperación real de Neon/Blob.
- **Nada externo:** el diff no contiene deploy, migración alojada, DNS, GTM ni envío de correo ejecutados; los documentos declaran solo lecturas. Git y logs seleccionados no permiten certificar retrospectivamente ausencia absoluta de acciones externas. Durante esta revisión no desplegué, escribí en Neon, cambié DNS/GTM ni envié correo. Sí usé la base Docker desechable; el build leyó el CMS configurado.

## Decisiones del usuario, separadas de bugs

1. **Leads admin-only:** técnicamente funciona. Confirmar si las dos personas de ventas tendrán ese acceso o necesitan rol de ventas con menos privilegios. No darles admin solo para sortear una política incompleta.
2. **Cifra y etiqueta:** se eliminó la simulación. Falta aprobar cifra/período/redacción; “hoy” requiere datos reales del día.
3. **Acento verde:** no se modificó la excepción. Puede aceptarse como limitación explícita o elegirse la alternativa conforme; no declarar AA completo con la excepción vigente.
4. **Ruta de `zitrone.com.mx`:** sigue pendiente elegir y coordinar el camino con el dueño del Vercel anterior/Arroba. La revisión de código no reemplaza registros exactos y autorización de corte.

No es necesario resolver estas cuatro decisiones para corregir R1–R4 y estabilizar los tests.

## Siguiente entrega solicitada a Claude

Corregir R1–R4 en commits separados, añadir la regresión de caché real, obtener E2E completo verde y actualizar `claude-remediation-results.md` con causa, diff, comandos y evidencia por R-ID. Conservar los pendientes externos como pendientes. No hacer deploy para demostrar que el arreglo funciona; primero validar localmente con DB aislada. Codex revisará los nuevos commits sin repetir toda la auditoría.

Evidencia de esta revisión: `docs/evidence/codex-review-2026-10-01/`. No se modificó código de producto. Se restauró únicamente la fecha generada por el build. Se dejó el contenedor local existente disponible, sin detener infraestructura del usuario.
