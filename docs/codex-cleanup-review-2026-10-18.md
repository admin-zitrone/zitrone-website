# Revisión de limpieza — 397ec9f y anotación a7b72c3

18-oct-2026. Alcance: cambios de limpieza desde 7e09c24, retirada comercial y anotación de copia/URLs; no certifica publicación ni QA visual.

Resultado: sin nuevo bloqueo funcional identificado en la limpieza inspeccionada. La anotación a7b72c3 solo cambia DELIVERY.md e inventario; corresponde a la confirmación del usuario. Puede proponerse su push al PR borrador para CI, sin autorizar merge/publicación.

Verificación independiente:
- 94 archivos retirados cotejados byte a byte mediante SHA-256 contra 3329baf, usando copia privada externa: 94 coinciden.
- Árbol de release sin los decks/PDF comerciales, Word retirados, artefactos temporales ni smooth-scroll-provider.
- Ejecutado scripts/design-tokens-data.mjs: 1259 tokens; árbol permanece limpio antes de escribir este informe.
- GitHub PR #5: validate e isolated-api pasan, run 39143752328. Vercel preview falla; no se reconsultaron sus logs/secretos ni se certificó su causa.
- Código R10 contiene normalización de nuevos iconos en tablas de contenido y versiones antes de volver al enum viejo. No se repitió el ensayo en esta revisión.
- No se repitieron build ni suites completas locales. Evidencia CI corresponde a 397ec9f, no al commit documental pendiente de push.

Ajustes documentales menores antes de empaquetar:
1. cms-home-rollout.md pasos 0/10 y DELIVERY.md aún dicen que Arroba recibe exactamente el mismo SHA. Un repositorio nuevo conserva los mismos archivos publicados, no el mismo commit: registrar SHA origen, deployment, manifiesto/hash del snapshot y SHA inicial receptor. No cambiar contenido del snapshot silenciosamente.
2. DELIVERY.md Current state aún sitúa el CI en 7e09c24. Actualizar con SHA/run verificados y distinguir el siguiente SHA pendiente.
3. No describir el fallo Preview como protección intencional suficiente. La base productiva en Preview es configuración pendiente de aislar; no completar el secreto sin separar primero recursos.

Siguiente hito: QA visual y funcional aislada contra versión aprobada, con condiciones de contenido representativas. Después estado real de migraciones, respaldo/captura restaurables, ventana de escrituras, migración/seed y publicación mediante la única vía acordada, con autorizaciones correspondientes. No se ejecutó ninguno de estos pasos externos.

La separación del historial comercial se logrará creando el repositorio receptor desde el snapshot publicado. No dar acceso a la historia original como sustituto de ese paquete.
