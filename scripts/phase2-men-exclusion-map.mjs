// PHASE 2 — Deterministic MEN LOOK -> MARKETPLACE PRODUCT exclusion map.
// PURPOSE: identify which marketplace men products are duplicate representations of the 210 approved
// men looks, so they can be EXCLUDED from Trending. This map is ONLY for exclusion. It is NOT used to
// assign images, never replaces approved men images, never modifies men look data.
//
// Deterministic, reproducible: fixed scoring + greedy unique assignment (looks by id asc, products by
// id asc tie-break). No popularity, no price, no randomness, no arbitrary ordering, no image similarity.
// Traditional Layer products are NEVER excluded (they must remain apparel in Trending).
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const rd = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));
const wr = (p, d) => fs.writeFileSync(path.join(ROOT, p), typeof d === 'string' ? d : JSON.stringify(d, null, 2));

const P = rd('src/data/catalog.json');
const LOOKS = rd('src/data/men-look-catalog.client.json').slice().sort((a, b) => a.id.localeCompare(b.id));

// Candidate pool: men, non-accessory, and NOT Traditional Layer (those must stay in Trending).
const pool = P.filter((p) => p.gender === 'men' && !p.accessory && p.category !== 'Traditional Layer')
  .slice().sort((a, b) => a.id.localeCompare(b.id));

// Garment family classification.
function familyOfLook(g) {
  const s = (g || '').toLowerCase();
  if (s.includes('kurta')) return 'kurta';
  if (s.includes('shirt')) return 'shirt';
  if (s.includes('jacket') || s.includes('waistcoat') || s.includes('vest')) return 'jacket';
  return 'other';
}
function familyOfProduct(p) {
  const s = ((p.category || '') + ' ' + (p.subcategory || '')).toLowerCase();
  if (s.includes('kurta')) return 'kurta';
  if (s.includes('shirt')) return 'shirt';
  if (s.includes('jacket')) return 'jacket';
  if (s.includes('bottom') || s.includes('separate')) return 'bottom';
  return 'other';
}
// Ethnic-top family: kurta & shirt are interchangeable men's ethnic upper garments (fallback only).
const ethnicTop = (f) => f === 'kurta' || f === 'shirt';

const norm = (c) => (c || '').toLowerCase().replace(/[^a-z]/g, '');
function score(look, p) {
  const lf = familyOfLook(look.garmentType), pf = familyOfProduct(p);
  let base = 0, tier = '';
  if (lf === pf) { base = 1000; tier = 'same-garment'; }
  else if (ethnicTop(lf) && ethnicTop(pf)) { base = 500; tier = 'ethnic-top-family'; }
  else if (lf === 'jacket' && pf === 'jacket') { base = 1000; tier = 'same-garment'; }
  else { base = 100; tier = 'cross-garment'; }
  const colourMatch = norm(look.colors?.primary) && norm(look.colors.primary) === norm(p.colour);
  const occMatch = Array.isArray(p.occasion) && p.occasion.includes(look.occasion);
  let s = base;
  if (colourMatch) s += 50;
  if (occMatch) s += 20;
  return { s, tier, colourMatch, occMatch };
}

const assigned = new Set();
const rows = [];
for (const look of LOOKS) {
  let best = null;
  for (const p of pool) {
    if (assigned.has(p.id)) continue;
    const sc = score(look, p);
    if (!best || sc.s > best.sc.s || (sc.s === best.sc.s && p.id < best.p.id)) best = { p, sc };
  }
  if (!best) { rows.push({ menLook: look.id, productId: null, matchBasis: 'NO CANDIDATE LEFT', confidence: 'unmatched' }); continue; }
  assigned.add(best.p.id);
  const { p, sc } = best;
  // Confidence tiers.
  let confidence;
  if (sc.tier === 'same-garment' && sc.colourMatch && sc.occMatch) confidence = 'high';
  else if (sc.tier === 'same-garment' && (sc.colourMatch || sc.occMatch)) confidence = 'medium';
  else if (sc.tier === 'same-garment') confidence = 'medium';
  else if (sc.tier === 'ethnic-top-family') confidence = 'low';
  else confidence = 'low';
  rows.push({
    menLook: look.id,
    lookGarment: look.garmentType,
    lookColour: look.colors?.primary ?? null,
    lookOccasion: look.occasion,
    productId: p.id,
    productCategory: p.category,
    productColour: p.colour,
    productOccasion: p.occasion,
    matchBasis: sc.tier,
    fieldsUsed: ['garment-family', ...(sc.colourMatch ? ['colour'] : []), ...(sc.occMatch ? ['occasion'] : [])].join('+'),
    confidence,
    reason: `${sc.tier} match (score ${sc.s}); colour ${sc.colourMatch ? 'matched' : 'differs'}; occasion ${sc.occMatch ? 'matched' : 'differs'}`,
  });
}

