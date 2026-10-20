import type { CollectionConfig } from "payload"

import { embedText } from "@/ai/embeddings"
import {
  revalidateHomeCollection,
  revalidateHomeOnDelete,
} from "../hooks/revalidate"
import { adminAccess, contentEditorAccess } from "../access/roles"

export const Faqs: CollectionConfig = {
  slug: "faqs",
  labels: { singular: "FAQ", plural: "FAQs" },
  admin: {
    useAsTitle: "question",
    defaultColumns: ["question", "tags", "updatedAt"],
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
    { name: "question", type: "text", label: "Question", localized: true, required: true },
    {
      name: "answer",
      type: "array",
      label: "Answer",
      required: true,
      minRows: 1,
      labels: { singular: "Paragraph", plural: "Paragraphs" },
      fields: [
        { name: "paragraph", type: "textarea", label: "Paragraph", localized: true, required: true },
      ],
    },
    { name: "tags", type: "text", label: "Tags", hasMany: true },
    {
      name: "embedding",
      type: "json",
      admin: {
        hidden: true,
        description: "Vector embedding for semantic search — auto-generated",
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, req }) => {
        const locale = (req.locale as string | undefined) ?? "es"
        const paragraphs = (data.answer ?? []) as Array<{ paragraph?: string }>
        const text = [data.question, ...paragraphs.map((p) => p.paragraph)]
          .filter((s): s is string => Boolean(s))
          .join("\n")

        if (!text) return data

        const vector = await embedText(text)
        if (vector) {
          data.embedding = { locale, vector, generatedAt: new Date().toISOString() }
        }
        return data
      },
    ],
    afterChange: [revalidateHomeCollection],
    afterDelete: [revalidateHomeOnDelete],
  },
}
