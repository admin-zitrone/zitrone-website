import type { Block } from "payload"

export const FeaturedMediaBlock: Block = {
  slug: "featuredMedia",
  labels: { singular: "Trust logos ribbon", plural: "Trust logos ribbons" },
  fields: [
    { name: "label", type: "text", label: "Section label", localized: true, required: true },
    {
      name: "ariaLabel",
      type: "text",
      label: "Screen reader label",
      localized: true,
      required: true,
      admin: { description: "Usually leave as-is. This describes the logo group for accessibility." },
    },
    {
      name: "logos",
      type: "relationship",
      label: "Logos to show",
      relationTo: "logos",
      hasMany: true,
      required: true,
    },
  ],
}
