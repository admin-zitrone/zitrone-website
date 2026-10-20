import { homeContentEn } from "./content/en"
import { homeContentEs } from "./content/es"

import type { HomeContent } from "./content/types"
import { routing, type AppLocale } from "@/i18n/routing"
import { assetSrc } from "@/lib/assets.generated"

export type {
  Accent,
  ServiceTheme,
  FeatureIconName,
  ChipIconName,
  RevealWord,
  NavItem,
  LogoFit,
  HeroLogo,
  ServiceCard,
  ServicesOrbitItem,
  SystemTab,
  SystemTabWidget,
  BentoBox,
  BentoCard,
  ServiceLayer,
  ProfilerOption,
  ProfilerItem,
  ClientStory,
  FaqItem,
  FooterColumn,
  HomeContent,
} from "./content/types"

const content: Record<AppLocale, HomeContent> = {
  en: homeContentEn,
  es: homeContentEs,
}

export const assetPath = ""
export const heroImage = assetSrc("site-hero-dining-hall-skyline")

export function getHomeContent(locale: string): HomeContent {
  return content[locale as AppLocale] ?? content[routing.defaultLocale]
}
