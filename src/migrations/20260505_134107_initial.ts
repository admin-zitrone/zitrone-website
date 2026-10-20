import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('en', 'es');
  CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor');
  CREATE TYPE "public"."enum_services_accent" AS ENUM('dining', 'cafe', 'pantry', 'catering');
  CREATE TYPE "public"."enum_services_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__services_v_version_accent" AS ENUM('dining', 'cafe', 'pantry', 'catering');
  CREATE TYPE "public"."enum__services_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__services_v_published_locale" AS ENUM('en', 'es');
  CREATE TYPE "public"."enum_stories_logo_fit" AS ENUM('wide', 'balanced', 'compact');
  CREATE TYPE "public"."enum_stories_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__stories_v_version_logo_fit" AS ENUM('wide', 'balanced', 'compact');
  CREATE TYPE "public"."enum__stories_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__stories_v_published_locale" AS ENUM('en', 'es');
  CREATE TYPE "public"."enum_logos_usage_context" AS ENUM('hero', 'ribbon', 'stories');
  CREATE TYPE "public"."enum_logos_fit" AS ENUM('wide', 'balanced', 'compact');
  CREATE TYPE "public"."enum_faqs_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__faqs_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__faqs_v_published_locale" AS ENUM('en', 'es');
  CREATE TYPE "public"."enum_blog_posts_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__blog_posts_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__blog_posts_v_published_locale" AS ENUM('en', 'es');
  CREATE TYPE "public"."enum_header_primary_nav_link_type" AS ENUM('internal', 'external', 'anchor');
  CREATE TYPE "public"."enum_header_primary_cta_type" AS ENUM('internal', 'external', 'anchor');
  CREATE TYPE "public"."enum_footer_columns_links_link_type" AS ENUM('internal', 'external', 'anchor');
  CREATE TYPE "public"."enum_footer_contact_links_link_type" AS ENUM('internal', 'external', 'anchor');
  CREATE TYPE "public"."enum_footer_legal_links_link_type" AS ENUM('internal', 'external', 'anchor');
  CREATE TYPE "public"."enum_footer_social_links_icon" AS ENUM('linkedin', 'instagram', 'facebook', 'twitter');
  CREATE TYPE "public"."enum_footer_cta_primary_type" AS ENUM('internal', 'external', 'anchor');
  CREATE TYPE "public"."enum_footer_cta_secondary_type" AS ENUM('internal', 'external', 'anchor');
  CREATE TYPE "public"."enum_home_blocks_hero_primary_nav_link_type" AS ENUM('internal', 'external', 'anchor');
  CREATE TYPE "public"."enum_home_blocks_hero_cta_type" AS ENUM('internal', 'external', 'anchor');
  CREATE TYPE "public"."enum_home_blocks_services_carousel_title_words_emphasis" AS ENUM('regular', 'italic', 'accent');
  CREATE TYPE "public"."enum_home_blocks_services_carousel_cta_primary_type" AS ENUM('internal', 'external', 'anchor');
  CREATE TYPE "public"."enum_home_blocks_services_carousel_cta_secondary_type" AS ENUM('internal', 'external', 'anchor');
  CREATE TYPE "public"."enum_home_blocks_clock_card_tone" AS ENUM('slate');
  CREATE TYPE "public"."enum_home_blocks_specialties_card_boxes_size" AS ENUM('sm', 'md', 'lg');
  CREATE TYPE "public"."enum_home_blocks_plain_card_tone" AS ENUM('natural', 'ocean');
  CREATE TYPE "public"."enum_home_blocks_operating_system_title_words_emphasis" AS ENUM('regular', 'italic', 'accent');
  CREATE TYPE "public"."enum_home_blocks_service_system_slider_layers_features_icon" AS ENUM('heart', 'spark', 'trend', 'clock', 'briefcase', 'people', 'shield', 'chart', 'chat', 'calendar');
  CREATE TYPE "public"."enum_home_blocks_service_system_slider_layers_theme" AS ENUM('dining', 'cafe', 'pantry', 'coffee', 'grab-go', 'catering');
  CREATE TYPE "public"."enum_home_blocks_stories_title_words_emphasis" AS ENUM('regular', 'italic', 'accent');
  CREATE TYPE "public"."enum_home_blocks_stories_cta_type" AS ENUM('internal', 'external', 'anchor');
  CREATE TYPE "public"."enum_home_blocks_stories_panel_cta_type" AS ENUM('internal', 'external', 'anchor');
  CREATE TYPE "public"."enum_home_blocks_faq_cta_type" AS ENUM('internal', 'external', 'anchor');
  CREATE TYPE "public"."enum_home_blocks_cta_cta_primary_type" AS ENUM('internal', 'external', 'anchor');
  CREATE TYPE "public"."enum_home_blocks_cta_cta_secondary_type" AS ENUM('internal', 'external', 'anchor');
  CREATE TYPE "public"."enum_home_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__home_v_blocks_hero_primary_nav_link_type" AS ENUM('internal', 'external', 'anchor');
  CREATE TYPE "public"."enum__home_v_blocks_hero_cta_type" AS ENUM('internal', 'external', 'anchor');
  CREATE TYPE "public"."enum__home_v_blocks_services_carousel_title_words_emphasis" AS ENUM('regular', 'italic', 'accent');
  CREATE TYPE "public"."enum__home_v_blocks_services_carousel_cta_primary_type" AS ENUM('internal', 'external', 'anchor');
  CREATE TYPE "public"."enum__home_v_blocks_services_carousel_cta_secondary_type" AS ENUM('internal', 'external', 'anchor');
  CREATE TYPE "public"."enum__home_v_blocks_clock_card_tone" AS ENUM('slate');
  CREATE TYPE "public"."enum__home_v_blocks_specialties_card_boxes_size" AS ENUM('sm', 'md', 'lg');
  CREATE TYPE "public"."enum__home_v_blocks_plain_card_tone" AS ENUM('natural', 'ocean');
  CREATE TYPE "public"."enum__home_v_blocks_operating_system_title_words_emphasis" AS ENUM('regular', 'italic', 'accent');
  CREATE TYPE "public"."enum__home_v_blocks_service_system_slider_layers_features_icon" AS ENUM('heart', 'spark', 'trend', 'clock', 'briefcase', 'people', 'shield', 'chart', 'chat', 'calendar');
  CREATE TYPE "public"."enum__home_v_blocks_service_system_slider_layers_theme" AS ENUM('dining', 'cafe', 'pantry', 'coffee', 'grab-go', 'catering');
  CREATE TYPE "public"."enum__home_v_blocks_stories_title_words_emphasis" AS ENUM('regular', 'italic', 'accent');
  CREATE TYPE "public"."enum__home_v_blocks_stories_cta_type" AS ENUM('internal', 'external', 'anchor');
  CREATE TYPE "public"."enum__home_v_blocks_stories_panel_cta_type" AS ENUM('internal', 'external', 'anchor');
  CREATE TYPE "public"."enum__home_v_blocks_faq_cta_type" AS ENUM('internal', 'external', 'anchor');
  CREATE TYPE "public"."enum__home_v_blocks_cta_cta_primary_type" AS ENUM('internal', 'external', 'anchor');
  CREATE TYPE "public"."enum__home_v_blocks_cta_cta_secondary_type" AS ENUM('internal', 'external', 'anchor');
  CREATE TYPE "public"."enum__home_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__home_v_published_locale" AS ENUM('en', 'es');
  CREATE TYPE "public"."enum_billing_page_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__billing_page_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__billing_page_v_published_locale" AS ENUM('en', 'es');
  CREATE TYPE "public"."enum_privacy_notice_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__privacy_notice_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__privacy_notice_v_published_locale" AS ENUM('en', 'es');
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"role" "enum_users_role" DEFAULT 'editor' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"credit" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_feature_url" varchar,
  	"sizes_feature_width" numeric,
  	"sizes_feature_height" numeric,
  	"sizes_feature_mime_type" varchar,
  	"sizes_feature_filesize" numeric,
  	"sizes_feature_filename" varchar,
  	"sizes_hero_url" varchar,
  	"sizes_hero_width" numeric,
  	"sizes_hero_height" numeric,
  	"sizes_hero_mime_type" varchar,
  	"sizes_hero_filesize" numeric,
  	"sizes_hero_filename" varchar
  );
  
  CREATE TABLE "media_locales" (
  	"alt" varchar NOT NULL,
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "services" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"accent" "enum_services_accent",
  	"image_id" integer,
  	"slug" varchar,
  	"seo_og_image_id" integer,
  	"seo_canonical" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_services_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "services_locales" (
  	"title" varchar,
  	"eyebrow" varchar,
  	"copy" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_services_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_accent" "enum__services_v_version_accent",
  	"version_image_id" integer,
  	"version_slug" varchar,
  	"version_seo_og_image_id" integer,
  	"version_seo_canonical" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__services_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__services_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_services_v_locales" (
  	"version_title" varchar,
  	"version_eyebrow" varchar,
  	"version_copy" varchar,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "stories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"logo_id" integer,
  	"logo_fit" "enum_stories_logo_fit" DEFAULT 'balanced',
  	"logo_scale" numeric,
  	"image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_stories_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "stories_locales" (
  	"label" varchar,
  	"role" varchar,
  	"image_alt" varchar,
  	"quote" varchar,
  	"quote_highlight" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_stories_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_logo_id" integer,
  	"version_logo_fit" "enum__stories_v_version_logo_fit" DEFAULT 'balanced',
  	"version_logo_scale" numeric,
  	"version_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__stories_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__stories_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_stories_v_locales" (
  	"version_label" varchar,
  	"version_role" varchar,
  	"version_image_alt" varchar,
  	"version_quote" varchar,
  	"version_quote_highlight" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "logos_usage_context" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_logos_usage_context",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "logos" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"image_id" integer NOT NULL,
  	"fit" "enum_logos_fit" DEFAULT 'balanced',
  	"scale" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "logos_locales" (
  	"alt" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "faqs_answer" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "faqs_answer_locales" (
  	"paragraph" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "faqs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"embedding" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_faqs_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "faqs_locales" (
  	"question" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "faqs_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "_faqs_v_version_answer" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_faqs_v_version_answer_locales" (
  	"paragraph" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_faqs_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_embedding" jsonb,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__faqs_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__faqs_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_faqs_v_locales" (
  	"version_question" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_faqs_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "blog_posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"hero_image_id" integer,
  	"category_id" integer,
  	"author_name" varchar,
  	"author_avatar_id" integer,
  	"published_at" timestamp(3) with time zone,
  	"embedding" jsonb,
  	"seo_og_image_id" integer,
  	"seo_canonical" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_blog_posts_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "blog_posts_locales" (
  	"title" varchar,
  	"excerpt" varchar,
  	"body" jsonb,
  	"author_role" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "blog_posts_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "_blog_posts_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar,
  	"version_hero_image_id" integer,
  	"version_category_id" integer,
  	"version_author_name" varchar,
  	"version_author_avatar_id" integer,
  	"version_published_at" timestamp(3) with time zone,
  	"version_embedding" jsonb,
  	"version_seo_og_image_id" integer,
  	"version_seo_canonical" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__blog_posts_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__blog_posts_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_blog_posts_v_locales" (
  	"version_title" varchar,
  	"version_excerpt" varchar,
  	"version_body" jsonb,
  	"version_author_role" varchar,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_blog_posts_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "blog_categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "blog_categories_locales" (
  	"name" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"media_id" integer,
  	"services_id" integer,
  	"stories_id" integer,
  	"logos_id" integer,
  	"faqs_id" integer,
  	"blog_posts_id" integer,
  	"blog_categories_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_settings_contacts_address" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "site_settings_contacts_address_locales" (
  	"line" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"brand_name" varchar DEFAULT 'Zitrone' NOT NULL,
  	"brand_default_og_image_id" integer,
  	"contacts_primary_email" varchar NOT NULL,
  	"contacts_billing_email" varchar,
  	"contacts_phone" varchar,
  	"legal_entity_name" varchar,
  	"legal_rfc" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "site_settings_locales" (
  	"brand_tagline" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "header_primary_nav" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_header_primary_nav_link_type" DEFAULT 'internal',
  	"link_internal_href" varchar,
  	"link_external_href" varchar,
  	"link_anchor" varchar
  );
  
  CREATE TABLE "header_primary_nav_locales" (
  	"link_label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "header" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"primary_cta_type" "enum_header_primary_cta_type" DEFAULT 'internal',
  	"primary_cta_internal_href" varchar,
  	"primary_cta_external_href" varchar,
  	"primary_cta_anchor" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "header_locales" (
  	"nav_aria_label" varchar,
  	"primary_cta_label" varchar,
  	"language_menu_label" varchar,
  	"language_menu_aria_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "footer_columns_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_footer_columns_links_link_type" DEFAULT 'internal',
  	"link_internal_href" varchar,
  	"link_external_href" varchar,
  	"link_anchor" varchar
  );
  
  CREATE TABLE "footer_columns_links_locales" (
  	"link_label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "footer_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "footer_columns_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "footer_contact_address" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "footer_contact_address_locales" (
  	"line" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "footer_contact_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_footer_contact_links_link_type" DEFAULT 'internal',
  	"link_internal_href" varchar,
  	"link_external_href" varchar,
  	"link_anchor" varchar
  );
  
  CREATE TABLE "footer_contact_links_locales" (
  	"link_label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "footer_legal_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_footer_legal_links_link_type" DEFAULT 'internal',
  	"link_internal_href" varchar,
  	"link_external_href" varchar,
  	"link_anchor" varchar
  );
  
  CREATE TABLE "footer_legal_links_locales" (
  	"link_label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "footer_social_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_footer_social_links_icon" NOT NULL,
  	"href" varchar NOT NULL
  );
  
  CREATE TABLE "footer_social_links_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "footer" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"cta_primary_type" "enum_footer_cta_primary_type" DEFAULT 'internal',
  	"cta_primary_internal_href" varchar,
  	"cta_primary_external_href" varchar,
  	"cta_primary_anchor" varchar,
  	"cta_secondary_type" "enum_footer_cta_secondary_type" DEFAULT 'internal',
  	"cta_secondary_internal_href" varchar,
  	"cta_secondary_external_href" varchar,
  	"cta_secondary_anchor" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "footer_locales" (
  	"aria_label" varchar,
  	"tagline" varchar,
  	"cta_primary_label" varchar NOT NULL,
  	"cta_secondary_label" varchar,
  	"contact_label" varchar,
  	"legal_copyright" varchar,
  	"socials_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "home_blocks_hero_primary_nav" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_home_blocks_hero_primary_nav_link_type" DEFAULT 'internal',
  	"link_internal_href" varchar,
  	"link_external_href" varchar,
  	"link_anchor" varchar
  );
  
  CREATE TABLE "home_blocks_hero_primary_nav_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"cta_type" "enum_home_blocks_hero_cta_type" DEFAULT 'internal',
  	"cta_internal_href" varchar,
  	"cta_external_href" varchar,
  	"cta_anchor" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "home_blocks_hero_locales" (
  	"nav_aria_label" varchar,
  	"mobile_nav_aria_label" varchar,
  	"menu_open_label" varchar,
  	"menu_close_label" varchar,
  	"title" varchar,
  	"copy" varchar,
  	"ribbon_label" varchar,
  	"marquee_aria_label" varchar,
  	"cta_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_blocks_services_carousel_title_words" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"emphasis" "enum_home_blocks_services_carousel_title_words_emphasis" DEFAULT 'regular'
  );
  
  CREATE TABLE "home_blocks_services_carousel_title_words_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_blocks_services_carousel" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"cta_primary_type" "enum_home_blocks_services_carousel_cta_primary_type" DEFAULT 'internal',
  	"cta_primary_internal_href" varchar,
  	"cta_primary_external_href" varchar,
  	"cta_primary_anchor" varchar,
  	"cta_secondary_type" "enum_home_blocks_services_carousel_cta_secondary_type" DEFAULT 'internal',
  	"cta_secondary_internal_href" varchar,
  	"cta_secondary_external_href" varchar,
  	"cta_secondary_anchor" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "home_blocks_services_carousel_locales" (
  	"kicker" varchar,
  	"title_aria_label" varchar,
  	"copy" varchar,
  	"cta_primary_label" varchar,
  	"cta_secondary_label" varchar,
  	"labels_region_label" varchar,
  	"labels_previous" varchar,
  	"labels_next" varchar,
  	"labels_progress_label" varchar,
  	"labels_slide_template" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_blocks_photo_card" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "home_blocks_photo_card_locales" (
  	"title" varchar,
  	"sub" varchar,
  	"alt" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_blocks_clock_card" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tone" "enum_home_blocks_clock_card_tone" DEFAULT 'slate',
  	"block_name" varchar
  );
  
  CREATE TABLE "home_blocks_clock_card_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_blocks_specialties_card_boxes" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"size" "enum_home_blocks_specialties_card_boxes_size" DEFAULT 'md'
  );
  
  CREATE TABLE "home_blocks_specialties_card_boxes_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_blocks_specialties_card" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "home_blocks_specialties_card_locales" (
  	"title" varchar,
  	"sub" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_blocks_studies_card" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "home_blocks_studies_card_locales" (
  	"title" varchar,
  	"alt" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_blocks_plain_card" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tone" "enum_home_blocks_plain_card_tone" DEFAULT 'natural',
  	"block_name" varchar
  );
  
  CREATE TABLE "home_blocks_plain_card_locales" (
  	"title" varchar,
  	"sub" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_blocks_proof_bento_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "home_blocks_proof_bento" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "home_blocks_proof_bento_locales" (
  	"heading_aria_label" varchar,
  	"heading_lead" varchar,
  	"heading_accent" varchar,
  	"copy" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_blocks_featured_media" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "home_blocks_featured_media_locales" (
  	"label" varchar,
  	"aria_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_blocks_operating_system_title_words" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"emphasis" "enum_home_blocks_operating_system_title_words_emphasis" DEFAULT 'regular'
  );
  
  CREATE TABLE "home_blocks_operating_system_title_words_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_blocks_operating_system_tabs" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"image_id" integer
  );
  
  CREATE TABLE "home_blocks_operating_system_tabs_locales" (
  	"title" varchar,
  	"copy" varchar,
  	"panel_title" varchar,
  	"panel_copy" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_blocks_operating_system" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "home_blocks_operating_system_locales" (
  	"kicker" varchar,
  	"title_aria_label" varchar,
  	"copy" varchar,
  	"labels_section_label" varchar,
  	"labels_list_aria_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_blocks_service_system_slider_layers_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_home_blocks_service_system_slider_layers_features_icon"
  );
  
  CREATE TABLE "home_blocks_service_system_slider_layers_features_locales" (
  	"title" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_blocks_service_system_slider_layers" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"theme" "enum_home_blocks_service_system_slider_layers_theme",
  	"image_id" integer
  );
  
  CREATE TABLE "home_blocks_service_system_slider_layers_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_blocks_service_system_slider" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "home_blocks_service_system_slider_locales" (
  	"labels_kicker" varchar,
  	"labels_title_line1" varchar,
  	"labels_title_line2" varchar,
  	"labels_title_aria_label" varchar,
  	"labels_nav_aria_label" varchar,
  	"labels_progress_aria_label" varchar,
  	"labels_progress_value_text_template" varchar,
  	"labels_eyebrow_template" varchar,
  	"labels_previous" varchar,
  	"labels_next" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_blocks_profiler_labels_program_a_recommendations" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "home_blocks_profiler_labels_program_a_recommendations_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_blocks_profiler_labels_program_b_recommendations" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "home_blocks_profiler_labels_program_b_recommendations_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_blocks_profiler_labels_program_c_recommendations" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "home_blocks_profiler_labels_program_c_recommendations_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_blocks_profiler_volume_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "home_blocks_profiler_volume_options_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_blocks_profiler_jobs" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "home_blocks_profiler_jobs_locales" (
  	"title" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_blocks_profiler_needs" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "home_blocks_profiler_needs_locales" (
  	"title" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_blocks_profiler" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"labels_talk_to_zitrone_href" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "home_blocks_profiler_locales" (
  	"labels_kicker" varchar,
  	"labels_step0_heading" varchar,
  	"labels_step0_copy" varchar,
  	"labels_chooser_aria_label" varchar,
  	"labels_chooser_placeholder" varchar,
  	"labels_step1_heading" varchar,
  	"labels_step1_copy" varchar,
  	"labels_step2_heading" varchar,
  	"labels_step2_copy" varchar,
  	"labels_back" varchar,
  	"labels_see_setup" varchar,
  	"labels_start_over" varchar,
  	"labels_talk_to_zitrone" varchar,
  	"labels_default_result_heading" varchar,
  	"labels_default_result_body" varchar,
  	"labels_program_a_label" varchar,
  	"labels_program_a_heading" varchar,
  	"labels_program_a_body" varchar,
  	"labels_program_b_label" varchar,
  	"labels_program_b_heading" varchar,
  	"labels_program_b_body" varchar,
  	"labels_program_c_label" varchar,
  	"labels_program_c_heading" varchar,
  	"labels_program_c_body" varchar,
  	"labels_program_a_extra_breakfast" varchar,
  	"labels_program_a_extra_dining" varchar,
  	"labels_program_a_extra_grab_and_go" varchar,
  	"labels_program_b_extra_coffee" varchar,
  	"labels_program_b_extra_pantry" varchar,
  	"labels_program_b_extra_cafeteria" varchar,
  	"labels_program_b_fallback" varchar,
  	"labels_plus_events" varchar,
  	"labels_plus_fuel" varchar,
  	"labels_growth_level1" varchar,
  	"labels_growth_level2" varchar,
  	"labels_growth_level3" varchar,
  	"labels_growth_level4" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_blocks_stories_title_words" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"emphasis" "enum_home_blocks_stories_title_words_emphasis" DEFAULT 'regular'
  );
  
  CREATE TABLE "home_blocks_stories_title_words_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_blocks_stories" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"cta_type" "enum_home_blocks_stories_cta_type" DEFAULT 'internal',
  	"cta_internal_href" varchar,
  	"cta_external_href" varchar,
  	"cta_anchor" varchar,
  	"panel_cta_type" "enum_home_blocks_stories_panel_cta_type" DEFAULT 'internal',
  	"panel_cta_internal_href" varchar,
  	"panel_cta_external_href" varchar,
  	"panel_cta_anchor" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "home_blocks_stories_locales" (
  	"kicker" varchar,
  	"title_aria_label" varchar,
  	"copy" varchar,
  	"cta_label" varchar,
  	"panel_cta_label" varchar,
  	"labels_tablist_aria_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"cta_type" "enum_home_blocks_faq_cta_type" DEFAULT 'internal',
  	"cta_internal_href" varchar,
  	"cta_external_href" varchar,
  	"cta_anchor" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "home_blocks_faq_locales" (
  	"heading" varchar,
  	"cta_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"cta_primary_type" "enum_home_blocks_cta_cta_primary_type" DEFAULT 'internal',
  	"cta_primary_internal_href" varchar,
  	"cta_primary_external_href" varchar,
  	"cta_primary_anchor" varchar,
  	"cta_secondary_type" "enum_home_blocks_cta_cta_secondary_type" DEFAULT 'internal',
  	"cta_secondary_internal_href" varchar,
  	"cta_secondary_external_href" varchar,
  	"cta_secondary_anchor" varchar,
  	"background_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "home_blocks_cta_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"copy" varchar,
  	"cta_primary_label" varchar,
  	"cta_secondary_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"meta_og_image_id" integer,
  	"seo_og_image_id" integer,
  	"seo_canonical" varchar,
  	"_status" "enum_home_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "home_locales" (
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_site_name" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "home_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"logos_id" integer,
  	"services_id" integer,
  	"stories_id" integer,
  	"faqs_id" integer
  );
  
  CREATE TABLE "_home_v_blocks_hero_primary_nav" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum__home_v_blocks_hero_primary_nav_link_type" DEFAULT 'internal',
  	"link_internal_href" varchar,
  	"link_external_href" varchar,
  	"link_anchor" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_v_blocks_hero_primary_nav_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_v_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"cta_type" "enum__home_v_blocks_hero_cta_type" DEFAULT 'internal',
  	"cta_internal_href" varchar,
  	"cta_external_href" varchar,
  	"cta_anchor" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_home_v_blocks_hero_locales" (
  	"nav_aria_label" varchar,
  	"mobile_nav_aria_label" varchar,
  	"menu_open_label" varchar,
  	"menu_close_label" varchar,
  	"title" varchar,
  	"copy" varchar,
  	"ribbon_label" varchar,
  	"marquee_aria_label" varchar,
  	"cta_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_v_blocks_services_carousel_title_words" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"emphasis" "enum__home_v_blocks_services_carousel_title_words_emphasis" DEFAULT 'regular',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_v_blocks_services_carousel_title_words_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_v_blocks_services_carousel" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"cta_primary_type" "enum__home_v_blocks_services_carousel_cta_primary_type" DEFAULT 'internal',
  	"cta_primary_internal_href" varchar,
  	"cta_primary_external_href" varchar,
  	"cta_primary_anchor" varchar,
  	"cta_secondary_type" "enum__home_v_blocks_services_carousel_cta_secondary_type" DEFAULT 'internal',
  	"cta_secondary_internal_href" varchar,
  	"cta_secondary_external_href" varchar,
  	"cta_secondary_anchor" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_home_v_blocks_services_carousel_locales" (
  	"kicker" varchar,
  	"title_aria_label" varchar,
  	"copy" varchar,
  	"cta_primary_label" varchar,
  	"cta_secondary_label" varchar,
  	"labels_region_label" varchar,
  	"labels_previous" varchar,
  	"labels_next" varchar,
  	"labels_progress_label" varchar,
  	"labels_slide_template" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_v_blocks_photo_card" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_home_v_blocks_photo_card_locales" (
  	"title" varchar,
  	"sub" varchar,
  	"alt" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_v_blocks_clock_card" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"tone" "enum__home_v_blocks_clock_card_tone" DEFAULT 'slate',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_home_v_blocks_clock_card_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_v_blocks_specialties_card_boxes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"size" "enum__home_v_blocks_specialties_card_boxes_size" DEFAULT 'md',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_v_blocks_specialties_card_boxes_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_v_blocks_specialties_card" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_home_v_blocks_specialties_card_locales" (
  	"title" varchar,
  	"sub" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_v_blocks_studies_card" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_home_v_blocks_studies_card_locales" (
  	"title" varchar,
  	"alt" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_v_blocks_plain_card" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"tone" "enum__home_v_blocks_plain_card_tone" DEFAULT 'natural',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_home_v_blocks_plain_card_locales" (
  	"title" varchar,
  	"sub" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_v_blocks_proof_bento_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_v_blocks_proof_bento" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_home_v_blocks_proof_bento_locales" (
  	"heading_aria_label" varchar,
  	"heading_lead" varchar,
  	"heading_accent" varchar,
  	"copy" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_v_blocks_featured_media" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_home_v_blocks_featured_media_locales" (
  	"label" varchar,
  	"aria_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_v_blocks_operating_system_title_words" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"emphasis" "enum__home_v_blocks_operating_system_title_words_emphasis" DEFAULT 'regular',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_v_blocks_operating_system_title_words_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_v_blocks_operating_system_tabs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_v_blocks_operating_system_tabs_locales" (
  	"title" varchar,
  	"copy" varchar,
  	"panel_title" varchar,
  	"panel_copy" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_v_blocks_operating_system" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_home_v_blocks_operating_system_locales" (
  	"kicker" varchar,
  	"title_aria_label" varchar,
  	"copy" varchar,
  	"labels_section_label" varchar,
  	"labels_list_aria_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_v_blocks_service_system_slider_layers_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" "enum__home_v_blocks_service_system_slider_layers_features_icon",
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_v_blocks_service_system_slider_layers_features_locales" (
  	"title" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_v_blocks_service_system_slider_layers" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"theme" "enum__home_v_blocks_service_system_slider_layers_theme",
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_v_blocks_service_system_slider_layers_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_v_blocks_service_system_slider" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_home_v_blocks_service_system_slider_locales" (
  	"labels_kicker" varchar,
  	"labels_title_line1" varchar,
  	"labels_title_line2" varchar,
  	"labels_title_aria_label" varchar,
  	"labels_nav_aria_label" varchar,
  	"labels_progress_aria_label" varchar,
  	"labels_progress_value_text_template" varchar,
  	"labels_eyebrow_template" varchar,
  	"labels_previous" varchar,
  	"labels_next" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_v_blocks_profiler_labels_program_a_recommendations" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_v_blocks_profiler_labels_program_a_recommendations_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_v_blocks_profiler_labels_program_b_recommendations" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_v_blocks_profiler_labels_program_b_recommendations_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_v_blocks_profiler_labels_program_c_recommendations" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_v_blocks_profiler_labels_program_c_recommendations_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_v_blocks_profiler_volume_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_v_blocks_profiler_volume_options_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_v_blocks_profiler_jobs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_v_blocks_profiler_jobs_locales" (
  	"title" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_v_blocks_profiler_needs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_v_blocks_profiler_needs_locales" (
  	"title" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_v_blocks_profiler" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"labels_talk_to_zitrone_href" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_home_v_blocks_profiler_locales" (
  	"labels_kicker" varchar,
  	"labels_step0_heading" varchar,
  	"labels_step0_copy" varchar,
  	"labels_chooser_aria_label" varchar,
  	"labels_chooser_placeholder" varchar,
  	"labels_step1_heading" varchar,
  	"labels_step1_copy" varchar,
  	"labels_step2_heading" varchar,
  	"labels_step2_copy" varchar,
  	"labels_back" varchar,
  	"labels_see_setup" varchar,
  	"labels_start_over" varchar,
  	"labels_talk_to_zitrone" varchar,
  	"labels_default_result_heading" varchar,
  	"labels_default_result_body" varchar,
  	"labels_program_a_label" varchar,
  	"labels_program_a_heading" varchar,
  	"labels_program_a_body" varchar,
  	"labels_program_b_label" varchar,
  	"labels_program_b_heading" varchar,
  	"labels_program_b_body" varchar,
  	"labels_program_c_label" varchar,
  	"labels_program_c_heading" varchar,
  	"labels_program_c_body" varchar,
  	"labels_program_a_extra_breakfast" varchar,
  	"labels_program_a_extra_dining" varchar,
  	"labels_program_a_extra_grab_and_go" varchar,
  	"labels_program_b_extra_coffee" varchar,
  	"labels_program_b_extra_pantry" varchar,
  	"labels_program_b_extra_cafeteria" varchar,
  	"labels_program_b_fallback" varchar,
  	"labels_plus_events" varchar,
  	"labels_plus_fuel" varchar,
  	"labels_growth_level1" varchar,
  	"labels_growth_level2" varchar,
  	"labels_growth_level3" varchar,
  	"labels_growth_level4" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_v_blocks_stories_title_words" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"emphasis" "enum__home_v_blocks_stories_title_words_emphasis" DEFAULT 'regular',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_v_blocks_stories_title_words_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_v_blocks_stories" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"cta_type" "enum__home_v_blocks_stories_cta_type" DEFAULT 'internal',
  	"cta_internal_href" varchar,
  	"cta_external_href" varchar,
  	"cta_anchor" varchar,
  	"panel_cta_type" "enum__home_v_blocks_stories_panel_cta_type" DEFAULT 'internal',
  	"panel_cta_internal_href" varchar,
  	"panel_cta_external_href" varchar,
  	"panel_cta_anchor" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_home_v_blocks_stories_locales" (
  	"kicker" varchar,
  	"title_aria_label" varchar,
  	"copy" varchar,
  	"cta_label" varchar,
  	"panel_cta_label" varchar,
  	"labels_tablist_aria_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_v_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"cta_type" "enum__home_v_blocks_faq_cta_type" DEFAULT 'internal',
  	"cta_internal_href" varchar,
  	"cta_external_href" varchar,
  	"cta_anchor" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_home_v_blocks_faq_locales" (
  	"heading" varchar,
  	"cta_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_v_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"cta_primary_type" "enum__home_v_blocks_cta_cta_primary_type" DEFAULT 'internal',
  	"cta_primary_internal_href" varchar,
  	"cta_primary_external_href" varchar,
  	"cta_primary_anchor" varchar,
  	"cta_secondary_type" "enum__home_v_blocks_cta_cta_secondary_type" DEFAULT 'internal',
  	"cta_secondary_internal_href" varchar,
  	"cta_secondary_external_href" varchar,
  	"cta_secondary_anchor" varchar,
  	"background_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_home_v_blocks_cta_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"copy" varchar,
  	"cta_primary_label" varchar,
  	"cta_secondary_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_meta_og_image_id" integer,
  	"version_seo_og_image_id" integer,
  	"version_seo_canonical" varchar,
  	"version__status" "enum__home_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__home_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_home_v_locales" (
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_site_name" varchar,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"logos_id" integer,
  	"services_id" integer,
  	"stories_id" integer,
  	"faqs_id" integer
  );
  
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
  
  CREATE TABLE "privacy_notice" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"last_updated" timestamp(3) with time zone,
  	"seo_og_image_id" integer,
  	"seo_canonical" varchar,
  	"_status" "enum_privacy_notice_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "privacy_notice_locales" (
  	"heading" varchar,
  	"body" jsonb,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_privacy_notice_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_last_updated" timestamp(3) with time zone,
  	"version_seo_og_image_id" integer,
  	"version_seo_canonical" varchar,
  	"version__status" "enum__privacy_notice_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__privacy_notice_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_privacy_notice_v_locales" (
  	"version_heading" varchar,
  	"version_body" jsonb,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media_locales" ADD CONSTRAINT "media_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services" ADD CONSTRAINT "services_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services" ADD CONSTRAINT "services_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services_locales" ADD CONSTRAINT "services_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v" ADD CONSTRAINT "_services_v_parent_id_services_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_services_v" ADD CONSTRAINT "_services_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_services_v" ADD CONSTRAINT "_services_v_version_seo_og_image_id_media_id_fk" FOREIGN KEY ("version_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_services_v_locales" ADD CONSTRAINT "_services_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "stories" ADD CONSTRAINT "stories_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "stories" ADD CONSTRAINT "stories_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "stories_locales" ADD CONSTRAINT "stories_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."stories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_stories_v" ADD CONSTRAINT "_stories_v_parent_id_stories_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."stories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_stories_v" ADD CONSTRAINT "_stories_v_version_logo_id_media_id_fk" FOREIGN KEY ("version_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_stories_v" ADD CONSTRAINT "_stories_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_stories_v_locales" ADD CONSTRAINT "_stories_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_stories_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "logos_usage_context" ADD CONSTRAINT "logos_usage_context_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."logos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "logos" ADD CONSTRAINT "logos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "logos_locales" ADD CONSTRAINT "logos_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."logos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "faqs_answer" ADD CONSTRAINT "faqs_answer_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "faqs_answer_locales" ADD CONSTRAINT "faqs_answer_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."faqs_answer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "faqs_locales" ADD CONSTRAINT "faqs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "faqs_texts" ADD CONSTRAINT "faqs_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_faqs_v_version_answer" ADD CONSTRAINT "_faqs_v_version_answer_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_faqs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_faqs_v_version_answer_locales" ADD CONSTRAINT "_faqs_v_version_answer_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_faqs_v_version_answer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_faqs_v" ADD CONSTRAINT "_faqs_v_parent_id_faqs_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."faqs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_faqs_v_locales" ADD CONSTRAINT "_faqs_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_faqs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_faqs_v_texts" ADD CONSTRAINT "_faqs_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_faqs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_category_id_blog_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."blog_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_author_avatar_id_media_id_fk" FOREIGN KEY ("author_avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "blog_posts_locales" ADD CONSTRAINT "blog_posts_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog_posts_texts" ADD CONSTRAINT "blog_posts_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_blog_posts_v" ADD CONSTRAINT "_blog_posts_v_parent_id_blog_posts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."blog_posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_blog_posts_v" ADD CONSTRAINT "_blog_posts_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_blog_posts_v" ADD CONSTRAINT "_blog_posts_v_version_category_id_blog_categories_id_fk" FOREIGN KEY ("version_category_id") REFERENCES "public"."blog_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_blog_posts_v" ADD CONSTRAINT "_blog_posts_v_version_author_avatar_id_media_id_fk" FOREIGN KEY ("version_author_avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_blog_posts_v" ADD CONSTRAINT "_blog_posts_v_version_seo_og_image_id_media_id_fk" FOREIGN KEY ("version_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_blog_posts_v_locales" ADD CONSTRAINT "_blog_posts_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blog_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_blog_posts_v_texts" ADD CONSTRAINT "_blog_posts_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_blog_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog_categories_locales" ADD CONSTRAINT "blog_categories_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_stories_fk" FOREIGN KEY ("stories_id") REFERENCES "public"."stories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_logos_fk" FOREIGN KEY ("logos_id") REFERENCES "public"."logos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_faqs_fk" FOREIGN KEY ("faqs_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_blog_posts_fk" FOREIGN KEY ("blog_posts_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_blog_categories_fk" FOREIGN KEY ("blog_categories_id") REFERENCES "public"."blog_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_contacts_address" ADD CONSTRAINT "site_settings_contacts_address_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_contacts_address_locales" ADD CONSTRAINT "site_settings_contacts_address_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings_contacts_address"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_brand_default_og_image_id_media_id_fk" FOREIGN KEY ("brand_default_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings_locales" ADD CONSTRAINT "site_settings_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_primary_nav" ADD CONSTRAINT "header_primary_nav_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_primary_nav_locales" ADD CONSTRAINT "header_primary_nav_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header_primary_nav"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_locales" ADD CONSTRAINT "header_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_columns_links" ADD CONSTRAINT "footer_columns_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_columns_links_locales" ADD CONSTRAINT "footer_columns_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_columns_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_columns" ADD CONSTRAINT "footer_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_columns_locales" ADD CONSTRAINT "footer_columns_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_contact_address" ADD CONSTRAINT "footer_contact_address_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_contact_address_locales" ADD CONSTRAINT "footer_contact_address_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_contact_address"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_contact_links" ADD CONSTRAINT "footer_contact_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_contact_links_locales" ADD CONSTRAINT "footer_contact_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_contact_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_legal_links" ADD CONSTRAINT "footer_legal_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_legal_links_locales" ADD CONSTRAINT "footer_legal_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_legal_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_social_links" ADD CONSTRAINT "footer_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_social_links_locales" ADD CONSTRAINT "footer_social_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_social_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_locales" ADD CONSTRAINT "footer_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_hero_primary_nav" ADD CONSTRAINT "home_blocks_hero_primary_nav_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_hero_primary_nav_locales" ADD CONSTRAINT "home_blocks_hero_primary_nav_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_hero_primary_nav"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_hero" ADD CONSTRAINT "home_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_hero_locales" ADD CONSTRAINT "home_blocks_hero_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_services_carousel_title_words" ADD CONSTRAINT "home_blocks_services_carousel_title_words_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_services_carousel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_services_carousel_title_words_locales" ADD CONSTRAINT "home_blocks_services_carousel_title_words_locales_parent__fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_services_carousel_title_words"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_services_carousel" ADD CONSTRAINT "home_blocks_services_carousel_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_services_carousel_locales" ADD CONSTRAINT "home_blocks_services_carousel_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_services_carousel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_photo_card" ADD CONSTRAINT "home_blocks_photo_card_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_blocks_photo_card" ADD CONSTRAINT "home_blocks_photo_card_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_photo_card_locales" ADD CONSTRAINT "home_blocks_photo_card_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_photo_card"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_clock_card" ADD CONSTRAINT "home_blocks_clock_card_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_clock_card_locales" ADD CONSTRAINT "home_blocks_clock_card_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_clock_card"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_specialties_card_boxes" ADD CONSTRAINT "home_blocks_specialties_card_boxes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_specialties_card"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_specialties_card_boxes_locales" ADD CONSTRAINT "home_blocks_specialties_card_boxes_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_specialties_card_boxes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_specialties_card" ADD CONSTRAINT "home_blocks_specialties_card_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_specialties_card_locales" ADD CONSTRAINT "home_blocks_specialties_card_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_specialties_card"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_studies_card" ADD CONSTRAINT "home_blocks_studies_card_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_blocks_studies_card" ADD CONSTRAINT "home_blocks_studies_card_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_studies_card_locales" ADD CONSTRAINT "home_blocks_studies_card_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_studies_card"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_plain_card" ADD CONSTRAINT "home_blocks_plain_card_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_plain_card_locales" ADD CONSTRAINT "home_blocks_plain_card_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_plain_card"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_proof_bento_columns" ADD CONSTRAINT "home_blocks_proof_bento_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_proof_bento"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_proof_bento" ADD CONSTRAINT "home_blocks_proof_bento_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_proof_bento_locales" ADD CONSTRAINT "home_blocks_proof_bento_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_proof_bento"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_featured_media" ADD CONSTRAINT "home_blocks_featured_media_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_featured_media_locales" ADD CONSTRAINT "home_blocks_featured_media_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_featured_media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_operating_system_title_words" ADD CONSTRAINT "home_blocks_operating_system_title_words_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_operating_system"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_operating_system_title_words_locales" ADD CONSTRAINT "home_blocks_operating_system_title_words_locales_parent_i_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_operating_system_title_words"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_operating_system_tabs" ADD CONSTRAINT "home_blocks_operating_system_tabs_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_blocks_operating_system_tabs" ADD CONSTRAINT "home_blocks_operating_system_tabs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_operating_system"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_operating_system_tabs_locales" ADD CONSTRAINT "home_blocks_operating_system_tabs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_operating_system_tabs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_operating_system" ADD CONSTRAINT "home_blocks_operating_system_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_operating_system_locales" ADD CONSTRAINT "home_blocks_operating_system_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_operating_system"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_service_system_slider_layers_features" ADD CONSTRAINT "home_blocks_service_system_slider_layers_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_service_system_slider_layers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_service_system_slider_layers_features_locales" ADD CONSTRAINT "home_blocks_service_system_slider_layers_features_locales_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_service_system_slider_layers_features"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_service_system_slider_layers" ADD CONSTRAINT "home_blocks_service_system_slider_layers_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_blocks_service_system_slider_layers" ADD CONSTRAINT "home_blocks_service_system_slider_layers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_service_system_slider"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_service_system_slider_layers_locales" ADD CONSTRAINT "home_blocks_service_system_slider_layers_locales_parent_i_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_service_system_slider_layers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_service_system_slider" ADD CONSTRAINT "home_blocks_service_system_slider_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_service_system_slider_locales" ADD CONSTRAINT "home_blocks_service_system_slider_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_service_system_slider"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_profiler_labels_program_a_recommendations" ADD CONSTRAINT "home_blocks_profiler_labels_program_a_recommendations_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_profiler"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_profiler_labels_program_a_recommendations_locales" ADD CONSTRAINT "home_blocks_profiler_labels_program_a_recommendations_loc_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_profiler_labels_program_a_recommendations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_profiler_labels_program_b_recommendations" ADD CONSTRAINT "home_blocks_profiler_labels_program_b_recommendations_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_profiler"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_profiler_labels_program_b_recommendations_locales" ADD CONSTRAINT "home_blocks_profiler_labels_program_b_recommendations_loc_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_profiler_labels_program_b_recommendations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_profiler_labels_program_c_recommendations" ADD CONSTRAINT "home_blocks_profiler_labels_program_c_recommendations_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_profiler"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_profiler_labels_program_c_recommendations_locales" ADD CONSTRAINT "home_blocks_profiler_labels_program_c_recommendations_loc_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_profiler_labels_program_c_recommendations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_profiler_volume_options" ADD CONSTRAINT "home_blocks_profiler_volume_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_profiler"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_profiler_volume_options_locales" ADD CONSTRAINT "home_blocks_profiler_volume_options_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_profiler_volume_options"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_profiler_jobs" ADD CONSTRAINT "home_blocks_profiler_jobs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_profiler"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_profiler_jobs_locales" ADD CONSTRAINT "home_blocks_profiler_jobs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_profiler_jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_profiler_needs" ADD CONSTRAINT "home_blocks_profiler_needs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_profiler"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_profiler_needs_locales" ADD CONSTRAINT "home_blocks_profiler_needs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_profiler_needs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_profiler" ADD CONSTRAINT "home_blocks_profiler_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_profiler_locales" ADD CONSTRAINT "home_blocks_profiler_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_profiler"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_stories_title_words" ADD CONSTRAINT "home_blocks_stories_title_words_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_stories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_stories_title_words_locales" ADD CONSTRAINT "home_blocks_stories_title_words_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_stories_title_words"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_stories" ADD CONSTRAINT "home_blocks_stories_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_stories_locales" ADD CONSTRAINT "home_blocks_stories_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_stories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_faq" ADD CONSTRAINT "home_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_faq_locales" ADD CONSTRAINT "home_blocks_faq_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_cta" ADD CONSTRAINT "home_blocks_cta_background_id_media_id_fk" FOREIGN KEY ("background_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_blocks_cta" ADD CONSTRAINT "home_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_cta_locales" ADD CONSTRAINT "home_blocks_cta_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home" ADD CONSTRAINT "home_meta_og_image_id_media_id_fk" FOREIGN KEY ("meta_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home" ADD CONSTRAINT "home_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_locales" ADD CONSTRAINT "home_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_rels" ADD CONSTRAINT "home_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_rels" ADD CONSTRAINT "home_rels_logos_fk" FOREIGN KEY ("logos_id") REFERENCES "public"."logos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_rels" ADD CONSTRAINT "home_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_rels" ADD CONSTRAINT "home_rels_stories_fk" FOREIGN KEY ("stories_id") REFERENCES "public"."stories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_rels" ADD CONSTRAINT "home_rels_faqs_fk" FOREIGN KEY ("faqs_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_hero_primary_nav" ADD CONSTRAINT "_home_v_blocks_hero_primary_nav_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_hero_primary_nav_locales" ADD CONSTRAINT "_home_v_blocks_hero_primary_nav_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_hero_primary_nav"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_hero" ADD CONSTRAINT "_home_v_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_hero_locales" ADD CONSTRAINT "_home_v_blocks_hero_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_services_carousel_title_words" ADD CONSTRAINT "_home_v_blocks_services_carousel_title_words_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_services_carousel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_services_carousel_title_words_locales" ADD CONSTRAINT "_home_v_blocks_services_carousel_title_words_locales_pare_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_services_carousel_title_words"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_services_carousel" ADD CONSTRAINT "_home_v_blocks_services_carousel_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_services_carousel_locales" ADD CONSTRAINT "_home_v_blocks_services_carousel_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_services_carousel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_photo_card" ADD CONSTRAINT "_home_v_blocks_photo_card_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_photo_card" ADD CONSTRAINT "_home_v_blocks_photo_card_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_photo_card_locales" ADD CONSTRAINT "_home_v_blocks_photo_card_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_photo_card"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_clock_card" ADD CONSTRAINT "_home_v_blocks_clock_card_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_clock_card_locales" ADD CONSTRAINT "_home_v_blocks_clock_card_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_clock_card"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_specialties_card_boxes" ADD CONSTRAINT "_home_v_blocks_specialties_card_boxes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_specialties_card"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_specialties_card_boxes_locales" ADD CONSTRAINT "_home_v_blocks_specialties_card_boxes_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_specialties_card_boxes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_specialties_card" ADD CONSTRAINT "_home_v_blocks_specialties_card_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_specialties_card_locales" ADD CONSTRAINT "_home_v_blocks_specialties_card_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_specialties_card"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_studies_card" ADD CONSTRAINT "_home_v_blocks_studies_card_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_studies_card" ADD CONSTRAINT "_home_v_blocks_studies_card_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_studies_card_locales" ADD CONSTRAINT "_home_v_blocks_studies_card_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_studies_card"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_plain_card" ADD CONSTRAINT "_home_v_blocks_plain_card_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_plain_card_locales" ADD CONSTRAINT "_home_v_blocks_plain_card_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_plain_card"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_proof_bento_columns" ADD CONSTRAINT "_home_v_blocks_proof_bento_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_proof_bento"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_proof_bento" ADD CONSTRAINT "_home_v_blocks_proof_bento_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_proof_bento_locales" ADD CONSTRAINT "_home_v_blocks_proof_bento_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_proof_bento"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_featured_media" ADD CONSTRAINT "_home_v_blocks_featured_media_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_featured_media_locales" ADD CONSTRAINT "_home_v_blocks_featured_media_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_featured_media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_operating_system_title_words" ADD CONSTRAINT "_home_v_blocks_operating_system_title_words_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_operating_system"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_operating_system_title_words_locales" ADD CONSTRAINT "_home_v_blocks_operating_system_title_words_locales_paren_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_operating_system_title_words"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_operating_system_tabs" ADD CONSTRAINT "_home_v_blocks_operating_system_tabs_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_operating_system_tabs" ADD CONSTRAINT "_home_v_blocks_operating_system_tabs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_operating_system"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_operating_system_tabs_locales" ADD CONSTRAINT "_home_v_blocks_operating_system_tabs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_operating_system_tabs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_operating_system" ADD CONSTRAINT "_home_v_blocks_operating_system_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_operating_system_locales" ADD CONSTRAINT "_home_v_blocks_operating_system_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_operating_system"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_service_system_slider_layers_features" ADD CONSTRAINT "_home_v_blocks_service_system_slider_layers_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_service_system_slider_layers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_service_system_slider_layers_features_locales" ADD CONSTRAINT "_home_v_blocks_service_system_slider_layers_features_loca_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_service_system_slider_layers_features"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_service_system_slider_layers" ADD CONSTRAINT "_home_v_blocks_service_system_slider_layers_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_service_system_slider_layers" ADD CONSTRAINT "_home_v_blocks_service_system_slider_layers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_service_system_slider"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_service_system_slider_layers_locales" ADD CONSTRAINT "_home_v_blocks_service_system_slider_layers_locales_paren_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_service_system_slider_layers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_service_system_slider" ADD CONSTRAINT "_home_v_blocks_service_system_slider_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_service_system_slider_locales" ADD CONSTRAINT "_home_v_blocks_service_system_slider_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_service_system_slider"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_profiler_labels_program_a_recommendations" ADD CONSTRAINT "_home_v_blocks_profiler_labels_program_a_recommendations_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_profiler"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_profiler_labels_program_a_recommendations_locales" ADD CONSTRAINT "_home_v_blocks_profiler_labels_program_a_recommendations__fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_profiler_labels_program_a_recommendations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_profiler_labels_program_b_recommendations" ADD CONSTRAINT "_home_v_blocks_profiler_labels_program_b_recommendations_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_profiler"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_profiler_labels_program_b_recommendations_locales" ADD CONSTRAINT "_home_v_blocks_profiler_labels_program_b_recommendations__fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_profiler_labels_program_b_recommendations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_profiler_labels_program_c_recommendations" ADD CONSTRAINT "_home_v_blocks_profiler_labels_program_c_recommendations_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_profiler"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_profiler_labels_program_c_recommendations_locales" ADD CONSTRAINT "_home_v_blocks_profiler_labels_program_c_recommendations__fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_profiler_labels_program_c_recommendations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_profiler_volume_options" ADD CONSTRAINT "_home_v_blocks_profiler_volume_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_profiler"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_profiler_volume_options_locales" ADD CONSTRAINT "_home_v_blocks_profiler_volume_options_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_profiler_volume_options"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_profiler_jobs" ADD CONSTRAINT "_home_v_blocks_profiler_jobs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_profiler"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_profiler_jobs_locales" ADD CONSTRAINT "_home_v_blocks_profiler_jobs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_profiler_jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_profiler_needs" ADD CONSTRAINT "_home_v_blocks_profiler_needs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_profiler"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_profiler_needs_locales" ADD CONSTRAINT "_home_v_blocks_profiler_needs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_profiler_needs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_profiler" ADD CONSTRAINT "_home_v_blocks_profiler_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_profiler_locales" ADD CONSTRAINT "_home_v_blocks_profiler_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_profiler"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_stories_title_words" ADD CONSTRAINT "_home_v_blocks_stories_title_words_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_stories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_stories_title_words_locales" ADD CONSTRAINT "_home_v_blocks_stories_title_words_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_stories_title_words"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_stories" ADD CONSTRAINT "_home_v_blocks_stories_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_stories_locales" ADD CONSTRAINT "_home_v_blocks_stories_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_stories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_faq" ADD CONSTRAINT "_home_v_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_faq_locales" ADD CONSTRAINT "_home_v_blocks_faq_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_cta" ADD CONSTRAINT "_home_v_blocks_cta_background_id_media_id_fk" FOREIGN KEY ("background_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_cta" ADD CONSTRAINT "_home_v_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_cta_locales" ADD CONSTRAINT "_home_v_blocks_cta_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v" ADD CONSTRAINT "_home_v_version_meta_og_image_id_media_id_fk" FOREIGN KEY ("version_meta_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_v" ADD CONSTRAINT "_home_v_version_seo_og_image_id_media_id_fk" FOREIGN KEY ("version_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_v_locales" ADD CONSTRAINT "_home_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_rels" ADD CONSTRAINT "_home_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_home_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_rels" ADD CONSTRAINT "_home_v_rels_logos_fk" FOREIGN KEY ("logos_id") REFERENCES "public"."logos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_rels" ADD CONSTRAINT "_home_v_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_rels" ADD CONSTRAINT "_home_v_rels_stories_fk" FOREIGN KEY ("stories_id") REFERENCES "public"."stories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_rels" ADD CONSTRAINT "_home_v_rels_faqs_fk" FOREIGN KEY ("faqs_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "billing_page_recipients" ADD CONSTRAINT "billing_page_recipients_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."billing_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "billing_page" ADD CONSTRAINT "billing_page_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "billing_page_locales" ADD CONSTRAINT "billing_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."billing_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_billing_page_v_version_recipients" ADD CONSTRAINT "_billing_page_v_version_recipients_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_billing_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_billing_page_v" ADD CONSTRAINT "_billing_page_v_version_seo_og_image_id_media_id_fk" FOREIGN KEY ("version_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_billing_page_v_locales" ADD CONSTRAINT "_billing_page_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_billing_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "privacy_notice" ADD CONSTRAINT "privacy_notice_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "privacy_notice_locales" ADD CONSTRAINT "privacy_notice_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."privacy_notice"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_privacy_notice_v" ADD CONSTRAINT "_privacy_notice_v_version_seo_og_image_id_media_id_fk" FOREIGN KEY ("version_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_privacy_notice_v_locales" ADD CONSTRAINT "_privacy_notice_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_privacy_notice_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_feature_sizes_feature_filename_idx" ON "media" USING btree ("sizes_feature_filename");
  CREATE INDEX "media_sizes_hero_sizes_hero_filename_idx" ON "media" USING btree ("sizes_hero_filename");
  CREATE UNIQUE INDEX "media_locales_locale_parent_id_unique" ON "media_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "services_image_idx" ON "services" USING btree ("image_id");
  CREATE UNIQUE INDEX "services_slug_idx" ON "services" USING btree ("slug");
  CREATE INDEX "services_seo_seo_og_image_idx" ON "services" USING btree ("seo_og_image_id");
  CREATE INDEX "services_updated_at_idx" ON "services" USING btree ("updated_at");
  CREATE INDEX "services_created_at_idx" ON "services" USING btree ("created_at");
  CREATE INDEX "services__status_idx" ON "services" USING btree ("_status");
  CREATE UNIQUE INDEX "services_locales_locale_parent_id_unique" ON "services_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_services_v_parent_idx" ON "_services_v" USING btree ("parent_id");
  CREATE INDEX "_services_v_version_version_image_idx" ON "_services_v" USING btree ("version_image_id");
  CREATE INDEX "_services_v_version_version_slug_idx" ON "_services_v" USING btree ("version_slug");
  CREATE INDEX "_services_v_version_seo_version_seo_og_image_idx" ON "_services_v" USING btree ("version_seo_og_image_id");
  CREATE INDEX "_services_v_version_version_updated_at_idx" ON "_services_v" USING btree ("version_updated_at");
  CREATE INDEX "_services_v_version_version_created_at_idx" ON "_services_v" USING btree ("version_created_at");
  CREATE INDEX "_services_v_version_version__status_idx" ON "_services_v" USING btree ("version__status");
  CREATE INDEX "_services_v_created_at_idx" ON "_services_v" USING btree ("created_at");
  CREATE INDEX "_services_v_updated_at_idx" ON "_services_v" USING btree ("updated_at");
  CREATE INDEX "_services_v_snapshot_idx" ON "_services_v" USING btree ("snapshot");
  CREATE INDEX "_services_v_published_locale_idx" ON "_services_v" USING btree ("published_locale");
  CREATE INDEX "_services_v_latest_idx" ON "_services_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_services_v_locales_locale_parent_id_unique" ON "_services_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "stories_logo_idx" ON "stories" USING btree ("logo_id");
  CREATE INDEX "stories_image_idx" ON "stories" USING btree ("image_id");
  CREATE INDEX "stories_updated_at_idx" ON "stories" USING btree ("updated_at");
  CREATE INDEX "stories_created_at_idx" ON "stories" USING btree ("created_at");
  CREATE INDEX "stories__status_idx" ON "stories" USING btree ("_status");
  CREATE UNIQUE INDEX "stories_locales_locale_parent_id_unique" ON "stories_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_stories_v_parent_idx" ON "_stories_v" USING btree ("parent_id");
  CREATE INDEX "_stories_v_version_version_logo_idx" ON "_stories_v" USING btree ("version_logo_id");
  CREATE INDEX "_stories_v_version_version_image_idx" ON "_stories_v" USING btree ("version_image_id");
  CREATE INDEX "_stories_v_version_version_updated_at_idx" ON "_stories_v" USING btree ("version_updated_at");
  CREATE INDEX "_stories_v_version_version_created_at_idx" ON "_stories_v" USING btree ("version_created_at");
  CREATE INDEX "_stories_v_version_version__status_idx" ON "_stories_v" USING btree ("version__status");
  CREATE INDEX "_stories_v_created_at_idx" ON "_stories_v" USING btree ("created_at");
  CREATE INDEX "_stories_v_updated_at_idx" ON "_stories_v" USING btree ("updated_at");
  CREATE INDEX "_stories_v_snapshot_idx" ON "_stories_v" USING btree ("snapshot");
  CREATE INDEX "_stories_v_published_locale_idx" ON "_stories_v" USING btree ("published_locale");
  CREATE INDEX "_stories_v_latest_idx" ON "_stories_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_stories_v_locales_locale_parent_id_unique" ON "_stories_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "logos_usage_context_order_idx" ON "logos_usage_context" USING btree ("order");
  CREATE INDEX "logos_usage_context_parent_idx" ON "logos_usage_context" USING btree ("parent_id");
  CREATE INDEX "logos_image_idx" ON "logos" USING btree ("image_id");
  CREATE INDEX "logos_updated_at_idx" ON "logos" USING btree ("updated_at");
  CREATE INDEX "logos_created_at_idx" ON "logos" USING btree ("created_at");
  CREATE UNIQUE INDEX "logos_locales_locale_parent_id_unique" ON "logos_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "faqs_answer_order_idx" ON "faqs_answer" USING btree ("_order");
  CREATE INDEX "faqs_answer_parent_id_idx" ON "faqs_answer" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "faqs_answer_locales_locale_parent_id_unique" ON "faqs_answer_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "faqs_updated_at_idx" ON "faqs" USING btree ("updated_at");
  CREATE INDEX "faqs_created_at_idx" ON "faqs" USING btree ("created_at");
  CREATE INDEX "faqs__status_idx" ON "faqs" USING btree ("_status");
  CREATE UNIQUE INDEX "faqs_locales_locale_parent_id_unique" ON "faqs_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "faqs_texts_order_parent" ON "faqs_texts" USING btree ("order","parent_id");
  CREATE INDEX "_faqs_v_version_answer_order_idx" ON "_faqs_v_version_answer" USING btree ("_order");
  CREATE INDEX "_faqs_v_version_answer_parent_id_idx" ON "_faqs_v_version_answer" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_faqs_v_version_answer_locales_locale_parent_id_unique" ON "_faqs_v_version_answer_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_faqs_v_parent_idx" ON "_faqs_v" USING btree ("parent_id");
  CREATE INDEX "_faqs_v_version_version_updated_at_idx" ON "_faqs_v" USING btree ("version_updated_at");
  CREATE INDEX "_faqs_v_version_version_created_at_idx" ON "_faqs_v" USING btree ("version_created_at");
  CREATE INDEX "_faqs_v_version_version__status_idx" ON "_faqs_v" USING btree ("version__status");
  CREATE INDEX "_faqs_v_created_at_idx" ON "_faqs_v" USING btree ("created_at");
  CREATE INDEX "_faqs_v_updated_at_idx" ON "_faqs_v" USING btree ("updated_at");
  CREATE INDEX "_faqs_v_snapshot_idx" ON "_faqs_v" USING btree ("snapshot");
  CREATE INDEX "_faqs_v_published_locale_idx" ON "_faqs_v" USING btree ("published_locale");
  CREATE INDEX "_faqs_v_latest_idx" ON "_faqs_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_faqs_v_locales_locale_parent_id_unique" ON "_faqs_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_faqs_v_texts_order_parent" ON "_faqs_v_texts" USING btree ("order","parent_id");
  CREATE UNIQUE INDEX "blog_posts_slug_idx" ON "blog_posts" USING btree ("slug");
  CREATE INDEX "blog_posts_hero_image_idx" ON "blog_posts" USING btree ("hero_image_id");
  CREATE INDEX "blog_posts_category_idx" ON "blog_posts" USING btree ("category_id");
  CREATE INDEX "blog_posts_author_author_avatar_idx" ON "blog_posts" USING btree ("author_avatar_id");
  CREATE INDEX "blog_posts_seo_seo_og_image_idx" ON "blog_posts" USING btree ("seo_og_image_id");
  CREATE INDEX "blog_posts_updated_at_idx" ON "blog_posts" USING btree ("updated_at");
  CREATE INDEX "blog_posts_created_at_idx" ON "blog_posts" USING btree ("created_at");
  CREATE INDEX "blog_posts__status_idx" ON "blog_posts" USING btree ("_status");
  CREATE UNIQUE INDEX "blog_posts_locales_locale_parent_id_unique" ON "blog_posts_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "blog_posts_texts_order_parent" ON "blog_posts_texts" USING btree ("order","parent_id");
  CREATE INDEX "_blog_posts_v_parent_idx" ON "_blog_posts_v" USING btree ("parent_id");
  CREATE INDEX "_blog_posts_v_version_version_slug_idx" ON "_blog_posts_v" USING btree ("version_slug");
  CREATE INDEX "_blog_posts_v_version_version_hero_image_idx" ON "_blog_posts_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_blog_posts_v_version_version_category_idx" ON "_blog_posts_v" USING btree ("version_category_id");
  CREATE INDEX "_blog_posts_v_version_author_version_author_avatar_idx" ON "_blog_posts_v" USING btree ("version_author_avatar_id");
  CREATE INDEX "_blog_posts_v_version_seo_version_seo_og_image_idx" ON "_blog_posts_v" USING btree ("version_seo_og_image_id");
  CREATE INDEX "_blog_posts_v_version_version_updated_at_idx" ON "_blog_posts_v" USING btree ("version_updated_at");
  CREATE INDEX "_blog_posts_v_version_version_created_at_idx" ON "_blog_posts_v" USING btree ("version_created_at");
  CREATE INDEX "_blog_posts_v_version_version__status_idx" ON "_blog_posts_v" USING btree ("version__status");
  CREATE INDEX "_blog_posts_v_created_at_idx" ON "_blog_posts_v" USING btree ("created_at");
  CREATE INDEX "_blog_posts_v_updated_at_idx" ON "_blog_posts_v" USING btree ("updated_at");
  CREATE INDEX "_blog_posts_v_snapshot_idx" ON "_blog_posts_v" USING btree ("snapshot");
  CREATE INDEX "_blog_posts_v_published_locale_idx" ON "_blog_posts_v" USING btree ("published_locale");
  CREATE INDEX "_blog_posts_v_latest_idx" ON "_blog_posts_v" USING btree ("latest");
  CREATE INDEX "_blog_posts_v_autosave_idx" ON "_blog_posts_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "_blog_posts_v_locales_locale_parent_id_unique" ON "_blog_posts_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_blog_posts_v_texts_order_parent" ON "_blog_posts_v_texts" USING btree ("order","parent_id");
  CREATE UNIQUE INDEX "blog_categories_slug_idx" ON "blog_categories" USING btree ("slug");
  CREATE INDEX "blog_categories_updated_at_idx" ON "blog_categories" USING btree ("updated_at");
  CREATE INDEX "blog_categories_created_at_idx" ON "blog_categories" USING btree ("created_at");
  CREATE UNIQUE INDEX "blog_categories_locales_locale_parent_id_unique" ON "blog_categories_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_services_id_idx" ON "payload_locked_documents_rels" USING btree ("services_id");
  CREATE INDEX "payload_locked_documents_rels_stories_id_idx" ON "payload_locked_documents_rels" USING btree ("stories_id");
  CREATE INDEX "payload_locked_documents_rels_logos_id_idx" ON "payload_locked_documents_rels" USING btree ("logos_id");
  CREATE INDEX "payload_locked_documents_rels_faqs_id_idx" ON "payload_locked_documents_rels" USING btree ("faqs_id");
  CREATE INDEX "payload_locked_documents_rels_blog_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("blog_posts_id");
  CREATE INDEX "payload_locked_documents_rels_blog_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("blog_categories_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "site_settings_contacts_address_order_idx" ON "site_settings_contacts_address" USING btree ("_order");
  CREATE INDEX "site_settings_contacts_address_parent_id_idx" ON "site_settings_contacts_address" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "site_settings_contacts_address_locales_locale_parent_id_uniq" ON "site_settings_contacts_address_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "site_settings_brand_brand_default_og_image_idx" ON "site_settings" USING btree ("brand_default_og_image_id");
  CREATE UNIQUE INDEX "site_settings_locales_locale_parent_id_unique" ON "site_settings_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "header_primary_nav_order_idx" ON "header_primary_nav" USING btree ("_order");
  CREATE INDEX "header_primary_nav_parent_id_idx" ON "header_primary_nav" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "header_primary_nav_locales_locale_parent_id_unique" ON "header_primary_nav_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "header_locales_locale_parent_id_unique" ON "header_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "footer_columns_links_order_idx" ON "footer_columns_links" USING btree ("_order");
  CREATE INDEX "footer_columns_links_parent_id_idx" ON "footer_columns_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "footer_columns_links_locales_locale_parent_id_unique" ON "footer_columns_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "footer_columns_order_idx" ON "footer_columns" USING btree ("_order");
  CREATE INDEX "footer_columns_parent_id_idx" ON "footer_columns" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "footer_columns_locales_locale_parent_id_unique" ON "footer_columns_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "footer_contact_address_order_idx" ON "footer_contact_address" USING btree ("_order");
  CREATE INDEX "footer_contact_address_parent_id_idx" ON "footer_contact_address" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "footer_contact_address_locales_locale_parent_id_unique" ON "footer_contact_address_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "footer_contact_links_order_idx" ON "footer_contact_links" USING btree ("_order");
  CREATE INDEX "footer_contact_links_parent_id_idx" ON "footer_contact_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "footer_contact_links_locales_locale_parent_id_unique" ON "footer_contact_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "footer_legal_links_order_idx" ON "footer_legal_links" USING btree ("_order");
  CREATE INDEX "footer_legal_links_parent_id_idx" ON "footer_legal_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "footer_legal_links_locales_locale_parent_id_unique" ON "footer_legal_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "footer_social_links_order_idx" ON "footer_social_links" USING btree ("_order");
  CREATE INDEX "footer_social_links_parent_id_idx" ON "footer_social_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "footer_social_links_locales_locale_parent_id_unique" ON "footer_social_links_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "footer_locales_locale_parent_id_unique" ON "footer_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_blocks_hero_primary_nav_order_idx" ON "home_blocks_hero_primary_nav" USING btree ("_order");
  CREATE INDEX "home_blocks_hero_primary_nav_parent_id_idx" ON "home_blocks_hero_primary_nav" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "home_blocks_hero_primary_nav_locales_locale_parent_id_unique" ON "home_blocks_hero_primary_nav_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_blocks_hero_order_idx" ON "home_blocks_hero" USING btree ("_order");
  CREATE INDEX "home_blocks_hero_parent_id_idx" ON "home_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_hero_path_idx" ON "home_blocks_hero" USING btree ("_path");
  CREATE UNIQUE INDEX "home_blocks_hero_locales_locale_parent_id_unique" ON "home_blocks_hero_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_blocks_services_carousel_title_words_order_idx" ON "home_blocks_services_carousel_title_words" USING btree ("_order");
  CREATE INDEX "home_blocks_services_carousel_title_words_parent_id_idx" ON "home_blocks_services_carousel_title_words" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "home_blocks_services_carousel_title_words_locales_locale_par" ON "home_blocks_services_carousel_title_words_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_blocks_services_carousel_order_idx" ON "home_blocks_services_carousel" USING btree ("_order");
  CREATE INDEX "home_blocks_services_carousel_parent_id_idx" ON "home_blocks_services_carousel" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_services_carousel_path_idx" ON "home_blocks_services_carousel" USING btree ("_path");
  CREATE UNIQUE INDEX "home_blocks_services_carousel_locales_locale_parent_id_uniqu" ON "home_blocks_services_carousel_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_blocks_photo_card_order_idx" ON "home_blocks_photo_card" USING btree ("_order");
  CREATE INDEX "home_blocks_photo_card_parent_id_idx" ON "home_blocks_photo_card" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_photo_card_path_idx" ON "home_blocks_photo_card" USING btree ("_path");
  CREATE INDEX "home_blocks_photo_card_image_idx" ON "home_blocks_photo_card" USING btree ("image_id");
  CREATE UNIQUE INDEX "home_blocks_photo_card_locales_locale_parent_id_unique" ON "home_blocks_photo_card_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_blocks_clock_card_order_idx" ON "home_blocks_clock_card" USING btree ("_order");
  CREATE INDEX "home_blocks_clock_card_parent_id_idx" ON "home_blocks_clock_card" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_clock_card_path_idx" ON "home_blocks_clock_card" USING btree ("_path");
  CREATE UNIQUE INDEX "home_blocks_clock_card_locales_locale_parent_id_unique" ON "home_blocks_clock_card_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_blocks_specialties_card_boxes_order_idx" ON "home_blocks_specialties_card_boxes" USING btree ("_order");
  CREATE INDEX "home_blocks_specialties_card_boxes_parent_id_idx" ON "home_blocks_specialties_card_boxes" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "home_blocks_specialties_card_boxes_locales_locale_parent_id_" ON "home_blocks_specialties_card_boxes_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_blocks_specialties_card_order_idx" ON "home_blocks_specialties_card" USING btree ("_order");
  CREATE INDEX "home_blocks_specialties_card_parent_id_idx" ON "home_blocks_specialties_card" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_specialties_card_path_idx" ON "home_blocks_specialties_card" USING btree ("_path");
  CREATE UNIQUE INDEX "home_blocks_specialties_card_locales_locale_parent_id_unique" ON "home_blocks_specialties_card_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_blocks_studies_card_order_idx" ON "home_blocks_studies_card" USING btree ("_order");
  CREATE INDEX "home_blocks_studies_card_parent_id_idx" ON "home_blocks_studies_card" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_studies_card_path_idx" ON "home_blocks_studies_card" USING btree ("_path");
  CREATE INDEX "home_blocks_studies_card_image_idx" ON "home_blocks_studies_card" USING btree ("image_id");
  CREATE UNIQUE INDEX "home_blocks_studies_card_locales_locale_parent_id_unique" ON "home_blocks_studies_card_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_blocks_plain_card_order_idx" ON "home_blocks_plain_card" USING btree ("_order");
  CREATE INDEX "home_blocks_plain_card_parent_id_idx" ON "home_blocks_plain_card" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_plain_card_path_idx" ON "home_blocks_plain_card" USING btree ("_path");
  CREATE UNIQUE INDEX "home_blocks_plain_card_locales_locale_parent_id_unique" ON "home_blocks_plain_card_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_blocks_proof_bento_columns_order_idx" ON "home_blocks_proof_bento_columns" USING btree ("_order");
  CREATE INDEX "home_blocks_proof_bento_columns_parent_id_idx" ON "home_blocks_proof_bento_columns" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_proof_bento_order_idx" ON "home_blocks_proof_bento" USING btree ("_order");
  CREATE INDEX "home_blocks_proof_bento_parent_id_idx" ON "home_blocks_proof_bento" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_proof_bento_path_idx" ON "home_blocks_proof_bento" USING btree ("_path");
  CREATE UNIQUE INDEX "home_blocks_proof_bento_locales_locale_parent_id_unique" ON "home_blocks_proof_bento_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_blocks_featured_media_order_idx" ON "home_blocks_featured_media" USING btree ("_order");
  CREATE INDEX "home_blocks_featured_media_parent_id_idx" ON "home_blocks_featured_media" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_featured_media_path_idx" ON "home_blocks_featured_media" USING btree ("_path");
  CREATE UNIQUE INDEX "home_blocks_featured_media_locales_locale_parent_id_unique" ON "home_blocks_featured_media_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_blocks_operating_system_title_words_order_idx" ON "home_blocks_operating_system_title_words" USING btree ("_order");
  CREATE INDEX "home_blocks_operating_system_title_words_parent_id_idx" ON "home_blocks_operating_system_title_words" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "home_blocks_operating_system_title_words_locales_locale_pare" ON "home_blocks_operating_system_title_words_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_blocks_operating_system_tabs_order_idx" ON "home_blocks_operating_system_tabs" USING btree ("_order");
  CREATE INDEX "home_blocks_operating_system_tabs_parent_id_idx" ON "home_blocks_operating_system_tabs" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_operating_system_tabs_image_idx" ON "home_blocks_operating_system_tabs" USING btree ("image_id");
  CREATE UNIQUE INDEX "home_blocks_operating_system_tabs_locales_locale_parent_id_u" ON "home_blocks_operating_system_tabs_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_blocks_operating_system_order_idx" ON "home_blocks_operating_system" USING btree ("_order");
  CREATE INDEX "home_blocks_operating_system_parent_id_idx" ON "home_blocks_operating_system" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_operating_system_path_idx" ON "home_blocks_operating_system" USING btree ("_path");
  CREATE UNIQUE INDEX "home_blocks_operating_system_locales_locale_parent_id_unique" ON "home_blocks_operating_system_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_blocks_service_system_slider_layers_features_order_idx" ON "home_blocks_service_system_slider_layers_features" USING btree ("_order");
  CREATE INDEX "home_blocks_service_system_slider_layers_features_parent_id_idx" ON "home_blocks_service_system_slider_layers_features" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "home_blocks_service_system_slider_layers_features_locales_lo" ON "home_blocks_service_system_slider_layers_features_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_blocks_service_system_slider_layers_order_idx" ON "home_blocks_service_system_slider_layers" USING btree ("_order");
  CREATE INDEX "home_blocks_service_system_slider_layers_parent_id_idx" ON "home_blocks_service_system_slider_layers" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_service_system_slider_layers_image_idx" ON "home_blocks_service_system_slider_layers" USING btree ("image_id");
  CREATE UNIQUE INDEX "home_blocks_service_system_slider_layers_locales_locale_pare" ON "home_blocks_service_system_slider_layers_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_blocks_service_system_slider_order_idx" ON "home_blocks_service_system_slider" USING btree ("_order");
  CREATE INDEX "home_blocks_service_system_slider_parent_id_idx" ON "home_blocks_service_system_slider" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_service_system_slider_path_idx" ON "home_blocks_service_system_slider" USING btree ("_path");
  CREATE UNIQUE INDEX "home_blocks_service_system_slider_locales_locale_parent_id_u" ON "home_blocks_service_system_slider_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_blocks_profiler_labels_program_a_recommendations_order_idx" ON "home_blocks_profiler_labels_program_a_recommendations" USING btree ("_order");
  CREATE INDEX "home_blocks_profiler_labels_program_a_recommendations_parent_id_idx" ON "home_blocks_profiler_labels_program_a_recommendations" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "home_blocks_profiler_labels_program_a_recommendations_locale" ON "home_blocks_profiler_labels_program_a_recommendations_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_blocks_profiler_labels_program_b_recommendations_order_idx" ON "home_blocks_profiler_labels_program_b_recommendations" USING btree ("_order");
  CREATE INDEX "home_blocks_profiler_labels_program_b_recommendations_parent_id_idx" ON "home_blocks_profiler_labels_program_b_recommendations" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "home_blocks_profiler_labels_program_b_recommendations_locale" ON "home_blocks_profiler_labels_program_b_recommendations_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_blocks_profiler_labels_program_c_recommendations_order_idx" ON "home_blocks_profiler_labels_program_c_recommendations" USING btree ("_order");
  CREATE INDEX "home_blocks_profiler_labels_program_c_recommendations_parent_id_idx" ON "home_blocks_profiler_labels_program_c_recommendations" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "home_blocks_profiler_labels_program_c_recommendations_locale" ON "home_blocks_profiler_labels_program_c_recommendations_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_blocks_profiler_volume_options_order_idx" ON "home_blocks_profiler_volume_options" USING btree ("_order");
  CREATE INDEX "home_blocks_profiler_volume_options_parent_id_idx" ON "home_blocks_profiler_volume_options" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "home_blocks_profiler_volume_options_locales_locale_parent_id" ON "home_blocks_profiler_volume_options_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_blocks_profiler_jobs_order_idx" ON "home_blocks_profiler_jobs" USING btree ("_order");
  CREATE INDEX "home_blocks_profiler_jobs_parent_id_idx" ON "home_blocks_profiler_jobs" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "home_blocks_profiler_jobs_locales_locale_parent_id_unique" ON "home_blocks_profiler_jobs_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_blocks_profiler_needs_order_idx" ON "home_blocks_profiler_needs" USING btree ("_order");
  CREATE INDEX "home_blocks_profiler_needs_parent_id_idx" ON "home_blocks_profiler_needs" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "home_blocks_profiler_needs_locales_locale_parent_id_unique" ON "home_blocks_profiler_needs_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_blocks_profiler_order_idx" ON "home_blocks_profiler" USING btree ("_order");
  CREATE INDEX "home_blocks_profiler_parent_id_idx" ON "home_blocks_profiler" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_profiler_path_idx" ON "home_blocks_profiler" USING btree ("_path");
  CREATE UNIQUE INDEX "home_blocks_profiler_locales_locale_parent_id_unique" ON "home_blocks_profiler_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_blocks_stories_title_words_order_idx" ON "home_blocks_stories_title_words" USING btree ("_order");
  CREATE INDEX "home_blocks_stories_title_words_parent_id_idx" ON "home_blocks_stories_title_words" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "home_blocks_stories_title_words_locales_locale_parent_id_uni" ON "home_blocks_stories_title_words_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_blocks_stories_order_idx" ON "home_blocks_stories" USING btree ("_order");
  CREATE INDEX "home_blocks_stories_parent_id_idx" ON "home_blocks_stories" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_stories_path_idx" ON "home_blocks_stories" USING btree ("_path");
  CREATE UNIQUE INDEX "home_blocks_stories_locales_locale_parent_id_unique" ON "home_blocks_stories_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_blocks_faq_order_idx" ON "home_blocks_faq" USING btree ("_order");
  CREATE INDEX "home_blocks_faq_parent_id_idx" ON "home_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_faq_path_idx" ON "home_blocks_faq" USING btree ("_path");
  CREATE UNIQUE INDEX "home_blocks_faq_locales_locale_parent_id_unique" ON "home_blocks_faq_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_blocks_cta_order_idx" ON "home_blocks_cta" USING btree ("_order");
  CREATE INDEX "home_blocks_cta_parent_id_idx" ON "home_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_cta_path_idx" ON "home_blocks_cta" USING btree ("_path");
  CREATE INDEX "home_blocks_cta_background_idx" ON "home_blocks_cta" USING btree ("background_id");
  CREATE UNIQUE INDEX "home_blocks_cta_locales_locale_parent_id_unique" ON "home_blocks_cta_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_meta_meta_og_image_idx" ON "home" USING btree ("meta_og_image_id");
  CREATE INDEX "home_seo_seo_og_image_idx" ON "home" USING btree ("seo_og_image_id");
  CREATE INDEX "home__status_idx" ON "home" USING btree ("_status");
  CREATE UNIQUE INDEX "home_locales_locale_parent_id_unique" ON "home_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_rels_order_idx" ON "home_rels" USING btree ("order");
  CREATE INDEX "home_rels_parent_idx" ON "home_rels" USING btree ("parent_id");
  CREATE INDEX "home_rels_path_idx" ON "home_rels" USING btree ("path");
  CREATE INDEX "home_rels_logos_id_idx" ON "home_rels" USING btree ("logos_id");
  CREATE INDEX "home_rels_services_id_idx" ON "home_rels" USING btree ("services_id");
  CREATE INDEX "home_rels_stories_id_idx" ON "home_rels" USING btree ("stories_id");
  CREATE INDEX "home_rels_faqs_id_idx" ON "home_rels" USING btree ("faqs_id");
  CREATE INDEX "_home_v_blocks_hero_primary_nav_order_idx" ON "_home_v_blocks_hero_primary_nav" USING btree ("_order");
  CREATE INDEX "_home_v_blocks_hero_primary_nav_parent_id_idx" ON "_home_v_blocks_hero_primary_nav" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_home_v_blocks_hero_primary_nav_locales_locale_parent_id_uni" ON "_home_v_blocks_hero_primary_nav_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_home_v_blocks_hero_order_idx" ON "_home_v_blocks_hero" USING btree ("_order");
  CREATE INDEX "_home_v_blocks_hero_parent_id_idx" ON "_home_v_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "_home_v_blocks_hero_path_idx" ON "_home_v_blocks_hero" USING btree ("_path");
  CREATE UNIQUE INDEX "_home_v_blocks_hero_locales_locale_parent_id_unique" ON "_home_v_blocks_hero_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_home_v_blocks_services_carousel_title_words_order_idx" ON "_home_v_blocks_services_carousel_title_words" USING btree ("_order");
  CREATE INDEX "_home_v_blocks_services_carousel_title_words_parent_id_idx" ON "_home_v_blocks_services_carousel_title_words" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_home_v_blocks_services_carousel_title_words_locales_locale_" ON "_home_v_blocks_services_carousel_title_words_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_home_v_blocks_services_carousel_order_idx" ON "_home_v_blocks_services_carousel" USING btree ("_order");
  CREATE INDEX "_home_v_blocks_services_carousel_parent_id_idx" ON "_home_v_blocks_services_carousel" USING btree ("_parent_id");
  CREATE INDEX "_home_v_blocks_services_carousel_path_idx" ON "_home_v_blocks_services_carousel" USING btree ("_path");
  CREATE UNIQUE INDEX "_home_v_blocks_services_carousel_locales_locale_parent_id_un" ON "_home_v_blocks_services_carousel_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_home_v_blocks_photo_card_order_idx" ON "_home_v_blocks_photo_card" USING btree ("_order");
  CREATE INDEX "_home_v_blocks_photo_card_parent_id_idx" ON "_home_v_blocks_photo_card" USING btree ("_parent_id");
  CREATE INDEX "_home_v_blocks_photo_card_path_idx" ON "_home_v_blocks_photo_card" USING btree ("_path");
  CREATE INDEX "_home_v_blocks_photo_card_image_idx" ON "_home_v_blocks_photo_card" USING btree ("image_id");
  CREATE UNIQUE INDEX "_home_v_blocks_photo_card_locales_locale_parent_id_unique" ON "_home_v_blocks_photo_card_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_home_v_blocks_clock_card_order_idx" ON "_home_v_blocks_clock_card" USING btree ("_order");
  CREATE INDEX "_home_v_blocks_clock_card_parent_id_idx" ON "_home_v_blocks_clock_card" USING btree ("_parent_id");
  CREATE INDEX "_home_v_blocks_clock_card_path_idx" ON "_home_v_blocks_clock_card" USING btree ("_path");
  CREATE UNIQUE INDEX "_home_v_blocks_clock_card_locales_locale_parent_id_unique" ON "_home_v_blocks_clock_card_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_home_v_blocks_specialties_card_boxes_order_idx" ON "_home_v_blocks_specialties_card_boxes" USING btree ("_order");
  CREATE INDEX "_home_v_blocks_specialties_card_boxes_parent_id_idx" ON "_home_v_blocks_specialties_card_boxes" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_home_v_blocks_specialties_card_boxes_locales_locale_parent_" ON "_home_v_blocks_specialties_card_boxes_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_home_v_blocks_specialties_card_order_idx" ON "_home_v_blocks_specialties_card" USING btree ("_order");
  CREATE INDEX "_home_v_blocks_specialties_card_parent_id_idx" ON "_home_v_blocks_specialties_card" USING btree ("_parent_id");
  CREATE INDEX "_home_v_blocks_specialties_card_path_idx" ON "_home_v_blocks_specialties_card" USING btree ("_path");
  CREATE UNIQUE INDEX "_home_v_blocks_specialties_card_locales_locale_parent_id_uni" ON "_home_v_blocks_specialties_card_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_home_v_blocks_studies_card_order_idx" ON "_home_v_blocks_studies_card" USING btree ("_order");
  CREATE INDEX "_home_v_blocks_studies_card_parent_id_idx" ON "_home_v_blocks_studies_card" USING btree ("_parent_id");
  CREATE INDEX "_home_v_blocks_studies_card_path_idx" ON "_home_v_blocks_studies_card" USING btree ("_path");
  CREATE INDEX "_home_v_blocks_studies_card_image_idx" ON "_home_v_blocks_studies_card" USING btree ("image_id");
  CREATE UNIQUE INDEX "_home_v_blocks_studies_card_locales_locale_parent_id_unique" ON "_home_v_blocks_studies_card_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_home_v_blocks_plain_card_order_idx" ON "_home_v_blocks_plain_card" USING btree ("_order");
  CREATE INDEX "_home_v_blocks_plain_card_parent_id_idx" ON "_home_v_blocks_plain_card" USING btree ("_parent_id");
  CREATE INDEX "_home_v_blocks_plain_card_path_idx" ON "_home_v_blocks_plain_card" USING btree ("_path");
  CREATE UNIQUE INDEX "_home_v_blocks_plain_card_locales_locale_parent_id_unique" ON "_home_v_blocks_plain_card_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_home_v_blocks_proof_bento_columns_order_idx" ON "_home_v_blocks_proof_bento_columns" USING btree ("_order");
  CREATE INDEX "_home_v_blocks_proof_bento_columns_parent_id_idx" ON "_home_v_blocks_proof_bento_columns" USING btree ("_parent_id");
  CREATE INDEX "_home_v_blocks_proof_bento_order_idx" ON "_home_v_blocks_proof_bento" USING btree ("_order");
  CREATE INDEX "_home_v_blocks_proof_bento_parent_id_idx" ON "_home_v_blocks_proof_bento" USING btree ("_parent_id");
  CREATE INDEX "_home_v_blocks_proof_bento_path_idx" ON "_home_v_blocks_proof_bento" USING btree ("_path");
  CREATE UNIQUE INDEX "_home_v_blocks_proof_bento_locales_locale_parent_id_unique" ON "_home_v_blocks_proof_bento_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_home_v_blocks_featured_media_order_idx" ON "_home_v_blocks_featured_media" USING btree ("_order");
  CREATE INDEX "_home_v_blocks_featured_media_parent_id_idx" ON "_home_v_blocks_featured_media" USING btree ("_parent_id");
  CREATE INDEX "_home_v_blocks_featured_media_path_idx" ON "_home_v_blocks_featured_media" USING btree ("_path");
  CREATE UNIQUE INDEX "_home_v_blocks_featured_media_locales_locale_parent_id_uniqu" ON "_home_v_blocks_featured_media_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_home_v_blocks_operating_system_title_words_order_idx" ON "_home_v_blocks_operating_system_title_words" USING btree ("_order");
  CREATE INDEX "_home_v_blocks_operating_system_title_words_parent_id_idx" ON "_home_v_blocks_operating_system_title_words" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_home_v_blocks_operating_system_title_words_locales_locale_p" ON "_home_v_blocks_operating_system_title_words_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_home_v_blocks_operating_system_tabs_order_idx" ON "_home_v_blocks_operating_system_tabs" USING btree ("_order");
  CREATE INDEX "_home_v_blocks_operating_system_tabs_parent_id_idx" ON "_home_v_blocks_operating_system_tabs" USING btree ("_parent_id");
  CREATE INDEX "_home_v_blocks_operating_system_tabs_image_idx" ON "_home_v_blocks_operating_system_tabs" USING btree ("image_id");
  CREATE UNIQUE INDEX "_home_v_blocks_operating_system_tabs_locales_locale_parent_i" ON "_home_v_blocks_operating_system_tabs_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_home_v_blocks_operating_system_order_idx" ON "_home_v_blocks_operating_system" USING btree ("_order");
  CREATE INDEX "_home_v_blocks_operating_system_parent_id_idx" ON "_home_v_blocks_operating_system" USING btree ("_parent_id");
  CREATE INDEX "_home_v_blocks_operating_system_path_idx" ON "_home_v_blocks_operating_system" USING btree ("_path");
  CREATE UNIQUE INDEX "_home_v_blocks_operating_system_locales_locale_parent_id_uni" ON "_home_v_blocks_operating_system_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_home_v_blocks_service_system_slider_layers_features_order_idx" ON "_home_v_blocks_service_system_slider_layers_features" USING btree ("_order");
  CREATE INDEX "_home_v_blocks_service_system_slider_layers_features_parent_id_idx" ON "_home_v_blocks_service_system_slider_layers_features" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_home_v_blocks_service_system_slider_layers_features_local_1" ON "_home_v_blocks_service_system_slider_layers_features_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_home_v_blocks_service_system_slider_layers_order_idx" ON "_home_v_blocks_service_system_slider_layers" USING btree ("_order");
  CREATE INDEX "_home_v_blocks_service_system_slider_layers_parent_id_idx" ON "_home_v_blocks_service_system_slider_layers" USING btree ("_parent_id");
  CREATE INDEX "_home_v_blocks_service_system_slider_layers_image_idx" ON "_home_v_blocks_service_system_slider_layers" USING btree ("image_id");
  CREATE UNIQUE INDEX "_home_v_blocks_service_system_slider_layers_locales_locale_p" ON "_home_v_blocks_service_system_slider_layers_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_home_v_blocks_service_system_slider_order_idx" ON "_home_v_blocks_service_system_slider" USING btree ("_order");
  CREATE INDEX "_home_v_blocks_service_system_slider_parent_id_idx" ON "_home_v_blocks_service_system_slider" USING btree ("_parent_id");
  CREATE INDEX "_home_v_blocks_service_system_slider_path_idx" ON "_home_v_blocks_service_system_slider" USING btree ("_path");
  CREATE UNIQUE INDEX "_home_v_blocks_service_system_slider_locales_locale_parent_i" ON "_home_v_blocks_service_system_slider_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_home_v_blocks_profiler_labels_program_a_recommendations_order_idx" ON "_home_v_blocks_profiler_labels_program_a_recommendations" USING btree ("_order");
  CREATE INDEX "_home_v_blocks_profiler_labels_program_a_recommendations_parent_id_idx" ON "_home_v_blocks_profiler_labels_program_a_recommendations" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_home_v_blocks_profiler_labels_program_a_recommendations_loc" ON "_home_v_blocks_profiler_labels_program_a_recommendations_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_home_v_blocks_profiler_labels_program_b_recommendations_order_idx" ON "_home_v_blocks_profiler_labels_program_b_recommendations" USING btree ("_order");
  CREATE INDEX "_home_v_blocks_profiler_labels_program_b_recommendations_parent_id_idx" ON "_home_v_blocks_profiler_labels_program_b_recommendations" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_home_v_blocks_profiler_labels_program_b_recommendations_loc" ON "_home_v_blocks_profiler_labels_program_b_recommendations_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_home_v_blocks_profiler_labels_program_c_recommendations_order_idx" ON "_home_v_blocks_profiler_labels_program_c_recommendations" USING btree ("_order");
  CREATE INDEX "_home_v_blocks_profiler_labels_program_c_recommendations_parent_id_idx" ON "_home_v_blocks_profiler_labels_program_c_recommendations" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_home_v_blocks_profiler_labels_program_c_recommendations_loc" ON "_home_v_blocks_profiler_labels_program_c_recommendations_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_home_v_blocks_profiler_volume_options_order_idx" ON "_home_v_blocks_profiler_volume_options" USING btree ("_order");
  CREATE INDEX "_home_v_blocks_profiler_volume_options_parent_id_idx" ON "_home_v_blocks_profiler_volume_options" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_home_v_blocks_profiler_volume_options_locales_locale_parent" ON "_home_v_blocks_profiler_volume_options_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_home_v_blocks_profiler_jobs_order_idx" ON "_home_v_blocks_profiler_jobs" USING btree ("_order");
  CREATE INDEX "_home_v_blocks_profiler_jobs_parent_id_idx" ON "_home_v_blocks_profiler_jobs" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_home_v_blocks_profiler_jobs_locales_locale_parent_id_unique" ON "_home_v_blocks_profiler_jobs_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_home_v_blocks_profiler_needs_order_idx" ON "_home_v_blocks_profiler_needs" USING btree ("_order");
  CREATE INDEX "_home_v_blocks_profiler_needs_parent_id_idx" ON "_home_v_blocks_profiler_needs" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_home_v_blocks_profiler_needs_locales_locale_parent_id_uniqu" ON "_home_v_blocks_profiler_needs_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_home_v_blocks_profiler_order_idx" ON "_home_v_blocks_profiler" USING btree ("_order");
  CREATE INDEX "_home_v_blocks_profiler_parent_id_idx" ON "_home_v_blocks_profiler" USING btree ("_parent_id");
  CREATE INDEX "_home_v_blocks_profiler_path_idx" ON "_home_v_blocks_profiler" USING btree ("_path");
  CREATE UNIQUE INDEX "_home_v_blocks_profiler_locales_locale_parent_id_unique" ON "_home_v_blocks_profiler_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_home_v_blocks_stories_title_words_order_idx" ON "_home_v_blocks_stories_title_words" USING btree ("_order");
  CREATE INDEX "_home_v_blocks_stories_title_words_parent_id_idx" ON "_home_v_blocks_stories_title_words" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_home_v_blocks_stories_title_words_locales_locale_parent_id_" ON "_home_v_blocks_stories_title_words_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_home_v_blocks_stories_order_idx" ON "_home_v_blocks_stories" USING btree ("_order");
  CREATE INDEX "_home_v_blocks_stories_parent_id_idx" ON "_home_v_blocks_stories" USING btree ("_parent_id");
  CREATE INDEX "_home_v_blocks_stories_path_idx" ON "_home_v_blocks_stories" USING btree ("_path");
  CREATE UNIQUE INDEX "_home_v_blocks_stories_locales_locale_parent_id_unique" ON "_home_v_blocks_stories_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_home_v_blocks_faq_order_idx" ON "_home_v_blocks_faq" USING btree ("_order");
  CREATE INDEX "_home_v_blocks_faq_parent_id_idx" ON "_home_v_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "_home_v_blocks_faq_path_idx" ON "_home_v_blocks_faq" USING btree ("_path");
  CREATE UNIQUE INDEX "_home_v_blocks_faq_locales_locale_parent_id_unique" ON "_home_v_blocks_faq_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_home_v_blocks_cta_order_idx" ON "_home_v_blocks_cta" USING btree ("_order");
  CREATE INDEX "_home_v_blocks_cta_parent_id_idx" ON "_home_v_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "_home_v_blocks_cta_path_idx" ON "_home_v_blocks_cta" USING btree ("_path");
  CREATE INDEX "_home_v_blocks_cta_background_idx" ON "_home_v_blocks_cta" USING btree ("background_id");
  CREATE UNIQUE INDEX "_home_v_blocks_cta_locales_locale_parent_id_unique" ON "_home_v_blocks_cta_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_home_v_version_meta_version_meta_og_image_idx" ON "_home_v" USING btree ("version_meta_og_image_id");
  CREATE INDEX "_home_v_version_seo_version_seo_og_image_idx" ON "_home_v" USING btree ("version_seo_og_image_id");
  CREATE INDEX "_home_v_version_version__status_idx" ON "_home_v" USING btree ("version__status");
  CREATE INDEX "_home_v_created_at_idx" ON "_home_v" USING btree ("created_at");
  CREATE INDEX "_home_v_updated_at_idx" ON "_home_v" USING btree ("updated_at");
  CREATE INDEX "_home_v_snapshot_idx" ON "_home_v" USING btree ("snapshot");
  CREATE INDEX "_home_v_published_locale_idx" ON "_home_v" USING btree ("published_locale");
  CREATE INDEX "_home_v_latest_idx" ON "_home_v" USING btree ("latest");
  CREATE INDEX "_home_v_autosave_idx" ON "_home_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "_home_v_locales_locale_parent_id_unique" ON "_home_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_home_v_rels_order_idx" ON "_home_v_rels" USING btree ("order");
  CREATE INDEX "_home_v_rels_parent_idx" ON "_home_v_rels" USING btree ("parent_id");
  CREATE INDEX "_home_v_rels_path_idx" ON "_home_v_rels" USING btree ("path");
  CREATE INDEX "_home_v_rels_logos_id_idx" ON "_home_v_rels" USING btree ("logos_id");
  CREATE INDEX "_home_v_rels_services_id_idx" ON "_home_v_rels" USING btree ("services_id");
  CREATE INDEX "_home_v_rels_stories_id_idx" ON "_home_v_rels" USING btree ("stories_id");
  CREATE INDEX "_home_v_rels_faqs_id_idx" ON "_home_v_rels" USING btree ("faqs_id");
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
  CREATE UNIQUE INDEX "_billing_page_v_locales_locale_parent_id_unique" ON "_billing_page_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "privacy_notice_seo_seo_og_image_idx" ON "privacy_notice" USING btree ("seo_og_image_id");
  CREATE INDEX "privacy_notice__status_idx" ON "privacy_notice" USING btree ("_status");
  CREATE UNIQUE INDEX "privacy_notice_locales_locale_parent_id_unique" ON "privacy_notice_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_privacy_notice_v_version_seo_version_seo_og_image_idx" ON "_privacy_notice_v" USING btree ("version_seo_og_image_id");
  CREATE INDEX "_privacy_notice_v_version_version__status_idx" ON "_privacy_notice_v" USING btree ("version__status");
  CREATE INDEX "_privacy_notice_v_created_at_idx" ON "_privacy_notice_v" USING btree ("created_at");
  CREATE INDEX "_privacy_notice_v_updated_at_idx" ON "_privacy_notice_v" USING btree ("updated_at");
  CREATE INDEX "_privacy_notice_v_snapshot_idx" ON "_privacy_notice_v" USING btree ("snapshot");
  CREATE INDEX "_privacy_notice_v_published_locale_idx" ON "_privacy_notice_v" USING btree ("published_locale");
  CREATE INDEX "_privacy_notice_v_latest_idx" ON "_privacy_notice_v" USING btree ("latest");
  CREATE INDEX "_privacy_notice_v_autosave_idx" ON "_privacy_notice_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "_privacy_notice_v_locales_locale_parent_id_unique" ON "_privacy_notice_v_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "media_locales" CASCADE;
  DROP TABLE "services" CASCADE;
  DROP TABLE "services_locales" CASCADE;
  DROP TABLE "_services_v" CASCADE;
  DROP TABLE "_services_v_locales" CASCADE;
  DROP TABLE "stories" CASCADE;
  DROP TABLE "stories_locales" CASCADE;
  DROP TABLE "_stories_v" CASCADE;
  DROP TABLE "_stories_v_locales" CASCADE;
  DROP TABLE "logos_usage_context" CASCADE;
  DROP TABLE "logos" CASCADE;
  DROP TABLE "logos_locales" CASCADE;
  DROP TABLE "faqs_answer" CASCADE;
  DROP TABLE "faqs_answer_locales" CASCADE;
  DROP TABLE "faqs" CASCADE;
  DROP TABLE "faqs_locales" CASCADE;
  DROP TABLE "faqs_texts" CASCADE;
  DROP TABLE "_faqs_v_version_answer" CASCADE;
  DROP TABLE "_faqs_v_version_answer_locales" CASCADE;
  DROP TABLE "_faqs_v" CASCADE;
  DROP TABLE "_faqs_v_locales" CASCADE;
  DROP TABLE "_faqs_v_texts" CASCADE;
  DROP TABLE "blog_posts" CASCADE;
  DROP TABLE "blog_posts_locales" CASCADE;
  DROP TABLE "blog_posts_texts" CASCADE;
  DROP TABLE "_blog_posts_v" CASCADE;
  DROP TABLE "_blog_posts_v_locales" CASCADE;
  DROP TABLE "_blog_posts_v_texts" CASCADE;
  DROP TABLE "blog_categories" CASCADE;
  DROP TABLE "blog_categories_locales" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "site_settings_contacts_address" CASCADE;
  DROP TABLE "site_settings_contacts_address_locales" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "site_settings_locales" CASCADE;
  DROP TABLE "header_primary_nav" CASCADE;
  DROP TABLE "header_primary_nav_locales" CASCADE;
  DROP TABLE "header" CASCADE;
  DROP TABLE "header_locales" CASCADE;
  DROP TABLE "footer_columns_links" CASCADE;
  DROP TABLE "footer_columns_links_locales" CASCADE;
  DROP TABLE "footer_columns" CASCADE;
  DROP TABLE "footer_columns_locales" CASCADE;
  DROP TABLE "footer_contact_address" CASCADE;
  DROP TABLE "footer_contact_address_locales" CASCADE;
  DROP TABLE "footer_contact_links" CASCADE;
  DROP TABLE "footer_contact_links_locales" CASCADE;
  DROP TABLE "footer_legal_links" CASCADE;
  DROP TABLE "footer_legal_links_locales" CASCADE;
  DROP TABLE "footer_social_links" CASCADE;
  DROP TABLE "footer_social_links_locales" CASCADE;
  DROP TABLE "footer" CASCADE;
  DROP TABLE "footer_locales" CASCADE;
  DROP TABLE "home_blocks_hero_primary_nav" CASCADE;
  DROP TABLE "home_blocks_hero_primary_nav_locales" CASCADE;
  DROP TABLE "home_blocks_hero" CASCADE;
  DROP TABLE "home_blocks_hero_locales" CASCADE;
  DROP TABLE "home_blocks_services_carousel_title_words" CASCADE;
  DROP TABLE "home_blocks_services_carousel_title_words_locales" CASCADE;
  DROP TABLE "home_blocks_services_carousel" CASCADE;
  DROP TABLE "home_blocks_services_carousel_locales" CASCADE;
  DROP TABLE "home_blocks_photo_card" CASCADE;
  DROP TABLE "home_blocks_photo_card_locales" CASCADE;
  DROP TABLE "home_blocks_clock_card" CASCADE;
  DROP TABLE "home_blocks_clock_card_locales" CASCADE;
  DROP TABLE "home_blocks_specialties_card_boxes" CASCADE;
  DROP TABLE "home_blocks_specialties_card_boxes_locales" CASCADE;
  DROP TABLE "home_blocks_specialties_card" CASCADE;
  DROP TABLE "home_blocks_specialties_card_locales" CASCADE;
  DROP TABLE "home_blocks_studies_card" CASCADE;
  DROP TABLE "home_blocks_studies_card_locales" CASCADE;
  DROP TABLE "home_blocks_plain_card" CASCADE;
  DROP TABLE "home_blocks_plain_card_locales" CASCADE;
  DROP TABLE "home_blocks_proof_bento_columns" CASCADE;
  DROP TABLE "home_blocks_proof_bento" CASCADE;
  DROP TABLE "home_blocks_proof_bento_locales" CASCADE;
  DROP TABLE "home_blocks_featured_media" CASCADE;
  DROP TABLE "home_blocks_featured_media_locales" CASCADE;
  DROP TABLE "home_blocks_operating_system_title_words" CASCADE;
  DROP TABLE "home_blocks_operating_system_title_words_locales" CASCADE;
  DROP TABLE "home_blocks_operating_system_tabs" CASCADE;
  DROP TABLE "home_blocks_operating_system_tabs_locales" CASCADE;
  DROP TABLE "home_blocks_operating_system" CASCADE;
  DROP TABLE "home_blocks_operating_system_locales" CASCADE;
  DROP TABLE "home_blocks_service_system_slider_layers_features" CASCADE;
  DROP TABLE "home_blocks_service_system_slider_layers_features_locales" CASCADE;
  DROP TABLE "home_blocks_service_system_slider_layers" CASCADE;
  DROP TABLE "home_blocks_service_system_slider_layers_locales" CASCADE;
  DROP TABLE "home_blocks_service_system_slider" CASCADE;
  DROP TABLE "home_blocks_service_system_slider_locales" CASCADE;
  DROP TABLE "home_blocks_profiler_labels_program_a_recommendations" CASCADE;
  DROP TABLE "home_blocks_profiler_labels_program_a_recommendations_locales" CASCADE;
  DROP TABLE "home_blocks_profiler_labels_program_b_recommendations" CASCADE;
  DROP TABLE "home_blocks_profiler_labels_program_b_recommendations_locales" CASCADE;
  DROP TABLE "home_blocks_profiler_labels_program_c_recommendations" CASCADE;
  DROP TABLE "home_blocks_profiler_labels_program_c_recommendations_locales" CASCADE;
  DROP TABLE "home_blocks_profiler_volume_options" CASCADE;
  DROP TABLE "home_blocks_profiler_volume_options_locales" CASCADE;
  DROP TABLE "home_blocks_profiler_jobs" CASCADE;
  DROP TABLE "home_blocks_profiler_jobs_locales" CASCADE;
  DROP TABLE "home_blocks_profiler_needs" CASCADE;
  DROP TABLE "home_blocks_profiler_needs_locales" CASCADE;
  DROP TABLE "home_blocks_profiler" CASCADE;
  DROP TABLE "home_blocks_profiler_locales" CASCADE;
  DROP TABLE "home_blocks_stories_title_words" CASCADE;
  DROP TABLE "home_blocks_stories_title_words_locales" CASCADE;
  DROP TABLE "home_blocks_stories" CASCADE;
  DROP TABLE "home_blocks_stories_locales" CASCADE;
  DROP TABLE "home_blocks_faq" CASCADE;
  DROP TABLE "home_blocks_faq_locales" CASCADE;
  DROP TABLE "home_blocks_cta" CASCADE;
  DROP TABLE "home_blocks_cta_locales" CASCADE;
  DROP TABLE "home" CASCADE;
  DROP TABLE "home_locales" CASCADE;
  DROP TABLE "home_rels" CASCADE;
  DROP TABLE "_home_v_blocks_hero_primary_nav" CASCADE;
  DROP TABLE "_home_v_blocks_hero_primary_nav_locales" CASCADE;
  DROP TABLE "_home_v_blocks_hero" CASCADE;
  DROP TABLE "_home_v_blocks_hero_locales" CASCADE;
  DROP TABLE "_home_v_blocks_services_carousel_title_words" CASCADE;
  DROP TABLE "_home_v_blocks_services_carousel_title_words_locales" CASCADE;
  DROP TABLE "_home_v_blocks_services_carousel" CASCADE;
  DROP TABLE "_home_v_blocks_services_carousel_locales" CASCADE;
  DROP TABLE "_home_v_blocks_photo_card" CASCADE;
  DROP TABLE "_home_v_blocks_photo_card_locales" CASCADE;
  DROP TABLE "_home_v_blocks_clock_card" CASCADE;
  DROP TABLE "_home_v_blocks_clock_card_locales" CASCADE;
  DROP TABLE "_home_v_blocks_specialties_card_boxes" CASCADE;
  DROP TABLE "_home_v_blocks_specialties_card_boxes_locales" CASCADE;
  DROP TABLE "_home_v_blocks_specialties_card" CASCADE;
  DROP TABLE "_home_v_blocks_specialties_card_locales" CASCADE;
  DROP TABLE "_home_v_blocks_studies_card" CASCADE;
  DROP TABLE "_home_v_blocks_studies_card_locales" CASCADE;
  DROP TABLE "_home_v_blocks_plain_card" CASCADE;
  DROP TABLE "_home_v_blocks_plain_card_locales" CASCADE;
  DROP TABLE "_home_v_blocks_proof_bento_columns" CASCADE;
  DROP TABLE "_home_v_blocks_proof_bento" CASCADE;
  DROP TABLE "_home_v_blocks_proof_bento_locales" CASCADE;
  DROP TABLE "_home_v_blocks_featured_media" CASCADE;
  DROP TABLE "_home_v_blocks_featured_media_locales" CASCADE;
  DROP TABLE "_home_v_blocks_operating_system_title_words" CASCADE;
  DROP TABLE "_home_v_blocks_operating_system_title_words_locales" CASCADE;
  DROP TABLE "_home_v_blocks_operating_system_tabs" CASCADE;
  DROP TABLE "_home_v_blocks_operating_system_tabs_locales" CASCADE;
  DROP TABLE "_home_v_blocks_operating_system" CASCADE;
  DROP TABLE "_home_v_blocks_operating_system_locales" CASCADE;
  DROP TABLE "_home_v_blocks_service_system_slider_layers_features" CASCADE;
  DROP TABLE "_home_v_blocks_service_system_slider_layers_features_locales" CASCADE;
  DROP TABLE "_home_v_blocks_service_system_slider_layers" CASCADE;
  DROP TABLE "_home_v_blocks_service_system_slider_layers_locales" CASCADE;
  DROP TABLE "_home_v_blocks_service_system_slider" CASCADE;
  DROP TABLE "_home_v_blocks_service_system_slider_locales" CASCADE;
  DROP TABLE "_home_v_blocks_profiler_labels_program_a_recommendations" CASCADE;
  DROP TABLE "_home_v_blocks_profiler_labels_program_a_recommendations_locales" CASCADE;
  DROP TABLE "_home_v_blocks_profiler_labels_program_b_recommendations" CASCADE;
  DROP TABLE "_home_v_blocks_profiler_labels_program_b_recommendations_locales" CASCADE;
  DROP TABLE "_home_v_blocks_profiler_labels_program_c_recommendations" CASCADE;
  DROP TABLE "_home_v_blocks_profiler_labels_program_c_recommendations_locales" CASCADE;
  DROP TABLE "_home_v_blocks_profiler_volume_options" CASCADE;
  DROP TABLE "_home_v_blocks_profiler_volume_options_locales" CASCADE;
  DROP TABLE "_home_v_blocks_profiler_jobs" CASCADE;
  DROP TABLE "_home_v_blocks_profiler_jobs_locales" CASCADE;
  DROP TABLE "_home_v_blocks_profiler_needs" CASCADE;
  DROP TABLE "_home_v_blocks_profiler_needs_locales" CASCADE;
  DROP TABLE "_home_v_blocks_profiler" CASCADE;
  DROP TABLE "_home_v_blocks_profiler_locales" CASCADE;
  DROP TABLE "_home_v_blocks_stories_title_words" CASCADE;
  DROP TABLE "_home_v_blocks_stories_title_words_locales" CASCADE;
  DROP TABLE "_home_v_blocks_stories" CASCADE;
  DROP TABLE "_home_v_blocks_stories_locales" CASCADE;
  DROP TABLE "_home_v_blocks_faq" CASCADE;
  DROP TABLE "_home_v_blocks_faq_locales" CASCADE;
  DROP TABLE "_home_v_blocks_cta" CASCADE;
  DROP TABLE "_home_v_blocks_cta_locales" CASCADE;
  DROP TABLE "_home_v" CASCADE;
  DROP TABLE "_home_v_locales" CASCADE;
  DROP TABLE "_home_v_rels" CASCADE;
  DROP TABLE "billing_page_recipients" CASCADE;
  DROP TABLE "billing_page" CASCADE;
  DROP TABLE "billing_page_locales" CASCADE;
  DROP TABLE "_billing_page_v_version_recipients" CASCADE;
  DROP TABLE "_billing_page_v" CASCADE;
  DROP TABLE "_billing_page_v_locales" CASCADE;
  DROP TABLE "privacy_notice" CASCADE;
  DROP TABLE "privacy_notice_locales" CASCADE;
  DROP TABLE "_privacy_notice_v" CASCADE;
  DROP TABLE "_privacy_notice_v_locales" CASCADE;
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_services_accent";
  DROP TYPE "public"."enum_services_status";
  DROP TYPE "public"."enum__services_v_version_accent";
  DROP TYPE "public"."enum__services_v_version_status";
  DROP TYPE "public"."enum__services_v_published_locale";
  DROP TYPE "public"."enum_stories_logo_fit";
  DROP TYPE "public"."enum_stories_status";
  DROP TYPE "public"."enum__stories_v_version_logo_fit";
  DROP TYPE "public"."enum__stories_v_version_status";
  DROP TYPE "public"."enum__stories_v_published_locale";
  DROP TYPE "public"."enum_logos_usage_context";
  DROP TYPE "public"."enum_logos_fit";
  DROP TYPE "public"."enum_faqs_status";
  DROP TYPE "public"."enum__faqs_v_version_status";
  DROP TYPE "public"."enum__faqs_v_published_locale";
  DROP TYPE "public"."enum_blog_posts_status";
  DROP TYPE "public"."enum__blog_posts_v_version_status";
  DROP TYPE "public"."enum__blog_posts_v_published_locale";
  DROP TYPE "public"."enum_header_primary_nav_link_type";
  DROP TYPE "public"."enum_header_primary_cta_type";
  DROP TYPE "public"."enum_footer_columns_links_link_type";
  DROP TYPE "public"."enum_footer_contact_links_link_type";
  DROP TYPE "public"."enum_footer_legal_links_link_type";
  DROP TYPE "public"."enum_footer_social_links_icon";
  DROP TYPE "public"."enum_footer_cta_primary_type";
  DROP TYPE "public"."enum_footer_cta_secondary_type";
  DROP TYPE "public"."enum_home_blocks_hero_primary_nav_link_type";
  DROP TYPE "public"."enum_home_blocks_hero_cta_type";
  DROP TYPE "public"."enum_home_blocks_services_carousel_title_words_emphasis";
  DROP TYPE "public"."enum_home_blocks_services_carousel_cta_primary_type";
  DROP TYPE "public"."enum_home_blocks_services_carousel_cta_secondary_type";
  DROP TYPE "public"."enum_home_blocks_clock_card_tone";
  DROP TYPE "public"."enum_home_blocks_specialties_card_boxes_size";
  DROP TYPE "public"."enum_home_blocks_plain_card_tone";
  DROP TYPE "public"."enum_home_blocks_operating_system_title_words_emphasis";
  DROP TYPE "public"."enum_home_blocks_service_system_slider_layers_features_icon";
  DROP TYPE "public"."enum_home_blocks_service_system_slider_layers_theme";
  DROP TYPE "public"."enum_home_blocks_stories_title_words_emphasis";
  DROP TYPE "public"."enum_home_blocks_stories_cta_type";
  DROP TYPE "public"."enum_home_blocks_stories_panel_cta_type";
  DROP TYPE "public"."enum_home_blocks_faq_cta_type";
  DROP TYPE "public"."enum_home_blocks_cta_cta_primary_type";
  DROP TYPE "public"."enum_home_blocks_cta_cta_secondary_type";
  DROP TYPE "public"."enum_home_status";
  DROP TYPE "public"."enum__home_v_blocks_hero_primary_nav_link_type";
  DROP TYPE "public"."enum__home_v_blocks_hero_cta_type";
  DROP TYPE "public"."enum__home_v_blocks_services_carousel_title_words_emphasis";
  DROP TYPE "public"."enum__home_v_blocks_services_carousel_cta_primary_type";
  DROP TYPE "public"."enum__home_v_blocks_services_carousel_cta_secondary_type";
  DROP TYPE "public"."enum__home_v_blocks_clock_card_tone";
  DROP TYPE "public"."enum__home_v_blocks_specialties_card_boxes_size";
  DROP TYPE "public"."enum__home_v_blocks_plain_card_tone";
  DROP TYPE "public"."enum__home_v_blocks_operating_system_title_words_emphasis";
  DROP TYPE "public"."enum__home_v_blocks_service_system_slider_layers_features_icon";
  DROP TYPE "public"."enum__home_v_blocks_service_system_slider_layers_theme";
  DROP TYPE "public"."enum__home_v_blocks_stories_title_words_emphasis";
  DROP TYPE "public"."enum__home_v_blocks_stories_cta_type";
  DROP TYPE "public"."enum__home_v_blocks_stories_panel_cta_type";
  DROP TYPE "public"."enum__home_v_blocks_faq_cta_type";
  DROP TYPE "public"."enum__home_v_blocks_cta_cta_primary_type";
  DROP TYPE "public"."enum__home_v_blocks_cta_cta_secondary_type";
  DROP TYPE "public"."enum__home_v_version_status";
  DROP TYPE "public"."enum__home_v_published_locale";
  DROP TYPE "public"."enum_billing_page_status";
  DROP TYPE "public"."enum__billing_page_v_version_status";
  DROP TYPE "public"."enum__billing_page_v_published_locale";
  DROP TYPE "public"."enum_privacy_notice_status";
  DROP TYPE "public"."enum__privacy_notice_v_version_status";
  DROP TYPE "public"."enum__privacy_notice_v_published_locale";`)
}
