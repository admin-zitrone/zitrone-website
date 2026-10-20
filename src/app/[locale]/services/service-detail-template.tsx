'use client'
import type { ReactNode } from 'react'
import Image from 'next/image'
import { Button } from '@/components/button'
import { SiteFooter } from '@/components/site-footer'
import { Section } from '@/components/section'
import { Copy, Heading, HeadingAccent, Kicker } from '@/components/typography'
import { contactHref } from '@/app/_components/home/content/shared'
import type { HomeContent } from '@/app/_components/home/content/types'
import { FeatureIcon } from '@/app/_components/home/feature-icons'
import { withServiceRibbonLogoScales } from '@/app/_components/home/hero-logo-scales'
import { StoriesAndFaqSection } from '@/app/_components/home/stories-and-faq-section'

import { ServiceStandardSection } from './service-standard-section'

import { renderEmphasis } from '@/lib/emphasis'
import { ServiceMediaRotator } from './service-media-rotator'
import { getServiceCta } from './service-targets'
import type { ServiceTarget, ServiceTemplateContent } from './service-targets'

type ServiceLayer = HomeContent['serviceLayers'][number]

type ServiceMediaImage = {
  src: string
  altEn: string
  altEs: string
  /** CSS object-position, for wide frames that would lose their subject on the
   *  tall mobile crop (e.g. a cart sitting low in a landscape photo). */
  focus?: string
}

type ServiceMediaGallery = {
  /** Wide spectrum frames behind the hero (rotates softly). */
  hero: ServiceMediaImage[]
  /** Full spectrum of the service for the overview block (food, service, variety, hygiene). */
  overview: ServiceMediaImage[]
}

