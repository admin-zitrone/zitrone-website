# Segunda revisión de Codex — R1–R4

Fecha de cierre: 5 de octubre de 2026. Revisión iniciada el 2 de octubre y retomada en esta sesión. Rango: `9e725d0..eedd965`; código de referencia `4776a34`; HEAD comprobado `eedd965321782be6f33b0e3c9bdab8bffbaafd01`. Rama `design-system/type-unification`, inicialmente limpia. Node local 25.8.1.

## Dictamen

**R1–R4 aprobados en su alcance técnico local. No encontré nuevos defectos bloqueantes en los cambios revisados. Esto no constituye aceptación final del proyecto ni autorización para desplegar.**

Revisados los diffs y ejecutadas pruebas independientes; no se aceptaron los resultados únicamente por el informe de Claude. Esta revisión cierra únicamente las observaciones de la ronda anterior; la entrega al cliente conserva los pendientes operativos y decisiones registrados.

## Resultado por observación

| ID | Verificación independiente | Resultado |
| --- | --- | --- |
| R1 · caché del blog | El hook invalida `'/[locale]/blog', 'layout'` y `/sitemap.xml`. `test:cache` compila contra Postgres desechable, sirve páginas con cache HIT, modifica por la API de Next con hooks habilitados y verifica cambios. | **Cerrado localmente. 4/4.** Edición visible en primera visita; despublicación devuelve 404 ES/EN en primera visita y retira entradas; republicación funciona. |
| R2 · suite principal | `scanSettled()` espera que terminen animaciones/transiciones finitas del formulario y sus ancestros; las reglas de axe se conservan. La URL canónica está fijada por el config. | **Cerrado localmente. 61/61**, comando normal, sin retries locales. |
| R3 · lectura interrumpida | Se captura el fallo del stream, se libera el reader en `finally`, y la ruta devuelve 400 `INVALID_BODY`; exceso de bytes sigue devolviendo 413. | **Cerrado localmente. 83/83 contratos**, incluidos el fallo tras primer chunk y respuesta de la ruta. |
| R4 · proveedores en pruebas | Runners API y respaldo usan entorno limpio y guard de fetch/TCP/TLS. La prueba introduce una clave ficticia y ejecuta el hook real de artículos. | **Cerrado en el alcance del runner. 24/24 API**: el intento a `api.openai.com` fue bloqueado y el guardado sintético continuó. |

El test de caché permite varias visitas para la regeneración, pero en esta ejecución edición/404 se observaron en la primera. Esto no promete invalidación instantánea de todas las cachés de navegador/CDN en producción. No se repitió la prueba negativa con el hook antiguo: la evidencia existente fue consultada y el mecanismo defectuoso ya se había reproducido independientemente en la primera revisión.

## Gates repetidos

| Comando | Resultado |
| --- | --- |
| `npm run lint` | Pasa, sin errores ni warnings |
| `npm run test:contracts` | 83/83 |
| `npm run test:api` | 24/24 |
| `npm run test:cache` | 4/4; build real y base local desechable |
| `npm run test:e2e` | **61/61**, exit 0, 55.2 s de pruebas; build y TypeScript previos exitosos |

No se repitieron todos los gates de la auditoría original: esta ronda no cambió estilos, paleta, assets ni política de roles. Las comprobaciones fueron dirigidas a R1–R4 y la suite completa de navegador. No se redujeron reglas de accesibilidad ni se aumentaron retries para obtener estos resultados.

## Límites y pendientes que permanecen

1. **CI:** integrar `test:api` y `test:cache` con Postgres efímero en GitHub Actions. El pipeline actual todavía no los ejecuta. Validar con Node 24, versión de CI/Vercel; esta máquina usa 25.8.1.
2. **Performance:** los scripts Lighthouse ya están presentes. No ejecuté otra medición ni un comparativo con/sin animaciones; la causa del LCP móvil y su optimización siguen sin demostrarse. Un protocolo reproducible no equivale a rendimiento aceptado.
3. **Decisiones del usuario:** admin-only frente a rol de ventas; redacción/período de la cifra de comidas; excepción del acento verde; camino de migración de `zitrone.com.mx`. No se dieron por aprobadas.
4. **Aceptación externa/manual:** VoiceOver, zoom/teclado completos, owners/accesos, pruebas reales de inbox, revocación de clave histórica, respaldo/restauración de datos y medios reales, rate limit compartido, GTM/Ads/GA4, DNS y corte. Mantener los demás pendientes del tracker y registro de afirmaciones.
5. **Alcance del aislamiento:** el guard protege procesos Node de esos runners, no todo el sistema operativo. El build de caché permite descargar fuentes y el runner neutraliza credenciales conocidas. No es una certificación general de sandbox ni de cualquier herramienta futura.

Los manuales conservan resultados antiguos para trazabilidad. Para saber el estado vigente de R1–R4, usar esta revisión y la sección Ronda 2, no el antiguo texto “56/61” o “60/61”.

## Evidencia y efectos de la revisión

Logs independientes: `docs/evidence/codex-rereview-2026-10-05/`. Se revisaron los scripts de Lighthouse y la documentación añadida; no se recalcularon sus métricas.

No cambié código de producto, hice deploy, escribí en DB alojada, cambié DNS/GTM ni envié correo. API/caché usaron bases locales creadas y eliminadas por sus runners. La suite E2E estándar compiló usando la configuración local y pudo leer el CMS alojado; esa lectura se distingue de los tests aislados. No es posible certificar retrospectivamente todas las acciones de otro agente solo con Git y logs seleccionados.

La fecha de tokens que regeneró el build se restauró a su valor anterior. Los cambios entregados por Codex son documentación/evidencia. El contenedor local existente se conserva disponible.
