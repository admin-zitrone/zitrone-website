# Entrega de Vercel a Arroba Systems

Actualizado 15-oct-2026 conforme al procedimiento descrito por Raúl: entregar repositorio y versión final en main para que el equipo receptor despliegue en su Vercel. Falta comunicar la elección de esta modalidad y concretar recepción y soporte.

Procedimiento y aceptación: [plan completo](plan-entrega-arroba-2026-10-13.md). Resumen: [ficha técnica](handoff-arroba-2026-10-12.md).

## Ruta principal

1. Confirmar organización Git, equipo Vercel, responsables, permisos, costos y soporte; garantizar titularidad y acceso de Zitrone.
2. Revisar y probar la versión de entrega; publicarla primero en el proyecto origen fusionando el PR a `main` (decisión del 18-oct, [procedimiento](cms-home-rollout.md)). Registrar SHA, deployment y tag. Arroba recibe los mismos archivos en un repositorio privado nuevo, con otro SHA; la correspondencia se registra según el paso 10 del procedimiento. No asumir que la rama de trabajo ya es main.
3. Entregar configuración, documentación y acceso seguro a dependencias. Neon, Blob y Resend requieren continuidad y administración propias; el repositorio no los transfiere.
4. Arroba importa el repositorio, configura el proyecto y publica una URL temporal con datos aislados. Verifica versión, build, CMS, imágenes, formularios, logs y recuperación.
5. Con pruebas aprobadas, coordinar recursos definitivos y dominios. Arroba obtiene y aplica los registros de su proyecto destino; el usuario no necesita acceso DNS. Preservar Workspace y aplicaciones internas.
6. Ejecutar A1–A12 del plan, observar 24/48 horas y firmar recepción. Conservar origen y respaldos hasta cerrar recuperación y aceptación.

Transferir el proyecto Vercel existente es una alternativa solo si ambas partes cambian el mecanismo. No sustituye por sí sola la entrega de integraciones, datos y accesos; consultar la fase 4 del plan.

## Proyecto origen (consultado 18-oct-2026, solo lectura)

- Proyecto `zitrone-website`, equipo Zitrone; Next.js, Node.js 24.x, `npm run build`.
- Conectado a GitHub: rama de producción `main`, despliegue en cada push, dominios asignados automáticamente. **Fusionar a `main` publica zitrone.mx.**
- Preview: tiene el `DATABASE_URL` de producción y no tiene `PAYLOAD_SECRET`, por eso los previews fallan. No añadirlo mientras Preview apunte a la base de producción. Es configuración pendiente (base y servicios propios para Preview), no una protección suficiente.
- Variables de producción por nombre (cifradas; sin valores aquí): `RESEND_API_KEY`, `RESEND_FROM_NAME`, `RESEND_FROM_ADDRESS`; `HOME_CONTENT_SOURCE`, `PAYLOAD_SECRET`, `PAYLOAD_ADMIN_EMAIL`, `PAYLOAD_ADMIN_PASSWORD`; `DATABASE_URL`, `DATABASE_URL_UNPOOLED`, `POSTGRES_*`, `PG*`, `NEON_PROJECT_ID`; `BLOB_READ_WRITE_TOKEN`; `NEXT_PUBLIC_SITE_URL`. Lista observada el 24-sep; volver a comprobarla antes de la recepción. Propósito de cada una: [.env.example](../.env.example) y [README](../README.md#setup).

Esta documentación no ejecuta merge, push, despliegue, transferencia ni cambios DNS.
