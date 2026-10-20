import { routing, type AppLocale } from "@/i18n/routing"

type BoundaryCopy = {
  notFoundEyebrow: string
  notFoundTitle: string
  notFoundBody: string
  notFoundHomeCta: string
  errorEyebrow: string
  errorTitle: string
  errorBody: string
  errorRetryCta: string
  errorHomeCta: string
}

const copy: Record<AppLocale, BoundaryCopy> = {
  en: {
    notFoundEyebrow: "404",
    notFoundTitle: "We couldn't find that page.",
    notFoundBody:
      "The link may have moved or the page no longer exists. Head back home or browse the journal.",
    notFoundHomeCta: "Back to home",
    errorEyebrow: "Something broke",
    errorTitle: "We hit an unexpected error.",
    errorBody:
      "We've logged the issue. You can retry, or head back to the home page while we look into it.",
    errorRetryCta: "Try again",
    errorHomeCta: "Back to home",
  },
  es: {
    notFoundEyebrow: "404",
    notFoundTitle: "No encontramos esa página.",
    notFoundBody:
      "Es posible que el enlace haya cambiado o que la página ya no exista. Regresa al inicio o explora el blog.",
    notFoundHomeCta: "Volver al inicio",
    errorEyebrow: "Algo falló",
    errorTitle: "Tuvimos un error inesperado.",
    errorBody:
      "Ya registramos el problema. Puedes reintentar o volver al inicio mientras lo revisamos.",
    errorRetryCta: "Reintentar",
    errorHomeCta: "Volver al inicio",
  },
}

export function getBoundaryCopy(locale: string): BoundaryCopy {
  return (routing.locales as readonly string[]).includes(locale)
    ? copy[locale as AppLocale]
    : copy[routing.defaultLocale]
}
