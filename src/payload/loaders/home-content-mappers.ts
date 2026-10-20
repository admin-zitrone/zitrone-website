import type {
  Accent,
  BentoCard,
  ClientStory,
  FaqItem,
  HeroLogo,
  LogoFit,
  RevealWord,
  ServiceCard,
  FeatureIconName,
  HeroFrame,
  HeroPillar,
  NavItem,
  ServiceLayer,
  ServicesOrbitItem,
  ServiceTheme,
  SystemTab,
} from "@/app/_components/home/content/types"
import type { Home, Logo, Service, Story } from "@/payload/payload-types"

import { cleanString, resolveMediaUrl } from "./shared"

type Block = NonNullable<Home["sections"]>[number]
type ProofBlock = Extract<Block, { blockType: "proofBento" }>
type OperatingSystemBlock = Extract<Block, { blockType: "operatingSystem" }>
type ServiceSystemBlock = Extract<Block, { blockType: "serviceSystemSlider" }>
type HeroBlock = Extract<Block, { blockType: "hero" }>
type ServicesBlock = Extract<Block, { blockType: "servicesCarousel" }>

export type { Block, OperatingSystemBlock, ProofBlock, ServiceSystemBlock }

export function findBlock<T extends Block["blockType"]>(
  blocks: Home["sections"],
  type: T,
): Extract<Block, { blockType: T }> | undefined {
  return (blocks ?? []).find(
    (block): block is Extract<Block, { blockType: T }> => block.blockType === type,
  )
}

export function mapTitleWords(
  words: ReadonlyArray<{ text: string; emphasis?: string | null }> | undefined,
  fallback: RevealWord[],
): RevealWord[] {
  const mapped: RevealWord[] = []
  for (const word of words ?? []) {
    const text = cleanString(word.text)
    if (!text) continue
    mapped.push(word.emphasis === "accent" ? { text, accent: true } : { text })
  }
  return mapped.length > 0 ? mapped : fallback
}

function logoFromRelation(value: number | Logo | undefined | null): HeroLogo | undefined {
  if (!value || typeof value === "number") return undefined
  const src = resolveMediaUrl(value.image)
  const alt = cleanString(value.alt) ?? cleanString(value.name)
  const id = cleanString(value.name) ?? `logo-${value.id}`
  if (!src || !alt) return undefined
  return {
    id,
    src,
    monoSrc: resolveMediaUrl(value.monoImage),
    alt,
    fit: (value.fit as LogoFit) ?? "balanced",
    scale: typeof value.scale === "number" ? value.scale : undefined,
  }
}

export function mapLogos(
  values: ReadonlyArray<number | Logo> | undefined | null,
  fallback: HeroLogo[],
): HeroLogo[] {
  const mapped = (values ?? [])
    .map((value) => logoFromRelation(value))
    .filter((logo): logo is HeroLogo => Boolean(logo))
  return mapped.length > 0 ? mapped : fallback
}

function serviceFromRelation(value: number | Service | undefined): ServiceCard | undefined {
  if (!value || typeof value === "number") return undefined
  const title = cleanString(value.title)
  const eyebrow = cleanString(value.eyebrow) ?? ""
  const copy = cleanString(value.copy) ?? ""
  const accent = (value.accent as Accent) ?? "dining"
  const image = resolveMediaUrl(value.image) ?? ""
  if (!title) return undefined
  const relatedLinks = mapNavItems(value.relatedLinks)
  return {
    title,
    eyebrow,
    accent,
    image,
    copy,
    href: cleanString(value.href),
    ctaLabel: cleanString(value.ctaLabel),
    relatedLinks: relatedLinks.length > 0 ? relatedLinks : undefined,
  }
}

function mapNavItems(
  items: ReadonlyArray<{ label?: string | null; href?: string | null }> | null | undefined,
): NavItem[] {
  return (items ?? [])
    .map((item) => ({ label: cleanString(item.label) ?? "", href: cleanString(item.href) ?? "" }))
    .filter((item) => item.label.length > 0 && item.href.length > 0)
}

export function mapServices(
  values: ReadonlyArray<number | Service> | undefined,
  fallback: ServiceCard[],
): ServiceCard[] {
  const mapped = (values ?? [])
    .map((value) => serviceFromRelation(value))
    .filter((service): service is ServiceCard => Boolean(service))
  return mapped.length > 0 ? mapped : fallback
}

