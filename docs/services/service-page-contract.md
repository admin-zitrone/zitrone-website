# Contrato de la página de servicio

Cada sección de `/services/[slug]` responde **una** pregunta del comprador, en un
presupuesto de palabras fijo, y **ningún hecho aparece en dos secciones**. Esto
existe para que las seis páginas de servicio se puedan escribir y migrar con la
misma lógica, sin volver a discutir la estructura cada vez.

- **Fuente de contenido:** `src/app/[locale]/services/service-targets.ts`
- **Render:** `src/app/[locale]/services/service-detail-template.tsx`
- **Se hace cumplir en:** `tests/contracts/service-page-contract.test.ts` (`npm run test:contracts`)

Los **seis** servicios están bajo el contrato: comedor, cafetería, snacks y
bebidas, café y agua, carritos y catering, en ES y EN. Un servicio entra poniendo
`faqScope: "service"`, y el test exige que ninguno se quede fuera, así que un
servicio nuevo nace con la misma estructura o el build falla.

---

## Las secciones

| # | Sección | Pregunta que responde | Campo | Presupuesto | Función SEO |
|---|---|---|---|---|---|
| 1 | Hero | ¿Qué es? | `target.lede` | ≤ 24 palabras | H1 = nombre del servicio. Promesa + quién opera, máximo dos frases, sin lista |
| 2 | Logos | ¿Quién ya confía? | — | sin copy | señal de confianza, cero texto |
| 3 | Panorama | ¿Qué resuelve? | 3 `resolves.points` | ≤ 12 por punto | intención "para qué sirve"; **un punto por decisión** (ver abajo) |
| 4 | Así trabajamos | ¿Cómo opera Zitrone? | `getServiceStandard(locale)` | intro ≤ 18 / 10 por punto | intención "cómo funciona"; **es el mismo bloque en los seis servicios** |
| 5 | Testimonio | ¿Funciona de verdad? | `testimonialStory` | — | prueba |
| 6 | FAQ | ¿Qué duda bloquea la decisión? | `faqs` (4 a 8) | ≤ 90 por respuesta | long-tail + `FAQPage` structured data |

### La lógica de los 3 puntos de "¿Qué resuelve?"

No son tres beneficios sueltos: son **las tres decisiones que el comprador tiene
que tomar para contratar este servicio**, en el orden en que las toma:

1. **Qué modalidad** del servicio necesita — corporativo, industrial, premium.
2. **Cómo se produce** — en su sede o desde cocina central.
3. **Qué recibe la gente** — el menú y quién lo diseña.

Si los tres puntos son beneficios genéricos ("mejor clima laboral"), el bloque
está mal escrito: no ayuda a decidir. La misma lógica aplica a los seis
servicios, que es lo que la hace replicable.

### El bloque "Así trabajamos" es compartido

Cómo opera Zitrone —inocuidad, personal, medición, trayectoria— no cambia entre
servicios, así que **no se escribe por servicio**: vive una sola vez en
`getServiceStandard(locale)` y se renderiza igual en las seis páginas. Cuatro
puntos, siempre los mismos:

1. **Cocinamos bajo norma** — Distintivo H, NOM-251, control de temperatura.
2. **El equipo es nuestro** — nómina Zitrone, IMSS, REPSE, constancias.
3. **Medimos para mejorar** — consumo, asistencia, satisfacción y merma al mes.
4. **17 años de operación** — 15,000 personas al día.

Como es compartido, ningún servicio puede repetir esos hechos en sus propias
zonas: el test de "un hecho, una zona" compara cada servicio contra el bloque.

### La lógica de las 4 FAQ

Son **las cuatro dudas que frenan la firma, en el orden en que aparecen**. Las
mismas cuatro en los seis servicios:

1. **Viabilidad** — ¿se puede en mi edificio? (espacio, infraestructura)
2. **Riesgo** — ¿qué garantiza que salga bien? (inocuidad, respuesta a fallas)
3. **Encaje** — ¿aplica a mi tamaño? (headcount, turnos, volumen)
4. **Dinero** — ¿cómo se cobra? (esquema, no precio)

Cómo se escriben, que es lo que las hace servir para SEO:

- **La pregunta se escribe como la teclea una persona**, no como título de
  sección: *"¿Cuántas personas se necesitan para que convenga un comedor?"*, no
  *"Tamaño mínimo"*. 5–14 palabras, en el vocabulario del comprador.
