// Builds the VIRAAS catalog, couple looks and image queue from data-src/.
// Output: src/data/catalog.json, src/data/couples.json, public/image-manifest.json,
//         public/image-queue.json, public/image-queue-ordered.json
// Image QA state is persisted in data-src/image-qa.json and is NEVER reset by this script.
import fs from 'node:fs';
import path from 'node:path';
import { WOMEN, MEN, MERCHANTS } from '../data-src/taxonomy.mjs';
import { COUPLES, WORLDS } from '../data-src/couples.mjs';
import { REFERENCES } from '../data-src/references.mjs';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const out = (p, d) => { fs.mkdirSync(path.dirname(path.join(ROOT, p)), { recursive: true }); fs.writeFileSync(path.join(ROOT, p), JSON.stringify(d, null, 2)); };
const QA = JSON.parse(fs.readFileSync(path.join(ROOT, 'data-src/image-qa.json'), 'utf8'));

const slug = (s) => s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
function hash(s) { let h = 2166136261; for (const c of s) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }

// Per-category caps keep the catalog meaningful (no colour-swap spam beyond what the market actually offers).
const CAPS = {
  women: { 'Chaniya Choli': 95, 'Lehenga': 85, 'Sharara': 42, 'Gharara': 30, 'Saree': 70, 'Pre-Draped Saree': 34, 'Anarkali': 45, 'Kurta Sets': 42, 'Jewellery': 30, 'Bags': 18, 'Footwear': 18, 'Beauty': 16 },
  men: { 'Modern Kurta': 95, 'Festive Kurta Set': 40, 'Ethnic Shirt': 32, 'Printed Ethnic Shirt': 55, 'Embroidered Ethnic Shirt': 30, 'Festive Jacket': 26, 'Traditional Layer': 32, 'Festive Separates': 14, 'Footwear': 12 },
};

const MERCHANT_POOL = {
  Beauty: ['NYKAA', 'MYNTRA', 'FLIPKART'],
  Jewellery: ['MYNTRA', 'AJIO', 'MEESHO', 'NYKAA', 'FLIPKART', 'SHOPSY'],
  default: MERCHANTS,
};

function merchantSearchUrl(m, q) {
  const e = encodeURIComponent(q);
  switch (m) {
    case 'MYNTRA': return `https://www.myntra.com/${slug(q)}`;
    case 'AJIO': return `https://www.ajio.com/search/?text=${e}`;
    case 'FLIPKART': return `https://www.flipkart.com/search?q=${e}`;
    case 'SHOPSY': return `https://www.shopsy.in/search?q=${e}`;
    case 'MEESHO': return `https://www.meesho.com/search?q=${e}`;
    case 'NYKAA': return `https://www.nykaafashion.com/search?q=${e}`;
    default: throw new Error('merchant not allowed: ' + m);
  }
}

const SIZES = {
  apparelW: ['XS', 'S', 'M', 'L', 'XL', 'XXL'], apparelM: ['S', 'M', 'L', 'XL', 'XXL'],
  saree: ['Free Size'], footW: ['UK 3', 'UK 4', 'UK 5', 'UK 6', 'UK 7', 'UK 8'], footM: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'],
  onesize: ['One Size'],
};
function sizesFor(g, cat) {
  if (cat === 'Saree' || cat === 'Traditional Layer') return SIZES.saree;
  if (cat === 'Footwear') return g === 'women' ? SIZES.footW : SIZES.footM;
  if (['Jewellery', 'Bags', 'Beauty'].includes(cat)) return SIZES.onesize;
  return g === 'women' ? SIZES.apparelW : SIZES.apparelM;
}

const AGE = ['16-30'];
const products = [];
const keyIndex = new Map();

function priceFor(band, key) {
  const [lo, hi] = band;
  const steps = Math.max(1, Math.floor((hi - lo) / 100));
  const p = lo + (hash(key) % (steps + 1)) * 100;
  const v = Math.min(8000, Math.max(199, Math.round(p / 100) * 100 - 1));
  return Number.isFinite(v) ? v : lo;
}

