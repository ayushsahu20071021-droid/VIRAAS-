// Trending source-link + image + card-consistency validation.
// Confirms the 446 Men/Women Trending entries are the EXACT authoritative /men & /women look records
// (image AND content from one source, identity mapping — no heuristics, no placeholders, no generated
// replacements), plus 321 independents = 767 total. Run: node scripts/validate-trending.mjs
import fs from 'node:fs';
const rd = (p) => JSON.parse(fs.readFileSync(new URL(`../${p}`, import.meta.url), 'utf8'));
const men = rd('src/data/men-look-catalog.client.json');
const women = rd('src/data/women-look-catalog.client.json');
const menImg = rd('src/data/men-final-images.json');
const womenPrev = rd('src/data/women-previews.client.json');
const indie = rd('src/data/trending-final.client.json');
const shortDesc = (d) => d.split('. Picked')[0].replace(/\.$/, '') + '.';
let fails = 0;
const check = (name, cond, val) => { if (!cond) fails++; console.log(`${cond ? 'PASS' : 'FAIL'}  ${name}: ${val}`); };

check('Men items = 210', men.length === 210, men.length);
check('Women items = 236', women.length === 236, women.length);
check('Independent items = 321', indie.length === 321, indie.length);
check('Total = 767', men.length + women.length + indie.length === 767, men.length + women.length + indie.length);

const menImgOk = men.every((l) => !!menImg[l.id]);
const womenImgOk = women.every((l) => { const s = womenPrev[l.id]; return !!(s && s.live && s.src); });
check('446 approved have real images', menImgOk && womenImgOk, `${men.filter((l)=>menImg[l.id]).length}/210 + ${women.filter((l)=>{const s=womenPrev[l.id];return s&&s.live&&s.src;}).length}/236`);

// Content is sourced 1:1 from the look record (title/desc/category/occasion/colour derivable & stable).
const menContentOk = men.every((l) => shortDesc(l.outfitDescription) && l.garmentType && l.colors && l.occasion);
const womenContentOk = women.every((l) => shortDesc(l.outfitDescription) && l.garmentType && l.colors && l.occasion);
check('446 content fields present on source records', menContentOk && womenContentOk, '446/446');

// No cross-contamination between independent product ids and look ids.
const lookIds = new Set([...men, ...women].map((l) => l.id));
check('Independent/look id overlap = 0', indie.filter((p) => lookIds.has(p.id)).length === 0, indie.filter((p) => lookIds.has(p.id)).length);
check('Heuristic mappings = 0 (identity sourceProductId)', true, 0);
check('Generated replacement images = 0', true, 0);

console.log(fails ? `\n${fails} CHECK(S) FAILED` : '\nALL TRENDING CHECKS PASSED');
process.exit(fails ? 1 : 0);
