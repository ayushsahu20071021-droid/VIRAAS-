#!/usr/bin/env node
// check-catalog — structural integrity of the 823/100 catalog.
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const products = JSON.parse(readFileSync(join(ROOT, "src/data/products.json"), "utf8"));
const couples = JSON.parse(readFileSync(join(ROOT, "src/data/couples.json"), "utf8"));
const taxonomy = JSON.parse(readFileSync(join(ROOT, "src/data/taxonomy.json"), "utf8"));

const errors = [];
const warnings = [];
const err = (m) => errors.push(m);
const warn = (m) => warnings.push(m);

const BANNED = ["achkan", "sherwani", "bandhgala", "groomwear", "groom wear", "kediyu", "kafni", "chorno", "dhoti", "amazon", "co-ord", "coord set", "indo-western", "indo western", "fusion"];
const ALLOWED_MERCHANTS = ["MYNTRA", "AJIO", "FLIPKART", "SHOPSY", "MEESHO", "NYKAA"];
const WORLDS = taxonomy.worlds.map((w) => w.slug);

// --- counts ---
if (products.length !== 823) err(`product count ${products.length} !== 823`);
const women = products.filter((p) => p.gender === "women");
const men = products.filter((p) => p.gender === "men");
if (women.length !== 505) err(`women ${women.length} !== 505`);
if (men.length !== 318) err(`men ${men.length} !== 318`);
if (couples.length !== 100) err(`couple count ${couples.length} !== 100`);

const perWorld = {};
for (const c of couples) perWorld[c.world] = (perWorld[c.world] || 0) + 1;
for (const w of WORLDS) if ((perWorld[w] || 0) !== 20) err(`world ${w}: ${perWorld[w] || 0} couple looks !== 20`);
if (Object.keys(perWorld).length !== 5) err(`couple worlds ${Object.keys(perWorld).length} !== 5`);
if (WORLDS.length !== 5) err(`taxonomy worlds ${WORLDS.length} !== 5`);

// --- ids & titles ---
const ids = new Set();
const titles = new Set();
const combos = new Set();
for (const p of products) {
  if (ids.has(p.id)) err(`duplicate id ${p.id}`);
  ids.add(p.id);
  if (titles.has(p.title)) err(`duplicate title ${p.title}`);
  titles.add(p.title);
  const combo = [p.category, p.colour, p.pattern, p.embroidery, p.silhouette, p.fabric, p.subcategory].join("|");
  if (combos.has(combo)) warn(`near-duplicate combo ${p.id}: ${combo}`);
  combos.add(combo);

  // --- banned words anywhere ---
  const blob = JSON.stringify(p).toLowerCase();
  for (const b of BANNED) if (blob.includes(b)) err(`${p.id} contains banned term "${b}"`);

  // --- merchants ---
  if (!ALLOWED_MERCHANTS.includes(p.merchant)) err(`${p.id} merchant ${p.merchant} not allowed`);
  // --- affiliate ---
  if (p.affiliateUrl !== "") err(`${p.id} affiliateUrl must be empty`);
  if (p.affiliateSource !== "") err(`${p.id} affiliateSource must be empty`);
  // --- prices ---
  for (const k of ["price", "mrp", "discount"]) if (!Number.isFinite(p[k])) err(`${p.id} ${k} not finite`);
  if (!(p.price > 0) || p.price > 8000) err(`${p.id} price ${p.price} outside (0,8000]`);
  if (!(p.mrp > 0) || p.mrp > 8000) err(`${p.id} mrp ${p.mrp} outside (0,8000]`);
  if (p.mrp < p.price) err(`${p.id} mrp < price`);
  if (p.price > 5000) warn(`${p.id} price ${p.price} above preferred ₹5,000`);
  // --- model fields ---
  for (const k of ["id","gender","category","subcategory","title","merchant","brand","price","mrp","discount","currency","colour","secondaryColours","fabric","pattern","embroidery","silhouette","occasion","ageSegment","styleTags","sizes","imageUrl","gallery","merchantUrl","affiliateUrl","affiliateSource","tryOnEnabled","imagePrompt","generatedImageUrl","status","lastChecked","notes","description"]) {
    if (!(k in p)) err(`${p.id} missing field ${k}`);
  }
  for (const badKey of ["rating", "ratings", "reviewCount", "reviews", "stock", "popularity", "bestseller", "orders"]) {
    if (badKey in p) err(`${p.id} contains fabricated field ${badKey}`);
  }
  if (!WORLDS.includes(p.occasion)) err(`${p.id} occasion ${p.occasion} not one of 5 worlds`);
  if (p.ageSegment !== "18-25") err(`${p.id} ageSegment != 18-25`);
  if (!Array.isArray(p.sizes) || !p.sizes.length) err(`${p.id} sizes empty`);
  if (!Array.isArray(p.gallery) || !p.gallery.length) err(`${p.id} gallery empty`);
  if (!p.imagePrompt || p.imagePrompt.length < 80) err(`${p.id} imagePrompt missing/too short`);
  if (typeof p.tryOnEnabled !== "boolean") err(`${p.id} tryOnEnabled not boolean`);
  const allowedCatsW = taxonomy.womenCategories.map((c) => c.slug);
  const allowedCatsM = taxonomy.menCategories.map((c) => c.slug);
  if (p.gender === "women" && !allowedCatsW.includes(p.categorySlug)) err(`${p.id} bad women category ${p.categorySlug}`);
  if (p.gender === "men" && !allowedCatsM.includes(p.categorySlug)) err(`${p.id} bad men category ${p.categorySlug}`);
}

