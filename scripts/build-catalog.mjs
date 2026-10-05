#!/usr/bin/env node
// VIRAAS catalog builder — deterministic, seeded.
// Emits: src/data/{products,couples,journal,collections,taxonomy,image-manifest}.json
// 823 products (505 women / 318 men) · 100 couple looks (20 per world) · image queue.

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  WORLDS, WORLD_META, POSES, CAMERAS, LENSES, WOMEN_CATS, MEN_CATS,
  PATTERN_POOL_W, EMBROIDERY_POOL_W, PATTERN_POOL_M, EMBROIDERY_POOL_M,
  W_DETAIL_POOL, M_DETAIL_POOL, STYLES_W, STYLES_M,
  MERCHANTS, MERCHANT_WEIGHTS, VERIFIED_URLS,
  PRODUCT_NEGATIVE, COUPLE_NEGATIVE,
  productPrompt, couplePrompt,
  TODAY, AGE
} from "./lib/vocab.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DATA = join(ROOT, "src", "data");

// ---------- seeded PRNG ----------
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rnd = mulberry32(20260923);
const pick = (arr) => arr[Math.floor(rnd() * arr.length)];
const pickN = (arr, n) => {
  const c = [...arr], out = [];
  while (out.length < n && c.length) out.push(c.splice(Math.floor(rnd() * c.length), 1)[0]);
  return out;
};
const int = (lo, hi) => lo + Math.floor(rnd() * (hi - lo + 1));
const weightedPick = (weights) => {
  const entries = Object.entries(weights);
  const total = entries.reduce((s, [, w]) => s + w, 0);
  let r = rnd() * total;
  for (const [k, w] of entries) { r -= w; if (r <= 0) return k; }
  return entries[entries.length - 1][0];
};

// ---------- quotas (hard totals: 505 women + 318 men = 823) ----------
const WOMEN_QUOTAS = {
  "garba": { "chaniya-choli": 65, "lehenga": 30, "sharara": 10, "gharara": 8, "festive-sets": 12, "jewellery": 10, "bags": 5, "footwear": 5, "beauty": 5 },
  "college-fest": { "chaniya-choli": 20, "lehenga": 18, "sharara": 8, "gharara": 5, "kurta-sets": 14, "festive-sets": 12, "jewellery": 6, "bags": 4, "footwear": 4, "beauty": 4 },
  "diwali": { "lehenga": 18, "sarees": 18, "pre-draped-sarees": 12, "anarkali": 14, "kurta-sets": 14, "festive-sets": 10, "jewellery": 6, "bags": 3, "footwear": 3, "beauty": 2 },
  "festive-party": { "lehenga": 15, "sarees": 12, "pre-draped-sarees": 10, "sharara": 6, "gharara": 5, "anarkali": 8, "festive-sets": 12, "jewellery": 6, "bags": 4, "footwear": 4, "beauty": 3 },
  "traditional": { "sarees": 16, "lehenga": 12, "chaniya-choli": 6, "anarkali": 12, "kurta-sets": 14, "gharara": 4, "sharara": 3, "jewellery": 4, "bags": 1, "footwear": 2, "beauty": 1 }
};
const MEN_QUOTAS = {
  "garba": { "contemporary-garba": 30, "modern-ethnic-shirts": 22, "printed-ethnic": 12, "embroidered-ethnic": 12, "modern-kurtas": 8, "festive-sets": 6, "festive-layers": 3, "accessories": 2 },
  "college-fest": { "printed-ethnic": 18, "modern-ethnic-shirts": 16, "embroidered-ethnic": 8, "modern-kurtas": 12, "festive-sets": 8, "festive-separates": 4, "accessories": 4 },
  "diwali": { "embroidered-ethnic": 12, "modern-ethnic-shirts": 10, "printed-ethnic": 8, "modern-kurtas": 14, "festive-sets": 10, "festive-layers": 4, "accessories": 2 },
  "festive-party": { "modern-ethnic-shirts": 12, "embroidered-ethnic": 10, "festive-layers": 8, "modern-kurtas": 8, "festive-separates": 6, "printed-ethnic": 4, "accessories": 2 },
  "traditional": { "modern-kurtas": 16, "festive-sets": 10, "printed-ethnic": 6, "embroidered-ethnic": 5, "modern-ethnic-shirts": 3, "accessories": 3 }
};

const ACCESSORY_W = new Set(["jewellery", "bags", "footwear", "beauty"]);
const ACCESSORY_M = new Set(["accessories"]);
const isAccessory = (gender, cat) => gender === "women" ? ACCESSORY_W.has(cat) : ACCESSORY_M.has(cat);

const NOUNS = {
  "Earrings": "Earrings", "Necklace Sets": "Necklace Set", "Maang Tikka": "Maang Tikka",
  "Bangles & Bracelets": "Bangle Set", "Rings": "Ring Set",
  "Potlis": "Potli Bag", "Clutches": "Clutch", "Sling Bags": "Sling Bag", "Mini Bags": "Mini Bag",
  "Juttis": "Juttis", "Kolhapuris": "Kolhapuris", "Block Heels": "Block Heels", "Embellished Flats": "Embellished Flats",
  "Kajal & Kohl": "Kajal", "Lip Colour": "Lip Colour", "Mini Beauty Kits": "Mini Beauty Kit", "Festive Minis": "Festive Mini Set",
  "Mojari & Footwear": "Mojari Pair", "Stoles & Scarves": "Festive Stole", "Brooches": "Brooch", "Chains & Bracelets": "Chain Bracelet Set"
};

const ACC_COLOURS_W = ["Oxidised Silver", "Gold-Tone", "Antique Gold", "Pearl White", "Silver-Tone", "Meenakari Multicolour", "Rose Gold-Tone", "Kundan Green", "Ruby Red", "Onyx Black"];
const ACC_COLOURS_M = ["Onyx Black", "Antique Gold", "Silver-Tone", "Oxidised Silver", "Brown", "Beige", "Bottle Green", "Wine", "Ivory", "Navy"];
const BEAUTY_COLOURS = ["Classic Black", "Ruby Red", "Rose Pink", "Berry Wine", "Warm Nude", "Mocha Brown", "Rani Pink", "Coral"];

