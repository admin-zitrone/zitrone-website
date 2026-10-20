# Component Governance Register

Status: in progress.

This register governs the reusable component families currently implemented or partially implemented in the Maven rebuild.

## Button Variants

- Purpose:
  Provide the primary, secondary, and inverse action hierarchy used across hero, services, proof, and CTA sections.
- Usage rules:
  Use one primary action per group. Secondary is the companion action. Inverse variants are only for dark sections. Default, hover, active, disabled, and focus-visible behavior should come from the button token family, not local one-off rules.
- Do:
  Keep button groups small and semantically ordered.
- Don't:
  Do not use inverse buttons on warm/light sections or use secondary as the dominant action when a primary exists.
- Accessibility constraints:
  Must preserve readable contrast, visible focus, and touch-friendly sizing. Disabled buttons must remain legible without appearing active.
- Source evidence from Maven:
  Filled and outlined green buttons plus inverse buttons on dark bands are observed in [design-system-audit](../research/maven-clinic/design-system-audit.md) and the local capture.
- Implementation files:
  `src/design-system/tokens/component.css`, `src/design-system/components/marketing.css`, `preview/design-system/sections.html`
- Promotion status:
  Stable

## Pill, Tag, And Kicker

- Purpose:
  Provide compact framing language for hero context, section intros, and service categories.
- Usage rules:
  Pills frame context, kickers introduce sections, and service tags identify category inside service cards.
- Do:
  Keep these short and role-specific.
- Don't:
  Do not swap pill, kicker, and tag roles just because they share compact typography.
- Accessibility constraints:
  These elements must stay readable at small sizes and cannot be the only cue for meaning when color is involved.
- Source evidence from Maven:
  Pills, small labels, and section-leading overlines are visible across the hero and services areas documented in [design-system-audit](../research/maven-clinic/design-system-audit.md).
- Implementation files:
  `src/design-system/tokens/component.css`, `src/design-system/components/marketing.css`, `preview/design-system/sections.html`
- Promotion status:
  Stable

## Navigation And Header

- Purpose:
  Give the page a stable top-level structure, brand anchor, and section navigation that survives scroll and smaller screens.
- Usage rules:
  Brand first, navigation second, optional utility action later if needed. Sticky, scrolled, and compact-stack behavior should come from nav tokens rather than hardcoded local values.
- Do:
  Let the nav stay lightweight so the hero still carries the page-opening emphasis.
- Don't:
  Do not overload the header with too many equally loud actions.
- Accessibility constraints:
  Sticky behavior must preserve keyboard access, focus-visible, and readable contrast in both top and scrolled states.
- Source evidence from Maven:
  Sticky header behavior, compact link row, and scroll-sensitive navigation feel are reflected in the saved capture and summarized in [design-system-audit](../research/maven-clinic/design-system-audit.md).
- Implementation files:
  `src/design-system/tokens/component.css`, `src/design-system/components/marketing.css`, `src/design-system/motion/marketing-interactions.js`, `preview/design-system/sections.html`
- Promotion status:
  Stable

## Hero Composition

- Purpose:
  Define the opening text-over-media composition that sets the Maven-like tone immediately while still giving us a disciplined way to absorb strong external hero references.
- Usage rules:
  Hero order is contextual pill, hero heading, supporting copy, then actions over decorative media. Copy measure, content-layer depth, frame behavior, and hero-width behavior should come from hero/media tokens rather than raw layout values. Masthead-on-media and trust-ribbon variants should be treated as governed hero subfamilies, not page-local exceptions. When the source pattern is operational rather than editorial, HeroFrame should support a contained bento shell with inset on all four sides.
- Do:
  Keep the copy narrower than the heading, let the media behave like part of the section surface, and preserve outside-reference hero character through token overrides and grammar extensions instead of pasted CSS.
- Don't:
  Do not turn the hero into a floating card, let actions sprawl into too many choices, or merge nav/menu/ribbon logic into an ungoverned hero blob.
