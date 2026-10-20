# Registro de afirmaciones públicas

Creado el 30 de septiembre de 2026 (auditoría A-03). Lista lo que el sitio afirma como hecho: cifras, certificaciones, clientes, testimonios y cobertura. **Ninguna fila está aprobada por el cliente en este registro.** "Fuente registrada" es lo que consta en el repositorio o el tracker; si dice *ninguna*, no se encontró y no debe inferirse. Owner propuesto para aprobar: dirección comercial de Zitrone (por confirmar).

Cómo usarlo: el cliente marca cada fila como *Aprobada*, *Corregir* (con el texto correcto) o *Retirar*, con nombre y fecha. Cambiar el sitio solo después.

| # | Página / sección | Texto (ES / EN) | Fuente registrada | Estado |
| --- | --- | --- | --- | --- |
| 1 | Home, cinta del hero | "Comidas diarias en grandes empresas: 15,000" / "Meals served daily at great companies: 15,000" | Cifra dada por el usuario (commit `35fc76f`, 24-sep: son comidas, no personas). Hasta el 30-sep decía "servidas hoy" con incrementos aleatorios; retirado por representar un conteo en vivo inexistente (commit `2fdde7c`). | Redacción decidida por el usuario (7-oct-2026): se mantiene "Comidas diarias en grandes empresas" / "Meals served daily at great companies", cifra fija. Pendiente: que Zitrone confirme la cifra (promedio, mínimo o típico) y su periodo |
| 2 | Home, prueba / servicios | "15,000 comidas servidas cada día" | Igual que 1 | Pendiente |
| 3 | Home, prueba; "Más de 17 años operando comedores corporativos" | "17 años de experiencia" | Ninguna en el repo | Pendiente: año de inicio |
| 4 | Home, FAQ e inocuidad | "Nuestros comisariatos cuentan con Distintivo H" (Secretaría de Turismo / Salud) | Ninguna en el repo (copy ampliado en `917ea88`) | Pendiente: qué instalaciones, vigencia, número de distintivo. No ampliar a "todas las cocinas" |
| 5 | Home, inocuidad | Bitácoras de temperatura, contenedores CAMBRO, muestras retenidas, registros de materia prima | Ninguna en el repo | Pendiente: confirmar que aplica a todos los servicios |
| 6 | Home, "Así trabajamos contigo", widget Satisfacción | "94%", "+6 pts vs. nov.", "95%" Ene→May | Ninguna en el repo (añadido en `ecea20c`, 28-sep). Mostrado como ejemplo de un cliente sin nombre | Pendiente: cliente de origen, periodo, permiso; o marcar como ilustrativo |
| 7 | Home, widget de niveles de servicio | Métricas mensuales por cliente (paso 3) | Ninguna en el repo | Pendiente: igual que 6 |
| 8 | Home, widget de mensajes | Mensajes de comensales con nombre e inicial (p. ej. "Clau H.", "Nagib W.") | Ninguna en el repo | Pendiente: origen de los mensajes y permiso de las personas / cliente |
| 9 | Home, historias de clientes | Testimonios atribuidos a Pinterest, Stripe, Salesforce, Capital One, Nike, AT&T (con cargo) | Ninguna en el repo | Pendiente: aprobación escrita de cada cliente para nombre, logo, cita y cargo |
| 10 | Hero y cintas de logos | Logos de clientes (Uber, DoorDash, Amazon, Stripe, Mercado Libre, AT&T, Ford, Pinterest, P&G, Disney, Nike, Amex, Coca-Cola, PayPal, Henkel, Hilton, Santander, UFC…) | `assets.manifest.json`; Chanel retirado a petición del cliente (`5ed8c71`, 14-ago, `active: false`) | Pendiente: lista vigente con permiso de uso de marca |
| 11 | Formularios, cobertura | Seis regiones (CDMX, Estado de México, Hidalgo, Querétaro, Nuevo León, Jalisco) y 38 zonas | Usuario confirma cobertura limitada a ciudades principales, no nacional (DELIVERY.md, "Inputs to obtain early") | Pendiente: aprobación por zona y por servicio |
| 12 | Home, café | "Café 100% arábiga de Chiapas y Veracruz" | Ninguna en el repo | Pendiente |
| 13 | Blog, revisión | "Revisado por Seguridad alimentaria y operaciones Zitrone" | Ninguna en el repo | Pendiente: quién revisa realmente |

Equivalentes en inglés: `src/app/_components/home/content/en.ts` (mismas claves). Los servicios repiten 2, 4 y 10.
