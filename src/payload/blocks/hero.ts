import type { Block } from "payload"

import { linkField } from "../fields/link"
import { HERO_PILLARS } from "../fields/options"

export const HeroBlock: Block = {
  slug: "hero",
  labels: { singular: "Hero / first screen", plural: "Hero / first screen" },
  fields: [
    { name: "title", type: "text", label: "Main headline", localized: true, required: true },
    {
      name: "titleEmphasis",
      type: "text",
      label: "Highlighted headline word",
      localized: true,
      admin: { description: "Word inside the headline set in green. Must match the first photo's word." },
    },
    {
      name: "frames",
      type: "array",
      label: "Rotating photos",
      labels: { singular: "Photo", plural: "Photos" },
      admin: {
        description:
          "Each photo swaps the highlighted word in the headline. The first photo's word must appear in the headline.",
      },
      fields: [
        { name: "pillar", type: "select", label: "Promise", required: true, options: [...HERO_PILLARS] },
        { name: "accentWord", type: "text", label: "Headline word", localized: true, required: true },
        { name: "image", type: "upload", label: "Photo", relationTo: "media", required: true },
        { name: "alt", type: "text", label: "Photo description", localized: true, required: true },
      ],
    },
    { name: "copy", type: "textarea", label: "Supporting text", localized: true },
    {
      name: "copyShort",
      type: "textarea",
      label: "Supporting text on phones",
      localized: true,
      admin: { description: "A shorter cut of the supporting text. No new claims." },
    },
    linkField({ name: "cta", required: true, label: { en: "Main button", es: "Botón principal" } }),
    {
      name: "primaryNav",
      type: "array",
      label: "Top navigation",
      labels: { singular: "Navigation item", plural: "Navigation items" },
      admin: {
        hidden: true,
        description: "Retired: the navigation is edited in Settings > Website header.",
      },
      fields: [linkField({ required: true })],
    },
    { name: "ribbonLabel", type: "text", label: "Logo ribbon label", localized: true },
    {
      name: "ribbonStat",
      type: "group",
      label: "Logo ribbon figure",
      admin: {
        description:
          "Replaces the ribbon label with a counting figure. Use a real, sourced number only. Leave empty to show the label.",
      },
      fields: [
        { name: "value", type: "number", label: "Figure" },
        { name: "label", type: "text", label: "Text before the figure", localized: true },
      ],
    },
    {
      name: "heroLogos",
      type: "relationship",
      label: "Logos in the hero ribbon",
      relationTo: "logos",
      hasMany: true,
      admin: { description: "Logos shown in the hero ribbon" },
    },
    {
      name: "navAriaLabel",
      type: "text",
      label: "Desktop navigation label",
      localized: true,
      admin: { description: "Accessibility text. Usually leave as-is." },
    },
    {
      name: "mobileNavAriaLabel",
      type: "text",
      label: "Mobile navigation label",
      localized: true,
      admin: { description: "Accessibility text. Usually leave as-is." },
    },
    {
      name: "menuOpenLabel",
      type: "text",
      label: "Open menu label",
      localized: true,
      admin: { description: "Accessibility text. Usually leave as-is." },
    },
    {
      name: "menuCloseLabel",
      type: "text",
      label: "Close menu label",
      localized: true,
      admin: { description: "Accessibility text. Usually leave as-is." },
    },
    {
      name: "marqueeAriaLabel",
      type: "text",
      label: "Moving logos label",
      localized: true,
      admin: { description: "Accessibility text. Usually leave as-is." },
    },
  ],
}
