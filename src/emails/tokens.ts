/**
 * Design tokens, resolved to literals for email.
 *
 * Email clients support no custom properties, so every governed value has to
 * be inlined as a hex string. That copy is the risk: change a token in
 * `src/design-system/tokens/` and the emails silently keep shipping the old
 * brand. `EMAIL_TOKEN_SOURCE` names where each literal came from, and
 * `npm run email:check` resolves those variables and fails loudly if any
 * value has drifted.
 *
 * To change a colour here: change the token first, then run the check and
 * update the literal it reports.
 */

export const EMAIL_COLOR = {
  page: '#FBF6F3',
  surface: '#FFFFFF',
  surfaceSoft: '#F1EBE4',
  heading: '#1A4352',
  body: '#0C5068',
  secondary: '#4E6469',
  turquoise: '#04998B',
  action: '#0C5068',
  accent: '#AED658',
  ink: '#00292A',
  inkText: '#E8F5F4',
  hairline: '#E4D9CF',
} as const

/**
 * The design-system variable each literal above is copied from. Semantic
 * names are preferred; a primitive is named only where the email needs a
 * value the semantic layer does not expose (tints on the ink footer).
 */
export const EMAIL_TOKEN_SOURCE: Record<keyof typeof EMAIL_COLOR, string> = {
  page: '--color-surface-page',
  surface: '--color-surface-container',
  surfaceSoft: '--primitive-color-natural-100',
  heading: '--color-text-heading',
  body: '--color-text-primary',
  secondary: '--color-text-secondary',
  turquoise: '--primitive-color-ocean-400',
  action: '--color-text-action',
  accent: '--color-action-accent-background',
  /* Not `--color-action-primary-background` (ocean-900): `.ds-button` in
     marketing.css paints the real pill with the ocean-950 primitive, so the
     semantic token and the shipped button disagree. The email follows what
     people actually see. Worth reconciling in the design system. */
  ink: '--primitive-color-ocean-950',
  inkText: '--primitive-color-ocean-50',
  hairline: '--primitive-color-natural-200',
}

/**
 * Manrope cannot be loaded in most clients — Outlook drops `@font-face` and
 * Gmail strips it — so the stack falls back to the host's UI sans. This is
 * the one deliberate divergence from the site and has no token to check.
 */
export const EMAIL_FONT_STACK =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
