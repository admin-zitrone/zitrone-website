import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "contact_requests" ADD COLUMN "source" varchar;
  ALTER TABLE "contact_requests" ADD COLUMN "landing_path" varchar;
  ALTER TABLE "contact_requests" ADD COLUMN "referrer" varchar;
  ALTER TABLE "contact_requests" ADD COLUMN "utm_source" varchar;
  ALTER TABLE "contact_requests" ADD COLUMN "utm_medium" varchar;
  ALTER TABLE "contact_requests" ADD COLUMN "utm_campaign" varchar;
  CREATE INDEX "contact_requests_source_idx" ON "contact_requests" USING btree ("source");
  CREATE INDEX "contact_requests_utm_source_idx" ON "contact_requests" USING btree ("utm_source");
  CREATE INDEX "contact_requests_utm_campaign_idx" ON "contact_requests" USING btree ("utm_campaign");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "contact_requests_source_idx";
  DROP INDEX "contact_requests_utm_source_idx";
  DROP INDEX "contact_requests_utm_campaign_idx";
  ALTER TABLE "contact_requests" DROP COLUMN "source";
  ALTER TABLE "contact_requests" DROP COLUMN "landing_path";
  ALTER TABLE "contact_requests" DROP COLUMN "referrer";
  ALTER TABLE "contact_requests" DROP COLUMN "utm_source";
  ALTER TABLE "contact_requests" DROP COLUMN "utm_medium";
  ALTER TABLE "contact_requests" DROP COLUMN "utm_campaign";`)
}
