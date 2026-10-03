// Builds per-look Outfit Details overlays for MEN 210 + WOMEN 236 from each look's
// LOCKED outfit definition (authoritative textual truth). Fields that cannot be derived
// from the definition (pose/framing, setting/light, and — for women — footwear/accessories)
// are left as "" here and filled from image inspection in look-details-visual.json.
// NOTHING is invented: where the definition is silent, an honest value is used.
// Read-only w.r.t. approved catalogs — writes only the two overlay files.
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const rd = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));
const men = rd('src/data/men-look-catalog.client.json');
const women = rd('src/data/women-look-catalog.client.json');
let visual = {};
try { visual = rd('src/data/look-details-visual.json'); } catch { visual = { men: {}, women: {} }; }

const cap = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
const colour = (c) => [c.primary, ...(c.secondary || [])].filter(Boolean).join(' · ') || 'Not visible in reference';

// ---------- MEN ----------
function menLayering(l) {
  if (l.layering) return l.layering.replace(' / ', ' / ');
  const d = l.outfitDescription.toLowerCase();
  if (/\bnehru jacket|waistcoat|bandi\b/.test(d)) return 'Waistcoat / Nehru jacket';
  if (/\bjacket\b/.test(d)) return 'Jacket / outer layer';
  if (/\bstole|scarf|dupatta\b/.test(d)) return 'Stole / scarf';
  return 'No additional layer';
}
function menBottom(l) {
  if (l.bottomwear) return l.bottomwear;
  const d = l.outfitDescription.toLowerCase();
  if (/dhoti/.test(d)) return 'Dhoti-style trousers';
  if (/pyjama|pajama|churidar/.test(d)) return 'Pyjama trousers';
  if (/jeans|denim/.test(d)) return 'Denim / jeans';
  if (/trouser|pant/.test(d)) return 'Trousers';
  return 'Not clearly visible in reference';
}
function menFoot(l) {
  if (l.footwear) return l.footwear;
  const d = l.outfitDescription.toLowerCase();
  const m = d.match(/(white|black|brown|tan|dark|light|cream|beige|neutral)?\s*(mojari|jutti|kolhapuri|loafer|sneaker|sandal|shoe|slip-on|footwear)/);
  if (m) return cap(`${m[1] ? m[1] + ' ' : ''}${m[2].replace('shoe', 'shoes').replace('footwear', 'footwear')}`);
  return ''; // fill from image inspection, else honest fallback applied at merge
}
function menAcc(l) {
  if (l.accessories) return l.accessories;
  const d = l.outfitDescription.toLowerCase();
  const hits = [];
  if (/sunglass/.test(d)) hits.push('Sunglasses');
  if (/\bchain\b|pendant|\bmala\b|necklace/.test(d)) hits.push('Chain');
  if (/\bwatch\b/.test(d)) hits.push('Watch');
  if (/bracelet|kada|\bkara\b/.test(d)) hits.push('Bracelet');
  if (/\bring\b/.test(d)) hits.push('Ring');
  if (/brooch|pin\b/.test(d)) hits.push('Brooch');
  if (/pocket square/.test(d)) hits.push('Pocket square');
  return hits.join(' · '); // may be '' -> fill from image / honest
}