function styleTagsFor(v, colour, cat) {
  const t = new Set();
  const d = (v.detail + ' ' + v.pattern).toLowerCase();
  if (d.includes('mirror')) t.add('Mirror Work');
  if (d.includes('bandhani')) t.add('Bandhani');
  if (d.includes('kutch')) t.add('Kutchi');
  if (d.includes('patchwork')) t.add('Boho Patchwork');
  if (d.includes('chikankari')) t.add('Chikankari');
  if (d.includes('sequin')) t.add('Sequin');
  if (d.includes('zari') || d.includes('gota') || d.includes('gold')) t.add('Zari & Gota');
  if (d.includes('print') || d.includes('block')) t.add('Printed');
  if (d.includes('phulkari')) t.add('Phulkari');
  if (d.includes('brocade')) t.add('Brocade');
  if (d.includes('embroider')) t.add('Embroidered');
  if (colour === 'Black') t.add('Black Festive');
  if (['Ivory', 'White', 'Cream'].includes(colour)) t.add('Ivory & White');
  if (['Rani Pink', 'Hot Pink', 'Pink'].includes(colour)) t.add('Rani Pink');
  if (t.size === 0) t.add('Minimal');
  if (['Modern Kurta', 'Ethnic Shirt', 'Printed Ethnic Shirt', 'Embroidered Ethnic Shirt'].includes(cat)) t.add('Contemporary');
  return [...t];
}

const SECONDARY = {
  Black: ['Gold', 'Multicolour'], Ivory: ['Silver'], White: ['Silver'], 'Rani Pink': ['Gold'], Red: ['Gold', 'Green'], Navy: ['Silver'],
  'Royal Blue': ['Silver'], Emerald: ['Gold'], Mustard: ['Red'], Wine: ['Gold'], Maroon: ['Gold'], Multicolour: [],
};

function makeProduct(g, cat, def, v, colour, opts = {}) {
  const key = `${g}|${cat}|${colour}|${v.detail}`;
  if (keyIndex.has(key)) return keyIndex.get(key);
  const id = `${g === 'women' ? 'w' : 'm'}-${slug(cat)}-${slug(colour)}-${slug(v.detail)}`.slice(0, 90);
  const pool = MERCHANT_POOL[cat] || MERCHANT_POOL.default;
  const merchant = pool[hash(key) % pool.length];
  const title = opts.title || (v.title.toLowerCase().startsWith(colour.toLowerCase()) ? v.title : `${colour} ${v.title}`);
  const q = `${g === 'women' ? 'women' : 'men'} ${colour} ${v.title}`.replace(/\(.*?\)/g, '').trim();
  const occ = opts.occasion || def.occasions;
  const garmentDesc = opts.desc || `${colour.toLowerCase()} ${v.title.toLowerCase()} with ${v.detail}`;
  const price = priceFor(def.band, key);
  const tags = styleTagsFor(v, colour, cat);
  const imagePath = `/images/products/${id}.webp`;
  const qa = QA[`product:${id}`];
  const passed = qa && qa.qa === 'QA_PASS';
  const p = {
    id, gender: g, category: cat, subcategory: def.sub, title,
    merchant, brand: 'Marketplace sellers (varies)',
    price, priceType: 'estimate', mrp: null, discount: null, currency: 'INR',
    colour, secondaryColours: SECONDARY[colour] || [], fabric: v.fabric, pattern: v.pattern,
    embroidery: v.detail, silhouette: def.silhouette, occasion: occ, ageSegment: AGE, styleTags: tags,
    sizes: sizesFor(g, cat),
    imageUrl: passed ? imagePath : '', gallery: passed ? [imagePath] : [],
    merchantUrl: merchantSearchUrl(merchant, q), merchantUrlType: 'marketplace-search',
    affiliateUrl: '', affiliateSource: '',
    tryOnEnabled: !!def.tryOn,
    imagePrompt: productPrompt(g, cat, def, v, colour, garmentDesc),
    generatedImageUrl: passed ? imagePath : '',
    status: passed ? 'live' : 'image-pending',
    lastChecked: null,
    notes: 'Price is a typical marketplace price estimate for this style (not a live listing price). merchantUrl opens a marketplace search for this style. Affiliate link not configured.',
    description: describe(g, cat, def, v, colour, garmentDesc),
    reference: v.ref || opts.ref || null,
    accessory: !!def.accessory,
    coupleIds: [],
  };
  products.push(p); keyIndex.set(key, p);
  return p;
}

function describe(g, cat, def, v, colour, gd) {
  const occNames = def.occasions.map((o) => WORLDS.find((w) => w.slug === o)?.name).filter(Boolean).join(', ');
  if (def.accessory) return `A ${colour.toLowerCase()} ${v.title.toLowerCase()} to finish your festive look. Styled for ${occNames}.`;
  return `A ${gd} in ${v.fabric.toLowerCase()}, cut as a ${def.silhouette.toLowerCase()}. Picked for ${occNames} — youthful proportions, easy movement and a finish that photographs well at night.`;
}

