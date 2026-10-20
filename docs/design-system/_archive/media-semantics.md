# Media Semantics

Status: in progress.

This file defines how images and visual media should behave in the Maven-style rebuild. The goal is to stop treating media as a late styling choice. Crop, focal point, overlay, radius, and decorative/content status all need named rules if the website is going to feel consistent.

## Why This Layer Exists

The saved Maven capture depends on media for tone and hierarchy:

- Hero background asset: `2880 x 1280` wide image, used as decorative full-bleed atmosphere
- Feature/product asset: `1047 x 701` image, close to a landscape `3:2` panel
- Supporting people photography includes square `1600 x 1600` and portrait `1360 x 1680` assets

Those shapes are not random. They imply a stable media grammar.

## Current Source

- Semantic media tokens: `src/design-system/tokens/semantic.css`
- Component media API: `src/design-system/tokens/component.css`
- Live media classes: `src/design-system/components/marketing.css`
- Working specimen: `preview/design-system/sections.html`

## Media Roles

### Decorative Media

Use decorative media when the image sets mood, depth, or brand atmosphere, but the page still works without it.

Examples:

- Hero background
- Ambient section background
- Texture, noise, or soft visual wash

Rules:

- Decorative visuals should be background media or `aria-hidden` layers, not meaningful `<img>` content.
- Decorative media must never carry essential instructions or proof.
- Decorative media is allowed to crop more aggressively than content imagery.

### Content Media

Use content media when the image supports understanding, trust, or evidence.

Examples:

- Platform/product image
- Member or care photography
- Story/supporting editorial image

Rules:

- Content media should use `<img>` with meaningful `alt` text.
- Keep crops stable and predictable across repeated panels.
- Content media should remain readable and believable without text placed directly on top.

## Ratio System

Do not invent one-off image boxes. Choose from the system roles below.

| Role | Token/class direction | Use |
| --- | --- | --- |
| Wide | `--media-ratio-wide` / `data-ratio="wide"` | Hero-style panoramic or full-bleed support media |
| Landscape | `--media-ratio-landscape` / `data-ratio="landscape"` | Feature/product panels and proof imagery |
| Square | `--media-ratio-square` / `data-ratio="square"` | Story supports, logos, social-style image modules |
| Portrait | `--media-ratio-portrait` / `data-ratio="portrait"` | Human-centered editorial or care photography |

Default guidance:

- Hero background should read as wide.
- Feature proof panels should default to landscape.
- Human story support imagery should default to portrait.
- Square should be used intentionally, not as a fallback for every unknown image.

## Focal Position Rules

Media needs explicit focal behavior, especially on mobile.

Current system roles:

- Hero focal point: centered on desktop, shifted right on small screens
- Feature focal point: centered unless evidence says otherwise
- Portrait focal point: biased upward so faces stay visible after crop

Rules:

- If an image contains a face, bias the focal point toward the face, not the geometric center.
- Mobile crops should preserve the subject before preserving the background context.
- Focal behavior belongs in the system through named roles, not ad hoc per-page overrides.

## Full-Bleed vs Contained Media

### Full-Bleed

Use full-bleed media when the image behaves like part of the section surface.

Examples:

- Hero background
- Section-level atmospheric image band

Rules:

- Full-bleed media should align with the viewport or section boundary, not with card edges.
- Use `.ds-bleed` or a section background layer, not negative-margin hacks inside components.
- Full-bleed media should usually be decorative unless the layout explicitly supports a content image at that scale.

### Contained

Use contained media when the image is part of a panel, card, or split layout.

Examples:

- Feature panel image
- Story support photo
- Card thumbnail

Rules:

- Contained media should sit inside a stable ratio frame.
- Contained media should usually use rounded corners.
- Contained media should not pretend to be full-bleed by stretching awkwardly inside a narrow container.

## Rounded Media Behavior

Media rounding should reflect the surface it belongs to.

Rules:

- Contained media uses the media radius token.
- Full-bleed media should usually be flush, not rounded.
- Do not mix sharp and rounded media styles within the same section without a structural reason.

## Overlay Rules

Overlays are for readability and hierarchy, not decoration.

Current overlay roles:

- Hero overlay
- Scrim overlay
- Surface overlay

Rules:

- Use the hero overlay only when text sits over imagery.
- Use scrim overlays when a decorative image needs to step back.
- Do not place strong overlays on content images unless the image is becoming background media.

## Hero and Parallax Behavior

Hero media should feel alive, but motion must stay supportive.

Rules:

- The base system reserves an oversized hero media layer so subtle drift/parallax can happen without exposing edges.
- Hero motion is decorative only and must never be required to understand content.
- Any enhanced parallax behavior should disable cleanly for reduced motion and should stay performance-safe on touch devices.
- The system should still look correct when hero media becomes a static image.

## Decorative vs Content Decision Test

Use this test before choosing implementation:

1. If the image disappeared, would meaning be lost?
2. Does the image need alt text to explain what the user should notice?
3. Is the image evidence, context, or emotional storytelling rather than atmosphere?

If the answer is yes, treat it as content media.

If the image is only supporting mood, depth, or brand feel, treat it as decorative media.

## Current Grammar Hooks

Classes:

- `.ds-hero-stage`
- `.ds-hero-media`
- `.ds-media-frame`
- `.ds-media-panel`
- `.ds-bleed`

Attributes:

- `data-ratio="wide|landscape|square|portrait"`
- `data-focal="feature|portrait"`
- `data-treatment="bleed"`
- `data-overlay="scrim|surface"`

## Maven Mapping

1. Hero: decorative full-bleed wide media with inverse overlay
2. Feature proof section: contained landscape content image
3. Story support: contained portrait human-centered image
4. Future carousels/cards: square or portrait only when repeated assets need a stable crop family

## What Comes Next

- Real hero image cycling rules
- Carousel slide image treatment
- Illustration vs photography distinction
- Video and motion-media rules
- Logo asset rules for real brand marks rather than text chips
