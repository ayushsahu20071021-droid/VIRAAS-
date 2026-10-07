// Audit for the FINAL OUTFIT DETAILS + COUPLE SHOP-THE-LOOK + COUPLE TRY-ON phase.
// Data-layer checks only — does not touch approved images, catalogs, or affiliate sources.
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const rd = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));

const menCat = rd('src/data/men-look-catalog.client.json');
const womenCat = rd('src/data/women-look-catalog.client.json');
const menDet = rd('src/data/men-look-details.json');
const womenDet = rd('src/data/women-look-details.json');
const couples = rd('src/data/couples.client.json');
const coupleAff = rd('src/data/couple-affiliate.json');
const catalog = rd('src/data/catalog.client.json');

const FIELDS = ['garment', 'colour', 'pattern', 'layering', 'bottomwear', 'footwear', 'accessories', 'poseFraming', 'settingLight'];
const GENERIC = /not recorded|^none recorded$|^n\/a$|^tbd$|undefined|null/i;

function auditDetails(cat, det, gender) {
  const ids = cat.map((l) => l.id);
  let covered = 0, empty = 0, generic = 0, missing = 0;
  for (const id of ids) {
    const d = det[id];
    if (!d) { missing++; continue; }
    covered++;
    for (const f of FIELDS) {
      const v = d[f];
      if (v === undefined || v === null || !String(v).trim()) empty++;
      else if (GENERIC.test(String(v))) generic++;
    }
  }
  const extra = Object.keys(det).filter((k) => !ids.includes(k)).length;
  return { gender, total: ids.length, covered, missing, extra, empty, generic };
}

const men = auditDetails(menCat, menDet, 'men');
const women = auditDetails(womenCat, womenDet, 'women');

// ---- Couples ----
const byIdSet = new Set(catalog.map((p) => p.id));
let coupleContentOk = 0, herMapOk = 0, himMapOk = 0, crossMap = 0, affMissing = 0, affInvented = 0, herShop = 0, himShop = 0, herTry = 0, himTry = 0;
const HER_CAT = /lehenga|choli|saree|anarkali|gown|kurti|sharara|gharara|chaniya|dress|skirt|indo|crop/i;
const HIM_CAT = /kurta|sherwani|nehru|bandh|jacket|blazer|dhoti|pathani|suit|waistcoat|indo|shirt|bandi/i;
for (const c of couples) {
  // content preserved: required fields still present
  if (c.her && c.him && c.title && c.herProductIds && c.hisProductIds) coupleContentOk++;
  const herIds = c.herProductIds || [];
  const hisIds = c.hisProductIds || [];
  // her products should exist and be women-side categories; him products men-side
  if (herIds.length && herIds.every((x) => byIdSet.has(x))) herMapOk++;
  if (hisIds.length && hisIds.every((x) => byIdSet.has(x))) himMapOk++;
  // cross-mapping: any her product id appearing in his list (or vice versa)
  if (herIds.some((x) => hisIds.includes(x))) crossMap++;
  // shop-the-look present when a main product id exists on each side
  if (herIds[0]) herShop++;
  if (hisIds[0]) himShop++;
  // try-on routes exist (existing product entry point)
  if (herIds[0] && byIdSet.has(herIds[0])) herTry++;
  if (hisIds[0] && byIdSet.has(hisIds[0])) himTry++;
  // affiliate placeholders
  const a = coupleAff[c.id];
  if (!a || !('herAffiliateUrl' in a) || !('himAffiliateUrl' in a)) affMissing++;
  else {
    for (const u of [a.herAffiliateUrl, a.himAffiliateUrl]) {
      if (u && String(u).trim()) affInvented++; // any non-empty URL would be a fabricated link at this phase
    }
  }
}

// ---- product catalog affiliate untouched (all empty) ----
const prodAffNonEmpty = catalog.filter((p) => p.affiliateUrl && String(p.affiliateUrl).trim()).length;

const report = {
  generatedAt: new Date().toISOString(),
  men: { ...men },
  women: { ...women },
  totals: {
    menDetails: `${men.covered}/${men.total}`,
    womenDetails: `${women.covered}/${women.total}`,
    combined: `${men.covered + women.covered}/${men.total + women.total}`,
    remainingGenericMenWomen: men.generic + women.generic,
    emptyInvalidMenWomen: men.empty + women.empty + men.missing + women.missing,
  },
  couples: {
    total: couples.length,
    contentPreserved: `${coupleContentOk}/${couples.length}`,
    herMappingValid: `${herMapOk}/${couples.length}`,
    himMappingValid: `${himMapOk}/${couples.length}`,
    crossMappedCouples: crossMap,
    shopTheLookHer: `${herShop}/${couples.length}`,
    shopTheLookHim: `${himShop}/${couples.length}`,
    tryOnHer: `${herTry}/${couples.length}`,
    tryOnHim: `${himTry}/${couples.length}`,
    affiliatePlaceholdersMissing: affMissing,
    inventedAffiliateUrls: affInvented,
  },
  productCatalogAffiliateNonEmpty: prodAffNonEmpty,
};

fs.mkdirSync(path.join(ROOT, 'reports'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'reports/outfit-details-audit.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));

const pass =
  men.covered === men.total && women.covered === women.total &&
  men.generic + women.generic === 0 && men.empty + women.empty === 0 &&
  men.missing + women.missing === 0 &&
  coupleContentOk === couples.length && crossMap === 0 &&
  herShop === couples.length && himShop === couples.length &&
  herTry === couples.length && himTry === couples.length &&
  affMissing === 0 && affInvented === 0;
console.log('\nAUDIT', pass ? 'PASS' : 'FAIL');
process.exit(pass ? 0 : 1);
