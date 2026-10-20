import type { Block, GroupField } from "payload"

const programGroup = (name: string): GroupField => ({
  name,
  type: "group",
  label:
    name === "programA"
      ? "Recommended setup A"
      : name === "programB"
        ? "Recommended setup B"
        : "Recommended setup C",
  fields: [
    { name: "label", type: "text", label: "Short label", localized: true, required: true },
    { name: "heading", type: "text", label: "Result headline", localized: true, required: true },
    { name: "body", type: "textarea", label: "Result explanation", localized: true, required: true },
    {
      name: "recommendations",
      type: "array",
      label: "Recommended next steps",
      fields: [{ name: "text", type: "text", localized: true, required: true }],
    },
  ],
})

export const ProfilerBlock: Block = {
  slug: "profiler",
  labels: { singular: "Recommendation quiz", plural: "Recommendation quiz sections" },
  fields: [
    {
      name: "labels",
      type: "group",
      label: "Quiz text",
      fields: [
        { name: "kicker", type: "text", label: "Small label above quiz", localized: true },
        { name: "step0Heading", type: "text", label: "Opening headline", localized: true },
        { name: "step0Copy", type: "textarea", label: "Opening text", localized: true },
        { name: "chooserAriaLabel", type: "text", label: "Chooser accessibility label", localized: true },
        { name: "chooserPlaceholder", type: "text", label: "Dropdown placeholder", localized: true },
        { name: "step1Heading", type: "text", label: "Step 1 headline", localized: true },
        { name: "step1Copy", type: "textarea", label: "Step 1 text", localized: true },
        { name: "step2Heading", type: "text", label: "Step 2 headline", localized: true },
        { name: "step2Copy", type: "textarea", label: "Step 2 text", localized: true },
        { name: "back", type: "text", label: "Back button", localized: true },
        { name: "seeSetup", type: "text", label: "See recommendation button", localized: true },
        { name: "startOver", type: "text", label: "Start over button", localized: true },
        { name: "talkToZitrone", type: "text", label: "Contact button", localized: true },
        { name: "talkToZitroneHref", type: "text", label: "Contact button URL" },
        { name: "defaultResultHeading", type: "text", label: "Fallback result headline", localized: true },
        { name: "defaultResultBody", type: "textarea", label: "Fallback result text", localized: true },
        programGroup("programA"),
        programGroup("programB"),
        programGroup("programC"),
        { name: "programAExtraBreakfast", type: "text", label: "Extra text: breakfast", localized: true },
        { name: "programAExtraDining", type: "text", label: "Extra text: dining", localized: true },
        { name: "programAExtraGrabAndGo", type: "text", label: "Extra text: grab-and-go", localized: true },
        { name: "programBExtraCoffee", type: "text", label: "Extra text: coffee", localized: true },
        { name: "programBExtraPantry", type: "text", label: "Extra text: pantry", localized: true },
        { name: "programBExtraCafeteria", type: "text", label: "Extra text: cafeteria", localized: true },
        { name: "programBFallback", type: "text", label: "Fallback text for setup B", localized: true },
        { name: "plusEvents", type: "text", label: "Add-on text: events", localized: true },
        { name: "plusFuel", type: "text", label: "Add-on text: fuel", localized: true },
        { name: "growthLevel1", type: "text", label: "Growth note: level 1", localized: true },
        { name: "growthLevel2", type: "text", label: "Growth note: level 2", localized: true },
        { name: "growthLevel3", type: "text", label: "Growth note: level 3", localized: true },
        { name: "growthLevel4", type: "text", label: "Growth note: level 4", localized: true },
      ],
    },
    {
      name: "volumeOptions",
      type: "array",
      label: "Company size options",
      fields: [
        { name: "label", type: "text", label: "Option shown to visitors", localized: true, required: true },
        {
          name: "value",
          type: "text",
          label: "Internal value",
          required: true,
          admin: { description: "Technical value used by the quiz logic. Usually leave as-is." },
        },
      ],
    },
    {
      name: "jobs",
      type: "array",
      label: "Operational jobs / goals",
      fields: [
        { name: "id", type: "text", label: "Internal ID", required: true },
        { name: "title", type: "text", label: "Title", localized: true, required: true },
        { name: "text", type: "textarea", label: "Description", localized: true },
      ],
    },
    {
      name: "needs",
      type: "array",
      label: "Food service needs",
      fields: [
        { name: "id", type: "text", label: "Internal ID", required: true },
        { name: "title", type: "text", label: "Title", localized: true, required: true },
        { name: "text", type: "textarea", label: "Description", localized: true },
      ],
    },
  ],
}