- Accessibility constraints:
  Decorative media must remain `aria-hidden`, text must keep readable contrast over overlays, reduced motion must still produce a complete hero, and any hero-resident masthead or menu-sheet behavior must preserve keyboard access and visible focus.
- Source evidence from Maven:
  Full-bleed hero imagery, large light sans heading, accented editorial word treatment, and dark green overlay behavior are documented in [design-system-audit](../research/maven-clinic/design-system-audit.md) and [page anatomy](../research/maven-clinic/page-anatomy.md). The transfer method for external heroes is documented in [hero-transfer-model](hero-transfer-model.md).
- Implementation files:
  `src/design-system/tokens/component.css`, `src/design-system/layout/sections.css`, `src/design-system/components/marketing.css`, `src/design-system/motion/marketing-interactions.js`, `preview/design-system/sections.html`, `preview/design-system/hero-transfer.html`, `src/design-system/styles/hero-transfer-preview.css`
- Promotion status:
  Needs test

## Service Card

- Purpose:
  Present the Maven care programs as scannable, category-led offers that work in both rail and grid contexts.
- Usage rules:
  Accent first, then title, supporting copy, and CTA. The Maven homepage pattern uses the same media card for each service; the set becomes a swipe rail on smaller screens and a four-card grid on larger screens. Overlay, dot, tag, title, copy, focus details, and responsive media height should come from service-card and carousel tokens.
- Do:
  Use only documented service accent roles and let the card work in repeated sets.
- Don't:
  Do not use arbitrary color bands or long titles that break row rhythm.
- Accessibility constraints:
  The accent dot must remain decorative only, text must stay readable over the media overlay, and the card must work both as a scrollable rail item and a static grid item.
- Source evidence from Maven:
  The service/program area uses repeated category cards and slider behavior, observed in [design-system-audit](../research/maven-clinic/design-system-audit.md).
- Implementation files:
  `src/design-system/tokens/component.css`, `src/design-system/components/marketing.css`, `src/design-system/motion/marketing-interactions.js`, `preview/design-system/sections.html`
- Promotion status:
  Stable

## Proof Card And Media Pair

- Purpose:
  Support a product or care-model claim with compact evidence cards and a contained content image.
- Usage rules:
  Use proof cards for factual support and pair them with media only when the section needs product or care-model evidence. Panel height and proof-card small-type treatment should come from media/proof tokens.
- Do:
  Keep proof content compact and scannable.
- Don't:
  Do not turn proof cards into long editorial blocks or decorative cards with no claim value.
- Accessibility constraints:
  Supporting media must use meaningful alt text because it carries product context, and the split must remain readable once collapsed.
- Source evidence from Maven:
  Feature/platform sections pairing text claims with product imagery and supporting evidence are documented in [page anatomy](../research/maven-clinic/page-anatomy.md) and [design-system-audit](../research/maven-clinic/design-system-audit.md).
- Implementation files:
  `src/design-system/tokens/component.css`, `src/design-system/layout/sections.css`, `src/design-system/components/marketing.css`, `preview/design-system/sections.html`
- Promotion status:
  Stable

## Stat Card

- Purpose:
  Make outcome numbers easy to compare and emotionally legible without burying the proof in long text.
- Usage rules:
  Number first, explanation second, repeated in a predictable responsive grid.
- Do:
  Keep the explanation brief and let the number be the loudest element.
- Don't:
  Do not mix stat cards with unrelated long-form body content.
- Accessibility constraints:
  The numeric role must remain readable at smaller breakpoints, and repeated cards must not collapse into unreadable density.
- Source evidence from Maven:
  Maven uses repeated outcomes/stat modules as proof moments, documented in [page anatomy](../research/maven-clinic/page-anatomy.md).