const patternShort = (p) => p.replace(/ (Print|Weave|Self|Grid|Panel|Dot)$/, "").replace("Solid Self", "Solid").replace("Panelled Multicolour", "Panelled Multicolour");
const embShort = (e) => (e === "Print Only" ? "" : e.replace(" Work", " Work").replace(" Detail", "-Detail"));

function sizesFor(gender, cat, subcat) {
  if (cat === "beauty") return ["Onesize"];
  if (cat === "bags" || cat === "jewellery") return ["Onesize"];
  if (subcat === "Mojari & Footwear") return ["UK6", "UK7", "UK8", "UK9", "UK10"];
  if (cat === "footwear") return ["UK3", "UK4", "UK5", "UK6", "UK7"];
  return gender === "women" ? ["XS", "S", "M", "L", "XL"] : ["S", "M", "L", "XL", "XXL"];
}

function priceFor(cat, catMeta) {
  const [lo, hi] = catMeta.price;
  // skew toward the middle-lower band (youth budgets per marketplace research)
  const t = Math.pow(rnd(), 1.35);
  let price = lo + Math.round(t * (hi - lo));
  price = Math.max(lo, Math.min(4999, price)); // preferred soft ceiling ₹4,999
  if (price > 8000) price = 7999;
  const mrp = Math.min(7999, Math.round(price * (1.28 + rnd() * 0.62) / 10) * 10);
  const discount = Math.max(5, Math.round(((mrp - price) / mrp) * 100));
  return { price, mrp: Math.max(price + 1, mrp), discount };
}

function merchantFor(gender, cat) {
  if (cat === "beauty") return "NYKAA";
  const w = { ...MERCHANT_WEIGHTS[gender] };
  delete w.NYKAA;
  return weightedPick(w);
}

function merchantUrlFor(merchant, gender, cat) {
  const map = VERIFIED_URLS[merchant] || {};
  return map[cat] || "CHECK";
}

// ---------- product generation ----------
const products = [];
const usedTitles = new Set();
const usedCombos = new Set();
let wCount = 0, mCount = 0;

function titleFor(gender, catMeta, cat, subcat, colour, pattern, embroidery, fabric, detail, attempt) {
  const noun = NOUNS[subcat] || catMeta.top;
  const p = patternShort(pattern);
  const e = embShort(embroidery);
  const parts = [];
  if (p && p !== "Solid") parts.push(p);
  if (e) parts.push(e);
  parts.push(noun);
  let base = `${parts.join(" ")} in ${colour}`;
  if (!usedTitles.has(base) && attempt === 0) return base;
  base = `${fabric} ${base}`;
  if (!usedTitles.has(base) && attempt <= 1) return base;
  base = `${base} with ${detail}`;
  if (!usedTitles.has(base) && attempt <= 2) return base;
  return `${base} — Edit ${attempt}`;
}

function descriptionFor(gender, catMeta, cat, world, colour, pattern, embroidery, silhouette, detail) {
  const wl = WORLDS.find((w) => w.slug === world).label;
  const craft = embroidery === "Print Only" ? pattern : `${embroidery} over ${pattern.toLowerCase()}`;
  const why = [
    `It brings real ${wl} energy without trying too hard.`,
    `The ${craft} reads beautifully at night and in photos.`,
    `A ${colour} base keeps it easy to style across the week of festivities.`,
    `The ${silhouette} moves well — built for actual ${wl.toLowerCase()} nights, not just display.`
  ];
  const body = `${colour} ${catMeta.top} with ${craft}, finished with ${detail}. Cut as a ${silhouette} for the 18–25 festive calendar.`;
  return `WHY WE PICKED IT: ${why[int(0, why.length - 1)]} ${body} Style note: keep jewellery intentional and let the ${colour.toLowerCase()} carry the look.`;
}

