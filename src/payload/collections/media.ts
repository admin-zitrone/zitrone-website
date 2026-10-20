import type { CollectionConfig } from "payload"
import { adminAccess, contentEditorAccess } from "../access/roles"

export const Media: CollectionConfig = {
  slug: "media",
  labels: { singular: "Media file", plural: "Media library" },
  admin: { group: "Media" },
  access: {
    read: () => true,
    create: contentEditorAccess,
    update: contentEditorAccess,
    delete: adminAccess,
  },
  upload: {
    // Local uploads only (production stores media in Vercel Blob). Test runners
    // point this at a temporary folder so they never touch a developer's files.
    staticDir: process.env.PAYLOAD_MEDIA_DIR || "media",
    // SVGs are content-sniffed by Payload as application/xml, so both types are
    // required for SVG logo uploads to pass upload restrictions.
    mimeTypes: ["image/*", "image/svg+xml", "application/xml", "video/mp4", "application/pdf"],
    imageSizes: [
      { name: "thumbnail", width: 320 },
      { name: "card", width: 768 },
      { name: "feature", width: 1280 },
      { name: "hero", width: 1920 },
    ],
    formatOptions: {
      format: "webp",
      options: { quality: 82 },
    },
  },
  fields: [
    { name: "alt", type: "text", label: "Image description", localized: true, required: true },
    { name: "caption", type: "text", label: "Caption", localized: true },
    {
      name: "credit",
      type: "text",
      label: "Credit",
      admin: { description: "Photographer or source attribution" },
    },
  ],
}
