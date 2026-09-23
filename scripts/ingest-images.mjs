// Converts raw generated images (.raw/<type>/<id>.png) into optimised webp assets under public/images,
// records dimensions + sha256 in data-src/image-qa.json. Does NOT change QA verdicts — QA is recorded
// only after visual inspection. New files without a QA entry are recorded as GENERATED (not passed).
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import sharp from 'sharp';
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const qaPath = path.join(ROOT, 'data-src/image-qa.json');
const QA = JSON.parse(fs.readFileSync(qaPath, 'utf8'));
let n = 0;
for (const [dir, kind] of [['couples', 'couple'], ['products', 'product'], ['editorial', 'editorial']]) {
  const src = path.join(ROOT, '.raw', dir);
  if (!fs.existsSync(src)) continue;
  const dst = path.join(ROOT, 'public/images', dir);
  fs.mkdirSync(dst, { recursive: true });
  for (const f of fs.readdirSync(src).filter((f) => /\.(png|jpe?g|webp)$/i.test(f))) {
    const id = f.replace(/\.(png|jpe?g|webp)$/i, '');
    const outFile = path.join(dst, id + '.webp');
    if (!fs.existsSync(outFile) || fs.statSync(outFile).mtimeMs < fs.statSync(path.join(src, f)).mtimeMs) {
      await sharp(path.join(src, f)).resize({ width: 900, withoutEnlargement: true }).webp({ quality: 82 }).toFile(outFile);
    }
    const buf = fs.readFileSync(outFile);
    const meta = await sharp(buf).metadata();
    const key = `${kind}:${id}`;
    QA[key] = { generation: 'GENERATED', qa: 'GENERATED', ...(QA[key] || {}), dimensions: `${meta.width}x${meta.height}`, bytes: buf.length, sha256: crypto.createHash('sha256').update(buf).digest('hex') };
    n++;
  }
}
fs.writeFileSync(qaPath, JSON.stringify(QA, null, 2));
console.log(`ingested ${n} images`);
