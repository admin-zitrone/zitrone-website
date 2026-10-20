# Home Delivery Checklist

> **Histórico (mayo de 2026).** Las referencias a Sanity son de antes de Payload; la home se sirve hoy desde código (`HOME_CONTENT_SOURCE=static`). Vigente: [manual-contenido.md](manual-contenido.md).

Updated: 2026-05-04

This checklist turns the home-page audit into an execution plan focused on client delivery quality, system health, and future scalability.

## Objective

Ship a home page that is:

- visually polished and credible
- consistent with the design system
- editable through the planned CMS architecture
- safe to scale without accumulating fragile page-level patches

## Current Assessment

The home is in a strong visual state, but it is still in an intermediate architectural state.

What is already in good shape:

- editorial direction and overall visual language
- client stories motion and logo rail system
- SVG logo adoption
- separation of content, components, and styles compared with an ad hoc landing page

What is still not fully production-grade:

- too much client-facing content is still hardcoded in TypeScript
- some naming and semantics still come from an older domain model
- a few important patterns are page-local instead of reusable primitives
- contact truth and business claims still need normalization

## Priority 1: Credibility and Truth

These items should be fixed before client review or delivery because they directly affect trust.

- [ ] Unify contact data across home, footer, legal, and billing
  - Target files: `src/app/_components/home/content/en.ts`, `src/app/_components/home/content/es.ts`
  - Replace any old `hello@zitrone.mx` or placeholder phone numbers
  - Definition of done: every public contact surface matches the approved business contacts

- [ ] Validate all numeric and operational claims
  - Examples already found in home content:
    - `81+ active SKUs`
    - `8-10 week no-repeat cycle`
    - `100% arabica grain from Chiapas and Veracruz`
  - Definition of done: each claim is either approved by the client or softened into non-quantified language

- [ ] Confirm all testimonials, client names, and logos
  - Definition of done: each visible testimonial and logo is approved for public use and displayed in the intended order

## Priority 2: System Architecture

These items matter because they determine whether the home can scale cleanly.

- [ ] Replace any remaining legacy semantic naming with Zitrone-specific taxonomy
  - Current issue: no inherited naming should remain in the content model, token model, or section state model
  - Target file: `src/app/_components/home/content/types.ts`
  - Definition of done: naming reflects Zitrone service semantics, not inherited vocabulary

- [ ] Extract the editorial title treatment into a reusable primitive
  - Current issue: `TitleWords()` lives inside `home-page.tsx`
  - Definition of done: the accented multi-word heading pattern is reusable outside this page

- [ ] Extract the proof/bento layout grammar into a reusable section pattern
  - Current issue: `ProofBentoSection()` and `BentoCard()` are page-specific
  - Definition of done: the bento/editorial grid can be reused without copying home-page logic

- [ ] Extract the hero navigation behavior into a shared nav primitive
  - Current issue: menu breakpoint, panel logic, and outside-click behavior are localized to the hero
  - Definition of done: the same navigation behavior can be reused on another page or hero variant

- [ ] Move profiler logic out of the view component
  - Current issue: `computeProfilerResult()` is coupled to UI rendering
  - Target file: `src/app/_components/home/profiler-section.tsx`
  - Definition of done: scoring and routing logic are testable and separable from presentation

## Priority 3: CMS Readiness

These items matter because the client will eventually need to edit content without touching code.

- [ ] Define which home content blocks must move to Sanity first
  - Recommended first wave:
    - hero
    - services
    - client stories
    - logo ribbons
    - FAQs
    - footer content
  - Definition of done: a clear first-wave content migration list exists and matches the schema plan

- [ ] Reduce hardcoded editorial content in `en.ts` and `es.ts`
  - Definition of done: only stable fallback content remains in code; client-owned content is modeled for CMS

- [ ] Formalize logo metadata as CMS-safe content API
  - Current direction is good: `fit` and `scale`
  - Next step: define acceptable ranges and intended usage by context
  - Definition of done: logos can be managed consistently across hero, stories, and future surfaces

## Priority 4: Design-System Discipline

These items help avoid regression into one-off solutions.

- [ ] Review inline CSS custom properties passed from React
  - Examples:
    - `--stories-tab-count`
    - `--logo-scale`
  - Definition of done: all inline variables are intentionally part of the component API, not incidental patches

- [ ] Normalize shared spacing and section APIs
  - Focus areas:
    - section headers
    - CTA spacing
    - logo stages
    - card image behavior
  - Definition of done: repeated layout rules live in design-system tokens or reusable section classes

- [ ] Check home for any remaining page-only motion rules
  - Definition of done: hover, fade, reveal, and rail behaviors are all tokenized or component-scoped patterns

## Priority 5: Content Quality

These items do not block architecture, but they strongly affect the perceived quality of the site.

- [ ] Review the home copy for placeholder tone or overly generic claims
  - Definition of done: the home reads like Zitrone, not like an early deck or generic B2B template

- [ ] Review the balance of testimonial lengths
  - Goal: avoid large layout jumps between client stories
  - Definition of done: each testimonial feels visually balanced without distorting the original message

- [ ] Review bilingual consistency
  - Definition of done: English and Spanish pages feel equivalent in meaning, confidence, and polish

## Recommended Order of Execution

1. Contact truth and business-claim validation
2. Semantic model cleanup in `types.ts`
3. Extract title, nav, and bento patterns
4. Separate profiler logic from view
5. Move first-wave editable content toward Sanity
6. Final copy and bilingual review

## Definition of Ready for Client Delivery

The home is ready when:

- all public facts, logos, contacts, and testimonials are approved
- no inherited non-Zitrone taxonomy remains in the public home architecture
- critical visual patterns are reusable, not page-local hacks
- the first-wave editable content is clearly modeled for CMS migration
- no high-visibility placeholder or contradictory content remains

## Definition of Done for the Home

The home should be considered complete only when it is both:

- polished enough for client-facing review
- structured enough that future edits do not require reopening page-specific hacks
