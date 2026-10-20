# Revisión de release/2026-10 — 6f5aa1f

Revisión independiente del diff integrado respecto de 255eec2, con foco en migraciones, fallback, conflictos de artículo, medición y CI. No es una repetición completa de las pruebas declaradas por Claude.

## R7 — P1, corte/rollback incompatible con asumir migración aditiva

`src/migrations/20261016_042603_home_cms_parity.ts:311–338` copia los enlaces existentes a tablas localizadas y elimina las columnas originales. Por tanto, migrar primero deja al código previo consultando columnas que ya no existen; restaurar únicamente el deployment anterior tampoco restaura compatibilidad. El catch de getResolvedSiteSettings devuelve fallback estático ante error, pero no arregla las lecturas/escrituras del admin ni garantiza conservar contenido personalizado. Esto debe resolverse antes de aprobar el despliegue, no confundirse con la autorización de borrar billing.

Solicitado: definir y probar la transición con una base desechable poblada en el esquema anterior. Preferir expand/contract (conservar columnas viejas durante la transición) o documentar una ventana explícita sin edición CMS y una recuperación de código/datos ensayada. Cubrir viejo código/base nueva y nuevo código/base vieja según la estrategia elegida, así como contenidos ES/EN y preservación de enlaces. No aplicar seed general para reparar contenidos. El rollback down de billing crea estructuras vacías: los datos se recuperan del respaldo, no del down.

## R8 — P2, nueva prueba de caché home ausente de CI

`.github/workflows/ci.yml`, job isolated-api, termina ejecutando test:cache (blog). No ejecuta test:cache:home, aunque la release introduce loader/schema/revalidación de home y presenta 5/5 como validación. Añadir esa prueba secuencialmente con el Postgres desechable existente, revisar timeout del job y obtener resultado Node 24 para el SHA final. El script de blog solo ejecuta blog-cache.test.ts; no incluye implícitamente home.

## R9 — P2, equivalencia visual con producción no acreditada

`docs/inventario-repositorio-2026-10-15.md`, sección de producción: afirmar que no hay cambio visible salvo el artículo excede la evidencia. La producción identificada es gitDirty, el contenido header/footer puede proceder del CMS incluso en páginas donde la home está static, y no se ha comparado esa configuración migrada. Calificar como expectativa pendiente de QA contra el deployment aprobado. Guardar diferencias aceptadas ES/EN y escritorio/móvil; no reconstruir el código sucio a partir del SHA ni regenerar baselines sin inspección.

## Respuestas a los focos pedidos

- Base sin migrar: getResolvedSiteSettings captura errores y devuelve fallback del código. getResolvedHomeContent retorna inmediatamente su base si HOME_CONTENT_SOURCE=static; otros consumidores (blog) sí consultan site settings. No certificar comportamiento completo de CMS ni ausencia de cambios visuales solo por ese catch.
- Billing: eliminación final confirmada; no reabrir funcionalidad. Migración borra solo tablas/enums billing indicados. Antes de ejecución autorizada: comprobar estado real, respaldo restaurable y referencias/dependencias; no se accedió a la base alojada aquí.
- Artículo: texto español vigente conservado en el diff; CTA del loader usa mapCta(doc.cta) con fallback y ya no está sobrescrito. No se identificó un nuevo defecto en esos puntos durante esta lectura; QA visual completa no repetida.
- Imágenes: código integrado incorpora espera por carga/decodificación y detección de fallos; la evidencia base/candidato está incluida. No se reprodujeron el benchmark ni las 13 pruebas de rotación en esta revisión.
- Medición: aislamiento por VERCEL_ENV y hostname presente; recepción/configuración de Google sigue pendiente de administrador.

## Verificación ejecutada y límites

- Contratos: 94/94, Node 25.8.1. Primer intento bloqueado por socket de tsx en sandbox; repetición autorizada pasa.
- Diff check: reporta espacios de indentación y whitespace en la migración generada; limpieza menor pendiente, no defecto de SQL demostrado.
- No repetidos: E2E/API/cache/visual/build, Node 24 remoto, compatibilidad de migración con datos previos. No consulta nueva de producción ni secretos alojados.

Puede prepararse/abrirse un PR de revisión para obtener CI si el usuario autoriza; estos hallazgos impiden considerar la release lista para merge/entrega. No hubo merge, push, despliegue ni migración. Solicitar correcciones delimitadas y evidencia, conservando historia.
