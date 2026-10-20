import type { CollectionConfig } from "payload"

import {
  revalidateHomeCollection,
  revalidateHomeOnDelete,
} from "../hooks/revalidate"
import { adminAccess, contentEditorAccess } from "../access/roles"

export const Stories: CollectionConfig = {
  slug: "stories",
  labels: { singular: "Client story", plural: "Client stories" },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "label", "updatedAt"],
    group: "Homepage content",
  },
  versions: { drafts: true },
  access: {
    read: () => true,
    create: contentEditorAccess,
    update: contentEditorAccess,
    delete: adminAccess,
  },
  fields: [
    { name: "name", type: "text", label: "Client name", required: true },
    { name: "label", type: "text", label: "Short label", localized: true, required: true },
    { name: "role", type: "text", label: "Person role", localized: true, required: true },
    { name: "logo", type: "upload", label: "Client logo", relationTo: "media", required: true },
    {
      name: "logoFit",
      type: "select",
      label: "Logo fit",
      defaultValue: "balanced",
      options: ["wide", "balanced", "compact"],
    },
    {
      name: "logoScale",
      type: "number",
      label: "Logo size adjustment",
      min: 0.5,
      max: 2,
      admin: { description: "Optional scale multiplier (0.5 – 2)" },
    },
    { name: "image", type: "upload", label: "Story image", relationTo: "media", required: true },
    { name: "imageAlt", type: "text", label: "Image description", localized: true, required: true },
    {
      name: "location",
      type: "text",
      label: "Photo location",
      localized: true,
      admin: { description: "Where the photo was taken. Leave empty until confirmed." },
    },
    {
      name: "repeatsHero",
      type: "checkbox",
      label: "Same space as a hero photo",
      admin: { description: "Hides this photo where it would repeat the hero right above it." },
    },
    { name: "quote", type: "textarea", label: "Quote", localized: true, required: true },
    {
      name: "quoteHighlight",
      type: "text",
      label: "Highlighted part of quote",
      localized: true,
      admin: { description: "Substring of the quote to render with accent treatment" },
    },
  ],
  hooks: {
    afterChange: [revalidateHomeCollection],
    afterDelete: [revalidateHomeOnDelete],
  },
}
