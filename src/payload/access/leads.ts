import type { Access, CollectionBeforeChangeHook, FieldAccess } from "payload"

import { roleOf } from "./roles"

/**
 * Who may see and work leads (contact requests and their CSV export): admins
 * and the sales role (user decision, 2026-10-07). Editors maintain site
 * content and have no reason to read personal data. Deleting a lead stays
 * admin-only. This is the one place the decision lives, shared by the
 * collection and `/api/leads/export`. Role table: access/roles.ts.
 */
export function canWorkLeads(user: unknown): boolean {
  const role = roleOf(user)
  return role === "admin" || role === "sales"
}

export const leadAccess: Access = ({ req: { user } }) => canWorkLeads(user)

/** The fields a person working a lead may change. Everything else is what
 * the sender wrote, or how they reached the form, and stays as received. */
export const LEAD_WORKING_FIELDS = ["status", "internalNotes"] as const

/** Field access for submitted data: never written through the API. The
 * server's own writes use `overrideAccess`, which skips field access. */
export const submittedFieldAccess: { create: FieldAccess; update: FieldAccess } = {
  create: () => false,
  update: () => false,
}

/**
 * Defence in depth behind field access: on any update made by a signed-in
 * person, every field other than status and notes is reset to the stored
 * value, so relaxing a field's access by mistake still cannot rewrite a lead.
 * Updates without a user are the server's own (email delivery bookkeeping
 * from the contact route and the retry script) and pass through.
 */
export const keepSubmittedLeadData: CollectionBeforeChangeHook = ({
  data,
  operation,
  originalDoc,
  req,
}) => {
  if (operation !== "update" || !req.user || !originalDoc || !data) return data

  const kept: Record<string, unknown> = { ...data }
  for (const key of Object.keys(kept)) {
    if (WRITABLE_KEYS.has(key)) continue
    if (key in originalDoc) kept[key] = (originalDoc as Record<string, unknown>)[key]
    else delete kept[key]
  }
  return kept
}

/* Bookkeeping Payload maintains itself, left alone. */
const WRITABLE_KEYS = new Set<string>([...LEAD_WORKING_FIELDS, "id", "updatedAt"])