function productPrompt(g, cat, def, v, colour, gd) {
  if (def.accessory) {
    return `Luxury Indian fashion editorial still-life product photograph of ${colour.toLowerCase()} ${v.title.toLowerCase()} (${v.detail}), realistic material texture, placed on a refined stone or fabric surface, soft editorial lighting, premium Indian fashion aesthetic, original VIRAAS composition, no text, no logos, no watermark.`;
  }
  const garment = g === 'men' ? `men's ${gd}` : `women's ${gd}`;
  return `Luxury Indian fashion editorial product presentation, full-body faceless premium fashion mannequin wearing ${garment}, ${colour.toLowerCase()}, ${v.fabric.toLowerCase()} fabric appearance, ${v.detail} details, ${def.silhouette.toLowerCase()} silhouette, styled according to VIRAAS visual reference ${v.ref || 'REF-' + (g === 'men' ? 'M1' : 'W1')}, realistic textile texture, natural garment drape, detailed stitching, sophisticated proportions, premium Indian fashion aesthetic, elegant contemporary environment, refined editorial lighting, complete outfit visible, original VIRAAS composition, no text, no logos, no watermark. Negative: text, logos, watermark, extra limbs, deformed hands, bad anatomy, floating garments, cropped outfit, cropped footwear, duplicate accessories, random jewellery, plastic appearance, cheap catalogue presentation, AI artifacts.`;
}

// 1) Couple-linked products first, so every couple look links to garments that match its image.
const findVariant = (def, detail) => def.variants.find((v) => v.detail === detail);
function coupleProduct(g, spec, couple, role) {
  const table = g === 'women' ? WOMEN : MEN;
  const def = table[spec.cat];
  if (!def) throw new Error(`Unknown category ${spec.cat} in ${couple.id}`);
  let v = findVariant(def, spec.detail);
  if (!v) v = { detail: spec.detail, fabric: spec.fabric, pattern: spec.detail.includes('print') ? 'Printed' : 'Embroidered', title: `${spec.detail.replace(/\b\w/g, (m) => m.toUpperCase())}${spec.detail.toLowerCase().includes(spec.fabric.toLowerCase()) ? '' : ' ' + spec.fabric} ${spec.cat === 'Kurta Sets' ? 'Kurta Set' : spec.cat}`, ref: couple.ref };
  const p = makeProduct(g, spec.cat, def, v, spec.colour, { desc: spec.desc, ref: couple.ref });
  if (!p.coupleIds.includes(couple.id)) p.coupleIds.push(couple.id);
  return p.id;
}
function accessory(g, cat, detail, colour, couple) {
  const def = (g === 'women' ? WOMEN : MEN)[cat];
  const v = findVariant(def, detail);
  const p = makeProduct(g, cat, def, v, colour);
  if (!p.coupleIds.includes(couple.id)) p.coupleIds.push(couple.id);
  return p.id;
}

const couples = COUPLES.map((c, i) => {
  const herIds = [coupleProduct('women', c.her, c, 'her')];
  const tone = c.tone || 'Oxidised Silver';
  const jew = ['jhumka earrings', 'choker necklace', 'bangle stack', 'kamarbandh waist belt'][i % 4];
  herIds.push(accessory('women', 'Jewellery', jew, tone, c));
  const footW = c.world === 'garba' ? 'mirror mojaris' : (c.world === 'festive-party' ? 'block heels' : 'embroidered juttis');
  herIds.push(accessory('women', 'Footwear', footW, tone === 'Gold' ? 'Gold' : 'Silver', c));
  const hisIds = [coupleProduct('men', c.him, c, 'him')];
  if (c.layer) hisIds.push(coupleProduct('men', c.layer, c, 'him'));
  hisIds.push(accessory('men', 'Footwear', c.world === 'garba' || c.world === 'traditional' ? 'kolhapuri sandals' : 'embroidered mojaris', 'Tan', c));
  const img = `/images/couples/${c.id}.webp`;
  const qa = QA[`couple:${c.id}`];
  const passed = qa && qa.qa === 'QA_PASS';
  return {
    ...c, herProductIds: herIds, hisProductIds: hisIds,
    imageUrl: passed ? img : '', imageStatus: qa?.qa || 'PENDING',
    imagePrompt: couplePrompt(c),
  };
});

function couplePrompt(c) {
  const base = 'Original editorial photograph of two Indian college students who are exactly 18 years old, realistic human faces, natural skin texture, realistic hair, natural anatomy and proportions, wearing the EXACT fashion combination and colour relationship shown in the supplied reference, recreate the reference styling and pose composition closely, preserve hand placement and body positioning, same visual interaction language, same camera perspective and framing language, authentic Indian festive environment, natural candid photographic feel, premium aesthetic, realistic lighting, slightly imperfect real-life photography, contemporary Gen-Z Indian fashion mood, no mannequin appearance, no faceless humans, no mature married-couple appearance, no bride/groom styling, no stiff studio pose, no politician-style kurta pyjama, no bandhgala, no Nehru jacket, no formal suit look, no extra accessories beyond the reference, no text, no logos, no watermark.';
  const his = c.him.desc + (c.layer ? ` with a ${c.layer.desc}` : '');
  return `${base} Reference: ${c.ref}. HER: ${c.her.desc}. HIM: ${his}. POSE: ${c.pose}. FRAMING: ${c.framing}. SETTING: ${c.setting}. LIGHT: ${c.light}.`;
}

