# Fuentes autoalojadas y enlace de preferencias de cookies — evidencia, 15-oct-2026

Claude. Responde a [revision-fuentes-2026-10-15.md](../../revision-fuentes-2026-10-15.md) (Codex): procedencia y licencias, evidencia reproducible del cambio de fuentes, e investigación del fallo del enlace "Cookie preferences". No se publicó nada.

## Versiones comparadas

| | Contenido |
| --- | --- |
| **Base** | `4563464`, con fuentes de `next/font/google` |
| **Candidata** | `146b966` (fuentes autoalojadas) más el commit de este informe (corrección del pie con foco de teclado y pruebas de consentimiento) |

Cada versión se probó en una copia limpia (`git archive`, sin `.env`) con Node 24.21.0 (binario oficial, SHA256 verificado) y `npm ci`, en macOS. La versión integrada con las imágenes no se validó aquí; queda para la validación conjunta.

## 1. Procedencia y licencias

- Los archivos y sus licencias están en `public/fonts/`, con [README](../../../public/fonts/README.md): origen, versión, subconjunto y licencia de cada archivo.
- Ambas familias usan la SIL Open Font License 1.1. Los textos vienen de `github.com/google/fonts`. Ninguna licencia declara un nombre de fuente reservado, así que los archivos se pueden redistribuir sin cambios.
- Los créditos de copyright de las licencias coinciden con los que trae cada fuente en su tabla `name` (leída con fontTools). Manrope: versión 4.504, eje `wght` 200–800. Noto Serif Display: versión 2.003, eje `wght` 100–900.

## 2. Mismos archivos que antes

[hashes.txt](hashes.txt) compara el SHA-256 de los 6 archivos de `public/fonts` con los que emitió el build base en `.next/static/media`. **Los 6 coinciden.**

Los tres archivos que el build base precargaba (marcados `.p.`) son los mismos tres que precarga `src/app/fonts.ts`:
- Manrope latin
- Noto Serif Display latin
- Noto Serif Display latin cursiva

## 3. El build ya no descarga fuentes

Se compilaron ambas versiones sin red de salida, permitiendo solo localhost, con `sandbox-exec` y el perfil [scripts/no-network.sb](scripts/no-network.sb). Se verificó que, bajo ese perfil, `curl https://fonts.gstatic.com/` falla.

| Build sin red | Resultado | Log |
| --- | --- | --- |
| Candidata | **Pasa** | [logs/build-offline-candidate.log](logs/build-offline-candidate.log) |
| Base | **Falla** en `manrope_7d0f6077.module.css` (descarga de Google) | [logs/build-offline-base.log](logs/build-offline-base.log) |

Comando: `rm -rf .next && NEXT_TELEMETRY_DISABLED=1 sandbox-exec -f no-network.sb npm run build`.

## 4. Comparación visual

`npm run test:visual` recorre 30 rutas, ES/EN, en escritorio (1440) y móvil (390). Primero se generaron capturas de referencia con la base (`--update-snapshots`); después la candidata se comparó contra ellas, con la tolerancia del repo (0.2 %). Script: [scripts/fontcmp.sh](scripts/fontcmp.sh).

| Corrida | Resultado |
| --- | --- |
| Base: generación de referencias | 60/60 ([log](logs/visual-base-google-baseline.log)) |
| Candidata contra la base | **60/60 iguales** ([log](logs/visual-candidate-vs-base.log)) |
| Primera corrida de la candidata, antes de la corrección del pie | 59/60; difiere la home ES en escritorio ([log](logs/visual-candidate-css-first-run.log)) |
| Home ES ×3 en la base contra sus propias referencias | 3/3 fallan con la misma diferencia ([log](logs/visual-base-home-repeat.log)) |

Sobre la diferencia de la home: está solo en el widget rotativo de "Cada detalle, pensado…" (274,783 píxeles, 3 %). Ese widget también cambia entre corridas de la base, así que no viene de las fuentes. Es un punto inestable de la prueba visual, a considerar al regenerar las referencias.