wr('reports/MEN_LOOK_TO_PRODUCT_EXCLUSION_MAP.json', rows);

const byConf = {}; for (const r of rows) byConf[r.confidence] = (byConf[r.confidence] || 0) + 1;
const matched = rows.filter((r) => r.productId).length;
const excludedIds = rows.filter((r) => r.productId).map((r) => r.productId);
const uniqueExcluded = new Set(excludedIds);
const resultingTrending = 767 - 236 - uniqueExcluded.size;

const md = `# VIRAAS — Men Look -> Marketplace Product EXCLUSION Map

**Purpose:** deterministically identify which marketplace men products are duplicate representations of the
210 approved men looks, so they can be **excluded from Trending**. This map is used **only** to choose which
products to exclude. It is **never** used to assign images, never replaces approved men images, and never
modifies men look data. Machine-readable: [\`MEN_LOOK_TO_PRODUCT_EXCLUSION_MAP.json\`](./MEN_LOOK_TO_PRODUCT_EXCLUSION_MAP.json).

## Method (deterministic & reproducible)
- Candidate pool: men, non-accessory, **excluding Traditional Layer** (which must remain in Trending) = ${pool.length} products.
- Score = garment-family identity (same-garment 1000 > ethnic-top-family 500 > cross-garment 100) + colour exact (+50) + occasion (+20).
- Greedy unique assignment: looks processed by id ascending; each takes its highest-scoring **unassigned** product; ties broken by product id ascending.
- No popularity, no price, no random matching, no arbitrary ordering, no image similarity.

## Confidence definitions
- **high** — same garment + exact colour + occasion.
- **medium** — same garment (colour or occasion may differ).
- **low** — no same-garment product remained; matched via ethnic-top family (kurta↔shirt) or cross-garment fallback. These are the least certain and are flagged for review.

## Results
| Metric | Value |
|---|---|
| Men looks | ${rows.length} |
| Matched (distinct products) | ${matched} |
| Unique excluded product IDs | ${uniqueExcluded.size} |
| Unmatched looks | ${rows.filter((r) => !r.productId).length} |
| high confidence | ${byConf.high || 0} |
| medium confidence | ${byConf.medium || 0} |
| low confidence | ${byConf.low || 0} |
| **Resulting Trending count** (767 − 236 women − ${uniqueExcluded.size} men) | **${resultingTrending}** |

## Honesty note
The marketplace men catalog was generated independently (taxonomy category × colour) and does **not** mirror the
kurta-heavy look set (189 kurta-type looks vs 135 kurta-type products). Same-garment matches are therefore capped;
the remaining assignments needed to reach the target use the documented ethnic-top-family / cross-garment fallback
at **low confidence**. These low-confidence rows are exclusion decisions only — no image or authoritative
relationship is claimed. The women exclusions (236) use the authored \`sourceProductId\` linkage and are exact.
`;
wr('reports/MEN_LOOK_TO_PRODUCT_EXCLUSION_MAP.md', md);

console.log('men looks:', rows.length, '| matched distinct:', uniqueExcluded.size, '| confidence:', JSON.stringify(byConf));
console.log('resulting trending:', resultingTrending);
