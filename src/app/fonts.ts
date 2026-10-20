import { preload } from "react-dom"

/**
 * Preloads the latin brand font files, as next/font/google did. Faces and
 * fallbacks are declared in src/app/fonts.css; latin-ext files load only when
 * a page uses one of their characters.
 */
const PRELOADED_FONTS = [
  "/fonts/manrope-v20-latin.woff2",
  "/fonts/noto-serif-display-v29-latin.woff2",
  "/fonts/noto-serif-display-v29-latin-italic.woff2",
]

export function preloadBrandFonts() {
  for (const href of PRELOADED_FONTS) {
    preload(href, { as: "font", type: "font/woff2", crossOrigin: "anonymous" })
  }
}
