# Documentación

Índice único de `docs/`. Si un documento vigente contradice a uno histórico, prevalece el vigente. Punto de entrada técnico: [README.md](../README.md). Estado de la entrega: [DELIVERY.md](../DELIVERY.md) y [registro de avance](delivery-progress.md).

**Facturación: flujo del sitio eliminado por decisión del usuario (reconfirmada 12-oct-2026).** El enlace de correo es definitivo. No es una funcionalidad pendiente, diferida ni un requisito de entrega; las propuestas de automatización en auditorías antiguas están sustituidas.

## Publicación y entrega de esta versión

Secuencia decidida el 18-oct: QA de la versión final, respaldo y migración; publicar en el sitio origen fusionando a `main`; después Arroba recibe los mismos archivos publicados en un repositorio privado nuevo (otro SHA, mismo árbol; correspondencia registrada en el paso 10 del procedimiento) y los despliega en su Vercel.

| Tema | Documento | Estado |
| --- | --- | --- |
| Procedimiento único de publicación y recuperación | [cms-home-rollout.md](cms-home-rollout.md) | Preparado y ensayado en base local; ningún paso ejecutado en producción |
| Plan rector de entrega a Arroba | [plan-entrega-arroba-2026-10-13.md](plan-entrega-arroba-2026-10-13.md) | Plan; recepción por Arroba pendiente de confirmar |
| Ficha técnica para Arroba | [handoff-arroba-2026-10-12.md](handoff-arroba-2026-10-12.md) | Revisión 3 (15-oct) |
| Recepción en el Vercel de Arroba | [vercel-handoff.md](vercel-handoff.md) | Equipo receptor y dependencias por confirmar |
| Dominios y corte | [domain-migration-checklist.md](domain-migration-checklist.md) | Referencia; Arroba genera los registros desde su proyecto |
| Plan de QA aislado de la versión final | [plan-qa-aislado-2026-10-18.md](plan-qa-aislado-2026-10-18.md), runner `scripts/qa-release/run.sh` | Revisión 3.1: revisiones de Codex del [plan](codex-qa-plan-review-2026-10-18.md) y del [runner](codex-qa-runner-review-2026-10-18.md), R12–R14 [aceptadas](codex-r12-r14-acceptance-2026-10-19.md), pausa de clasificación antes de limpiar; ensayado en seco sin producción; ejecución pendiente de autorización |
| Pendientes reales | [pendientes-entrega-2026-10-12.md](pendientes-entrega-2026-10-12.md) | Lista vigente, con actualización del 18-oct |
| Inventario del repositorio | [inventario-repositorio-2026-10-15.md](inventario-repositorio-2026-10-15.md) | Ramas, secretos, historial, residuos, decisiones |
| Plan de organización del repositorio | [plan-organizacion-repositorio.md](plan-organizacion-repositorio.md) | En curso |

## Paquete de entrega

