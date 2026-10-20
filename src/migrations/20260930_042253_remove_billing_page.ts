import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "billing_page_recipients" CASCADE;
  DROP TABLE "billing_page" CASCADE;
  DROP TABLE "billing_page_locales" CASCADE;
  DROP TABLE "_billing_page_v_version_recipients" CASCADE;
  DROP TABLE "_billing_page_v" CASCADE;
  DROP TABLE "_billing_page_v_locales" CASCADE;
  DROP TYPE "public"."enum_billing_page_status";
  DROP TYPE "public"."enum__billing_page_v_version_status";
  DROP TYPE "public"."enum__billing_page_v_published_locale";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_billing_page_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__billing_page_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__billing_page_v_published_locale" AS ENUM('en', 'es');
  CREATE TABLE "billing_page_recipients" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"email" varchar
  );
  
  CREATE TABLE "billing_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"form_labels" jsonb,
  	"form_validation_messages" jsonb,
  	"seo_og_image_id" integer,
  	"seo_canonical" varchar,
  	"_status" "enum_billing_page_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "billing_page_locales" (
  	"heading" varchar,
  	"intro" varchar,
  	"form_submit_label" varchar,
  	"form_success_message" varchar,
  	"fallback_title" varchar,
  	"fallback_copy" varchar,
  	"fallback_mailto_subject" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_billing_page_v_version_recipients" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"email" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_billing_page_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_form_labels" jsonb,
  	"version_form_validation_messages" jsonb,
  	"version_seo_og_image_id" integer,
  	"version_seo_canonical" varchar,
  	"version__status" "enum__billing_page_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__billing_page_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_billing_page_v_locales" (
  	"version_heading" varchar,
  	"version_intro" varchar,
  	"version_form_submit_label" varchar,
  	"version_form_success_message" varchar,
  	"version_fallback_title" varchar,
  	"version_fallback_copy" varchar,
  	"version_fallback_mailto_subject" varchar,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "billing_page_recipients" ADD CONSTRAINT "billing_page_recipients_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."billing_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "billing_page" ADD CONSTRAINT "billing_page_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "billing_page_locales" ADD CONSTRAINT "billing_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."billing_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_billing_page_v_version_recipients" ADD CONSTRAINT "_billing_page_v_version_recipients_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_billing_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_billing_page_v" ADD CONSTRAINT "_billing_page_v_version_seo_og_image_id_media_id_fk" FOREIGN KEY ("version_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_billing_page_v_locales" ADD CONSTRAINT "_billing_page_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_billing_page_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "billing_page_recipients_order_idx" ON "billing_page_recipients" USING btree ("_order");
  CREATE INDEX "billing_page_recipients_parent_id_idx" ON "billing_page_recipients" USING btree ("_parent_id");
  CREATE INDEX "billing_page_seo_seo_og_image_idx" ON "billing_page" USING btree ("seo_og_image_id");
  CREATE INDEX "billing_page__status_idx" ON "billing_page" USING btree ("_status");
  CREATE UNIQUE INDEX "billing_page_locales_locale_parent_id_unique" ON "billing_page_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_billing_page_v_version_recipients_order_idx" ON "_billing_page_v_version_recipients" USING btree ("_order");
  CREATE INDEX "_billing_page_v_version_recipients_parent_id_idx" ON "_billing_page_v_version_recipients" USING btree ("_parent_id");
  CREATE INDEX "_billing_page_v_version_seo_version_seo_og_image_idx" ON "_billing_page_v" USING btree ("version_seo_og_image_id");
  CREATE INDEX "_billing_page_v_version_version__status_idx" ON "_billing_page_v" USING btree ("version__status");
  CREATE INDEX "_billing_page_v_created_at_idx" ON "_billing_page_v" USING btree ("created_at");
  CREATE INDEX "_billing_page_v_updated_at_idx" ON "_billing_page_v" USING btree ("updated_at");
  CREATE INDEX "_billing_page_v_snapshot_idx" ON "_billing_page_v" USING btree ("snapshot");
  CREATE INDEX "_billing_page_v_published_locale_idx" ON "_billing_page_v" USING btree ("published_locale");
  CREATE INDEX "_billing_page_v_latest_idx" ON "_billing_page_v" USING btree ("latest");
  CREATE INDEX "_billing_page_v_autosave_idx" ON "_billing_page_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "_billing_page_v_locales_locale_parent_id_unique" ON "_billing_page_v_locales" USING btree ("_locale","_parent_id");`)
}
