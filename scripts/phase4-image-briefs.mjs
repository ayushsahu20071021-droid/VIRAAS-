// PHASE 4 — Image briefs for the final 321 Trending products ONLY.
// Briefs are derived purely from each product's own catalog data (garment, colour, fabric, pattern,
// embroidery, occasion, silhouette). No text/watermark/logo. No mapping of approved Men/Women/Couple
// catalog images to marketplace products.
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const rd = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));
const wr = (p, d) => fs.writeFileSync(path.join(ROOT, p), typeof d === 'string' ? d : JSON.stringify(d, null, 2));

const FINAL = rd('src/data/trending-final.client.json');

const clean = (v) => (v && String(v).trim() && !/^solid$/i.test(String(v))) ? String(v).trim() : '';

function brief(p) {
  const parts = [];
  const colour = clean(p.colour);
  const fabric = clean(p.fabric);
  const garment = clean(p.subcategory) || clean(p.category);
  const gender = p.gender === 'women' ? "women's" : "men's";
  parts.push(`${colour ? colour + ' ' : ''}${gender} ${garment}`.trim());
  if (fabric) parts.push(`in ${fabric}`);
  const emb = clean(p.embroidery);
  const pat = clean(p.pattern);
  if (emb) parts.push(`with ${emb} embroidery`);
  if (pat) parts.push(`${emb ? 'and ' : 'with '}${pat} pattern`);
  const sil = clean(p.silhouette);
  if (sil) parts.push(`${sil} silhouette`);
  const occ = Array.isArray(p.occasion) && p.occasion.length ? p.occasion.join(', ') : '';
  const subject = parts.join(', ');
  const prompt =
    `Full-length studio ecommerce fashion photograph of a ${subject}. ` +
    `Worn by a professional model, front-facing, natural confident pose, neutral seamless light-grey studio backdrop, ` +
    `soft even softbox lighting, true-to-life fabric texture and colour, sharp focus, high resolution, ` +
    `centered composition with head-to-toe framing.` +
    (occ ? ` Styled for ${occ} occasion.` : '') +
    ` No text, no watermark, no logo, no brand marks, no graphics overlay.`;
  return {
    productId: p.id,
    gender: p.gender,
    outputPath: `public/images/trending/trending-product-${p.id}.webp`,
    subject,
    derivedFrom: { colour: colour || 'NOT SPECIFIED', fabric: fabric || 'NOT SPECIFIED', garment, embroidery: emb || 'NOT SPECIFIED', pattern: pat || 'NOT SPECIFIED', silhouette: sil || 'NOT SPECIFIED', occasion: occ || 'NOT SPECIFIED' },
    prompt,
    negative: 'text, watermark, logo, brand name, signature, caption, graphics overlay, deformed hands, extra limbs, distorted face',
  };
}

const briefs = FINAL.map(brief);
wr('reports/TRENDING_FINAL_321_IMAGE_BRIEFS.json', briefs);

const g = {}; for (const b of briefs) g[b.gender] = (g[b.gender] || 0) + 1;
const md = `# VIRAAS — Trending Final 321 Image Briefs

One image brief per product for the **final 321 Trending products only**. Each brief is derived solely from the
product's own catalog attributes (garment, colour, fabric, pattern, embroidery, silhouette, occasion). Machine-readable:
[\`TRENDING_FINAL_321_IMAGE_BRIEFS.json\`](./TRENDING_FINAL_321_IMAGE_BRIEFS.json).

## Rules applied
- No text, watermark, logo, or fabricated brand marks in any brief.
- No reuse/mapping of approved Men/Women/Couple catalog images to marketplace products.
- Output target per product: \`public/images/trending/trending-product-<id>.webp\`.
- Missing attributes recorded as \`NOT SPECIFIED\` (nothing invented).

## Coverage
| Metric | Value |
|---|---|
| Briefs | ${briefs.length} |
| Men | ${g.men || 0} |
| Women | ${g.women || 0} |
| Unique output paths | ${new Set(briefs.map((b) => b.outputPath)).size} |

## Example brief
\`\`\`
${briefs[0].prompt}
\`\`\`
`;
wr('reports/TRENDING_FINAL_321_IMAGE_BRIEFS.md', md);
console.log('briefs:', briefs.length, '| genders:', JSON.stringify(g), '| unique paths:', new Set(briefs.map((b) => b.outputPath)).size);
