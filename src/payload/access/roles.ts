import type { Access } from "payload"

/**
 * CMS roles. One place decides who may do what:
 *
 * | Role   | Site content (collections, globals) | Leads                                  | Users / roles |
 * | ------ | ----------------------------------- | -------------------------------------- | ------------- |
 * | admin  | create, edit, delete                | read, status/notes, export, delete     | manage        |
 * | editor | create, edit                        | none                                   | own account   |
 * | sales  | none (read only, like the public)   | read, status/notes, export (no delete) | own account   |
 *
 * Submitted lead data is immutable for every role (see access/leads.ts).
 */
export const ROLE_OPTIONS = [
  { label: "Admin", value: "admin" },
  { label: "Editor", value: "editor" },
  { label: "Sales", value: "sales" },
] as const

export type Role = (typeof ROLE_OPTIONS)[number]["value"]

export function roleOf(user: unknown): Role | undefined {
  const role = (user as { role?: unknown } | null | undefined)?.role
  return ROLE_OPTIONS.some((option) => option.value === role) ? (role as Role) : undefined
}

export function canEditContent(user: unknown) {
  const role = roleOf(user)
  return role === "admin" || role === "editor"
}

export function isAdmin(user: unknown) {
  return roleOf(user) === "admin"
}

export const contentEditorAccess: Access = ({ req: { user } }) => canEditContent(user)
export const adminAccess: Access = ({ req: { user } }) => isAdmin(user)