function makeProduct(gender, world, cat, idx) {
  const catMeta = gender === "women" ? WOMEN_CATS[cat] : MEN_CATS[cat];
  const subcat = pick(catMeta.subcats);
  const accessory = isAccessory(gender, cat);

  let colour, pattern, embroidery, fabric;
  const poolW = WORLD_META[world].womenColours;
  const poolM = WORLD_META[world].menColours;
  const attemptsGuard = { n: 0 };
  while (attemptsGuard.n < 40) {
    attemptsGuard.n++;
    if (cat === "beauty") colour = pick(BEAUTY_COLOURS);
    else if (cat === "jewellery") colour = pick(ACC_COLOURS_W);
    else if (cat === "accessories") colour = pick(ACC_COLOURS_M);
    else if (cat === "bags" || (gender === "women" && cat === "footwear")) colour = rnd() < 0.55 ? pick(ACC_COLOURS_W) : pick(poolW);
    else colour = gender === "women" ? pick(poolW) : pick(poolM);
    pattern = accessory ? pick(["Solid Self", "Brocade Weave", "Geometric Print", "Floral Print", "Mirror Grid", "Zari Weave", "Block Print"]) : (gender === "women" ? pick(PATTERN_POOL_W) : pick(PATTERN_POOL_M));
    embroidery = accessory ? pick(gender === "women" ? ["Mirror Work", "Gota Patti", "Thread Work", "Sequin Work", "Kutchi Embroidery", "Print Only", "Patch Work"] : ["Thread Embroidery", "Mirror Detail", "Zari Work", "Print Only", "Tonal Embroidery"]) : (gender === "women" ? pick(EMBROIDERY_POOL_W) : pick(EMBROIDERY_POOL_M));
    fabric = pick(catMeta.fabrics);
    const comboKey = `${cat}|${subcat}|${colour}|${pattern}|${embroidery}|${fabric}`;
    if (!usedCombos.has(comboKey)) { usedCombos.add(comboKey); break; }
  }

  const silhouette = pick(catMeta.silhouettes);
  const detail = gender === "women" ? pick(W_DETAIL_POOL) : pick(M_DETAIL_POOL);
  const attempt = usedTitles.size;
  let title = titleFor(gender, catMeta, cat, subcat, colour, pattern, embroidery, fabric, detail, 0);
  let tA = 0;
  while (usedTitles.has(title)) { tA++; title = titleFor(gender, catMeta, cat, subcat, colour, pattern, embroidery, fabric, detail, tA); }
  usedTitles.add(title);

  const { price, mrp, discount } = priceFor(cat, catMeta);
  const merchant = merchantFor(gender, cat);
  const id = gender === "women" ? `VRS-W-${String(++wCount).padStart(4, "0")}` : `VRS-M-${String(++mCount).padStart(4, "0")}`;
  const imageUrl = `/images/products/${id}.jpg`;
  const camera = CAMERAS[products.length % CAMERAS.length];
  const lens = LENSES[products.length % LENSES.length];
  const envs = WORLD_META[world].environments;
  const environment = envs[products.length % envs.length];
  const garment = `${colour} ${patternShort(pattern)} ${embShort(embroidery)} ${catMeta.top}`.replace(/\s+/g, " ").trim();
  const imgPrompt = productPrompt({
    garment: `${garment} (${subcategoryLabel(subcat)}), ${fabric}`,
    colour, fabric, pattern, embroidery, silhouette, detail,
    world, environment, camera, lens, mannequin: true
  });

  const styles = gender === "women" ? STYLES_W : STYLES_M;
  const styleTags = pickN(styles, 3);
  styleTags.push(WORLDS.find((w) => w.slug === world).label);

  const notes = merchantUrlFor(merchant, gender, cat) === "CHECK"
    ? "CHECK — exact marketplace listing URL unverified; verify before publishing merchant link. Curation label only; no availability, rating or review claims."
    : "Merchant category URL verified 2026-09-23 via marketplace research. Listing-level URL still CHECK. Curation label only.";

  products.push({
    id,
    gender,
    category: catMeta.label,
    categorySlug: cat,
    subcategory: subcat,
    title,
    merchant,
    brand: "VIRAAS Edit",
    price,
    mrp,
    discount,
    currency: "INR",
    colour,
    secondaryColours: pickN(poolW.filter((c) => c !== colour && c !== "Multicolour"), 2),
    fabric,
    pattern,
    embroidery,
    silhouette,
    occasion: world,
    ageSegment: AGE,
    styleTags,
    sizes: sizesFor(gender, cat, subcat),
    imageUrl,
    gallery: [imageUrl],
    merchantUrl: merchantUrlFor(merchant, gender, cat),
    affiliateUrl: "",
    affiliateSource: "",
    tryOnEnabled: catMeta.tryOn === true,
    imagePrompt: imgPrompt,
    generatedImageUrl: "",
    status: "awaiting_image",
    lastChecked: TODAY,
    notes,
    description: descriptionFor(gender, catMeta, cat, world, colour, pattern, embroidery, silhouette, detail)
  });
}

function subcategoryLabel(sub) { return sub.toLowerCase(); }

for (const world of ["garba", "college-fest", "diwali", "festive-party", "traditional"]) {
  for (const [cat, n] of Object.entries(WOMEN_QUOTAS[world])) for (let i = 0; i < n; i++) makeProduct("women", world, cat, i);
}
for (const world of ["garba", "college-fest", "diwali", "festive-party", "traditional"]) {
  for (const [cat, n] of Object.entries(MEN_QUOTAS[world])) for (let i = 0; i < n; i++) makeProduct("men", world, cat, i);
}

// ---------- couple looks (100 = 20 per world) ----------
const posesUsed = {};
const couples = [];
const coupleImagePrompts = new Map();
const COUPLE_BUCKETS = { "garba": 1, "college-fest": 2, "diwali": 3, "festive-party": 4, "traditional": 5 };
const HER_OUTFIT_CATS = {
  "garba": ["chaniya-choli", "chaniya-choli", "lehenga"],
  "college-fest": ["chaniya-choli", "lehenga", "kurta-sets", "festive-sets"],
  "diwali": ["lehenga", "sarees", "pre-draped-sarees", "anarkali"],
  "festive-party": ["lehenga", "sarees", "festive-sets", "pre-draped-sarees"],
  "traditional": ["sarees", "lehenga", "anarkali", "kurta-sets", "chaniya-choli"]
};
const HIS_OUTFIT_CATS = {
  "garba": ["contemporary-garba", "modern-ethnic-shirts", "embroidered-ethnic", "modern-kurtas"],
  "college-fest": ["printed-ethnic", "modern-ethnic-shirts", "modern-kurtas"],
  "diwali": ["embroidered-ethnic", "modern-kurtas", "modern-ethnic-shirts", "festive-sets"],
  "festive-party": ["modern-ethnic-shirts", "embroidered-ethnic", "festive-layers", "modern-kurtas"],
  "traditional": ["modern-kurtas", "festive-sets", "printed-ethnic"]
};

