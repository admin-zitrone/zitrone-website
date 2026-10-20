import type { CSSProperties, ReactNode } from "react"

import {
  asPx,
  byPrefix,
  chain,
  generatedAt,
  shortName,
  tok,
  tokenCount,
  type Token,
} from "./lib"

/* The brand book renders from tokens.generated.json (parsed from the real
   token CSS on every build), so what you read here is what the code ships.
   Never hand-edit values into this page: change the tokens instead. */

const NAV = [
  ["foundations", "01 · Foundations"],
  ["typography", "02 · Typography"],
  ["color", "03 · Color"],
  ["space", "04 · Space & Shape"],
  ["layout", "05 · Layout"],
  ["components", "06 · Components"],
  ["verticals", "07 · Service Verticals"],
  ["governance", "08 · Governance"],
] as const

function Section({
  id,
  label,
  title,
  lead,
  children,
}: {
  id: string
  label: string
  title: ReactNode
  lead?: ReactNode
  children: ReactNode
}) {
  return (
    <section id={id} className="dsb-section">
      <div className="dsb-container dsb-section-grid">
        <p className="dsb-section-label">{label}</p>
        <div>
          <h2 className="dsb-section-title">{title}</h2>
          {lead ? <p className="dsb-section-lead">{lead}</p> : null}
          {children}
        </div>
      </div>
    </section>
  )
}

function Block({ title, note, children }: { title: string; note?: ReactNode; children: ReactNode }) {
  return (
    <div className="dsb-block">
      <h3 className="dsb-block-title">{title}</h3>
      {note ? <p className="dsb-block-note">{note}</p> : null}
      {children}
    </div>
  )
}

function Swatch({ token }: { token: Token }) {
  const value = token.resolved ?? token.value
  return (
    <div className="dsb-swatch">
      <div className="dsb-swatch-color" style={{ background: value }} />
      <span className="dsb-meta">
        {shortName(token.name)}
        <br />
        {value}
      </span>
    </div>
  )
}

function Ramp({ tokens }: { tokens: Token[] }) {
  return (
    <div className="dsb-ramp">
      {tokens.map((t) => (
        <Swatch key={t.name} token={t} />
      ))}
    </div>
  )
}

function Roles({ names }: { names: string[] }) {
  return (
    <ul className="dsb-roles">
      {names.map((name) => {
        const links = chain(name)
        return (
          <li key={name}>
            <span className="dsb-role-chip" style={{ background: tok(name) }} />
            <span className="dsb-role-name">{name}</span>
            <span className="dsb-meta">{links.length ? `← ${links.join(" ← ")}` : "raw value"}</span>
            <span className="dsb-meta dsb-role-value">{tok(name)}</span>
          </li>
        )
      })}
    </ul>
  )
}

const SPECIMENS: { base: string; label: string; sample: string; transform?: boolean }[] = [
  { base: "--type-display-hero", label: "Display hero", sample: "Food people look forward to" },
  { base: "--type-section-heading", label: "Section heading", sample: "Designed around real workdays" },
  { base: "--type-card-heading", label: "Card heading", sample: "Comedor corporativo, resuelto" },
  { base: "--type-quote", label: "Quote", sample: "“The cafeteria became the best room in the office.”" },
  { base: "--type-stat-number", label: "Stat number", sample: "+17" },
  { base: "--type-body-large", label: "Body large", sample: "One operating partner for dining, coffee, snacks, and events, with the consistency of a system behind every meal." },
  { base: "--type-body", label: "Body", sample: "Zitrone runs workplace food programs end to end: chefs, sourcing, service staff, and the daily logistics that keep quality steady." },
  { base: "--type-support", label: "Support", sample: "Supporting copy, captions, and secondary explanations sit one clear step below body text." },
  { base: "--type-label", label: "Label / kicker", sample: "Nuestros servicios", transform: true },
  { base: "--type-meta", label: "Meta", sample: "Ciudad de México · Desde 2009" },
  { base: "--type-button", label: "Button", sample: "Agenda una visita" },
]

