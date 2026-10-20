# Color Semantics

Layer 2 color turns Maven reference primitives into repeatable roles. This is where raw values become page surfaces, text, actions, focus, overlays, and service category identities.

These roles are governed individually in the token register. Some still need broader proof, but the implementation should already use these semantic roles before reaching for raw primitives.

## Core Rules

- Use semantic or component tokens in real sections and components.
- Use primitive color tokens only in primitive previews, provenance docs, or when a semantic role has not been defined yet.
- Treat `green-700` as a brand accent, not as the default normal-text button background. White on `green-700` is only `4.19:1`, so it is not strong enough for our normal button labels.
- Use `green-900` for primary action backgrounds on light surfaces. White on `green-900` is `8.53:1`.
- Use `green-950` for primary text and the deepest inverse surface. White on `green-950` is `14.30:1`.
- Use service colors for category identity only. Do not let them become generic decoration colors.

## Surface Roles

| Role | Token | Current value | Usage |
| --- | --- | --- | --- |
| Page surface | `--color-surface-page` | `natural-100` | Default warm page canvas. |
| Navigation surface | `--color-surface-navigation` | `natural-100` | Sticky navigation and top-level chrome. |
| Container | `--color-surface-container` | `white` | Cards, stat panels, quotes, and UI containers. |
| Muted container | `--color-surface-container-muted` | `natural-50` | Quiet container fill or service tag fallback. |
| Strong container | `--color-surface-container-strong` | `natural-200` | Slightly stronger warm container fill. |
| Warm section | `--color-surface-section-warm` | `natural-50` | Editorial light sections. |
| Warm strong section | `--color-surface-section-warm-strong` | `natural-200` | Stronger warm bands or media placeholders. |
| Soft section | `--color-surface-section-soft` | `green-50` | Gentle supporting sections. |
| Brand section | `--color-surface-section-brand` | `green-900` | Dark green brand sections with inverse text. |
| Inverse section | `--color-surface-inverse` | `green-950` | Deepest CTA, hero, and high-contrast sections. |
| Disabled surface | `--color-surface-disabled` | `natural-300` | Disabled control fill. |

## Text Roles

| Role | Token | Current value | Rule |
| --- | --- | --- | --- |
| Primary text | `--color-text-primary` | `green-950` | Default text on warm, soft, and white surfaces. |
| Secondary text | `--color-text-secondary` | `grey-green-700` | Body support copy and metadata on warm pages. |
| Muted text | `--color-text-muted` | `grey-green-500` | Quiet metadata on white containers only, or large non-critical text. Do not use for normal body text on `natural-100`. |
| Inverse text | `--color-text-inverse` | `white` | Text on brand and inverse sections. |
| Inverse secondary text | `--color-text-inverse-secondary` | `green-100` | Kicker/support text on dark green sections. |
| Link text | `--color-text-link` | `green-900` | Links on light and warm surfaces. |
| Link hover | `--color-text-link-hover` | `green-950` | Hover state for links on light and warm surfaces. |
| Accent text | `--color-text-accent` | `green-700` | Large accents or non-critical emphasis only. |

## Action Roles

| Role | Token group | Rule |
| --- | --- | --- |
| Primary action | `--color-action-primary-*` | Use on light and warm surfaces. Background is `green-900`, hover is `green-950`, text is white. |
| Secondary action | `--color-action-secondary-*` | Transparent button with green text and border on light and warm surfaces. Hover uses `green-100`. |
| Inverse primary action | `--color-action-inverse-primary-*` | White button on dark green sections. Hover uses `green-100`. |
| Inverse secondary action | `--color-action-inverse-secondary-*` | Transparent button on dark green sections. Hover turns white with deep green text. |
| Disabled action | `--color-action-disabled-*` | Disabled fill is warm neutral, text is `grey-green-700`, border is `natural-400`. |

## Service Category Roles

Each category has four roles: a vivid accent, a soft surface, a text color, and a border. This lets a card show Zitrone service identity without guessing which shade is safe for copy.