- **La primera frase responde** (sí / no / la cifra) en ≤ 20 palabras; el resto
  explica. Es lo que Google puede levantar como featured snippet.
- **Respuesta completa ≤ 45 palabras.**
- **Una duda por pregunta**, sin repetir el catálogo que ya está arriba.

Todo esto lo verifica `service-page-contract.test.ts`, así que replicar el
bloque en otro servicio es cambiar los hechos, no la estructura.

### La lógica de los CTA

El hero todavía no sabe si la persona está lista para hablar. Su único CTA es
informativo: **"Conoce más"** / **"Learn more"**, baja a `#service-overview` y
nunca supera dos palabras. No pide datos ni abre el correo.

No existe un bloque de cierre ni se promete demo, agenda, cotización o llamada.
El contacto aparece en el pie de página, después de que la persona pudo conocer
la oferta completa.

### Las tres reglas duras

1. **Un hecho, una zona.** Si "cocina en sitio o cocina central" vive en *Qué
   resuelve*, el hero no la menciona y *Así trabajamos* tampoco. El test compara frases
   de tres palabras de contenido entre zonas y falla si una se repite.
2. **El título carga el mensaje.** La gente escanea títulos; la línea de abajo
   solo califica. Si al leer únicamente los títulos no se entiende la oferta, el
   bloque está mal escrito.
3. **Ningún hecho sin fuente.** Toda afirmación verificable —certificaciones,
   tiempos, ciclos de menú, esquemas contractuales— sale de
   los documentos comerciales de Zitrone (niveles de servicio de comedores,
   catálogo 2026, testimoniales 2025), que guarda Zitrone fuera de este
   repositorio (retirados el 18-oct-2026). Si el dato
   no está ahí, no se escribe: se pregunta. Copy plausible pero inventado suena
   inventado y no resiste una llamada de ventas.
4. **Vocabulario del cliente, no interno.** *"Cocinamos aquí o traemos"*, no
   *"modelos de producción"*. *"Cocina central"*, no *"comisariato"*. Se
   conservan los términos que el comprador mexicano sí usa: *comensal*,
   *inocuidad*, *comedor industrial*.

### Qué se eliminó y por qué

`proofPoints` (el panel "Lo que este servicio resuelve" del hero) era el lede
partido en tres y repetido otra vez como beneficios del panorama: el mismo trío
de hechos, tres veces, en pantalla y media. El campo ya no existe en el tipo.

El layout alterno (rejilla de 4 pasos + testimonio suelto) que veían los
servicios sin migrar también se borró: el bento de testimonio + estándar es
ahora el único, así que las seis páginas tienen la misma anatomía.

`includes` ("Qué incluye", 6 filas) repetía en catálogo lo que el panorama ya
decía como decisión y lo que el bloque compartido dice como estándar. Se borró:
el detalle de paquete es material de propuesta, no de landing.

`processIntro` / `processSteps` (visita → propuesta → montaje → operación) era el
proceso *comercial*, y además una reconstrucción sin fuente. Lo sustituye el
bloque compartido, que sí responde "¿cómo opera esto?" con hechos verificados.

---

## SEO: qué aporta cada sección

- **Una intención por sección.** Google no premia repetir el mismo string tres
  veces; sí premia cubrir intenciones distintas — *qué es, qué resuelve, qué
  incluye, cómo funciona, cuánto cuesta*. El contrato es, en la práctica, un
  mapa de intenciones.
- **Un solo H1** (el nombre del servicio) y H2 en lenguaje de pregunta natural.
- **`FAQPage` solo cuando la página muestra sus propias FAQ** (`faqScope:
  "service"`). El structured data tiene que coincidir con lo renderizado; con
  las FAQ genéricas del home no coincidía y no se emitía.
- **Respuestas de FAQ ≤ 45 palabras**, que es el tamaño que cabe en un featured
  snippet.
- **`Service` + `BreadcrumbList` + `WebPage`** ya se emiten por página.
- **Pendiente de decisión de negocio:** el término de cabecera del mercado
  mexicano es *comedor industrial*, no *comedor corporativo*. Hoy "industrial"
  aparece solo como uno de los tres tipos. Atacarlo de frente jala tráfico de
  plantas y fábricas que puede no ser el ICP, así que es decisión de
  posicionamiento, no de copy.

---

## Escribir un servicio nuevo

En **ES y EN a la vez** — el test exige paridad de locales:

