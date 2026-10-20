# Ensayo de migración y vuelta atrás: home, navegación y pie (2026-10-18)

Responde a R7 (revisión de Codex del 17-oct) y R10 (revisión del 18-oct). Base local desechable (`home_migration_api_test` en el contenedor Docker `zitrone-staging-pg`), entorno vacío, red solo loopback, sin token de Blob. Ninguna base alojada, Vercel ni push. Node v25.8.1 (CI usa 24; este ensayo no corre en CI porque necesita el historial para el código anterior).

Comando: `OLD_REF=255eec2 OUT=<dir> zsh scripts/rehearse-home-migration.sh` (código viejo = `255eec2`, que tiene el mismo código de CMS y las mismas migraciones que producción, `4563464`; código nuevo = `release/2026-10` con la migración en modo *expand*). Con los pasos 9–12 (R10) se ejecutó dos veces seguidas con el mismo resultado; estos archivos son de la segunda. Las subidas del código nuevo van a un `PAYLOAD_MEDIA_DIR` temporal.

## Cambio que se ensaya

`20261016_042603_home_cms_parity` ya no borra las 21 columnas compartidas de enlaces de `header`/`footer`: copia cada ruta a las filas por idioma y **conserva** las columnas viejas. Borrarlas queda para una migración posterior escrita a mano, después de aceptar la entrega. El `down` usa `ADD COLUMN IF NOT EXISTS` y vuelve a copiar las rutas desde las filas por idioma (el español primero). Antes de volver al enum anterior, convierte en `spark` los iconos que ese enum no admite (`coffee`, `chef`, `utensils`…), que es lo mismo que el código anterior muestra cuando falta el icono (R10).

## Resultados

"Enlaces mostrados" = enlaces con texto en ese idioma, que son los únicos que el sitio pinta (los loaders descartan los que no tienen texto). Se comparan ruta y texto, ES y EN.

| Paso | Archivo | Resultado |
| --- | --- | --- |
| 1. Código viejo: migrate + seed | `1-old-schema.json` | ES 3 mostrados (+23 rutas sin texto), EN 26 |
| 2. Código nuevo sobre esquema viejo | `2-new-code-old-schema.log` | **Falla la consulta** (esperado): hay que migrar antes de desplegar |
| 3. Código nuevo: migrate | — | OK |
| 4. Código viejo sobre esquema migrado, sin ediciones | `4-old-code-migrated.json` | Igual al paso 1: la vuelta atrás solo de código funciona |
| 5. Código nuevo lee y guarda header/pie (EN) | `5-new-code.json`, `5-new-code-write.log` | Igual al paso 1; guardado OK |
| 6. Código viejo después de ese guardado | `6-old-code-after-edit.json` | **Distinto** (esperado): EN pasa de 26 a 3 enlaces. Tras editar con el código nuevo, las columnas viejas quedan desactualizadas |
| 7. Código nuevo: migrate:down; código viejo lee y guarda | `7-old-code-after-down.json`, `7-old-code-write.log` | Igual al paso 1; guardado OK |
| 8. Código nuevo: migrate otra vez y lee | `8-new-code.json` | Igual al paso 1 |
| 9. Código nuevo: `seed:home` (paso 3 de la guía) | `9-after-seed.json`, `9-home.json` | Línea base B: 26 enlaces mostrados en ES y en EN; la home tiene 26 iconos que el enum anterior no admite |
| 10. Código nuevo: edita ES y EN; exporta | `10-edited.json`, `10-export.json` | Ediciones visibles en ambos idiomas; la exportación las captura |
| 11. Código nuevo: `migrate:down` con seed y ediciones; código viejo lee home y header/pie, guarda | `11-migrate-down.log`, `11-old-code.json`, `11-old-home.json` | **El `down` funciona** (R10). Se conservan las ediciones y los enlaces ES; 8 enlaces EN de servicios pasan a la ruta ES, que `next.config` redirige (307) a la EN; los 26 iconos nuevos quedan en `spark` |
| 12. Código nuevo: migrate + `seed:home` | `12-new-code.json`, `12-home.json` | Enlaces y contenido de la home iguales a la línea base B. Las ediciones del paso 10 solo sobreviven en `10-export.json` |

## Límites

- **Las 23 rutas en español sin texto** no se copian: no existe fila en español donde guardarlas. El código viejo tampoco las mostraba, porque el español es el idioma por defecto y no tiene respaldo. Si un editor añade después el texto en español, tendrá que escribir también la ruta. Viene del seed viejo, que dejaba vacío el español (corregido en el seed nuevo). El estado de la base alojada no se ha consultado.
- **Guardados solo en inglés.** Con los datos del seed viejo, guardar en español falla la validación con cualquiera de los dos códigos (textos obligatorios vacíos).
- **Un enlace, una ruta.** El esquema anterior guarda una sola ruta para ambos idiomas, así que después del `down` el inglés usa la ruta en español en 8 enlaces de servicios. Comprobado en producción el 18-oct que esas rutas redirigen (307) a su equivalente en inglés.
- **Avanzar de nuevo después de un `down` reescribe la home, el header y el pie con el seed.** Las ediciones hechas en el CMS se recuperan solo desde la exportación previa, a mano. Por eso la guía exige una ventana sin escrituras y una exportación antes de recuperar.
- **No se cubre** editar header/pie con el código viejo sobre la base migrada y luego volver al código nuevo sin repetir `migrate:down` + `migrate`. El procedimiento lo excluye (ver [cms-home-rollout.md](../../cms-home-rollout.md#vuelta-atrás)).
- Datos de un seed, no de producción. La migración real va precedida de respaldo y de una consulta de solo lectura.