function colourMatchScore(productColours, story) {
  const s = story.toLowerCase();
  let score = 0;
  for (const c of productColours) {
    const cl = c.toLowerCase();
    if (cl === "multicolour" && s.includes("multicolour")) score += 3;
    else if (cl.includes("black") && s.includes("black")) score += 3;
    else if (cl.includes("silver") && s.includes("silver")) score += 3;
    else if (cl.includes("gold") && (s.includes("gold") || s.includes("cream"))) score += 2;
    else if (cl.includes("rani") && s.includes("rani")) score += 3;
    else if (cl.includes("hot pink") && s.includes("hot pink")) score += 3;
    else if (cl.includes("wine") && s.includes("wine")) score += 3;
    else if (cl.includes("emerald") && s.includes("emerald")) score += 3;
    else if (cl.includes("green") && s.includes("green")) score += 3;
    else if (cl.includes("ivory") && (s.includes("ivory") || s.includes("white") || s.includes("cream"))) score += 2;
    else if (cl.includes("white") && (s.includes("white") || s.includes("ivory"))) score += 2;
    else if (cl.includes("red") && s.includes("red")) score += 3;
    else if (cl.includes("maroon") && (s.includes("maroon") || s.includes("wine"))) score += 2;
    else if (cl.includes("pink") && s.includes("pink")) score += 2;
    else if (cl.includes("navy") && (s.includes("navy") || s.includes("blue"))) score += 2;
    else if (cl.includes("blue") && s.includes("blue")) score += 2;
    else if (cl.includes("mustard") && s.includes("mustard")) score += 3;
    else if (cl.includes("yellow") && s.includes("yellow")) score += 3;
    else if (cl.includes("indigo") && s.includes("indigo")) score += 3;
    else if (cl.includes("charcoal") && s.includes("charcoal")) score += 3;
    else if (cl.includes("olive") && s.includes("olive")) score += 3;
    else if (cl.includes("magenta") && s.includes("magenta")) score += 3;
    else if (cl.includes("beige") && (s.includes("beige") || s.includes("cream"))) score += 2;
  }
  return score;
}

function baseColour(story) {
  const s = story.toLowerCase();
  const words = ["hot pink", "rani pink", "royal blue", "sky blue", "mehendi green", "bottle green", "multicolour", "charcoal", "magenta", "mustard", "emerald", "indigo", "maroon", "black", "ivory", "white", "navy", "wine", "red", "gold", "pink", "blue", "green", "yellow", "coral", "peach", "lime", "lilac", "mint", "orange", "silver", "beige", "grey", "olive", "teal", "neutral", "cream", "blush", "rust", "brown", "nude", "ruby", "berry", "mocha", "onyx", "kundan", "meenakari", "pearl", "rose", "antique"];
  if (s.includes("black-on-black") || s.includes("black + rainbow") || s.includes("black + neon")) return "black";
  for (const w of words) if (s.includes(w)) return w;
  return "";
}

function colourMatches(pColour, base) {
  if (!base) return true;
  const c = pColour.toLowerCase();
  const b = base.toLowerCase();
  if (b === "neutral" || b === "cream" || b === "blush") return ["ivory", "beige", "grey", "charcoal", "white", "cream", "pearl", "nude", "rose"].some((x) => c.includes(x));
  if (b === "multicolour") return c.includes("multicolour") || c.includes("meenakari");
  return c.includes(b) || b.includes(c);
}

function chooseProduct(gender, world, catPool, story, salt) {
  const base = baseColour(story);
  const inWorld = products.filter((p) => p.gender === gender && catPool.includes(p.categorySlug) && p.occasion === world && colourMatches(p.colour, base));
  const crossWorld = products.filter((p) => p.gender === gender && catPool.includes(p.categorySlug) && p.occasion !== world && colourMatches(p.colour, base));
  const relaxed = products.filter((p) => p.gender === gender && catPool.includes(p.categorySlug) && p.occasion === world);
  const cands = inWorld.length ? inWorld : crossWorld.length ? crossWorld : relaxed;
  const scored = cands.map((p, i) => ({ p, s: colourMatchScore([p.colour, ...p.secondaryColours], story) * 10 + ((i + salt) % 7) }));
  scored.sort((a, b) => b.s - a.s || (a.p.id < b.p.id ? -1 : 1));
  const top = Math.min(3, scored.length);
  return top ? scored[salt % top].p : null;
}

for (const world of ["garba", "college-fest", "diwali", "festive-party", "traditional"]) {
  const meta = WORLD_META[world];
  const prefix = { "garba": "G", "college-fest": "C", "diwali": "D", "festive-party": "F", "traditional": "T" }[world];
  for (let i = 0; i < 20; i++) {
    const [herStory, hisStory] = meta.couplePairs[i];
    let poseIdx = (i * 7 + COUPLE_BUCKETS[world] * 3) % POSES.length;
    let guard = 0;
    posesUsed[world] = posesUsed[world] || new Set();
    while (posesUsed[world].has(poseIdx) && guard < POSES.length) { poseIdx = (poseIdx + 5) % POSES.length; guard++; }
    posesUsed[world].add(poseIdx);
    const [poseName, posePrompt] = POSES[poseIdx];
    const environment = meta.environments[i % meta.environments.length];
    const camera = CAMERAS[i % CAMERAS.length];
    const lens = LENSES[(i + 1) % LENSES.length];

    const herCat = HER_OUTFIT_CATS[world][i % HER_OUTFIT_CATS[world].length];
    const hisCat = HIS_OUTFIT_CATS[world][i % HIS_OUTFIT_CATS[world].length];
    const herOutfitP = chooseProduct("women", world, [herCat], herStory, i);
    const hisOutfitP = chooseProduct("men", world, [hisCat], hisStory, i + 2);
    const herAccP = chooseProduct("women", world, ["jewellery", "bags"], herStory, i + 1);
    const hisAccP = chooseProduct("men", world, ["accessories"], hisStory, i + 3);
    const herFootP = chooseProduct("women", world, ["footwear"], herStory, i + 2);
    const hisAcc2P = chooseProduct("men", world, ["accessories"], hisStory, i + 5) ;
    const herExtraP = chooseProduct("women", world, ["jewellery", "footwear", "bags"], herStory, i + 4);

    const herIds = [herOutfitP, herAccP, herFootP, herExtraP].filter(Boolean).map((p) => p.id);
    const hisIds = [hisOutfitP, hisAccP, hisAcc2P].filter(Boolean).map((p) => p.id);
    const uniqueHis = [...new Set(hisIds)].filter((id) => !herIds.includes(id));
    const uniqueHer = [...new Set(herIds)];
    while (uniqueHis.length && uniqueHer.length + uniqueHis.length > 6) uniqueHis.pop();

    const linkedIds = [...uniqueHer, ...uniqueHis];
    const totalPrice = linkedIds.reduce((s, id) => s + products.find((p) => p.id === id).price, 0);

    const herDesc = herOutfitP ? `${herOutfitP.colour} ${herOutfitP.silhouette} with ${herOutfitP.embroidery.toLowerCase()} over ${herOutfitP.pattern.toLowerCase()}` : "festive look";
    const hisDesc = hisOutfitP ? `${hisOutfitP.colour} ${hisOutfitP.silhouette} with ${hisOutfitP.embroidery.toLowerCase()}` : "festive look";
    const hisAccObj = uniqueHis.length > 1 ? products.find((p) => p.id === uniqueHis[1]) : null;
    const id = `CL-${prefix}-${String(i + 1).padStart(2, "0")}`;
    const title = coupleTitle(world, herStory, hisStory, poseName, i);
    const imgPrompt = couplePrompt({
      world,
      herOutfit: `${herStory} — she wears ${herDesc}${herAccP ? `, styled with ${herAccP.colour.toLowerCase()} ${herAccP.title.toLowerCase()}` : ""}`,
      hisOutfit: `${hisStory} — he wears ${hisDesc}${hisAccObj ? `, styled with ${hisAccObj.colour.toLowerCase()} ${hisAccObj.title.toLowerCase()}` : ""}`,
      pose: posePrompt,
      environment,
      camera, lens,
      index: i + 1
    });
    coupleImagePrompts.set(id, imgPrompt);

    couples.push({
      id,
      world,
      title,
      description: `${WORLDS.find((w) => w.slug === world).label} couple look — ${poseName.toLowerCase()} in ${environment}. ${herStory.replace("Her ", "She wears ").toLowerCase()}, ${hisStory.replace("Him ", "he wears ").toLowerCase()}. Matched, not matching.`,
      colourStory: `${herStory} · ${hisStory}`,
      poseDirection: poseName,
      imageUrl: `/images/couples/${id}.jpg`,
      herProductIds: uniqueHer,
      hisProductIds: uniqueHis,
      totalPrice,
      tags: [WORLDS.find((w) => w.slug === world).label, poseName, herStory.split(" + ")[0].replace("Her ", ""), "Couple Edit", "18-25"]
    });
  }
}

