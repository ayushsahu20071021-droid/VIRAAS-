// Hard gate: no repeated primary image (exact sha256 AND perceptual dHash near-duplicates), independent of filenames.
import fs from 'node:fs'; import path from 'node:path'; import crypto from 'node:crypto';
import sharp from 'sharp';
import { ROOT, readJSON, report } from './lib/common.mjs';
const P = readJSON('src/data/catalog.json'); const C = readJSON('src/data/couples.json');
const prim = [...C.map((c) => c.imageUrl), ...P.map((p) => p.imageUrl)].filter(Boolean);
const urlDup = prim.length - new Set(prim).size;
const dir = path.join(ROOT, 'public/images');
const files = fs.existsSync(dir) ? fs.readdirSync(dir, { recursive: true }).filter((f) => /\.(webp|png|jpe?g)$/i.test(f)).map((f) => path.join(dir, f)) : [];
async function dhash(f) { const { data } = await sharp(f).grayscale().resize(9, 8, { fit: 'fill' }).raw().toBuffer({ resolveWithObject: true }); let h = 0n; for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) h = (h << 1n) | (data[y * 9 + x] > data[y * 9 + x + 1] ? 1n : 0n); return h; }
const ham = (a, b) => { let x = a ^ b, n = 0; while (x) { n += Number(x & 1n); x >>= 1n; } return n; };
const sha = new Map(); const shaDup = []; const hashes = [];
for (const f of files) { const h = crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex'); if (sha.has(h)) shaDup.push([sha.get(h), f]); else sha.set(h, f); hashes.push([f, await dhash(f)]); }
const near = []; for (let i = 0; i < hashes.length; i++) for (let j = i + 1; j < hashes.length; j++) if (ham(hashes[i][1], hashes[j][1]) <= 4) near.push([path.basename(hashes[i][0]), path.basename(hashes[j][0]), ham(hashes[i][1], hashes[j][1])]);
report('audit-duplicates', [
  [urlDup === 0, `no primary image URL reused across entities (${urlDup})`],
  [shaDup.length === 0, `no identical sha256 image files among ${files.length} (${shaDup.length})`],
  [near.length === 0, `no perceptual near-duplicates (dHash ≤4) ${near.length ? JSON.stringify(near) : ''}`],
]);