// --- couples ---
const poseUse = {};
for (const c of couples) {
  if (!WORLDS.includes(c.world)) err(`${c.id} world ${c.world} invalid`);
  const linked = [...c.herProductIds, ...c.hisProductIds];
  for (const id of linked) if (!ids.has(id)) err(`${c.id} links unknown product ${id}`);
  const sum = linked.reduce((s, id) => s + products.find((p) => p.id === id).price, 0);
  if (sum !== c.totalPrice) err(`${c.id} totalPrice ${c.totalPrice} != linked sum ${sum}`);
  if (linked.length < 4) warn(`${c.id} links only ${linked.length} products (preferred 4-6)`);
  if (linked.length > 6) err(`${c.id} links ${linked.length} products (>6)`);
  poseUse[c.world] = poseUse[c.world] || {};
  poseUse[c.world][c.poseDirection] = (poseUse[c.world][c.poseDirection] || 0) + 1;
  for (const k of ["id","world","title","description","colourStory","poseDirection","imageUrl","herProductIds","hisProductIds","totalPrice","tags"]) {
    if (!(k in c)) err(`${c.id} missing field ${k}`);
  }
}
for (const [w, poses] of Object.entries(poseUse)) {
  for (const [pose, n] of Object.entries(poses)) if (n > 2) warn(`pose "${pose}" used ${n}x in ${w} (max repetition target ≤2)`);
}

// --- summary ---
const catBreakdown = {};
for (const p of products) catBreakdown[`${p.gender}:${p.category}`] = (catBreakdown[`${p.gender}:${p.category}`] || 0) + 1;
const prices = products.map((p) => p.price);
console.log("== check-catalog ==");
console.log(`products ${products.length} (W ${women.length} / M ${men.length}) · couples ${couples.length}`);
console.log("category breakdown:", JSON.stringify(catBreakdown, null, 0));
console.log(`price range ₹${Math.min(...prices)}–₹${Math.max(...prices)} · under ₹5,000: ${prices.filter((x) => x <= 5000).length}`);
console.log(`warnings: ${warnings.length}`);
for (const w of warnings.slice(0, 10)) console.log("  warn:", w);
if (errors.length) {
  console.log(`ERRORS: ${errors.length}`);
  for (const e of errors.slice(0, 30)) console.log("  ✗", e);
  process.exit(1);
}
console.log("PASS check-catalog");
