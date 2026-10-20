import type { GlobalConfig } from "payload"

import { revalidateAllPages } from "../hooks/revalidate"
import { contentEditorAccess } from "../access/roles"

export const SiteSettings: GlobalConfig = {
  slug: "siteSettings",
  label: { en: "Contact and company info", es: "Contacto e información de la empresa" },
  admin: { group: "Settings" },
  access: { read: () => true, update: contentEditorAccess },
  fields: [
    {
      name: "brand",
      type: "group",
      label: "Brand",
      fields: [
        { name: "name", type: "text", label: "Brand name", required: true, defaultValue: "Zitrone" },
        { name: "tagline", type: "text", label: "Tagline", localized: true },
        { name: "defaultOgImage", type: "upload", label: "Default share image", relationTo: "media" },
      ],
    },
    {
      name: "contacts",
      type: "group",
      label: "Contact details",
      fields: [
        { name: "primaryEmail", type: "email", label: "Main contact email", required: true },
        { name: "billingEmail", type: "email", label: "Billing email" },
        { name: "phone", type: "text", label: "Phone number" },
        {
          name: "address",
          type: "array",
          label: "Address",
          labels: { singular: "Address line", plural: "Address lines" },
          fields: [{ name: "line", type: "text", label: "Line", localized: true, required: true }],
        },
      ],
    },
    {
      name: "legal",
      type: "group",
      label: "Legal company details",
      fields: [
        { name: "entityName", type: "text", label: "Legal entity name" },
        { name: "rfc", type: "text", label: "RFC", admin: { description: "Tax ID (RFC)" } },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateAllPages],
  },
}
