import type { Block } from "payload"

import { linkField } from "../fields/link"
import { SERVICE_THEMES } from "../fields/options"
import { titleWordsField } from "../fields/title-words"

export const ServicesCarouselBlock: Block = {
  slug: "servicesCarousel",
  labels: { singular: "Services section", plural: "Services sections" },
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
    {
      name: "coverCopy",
      type: "textarea",
      label: "Intro text on the services cover",
      localized: true,
      admin: { description: "Optional. Falls back to the section intro text." },
    },
    linkField({ name: "ctaPrimary", required: true, label: "Main button" }),
    linkField({ name: "ctaSecondary", label: "Secondary button" }),
    {
      name: "services",
      type: "relationship",
      label: "Service cards to show",
      relationTo: "services",
      hasMany: true,
      required: true,
      admin: { description: "Pick the service cards shown in the carousel" },
    },
    {
      name: "labels",
      type: "group",
      label: "Carousel controls",
      admin: { description: "Button labels used by the carousel. Usually leave these as-is." },
      fields: [
        { name: "regionLabel", type: "text", label: "Carousel label", localized: true },
        { name: "previous", type: "text", label: "Previous button", localized: true },
        { name: "next", type: "text", label: "Next button", localized: true },
        { name: "progressLabel", type: "text", label: "Progress label", localized: true },
        { name: "slideTemplate", type: "text", label: "Slide count text", localized: true },
        { name: "viewService", type: "text", label: "View service link", localized: true },
        { name: "logosAriaLabel", type: "text", label: "Client logos label", localized: true },
      ],
    },
    {
      name: "orbitItems",
      type: "array",
      label: "Rotating service moments",
      labels: { singular: "Moment", plural: "Moments" },
      admin: { description: "The moments that rotate on the services cover, each tied to a service." },
      fields: [
        { name: "title", type: "text", label: "Title", localized: true, required: true },
        { name: "theme", type: "select", label: "Service", required: true, options: [...SERVICE_THEMES] },
        { name: "image", type: "upload", label: "Photo", relationTo: "media", required: true },
        { name: "copy", type: "textarea", label: "Text", localized: true, required: true },
      ],
    },
  ],
}
