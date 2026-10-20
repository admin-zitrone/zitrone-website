# Fase C: salidas de red

- Procesos Node (build, servidores, migraciones, seed, tareas): {"blocked":25}; nada transmitido fuera de loopback.
- Navegador, candidato: {"local":18565}
- Navegador, sitio aprobado: {"transmitted":8470,"blocked":84} (transmitted = solo GET/HEAD a www.zitrone.mx y 3f0alighr0eq0f6i.public.blob.vercel-storage.com)

## Bloqueadas en procesos Node

- admin: fetch https://telemetry.payloadcms.com/events
- b0-old-home: fetch https://telemetry.payloadcms.com/events
- b0-old-read: fetch https://telemetry.payloadcms.com/events
- b5-new-home: fetch https://telemetry.payloadcms.com/events
- b5-new-read: fetch https://telemetry.payloadcms.com/events
- b5-old-read: fetch https://telemetry.payloadcms.com/events
- build-mig: fetch https://telemetry.payloadcms.com/events
- capture-new: fetch https://telemetry.payloadcms.com/events
- capture-old: fetch https://telemetry.payloadcms.com/events
- lead: fetch https://telemetry.payloadcms.com/events
- migrate-mig: fetch https://telemetry.payloadcms.com/events
- rb-down: fetch https://telemetry.payloadcms.com/events
- rb-up: fetch https://telemetry.payloadcms.com/events
- rb3-old-home: fetch https://telemetry.payloadcms.com/events
- rb3-old-read: fetch https://telemetry.payloadcms.com/events
- rb4-new-home: fetch https://telemetry.payloadcms.com/events
- serve-mig: fetch https://telemetry.payloadcms.com/events
- status-mig: fetch https://telemetry.payloadcms.com/events
- status-orig: fetch https://telemetry.payloadcms.com/events
- touch-blogPosts: fetch https://telemetry.payloadcms.com/events
- touch-faqs: fetch https://telemetry.payloadcms.com/events

## Simuladas en el sitio aprobado (respondidas en local, no enviadas)

- ninguna

## Resultado: ninguna salida fuera de la política