function storyFromRelation(value: number | Story | undefined): ClientStory | undefined {
  if (!value || typeof value === "number") return undefined
  const name = cleanString(value.name)
  const label = cleanString(value.label) ?? ""
  const role = cleanString(value.role) ?? ""
  const quote = cleanString(value.quote) ?? ""
  if (!name) return undefined
  const logoSrc = resolveMediaUrl(value.logo) ?? ""
  const imageSrc = resolveMediaUrl(value.image) ?? ""
  const imageAlt = cleanString(value.imageAlt) ?? name
  return {
    name,
    label,
    role,
    logo: logoSrc,
    logoFit: (value.logoFit as LogoFit) ?? "balanced",
    logoScale: typeof value.logoScale === "number" ? value.logoScale : undefined,
    image: imageSrc,
    imageAlt,
    location: cleanString(value.location),
    repeatsHero: value.repeatsHero ? true : undefined,
    quote,
    quoteHighlight: cleanString(value.quoteHighlight),
  }
}

export function mapStories(
  values: ReadonlyArray<number | Story> | undefined,
  fallback: ClientStory[],
): ClientStory[] {
  const mapped = (values ?? [])
    .map((value) => storyFromRelation(value))
    .filter((story): story is ClientStory => Boolean(story))
  return mapped.length > 0 ? mapped : fallback
}

export function mapFaqs(
  fallback: FaqItem[],
  docs: ReadonlyArray<number | { question?: string | null; answer?: { paragraph?: string | null }[] | null }>,
): FaqItem[] {
  const mapped = docs
    .filter((doc) => typeof doc === "object")
    .map((doc) => ({
      question: cleanString(doc.question) ?? "",
      answer: (doc.answer ?? [])
        .map((paragraph) => cleanString(paragraph.paragraph))
        .filter((paragraph): paragraph is string => Boolean(paragraph)),
    }))
    .filter((doc) => doc.question.length > 0 && doc.answer.length > 0)
  return mapped.length > 0 ? mapped : fallback
}

export function mapProofColumns(
  block: ProofBlock | undefined,
  fallback: BentoCard[][],
): BentoCard[][] {
  if (!block?.columns?.length) return fallback
  const columns = block.columns
    .map((column) => {
      const cards = (column.cards ?? [])
        .map((card): BentoCard | undefined => {
          if (!card) return undefined
          if (card.blockType === "photoCard") {
            const image = resolveMediaUrl(card.image)
            const title = cleanString(card.title)
            const alt = cleanString(card.alt) ?? title ?? ""
            if (!image || !title) return undefined
            return { variant: "photo", title, sub: cleanString(card.sub), image, alt }
          }
          if (card.blockType === "clockCard") {
            const title = cleanString(card.title)
            if (!title) return undefined
            return { variant: "clock", title, tone: "slate" }
          }
          if (card.blockType === "specialtiesCard") {
            const title = cleanString(card.title)
            if (!title) return undefined
            return {
              variant: "specialties",
              title,
              sub: cleanString(card.sub),
              boxes: (card.boxes ?? [])
                .map((box) => ({
                  label: cleanString(box.label) ?? "",
                  size: (box.size as "sm" | "md" | "lg") ?? "md",
                }))
                .filter((box) => box.label.length > 0),
            }
          }
          if (card.blockType === "studiesCard") {
            const image = resolveMediaUrl(card.image)
            const title = cleanString(card.title)
            const alt = cleanString(card.alt) ?? title ?? ""
            if (!image || !title) return undefined
            return {
              variant: "studies",
              title,
              sub: cleanString(card.sub),
              image,
              alt,
            }
          }
          if (card.blockType === "logosCard") {
            const title = cleanString(card.title)
            if (!title) return undefined
            const stats = (card.stats ?? [])
              .map((stat) => ({ value: cleanString(stat.value) ?? "", label: cleanString(stat.label) ?? "" }))
              .filter((stat) => stat.value.length > 0)
            return {
              variant: "logos",
              title,
              sub: cleanString(card.sub),
              tone: (card.tone as "green" | "slate") ?? "green",
              stats: stats.length > 0 ? stats : undefined,
              hideLogos: card.hideLogos ? true : undefined,
            }
          }
          if (card.blockType === "plainCard") {
            const title = cleanString(card.title)
            if (!title) return undefined
            return {
              variant: "plain",
              title,
              sub: cleanString(card.sub),
              tone: (card.tone as "natural" | "ocean") ?? "natural",
            }
          }
          return undefined
        })
        .filter((card): card is BentoCard => Boolean(card))
      return cards
    })
    .filter((column) => column.length > 0)
  return columns.length > 0 ? columns : fallback
}

