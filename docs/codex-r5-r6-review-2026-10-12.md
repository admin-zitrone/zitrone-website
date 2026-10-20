# Codex — revisión de R5 y R6

12 de octubre de 2026. Commits: `60228aa` (R5) y `52419f5` (R6). HEAD al iniciar y al verificar: `52419f5`; árbol limpio antes de esta revisión.

**R5 y R6 aceptados en el alcance revisado. No se encontraron nuevos hallazgos que requieran cambios en estos dos commits. Esto no constituye aceptación del lanzamiento.**

## R5: validación y aislamiento del runner

Se revisaron el validador, el helper, ambos runners, el registro de conexiones de los tests y su incorporación a CI. La asignación `PG_ASSIGNMENTS=$(node …) || … exit 1` propaga el rechazo antes de definir o ejecutar operaciones administrativas. Queries y fragmentos se rechazan. La conexión administrativa utiliza campos normalizados, no la URL original; localhost se convierte en 127.0.0.1. El proceso administrativo tiene entorno vacío y carga el guard de red. Las credenciales de los runners se codifican antes de construir DATABASE_URL.

Verificación independiente en Node v25.8.1:

- `npm run test:scripts`: **12/12**. Nueve entradas inválidas se rechazan sin conexiones ni llamadas a Docker; destino local normalizado, modo Docker válido y contenedor ausente comprobados.
- `npm run test:api` con TEST_PG_URL al contenedor local: **30/30**. Ejercita creación/migración, API, guard de red y limpieza de la base desechable a través del helper corregido.
- ESLint de los archivos JS/TS cambiados, incluyendo el validador con `--no-ignore`: sin errores ni advertencias. `node --check` y `zsh -n` de los scripts modificados pasan.

Los logs de esta ejecución están en [evidence/codex-r5-r6-review-2026-10-12](evidence/codex-r5-r6-review-2026-10-12/). La primera invocación de test:scripts dentro del sandbox no pudo abrir el IPC de tsx; la ejecución autorizada fuera del sandbox es la que pasó y se conserva.

Se inspeccionó la evidencia de Claude de API en ambos modos y caché 4/4 en ambos modos. No se volvió a ejecutar la suite de caché ni E2E en esta revisión enfocada: los cambios de conexión se comprobaron mediante las regresiones y la integración API; no hay cambios de producto o de caché en estos commits. No se afirma una ejecución independiente de GitHub Actions o Node24.

## R6: conclusiones y límites del estudio

El nuevo texto conserva los resultados observados en las dos rutas, distingue FCP/LCP, deja el CSS como candidato sin demostrar y retira el ahorro gzip estimado. Corrige la afirmación sobre fuentes y declara que las variantes DevTools/sin JS/sin fuentes/sin preload carecen de comandos y datos completos para reproducirlas. Se cotejó el texto con los resúmenes conservados y el diff, sin nuevas corridas de Lighthouse.

Esto cierra el hallazgo documental R6. **No demuestra todavía la causa del retraso previo a FCP ni representa una optimización de performance.** La investigación adicional se mantiene pendiente como trabajo separado.

## Límites y siguiente paso

- La ejecución real de CI, el fallo intermitente de fuentes de Turbopack ya documentado y las comprobaciones manuales/operativas de entrega permanecen pendientes.
- Los cambios posteriores de marca a lime-500 no se reevalúan aquí; aprobar R5/R6 no elimina la excepción de contraste documentada.
- No se desplegó, empujó código, escribió en la base alojada ni modificó DNS/GTM/correo. La integración utilizó exclusivamente PostgreSQL local desechable.
- No se modificó código de aplicación ni de pruebas. Se actualizaron únicamente el informe, evidencia y seguimiento de entrega. No hace falta otra corrección de R5/R6 antes de avanzar a los pendientes de entrega.
