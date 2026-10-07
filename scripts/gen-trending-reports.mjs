// VIRAAS — Trending & Accessories Phase 2 report generator (REPORT ONLY).
// Produces: 340-standalone image blueprint, ref-linked proposed-mapping (report only,
// NOT applied to the catalog), and accessories cleanup/support report.
// Generates NO images and mutates NO catalog data.
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const rd = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));
const wr = (p, d) => fs.writeFileSync(path.join(ROOT, p), typeof d === 'string' ? d : JSON.stringify(d, null, 2));
const NS = 'NOT SPECIFIED';
const val = (x) => (x === null || x === undefined || String(x).trim() === '' || (Array.isArray(x) && x.length === 0)) ? NS : x;

const P = rd('src/data/catalog.json');
const MEN = rd('src/data/men-look-catalog.client.json');
const WOMEN = rd('src/data/women-look-catalog.client.json');
const byId = new Map(P.map((p) => [p.id, p]));

const menImg = (id) => `public/images/men-previews/${id}.png`;
const womenImg = (id) => `public/images/women-previews/${id}.png`;
const fileExists = (rel) => fs.existsSync(path.join(ROOT, rel));

// ---------- shared helpers ----------
const detailsOf = (p) => {
  const parts = [];
  if (p.embroidery && p.embroidery !== 'null') parts.push(String(p.embroidery));
  if (p.pattern && p.pattern !== 'Solid') parts.push(String(p.pattern));
  return parts.length ? parts.join(', ') : NS;
};

// image type: garments worn on the body -> model-worn; draped layers -> styled-editorial
function imageType(p) {
  const sub = (p.subcategory || '').toLowerCase();
  if (sub.includes('stole') || sub.includes('dupatta') || sub.includes('shawl')) return 'styled-editorial';
  return 'model-worn';
}

function buildPrompt(p, type) {
  const colour = (p.colour && p.colour !== 'null') ? String(p.colour) : '';
  const fabric = (p.fabric && p.fabric !== 'null') ? String(p.fabric).toLowerCase() : '';
  const garment = (p.title || p.subcategory || p.category || 'garment');
  const det = detailsOf(p);
  const sil = (p.silhouette && p.silhouette !== 'null') ? String(p.silhouette).toLowerCase() : '';
  const bits = [];
  bits.push('Premium Indian fashion editorial photograph for the VIRAAS catalog.');
  if (type === 'model-worn') {
    bits.push(`A realistic Indian ${p.gender === 'men' ? 'male' : 'female'} model wearing ${colour ? colour.toLowerCase() + ' ' : ''}${garment.toLowerCase()}${fabric ? ' in ' + fabric + ' fabric' : ''}.`);
    bits.push('Natural skin texture, realistic hair, authentic contemporary Indian styling, relaxed natural pose, full-length framing.');
  } else {
    bits.push(`Styled editorial presentation of ${colour ? colour.toLowerCase() + ' ' : ''}${garment.toLowerCase()}${fabric ? ' in ' + fabric + ' fabric' : ''}, elegantly draped.`);
    bits.push('Soft realistic fabric fall, tasteful arrangement.');
  }
  if (det !== NS) bits.push(`Details: ${det}.`);
  if (sil) bits.push(`Silhouette: ${sil}.`);
  bits.push('Clean minimal composition, soft diffused editorial lighting, neutral studio backdrop, catalog quality, colour-accurate.');
  bits.push('No text, no watermark, no logo, no brand mark, no UI elements, no price label. Do not invent embroidery, prints, motifs, jewellery or accessories beyond those described.');
  return bits.join(' ');
}

function brief(p) {
  const type = imageType(p);
  return {
    productId: p.id,
    gender: val(p.gender),
    category: val(p.category),
    subcategory: val(p.subcategory),
    occasion: val(p.occasion),
    title: val(p.title),
    colour: val(p.colour),
    style: val(p.styleTags),
    silhouette: val(p.silhouette),
    fabric: val(p.fabric),
    details: detailsOf(p),
    merchant: val(p.merchant),
    currentImageStatus: (p.imageUrl && p.imageUrl.trim()) ? `present (${p.imageUrl})` : `image-pending (status: ${p.status || NS})`,
    recommendedImageType: type,
    composition: type === 'model-worn' ? 'Single subject, centred, full-length, generous negative space' : 'Flat/draped arrangement, centred, generous negative space',
    subject: type === 'model-worn' ? `One realistic Indian ${p.gender === 'men' ? 'male' : 'female'} model wearing the outfit` : 'The garment only, no model',
    styling: 'Conservative styling limited to the described garment; no invented add-ons',
    background: 'Clean neutral studio backdrop',
    lighting: 'Soft diffused editorial lighting',
    framing: type === 'model-worn' ? 'Full-length vertical' : 'Vertical product framing',
    futureFilename: `trending-${p.id}.webp`,
    prompt: buildPrompt(p, type),
  };
}