function Specimen({ base, label, sample, transform }: (typeof SPECIMENS)[number]) {
  const style: CSSProperties = {
    fontFamily: `var(${base}-family, var(--font-body))`,
    fontSize: `var(${base}-size)`,
    fontWeight: `var(${base}-weight, 400)` as CSSProperties["fontWeight"],
    lineHeight: `var(${base}-line-height, var(--line-height-body))`,
    maxWidth: `var(${base}-measure, none)`,
    textTransform: transform ? (`var(${base}-transform)` as CSSProperties["textTransform"]) : undefined,
    letterSpacing: transform ? "0.1em" : undefined,
  }
  const size = tok(`${base}-size`)
  const meta = [
    label,
    size ? `${size}${asPx(size) ? ` · ${asPx(size)}` : ""}` : "",
    tok(`${base}-weight`) ? `weight ${tok(`${base}-weight`)}` : "",
    tok(`${base}-line-height`) ? `leading ${tok(`${base}-line-height`)}` : "",
    tok(`${base}-measure`) ? `measure ${tok(`${base}-measure`)}` : "",
  ]
    .filter(Boolean)
    .join("  ·  ")
  return (
    <div className="dsb-specimen">
      <p className="dsb-specimen-sample" style={style}>
        {sample}
      </p>
      <span className="dsb-meta">
        {base} — {meta}
      </span>
    </div>
  )
}

function ScaleBars({ tokens, max }: { tokens: Token[]; max: number }) {
  return (
    <ul className="dsb-scale">
      {tokens.map((t) => {
        const value = t.resolved ?? t.value
        const rem = parseFloat(value)
        if (Number.isNaN(rem)) return null
        return (
          <li key={t.name}>
            <span className="dsb-meta">
              {shortName(t.name)} · {value}
              {asPx(value) ? ` · ${asPx(value)}` : ""}
            </span>
            <span
              className="dsb-scale-bar"
              style={{ width: `${Math.min(100, (rem / max) * 100)}%`, maxWidth: value }}
            />
          </li>
        )
      })}
    </ul>
  )
}

const GRID_DEMOS: { name: string; cells: number }[] = [
  { name: "--layout-grid-template-2-col", cells: 2 },
  { name: "--layout-grid-template-3-col", cells: 3 },
  { name: "--layout-grid-template-4-col", cells: 4 },
  { name: "--layout-split-columns-even", cells: 2 },
  { name: "--layout-split-columns-feature", cells: 2 },
  { name: "--layout-split-columns-story", cells: 2 },
]

const VERTICALS = [
  {
    name: "Comedor Corporativo",
    accent: "--color-accent-service-dining",
    tokens: [
      "--color-accent-service-dining",
      "--color-accent-service-dining-surface",
      "--color-accent-service-dining-text",
    ],
    note: "Ocean. The core dining program carries the brand color itself: hero sections, dining service pages, and the deck system's Comedor chapters.",
  },
  {
    name: "Workplace Fuel",
    accent: "--color-accent-service-cafe",
    tokens: [
      "--color-accent-service-cafe",
      "--color-accent-service-cafe-surface",
      "--color-accent-service-cafe-text",
    ],
    note: "Lime. Coffee, café, and snacks & drinks (pantry) share one identity. Lime text only on its dark or lime-100 surfaces, never on warm cream.",
  },
  {
    name: "Momentos / Catering",
    accent: "--color-accent-service-catering",
    tokens: [
      "--color-accent-service-catering",
      "--color-accent-service-catering-surface",
      "--color-accent-service-catering-text",
    ],
    note: "Natural. Events and catering speak in warm neutrals: the identity is texture and photography more than a saturated accent.",
  },
]

