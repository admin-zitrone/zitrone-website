# Revisión del runner QA — 37cb394

Inspección de plan, run.sh, extracción, políticas de red, catálogo, espejo, comparación y exportación de evidencia. No se inició el runner ni se usaron credenciales de producción.

## R12 — P1: extract puede continuar después de un catálogo rechazado

validate-catalog.mjs escribe data-tables.txt y remap.json antes de salir con código 1 por stops. run.sh extract solo exige que data-tables.txt exista y tenga contenido. Los pasos son comandos separados: tras un rechazo (tabla/columna/FK desconocida), el siguiente comando extract sigue habilitado. Así el control que el plan describe como obligatorio no protege la extracción.

Corrección: invalidar cualquier aprobación previa antes de catalog, generar archivos provisionales y publicar manifiesto validado únicamente cuando stops está vacío. extract debe exigir éxito ligado al run, SHA, fuente y hash del catálogo/inventario; no basta archivo no vacío. Prueba negativa: catálogo inválido deja extract rechazado antes de invocar prod-read/dump; un fallo al repetir catalog también invalida el éxito anterior. Se puede probar con fuente falsa, sin credenciales alojadas.

## R13 — P1: varios criterios obligatorios no fallan el paso

En run.sh states, parity y coverage terminan con `|| true`; una home distinta tras roll-forward solo imprime DIFFERS. compare-states solo fuerza igualdad de los enlaces anteriores a seed y no convierte el fallo de home/paridad en error. En integrations no se exige HTTP 201, ni exactamente un lead, ni se falla ante presencia GTM o ausencia de hooks: esos valores solo se imprimen. sweep también imprime diferencias de movimiento sin resolverlas. El resultado puede continuar a evidence y cleanup sin cumplir los criterios del plan.

Corrección: los criterios automáticos obligatorios deben producir código no cero y registrar su estado. Para diferencias visuales/editoriales que requieren decisión, registrar pendiente explícito e impedir conclusión aprobada hasta clasificación. Evidence debe poder guardarse incluso tras fallo, con estado FALLIDO/INCOMPLETO; no bloquear conservación de diagnóstico. Añadir pruebas negativas con respuestas 500, cero/dos leads, GTM presente, paridad/cobertura no cero y home distinta tras recuperación.

## R14 — P1: capturas crudas de CMS terminan en evidencia versionable

states escribe `4-capture-*-code.json` mediante probe export dentro de evidence/states; ese export incluye documentos completos header/footer/home, y también se guardan home y enlaces completos. evidence copia recursivamente todo ese directorio al destino propuesto dentro de docs/evidence. El contenido CMS copiado incluye versiones/campos libres; escanear correos/teléfonos no acredita que todo sea público ni que carezca de material interno. Esto contradice separar copia privada de evidencia compartible.

Corrección: exportaciones completas, dumps y comparaciones de datos crudos en private, permisos restrictivos y limpieza de sesión. Exportar al repo solo una lista positiva de informes saneados, conteos, hashes y diferencias públicas revisadas. Evitar copia recursiva indiscriminada. Prueba con un marcador sintético confidencial sin email/teléfono en la captura: no debe aparecer en el paquete de evidencia. Revisar logs antes de exportarlos.

## Observaciones menores

- mirror-media registra missing sin `file`, pero los consumidores mirror de egress-guard/browser-policy tratan cualquier entrada existente como archivo válido. Manejar missing como HTTP 404 controlado o detener antes del build con informe, para no ocultar el origen de una imagen rota con TypeError.
- El ensayo descrito se inició en 20f5f07 y tiene correcciones posteriores: repetir los casos relevantes sobre el SHA corregido final.
- No afirmar anonimización completa: el inventario y escaneo reducen exposición, pero nombres y material interno pueden existir en contenido libre. La copia local debe tratarse como privada durante toda la sesión.

## Verificación independiente

- `node --import tsx --test tests/scripts/qa-release.test.ts`: 24/24, Node 25.8.1. Primer intento no pudo abrir loopback por sandbox; repetición autorizada pasa. No equivale a validar Node 24 ni ejecutar todo el QA.
- `zsh -n scripts/qa-release/run.sh`: pasa.
- No extracción, Docker de QA, restore, lecturas de producción, push, merge o publicación.

Conclusión: enfoque aceptable, autorización completa pendiente de R12–R14. Correcciones acotadas al runner/evidencia, sin ampliar el producto ni crear servicios. Después repetir ensayo local y revisar el SHA antes de preparar autorización agrupada.