// ---------- 1) 340 standalone blueprint ----------
const standalone = P.filter((p) => !p.accessory && !p.reference);
const briefs = standalone.map(brief);
wr('reports/trending-340-image-briefs.json', briefs);

const bStat = (key) => {
  const m = {};
  for (const b of briefs) { const k = Array.isArray(b[key]) ? b[key].join('|') : b[key]; m[k] = (m[k] || 0) + 1; }
  return m;
};
const genderCount = bStat('gender');
const catCount = bStat('category');
const typeCount = bStat('recommendedImageType');

// ---------- 2) ref-linked proposed mapping (REPORT ONLY) ----------
// Women: real data link via women-look-catalog.sourceProductId (product <- look).
const womenLookByProduct = new Map();
for (const l of WOMEN) if (l.sourceProductId) womenLookByProduct.set(l.sourceProductId, l);

// Deterministic heuristic for men (no data link): match garmentType + primary colour.
const garmentMatch = (p, look) => {
  const t = ((p.subcategory || '') + ' ' + (p.category || '') + ' ' + (p.title || '')).toLowerCase();
  const gt = (look.garmentType || '').toLowerCase();
  if (!gt) return 0;
  const words = gt.split(/[\s/&-]+/).filter((w) => w.length > 2);
  let s = 0; for (const w of words) if (t.includes(w)) s += 2;
  return s;
};
const colourMatch = (p, look) => {
  const pc = (p.colour || '').toLowerCase();
  const lc = ((look.colors && look.colors.primary) || '').toLowerCase();
  if (!pc || !lc) return 0;
  return pc === lc ? 3 : (lc.includes(pc) || pc.includes(lc) ? 1 : 0);
};
function heuristicLook(p, pool) {
  let best = null, bestScore = -1;
  for (const look of pool) {
    const sc = garmentMatch(p, look) + colourMatch(p, look);
    if (sc > bestScore) { bestScore = sc; best = look; }
  }
  return { look: best, score: bestScore };
}

const refLinked = P.filter((p) => !p.accessory && p.reference);
const proposals = refLinked.map((p) => {
  if (p.gender === 'women') {
    const look = womenLookByProduct.get(p.id);
    if (look) {
      return {
        productId: p.id, gender: 'women', title: val(p.title), colour: val(p.colour),
        category: val(p.category), visualDirectionRef: val(p.reference),
        proposedLookId: look.id, proposedLookImage: womenImg(look.id),
        matchType: 'data-link (women-look-catalog.sourceProductId)', matchConfidence: 'high',
        matchBasis: 'Exact product id declared as sourceProductId of the approved women look',
        lookImageAvailable: fileExists(womenImg(look.id)),
        applied: false, note: 'Report only — catalog image NOT changed pending owner approval',
      };
    }
    // women with no declared link -> heuristic
    const { look: hl, score } = heuristicLook(p, WOMEN);
    return {
      productId: p.id, gender: 'women', title: val(p.title), colour: val(p.colour),
      category: val(p.category), visualDirectionRef: val(p.reference),
      proposedLookId: hl ? hl.id : NS, proposedLookImage: hl ? womenImg(hl.id) : NS,
      matchType: 'content-heuristic (garmentType+colour)', matchConfidence: score >= 4 ? 'medium' : 'low',
      matchBasis: `Score ${score} on garmentType+primary-colour similarity`,
      lookImageAvailable: hl ? fileExists(womenImg(hl.id)) : false,
      applied: false, note: 'Report only — proposed, needs human review',
    };
  }
  // men -> heuristic only (no sourceProductId in men-look-catalog)
  const { look: hl, score } = heuristicLook(p, MEN);
  return {
    productId: p.id, gender: 'men', title: val(p.title), colour: val(p.colour),
    category: val(p.category), visualDirectionRef: val(p.reference),
    proposedLookId: hl ? hl.id : NS, proposedLookImage: hl ? menImg(hl.id) : NS,
    matchType: 'content-heuristic (garmentType+colour)', matchConfidence: score >= 4 ? 'medium' : 'low',
    matchBasis: `Score ${score} on garmentType+primary-colour similarity (no data link exists for men)`,
    lookImageAvailable: hl ? fileExists(menImg(hl.id)) : false,
    applied: false, note: 'Report only — proposed, needs human review',
  };
});
wr('reports/trending-reflinked-proposed-mapping.json', proposals);

