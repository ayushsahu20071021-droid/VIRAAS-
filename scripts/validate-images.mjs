// Validates every image referenced by the site: exists, real raster, non-trivial dimensions/bytes, and QA_PASS by visual inspection.
import fs from 'node:fs'; import path from 'node:path'; import crypto from 'node:crypto';
import sharp from 'sharp';
import { ROOT, readJSON, report } from './lib/common.mjs';
const P = readJSON('src/data/catalog.json'); const C = readJSON('src/data/couples.json'); const QA = readJSON('data-src/image-qa.json');
const refs = [...C.filter((c) => c.imageUrl).map((c) => ['couple:' + c.id, c.imageUrl]), ...P.filter((p) => p.imageUrl).map((p) => ['product:' + p.id, p.imageUrl])];
const problems = [];
for (const [key, url] of refs) {
  const f = path.join(ROOT, 'public', url);
  if (!fs.existsSync(f)) { problems.push(`${key}: missing file`); continue; }
  const buf = fs.readFileSync(f);
  let m; try { m = await sharp(buf).metadata(); } catch { problems.push(`${key}: not a decodable image`); continue; }
  if (m.width < 600 || m.height < 600) problems.push(`${key}: too small ${m.width}x${m.height}`);
  if (buf.length < 30000) problems.push(`${key}: suspiciously tiny ${buf.length} bytes`);
  const st = await sharp(buf).stats(); if (st.channels.slice(0, 3).every((c) => c.stdev < 8)) problems.push(`${key}: near-blank image`);
  if (QA[key]?.qa !== 'QA_PASS') problems.push(`${key}: referenced but not QA_PASS`);
  if (QA[key]?.sha256 && QA[key].sha256 !== crypto.createHash('sha256').update(buf).digest('hex')) problems.push(`${key}: file changed since QA`);
}
const svgPlates = fs.existsSync(path.join(ROOT, 'public/images')) ? fs.readdirSync(path.join(ROOT, 'public/images'), { recursive: true }).filter((f) => /\.svg$/i.test(f)) : [];
const couplePass = C.filter((c) => QA['couple:' + c.id]?.qa === 'QA_PASS').length;
const prodPass = P.filter((p) => QA['product:' + p.id]?.qa === 'QA_PASS').length;
const perWorld = {}; C.forEach((c) => { perWorld[c.world] = (perWorld[c.world] || 0) + (QA['couple:' + c.id]?.qa === 'QA_PASS' ? 1 : 0); });
const ok = report('validate-images', [
  [problems.length === 0, `all ${refs.length} referenced images valid & QA_PASS${problems.length ? ' — ' + problems.slice(0, 10).join('; ') : ''}`],
  [svgPlates.length === 0, 'no SVG plates posing as photography'],
  [true, `couple visuals QA_PASS ${couplePass}/100 per world ${JSON.stringify(perWorld)}`],
  [true, `product visuals QA_PASS ${prodPass}/${P.length}`],
  [couplePass === 100, `COMPLETION GATE: 100/100 couple visuals passed (${couplePass})`, 'gate'],
  [prodPass === P.length, `COMPLETION GATE: all product visuals passed (${prodPass}/${P.length})`, 'gate'],
]);
