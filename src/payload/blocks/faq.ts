import type { Block } from "payload"

import { linkField } from "../fields/link"

export const FaqBlock: Block = {
  slug: "faq",
  labels: { singular: "FAQs section", plural: "FAQs sections" },
  fields: [
    { name: "heading", type: "text", label: "Section headline", localized: true, required: true },
    {
      name: "headingLead",
      type: "text",
      label: "Headline start (regular weight)",
      localized: true,
      admin: { description: "Optional. The part of the headline before the highlighted words." },
    },
    linkField({ name: "cta", required: true, label: "Section button" }),
    { name: "ctaTitle", type: "text", label: "Button box title", localized: true },
    { name: "ctaCopy", type: "textarea", label: "Button box text", localized: true },
    {
      name: "faqs",
      type: "relationship",
      label: "FAQs to show",
      relationTo: "faqs",
      hasMany: true,
      required: true,
      admin: { description: "Pick the FAQs shown in this section, in order" },
    },
  ],
}
