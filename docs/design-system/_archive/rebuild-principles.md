# Rebuild Principles

## Clean Rebuild

- Learn from the reference's visual decisions.
- Do not copy the minified Webflow CSS/JS into source.
- Do not preserve generated class names unless documenting the reference.
- Implement tokens, components, and motion in readable source files.

## Robustness

- Tokens should be centralized.
- Components should have small, documented variants.
- Components should work without analytics or marketing tags.
- Motion should respect reduced-motion preferences.
- Images should have deliberate loading priority and alt text.
- Interactive elements should be keyboard reachable and have visible focus.

## Learning Notes

When we make a choice, record it in `docs/decisions/` if it affects the project direction.
