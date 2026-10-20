import type { GlobalConfig } from "payload"

import { linkField } from "../fields/link"
import { revalidateAllPages } from "../hooks/revalidate"
import { contentEditorAccess } from "../access/roles"

export const Header: GlobalConfig = {
  slug: "header",
  label: { en: "Website header", es: "Encabezado del sitio" },
  admin: { group: "Settings" },
  access: { read: () => true, update: contentEditorAccess },
  fields: [
    {
      name: "navAriaLabel",
      type: "text",
      label: "Navigation accessibility label",
      localized: true,
      admin: { description: "Usually leave as-is." },
    },
    {
      name: "primaryNav",
      type: "array",
      label: "Main navigation",
      labels: { singular: "Navigation item", plural: "Navigation items" },
      fields: [linkField({ required: true })],
    },
    linkField({ name: "primaryCta", label: "Header button" }),
    {
      name: "languageMenu",
      type: "group",
      label: "Language menu",
      fields: [
        { name: "label", type: "text", label: "Visible label", localized: true },
        { name: "ariaLabel", type: "text", label: "Accessibility label", localized: true },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateAllPages],
  },
}
