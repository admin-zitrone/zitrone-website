import type { Block } from "payload"

import { linkField } from "../fields/link"
import { titleWordsField } from "../fields/title-words"

export const StoriesBlock: Block = {
  slug: "stories",
  labels: { singular: "Client stories section", plural: "Client stories sections" },
  fields: [
    { name: "kicker", type: "text", label: "Small label above headline", localized: true },
    titleWordsField(),
    {
      name: "titleAriaLabel",
      type: "text",
      label: "Plain headline for screen readers",
      localized: true,
      required: true,
      admin: { description: "Same headline without visual styling. Usually leave as-is." },
    },
    { name: "copy", type: "textarea", label: "Section intro text", localized: true },
    linkField({ name: "cta", required: true, label: "Section button" }),
    linkField({ name: "panelCta", label: "Story panel button" }),
    {
      name: "stories",
      type: "relationship",
      label: "Stories to show",
      relationTo: "stories",
      hasMany: true,
      required: true,
    },
    {
      name: "labels",
      type: "group",
      label: "Story controls",
      admin: { description: "Accessibility label for the story tabs. Usually leave as-is." },
      fields: [{ name: "tablistAriaLabel", type: "text", label: "Tabs label", localized: true }],
    },
  ],
}
