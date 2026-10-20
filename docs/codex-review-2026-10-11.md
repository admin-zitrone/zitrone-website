# Revisión de Codex — seguimiento y decisiones

Iniciada: 2026-10-11. Cierre: 2026-10-12. Rango solicitado: `734b83c..f9f4923`.

**Cambios solicitados.** El nuevo runner necesita corregir su validación del destino de PostgreSQL antes de aceptar el aislamiento. El informe de performance debe distinguir medición de hipótesis. Esta revisión no autoriza despliegue.

## R5 · P1 — La protección de TEST_PG_URL permite operaciones fuera de localhost

Ubicación: `scripts/lib/test-db.sh:14–24`, usado por `test:api` y `test:cache`.

Dos reproducciones independientes, sin conexiones de red ni SQL:

1. Con `TEST_PG_URL=postgres://fake:fake@example.invalid/postgres`, el validador imprime `TEST_PG_URL must be local` y sale con código 1, pero `eval "$(node …)"` evalúa la salida vacía y devuelve 0. Incluso con `set -euo pipefail`, el script continúa y define `psql_admin`. Los runners llaman a `psql_admin "DROP DATABASE … WITH (FORCE)"` y `CREATE DATABASE` antes de utilizar las variables PG_USER/PG_PASS/PG_PORT. Ese cliente recibe la URL remota original y todavía no tiene el guard de red. Una URL real con permisos suficientes permite borrar/crear la base de pruebas en el servidor remoto, aunque después el runner falle por variables indefinidas. No implica que se borre la base principal: los nombres afectados son los nombres fijos de prueba, pero sí viola la garantía de no escribir fuera de localhost.
2. `postgres://fake:fake@127.0.0.1:5432/postgres?host=example.invalid` supera la validación del hostname de `URL`; el parser real de `pg` resuelve el host como `example.invalid`. Pasar la URL original al cliente permite que sus parámetros cambien el destino validado.

Evidencia reproducible: `docs/evidence/codex-review-2026-10-11/repro-db-validation.sh` y `.log`. Solo se carga el helper y se inspecciona `pg/lib/connection-parameters`; no se conecta a ese host.

**Para Claude:** separar la ejecución del validador de `eval` y abortar explícitamente si falla, antes de definir/usar cualquier operación administrativa. Crear una configuración normalizada y limitada a loopback para `pg`, sin reutilizar parámetros originales capaces de cambiar el destino; rechazar esquemas/opciones no admitidos. Aplicar también el guard de red a las operaciones administrativas. Agregar regresiones que verifiquen salida no cero y cero intentos de conexión/SQL para hostname remoto, URL malformada y override `?host=…`; mantener el caso local válido y los dos modos Docker/URL. No probar los rechazos contra una base remota real.

## R6 · P2 — El informe presenta una hipótesis de CSS como causalidad demostrada

Ubicación: `docs/performance-mobile-2026-10-07.md:19–31`.

Los resúmenes respaldan que reducir movimiento apenas cambia el LCP en las dos rutas ensayadas: con DevTools, contacto ≈3165/3164 ms y home ≈3461/3462 ms. Eso es evidencia útil y acotada. No contiene una intervención sobre el CSS ni una traza conservada que cuantifique que CSS explica la mayor parte de los ~2.6 s previos a FCP. Que LCP coincida con FCP no identifica por sí solo la causa de la demora anterior a la primera pintura. El porcentaje de CSS sin usar tampoco equivale directamente a bytes gzip ahorrables mediante división por ruta.

Además, la afirmación «fuentes no mueven la primera pintura» no concuerda con los resúmenes del experimento simulado: contacto normal FCP ≈1352 ms, sin fuentes ≈3156 ms. Quitar un preload de la serif es una intervención diferente de bloquear fuentes. No deben agruparse como si descartaran todas las contribuciones de fuentes al tiempo de pintura.