export function mapSystemTabs(
  block: OperatingSystemBlock | undefined,
  fallback: SystemTab[],
): SystemTab[] {
  if (!block?.tabs?.length) return fallback
  const mapped = block.tabs
    .map((tab): SystemTab | undefined => {
      const key = cleanString(tab.key)
      const title = cleanString(tab.title)
      const panelTitle = cleanString(tab.panelTitle)
      const image = resolveMediaUrl(tab.image)
      if (!key || !title || !panelTitle || !image) return undefined
      /* The step visuals (widget and badge) chart sourced figures and stay in
         code, matched to the CMS step by its key. */
      const codeTab = fallback.find((candidate) => candidate.key === key)
      // The sentence parts carry their own joining spaces, so they are not trimmed.
      const sentence = tab.stageCopy
      return {
        key,
        icon: (tab.icon as FeatureIconName | null) ?? undefined,
        stage: cleanString(tab.stage),
        stageCopy:
          sentence?.highlight && cleanString(sentence.highlight)
            ? { before: sentence.before ?? "", highlight: sentence.highlight, after: sentence.after ?? undefined }
            : undefined,
        title,
        copy: cleanString(tab.copy) ?? "",
        panelTitle,
        panelCopy: cleanString(tab.panelCopy) ?? "",
        image,
        tone: (tab.tone as SystemTab["tone"] | null) ?? undefined,
        visualWidget: codeTab?.visualWidget,
        visualBadge: codeTab?.visualBadge,
      }
    })
    .filter((tab): tab is SystemTab => Boolean(tab))
  return mapped.length > 0 ? mapped : fallback
}

export function mapServiceLayers(
  block: ServiceSystemBlock | undefined,
  fallback: ServiceLayer[],
): ServiceLayer[] {
  if (!block?.layers?.length) return fallback
  const mapped = block.layers
    .map((layer): ServiceLayer | undefined => {
      const title = cleanString(layer.title)
      const image = resolveMediaUrl(layer.image)
      if (!title || !image) return undefined
      return {
        title,
        shortTitle: cleanString(layer.shortTitle),
        theme: (layer.theme as ServiceTheme) ?? "dining",
        image,
        copy: cleanString(layer.copy),
        href: cleanString(layer.href),
        ctaLabel: cleanString(layer.ctaLabel),
        features: (layer.features ?? [])
          .map((feature) => ({
            title: cleanString(feature.title) ?? "",
            text: cleanString(feature.text) ?? "",
            icon: (feature.icon as FeatureIconName | null) ?? "spark",
          }))
          .filter((feature) => feature.title.length > 0),
      }
    })
    .filter((layer): layer is ServiceLayer => Boolean(layer))
  return mapped.length > 0 ? mapped : fallback
}

export function mapHeroFrames(block: HeroBlock | undefined, fallback: HeroFrame[]): HeroFrame[] {
  const mapped = (block?.frames ?? [])
    .map((frame): HeroFrame | undefined => {
      const accentWord = cleanString(frame.accentWord)
      const image = resolveMediaUrl(frame.image)
      const alt = cleanString(frame.alt)
      if (!accentWord || !image || !alt) return undefined
      return { pillar: frame.pillar as HeroPillar, accentWord, image, alt }
    })
    .filter((frame): frame is HeroFrame => Boolean(frame))
  return mapped.length > 0 ? mapped : fallback
}

export function mapOrbitItems(
  block: ServicesBlock | undefined,
  fallback: ServicesOrbitItem[],
): ServicesOrbitItem[] {
  const mapped = (block?.orbitItems ?? [])
    .map((item): ServicesOrbitItem | undefined => {
      const title = cleanString(item.title)
      const image = resolveMediaUrl(item.image)
      if (!title || !image) return undefined
      return { title, theme: item.theme as ServiceTheme, image, copy: cleanString(item.copy) ?? "" }
    })
    .filter((item): item is ServicesOrbitItem => Boolean(item))
  return mapped.length > 0 ? mapped : fallback
}
