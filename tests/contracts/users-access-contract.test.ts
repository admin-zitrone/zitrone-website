import assert from "node:assert/strict"
import test, { describe } from "node:test"

import { Users } from "@/payload/collections/users"

type Actor = { id?: string; role?: string } | null

const roleField = (Users.fields as Array<Record<string, unknown>>).find(
  (field) => field.name === "role",
) as
  | {
      access?: {
        create?: (args: Record<string, unknown>) => boolean
        update?: (args: Record<string, unknown>) => boolean
      }
    }
  | undefined

const beforeChange = Users.hooks?.beforeChange?.[0] as
  | ((args: Record<string, unknown>) => unknown)
  | undefined

const req = (user: Actor) => ({ req: { user } })

describe("users collection protects role assignment", () => {
  test("the role field declares create and update access", () => {
    assert.ok(roleField, "the role field must exist")
    assert.equal(typeof roleField?.access?.update, "function")
    assert.equal(typeof roleField?.access?.create, "function")
  })

  test("only admins may update a role", () => {
    assert.equal(roleField!.access!.update!(req({ id: "1", role: "admin" })), true)
    assert.equal(roleField!.access!.update!(req({ id: "2", role: "editor" })), false)
    assert.equal(roleField!.access!.update!(req(null)), false)
  })

  test("role creation is limited to admins and the first-user bootstrap", () => {
    assert.equal(roleField!.access!.create!(req({ id: "1", role: "admin" })), true)
    assert.equal(roleField!.access!.create!(req({ id: "2", role: "editor" })), false)
    assert.equal(roleField!.access!.create!(req(null)), true)
  })

  test("an editor cannot persist a role change to their own record", async () => {
    const result = (await beforeChange!({
      data: { name: "Editor", role: "admin" },
      req: { user: { id: "2", role: "editor" } },
      operation: "update",
      originalDoc: { id: "2", role: "editor" },
    })) as Record<string, unknown>

    assert.equal(result.role, "editor")
  })

  test("an admin keeps the ability to change a role", async () => {
    const result = (await beforeChange!({
      data: { role: "admin" },
      req: { user: { id: "1", role: "admin" } },
      operation: "update",
      originalDoc: { id: "2", role: "editor" },
    })) as Record<string, unknown>

    assert.equal(result.role, "admin")
  })

  test("a non-admin creating a user cannot mint an admin", async () => {
    const result = (await beforeChange!({
      data: { email: "x@example.com", role: "admin" },
      req: { user: { id: "2", role: "editor" } },
      operation: "create",
    })) as Record<string, unknown>

    assert.equal(result.role, "editor")
  })

  test("the first-user bootstrap keeps its requested role", async () => {
    const result = (await beforeChange!({
      data: { email: "first@example.com", role: "admin" },
      req: { user: null },
      operation: "create",
    })) as Record<string, unknown>

    assert.equal(result.role, "admin")
  })
})
