import type { CollectionConfig } from "payload"

import {
  revalidateHomeCollection,
  revalidateHomeOnDelete,
} from "../hooks/revalidate"
import { adminAccess, contentEditorAccess } from "../access/roles"

export const Logos: CollectionConfig = {
  slug: "logos",
  labels: { singular: "Logo", plural: "Logos" },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "fit", "scale"],
    group: "Homepage content",
  },
  access: {
    read: () => true,
    create: contentEditorAccess,
    update: contentEditorAccess,
    delete: adminAccess,
  },
  fields: [
    { name: "name", type: "text", label: "Logo name", required: true },
    { name: "image", type: "upload", label: "Logo file", relationTo: "media", required: true },
    {
      name: "monoImage",
      type: "upload",
      label: "Single-colour version",
      relationTo: "media",
      admin: { description: "Optional. Used where logos show as one-colour silhouettes (hero ribbon)." },
    },
    { name: "alt", type: "text", label: "Logo description", localized: true, required: true },
    {
      name: "fit",
      type: "select",
      label: "Logo shape",
      defaultValue: "balanced",
      options: ["wide", "balanced", "compact"],
    },
    {
      name: "scale",
      type: "number",
      label: "Size adjustment",
      min: 0.5,
      max: 2,
      admin: { description: "Optional scale multiplier (0.5 – 2)" },
    },
    {
      name: "usageContext",
      type: "select",
      label: "Where this logo is used",
      hasMany: true,
      options: [
        { label: "Hero ribbon", value: "hero" },
        { label: "Featured media ribbon", value: "ribbon" },
        { label: "Stories", value: "stories" },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateHomeCollection],
    afterDelete: [revalidateHomeOnDelete],
  },
}
