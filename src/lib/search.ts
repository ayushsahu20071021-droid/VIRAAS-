// Token-based search — gender matching is TOKEN-BASED.
// "women" must never accidentally match "men" (substring matching is forbidden).
import { ALL_PRODUCTS, ALL_COUPLES, WORLDS, isListed } from "@/lib/catalog";
import type { Product, CoupleLook } from "@/lib/types";

const GENDER_TOKENS: Record<string, "women" | "men"> = {
  women: "women", woman: "women", womens: "women", "women's": "women", w: "women", girls: "women", girl: "women", her: "women", she: "women", ladies: "women",
  men: "men", man: "men", mens: "men", "men's": "men", m: "men", boys: "men", boy: "men", him: "men", his: "men", he: "men", guys: "men"
};

const WORLD_TOKENS: Record<string, string> = {};
for (const w of WORLDS) {
  for (const alt of [w.slug, ...w.alt]) WORLD_TOKENS[alt] = w.slug;
  WORLD_TOKENS[w.label.toLowerCase().replace(/ \/ /g, " ").split(" ")[0]] = w.slug;
}
WORLD_TOKENS["navratri"] = "garba";
WORLD_TOKENS["garba"] = "garba";
WORLD_TOKENS["dandiya"] = "garba";
WORLD_TOKENS["college"] = "college-fest";
WORLD_TOKENS["campus"] = "college-fest";
WORLD_TOKENS["fest"] = "college-fest";
WORLD_TOKENS["diwali"] = "diwali";
WORLD_TOKENS["deepavali"] = "diwali";
WORLD_TOKENS["party"] = "festive-party";
WORLD_TOKENS["traditional"] = "traditional";
WORLD_TOKENS["ethnic"] = "traditional";

const CATEGORY_TOKENS: Record<string, string[]> = {
  "chaniya-choli": ["chaniya", "choli", "chaniya choli"],
  lehenga: ["lehenga", "lehengas"],
  sharara: ["sharara", "shararas"],
  gharara: ["gharara", "ghararas"],
  sarees: ["saree", "sarees", "saari"],
  "pre-draped-sarees": ["pre-draped", "pre draped", "pre-draped saree", "ready-to-wear saree", "pre stitched"],
  anarkali: ["anarkali", "anarkalis"],
  "kurta-sets": ["kurta set", "kurta sets", "kurta"],
  "festive-sets": ["festive set", "festive sets"],
  jewellery: ["jewellery", "jewelry", "earrings", "jhumka", "necklace", "maang tikka", "bangles", "rings"],
  bags: ["bag", "bags", "potli", "clutch", "sling"],
  footwear: ["footwear", "jutti", "juttis", "kolhapuri", "heels", "flats"],
  beauty: ["beauty", "kajal", "kohl", "lipstick", "lip", "mini"],
  "modern-ethnic-shirts": ["ethnic shirt", "ethnic shirts", "modern ethnic shirt"],
  "printed-ethnic": ["printed ethnic", "printed shirt", "printed kurta"],
  "embroidered-ethnic": ["embroidered ethnic", "embroidered shirt", "embroidered kurta"],
  "modern-kurtas": ["modern kurta", "kurta"],
  "festive-layers": ["festive layer", "layer", "layers", "overshirt"],
  "festive-separates": ["festive separate", "separates", "trousers", "pants"],
  "contemporary-garba": ["contemporary garba", "garba look", "garba looks"],
  accessories: ["accessory", "accessories", "mojari", "stole", "scarf", "brooch", "chain", "bracelet"]
};

const COLOUR_TOKENS = ["hot pink", "rani pink", "royal blue", "sky blue", "black", "ivory", "white", "red", "navy", "emerald", "mustard", "wine", "maroon", "magenta", "multicolour", "gold", "silver", "yellow", "peach", "coral", "lilac", "lime", "mint", "olive", "charcoal", "grey", "beige", "indigo", "teal", "green", "pink", "blue"];

const STYLE_TOKENS: Record<string, string[]> = {
  mirror: ["mirror"], bandhani: ["bandhani"], bandhej: ["bandhej"], gota: ["gota"], kutchi: ["kutchi"],
  embroidered: ["embroidered", "embroidery"], printed: ["printed", "print"], festive: ["festive"],
  black: ["black festive", "black"]
};

export interface SearchQuery {
  q: string;
  gender?: "women" | "men";
  world?: string;
  maxPrice?: number;
  accessories?: boolean;
}

export interface ParsedTokens {
  gender: "women" | "men" | null;
  worlds: string[];
  categories: string[];
  colours: string[];
  styles: string[];
  coupleIntent: boolean;
  rest: string[];
}

