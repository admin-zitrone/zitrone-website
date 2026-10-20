# Revisión de a18cd87 — R7–R9

18-oct-2026. Inspección del diff, ensayo guardado y guías; consulta actual de checks del PR #5. No se ejecutó el ensayo ni se accedió a la base alojada.

## Estado

- R8: corrección de configuración aceptada. CI ejecuta test:cache:home después de blog y dispone de 35 minutos. Checks del último SHA aún pending al consultar; Vercel preview fail. No certificar como verde a18cd87 basándose en e04c6d1.
- R9: texto corregido; equivalencia visual pendiente de QA.
- R7: expand conserva columnas anteriores y el ensayo prueba lectura antes de nuevas escrituras. Aceptado ese avance, pero recuperación posterior al seed sigue bloqueada por R10.

## R10 — P1: down incompatible con los iconos que introduce el seed indicado

src/migrations/20261016_042603_home_cms_parity.ts:348–355 reconstruye los enums de iconos (tabla publicada y versiones) con solo heart/spark/trend/clock/briefcase/people/shield/chart/chat/calendar y castea directamente el contenido existente. El seed nuevo copia feature.icon del contenido, que incluye utensils, chef, coffee, leaf, fruit, machine, water y cart. Por tanto, tras el paso 3 de cms-home-rollout.md, un down con esos registros falla al convertirlos al enum antiguo. El ensayo solo siembra con el código viejo y guarda header/footer con el nuevo; no reproduce el estado posterior al seed que la guía manda ejecutar.

Corregir la recuperación con una estrategia explícita para los valores nuevos, incluyendo versiones/borradores, o sustituir ese down por un procedimiento de recuperación compatible y ensayado. Probar secuencia anterior → migrate → seed nuevo → cambios ES/EN → recuperación → avance, verificando datos además de enlaces. No aplicar ninguna corrección a la base alojada durante la revisión. Un respaldo previo al seed tampoco conserva ediciones posteriores: definir ventana sin escrituras y captura de cambios antes de recuperar.

## R11 — P1: instrucciones de publicación y recuperación contradictorias

README.md describe merge a main como publicación automática, pero el paso 3 todavía manda vercel --prod. cms-home-rollout.md asigna despliegue a Arroba, mientras el merge actual publica en el equipo origen. La elección entre actualizar origen y hacer solo recepción en destino debe quedar explícita antes de fusionar. Si la intención es solo entregar al receptor, preparar main requiere primero separar esa operación del autodespliegue origen mediante un cambio coordinado/autorizado. No asumir que la autorización de entregar el repo autoriza publicar el sitio actual.

Unificar un único procedimiento: QA en entorno aislado, aprobación de destino/ventana, respaldo y estado real de migraciones, migración/seed si fueron aceptados, publicación mediante el mecanismo elegido y recuperación compatible. No ejecutar vercel --prod adicional al merge. El rollback por HOME_CONTENT_SOURCE=static tampoco desactiva todas las consultas de site-settings (blog continúa leyendo CMS): matizar la afirmación de que toda navegación/pie vuelve al código.

## Preview

El fallo actual no es aislamiento. Según configuración reportada, Preview contiene DATABASE_URL productiva; no añadir PAYLOAD_SECRET para hacerlo pasar. Preparar base independiente o retirar la conexión productiva del entorno Preview con autorización, y revisar tokens Blob/Resend/OpenAI y otros efectos antes de habilitar QA. No cambié Vercel ni comprobé sus secretos.

## Siguiente paso

Mantener PR borrador y sin merge. Claude corrige R10/R11 y aporta evidencia del caso posterior al seed. Cerrar CI del SHA final y QA antes de decidir corte. No reenviar nuevas instrucciones a servicios externos ni realizar migraciones por este informe.
