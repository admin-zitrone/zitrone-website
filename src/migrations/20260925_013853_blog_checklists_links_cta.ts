import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "blog_posts_sections_checklist" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "blog_posts_sections_checklist_locales" (
  	"item" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "blog_posts_sections_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "blog_posts_sections_links_locales" (
  	"before" varchar,
  	"label" varchar,
  	"href" varchar,
  	"after" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "_blog_posts_v_version_sections_checklist" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_blog_posts_v_version_sections_checklist_locales" (
  	"item" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_blog_posts_v_version_sections_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_blog_posts_v_version_sections_links_locales" (
  	"before" varchar,
  	"label" varchar,
  	"href" varchar,
  	"after" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "blog_posts_locales" ADD COLUMN "cta_heading" varchar;
  ALTER TABLE "blog_posts_locales" ADD COLUMN "cta_label" varchar;
  ALTER TABLE "blog_posts_locales" ADD COLUMN "cta_href" varchar;
  ALTER TABLE "_blog_posts_v_locales" ADD COLUMN "version_cta_heading" varchar;
  ALTER TABLE "_blog_posts_v_locales" ADD COLUMN "version_cta_label" varchar;
  ALTER TABLE "_blog_posts_v_locales" ADD COLUMN "version_cta_href" varchar;
  ALTER TABLE "blog_posts_sections_checklist" ADD CONSTRAINT "blog_posts_sections_checklist_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_posts_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog_posts_sections_checklist_locales" ADD CONSTRAINT "blog_posts_sections_checklist_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_posts_sections_checklist"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog_posts_sections_links" ADD CONSTRAINT "blog_posts_sections_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_posts_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog_posts_sections_links_locales" ADD CONSTRAINT "blog_posts_sections_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_posts_sections_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_blog_posts_v_version_sections_checklist" ADD CONSTRAINT "_blog_posts_v_version_sections_checklist_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blog_posts_v_version_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_blog_posts_v_version_sections_checklist_locales" ADD CONSTRAINT "_blog_posts_v_version_sections_checklist_locales_parent_i_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blog_posts_v_version_sections_checklist"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_blog_posts_v_version_sections_links" ADD CONSTRAINT "_blog_posts_v_version_sections_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blog_posts_v_version_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_blog_posts_v_version_sections_links_locales" ADD CONSTRAINT "_blog_posts_v_version_sections_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blog_posts_v_version_sections_links"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "blog_posts_sections_checklist_order_idx" ON "blog_posts_sections_checklist" USING btree ("_order");
  CREATE INDEX "blog_posts_sections_checklist_parent_id_idx" ON "blog_posts_sections_checklist" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "blog_posts_sections_checklist_locales_locale_parent_id_uniqu" ON "blog_posts_sections_checklist_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "blog_posts_sections_links_order_idx" ON "blog_posts_sections_links" USING btree ("_order");
  CREATE INDEX "blog_posts_sections_links_parent_id_idx" ON "blog_posts_sections_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "blog_posts_sections_links_locales_locale_parent_id_unique" ON "blog_posts_sections_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_blog_posts_v_version_sections_checklist_order_idx" ON "_blog_posts_v_version_sections_checklist" USING btree ("_order");
  CREATE INDEX "_blog_posts_v_version_sections_checklist_parent_id_idx" ON "_blog_posts_v_version_sections_checklist" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_blog_posts_v_version_sections_checklist_locales_locale_pare" ON "_blog_posts_v_version_sections_checklist_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_blog_posts_v_version_sections_links_order_idx" ON "_blog_posts_v_version_sections_links" USING btree ("_order");
  CREATE INDEX "_blog_posts_v_version_sections_links_parent_id_idx" ON "_blog_posts_v_version_sections_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_blog_posts_v_version_sections_links_locales_locale_parent_i" ON "_blog_posts_v_version_sections_links_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "blog_posts_sections_checklist" CASCADE;
  DROP TABLE "blog_posts_sections_checklist_locales" CASCADE;
  DROP TABLE "blog_posts_sections_links" CASCADE;
  DROP TABLE "blog_posts_sections_links_locales" CASCADE;
  DROP TABLE "_blog_posts_v_version_sections_checklist" CASCADE;
  DROP TABLE "_blog_posts_v_version_sections_checklist_locales" CASCADE;
  DROP TABLE "_blog_posts_v_version_sections_links" CASCADE;
  DROP TABLE "_blog_posts_v_version_sections_links_locales" CASCADE;
  ALTER TABLE "blog_posts_locales" DROP COLUMN "cta_heading";
  ALTER TABLE "blog_posts_locales" DROP COLUMN "cta_label";
  ALTER TABLE "blog_posts_locales" DROP COLUMN "cta_href";
  ALTER TABLE "_blog_posts_v_locales" DROP COLUMN "version_cta_heading";
  ALTER TABLE "_blog_posts_v_locales" DROP COLUMN "version_cta_label";
  ALTER TABLE "_blog_posts_v_locales" DROP COLUMN "version_cta_href";`)
}
