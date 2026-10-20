import type { Block } from "payload"

import { linkField } from "../fields/link"
import { FEATURE_ICONS, STEP_TONES } from "../fields/options"
import { titleWordsField } from "../fields/title-words"

export const OperatingSystemBlock: Block = {
  slug: "operatingSystem",
  labels: { singular: "How it works tabs", plural: "How it works sections" },
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
    linkField({ name: "ctaPrimary", label: "Main button" }),
    linkField({ name: "ctaSecondary", label: "Secondary button" }),
    {
      name: "tabs",
      type: "array",
      label: "Tabs",
      required: true,
      minRows: 1,
      labels: { singular: "Tab", plural: "Tabs" },
      fields: [
        {
          name: "key",
          type: "text",
          label: "Internal tab key",
          required: true,
          admin: { description: "Technical ID used by the tabs. Keep short, lowercase, and unique." },
        },
        { name: "icon", type: "select", label: "Icon", options: [...FEATURE_ICONS] },
        { name: "tone", type: "select", label: "Colour", options: [...STEP_TONES] },
        { name: "stage", type: "text", label: "Step name", localized: true },
        {
          name: "stageCopy",
          type: "group",
          label: "Step sentence",
          admin: { description: "One sentence in three parts; the middle part is highlighted." },
          fields: [
            { name: "before", type: "text", label: "Before the highlight", localized: true },
            { name: "highlight", type: "text", label: "Highlighted part", localized: true },
            { name: "after", type: "text", label: "After the highlight", localized: true },
          ],
        },
        { name: "title", type: "text", label: "Tab title", localized: true, required: true },
        { name: "copy", type: "textarea", label: "Short tab copy", localized: true },
        { name: "panelTitle", type: "text", label: "Content title", localized: true, required: true },
        { name: "panelCopy", type: "textarea", label: "Content text", localized: true },
        { name: "image", type: "upload", label: "Image", relationTo: "media", required: true },
      ],
    },
    {
      name: "labels",
      type: "group",
      label: "Tab controls",
      admin: { description: "Accessibility labels for the tabs. Usually leave these as-is." },
      fields: [
        { name: "sectionLabel", type: "text", label: "Section label", localized: true },
        { name: "listAriaLabel", type: "text", label: "Tab list label", localized: true },
        { name: "previous", type: "text", label: "Previous button", localized: true },
        { name: "next", type: "text", label: "Next button", localized: true },
      ],
    },
  ],
}