function coupleTitle(world, herStory, hisStory, pose, i) {
  const colourBit = herStory.replace("Her ", "").split(" + ")[0].replace(/^\w/, (c) => c.toUpperCase());
  const noun = {
    "garba": ["Garba Night", "Dandiya Hours", "Navratri Glow", "Twirl & Lights", "Garba Lane"],
    "college-fest": ["Fest Ground", "Campus Colours", "Staircase Diaries", "Fest Evening", "Lawn Light"],
    "diwali": ["Diya Light", "Terrace Diwali", "Courtyard Glow", "Balcony Lights", "Festive Lane"],
    "festive-party": ["After Dark", "Party Lights", "Evening Edit", "Lounge Hours", "Deck Night"],
    "traditional": ["Courtyard Edit", "Heritage Light", "Jharokha Hours", "Verandah Look", "Haveli Diaries"]
  }[world][i % 5];
  return `${colourBit} ${noun}`;
}

// ---------- journal ----------
const JOURNAL = [
  {
    slug: "garba-night-dress-code",
    title: "Garba Night Dress Code: What Actually Works on the Ground",
    dek: "Flare you can spin in, mirrors that catch the lights, and shoes you can survive nine nights in.",
    world: "garba",
    tags: ["Garba", "Navratri", "Chaniya Styling"],
    links: ["/occasions/garba", "/women/chaniya-choli", "/men/contemporary-garba"],
    body: [
      "The first rule of Garba dressing: the chaniya must move before you do. Eight-metre flares and panelled cuts spin better than stiff A-lines, and a real mirror border throws light back at the pandal bulbs in every photo.",
      "Keep the choli fitted and festive — that contrast is the silhouette. Bandhani-inspired detail and Kutchi patch borders do the heavy lifting, so jewellery can stay light: one pair of jhumkas, a stack of bangles, done.",
      "For him, think black ethnic shirt and white trousers, a wine embroidered shirt, or a relaxed modern kurta. The modern Garba look is comfortable first — costume-adjacent tailoring photographs like rental, so skip it.",
      "Nine nights, nine moods: rotate ivory + pink, black + silver, rani pink, red + black, multicolour, navy, emerald and mustard. Save the heaviest mirror work for the weekend events."
    ]
  },
  {
    slug: "chaniya-styling-guide",
    title: "Seven Ways to Style a Chaniya Choli Beyond One Night",
    dek: "One chaniya, a full festive week — the mix-and-math that makes it work twice the price.",
    world: "garba",
    tags: ["Chaniya Styling", "Garba", "Budget"],
    links: ["/women/chaniya-choli", "/women/jewellery", "/women/footwear"],
    body: [
      "A chaniya choli is a three-piece system, not a costume. Split it across the week: the chaniya with a plain festive blouse one night, the choli over a kurta the next, the odhani as your Diwali dupatta later.",
      "Colour-block deliberately. If the skirt is multicolour, pull ONE border colour into the blouse or jewellery. That single-accent rule is what makes outfits look curated instead of chaotic.",
      "Footwear decides how long you last. Embellished flats and juttis beat heels on real grounds; block heels only for sit-down events."
    ]
  },
  {
    slug: "navratri-nine-nights-colour",
    title: "Nine Nights, Nine Colour Stories",
    dek: "A night-by-night palette for Navratri that photographs beautifully under every kind of light.",
    world: "garba",
    tags: ["Navratri", "Colour Stories"],
    links: ["/occasions/garba", "/couple-edit"],
    body: [
      "Navratri is the one week colour is mandatory. Map your nine nights: ivory + pink for opening, rani pink mid-week, black + silver for the big event night, red + black for dandiya finals, multicolour for the casual ground nights.",
      "Under warm halogen, navy and emerald go deep and rich; under white floodlight, they swallow detail — choose mirror-heavy pieces there. Ivory and white need the opposite: strong border detail or they blow out.",
      "Couple pairing works best as echo, not uniform: her rani pink with his ivory + pink accent reads intentional from across the ground."
    ]
  },
  {
    slug: "college-fest-looks-under-1499",
    title: "College Fest Looks Under ₹1,499",
    dek: "Lightweight lehengas, printed ethnic shirts, and accessories that survive a fest schedule.",
    world: "college-fest",
    tags: ["College Fest", "Budget"],
    links: ["/occasions/college-fest", "/women/lehenga", "/men/printed-ethnic"],
    body: [
      "Fest dressing is a budget sport. Start with one statement piece — a colourful skirt or a printed ethnic shirt — and keep the rest simple cotton that can handle stairs, lawns and a 9pm stage show.",
      "Lightweight lehengas and chaniya-style festive looks read festive without the weight of full embellishment. Pair with a simple festive blouse and flat juttis you can walk the whole campus in.",
      "For him: a black ethnic shirt, a printed ethnic shirt in navy or olive, a relaxed modern kurta with contemporary trousers. Understated accessories only — a slim chain, a stole for evening."
    ]
  },
  {
    slug: "mens-garba-looks",
    title: "Men's Garba Looks That Aren't Costumes",
    dek: "What young Indian men actually wear to Garba in 2026 — shirts, kurtas, zero rental vibes.",
    world: "garba",
    tags: ["Men's Festive", "Garba"],
    links: ["/men/contemporary-garba", "/men/modern-ethnic-shirts", "/occasions/garba"],
    body: [
      "The modern Garba uniform is easy: black ethnic shirt, white trousers. Beyond that, dark embroidered shirts, navy festive shirts, wine and maroon tones, black-on-black festive styling, and relaxed kurtas all work.",
      "Contemporary ethnic longline shirts and printed ethnic shirts with a mirror detail or a colourful stole are the 2026 edge. Selective embroidery only — chest motif or cuff, not head-to-toe.",
      "What to skip: anything stiff, gold-heavy or ceremonial. If it looks like it was rented for a wedding, leave it."
    ]
  },
  {
    slug: "ethnic-shirt-guide",
    title: "The Ethnic Shirt Is the New Festive Staple",
    dek: "Mandarin collars, bandhani prints, tonal embroidery — the one menswear piece that goes everywhere.",
    world: "college-fest",
    tags: ["Ethnic Shirts", "Men's Festive"],
    links: ["/men/modern-ethnic-shirts", "/men/printed-ethnic", "/men/embroidered-ethnic"],
    body: [
      "An ethnic shirt is the highest-rotation piece in a young festive wardrobe: campus fest with white trousers, Garba with black trousers, Diwali at home over a vest.",
      "Build around three: one black solid with tonal embroidery, one printed (bandhani or ajrakh), one embroidered statement in wine or ivory. Everything else is a bonus.",
      "Fit matters more than embellishment. Relaxed but not oversized, sleeves you can roll twice, hem you can wear untucked."
    ]
  },
  {
    slug: "diwali-dress-ideas",
    title: "Diwali Dress Ideas for Terraces, Balconies & Courtyards",
    dek: "Warm-light dressing: what reads gold at diya light and what disappears into the dark.",
    world: "diwali",
    tags: ["Diwali", "Styling"],
    links: ["/occasions/diwali", "/women/lehenga", "/men/modern-kurtas"],
    body: [
      "Diwali light is warm and low — rich colours win. Rani pink, royal blue, emerald, wine and mustard come alive at diya light; black needs gold or silver detail to not vanish.",
      "For her: lehengas, sarees, pre-draped sarees and anarkalis are the four pillars. Pre-draped if you're moving between terraces all night; anarkali if you're hosting.",
      "For him: dark festive ethnic shirts, embroidered shirts, modern kurtas with trousers. Keep the layer light — a festive overshirt only if the night is cool."
    ]
  },
  {
    slug: "pre-draped-saree-guide",
    title: "Pre-Draped Sarees: The Ten-Minute Drape",
    dek: "Ready-to-wear sarees explained — when to choose them and how to style the silhouette.",
    world: "festive-party",
    tags: ["Sarees", "Pre-Draped", "Styling"],
    links: ["/women/pre-draped-sarees", "/women/sarees", "/women/jewellery"],
    body: [
      "A pre-draped saree is stitched into its pleats and pallu — you zip or hook in and go. For parties and fast-moving festive nights it's the practical choice.",
      "The silhouette does the talking, so keep jewellery clean: one statement earring or a choker, never both heavy. Belt the waist if you want the contemporary line.",
      "Fabric sets the mood — georgette for movement, satin for evening shine, organza for soft volume."
    ]
  },
  {
    slug: "festive-party-colour-stories",
    title: "Festive Party Colour Stories That Photograph Well",
    dek: "Black, wine, emerald, ivory, navy — the five evening colours and their accent rules.",
    world: "festive-party",
    tags: ["Festive Party", "Colour Stories"],
    links: ["/occasions/festive-party", "/women/lehenga", "/men/embroidered-ethnic"],
    body: [
      "Evening festive is a five-colour wardrobe: black + silver, wine + gold, emerald + black, ivory + black, navy + cream. Pick one story and let it run through both of you if you're going as a couple.",
      "Matched but not matching is the rule — her black + silver next to his black + white reads like a duo; identical colours read like uniforms.",
      "Rich colours, sleek silhouettes, statement ethnic styling. Keep the cut contemporary and the jewellery intentional."
    ]
  },
  {
    slug: "traditional-modern",
    title: "Traditional, Not Costume: Modern Proportions for Classic Clothes",
    dek: "Sarees, lehengas, anarkalis and modern kurtas styled with 2026 proportions.",
    world: "traditional",
    tags: ["Traditional", "Styling"],
    links: ["/occasions/traditional", "/women/sarees", "/men/modern-kurtas"],
    body: [
      "Traditional does not mean ceremonial. It means craft: embroidery, weave, drape and texture — with proportions that feel 2026.",
      "Shorter blouses with longer skirts, slit kurtas with tapered trousers, one heritage accessory instead of five. The silhouettes stay classic; the styling stays young.",
      "Choose natural light settings in your head — heritage courtyards, verandahs — and pick colours that live there: red, emerald, navy, ivory, mustard with gold work."
    ]
  },
  {
    slug: "couple-styling-matched-not-matching",
    title: "Matched, Not Matching: A Couple Styling Guide",
    dek: "Colour harmony formulas for two people who want to look like one story.",
    world: "garba",
    tags: ["Couple Edit", "Styling"],
    links: ["/couple-edit", "/occasions/garba", "/occasions/diwali"],
    body: [
      "The formula is echo, not equality. If she's in hot pink + ivory, he wears ivory with one hot-pink accent. If he's in black + white, her black + silver sits beside it perfectly.",
      "Agree on one of three structures: (1) shared base colour, different accents; (2) shared accent, different bases; (3) complementary pair from one colour story (red + black, navy + cream).",
      "Then pose like people, not posters — walking, laughing, adjusting an odhani. The candid frame is the whole point of the Couple Edit."
    ]
  },
  {
    slug: "festive-accessories-under-999",
    title: "The ₹999 Accessories Edit",
    dek: "Potlis, jhumkas, mojaris, kajal — the small pieces that finish a festive look.",
    world: "traditional",
    tags: ["Accessories", "Budget"],
    links: ["/women/jewellery", "/women/bags", "/men/accessories", "/accessories"],
    body: [
      "Accessories are the budget cheat code. One ₹499 mirror-work potli or oxidised jhumka pair can make a simple kurta set read fully festive.",
      "The complete-the-look kit: juttis or mojaris, a small bag that fits a phone, one jewellery statement, and a kajal that survives the night.",
      "Keep metals consistent — silver-tone with mirror work, gold-tone with zari. Two metal stories fight each other in photos."
    ]
  }
].map((a, i) => ({ ...a, id: `JR-${String(i + 1).padStart(2, "0")}`, imageUrl: `/images/journal/${String(i + 1).padStart(2, "0")}-${a.slug}.jpg`, author: "VIRAAS Styling Desk", publishedAt: TODAY }));

