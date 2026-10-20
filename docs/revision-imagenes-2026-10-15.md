# Revisión preliminar de imágenes — 15-oct-2026

Rango leído: f579695..ce5b77e, worktree zitrone-images-wt, rama perf/images-loading limpia al consultar. Revisión de código y evidencia versionada; no se reprodujeron benchmarks ni se ejecutó una prueba de red lenta.

## Pendientes antes de aceptar

1. El hero cambia activeIndex por temporizador, sin comprobar carga/decodificación de la siguiente imagen. Prepararla un intervalo antes reduce competencia, pero no garantiza que esté lista bajo red lenta o error. Retener la imagen actual hasta que la siguiente esté lista y comprobar sincronización con el texto; probar caché fría, red lenta y error de imagen. La observación local de rotaciones completas no cubre estos casos.
2. El reporte versionado docs/evidence/image-audit/2026-10-15/report.md corresponde a https://www.zitrone.mx y presenta la auditoría anterior (8 FAIL), sin tabla de primera carga. Los nuevos números están declarados en el commit, pero falta incorporar evidencia reproducible de base/candidato: salidas crudas, comandos, SHA, entorno, tiempos de muestreo y comparaciones visuales. No se rechazan los números; aún no se verificaron independientemente.
3. La sugerencia de ejecutar vercel --prod no corresponde al plan de modalidad 2. Cerrar revisión, integrar con fuentes y validar un SHA único; luego Arroba despliega la versión aprobada. No publicar desde el worktree de imágenes.

## Alcance de la conclusión

El enfoque de diferir imágenes y dimensionar srcset es coherente con reducir bytes iniciales. Menos bytes de imágenes no significa igual reducción del tiempo total de carga; los valores locales no certifican producción. Las fotos de mayor resolución son una mejora editorial separada, sin inventar detalle ni modificar originales compartidos.

No se modificó código, integró ni desplegó. Esta revisión es preliminar, no aprobación completa del rango.
