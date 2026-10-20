#!/usr/bin/env node
/* ═══════════════════════════════════════════════════════════════════════════
   ASSETS SYNC — the single build step behind the asset single-source-of-truth.

   public/img/ IS the single canonical asset library (organized shared/ + site/).
   There is no separate master tree — assets live once, in public/img.

   Reads   assets.manifest.json  +  public/img/**
   Does    1. validates every manifest file/logo actually exists in public/img
           2. folds in the deck photos under public/img/shared/services/** so the
              index covers every canonical image (alts from data/photos.json or derived)
           3. generates src/lib/assets.generated.ts (typed map the site imports by id)
              + public/assets-index.json — the PORTABLE contract any external
                consumer (e.g. the deck repo) reads to resolve images as `base + src`.
                Binaries live once at the asset origin; consumers never copy them.
              + deck-system/data/brands.json (logo wall) — only when deck-system/ is
                present, so the website builds standalone after the deck repo splits.

   Env     ASSETS_BASE_URL  baked into assets-index.json as `base` (default "").
           Same-origin consumers (the website) leave it ""; a separate deck repo
           sets it to the deployed asset origin, e.g. https://zitrone.example.
   Modes   (default)  write generated files
           --check    verify only: nothing missing + generated files current (non-zero on drift)

   Run:    node scripts/assets-sync.mjs          (or: npm run assets:sync)
           node scripts/assets-sync.mjs --check   (or: npm run assets:check)
   ═══════════════════════════════════════════════════════════════════════════ */
import {
  readFileSync, writeFileSync, copyFileSync, mkdirSync,
  existsSync, statSync, readdirSync,
} from "node:fs";
import { dirname, resolve, relative, extname, basename } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const CHECK = process.argv.includes("--check");

const MANIFEST = resolve(ROOT, "assets.manifest.json");
const PUBLIC = resolve(ROOT, "public");
const DECK_PUBLIC = resolve(PUBLIC, "img", "shared", "services");
// photos.json is website asset-metadata (alts for /img/shared/services photos);
// it lives website-side and its alts flow into assets-index.json for all consumers.
const PHOTOS_JSON = resolve(ROOT, "assets.photos.json");
const BRANDS_JSON = resolve(ROOT, "deck-system", "data", "brands.json");
const GENERATED = resolve(ROOT, "src", "lib", "assets.generated.ts");
const ASSETS_INDEX = resolve(PUBLIC, "assets-index.json");

// deck-system/data is the only legacy filesystem coupling to the deck repo.
// Its outputs (brands.json) are written/checked only while that folder exists,
// so the website builds standalone once the deck repo splits out.
const HAS_DECK = existsSync(resolve(ROOT, "deck-system", "data"));
// External consumers resolve images as `base + src`; same-origin website = "".
const ASSETS_BASE_URL = process.env.ASSETS_BASE_URL ?? "";

const IMG_EXT = new Set([".jpg", ".jpeg", ".png", ".svg", ".webp", ".avif", ".gif"]);
const IGNORE = new Set([".DS_Store", "Thumbs.db"]);

const errors = [];
const fail = (msg) => errors.push(msg);

/* ── helpers ─────────────────────────────────────────────────────────────── */
const jsonExport = (v) => JSON.stringify(v, null, 2);

const kebab = (s) =>
  decodeURIComponent(s)
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

function walk(dir, base = dir) {
  const out = [];
  if (!existsSync(dir)) return out;
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (IGNORE.has(e.name)) continue;
    const abs = resolve(dir, e.name);
    if (e.isDirectory()) out.push(...walk(abs, base));
    else if (IMG_EXT.has(extname(e.name).toLowerCase())) out.push(relative(base, abs));
  }
  return out;
}

/* ── 1. read manifest ──────────────────────────────────────────────────────── */
const manifest = JSON.parse(readFileSync(MANIFEST, "utf8"));
const entries = new Map(); // id -> { id, src(public url), alt, tags }

