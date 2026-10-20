# Revisión de los comandos de respaldo y migración — 19 octubre 2026

Revisión estática de `paso1-3-respaldo.sh`, `paso4-migrar.sh` y `pgprod.mjs` en el scratchpad de Claude. Checkout observado: `6a45920`, limpio. El usuario reporta A en ejecución; no ejecuté los scripts ni consulté producción ni los registros privados. No certifica el resultado del respaldo.

Antes de ejecutar B:

1. **Comparar contenido, no solo legibilidad (B, líneas 37–49).** B escribe los enlaces leídos con la versión anterior y una captura nueva, pero no los compara con el estado anterior. El probe termina con éxito si puede leer; eso no demuestra que conserve enlaces, etiquetas y contenido. Guardar una referencia anterior equivalente y comparar después con el mismo lector; validar por separado las transformaciones esperadas del esquema nuevo. Detener y reportar diferencias inesperadas antes de autorizar el merge.
2. **Verificar que A terminó satisfactoriamente (B, líneas 16–17).** Existencia de archivos y checksum del dump no acreditan la comparación exitosa de la restauración: `conteos-restaurado.tsv` se escribe antes de esa comparación. Revalidar los conteos antes/después/restaurados y exigir un registro de finalización de A ligado al dump y la fuente, sin credenciales. No pasar a B solo porque existen los archivos.
3. **Precisar las garantías.** `255eec2` es la referencia de CMS compatible del ensayo, no el SHA exacto del deployment aprobado (`4563464` + cambios sin commit según el inventario). Conteos iguales no demuestran ausencia de modificaciones de contenido durante el respaldo. `pgprod.mjs` sí fuerza transacciones de solo lectura; las invocaciones directas de Payload no muestran ese refuerzo. No se ha observado ninguna escritura: esto limita lo que los scripts pueden certificar. Usar protección de solo lectura verificada para las sondas y estado, separada del proceso autorizado de migración.

El respaldo completo con restauración local es una medida correcta. No se solicita repetir A automáticamente ni interrumpirlo. Revisar su resultado y corregir/verificar B antes de migrar. No se modificó ningún script, base, configuración externa ni despliegue.

## Revisión de B corregido — 19 octubre

Leídos B, `compare-counts.mjs`, `same-links.mjs`, `ro-check.mjs`, las migraciones y la implementación local de Payload/Drizzle. `zsh -n` pasa. Sin ejecución de B ni acceso a producción o al respaldo privado; el éxito de A es reportado por Claude, no verificado independientemente aquí.

Las correcciones sustanciales solicitadas están presentes: B exige LISTO asociado a la carpeta, checksum y tres conteos coincidentes; compara las capturas antes/después con el mismo lector y enlaces/etiqueta CTA con ambos lectores; transmite PGOPTIONS a las sondas y comprueba el modo en una conexión node-postgres. La comprobación usa una conexión representativa, no instrumenta cada conexión posterior. No encuentro un nuevo bloqueo de implementación en ese alcance.

Precisiones para el mensaje operativo antes de ejecutar:
- `compare-counts.mjs` verifica cantidades, no contenido de todas las filas. No afirmar identidad de las 178 tablas: igualdad de contenido se comprueba para los globals capturados y enlaces. Cambios de contenido de otras tablas con el mismo número de filas no se detectan.
- Un error **durante** el paso 3 puede dejar migraciones parcialmente aplicadas. El Drizzle instalado confirma cada archivo de migración por separado (`dist/migrate.js`, bucle y `commitTransaction`). Desde que comienza ese paso, detenerse ante cualquier error, consultar qué migraciones quedaron aplicadas y decidir recuperación según ese estado. No asumir ni cero cambios ni las tres completas; no repetir B ni ejecutar rollback automáticamente.

La revisión no autoriza migración, merge o publicación ni certifica que B ya haya corrido. No repetí A. Los scripts siguen fuera del repositorio y no fueron modificados por Codex.
