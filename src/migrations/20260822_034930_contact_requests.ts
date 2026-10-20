import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_contact_requests_status" AS ENUM('new', 'contacted', 'qualified', 'closed');
  CREATE TYPE "public"."enum_contact_requests_locale" AS ENUM('es', 'en');
  CREATE TABLE "contact_requests" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"status" "enum_contact_requests_status" DEFAULT 'new' NOT NULL,
  	"locale" "enum_contact_requests_locale",
  	"name" varchar NOT NULL,
  	"company" varchar,
  	"email" varchar NOT NULL,
  	"phone" varchar,
  	"interest" varchar,
  	"headcount" varchar,
  	"message" varchar,
  	"internal_notes" varchar,
  	"request_id" varchar,
  	"source_path" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "contact_requests_id" integer;
  CREATE INDEX "contact_requests_request_id_idx" ON "contact_requests" USING btree ("request_id");
  CREATE INDEX "contact_requests_updated_at_idx" ON "contact_requests" USING btree ("updated_at");
  CREATE INDEX "contact_requests_created_at_idx" ON "contact_requests" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_contact_requests_fk" FOREIGN KEY ("contact_requests_id") REFERENCES "public"."contact_requests"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_contact_requests_id_idx" ON "payload_locked_documents_rels" USING btree ("contact_requests_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "contact_requests" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "contact_requests" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_contact_requests_fk";
  
  DROP INDEX "payload_locked_documents_rels_contact_requests_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "contact_requests_id";
  DROP TYPE "public"."enum_contact_requests_status";
  DROP TYPE "public"."enum_contact_requests_locale";`)
}
