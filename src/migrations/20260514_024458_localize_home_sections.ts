import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "home_blocks_hero_primary_nav_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_blocks_hero_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_blocks_services_carousel_title_words_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_blocks_services_carousel_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_blocks_photo_card_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_blocks_clock_card_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_blocks_specialties_card_boxes_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_blocks_specialties_card_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_blocks_studies_card_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_blocks_plain_card_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_blocks_proof_bento_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_blocks_featured_media_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_blocks_operating_system_title_words_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_blocks_operating_system_tabs_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_blocks_operating_system_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_blocks_service_system_slider_layers_features_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_blocks_service_system_slider_layers_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_blocks_service_system_slider_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_blocks_profiler_labels_program_a_recommendations_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_blocks_profiler_labels_program_b_recommendations_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_blocks_profiler_labels_program_c_recommendations_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_blocks_profiler_volume_options_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_blocks_profiler_jobs_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_blocks_profiler_needs_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_blocks_profiler_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_blocks_stories_title_words_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_blocks_stories_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_blocks_faq_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_blocks_cta_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_home_v_blocks_hero_primary_nav_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_home_v_blocks_hero_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_home_v_blocks_services_carousel_title_words_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_home_v_blocks_services_carousel_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_home_v_blocks_photo_card_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_home_v_blocks_clock_card_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_home_v_blocks_specialties_card_boxes_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_home_v_blocks_specialties_card_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_home_v_blocks_studies_card_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_home_v_blocks_plain_card_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_home_v_blocks_proof_bento_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_home_v_blocks_featured_media_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_home_v_blocks_operating_system_title_words_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_home_v_blocks_operating_system_tabs_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_home_v_blocks_operating_system_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_home_v_blocks_service_system_slider_layers_features_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_home_v_blocks_service_system_slider_layers_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_home_v_blocks_service_system_slider_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_home_v_blocks_profiler_labels_program_a_recommendations_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_home_v_blocks_profiler_labels_program_b_recommendations_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_home_v_blocks_profiler_labels_program_c_recommendations_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_home_v_blocks_profiler_volume_options_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_home_v_blocks_profiler_jobs_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_home_v_blocks_profiler_needs_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_home_v_blocks_profiler_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_home_v_blocks_stories_title_words_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_home_v_blocks_stories_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_home_v_blocks_faq_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_home_v_blocks_cta_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "home_blocks_hero_primary_nav_locales" CASCADE;
  DROP TABLE "home_blocks_hero_locales" CASCADE;
  DROP TABLE "home_blocks_services_carousel_title_words_locales" CASCADE;
  DROP TABLE "home_blocks_services_carousel_locales" CASCADE;
  DROP TABLE "home_blocks_photo_card_locales" CASCADE;
  DROP TABLE "home_blocks_clock_card_locales" CASCADE;
  DROP TABLE "home_blocks_specialties_card_boxes_locales" CASCADE;
  DROP TABLE "home_blocks_specialties_card_locales" CASCADE;
  DROP TABLE "home_blocks_studies_card_locales" CASCADE;
  DROP TABLE "home_blocks_plain_card_locales" CASCADE;
  DROP TABLE "home_blocks_proof_bento_locales" CASCADE;
  DROP TABLE "home_blocks_featured_media_locales" CASCADE;
  DROP TABLE "home_blocks_operating_system_title_words_locales" CASCADE;
  DROP TABLE "home_blocks_operating_system_tabs_locales" CASCADE;
  DROP TABLE "home_blocks_operating_system_locales" CASCADE;
  DROP TABLE "home_blocks_service_system_slider_layers_features_locales" CASCADE;
  DROP TABLE "home_blocks_service_system_slider_layers_locales" CASCADE;
  DROP TABLE "home_blocks_service_system_slider_locales" CASCADE;
  DROP TABLE "home_blocks_profiler_labels_program_a_recommendations_locales" CASCADE;
  DROP TABLE "home_blocks_profiler_labels_program_b_recommendations_locales" CASCADE;
  DROP TABLE "home_blocks_profiler_labels_program_c_recommendations_locales" CASCADE;
  DROP TABLE "home_blocks_profiler_volume_options_locales" CASCADE;
  DROP TABLE "home_blocks_profiler_jobs_locales" CASCADE;
  DROP TABLE "home_blocks_profiler_needs_locales" CASCADE;
  DROP TABLE "home_blocks_profiler_locales" CASCADE;
  DROP TABLE "home_blocks_stories_title_words_locales" CASCADE;
  DROP TABLE "home_blocks_stories_locales" CASCADE;
  DROP TABLE "home_blocks_faq_locales" CASCADE;
  DROP TABLE "home_blocks_cta_locales" CASCADE;
  DROP TABLE "_home_v_blocks_hero_primary_nav_locales" CASCADE;
  DROP TABLE "_home_v_blocks_hero_locales" CASCADE;
  DROP TABLE "_home_v_blocks_services_carousel_title_words_locales" CASCADE;
  DROP TABLE "_home_v_blocks_services_carousel_locales" CASCADE;
  DROP TABLE "_home_v_blocks_photo_card_locales" CASCADE;
  DROP TABLE "_home_v_blocks_clock_card_locales" CASCADE;
  DROP TABLE "_home_v_blocks_specialties_card_boxes_locales" CASCADE;
  DROP TABLE "_home_v_blocks_specialties_card_locales" CASCADE;
  DROP TABLE "_home_v_blocks_studies_card_locales" CASCADE;
  DROP TABLE "_home_v_blocks_plain_card_locales" CASCADE;
  DROP TABLE "_home_v_blocks_proof_bento_locales" CASCADE;
  DROP TABLE "_home_v_blocks_featured_media_locales" CASCADE;
  DROP TABLE "_home_v_blocks_operating_system_title_words_locales" CASCADE;
  DROP TABLE "_home_v_blocks_operating_system_tabs_locales" CASCADE;
  DROP TABLE "_home_v_blocks_operating_system_locales" CASCADE;
  DROP TABLE "_home_v_blocks_service_system_slider_layers_features_locales" CASCADE;
  DROP TABLE "_home_v_blocks_service_system_slider_layers_locales" CASCADE;
  DROP TABLE "_home_v_blocks_service_system_slider_locales" CASCADE;
  DROP TABLE "_home_v_blocks_profiler_labels_program_a_recommendations_locales" CASCADE;
  DROP TABLE "_home_v_blocks_profiler_labels_program_b_recommendations_locales" CASCADE;
  DROP TABLE "_home_v_blocks_profiler_labels_program_c_recommendations_locales" CASCADE;
  DROP TABLE "_home_v_blocks_profiler_volume_options_locales" CASCADE;
  DROP TABLE "_home_v_blocks_profiler_jobs_locales" CASCADE;
  DROP TABLE "_home_v_blocks_profiler_needs_locales" CASCADE;
  DROP TABLE "_home_v_blocks_profiler_locales" CASCADE;
  DROP TABLE "_home_v_blocks_stories_title_words_locales" CASCADE;
  DROP TABLE "_home_v_blocks_stories_locales" CASCADE;
  DROP TABLE "_home_v_blocks_faq_locales" CASCADE;
  DROP TABLE "_home_v_blocks_cta_locales" CASCADE;
  DROP INDEX "home_rels_logos_id_idx";
  DROP INDEX "home_rels_services_id_idx";
  DROP INDEX "home_rels_stories_id_idx";
  DROP INDEX "home_rels_faqs_id_idx";
  DROP INDEX "_home_v_rels_logos_id_idx";
  DROP INDEX "_home_v_rels_services_id_idx";
  DROP INDEX "_home_v_rels_stories_id_idx";
  DROP INDEX "_home_v_rels_faqs_id_idx";
  ALTER TABLE "home_blocks_hero_primary_nav" ADD COLUMN "_locale" "_locales" DEFAULT 'es' NOT NULL;
  ALTER TABLE "home_blocks_hero_primary_nav" ADD COLUMN "link_label" varchar;
  ALTER TABLE "home_blocks_hero" ADD COLUMN "_locale" "_locales" DEFAULT 'es' NOT NULL;
  ALTER TABLE "home_blocks_hero" ADD COLUMN "title" varchar;
  ALTER TABLE "home_blocks_hero" ADD COLUMN "copy" varchar;
  ALTER TABLE "home_blocks_hero" ADD COLUMN "cta_label" varchar;
  ALTER TABLE "home_blocks_hero" ADD COLUMN "ribbon_label" varchar;
  ALTER TABLE "home_blocks_hero" ADD COLUMN "nav_aria_label" varchar;
  ALTER TABLE "home_blocks_hero" ADD COLUMN "mobile_nav_aria_label" varchar;
  ALTER TABLE "home_blocks_hero" ADD COLUMN "menu_open_label" varchar;
  ALTER TABLE "home_blocks_hero" ADD COLUMN "menu_close_label" varchar;
  ALTER TABLE "home_blocks_hero" ADD COLUMN "marquee_aria_label" varchar;
  ALTER TABLE "home_blocks_services_carousel_title_words" ADD COLUMN "_locale" "_locales" DEFAULT 'es' NOT NULL;
  ALTER TABLE "home_blocks_services_carousel_title_words" ADD COLUMN "text" varchar;
  ALTER TABLE "home_blocks_services_carousel" ADD COLUMN "_locale" "_locales" DEFAULT 'es' NOT NULL;
  ALTER TABLE "home_blocks_services_carousel" ADD COLUMN "kicker" varchar;
  ALTER TABLE "home_blocks_services_carousel" ADD COLUMN "title_aria_label" varchar;
  ALTER TABLE "home_blocks_services_carousel" ADD COLUMN "copy" varchar;
  ALTER TABLE "home_blocks_services_carousel" ADD COLUMN "cta_primary_label" varchar;
  ALTER TABLE "home_blocks_services_carousel" ADD COLUMN "cta_secondary_label" varchar;
  ALTER TABLE "home_blocks_services_carousel" ADD COLUMN "labels_region_label" varchar;
  ALTER TABLE "home_blocks_services_carousel" ADD COLUMN "labels_previous" varchar;
  ALTER TABLE "home_blocks_services_carousel" ADD COLUMN "labels_next" varchar;
  ALTER TABLE "home_blocks_services_carousel" ADD COLUMN "labels_progress_label" varchar;
  ALTER TABLE "home_blocks_services_carousel" ADD COLUMN "labels_slide_template" varchar;
  ALTER TABLE "home_blocks_photo_card" ADD COLUMN "_locale" "_locales" DEFAULT 'es' NOT NULL;
  ALTER TABLE "home_blocks_photo_card" ADD COLUMN "title" varchar;
  ALTER TABLE "home_blocks_photo_card" ADD COLUMN "sub" varchar;
  ALTER TABLE "home_blocks_photo_card" ADD COLUMN "alt" varchar;
  ALTER TABLE "home_blocks_clock_card" ADD COLUMN "_locale" "_locales" DEFAULT 'es' NOT NULL;
  ALTER TABLE "home_blocks_clock_card" ADD COLUMN "title" varchar;
  ALTER TABLE "home_blocks_specialties_card_boxes" ADD COLUMN "_locale" "_locales" DEFAULT 'es' NOT NULL;
  ALTER TABLE "home_blocks_specialties_card_boxes" ADD COLUMN "label" varchar;
  ALTER TABLE "home_blocks_specialties_card" ADD COLUMN "_locale" "_locales" DEFAULT 'es' NOT NULL;
  ALTER TABLE "home_blocks_specialties_card" ADD COLUMN "title" varchar;
  ALTER TABLE "home_blocks_specialties_card" ADD COLUMN "sub" varchar;
  ALTER TABLE "home_blocks_studies_card" ADD COLUMN "_locale" "_locales" DEFAULT 'es' NOT NULL;
  ALTER TABLE "home_blocks_studies_card" ADD COLUMN "title" varchar;
  ALTER TABLE "home_blocks_studies_card" ADD COLUMN "alt" varchar;
  ALTER TABLE "home_blocks_plain_card" ADD COLUMN "_locale" "_locales" DEFAULT 'es' NOT NULL;
  ALTER TABLE "home_blocks_plain_card" ADD COLUMN "title" varchar;
  ALTER TABLE "home_blocks_plain_card" ADD COLUMN "sub" varchar;
  ALTER TABLE "home_blocks_proof_bento_columns" ADD COLUMN "_locale" "_locales" DEFAULT 'es' NOT NULL;
  ALTER TABLE "home_blocks_proof_bento" ADD COLUMN "_locale" "_locales" DEFAULT 'es' NOT NULL;
  ALTER TABLE "home_blocks_proof_bento" ADD COLUMN "heading_aria_label" varchar;
  ALTER TABLE "home_blocks_proof_bento" ADD COLUMN "heading_lead" varchar;
  ALTER TABLE "home_blocks_proof_bento" ADD COLUMN "heading_accent" varchar;
  ALTER TABLE "home_blocks_proof_bento" ADD COLUMN "copy" varchar;
  ALTER TABLE "home_blocks_featured_media" ADD COLUMN "_locale" "_locales" DEFAULT 'es' NOT NULL;
  ALTER TABLE "home_blocks_featured_media" ADD COLUMN "label" varchar;
  ALTER TABLE "home_blocks_featured_media" ADD COLUMN "aria_label" varchar;
  ALTER TABLE "home_blocks_operating_system_title_words" ADD COLUMN "_locale" "_locales" DEFAULT 'es' NOT NULL;
  ALTER TABLE "home_blocks_operating_system_title_words" ADD COLUMN "text" varchar;
  ALTER TABLE "home_blocks_operating_system_tabs" ADD COLUMN "_locale" "_locales" DEFAULT 'es' NOT NULL;
  ALTER TABLE "home_blocks_operating_system_tabs" ADD COLUMN "title" varchar;
  ALTER TABLE "home_blocks_operating_system_tabs" ADD COLUMN "copy" varchar;
  ALTER TABLE "home_blocks_operating_system_tabs" ADD COLUMN "panel_title" varchar;
  ALTER TABLE "home_blocks_operating_system_tabs" ADD COLUMN "panel_copy" varchar;
  ALTER TABLE "home_blocks_operating_system" ADD COLUMN "_locale" "_locales" DEFAULT 'es' NOT NULL;
  ALTER TABLE "home_blocks_operating_system" ADD COLUMN "kicker" varchar;
  ALTER TABLE "home_blocks_operating_system" ADD COLUMN "title_aria_label" varchar;
  ALTER TABLE "home_blocks_operating_system" ADD COLUMN "copy" varchar;
  ALTER TABLE "home_blocks_operating_system" ADD COLUMN "labels_section_label" varchar;
  ALTER TABLE "home_blocks_operating_system" ADD COLUMN "labels_list_aria_label" varchar;
  ALTER TABLE "home_blocks_service_system_slider_layers_features" ADD COLUMN "_locale" "_locales" DEFAULT 'es' NOT NULL;
  ALTER TABLE "home_blocks_service_system_slider_layers_features" ADD COLUMN "title" varchar;
  ALTER TABLE "home_blocks_service_system_slider_layers_features" ADD COLUMN "text" varchar;
  ALTER TABLE "home_blocks_service_system_slider_layers" ADD COLUMN "_locale" "_locales" DEFAULT 'es' NOT NULL;
  ALTER TABLE "home_blocks_service_system_slider_layers" ADD COLUMN "title" varchar;
  ALTER TABLE "home_blocks_service_system_slider" ADD COLUMN "_locale" "_locales" DEFAULT 'es' NOT NULL;
  ALTER TABLE "home_blocks_service_system_slider" ADD COLUMN "labels_kicker" varchar;
  ALTER TABLE "home_blocks_service_system_slider" ADD COLUMN "labels_title_line1" varchar;
  ALTER TABLE "home_blocks_service_system_slider" ADD COLUMN "labels_title_line2" varchar;
  ALTER TABLE "home_blocks_service_system_slider" ADD COLUMN "labels_title_aria_label" varchar;
  ALTER TABLE "home_blocks_service_system_slider" ADD COLUMN "labels_nav_aria_label" varchar;
  ALTER TABLE "home_blocks_service_system_slider" ADD COLUMN "labels_progress_aria_label" varchar;
  ALTER TABLE "home_blocks_service_system_slider" ADD COLUMN "labels_progress_value_text_template" varchar;
  ALTER TABLE "home_blocks_service_system_slider" ADD COLUMN "labels_eyebrow_template" varchar;
  ALTER TABLE "home_blocks_service_system_slider" ADD COLUMN "labels_previous" varchar;
  ALTER TABLE "home_blocks_service_system_slider" ADD COLUMN "labels_next" varchar;
  ALTER TABLE "home_blocks_profiler_labels_program_a_recommendations" ADD COLUMN "_locale" "_locales" DEFAULT 'es' NOT NULL;
  ALTER TABLE "home_blocks_profiler_labels_program_a_recommendations" ADD COLUMN "text" varchar;
  ALTER TABLE "home_blocks_profiler_labels_program_b_recommendations" ADD COLUMN "_locale" "_locales" DEFAULT 'es' NOT NULL;
  ALTER TABLE "home_blocks_profiler_labels_program_b_recommendations" ADD COLUMN "text" varchar;
  ALTER TABLE "home_blocks_profiler_labels_program_c_recommendations" ADD COLUMN "_locale" "_locales" DEFAULT 'es' NOT NULL;
  ALTER TABLE "home_blocks_profiler_labels_program_c_recommendations" ADD COLUMN "text" varchar;
  ALTER TABLE "home_blocks_profiler_volume_options" ADD COLUMN "_locale" "_locales" DEFAULT 'es' NOT NULL;
  ALTER TABLE "home_blocks_profiler_volume_options" ADD COLUMN "label" varchar;
  ALTER TABLE "home_blocks_profiler_jobs" ADD COLUMN "_locale" "_locales" DEFAULT 'es' NOT NULL;
  ALTER TABLE "home_blocks_profiler_jobs" ADD COLUMN "title" varchar;
  ALTER TABLE "home_blocks_profiler_jobs" ADD COLUMN "text" varchar;
  ALTER TABLE "home_blocks_profiler_needs" ADD COLUMN "_locale" "_locales" DEFAULT 'es' NOT NULL;
  ALTER TABLE "home_blocks_profiler_needs" ADD COLUMN "title" varchar;
  ALTER TABLE "home_blocks_profiler_needs" ADD COLUMN "text" varchar;
  ALTER TABLE "home_blocks_profiler" ADD COLUMN "_locale" "_locales" DEFAULT 'es' NOT NULL;
  ALTER TABLE "home_blocks_profiler" ADD COLUMN "labels_kicker" varchar;
  ALTER TABLE "home_blocks_profiler" ADD COLUMN "labels_step0_heading" varchar;
  ALTER TABLE "home_blocks_profiler" ADD COLUMN "labels_step0_copy" varchar;
  ALTER TABLE "home_blocks_profiler" ADD COLUMN "labels_chooser_aria_label" varchar;
  ALTER TABLE "home_blocks_profiler" ADD COLUMN "labels_chooser_placeholder" varchar;
  ALTER TABLE "home_blocks_profiler" ADD COLUMN "labels_step1_heading" varchar;
  ALTER TABLE "home_blocks_profiler" ADD COLUMN "labels_step1_copy" varchar;
  ALTER TABLE "home_blocks_profiler" ADD COLUMN "labels_step2_heading" varchar;
  ALTER TABLE "home_blocks_profiler" ADD COLUMN "labels_step2_copy" varchar;
  ALTER TABLE "home_blocks_profiler" ADD COLUMN "labels_back" varchar;
  ALTER TABLE "home_blocks_profiler" ADD COLUMN "labels_see_setup" varchar;
  ALTER TABLE "home_blocks_profiler" ADD COLUMN "labels_start_over" varchar;
  ALTER TABLE "home_blocks_profiler" ADD COLUMN "labels_talk_to_zitrone" varchar;
  ALTER TABLE "home_blocks_profiler" ADD COLUMN "labels_default_result_heading" varchar;
  ALTER TABLE "home_blocks_profiler" ADD COLUMN "labels_default_result_body" varchar;
  ALTER TABLE "home_blocks_profiler" ADD COLUMN "labels_program_a_label" varchar;
  ALTER TABLE "home_blocks_profiler" ADD COLUMN "labels_program_a_heading" varchar;
  ALTER TABLE "home_blocks_profiler" ADD COLUMN "labels_program_a_body" varchar;
  ALTER TABLE "home_blocks_profiler" ADD COLUMN "labels_program_b_label" varchar;
  ALTER TABLE "home_blocks_profiler" ADD COLUMN "labels_program_b_heading" varchar;
  ALTER TABLE "home_blocks_profiler" ADD COLUMN "labels_program_b_body" varchar;
  ALTER TABLE "home_blocks_profiler" ADD COLUMN "labels_program_c_label" varchar;
  ALTER TABLE "home_blocks_profiler" ADD COLUMN "labels_program_c_heading" varchar;
  ALTER TABLE "home_blocks_profiler" ADD COLUMN "labels_program_c_body" varchar;
  ALTER TABLE "home_blocks_profiler" ADD COLUMN "labels_program_a_extra_breakfast" varchar;
  ALTER TABLE "home_blocks_profiler" ADD COLUMN "labels_program_a_extra_dining" varchar;
  ALTER TABLE "home_blocks_profiler" ADD COLUMN "labels_program_a_extra_grab_and_go" varchar;
  ALTER TABLE "home_blocks_profiler" ADD COLUMN "labels_program_b_extra_coffee" varchar;
  ALTER TABLE "home_blocks_profiler" ADD COLUMN "labels_program_b_extra_pantry" varchar;
  ALTER TABLE "home_blocks_profiler" ADD COLUMN "labels_program_b_extra_cafeteria" varchar;
  ALTER TABLE "home_blocks_profiler" ADD COLUMN "labels_program_b_fallback" varchar;
  ALTER TABLE "home_blocks_profiler" ADD COLUMN "labels_plus_events" varchar;
  ALTER TABLE "home_blocks_profiler" ADD COLUMN "labels_plus_fuel" varchar;
  ALTER TABLE "home_blocks_profiler" ADD COLUMN "labels_growth_level1" varchar;
  ALTER TABLE "home_blocks_profiler" ADD COLUMN "labels_growth_level2" varchar;
  ALTER TABLE "home_blocks_profiler" ADD COLUMN "labels_growth_level3" varchar;
  ALTER TABLE "home_blocks_profiler" ADD COLUMN "labels_growth_level4" varchar;
  ALTER TABLE "home_blocks_stories_title_words" ADD COLUMN "_locale" "_locales" DEFAULT 'es' NOT NULL;
  ALTER TABLE "home_blocks_stories_title_words" ADD COLUMN "text" varchar;
  ALTER TABLE "home_blocks_stories" ADD COLUMN "_locale" "_locales" DEFAULT 'es' NOT NULL;
  ALTER TABLE "home_blocks_stories" ADD COLUMN "kicker" varchar;
  ALTER TABLE "home_blocks_stories" ADD COLUMN "title_aria_label" varchar;
  ALTER TABLE "home_blocks_stories" ADD COLUMN "copy" varchar;
  ALTER TABLE "home_blocks_stories" ADD COLUMN "cta_label" varchar;
  ALTER TABLE "home_blocks_stories" ADD COLUMN "panel_cta_label" varchar;
  ALTER TABLE "home_blocks_stories" ADD COLUMN "labels_tablist_aria_label" varchar;
  ALTER TABLE "home_blocks_faq" ADD COLUMN "_locale" "_locales" DEFAULT 'es' NOT NULL;
  ALTER TABLE "home_blocks_faq" ADD COLUMN "heading" varchar;
  ALTER TABLE "home_blocks_faq" ADD COLUMN "cta_label" varchar;
  ALTER TABLE "home_blocks_cta" ADD COLUMN "_locale" "_locales" DEFAULT 'es' NOT NULL;
  ALTER TABLE "home_blocks_cta" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "home_blocks_cta" ADD COLUMN "heading" varchar;
  ALTER TABLE "home_blocks_cta" ADD COLUMN "copy" varchar;
  ALTER TABLE "home_blocks_cta" ADD COLUMN "cta_primary_label" varchar;
  ALTER TABLE "home_blocks_cta" ADD COLUMN "cta_secondary_label" varchar;
  ALTER TABLE "home_rels" ADD COLUMN "locale" "_locales";
  ALTER TABLE "_home_v_blocks_hero_primary_nav" ADD COLUMN "_locale" "_locales" DEFAULT 'es' NOT NULL;
  ALTER TABLE "_home_v_blocks_hero_primary_nav" ADD COLUMN "link_label" varchar;
  ALTER TABLE "_home_v_blocks_hero" ADD COLUMN "_locale" "_locales" DEFAULT 'es' NOT NULL;
  ALTER TABLE "_home_v_blocks_hero" ADD COLUMN "title" varchar;
  ALTER TABLE "_home_v_blocks_hero" ADD COLUMN "copy" varchar;
  ALTER TABLE "_home_v_blocks_hero" ADD COLUMN "cta_label" varchar;
  ALTER TABLE "_home_v_blocks_hero" ADD COLUMN "ribbon_label" varchar;
  ALTER TABLE "_home_v_blocks_hero" ADD COLUMN "nav_aria_label" varchar;
  ALTER TABLE "_home_v_blocks_hero" ADD COLUMN "mobile_nav_aria_label" varchar;
  ALTER TABLE "_home_v_blocks_hero" ADD COLUMN "menu_open_label" varchar;
  ALTER TABLE "_home_v_blocks_hero" ADD COLUMN "menu_close_label" varchar;
  ALTER TABLE "_home_v_blocks_hero" ADD COLUMN "marquee_aria_label" varchar;
  ALTER TABLE "_home_v_blocks_services_carousel_title_words" ADD COLUMN "_locale" "_locales" DEFAULT 'es' NOT NULL;
  ALTER TABLE "_home_v_blocks_services_carousel_title_words" ADD COLUMN "text" varchar;
  ALTER TABLE "_home_v_blocks_services_carousel" ADD COLUMN "_locale" "_locales" DEFAULT 'es' NOT NULL;
  ALTER TABLE "_home_v_blocks_services_carousel" ADD COLUMN "kicker" varchar;
  ALTER TABLE "_home_v_blocks_services_carousel" ADD COLUMN "title_aria_label" varchar;
  ALTER TABLE "_home_v_blocks_services_carousel" ADD COLUMN "copy" varchar;
  ALTER TABLE "_home_v_blocks_services_carousel" ADD COLUMN "cta_primary_label" varchar;
  ALTER TABLE "_home_v_blocks_services_carousel" ADD COLUMN "cta_secondary_label" varchar;
  ALTER TABLE "_home_v_blocks_services_carousel" ADD COLUMN "labels_region_label" varchar;
  ALTER TABLE "_home_v_blocks_services_carousel" ADD COLUMN "labels_previous" varchar;
  ALTER TABLE "_home_v_blocks_services_carousel" ADD COLUMN "labels_next" varchar;
  ALTER TABLE "_home_v_blocks_services_carousel" ADD COLUMN "labels_progress_label" varchar;
  ALTER TABLE "_home_v_blocks_services_carousel" ADD COLUMN "labels_slide_template" varchar;
  ALTER TABLE "_home_v_blocks_photo_card" ADD COLUMN "_locale" "_locales" DEFAULT 'es' NOT NULL;
  ALTER TABLE "_home_v_blocks_photo_card" ADD COLUMN "title" varchar;
  ALTER TABLE "_home_v_blocks_photo_card" ADD COLUMN "sub" varchar;
  ALTER TABLE "_home_v_blocks_photo_card" ADD COLUMN "alt" varchar;
  ALTER TABLE "_home_v_blocks_clock_card" ADD COLUMN "_locale" "_locales" DEFAULT 'es' NOT NULL;
  ALTER TABLE "_home_v_blocks_clock_card" ADD COLUMN "title" varchar;
  ALTER TABLE "_home_v_blocks_specialties_card_boxes" ADD COLUMN "_locale" "_locales" DEFAULT 'es' NOT NULL;
  ALTER TABLE "_home_v_blocks_specialties_card_boxes" ADD COLUMN "label" varchar;
  ALTER TABLE "_home_v_blocks_specialties_card" ADD COLUMN "_locale" "_locales" DEFAULT 'es' NOT NULL;
  ALTER TABLE "_home_v_blocks_specialties_card" ADD COLUMN "title" varchar;
  ALTER TABLE "_home_v_blocks_specialties_card" ADD COLUMN "sub" varchar;
  ALTER TABLE "_home_v_blocks_studies_card" ADD COLUMN "_locale" "_locales" DEFAULT 'es' NOT NULL;
  ALTER TABLE "_home_v_blocks_studies_card" ADD COLUMN "title" varchar;
  ALTER TABLE "_home_v_blocks_studies_card" ADD COLUMN "alt" varchar;
  ALTER TABLE "_home_v_blocks_plain_card" ADD COLUMN "_locale" "_locales" DEFAULT 'es' NOT NULL;
  ALTER TABLE "_home_v_blocks_plain_card" ADD COLUMN "title" varchar;
  ALTER TABLE "_home_v_blocks_plain_card" ADD COLUMN "sub" varchar;
  ALTER TABLE "_home_v_blocks_proof_bento_columns" ADD COLUMN "_locale" "_locales" DEFAULT 'es' NOT NULL;
  ALTER TABLE "_home_v_blocks_proof_bento" ADD COLUMN "_locale" "_locales" DEFAULT 'es' NOT NULL;
  ALTER TABLE "_home_v_blocks_proof_bento" ADD COLUMN "heading_aria_label" varchar;
  ALTER TABLE "_home_v_blocks_proof_bento" ADD COLUMN "heading_lead" varchar;
  ALTER TABLE "_home_v_blocks_proof_bento" ADD COLUMN "heading_accent" varchar;
  ALTER TABLE "_home_v_blocks_proof_bento" ADD COLUMN "copy" varchar;
  ALTER TABLE "_home_v_blocks_featured_media" ADD COLUMN "_locale" "_locales" DEFAULT 'es' NOT NULL;
  ALTER TABLE "_home_v_blocks_featured_media" ADD COLUMN "label" varchar;
  ALTER TABLE "_home_v_blocks_featured_media" ADD COLUMN "aria_label" varchar;
  ALTER TABLE "_home_v_blocks_operating_system_title_words" ADD COLUMN "_locale" "_locales" DEFAULT 'es' NOT NULL;
  ALTER TABLE "_home_v_blocks_operating_system_title_words" ADD COLUMN "text" varchar;
  ALTER TABLE "_home_v_blocks_operating_system_tabs" ADD COLUMN "_locale" "_locales" DEFAULT 'es' NOT NULL;
  ALTER TABLE "_home_v_blocks_operating_system_tabs" ADD COLUMN "title" varchar;
  ALTER TABLE "_home_v_blocks_operating_system_tabs" ADD COLUMN "copy" varchar;
  ALTER TABLE "_home_v_blocks_operating_system_tabs" ADD COLUMN "panel_title" varchar;
  ALTER TABLE "_home_v_blocks_operating_system_tabs" ADD COLUMN "panel_copy" varchar;
  ALTER TABLE "_home_v_blocks_operating_system" ADD COLUMN "_locale" "_locales" DEFAULT 'es' NOT NULL;
  ALTER TABLE "_home_v_blocks_operating_system" ADD COLUMN "kicker" varchar;
  ALTER TABLE "_home_v_blocks_operating_system" ADD COLUMN "title_aria_label" varchar;
  ALTER TABLE "_home_v_blocks_operating_system" ADD COLUMN "copy" varchar;
  ALTER TABLE "_home_v_blocks_operating_system" ADD COLUMN "labels_section_label" varchar;
  ALTER TABLE "_home_v_blocks_operating_system" ADD COLUMN "labels_list_aria_label" varchar;
  ALTER TABLE "_home_v_blocks_service_system_slider_layers_features" ADD COLUMN "_locale" "_locales" DEFAULT 'es' NOT NULL;
  ALTER TABLE "_home_v_blocks_service_system_slider_layers_features" ADD COLUMN "title" varchar;
  ALTER TABLE "_home_v_blocks_service_system_slider_layers_features" ADD COLUMN "text" varchar;
  ALTER TABLE "_home_v_blocks_service_system_slider_layers" ADD COLUMN "_locale" "_locales" DEFAULT 'es' NOT NULL;
  ALTER TABLE "_home_v_blocks_service_system_slider_layers" ADD COLUMN "title" varchar;
  ALTER TABLE "_home_v_blocks_service_system_slider" ADD COLUMN "_locale" "_locales" DEFAULT 'es' NOT NULL;
  ALTER TABLE "_home_v_blocks_service_system_slider" ADD COLUMN "labels_kicker" varchar;
  ALTER TABLE "_home_v_blocks_service_system_slider" ADD COLUMN "labels_title_line1" varchar;
  ALTER TABLE "_home_v_blocks_service_system_slider" ADD COLUMN "labels_title_line2" varchar;
  ALTER TABLE "_home_v_blocks_service_system_slider" ADD COLUMN "labels_title_aria_label" varchar;
  ALTER TABLE "_home_v_blocks_service_system_slider" ADD COLUMN "labels_nav_aria_label" varchar;
  ALTER TABLE "_home_v_blocks_service_system_slider" ADD COLUMN "labels_progress_aria_label" varchar;
  ALTER TABLE "_home_v_blocks_service_system_slider" ADD COLUMN "labels_progress_value_text_template" varchar;
  ALTER TABLE "_home_v_blocks_service_system_slider" ADD COLUMN "labels_eyebrow_template" varchar;
  ALTER TABLE "_home_v_blocks_service_system_slider" ADD COLUMN "labels_previous" varchar;
  ALTER TABLE "_home_v_blocks_service_system_slider" ADD COLUMN "labels_next" varchar;
  ALTER TABLE "_home_v_blocks_profiler_labels_program_a_recommendations" ADD COLUMN "_locale" "_locales" DEFAULT 'es' NOT NULL;
  ALTER TABLE "_home_v_blocks_profiler_labels_program_a_recommendations" ADD COLUMN "text" varchar;
  ALTER TABLE "_home_v_blocks_profiler_labels_program_b_recommendations" ADD COLUMN "_locale" "_locales" DEFAULT 'es' NOT NULL;
  ALTER TABLE "_home_v_blocks_profiler_labels_program_b_recommendations" ADD COLUMN "text" varchar;
  ALTER TABLE "_home_v_blocks_profiler_labels_program_c_recommendations" ADD COLUMN "_locale" "_locales" DEFAULT 'es' NOT NULL;
  ALTER TABLE "_home_v_blocks_profiler_labels_program_c_recommendations" ADD COLUMN "text" varchar;
  ALTER TABLE "_home_v_blocks_profiler_volume_options" ADD COLUMN "_locale" "_locales" DEFAULT 'es' NOT NULL;
  ALTER TABLE "_home_v_blocks_profiler_volume_options" ADD COLUMN "label" varchar;
  ALTER TABLE "_home_v_blocks_profiler_jobs" ADD COLUMN "_locale" "_locales" DEFAULT 'es' NOT NULL;
  ALTER TABLE "_home_v_blocks_profiler_jobs" ADD COLUMN "title" varchar;
  ALTER TABLE "_home_v_blocks_profiler_jobs" ADD COLUMN "text" varchar;
  ALTER TABLE "_home_v_blocks_profiler_needs" ADD COLUMN "_locale" "_locales" DEFAULT 'es' NOT NULL;
  ALTER TABLE "_home_v_blocks_profiler_needs" ADD COLUMN "title" varchar;
  ALTER TABLE "_home_v_blocks_profiler_needs" ADD COLUMN "text" varchar;
  ALTER TABLE "_home_v_blocks_profiler" ADD COLUMN "_locale" "_locales" DEFAULT 'es' NOT NULL;
  ALTER TABLE "_home_v_blocks_profiler" ADD COLUMN "labels_kicker" varchar;
  ALTER TABLE "_home_v_blocks_profiler" ADD COLUMN "labels_step0_heading" varchar;
  ALTER TABLE "_home_v_blocks_profiler" ADD COLUMN "labels_step0_copy" varchar;
  ALTER TABLE "_home_v_blocks_profiler" ADD COLUMN "labels_chooser_aria_label" varchar;
  ALTER TABLE "_home_v_blocks_profiler" ADD COLUMN "labels_chooser_placeholder" varchar;
  ALTER TABLE "_home_v_blocks_profiler" ADD COLUMN "labels_step1_heading" varchar;
  ALTER TABLE "_home_v_blocks_profiler" ADD COLUMN "labels_step1_copy" varchar;
  ALTER TABLE "_home_v_blocks_profiler" ADD COLUMN "labels_step2_heading" varchar;
  ALTER TABLE "_home_v_blocks_profiler" ADD COLUMN "labels_step2_copy" varchar;
  ALTER TABLE "_home_v_blocks_profiler" ADD COLUMN "labels_back" varchar;
  ALTER TABLE "_home_v_blocks_profiler" ADD COLUMN "labels_see_setup" varchar;
  ALTER TABLE "_home_v_blocks_profiler" ADD COLUMN "labels_start_over" varchar;
  ALTER TABLE "_home_v_blocks_profiler" ADD COLUMN "labels_talk_to_zitrone" varchar;
  ALTER TABLE "_home_v_blocks_profiler" ADD COLUMN "labels_default_result_heading" varchar;
  ALTER TABLE "_home_v_blocks_profiler" ADD COLUMN "labels_default_result_body" varchar;
  ALTER TABLE "_home_v_blocks_profiler" ADD COLUMN "labels_program_a_label" varchar;
  ALTER TABLE "_home_v_blocks_profiler" ADD COLUMN "labels_program_a_heading" varchar;
  ALTER TABLE "_home_v_blocks_profiler" ADD COLUMN "labels_program_a_body" varchar;
  ALTER TABLE "_home_v_blocks_profiler" ADD COLUMN "labels_program_b_label" varchar;
  ALTER TABLE "_home_v_blocks_profiler" ADD COLUMN "labels_program_b_heading" varchar;
  ALTER TABLE "_home_v_blocks_profiler" ADD COLUMN "labels_program_b_body" varchar;
  ALTER TABLE "_home_v_blocks_profiler" ADD COLUMN "labels_program_c_label" varchar;
  ALTER TABLE "_home_v_blocks_profiler" ADD COLUMN "labels_program_c_heading" varchar;
  ALTER TABLE "_home_v_blocks_profiler" ADD COLUMN "labels_program_c_body" varchar;
  ALTER TABLE "_home_v_blocks_profiler" ADD COLUMN "labels_program_a_extra_breakfast" varchar;
  ALTER TABLE "_home_v_blocks_profiler" ADD COLUMN "labels_program_a_extra_dining" varchar;
  ALTER TABLE "_home_v_blocks_profiler" ADD COLUMN "labels_program_a_extra_grab_and_go" varchar;
  ALTER TABLE "_home_v_blocks_profiler" ADD COLUMN "labels_program_b_extra_coffee" varchar;
  ALTER TABLE "_home_v_blocks_profiler" ADD COLUMN "labels_program_b_extra_pantry" varchar;
  ALTER TABLE "_home_v_blocks_profiler" ADD COLUMN "labels_program_b_extra_cafeteria" varchar;
  ALTER TABLE "_home_v_blocks_profiler" ADD COLUMN "labels_program_b_fallback" varchar;
  ALTER TABLE "_home_v_blocks_profiler" ADD COLUMN "labels_plus_events" varchar;
  ALTER TABLE "_home_v_blocks_profiler" ADD COLUMN "labels_plus_fuel" varchar;
  ALTER TABLE "_home_v_blocks_profiler" ADD COLUMN "labels_growth_level1" varchar;
  ALTER TABLE "_home_v_blocks_profiler" ADD COLUMN "labels_growth_level2" varchar;
  ALTER TABLE "_home_v_blocks_profiler" ADD COLUMN "labels_growth_level3" varchar;
  ALTER TABLE "_home_v_blocks_profiler" ADD COLUMN "labels_growth_level4" varchar;
  ALTER TABLE "_home_v_blocks_stories_title_words" ADD COLUMN "_locale" "_locales" DEFAULT 'es' NOT NULL;
  ALTER TABLE "_home_v_blocks_stories_title_words" ADD COLUMN "text" varchar;
  ALTER TABLE "_home_v_blocks_stories" ADD COLUMN "_locale" "_locales" DEFAULT 'es' NOT NULL;
  ALTER TABLE "_home_v_blocks_stories" ADD COLUMN "kicker" varchar;
  ALTER TABLE "_home_v_blocks_stories" ADD COLUMN "title_aria_label" varchar;
  ALTER TABLE "_home_v_blocks_stories" ADD COLUMN "copy" varchar;
  ALTER TABLE "_home_v_blocks_stories" ADD COLUMN "cta_label" varchar;
  ALTER TABLE "_home_v_blocks_stories" ADD COLUMN "panel_cta_label" varchar;
  ALTER TABLE "_home_v_blocks_stories" ADD COLUMN "labels_tablist_aria_label" varchar;
  ALTER TABLE "_home_v_blocks_faq" ADD COLUMN "_locale" "_locales" DEFAULT 'es' NOT NULL;
  ALTER TABLE "_home_v_blocks_faq" ADD COLUMN "heading" varchar;
  ALTER TABLE "_home_v_blocks_faq" ADD COLUMN "cta_label" varchar;
  ALTER TABLE "_home_v_blocks_cta" ADD COLUMN "_locale" "_locales" DEFAULT 'es' NOT NULL;
  ALTER TABLE "_home_v_blocks_cta" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "_home_v_blocks_cta" ADD COLUMN "heading" varchar;
  ALTER TABLE "_home_v_blocks_cta" ADD COLUMN "copy" varchar;
  ALTER TABLE "_home_v_blocks_cta" ADD COLUMN "cta_primary_label" varchar;
  ALTER TABLE "_home_v_blocks_cta" ADD COLUMN "cta_secondary_label" varchar;
  ALTER TABLE "_home_v_rels" ADD COLUMN "locale" "_locales";
  CREATE INDEX "home_blocks_hero_primary_nav_locale_idx" ON "home_blocks_hero_primary_nav" USING btree ("_locale");
  CREATE INDEX "home_blocks_hero_locale_idx" ON "home_blocks_hero" USING btree ("_locale");
  CREATE INDEX "home_blocks_services_carousel_title_words_locale_idx" ON "home_blocks_services_carousel_title_words" USING btree ("_locale");
  CREATE INDEX "home_blocks_services_carousel_locale_idx" ON "home_blocks_services_carousel" USING btree ("_locale");
  CREATE INDEX "home_blocks_photo_card_locale_idx" ON "home_blocks_photo_card" USING btree ("_locale");
  CREATE INDEX "home_blocks_clock_card_locale_idx" ON "home_blocks_clock_card" USING btree ("_locale");
  CREATE INDEX "home_blocks_specialties_card_boxes_locale_idx" ON "home_blocks_specialties_card_boxes" USING btree ("_locale");
  CREATE INDEX "home_blocks_specialties_card_locale_idx" ON "home_blocks_specialties_card" USING btree ("_locale");
  CREATE INDEX "home_blocks_studies_card_locale_idx" ON "home_blocks_studies_card" USING btree ("_locale");
  CREATE INDEX "home_blocks_plain_card_locale_idx" ON "home_blocks_plain_card" USING btree ("_locale");
  CREATE INDEX "home_blocks_proof_bento_columns_locale_idx" ON "home_blocks_proof_bento_columns" USING btree ("_locale");
  CREATE INDEX "home_blocks_proof_bento_locale_idx" ON "home_blocks_proof_bento" USING btree ("_locale");
  CREATE INDEX "home_blocks_featured_media_locale_idx" ON "home_blocks_featured_media" USING btree ("_locale");
  CREATE INDEX "home_blocks_operating_system_title_words_locale_idx" ON "home_blocks_operating_system_title_words" USING btree ("_locale");
  CREATE INDEX "home_blocks_operating_system_tabs_locale_idx" ON "home_blocks_operating_system_tabs" USING btree ("_locale");
  CREATE INDEX "home_blocks_operating_system_locale_idx" ON "home_blocks_operating_system" USING btree ("_locale");
  CREATE INDEX "home_blocks_service_system_slider_layers_features_locale_idx" ON "home_blocks_service_system_slider_layers_features" USING btree ("_locale");
  CREATE INDEX "home_blocks_service_system_slider_layers_locale_idx" ON "home_blocks_service_system_slider_layers" USING btree ("_locale");
  CREATE INDEX "home_blocks_service_system_slider_locale_idx" ON "home_blocks_service_system_slider" USING btree ("_locale");
  CREATE INDEX "home_blocks_profiler_labels_program_a_recommendations_locale_idx" ON "home_blocks_profiler_labels_program_a_recommendations" USING btree ("_locale");
  CREATE INDEX "home_blocks_profiler_labels_program_b_recommendations_locale_idx" ON "home_blocks_profiler_labels_program_b_recommendations" USING btree ("_locale");
  CREATE INDEX "home_blocks_profiler_labels_program_c_recommendations_locale_idx" ON "home_blocks_profiler_labels_program_c_recommendations" USING btree ("_locale");
  CREATE INDEX "home_blocks_profiler_volume_options_locale_idx" ON "home_blocks_profiler_volume_options" USING btree ("_locale");
  CREATE INDEX "home_blocks_profiler_jobs_locale_idx" ON "home_blocks_profiler_jobs" USING btree ("_locale");
  CREATE INDEX "home_blocks_profiler_needs_locale_idx" ON "home_blocks_profiler_needs" USING btree ("_locale");
  CREATE INDEX "home_blocks_profiler_locale_idx" ON "home_blocks_profiler" USING btree ("_locale");
  CREATE INDEX "home_blocks_stories_title_words_locale_idx" ON "home_blocks_stories_title_words" USING btree ("_locale");
  CREATE INDEX "home_blocks_stories_locale_idx" ON "home_blocks_stories" USING btree ("_locale");
  CREATE INDEX "home_blocks_faq_locale_idx" ON "home_blocks_faq" USING btree ("_locale");
  CREATE INDEX "home_blocks_cta_locale_idx" ON "home_blocks_cta" USING btree ("_locale");
  CREATE INDEX "home_rels_locale_idx" ON "home_rels" USING btree ("locale");
  CREATE INDEX "_home_v_blocks_hero_primary_nav_locale_idx" ON "_home_v_blocks_hero_primary_nav" USING btree ("_locale");
  CREATE INDEX "_home_v_blocks_hero_locale_idx" ON "_home_v_blocks_hero" USING btree ("_locale");
  CREATE INDEX "_home_v_blocks_services_carousel_title_words_locale_idx" ON "_home_v_blocks_services_carousel_title_words" USING btree ("_locale");
  CREATE INDEX "_home_v_blocks_services_carousel_locale_idx" ON "_home_v_blocks_services_carousel" USING btree ("_locale");
  CREATE INDEX "_home_v_blocks_photo_card_locale_idx" ON "_home_v_blocks_photo_card" USING btree ("_locale");
  CREATE INDEX "_home_v_blocks_clock_card_locale_idx" ON "_home_v_blocks_clock_card" USING btree ("_locale");
  CREATE INDEX "_home_v_blocks_specialties_card_boxes_locale_idx" ON "_home_v_blocks_specialties_card_boxes" USING btree ("_locale");
  CREATE INDEX "_home_v_blocks_specialties_card_locale_idx" ON "_home_v_blocks_specialties_card" USING btree ("_locale");
  CREATE INDEX "_home_v_blocks_studies_card_locale_idx" ON "_home_v_blocks_studies_card" USING btree ("_locale");
  CREATE INDEX "_home_v_blocks_plain_card_locale_idx" ON "_home_v_blocks_plain_card" USING btree ("_locale");
  CREATE INDEX "_home_v_blocks_proof_bento_columns_locale_idx" ON "_home_v_blocks_proof_bento_columns" USING btree ("_locale");
  CREATE INDEX "_home_v_blocks_proof_bento_locale_idx" ON "_home_v_blocks_proof_bento" USING btree ("_locale");
  CREATE INDEX "_home_v_blocks_featured_media_locale_idx" ON "_home_v_blocks_featured_media" USING btree ("_locale");
  CREATE INDEX "_home_v_blocks_operating_system_title_words_locale_idx" ON "_home_v_blocks_operating_system_title_words" USING btree ("_locale");
  CREATE INDEX "_home_v_blocks_operating_system_tabs_locale_idx" ON "_home_v_blocks_operating_system_tabs" USING btree ("_locale");
  CREATE INDEX "_home_v_blocks_operating_system_locale_idx" ON "_home_v_blocks_operating_system" USING btree ("_locale");
  CREATE INDEX "_home_v_blocks_service_system_slider_layers_features_locale_idx" ON "_home_v_blocks_service_system_slider_layers_features" USING btree ("_locale");
  CREATE INDEX "_home_v_blocks_service_system_slider_layers_locale_idx" ON "_home_v_blocks_service_system_slider_layers" USING btree ("_locale");
  CREATE INDEX "_home_v_blocks_service_system_slider_locale_idx" ON "_home_v_blocks_service_system_slider" USING btree ("_locale");
  CREATE INDEX "_home_v_blocks_profiler_labels_program_a_recommendations_locale_idx" ON "_home_v_blocks_profiler_labels_program_a_recommendations" USING btree ("_locale");
  CREATE INDEX "_home_v_blocks_profiler_labels_program_b_recommendations_locale_idx" ON "_home_v_blocks_profiler_labels_program_b_recommendations" USING btree ("_locale");
  CREATE INDEX "_home_v_blocks_profiler_labels_program_c_recommendations_locale_idx" ON "_home_v_blocks_profiler_labels_program_c_recommendations" USING btree ("_locale");
  CREATE INDEX "_home_v_blocks_profiler_volume_options_locale_idx" ON "_home_v_blocks_profiler_volume_options" USING btree ("_locale");
  CREATE INDEX "_home_v_blocks_profiler_jobs_locale_idx" ON "_home_v_blocks_profiler_jobs" USING btree ("_locale");
  CREATE INDEX "_home_v_blocks_profiler_needs_locale_idx" ON "_home_v_blocks_profiler_needs" USING btree ("_locale");
  CREATE INDEX "_home_v_blocks_profiler_locale_idx" ON "_home_v_blocks_profiler" USING btree ("_locale");
  CREATE INDEX "_home_v_blocks_stories_title_words_locale_idx" ON "_home_v_blocks_stories_title_words" USING btree ("_locale");
  CREATE INDEX "_home_v_blocks_stories_locale_idx" ON "_home_v_blocks_stories" USING btree ("_locale");
  CREATE INDEX "_home_v_blocks_faq_locale_idx" ON "_home_v_blocks_faq" USING btree ("_locale");
  CREATE INDEX "_home_v_blocks_cta_locale_idx" ON "_home_v_blocks_cta" USING btree ("_locale");
  CREATE INDEX "_home_v_rels_locale_idx" ON "_home_v_rels" USING btree ("locale");
  CREATE INDEX "home_rels_logos_id_idx" ON "home_rels" USING btree ("logos_id","locale");
  CREATE INDEX "home_rels_services_id_idx" ON "home_rels" USING btree ("services_id","locale");
  CREATE INDEX "home_rels_stories_id_idx" ON "home_rels" USING btree ("stories_id","locale");
  CREATE INDEX "home_rels_faqs_id_idx" ON "home_rels" USING btree ("faqs_id","locale");
  CREATE INDEX "_home_v_rels_logos_id_idx" ON "_home_v_rels" USING btree ("logos_id","locale");
  CREATE INDEX "_home_v_rels_services_id_idx" ON "_home_v_rels" USING btree ("services_id","locale");
  CREATE INDEX "_home_v_rels_stories_id_idx" ON "_home_v_rels" USING btree ("stories_id","locale");
  CREATE INDEX "_home_v_rels_faqs_id_idx" ON "_home_v_rels" USING btree ("faqs_id","locale");
  TRUNCATE TABLE "_home_v_blocks_clock_card", "_home_v_blocks_cta", "_home_v_blocks_faq", "_home_v_blocks_featured_media", "_home_v_blocks_hero", "_home_v_blocks_hero_primary_nav", "_home_v_blocks_operating_system", "_home_v_blocks_operating_system_tabs", "_home_v_blocks_operating_system_title_words", "_home_v_blocks_photo_card", "_home_v_blocks_plain_card", "_home_v_blocks_profiler", "_home_v_blocks_profiler_jobs", "_home_v_blocks_profiler_labels_program_a_recommendations", "_home_v_blocks_profiler_labels_program_b_recommendations", "_home_v_blocks_profiler_labels_program_c_recommendations", "_home_v_blocks_profiler_needs", "_home_v_blocks_profiler_volume_options", "_home_v_blocks_proof_bento", "_home_v_blocks_proof_bento_columns", "_home_v_blocks_service_system_slider", "_home_v_blocks_service_system_slider_layers", "_home_v_blocks_service_system_slider_layers_features", "_home_v_blocks_services_carousel", "_home_v_blocks_services_carousel_title_words", "_home_v_blocks_specialties_card", "_home_v_blocks_specialties_card_boxes", "_home_v_blocks_stories", "_home_v_blocks_stories_title_words", "_home_v_blocks_studies_card", "_home_v_rels", "home_blocks_clock_card", "home_blocks_cta", "home_blocks_faq", "home_blocks_featured_media", "home_blocks_hero", "home_blocks_hero_primary_nav", "home_blocks_operating_system", "home_blocks_operating_system_tabs", "home_blocks_operating_system_title_words", "home_blocks_photo_card", "home_blocks_plain_card", "home_blocks_profiler", "home_blocks_profiler_jobs", "home_blocks_profiler_labels_program_a_recommendations", "home_blocks_profiler_labels_program_b_recommendations", "home_blocks_profiler_labels_program_c_recommendations", "home_blocks_profiler_needs", "home_blocks_profiler_volume_options", "home_blocks_proof_bento", "home_blocks_proof_bento_columns", "home_blocks_service_system_slider", "home_blocks_service_system_slider_layers", "home_blocks_service_system_slider_layers_features", "home_blocks_services_carousel", "home_blocks_services_carousel_title_words", "home_blocks_specialties_card", "home_blocks_specialties_card_boxes", "home_blocks_stories", "home_blocks_stories_title_words", "home_blocks_studies_card", "home_rels" RESTART IDENTITY CASCADE;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "home_blocks_hero_primary_nav_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
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
  
  CREATE TABLE "home_blocks_services_carousel_title_words_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
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
  
  CREATE TABLE "home_blocks_photo_card_locales" (
  	"title" varchar,
  	"sub" varchar,
  	"alt" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_blocks_clock_card_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_blocks_specialties_card_boxes_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_blocks_specialties_card_locales" (
  	"title" varchar,
  	"sub" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_blocks_studies_card_locales" (
  	"title" varchar,
  	"alt" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_blocks_plain_card_locales" (
  	"title" varchar,
  	"sub" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
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
  
  CREATE TABLE "home_blocks_featured_media_locales" (
  	"label" varchar,
  	"aria_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_blocks_operating_system_title_words_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
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
  
  CREATE TABLE "home_blocks_service_system_slider_layers_features_locales" (
  	"title" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_blocks_service_system_slider_layers_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
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
  
  CREATE TABLE "home_blocks_profiler_labels_program_a_recommendations_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_blocks_profiler_labels_program_b_recommendations_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_blocks_profiler_labels_program_c_recommendations_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_blocks_profiler_volume_options_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_blocks_profiler_jobs_locales" (
  	"title" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_blocks_profiler_needs_locales" (
  	"title" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
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
  
  CREATE TABLE "home_blocks_stories_title_words_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
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
  
  CREATE TABLE "home_blocks_faq_locales" (
  	"heading" varchar,
  	"cta_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
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
  
  CREATE TABLE "_home_v_blocks_hero_primary_nav_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
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
  
  CREATE TABLE "_home_v_blocks_services_carousel_title_words_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
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
  
  CREATE TABLE "_home_v_blocks_photo_card_locales" (
  	"title" varchar,
  	"sub" varchar,
  	"alt" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_v_blocks_clock_card_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_v_blocks_specialties_card_boxes_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_v_blocks_specialties_card_locales" (
  	"title" varchar,
  	"sub" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_v_blocks_studies_card_locales" (
  	"title" varchar,
  	"alt" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_v_blocks_plain_card_locales" (
  	"title" varchar,
  	"sub" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
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
  
  CREATE TABLE "_home_v_blocks_featured_media_locales" (
  	"label" varchar,
  	"aria_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_v_blocks_operating_system_title_words_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
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
  
  CREATE TABLE "_home_v_blocks_service_system_slider_layers_features_locales" (
  	"title" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_v_blocks_service_system_slider_layers_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
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
  
  CREATE TABLE "_home_v_blocks_profiler_labels_program_a_recommendations_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_v_blocks_profiler_labels_program_b_recommendations_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_v_blocks_profiler_labels_program_c_recommendations_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_v_blocks_profiler_volume_options_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_v_blocks_profiler_jobs_locales" (
  	"title" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_v_blocks_profiler_needs_locales" (
  	"title" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
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
  
  CREATE TABLE "_home_v_blocks_stories_title_words_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
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
  
  CREATE TABLE "_home_v_blocks_faq_locales" (
  	"heading" varchar,
  	"cta_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
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
  
  DROP INDEX "home_blocks_hero_primary_nav_locale_idx";
  DROP INDEX "home_blocks_hero_locale_idx";
  DROP INDEX "home_blocks_services_carousel_title_words_locale_idx";
  DROP INDEX "home_blocks_services_carousel_locale_idx";
  DROP INDEX "home_blocks_photo_card_locale_idx";
  DROP INDEX "home_blocks_clock_card_locale_idx";
  DROP INDEX "home_blocks_specialties_card_boxes_locale_idx";
  DROP INDEX "home_blocks_specialties_card_locale_idx";
  DROP INDEX "home_blocks_studies_card_locale_idx";
  DROP INDEX "home_blocks_plain_card_locale_idx";
  DROP INDEX "home_blocks_proof_bento_columns_locale_idx";
  DROP INDEX "home_blocks_proof_bento_locale_idx";
  DROP INDEX "home_blocks_featured_media_locale_idx";
  DROP INDEX "home_blocks_operating_system_title_words_locale_idx";
  DROP INDEX "home_blocks_operating_system_tabs_locale_idx";
  DROP INDEX "home_blocks_operating_system_locale_idx";
  DROP INDEX "home_blocks_service_system_slider_layers_features_locale_idx";
  DROP INDEX "home_blocks_service_system_slider_layers_locale_idx";
  DROP INDEX "home_blocks_service_system_slider_locale_idx";
  DROP INDEX "home_blocks_profiler_labels_program_a_recommendations_locale_idx";
  DROP INDEX "home_blocks_profiler_labels_program_b_recommendations_locale_idx";
  DROP INDEX "home_blocks_profiler_labels_program_c_recommendations_locale_idx";
  DROP INDEX "home_blocks_profiler_volume_options_locale_idx";
  DROP INDEX "home_blocks_profiler_jobs_locale_idx";
  DROP INDEX "home_blocks_profiler_needs_locale_idx";
  DROP INDEX "home_blocks_profiler_locale_idx";
  DROP INDEX "home_blocks_stories_title_words_locale_idx";
  DROP INDEX "home_blocks_stories_locale_idx";
  DROP INDEX "home_blocks_faq_locale_idx";
  DROP INDEX "home_blocks_cta_locale_idx";
  DROP INDEX "home_rels_locale_idx";
  DROP INDEX "_home_v_blocks_hero_primary_nav_locale_idx";
  DROP INDEX "_home_v_blocks_hero_locale_idx";
  DROP INDEX "_home_v_blocks_services_carousel_title_words_locale_idx";
  DROP INDEX "_home_v_blocks_services_carousel_locale_idx";
  DROP INDEX "_home_v_blocks_photo_card_locale_idx";
  DROP INDEX "_home_v_blocks_clock_card_locale_idx";
  DROP INDEX "_home_v_blocks_specialties_card_boxes_locale_idx";
  DROP INDEX "_home_v_blocks_specialties_card_locale_idx";
  DROP INDEX "_home_v_blocks_studies_card_locale_idx";
  DROP INDEX "_home_v_blocks_plain_card_locale_idx";
  DROP INDEX "_home_v_blocks_proof_bento_columns_locale_idx";
  DROP INDEX "_home_v_blocks_proof_bento_locale_idx";
  DROP INDEX "_home_v_blocks_featured_media_locale_idx";
  DROP INDEX "_home_v_blocks_operating_system_title_words_locale_idx";
  DROP INDEX "_home_v_blocks_operating_system_tabs_locale_idx";
  DROP INDEX "_home_v_blocks_operating_system_locale_idx";
  DROP INDEX "_home_v_blocks_service_system_slider_layers_features_locale_idx";
  DROP INDEX "_home_v_blocks_service_system_slider_layers_locale_idx";
  DROP INDEX "_home_v_blocks_service_system_slider_locale_idx";
  DROP INDEX "_home_v_blocks_profiler_labels_program_a_recommendations_locale_idx";
  DROP INDEX "_home_v_blocks_profiler_labels_program_b_recommendations_locale_idx";
  DROP INDEX "_home_v_blocks_profiler_labels_program_c_recommendations_locale_idx";
  DROP INDEX "_home_v_blocks_profiler_volume_options_locale_idx";
  DROP INDEX "_home_v_blocks_profiler_jobs_locale_idx";
  DROP INDEX "_home_v_blocks_profiler_needs_locale_idx";
  DROP INDEX "_home_v_blocks_profiler_locale_idx";
  DROP INDEX "_home_v_blocks_stories_title_words_locale_idx";
  DROP INDEX "_home_v_blocks_stories_locale_idx";
  DROP INDEX "_home_v_blocks_faq_locale_idx";
  DROP INDEX "_home_v_blocks_cta_locale_idx";
  DROP INDEX "_home_v_rels_locale_idx";
  DROP INDEX "home_rels_logos_id_idx";
  DROP INDEX "home_rels_services_id_idx";
  DROP INDEX "home_rels_stories_id_idx";
  DROP INDEX "home_rels_faqs_id_idx";
  DROP INDEX "_home_v_rels_logos_id_idx";
  DROP INDEX "_home_v_rels_services_id_idx";
  DROP INDEX "_home_v_rels_stories_id_idx";
  DROP INDEX "_home_v_rels_faqs_id_idx";
  ALTER TABLE "home_blocks_hero_primary_nav_locales" ADD CONSTRAINT "home_blocks_hero_primary_nav_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_hero_primary_nav"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_hero_locales" ADD CONSTRAINT "home_blocks_hero_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_services_carousel_title_words_locales" ADD CONSTRAINT "home_blocks_services_carousel_title_words_locales_parent__fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_services_carousel_title_words"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_services_carousel_locales" ADD CONSTRAINT "home_blocks_services_carousel_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_services_carousel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_photo_card_locales" ADD CONSTRAINT "home_blocks_photo_card_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_photo_card"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_clock_card_locales" ADD CONSTRAINT "home_blocks_clock_card_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_clock_card"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_specialties_card_boxes_locales" ADD CONSTRAINT "home_blocks_specialties_card_boxes_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_specialties_card_boxes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_specialties_card_locales" ADD CONSTRAINT "home_blocks_specialties_card_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_specialties_card"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_studies_card_locales" ADD CONSTRAINT "home_blocks_studies_card_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_studies_card"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_plain_card_locales" ADD CONSTRAINT "home_blocks_plain_card_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_plain_card"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_proof_bento_locales" ADD CONSTRAINT "home_blocks_proof_bento_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_proof_bento"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_featured_media_locales" ADD CONSTRAINT "home_blocks_featured_media_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_featured_media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_operating_system_title_words_locales" ADD CONSTRAINT "home_blocks_operating_system_title_words_locales_parent_i_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_operating_system_title_words"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_operating_system_tabs_locales" ADD CONSTRAINT "home_blocks_operating_system_tabs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_operating_system_tabs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_operating_system_locales" ADD CONSTRAINT "home_blocks_operating_system_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_operating_system"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_service_system_slider_layers_features_locales" ADD CONSTRAINT "home_blocks_service_system_slider_layers_features_locales_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_service_system_slider_layers_features"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_service_system_slider_layers_locales" ADD CONSTRAINT "home_blocks_service_system_slider_layers_locales_parent_i_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_service_system_slider_layers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_service_system_slider_locales" ADD CONSTRAINT "home_blocks_service_system_slider_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_service_system_slider"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_profiler_labels_program_a_recommendations_locales" ADD CONSTRAINT "home_blocks_profiler_labels_program_a_recommendations_loc_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_profiler_labels_program_a_recommendations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_profiler_labels_program_b_recommendations_locales" ADD CONSTRAINT "home_blocks_profiler_labels_program_b_recommendations_loc_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_profiler_labels_program_b_recommendations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_profiler_labels_program_c_recommendations_locales" ADD CONSTRAINT "home_blocks_profiler_labels_program_c_recommendations_loc_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_profiler_labels_program_c_recommendations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_profiler_volume_options_locales" ADD CONSTRAINT "home_blocks_profiler_volume_options_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_profiler_volume_options"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_profiler_jobs_locales" ADD CONSTRAINT "home_blocks_profiler_jobs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_profiler_jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_profiler_needs_locales" ADD CONSTRAINT "home_blocks_profiler_needs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_profiler_needs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_profiler_locales" ADD CONSTRAINT "home_blocks_profiler_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_profiler"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_stories_title_words_locales" ADD CONSTRAINT "home_blocks_stories_title_words_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_stories_title_words"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_stories_locales" ADD CONSTRAINT "home_blocks_stories_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_stories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_faq_locales" ADD CONSTRAINT "home_blocks_faq_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_cta_locales" ADD CONSTRAINT "home_blocks_cta_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_hero_primary_nav_locales" ADD CONSTRAINT "_home_v_blocks_hero_primary_nav_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_hero_primary_nav"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_hero_locales" ADD CONSTRAINT "_home_v_blocks_hero_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_services_carousel_title_words_locales" ADD CONSTRAINT "_home_v_blocks_services_carousel_title_words_locales_pare_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_services_carousel_title_words"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_services_carousel_locales" ADD CONSTRAINT "_home_v_blocks_services_carousel_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_services_carousel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_photo_card_locales" ADD CONSTRAINT "_home_v_blocks_photo_card_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_photo_card"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_clock_card_locales" ADD CONSTRAINT "_home_v_blocks_clock_card_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_clock_card"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_specialties_card_boxes_locales" ADD CONSTRAINT "_home_v_blocks_specialties_card_boxes_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_specialties_card_boxes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_specialties_card_locales" ADD CONSTRAINT "_home_v_blocks_specialties_card_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_specialties_card"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_studies_card_locales" ADD CONSTRAINT "_home_v_blocks_studies_card_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_studies_card"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_plain_card_locales" ADD CONSTRAINT "_home_v_blocks_plain_card_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_plain_card"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_proof_bento_locales" ADD CONSTRAINT "_home_v_blocks_proof_bento_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_proof_bento"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_featured_media_locales" ADD CONSTRAINT "_home_v_blocks_featured_media_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_featured_media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_operating_system_title_words_locales" ADD CONSTRAINT "_home_v_blocks_operating_system_title_words_locales_paren_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_operating_system_title_words"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_operating_system_tabs_locales" ADD CONSTRAINT "_home_v_blocks_operating_system_tabs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_operating_system_tabs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_operating_system_locales" ADD CONSTRAINT "_home_v_blocks_operating_system_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_operating_system"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_service_system_slider_layers_features_locales" ADD CONSTRAINT "_home_v_blocks_service_system_slider_layers_features_loca_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_service_system_slider_layers_features"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_service_system_slider_layers_locales" ADD CONSTRAINT "_home_v_blocks_service_system_slider_layers_locales_paren_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_service_system_slider_layers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_service_system_slider_locales" ADD CONSTRAINT "_home_v_blocks_service_system_slider_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_service_system_slider"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_profiler_labels_program_a_recommendations_locales" ADD CONSTRAINT "_home_v_blocks_profiler_labels_program_a_recommendations__fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_profiler_labels_program_a_recommendations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_profiler_labels_program_b_recommendations_locales" ADD CONSTRAINT "_home_v_blocks_profiler_labels_program_b_recommendations__fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_profiler_labels_program_b_recommendations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_profiler_labels_program_c_recommendations_locales" ADD CONSTRAINT "_home_v_blocks_profiler_labels_program_c_recommendations__fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_profiler_labels_program_c_recommendations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_profiler_volume_options_locales" ADD CONSTRAINT "_home_v_blocks_profiler_volume_options_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_profiler_volume_options"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_profiler_jobs_locales" ADD CONSTRAINT "_home_v_blocks_profiler_jobs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_profiler_jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_profiler_needs_locales" ADD CONSTRAINT "_home_v_blocks_profiler_needs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_profiler_needs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_profiler_locales" ADD CONSTRAINT "_home_v_blocks_profiler_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_profiler"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_stories_title_words_locales" ADD CONSTRAINT "_home_v_blocks_stories_title_words_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_stories_title_words"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_stories_locales" ADD CONSTRAINT "_home_v_blocks_stories_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_stories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_faq_locales" ADD CONSTRAINT "_home_v_blocks_faq_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_cta_locales" ADD CONSTRAINT "_home_v_blocks_cta_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "home_blocks_hero_primary_nav_locales_locale_parent_id_unique" ON "home_blocks_hero_primary_nav_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "home_blocks_hero_locales_locale_parent_id_unique" ON "home_blocks_hero_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "home_blocks_services_carousel_title_words_locales_locale_par" ON "home_blocks_services_carousel_title_words_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "home_blocks_services_carousel_locales_locale_parent_id_uniqu" ON "home_blocks_services_carousel_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "home_blocks_photo_card_locales_locale_parent_id_unique" ON "home_blocks_photo_card_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "home_blocks_clock_card_locales_locale_parent_id_unique" ON "home_blocks_clock_card_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "home_blocks_specialties_card_boxes_locales_locale_parent_id_" ON "home_blocks_specialties_card_boxes_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "home_blocks_specialties_card_locales_locale_parent_id_unique" ON "home_blocks_specialties_card_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "home_blocks_studies_card_locales_locale_parent_id_unique" ON "home_blocks_studies_card_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "home_blocks_plain_card_locales_locale_parent_id_unique" ON "home_blocks_plain_card_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "home_blocks_proof_bento_locales_locale_parent_id_unique" ON "home_blocks_proof_bento_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "home_blocks_featured_media_locales_locale_parent_id_unique" ON "home_blocks_featured_media_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "home_blocks_operating_system_title_words_locales_locale_pare" ON "home_blocks_operating_system_title_words_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "home_blocks_operating_system_tabs_locales_locale_parent_id_u" ON "home_blocks_operating_system_tabs_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "home_blocks_operating_system_locales_locale_parent_id_unique" ON "home_blocks_operating_system_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "home_blocks_service_system_slider_layers_features_locales_lo" ON "home_blocks_service_system_slider_layers_features_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "home_blocks_service_system_slider_layers_locales_locale_pare" ON "home_blocks_service_system_slider_layers_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "home_blocks_service_system_slider_locales_locale_parent_id_u" ON "home_blocks_service_system_slider_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "home_blocks_profiler_labels_program_a_recommendations_locale" ON "home_blocks_profiler_labels_program_a_recommendations_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "home_blocks_profiler_labels_program_b_recommendations_locale" ON "home_blocks_profiler_labels_program_b_recommendations_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "home_blocks_profiler_labels_program_c_recommendations_locale" ON "home_blocks_profiler_labels_program_c_recommendations_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "home_blocks_profiler_volume_options_locales_locale_parent_id" ON "home_blocks_profiler_volume_options_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "home_blocks_profiler_jobs_locales_locale_parent_id_unique" ON "home_blocks_profiler_jobs_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "home_blocks_profiler_needs_locales_locale_parent_id_unique" ON "home_blocks_profiler_needs_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "home_blocks_profiler_locales_locale_parent_id_unique" ON "home_blocks_profiler_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "home_blocks_stories_title_words_locales_locale_parent_id_uni" ON "home_blocks_stories_title_words_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "home_blocks_stories_locales_locale_parent_id_unique" ON "home_blocks_stories_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "home_blocks_faq_locales_locale_parent_id_unique" ON "home_blocks_faq_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "home_blocks_cta_locales_locale_parent_id_unique" ON "home_blocks_cta_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_home_v_blocks_hero_primary_nav_locales_locale_parent_id_uni" ON "_home_v_blocks_hero_primary_nav_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_home_v_blocks_hero_locales_locale_parent_id_unique" ON "_home_v_blocks_hero_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_home_v_blocks_services_carousel_title_words_locales_locale_" ON "_home_v_blocks_services_carousel_title_words_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_home_v_blocks_services_carousel_locales_locale_parent_id_un" ON "_home_v_blocks_services_carousel_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_home_v_blocks_photo_card_locales_locale_parent_id_unique" ON "_home_v_blocks_photo_card_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_home_v_blocks_clock_card_locales_locale_parent_id_unique" ON "_home_v_blocks_clock_card_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_home_v_blocks_specialties_card_boxes_locales_locale_parent_" ON "_home_v_blocks_specialties_card_boxes_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_home_v_blocks_specialties_card_locales_locale_parent_id_uni" ON "_home_v_blocks_specialties_card_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_home_v_blocks_studies_card_locales_locale_parent_id_unique" ON "_home_v_blocks_studies_card_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_home_v_blocks_plain_card_locales_locale_parent_id_unique" ON "_home_v_blocks_plain_card_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_home_v_blocks_proof_bento_locales_locale_parent_id_unique" ON "_home_v_blocks_proof_bento_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_home_v_blocks_featured_media_locales_locale_parent_id_uniqu" ON "_home_v_blocks_featured_media_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_home_v_blocks_operating_system_title_words_locales_locale_p" ON "_home_v_blocks_operating_system_title_words_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_home_v_blocks_operating_system_tabs_locales_locale_parent_i" ON "_home_v_blocks_operating_system_tabs_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_home_v_blocks_operating_system_locales_locale_parent_id_uni" ON "_home_v_blocks_operating_system_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_home_v_blocks_service_system_slider_layers_features_local_1" ON "_home_v_blocks_service_system_slider_layers_features_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_home_v_blocks_service_system_slider_layers_locales_locale_p" ON "_home_v_blocks_service_system_slider_layers_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_home_v_blocks_service_system_slider_locales_locale_parent_i" ON "_home_v_blocks_service_system_slider_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_home_v_blocks_profiler_labels_program_a_recommendations_loc" ON "_home_v_blocks_profiler_labels_program_a_recommendations_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_home_v_blocks_profiler_labels_program_b_recommendations_loc" ON "_home_v_blocks_profiler_labels_program_b_recommendations_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_home_v_blocks_profiler_labels_program_c_recommendations_loc" ON "_home_v_blocks_profiler_labels_program_c_recommendations_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_home_v_blocks_profiler_volume_options_locales_locale_parent" ON "_home_v_blocks_profiler_volume_options_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_home_v_blocks_profiler_jobs_locales_locale_parent_id_unique" ON "_home_v_blocks_profiler_jobs_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_home_v_blocks_profiler_needs_locales_locale_parent_id_uniqu" ON "_home_v_blocks_profiler_needs_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_home_v_blocks_profiler_locales_locale_parent_id_unique" ON "_home_v_blocks_profiler_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_home_v_blocks_stories_title_words_locales_locale_parent_id_" ON "_home_v_blocks_stories_title_words_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_home_v_blocks_stories_locales_locale_parent_id_unique" ON "_home_v_blocks_stories_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_home_v_blocks_faq_locales_locale_parent_id_unique" ON "_home_v_blocks_faq_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_home_v_blocks_cta_locales_locale_parent_id_unique" ON "_home_v_blocks_cta_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_rels_logos_id_idx" ON "home_rels" USING btree ("logos_id");
  CREATE INDEX "home_rels_services_id_idx" ON "home_rels" USING btree ("services_id");
  CREATE INDEX "home_rels_stories_id_idx" ON "home_rels" USING btree ("stories_id");
  CREATE INDEX "home_rels_faqs_id_idx" ON "home_rels" USING btree ("faqs_id");
  CREATE INDEX "_home_v_rels_logos_id_idx" ON "_home_v_rels" USING btree ("logos_id");
  CREATE INDEX "_home_v_rels_services_id_idx" ON "_home_v_rels" USING btree ("services_id");
  CREATE INDEX "_home_v_rels_stories_id_idx" ON "_home_v_rels" USING btree ("stories_id");
  CREATE INDEX "_home_v_rels_faqs_id_idx" ON "_home_v_rels" USING btree ("faqs_id");
  ALTER TABLE "home_blocks_hero_primary_nav" DROP COLUMN "_locale";
  ALTER TABLE "home_blocks_hero_primary_nav" DROP COLUMN "link_label";
  ALTER TABLE "home_blocks_hero" DROP COLUMN "_locale";
  ALTER TABLE "home_blocks_hero" DROP COLUMN "title";
  ALTER TABLE "home_blocks_hero" DROP COLUMN "copy";
  ALTER TABLE "home_blocks_hero" DROP COLUMN "cta_label";
  ALTER TABLE "home_blocks_hero" DROP COLUMN "ribbon_label";
  ALTER TABLE "home_blocks_hero" DROP COLUMN "nav_aria_label";
  ALTER TABLE "home_blocks_hero" DROP COLUMN "mobile_nav_aria_label";
  ALTER TABLE "home_blocks_hero" DROP COLUMN "menu_open_label";
  ALTER TABLE "home_blocks_hero" DROP COLUMN "menu_close_label";
  ALTER TABLE "home_blocks_hero" DROP COLUMN "marquee_aria_label";
  ALTER TABLE "home_blocks_services_carousel_title_words" DROP COLUMN "_locale";
  ALTER TABLE "home_blocks_services_carousel_title_words" DROP COLUMN "text";
  ALTER TABLE "home_blocks_services_carousel" DROP COLUMN "_locale";
  ALTER TABLE "home_blocks_services_carousel" DROP COLUMN "kicker";
  ALTER TABLE "home_blocks_services_carousel" DROP COLUMN "title_aria_label";
  ALTER TABLE "home_blocks_services_carousel" DROP COLUMN "copy";
  ALTER TABLE "home_blocks_services_carousel" DROP COLUMN "cta_primary_label";
  ALTER TABLE "home_blocks_services_carousel" DROP COLUMN "cta_secondary_label";
  ALTER TABLE "home_blocks_services_carousel" DROP COLUMN "labels_region_label";
  ALTER TABLE "home_blocks_services_carousel" DROP COLUMN "labels_previous";
  ALTER TABLE "home_blocks_services_carousel" DROP COLUMN "labels_next";
  ALTER TABLE "home_blocks_services_carousel" DROP COLUMN "labels_progress_label";
  ALTER TABLE "home_blocks_services_carousel" DROP COLUMN "labels_slide_template";
  ALTER TABLE "home_blocks_photo_card" DROP COLUMN "_locale";
  ALTER TABLE "home_blocks_photo_card" DROP COLUMN "title";
  ALTER TABLE "home_blocks_photo_card" DROP COLUMN "sub";
  ALTER TABLE "home_blocks_photo_card" DROP COLUMN "alt";
  ALTER TABLE "home_blocks_clock_card" DROP COLUMN "_locale";
  ALTER TABLE "home_blocks_clock_card" DROP COLUMN "title";
  ALTER TABLE "home_blocks_specialties_card_boxes" DROP COLUMN "_locale";
  ALTER TABLE "home_blocks_specialties_card_boxes" DROP COLUMN "label";
  ALTER TABLE "home_blocks_specialties_card" DROP COLUMN "_locale";
  ALTER TABLE "home_blocks_specialties_card" DROP COLUMN "title";
  ALTER TABLE "home_blocks_specialties_card" DROP COLUMN "sub";
  ALTER TABLE "home_blocks_studies_card" DROP COLUMN "_locale";
  ALTER TABLE "home_blocks_studies_card" DROP COLUMN "title";
  ALTER TABLE "home_blocks_studies_card" DROP COLUMN "alt";
  ALTER TABLE "home_blocks_plain_card" DROP COLUMN "_locale";
  ALTER TABLE "home_blocks_plain_card" DROP COLUMN "title";
  ALTER TABLE "home_blocks_plain_card" DROP COLUMN "sub";
  ALTER TABLE "home_blocks_proof_bento_columns" DROP COLUMN "_locale";
  ALTER TABLE "home_blocks_proof_bento" DROP COLUMN "_locale";
  ALTER TABLE "home_blocks_proof_bento" DROP COLUMN "heading_aria_label";
  ALTER TABLE "home_blocks_proof_bento" DROP COLUMN "heading_lead";
  ALTER TABLE "home_blocks_proof_bento" DROP COLUMN "heading_accent";
  ALTER TABLE "home_blocks_proof_bento" DROP COLUMN "copy";
  ALTER TABLE "home_blocks_featured_media" DROP COLUMN "_locale";
  ALTER TABLE "home_blocks_featured_media" DROP COLUMN "label";
  ALTER TABLE "home_blocks_featured_media" DROP COLUMN "aria_label";
  ALTER TABLE "home_blocks_operating_system_title_words" DROP COLUMN "_locale";
  ALTER TABLE "home_blocks_operating_system_title_words" DROP COLUMN "text";
  ALTER TABLE "home_blocks_operating_system_tabs" DROP COLUMN "_locale";
  ALTER TABLE "home_blocks_operating_system_tabs" DROP COLUMN "title";
  ALTER TABLE "home_blocks_operating_system_tabs" DROP COLUMN "copy";
  ALTER TABLE "home_blocks_operating_system_tabs" DROP COLUMN "panel_title";
  ALTER TABLE "home_blocks_operating_system_tabs" DROP COLUMN "panel_copy";
  ALTER TABLE "home_blocks_operating_system" DROP COLUMN "_locale";
  ALTER TABLE "home_blocks_operating_system" DROP COLUMN "kicker";
  ALTER TABLE "home_blocks_operating_system" DROP COLUMN "title_aria_label";
  ALTER TABLE "home_blocks_operating_system" DROP COLUMN "copy";
  ALTER TABLE "home_blocks_operating_system" DROP COLUMN "labels_section_label";
  ALTER TABLE "home_blocks_operating_system" DROP COLUMN "labels_list_aria_label";
  ALTER TABLE "home_blocks_service_system_slider_layers_features" DROP COLUMN "_locale";
  ALTER TABLE "home_blocks_service_system_slider_layers_features" DROP COLUMN "title";
  ALTER TABLE "home_blocks_service_system_slider_layers_features" DROP COLUMN "text";
  ALTER TABLE "home_blocks_service_system_slider_layers" DROP COLUMN "_locale";
  ALTER TABLE "home_blocks_service_system_slider_layers" DROP COLUMN "title";
  ALTER TABLE "home_blocks_service_system_slider" DROP COLUMN "_locale";
  ALTER TABLE "home_blocks_service_system_slider" DROP COLUMN "labels_kicker";
  ALTER TABLE "home_blocks_service_system_slider" DROP COLUMN "labels_title_line1";
  ALTER TABLE "home_blocks_service_system_slider" DROP COLUMN "labels_title_line2";
  ALTER TABLE "home_blocks_service_system_slider" DROP COLUMN "labels_title_aria_label";
  ALTER TABLE "home_blocks_service_system_slider" DROP COLUMN "labels_nav_aria_label";
  ALTER TABLE "home_blocks_service_system_slider" DROP COLUMN "labels_progress_aria_label";
  ALTER TABLE "home_blocks_service_system_slider" DROP COLUMN "labels_progress_value_text_template";
  ALTER TABLE "home_blocks_service_system_slider" DROP COLUMN "labels_eyebrow_template";
  ALTER TABLE "home_blocks_service_system_slider" DROP COLUMN "labels_previous";
  ALTER TABLE "home_blocks_service_system_slider" DROP COLUMN "labels_next";
  ALTER TABLE "home_blocks_profiler_labels_program_a_recommendations" DROP COLUMN "_locale";
  ALTER TABLE "home_blocks_profiler_labels_program_a_recommendations" DROP COLUMN "text";
  ALTER TABLE "home_blocks_profiler_labels_program_b_recommendations" DROP COLUMN "_locale";
  ALTER TABLE "home_blocks_profiler_labels_program_b_recommendations" DROP COLUMN "text";
  ALTER TABLE "home_blocks_profiler_labels_program_c_recommendations" DROP COLUMN "_locale";
  ALTER TABLE "home_blocks_profiler_labels_program_c_recommendations" DROP COLUMN "text";
  ALTER TABLE "home_blocks_profiler_volume_options" DROP COLUMN "_locale";
  ALTER TABLE "home_blocks_profiler_volume_options" DROP COLUMN "label";
  ALTER TABLE "home_blocks_profiler_jobs" DROP COLUMN "_locale";
  ALTER TABLE "home_blocks_profiler_jobs" DROP COLUMN "title";
  ALTER TABLE "home_blocks_profiler_jobs" DROP COLUMN "text";
  ALTER TABLE "home_blocks_profiler_needs" DROP COLUMN "_locale";
  ALTER TABLE "home_blocks_profiler_needs" DROP COLUMN "title";
  ALTER TABLE "home_blocks_profiler_needs" DROP COLUMN "text";
  ALTER TABLE "home_blocks_profiler" DROP COLUMN "_locale";
  ALTER TABLE "home_blocks_profiler" DROP COLUMN "labels_kicker";
  ALTER TABLE "home_blocks_profiler" DROP COLUMN "labels_step0_heading";
  ALTER TABLE "home_blocks_profiler" DROP COLUMN "labels_step0_copy";
  ALTER TABLE "home_blocks_profiler" DROP COLUMN "labels_chooser_aria_label";
  ALTER TABLE "home_blocks_profiler" DROP COLUMN "labels_chooser_placeholder";
  ALTER TABLE "home_blocks_profiler" DROP COLUMN "labels_step1_heading";
  ALTER TABLE "home_blocks_profiler" DROP COLUMN "labels_step1_copy";
  ALTER TABLE "home_blocks_profiler" DROP COLUMN "labels_step2_heading";
  ALTER TABLE "home_blocks_profiler" DROP COLUMN "labels_step2_copy";
  ALTER TABLE "home_blocks_profiler" DROP COLUMN "labels_back";
  ALTER TABLE "home_blocks_profiler" DROP COLUMN "labels_see_setup";
  ALTER TABLE "home_blocks_profiler" DROP COLUMN "labels_start_over";
  ALTER TABLE "home_blocks_profiler" DROP COLUMN "labels_talk_to_zitrone";
  ALTER TABLE "home_blocks_profiler" DROP COLUMN "labels_default_result_heading";
  ALTER TABLE "home_blocks_profiler" DROP COLUMN "labels_default_result_body";
  ALTER TABLE "home_blocks_profiler" DROP COLUMN "labels_program_a_label";
  ALTER TABLE "home_blocks_profiler" DROP COLUMN "labels_program_a_heading";
  ALTER TABLE "home_blocks_profiler" DROP COLUMN "labels_program_a_body";
  ALTER TABLE "home_blocks_profiler" DROP COLUMN "labels_program_b_label";
  ALTER TABLE "home_blocks_profiler" DROP COLUMN "labels_program_b_heading";
  ALTER TABLE "home_blocks_profiler" DROP COLUMN "labels_program_b_body";
  ALTER TABLE "home_blocks_profiler" DROP COLUMN "labels_program_c_label";
  ALTER TABLE "home_blocks_profiler" DROP COLUMN "labels_program_c_heading";
  ALTER TABLE "home_blocks_profiler" DROP COLUMN "labels_program_c_body";
  ALTER TABLE "home_blocks_profiler" DROP COLUMN "labels_program_a_extra_breakfast";
  ALTER TABLE "home_blocks_profiler" DROP COLUMN "labels_program_a_extra_dining";
  ALTER TABLE "home_blocks_profiler" DROP COLUMN "labels_program_a_extra_grab_and_go";
  ALTER TABLE "home_blocks_profiler" DROP COLUMN "labels_program_b_extra_coffee";
  ALTER TABLE "home_blocks_profiler" DROP COLUMN "labels_program_b_extra_pantry";
  ALTER TABLE "home_blocks_profiler" DROP COLUMN "labels_program_b_extra_cafeteria";
  ALTER TABLE "home_blocks_profiler" DROP COLUMN "labels_program_b_fallback";
  ALTER TABLE "home_blocks_profiler" DROP COLUMN "labels_plus_events";
  ALTER TABLE "home_blocks_profiler" DROP COLUMN "labels_plus_fuel";
  ALTER TABLE "home_blocks_profiler" DROP COLUMN "labels_growth_level1";
  ALTER TABLE "home_blocks_profiler" DROP COLUMN "labels_growth_level2";
  ALTER TABLE "home_blocks_profiler" DROP COLUMN "labels_growth_level3";
  ALTER TABLE "home_blocks_profiler" DROP COLUMN "labels_growth_level4";
  ALTER TABLE "home_blocks_stories_title_words" DROP COLUMN "_locale";
  ALTER TABLE "home_blocks_stories_title_words" DROP COLUMN "text";
  ALTER TABLE "home_blocks_stories" DROP COLUMN "_locale";
  ALTER TABLE "home_blocks_stories" DROP COLUMN "kicker";
  ALTER TABLE "home_blocks_stories" DROP COLUMN "title_aria_label";
  ALTER TABLE "home_blocks_stories" DROP COLUMN "copy";
  ALTER TABLE "home_blocks_stories" DROP COLUMN "cta_label";
  ALTER TABLE "home_blocks_stories" DROP COLUMN "panel_cta_label";
  ALTER TABLE "home_blocks_stories" DROP COLUMN "labels_tablist_aria_label";
  ALTER TABLE "home_blocks_faq" DROP COLUMN "_locale";
  ALTER TABLE "home_blocks_faq" DROP COLUMN "heading";
  ALTER TABLE "home_blocks_faq" DROP COLUMN "cta_label";
  ALTER TABLE "home_blocks_cta" DROP COLUMN "_locale";
  ALTER TABLE "home_blocks_cta" DROP COLUMN "eyebrow";
  ALTER TABLE "home_blocks_cta" DROP COLUMN "heading";
  ALTER TABLE "home_blocks_cta" DROP COLUMN "copy";
  ALTER TABLE "home_blocks_cta" DROP COLUMN "cta_primary_label";
  ALTER TABLE "home_blocks_cta" DROP COLUMN "cta_secondary_label";
  ALTER TABLE "home_rels" DROP COLUMN "locale";
  ALTER TABLE "_home_v_blocks_hero_primary_nav" DROP COLUMN "_locale";
  ALTER TABLE "_home_v_blocks_hero_primary_nav" DROP COLUMN "link_label";
  ALTER TABLE "_home_v_blocks_hero" DROP COLUMN "_locale";
  ALTER TABLE "_home_v_blocks_hero" DROP COLUMN "title";
  ALTER TABLE "_home_v_blocks_hero" DROP COLUMN "copy";
  ALTER TABLE "_home_v_blocks_hero" DROP COLUMN "cta_label";
  ALTER TABLE "_home_v_blocks_hero" DROP COLUMN "ribbon_label";
  ALTER TABLE "_home_v_blocks_hero" DROP COLUMN "nav_aria_label";
  ALTER TABLE "_home_v_blocks_hero" DROP COLUMN "mobile_nav_aria_label";
  ALTER TABLE "_home_v_blocks_hero" DROP COLUMN "menu_open_label";
  ALTER TABLE "_home_v_blocks_hero" DROP COLUMN "menu_close_label";
  ALTER TABLE "_home_v_blocks_hero" DROP COLUMN "marquee_aria_label";
  ALTER TABLE "_home_v_blocks_services_carousel_title_words" DROP COLUMN "_locale";
  ALTER TABLE "_home_v_blocks_services_carousel_title_words" DROP COLUMN "text";
  ALTER TABLE "_home_v_blocks_services_carousel" DROP COLUMN "_locale";
  ALTER TABLE "_home_v_blocks_services_carousel" DROP COLUMN "kicker";
  ALTER TABLE "_home_v_blocks_services_carousel" DROP COLUMN "title_aria_label";
  ALTER TABLE "_home_v_blocks_services_carousel" DROP COLUMN "copy";
  ALTER TABLE "_home_v_blocks_services_carousel" DROP COLUMN "cta_primary_label";
  ALTER TABLE "_home_v_blocks_services_carousel" DROP COLUMN "cta_secondary_label";
  ALTER TABLE "_home_v_blocks_services_carousel" DROP COLUMN "labels_region_label";
  ALTER TABLE "_home_v_blocks_services_carousel" DROP COLUMN "labels_previous";
  ALTER TABLE "_home_v_blocks_services_carousel" DROP COLUMN "labels_next";
  ALTER TABLE "_home_v_blocks_services_carousel" DROP COLUMN "labels_progress_label";
  ALTER TABLE "_home_v_blocks_services_carousel" DROP COLUMN "labels_slide_template";
  ALTER TABLE "_home_v_blocks_photo_card" DROP COLUMN "_locale";
  ALTER TABLE "_home_v_blocks_photo_card" DROP COLUMN "title";
  ALTER TABLE "_home_v_blocks_photo_card" DROP COLUMN "sub";
  ALTER TABLE "_home_v_blocks_photo_card" DROP COLUMN "alt";
  ALTER TABLE "_home_v_blocks_clock_card" DROP COLUMN "_locale";
  ALTER TABLE "_home_v_blocks_clock_card" DROP COLUMN "title";
  ALTER TABLE "_home_v_blocks_specialties_card_boxes" DROP COLUMN "_locale";
  ALTER TABLE "_home_v_blocks_specialties_card_boxes" DROP COLUMN "label";
  ALTER TABLE "_home_v_blocks_specialties_card" DROP COLUMN "_locale";
  ALTER TABLE "_home_v_blocks_specialties_card" DROP COLUMN "title";
  ALTER TABLE "_home_v_blocks_specialties_card" DROP COLUMN "sub";
  ALTER TABLE "_home_v_blocks_studies_card" DROP COLUMN "_locale";
  ALTER TABLE "_home_v_blocks_studies_card" DROP COLUMN "title";
  ALTER TABLE "_home_v_blocks_studies_card" DROP COLUMN "alt";
  ALTER TABLE "_home_v_blocks_plain_card" DROP COLUMN "_locale";
  ALTER TABLE "_home_v_blocks_plain_card" DROP COLUMN "title";
  ALTER TABLE "_home_v_blocks_plain_card" DROP COLUMN "sub";
  ALTER TABLE "_home_v_blocks_proof_bento_columns" DROP COLUMN "_locale";
  ALTER TABLE "_home_v_blocks_proof_bento" DROP COLUMN "_locale";
  ALTER TABLE "_home_v_blocks_proof_bento" DROP COLUMN "heading_aria_label";
  ALTER TABLE "_home_v_blocks_proof_bento" DROP COLUMN "heading_lead";
  ALTER TABLE "_home_v_blocks_proof_bento" DROP COLUMN "heading_accent";
  ALTER TABLE "_home_v_blocks_proof_bento" DROP COLUMN "copy";
  ALTER TABLE "_home_v_blocks_featured_media" DROP COLUMN "_locale";
  ALTER TABLE "_home_v_blocks_featured_media" DROP COLUMN "label";
  ALTER TABLE "_home_v_blocks_featured_media" DROP COLUMN "aria_label";
  ALTER TABLE "_home_v_blocks_operating_system_title_words" DROP COLUMN "_locale";
  ALTER TABLE "_home_v_blocks_operating_system_title_words" DROP COLUMN "text";
  ALTER TABLE "_home_v_blocks_operating_system_tabs" DROP COLUMN "_locale";
  ALTER TABLE "_home_v_blocks_operating_system_tabs" DROP COLUMN "title";
  ALTER TABLE "_home_v_blocks_operating_system_tabs" DROP COLUMN "copy";
  ALTER TABLE "_home_v_blocks_operating_system_tabs" DROP COLUMN "panel_title";
  ALTER TABLE "_home_v_blocks_operating_system_tabs" DROP COLUMN "panel_copy";
  ALTER TABLE "_home_v_blocks_operating_system" DROP COLUMN "_locale";
  ALTER TABLE "_home_v_blocks_operating_system" DROP COLUMN "kicker";
  ALTER TABLE "_home_v_blocks_operating_system" DROP COLUMN "title_aria_label";
  ALTER TABLE "_home_v_blocks_operating_system" DROP COLUMN "copy";
  ALTER TABLE "_home_v_blocks_operating_system" DROP COLUMN "labels_section_label";
  ALTER TABLE "_home_v_blocks_operating_system" DROP COLUMN "labels_list_aria_label";
  ALTER TABLE "_home_v_blocks_service_system_slider_layers_features" DROP COLUMN "_locale";
  ALTER TABLE "_home_v_blocks_service_system_slider_layers_features" DROP COLUMN "title";
  ALTER TABLE "_home_v_blocks_service_system_slider_layers_features" DROP COLUMN "text";
  ALTER TABLE "_home_v_blocks_service_system_slider_layers" DROP COLUMN "_locale";
  ALTER TABLE "_home_v_blocks_service_system_slider_layers" DROP COLUMN "title";
  ALTER TABLE "_home_v_blocks_service_system_slider" DROP COLUMN "_locale";
  ALTER TABLE "_home_v_blocks_service_system_slider" DROP COLUMN "labels_kicker";
  ALTER TABLE "_home_v_blocks_service_system_slider" DROP COLUMN "labels_title_line1";
  ALTER TABLE "_home_v_blocks_service_system_slider" DROP COLUMN "labels_title_line2";
  ALTER TABLE "_home_v_blocks_service_system_slider" DROP COLUMN "labels_title_aria_label";
  ALTER TABLE "_home_v_blocks_service_system_slider" DROP COLUMN "labels_nav_aria_label";
  ALTER TABLE "_home_v_blocks_service_system_slider" DROP COLUMN "labels_progress_aria_label";
  ALTER TABLE "_home_v_blocks_service_system_slider" DROP COLUMN "labels_progress_value_text_template";
  ALTER TABLE "_home_v_blocks_service_system_slider" DROP COLUMN "labels_eyebrow_template";
  ALTER TABLE "_home_v_blocks_service_system_slider" DROP COLUMN "labels_previous";
  ALTER TABLE "_home_v_blocks_service_system_slider" DROP COLUMN "labels_next";
  ALTER TABLE "_home_v_blocks_profiler_labels_program_a_recommendations" DROP COLUMN "_locale";
  ALTER TABLE "_home_v_blocks_profiler_labels_program_a_recommendations" DROP COLUMN "text";
  ALTER TABLE "_home_v_blocks_profiler_labels_program_b_recommendations" DROP COLUMN "_locale";
  ALTER TABLE "_home_v_blocks_profiler_labels_program_b_recommendations" DROP COLUMN "text";
  ALTER TABLE "_home_v_blocks_profiler_labels_program_c_recommendations" DROP COLUMN "_locale";
  ALTER TABLE "_home_v_blocks_profiler_labels_program_c_recommendations" DROP COLUMN "text";
  ALTER TABLE "_home_v_blocks_profiler_volume_options" DROP COLUMN "_locale";
  ALTER TABLE "_home_v_blocks_profiler_volume_options" DROP COLUMN "label";
  ALTER TABLE "_home_v_blocks_profiler_jobs" DROP COLUMN "_locale";
  ALTER TABLE "_home_v_blocks_profiler_jobs" DROP COLUMN "title";
  ALTER TABLE "_home_v_blocks_profiler_jobs" DROP COLUMN "text";
  ALTER TABLE "_home_v_blocks_profiler_needs" DROP COLUMN "_locale";
  ALTER TABLE "_home_v_blocks_profiler_needs" DROP COLUMN "title";
  ALTER TABLE "_home_v_blocks_profiler_needs" DROP COLUMN "text";
  ALTER TABLE "_home_v_blocks_profiler" DROP COLUMN "_locale";
  ALTER TABLE "_home_v_blocks_profiler" DROP COLUMN "labels_kicker";
  ALTER TABLE "_home_v_blocks_profiler" DROP COLUMN "labels_step0_heading";
  ALTER TABLE "_home_v_blocks_profiler" DROP COLUMN "labels_step0_copy";
  ALTER TABLE "_home_v_blocks_profiler" DROP COLUMN "labels_chooser_aria_label";
  ALTER TABLE "_home_v_blocks_profiler" DROP COLUMN "labels_chooser_placeholder";
  ALTER TABLE "_home_v_blocks_profiler" DROP COLUMN "labels_step1_heading";
  ALTER TABLE "_home_v_blocks_profiler" DROP COLUMN "labels_step1_copy";
  ALTER TABLE "_home_v_blocks_profiler" DROP COLUMN "labels_step2_heading";
  ALTER TABLE "_home_v_blocks_profiler" DROP COLUMN "labels_step2_copy";
  ALTER TABLE "_home_v_blocks_profiler" DROP COLUMN "labels_back";
  ALTER TABLE "_home_v_blocks_profiler" DROP COLUMN "labels_see_setup";
  ALTER TABLE "_home_v_blocks_profiler" DROP COLUMN "labels_start_over";
  ALTER TABLE "_home_v_blocks_profiler" DROP COLUMN "labels_talk_to_zitrone";
  ALTER TABLE "_home_v_blocks_profiler" DROP COLUMN "labels_default_result_heading";
  ALTER TABLE "_home_v_blocks_profiler" DROP COLUMN "labels_default_result_body";
  ALTER TABLE "_home_v_blocks_profiler" DROP COLUMN "labels_program_a_label";
  ALTER TABLE "_home_v_blocks_profiler" DROP COLUMN "labels_program_a_heading";
  ALTER TABLE "_home_v_blocks_profiler" DROP COLUMN "labels_program_a_body";
  ALTER TABLE "_home_v_blocks_profiler" DROP COLUMN "labels_program_b_label";
  ALTER TABLE "_home_v_blocks_profiler" DROP COLUMN "labels_program_b_heading";
  ALTER TABLE "_home_v_blocks_profiler" DROP COLUMN "labels_program_b_body";
  ALTER TABLE "_home_v_blocks_profiler" DROP COLUMN "labels_program_c_label";
  ALTER TABLE "_home_v_blocks_profiler" DROP COLUMN "labels_program_c_heading";
  ALTER TABLE "_home_v_blocks_profiler" DROP COLUMN "labels_program_c_body";
  ALTER TABLE "_home_v_blocks_profiler" DROP COLUMN "labels_program_a_extra_breakfast";
  ALTER TABLE "_home_v_blocks_profiler" DROP COLUMN "labels_program_a_extra_dining";
  ALTER TABLE "_home_v_blocks_profiler" DROP COLUMN "labels_program_a_extra_grab_and_go";
  ALTER TABLE "_home_v_blocks_profiler" DROP COLUMN "labels_program_b_extra_coffee";
  ALTER TABLE "_home_v_blocks_profiler" DROP COLUMN "labels_program_b_extra_pantry";
  ALTER TABLE "_home_v_blocks_profiler" DROP COLUMN "labels_program_b_extra_cafeteria";
  ALTER TABLE "_home_v_blocks_profiler" DROP COLUMN "labels_program_b_fallback";
  ALTER TABLE "_home_v_blocks_profiler" DROP COLUMN "labels_plus_events";
  ALTER TABLE "_home_v_blocks_profiler" DROP COLUMN "labels_plus_fuel";
  ALTER TABLE "_home_v_blocks_profiler" DROP COLUMN "labels_growth_level1";
  ALTER TABLE "_home_v_blocks_profiler" DROP COLUMN "labels_growth_level2";
  ALTER TABLE "_home_v_blocks_profiler" DROP COLUMN "labels_growth_level3";
  ALTER TABLE "_home_v_blocks_profiler" DROP COLUMN "labels_growth_level4";
  ALTER TABLE "_home_v_blocks_stories_title_words" DROP COLUMN "_locale";
  ALTER TABLE "_home_v_blocks_stories_title_words" DROP COLUMN "text";
  ALTER TABLE "_home_v_blocks_stories" DROP COLUMN "_locale";
  ALTER TABLE "_home_v_blocks_stories" DROP COLUMN "kicker";
  ALTER TABLE "_home_v_blocks_stories" DROP COLUMN "title_aria_label";
  ALTER TABLE "_home_v_blocks_stories" DROP COLUMN "copy";
  ALTER TABLE "_home_v_blocks_stories" DROP COLUMN "cta_label";
  ALTER TABLE "_home_v_blocks_stories" DROP COLUMN "panel_cta_label";
  ALTER TABLE "_home_v_blocks_stories" DROP COLUMN "labels_tablist_aria_label";
  ALTER TABLE "_home_v_blocks_faq" DROP COLUMN "_locale";
  ALTER TABLE "_home_v_blocks_faq" DROP COLUMN "heading";
  ALTER TABLE "_home_v_blocks_faq" DROP COLUMN "cta_label";
  ALTER TABLE "_home_v_blocks_cta" DROP COLUMN "_locale";
  ALTER TABLE "_home_v_blocks_cta" DROP COLUMN "eyebrow";
  ALTER TABLE "_home_v_blocks_cta" DROP COLUMN "heading";
  ALTER TABLE "_home_v_blocks_cta" DROP COLUMN "copy";
  ALTER TABLE "_home_v_blocks_cta" DROP COLUMN "cta_primary_label";
  ALTER TABLE "_home_v_blocks_cta" DROP COLUMN "cta_secondary_label";
  ALTER TABLE "_home_v_rels" DROP COLUMN "locale";`)
}
