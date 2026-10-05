#!/usr/bin/env node
// audit-affiliate — affiliate architecture honesty. No Amazon, no invented links.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const products = JSON.parse(readFileSync(join(ROOT, "src/data/products.json"), "utf8"));
const errors = [];

for (const p of products) {
  if (p.affiliateUrl !== "") errors.push(`${p.id}: affiliateUrl not empty`);
  if (p.affiliateSource !== "") errors.push(`${p.id}: affiliateSource not empty`);
  if (/earnkaro/i.test(JSON.stringify(p))) errors.push(`${p.id}: fabricated EarnKaro reference`);
  if (/utm_|aff_id|affiliateid|tag=/i.test(p.merchantUrl)) errors.push(`${p.id}: suspicious tracking params in merchantUrl`);
  if (p.merchantUrl !== "CHECK" && !/^https:\/\/(www\.)?(myntra\.com|ajio\.com|flipkart\.com|shopsy\.in|meesho\.com|nykaa\.com)\//.test(p.merchantUrl)) {
    errors.push(`${p.id}: merchantUrl not allowed domain: ${p.merchantUrl}`);
  }
  if (/amazon/i.test(JSON.stringify(p))) errors.push(`${p.id}: Amazon reference`);
}

function walk(dir, cb) {
  for (const f of readdirSync(dir)) {
    const pth = join(dir, f);
    const st = statSync(pth);
    if (st.isDirectory()) {
      if (!["node_modules", ".next", ".git"].includes(f)) walk(pth, cb);
    } else cb(pth);
  }
}
let uiHasUnconfigured = false;
walk(join(ROOT, "src"), (f) => {
  if (!/\.(ts|tsx)$/.test(f)) return;
  const txt = readFileSync(f, "utf8").toLowerCase();
  if (txt.includes("affiliate link not configured")) uiHasUnconfigured = true;
  if (txt.includes("amazon")) errors.push(`${f}: Amazon mention in source`);
  if (txt.includes("earnkaro.com")) errors.push(`${f}: EarnKaro URL in source`);
  if (txt.includes("rating") && f.includes("ProductCard")) errors.push(`${f}: rating UI detected`);
});
if (!uiHasUnconfigured) errors.push('UI missing required "Affiliate link not configured" display');

console.log("== audit-affiliate ==");
console.log(`checked ${products.length} products · affiliateUrl/affiliateSource all empty · no Amazon · no fabricated links`);
if (errors.length) {
  console.log(`ERRORS: ${errors.length}`);
  for (const e of errors.slice(0, 30)) console.log("  ✗", e);
  process.exit(1);
}
console.log("PASS audit-affiliate");
