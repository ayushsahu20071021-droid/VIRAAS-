import { readJSON, report } from './lib/common.mjs';
const P = readJSON('src/data/catalog.json'); const C = readJSON('src/data/couples.json'); const W = readJSON('src/data/worlds.json');
const REQUIRED = ['id','gender','category','subcategory','title','merchant','brand','price','mrp','discount','currency','colour','secondaryColours','fabric','pattern','embroidery','silhouette','occasion','ageSegment','styleTags','sizes','imageUrl','gallery','merchantUrl','affiliateUrl','affiliateSource','tryOnEnabled','imagePrompt','generatedImageUrl','status','lastChecked','notes','description'];
const missing = P.filter((p) => REQUIRED.some((k) => !(k in p)));
const ids = new Set(P.map((p) => p.id)); const titles = new Set(P.map((p) => p.title.toLowerCase()));
const sig = new Set(P.map((p) => [p.gender,p.category,p.colour,p.embroidery].join('|')));
const badPrice = P.filter((p) => !Number.isFinite(p.price) || p.price <= 0 || p.price > 8000);
const worldSlugs = W.map((w) => w.slug);
const perWorld = Object.fromEntries(worldSlugs.map((w) => [w, C.filter((c) => c.world === w).length]));
const badLinks = C.filter((c) => [...c.herProductIds, ...c.hisProductIds].some((id) => !ids.has(id)));
const linkCount = C.map((c) => c.herProductIds.length + c.hisProductIds.length);
// semantic agreement: couple's her/him garment spec must equal linked product category+colour
const byId = new Map(P.map((p) => [p.id, p]));
const mismatch = C.filter((c) => { const h = byId.get(c.herProductIds[0]); const m = byId.get(c.hisProductIds[0]); return h.category !== c.her.cat || h.colour !== c.her.colour || m.category !== c.him.cat || m.colour !== c.him.colour; });
const women = P.filter((p) => p.gender === 'women').length, men = P.filter((p) => p.gender === 'men').length;
const REJECTED = /achkan|sherwani|co-?ord|indo[- ]?western|fusion|kediyu|kafni|chorno|dhoti/i;
report('check-catalog', [
  [P.length >= 653, `product count ${P.length} (min 653)`],
  [P.length >= 823, `product count ${P.length} meets target ~823+`, 'warn'],
  [ids.size === P.length, `unique ids ${ids.size}/${P.length}`],
  [titles.size === P.length, `unique titles ${titles.size}/${P.length}`],
  [sig.size === P.length, `unique gender|category|colour|detail signatures ${sig.size}/${P.length} (no meaningless duplicates)`],
  [missing.length === 0, `all ${REQUIRED.length} required fields present (${missing.length} missing)`],
  [badPrice.length === 0, `all prices finite, >0, <=₹8,000 (${badPrice.length} bad)`],
  [P.every((p) => p.currency === 'INR'), 'currency INR'],
  [P.every((p) => p.mrp === null && p.discount === null), 'no fabricated MRP/discount'],
  [!P.some((p) => 'rating' in p || 'reviews' in p || 'stock' in p || 'bestseller' in p), 'no fabricated ratings/reviews/stock/bestseller'],
  [!P.some((p) => REJECTED.test(p.title + ' ' + p.category)), 'no rejected directions (achkan/sherwani/co-ord/fusion/costume) in catalog'],
  [women > 0 && men > 0, `women ${women}, men ${men}`],
  [C.length === 100, `couple looks ${C.length}`],
  [W.length === 5 && Object.values(perWorld).every((n) => n === 20), `5 worlds × 20: ${JSON.stringify(perWorld)}`],
  [C.every((c) => worldSlugs.includes(c.world)), 'no ghost worlds on couples'],
  [P.every((p) => p.occasion.every((o) => worldSlugs.includes(o))), 'product occasions limited to 5 public worlds'],
  [badLinks.length === 0, `couple product links resolve (${badLinks.length} broken)`],
  [linkCount.every((n) => n >= 4 && n <= 6), `4–6 linked products per couple (min ${Math.min(...linkCount)}, max ${Math.max(...linkCount)})`],
  [mismatch.length === 0, `couple garment ↔ linked product category+colour agree (${mismatch.length} mismatches)`],
]);
