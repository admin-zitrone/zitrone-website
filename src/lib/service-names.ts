/**
 * The one place the six services are named.
 *
 * Every surface that names a service (navbar dropdown, home cards, footer,
 * profiler, contact forms, service pages) reads from here, so a
 * service never shows up under two names. Keys are the service themes used by
 * `ServiceTarget["theme"]`. URL slugs are not names and live with the routes.
 */

export type ServiceKey = "dining" | "cafe" | "pantry" | "coffee" | "grab-go" | "catering"

export type ServiceName = {
  /** Full name: page H1, cards, menus, form options. */
  name: string
  /** Compact name for chips and tight UI. */
  short: string
}

export const SERVICE_KEYS: readonly ServiceKey[] = [
  "dining",
  "cafe",
  "pantry",
  "coffee",
  "grab-go",
  "catering",
]

export const SERVICE_NAMES: Record<"es" | "en", Record<ServiceKey, ServiceName>> = {
  es: {
    dining: { name: "Comedor corporativo", short: "Comedor" },
    cafe: { name: "Cafetería corporativa", short: "Cafetería" },
    pantry: { name: "Snacks y bebidas", short: "Snacks y bebidas" },
    coffee: { name: "Máquinas de café y dispensadores de agua", short: "Café y agua" },
    "grab-go": { name: "Carritos de servicio", short: "Carritos" },
    catering: { name: "Catering corporativo", short: "Catering" },
  },
  en: {
    dining: { name: "Corporate dining", short: "Dining" },
    cafe: { name: "Corporate cafe", short: "Cafe" },
    pantry: { name: "Snacks & beverages", short: "Snacks & beverages" },
    coffee: { name: "Coffee machines & water dispensers", short: "Coffee & water" },
    "grab-go": { name: "Service carts", short: "Carts" },
    catering: { name: "Corporate catering", short: "Catering" },
  },
}

/** All six names as a sentence list, for prose and meta descriptions. */
export function serviceNameList(locale: "es" | "en"): string {
  const names = SERVICE_KEYS.map((key) => {
    const { name } = SERVICE_NAMES[locale][key]
    // "Máquinas de café…" stays capitalised only at the start of a sentence.
    return name.charAt(0).toLowerCase() + name.slice(1)
  })
  return new Intl.ListFormat(locale, { style: "long", type: "conjunction" }).format(names)
}