Los scripts versionados reproducen el comparativo normal/reduced en modo simulado, pero no las variantes DevTools, no-JS, no-fonts ni la modificación sin preload. Los JSON conservados son resúmenes sin configuración, identificación del elemento LCP, waterfall ni cobertura CSS. No se puede reconstruir de ellos todo el diagnóstico publicado.

**Para Claude:** conservar los resultados de movimiento, limitar las conclusiones a las rutas/condiciones medidas y presentar CSS como candidato a investigar. Retirar la causalidad exclusiva y el ahorro gzip preciso si no se aporta una prueba que los sustente. Si se mantiene el diagnóstico definitivo, guardar comandos/configuración y evidencia de un comparativo que intervenga sobre CSS conservando contenido/estilo visual, además de trazas y medidas de bytes comprimidos. No hace falta ejecutar una refactorización de CSS para corregir este informe.

## Alcance y cambios simultáneos

La inspección de diffs está fijada a `f9f4923`. Durante el trabajo, otro proceso avanzó HEAD a `a550ac5` y `d266ed8`, revirtió el acento lime-600 y reintrodujo la excepción de contraste; también aparecieron cambios sin commit en tokens y componentes. Se conservaron intactos. No forman parte de esta revisión. Al retomarla el 12 de octubre, HEAD era `d3463a8`; el registro de progreso indica que la reversión del verde respondió a una nueva decisión del usuario. No se revierte esa decisión ni se extiende la aprobación a esos commits.

La primera ejecución sobre el directorio compartido dio API 30/30 y E2E 61/61, pero **no sirve para certificar el acento de f9f4923**, porque la reversión ocurrió durante la revisión. Se retira esa atribución del comentario inicial. Una ejecución de caché en ese directorio falló durante el build de fuentes de Turbopack; no se atribuye a este rango sin reproducirlo de forma aislada.

Para verificar el commit solicitado se extrajo `git archive f9f4923` en `/tmp/zitrone-review-f9f4923-20261011`, con una copia independiente de node_modules y sin archivos .env del proyecto. Se usa Node v25.8.1 de esta máquina; los logs de Claude sobre Node 24 no son una ejecución independiente de Codex. No se ejecutó GitHub Actions.

Resultados de esa copia aislada: lint y diseño pasan; API **30/30** y caché real **4/4**, ambas en modo TEST_PG_URL local (la ruta de CI). La primera ejecución E2E después de caché también falló al compilar fuentes (`next/font/google queries have exactly one entry`); se conservó `.next` renombrándolo y se repitió desde una caché de build nueva. **E2E final: 61/61**, sin reintentos y con la excepción de contraste eliminada en este commit; producción y TypeScript compilaron. Este E2E usa el contenido estático, sin CMS alojado; los avisos de Payload sin secret corresponden a ese fallback local. El resultado no certifica la versión posterior con lime-500. Logs con prefijo `f9f4923-` en la carpeta de evidencia; los de `shared-worktree-` quedan únicamente como historial, sin certificar el rango solicitado.

## Entrega y decisiones

En el rango solicitado, sales tiene acceso a lectura, estado/notas y exportación de leads; no a borrar leads, modificar datos enviados, editar contenido o promoverse. Las reglas compartidas cubren las colecciones y globals. La migración agrega sales y su down se niega mientras existan usuarios con ese rol. La revisión estática no encontró otro bloqueo en esos cambios.

En `f9f4923`, el acento usa lime-600 en fondos claros, lime-500 en fondos oscuros y lime-700 en el encabezado pequeño del footer; la excepción de axe se elimina. Esto describe ese commit, no la versión posterior que revierte la decisión.

Permanecen pendientes la ejecución real de CI, QA manual, verificación de cifras por Zitrone y aceptación operativa. La ruta de zitrone.com.mx sigue sin decidir en el informe revisado. Las migraciones alojadas y las cuentas sales requieren el proceso de respaldo/aceptación ya documentado. Nada de esta revisión despliega ni cambia DNS/GTM/correo ni escribe en la base alojada. El primer build E2E pudo leer el CMS configurado; las pruebas API/caché usan bases desechables locales y la copia aislada no tiene .env del proyecto.
