import type { CollectionConfig } from "payload"

import {
  revalidateBlogIndexCollection,
  revalidateBlogIndexOnDelete,
} from "../hooks/revalidate"
import { adminAccess, contentEditorAccess } from "../access/roles"

export const BlogCategories: CollectionConfig = {
  slug: "blogCategories",
  labels: { singular: "Blog category", plural: "Blog categories" },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "slug"],
    group: "Blog",
  },
  access: {
    read: () => true,
    create: contentEditorAccess,
    update: contentEditorAccess,
    delete: adminAccess,
  },
  fields: [
    { name: "name", type: "text", label: "Category name", localized: true, required: true },
    {
      name: "slug",
      type: "text",
      label: "URL slug",
      required: true,
      unique: true,
      admin: { description: "Example: workplace-dining" },
    },
  ],
  hooks: {
    afterChange: [revalidateBlogIndexCollection],
    afterDelete: [revalidateBlogIndexOnDelete],
  },
}
