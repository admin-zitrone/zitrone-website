import type { CollectionConfig } from "payload"

import { observabilityEvents } from "@/lib/observability/events"
import { trackServerEvent } from "@/lib/observability/server"
import { serverEnv } from "@/env/server"

import { ROLE_OPTIONS } from "../access/roles"

const PASSWORD_MIN_LENGTH = 12
const PASSWORD_COMPLEXITY_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/

export const Users: CollectionConfig = {
  slug: "users",
  labels: { singular: "User", plural: "Users" },
  admin: {
    useAsTitle: "email",
    defaultColumns: ["email", "name", "role"],
    group: "System",
  },
  auth: {
    cookies: {
      sameSite: "Lax",
      secure: serverEnv.nodeEnv !== "development",
    },
    forgotPassword: {
      expiration: 30 * 60 * 1000,
    },
    lockTime: 15 * 60 * 1000,
    maxLoginAttempts: 5,
    removeTokenFromResponses: true,
    tokenExpiration: 2 * 60 * 60,
  },
  access: {
    read: ({ req: { user } }) => Boolean(user),
    create: ({ req: { user } }) => user?.role === "admin",
    update: ({ req: { user }, id }) =>
      user?.role === "admin" || user?.id === id,
    delete: ({ req: { user } }) => user?.role === "admin",
  },
  fields: [
    { name: "name", type: "text", label: "Name" },
    {
      name: "role",
      type: "select",
      label: "Role",
      defaultValue: "editor",
      required: true,
      access: {
        // Only admins may assign or change roles. The `!user` case covers
        // Payload's first-user bootstrap, which runs before any admin exists;
        // collection-level `create` still gates every other creation path.
        create: ({ req: { user } }) => user?.role === "admin" || !user,
        update: ({ req: { user } }) => user?.role === "admin",
      },
      options: [...ROLE_OPTIONS],
    },
  ],
  hooks: {
    beforeChange: [
      // Defence in depth: field access already strips `role` for non-admins,
      // but this guarantees a non-admin can never persist a role change even
      // if that field access is later relaxed by mistake.
      async ({ data, req, operation, originalDoc }) => {
        if (req.user?.role === "admin") return data
        if (data?.role === undefined) return data

        const currentRole =
          operation === "update"
            ? (typeof originalDoc?.role === "string" ? originalDoc.role : "editor")
            : undefined

        if (operation === "update" && data.role !== currentRole) {
          return { ...data, role: currentRole }
        }

        if (operation === "create" && req.user && data.role !== "editor") {
          return { ...data, role: "editor" }
        }

        return data
      },
    ],
    beforeValidate: [
      ({ data }) => {
        const password = typeof data?.password === "string" ? data.password : undefined

        if (!password) return data

        if (password.length < PASSWORD_MIN_LENGTH) {
          throw new Error(
            `Password must be at least ${PASSWORD_MIN_LENGTH} characters long.`,
          )
        }

        if (!PASSWORD_COMPLEXITY_REGEX.test(password)) {
          throw new Error(
            "Password must include uppercase, lowercase, numeric, and special characters.",
          )
        }

        return data
      },
    ],
    afterLogin: [
      async ({ req, user }) => {
        await trackServerEvent(observabilityEvents.payloadAuthLoginSuccess, {
          collection: "users",
          role: typeof user?.role === "string" ? user.role : "unknown",
          hasUser: Boolean(req.user),
        })
      },
    ],
    afterChange: [
      async ({ operation, doc, req }) => {
        await trackServerEvent(observabilityEvents.payloadUserChanged, {
          collection: "users",
          operation,
          actorRole: typeof req.user?.role === "string" ? req.user.role : "unknown",
          targetRole: typeof doc?.role === "string" ? doc.role : "unknown",
        })
      },
    ],
    afterDelete: [
      async ({ req, doc }) => {
        await trackServerEvent(observabilityEvents.payloadUserChanged, {
          collection: "users",
          operation: "delete",
          actorRole: typeof req.user?.role === "string" ? req.user.role : "unknown",
          targetRole: typeof doc?.role === "string" ? doc.role : "unknown",
        })
      },
    ],
    afterError: [
      async ({ error, req, result }) => {
        const message = error?.message ?? "unknown"
        const hasAuthErrorName = (result?.errors ?? []).some((item) =>
          /AuthenticationError|LockedAuth|ValidationError/i.test(item?.name ?? ""),
        )

        if (!/login|auth|password|token/i.test(message) && !hasAuthErrorName) {
          return
        }

        await trackServerEvent(observabilityEvents.payloadAuthError, {
          collection: "users",
          errorName: error?.name ?? "unknown",
          actorRole: typeof req.user?.role === "string" ? req.user.role : "anonymous",
        })
      },
    ],
  },
}
