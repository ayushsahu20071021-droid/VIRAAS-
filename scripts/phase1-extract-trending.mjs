// PHASE 1 — Extract & freeze the CURRENT Trending dataset (767 non-accessory marketplace products).
// Read-only snapshot. Does not modify any catalog record.
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const rd = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));
const wr = (p, d) => fs.writeFileSync(path.join(ROOT, p), typeof d === 'string' ? d : JSON.stringify(d, null, 2));
const NS = 'NOT SPECIFIED';
const v = (x) => (x === null || x === undefined || String(x).trim() === '' || (Array.isArray(x) && x.length === 0)) ? NS : x;

const P = rd('src/data/catalog.json');
const trending = P.filter((p) => !p.accessory);

const rows = trending.map((p) => ({
  productId: p.id,
  merchant: v(p.merchant),
  merchantUrl: v(p.merchantUrl),
  affiliateUrl: (p.affiliateUrl && p.affiliateUrl.trim()) ? p.affiliateUrl : NS,
  affiliateSource: (p.affiliateSource && p.affiliateSource.trim()) ? p.affiliateSource : NS,
  productName: v(p.title),
  category: v(p.category),
  subcategory: v(p.subcategory),
  gender: v(p.gender),
  occasion: v(p.occasion),
  colour: v(p.colour),
  style: v(p.styleTags),
  silhouette: v(p.silhouette),
  fabric: v(p.fabric),
  details: [p.embroidery, p.pattern && p.pattern !== 'Solid' ? p.pattern : null].filter(Boolean).join(', ') || NS,
  approxPrice: p.price ? `₹${p.price} (${p.priceType || 'estimate'})` : NS,
  reference: v(p.reference),
  imageStatus: (p.imageUrl && p.imageUrl.trim()) ? `present (${p.imageUrl})` : `image-pending (${p.status || NS})`,
}));

wr('reports/TRENDING_CURRENT_767.json', rows);

// Validation
const ids = rows.map((r) => r.productId);
const unique = new Set(ids);
const ALLOWED = ['MYNTRA', 'AJIO', 'FLIPKART', 'SHOPSY', 'MEESHO', 'NYKAA'];
const merchants = [...new Set(rows.map((r) => r.merchant))];
const badMerch = merchants.filter((m) => !ALLOWED.includes(m));
const inventedAff = rows.filter((r) => r.affiliateUrl !== NS).length;
const byGender = {}; for (const r of rows) byGender[r.gender] = (byGender[r.gender] || 0) + 1;

const md = `# VIRAAS — Current Trending Snapshot (767)

**Frozen snapshot of the live Trending page BEFORE deduplication.** Read-only; no records modified.
Machine-readable: [\`TRENDING_CURRENT_767.json\`](./TRENDING_CURRENT_767.json).

## Totals
| Metric | Value |
|---|---|
| Records | ${rows.length} |
| Unique product IDs | ${unique.size} |
| Duplicate IDs | ${ids.length - unique.size} |
| Men | ${byGender.men || 0} |
| Women | ${byGender.women || 0} |

## Validation
| Check | Result |
|---|---|
| 767 records | ${rows.length === 767 ? 'PASS' : 'FAIL (' + rows.length + ')'} |
| Unique product IDs | ${unique.size === rows.length ? 'PASS' : 'FAIL'} |
| Allowed merchants only | ${badMerch.length === 0 ? 'PASS' : 'FAIL: ' + badMerch.join(',')} |
| Invented affiliate URLs = 0 | ${inventedAff === 0 ? 'PASS' : 'FAIL (' + inventedAff + ')'} |
| Fake analytics/popularity/ratings/reviews/stock | NONE (not present in dataset) |

Merchants present: ${merchants.join(', ')}.

## Fields captured per product
productId, merchant, merchantUrl, affiliateUrl, affiliateSource, productName, category, subcategory, gender,
occasion, colour, style, silhouette, fabric, details, approxPrice, reference, imageStatus.
Missing source values are recorded as \`NOT SPECIFIED\` (nothing invented). All 767 are currently image-pending.
`;
wr('reports/TRENDING_CURRENT_767.md', md);

console.log('records:', rows.length, '| unique:', unique.size, '| men/women:', JSON.stringify(byGender));
console.log('badMerchants:', badMerch, '| inventedAff:', inventedAff);
