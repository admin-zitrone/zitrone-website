import type { Block } from "payload"

import { FEATURE_ICONS, SERVICE_THEMES } from "../fields/options"

export const ServiceSystemSliderBlock: Block = {
  slug: "serviceSystemSlider",
  labels: { singular: "Service details slider", plural: "Service details sliders" },
  fields: [
    {
      name: "labels",
      type: "group",
      label: "Section text and controls",
      fields: [
        { name: "kicker", type: "text", label: "Small label above headline", localized: true },
        { name: "titleLine1", type: "text", label: "Headline line 1", localized: true },
        { name: "titleLine2", type: "text", label: "Headline line 2", localized: true },
        {
          name: "titleAriaLabel",
          type: "text",
          label: "Plain headline for screen readers",
          localized: true,
          admin: { description: "Usually leave as-is." },
        },
        { name: "navAriaLabel", type: "text", label: "Slider navigation label", localized: true },
        { name: "progressAriaLabel", type: "text", label: "Progress label", localized: true },
        { name: "progressValueTextTemplate", type: "text", label: "Progress text template", localized: true },
        { name: "eyebrowTemplate", type: "text", label: "Slide label template", localized: true },
        { name: "previous", type: "text", label: "Previous button", localized: true },
        { name: "next", type: "text", label: "Next button", localized: true },
        { name: "ctaLabel", type: "text", label: "Section button text", localized: true },
        { name: "viewDetails", type: "text", label: "Show details button", localized: true },
        { name: "hideDetails", type: "text", label: "Hide details button", localized: true },
      ],
    },
    {
      name: "layers",
      type: "array",
      label: "Service detail slides",
      required: true,
      minRows: 1,
      labels: { singular: "Slide", plural: "Slides" },
      fields: [
        { name: "title", type: "text", label: "Slide title", localized: true, required: true },
        {
          name: "shortTitle",
          type: "text",
          label: "Short tab label",
          localized: true,
          admin: { description: "Optional. Used in the tab strip when the title is too long." },
        },
        {
          name: "theme",
          type: "select",
          label: "Visual theme",
          required: true,
          options: [...SERVICE_THEMES],
        },
        { name: "image", type: "upload", label: "Slide image", relationTo: "media", required: true },
        { name: "copy", type: "textarea", label: "Slide text", localized: true },
        { name: "href", type: "text", label: "Service page path", admin: { description: "Example: /services/comedor-corporativo" } },
        { name: "ctaLabel", type: "text", label: "Link text", localized: true },
        {
          name: "features",
          type: "array",
          label: "Feature bullets",
          fields: [
            { name: "title", type: "text", label: "Feature title", localized: true, required: true },
            { name: "text", type: "textarea", label: "Feature text", localized: true, required: true },
            {
              name: "icon",
              type: "select",
              label: "Icon",
              required: true,
              options: [...FEATURE_ICONS],
            },
          ],
        },
      ],
    },
  ],
}
