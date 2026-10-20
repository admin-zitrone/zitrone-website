# Promotion Review: 2026-04-13

This review promotes the first core design-system families from `Needs test` toward `Stable`, using the governance rules in [documentation-governance](documentation-governance.md).

## Scope

Reviewed families:

- Action and focus tokens
- Detail, layer, and elevation tokens
- Typography role tokens
- Layout, rhythm, and container tokens
- Button variants
- Service card
- Carousel rail and controls

## Evidence Used

- Research evidence from:
  - `docs/research/maven-clinic/design-system-audit.md`
  - `docs/research/maven-clinic/page-anatomy.md`
  - `docs/research/maven-clinic/layer-1-token-inventory.md`
- Accessibility and semantic behavior evidence from:
  - [color-semantics](color-semantics.md)
  - [contrast-matrix](contrast-matrix.md)
  - [typography-semantics](typography-semantics.md)
  - [section-layout-semantics](section-layout-semantics.md)
  - [responsive-behavior-semantics](responsive-behavior-semantics.md)
  - [motion-interaction-semantics](motion-interaction-semantics.md)
- Implementation evidence from:
  - `src/design-system/tokens/semantic.css`
  - `src/design-system/tokens/component.css`
  - `src/design-system/layout/sections.css`
  - `src/design-system/components/marketing.css`
  - `src/design-system/motion/marketing-interactions.js`
- Enforcement evidence from:
  - [enforcement-audit](enforcement-audit.md)
  - `zsh scripts/design-system-audit.sh`

## Review Matrix

| Family | Implemented and documented | Accessibility/responsive proof | Broad reuse | Enforcement proof | Decision |
| --- | --- | --- | --- | --- | --- |
| Action and focus tokens | Yes | Yes | Yes | Yes | `Stable` |
| Detail, layer, and elevation tokens | Yes | Yes, within governed usage | Yes | Yes | `Stable` |
| Typography role tokens | Yes | Yes | Yes | Yes | `Stable` |
| Layout, rhythm, and container tokens | Yes | Yes | Yes | Yes | `Stable` |
| Button variants | Yes | Yes | Yes | Yes | `Stable` |
| Service card | Yes | Yes | Yes | Yes | `Stable` |
| Carousel rail and controls | Yes | Partial | Yes | Partial | `Needs test` |

## Decisions

### Promoted to Stable

#### Action and focus tokens

Promoted because:

- the token family is fully documented
- contrast behavior is explicitly recorded for primary, secondary, inverse, disabled, and focus states
- buttons, nav, carousel controls, tabs, dots, and footer links all consume governed focus/action behavior
- the enforcement audit now guards against generic focus-ring drift and raw local state wiring

#### Detail, layer, and elevation tokens

Promoted because:

- sticky layers, card elevation, focus-outline details, and content-layer values are now explicit support contracts
- multiple components depend on them already
- naming is unlikely to change without deliberate migration

#### Typography role tokens

Promoted because:

- the main marketing roles now cover display, section, card, quote, stat, body, support, meta, brand, and legal behavior
- responsive step-downs and measures are documented
- component CSS now consumes owned typography contracts instead of loose label/body wiring in the governed marketing grammar

#### Layout, rhythm, and container tokens

Promoted because:

- section spacing, containers, repeated measures, panel heights, and rail behavior now form a consistent page grammar
- multiple sections depend on them already
- the enforcement audit protects against falling back to raw hero widths, panel heights, and similar one-off values

#### Button variants

Promoted because:

- light and inverse variants are documented and implemented
- default, hover, active, disabled, and focus-visible behavior now come from the button token family
- the component is already depended on across hero, services, proof, and CTA contexts

#### Service card

Promoted because:

- the card contract is now explicit about overlay, dot, tag type, title, support copy, focus details, and responsive media height
- the service card family is one of the strongest Maven-specific patterns in the system
- naming and behavior feel stable enough for broad reuse in the later website work

### Not Yet Stable

#### Carousel rail and controls

Promoted from `Candidate` to `Needs test`, but not to `Stable`, because:

- the contract is implemented and documented
- inverse and progress behavior are now tokenized
- reduced-motion and focus rules exist
- but the interaction still deserves live browser verification for keyboard flow, disabled accuracy, and scroll behavior before we call it frozen

## Outcome

The design system now has a truthful stable core for:

- action/focus
- typography roles
- layout/rhythm
- buttons
- service cards

That is enough to start website work on top of a meaningful base, while keeping the carousel interaction under a slightly stricter watch.

## Follow-up Pass: Component Closure

Additional families reviewed after the first stable-core pass:

- Pill, tag, and kicker
- Hero composition
- Proof card and media pair
- Stat card
- Carousel rail and controls

### Decisions

#### No Status Change

- `Pill, Tag, And Kicker` stays `Stable`.
- `Hero Composition` stays `Needs test` because the remaining risk is visual calibration of text-over-media behavior, not token absence.
- `Carousel Rail And Controls` stays `Needs test` because keyboard flow and reduced-motion logic are now stronger, but still deserve live browser verification before freezing.

#### Promoted to Stable

- `Proof Card And Media Pair`
- `Stat Card`

Promoted because:

- both families now consume explicit component-token contracts instead of leaning on generic card or raw typography wiring
- both families already have responsive behavior documented and implemented
- neither family depends on high-risk interaction behavior to remain correct

## Follow-up Pass: Layout Column System

Additional layout scope reviewed after the component-closure pass:

- named grid variants: `2-col`, `3-col`, `4-col`
- named split variants: `6/6`, `5/7`, `4/8`
- editorial/content columns with span and start rules
- shared gutter contracts across grid, split, and rail
- proof/footer column ownership

### Decisions

#### No Status Change

- `Layout, Rhythm, And Container Tokens` stays `Stable`.
- `Responsive Tokens` stays `Candidate` because the new explicit column variants still need live browser verification across breakpoints before promotion.

#### Structural Decision

- Proof and footer keep their semantic wrapper classes, but their column counts now belong to the shared layout layer instead of component-local grid templates.

This keeps layout ownership cleaner: components still describe meaning, but the column system itself is now reusable and governed in one place.
