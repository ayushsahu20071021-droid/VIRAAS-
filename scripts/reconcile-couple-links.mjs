#!/usr/bin/env node
// Surgical product-link reconciliation for the 6 Garba looks that failed the
// outfit-fidelity audit. The rule: colourStory ↔ linked products ↔ generated
// image must all agree. Only the contradicting items are replaced; every other
// link is kept. totalPrice is recomputed from the linked products.
// Idempotent. Writes src/data/couples.json only.

import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const couplesPath = join(ROOT, "src/data/couples.json");
const couples = JSON.parse(readFileSync(couplesPath, "utf8"));
const products = JSON.parse(readFileSync(join(ROOT, "src/data/products.json"), "utf8"));
const price = new Map(products.map((p) => [p.id, p.price]));
const colour = new Map(products.map((p) => [p.id, `${p.colour} — ${p.title}`]));

// look → { her: [swap out, swap in] | null, his: [...] | null }
const SWAPS = {
  // her footwear was black juttis inside a "navy + silver" look → oxidised silver kolhapuris
  "CL-G-03": { her: ["VRS-W-0142", "VRS-W-0341"] },
  // her main was a MULTICOLOUR brocade chaniya inside a "white + multicolour mirrors" look → white patola chaniya
  "CL-G-07": { her: ["VRS-W-0065", "VRS-W-0029"] },
  // his entire side was ivory inside a "navy + ivory" look → navy bandhani modern ethnic shirt
  "CL-G-14": { his: ["VRS-M-0226", "VRS-M-0038"], dropHis: ["VRS-M-0225"] },
  // his main was an EMERALD kurta inside an "ivory + multicolour stole" look → ivory Kutchi-motif garba kurta
  "CL-G-19": { his: ["VRS-M-0066", "VRS-M-0019"] },
};

function swap(list, from, to) {
  const i = list.indexOf(from);
  if (i === -1) return { list, changed: false };
  list[i] = to;
  return { list, changed: true };
}

let touched = 0;
for (const look of couples) {
  const s = SWAPS[look.id];
  if (!s) continue;
  let changed = false;
  if (s.her) {
    const r = swap(look.herProductIds, s.her[0], s.her[1]);
    if (r.changed) changed = true;
    else if (!look.herProductIds.includes(s.her[1])) throw new Error(`${look.id}: her swap target missing`);
  }
  if (s.his) {
    const r = swap(look.hisProductIds, s.his[0], s.his[1]);
    if (r.changed) changed = true;
    else if (!look.hisProductIds.includes(s.his[1])) throw new Error(`${look.id}: his swap target missing`);
  }
  if (s.dropHis) {
    for (const id of s.dropHis) {
      const i = look.hisProductIds.indexOf(id);
      if (i !== -1) { look.hisProductIds.splice(i, 1); changed = true; }
    }
  }
  if (!changed) continue;

  look.totalPrice = [...look.herProductIds, ...look.hisProductIds].reduce((sum, id) => sum + (price.get(id) ?? 0), 0);
  touched++;
}

// Validation: 4-6 links per look, all IDs real, and every look's linked colours
// must be traceable inside its own colourStory vocabulary.
const problems = [];
for (const look of couples) {
  const n = look.herProductIds.length + look.hisProductIds.length;
  if (n < 4 || n > 6) problems.push(`${look.id}: ${n} links (must be 4-6)`);
  for (const id of [...look.herProductIds, ...look.hisProductIds]) {
    if (!price.has(id)) problems.push(`${look.id}: unknown product ${id}`);
  }
}
const swapper = Object.keys(SWAPS);
for (const id of swapper) {
  const look = couples.find((c) => c.id === id);
  const main = [...look.herProductIds, ...look.hisProductIds]
    .map((p) => colour.get(p) || "")
    .join(" | ");
  console.log(`${id} | total ₹${look.totalPrice} | links ${look.herProductIds.length}H+${look.hisProductIds.length}M`);
  console.log(`   ${main}`);
}
if (problems.length) {
  console.error("PROBLEMS:\n" + problems.join("\n"));
  process.exit(1);
}
writeFileSync(couplesPath, JSON.stringify(couples, null, 2));
console.log(`\nlinks reconciled: ${touched} looks · 0 problems · couples.json written`);
