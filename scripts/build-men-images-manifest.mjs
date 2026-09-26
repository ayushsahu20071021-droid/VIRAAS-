// Scans public/images/men-previews for final Men images and writes a manifest
// mapping look id -> public URL. Only looks with a real PNG get an entry, so the
// UI shows a live image where one exists and the reserved placeholder otherwise.
import fs from 'node:fs';
import path from 'node:path';
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const dir = path.join(ROOT, 'public/images/men-previews');
const out = {};
if (fs.existsSync(dir)) {
  for (const f of fs.readdirSync(dir).sort()) {
    const m = f.match(/^(men-look-\d{3})\.png$/);
    if (m) out[m[1]] = `/images/men-previews/${f}`;
  }
}
fs.writeFileSync(path.join(ROOT, 'src/data/men-final-images.json'), JSON.stringify(out, null, 2) + '\n');
console.log(`Manifest: ${Object.keys(out).length} final Men images.`);
