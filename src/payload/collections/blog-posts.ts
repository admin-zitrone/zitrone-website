import type { CollectionConfig } from "payload"

import { embedText } from "@/ai/embeddings"
import { seoField } from "../fields/seo"
import {
  revalidateBlogPostCollection,
  revalidateBlogPostOnDelete,
} from "../hooks/revalidate"
import { adminAccess, contentEditorAccess } from "../access/roles"

export const BlogPosts: CollectionConfig = {
  slug: "blogPosts",
  labels: { singular: "Blog post", plural: "Blog posts" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "category", "publishedAt", "_status"],
    group: "Blog",
  },
  versions: { drafts: { autosave: true } },
  access: {
    read: ({ req: { user } }) =>
      user
        ? true
        : { _status: { equals: "published" } },
    create: contentEditorAccess,
    update: contentEditorAccess,
    delete: adminAccess,
  },
  fields: [
    { name: "title", type: "text", label: "Article title", localized: true, required: true },
    {
      name: "slug",
      type: "text",
      label: "URL slug",
      localized: true,
      required: true,
      unique: true,
      admin: {
        description:
          "The URL ending for this article, per language. Example: ES como-construir-un-programa-de-alimentacion-corporativa, EN workplace-food-program-that-works",
      },
    },
    { name: "excerpt", type: "textarea", label: "Short summary", localized: true },
    { name: "heroImage", type: "upload", label: "Cover image", relationTo: "media" },
    {
      name: "heroImageSrc",
      type: "text",
      label: "Fallback cover image path",
      admin: {
        description: "Technical fallback from the old static site. Prefer using Cover image.",
      },
    },
    { name: "heroImageAlt", type: "text", label: "Cover image description", localized: true },
    { name: "dateLabel", type: "text", label: "Date label shown on the page", localized: true },
    { name: "readTime", type: "text", label: "Reading time", localized: true },
    {
      name: "intro",
      type: "array",
      label: "Opening paragraphs",
      labels: { singular: "Intro paragraph", plural: "Intro paragraphs" },
      fields: [{ name: "paragraph", type: "textarea", label: "Paragraph", localized: true, required: true }],
    },
    {
      name: "takeaways",
      type: "array",
      label: "Key takeaways",
      labels: { singular: "Takeaway", plural: "Takeaways" },
      fields: [{ name: "item", type: "textarea", label: "Takeaway", localized: true, required: true }],
    },
    {
      name: "sections",
      type: "array",
      label: "Article sections",
      labels: { singular: "Section", plural: "Sections" },
      fields: [
        {
          name: "id",
          type: "text",
          label: "Section anchor ID",
          required: true,
          admin: { description: "Used for in-page links. Keep lowercase, short, and unique." },
        },
        { name: "title", type: "text", label: "Section heading", localized: true, required: true },
        {
          name: "body",
          type: "array",
          label: "Section paragraphs",
          labels: { singular: "Paragraph", plural: "Paragraphs" },
          fields: [{ name: "paragraph", type: "textarea", label: "Paragraph", localized: true, required: true }],
        },
        { name: "image", type: "upload", label: "Section image", relationTo: "media" },
        {
          name: "imageSrc",
          type: "text",
          label: "Fallback image path",
          admin: { description: "Technical fallback from the old static site. Prefer using Section image." },
        },
        { name: "imageAlt", type: "text", label: "Image description", localized: true },
        {
          name: "checklist",
          type: "array",
          label: "Checklist (optional)",
          labels: { singular: "Checklist item", plural: "Checklist items" },
          // Not required: rows are shared across languages, so a language
          // without a checklist keeps empty rows (the site skips them).
          admin: { description: "Shown as a checklist after the section paragraphs. Leave empty in a language that has no checklist." },
          fields: [{ name: "item", type: "text", label: "Item", localized: true }],
        },
        {
          name: "links",
          type: "array",
          label: "Inline links (optional)",
          labels: { singular: "Link sentence", plural: "Link sentences" },
          admin: {
            description:
              "A sentence with a link inside it: text before, the linked words, and text after. Keep the space at the end of 'before' and at the start of 'after'.",
          },
          fields: [
            { name: "before", type: "text", label: "Text before the link", localized: true },
            { name: "label", type: "text", label: "Linked words", localized: true },
            {
              name: "href",
              type: "text",
              label: "Link",
              localized: true,
              admin: { description: "Site path without language, e.g. /services/comedor-corporativo" },
            },
            { name: "after", type: "text", label: "Text after the link", localized: true },
          ],
        },
      ],
    },
    {
      name: "cta",
      type: "group",
      label: "Article call to action",
      admin: {
        description:
          "Optional. Replaces the default contact box at the end of the article. Keep the ?src= tag so leads are attributed.",
      },
      fields: [
        { name: "heading", type: "text", label: "Heading", localized: true },
        { name: "label", type: "text", label: "Button text", localized: true },
        { name: "href", type: "text", label: "Button link", localized: true },
      ],
    },
    {
      name: "faqs",
      type: "array",
      label: "Article FAQs",
      labels: { singular: "FAQ", plural: "FAQs" },
      fields: [
        { name: "question", type: "text", label: "Question", localized: true, required: true },
        { name: "answer", type: "textarea", label: "Answer", localized: true, required: true },
      ],
    },
    {
      name: "body",
      type: "richText",
      label: "Rich text article body",
      localized: true,
      admin: { description: "Optional. The current article template mainly uses Opening paragraphs and Article sections." },
    },
    { name: "category", type: "relationship", label: "Category", relationTo: "blogCategories" },
    { name: "tags", type: "text", label: "Tags", hasMany: true },
    {
      name: "author",
      type: "group",
      label: "Author",
      fields: [
        { name: "name", type: "text", label: "Name" },
        { name: "role", type: "text", label: "Role or title", localized: true },
        { name: "avatar", type: "upload", label: "Photo", relationTo: "media" },
      ],
    },
    {
      name: "publishedAt",
      type: "date",
      label: "Publish date",
      admin: { date: { pickerAppearance: "dayAndTime" } },
    },
    {
      name: "embedding",
      type: "json",
      admin: { hidden: true },
    },
    seoField,
  ],
  hooks: {
    beforeChange: [
      async ({ data, req }) => {
        const locale = (req.locale as string | undefined) ?? "es"
        const text = [data.title, data.excerpt].filter(Boolean).join("\n")
        if (!text) return data
        const vector = await embedText(text)
        if (vector) {
          data.embedding = { locale, vector, generatedAt: new Date().toISOString() }
        }
        return data
      },
    ],
    afterChange: [revalidateBlogPostCollection],
    afterDelete: [revalidateBlogPostOnDelete],
  },
}
