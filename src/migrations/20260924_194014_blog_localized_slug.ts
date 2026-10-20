import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Blog slugs become per-locale (ES articles get Spanish URLs) and the nine
 * placeholder articles are removed, leaving the three real ones.
 *
 * The generated migration dropped `blog_posts.slug` without copying it, which
 * would have left every post without a URL; the copy steps below were added by
 * hand. Deleting posts cannot be undone by `down` — restore from
 * ~/Documents/Zitrone/backups/blog-posts-backup-2026-09-24.json if needed.
 * Old URLs are covered by redirects in src/lib/domain-redirects.ts.
 */

// EN slug (unchanged) → new ES slug.
const LOCALIZED = [
  ['office-food-employee-retention', 'comida-en-la-oficina-y-retencion-de-talento'],
  ['afternoon-slump-office-pantry', 'caida-de-las-3pm-pantry-de-oficina'],
  ['workplace-food-program-that-works', 'como-construir-un-programa-de-alimentacion-corporativa'],
] as const

const PLACEHOLDERS = [
  'hybrid-work-office-meals',
  'daily-dining-without-vendor-juggling',
  'pantry-restocking-without-side-job',
  'great-coffee-service-workday',
  'food-safety-commissary-to-table',
  'menus-people-actually-choose',
  'corporate-catering-service-flow',
  'operational-accountability-real-benefit',
  'scale-service-first-meal-to-enterprise',
] as const

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // 1. New per-locale columns, filled from the shared slug for every locale.
  await db.execute(sql`
  ALTER TABLE "blog_posts_locales" ADD COLUMN "slug" varchar;
  ALTER TABLE "_blog_posts_v_locales" ADD COLUMN "version_slug" varchar;
  UPDATE "blog_posts_locales" l SET "slug" = p."slug" FROM "blog_posts" p WHERE l."_parent_id" = p."id";
  UPDATE "_blog_posts_v_locales" l SET "version_slug" = v."version_slug" FROM "_blog_posts_v" v WHERE l."_parent_id" = v."id";`)

  // 2. Spanish URLs for the three real articles (drafts/history included).
  //    One statement per execute: parameterized queries can't be batched.
  for (const [en, es] of LOCALIZED) {
    await db.execute(sql`
    UPDATE "blog_posts_locales" SET "slug" = ${es}
      WHERE "_locale" = 'es' AND "_parent_id" = (SELECT "id" FROM "blog_posts" WHERE "slug" = ${en})`)
    await db.execute(sql`
    UPDATE "_blog_posts_v_locales" l SET "version_slug" = ${es}
      FROM "_blog_posts_v" v
      WHERE l."_parent_id" = v."id" AND l."_locale" = 'es'
        AND v."parent_id" = (SELECT "id" FROM "blog_posts" WHERE "slug" = ${en})`)
  }

  // 3. Remove the placeholders. Versions only SET NULL on parent delete, so
  //    they go first; every other child table cascades.
  for (const slug of PLACEHOLDERS) {
    await db.execute(sql`
    DELETE FROM "_blog_posts_v" WHERE "parent_id" = (SELECT "id" FROM "blog_posts" WHERE "slug" = ${slug})`)
    await db.execute(sql`DELETE FROM "blog_posts" WHERE "slug" = ${slug}`)
  }

  // 4. Swap indexes and drop the shared columns.
  await db.execute(sql`
  DROP INDEX "blog_posts_slug_idx";
  DROP INDEX "_blog_posts_v_version_version_slug_idx";
  CREATE UNIQUE INDEX "blog_posts_slug_idx" ON "blog_posts_locales" USING btree ("slug","_locale");
  CREATE INDEX "_blog_posts_v_version_version_slug_idx" ON "_blog_posts_v_locales" USING btree ("version_slug","_locale");
  ALTER TABLE "blog_posts" DROP COLUMN "slug";
  ALTER TABLE "_blog_posts_v" DROP COLUMN "version_slug";`)

  // 5. Guard: abort (and roll back) if any remaining post lacks an ES or EN
  //    slug. Holds on an empty database too (fresh dev/CI setups).
  await db.execute(sql`
  DO $$
  DECLARE missing int;
  BEGIN
    SELECT count(*) INTO missing FROM "blog_posts" p
      WHERE (SELECT count(*) FROM "blog_posts_locales" l
             WHERE l."_parent_id" = p."id" AND l."slug" IS NOT NULL AND l."_locale" IN ('es','en')) < 2;
    IF missing <> 0 THEN
      RAISE EXCEPTION 'blog_localized_slug: % post(s) would be left without an ES or EN slug', missing;
    END IF;
  END $$;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Restores the shared-slug schema using the EN slug. Deleted placeholder
  // posts are NOT restored (see the backup noted above).
  await db.execute(sql`
  DROP INDEX "blog_posts_slug_idx";
  DROP INDEX "_blog_posts_v_version_version_slug_idx";
  ALTER TABLE "blog_posts" ADD COLUMN "slug" varchar;
  ALTER TABLE "_blog_posts_v" ADD COLUMN "version_slug" varchar;
  UPDATE "blog_posts" p SET "slug" = l."slug" FROM "blog_posts_locales" l WHERE l."_parent_id" = p."id" AND l."_locale" = 'en';
  UPDATE "_blog_posts_v" v SET "version_slug" = l."version_slug" FROM "_blog_posts_v_locales" l WHERE l."_parent_id" = v."id" AND l."_locale" = 'en';
  CREATE UNIQUE INDEX "blog_posts_slug_idx" ON "blog_posts" USING btree ("slug");
  CREATE INDEX "_blog_posts_v_version_version_slug_idx" ON "_blog_posts_v" USING btree ("version_slug");
  ALTER TABLE "blog_posts_locales" DROP COLUMN "slug";
  ALTER TABLE "_blog_posts_v_locales" DROP COLUMN "version_slug";`)
}
