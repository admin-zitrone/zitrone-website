# Styles

Page-level stylesheets that are not component grammar.

- `sections-preview.css` — despite the name, this is **production** CSS: it is
  imported by `src/app/globals.css` and ships to every visitor. It in turn
  imports `sections-preview-proof.css` and `sections-preview-profiler.css`.
  The "preview" in these names is historical and misleading; renaming them is
  tracked as follow-up work.

The reset, focus baseline and font loading all live in `src/app/globals.css`,
which is the only stylesheet the app actually imports.

> Removed 2026-09: `base.css`, `fonts.css`, `preview.css`,
> `primitives-preview.css` and `hero-transfer-preview.css` (1,537 lines) were
> deleted. Nothing imported them — they styled static HTML pages in a
> `preview/` directory that no longer exists. `base.css` was the dangerous one:
> it held a near-duplicate of the accessibility baseline, so editing it looked
> like it should work and silently did nothing.