// ---------- collections (query-driven) ----------
const collections = {
  trending: [
    { id: "tr-01", title: "The Rani Pink Moment", sub: "What the stylists are seeing first", query: { colour: "Rani Pink" } },
    { id: "tr-02", title: "Black + Silver Garba", sub: "Night-one energy", query: { world: "garba", colour: "Black" } },
    { id: "tr-03", title: "Ivory Light", sub: "The quiet statement", query: { colour: "Ivory" } },
    { id: "tr-04", title: "Wine After Dark", sub: "Evening festive mood", query: { colour: "Wine" } },
    { id: "tr-05", title: "Campus Colours", sub: "Fest-week rotation", query: { world: "college-fest" } }
  ],
  budget: [
    { id: "bg-01", title: "Garba Under ₹1,499", sub: "Full ground fits, honest prices", maxPrice: 1499, query: { world: "garba", maxPrice: 1499 } },
    { id: "bg-02", title: "College Fest Under ₹999", sub: "Campus-approved", maxPrice: 999, query: { world: "college-fest", maxPrice: 999 } },
    { id: "bg-03", title: "Diwali Under ₹2,999", sub: "Statement without the splurge", maxPrice: 2999, query: { world: "diwali", maxPrice: 2999 } },
    { id: "bg-04", title: "Men's Festive Under ₹1,999", sub: "Shirts, kurtas, layers", maxPrice: 1999, query: { gender: "men", maxPrice: 1999 } },
    { id: "bg-05", title: "Accessories Under ₹999", sub: "Finish the look", maxPrice: 999, query: { accessories: true, maxPrice: 999 } }
  ],
  completeTheLook: [
    { id: "ctl-01", title: "Garba Night, Fully Set", query: { world: "garba", accessories: true } },
    { id: "ctl-02", title: "Campus Fest Kit", query: { world: "college-fest", accessories: true } },
    { id: "ctl-03", title: "Diwali Finishing Pieces", query: { world: "diwali", accessories: true } },
    { id: "ctl-04", title: "Party Extras", query: { world: "festive-party", accessories: true } }
  ]
};

