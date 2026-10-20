import { Suspense } from "react"
import type { Metadata, Viewport } from "next"
import { notFound } from "next/navigation"
import { hasLocale, NextIntlClientProvider } from "next-intl"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import Script from "next/script"

import { JsonLd, localBusinessJsonLd, organizationJsonLd, webSiteJsonLd } from "../lib/json-ld"
import { canonicalFor, localeAlternates, ogLocale, SITE_URL } from "../lib/seo"
import { assetSrc } from "@/lib/assets.generated"
import { routing } from "@/i18n/routing"
import { getResolvedHomeContent } from "@/payload/loaders"
import { AttributionCapture } from "../_components/attribution-capture"
import { CtaTracker } from "../_components/cta-tracker"
import { SiteNavbar } from "../_components/site-navbar"
import { ConsentBanner } from "../_components/consent/consent-banner"
import { buildConsentBootstrap } from "@/lib/consent/bootstrap-script"
import { buildGtmLoader, resolveMeasurement } from "@/lib/analytics/measurement"
import { preloadBrandFonts } from "../fonts"
import "../fonts.css"

const measurement = resolveMeasurement({
  VERCEL_ENV: process.env.VERCEL_ENV,
  GTM_MEASUREMENT: process.env.GTM_MEASUREMENT,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
})

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

type LocaleLayoutProps = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#fff8ee",
}

export async function generateMetadata({ params }: LocaleLayoutProps): Promise<Metadata> {
  const { locale } = await params
  const { meta } = await getResolvedHomeContent(locale)

  return {
    title: meta.title,
    description: meta.description,
    metadataBase: new URL(SITE_URL),
    icons: {
      // SVG first; PNG fallbacks for agents that ignore SVG favicons. Apple
      // touch icons must be opaque PNG (iOS renders transparency as black).
      icon: [
        { url: "/img/shared/brand/favicon.svg", type: "image/svg+xml" },
        { url: assetSrc("brand-zitrone-favicon-32"), sizes: "32x32", type: "image/png" },
        { url: assetSrc("brand-zitrone-favicon-192"), sizes: "192x192", type: "image/png" },
      ],
      shortcut: ["/img/shared/brand/favicon.svg"],
      apple: [{ url: assetSrc("brand-zitrone-apple-touch-icon"), sizes: "180x180", type: "image/png" }],
    },
    alternates: {
      canonical: canonicalFor(locale, ""),
      languages: localeAlternates(""),
    },
    openGraph: {
      type: "website",
      siteName: meta.siteName,
      title: meta.title,
      description: meta.description,
      url: canonicalFor(locale, ""),
      locale: ogLocale(locale),
      images: [{ url: meta.ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      site: "@ZitroneNatural",
      title: meta.title,
      description: meta.description,
      images: [meta.ogImage],
    },
  }
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  setRequestLocale(locale)
  preloadBrandFonts()

  const { meta, sections } = await getResolvedHomeContent(locale)
  const t = await getTranslations({ locale, namespace: "Accessibility" })

  return (
    <html lang={locale}>
      {/* Client's GTM container, carried over from the legacy zitrone.com.mx
          site so measurement continues across the domain cutover. The ID is a
          public identifier; the container itself is managed in the client's
          GTM account. CSP entries live in next.config.ts (buildPublicCsp).

          Split deliberately into two parts. @next/third-parties'
          <GoogleTagManager> loads gtm.js at next/script's default
          `afterInteractive`, which put ~154KB of container on the critical
          path — over a third of the first request wave, competing with the
          44KB hero image that is the LCP element and delaying it by seconds
          on a throttled mobile connection. */}
      {/* Only the final production site may reach the live container:
          previews, local builds and tests render no loader, and a production
          build served from any other host stops at run time. See
          lib/analytics/measurement.ts. */}
      {measurement.enabled ? (
        <Script id="gtm-container" strategy="lazyOnload">
          {buildGtmLoader(measurement.hosts)}
        </Script>
      ) : null}
      <body>
        {/* The dataLayer and consent bootstrap stays inline and immediate: it
            costs no network, and trackClientEvent() in
            lib/observability/client.ts pushes with `window.dataLayer?.push`,
            so if the array does not exist yet those events are dropped
            silently. Creating it up front means events queue normally and the
            container replays them once it loads, so deferring the script
            costs no measurement.

            It also carries the Consent Mode v2 defaults. Those MUST land
            before gtm.js — a default that arrives after the container has
            loaded gates nothing — which is why this is an inline script and
            the container above is `lazyOnload`. See lib/consent/config.ts for
            why the EEA/UK/CH default is denied and the rest of the world is
            granted.

            It must stay inside <body>. A bare <script> as a direct child of
            <html> is not valid placement: the HTML parser relocates it into
            <body> anyway, and the server-rendered tree then disagrees with
            the parsed DOM, which React reports as a hydration mismatch. As
            the first child of <body> it runs at the same point in the parse,
            with no warning. */}
        <script dangerouslySetInnerHTML={{ __html: buildConsentBootstrap() }} />
        <NextIntlClientProvider>
          {/* First focusable element in the document, so a keyboard or screen
              reader user can jump the navbar on every page. It is a plain <a>
              rather than the i18n Link on purpose: the target is a fragment on
              the current document, not a route. */}
          <a className="ds-skip-link" href="#main-content">
            {t("skipToContent")}
          </a>
          <JsonLd data={organizationJsonLd(locale, meta.description, sections.footer)} />
          <JsonLd data={localBusinessJsonLd(locale, meta.description, sections.footer)} />
          <JsonLd data={webSiteJsonLd(locale, meta.description)} />
          <SiteNavbar locale={locale} />
          {children}
          <Suspense fallback={null}>
            <AttributionCapture />
          </Suspense>
          <CtaTracker />
          <ConsentBanner />
          <Analytics />
          <SpeedInsights />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
