# Zitrone · Ficha técnica de entrega a Arroba Systems

**Revisión 3 · 15 de octubre de 2026.** Sustituye la ficha del 12-oct, que asumía incorrectamente que Arroba solo administraría DNS. Plan detallado: [plan-entrega-arroba-2026-10-13.md](plan-entrega-arroba-2026-10-13.md).

## Modelo de entrega

Desarrollo entrega código, configuración, servicios, datos, documentación y evidencia. **Arroba recibe el sitio en su equipo de Vercel y administra hosting, dominios y DNS.** Zitrone conserva titularidad y acepta la entrega. El usuario no necesita acceso DNS.

Recepción de hosting solicitada por el usuario, pendiente de confirmación formal por Arroba. Raúl describió el 15-oct la recepción del repositorio/main y el despliegue en su Vercel; falta comunicar la elección de esa modalidad y acordar los servicios asociados.

## Identificación y destino

| Elemento | Información |
| --- | --- |
| Proyecto origen | zitrone-website, equipo Zitrone, ID prj_nsMWJdqhkAswimnns9Ps3YJsUToQ |
| Tecnología | Next.js, Payload CMS, Node 24.x; npm ci / npm run build |
| Sitio principal previsto | https://www.zitrone.mx |
| Direcciones adicionales | zitrone.mx, zitrone.com.mx, www.zitrone.com.mx; redirección permanente a rutas equivalentes |
| Equipo Vercel destino | Arroba debe indicar slug/ID, responsable y suplente |
| Ruta principal | Entrega del repositorio con main validado; Arroba importa y despliega en su Vercel |
| Alternativa condicionada | Transferir el proyecto existente solo si ambas partes acuerdan cambiar el mecanismo |
| Repositorio/release | Entregar acceso, SHA de main/tag aprobado y correspondencia con deployment; no deducir versión por apariencia |
| Servicios asociados | Neon/Postgres, Blob, Resend, accesos CMS, monitorización y Google según inventario |
| Facturación | Solo enlace de correo; no existe flujo adicional por entregar |

## Reparto de tareas

- **Desarrollo:** preparar y probar release, entregar repositorio/configuración/manuales, respaldos y plan de recuperación; acompañar recepción y aceptación.
- **Arroba:** confirmar equipo y capacidad de soporte; recibir Vercel y dependencias acordadas; obtener registros del destino; aplicar DNS y verificar correo/apps.
- **Raúl:** coordinar con Arroba y el administrador de la asociación Vercel anterior de .com.mx.
- **Zitrone:** confirmar titulares, responsables comerciales, costos, ventana y aceptación final.

## DNS: lo que se entrega

Arroba obtiene los valores exactos desde **su proyecto receptor**. No hay que añadir .com.mx al equipo de origen ni pedir al usuario acceso al DNS. Las observaciones del 12-oct (A76.76.21.21 y www CNAME cname.vercel-dns.com, aceptados entonces por Vercel) son referencia histórica, **no una orden de cambio**. El destino puede solicitar otros valores o verificaciones.

Arroba conserva NS/MX/SPF/DKIM/DMARC y subdominios internos; respalda la zona y coordina cualquier asociación ya utilizada. No mover toda la propiedad raíz ni usar wildcard sin revisar las aplicaciones existentes. Confirmar también quién administra la zona de zitrone.mx.

## Condiciones de cierre

1. Versión identificada y pruebas de esa versión registradas.
2. Arroba puede publicar y recuperar el sitio; tiene acceso duradero a los recursos y secretos mediante canal seguro.
3. Base y medios respaldados y recuperables; migraciones verificadas; ningún lead perdido durante el corte.
4. Cuatro hosts con HTTPS/redirecciones correctos, rutas y parámetros conservados.
5. CMS/roles e imágenes funcionales; recepción de contacto ES/EN comprobada en pruebas coordinadas.
6. Workspace y aplicaciones internas sin afectación; excepciones y soporte documentados.
7. Acta firmada por Arroba y Zitrone, con commit/deployment y responsables.

Estado: plan y documentación preparados. Equipo receptor, aceptación de Arroba, inventario final, pruebas en destino y fecha de corte pendientes. No se ejecutó ni autorizó una transferencia mediante esta ficha.
