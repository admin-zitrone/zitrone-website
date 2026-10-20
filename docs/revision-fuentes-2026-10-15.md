# Revisión preliminar de fuentes — 146b966

15-oct-2026. Inspección independiente del diff y archivos versionados; no se repitieron build, checksums contra base ni pruebas de navegador.

El código elimina las importaciones ejecutables de next/font/google en los dos layouts y utiliza CSS local, seis WOFF2 y tres precargas. No se identificó un defecto funcional en esta inspección. Las menciones restantes a Google incluyen comentarios y permisos CSP, no solicitudes de fuentes por sí mismas.

Pendientes de cierre:

- Incorporar procedencia, avisos de autoría y archivos de licencia correspondientes a las fuentes distribuidas. No se encontraron archivos de licencia de fuentes en el árbol consultado.
- Versionar un informe reproducible y evidencia seleccionada: base/candidato, hashes comparados, comandos/entorno, resumen visual y prueba de build sin descarga de fuentes. El mensaje y descripción del commit reportan resultados, pero no reemplazan evidencia reproducible.
- Investigar por separado el fallo de reapertura de preferencias de cookies. Que ocurra con ambas versiones no exonera la versión de entrega ni demuestra qué commit lo originó. Identificar el elemento que intercepta el clic y si es un defecto real o sincronización de la prueba. No ocultarlo con force, sleeps arbitrarios o eliminación del test. Validar la interacción real y la suite sobre el SHA integrado.

Estado: implementación de fuentes realizada; verificación independiente final pendiente. El 60/61 reportado no permite cerrar la suite completa. La limpieza de CSP es secundaria y debe conservar permisos de otras integraciones. No se modificó implementación ni se desplegó.
