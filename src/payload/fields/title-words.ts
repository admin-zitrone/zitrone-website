import type { ArrayField } from "payload"

type TitleWordsOptions = {
  name?: string
  required?: boolean
}

export function titleWordsField({
  name = "titleWords",
  required = true,
}: TitleWordsOptions = {}): ArrayField {
  return {
    name,
    type: "array",
    label: "Headline",
    required,
    minRows: 1,
    labels: { singular: "Headline piece", plural: "Headline pieces" },
    admin: {
      description:
        "Build the section headline piece by piece. Use Accent only for the word or phrase that should stand out.",
    },
    fields: [
      { name: "text", type: "text", label: "Text", localized: true, required: true },
      {
        name: "emphasis",
        type: "select",
        label: "Style",
        defaultValue: "regular",
        options: [
          { label: "Regular", value: "regular" },
          { label: "Italic", value: "italic" },
          { label: "Accent", value: "accent" },
        ],
      },
    ],
  }
}