const pMen = proposals.filter((x) => x.gender === 'men');
const pWomen = proposals.filter((x) => x.gender === 'women');
const wDataLink = pWomen.filter((x) => x.matchType.startsWith('data-link')).length;
const wHeur = pWomen.length - wDataLink;

// ---------- 3) accessories cleanup + support report ----------
const SUPPORT = {
  Jewellery: { supported: true, women: 68, men: 22, basis: 'jhumka/choker/bangle/oxidised/maang-tikka etc. described in approved looks' },
  Footwear: { supported: true, women: 0, men: 51, basis: 'juttis/mojaris/kolhapuris described in approved MEN looks (women footwear not itemised in approved data)' },
  'Men Footwear': { supported: true, women: 0, men: 51, basis: 'mojaris/kolhapuris/loafers described in approved MEN looks' },
  Bags: { supported: false, women: 0, men: 0, basis: 'NO approved Men/Women look mentions bags/potli/clutch/sling' },
};
const accessories = P.filter((p) => p.accessory);
const accMap = accessories.map((p) => {
  const sup = SUPPORT[p.subcategory] || { supported: false, basis: 'unknown category' };
  const supportingLooks = p.gender === 'men' ? 'approved MEN look catalog (210)' : 'approved WOMEN look catalog (236)';
  return {
    productId: p.id, gender: val(p.gender), subcategory: val(p.subcategory), title: val(p.title),
    colour: val(p.colour), occasion: val(p.occasion),
    supportedByApprovedData: sup.supported,
    supportBasis: sup.basis,
    supportingLookSource: supportingLooks,
    lookImageOrReferenceAvailable: true, // approved look images/references exist as visual context
    ownAccessoryImageAvailable: !!(p.imageUrl && p.imageUrl.trim()),
    futureImageRequired: !(p.imageUrl && p.imageUrl.trim()),
    imageRule: 'Requires a DEDICATED accessory product image — outfit/look images must NOT be reused as the accessory image',
    recommendation: sup.supported ? 'KEEP' : 'REVIEW/REMOVE — not supported by approved look data',
  };
});
wr('reports/accessories-mapping.json', accMap);

const accByCat = {};
for (const a of accMap) { (accByCat[a.subcategory] = accByCat[a.subcategory] || { total: 0, supported: 0, futureImageRequired: 0 }); accByCat[a.subcategory].total++; if (a.supportedByApprovedData) accByCat[a.subcategory].supported++; if (a.futureImageRequired) accByCat[a.subcategory].futureImageRequired++; }

// ---------- console summary ----------
console.log('=== BLUEPRINT (standalone) ===');
console.log('count:', briefs.length, '| gender:', JSON.stringify(genderCount), '| imageType:', JSON.stringify(typeCount));
console.log('categories:', JSON.stringify(catCount));
console.log('unique ids:', new Set(briefs.map((b) => b.productId)).size, '| dup:', briefs.length - new Set(briefs.map((b) => b.productId)).size);
console.log('=== PROPOSAL (ref-linked) ===');
console.log('total:', proposals.length, '| men:', pMen.length, '| women:', pWomen.length, '| women data-link:', wDataLink, '| women heuristic:', wHeur, '| men heuristic:', pMen.length);
console.log('=== ACCESSORIES ===');
console.log('total accessory:true:', accessories.length, JSON.stringify(accByCat));

// stash figures for the MD writer
wr('reports/_phase2-figures.json', {
  blueprint: { count: briefs.length, gender: genderCount, imageType: typeCount, categories: catCount },
  proposal: { total: proposals.length, men: pMen.length, women: pWomen.length, womenDataLink: wDataLink, womenHeuristic: wHeur, menHeuristic: pMen.length },
  accessories: { total: accessories.length, byCat: accByCat },
});
