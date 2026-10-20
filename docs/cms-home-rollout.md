# Home, navegación y pie en el CMS: pasos para producción

Procedimiento único de publicación y recuperación de `release/2026-10` (incluye `cms/home-parity`). Ninguno de estos pasos se ha ejecutado contra la base alojada ni contra Vercel. Cada uno necesita aprobación explícita del usuario.

**Decisión del usuario, 19-oct: la home, la navegación y el pie se quedan en los archivos del código**, como hoy en producción. Desde esta versión es el comportamiento por defecto: el CMS solo se usa con `HOME_CONTENT_SOURCE=cms`, así un proyecto nuevo sin la variable (el de Arroba) no puede cambiar de fuente por olvido. Los cambios de texto e imágenes se realizan en el repositorio mediante revisión, pruebas y publicación, con el equipo y las herramientas que elija Arroba, que despliega. Payload queda solo para el blog, el aviso de privacidad y los leads. Por eso **no se ejecuta el seed** (paso 6) ni se activa la home desde el CMS (paso 9). La migración sí: el esquema debe coincidir con el código. El modo CMS de la home sigue en el código, sin usarse; activarlo sería un proyecto aparte con su propio QA.

Comprobado en el código (19-oct): fuera del modo CMS, la navegación (`site-navbar.tsx`) y el pie de todas las páginas, blog y aviso incluidos, salen de `getResolvedHomeContent`, que no consulta el CMS. Se borró `getResolvedBlogLayout`, que leía header y pie del CMS y ninguna página usaba.

## Qué cambia

- El CMS ahora reproduce **exactamente** la home, la navegación y el pie del código. Antes faltaban ~200 campos por idioma (fotos del hero, momentos de servicios, detalles de los pasos, columnas del pie, redes, enlaces por idioma…). Prueba: `npm run payload:check:home` compara campo por campo lo que renderiza el sitio en modo CMS contra el código: **0 diferencias en ES y EN**, y `-- --coverage` confirma que ningún texto sigue saliendo del código salvo lo que se queda en código a propósito (profiler, gráficas de los pasos, nombres/URLs de servicio; ver [manual-contenido.md](manual-contenido.md)).
- Migración `20261016_042603_home_cms_parity`: agrega campos y tablas; las rutas de los enlaces pasan a ser por idioma. **Editada a mano**: copia cada enlace de header/pie a cada idioma y **conserva** las columnas compartidas anteriores (*expand/contract*, 18-oct, por R7 de Codex), así el código anterior sigue funcionando sobre la base migrada. Borrarlas es una migración posterior, después de aceptar la entrega. El `down` vuelve a copiar las rutas a las columnas compartidas. Ensayo: [evidencia](evidence/cms-home-migration-rehearsal-2026-10-18/README.md), `zsh scripts/rehearse-home-migration.sh`.
- Seed (`payload:seed:home:prod`): escribe todos los campos nuevos; ya no borra el texto en español al escribir el inglés (bug que dejaba vacías respuestas de FAQ y enlaces del pie); no duplica imágenes al repetirse; nombra cada imagen por su ruta (`shared-clients-mono-att.svg`) para no confundir archivos homónimos.
- Revalidación: publicar home, header, pie, logos, servicios, historias o FAQs refresca **todo el sitio** (antes solo `/`, `/es`, `/en`; la navegación y el pie de servicios/blog/contacto quedaban viejos — reproducido con el código anterior).
- Retirados `payload:sync:home*`, `release:home:prod` (desplegaba con `vercel --prod`) y el chequeo de deriva parcial; `payload:check:home*` ahora es el chequeo completo.

## Evidencia local (base desechable, nunca la alojada)

| Prueba | Resultado |
| --- | --- |
| `payload:check:home` (paridad) y `-- --coverage` | 0 diferencias ES/EN; 0 textos fuera del CMS no declarados |
| Seed dos veces seguidas | mismo número de imágenes (84) |
| Migración sobre datos sembrados con el código actual: up → down → up | 29/29 enlaces iguales en cada paso |
| `npm run test:cache:home` (build de producción en modo CMS) | 5/5: páginas en caché; borrador no aparece; publicar aparece en la 1.ª visita; navegación y pie editados llegan a home, servicios, ficha, blog, contacto y aviso; quitar la cifra muestra la etiqueta |
| Control negativo: misma prueba con la revalidación anterior | falla: `/es/services` sigue en caché con navegación/pie viejos |
| Build modo CMS vs modo `static`, home ES/EN escritorio y móvil | texto visible idéntico; 0 imágenes rotas; misma altura; 0.07 % de píxeles distintos (recompresión WebP de fotos) |
| `tsc`, `lint`, `test:contracts` 83/83, `test:scripts` 12/12, `test:api` 30/30, `test:cache` 4/4 | pasan |

## Pasos en producción

