# Manual de contenido: qué se edita dónde

Vigente desde el 30 de septiembre de 2026 (commit de remediación, ver [claude-remediation-results.md](claude-remediation-results.md)). Sustituye la frase del README anterior "Payload es la fuente de verdad de la home": en producción la home se sirve desde el código.

Panel: `https://www.zitrone.mx/admin` (o el dominio del deployment definitivo). Roles: **editor** edita contenido; **sales** solo trabaja leads; **admin** todo. Cuentas: ver [operacion-y-entrega.md](operacion-y-entrega.md#cuentas-y-responsables).

## Quién manda en cada sección

| Página / sección | Fuente en producción | Qué edita el CMS | Qué hace un sync desde código |
| --- | --- | --- | --- |
| Home, navegación y pie (todas las secciones) | **Código siempre** (decisión del 19-oct): los cambios se realizan en el repositorio mediante revisión, pruebas y publicación | Nada visible | No se usa |
| Home: profiler / formulario guiado | **Código siempre** (lógica de servicio) | Nada | No aplica |
| Home: gráficas de los pasos "Así trabajamos" (widget y etiqueta sobre la foto) | **Código siempre** (cifras de fuentes reales: menú, QBR) | Nada; el texto del paso sí es del CMS | No aplica |
| Nombres y URLs de los servicios en la tira de servicios | **Código** (compartidos con las páginas de servicio, que aún no están en el CMS) | Nada | No aplica |
| Navegación, pie, CTA principal | Igual que la home: código con `static`, CMS sin `static` | Navegación: *Settings > Website header*. Pie: *Settings > Website footer* y *Contacto e información de la empresa* | Seed lo sobrescribe |
| Servicios (índice y fichas) | **Código** (`src/app/[locale]/services/…`, contenido de home) | Nada | No aplica |
| Contacto | **Código** (`src/app/lib/contact-content.ts`) | Nada | No aplica |
| Blog: qué artículos existen | **CMS** (colección `blogPosts`, estado *Published*) | Crear, publicar, despublicar, borrar | `payload:sync:blog:prod` **republica** cada artículo que tenga archivo en código y sobrescribe su texto |
| Blog: textos de un artículo publicado | **Mezcla**: CMS primero; un campo vacío en el CMS (imágenes, checklist, enlaces, CTA) se completa con el archivo en código del mismo slug | Título, resumen, SEO, intro, secciones, FAQ, CTA, autor, categoría, fecha | Sobrescribe el texto con el del código |
| Blog: categorías | CMS (`blogCategories`); si no hay ninguna, etiquetas del código | Nombres por idioma | Seed |
| Aviso de privacidad | CMS (global `privacyNotice`); un campo vacío o una consulta fallida usan el texto del código | Todo el texto | Seed lo sobrescribe |
| Leads (solicitudes de contacto) | CMS (colección `contactRequests`), roles admin y sales | Estado y notas internas (sales y admin); borrar solo admin | No aplica |

La home, la navegación y el pie salen de los archivos del código salvo que `HOME_CONTENT_SOURCE=cms`, que no se usa en producción. El modo CMS sigue en el código sin usarse; activarlo sería un proyecto aparte, con seed y `npm run payload:check:home:prod` en 0 diferencias. Las secciones siguientes describen ese modo.

## Home en el CMS: dónde se edita cada parte

Vale cuando producción ya no usa `static`. Todo en `/admin`; cada campo tiene versión ES y EN (selector de idioma arriba a la derecha). Los enlaces también son por idioma (las URLs de servicio cambian entre ES y EN).

| Parte de la página | Dónde |
| --- | --- |
| Título del navegador, descripción para buscadores, imagen para compartir | *Pages > Página principal > Page title and search preview* |
| Hero: titular, palabra en verde, fotos que rotan (cada una con su palabra), texto, texto corto para teléfono, botón, cifra de la cinta de logos | *Página principal > Hero / first screen* |
| Logos de la cinta del hero y de "medios" | *Homepage content > Logos* (archivo, versión de un color, tamaño); se eligen en el bloque |
| Servicios: titular, texto, botones, momentos que rotan | *Página principal > Services section* |
| Tarjetas de servicio (foto, texto, enlace, servicios relacionados) | *Homepage content > Service cards* |
| Credibilidad (tarjetas, cifras) | *Página principal > Proof / credibility section* |
| "Así trabajamos" (pasos, frase resaltada, foto, icono, color) | *Página principal > How it works tabs* |
| Detalle por servicio (diapositivas, características, iconos) | *Página principal > Service details slider* |
| Historias de clientes | *Homepage content > Client stories*; se eligen en *Client stories section* |
| Preguntas frecuentes | *Homepage content > FAQs*; se eligen y ordenan en *FAQs section* |
| Navegación | *Settings > Website header* |
| Pie (frase, columnas de enlaces, contacto, legales, redes) | *Settings > Website footer* |

Guardar sin publicar (*Save draft*, o el autosave) no cambia el sitio. **Publish** lo cambia en la siguiente visita a cualquier página: la navegación y el pie se actualizan en todo el sitio (servicios, blog, contacto, aviso), no solo en la home. Probado contra la caché real de Next con `npm run test:cache:home`.

Las cifras (por ejemplo, la de la cinta de logos) deben ser reales y con fuente. Para quitar la cifra de la cinta, vaciar *Figure*: se muestra la etiqueta de la cinta.

## Blog: publicar, despublicar, borrar, recuperar

Con el CMS configurado, **el CMS decide qué artículos existen** (`getBlogContentSource()` en `src/payload/loaders/blog.ts`):

| Acción en `/admin` | Resultado en el sitio |
| --- | --- |
| Guardar borrador / autosave | Nada cambia en el sitio. |
| **Publish** | Aparece en índice, página, relacionados, categoría, autor, sitemap y feed, en el idioma publicado. La revalidación es automática: el hook invalida todas las páginas del blog (`/[locale]/blog`) y el sitemap, y la siguiente visita ya recibe la versión nueva (probado contra la caché real de Next con `npm run test:cache`; en esa prueba el cambio se vio en la primera visita). |
| Editar y publicar de nuevo | Se actualiza la página. |
| **Unpublish** | Desaparece de todo lo anterior, aunque exista su archivo en el código. La URL da 404. |
| Borrar | Igual que despublicar; además se pierde el historial de versiones. |
| Recuperar | Si se despublicó: abrir el artículo y *Publish*. Si se borró: crearlo de nuevo (o restaurar respaldo, ver operación). |
| Base de datos caída | No se muestra "el blog vacío" ni los archivos del código. Un build falla; en el sitio publicado se siguen sirviendo las páginas ya generadas hasta que el CMS vuelva. |

Sin CMS (desarrollo local sin `DATABASE_URL`, o `BLOG_CONTENT_SOURCE=static`) el blog son los archivos en código.

### Idiomas

- Cada artículo es **un documento con dos idiomas**. Cambiar el selector de idioma (arriba a la derecha en el editor) edita la otra versión.
- El slug (URL) es distinto por idioma; se emparejan por el documento, no por el slug.
- Sin traducción, el campo queda vacío en ese idioma: no se copia el español al inglés.
- Publicar o despublicar afecta **a ambos idiomas a la vez**. Para retirar solo un idioma, hoy no hay botón: pedirlo a desarrollo.

### Cuidado con el sync

`npm run payload:sync:blog:prod` copia los textos del código al CMS y **marca como publicados** todos los artículos que tienen archivo en código. Si se despublicó un artículo a propósito, ejecutar el sync lo vuelve a publicar. Usar solo cuando el código sea la versión aprobada, siempre primero con `-- --dry-run`. Nunca usar `release:home:prod` como prueba: sincroniza el CMS y despliega producción.

## Lo que este manual no cubre (pendiente)

- Demostración de editar/publicar/despublicar en el **staging del cliente**: está probada en una base local desechable (`npm run test:api`), no en el entorno destino.
- Capacitación con la persona que editará: pendiente de agendar.
- Estado de migraciones en la base alojada: comprobar con `npm run payload:migrate:status:prod` antes del release (lectura).
