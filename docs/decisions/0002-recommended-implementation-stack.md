# Decision 0002: Recommended Implementation Stack

## Status

Proposed.

## Reference Stack Observed

The current reference capture appears to be Webflow-style HTML/CSS plus a generated Rspack chunk-loader script, jQuery, Swiper, GSAP/ScrollTrigger/SplitText, a canvas/Rive-like hero, HubSpot, analytics/conversion scripts, and consent/chat widgets.

## Recommended Stack For This Project

Recommended starting point:

- TypeScript
- React
- Next.js App Router
- CSS custom properties for tokens
- CSS Modules or a small global CSS layer for components/utilities
- Storybook or a documentation route later, once components exist
- GSAP only for motion that genuinely needs timelines
- Swiper only if native CSS scroll-snap is not enough

## Tailwind Option

Tailwind is optional for our build. It is not currently recommended as the source of truth for tokens because the reference is organized around CSS custom properties and component/utility classes.

If we choose Tailwind, map design tokens into Tailwind theme config and keep semantic CSS variables as the stable public token layer.

## Not Recommended

- Rebuilding inside Webflow export.
- Pasting generated `maven-clinic.*.css` into source.
- Starting with analytics, chat widgets, or third-party conversion snippets.
