# Clasificación del usuario (19-oct-2026, ejecución 20261019-1634-1934)

Decisión del usuario en el chat, sobre ejemplos lado a lado (carpeta `para-revisar`: artículo, aviso de privacidad, fotos y cuatro capturas de "Carritos de servicio").

- visual:approved-vs-mig:differences — tarjeta "Carritos de servicio" sin foto en /es y /en services, escritorio: el usuario respondió **"carritos: investiga"** (no la acepta). Causa encontrada después: durante la captura de página completa el navegador vuelve a elegir la fuente de la imagen; la tarjeta, que comparte la foto del encabezado ya cargada a 1920w, cambiaba a esa copia y se capturaba antes de pintarla. Corregido en la herramienta de captura (`scripts/visual-compare.mjs`, commit 981c3c4): cada imagen conserva la fuente elegida para el tamaño de pantalla. El sitio no cambia; en navegador normal la foto siempre aparece.
- visual:approved-vs-mig:differences — artículos del blog, aviso de privacidad y fotos recomprimidas: **sin clasificar en esta ejecución** (el usuario solo respondió sobre Carritos). Se clasifican en la ejecución siguiente.

Resultado: no se acepta esta ejecución. Se repite el QA con la corrección de la captura. No se pide autorización de respaldo, migración ni publicación.
