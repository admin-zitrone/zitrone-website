import type { NextConfig } from "next"
import { withSentryConfig } from "@sentry/nextjs"
import { withPayload } from "@payloadcms/next/withPayload"
import createNextIntlPlugin from "next-intl/plugin"

import { serverEnv } from "./src/env/server"
import { buildDomainRedirects } from "./src/lib/domain-redirects"

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts")
const hasSentryBuildCredentials = serverEnv.hasSentryBuildCredentials
const isDevelopment = serverEnv.nodeEnv === "development"

function toHeaderValue(value: string) {
  return value.replace(/\s{2,}/g, " ").trim()
}

function buildPublicCsp() {
  // googletagmanager + google-analytics entries cover the client's GTM
  // container (GTM-TSTDVS4) and the GA4 endpoints (incl. regional ones) it
  // reports to. If tags inside the container call other domains, those need
  // adding here too — audit the container before cutover.
  //
  // Audited 2026-08-13 against the console on production. Two gaps were
  // dropping real data:
  //   - `*.analytics.google.com` does NOT match the apex `analytics.google.com`,
  //     which is where GA4 sends part of its traffic, so those beacons were
  //     refused.
  //   - The Google Ads conversion tags (www.google.com/ccm|g|rmkt/collect,
  //     ad.doubleclick.net, and the googleads.g.doubleclick.net script) were
  //     never listed at all, so conversion tracking never reported.
  // Origins below are the exact ones observed being blocked, plus
  // googleadservices.com which serves the conversion script.
  //
  // Extended 2026-08-21 from the container itself rather than from the
  // console. GTM containers are publicly fetchable
  // (googletagmanager.com/gtm.js?id=GTM-TSTDVS4), so the full set of hosts a
  // container can call can be read up front instead of discovered one blocked
  // beacon at a time — which is how the previous two rounds of this were
  // done. That read added pagead2/ade.googlesyndication.com, adservice.google.com
  // and cct.google, all reachable from the Google Ads conversion tag
  // (AW-779424827), plus www.google.com.mx for the regional conversion ping.
  //
  // The container also references youtube.com via GTM's built-in YouTube
  // trigger. That is present in every container whether or not a YouTube tag
  // exists, so frame-src is deliberately NOT opened for it; add it only if a
  // video tag is actually configured.
  return toHeaderValue(`
    default-src 'self';
    script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com https://www.googletagmanager.com https://www.googleadservices.com https://googleads.g.doubleclick.net https://pagead2.googlesyndication.com https://adservice.google.com${isDevelopment ? " 'unsafe-eval'" : ""};
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' data: blob: https:;
    font-src 'self' data: https://fonts.gstatic.com;
    connect-src 'self' https://va.vercel-scripts.com https://*.ingest.sentry.io https://www.googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com https://analytics.google.com https://*.analytics.google.com https://www.google.com https://www.google.com.mx https://stats.g.doubleclick.net https://ad.doubleclick.net https://googleads.g.doubleclick.net https://pagead2.googlesyndication.com https://ade.googlesyndication.com https://adservice.google.com https://cct.google;
    worker-src 'self' blob:;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    frame-src 'self';
    media-src 'self' data: blob:;
    ${isDevelopment ? "" : "upgrade-insecure-requests;"}
  `)
}

function buildAdminCsp() {
  return toHeaderValue(`
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' data: blob: https:;
    font-src 'self' data: https://fonts.gstatic.com;
    connect-src 'self' https://va.vercel-scripts.com https://*.ingest.sentry.io https://api.openai.com;
    worker-src 'self' blob:;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    frame-src 'self';
    media-src 'self' data: blob:;
    ${isDevelopment ? "" : "upgrade-insecure-requests;"}
  `)
}

const securityHeaders = [
  { key: "Content-Security-Policy", value: buildPublicCsp() },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
  { key: "Origin-Agent-Cluster", value: "?1" },
  { key: "X-DNS-Prefetch-Control", value: "off" },
  { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
]

const privateSurfaceHeaders = [
  { key: "X-Robots-Tag", value: "noindex, nofollow" },
]

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
    // Prefer AVIF (smallest), fall back to WebP; original format as last resort.
    formats: ["image/avif", "image/webp"],
    // Next's defaults plus 2560/2880. Full-bleed heroes on the common
    // 1280px/1440px retina laptops need ~2560/2880px; with the default list
    // they jumped from 2048 straight to 3840 (~45% more bytes for the LCP).
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 2560, 2880, 3840],
    // Components request high-quality hero and service imagery explicitly.
    // Keep the allow-list narrow so arbitrary quality values cannot increase
    // image-processing cost at runtime.
    qualities: [75, 92],
    // public/img is append-only (assets are never mutated in place, see
    // feedback_shared_public_folder), so optimized variants are safe to cache
    // long. Previously optimized images shipped `max-age=0, must-revalidate`,
    // forcing a revalidation round-trip for every image on every load/scroll.
    minimumCacheTTL: 2678400, // 31 days
  },
  async redirects() {
    return buildDomainRedirects()
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        // public/img is append-only, so hashed-by-path assets never change in
        // place -> cache them immutably for a year. This also raises the
        // upstream Cache-Control that /_next/image inherits, so optimized
        // images stop shipping `max-age=0, must-revalidate`.
        source: "/img/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
          // Email clients (Apple Mail, Outlook) embed our logo and photos from
          // another origin; the global same-origin CORP blocks them.
          { key: "Cross-Origin-Resource-Policy", value: "cross-origin" },
        ],
      },
      {
        // Self-hosted brand fonts (src/app/fonts.css). File names carry the
        // font version and are replaced, never edited, so they never change in place.
        source: "/fonts/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/admin/:path*",
        headers: [
          ...securityHeaders.filter((header) => header.key !== "Content-Security-Policy"),
          ...privateSurfaceHeaders,
          { key: "Content-Security-Policy", value: buildAdminCsp() },
        ],
      },
      {
        source: "/studio/:path*",
        headers: [...securityHeaders, ...privateSurfaceHeaders],
      },
      {
        source: "/api/draft-mode/:path*",
        headers: privateSurfaceHeaders,
      },
      {
        source: "/api/revalidate",
        headers: privateSurfaceHeaders,
      },
    ]
  },
}

const intlConfig = withNextIntl(nextConfig)
const payloadConfig = withPayload(intlConfig, { devBundleServerPackages: false })

export default withSentryConfig(payloadConfig, {
  org: serverEnv.sentryBuildOrg,
  project: serverEnv.sentryBuildProject,
  authToken: serverEnv.sentryBuildAuthToken,
  telemetry: false,
  silent: true,
  webpack: {
    treeshake: {
      removeDebugLogging: true,
    },
  },
  sourcemaps: {
    disable: !hasSentryBuildCredentials,
  },
  errorHandler(error) {
    if (!hasSentryBuildCredentials) {
      console.warn("[sentry]", error.message)
      return
    }

    throw error
  },
})
