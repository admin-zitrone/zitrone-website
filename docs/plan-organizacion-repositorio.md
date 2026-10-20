# Organización del repositorio para entrega

15-oct-2026. Complementa la modalidad 2. Objetivo: un receptor puede identificar, instalar, probar, desplegar, operar y recuperar la versión entregada sin depender del historial de conversaciones.

## Diagnóstico inicial (lectura local, sin fetch)

- main local ad17ec9 figura detrás de origin/main por 21 commits; design-system/type-unification figura 52 commits por delante de su upstream. Son referencias locales, no certificación del remoto actual.
- Fuentes, imágenes, analytics y artículos están repartidos en ramas/worktrees. No asumir que todos sus cambios están aceptados o deben entregarse.
- README identifica leads como admin-only, dato desactualizado frente al rol sales.
- Hay documentación activa, evidencia y auditorías históricas mezcladas en docs; existe un índice y archivos archivados, pero hace falta una ruta de lectura definitiva.
- src, tests, scripts y sistema de diseño ya están separados. Esta lectura no demuestra necesidad de reescribir arquitectura ni permite declarar todo el historial libre de secretos.

## Secuencia y responsables

### 1. Inventario y protección del trabajo (Claude)

Registrar ramas, worktrees, upstreams y cambios sin commit. Identificar dueño, propósito y estado de cada tarea. No ejecutar reset, clean, checkout de archivos ajenos, borrado de ramas ni rebase sobre trabajo activo. Acordar qué cambios de artículos pertenecen a esta entrega. Actualizar referencias remotas mediante lectura autorizada antes de tomar decisiones de integración.

### 2. Auditoría del contenido entregado (Claude; revisión Codex)

Comprobar archivos versionados y todo el historial para detectar secretos, datos personales, dumps, artefactos temporales, configuración local y binarios innecesarios. Reportar hallazgos sin imprimir valores sensibles. .gitignore no elimina material previamente versionado. Si aparecen credenciales, coordinar rotación y remediación específica; no borrar historial automáticamente. Distinguir evidencia útil, licencias y fuentes de contenido de residuos de trabajo. No borrar imágenes compartidas ni migraciones históricas.

### 3. Entrada clara al proyecto (Claude)

README orientado al receptor: propósito, arquitectura real, Node/package manager, instalación desde clon limpio, variables sin secretos, modos local/preview/producción, fuentes de contenido, roles, comandos de validación, despliegue receptor y enlaces a operación/recuperación. Corregir admin-only y equipo de hosting origen/destino. Evitar presentar pendientes como hechos completados.

Mantener docs/README.md como índice único: documentación vigente primero, decisiones después, auditorías y evidencia histórica claramente marcadas. Consolidar instrucciones contradictorias antes de mover archivos. Mantener archivos raíz exigidos por AGENTS y referencias internas. Si se reubican documentos, actualizar todos los enlaces y comprobarlos. No añadir nuevas capas arquitectónicas por estética.

### 4. Historial y flujo de cambios (Claude propone; Codex revisa)

Conservar el historial existente y las correcciones/reversiones que explican decisiones. Los commits recientes no necesitan reescribirse solo para uniformar nombres. Desde este cierre, usar commits de alcance coherente y títulos que expliquen problema/resultado; separar producto, pruebas y documentación cuando sean unidades independientes.

Preparar una rama de integración desde la base acordada; revisar diffs de cada rama antes de integrar. Para PRs futuros pequeños, squash puede ser útil si conserva contexto; no aplicar un squash masivo a toda la historia ni crear un repositorio sin historia para ocultar el desarrollo. Un resumen de release explica el resultado sin obligar al receptor a leer cientos de commits.

Preparar plantilla breve de PR (problema, cambio, validación, migración/rollback si aplica). Definir revisores y propietarios reales antes de crear CODEOWNERS. Proponer protección de main con CI requerido y revisión; activación remota según permisos y acuerdo receptor, no declararla activa por crear un archivo.

### 5. Release reproducible (Claude; revisión Codex)

Cerrar los cambios activos aceptados y validar la combinación desde un clon/checkout limpio: lockfile, Node 24, build, checks, API/cache aisladas y navegador según plan rector. Evitar builds simultáneos que compartan .next. No regenerar baselines visuales para esconder diferencias.

Preparar PR hacia main, CI y revisión; publicar/merge según autorización. El SHA final, tag y notas de release deben enlazar a evidencia, migraciones, limitaciones y rollback. Mantener identificadores históricos referidos por auditorías. El historial que tenga otra rama no equivale a que main contenga la entrega.

### 6. Paquete receptor y cierre

Arroba recibe acceso al repositorio aprobado y release, docs vigentes, ejemplo de configuración sin claves, licencias, inventario de servicios, recuperación y pendientes con dueño. Verificar clonación/build por el receptor. Retirar ramas solo después de confirmar integración y conservar referencias necesarias. No entregar .env, node_modules, .next ni dumps dentro de un ZIP de código.

## Criterios de aceptación

- main identifica la versión aprobada; cambios pertinentes integrados y árbol limpio.
- Receptor reproduce instalación, checks y build sin archivos privados del desarrollador.
- README y manuales reflejan roles, servicios y modalidad de hosting reales.
- Secretos/PII revisados en contenido e historial; licencias incluidas; hallazgos resueltos o explícitos.
- CI y protección de ramas comprobados en el remoto, no solo documentados.
- Tag, notas de release, evidencia, operación y rollback disponibles.
- No refactorizaciones de producto mezcladas con limpieza documental sin necesidad y pruebas.

## Instrucción para Claude

Termina primero tu tarea activa. Después sigue este plan: presenta inventario y propuesta concreta de limpieza; ejecuta mejoras locales reversibles dentro de tu alcance sin tocar cambios ajenos. Entrega diffs delimitados para revisión de Codex. No reescribas historia compartida, elimines ramas, hagas force-push, publiques ni cambies recursos externos por esta instrucción.
