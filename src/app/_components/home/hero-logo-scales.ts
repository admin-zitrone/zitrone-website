import type { HeroLogo } from "./content/types"

/**
 * Per-logo optical correction, tuned against the hero ribbon so every mark
 * reads at the same visual weight despite wildly different artwork bounds
 * (Ford's oval carries far less ink than Amazon's wordmark at the same box).
 *
 * The scale multiplies artwork that each surface has already fitted to its own
 * chip, so the same number holds the same proportions on a smaller chip. Any
 * surface that wants the hero's balance should run its logos through
 * `withHeroLogoScales` rather than re-tuning its own table.
 */
const HERO_LOGO_OPTICAL_SCALES: Record<string, number> = {
  amex: 1.3,
  uber: 1.08,
  stripe: 1.33,
  "mercado-libre": 1.15,
  att: 1.16,
  ford: 3,
  salesforce: 1.42,
  santander: 1.12,
  /* Retired client — kept so the entry survives if odoo is reactivated in
     `content/shared.ts`. Unused while that definition is inactive. */
  odoo: 2.1,
  doordash: 1.32,
  nike: 1.9,
  puma: 1.28,
  pinterest: 1,
  hilton: 2.2,
  disney: 1.22,
  "coca-cola": 1.05,
  paypal: 1,
  chanel: 1,
  henkel: 1.32,
  amazon: 1.2,
  ufc: 1.9,
  chobani: 1.12,
  crunchyroll: 1.15,
  galderma: 1.25,
}

/** Applies the hero ribbon's optical balance, keeping any per-logo override. */
export function withHeroLogoScales(logos: HeroLogo[]): HeroLogo[] {
  return logos.map((logo) => ({
    ...logo,
    scale: HERO_LOGO_OPTICAL_SCALES[logo.id] ?? logo.scale ?? 1,
  }))
}

const SERVICE_RIBBON_LOGO_ORDER = [
  "uber",
  "doordash",
  "amazon",
  "chobani",
  "stripe",
  "mercado-libre",
  "att",
  "ford",
  "pinterest",
  "crunchyroll",
  "pg",
  "disney",
  "nike",
  "amex",
  "coca-cola",
  "paypal",
  "chanel",
  "henkel",
  "galderma",
  "hilton",
  "santander",
  "ufc",
  /* Pending contract: inactive in `content/shared.ts`, so skipped until published. */
  "bacardi",
  "jose-cuervo",
] as const

const SERVICE_RIBBON_OVERRIDES: Record<
  string,
  Partial<Pick<HeroLogo, "fit" | "scale">>
> = {
  ford: { fit: "wide", scale: 1.85 },
  disney: { scale: 1.4 },
  doordash: { scale: 1.4 },
  nike: { scale: 1.45 },
  amex: { scale: 0.92 },
  uber: { scale: 0.88 },
  "coca-cola": { scale: 1.05 },
  pg: { fit: "compact", scale: 1.05 },
  hilton: { scale: 2 },
  santander: { fit: "wide", scale: 1.02 },
  ufc: { scale: 1.7 },
  crunchyroll: { scale: 1.3 },
  galderma: { scale: 1.25 },
}

/** Matches the logo order and optical balance used by service-page ribbons. */
export function withServiceRibbonLogoScales(logos: HeroLogo[]): HeroLogo[] {
  return SERVICE_RIBBON_LOGO_ORDER.flatMap((id) => {
    const logo = logos.find((item) => item.id === id)
    if (!logo) return []
    return [{ ...logo, ...SERVICE_RIBBON_OVERRIDES[id] }]
  })
}