Aparte de las capturas, en el navegador de la candidata las fuentes se sirven desde `/fonts` con `Cache-Control: public, max-age=31536000, immutable`, `document.fonts` reporta Manrope y Noto Serif Display cargadas, y el HTML no contiene ninguna referencia a Google Fonts.

## 5. Enlace "Cookie preferences": defecto real de accesibilidad

**Causa.** El pie es `position: sticky; bottom: 0; z-index: 0` y queda detrás de `.ds-page-shell` (`z-index: 1`), que lo va descubriendo al hacer scroll. Por eso sus enlaces miden como dentro de la ventana aunque el contenido los tape.
- Con la página arriba, el botón está en y=638 de 720, pero `elementFromPoint` devuelve `.ds-container` de la portada ([scripts/footer-cover-chain-probe.mjs](scripts/footer-cover-chain-probe.mjs)).
- Playwright no ve motivo para hacer scroll, y el clic lo recibe el contenido que lo tapa.
- Pasaba a veces según dónde quedara el scroll en los reintentos; también falló en la base ([log](logs/consent-x3-base-before-fix.log)).

**Impacto real.** Con teclado (Tab) el navegador tampoco desplaza la página hasta el enlace enfocado, así que el foco queda tapado: 18 de 21 controles del pie en escritorio y 21 de 21 en móvil ([scripts/footer-focus-probe.mjs](scripts/footer-focus-probe.mjs)). Esto incumple WCAG 2.2, criterio 2.4.11 (el foco no debe quedar oculto). No es solo un problema de sincronización de la prueba.

**Corrección** en `src/design-system/components/marketing.css`.
- Mientras hay foco de teclado (`:focus-visible`) dentro del pie, este pasa a `position: static`. El enlace enfocado queda debajo del contenido y el navegador lo desplaza a la vista.
- Clics y tacto no activan `:focus-visible`, así que el efecto cortina no cambia para ratón y táctil.
- Resultado: 0 de 21 controles tapados en escritorio y en móvil, en la home, el blog y una página de servicio.

**Pruebas** en `tests/e2e/consent.spec.ts`. No se usó clic forzado, esperas fijas ni se eliminó ninguna prueba.
- "the footer link reopens preferences after a decision" ahora baja al final de la página antes del clic, como tiene que hacer una persona para ver el enlace.
- Nueva prueba "keyboard focus in the footer is never hidden behind the page": tabula desde arriba hasta "Cookie preferences", comprueba que ningún control del pie enfocado esté tapado, y abre el panel con Enter.
- Sin la corrección, la prueba nueva **falla** en el primer control del pie, "Contact us" ([log](logs/consent-keyboard-test-base-without-fix.log)).

| Corrida (candidata) | Resultado |
| --- | --- |
| consent.spec ×5, primera corrida | 29/35; los 6 fallos son la primera tanda en paralelo, en todas las pruebas, por tiempo agotado a ~41 s ([log](logs/consent-x5-candidate-run0-coldstart.log)) |
| consent.spec ×5, corridas 2 y 3 | **35/35** y **35/35** ([1](logs/consent-x5-candidate-run1.log), [2](logs/consent-x5-candidate-run2.log)) |
| E2E completo, dos corridas | **62/62** y **62/62** ([1](logs/e2e-candidate-run1.log), [2](logs/e2e-candidate-run2.log)) |

La primera corrida ×5 falló en pruebas que no dependen del cambio, en la primera tanda de trabajadores y con la máquina ocupada. No volvió a ocurrir en dos corridas más ni en dos E2E completos. Queda registrada como arranque en frío no explicado, no como resuelta.

## Límites

- Una sola máquina, macOS. GitHub Actions (Linux) no se ha ejecutado.
- La versión integrada con los cambios de imágenes no se validó aquí.
- No se hizo revisión manual con lector de pantalla. La corrección del foco se comprobó con Tab en Chromium, no en Safari ni Firefox.
- No se publicó ni se tocó la base alojada, DNS, GTM ni el correo.
