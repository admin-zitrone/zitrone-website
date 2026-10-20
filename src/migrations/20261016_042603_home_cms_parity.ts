import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_home_blocks_hero_frames_pillar" AS ENUM('nourishment', 'care', 'connection', 'momentum');
  CREATE TYPE "public"."enum_home_blocks_services_carousel_orbit_items_theme" AS ENUM('dining', 'cafe', 'pantry', 'coffee', 'grab-go', 'catering');
  CREATE TYPE "public"."enum_home_blocks_logos_card_tone" AS ENUM('green', 'slate');
  CREATE TYPE "public"."enum_home_blocks_operating_system_tabs_icon" AS ENUM('heart', 'spark', 'trend', 'clock', 'briefcase', 'people', 'shield', 'chart', 'chat', 'calendar', 'coffee', 'utensils', 'drink', 'chef', 'leaf', 'fruit', 'machine', 'water', 'cart');
  CREATE TYPE "public"."enum_home_blocks_operating_system_tabs_tone" AS ENUM('ocean', 'natural', 'sage', 'lime');
  CREATE TYPE "public"."enum_home_blocks_operating_system_cta_primary_type" AS ENUM('internal', 'external', 'anchor');
  CREATE TYPE "public"."enum_home_blocks_operating_system_cta_secondary_type" AS ENUM('internal', 'external', 'anchor');
  CREATE TYPE "public"."enum__home_v_blocks_hero_frames_pillar" AS ENUM('nourishment', 'care', 'connection', 'momentum');
  CREATE TYPE "public"."enum__home_v_blocks_services_carousel_orbit_items_theme" AS ENUM('dining', 'cafe', 'pantry', 'coffee', 'grab-go', 'catering');
  CREATE TYPE "public"."enum__home_v_blocks_logos_card_tone" AS ENUM('green', 'slate');
  CREATE TYPE "public"."enum__home_v_blocks_operating_system_tabs_icon" AS ENUM('heart', 'spark', 'trend', 'clock', 'briefcase', 'people', 'shield', 'chart', 'chat', 'calendar', 'coffee', 'utensils', 'drink', 'chef', 'leaf', 'fruit', 'machine', 'water', 'cart');
  CREATE TYPE "public"."enum__home_v_blocks_operating_system_tabs_tone" AS ENUM('ocean', 'natural', 'sage', 'lime');
  CREATE TYPE "public"."enum__home_v_blocks_operating_system_cta_primary_type" AS ENUM('internal', 'external', 'anchor');
  CREATE TYPE "public"."enum__home_v_blocks_operating_system_cta_secondary_type" AS ENUM('internal', 'external', 'anchor');
  ALTER TYPE "public"."enum_home_blocks_service_system_slider_layers_features_icon" ADD VALUE 'coffee';
  ALTER TYPE "public"."enum_home_blocks_service_system_slider_layers_features_icon" ADD VALUE 'utensils';
  ALTER TYPE "public"."enum_home_blocks_service_system_slider_layers_features_icon" ADD VALUE 'drink';
  ALTER TYPE "public"."enum_home_blocks_service_system_slider_layers_features_icon" ADD VALUE 'chef';
  ALTER TYPE "public"."enum_home_blocks_service_system_slider_layers_features_icon" ADD VALUE 'leaf';
  ALTER TYPE "public"."enum_home_blocks_service_system_slider_layers_features_icon" ADD VALUE 'fruit';
  ALTER TYPE "public"."enum_home_blocks_service_system_slider_layers_features_icon" ADD VALUE 'machine';
  ALTER TYPE "public"."enum_home_blocks_service_system_slider_layers_features_icon" ADD VALUE 'water';
  ALTER TYPE "public"."enum_home_blocks_service_system_slider_layers_features_icon" ADD VALUE 'cart';
  ALTER TYPE "public"."enum__home_v_blocks_service_system_slider_layers_features_icon" ADD VALUE 'coffee';
  ALTER TYPE "public"."enum__home_v_blocks_service_system_slider_layers_features_icon" ADD VALUE 'utensils';
  ALTER TYPE "public"."enum__home_v_blocks_service_system_slider_layers_features_icon" ADD VALUE 'drink';
  ALTER TYPE "public"."enum__home_v_blocks_service_system_slider_layers_features_icon" ADD VALUE 'chef';
  ALTER TYPE "public"."enum__home_v_blocks_service_system_slider_layers_features_icon" ADD VALUE 'leaf';
  ALTER TYPE "public"."enum__home_v_blocks_service_system_slider_layers_features_icon" ADD VALUE 'fruit';
  ALTER TYPE "public"."enum__home_v_blocks_service_system_slider_layers_features_icon" ADD VALUE 'machine';
  ALTER TYPE "public"."enum__home_v_blocks_service_system_slider_layers_features_icon" ADD VALUE 'water';
  ALTER TYPE "public"."enum__home_v_blocks_service_system_slider_layers_features_icon" ADD VALUE 'cart';
  CREATE TABLE "services_related_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar
  );
  
  CREATE TABLE "_services_v_version_related_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "home_blocks_hero_frames" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"pillar" "enum_home_blocks_hero_frames_pillar",
  	"accent_word" varchar,
  	"image_id" integer,
  	"alt" varchar
  );
  
  CREATE TABLE "home_blocks_services_carousel_orbit_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"theme" "enum_home_blocks_services_carousel_orbit_items_theme",
  	"image_id" integer,
  	"copy" varchar
  );
  
  CREATE TABLE "home_blocks_logos_card_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "home_blocks_logos_card" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"sub" varchar,
  	"tone" "enum_home_blocks_logos_card_tone" DEFAULT 'green',
  	"hide_logos" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "_home_v_blocks_hero_frames" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"pillar" "enum__home_v_blocks_hero_frames_pillar",
  	"accent_word" varchar,
  	"image_id" integer,
  	"alt" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_v_blocks_services_carousel_orbit_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"theme" "enum__home_v_blocks_services_carousel_orbit_items_theme",
  	"image_id" integer,
  	"copy" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_v_blocks_logos_card_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_v_blocks_logos_card" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"sub" varchar,
  	"tone" "enum__home_v_blocks_logos_card_tone" DEFAULT 'green',
  	"hide_logos" boolean,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "services_locales" ADD COLUMN "href" varchar;
  ALTER TABLE "services_locales" ADD COLUMN "cta_label" varchar;
  ALTER TABLE "_services_v_locales" ADD COLUMN "version_href" varchar;
  ALTER TABLE "_services_v_locales" ADD COLUMN "version_cta_label" varchar;
  ALTER TABLE "stories" ADD COLUMN "repeats_hero" boolean;
  ALTER TABLE "stories_locales" ADD COLUMN "location" varchar;
  ALTER TABLE "_stories_v" ADD COLUMN "version_repeats_hero" boolean;
  ALTER TABLE "_stories_v_locales" ADD COLUMN "version_location" varchar;
  ALTER TABLE "logos" ADD COLUMN "mono_image_id" integer;
  ALTER TABLE "header_primary_nav_locales" ADD COLUMN "link_internal_href" varchar;
  ALTER TABLE "header_primary_nav_locales" ADD COLUMN "link_external_href" varchar;
  ALTER TABLE "header_primary_nav_locales" ADD COLUMN "link_anchor" varchar;
  ALTER TABLE "header_locales" ADD COLUMN "primary_cta_internal_href" varchar;
  ALTER TABLE "header_locales" ADD COLUMN "primary_cta_external_href" varchar;
  ALTER TABLE "header_locales" ADD COLUMN "primary_cta_anchor" varchar;
  ALTER TABLE "footer_columns_links_locales" ADD COLUMN "link_internal_href" varchar;
  ALTER TABLE "footer_columns_links_locales" ADD COLUMN "link_external_href" varchar;
  ALTER TABLE "footer_columns_links_locales" ADD COLUMN "link_anchor" varchar;
  ALTER TABLE "footer_contact_links_locales" ADD COLUMN "link_internal_href" varchar;
  ALTER TABLE "footer_contact_links_locales" ADD COLUMN "link_external_href" varchar;
  ALTER TABLE "footer_contact_links_locales" ADD COLUMN "link_anchor" varchar;
  ALTER TABLE "footer_legal_links_locales" ADD COLUMN "link_internal_href" varchar;
  ALTER TABLE "footer_legal_links_locales" ADD COLUMN "link_external_href" varchar;
  ALTER TABLE "footer_legal_links_locales" ADD COLUMN "link_anchor" varchar;
  ALTER TABLE "footer_locales" ADD COLUMN "tagline_emphasis" varchar;
  ALTER TABLE "footer_locales" ADD COLUMN "cta_primary_internal_href" varchar;
  ALTER TABLE "footer_locales" ADD COLUMN "cta_primary_external_href" varchar;
  ALTER TABLE "footer_locales" ADD COLUMN "cta_primary_anchor" varchar;
  ALTER TABLE "footer_locales" ADD COLUMN "cta_secondary_internal_href" varchar;
  ALTER TABLE "footer_locales" ADD COLUMN "cta_secondary_external_href" varchar;
  ALTER TABLE "footer_locales" ADD COLUMN "cta_secondary_anchor" varchar;
  ALTER TABLE "home_blocks_hero" ADD COLUMN "title_emphasis" varchar;
  ALTER TABLE "home_blocks_hero" ADD COLUMN "copy_short" varchar;
  ALTER TABLE "home_blocks_hero" ADD COLUMN "ribbon_stat_value" numeric;
  ALTER TABLE "home_blocks_hero" ADD COLUMN "ribbon_stat_label" varchar;
  ALTER TABLE "home_blocks_services_carousel" ADD COLUMN "cover_copy" varchar;
  ALTER TABLE "home_blocks_services_carousel" ADD COLUMN "labels_view_service" varchar;
  ALTER TABLE "home_blocks_services_carousel" ADD COLUMN "labels_logos_aria_label" varchar;
  ALTER TABLE "home_blocks_studies_card" ADD COLUMN "sub" varchar;
  ALTER TABLE "home_blocks_proof_bento" ADD COLUMN "kicker" varchar;
  ALTER TABLE "home_blocks_proof_bento" ADD COLUMN "heading_trail" varchar;
  ALTER TABLE "home_blocks_proof_bento" ADD COLUMN "client_logos_aria_label" varchar;
  ALTER TABLE "home_blocks_operating_system_tabs" ADD COLUMN "icon" "enum_home_blocks_operating_system_tabs_icon";
  ALTER TABLE "home_blocks_operating_system_tabs" ADD COLUMN "tone" "enum_home_blocks_operating_system_tabs_tone";
  ALTER TABLE "home_blocks_operating_system_tabs" ADD COLUMN "stage" varchar;
  ALTER TABLE "home_blocks_operating_system_tabs" ADD COLUMN "stage_copy_before" varchar;
  ALTER TABLE "home_blocks_operating_system_tabs" ADD COLUMN "stage_copy_highlight" varchar;
  ALTER TABLE "home_blocks_operating_system_tabs" ADD COLUMN "stage_copy_after" varchar;
  ALTER TABLE "home_blocks_operating_system" ADD COLUMN "cta_primary_type" "enum_home_blocks_operating_system_cta_primary_type" DEFAULT 'internal';
  ALTER TABLE "home_blocks_operating_system" ADD COLUMN "cta_primary_label" varchar;
  ALTER TABLE "home_blocks_operating_system" ADD COLUMN "cta_primary_internal_href" varchar;
  ALTER TABLE "home_blocks_operating_system" ADD COLUMN "cta_primary_external_href" varchar;
  ALTER TABLE "home_blocks_operating_system" ADD COLUMN "cta_primary_anchor" varchar;
  ALTER TABLE "home_blocks_operating_system" ADD COLUMN "cta_secondary_type" "enum_home_blocks_operating_system_cta_secondary_type" DEFAULT 'internal';
  ALTER TABLE "home_blocks_operating_system" ADD COLUMN "cta_secondary_label" varchar;
  ALTER TABLE "home_blocks_operating_system" ADD COLUMN "cta_secondary_internal_href" varchar;
  ALTER TABLE "home_blocks_operating_system" ADD COLUMN "cta_secondary_external_href" varchar;
  ALTER TABLE "home_blocks_operating_system" ADD COLUMN "cta_secondary_anchor" varchar;
  ALTER TABLE "home_blocks_operating_system" ADD COLUMN "labels_previous" varchar;
  ALTER TABLE "home_blocks_operating_system" ADD COLUMN "labels_next" varchar;
  ALTER TABLE "home_blocks_service_system_slider_layers" ADD COLUMN "short_title" varchar;
  ALTER TABLE "home_blocks_service_system_slider_layers" ADD COLUMN "copy" varchar;
  ALTER TABLE "home_blocks_service_system_slider_layers" ADD COLUMN "href" varchar;
  ALTER TABLE "home_blocks_service_system_slider_layers" ADD COLUMN "cta_label" varchar;
  ALTER TABLE "home_blocks_service_system_slider" ADD COLUMN "labels_cta_label" varchar;
  ALTER TABLE "home_blocks_service_system_slider" ADD COLUMN "labels_view_details" varchar;
  ALTER TABLE "home_blocks_service_system_slider" ADD COLUMN "labels_hide_details" varchar;
  ALTER TABLE "home_blocks_faq" ADD COLUMN "heading_lead" varchar;
  ALTER TABLE "home_blocks_faq" ADD COLUMN "cta_title" varchar;
  ALTER TABLE "home_blocks_faq" ADD COLUMN "cta_copy" varchar;
  ALTER TABLE "_home_v_blocks_hero" ADD COLUMN "title_emphasis" varchar;
  ALTER TABLE "_home_v_blocks_hero" ADD COLUMN "copy_short" varchar;
  ALTER TABLE "_home_v_blocks_hero" ADD COLUMN "ribbon_stat_value" numeric;
  ALTER TABLE "_home_v_blocks_hero" ADD COLUMN "ribbon_stat_label" varchar;
  ALTER TABLE "_home_v_blocks_services_carousel" ADD COLUMN "cover_copy" varchar;
  ALTER TABLE "_home_v_blocks_services_carousel" ADD COLUMN "labels_view_service" varchar;
  ALTER TABLE "_home_v_blocks_services_carousel" ADD COLUMN "labels_logos_aria_label" varchar;
  ALTER TABLE "_home_v_blocks_studies_card" ADD COLUMN "sub" varchar;
  ALTER TABLE "_home_v_blocks_proof_bento" ADD COLUMN "kicker" varchar;
  ALTER TABLE "_home_v_blocks_proof_bento" ADD COLUMN "heading_trail" varchar;
  ALTER TABLE "_home_v_blocks_proof_bento" ADD COLUMN "client_logos_aria_label" varchar;
  ALTER TABLE "_home_v_blocks_operating_system_tabs" ADD COLUMN "icon" "enum__home_v_blocks_operating_system_tabs_icon";
  ALTER TABLE "_home_v_blocks_operating_system_tabs" ADD COLUMN "tone" "enum__home_v_blocks_operating_system_tabs_tone";
  ALTER TABLE "_home_v_blocks_operating_system_tabs" ADD COLUMN "stage" varchar;
  ALTER TABLE "_home_v_blocks_operating_system_tabs" ADD COLUMN "stage_copy_before" varchar;
  ALTER TABLE "_home_v_blocks_operating_system_tabs" ADD COLUMN "stage_copy_highlight" varchar;
  ALTER TABLE "_home_v_blocks_operating_system_tabs" ADD COLUMN "stage_copy_after" varchar;
  ALTER TABLE "_home_v_blocks_operating_system" ADD COLUMN "cta_primary_type" "enum__home_v_blocks_operating_system_cta_primary_type" DEFAULT 'internal';
  ALTER TABLE "_home_v_blocks_operating_system" ADD COLUMN "cta_primary_label" varchar;
  ALTER TABLE "_home_v_blocks_operating_system" ADD COLUMN "cta_primary_internal_href" varchar;
  ALTER TABLE "_home_v_blocks_operating_system" ADD COLUMN "cta_primary_external_href" varchar;
  ALTER TABLE "_home_v_blocks_operating_system" ADD COLUMN "cta_primary_anchor" varchar;
  ALTER TABLE "_home_v_blocks_operating_system" ADD COLUMN "cta_secondary_type" "enum__home_v_blocks_operating_system_cta_secondary_type" DEFAULT 'internal';
  ALTER TABLE "_home_v_blocks_operating_system" ADD COLUMN "cta_secondary_label" varchar;
  ALTER TABLE "_home_v_blocks_operating_system" ADD COLUMN "cta_secondary_internal_href" varchar;
  ALTER TABLE "_home_v_blocks_operating_system" ADD COLUMN "cta_secondary_external_href" varchar;
  ALTER TABLE "_home_v_blocks_operating_system" ADD COLUMN "cta_secondary_anchor" varchar;
  ALTER TABLE "_home_v_blocks_operating_system" ADD COLUMN "labels_previous" varchar;
  ALTER TABLE "_home_v_blocks_operating_system" ADD COLUMN "labels_next" varchar;
  ALTER TABLE "_home_v_blocks_service_system_slider_layers" ADD COLUMN "short_title" varchar;
  ALTER TABLE "_home_v_blocks_service_system_slider_layers" ADD COLUMN "copy" varchar;
  ALTER TABLE "_home_v_blocks_service_system_slider_layers" ADD COLUMN "href" varchar;
  ALTER TABLE "_home_v_blocks_service_system_slider_layers" ADD COLUMN "cta_label" varchar;
  ALTER TABLE "_home_v_blocks_service_system_slider" ADD COLUMN "labels_cta_label" varchar;
  ALTER TABLE "_home_v_blocks_service_system_slider" ADD COLUMN "labels_view_details" varchar;
  ALTER TABLE "_home_v_blocks_service_system_slider" ADD COLUMN "labels_hide_details" varchar;
  ALTER TABLE "_home_v_blocks_faq" ADD COLUMN "heading_lead" varchar;
  ALTER TABLE "_home_v_blocks_faq" ADD COLUMN "cta_title" varchar;
  ALTER TABLE "_home_v_blocks_faq" ADD COLUMN "cta_copy" varchar;
  ALTER TABLE "services_related_links" ADD CONSTRAINT "services_related_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_version_related_links" ADD CONSTRAINT "_services_v_version_related_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_hero_frames" ADD CONSTRAINT "home_blocks_hero_frames_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_blocks_hero_frames" ADD CONSTRAINT "home_blocks_hero_frames_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_services_carousel_orbit_items" ADD CONSTRAINT "home_blocks_services_carousel_orbit_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_blocks_services_carousel_orbit_items" ADD CONSTRAINT "home_blocks_services_carousel_orbit_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_services_carousel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_logos_card_stats" ADD CONSTRAINT "home_blocks_logos_card_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_logos_card"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_logos_card" ADD CONSTRAINT "home_blocks_logos_card_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_hero_frames" ADD CONSTRAINT "_home_v_blocks_hero_frames_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_hero_frames" ADD CONSTRAINT "_home_v_blocks_hero_frames_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_services_carousel_orbit_items" ADD CONSTRAINT "_home_v_blocks_services_carousel_orbit_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_services_carousel_orbit_items" ADD CONSTRAINT "_home_v_blocks_services_carousel_orbit_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_services_carousel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_logos_card_stats" ADD CONSTRAINT "_home_v_blocks_logos_card_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_logos_card"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_logos_card" ADD CONSTRAINT "_home_v_blocks_logos_card_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "services_related_links_order_idx" ON "services_related_links" USING btree ("_order");
  CREATE INDEX "services_related_links_parent_id_idx" ON "services_related_links" USING btree ("_parent_id");
  CREATE INDEX "services_related_links_locale_idx" ON "services_related_links" USING btree ("_locale");
  CREATE INDEX "_services_v_version_related_links_order_idx" ON "_services_v_version_related_links" USING btree ("_order");
  CREATE INDEX "_services_v_version_related_links_parent_id_idx" ON "_services_v_version_related_links" USING btree ("_parent_id");
  CREATE INDEX "_services_v_version_related_links_locale_idx" ON "_services_v_version_related_links" USING btree ("_locale");
  CREATE INDEX "home_blocks_hero_frames_order_idx" ON "home_blocks_hero_frames" USING btree ("_order");
  CREATE INDEX "home_blocks_hero_frames_parent_id_idx" ON "home_blocks_hero_frames" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_hero_frames_locale_idx" ON "home_blocks_hero_frames" USING btree ("_locale");
  CREATE INDEX "home_blocks_hero_frames_image_idx" ON "home_blocks_hero_frames" USING btree ("image_id");
  CREATE INDEX "home_blocks_services_carousel_orbit_items_order_idx" ON "home_blocks_services_carousel_orbit_items" USING btree ("_order");
  CREATE INDEX "home_blocks_services_carousel_orbit_items_parent_id_idx" ON "home_blocks_services_carousel_orbit_items" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_services_carousel_orbit_items_locale_idx" ON "home_blocks_services_carousel_orbit_items" USING btree ("_locale");
  CREATE INDEX "home_blocks_services_carousel_orbit_items_image_idx" ON "home_blocks_services_carousel_orbit_items" USING btree ("image_id");
  CREATE INDEX "home_blocks_logos_card_stats_order_idx" ON "home_blocks_logos_card_stats" USING btree ("_order");
  CREATE INDEX "home_blocks_logos_card_stats_parent_id_idx" ON "home_blocks_logos_card_stats" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_logos_card_stats_locale_idx" ON "home_blocks_logos_card_stats" USING btree ("_locale");
  CREATE INDEX "home_blocks_logos_card_order_idx" ON "home_blocks_logos_card" USING btree ("_order");
  CREATE INDEX "home_blocks_logos_card_parent_id_idx" ON "home_blocks_logos_card" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_logos_card_path_idx" ON "home_blocks_logos_card" USING btree ("_path");
  CREATE INDEX "home_blocks_logos_card_locale_idx" ON "home_blocks_logos_card" USING btree ("_locale");
  CREATE INDEX "_home_v_blocks_hero_frames_order_idx" ON "_home_v_blocks_hero_frames" USING btree ("_order");
  CREATE INDEX "_home_v_blocks_hero_frames_parent_id_idx" ON "_home_v_blocks_hero_frames" USING btree ("_parent_id");
  CREATE INDEX "_home_v_blocks_hero_frames_locale_idx" ON "_home_v_blocks_hero_frames" USING btree ("_locale");
  CREATE INDEX "_home_v_blocks_hero_frames_image_idx" ON "_home_v_blocks_hero_frames" USING btree ("image_id");
  CREATE INDEX "_home_v_blocks_services_carousel_orbit_items_order_idx" ON "_home_v_blocks_services_carousel_orbit_items" USING btree ("_order");
  CREATE INDEX "_home_v_blocks_services_carousel_orbit_items_parent_id_idx" ON "_home_v_blocks_services_carousel_orbit_items" USING btree ("_parent_id");
  CREATE INDEX "_home_v_blocks_services_carousel_orbit_items_locale_idx" ON "_home_v_blocks_services_carousel_orbit_items" USING btree ("_locale");
  CREATE INDEX "_home_v_blocks_services_carousel_orbit_items_image_idx" ON "_home_v_blocks_services_carousel_orbit_items" USING btree ("image_id");
  CREATE INDEX "_home_v_blocks_logos_card_stats_order_idx" ON "_home_v_blocks_logos_card_stats" USING btree ("_order");
  CREATE INDEX "_home_v_blocks_logos_card_stats_parent_id_idx" ON "_home_v_blocks_logos_card_stats" USING btree ("_parent_id");
  CREATE INDEX "_home_v_blocks_logos_card_stats_locale_idx" ON "_home_v_blocks_logos_card_stats" USING btree ("_locale");
  CREATE INDEX "_home_v_blocks_logos_card_order_idx" ON "_home_v_blocks_logos_card" USING btree ("_order");
  CREATE INDEX "_home_v_blocks_logos_card_parent_id_idx" ON "_home_v_blocks_logos_card" USING btree ("_parent_id");
  CREATE INDEX "_home_v_blocks_logos_card_path_idx" ON "_home_v_blocks_logos_card" USING btree ("_path");
  CREATE INDEX "_home_v_blocks_logos_card_locale_idx" ON "_home_v_blocks_logos_card" USING btree ("_locale");
  ALTER TABLE "logos" ADD CONSTRAINT "logos_mono_image_id_media_id_fk" FOREIGN KEY ("mono_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "logos_mono_image_idx" ON "logos" USING btree ("mono_image_id");
  -- HAND-ADDED: link paths became localized. Copy every stored path into each
  -- locale row so no link is lost. Expand/contract: the shared columns are
  -- KEPT (no longer written by this code) so the previous release keeps
  -- reading its links after this migration, which makes a code-only rollback
  -- safe. Drop them in a later, hand-written migration once the release is
  -- accepted (see docs/cms-home-rollout.md).
  UPDATE "header_primary_nav_locales" l SET "link_internal_href" = p."link_internal_href", "link_external_href" = p."link_external_href", "link_anchor" = p."link_anchor" FROM "header_primary_nav" p WHERE l."_parent_id" = p."id";
  UPDATE "header_locales" l SET "primary_cta_internal_href" = p."primary_cta_internal_href", "primary_cta_external_href" = p."primary_cta_external_href", "primary_cta_anchor" = p."primary_cta_anchor" FROM "header" p WHERE l."_parent_id" = p."id";
  UPDATE "footer_columns_links_locales" l SET "link_internal_href" = p."link_internal_href", "link_external_href" = p."link_external_href", "link_anchor" = p."link_anchor" FROM "footer_columns_links" p WHERE l."_parent_id" = p."id";
  UPDATE "footer_contact_links_locales" l SET "link_internal_href" = p."link_internal_href", "link_external_href" = p."link_external_href", "link_anchor" = p."link_anchor" FROM "footer_contact_links" p WHERE l."_parent_id" = p."id";
  UPDATE "footer_legal_links_locales" l SET "link_internal_href" = p."link_internal_href", "link_external_href" = p."link_external_href", "link_anchor" = p."link_anchor" FROM "footer_legal_links" p WHERE l."_parent_id" = p."id";
  UPDATE "footer_locales" l SET "cta_primary_internal_href" = p."cta_primary_internal_href", "cta_primary_external_href" = p."cta_primary_external_href", "cta_primary_anchor" = p."cta_primary_anchor" FROM "footer" p WHERE l."_parent_id" = p."id";
  UPDATE "footer_locales" l SET "cta_secondary_internal_href" = p."cta_secondary_internal_href", "cta_secondary_external_href" = p."cta_secondary_external_href", "cta_secondary_anchor" = p."cta_secondary_anchor" FROM "footer" p WHERE l."_parent_id" = p."id";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "services_related_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_version_related_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_blocks_hero_frames" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_blocks_services_carousel_orbit_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_blocks_logos_card_stats" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_blocks_logos_card" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_home_v_blocks_hero_frames" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_home_v_blocks_services_carousel_orbit_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_home_v_blocks_logos_card_stats" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_home_v_blocks_logos_card" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "services_related_links" CASCADE;
  DROP TABLE "_services_v_version_related_links" CASCADE;
  DROP TABLE "home_blocks_hero_frames" CASCADE;
  DROP TABLE "home_blocks_services_carousel_orbit_items" CASCADE;
  DROP TABLE "home_blocks_logos_card_stats" CASCADE;
  DROP TABLE "home_blocks_logos_card" CASCADE;
  DROP TABLE "_home_v_blocks_hero_frames" CASCADE;
  DROP TABLE "_home_v_blocks_services_carousel_orbit_items" CASCADE;
  DROP TABLE "_home_v_blocks_logos_card_stats" CASCADE;
  DROP TABLE "_home_v_blocks_logos_card" CASCADE;
  ALTER TABLE "logos" DROP CONSTRAINT "logos_mono_image_id_media_id_fk";
  
  ALTER TABLE "home_blocks_service_system_slider_layers_features" ALTER COLUMN "icon" SET DATA TYPE text;
  -- HAND-ADDED: icons added by this migration (coffee, chef, utensils…) do
  -- not exist in the previous enum. Map them to 'spark', which the previous
  -- code already renders for a missing icon; migrate + payload:seed:home
  -- restore the real ones when rolling forward.
  UPDATE "home_blocks_service_system_slider_layers_features" SET "icon" = 'spark' WHERE "icon" NOT IN ('heart', 'spark', 'trend', 'clock', 'briefcase', 'people', 'shield', 'chart', 'chat', 'calendar');
  DROP TYPE "public"."enum_home_blocks_service_system_slider_layers_features_icon";
  CREATE TYPE "public"."enum_home_blocks_service_system_slider_layers_features_icon" AS ENUM('heart', 'spark', 'trend', 'clock', 'briefcase', 'people', 'shield', 'chart', 'chat', 'calendar');
  ALTER TABLE "home_blocks_service_system_slider_layers_features" ALTER COLUMN "icon" SET DATA TYPE "public"."enum_home_blocks_service_system_slider_layers_features_icon" USING "icon"::"public"."enum_home_blocks_service_system_slider_layers_features_icon";
  ALTER TABLE "_home_v_blocks_service_system_slider_layers_features" ALTER COLUMN "icon" SET DATA TYPE text;
  -- HAND-ADDED: icons added by this migration (coffee, chef, utensils…) do
  -- not exist in the previous enum. Map them to 'spark', which the previous
  -- code already renders for a missing icon; migrate + payload:seed:home
  -- restore the real ones when rolling forward.
  UPDATE "_home_v_blocks_service_system_slider_layers_features" SET "icon" = 'spark' WHERE "icon" NOT IN ('heart', 'spark', 'trend', 'clock', 'briefcase', 'people', 'shield', 'chart', 'chat', 'calendar');
  DROP TYPE "public"."enum__home_v_blocks_service_system_slider_layers_features_icon";
  CREATE TYPE "public"."enum__home_v_blocks_service_system_slider_layers_features_icon" AS ENUM('heart', 'spark', 'trend', 'clock', 'briefcase', 'people', 'shield', 'chart', 'chat', 'calendar');
  ALTER TABLE "_home_v_blocks_service_system_slider_layers_features" ALTER COLUMN "icon" SET DATA TYPE "public"."enum__home_v_blocks_service_system_slider_layers_features_icon" USING "icon"::"public"."enum__home_v_blocks_service_system_slider_layers_features_icon";
  DROP INDEX "logos_mono_image_idx";
  ALTER TABLE "header_primary_nav" ADD COLUMN IF NOT EXISTS "link_internal_href" varchar;
  ALTER TABLE "header_primary_nav" ADD COLUMN IF NOT EXISTS "link_external_href" varchar;
  ALTER TABLE "header_primary_nav" ADD COLUMN IF NOT EXISTS "link_anchor" varchar;
  ALTER TABLE "header" ADD COLUMN IF NOT EXISTS "primary_cta_internal_href" varchar;
  ALTER TABLE "header" ADD COLUMN IF NOT EXISTS "primary_cta_external_href" varchar;
  ALTER TABLE "header" ADD COLUMN IF NOT EXISTS "primary_cta_anchor" varchar;
  ALTER TABLE "footer_columns_links" ADD COLUMN IF NOT EXISTS "link_internal_href" varchar;
  ALTER TABLE "footer_columns_links" ADD COLUMN IF NOT EXISTS "link_external_href" varchar;
  ALTER TABLE "footer_columns_links" ADD COLUMN IF NOT EXISTS "link_anchor" varchar;
  ALTER TABLE "footer_contact_links" ADD COLUMN IF NOT EXISTS "link_internal_href" varchar;
  ALTER TABLE "footer_contact_links" ADD COLUMN IF NOT EXISTS "link_external_href" varchar;
  ALTER TABLE "footer_contact_links" ADD COLUMN IF NOT EXISTS "link_anchor" varchar;
  ALTER TABLE "footer_legal_links" ADD COLUMN IF NOT EXISTS "link_internal_href" varchar;
  ALTER TABLE "footer_legal_links" ADD COLUMN IF NOT EXISTS "link_external_href" varchar;
  ALTER TABLE "footer_legal_links" ADD COLUMN IF NOT EXISTS "link_anchor" varchar;
  ALTER TABLE "footer" ADD COLUMN IF NOT EXISTS "cta_primary_internal_href" varchar;
  ALTER TABLE "footer" ADD COLUMN IF NOT EXISTS "cta_primary_external_href" varchar;
  ALTER TABLE "footer" ADD COLUMN IF NOT EXISTS "cta_primary_anchor" varchar;
  ALTER TABLE "footer" ADD COLUMN IF NOT EXISTS "cta_secondary_internal_href" varchar;
  ALTER TABLE "footer" ADD COLUMN IF NOT EXISTS "cta_secondary_external_href" varchar;
  ALTER TABLE "footer" ADD COLUMN IF NOT EXISTS "cta_secondary_anchor" varchar;
  ALTER TABLE "services_locales" DROP COLUMN "href";
  ALTER TABLE "services_locales" DROP COLUMN "cta_label";
  ALTER TABLE "_services_v_locales" DROP COLUMN "version_href";
  ALTER TABLE "_services_v_locales" DROP COLUMN "version_cta_label";
  ALTER TABLE "stories" DROP COLUMN "repeats_hero";
  ALTER TABLE "stories_locales" DROP COLUMN "location";
  ALTER TABLE "_stories_v" DROP COLUMN "version_repeats_hero";
  ALTER TABLE "_stories_v_locales" DROP COLUMN "version_location";
  ALTER TABLE "logos" DROP COLUMN "mono_image_id";
  -- HAND-ADDED: restore the shared link columns from the locale rows: any locale
  -- first, then Spanish on top, so a document with only one locale keeps its links.
  UPDATE "header_primary_nav" p SET "link_internal_href" = l."link_internal_href", "link_external_href" = l."link_external_href", "link_anchor" = l."link_anchor" FROM "header_primary_nav_locales" l WHERE l."_parent_id" = p."id";
  UPDATE "header_primary_nav" p SET "link_internal_href" = l."link_internal_href", "link_external_href" = l."link_external_href", "link_anchor" = l."link_anchor" FROM "header_primary_nav_locales" l WHERE l."_parent_id" = p."id" AND l."_locale" = 'es';
  UPDATE "header" p SET "primary_cta_internal_href" = l."primary_cta_internal_href", "primary_cta_external_href" = l."primary_cta_external_href", "primary_cta_anchor" = l."primary_cta_anchor" FROM "header_locales" l WHERE l."_parent_id" = p."id";
  UPDATE "header" p SET "primary_cta_internal_href" = l."primary_cta_internal_href", "primary_cta_external_href" = l."primary_cta_external_href", "primary_cta_anchor" = l."primary_cta_anchor" FROM "header_locales" l WHERE l."_parent_id" = p."id" AND l."_locale" = 'es';
  UPDATE "footer_columns_links" p SET "link_internal_href" = l."link_internal_href", "link_external_href" = l."link_external_href", "link_anchor" = l."link_anchor" FROM "footer_columns_links_locales" l WHERE l."_parent_id" = p."id";
  UPDATE "footer_columns_links" p SET "link_internal_href" = l."link_internal_href", "link_external_href" = l."link_external_href", "link_anchor" = l."link_anchor" FROM "footer_columns_links_locales" l WHERE l."_parent_id" = p."id" AND l."_locale" = 'es';
  UPDATE "footer_contact_links" p SET "link_internal_href" = l."link_internal_href", "link_external_href" = l."link_external_href", "link_anchor" = l."link_anchor" FROM "footer_contact_links_locales" l WHERE l."_parent_id" = p."id";
  UPDATE "footer_contact_links" p SET "link_internal_href" = l."link_internal_href", "link_external_href" = l."link_external_href", "link_anchor" = l."link_anchor" FROM "footer_contact_links_locales" l WHERE l."_parent_id" = p."id" AND l."_locale" = 'es';
  UPDATE "footer_legal_links" p SET "link_internal_href" = l."link_internal_href", "link_external_href" = l."link_external_href", "link_anchor" = l."link_anchor" FROM "footer_legal_links_locales" l WHERE l."_parent_id" = p."id";
  UPDATE "footer_legal_links" p SET "link_internal_href" = l."link_internal_href", "link_external_href" = l."link_external_href", "link_anchor" = l."link_anchor" FROM "footer_legal_links_locales" l WHERE l."_parent_id" = p."id" AND l."_locale" = 'es';
  UPDATE "footer" p SET "cta_primary_internal_href" = l."cta_primary_internal_href", "cta_primary_external_href" = l."cta_primary_external_href", "cta_primary_anchor" = l."cta_primary_anchor" FROM "footer_locales" l WHERE l."_parent_id" = p."id";
  UPDATE "footer" p SET "cta_primary_internal_href" = l."cta_primary_internal_href", "cta_primary_external_href" = l."cta_primary_external_href", "cta_primary_anchor" = l."cta_primary_anchor" FROM "footer_locales" l WHERE l."_parent_id" = p."id" AND l."_locale" = 'es';
  UPDATE "footer" p SET "cta_secondary_internal_href" = l."cta_secondary_internal_href", "cta_secondary_external_href" = l."cta_secondary_external_href", "cta_secondary_anchor" = l."cta_secondary_anchor" FROM "footer_locales" l WHERE l."_parent_id" = p."id";
  UPDATE "footer" p SET "cta_secondary_internal_href" = l."cta_secondary_internal_href", "cta_secondary_external_href" = l."cta_secondary_external_href", "cta_secondary_anchor" = l."cta_secondary_anchor" FROM "footer_locales" l WHERE l."_parent_id" = p."id" AND l."_locale" = 'es';
  ALTER TABLE "header_primary_nav_locales" DROP COLUMN "link_internal_href";
  ALTER TABLE "header_primary_nav_locales" DROP COLUMN "link_external_href";
  ALTER TABLE "header_primary_nav_locales" DROP COLUMN "link_anchor";
  ALTER TABLE "header_locales" DROP COLUMN "primary_cta_internal_href";
  ALTER TABLE "header_locales" DROP COLUMN "primary_cta_external_href";
  ALTER TABLE "header_locales" DROP COLUMN "primary_cta_anchor";
  ALTER TABLE "footer_columns_links_locales" DROP COLUMN "link_internal_href";
  ALTER TABLE "footer_columns_links_locales" DROP COLUMN "link_external_href";
  ALTER TABLE "footer_columns_links_locales" DROP COLUMN "link_anchor";
  ALTER TABLE "footer_contact_links_locales" DROP COLUMN "link_internal_href";
  ALTER TABLE "footer_contact_links_locales" DROP COLUMN "link_external_href";
  ALTER TABLE "footer_contact_links_locales" DROP COLUMN "link_anchor";
  ALTER TABLE "footer_legal_links_locales" DROP COLUMN "link_internal_href";
  ALTER TABLE "footer_legal_links_locales" DROP COLUMN "link_external_href";
  ALTER TABLE "footer_legal_links_locales" DROP COLUMN "link_anchor";
  ALTER TABLE "footer_locales" DROP COLUMN "tagline_emphasis";
  ALTER TABLE "footer_locales" DROP COLUMN "cta_primary_internal_href";
  ALTER TABLE "footer_locales" DROP COLUMN "cta_primary_external_href";
  ALTER TABLE "footer_locales" DROP COLUMN "cta_primary_anchor";
  ALTER TABLE "footer_locales" DROP COLUMN "cta_secondary_internal_href";
  ALTER TABLE "footer_locales" DROP COLUMN "cta_secondary_external_href";
  ALTER TABLE "footer_locales" DROP COLUMN "cta_secondary_anchor";
  ALTER TABLE "home_blocks_hero" DROP COLUMN "title_emphasis";
  ALTER TABLE "home_blocks_hero" DROP COLUMN "copy_short";
  ALTER TABLE "home_blocks_hero" DROP COLUMN "ribbon_stat_value";
  ALTER TABLE "home_blocks_hero" DROP COLUMN "ribbon_stat_label";
  ALTER TABLE "home_blocks_services_carousel" DROP COLUMN "cover_copy";
  ALTER TABLE "home_blocks_services_carousel" DROP COLUMN "labels_view_service";
  ALTER TABLE "home_blocks_services_carousel" DROP COLUMN "labels_logos_aria_label";
  ALTER TABLE "home_blocks_studies_card" DROP COLUMN "sub";
  ALTER TABLE "home_blocks_proof_bento" DROP COLUMN "kicker";
  ALTER TABLE "home_blocks_proof_bento" DROP COLUMN "heading_trail";
  ALTER TABLE "home_blocks_proof_bento" DROP COLUMN "client_logos_aria_label";
  ALTER TABLE "home_blocks_operating_system_tabs" DROP COLUMN "icon";
  ALTER TABLE "home_blocks_operating_system_tabs" DROP COLUMN "tone";
  ALTER TABLE "home_blocks_operating_system_tabs" DROP COLUMN "stage";
  ALTER TABLE "home_blocks_operating_system_tabs" DROP COLUMN "stage_copy_before";
  ALTER TABLE "home_blocks_operating_system_tabs" DROP COLUMN "stage_copy_highlight";
  ALTER TABLE "home_blocks_operating_system_tabs" DROP COLUMN "stage_copy_after";
  ALTER TABLE "home_blocks_operating_system" DROP COLUMN "cta_primary_type";
  ALTER TABLE "home_blocks_operating_system" DROP COLUMN "cta_primary_label";
  ALTER TABLE "home_blocks_operating_system" DROP COLUMN "cta_primary_internal_href";
  ALTER TABLE "home_blocks_operating_system" DROP COLUMN "cta_primary_external_href";
  ALTER TABLE "home_blocks_operating_system" DROP COLUMN "cta_primary_anchor";
  ALTER TABLE "home_blocks_operating_system" DROP COLUMN "cta_secondary_type";
  ALTER TABLE "home_blocks_operating_system" DROP COLUMN "cta_secondary_label";
  ALTER TABLE "home_blocks_operating_system" DROP COLUMN "cta_secondary_internal_href";
  ALTER TABLE "home_blocks_operating_system" DROP COLUMN "cta_secondary_external_href";
  ALTER TABLE "home_blocks_operating_system" DROP COLUMN "cta_secondary_anchor";
  ALTER TABLE "home_blocks_operating_system" DROP COLUMN "labels_previous";
  ALTER TABLE "home_blocks_operating_system" DROP COLUMN "labels_next";
  ALTER TABLE "home_blocks_service_system_slider_layers" DROP COLUMN "short_title";
  ALTER TABLE "home_blocks_service_system_slider_layers" DROP COLUMN "copy";
  ALTER TABLE "home_blocks_service_system_slider_layers" DROP COLUMN "href";
  ALTER TABLE "home_blocks_service_system_slider_layers" DROP COLUMN "cta_label";
  ALTER TABLE "home_blocks_service_system_slider" DROP COLUMN "labels_cta_label";
  ALTER TABLE "home_blocks_service_system_slider" DROP COLUMN "labels_view_details";
  ALTER TABLE "home_blocks_service_system_slider" DROP COLUMN "labels_hide_details";
  ALTER TABLE "home_blocks_faq" DROP COLUMN "heading_lead";
  ALTER TABLE "home_blocks_faq" DROP COLUMN "cta_title";
  ALTER TABLE "home_blocks_faq" DROP COLUMN "cta_copy";
  ALTER TABLE "_home_v_blocks_hero" DROP COLUMN "title_emphasis";
  ALTER TABLE "_home_v_blocks_hero" DROP COLUMN "copy_short";
  ALTER TABLE "_home_v_blocks_hero" DROP COLUMN "ribbon_stat_value";
  ALTER TABLE "_home_v_blocks_hero" DROP COLUMN "ribbon_stat_label";
  ALTER TABLE "_home_v_blocks_services_carousel" DROP COLUMN "cover_copy";
  ALTER TABLE "_home_v_blocks_services_carousel" DROP COLUMN "labels_view_service";
  ALTER TABLE "_home_v_blocks_services_carousel" DROP COLUMN "labels_logos_aria_label";
  ALTER TABLE "_home_v_blocks_studies_card" DROP COLUMN "sub";
  ALTER TABLE "_home_v_blocks_proof_bento" DROP COLUMN "kicker";
  ALTER TABLE "_home_v_blocks_proof_bento" DROP COLUMN "heading_trail";
  ALTER TABLE "_home_v_blocks_proof_bento" DROP COLUMN "client_logos_aria_label";
  ALTER TABLE "_home_v_blocks_operating_system_tabs" DROP COLUMN "icon";
  ALTER TABLE "_home_v_blocks_operating_system_tabs" DROP COLUMN "tone";
  ALTER TABLE "_home_v_blocks_operating_system_tabs" DROP COLUMN "stage";
  ALTER TABLE "_home_v_blocks_operating_system_tabs" DROP COLUMN "stage_copy_before";
  ALTER TABLE "_home_v_blocks_operating_system_tabs" DROP COLUMN "stage_copy_highlight";
  ALTER TABLE "_home_v_blocks_operating_system_tabs" DROP COLUMN "stage_copy_after";
  ALTER TABLE "_home_v_blocks_operating_system" DROP COLUMN "cta_primary_type";
  ALTER TABLE "_home_v_blocks_operating_system" DROP COLUMN "cta_primary_label";
  ALTER TABLE "_home_v_blocks_operating_system" DROP COLUMN "cta_primary_internal_href";
  ALTER TABLE "_home_v_blocks_operating_system" DROP COLUMN "cta_primary_external_href";
  ALTER TABLE "_home_v_blocks_operating_system" DROP COLUMN "cta_primary_anchor";
  ALTER TABLE "_home_v_blocks_operating_system" DROP COLUMN "cta_secondary_type";
  ALTER TABLE "_home_v_blocks_operating_system" DROP COLUMN "cta_secondary_label";
  ALTER TABLE "_home_v_blocks_operating_system" DROP COLUMN "cta_secondary_internal_href";
  ALTER TABLE "_home_v_blocks_operating_system" DROP COLUMN "cta_secondary_external_href";
  ALTER TABLE "_home_v_blocks_operating_system" DROP COLUMN "cta_secondary_anchor";
  ALTER TABLE "_home_v_blocks_operating_system" DROP COLUMN "labels_previous";
  ALTER TABLE "_home_v_blocks_operating_system" DROP COLUMN "labels_next";
  ALTER TABLE "_home_v_blocks_service_system_slider_layers" DROP COLUMN "short_title";
  ALTER TABLE "_home_v_blocks_service_system_slider_layers" DROP COLUMN "copy";
  ALTER TABLE "_home_v_blocks_service_system_slider_layers" DROP COLUMN "href";
  ALTER TABLE "_home_v_blocks_service_system_slider_layers" DROP COLUMN "cta_label";
  ALTER TABLE "_home_v_blocks_service_system_slider" DROP COLUMN "labels_cta_label";
  ALTER TABLE "_home_v_blocks_service_system_slider" DROP COLUMN "labels_view_details";
  ALTER TABLE "_home_v_blocks_service_system_slider" DROP COLUMN "labels_hide_details";
  ALTER TABLE "_home_v_blocks_faq" DROP COLUMN "heading_lead";
  ALTER TABLE "_home_v_blocks_faq" DROP COLUMN "cta_title";
  ALTER TABLE "_home_v_blocks_faq" DROP COLUMN "cta_copy";
  DROP TYPE "public"."enum_home_blocks_hero_frames_pillar";
  DROP TYPE "public"."enum_home_blocks_services_carousel_orbit_items_theme";
  DROP TYPE "public"."enum_home_blocks_logos_card_tone";
  DROP TYPE "public"."enum_home_blocks_operating_system_tabs_icon";
  DROP TYPE "public"."enum_home_blocks_operating_system_tabs_tone";
  DROP TYPE "public"."enum_home_blocks_operating_system_cta_primary_type";
  DROP TYPE "public"."enum_home_blocks_operating_system_cta_secondary_type";
  DROP TYPE "public"."enum__home_v_blocks_hero_frames_pillar";
  DROP TYPE "public"."enum__home_v_blocks_services_carousel_orbit_items_theme";
  DROP TYPE "public"."enum__home_v_blocks_logos_card_tone";
  DROP TYPE "public"."enum__home_v_blocks_operating_system_tabs_icon";
  DROP TYPE "public"."enum__home_v_blocks_operating_system_tabs_tone";
  DROP TYPE "public"."enum__home_v_blocks_operating_system_cta_primary_type";
  DROP TYPE "public"."enum__home_v_blocks_operating_system_cta_secondary_type";`)
}