// Systematized per-service galleries: every service detail page draws its hero
// and overview imagery from this single map so the template stays one source of
// truth. Hero = 3 wide frames, overview = 4 spectrum frames.
const serviceMediaGalleries: Record<ServiceTarget['theme'], ServiceMediaGallery> = {
  dining: {
    hero: [
      {
        src: '/img/shared/services/comedor/buffet-aperitivos.jpg',
        altEn: 'Dining room buffet line with soups, mains and vegan stations',
        altEs: 'Línea de buffet del comedor con sopas, platillos principales y estación vegana',
      },
      {
        src: '/img/shared/services/comedor/buffet-linea.jpg',
        altEn: 'Daily buffet line with rotating menu',
        altEs: 'Línea de buffet diaria con menú rotativo',
      },
      {
        src: '/img/shared/services/comedor/dining-room-open-floor.jpg',
        altEn: 'Corporate dining room seating area next to the service counter',
        altEs: 'Área de comedor corporativo junto a la barra de servicio',
      },
    ],
    overview: [
      {
        src: '/img/shared/services/comedor/barra-grill.jpg',
        altEn: 'Hot grill station',
        altEs: 'Estación de grill caliente',
      },
      {
        src: '/img/shared/services/comedor/barra-ensaladas.jpg',
        altEn: 'Fresh salad bar',
        altEs: 'Barra de ensaladas frescas',
      },
      {
        src: '/img/shared/services/comedor/bowl-station.jpg',
        altEn: 'Build-your-own bowl station',
        altEs: 'Estación de bowls a elección',
      },
      {
        src: '/img/shared/services/comedor/chef-ensalada.jpg',
        altEn: 'Zitrone staff preparing fresh food',
        altEs: 'Personal de Zitrone preparando comida fresca',
      },
    ],
  },
  cafe: {
    hero: [
      {
        src: '/img/shared/services/cafeteria/coffee-bar.jpg',
        altEn: 'Workplace coffee bar',
        altEs: 'Barra de café en la oficina',
      },
      {
        src: '/img/shared/services/cafeteria/barista-portrait.jpg',
        altEn: 'Zitrone barista on site',
        altEs: 'Barista de Zitrone en sitio',
      },
      {
        src: '/img/shared/services/cafeteria/grab-and-go.jpg',
        altEn: 'Grab-and-go food selection',
        altEs: 'Selección de comida grab and go',
      },
    ],
    overview: [
      {
        src: '/img/shared/services/cafeteria/bebidas.jpg',
        altEn: 'Freshly prepared hot and cold drinks',
        altEs: 'Bebidas calientes y frías recién preparadas',
      },
      {
        src: '/img/shared/services/cafeteria/grab-and-go.jpg',
        altEn: 'Ready-to-take grab-and-go food',
        altEs: 'Comida lista para llevar grab and go',
      },
      {
        src: '/img/shared/services/cafeteria/pasteleria.jpg',
        altEn: 'Pastry and bakery selection',
        altEs: 'Selección de pastelería',
      },
      {
        src: '/img/shared/services/cafeteria/healthy.jpg',
        altEn: 'Healthy snacks and fruit',
        altEs: 'Snacks saludables y fruta',
      },
    ],
  },
  pantry: {
    hero: [
      {
        src: '/img/shared/services/pantry/bento-station.jpg',
        altEn: 'Stocked office pantry station',
        altEs: 'Estación de pantry surtida',
      },
      {
        src: '/img/shared/services/pantry/restock.jpg',
        altEn: 'Zitrone staff restocking the pantry',
        altEs: 'Personal de Zitrone resurtiendo el pantry',
      },
      {
        src: '/img/shared/services/pantry/people.jpg',
        altEn: 'Employees choosing snacks and drinks',
        altEs: 'Colaboradores eligiendo snacks y bebidas',
      },
    ],
    overview: [
      {
        src: '/img/shared/services/pantry/snacks.jpg',
        altEn: 'Snack assortment',
        altEs: 'Surtido de snacks',
      },
      {
        src: '/img/shared/services/pantry/healthy.jpg',
        altEn: 'Fresh fruit and healthy options',
        altEs: 'Fruta fresca y opciones saludables',
      },
      {
        src: '/img/shared/services/pantry/surtido.jpg',
        altEn: 'Full pantry assortment',
        altEs: 'Surtido completo del pantry',
      },
      {
        src: '/img/shared/services/pantry/shelf-portrait.jpg',
        altEn: 'Planogram shelf with options in view',
        altEs: 'Planograma con las opciones a la vista',
      },
    ],
  },
  coffee: {
    hero: [
      {
        src: '/img/shared/services/cafeteras/coffee-bar.jpg',
        altEn: 'Office coffee point',
        altEs: 'Punto de café en la oficina',
      },
      {
        src: '/img/shared/services/cafeteras/espresso-pull.jpg',
        altEn: 'Fresh espresso being pulled',
        altEs: 'Espresso recién preparado',
      },
      {
        src: '/img/shared/services/water/person-dispenser-wide.jpg',
        altEn: 'Filtered water dispenser in use',
        altEs: 'Dispensador de agua filtrada en uso',
      },
    ],
    overview: [
      {
        src: '/img/shared/services/cafeteras/espresso-cup.jpg',
        altEn: 'Freshly brewed coffee cup',
        altEs: 'Taza de café recién preparado',
      },
      {
        src: '/img/shared/services/cafeteras/coffee-beans.jpg',
        altEn: 'Specialty coffee beans ground for each cup',
        altEs: 'Café de especialidad molido al momento',
      },
      {
        src: '/img/shared/services/cafeteras/machine-aulika.jpg',
        altEn: 'Maintained office coffee machine',
        altEs: 'Cafetera de oficina con mantenimiento',
      },
      {
        src: '/img/shared/services/water/person-dispenser-portrait.jpg',
        altEn: 'Employee filling a bottle at an office filtered-water dispenser',
        altEs: 'Colaboradora llenando su botella en el dispensador de agua filtrada de la oficina',
      },
    ],
  },
  'grab-go': {
    // Every frame below is a distinct scene, and none is reused between the
    // hero and the overview. Note the two crops that exist of the same cart
    // shot (carrito-zitrone portrait / carrito-brick-chef wide) read as a
    // repeat when both are in the rotation, so only the portrait one is used.
    //
    // Crop geometry, measured on the real boxes: the hero is 342x640 on a
    // 390px phone, so a landscape source is cropped horizontally only and its
    // `focus` percentage does nothing there — the value is tuned for the wide
    // 1325x800 desktop box, where it decides what survives vertically.
    hero: [
      {
        // Portrait source: the whole cart and its attendant survive the tall
        // phone crop. 38% keeps her head and the stocked top shelf in the
        // wide desktop crop.
        src: '/img/shared/services/carritos/carrito-zitrone.jpg',
        altEn: 'Zitrone service cart stocked with juices, fruit and sandwiches, with its attendant',
        altEs: 'Carrito de servicio Zitrone surtido con jugos, fruta y sándwiches, con su encargada',
        focus: 'center 38%',
      },
      {
        // Basket sits dead centre, so the narrow phone crop stays on the food.
        src: '/img/shared/services/carritos/card-comida.jpg',
        altEn: 'Sandwiches and ready-to-eat food from the cart',
        altEs: 'Sándwiches y comida lista del carrito',
        focus: 'center 50%',
      },
    ],
    overview: [
      {
        src: '/img/shared/services/carritos/wrap-de-la-semana.jpg',
        altEn: 'Zitrone attendant holding the wrap of the week',
        altEs: 'Personal de Zitrone mostrando el wrap de la semana',
      },
      {
        src: '/img/shared/services/carritos/bento-fresh.jpg',
        altEn: 'Cucumber cup and bottled water from the cart',
        altEs: 'Vaso de pepinos y agua embotellada del carrito',
      },
      {
        src: '/img/shared/services/carritos/bento-meal.jpg',
        altEn: 'Yoghurt with granola, ready to take',
        altEs: 'Yogurt con granola, listo para llevar',
      },
      {
        src: '/img/shared/services/carritos/people.jpg',
        altEn: 'Employee eating a snack taken from the cart',
        altEs: 'Colaboradora comiendo un snack tomado del carrito',
      },
    ],
  },
  catering: {
    hero: [
      {
        src: '/img/shared/services/catering/event-buffet-spread.png',
        altEn: 'Corporate catering buffet spread',
        altEs: 'Montaje de buffet para catering corporativo',
      },
      {
        src: '/img/shared/services/catering/event-banquet.png',
        altEn: 'Seated banquet service',
        altEs: 'Servicio de banquete sentado',
      },
      {
        src: '/img/shared/services/catering/event-crowd.png',
        altEn: 'Guests at a hosted event',
        altEs: 'Invitados en un evento',
      },
    ],
    overview: [
      {
        src: '/img/shared/services/catering/canapes-plating.jpg',
        altEn: 'Plated canapes and presentation',
        altEs: 'Canapés emplatados y presentación',
      },
      {
        src: '/img/shared/services/catering/box-lunch.jpg',
        altEn: 'Individual box lunch',
        altEs: 'Box lunch individual',
      },
      {
        src: '/img/shared/services/catering/coffee-break-spread.png',
        altEn: 'Coffee break spread',
        altEs: 'Montaje de coffee break',
      },
      {
        src: '/img/shared/services/catering/pasteleria-display.png',
        altEn: 'Dessert and pastry display',
        altEs: 'Mesa de postres y pastelería',
      },
    ],
  },
}