export default function DesignSystemPage() {
  const oceanRamp = byPrefix("primitives", "--primitive-color-ocean-")
  const limeRamp = byPrefix("primitives", "--primitive-color-lime-")
  const naturalRamp = byPrefix("primitives", "--primitive-color-natural-")
  const greyRamp = byPrefix("primitives", "--primitive-color-grey-green-")
  const neutralRamp = byPrefix("primitives", "--primitive-color-neutral-")
  const spaceScale = byPrefix("primitives", "--primitive-space-").filter(
    (t) => !t.name.endsWith("-px") && !t.name.endsWith("-0"),
  )
  const radii = byPrefix("primitives", "--primitive-radius-")
  const shadows = byPrefix("primitives", "--primitive-shadow-").filter((t) => t.value !== "none")
  const durations = byPrefix("primitives", "--primitive-duration-")
  const eases = byPrefix("primitives", "--primitive-ease-")

  return (
    <main className="dsb">
      {/* ── Cover ── */}
      <header className="dsb-cover">
        <div className="dsb-container">
          <p className="dsb-cover-kicker">Zitrone · Brand Operating System</p>
          <h1 className="dsb-cover-title">
            One system behind <em>everything</em> we make
          </h1>
          <p className="dsb-cover-lead">
            This is the living brand book. Every value on this page is generated from the
            design-system source of truth, so what you read here is exactly what the website,
            the decks, and every future asset are built from.
          </p>
          <div className="dsb-cover-meta">
            <span>Source: src/design-system/tokens</span>
            <span>{tokenCount} governed tokens</span>
            <span>Generated {generatedAt}</span>
            <span>Contract: DESIGN.md</span>
          </div>
        </div>
      </header>

      <nav className="dsb-nav" aria-label="Sections">
        <div className="dsb-container dsb-nav-row">
          {NAV.map(([id, label]) => (
            <a key={id} href={`#${id}`}>
              {label}
            </a>
          ))}
        </div>
      </nav>

      {/* ── 01 Foundations ── */}
      <Section
        id="foundations"
        label="01 · Foundations"
        title="Six rules carry the whole brand"
        lead="Everything else in this book is an application of these. They are enforced in code, not by memory."
      >
        <div className="dsb-block">
          <ol className="dsb-rules">
            {[
              [
                "One source of truth.",
                "The system lives in src/design-system and cascades from there: website, deck system, this book. If another file disagrees, that file is wrong.",
              ],
              [
                "Manrope carries everything.",
                "One sans for display, body, and labels. Noto Serif Display appears only as an accent: stats, quotes, and single italic accent words.",
              ],
              [
                "No black, no red.",
                `Ink is ocean-950 (${tok("--primitive-color-ocean-950")}), never #000. Alerts and cautions stay in the brand's warm range: red does not exist here.`,
              ],
              [
                "Lime lives on dark.",
                "The lime accent pairs with ocean-700/800/900 surfaces. As text on warm or light surfaces it fails contrast and is never used.",
              ],
              [
                "Verticals are identities, not decoration.",
                "Comedor is ocean, Workplace Fuel is lime, Momentos is natural. A service color marks its category and nothing else.",
              ],
              [
                "Every value resolves through a token.",
                "Primitive → semantic → component. Hardcoding a governed value is drift; if no token fits, promote one first.",
              ],
            ].map(([title, body], i) => (
              <li key={title}>
                <span className="dsb-rule-number">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <strong>{title}</strong>
                  <p>{body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      {/* ── 02 Typography ── */}
      <Section
        id="typography"
        label="02 · Typography"
        title="One voice, one accent"
        lead="Manrope Light does the talking; Noto Serif Display raises an eyebrow. Sizes step down responsively through semantic roles, never ad hoc."
      >
        <Block title="Manrope" note={`Primary family for display, body, and labels: ${tok("--font-display")}`}>
          <div className="dsb-specimen">
            <div className="dsb-weights">
              <span style={{ fontWeight: 300 }}>Light 300</span>
              <span style={{ fontWeight: 400 }}>Regular 400</span>
              <span style={{ fontWeight: 500 }}>Medium 500</span>
              <span style={{ fontWeight: 600 }}>Semibold 600</span>
            </div>
            <span className="dsb-meta">
              Display and headings run Light; UI and emphasis use Medium/Semibold. Bolder cuts are
              reserved for the wordmark.
            </span>
          </div>
        </Block>
        <Block
          title="Noto Serif Display"
          note={`Accent family: ${tok("--font-serif-accent")}. Used through the stat, quote, and accent-word roles only.`}
        >
          <div className="dsb-specimen">
            <p
              className="dsb-specimen-sample"
              style={{
                fontFamily: "var(--type-accent-word-family)",
                fontStyle: "var(--type-accent-word-style)" as CSSProperties["fontStyle"],
                fontWeight: "var(--type-accent-word-weight)" as CSSProperties["fontWeight"],
                fontSize: "var(--type-card-heading-size)",
              }}
            >
              an accent, not a second voice
            </p>
            <span className="dsb-meta">--type-accent-word · italic · single words inside Manrope headings</span>
          </div>
        </Block>
        <Block title="Type roles" note="Rendered live at desktop size, with each role's resolved values. Roles step down at 64rem / 40rem breakpoints via semantic re-points.">
          {SPECIMENS.map((s) => (
            <Specimen key={s.base} {...s} />
          ))}
        </Block>
      </Section>

      {/* ── 03 Color ── */}
      <Section
        id="color"
        label="03 · Color"
        title="An ocean brand with a lime pulse"
        lead="Four families define the palette. Everything a screen shows resolves to one of these primitives through a semantic role."
      >
        <Block title="Ocean" note="The brand scale: teal-navy from tint to ink. 950 is the system's black.">
          <Ramp tokens={oceanRamp} />
        </Block>
        <Block title="Lime" note="The accent. Pairs with ocean-700/800/900 surfaces only.">
          <Ramp tokens={limeRamp} />
        </Block>
        <Block title="Natural" note="Warm cream surfaces; 50 is the page background.">
          <Ramp tokens={naturalRamp} />
        </Block>
        <Block title="Grey-ocean" note="Desaturated ocean for borders, muted text, and disabled states.">
          <Ramp tokens={greyRamp} />
        </Block>
        <Block title="Neutral" note="Pure grey for UI chrome. Text never uses it: ink is ocean-950.">
          <Ramp tokens={neutralRamp} />
        </Block>

        <Block
          title="Surfaces"
          note="Semantic roles: what a background means, not what it is. Each role shows its primitive chain and resolved value."
        >
          <Roles
            names={[
              "--color-surface-page",
              "--color-surface-container",
              "--color-surface-container-muted",
              "--color-surface-section-warm",
              "--color-surface-section-soft",
              "--color-surface-section-brand",
              "--color-surface-inverse",
              "--color-surface-bento-deep",
              "--color-surface-bento-raised",
              "--color-surface-bento-light",
            ]}
          />
        </Block>
        <Block
          title="Text on light surfaces"
          note="Hierarchy by tone, with documented contrast: heading ocean-600 (8.8:1 AAA), body ocean-500 (8.3:1 AAA), secondary grey-green-500 (4.1:1 AA-large), kicker ocean-400 (3.3:1, decorative)."
        >
          <Roles
            names={[
              "--color-text-heading",
              "--color-text-primary",
              "--color-text-secondary",
              "--color-text-muted",
              "--color-text-link",
              "--color-text-action",
            ]}
          />
        </Block>
        <div className="dsb-panel-dark">
          <Block
            title="Text on dark surfaces"
            note="On brand/inverse surfaces: white headings (12.5:1), ocean-100 body (9.6:1), ocean-200 secondary (7.3:1). All AAA."
          >
            <Roles
              names={[
                "--color-text-inverse",
                "--color-text-inverse-body",
                "--color-text-inverse-secondary",
              ]}
            />
          </Block>
        </div>
        <Block
          title="Actions"
          note="The action system pivots on ocean-900 at rest and lime-500 (brand lime) on hover: one hover language across primary and secondary."
        >
          <Roles
            names={[
              "--color-action-primary-background",
              "--color-action-primary-background-hover",
              "--color-action-primary-background-active",
              "--color-action-secondary-border",
              "--color-action-secondary-background-hover",
              "--color-action-accent-background",
              "--color-action-accent-background-hover",
              "--color-action-disabled-background",
            ]}
          />
        </Block>
        <Block title="Borders & focus">
          <Roles
            names={[
              "--color-border-subtle",
              "--color-border-default",
              "--color-border-strong",
              "--color-focus-ring",
            ]}
          />
        </Block>
      </Section>

      {/* ── 04 Space & shape ── */}
      <Section
        id="space"
        label="04 · Space & Shape"
        title="An 8px rhythm with room to breathe"
        lead="Space, radius, elevation, and motion come from short primitive scales; sections compose them through semantic roles."
      >
        <Block title="Space scale">
          <ScaleBars tokens={spaceScale} max={15} />
        </Block>
        <Block title="Radius" note="Controls and cards sit at radius-2; hero frames and section surfaces use the large 2rem role.">
          <div className="dsb-shape-row">
            {radii.map((t) => (
              <div key={t.name}>
                <div className="dsb-shape-sample" style={{ borderRadius: t.resolved ?? t.value }} />
                <span className="dsb-meta">
                  {shortName(t.name)} · {t.resolved ?? t.value}
                </span>
              </div>
            ))}
          </div>
        </Block>
        <Block title="Elevation" note="Three shadows, all drawn in ocean ink at low opacity. Flat is the default; elevation means something moved.">
          <div className="dsb-shadow-strip">
            {shadows.map((t) => (
              <div key={t.name}>
                <div className="dsb-shadow-sample" style={{ boxShadow: t.resolved ?? t.value }} />
                <span className="dsb-meta">{shortName(t.name)}</span>
              </div>
            ))}
          </div>
        </Block>
        <Block
          title="Motion"
          note={`Durations are stepped, easing is one standard curve (${tok("--primitive-ease-1")}). Reveals are subtle: ${tok("--motion-reveal-distance")} of travel, ${tok("--motion-reveal-stagger")} stagger.`}
        >
          <ul className="dsb-scale">
            {durations.map((t) => (
              <li key={t.name}>
                <span className="dsb-meta">
                  {shortName(t.name)} · {t.value}
                </span>
                <span
                  className="dsb-scale-bar"
                  style={{ width: `${Math.min(100, parseFloat(t.value) / 8)}%` }}
                />
              </li>
            ))}
          </ul>
          <p className="dsb-block-note">
            {eases.map((t) => `${shortName(t.name)}: ${t.value}`).join("  ·  ")}
          </p>
        </Block>
      </Section>

      {/* ── 05 Layout ── */}
      <Section
        id="layout"
        label="05 · Layout"
        title="Wide stage, readable measure"
        lead={`Content lives on a ${tok("--size-container-main")} stage with a fluid page margin of ${tok("--size-page-margin")}. Reading copy never exceeds ${tok("--size-container-readable")}.`}
      >
        <Block title="Grids & splits" note="Column templates and split ratios are tokens too: sections pick a role, never invent a template.">
          {GRID_DEMOS.map(({ name, cells }) => (
            <div key={name}>
              <span className="dsb-meta">
                {name} · {tok(name)}
              </span>
              <div className="dsb-grid-demo" style={{ gridTemplateColumns: tok(name) }}>
                {Array.from({ length: cells }, (_, i) => (
                  <span key={i} />
                ))}
              </div>
            </div>
          ))}
        </Block>
        <Block title="Section rhythm" note="Vertical paddings per section type, resolved at desktop.">
          <ul className="dsb-roles">
            {[
              "--space-section-small",
              "--space-section-medium",
              "--space-section-large",
              "--space-section-hero-block",
            ].map((name) => (
              <li key={name}>
                <span className="dsb-role-chip" style={{ background: "var(--color-surface-section-soft)" }} />
                <span className="dsb-role-name">{name}</span>
                <span className="dsb-meta">← {chain(name).join(" ← ")}</span>
                <span className="dsb-meta dsb-role-value">
                  {tok(name)} {asPx(tok(name)) ? `· ${asPx(tok(name))}` : ""}
                </span>
              </li>
            ))}
          </ul>
        </Block>
      </Section>

      {/* ── 06 Components ── */}
      <Section
        id="components"
        label="06 · Components"
        title="APIs, not snowflakes"
        lead="Every component consumes its own token API (layer 3), which resolves through semantic roles. Restyling means changing tokens, and the change lands everywhere at once."
      >
        <Block
          title="Buttons"
          note={`Primary rests on ${chain("--button-color-background-primary").join(" ← ")} (${tok("--button-color-background-primary")}); hover moves to lime-500 (${tok("--button-color-background-primary-hover")}). Hover the samples.`}
        >
          <div className="dsb-demo-row">
            <button type="button" className="dsb-btn dsb-btn--primary">Primary action</button>
            <button type="button" className="dsb-btn dsb-btn--secondary">Secondary action</button>
            <button type="button" className="dsb-btn dsb-btn--accent">Accent action</button>
          </div>
          <div className="dsb-panel-dark">
            <div className="dsb-demo-row" style={{ marginTop: 0 }}>
              <button type="button" className="dsb-btn dsb-btn--inverse-primary">Inverse primary</button>
              <button type="button" className="dsb-btn dsb-btn--inverse-secondary">Inverse secondary</button>
            </div>
          </div>
        </Block>
        <Block title="Labels & pills">
          <div className="dsb-demo-row">
            <span className="dsb-kicker">Kicker label</span>
            <span className="dsb-pill">Filter pill</span>
          </div>
        </Block>
        <Block
          title="The component grammar"
          note="The full marketing grammar (heroes, service cards, carousels, system tabs, footers and blog surfaces) lives in src/design-system/components/marketing.css as .ds-* families, all wired to these token APIs. The website is its living showcase."
        >
          <p className="dsb-block-note">
            Component token families in layer 3: button · pill/tag/kicker · navigation · media ·
            carousel · card · section · system tabs · service system · footer.
          </p>
        </Block>
      </Section>

      {/* ── 07 Service verticals ── */}
      <Section
        id="verticals"
        label="07 · Service Verticals"
        title="Three programs, three temperatures"
        lead="A service's color marks its category across the website and the deck system. Nothing else borrows it."
      >
        <div className="dsb-verticals">
          {VERTICALS.map((v) => (
            <div
              key={v.name}
              className="dsb-vertical"
              style={{ "--vertical-accent": tok(v.accent) } as CSSProperties}
            >
              <h3>{v.name}</h3>
              <div className="dsb-ramp">
                {v.tokens.map((name) => (
                  <div className="dsb-swatch" key={name}>
                    <div className="dsb-swatch-color" style={{ background: tok(name) }} />
                    <span className="dsb-meta">
                      {shortName(name).replace("accent-service-", "")}
                      <br />
                      {tok(name)}
                    </span>
                  </div>
                ))}
              </div>
              <p>{v.note}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── 08 Governance ── */}
      <Section
        id="governance"
        label="08 · Governance"
        title="How the system stays one system"
        lead="Three layers, one direction of reference, and generated consumers. The cascade is mechanical, so alignment does not depend on anyone's memory."
      >
        <Block title="The layer chain" note="A real example, end to end:">
          <p className="dsb-meta" style={{ fontSize: "var(--type-support-size)" }}>
            --primitive-color-ocean-900 ({tok("--primitive-color-ocean-900")}) →
            --color-action-primary-background → --button-color-background-primary → every primary
            button on the site
          </p>
        </Block>
        <Block title="Consumers">
          <ul className="dsb-rules">
            {[
              ["Website", "src/app/globals.css imports the token layers; components consume layer-3 APIs."],
              ["Deck system", "zitrone-deck-system re-locks its tokens.css to these primitives on every build (npm run tokens:sync)."],
              ["This book", "scripts/design-tokens-data.mjs regenerates the data behind this page on every dev/build run."],
            ].map(([title, body], i) => (
              <li key={title}>
                <span className="dsb-rule-number">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <strong>{title}</strong>
                  <p>{body}</p>
                </div>
              </li>
            ))}
          </ul>
        </Block>
        <Block
          title="Changing the system"
          note="Edit the right token layer in src/design-system/tokens, run the audit (zsh scripts/design-system-audit.sh), rebuild, then cascade to decks. The full contract is DESIGN.md at the repo root."
        >
          <p className="dsb-block-note">
            Docs under docs/design-system/_archive are the historical planning record, not current
            rules.
          </p>
        </Block>
      </Section>

      <footer className="dsb-footer">
        <div className="dsb-container">
          <span className="dsb-meta">
            Zitrone Design System · generated {generatedAt} from src/design-system/tokens ·{" "}
            {tokenCount} tokens · governed by DESIGN.md
          </span>
        </div>
      </footer>
    </main>
  )
}
