import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "contact_requests" ADD COLUMN "cta_section" varchar;
  ALTER TABLE "contact_requests" ADD COLUMN "cta_text" varchar;
  ALTER TABLE "contact_requests" ADD COLUMN "utm_term" varchar;
  ALTER TABLE "contact_requests" ADD COLUMN "utm_content" varchar;
  ALTER TABLE "contact_requests" ADD COLUMN "click_id" varchar;
  ALTER TABLE "contact_requests" ADD COLUMN "first_touch" varchar;
  ALTER TABLE "contact_requests" ADD COLUMN "ga_client_id" varchar;
  ALTER TABLE "contact_requests" ADD COLUMN "ga_session_id" varchar;
  CREATE INDEX "contact_requests_cta_section_idx" ON "contact_requests" USING btree ("cta_section");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "contact_requests_cta_section_idx";
  ALTER TABLE "contact_requests" DROP COLUMN "cta_section";
  ALTER TABLE "contact_requests" DROP COLUMN "cta_text";
  ALTER TABLE "contact_requests" DROP COLUMN "utm_term";
  ALTER TABLE "contact_requests" DROP COLUMN "utm_content";
  ALTER TABLE "contact_requests" DROP COLUMN "click_id";
  ALTER TABLE "contact_requests" DROP COLUMN "first_touch";
  ALTER TABLE "contact_requests" DROP COLUMN "ga_client_id";
  ALTER TABLE "contact_requests" DROP COLUMN "ga_session_id";`)
}
