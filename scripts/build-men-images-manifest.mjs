// Wire ONLY QA-passed final Men images into the catalog UI.
// Reads QA status from data-src/image-qa.json (men:<id> -> qaStatus) and includes
// a look only when its PNG exists AND its qaStatus === 'QA_PASS'.
import fs from 'node:fs';
import path from 'node:path';
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const dir = path.join(ROOT, 'public/images/men-previews');
const qa = JSON.parse(fs.readFileSync(path.join(ROOT, 'data-src/image-qa.json'), 'utf8'));
const out = {};
if (fs.existsSync(dir)) {
  for (const f of fs.readdirSync(dir).sort()) {
    const m = f.match(/^(men-look-\d{3})\.png$/);
    if (!m) continue;
    const id = m[1];
    if (qa[`men:${id}`]?.qaStatus === 'QA_PASS') out[id] = `/images/men-previews/${f}`;
  }
}
fs.writeFileSync(path.join(ROOT, 'src/data/men-final-images.json'), JSON.stringify(out, null, 2) + '\n');
console.log(`Manifest: ${Object.keys(out).length} QA-passed Men images wired.`);
