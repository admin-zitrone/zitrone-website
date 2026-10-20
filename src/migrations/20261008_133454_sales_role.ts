import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/* Adds the `sales` CMS role (reads and works leads, no content editing).
   Additive: existing users and rows are untouched. */
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_users_role" ADD VALUE 'sales';`)
}

/* Refuses to run while any user still has the sales role: reassign them
   first. Silently converting them would change what they can access. */
export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DO $$ BEGIN
     IF EXISTS (SELECT 1 FROM "users" WHERE "role" = 'sales') THEN
       RAISE EXCEPTION 'sales users exist: reassign their role before rolling back 20261008_133454_sales_role';
     END IF;
   END $$;
   ALTER TABLE "users" ALTER COLUMN "role" SET DATA TYPE text;
  ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'editor'::text;
  DROP TYPE "public"."enum_users_role";
  CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor');
  ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'editor'::"public"."enum_users_role";
  ALTER TABLE "users" ALTER COLUMN "role" SET DATA TYPE "public"."enum_users_role" USING "role"::"public"."enum_users_role";`)
}
