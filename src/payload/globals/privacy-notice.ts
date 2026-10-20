import type { GlobalConfig } from "payload"

import { seoField } from "../fields/seo"
import { revalidatePrivacyGlobal } from "../hooks/revalidate"
import { contentEditorAccess } from "../access/roles"

export const PrivacyNotice: GlobalConfig = {
  slug: "privacyNotice",
  label: { en: "Privacy notice", es: "Aviso de privacidad" },
  admin: { group: "Pages" },
  versions: { drafts: { autosave: true } },
  access: { read: () => true, update: contentEditorAccess },
  fields: [
    { name: "metaTitle", type: "text", label: "Search title", localized: true, required: true },
    { name: "metaDescription", type: "textarea", label: "Search description", localized: true, required: true },
    { name: "kicker", type: "text", label: "Small label above title", localized: true, required: true },
    { name: "title", type: "text", label: "Page title", localized: true, required: true },
    { name: "responsibleLabel", type: "text", label: "Responsible party heading", localized: true, required: true },
    { name: "responsibleBody", type: "textarea", label: "Responsible party text", localized: true, required: true },
    {
      name: "intro",
      type: "array",
      label: "Intro paragraphs",
      minRows: 1,
      labels: { singular: "Intro paragraph", plural: "Intro paragraphs" },
      fields: [{ name: "paragraph", type: "textarea", label: "Paragraph", localized: true, required: true }],
    },
    {
      name: "sections",
      type: "array",
      label: "Notice sections",
      minRows: 1,
      labels: { singular: "Section", plural: "Sections" },
      fields: [
        { name: "heading", type: "text", label: "Section heading", localized: true, required: true },
        {
          name: "paragraphs",
          type: "array",
          label: "Paragraphs",
          minRows: 1,
          labels: { singular: "Paragraph", plural: "Paragraphs" },
          fields: [{ name: "paragraph", type: "textarea", label: "Paragraph", localized: true, required: true }],
        },
      ],
    },
    { name: "lastUpdated", type: "date", label: "Last updated date" },
    { name: "heading", type: "text", localized: true, admin: { hidden: true } },
    { name: "body", type: "richText", localized: true, admin: { hidden: true } },
    seoField,
  ],
  hooks: {
    afterChange: [revalidatePrivacyGlobal],
  },
}
