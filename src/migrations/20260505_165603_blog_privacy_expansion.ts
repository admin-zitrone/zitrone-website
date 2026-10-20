import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "blog_posts_intro" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "blog_posts_intro_locales" (
  	"paragraph" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "blog_posts_takeaways" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "blog_posts_takeaways_locales" (
  	"item" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "blog_posts_sections_body" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "blog_posts_sections_body_locales" (
  	"paragraph" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "blog_posts_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"image_src" varchar
  );
  
  CREATE TABLE "blog_posts_sections_locales" (
  	"title" varchar,
  	"image_alt" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "blog_posts_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "blog_posts_faqs_locales" (
  	"question" varchar,
  	"answer" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "_blog_posts_v_version_intro" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_blog_posts_v_version_intro_locales" (
  	"paragraph" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_blog_posts_v_version_takeaways" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_blog_posts_v_version_takeaways_locales" (
  	"item" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_blog_posts_v_version_sections_body" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_blog_posts_v_version_sections_body_locales" (
  	"paragraph" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_blog_posts_v_version_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"image_id" integer,
  	"image_src" varchar
  );
  
  CREATE TABLE "_blog_posts_v_version_sections_locales" (
  	"title" varchar,
  	"image_alt" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_blog_posts_v_version_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_blog_posts_v_version_faqs_locales" (
  	"question" varchar,
  	"answer" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "privacy_notice_intro" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "privacy_notice_intro_locales" (
  	"paragraph" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "privacy_notice_sections_paragraphs" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "privacy_notice_sections_paragraphs_locales" (
  	"paragraph" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "privacy_notice_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "privacy_notice_sections_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "_privacy_notice_v_version_intro" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_privacy_notice_v_version_intro_locales" (
  	"paragraph" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_privacy_notice_v_version_sections_paragraphs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_privacy_notice_v_version_sections_paragraphs_locales" (
  	"paragraph" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_privacy_notice_v_version_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_privacy_notice_v_version_sections_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "blog_posts" ADD COLUMN "hero_image_src" varchar;
  ALTER TABLE "blog_posts_locales" ADD COLUMN "hero_image_alt" varchar;
  ALTER TABLE "blog_posts_locales" ADD COLUMN "date_label" varchar;
  ALTER TABLE "blog_posts_locales" ADD COLUMN "read_time" varchar;
  ALTER TABLE "_blog_posts_v" ADD COLUMN "version_hero_image_src" varchar;
  ALTER TABLE "_blog_posts_v_locales" ADD COLUMN "version_hero_image_alt" varchar;
  ALTER TABLE "_blog_posts_v_locales" ADD COLUMN "version_date_label" varchar;
  ALTER TABLE "_blog_posts_v_locales" ADD COLUMN "version_read_time" varchar;
  ALTER TABLE "privacy_notice_locales" ADD COLUMN "meta_title" varchar;
  ALTER TABLE "privacy_notice_locales" ADD COLUMN "meta_description" varchar;
  ALTER TABLE "privacy_notice_locales" ADD COLUMN "kicker" varchar;
  ALTER TABLE "privacy_notice_locales" ADD COLUMN "title" varchar;
  ALTER TABLE "privacy_notice_locales" ADD COLUMN "responsible_label" varchar;
  ALTER TABLE "privacy_notice_locales" ADD COLUMN "responsible_body" varchar;
  ALTER TABLE "_privacy_notice_v_locales" ADD COLUMN "version_meta_title" varchar;
  ALTER TABLE "_privacy_notice_v_locales" ADD COLUMN "version_meta_description" varchar;
  ALTER TABLE "_privacy_notice_v_locales" ADD COLUMN "version_kicker" varchar;
  ALTER TABLE "_privacy_notice_v_locales" ADD COLUMN "version_title" varchar;
  ALTER TABLE "_privacy_notice_v_locales" ADD COLUMN "version_responsible_label" varchar;
  ALTER TABLE "_privacy_notice_v_locales" ADD COLUMN "version_responsible_body" varchar;
  ALTER TABLE "blog_posts_intro" ADD CONSTRAINT "blog_posts_intro_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog_posts_intro_locales" ADD CONSTRAINT "blog_posts_intro_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_posts_intro"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog_posts_takeaways" ADD CONSTRAINT "blog_posts_takeaways_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog_posts_takeaways_locales" ADD CONSTRAINT "blog_posts_takeaways_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_posts_takeaways"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog_posts_sections_body" ADD CONSTRAINT "blog_posts_sections_body_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_posts_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog_posts_sections_body_locales" ADD CONSTRAINT "blog_posts_sections_body_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_posts_sections_body"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog_posts_sections" ADD CONSTRAINT "blog_posts_sections_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "blog_posts_sections" ADD CONSTRAINT "blog_posts_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog_posts_sections_locales" ADD CONSTRAINT "blog_posts_sections_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_posts_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog_posts_faqs" ADD CONSTRAINT "blog_posts_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog_posts_faqs_locales" ADD CONSTRAINT "blog_posts_faqs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_posts_faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_blog_posts_v_version_intro" ADD CONSTRAINT "_blog_posts_v_version_intro_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blog_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_blog_posts_v_version_intro_locales" ADD CONSTRAINT "_blog_posts_v_version_intro_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blog_posts_v_version_intro"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_blog_posts_v_version_takeaways" ADD CONSTRAINT "_blog_posts_v_version_takeaways_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blog_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_blog_posts_v_version_takeaways_locales" ADD CONSTRAINT "_blog_posts_v_version_takeaways_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blog_posts_v_version_takeaways"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_blog_posts_v_version_sections_body" ADD CONSTRAINT "_blog_posts_v_version_sections_body_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blog_posts_v_version_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_blog_posts_v_version_sections_body_locales" ADD CONSTRAINT "_blog_posts_v_version_sections_body_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blog_posts_v_version_sections_body"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_blog_posts_v_version_sections" ADD CONSTRAINT "_blog_posts_v_version_sections_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_blog_posts_v_version_sections" ADD CONSTRAINT "_blog_posts_v_version_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blog_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_blog_posts_v_version_sections_locales" ADD CONSTRAINT "_blog_posts_v_version_sections_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blog_posts_v_version_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_blog_posts_v_version_faqs" ADD CONSTRAINT "_blog_posts_v_version_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blog_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_blog_posts_v_version_faqs_locales" ADD CONSTRAINT "_blog_posts_v_version_faqs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blog_posts_v_version_faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "privacy_notice_intro" ADD CONSTRAINT "privacy_notice_intro_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."privacy_notice"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "privacy_notice_intro_locales" ADD CONSTRAINT "privacy_notice_intro_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."privacy_notice_intro"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "privacy_notice_sections_paragraphs" ADD CONSTRAINT "privacy_notice_sections_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."privacy_notice_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "privacy_notice_sections_paragraphs_locales" ADD CONSTRAINT "privacy_notice_sections_paragraphs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."privacy_notice_sections_paragraphs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "privacy_notice_sections" ADD CONSTRAINT "privacy_notice_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."privacy_notice"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "privacy_notice_sections_locales" ADD CONSTRAINT "privacy_notice_sections_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."privacy_notice_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_privacy_notice_v_version_intro" ADD CONSTRAINT "_privacy_notice_v_version_intro_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_privacy_notice_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_privacy_notice_v_version_intro_locales" ADD CONSTRAINT "_privacy_notice_v_version_intro_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_privacy_notice_v_version_intro"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_privacy_notice_v_version_sections_paragraphs" ADD CONSTRAINT "_privacy_notice_v_version_sections_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_privacy_notice_v_version_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_privacy_notice_v_version_sections_paragraphs_locales" ADD CONSTRAINT "_privacy_notice_v_version_sections_paragraphs_locales_par_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_privacy_notice_v_version_sections_paragraphs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_privacy_notice_v_version_sections" ADD CONSTRAINT "_privacy_notice_v_version_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_privacy_notice_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_privacy_notice_v_version_sections_locales" ADD CONSTRAINT "_privacy_notice_v_version_sections_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_privacy_notice_v_version_sections"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "blog_posts_intro_order_idx" ON "blog_posts_intro" USING btree ("_order");
  CREATE INDEX "blog_posts_intro_parent_id_idx" ON "blog_posts_intro" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "blog_posts_intro_locales_locale_parent_id_unique" ON "blog_posts_intro_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "blog_posts_takeaways_order_idx" ON "blog_posts_takeaways" USING btree ("_order");
  CREATE INDEX "blog_posts_takeaways_parent_id_idx" ON "blog_posts_takeaways" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "blog_posts_takeaways_locales_locale_parent_id_unique" ON "blog_posts_takeaways_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "blog_posts_sections_body_order_idx" ON "blog_posts_sections_body" USING btree ("_order");
  CREATE INDEX "blog_posts_sections_body_parent_id_idx" ON "blog_posts_sections_body" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "blog_posts_sections_body_locales_locale_parent_id_unique" ON "blog_posts_sections_body_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "blog_posts_sections_order_idx" ON "blog_posts_sections" USING btree ("_order");
  CREATE INDEX "blog_posts_sections_parent_id_idx" ON "blog_posts_sections" USING btree ("_parent_id");
  CREATE INDEX "blog_posts_sections_image_idx" ON "blog_posts_sections" USING btree ("image_id");
  CREATE UNIQUE INDEX "blog_posts_sections_locales_locale_parent_id_unique" ON "blog_posts_sections_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "blog_posts_faqs_order_idx" ON "blog_posts_faqs" USING btree ("_order");
  CREATE INDEX "blog_posts_faqs_parent_id_idx" ON "blog_posts_faqs" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "blog_posts_faqs_locales_locale_parent_id_unique" ON "blog_posts_faqs_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_blog_posts_v_version_intro_order_idx" ON "_blog_posts_v_version_intro" USING btree ("_order");
  CREATE INDEX "_blog_posts_v_version_intro_parent_id_idx" ON "_blog_posts_v_version_intro" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_blog_posts_v_version_intro_locales_locale_parent_id_unique" ON "_blog_posts_v_version_intro_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_blog_posts_v_version_takeaways_order_idx" ON "_blog_posts_v_version_takeaways" USING btree ("_order");
  CREATE INDEX "_blog_posts_v_version_takeaways_parent_id_idx" ON "_blog_posts_v_version_takeaways" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_blog_posts_v_version_takeaways_locales_locale_parent_id_uni" ON "_blog_posts_v_version_takeaways_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_blog_posts_v_version_sections_body_order_idx" ON "_blog_posts_v_version_sections_body" USING btree ("_order");
  CREATE INDEX "_blog_posts_v_version_sections_body_parent_id_idx" ON "_blog_posts_v_version_sections_body" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_blog_posts_v_version_sections_body_locales_locale_parent_id" ON "_blog_posts_v_version_sections_body_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_blog_posts_v_version_sections_order_idx" ON "_blog_posts_v_version_sections" USING btree ("_order");
  CREATE INDEX "_blog_posts_v_version_sections_parent_id_idx" ON "_blog_posts_v_version_sections" USING btree ("_parent_id");
  CREATE INDEX "_blog_posts_v_version_sections_image_idx" ON "_blog_posts_v_version_sections" USING btree ("image_id");
  CREATE UNIQUE INDEX "_blog_posts_v_version_sections_locales_locale_parent_id_uniq" ON "_blog_posts_v_version_sections_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_blog_posts_v_version_faqs_order_idx" ON "_blog_posts_v_version_faqs" USING btree ("_order");
  CREATE INDEX "_blog_posts_v_version_faqs_parent_id_idx" ON "_blog_posts_v_version_faqs" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_blog_posts_v_version_faqs_locales_locale_parent_id_unique" ON "_blog_posts_v_version_faqs_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "privacy_notice_intro_order_idx" ON "privacy_notice_intro" USING btree ("_order");
  CREATE INDEX "privacy_notice_intro_parent_id_idx" ON "privacy_notice_intro" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "privacy_notice_intro_locales_locale_parent_id_unique" ON "privacy_notice_intro_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "privacy_notice_sections_paragraphs_order_idx" ON "privacy_notice_sections_paragraphs" USING btree ("_order");
  CREATE INDEX "privacy_notice_sections_paragraphs_parent_id_idx" ON "privacy_notice_sections_paragraphs" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "privacy_notice_sections_paragraphs_locales_locale_parent_id_" ON "privacy_notice_sections_paragraphs_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "privacy_notice_sections_order_idx" ON "privacy_notice_sections" USING btree ("_order");
  CREATE INDEX "privacy_notice_sections_parent_id_idx" ON "privacy_notice_sections" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "privacy_notice_sections_locales_locale_parent_id_unique" ON "privacy_notice_sections_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_privacy_notice_v_version_intro_order_idx" ON "_privacy_notice_v_version_intro" USING btree ("_order");
  CREATE INDEX "_privacy_notice_v_version_intro_parent_id_idx" ON "_privacy_notice_v_version_intro" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_privacy_notice_v_version_intro_locales_locale_parent_id_uni" ON "_privacy_notice_v_version_intro_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_privacy_notice_v_version_sections_paragraphs_order_idx" ON "_privacy_notice_v_version_sections_paragraphs" USING btree ("_order");
  CREATE INDEX "_privacy_notice_v_version_sections_paragraphs_parent_id_idx" ON "_privacy_notice_v_version_sections_paragraphs" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_privacy_notice_v_version_sections_paragraphs_locales_locale" ON "_privacy_notice_v_version_sections_paragraphs_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_privacy_notice_v_version_sections_order_idx" ON "_privacy_notice_v_version_sections" USING btree ("_order");
  CREATE INDEX "_privacy_notice_v_version_sections_parent_id_idx" ON "_privacy_notice_v_version_sections" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_privacy_notice_v_version_sections_locales_locale_parent_id_" ON "_privacy_notice_v_version_sections_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "blog_posts_intro" CASCADE;
  DROP TABLE "blog_posts_intro_locales" CASCADE;
  DROP TABLE "blog_posts_takeaways" CASCADE;
  DROP TABLE "blog_posts_takeaways_locales" CASCADE;
  DROP TABLE "blog_posts_sections_body" CASCADE;
  DROP TABLE "blog_posts_sections_body_locales" CASCADE;
  DROP TABLE "blog_posts_sections" CASCADE;
  DROP TABLE "blog_posts_sections_locales" CASCADE;
  DROP TABLE "blog_posts_faqs" CASCADE;
  DROP TABLE "blog_posts_faqs_locales" CASCADE;
  DROP TABLE "_blog_posts_v_version_intro" CASCADE;
  DROP TABLE "_blog_posts_v_version_intro_locales" CASCADE;
  DROP TABLE "_blog_posts_v_version_takeaways" CASCADE;
  DROP TABLE "_blog_posts_v_version_takeaways_locales" CASCADE;
  DROP TABLE "_blog_posts_v_version_sections_body" CASCADE;
  DROP TABLE "_blog_posts_v_version_sections_body_locales" CASCADE;
  DROP TABLE "_blog_posts_v_version_sections" CASCADE;
  DROP TABLE "_blog_posts_v_version_sections_locales" CASCADE;
  DROP TABLE "_blog_posts_v_version_faqs" CASCADE;
  DROP TABLE "_blog_posts_v_version_faqs_locales" CASCADE;
  DROP TABLE "privacy_notice_intro" CASCADE;
  DROP TABLE "privacy_notice_intro_locales" CASCADE;
  DROP TABLE "privacy_notice_sections_paragraphs" CASCADE;
  DROP TABLE "privacy_notice_sections_paragraphs_locales" CASCADE;
  DROP TABLE "privacy_notice_sections" CASCADE;
  DROP TABLE "privacy_notice_sections_locales" CASCADE;
  DROP TABLE "_privacy_notice_v_version_intro" CASCADE;
  DROP TABLE "_privacy_notice_v_version_intro_locales" CASCADE;
  DROP TABLE "_privacy_notice_v_version_sections_paragraphs" CASCADE;
  DROP TABLE "_privacy_notice_v_version_sections_paragraphs_locales" CASCADE;
  DROP TABLE "_privacy_notice_v_version_sections" CASCADE;
  DROP TABLE "_privacy_notice_v_version_sections_locales" CASCADE;
  ALTER TABLE "blog_posts" DROP COLUMN "hero_image_src";
  ALTER TABLE "blog_posts_locales" DROP COLUMN "hero_image_alt";
  ALTER TABLE "blog_posts_locales" DROP COLUMN "date_label";
  ALTER TABLE "blog_posts_locales" DROP COLUMN "read_time";
  ALTER TABLE "_blog_posts_v" DROP COLUMN "version_hero_image_src";
  ALTER TABLE "_blog_posts_v_locales" DROP COLUMN "version_hero_image_alt";
  ALTER TABLE "_blog_posts_v_locales" DROP COLUMN "version_date_label";
  ALTER TABLE "_blog_posts_v_locales" DROP COLUMN "version_read_time";
  ALTER TABLE "privacy_notice_locales" DROP COLUMN "meta_title";
  ALTER TABLE "privacy_notice_locales" DROP COLUMN "meta_description";
  ALTER TABLE "privacy_notice_locales" DROP COLUMN "kicker";
  ALTER TABLE "privacy_notice_locales" DROP COLUMN "title";
  ALTER TABLE "privacy_notice_locales" DROP COLUMN "responsible_label";
  ALTER TABLE "privacy_notice_locales" DROP COLUMN "responsible_body";
  ALTER TABLE "_privacy_notice_v_locales" DROP COLUMN "version_meta_title";
  ALTER TABLE "_privacy_notice_v_locales" DROP COLUMN "version_meta_description";
  ALTER TABLE "_privacy_notice_v_locales" DROP COLUMN "version_kicker";
  ALTER TABLE "_privacy_notice_v_locales" DROP COLUMN "version_title";
  ALTER TABLE "_privacy_notice_v_locales" DROP COLUMN "version_responsible_label";
  ALTER TABLE "_privacy_notice_v_locales" DROP COLUMN "version_responsible_body";`)
}
