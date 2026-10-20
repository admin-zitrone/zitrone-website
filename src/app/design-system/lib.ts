import data from "@/design-system/tokens.generated.json"

export type Token = { name: string; value: string; resolved?: string }
export type Group = { name: string; note?: string; tokens: Token[] }
export type LayerId = "primitives" | "semantic" | "component"

const layers = data.layers as Record<LayerId, { file: string; groups: Group[] }>

const index = new Map<string, Token>()
for (const layer of Object.values(layers)) {
  for (const group of layer.groups) {
    for (const token of group.tokens) index.set(token.name, token)
  }
}

export const generatedAt: string = data.generatedAt
export const tokenCount: number = index.size

/** Final resolved value of a token (falls back to its raw value). */
export function tok(name: string): string {
  const t = index.get(name)
  return t ? (t.resolved ?? t.value) : ""
}

/** Raw (reference) value of a token, e.g. "var(--primitive-color-ocean-600)". */
export function ref(name: string): string {
  return index.get(name)?.value ?? ""
}

/** The primitive a semantic token points at, shortened: "ocean-600". */
export function refName(name: string): string {
  const m = ref(name).match(/var\(--(?:primitive-(?:color-)?)?([\w-]+)\)/)
  return m ? m[1] : ref(name)
}

/** "4.75rem" → "76px" (empty for non-rem values). */
export function asPx(value: string): string {
  const m = value.match(/^([\d.]+)rem$/)
  return m ? `${parseFloat(m[1]) * 16}px` : ""
}

export function groupsOf(layer: LayerId): Group[] {
  return layers[layer].groups
}

/** All tokens of a layer whose name starts with a prefix, in source order. */
export function byPrefix(layer: LayerId, prefix: string): Token[] {
  return layers[layer].groups.flatMap((g) => g.tokens.filter((t) => t.name.startsWith(prefix)))
}

/** Display name without the primitive/color noise: "--primitive-color-ocean-600" → "ocean-600". */
export function shortName(name: string): string {
  return name.replace(/^--(primitive-(color-|font-|space$|space-|radius-|shadow-|duration-|ease-)?|color-|type-|space-|size-)/, "")
}

/** Reference chain of a token, shortened: ["color-action-primary-background", "ocean-900"]. */
export function chain(name: string): string[] {
  const out: string[] = []
  let current = name
  for (let i = 0; i < 6; i++) {
    const m = ref(current).match(/^var\((--[\w-]+)\)$/)
    if (!m) break
    current = m[1]
    out.push(shortName(current))
  }
  return out
}
