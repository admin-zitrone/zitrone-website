# Design-System Source

**This folder is the single source of truth for the Zitrone design system.**
Rules, layer map, and change workflow: see [`/DESIGN.md`](../../DESIGN.md) at the repo root.
Human-readable brand book: the `/design-system` route (generated from these files).

```text
src/design-system/
  tokens/          primitives.css → semantic.css → component.css (layered contract)
  components/      marketing.css — .ds-* component grammar
  layout/          sections.css — section/container/grid grammar
  motion/          reveal & interaction scripts
  styles/          base, fonts, preview styles
```

Contract audit (must pass):

```sh
zsh scripts/design-system-audit.sh
```

Consumers: the website (`src/app/globals.css` imports `tokens/index.css`), the deck
system (`../zitrone-deck-system` syncs primitives via its `npm run tokens:sync`), and the
brand book (`scripts/design-tokens-data.mjs` → `tokens.generated.json`).
