export {
  localBusinessJsonLd,
  organizationJsonLd,
  webSiteJsonLd,
} from "./json-ld-entity"
export {
  articleJsonLd,
  blogPostingJsonLd,
} from "./json-ld-articles"
export {
  breadcrumbJsonLd,
  collectionPageJsonLd,
  faqPageJsonLd,
  webPageJsonLd,
} from "./json-ld-pages"
export {
  serviceCatalogJsonLd,
  serviceJsonLd,
} from "./json-ld-services"

/* ── Render helper ─────────────────────────────────────────── */

/**
 * Renders a JSON-LD `<script>` tag for embedding in a page.
 * Use inside a Server Component's JSX:
 *
 *   <JsonLd data={organizationJsonLd()} />
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