type ServiceDetailTemplateProps = {
  locale: string
  target: ServiceTarget
  layer: ServiceLayer
  template: ServiceTemplateContent
  homeContent: HomeContent
  /** The site navbar, embedded in the hero. Passed in because it is a server
      component: services render the same one as every other page. */
  navbar: ReactNode
  footerColumns: HomeContent['footerColumns']
  footerSection: HomeContent['sections']['footer']
}

export function ServiceDetailTemplate({
  locale,
  target,
  layer,
  template,
  homeContent,
  navbar,
  footerColumns,
  footerSection,
}: ServiceDetailTemplateProps) {
  const isSpanish = locale === 'es'
  const gallery = serviceMediaGalleries[target.theme]
  const resolveAlt = (image: ServiceMediaImage) => (isSpanish ? image.altEs : image.altEn)
  const heroImages = gallery.hero.map((image) => ({
    src: image.src,
    alt: resolveAlt(image),
    focus: image.focus,
  }))
  const overviewImages = gallery.overview.map((image) => ({
    src: image.src,
    alt: resolveAlt(image),
  }))

  /* Under the section contract this zone answers "what does it solve" with
     outcomes. Services not yet migrated keep the home service-layer features. */
  const overviewBenefits = template.resolves
    ? template.resolves.points.map((point) => ({
        title: point.title,
        copy: point.copy,
        icon: point.icon ?? 'spark',
      }))
    : layer.features.map((feature) => ({
        title: feature.title,
        copy: feature.text,
        icon: feature.icon,
      }))

  /* 'service' scope answers the objections that block this specific decision;
     the generic home set stays for services not yet migrated. */
  const faqItems =
    template.faqScope === 'service'
      ? template.faqs.map((faq) => ({ question: faq.question, answer: [faq.answer] }))
      : homeContent.faqs

  /* How the service is run is the same for every service, so it is read from
     the shared standard instead of being written per service. */
  const cta = getServiceCta(locale)
  const resultLogos = withServiceRibbonLogoScales(homeContent.heroLogos)

  const clientLogoRibbon = (
    <div className="ds-service-template-results-logos ds-reveal" data-reveal="fade-up">
      <div
        className="ds-media-ribbon-marquee ds-service-template-results-ribbon"
        aria-label={isSpanish ? 'Logotipos de clientes' : 'Client logos'}
      >
        <div className="ds-media-ribbon-marquee-inner">
          {[0, 1].map((copyIndex) => (
            <div
              className="ds-media-ribbon-track ds-service-template-results-track"
              key={copyIndex}
              aria-hidden={copyIndex === 1 ? true : undefined}
            >
              {resultLogos.map((logo) => (
                <figure
                  className="ds-logo-chip ds-logo-chip--image"
                  data-logo-fit={logo.fit ?? 'wide'}
                  key={`${copyIndex}-${logo.id}`}
                  style={{ ['--logo-scale' as string]: logo.scale ?? 1 }}
                >
                  <Image src={logo.src} alt={logo.alt} width={160} height={40} loading="eager" />
                </figure>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* The skip link and the navbar both target this. tabIndex={-1} makes it
          programmatically focusable so focus actually moves here on activation;
          without it the browser scrolls but leaves focus at the top of the
          document. */}
      <main className="ds-page-shell ds-page-shell--normal-flow" id="main-content" tabIndex={-1}>
        <div className="semantic-service-theme-band" data-svc-theme={target.theme}>
          <header
            className="ds-section ds-service-lp-hero semantic-service-theme-surface"
            aria-labelledby="service-detail-title"
            data-track-section="hero"
          >
            <div className="ds-service-template-shell">
              <article className="ds-service-lp-hero-stage">
                {navbar}

                <figure className="ds-service-lp-hero-media">
                  <ServiceMediaRotator
                    images={heroImages}
                    width={1680}
                    height={1040}
                    sizes="100vw"
                    interval={4500}
                    priority
                  />
                </figure>
                <div className="ds-service-lp-hero-overlay" aria-hidden="true" />
                <div className="ds-service-lp-hero-glow" aria-hidden="true" />

                <div className="ds-service-lp-hero-content">
                  <div className="ds-service-lp-hero-main ds-stack" data-gap="loose">
                    {/* The service name is the h1 (it is what people search for)
                        and reads as the eyebrow; the promise carries the display
                        size underneath it. */}
                    <h1
                      className="ds-kicker ds-reveal"
                      data-reveal="fade-blur"
                      id="service-detail-title"
                    >
                      {target.title}
                    </h1>
                    <p
                      className="ds-heading ds-service-lp-hero-title ds-title-reveal"
                      data-size="hero"
                      data-title-reveal="words"
                    >
                      {target.headline.lead}{' '}
                      <HeadingAccent>{target.headline.accent}</HeadingAccent>
                      {target.headline.trail}
                    </p>
                    <Copy className="ds-service-lp-hero-lede ds-reveal" data-reveal="fade-blur">
                      {target.lede}
                    </Copy>
                    <div className="ds-service-lp-hero-actions ds-reveal" data-reveal="fade-blur">
                      <Button
                        className="ds-service-lp-hero-cta"
                        variant="accent"
                        href="#service-overview"
                      >
                        <span>{cta.hero.label}</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          </header>

          <Section className="ds-service-lp-hero-logos semantic-service-theme-surface">
            <div className="ds-service-template-shell">{clientLogoRibbon}</div>
          </Section>

          <Section
            id="service-overview"
            aria-labelledby="service-overview-heading"
            className="ds-service-lp-overview semantic-service-theme-surface"
          >
            <div className="ds-service-template-shell ds-stack" data-gap="loose">
              <div className="ds-service-lp-overview-stage" data-compact>
                <figure
                  className="ds-service-lp-overview-visual ds-reveal"
                  data-reveal="fade-up"
                  data-image-only
                >
                  <ServiceMediaRotator
                    images={overviewImages}
                    width={1280}
                    height={1560}
                    // Measured: ~37vw beside the copy on desktop, capped at
                    // ~37.5rem; full width below 64rem. 40rem overshot the
                    // 1200w candidate and pulled 1920w files.
                    sizes="(min-width: 105rem) 37.5rem, (min-width: 64rem) 37vw, 92vw"
                    interval={4500}
                    showIndicators
                    indicatorLabel={isSpanish ? 'Imágenes del servicio' : 'Service spectrum'}
                  />
                </figure>

                <div className="ds-service-lp-overview-side ds-stack" data-gap="loose">
                  <div className="ds-section-head ds-service-lp-head ds-stack" data-gap="loose">
                    <Kicker className="ds-reveal" data-reveal="fade-up">
                      {isSpanish ? 'El servicio' : 'The service'}
                    </Kicker>
                    <Heading
                      as="h2"
                      id="service-overview-heading"
                      size="section"
                      className="ds-service-lp-section-title ds-title-reveal"
                      data-title-reveal="words"
                    >
                      {template.overview.headingLead}{' '}
                      <HeadingAccent>{template.overview.headingAccent}</HeadingAccent>
                      {template.overview.headingTrail ? ` ${template.overview.headingTrail}` : ''}
                    </Heading>
                  </div>

                  <div className="ds-service-lp-overview-benefits">
                    {overviewBenefits.map((benefit) => (
                      <article
                        className="ds-service-lp-overview-benefit ds-reveal"
                        data-reveal="fade-up"
                        key={benefit.title}
                      >
                        <span className="ds-service-lp-overview-benefit-icon" aria-hidden="true">
                          <FeatureIcon name={benefit.icon} />
                        </span>
                        <div className="ds-service-lp-overview-benefit-body">
                          <h3 className="ds-service-lp-overview-benefit-title">{renderEmphasis(benefit.title)}</h3>
                          <p className="ds-service-lp-overview-benefit-copy">{benefit.copy}</p>
                        </div>
                      </article>
                    ))}
                  </div>

                  <div className="ds-service-lp-overview-actions ds-reveal" data-reveal="fade-up">
                    <Button variant="secondary" href={contactHref(`service-${target.slug}`)}>
                      <span>{template.overview.ctaLabel}</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Section>

          <ServiceStandardSection
            locale={locale}
            stories={homeContent.clientStories}
            initialStoryName={template.testimonialStory}
            fallbackImage={layer.image}
            fallbackAlt={target.title}
          />
        </div>
      </main>

      <div className="ds-service-footer-flow">
        <StoriesAndFaqSection
          faqs={faqItems}
          stories={homeContent.sections.stories}
          faq={homeContent.sections.faq}
          content={homeContent}
          showStories={false}
          showCta={false}
          tone="light"
        />
        <SiteFooter footerColumns={footerColumns} footer={footerSection} integrated />
      </div>
    </>
  )
}