1. Escribir `resolves`: 3 puntos (≤ 12 palabras cada uno), uno por decisión.
2. No escribir nada de operación: el bloque "Así trabajamos" ya está y es
   compartido. Solo hay que evitar repetir sus hechos.
3. `target.lede`: promesa + quién opera, máximo dos frases, ≤ 24 palabras.
4. Escribir las 4 FAQ (viabilidad, riesgo, encaje, dinero) y poner
   `faqScope: "service"`.
5. `npm run test:contracts`.

Las FAQ arrancan con palabra interrogativa (qué, cómo, cuántas, quién, se,
puede…). "¿Desde cuántas…?", "¿Hay un mínimo…?" y "¿Funciona en…?" no pasan el
test: no es cómo se teclea la búsqueda.

### Hechos disponibles en la fuente (comedores)

Material ya verificado:

- **Certificaciones:** Distintivo H (NMX-F-605-NORMEX-2018), BPH (ALNALIA),
  REPSE vigente, NOM-251-SSA1-2009, control HACCP.
- **Cumplimiento laboral:** personal 100% en nómina Zitrone (IMSS, INFONAVIT,
  PTU); constancias mensuales para el cliente ante el IMSS.
- **Niveles:** Corporativo (100+ comidas/día), Industrial (200–1,500+ por turno,
  2–3 turnos, 365 días), Premium (chef ejecutivo asignado, estaciones temáticas,
  barista certificado, nutriólogo dedicado, Happy or Not).
- **Modalidades:** con cocina en sitio (chef + brigada + higienista) o sin ella
  (comisariato certificado, contenedores isotérmicos, cero inversión en equipo,
  ahorro de m² rentados).
- **Menú:** ciclo de 8 semanas sin repetición, 3 tiempos, mínimo una opción
  vegetariana por servicio, etiquetado nutricional en punto de servicio.
- **Operación:** supervisor por cuenta con respuesta a incidencias en menos de
  2 horas; KPIs de consumo, asistencia, satisfacción y merma antes del día 5.
- **Comercial:** sin cobro de arranque en contratos de 12 meses; esquemas de
  inversión a 48–60 meses; revisión anual indexada a INPC y CONASAMI.
- **Clientes:** Uber desde 2018, AT&T 8 años, Stripe (~800 personas), UFC
  Performance Institute.

### Hechos disponibles en la fuente (los otros cinco servicios)

El material verificado de cafetería, pantry, cafeteras, agua y carritos vive en
los decks de servicio (repositorio privado de presentaciones); el catering,
además, en el catálogo 2026 de Zitrone.

- **Cafetería:** barista y personal Zitrone en sitio, abasto/limpieza/
  mantenimiento diarios, reporte de consumo mensual, inicio a 30 días de
  confirmar, facturación mensual sobre consumo real con subsidio a elegir.
- **Pantry:** asignación diaria por persona (p. ej. 2 bebidas + 4 snacks),
  distribución con tarjeta RFID pieza por pieza, reabasto diario L–V, planograma
  con lo saludable a la altura de los ojos, tarifa por persona/día en tres
  niveles de paquete.
- **Café y agua:** cafeteras automáticas con molido al momento, café de
  especialidad 100% mexicano, hasta 3,000 tazas al mes por plan, visitas diarias
  de reabasto y mantenimiento preventivo; dispensadores con filtración avanzada,
  cambio de filtros y pruebas microbiológicas cada 6 meses; consumibles (leche,
  endulzantes) por caja.
- **Carritos:** recorrido por piso en horarios fijos, carrito + producto +
  personal Zitrone, reabasto diario, punto de servicio adicional según la
  operación, catálogo de ensaladas, sándwiches, wraps, pastas y platos del día.
- **Catering:** mínimo 10 comensales, servicio de 5 horas en coffee break,
  formatos de entrega en frío (box lunch), mesero $1,100 + IVA, precios por
  persona sin IVA.

### Deuda conocida

El sitio no tiene formulario de contacto: todo termina en
`mailto:opina@zitrone.com.mx`. Eso pone un cliente de correo entre el interesado
y Zitrone, y deja la conversión sin medición. Un formulario corto (personas,
horarios, cocina sí/no, sede) convertiría mejor y llegaría estructurado; es
decisión de negocio, no de copy. Mientras tanto, los CTA están escritos para no
mentir sobre el destino.

`whyItMatters` y `operatingFit` siguen escritos en los seis servicios y no se
renderizan en ningún lado. O entran al contrato o se borran; hoy son copy que se
mantiene sin que nadie lo lea.
