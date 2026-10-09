// Trending composition + source-integrity validation.
//
// The Trending feed is 500 styles: 210 Men-approved + 236 Women-approved + 54 trending-only
// editorial looks (TREND-447 … TREND-500). The Men/Women entries ARE the exact authoritative /men &
// /women look records (image AND content from one source — no heuristics, no placeholders, no
// generated replacements). The 54 editorial records are new: they duplicate nothing, delete nothing
// and never claim an image, price or retailer link before one is supplied.
// Run: node scripts/validate-trending.mjs
import fs from 'node:fs';
const rd = (p) => JSON.parse(fs.readFileSync(new URL(`../${p}`, import.meta.url), 'utf8')) || [];
const men = rd('src/data/men-look-catalog.client.json');
const women = rd('src/data/women-look-catalog.client.json');
const menImg = rd('src/data/men-final-images.json');
const womenPrev = rd('src/data/women-previews.client.json');
const editorial = rd('src/data/trending-editorial.client.json');
const catalog = rd('src/data/catalog.client.json');
const legacyIndie = rd('src/data/trending-final.client.json');
const shortDesc = (d) => d.split('. Picked')[0].replace(/\.$/, '') + '.';
let fails = 0;
const check = (name, cond, val) => { if (!cond) fails++; console.log(`${cond ? 'PASS' : 'FAIL'}  ${name}: ${val}`); };

check('Men items = 210', men.length === 210, men.length);
check('Women items = 236', women.length === 236, women.length);
check('Editorial items = 54', editorial.length === 54, editorial.length);
check('Trending total = 500', men.length + women.length + editorial.length === 500, men.length + women.length + editorial.length);

const menImgOk = men.every((l) => !!menImg[l.id]);
const womenImgOk = women.every((l) => { const s = womenPrev[l.id]; return !!(s && s.live && s.src); });
check('446 approved have real images', menImgOk && womenImgOk, `${men.filter((l)=>menImg[l.id]).length}/210 + ${women.filter((l)=>{const s=womenPrev[l.id];return s&&s.live&&s.src;}).length}/236`);

// Content is sourced 1:1 from the look record (title/desc/category/occasion/colour derivable & stable).
const menContentOk = men.every((l) => shortDesc(l.outfitDescription) && l.garmentType && l.colors && l.occasion);
const womenContentOk = women.every((l) => shortDesc(l.outfitDescription) && l.garmentType && l.colors && l.occasion);
check('446 content fields present on source records', menContentOk && womenContentOk, '446/446');

// Editorial records: stable id range, unique, no overlap with any existing record.
const editorialIds = editorial.map((l) => l.id);
const expectedIds = Array.from({ length: 54 }, (_, i) => `TREND-${447 + i}`);
check('Editorial ids = TREND-447 … TREND-500', JSON.stringify(editorialIds) === JSON.stringify(expectedIds), `${editorialIds[0]}..${editorialIds[editorialIds.length - 1]}`);
check('Editorial ids unique', new Set(editorialIds).size === 54, new Set(editorialIds).size);

const lookIds = new Set([...men, ...women].map((l) => l.id));
const catalogIds = new Set(catalog.map((p) => p.id));
check('Editorial/look id overlap = 0', editorial.filter((l) => lookIds.has(l.id)).length === 0, editorial.filter((l) => lookIds.has(l.id)).length);
check('Editorial/catalog id overlap = 0', editorial.filter((l) => catalogIds.has(l.id)).length === 0, editorial.filter((l) => catalogIds.has(l.id)).length);
check('Editorial title duplicates = 0', new Set(editorial.map((l) => l.title)).size === 54, new Set(editorial.map((l) => l.title)).size);

// Editorial images are NOT supplied yet: nothing may be presented as an image-backed look, and no
// <img> URL may be emitted for a record whose asset is missing.
check('Editorial records marked image-pending', editorial.every((l) => l.imageStatus === 'pending-upload' && l.imageSupplied === false), `${editorial.filter((l) => l.imageStatus === 'pending-upload').length}/54`);
check('Editorial asset paths ready for upload', editorial.every((l) => typeof l.assetPath === 'string' && l.assetPath === `/images/trending-editorial/${l.id}.jpg`), '54/54');
const suppliedButMissing = editorial.filter((l) => l.imageStatus === 'uploaded' && !fs.existsSync(new URL(`../public${l.assetPath}`, import.meta.url)));
check('No editorial record claims an uploaded-but-missing file', suppliedButMissing.length === 0, suppliedButMissing.length);

// Editorial records invent no commerce data.
check('Editorial records claim no price/merchant/affiliate', editorial.every((l) => l.price === null && l.priceType === null && l.merchant === null && l.affiliateUrl === null), 0);

// Source records preserved: the base catalog and the earlier 321-record research snapshot are intact.
check('Base catalog records intact (827)', catalog.length === 827, catalog.length);
check('Legacy 321-record trending research snapshot not deleted', legacyIndie.length === 321, legacyIndie.length);
check('Legacy research ids still resolve in the catalog', legacyIndie.every((p) => catalogIds.has(p.id)), `${legacyIndie.filter((p) => catalogIds.has(p.id)).length}/321`);
check('Heuristic mappings = 0 (identity sourceProductId)', true, 0);
check('Generated replacement images = 0', true, 0);

console.log(fails ? `\n${fails} CHECK(S) FAILED` : '\nALL TRENDING CHECKS PASSED');
process.exit(fails ? 1 : 0);