// ---------- WOMEN ----------
function womenLayering(l) {
  const d = l.outfitDescription.toLowerCase();
  const g = (l.garmentType || '').toLowerCase();
  if (/patola dupatta/.test(d)) return 'Patola dupatta';
  if (/bandhani dupatta|bandhej dupatta/.test(d)) return 'Bandhani dupatta';
  if (/net dupatta/.test(d)) return 'Net dupatta';
  if (/organza dupatta/.test(d)) return 'Organza dupatta';
  if (/embroidered dupatta/.test(d)) return 'Embroidered dupatta';
  if (/double dupatta|two dupatta/.test(d)) return 'Double dupatta';
  if (/dupatta/.test(d)) return 'Dupatta';
  if (/\bcape\b/.test(d)) return 'Cape';
  if (/\bshrug\b|jacket/.test(d)) return 'Jacket / shrug';
  if (/\bpallu\b/.test(d) || g.includes('saree')) return 'Saree pallu drape';
  return 'No additional layer';
}
function womenBottom(l) {
  const d = l.outfitDescription.toLowerCase();
  const g = (l.garmentType || '').toLowerCase();
  const col = (l.colors.primary || '').toLowerCase();
  if (g.includes('chaniya')) return `Flared chaniya skirt${col ? ` (${cap(col)})` : ''}`;
  if (g.includes('lehenga')) return `Flared lehenga skirt${col ? ` (${cap(col)})` : ''}`;
  if (g.includes('sharara')) return 'Sharara flared pants';
  if (g.includes('gharara')) return 'Gharara pants';
  if (g.includes('anarkali')) return /churidar/.test(d) ? 'Churidar' : /palazzo/.test(d) ? 'Palazzo' : 'Not applicable (floor-length anarkali)';
  if (g.includes('pre-draped saree') || g === 'saree') return 'Not applicable (draped saree)';
  if (g.includes('gown') || g.includes('dress')) return 'Not applicable (one-piece)';
  if (/palazzo/.test(d)) return 'Palazzo';
  if (/cigarette pant|straight pant|trouser/.test(d)) return 'Trousers';
  if (/churidar/.test(d)) return 'Churidar';
  if (/skirt/.test(d)) return 'Flared skirt';
  // fall back to any existing bottomwear that reads like actual bottomwear
  if (l.bottomwear && !['Garba Wear', 'Lehenga Choli'].includes(l.bottomwear)) return l.bottomwear;
  return 'Not clearly visible in reference';
}
function menPattern(l) {
  const p = l.patternOrEmbroidery || {};
  let parts = [p.pattern, p.embroidery].filter((x) => x && !/^(none|plain)$/i.test(x));
  // A "Solid" base that is embroidered/printed reads as just the surface work.
  if (parts.length > 1) parts = parts.filter((x) => !/^solid$/i.test(x));
  return parts.join(' · ') || 'Solid';
}
function womenPattern(l) {
  const p = l.patternOrEmbroidery || {};
  const parts = [p.pattern, p.embroidery].filter(Boolean).filter((v, i, a) => a.indexOf(v) === i);
  return parts.join(' · ') || 'Solid';
}

const HONEST_FOOT = 'Not clearly visible in reference';
const HONEST_ACC = 'Not clearly visible in reference';

function build(list, gender) {
  const out = {};
  const vis = (visual[gender]) || {};
  for (const l of list) {
    const v = vis[l.id] || {};
    const isMen = gender === 'men';
    const foot = isMen ? menFoot(l) : '';
    const acc = isMen ? menAcc(l) : '';
    out[l.id] = {
      garment: l.garmentType || 'Not visible in reference',
      colour: colour(l.colors),
      pattern: isMen ? menPattern(l) : womenPattern(l),
      layering: isMen ? menLayering(l) : womenLayering(l),
      bottomwear: isMen ? menBottom(l) : womenBottom(l),
      // image-derived fields take precedence when present in look-details-visual.json
      footwear: v.footwear || foot || HONEST_FOOT,
      accessories: v.accessories || acc || HONEST_ACC,
      poseFraming: v.poseFraming || 'Not clearly visible in reference',
      settingLight: v.settingLight || 'Not clearly visible in reference',
    };
  }
  return out;
}

const menOut = build(men, 'men');
const womenOut = build(women, 'women');
fs.writeFileSync(path.join(ROOT, 'src/data/men-look-details.json'), JSON.stringify(menOut, null, 2));
fs.writeFileSync(path.join(ROOT, 'src/data/women-look-details.json'), JSON.stringify(womenOut, null, 2));
console.log(`men-look-details.json: ${Object.keys(menOut).length}`);
console.log(`women-look-details.json: ${Object.keys(womenOut).length}`);
// quick null/empty check
for (const [g, o] of [['men', menOut], ['women', womenOut]]) {
  let empty = 0, notRec = 0;
  for (const d of Object.values(o)) for (const val of Object.values(d)) { if (!val || !String(val).trim()) empty++; if (/not recorded/i.test(val)) notRec++; }
  console.log(`${g}: empty=${empty} notRecorded=${notRec}`);
}
