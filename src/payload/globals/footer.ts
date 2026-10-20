import type { GlobalConfig } from "payload"

import { linkField } from "../fields/link"
import { revalidateAllPages } from "../hooks/revalidate"
import { contentEditorAccess } from "../access/roles"

export const Footer: GlobalConfig = {
  slug: "footer",
  label: { en: "Website footer", es: "Pie de página del sitio" },
  admin: { group: "Settings" },
  access: { read: () => true, update: contentEditorAccess },
  fields: [
    { name: "ariaLabel", type: "text", label: "Footer accessibility label", localized: true },
    { name: "tagline", type: "text", label: "Footer tagline", localized: true },
    {
      name: "taglineEmphasis",
      type: "text",
      label: "Highlighted tagline words",
      localized: true,
      admin: { description: "Words inside the tagline set in the accent style." },
    },
    linkField({ name: "ctaPrimary", required: true, label: "Main footer button" }),
    linkField({ name: "ctaSecondary", label: "Secondary footer button" }),
    {
      name: "columns",
      type: "array",
      label: "Footer link columns",
      labels: { singular: "Column", plural: "Columns" },
      fields: [
        { name: "label", type: "text", label: "Column title", localized: true, required: true },
        {
          name: "links",
          type: "array",
          label: "Column links",
          fields: [linkField({ required: true })],
        },
      ],
    },
    {
      name: "contact",
      type: "group",
      label: "Contact details",
      fields: [
        { name: "label", type: "text", label: "Contact heading", localized: true },
        {
          name: "address",
          type: "array",
          label: "Address",
          fields: [{ name: "line", type: "text", localized: true, required: true }],
        },
        {
          name: "links",
          type: "array",
          label: "Contact links",
          fields: [linkField({ required: true })],
        },
      ],
    },
    {
      name: "legal",
      type: "group",
      label: "Legal line and links",
      fields: [
        { name: "copyright", type: "text", label: "Copyright text", localized: true },
        {
          name: "links",
          type: "array",
          label: "Legal links",
          fields: [linkField({ required: true })],
        },
      ],
    },
    { name: "socialsLabel", type: "text", label: "Social links label", localized: true },
    {
      name: "socialLinks",
      type: "array",
      label: "Social links",
      fields: [
        {
          name: "icon",
          type: "select",
          label: "Icon",
          required: true,
          options: ["linkedin", "instagram", "facebook", "twitter"],
        },
        { name: "label", type: "text", label: "Link label", localized: true, required: true },
        { name: "href", type: "text", label: "URL", required: true },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateAllPages],
  },
}
