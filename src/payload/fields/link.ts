import type { Field, GroupField } from "payload"

type LinkOptions = {
  name?: string
  required?: boolean
  label?: string | { en: string; es: string }
}

export function linkField({
  name = "link",
  required = false,
  label,
}: LinkOptions = {}): GroupField {
  const fields: Field[] = [
    {
      name: "type",
      type: "select",
      label: "Link type",
      defaultValue: "internal",
      options: [
        { label: "Page on this website", value: "internal" },
        { label: "External website", value: "external" },
        { label: "Section on this page", value: "anchor" },
      ],
      admin: {
        description: "Choose where this button or navigation item should go.",
      },
    },
    {
      name: "label",
      type: "text",
      label: "Text shown to visitors",
      localized: true,
      required,
    },
    {
      name: "internalHref",
      type: "text",
      // Paths differ per language (localized service slugs, mailto subjects).
      localized: true,
      label: "Website path",
      admin: {
        description: "Example: /es/blog or /privacy-notice",
        condition: (_, siblingData) => siblingData?.type === "internal",
      },
    },
    {
      name: "externalHref",
      type: "text",
      localized: true,
      label: "Full external URL",
      admin: {
        description: "Example: https://example.com",
        condition: (_, siblingData) => siblingData?.type === "external",
      },
    },
    {
      name: "anchor",
      type: "text",
      localized: true,
      label: "Section ID",
      admin: {
        description: "Example: services. Do not include the # symbol.",
        condition: (_, siblingData) => siblingData?.type === "anchor",
      },
    },
  ]

  return {
    name,
    type: "group",
    label,
    fields,
  }
}
