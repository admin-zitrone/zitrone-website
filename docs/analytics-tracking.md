# Lead attribution and GA4/GTM tracking

What the site measures, where each piece lives, and what still has to be
configured in the client's GTM (GTM-TSTDVS4) and GA4 (G-E48BCCXZEC).

## The three questions every lead answers

| Question | Mechanism | Where it lands |
|---|---|---|
| Which button sent them to the form? | `<CtaTracker/>` records the click: **page type + section + CTA id + label** | CMS `source`, `ctaSection`, `ctaText`, `fromPath` · sheet · sales email · GA4 `cta_*` params |
| How did this visit start? | First page of the session: utm_*, ad click id (gclid/gbraid/wbraid/msclkid/fbclid/li_fat_id/ttclid), external referrer | CMS `landingPath`, `referrer`, `utm*`, `clickId` |
| How did they first find us? | Same record from the first visit, kept 90 days in localStorage (skipped if analytics consent is denied) | CMS `firstTouch` (one readable line) |

The CTA is scoped to the form: a navbar "Hablemos" click only counts for a
lead submitted on `/contact`, and a `#profiler` click only for the home
profiler. A lead that reached the form without a button shows an empty CTA
and "Llegó al formulario sin pasar por un botón" in the sales email.

GA4 ids (`gaClientId`, `gaSessionId`) are read from GA's own cookies so any CMS
lead can be joined to its GA4 journey (User explorer, BigQuery export).

## How a button gets its identity (no hand-labelling needed)

`src/lib/analytics/cta.ts`, applied to every `a[href]` and any `[data-cta]`:

- **section**: nearest `data-track-section`, else the nearest `section[id]`,
  else its aria-label. Marked today: `nav`, `nav-menu`, `nav-promo`,
  `nav-mobile`, `hero`, `stories`, `service-carousel`, `footer`, `footer-cta`.
  Home ids give `service-system`, `outcomes`, `features`, `profiler`, `faq`.
- **cta_id**: `data-cta` → the link's `?src=` slug → slug of its label.
- **target**: contact, profiler, email, phone, whatsapp, service, services,
  blog, billing, anchor, social, external, internal.

Adding a new button needs nothing. Adding a new page block: put
`data-track-section="name"` on its wrapper. To exclude an element:
`data-cta-ignore`.

## dataLayer contract

Every event pushes **all seventeen contract keys** (`DATA_LAYER_PARAMS` in
`src/lib/analytics/data-layer.ts`), with the ones it does not use and any empty
value pushed as `undefined`. The imported GA4 tag sends every key on every
event, and GTM's data model is persistent, so a key left out would carry the
previous event's value (a lead reporting the last click's `link_url`, a click
reporting the last lead's `lead_id`). `tests/contracts/measurement-contract.test.ts`
keeps this list identical to the template's variables.

The container only loads on the production build served from the canonical
host; previews, local builds and tests keep the dataLayer but never load GTM.
See [analytics/paquete-medicion.md](analytics/paquete-medicion.md).

| Event | When | Params |
|---|---|---|
| `cta_click` | any link / `[data-cta]` click | `cta_id`, `cta_section`, `cta_text`, `cta_target`, `page_type`, `link_url`, `outbound` |
| `contact_click` | mailto / tel / WhatsApp | `contact_method`, `cta_id`, `cta_section`, `page_type` |
| `lead_form_start` | first answer in a form (once per page view) | `form_id`, `cta_id`, `cta_section`, `cta_page`, `lead_channel` |
| `lead_form_step` | form moves to another step | the above + `step_index`, `step_id` |
| `generate_lead` | lead **persisted** (201 only; honeypot 202 never fires) | the above + `lead_id` (folio), `lead_interest`, `lead_headcount`, `language` |

The older `contact_*` / `home_*` events in `lib/observability/events.ts` still
fire (Vercel Analytics + dataLayer); nothing that relied on them breaks. They
are diagnostics, not conversions: `generate_lead` is the only event any
conversion tag may use.

## Setup in GTM and GA4 (needs client access — not done yet)

1. **GTM → Admin → Import container** → `docs/gtm/zitrone-lead-tracking.gtm.json`,
   workspace "New", option **Merge → Rename conflicting**. It adds 17 Data Layer
   Variables, one Custom Event trigger (regex on the five events above) and one
   GA4 Event tag (event name = `{{Event}}`) for G-E48BCCXZEC. Preview with Tag
   Assistant on the site, then publish.
2. **GA4 → Admin → Custom definitions → Create custom dimension** (event scope)
   for: `cta_id`, `cta_section`, `cta_target`, `page_type`, `form_id`,
   `cta_page`, `lead_channel`, `step_id`, `lead_interest`, `contact_method`.
   Metric: `step_index` is fine as a dimension too. Dimensions only collect from
   the day they are created — do this first.
3. **GA4 → Admin → Key events**: mark `generate_lead` (and optionally
   `contact_click`) as key events.
4. **GA4 → Data streams → Enhanced measurement → Form interactions: OFF**.
   GA4's automatic `form_start`/`form_submit` misfire on these multi-step
   React forms and would double count against `lead_form_start`.
5. **Google Ads (AW-779424827)**: the published container (v9) fires the Ads
   conversion and GA4 `form_submit` on a *legacy CSS click* (see
   `migration-validation-2026-09-22.md`), which does not exist on this site.
   Re-point that Ads conversion tag to a Custom Event trigger on
   `generate_lead` (Transaction ID = `{{DLV - lead_id}}`) and pause the legacy
   `form_submit` tag. Step-by-step recipe and Preview/DebugView script:
   [analytics/gtm-activation.md](analytics/gtm-activation.md), the single
   current recipe. Do **not** also build a trigger on
   `contact_request_accepted`: that older recipe is retired and would count
   every lead twice.
6. Tag every paid link with utm_source / utm_medium / utm_campaign
   (+ utm_content for the ad variant). Never put utm_* on internal links.

## Reports that answer "what works"

- **Explore → Free form**: rows `cta_section` × `cta_id`, filter event =
  `generate_lead`, value = event count → which buttons produce leads.
- Same, event = `cta_click`, then compare → click-to-lead rate per button.
- **Explore → Funnel**: `cta_click (target=contact)` → `lead_form_start` →
  `lead_form_step` (per `step_id`) → `generate_lead`, broken down by
  `form_id` → where each form loses people.
- Breakdown by `lead_channel` or session source/medium → which channel brings
  leads, not just visits.
- CMS / sheet: `Canal`, `Sección CTA`, `Primera visita` per lead, for the
  cases where GA4 sees nothing (consent denied, ad blockers).

## Next steps (not built)

- Close the loop on lead quality: when sales marks a lead qualified/won in
  the CMS, send `qualify_lead` / `close_convert_lead` to GA4 via Measurement
  Protocol using the stored `gaClientId`, and upload `clickId` to Google Ads as
  an offline conversion. Needs a GA4 API secret and a decision on what
  "closed" means (the status has no won/lost split today).
- Enhanced Conversions for leads: push hashed email/phone on `generate_lead`
  once the Ads tag in the container is confirmed to read it.