for (const f of manifest.files ?? []) {
  if (entries.has(f.id)) fail(`duplicate manifest id: ${f.id}`);
  // public/img IS the canonical library — validate the file exists there.
  const onDisk = resolve(PUBLIC, decodeURIComponent(f.public).replace(/^\//, ""));
  if (!existsSync(onDisk)) fail(`manifest file missing on disk: ${f.public} (id ${f.id})`);
  entries.set(f.id, { id: f.id, src: f.public, alt: f.alt ?? "", tags: f.tags ?? [] });
}

/* ── 2. fold in existing deck photos (kept at /img/shared/services/*) ──────────────── */
const photoAlt = new Map(); // public path -> alt
if (existsSync(PHOTOS_JSON)) {
  for (const p of JSON.parse(readFileSync(PHOTOS_JSON, "utf8")).photos ?? []) {
    if (p.file && p.alt) photoAlt.set(p.file, p.alt);
  }
}
for (const rel of walk(DECK_PUBLIC)) {
  if (!rel.includes("/")) continue; // top-level files are website cards (manifest), not deck sections
  const section = rel.split("/")[0];
  const pub = "/img/shared/services/" + rel.split("/").map(encodeURIComponent).join("/");
  const rawPub = "/img/shared/services/" + rel;
  const id = `${section}-${kebab(basename(rel))}`;
  // Skip raw camera exports (Z_MARZO_26-NNN) that aren't registered in
  // photos.json — they're un-curated intake (pruned in cleanup), not canonical.
  const isRawExport = /-z-marzo-26-\d+$/.test(id);
  if (isRawExport && !photoAlt.has(rawPub) && !photoAlt.has(pub)) continue;
  if (entries.has(id)) continue; // manifest wins
  entries.set(id, {
    id,
    src: rawPub,
    alt: photoAlt.get(rawPub) ?? photoAlt.get(pub) ?? `${section} — Zitrone`,
    tags: ["deck", `service:${section}`],
  });
}

/* ── 3. logos: clients, media, brand (kept under /logos/*) ─────────────────── */
const clients = manifest.clients ?? [];
const media = manifest.media ?? [];
const brand = manifest.brand ?? [];

// Validate every logo path actually exists in public/, and register each logo
// in the asset index so it is also reachable via assetSrc("client-uber") etc.
function registerLogo(kind, id, pubPath, alt, extraTags = []) {
  if (!pubPath) return;
  const onDisk = resolve(PUBLIC, decodeURIComponent(pubPath).replace(/^\//, ""));
  if (!existsSync(onDisk)) fail(`${kind} logo missing on disk: ${pubPath} (id ${id})`);
  if (!entries.has(id)) entries.set(id, { id, src: pubPath, alt, tags: [kind, ...extraTags] });
}
for (const c of clients) {
  registerLogo("client", `client-${c.id}`, c.logo, c.name);
  registerLogo("client", `client-${c.id}-mono`, c.logoMono, `${c.name} (mono)`, ["mono"]);
  registerLogo("client", `client-${c.id}-photo`, c.photo, c.name, ["photo"]);
}
for (const m of media) registerLogo("media", `media-${m.id}`, m.logo, m.name);
for (const b of brand) registerLogo("brand", `brand-${b.id}`, b.logo, b.name);

// brands.json (deck logo wall) is GENERATED from manifest.clients — one source.
function buildBrandsJson() {
  const about = existsSync(BRANDS_JSON)
    ? JSON.parse(readFileSync(BRANDS_JSON, "utf8"))._about
    : "Client logo wall registry — GENERATED from assets.manifest.json (clients[]).";
  const rowsMap = new Map();
  for (const c of clients) {
    // `"active": false` retires a client from the wall without losing its
    // entry or artwork — delete the flag to bring the logo back everywhere.
    if (c.active === false) continue;
    const r = c.wallRow ?? 0;
    if (!rowsMap.has(r)) rowsMap.set(r, { lead: !!c.lead, logos: [] });
    if (c.lead) rowsMap.get(r).lead = true;
    const logo = { id: c.id, name: c.name, file: c.logo };
    if (c.scale && c.scale !== 1) logo.scale = c.scale;
    rowsMap.get(r).logos.push(logo);
  }
  const rows = [...rowsMap.keys()].sort((a, b) => a - b).map((k) => {
    const row = rowsMap.get(k);
    return row.lead ? { lead: true, logos: row.logos } : { logos: row.logos };
  });
  return JSON.stringify({ _about: about, wall: { rows } }, null, 2) + "\n";
}
const brandsJson = buildBrandsJson();

/* ── 4. generate src/lib/assets.generated.ts ───────────────────────────────── */
const sorted = [...entries.values()].sort((a, b) => a.id.localeCompare(b.id));

/* portable contract — the single artifact external consumers (deck repo) read.
   Deterministic (no timestamp) so --check can diff it. Resolve images as
   `base + src`; binaries stay at the asset origin, never copied. */
const assetsIndexJson =
  JSON.stringify(
    {
      _about:
        "Portable canonical asset contract — GENERATED by scripts/assets-sync.mjs from assets.manifest.json + public/img. Consumers resolve images as `base + src`; binaries live once at the asset origin and are never copied. Regenerate with `npm run assets:sync`.",
      version: 1,
      base: ASSETS_BASE_URL,
      assets: Object.fromEntries(sorted.map((e) => [e.id, { src: e.src, alt: e.alt, tags: e.tags }])),
      clients,
      media,
      brand,
    },
    null,
    2,
  ) + "\n";
const idUnion = sorted.map((e) => `  | ${JSON.stringify(e.id)}`).join("\n");
const body = sorted
  .map(
    (e) =>
      `  ${JSON.stringify(e.id)}: { src: ${JSON.stringify(e.src)}, alt: ${JSON.stringify(
        e.alt,
      )}, tags: ${JSON.stringify(e.tags)} },`,
  )
  .join("\n");

const generated = `// AUTO-GENERATED by scripts/assets-sync.mjs — do not edit by hand.
// Source of truth: assets.manifest.json + the public/img library.
// Regenerate with:  npm run assets:sync

export type AssetId =
${idUnion};

export interface AssetEntry {
  /** Public URL served by Next (use directly as an <img>/next/image src). */
  src: string;
  /** Default alt text; components may override. */
  alt: string;
  /** Free-form tags for discovery, e.g. "service:comedor", "equipment:coffee-machines". */
  tags: readonly string[];
}

export const ASSETS: Record<AssetId, AssetEntry> = {
${body}
} as const;

/** Resolve an asset by id. Throws if the id is unknown (fail fast at build). */
export function asset(id: AssetId): AssetEntry {
  const entry = ASSETS[id];
  if (!entry) throw new Error(\`Unknown asset id: \${id}\`);
  return entry;
}

/** Convenience: just the public src for an id. */
export function assetSrc(id: AssetId): string {
  return asset(id).src;
}

/** All assets carrying a given tag — e.g. assetsByTag("equipment:coffee-machines"). */
export function assetsByTag(tag: string): AssetEntry[] {
  return Object.values(ASSETS).filter((a) => a.tags.includes(tag));
}

export interface Client {
  id: string;
  name: string;
  /** Primary full-color mark (/img/shared/clients/<id>.svg). */
  logo: string;
  /** Horizontal lockup (/img/shared/clients/wide/<id>.svg), when available. */
  logoWide?: string;
  /** Monochrome version (/img/shared/clients/mono/<id>.svg) — hero ribbon / dark bg / testimonials. */
  logoMono?: string;
  /** Client photo, when available (e.g. testimonial portraits). */
  photo?: string;
  /** Per-mark optical scale tweak for the deck logo wall. */
  scale?: number;
  /** Logo-wall row index (0 = lead marquee row). */
  wallRow: number;
  /** True for the curated lead marquee row. */
  lead?: boolean;
  /** Omitted means active. False retires the client from the deck logo wall
   *  and every site surface, keeping the entry and artwork for reactivation. */
  active?: boolean;
}

/** Every client — single source for the deck logo wall + site client surfaces. */
export const CLIENTS: readonly Client[] = ${jsonExport(clients)} as const;

export interface BrandLogo { id: string; name: string; logo: string; scale?: number }

/** Press / media logos. */
export const MEDIA: readonly BrandLogo[] = ${jsonExport(media)} as const;

/** Zitrone brand identity marks. */
export const BRAND: readonly BrandLogo[] = ${jsonExport(brand)} as const;

/** Look up a client by id. */
export function client(id: string): Client | undefined {
  return CLIENTS.find((c) => c.id === id);
}
`;

if (CHECK) {
  const current = existsSync(GENERATED) ? readFileSync(GENERATED, "utf8") : "";
  if (current !== generated) fail("src/lib/assets.generated.ts is out of date — run `npm run assets:sync`");
  const currentIndex = existsSync(ASSETS_INDEX) ? readFileSync(ASSETS_INDEX, "utf8") : "";
  if (currentIndex !== assetsIndexJson) fail("public/assets-index.json is out of date — run `npm run assets:sync`");
  if (HAS_DECK) {
    const currentBrands = existsSync(BRANDS_JSON) ? readFileSync(BRANDS_JSON, "utf8") : "";
    if (currentBrands !== brandsJson) fail("deck-system/data/brands.json is out of date — run `npm run assets:sync`");
  }
  if (errors.length) {
    console.error("assets:check FAILED:\n  - " + errors.join("\n  - "));
    process.exit(1);
  }
  console.log(`assets:check OK — ${sorted.length} assets, ${clients.length} clients; generated files consistent.`);
} else {
  if (errors.length) {
    console.error("assets:sync FAILED:\n  - " + errors.join("\n  - "));
    process.exit(1);
  }
  mkdirSync(dirname(GENERATED), { recursive: true });
  writeFileSync(GENERATED, generated);
  writeFileSync(ASSETS_INDEX, assetsIndexJson);
  if (HAS_DECK) writeFileSync(BRANDS_JSON, brandsJson);
  console.log(
    `assets:sync OK — ${sorted.length} assets, ${clients.length} clients indexed; wrote assets.generated.ts + assets-index.json${HAS_DECK ? " + brands.json" : ""}.`,
  );
}