// ---------- image manifest (priority per §58) ----------
const manifest = [];
function addImage(kind, refId, path, bucket, seq, prompt, negative) {
  manifest.push({
    key: `${kind}:${refId}`,
    kind, refId,
    path: `public/${path}`,
    publicPath: `/${path}`,
    bucket, seq,
    prompt,
    negative,
    status: "queued",
    hash: null,
    bytes: null
  });
}

for (const c of couples) {
  addImage("couple", c.id, `images/couples/${c.id}.jpg`, COUPLE_BUCKETS[c.world], Number(c.id.split("-")[2]), coupleImagePrompts.get(c.id), COUPLE_NEGATIVE);
}
const WORLD_BUCKET_W = { "garba": 6, "college-fest": 8, "diwali": 10, "festive-party": 12, "traditional": 14 };
const WORLD_BUCKET_M = { "garba": 7, "college-fest": 9, "diwali": 11, "festive-party": 13, "traditional": 15 };
let seqCounter = {};
for (const p of products) {
  const accessory = isAccessory(p.gender, p.categorySlug);
  const bucket = accessory ? 16 : (p.gender === "women" ? WORLD_BUCKET_W[p.occasion] : WORLD_BUCKET_M[p.occasion]);
  seqCounter[bucket] = (seqCounter[bucket] || 0) + 1;
  addImage("product", p.id, `images/products/${p.id}.jpg`, bucket, seqCounter[bucket], p.imagePrompt, PRODUCT_NEGATIVE);
}