| Category | Accent | Surface | Text | Border |
| --- | --- | --- | --- | --- |
| Dining | `--color-accent-service-dining` | `--color-accent-service-dining-surface` | `--color-accent-service-dining-text` | `--color-accent-service-dining-border` |
| Cafe | `--color-accent-service-cafe` | `--color-accent-service-cafe-surface` | `--color-accent-service-cafe-text` | `--color-accent-service-cafe-border` |
| Pantry | `--color-accent-service-pantry` | `--color-accent-service-pantry-surface` | `--color-accent-service-pantry-text` | `--color-accent-service-pantry-border` |
| Catering | `--color-accent-service-catering` | `--color-accent-service-catering-surface` | `--color-accent-service-catering-text` | `--color-accent-service-catering-border` |

The vivid accent can be a stripe, dot, icon fill, or large visual identifier. Text inside category tags must use the paired text token, not the vivid accent by default.

## Borders, Focus, And Overlays

| Role | Token | Rule |
| --- | --- | --- |
| Subtle border | `--color-border-subtle` | Dividers and low-emphasis card borders. |
| Default border | `--color-border-default` | Standard container and UI boundaries. |
| Strong border | `--color-border-strong` | High-emphasis outlines. |
| Inverse border | `--color-border-inverse` | Visible borders on dark green sections. |
| Inverse subtle border | `--color-border-inverse-subtle` | Quiet dividers on dark green sections. |
| Focus ring | `--color-focus-ring` | `green-900` on light surfaces. |
| Inverse focus ring | `--color-focus-ring-inverse` | `green-500` on brand and inverse sections. |
| Scrim overlay | `--color-overlay-scrim` | Generic deep green scrim. |
| Hero overlays | `--color-overlay-hero-*` | Hero image readability layers. |
| Surface overlay | `--color-overlay-surface` | Light overlay on top of visual content. |

## Semantic Contrast Matrix

| Pair | Contrast | Result |
| --- | --- | --- |
| Primary text on page | `11.82:1` | AAA normal text. |
| Secondary text on page | `10.47:1` | AAA normal text. |
| Muted text on page | `4.16:1` | Do not use for normal body text on warm page surfaces. |
| Link text on page | `7.06:1` | AAA normal text. |
| Link hover on page | `11.82:1` | AAA normal text. |
| White text on brand section | `8.53:1` | AAA normal text. |
| White text on inverse section | `14.30:1` | AAA normal text. |
| Inverse secondary text on brand section | `7.17:1` | AAA normal text. |
| Focus ring on page | `7.06:1` | Strong visible focus candidate. |
| Inverse focus ring on brand section | `5.71:1` | Visible focus candidate. |
| Primary action text | `8.53:1` | AAA normal text. |
| Primary action hover text | `14.30:1` | AAA normal text. |
| Secondary action text | `8.31:1` | AAA normal text. |
| Secondary action hover text | `12.01:1` | AAA normal text. |
| Inverse primary action text | `14.30:1` | AAA normal text. |
| Inverse secondary action hover text | `14.30:1` | AAA normal text. |
| Disabled action text | `8.44:1` | Readable disabled action text. |
| Fertility tag text | `4.73:1` | AA normal text. |
| Maternity tag text | `8.12:1` | AAA normal text. |
| Parenting tag text | `10.34:1` | AAA normal text. |
| Menopause tag text | `13.11:1` | AAA normal text. |

## Implementation Pointers

- Semantic tokens live in `src/design-system/tokens/semantic.css`.
- Component aliases live in `src/design-system/tokens/component.css`.
- Section behavior lives in `src/design-system/layout/sections.css`.
- The current Maven-like proof page is `preview/design-system/sections.html`.

## Promotion Gates

A color role can move from candidate to stable only when:

- It appears in at least two Maven-like sections or one reusable component family.
- Its text pair passes the required contrast threshold for the actual type size and weight.
- Hover, focus, disabled, and inverse behavior are documented.
- It is consumed through a semantic or component token in the section specimen.
