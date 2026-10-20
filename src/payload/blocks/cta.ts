import type { Block } from "payload"

import { linkField } from "../fields/link"

export const CtaBlock: Block = {
  slug: "cta",
  labels: { singular: "Call-to-action section", plural: "Call-to-action sections" },
  fields: [
    { name: "eyebrow", type: "text", label: "Small label above headline", localized: true },
    { name: "heading", type: "text", label: "Headline", localized: true, required: true },
    { name: "copy", type: "textarea", label: "Supporting text", localized: true },
    linkField({ name: "ctaPrimary", required: true, label: "Main button" }),
    linkField({ name: "ctaSecondary", label: "Secondary button" }),
    { name: "background", type: "upload", label: "Background image", relationTo: "media" },
  ],
}
