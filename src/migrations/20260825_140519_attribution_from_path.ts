import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "contact_requests" ADD COLUMN "from_path" varchar;
  CREATE INDEX "contact_requests_from_path_idx" ON "contact_requests" USING btree ("from_path");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "contact_requests_from_path_idx";
  ALTER TABLE "contact_requests" DROP COLUMN "from_path";`)
}
