import { type MigrateUpArgs, type MigrateDownArgs, sql } from "@payloadcms/db-postgres"

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`ALTER TABLE "contact_requests" ADD COLUMN "email_delivery" jsonb;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`ALTER TABLE "contact_requests" DROP COLUMN "email_delivery";`)
}
