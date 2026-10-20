# Token Model

## Naming Rule

Name tokens by layer and role:

```text
--primitive-color-green-950
--color-text-primary
--button-color-background-primary
```

## Primitive Tokens

Primitives are the palette of possible values:

```css
--primitive-color-green-950: #013126;
--primitive-space-4: 1rem;
```

Change primitives carefully. A primitive color changing can alter many semantic roles.

Primitive names should stay factual. They can describe a family or scale position, but not a product role:

```text
Good: --primitive-color-green-700
Good: --primitive-font-family-serif-display
Bad:  --primitive-color-button-green
Bad:  --primitive-font-family-hero
```

## Semantic Tokens

Semantic tokens define product meaning:

```css
--color-text-primary: var(--primitive-color-green-950);
--color-surface-page: var(--primitive-color-natural-100);
```

Use semantic tokens in components before reaching for primitive tokens.

## Component Tokens

Component tokens define stable component APIs:

```css
--button-color-background-primary: var(--color-action-primary-background);
--button-radius: var(--radius-control);
```

Component CSS should prefer component tokens, then semantic tokens, then primitives as a last step.

Once a repeated measure, panel height, focus-outline detail, small-type mapping, or content-layer value becomes part of component identity, promote it into the component token API instead of leaving it as raw CSS inside the component.

## State Companion Rule

When a component has interactive states, its token family should define the state companions explicitly instead of burying those choices inside component CSS.

Examples:

- default
- hover
- active/pressed
- disabled
- focus-visible

If a component behaves differently on inverse/dark surfaces, define the inverse companion tokens too.

## Token Promotion Checklist

- The value has a clear role.
- The value is used in more than one place, or is a core brand decision.
- The token name says what it does, not where it was first found.
- The token works for light and dark sections, or has a documented companion.
- The token is documented before it becomes a dependency for many components.
- The source primitive has known provenance.
- The role was tested in specimens before being encoded as a rule.

## Governance Rule

Every promoted token must belong to a governed token entry or token family entry. That entry must record:

- purpose
- usage rules
- do/don't guidance
- accessibility constraints
- source evidence from Maven
- implementation files
- promotion status

Current governed token families live in `docs/design-system/token-governance-register.md`.

## Promotion Statuses

- `Candidate`: observed or proposed, but not yet ready for broad dependency
- `Needs test`: implemented and promising, but still waiting on validation
- `Stable`: safe for broad reuse and unlikely to change without deliberate migration
