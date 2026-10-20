import path from "path"
import { fileURLToPath } from "url"

import { postgresAdapter } from "@payloadcms/db-postgres"
import { resendAdapter } from "@payloadcms/email-resend"
import { lexicalEditor } from "@payloadcms/richtext-lexical"
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob"
import { buildConfig } from "payload"
import sharp from "sharp"

import { BlogCategories } from "./collections/blog-categories"
import { BlogPosts } from "./collections/blog-posts"
import { ContactRequests } from "./collections/contact-requests"
import { Faqs } from "./collections/faqs"
import { Logos } from "./collections/logos"
import { Media } from "./collections/media"
import { Services } from "./collections/services"
import { Stories } from "./collections/stories"
import { Users } from "./collections/users"

import { Footer } from "./globals/footer"
import { Header } from "./globals/header"
import { Home } from "./globals/home"
import { PrivacyNotice } from "./globals/privacy-notice"
import { SiteSettings } from "./globals/site-settings"

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: " — Zitrone",
    },
  },
  collections: [
    Users,
    Media,
    Services,
    Stories,
    Logos,
    Faqs,
    BlogPosts,
    BlogCategories,
    ContactRequests,
  ],
  globals: [SiteSettings, Header, Footer, Home, PrivacyNotice],
  editor: lexicalEditor(),
  email: process.env.RESEND_API_KEY
    ? resendAdapter({
        defaultFromAddress:
          process.env.RESEND_FROM_ADDRESS || "no-reply@zitrone.com.mx",
        defaultFromName: process.env.RESEND_FROM_NAME || "Zitrone CMS",
        apiKey: process.env.RESEND_API_KEY,
      })
    : undefined,
  secret: process.env.PAYLOAD_SECRET || "",
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || "",
    },
    push: false,
    migrationDir: "./src/migrations",
  }),
  localization: {
    locales: ["en", "es"],
    defaultLocale: "es",
    fallback: true,
  },
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  sharp,
  cors: [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL &&
      `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`,
    process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`,
    "https://zitrone.mx",
    "https://www.zitrone.mx",
    "http://localhost:3000",
  ].filter((u): u is string => Boolean(u)),
  csrf: [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL &&
      `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`,
    process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`,
    "https://zitrone.mx",
    "https://www.zitrone.mx",
    "http://localhost:3000",
  ].filter((u): u is string => Boolean(u)),
  plugins: process.env.BLOB_READ_WRITE_TOKEN
    ? [
        vercelBlobStorage({
          enabled: true,
          collections: {
            media: { disablePayloadAccessControl: true },
          },
          token: process.env.BLOB_READ_WRITE_TOKEN,
          addRandomSuffix: true,
        }),
      ]
    : [],
})
