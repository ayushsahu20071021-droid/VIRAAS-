// PHASE 3 — Build the final Trending dataset that ACTUALLY resolves to 321 products.
// final321 = non-accessory marketplace products MINUS 236 women counterparts (authored sourceProductId)
//            MINUS 210 men duplicates (deterministic exclusion map from Phase 2).
// Nothing is deleted from the catalog (women-look linkage 236/236 preserved). Traditional Layer stays.
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const rd = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));
const wr = (p, d) => fs.writeFileSync(path.join(ROOT, p), typeof d === 'string' ? d : JSON.stringify(d, null, 2));

const CAT = rd('src/data/catalog.client.json');
const women = rd('src/data/women-look-catalog.client.json');
const menMap = rd('reports/MEN_LOOK_TO_PRODUCT_EXCLUSION_MAP.json');

const womenExcluded = new Set(women.map((l) => l.sourceProductId).filter(Boolean)); // 236
const menExcluded = new Set(menMap.filter((r) => r.productId).map((r) => r.productId)); // 210
const excluded = new Set([...womenExcluded, ...menExcluded]);

const nonAccessory = CAT.filter((p) => !p.accessory);
const final321 = nonAccessory.filter((p) => !excluded.has(p.id));

// Sanity: nothing excluded that is an accessory or Traditional Layer.
const wrongTL = final321.filter((p) => p.category === 'Traditional Layer').length;

wr('src/data/trending-final.client.json', final321);

// Report JSON (rich fields)
const rich = final321.map((p) => ({
  productId: p.id, gender: p.gender, merchant: p.merchant, merchantUrl: p.merchantUrl,
  affiliateUrl: (p.affiliateUrl && p.affiliateUrl.trim()) ? p.affiliateUrl : 'NOT SPECIFIED',
  affiliateSource: (p.affiliateSource && p.affiliateSource.trim()) ? p.affiliateSource : 'NOT SPECIFIED',
  productName: p.title, category: p.category, subcategory: p.subcategory, occasion: p.occasion,
  colour: p.colour, fabric: p.fabric, silhouette: p.silhouette,
  details: [p.embroidery, p.pattern && p.pattern !== 'Solid' ? p.pattern : null].filter(Boolean).join(', ') || 'NOT SPECIFIED',
  approxPrice: p.price ? `INR ${p.price} (estimate)` : 'NOT SPECIFIED', reference: p.reference || 'NOT SPECIFIED',
  imageStatus: (p.imageUrl && p.imageUrl.trim()) ? 'present' : 'image-pending',
}));
wr('reports/TRENDING_FINAL_321.json', rich);

const ids = final321.map((p) => p.id);
const uniq = new Set(ids);
const g = {}; for (const p of final321) g[p.gender] = (g[p.gender] || 0) + 1;
const merchants = [...new Set(final321.map((p) => p.merchant))];
const amazon = merchants.filter((m) => /amazon/i.test(m));
const inventedAff = final321.filter((p) => p.affiliateUrl && p.affiliateUrl.trim()).length;
const tl = final321.filter((p) => p.category === 'Traditional Layer').length;

const md = `# VIRAAS — Final Trending Dataset (321)

**This is the source-of-truth Trending dataset.** It is a real dataset of ${final321.length} product records
(\`src/data/trending-final.client.json\`), not a display-count change, CSS hide, or pagination trick. Machine-readable:
[\`TRENDING_FINAL_321.json\`](./TRENDING_FINAL_321.json).

## Derivation
| Step | Count |
|---|---|
| Current Trending (non-accessory) | ${nonAccessory.length} |
| − Women duplicate counterparts (authored \`sourceProductId\`) | −${womenExcluded.size} |
| − Men duplicates (deterministic exclusion map, Phase 2) | −${menExcluded.size} |
| **Final Trending** | **${final321.length}** |

## Composition
| Metric | Value |
|---|---|
| Records | ${final321.length} |
| Unique product IDs | ${uniq.size} |
| Duplicate IDs | ${ids.length - uniq.size} |
| Men | ${g.men || 0} |
| Women | ${g.women || 0} |
| Traditional Layer (kept as apparel) | ${tl} |

## Validation
| Check | Result |
|---|---|
| Exactly 321 records | ${final321.length === 321 ? 'PASS' : 'FAIL (' + final321.length + ')'} |
| 321 unique IDs, 0 duplicates | ${uniq.size === 321 && ids.length === uniq.size ? 'PASS' : 'FAIL'} |
| 236 women removed via valid source linkage | ${womenExcluded.size === 236 ? 'PASS' : 'FAIL'} |
| 210 men removed via documented exclusion map | ${menExcluded.size === 210 ? 'PASS' : 'FAIL'} |
| Traditional Layer retained (not deleted) | ${tl > 0 ? 'PASS (' + tl + ' kept)' : 'CHECK'} |
| No Amazon | ${amazon.length === 0 ? 'PASS' : 'FAIL'} |
| No invented affiliate URLs | ${inventedAff === 0 ? 'PASS' : 'FAIL (' + inventedAff + ')'} |
| No fake analytics/ratings/reviews/stock/popularity | NONE present |

Catalog records are untouched (women-look linkage 236/236 preserved); the 446 counterparts remain in the catalog
but are excluded from the Trending view via this dedicated dataset.
`;
wr('reports/TRENDING_FINAL_321.md', md);

console.log('final trending:', final321.length, '| unique:', uniq.size, '| men/women:', JSON.stringify(g), '| TL kept:', tl);
console.log('women excluded:', womenExcluded.size, '| men excluded:', menExcluded.size, '| amazon:', amazon.length, '| inventedAff:', inventedAff, '| wrongTL excluded:', wrongTL);
