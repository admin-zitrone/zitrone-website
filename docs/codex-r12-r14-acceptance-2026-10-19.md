# Revisión R12–R14 — aceptadas para preparar QA

19-oct-2026. Código revisado: 187e6cd..4c342db; documentación 7e52a0b. Alcance: correcciones del runner, no aprobación de publicación.

- R12 cerrado: catalog invalida aprobación anterior; aprobación vinculada a ejecución, SHA, fuente y hashes. extract/restore verifican el gate y dump contrasta la fuente. Pruebas negativas ejercitan rechazo, alteración y repetición fallida.
- R13 cerrado en el alcance solicitado: evaluadores explícitos de paridad, cobertura, recuperación, HTTP/lead, hooks, GTM y barrido. FAIL detiene; criterios ausentes o pendientes no producen veredicto favorable. Se puede conservar evidencia de fallos.
- R14 cerrado: exportación por lista positiva de informes, sin copia recursiva de capturas CMS, screenshots o logs. Prueba de marcador privado verifica exclusión del paquete.

Verificación independiente:
- node --import tsx --test tests/scripts/qa-release.test.ts tests/scripts/qa-release-gates.test.ts: 31/31, Node 25.8.1, con permiso de sockets locales. Son las pruebas específicas, no el total test:scripts de 43 declarado por Claude.
- zsh -n scripts/qa-release/run.sh y git diff --check 37cb394..7e52a0b: pasan.
- Inspección del plan y rutas de extracción/restauración/exportación/limpieza. No repetí el ensayo completo Docker ni certifiqué los resultados Node 24 reportados por Claude.

Sin nuevo bloqueo identificado para preparar la autorización agrupada del plan revisión 3. La ejecución con datos/sitio publicados sigue pendiente de autorización del usuario; esta revisión no la concede.

Condiciones operativas:
1. Registrar SHA final y deployment de referencia; CI del SHA final antes del merge (el último estado de CI no se consultó en esta revisión).
2. Ejecutar solo lecturas y recursos locales enumerados; no migrar ni sembrar la base alojada, no publicar ni enviar correo real.
3. Clasificar diferencias de seed y capturas privadas antes de cleanup. Si el usuario debe decidir, mantener la sesión privada pendiente o detenerla conservando el material necesario bajo retención acordada. No borrar las capturas y después pedir aceptación visual sin evidencia.
4. Un resultado INCOMPLETO es correcto para el ensayo sin producción y no acredita que el sitio final haya pasado QA. El QA real puede encontrar incidencias de contenido o configuración y debe reportarlas.

No se usaron credenciales de producción ni se ejecutaron lecturas del sitio publicado, push, merge, despliegue o migraciones.


## Ampliación: pausa de 88b2de6

Revisado el diff de cleanup/evidence/criteria y su prueba. Pruebas de qa-release-gates.test.ts: 8/8 independientes, Node 25.8.1. No se repitió el ensayo Docker ni se leyó producción. Sin nuevo bloqueo identificado en este cambio para solicitar autorización del plan 3.1 sobre 88b2de6e7b38fdeb91e5b9ea56fb367e0129fb41.

La pausa conserva capturas mientras falte classification.md, algún criterio PENDING no figure o la clasificación no se haya reexportado. El control verifica presencia de referencias y fecha, no aprobación humana: el operador debe registrar la decisión real del usuario antes de limpiar, sin usar QA_DISCARD para eludir esa pausa. La clasificación no transforma automáticamente un ensayo incompleto en QA aprobado.

El texto de autorización propuesto delimita lecturas y recursos locales y excluye escritura alojada/publicación. Aún corresponde al usuario autorizarlo. Costos reales no verificados; CI del SHA final pendiente antes del merge.
