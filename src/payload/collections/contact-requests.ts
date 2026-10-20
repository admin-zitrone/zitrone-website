import type { CollectionConfig, Field } from "payload"

import {
  keepSubmittedLeadData,
  leadAccess,
  submittedFieldAccess,
} from "../access/leads"
import { adminAccess } from "../access/roles"

/**
 * Every contact submission, stored the moment it arrives.
 *
 * The site's other lead paths hand the visitor a `mailto:` and hope they
 * press send; anything that never reaches an inbox is a lead nobody can
 * count. This collection is the record that exists whether or not a
 * notification is ever delivered.
 *
 * Nothing here is editable: the row is what the person actually wrote.
 * Only `status` and `internalNotes` are ours to change, so a sales follow-up
 * never rewrites the evidence. That holds for the API, not just the admin
 * form: submitted fields carry field access that refuses writes, and a
 * beforeChange hook restores them if that is ever relaxed. Reading,
 * changing and exporting leads is admin-only (see `access/leads.ts`).
 */
export const ContactRequests: CollectionConfig = {
  slug: "contactRequests",
  labels: { singular: "Contact request", plural: "Contact requests" },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "company", "source", "status", "createdAt"],
    group: "Leads",
    description:
      "Submissions from the contact page. Read-only except for status and internal notes.",
  },
  access: {
    /* Written by the API route with `overrideAccess`, never by the public. */
    create: () => false,
    read: leadAccess,
    update: leadAccess,
    // Sales works leads but cannot destroy them.
    delete: adminAccess,
  },
  hooks: {
    beforeChange: [keepSubmittedLeadData],
  },
  timestamps: true,
  fields: lockSubmittedFields([
    {
      type: "row",
      fields: [
        {
          name: "status",
          type: "select",
          label: "Status",
          defaultValue: "new",
          required: true,
          options: [
            { label: "New", value: "new" },
            { label: "Contacted", value: "contacted" },
            { label: "Qualified", value: "qualified" },
            { label: "Closed", value: "closed" },
          ],
          admin: { width: "50%" },
        },
        {
          name: "locale",
          type: "select",
          label: "Language",
          options: [
            { label: "Español", value: "es" },
            { label: "English", value: "en" },
          ],
          admin: { width: "50%", readOnly: true },
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "name",
          type: "text",
          label: "Name",
          required: true,
          admin: { width: "50%", readOnly: true },
        },
        {
          name: "company",
          type: "text",
          label: "Company",
          admin: { width: "50%", readOnly: true },
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "email",
          type: "email",
          label: "Email",
          required: true,
          admin: { width: "50%", readOnly: true },
        },
        {
          name: "phone",
          type: "text",
          label: "Phone",
          admin: { width: "50%", readOnly: true },
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "interest",
          type: "text",
          label: "Interested in",
          admin: { width: "50%", readOnly: true },
        },
        {
          name: "headcount",
          type: "text",
          label: "People on site",
          admin: { width: "50%", readOnly: true },
        },
      ],
    },
    {
      name: "message",
      type: "textarea",
      label: "Message",
      admin: { readOnly: true },
    },
    {
      name: "emailDelivery",
      type: "json",
      label: "Email delivery",
      access: { create: () => false, update: () => false },
      admin: {
        readOnly: true,
        description: "Saved messages and Resend acceptance status. Accepted does not prove inbox receipt. Retry through the email recovery command.",
      },
    },
    {
      name: "internalNotes",
      type: "textarea",
      label: "Internal notes",
      admin: { description: "Ours, not theirs. Never shown to the sender." },
    },
    {
      name: "requestId",
      type: "text",
      label: "Request ID",
      index: true,
      admin: { readOnly: true, position: "sidebar" },
    },
    {
      name: "sourcePath",
      type: "text",
      label: "Submitted from",
      admin: { readOnly: true, position: "sidebar" },
    },
    {
      type: "collapsible",
      label: "Attribution",
      admin: { initCollapsed: true },
      fields: [
        {
          name: "source",
          type: "text",
          label: "CTA",
          index: true,
          admin: {
            readOnly: true,
            description: "Which call to action sent them to the form. Empty = they reached the form without clicking one.",
          },
        },
        {
          type: "row",
          fields: [
            {
              name: "ctaSection",
              type: "text",
              label: "CTA section",
              index: true,
              admin: {
                width: "50%",
                readOnly: true,
                description: "Block of the page the CTA sat in: nav, hero, faq, footer…",
              },
            },
            {
              name: "ctaText",
              type: "text",
              label: "CTA label",
              admin: { width: "50%", readOnly: true },
            },
          ],
        },
        {
          name: "fromPath",
          type: "text",
          label: "Clicked from",
          index: true,
          admin: {
            readOnly: true,
            description: "The page the CTA was clicked on.",
          },
        },
        {
          name: "landingPath",
          type: "text",
          label: "Landed on",
          admin: { readOnly: true, description: "First page of the visit." },
        },
        {
          name: "referrer",
          type: "text",
          label: "Referrer",
          admin: { readOnly: true, description: "External site they arrived from." },
        },
        {
          type: "row",
          fields: [
            {
              name: "utmSource",
              type: "text",
              label: "utm_source",
              index: true,
              admin: { width: "33%", readOnly: true },
            },
            {
              name: "utmMedium",
              type: "text",
              label: "utm_medium",
              admin: { width: "33%", readOnly: true },
            },
            {
              name: "utmCampaign",
              type: "text",
              label: "utm_campaign",
              index: true,
              admin: { width: "34%", readOnly: true },
            },
          ],
        },
        {
          type: "row",
          fields: [
            {
              name: "utmTerm",
              type: "text",
              label: "utm_term",
              admin: { width: "50%", readOnly: true },
            },
            {
              name: "utmContent",
              type: "text",
              label: "utm_content",
              admin: { width: "50%", readOnly: true },
            },
          ],
        },
        {
          name: "clickId",
          type: "text",
          label: "Ad click id",
          admin: {
            readOnly: true,
            description: "gclid/msclkid/fbclid… Upload it back to the ad platform when this lead qualifies.",
          },
        },
        {
          name: "firstTouch",
          type: "text",
          label: "First visit",
          admin: {
            readOnly: true,
            description: "Channel · campaign · landing · date of their first visit (last 90 days).",
          },
        },
        {
          type: "row",
          fields: [
            {
              name: "gaClientId",
              type: "text",
              label: "GA4 client id",
              admin: { width: "50%", readOnly: true },
            },
            {
              name: "gaSessionId",
              type: "text",
              label: "GA4 session id",
              admin: { width: "50%", readOnly: true },
            },
          ],
        },
      ],
    },
  ]),
}

/* Every data field except the ones a person works (status, notes) refuses
   API writes; emailDelivery already did. Layout fields (rows, collapsibles)
   are walked so nested data fields are covered too. */
function lockSubmittedFields(fields: Field[]): Field[] {
  return fields.map((field) => {
    if ("fields" in field && !("name" in field)) {
      return { ...field, fields: lockSubmittedFields(field.fields) } as Field
    }
    if (!("name" in field) || field.name === "status" || field.name === "internalNotes") {
      return field
    }
    const access = "access" in field ? field.access : undefined
    return { ...field, access: { ...access, ...submittedFieldAccess } } as Field
  })
}
