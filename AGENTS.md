<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Active client delivery

For release-readiness work, read **[DELIVERY.md](./DELIVERY.md)** and
**[docs/delivery-progress.md](./docs/delivery-progress.md)** first. They hold the
current priorities, acceptance criteria, decisions and next action for the
handoff (release `release/2026-10`, then Arroba). Update them after meaningful progress and
before handoff. Consult the linked audit as baseline evidence; do not repeat
completed work or treat old production observations as current verification.

# Where the truth lives

| Topic | Read this first |
|-------|-----------------|
| Design system (tokens, colors, type, brand rules) | **[DESIGN.md](./DESIGN.md)** — the single source of truth is `src/design-system/`; never hardcode governed values |
| Images & logos (one canonical library) | **[ASSETS.md](./ASSETS.md)** — `public/img` + `assets.manifest.json`; import by id, never a literal path |
| Accessibility (WCAG 2.2 AA) | **[docs/accessibility.md](./docs/accessibility.md)** — the gate is `npm run test:a11y`; the contrast/focus/motion rules there are binding on new components |
| Transactional email | **[EMAILS.md](./EMAILS.md)** — templates in `src/emails/`; the palette is hand-copied and guarded by `npm run email:check` |
| Human-readable brand book | `/design-system` route — generated from the token files, never hand-edited |
| Deck / presentation system | separate private repo `zitrone-deck-system` (own `AGENTS.md`), not part of the website handoff; it *consumes* this repo's tokens and `public/img` (add-only, see ASSETS.md) |

Anything under `docs/design-system/_archive/` is historical planning material — do not
treat it as current rules.