// 2) Fill catalog with meaningful variant × colour combinations, capped per category.
function fill(g, table) {
  for (const [cat, def] of Object.entries(table)) {
    const cap = CAPS[g][cat];
    const current = () => products.filter((p) => p.gender === g && p.category === cat).length;
    // round-robin across variants so each variant gets a spread of colours
    let round = 0;
    while (current() < cap && round < def.colours.length) {
      def.variants.forEach((v, vi) => {
        if (current() >= cap) return;
        const colour = def.colours[(round + vi * 3) % def.colours.length];
        makeProduct(g, cat, def, v, colour);
      });
      round++;
    }
  }
}
fill('women', WOMEN);
fill('men', MEN);

// Validate uniqueness & sanity
const ids = new Set();
for (const p of products) {
  if (ids.has(p.id)) throw new Error('dup id ' + p.id);
  ids.add(p.id);
  if (!Number.isFinite(p.price) || p.price <= 0 || p.price > 8000) throw new Error('bad price ' + p.id);
}

// Image queue (ordered by spec §41 priority)
const PRIORITY_WORLD = ['garba', 'college-fest', 'diwali', 'festive-party', 'traditional'];
const queue = [];
couples.forEach((c) => {
  const q = QA[`couple:${c.id}`] || {};
  queue.push({
    id: `couple:${c.id}`, assetPath: `public/images/couples/${c.id}.webp`, type: 'couple', world: c.world, reference: c.ref,
    prompt: c.imagePrompt, status: q.qa || 'PENDING', dimensions: q.dimensions || null,
    generationState: q.generation || 'NOT_STARTED', qaState: q.qa || 'PENDING', qaNotes: q.notes || '', sha256: q.sha256 || null,
    priority: 1 + PRIORITY_WORLD.indexOf(c.world),
  });
});
const prodPriority = (p) => {
  if (p.occasion.includes('garba') && p.gender === 'women') return 6;
  if (p.occasion.includes('garba') && p.gender === 'men') return 7;
  if (p.occasion.includes('college-fest')) return 8;
  if (p.occasion.includes('diwali')) return 9;
  return 10;
};
products.forEach((p) => {
  const q = QA[`product:${p.id}`] || {};
  queue.push({
    id: `product:${p.id}`, assetPath: `public/images/products/${p.id}.webp`, type: `product-${p.gender}`, world: p.occasion[0], reference: p.reference,
    prompt: p.imagePrompt, status: q.qa || 'PENDING', dimensions: q.dimensions || null,
    generationState: q.generation || 'NOT_STARTED', qaState: q.qa || 'PENDING', qaNotes: q.notes || '', sha256: q.sha256 || null,
    priority: prodPriority(p) + (p.coupleIds.length ? -0.5 : 0),
  });
});
const ordered = [...queue].sort((a, b) => a.priority - b.priority || a.id.localeCompare(b.id));

const manifest = {
  generatedAt: new Date().toISOString(),
  references: REFERENCES.map(({ id, file, type, title }) => ({ id, file, type, title, note: 'Third-party reference used for visual direction only; not stored or redistributed.' })),
  assets: queue.filter((q) => q.qaState === 'QA_PASS').map((q) => ({ id: q.id, path: q.assetPath, type: q.type, reference: q.reference, dimensions: q.dimensions, sha256: q.sha256 })),
  totals: {
    queued: queue.length, qaPass: queue.filter((q) => q.qaState === 'QA_PASS').length,
    pending: queue.filter((q) => q.qaState === 'PENDING').length, qaFail: queue.filter((q) => q.qaState === 'QA_FAIL').length,
  },
};

out('src/data/catalog.json', products);
// Slim client bundle (prompts/notes live in the full catalog + queue, not in the browser bundle)
out('src/data/catalog.client.json', products.map(({ imagePrompt, notes, ...rest }) => rest));
out('src/data/couples.client.json', couples.map(({ imagePrompt, ...rest }) => rest));
out('src/data/couples.json', couples);
out('src/data/worlds.json', WORLDS);
out('public/image-queue.json', queue);
out('public/image-queue-ordered.json', ordered);
out('public/image-manifest.json', manifest);
const w = products.filter((p) => p.gender === 'women').length;
console.log(`catalog: ${products.length} products (women ${w}, men ${products.length - w}); couples ${couples.length}; images passed ${manifest.totals.qaPass}/${queue.length}`);
