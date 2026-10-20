import type { Field } from "payload"

export const seoField: Field = {
  name: "seo",
  type: "group",
  label: { en: "Search and sharing preview", es: "Vista previa para buscadores y redes" },
  admin: {
    description:
      "Optional. These fields control how this content appears in Google and when shared in messages or social media.",
  },
  fields: [
    { name: "title", type: "text", label: "Search title", localized: true },
    { name: "description", type: "textarea", label: "Search description", localized: true },
    { name: "ogImage", type: "upload", label: "Share image", relationTo: "media" },
    {
      name: "canonical",
      type: "text",
      label: "Canonical URL",
      admin: { description: "Usually leave blank unless this page has a preferred external URL." },
    },
  ],
}