| # | Entregable | Documento | Estado |
| --- | --- | --- | --- |
| 1 | Manual técnico, release y rollback | [README.md](../README.md) | Listo para revisión |
| 2 | Manual de contenido por idioma y límites del CMS | [manual-contenido.md](manual-contenido.md) | Listo para revisión; capacitación pendiente |
| 3 | Cuentas, owners, suplentes, costos, alertas | [operacion-y-entrega.md](operacion-y-entrega.md#cuentas-y-responsables) | Plantilla; datos del cliente pendientes |
| 4 | Respaldo y restauración (DB y medios) | [operacion-y-entrega.md](operacion-y-entrega.md#respaldo-y-restauración-base-de-datos-y-medios) | Simulacro sintético hecho; política y restauración real pendientes |
| 5 | Operación de leads, guion de prueba de inbox | [operacion-y-entrega.md](operacion-y-entrega.md#operación-de-leads), [contact-email-delivery.md](contact-email-delivery.md) | Guion listo; prueba real pendiente de autorización |
| 6 | Capacitación, soporte, limitaciones, acta de aceptación | [operacion-y-entrega.md](operacion-y-entrega.md#acta-de-aceptación-pendiente-de-firma) | Pendiente de firma |
| 7 | Analytics: receta GTM única y paquete de medición | [analytics/gtm-activation.md](analytics/gtm-activation.md), [analytics/paquete-medicion.md](analytics/paquete-medicion.md), [analytics-tracking.md](analytics-tracking.md) | Listo; ejecución con acceso pendiente |
| 8 | Afirmaciones públicas a aprobar | [registro-de-afirmaciones.md](registro-de-afirmaciones.md) | Pendiente de aprobación |
| 9 | Accesibilidad y excepción de marca | [accessibility.md](accessibility.md) | Gate verde; excepción y pase manual pendientes |

## Referencia técnica vigente

- Diseño, imágenes y correo: [DESIGN.md](../DESIGN.md), [ASSETS.md](../ASSETS.md), [EMAILS.md](../EMAILS.md), [design-system/README.md](design-system/README.md).
- Páginas de servicio (reglas de contenido): [services/service-page-contract.md](services/service-page-contract.md).
- Leads: [contact-email-delivery.md](contact-email-delivery.md), copia opcional a Google Sheets [leads-google-sheet.md](leads-google-sheet.md) (`google-sheets/leads-webhook.gs`).
- Medición: [analytics-tracking.md](analytics-tracking.md), plantilla `gtm/zitrone-lead-tracking.gtm.json`, [observability-taxonomy.md](observability-taxonomy.md).
- Seguridad: [security-operations-checklist.md](security-operations-checklist.md).

## Revisiones y auditorías (históricas)

Registran hallazgos y su resolución en su fecha; no describen el estado actual.

- Codex: [01-oct](codex-review-2026-10-01.md), [05-oct](codex-rereview-2026-10-05.md), [11-oct](codex-review-2026-10-11.md), [12-oct R5/R6](codex-r5-r6-review-2026-10-12.md), [15-oct fuentes](revision-fuentes-2026-10-15.md), [15-oct imágenes](revision-imagenes-2026-10-15.md), [15-oct analytics](analytics/preparacion-handoff-2026-10-15.md), [17-oct R7–R9](codex-release-review-2026-10-17.md), [18-oct R10/R11](codex-r7-r9-rereview-2026-10-18.md), [18-oct plan de QA](codex-qa-plan-review-2026-10-18.md), [18-oct runner de QA](codex-qa-runner-review-2026-10-18.md).
- Claude: [remediación, brief](claude-remediation-brief-2026-09-30.md) y [resultados](claude-remediation-results.md), [performance móvil](performance-mobile-2026-10-07.md), [limpieza 24-sep](cleanup/cleanup-audit-2026-09-24.md).
- Auditorías de entrega: [07-sep](delivery-readiness-audit-2026-09-07.md), [30-sep](delivery-readiness-audit-2026-09-30.md) (`audit-evidence-2026-09-30.txt`), [handoff 01-jul](handoff-audit-2026-07-01.md), [plataforma 30-abr](zitrone-platform-audit-2026-04-30.md), [migración 22-sep](migration-validation-2026-09-22.md) (`gtm-public-resource-2026-09-22.json`).

## Sustituidos y material de origen del proyecto

Se conservan como historial. Pueden contener rutas absolutas de la máquina original (`Documents/On It`), Sanity o el formulario de facturación, que ya no existen; sus enlaces rotos no se corrigen.

- Sustituidos, con aviso al inicio: [vercel-deployment-runbook.md](vercel-deployment-runbook.md), [environment-readiness-checklist.md](environment-readiness-checklist.md), [payload-migration-runbook.md](payload-migration-runbook.md), [home-delivery-checklist.md](home-delivery-checklist.md).
- Abril–mayo 2026, primeras notas: [project-brief.md](project-brief.md), [decisions/](decisions/0001-project-organization.md), [registry.md](registry.md), [sections-copy-map.md](sections-copy-map.md), notas del sistema de botones (`button-*.md`), planeación del sistema de diseño en `design-system/_archive/`.

## Evidencia

`evidence/<tema>-<fecha>/`: salidas de pruebas, capturas y ensayos citados por los documentos anteriores. La más reciente: [ensayo de migración y vuelta atrás, 18-oct](evidence/cms-home-migration-rehearsal-2026-10-18/README.md).