0. **Destino: decidido por el usuario el 18-oct (A).** Primero se publica la versión final en el sitio origen: fusionar el PR a `main` despliega zitrone.mx en el proyecto Vercel origen. Después Arroba recibe **los mismos archivos publicados** en un repositorio privado nuevo, con otro SHA (paso 10). La fusión se autoriza solo después de los pasos 1–6.
1. **QA en un entorno aislado** contra el deployment aprobado (R9): ES/EN, escritorio/móvil, sobre una copia local del contenido ya migrada, sin seed (decisión del 19-oct), que es lo que se publica; ver la ejecución 7, aceptada por el usuario. Plan y runner: [plan-qa-aislado-2026-10-18.md](plan-qa-aislado-2026-10-18.md), `scripts/qa-release/run.sh`. No usa el Preview del proyecto origen, que tiene el `DATABASE_URL` de producción: nunca añadirle `PAYLOAD_SECRET` mientras apunte a producción.
2. **Ventana acordada sin escrituras en `/admin`** desde el respaldo hasta la prueba de humo.
3. **Estado.** `npm run payload:migrate:status:prod` (solo lectura). Payload aplica **todas** las migraciones pendientes en orden. Si sigue pendiente `20260930_042253_remove_billing_page`, también se aplica: borra las tablas del formulario de facturación retirado. **Autorizado por el usuario (17-oct)**; sus datos solo se recuperan del respaldo del paso 4, no del `down`. `20261008_133454_sales_role` es aditiva.
4. **Respaldo y captura.** Respaldo de la base (rama Neon o `pg_dump`), comprobando que se puede restaurar. Captura de header, pie y home por idioma con **el código publicado**, no con esta rama: el código nuevo no puede leer el esquema anterior (lo detectó el ensayo en seco del runner de QA, 18-oct). En un checkout temporal del SHA de producción, con `scripts/payload/probe-site-globals.ts` copiado desde esta rama porque ese código no lo tiene: `npx tsx --env-file=<ruta a .env.production-cms> scripts/payload/probe-site-globals.ts export <archivo>` (solo lectura). Después de migrar, la captura de la vuelta atrás sí se hace con esta rama.
5. `npm run payload:migrate:prod`. **Siempre antes de publicar el código nuevo**: el código nuevo no puede leer header/pie con el esquema anterior (paso 2 del ensayo); el sitio caería al texto del código y el admin no funcionaría. El código anterior sigue funcionando con la base ya migrada (paso 4 del ensayo).
6. **No se ejecuta (decisión del 19-oct).** El seed (`payload:seed:home:prod`) solo sirve para leer la home desde el CMS: reescribiría home, header, pie, ajustes y FAQs y subiría ~84 imágenes a Blob para un contenido que el sitio no lee en modo `static`.
7. **Publicar:** fusionar el PR a `main`, que despliega solo. **No** ejecutar además `vercel --prod`.
8. Humo: `/es`, `/en`, un servicio, un artículo, `/es/contact`, el sitemap y una redirección del dominio anterior.
9. **No aplica (decisión del 19-oct).** No poner `HOME_CONTENT_SOURCE=cms` en ningún proyecto: sin seed, el sitio mostraría el contenido anterior del CMS. La variable `HOME_CONTENT_SOURCE=static` que tiene hoy el proyecto origen puede quedarse o borrarse: da lo mismo.
10. **Registrar y entregar.** Anotar el SHA de `main`, el deployment de producción que lo sirve y crear el tag de release. Arroba recibe un repositorio privado nuevo con esos mismos archivos (decisión del 18-oct: el historial original contiene material comercial y se conserva restringido). Su primer commit tiene otro SHA, pero debe tener el **mismo árbol**. Registrar en el acta:
    - SHA y tag de origen, y deployment de producción;
    - árbol de origen, `git rev-parse <sha>^{tree}`, y manifiesto `SHA256SUMS` archivo por archivo, desde un checkout limpio de ese SHA (`git ls-files -z | xargs -0 shasum -a 256`);
    - SHA del primer commit del repositorio receptor y su árbol, que debe ser igual al de origen. Si difiere, no entregar.
    
    No cambiar ningún archivo al crear el repositorio nuevo. Si hace falta otro cambio, se publica y se registra primero en origen.

## Vuelta atrás

Ensayado en [evidencia](evidence/cms-home-migration-rehearsal-2026-10-18/README.md). Antes de cualquier vuelta atrás: cerrar las escrituras en `/admin` y repetir la captura del paso 4. Es la única copia de las ediciones posteriores al respaldo.

- **Código anterior:** Instant Rollback al deployment anterior. Lee sus columnas compartidas, que la migración conserva (paso 4 del ensayo). No hace falta `migrate:down` mientras nadie edite header o pie en `/admin`.
- **Si alguien editó header o pie en `/admin` después de migrar:** primero `payload migrate:down` de `20261016_042603_home_cms_parity` y después Instant Rollback (pasos 7 y 11 del ensayo). El `down` copia las rutas actuales (español primero) a las columnas compartidas y deja en `spark` los iconos que el código anterior no conoce. También borra las tablas y campos nuevos de la home. En inglés, los enlaces de servicios quedan con la ruta en español, que redirige a la inglesa.
- **Mientras esté el código anterior, no editar header/pie.**
- **Volver a avanzar:** `migrate` si se hizo el `down`, y publicar. Sin seed.
- **Datos borrados por `remove_billing_page` o por el `down`:** solo se recuperan del respaldo del paso 4.

## Contracción pendiente (después de la aceptación)

Migración escrita a mano que borre las 21 columnas compartidas (`header_primary_nav.link_*`, `header.primary_cta_*`, `footer_*_links.link_*`, `footer.cta_*`). Ejecutar solo cuando ya no haga falta volver al código anterior a esta rama. `migrate:create` no la generará sola: el esquema de Payload ya no incluye esas columnas.

## Fuera de alcance (fase 2)

- Páginas de servicio (`src/app/[locale]/services/service-targets.ts`) y contacto (`src/app/lib/contact-content.ts`) siguen en código. Al pasarlas al CMS, los nombres y URLs de servicio de la tira de servicios pasan con ellas.
