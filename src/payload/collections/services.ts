import type { CollectionConfig } from "payload"

import { seoField } from "../fields/seo"
import {
  revalidateHomeCollection,
  revalidateHomeOnDelete,
} from "../hooks/revalidate"
import { adminAccess, contentEditorAccess } from "../access/roles"

export const Services: CollectionConfig = {
  slug: "services",
  labels: { singular: "Service card", plural: "Service cards" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "accent", "updatedAt"],
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
    { name: "title", type: "text", label: "Service title", localized: true, required: true },
    { name: "eyebrow", type: "text", label: "Small label", localized: true },
    {
      name: "accent",
      type: "select",
      label: "Visual style",
      required: true,
      options: ["dining", "cafe", "pantry", "catering"],
    },
    { name: "image", type: "upload", label: "Service image", relationTo: "media", required: true },
    { name: "copy", type: "textarea", label: "Description", localized: true, required: true },
    { name: "href", type: "text", label: "Service page path", localized: true, admin: { description: "Example: /services/comedor-corporativo" } },
    { name: "ctaLabel", type: "text", label: "Link text", localized: true },
    {
      name: "relatedLinks",
      type: "array",
      label: "Related services",
      localized: true,
      labels: { singular: "Link", plural: "Links" },
      fields: [
        { name: "label", type: "text", label: "Text", required: true },
        { name: "href", type: "text", label: "Path", required: true },
      ],
    },
    {
      name: "slug",
      type: "text",
      label: "Internal slug",
      required: true,
      unique: true,
      admin: { description: "Technical ID. Keep short, lowercase, and unique." },
    },
    seoField,
  ],
  hooks: {
    afterChange: [revalidateHomeCollection],
    afterDelete: [revalidateHomeOnDelete],
  },
}
