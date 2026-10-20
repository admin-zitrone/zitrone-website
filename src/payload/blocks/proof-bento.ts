import type { Block } from "payload"

export const ProofBentoBlock: Block = {
  slug: "proofBento",
  labels: { singular: "Proof / credibility section", plural: "Proof / credibility sections" },
  fields: [
    { name: "kicker", type: "text", label: "Small label above headline", localized: true },
    {
      name: "headingAriaLabel",
      type: "text",
      label: "Plain headline for screen readers",
      localized: true,
      required: true,
      admin: { description: "Same headline without visual styling. Usually leave as-is." },
    },
    { name: "headingLead", type: "text", label: "Headline", localized: true, required: true },
    { name: "headingAccent", type: "text", label: "Highlighted headline text", localized: true },
    { name: "headingTrail", type: "text", label: "Headline end", localized: true },
    {
      name: "clientLogosAriaLabel",
      type: "text",
      label: "Client logos label",
      localized: true,
      admin: { description: "Accessibility text. Usually leave as-is." },
    },
    { name: "copy", type: "textarea", label: "Section intro text", localized: true },
    {
      name: "columns",
      type: "array",
      label: "Card columns",
      required: true,
      labels: { singular: "Column", plural: "Columns" },
      fields: [
        {
          name: "cards",
          type: "blocks",
          blocks: [
            {
              slug: "photoCard",
              labels: { singular: "Photo card", plural: "Photo cards" },
              fields: [
                { name: "title", type: "text", label: "Title", localized: true, required: true },
                { name: "sub", type: "text", label: "Supporting text", localized: true },
                { name: "image", type: "upload", label: "Image", relationTo: "media", required: true },
                { name: "alt", type: "text", label: "Image description", localized: true, required: true },
              ],
            },
            {
              slug: "clockCard",
              labels: { singular: "Clock card", plural: "Clock cards" },
              fields: [
                { name: "title", type: "text", label: "Title", localized: true, required: true },
                {
                  name: "tone",
                  type: "select",
                  label: "Color style",
                  defaultValue: "slate",
                  options: ["slate"],
                },
              ],
            },
            {
              slug: "specialtiesCard",
              labels: { singular: "Specialties card", plural: "Specialties cards" },
              fields: [
                { name: "title", type: "text", label: "Title", localized: true, required: true },
                { name: "sub", type: "text", label: "Supporting text", localized: true },
                {
                  name: "boxes",
                  type: "array",
                  label: "Mini labels",
                  fields: [
                    { name: "label", type: "text", label: "Text", localized: true, required: true },
                    {
                      name: "size",
                      type: "select",
                      label: "Visual size",
                      defaultValue: "md",
                      options: ["sm", "md", "lg"],
                    },
                  ],
                },
              ],
            },
            {
              slug: "studiesCard",
              labels: { singular: "Case studies card", plural: "Case studies cards" },
              fields: [
                { name: "title", type: "text", label: "Title", localized: true, required: true },
                { name: "sub", type: "text", label: "Supporting text", localized: true },
                { name: "image", type: "upload", label: "Image", relationTo: "media", required: true },
                { name: "alt", type: "text", label: "Image description", localized: true, required: true },
              ],
            },
            {
              slug: "logosCard",
              labels: { singular: "Client logos card", plural: "Client logos cards" },
              fields: [
                { name: "title", type: "text", label: "Title", localized: true, required: true },
                { name: "sub", type: "text", label: "Supporting text", localized: true },
                {
                  name: "tone",
                  type: "select",
                  label: "Color style",
                  defaultValue: "green",
                  options: ["green", "slate"],
                },
                {
                  name: "stats",
                  type: "array",
                  label: "Figures",
                  labels: { singular: "Figure", plural: "Figures" },
                  admin: { description: "Real, sourced figures only." },
                  fields: [
                    { name: "value", type: "text", label: "Figure", localized: true, required: true },
                    { name: "label", type: "text", label: "Text", localized: true, required: true },
                  ],
                },
                { name: "hideLogos", type: "checkbox", label: "Show figures instead of logos" },
              ],
            },
            {
              slug: "plainCard",
              labels: { singular: "Text card", plural: "Text cards" },
              fields: [
                { name: "title", type: "text", label: "Title", localized: true, required: true },
                { name: "sub", type: "text", label: "Supporting text", localized: true },
                {
                  name: "tone",
                  type: "select",
                  label: "Color style",
                  defaultValue: "natural",
                  options: ["natural", "ocean"],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