- Implementation files:
  `src/design-system/tokens/component.css`, `src/design-system/layout/sections.css`, `src/design-system/components/marketing.css`, `preview/design-system/sections.html`
- Promotion status:
  Stable

## Story Card, Tabs, And Logo Row

- Purpose:
  Provide the testimonial and employer-trust grammar for human proof.
- Usage rules:
  Quote first, context second, supporting brand references quieter than the testimonial. Tabs, chips, and story meta should use their own compact-type and focus tokens rather than ad hoc label styling.
- Do:
  Keep story tabs as context selectors and logo rows as supporting trust signals.
- Don't:
  Do not let logos overpower the quote or imply tab interactivity that the content cannot yet support.
- Accessibility constraints:
  Tabs need clear selected state, focus-visible, and eventually content association once real switching is implemented.
- Source evidence from Maven:
  Story/testimonial sections, employer references, and selection controls are visible in the saved reference structure and noted in [design-system-audit](../research/maven-clinic/design-system-audit.md).
- Implementation files:
  `src/design-system/components/marketing.css`, `preview/design-system/sections.html`
- Promotion status:
  Candidate

## Carousel Rail And Controls

- Purpose:
  Let repeated service content behave like a mobile-first swipeable rail before promoting to a desktop grid.
- Usage rules:
  Use for repeated card families where a narrow screen cannot responsibly show the full grid. Controls and progress treatment must come from the carousel token family, including inverse contexts.
- Do:
  Show controls only when the rail truly scrolls and keep progress/state accurate.
- Don't:
  Do not force a carousel on desktop when the content can simply become a grid.
- Accessibility constraints:
  Previous/next buttons require keyboard focus, disabled state accuracy, reduced-motion-safe scrolling behavior, and the track itself should support keyboard stepping when it scrolls.
- Source evidence from Maven:
  Swiper-powered services sliders and progress behavior are explicitly noted in [design-system-audit](../research/maven-clinic/design-system-audit.md).
- Implementation files:
  `src/design-system/layout/sections.css`, `src/design-system/components/marketing.css`, `src/design-system/motion/marketing-interactions.js`, `preview/design-system/sections.html`
- Promotion status:
  Needs test

## CTA Block

- Purpose:
  Deliver a clear closing conversion moment with editorial heading hierarchy and tightly scoped actions.
- Usage rules:
  Centered kicker, heading, supporting copy, and a very small action set.
- Do:
  Keep the message singular and the action hierarchy strict.
- Don't:
  Do not let CTA groups explode into multiple equal-priority links.
- Accessibility constraints:
  Centered layouts must still preserve readable line length, button focus, and stacked-button clarity on compact screens.
- Source evidence from Maven:
  Closing conversion bands with strong editorial messaging and clear CTA hierarchy are part of the reference page anatomy and visible in the local capture.
- Implementation files:
  `src/design-system/layout/sections.css`, `src/design-system/components/marketing.css`, `preview/design-system/sections.html`
- Promotion status:
  Needs test

## Footer Link Groups

- Purpose:
  Give the page a low-noise closing information architecture that still feels organized and intentional.
- Usage rules:
  Brand summary first, grouped navigation second. Footer brand type, group-title type, link rhythm, and footer-link focus behavior should come from footer tokens instead of local typography values. Top-level and grouped columns should come from shared split/grid primitives, not footer-only templates.
- Do:
  Use titled groups and predictable link rhythm.
- Don't:
  Do not collapse the footer into an unstructured link cloud.
- Accessibility constraints:
  Links need visible focus, readable contrast, and responsive regrouping that does not destroy scan order.
- Source evidence from Maven:
  Footer grouping and low-noise closing navigation are visible in the saved page structure and summarized in [design-system-audit](../research/maven-clinic/design-system-audit.md).
- Implementation files:
  `src/design-system/layout/sections.css`, `src/design-system/components/marketing.css`, `preview/design-system/sections.html`
- Promotion status:
  Needs test