const heroShots = [
  ["hero-main", "images/heroes/hero-main.jpg", "Wide cinematic editorial photograph for a festive fashion homepage hero: a mixed group of four young Indian friends (18-25 visual age, two young women and two young men) at a Navratri night celebration, mid-laugh near a fairy-light canopy, her in rani pink mirror-work chaniya choli, her in ivory bandhani lehenga, him in black ethnic shirt with white trousers, him in wine embroidered ethnic shirt. Real-human, natural skin, candid Pinterest aesthetic, festival bokeh, 35mm reportage, no text, no logo, no watermark."],
  ["hero-alt", "images/heroes/hero-alt.jpg", "Editorial photograph of a youthful Indian couple (18-25) walking hand-in-hand at a college fest at dusk, she in a lightweight multicolour lehenga with ivory blouse, he in a printed ivory ethnic shirt and navy trousers, fest bunting and string lights behind, candid natural motion, real human, 50mm, no text, no logo, no watermark."],
  ["occasion-garba", "images/heroes/occasion-garba.jpg", "Vertical editorial photograph: two young Indian women in mirror-work chaniya choli (black + silver, rani pink) mid dandiya spin at a Navratri ground with fairy lights, dynamic fabric motion, joyful, real human 18-25, no text, no logo, no watermark."],
  ["occasion-college-fest", "images/heroes/occasion-college-fest.jpg", "Vertical editorial photograph: young Indian college friends (18-25) on campus stairs in light festive outfits — colourful skirt + simple blouse, printed ethnic shirts — laughing with fest stage bokeh behind, daylight, real human, no text, no logo, no watermark."],
  ["occasion-diwali", "images/heroes/occasion-diwali.jpg", "Vertical editorial photograph: youthful Indian couple (18-25) on a terrace lighting diyas at dusk, she in emerald + gold lehenga, he in ivory modern kurta, warm diya glow on faces, balcony fairy lights, real human, no text, no logo, no watermark."],
  ["occasion-festive-party", "images/heroes/occasion-festive-party.jpg", "Vertical editorial photograph: two stylish young Indian adults (18-25) at an evening festive party venue with decorative lights, she in black + silver festive set, he in wine ethnic shirt, sleek modern styling, real human, candid, no text, no logo, no watermark."],
  ["occasion-traditional", "images/heroes/occasion-traditional.jpg", "Vertical editorial photograph: young Indian woman (18-25) in a red + gold traditional saree and young man in ivory modern kurta standing in a heritage haveli courtyard in soft daylight, tasteful and youthful, real human, no text, no logo, no watermark."],
  ["couple-banner", "images/heroes/couple-banner.jpg", "Wide editorial photograph: a youthful Indian couple (18-25) in candid soft eye contact, she in navy + silver lehenga with odhani, he in navy + cream festive shirt, decorated evening venue lights behind, matched-not-matching, real human, Pinterest aesthetic, no text, no logo, no watermark."],
  ["see-it-on-you", "images/heroes/see-it-on-you.jpg", "Clean lifestyle photograph: young Indian woman (18-25) taking a mirror phone selfie in a full-length mirror wearing a hot pink + ivory festive outfit, natural room light, casual authentic framing, real human, no text, no logo, no watermark."],
  ["accessories-banner", "images/heroes/accessories-banner.jpg", "Premium flat-lay-ish editorial photograph of Indian festive accessories arranged on ivory fabric: oxidised jhumka earrings, mirror-work potli bag, embroidered juttis, gold-tone bangles, kajal pencil — warm soft light, no text, no logo, no watermark."],
  ["budget-banner", "images/heroes/budget-banner.jpg", "Editorial photograph of two young Indian friends (18-25) in affordable festive outfits — simple kurta set and printed ethnic shirt — laughing on a decorated venue step with paper torans behind, daylight, real human, no text, no logo, no watermark."]
];
for (let i = 0; i < heroShots.length; i++) {
  const [key, path, prompt] = heroShots[i];
  addImage("hero", key, path, 17, i + 1, prompt, COUPLE_NEGATIVE);
}
for (let i = 0; i < JOURNAL.length; i++) {
  const a = JOURNAL[i];
  addImage("journal", a.id, `images/journal/${String(i + 1).padStart(2, "0")}-${a.slug}.jpg`, 18, i + 1,
    `Editorial fashion article header photograph: ${a.dek} Young Indian adults 18-25, ${WORLD_META[a.world].mood}, ${WORLD_META[a.world].light}, real human, candid aesthetic, no text, no logo, no watermark.`, COUPLE_NEGATIVE);
}

manifest.sort((a, b) => a.bucket - b.bucket || a.seq - b.seq);
manifest.forEach((m, i) => { m.queuePosition = i + 1; });

// ---------- taxonomy ----------
const taxonomy = {
  worlds: WORLDS,
  womenCategories: Object.entries(WOMEN_CATS).map(([slug, m]) => ({ slug, label: m.label, subcategories: m.subcats, tryOn: m.tryOn === true })),
  menCategories: Object.entries(MEN_CATS).map(([slug, m]) => ({ slug, label: m.label, subcategories: m.subcats, tryOn: m.tryOn === true })),
  generatedAt: TODAY
};

// ---------- write ----------
mkdirSync(DATA, { recursive: true });
writeFileSync(join(DATA, "products.json"), JSON.stringify(products));
writeFileSync(join(DATA, "couples.json"), JSON.stringify(couples));
writeFileSync(join(DATA, "journal.json"), JSON.stringify(JOURNAL));
writeFileSync(join(DATA, "collections.json"), JSON.stringify(collections));
writeFileSync(join(DATA, "taxonomy.json"), JSON.stringify(taxonomy));
writeFileSync(join(DATA, "image-manifest.json"), JSON.stringify(manifest, null, 2));

const w = products.filter((p) => p.gender === "women").length;
const m = products.length - w;
console.log(`products: ${products.length} (women ${w} / men ${m})`);
console.log(`couples: ${couples.length}`);
console.log(`journal: ${JOURNAL.length}`);
console.log(`manifest: ${manifest.length} images queued`);
const bucketCounts = {};
for (const item of manifest) bucketCounts[item.bucket] = (bucketCounts[item.bucket] || 0) + 1;
console.log("buckets:", JSON.stringify(bucketCounts));
