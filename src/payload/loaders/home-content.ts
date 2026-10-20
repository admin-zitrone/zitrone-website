import { cache } from "react"

import { getHomeContent as getStaticHomeContent } from "@/app/_components/home/home-data"
import type { HomeContent } from "@/app/_components/home/content/types"
import type { Home } from "@/payload/payload-types"

import { getPayloadClient } from "./client"
import {
  findBlock,
  mapFaqs,
  mapHeroFrames,
  mapOrbitItems,
  mapLogos,
  mapProofColumns,
  mapServiceLayers,
  mapServices,
  mapStories,
  mapSystemTabs,
  mapTitleWords,
} from "./home-content-mappers"
import { getResolvedSiteSettings } from "./site-settings"
import {
  cleanString,
  isSupportedLocale,
  mapPayloadCta,
  resolveMediaUrl,
  withTimeout,
} from "./shared"

type Locale = "en" | "es"

export const getResolvedHomeContent = cache(
  async (locale: string): Promise<HomeContent> => {
    const safeLocale: Locale = isSupportedLocale(locale) ? locale : "es"
    const base = getStaticHomeContent(safeLocale)
    const loaderTimeoutMs = 4000

    // The home, navigation and footer come from the code files unless the CMS
    // is chosen explicitly (decision of 19 Oct 2026; docs/cms-home-rollout.md).
    if (process.env.HOME_CONTENT_SOURCE !== "cms") {
      return base
    }

    try {
      const payload = await withTimeout(
        getPayloadClient(),
        loaderTimeoutMs,
        "Payload client",
      )
      const [siteSettings, faqResult, home] = await withTimeout(
        Promise.all([
          getResolvedSiteSettings(safeLocale),
          payload.find({
            collection: "faqs",
            locale: safeLocale,
            fallbackLocale: "es",
            sort: "createdAt",
            limit: 50,
            depth: 0,
          }),
          payload.findGlobal({
            slug: "home",
            locale: safeLocale,
            fallbackLocale: "es",
            depth: 2,
          }) as Promise<Home>,
        ]),
        loaderTimeoutMs,
        "Payload home content query",
      )

      const blocks = home.sections
      const heroBlock = findBlock(blocks, "hero")
      const servicesBlock = findBlock(blocks, "servicesCarousel")
      const proofBlock = findBlock(blocks, "proofBento")
      const featuredMediaBlock = findBlock(blocks, "featuredMedia")
      const opSysBlock = findBlock(blocks, "operatingSystem")
      const sliderBlock = findBlock(blocks, "serviceSystemSlider")
      const storiesBlock = findBlock(blocks, "stories")
      const faqBlock = findBlock(blocks, "faq")

      const heroLogos = mapLogos(heroBlock?.heroLogos, base.heroLogos)
      const serviceCards = mapServices(servicesBlock?.services, base.serviceCards)
      const clientStories = mapStories(storiesBlock?.stories, base.clientStories)
      const proofColumns = mapProofColumns(proofBlock, base.proofColumns)
      const systemTabs = mapSystemTabs(opSysBlock, base.systemTabs)
      const serviceLayers = mapServiceLayers(sliderBlock, base.serviceLayers)
      const heroFrames = mapHeroFrames(heroBlock, base.sections.hero.frames)
      const servicesOrbitItems = mapOrbitItems(servicesBlock, base.servicesOrbitItems)
      const selectedFaqs = (faqBlock?.faqs ?? []).filter((faq) => typeof faq === "object")
      const ribbonStatValue = heroBlock?.ribbonStat?.value
      const ribbonStatLabel = cleanString(heroBlock?.ribbonStat?.label)
      const featuredMediaLogos = mapLogos(
        featuredMediaBlock?.logos,
        base.sections.featuredMedia.logos,
      )
      const operatingSystemLabels = opSysBlock?.labels as
        | {
            sectionLabel?: string | null
            listAriaLabel?: string | null
            previous?: string | null
            next?: string | null
          }
        | undefined

      const componentLabels: HomeContent["componentLabels"] = {
        servicesCarousel: {
          ...base.componentLabels.servicesCarousel,
          regionLabel:
            cleanString(servicesBlock?.labels?.regionLabel) ??
            base.componentLabels.servicesCarousel.regionLabel,
          previous:
            cleanString(servicesBlock?.labels?.previous) ??
            base.componentLabels.servicesCarousel.previous,
          next:
            cleanString(servicesBlock?.labels?.next) ??
            base.componentLabels.servicesCarousel.next,
          progressLabel:
            cleanString(servicesBlock?.labels?.progressLabel) ??
            base.componentLabels.servicesCarousel.progressLabel,
          slideTemplate:
            cleanString(servicesBlock?.labels?.slideTemplate) ??
            base.componentLabels.servicesCarousel.slideTemplate,
          viewService:
            cleanString(servicesBlock?.labels?.viewService) ??
            base.componentLabels.servicesCarousel.viewService,
          logosAriaLabel:
            cleanString(servicesBlock?.labels?.logosAriaLabel) ??
            base.componentLabels.servicesCarousel.logosAriaLabel,
        },
        serviceSystem: {
          ...base.componentLabels.serviceSystem,
          ...(sliderBlock?.labels
            ? Object.fromEntries(
                Object.entries(sliderBlock.labels)
                  .map(([k, v]) => [k, cleanString(v as string | null | undefined)])
                  .filter(([, v]) => v !== undefined),
              )
            : {}),
        },
        systemTabs: {
          sectionLabel:
            cleanString(operatingSystemLabels?.sectionLabel) ??
            base.componentLabels.systemTabs.sectionLabel,
          listAriaLabel:
            cleanString(operatingSystemLabels?.listAriaLabel) ??
            base.componentLabels.systemTabs.listAriaLabel,
          previous:
            cleanString(operatingSystemLabels?.previous) ??
            base.componentLabels.systemTabs.previous,
          next:
            cleanString(operatingSystemLabels?.next) ??
            base.componentLabels.systemTabs.next,
        },
        storiesTabs: {
          tablistAriaLabel:
            cleanString(storiesBlock?.labels?.tablistAriaLabel) ??
            base.componentLabels.storiesTabs.tablistAriaLabel,
        },
        /* The profiler encodes real service logic and is maintained in the
           static content files only; CMS overrides are intentionally ignored. */
        profiler: base.componentLabels.profiler,
      }

      const footerCtas = siteSettings?.footerCtas ?? []
      const footerColumns =
        siteSettings?.footerColumns && siteSettings.footerColumns.length > 0
          ? siteSettings.footerColumns
          : base.footerColumns

      return {
        ...base,
        meta: {
          ...base.meta,
          title: cleanString(home.meta?.title) ?? base.meta.title,
          description: cleanString(home.meta?.description) ?? base.meta.description,
          siteName:
            cleanString(home.meta?.siteName) ??
            siteSettings?.siteName ??
            base.meta.siteName,
          ogImage:
            resolveMediaUrl(home.meta?.ogImage) ??
            siteSettings?.defaultSeo?.ogImage ??
            base.meta.ogImage,
        },
        // One place for the navigation: the header global (Settings > Website header).
        primaryNav:
          siteSettings?.primaryNav && siteSettings.primaryNav.length > 0
            ? siteSettings.primaryNav
            : base.primaryNav,
        heroLogos,
        serviceCards,
        servicesOrbitItems,
        clientStories,
        proofColumns,
        systemTabs,
        serviceLayers,
        componentLabels,
        faqs: mapFaqs(base.faqs, selectedFaqs.length > 0 ? selectedFaqs : faqResult.docs),
        footerColumns,
        sections: {
          ...base.sections,
          hero: {
            ...base.sections.hero,
            navAriaLabel:
              cleanString(heroBlock?.navAriaLabel) ?? base.sections.hero.navAriaLabel,
            mobileNavAriaLabel:
              cleanString(heroBlock?.mobileNavAriaLabel) ??
              base.sections.hero.mobileNavAriaLabel,
            menuOpenLabel:
              cleanString(heroBlock?.menuOpenLabel) ?? base.sections.hero.menuOpenLabel,
            menuCloseLabel:
              cleanString(heroBlock?.menuCloseLabel) ?? base.sections.hero.menuCloseLabel,
            title: cleanString(heroBlock?.title) ?? base.sections.hero.title,
            titleEmphasis: cleanString(heroBlock?.titleEmphasis),
            frames: heroFrames,
            copy: cleanString(heroBlock?.copy) ?? base.sections.hero.copy,
            copyShort: cleanString(heroBlock?.copyShort),
            ribbonStat:
              typeof ribbonStatValue === "number" && ribbonStatLabel
                ? { value: ribbonStatValue, label: ribbonStatLabel }
                : undefined,
            ribbonLabel:
              cleanString(heroBlock?.ribbonLabel) ?? base.sections.hero.ribbonLabel,
            marqueeAriaLabel:
              cleanString(heroBlock?.marqueeAriaLabel) ??
              base.sections.hero.marqueeAriaLabel,
            cta: mapPayloadCta(heroBlock?.cta) ?? base.sections.hero.cta,
          },
          services: {
            ...base.sections.services,
            kicker: cleanString(servicesBlock?.kicker) ?? base.sections.services.kicker,
            titleAriaLabel:
              cleanString(servicesBlock?.titleAriaLabel) ??
              base.sections.services.titleAriaLabel,
            titleWords: mapTitleWords(
              servicesBlock?.titleWords,
              base.sections.services.titleWords,
            ),
            copy: cleanString(servicesBlock?.copy) ?? base.sections.services.copy,
            coverCopy: cleanString(servicesBlock?.coverCopy),
            ctaPrimary:
              mapPayloadCta(servicesBlock?.ctaPrimary) ?? base.sections.services.ctaPrimary,
            ctaSecondary:
              mapPayloadCta(servicesBlock?.ctaSecondary) ?? base.sections.services.ctaSecondary,
          },
          proof: {
            ...base.sections.proof,
            kicker: cleanString(proofBlock?.kicker),
            clientLogosAriaLabel:
              cleanString(proofBlock?.clientLogosAriaLabel) ??
              base.sections.proof.clientLogosAriaLabel,
            headingTrail: cleanString(proofBlock?.headingTrail),
            headingAriaLabel:
              cleanString(proofBlock?.headingAriaLabel) ?? base.sections.proof.headingAriaLabel,
            headingLead:
              cleanString(proofBlock?.headingLead) ?? base.sections.proof.headingLead,
            headingAccent:
              cleanString(proofBlock?.headingAccent) ?? base.sections.proof.headingAccent,
            copy: cleanString(proofBlock?.copy) ?? base.sections.proof.copy,
          },
          featuredMedia: {
            ...base.sections.featuredMedia,
            label:
              cleanString(featuredMediaBlock?.label) ?? base.sections.featuredMedia.label,
            ariaLabel:
              cleanString(featuredMediaBlock?.ariaLabel) ??
              base.sections.featuredMedia.ariaLabel,
            logos: featuredMediaLogos,
          },
          operatingSystem: {
            ...base.sections.operatingSystem,
            kicker: cleanString(opSysBlock?.kicker) ?? base.sections.operatingSystem.kicker,
            titleAriaLabel:
              cleanString(opSysBlock?.titleAriaLabel) ??
              base.sections.operatingSystem.titleAriaLabel,
            titleWords: mapTitleWords(
              opSysBlock?.titleWords,
              base.sections.operatingSystem.titleWords,
            ),
            copy: cleanString(opSysBlock?.copy) ?? base.sections.operatingSystem.copy,
            ctaPrimary:
              mapPayloadCta(opSysBlock?.ctaPrimary) ?? base.sections.operatingSystem.ctaPrimary,
            ctaSecondary: mapPayloadCta(opSysBlock?.ctaSecondary),
          },
          stories: {
            ...base.sections.stories,
            kicker: cleanString(storiesBlock?.kicker) ?? base.sections.stories.kicker,
            titleAriaLabel:
              cleanString(storiesBlock?.titleAriaLabel) ??
              base.sections.stories.titleAriaLabel,
            titleWords: mapTitleWords(
              storiesBlock?.titleWords,
              base.sections.stories.titleWords,
            ),
            copy: cleanString(storiesBlock?.copy) ?? base.sections.stories.copy,
            cta: mapPayloadCta(storiesBlock?.cta) ?? base.sections.stories.cta,
            panelCta:
              mapPayloadCta(storiesBlock?.panelCta) ?? base.sections.stories.panelCta,
          },
          faq: {
            ...base.sections.faq,
            heading: cleanString(faqBlock?.heading) ?? base.sections.faq.heading,
            headingLead: cleanString(faqBlock?.headingLead),
            cta: mapPayloadCta(faqBlock?.cta) ?? base.sections.faq.cta,
            ctaTitle: cleanString(faqBlock?.ctaTitle),
            ctaCopy: cleanString(faqBlock?.ctaCopy),
          },
          footer: {
            ...base.sections.footer,
            ariaLabel: siteSettings?.footerAriaLabel ?? base.sections.footer.ariaLabel,
            tagline: siteSettings?.footerTagline ?? base.sections.footer.tagline,
            taglineEmphasis: siteSettings?.footerTaglineEmphasis,
            ctaPrimary: footerCtas[0] ?? base.sections.footer.ctaPrimary,
            ctaSecondary: footerCtas[1] ?? base.sections.footer.ctaSecondary,
            contactLabel: siteSettings?.contactLabel ?? base.sections.footer.contactLabel,
            address:
              siteSettings?.contactAddress && siteSettings.contactAddress.length > 0
                ? siteSettings.contactAddress
                : base.sections.footer.address,
            contactLinks:
              siteSettings?.contactLinks && siteSettings.contactLinks.length > 0
                ? siteSettings.contactLinks
                : base.sections.footer.contactLinks,
            legal: {
              copyright:
                siteSettings?.footerCopyright ?? base.sections.footer.legal.copyright,
              links:
                siteSettings?.legalLinks && siteSettings.legalLinks.length > 0
                  ? siteSettings.legalLinks
                  : base.sections.footer.legal.links,
            },
            socialsLabel:
              siteSettings?.socialsLabel ?? base.sections.footer.socialsLabel,
            socialLinks:
              siteSettings?.socialLinks && siteSettings.socialLinks.length > 0
                ? siteSettings.socialLinks
                : base.sections.footer.socialLinks,
          },
        },
      }
    } catch (error) {
      console.warn("[payload/home] falling back to static content:", error)
      return base
    }
  },
)