export function tokenize(query: string): string[] {
  return query
    .toLowerCase()
    .replace(/[’']/g, "'")
    .replace(/[^a-z0-9'\s-]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

export function parseQuery(raw: string): ParsedTokens {
  const tokens = tokenize(raw);
  const out: ParsedTokens = { gender: null, worlds: [], categories: [], colours: [], styles: [], coupleIntent: false, rest: [] };

  // Multi-word category phrases first
  let joined = ` ${tokens.join(" ")} `;
  for (const [slug, phrases] of Object.entries(CATEGORY_TOKENS)) {
    for (const ph of phrases) {
      if (ph.includes(" ") && joined.includes(` ${ph} `)) {
        out.categories.push(slug);
        joined = joined.replace(` ${ph} `, " ");
      }
    }
  }
  const rest = joined.trim().split(/\s+/).filter(Boolean);

  for (const t of rest) {
    if (t === "couple" || t === "couples" || t === "duo") { out.coupleIntent = true; continue; }
    // TOKEN-BASED gender: exact token membership only — never substring
    if (t in GENDER_TOKENS) {
      const g = GENDER_TOKENS[t];
      // first explicit token wins; "women" never resolves to "men"
      if (!out.gender) out.gender = g;
      continue;
    }
    if (t in WORLD_TOKENS) {
      const w = WORLD_TOKENS[t];
      if (!out.worlds.includes(w)) out.worlds.push(w);
      continue;
    }
    let matchedCat: string | null = null;
    for (const [slug, phrases] of Object.entries(CATEGORY_TOKENS)) {
      if (phrases.includes(t)) { matchedCat = slug; break; }
    }
    if (matchedCat) {
      if (!out.categories.includes(matchedCat)) out.categories.push(matchedCat);
      continue;
    }
    const colour = COLOUR_TOKENS.find((c) => c === t || (c.includes(" ") && t.includes(c)));
    if (colour) {
      if (!out.colours.includes(colour)) out.colours.push(colour);
      continue;
    }
    if (t in STYLE_TOKENS) {
      if (!out.styles.includes(t)) out.styles.push(t);
      continue;
    }
    out.rest.push(t);
  }
  return out;
}

function productHaystack(p: Product): string {
  return [p.title, p.category, p.subcategory, p.colour, p.secondaryColours.join(" "), p.fabric, p.pattern, p.embroidery, p.silhouette, p.styleTags.join(" "), p.description].join(" ").toLowerCase();
}

export function searchProducts(raw: string, opts: Partial<SearchQuery> = {}): Product[] {
  const parsed = parseQuery(raw);
  const gender = opts.gender ?? parsed.gender;
  const worlds = parsed.worlds;
  let pool = ALL_PRODUCTS.filter(isListed);

  if (gender) pool = pool.filter((p) => p.gender === gender);
  else if (parsed.gender) pool = pool.filter((p) => p.gender === parsed.gender);
  if (opts.world) pool = pool.filter((p) => p.occasion === opts.world);
  if (worlds.length) pool = pool.filter((p) => worlds.includes(p.occasion));
  if (parsed.categories.length) pool = pool.filter((p) => parsed.categories.includes(p.categorySlug));
  if (parsed.colours.length) {
    pool = pool.filter((p) => {
      const all = [p.colour, ...p.secondaryColours].map((c) => c.toLowerCase());
      return parsed.colours.some((col) => all.some((c) => c.includes(col) || col.includes(c)));
    });
  }
  if (opts.maxPrice) pool = pool.filter((p) => p.price <= opts.maxPrice!);
  if (opts.accessories) {
    pool = pool.filter((p) => ["jewellery", "bags", "footwear", "beauty", "accessories"].includes(p.categorySlug));
  }

  // score: priority world first + term hits
  const priority = Object.fromEntries(WORLDS.map((w) => [w.slug, w.priority]));
  const scored = pool.map((p) => {
    const hay = productHaystack(p);
    let score = 10 - (priority[p.occasion] ?? 9);
    for (const t of [...parsed.rest, ...parsed.styles]) if (hay.includes(t)) score += 3;
    for (const c of parsed.colours) if (p.colour.toLowerCase().includes(c)) score += 4;
    return { p, score };
  });
  scored.sort((a, b) => b.score - a.score || a.p.id.localeCompare(b.p.id));
  return scored.map((s) => s.p);
}

export function searchCouples(raw: string): CoupleLook[] {
  const parsed = parseQuery(raw);
  const priority = Object.fromEntries(WORLDS.map((w) => [w.slug, w.priority]));
  let pool = ALL_COUPLES;
  if (parsed.worlds.length) pool = pool.filter((c) => parsed.worlds.includes(c.world));
  const scored = pool.map((c) => {
    const hay = [c.title, c.description, c.colourStory, c.poseDirection, c.tags.join(" ")].join(" ").toLowerCase();
    let score = 10 - (priority[c.world] ?? 9);
    for (const t of [...parsed.rest, ...parsed.styles, ...parsed.colours]) if (hay.includes(t)) score += 3;
    return { c, score };
  });
  scored.sort((a, b) => b.score - a.score || a.c.id.localeCompare(b.c.id));
  return scored.map((s) => s.c);
}
