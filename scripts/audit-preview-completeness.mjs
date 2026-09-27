// VIRAAS — Final Visual Preview + Image Completeness audit.
// Verifies the 546 APPROVED look images (Men 210 + Women 236 + Couples 100) exist,
// are wired, are unique, and that product-catalog image mappings are reported honestly.
// Read-only: makes NO changes to data or images.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const rd = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));
const exists = (rel) => fs.existsSync(path.join(ROOT, 'public', rel.replace(/^\//, '')));
const pngOK = (rel) => { try { const b = fs.readFileSync(path.join(ROOT, 'public', rel.replace(/^\//, ''))); return b[0] === 0x89 && b[1] === 0x50; } catch { return false; } };
const sha = (rel) => crypto.createHash('sha256').update(fs.readFileSync(path.join(ROOT, 'public', rel.replace(/^\//, '')))).digest('hex');

let fail = 0;
const line = (ok, msg) => { if (!ok) fail++; console.log(`[${ok ? 'PASS' : 'FAIL'}] ${msg}`); };

// ---- MEN 210 ----
const menLooks = rd('src/data/men-look-catalog.client.json');
const menImages = rd('src/data/men-final-images.json');
let menAvail = 0, menMissing = [], menDup = new Map();
for (const l of menLooks) {
  const src = menImages[l.id];
  if (!src || !exists(src) || !pngOK(src)) { menMissing.push(l.id); continue; }
  menAvail++;
  const h = sha(src); menDup.set(h, (menDup.get(h) || 0) + 1);
}
const menDupCount = [...menDup.values()].filter((n) => n > 1).length;
line(menLooks.length === 210, `MEN expected 210 (got ${menLooks.length})`);
line(menAvail === 210, `MEN available/displayed ${menAvail}/210 (missing ${menMissing.length})`);
line(menDupCount === 0, `MEN duplicate image content = ${menDupCount}`);

// ---- WOMEN 236 ----
const womenLooks = rd('src/data/women-look-catalog.client.json');
const womenPrev = rd('src/data/women-previews.client.json');
let womenAvail = 0, womenMissing = [], womenDup = new Map();
for (const l of womenLooks) {
  const st = womenPrev[l.id];
  const src = st && st.live && st.src ? st.src : null;
  if (!src || !exists(src) || !pngOK(src)) { womenMissing.push(l.id); continue; }
  womenAvail++;
  const h = sha(src); womenDup.set(h, (womenDup.get(h) || 0) + 1);
}
const womenDupCount = [...womenDup.values()].filter((n) => n > 1).length;
line(womenLooks.length === 236, `WOMEN expected 236 (got ${womenLooks.length})`);
line(womenAvail === 236, `WOMEN available/displayed ${womenAvail}/236 (missing ${womenMissing.length})`);
line(womenDupCount === 0, `WOMEN duplicate image content = ${womenDupCount}`);

// ---- COUPLES 100 ----
const couples = rd('src/data/couples.client.json');
let coupleAvail = 0, coupleMissing = [], coupleDup = new Map();
for (const c of couples) {
  const rel = c.imageStatus === 'GENERATED' ? `/images/couples/${c.id}.webp` : c.imageUrl;
  if (!rel || !exists(rel)) { coupleMissing.push(c.id); continue; }
  coupleAvail++;
  const h = sha(rel); coupleDup.set(h, (coupleDup.get(h) || 0) + 1);
}
const coupleDupCount = [...coupleDup.values()].filter((n) => n > 1).length;
line(couples.length === 100, `COUPLES expected 100 (got ${couples.length})`);
line(coupleAvail === 100, `COUPLES available/displayed ${coupleAvail}/100 (missing ${coupleMissing.length})`);
line(coupleDupCount === 0, `COUPLES duplicate image content = ${coupleDupCount}`);

// ---- TOTAL ----
line(menAvail + womenAvail + coupleAvail === 546, `TOTAL approved look images displayed ${menAvail + womenAvail + coupleAvail}/546`);

// ---- PRODUCTS ----
const products = rd('src/data/catalog.client.json');
let prodValid = 0, prodBroken = [], prodNone = 0;
for (const p of products) {
  const src = p.imageUrl && p.imageUrl.trim() ? p.imageUrl : (p.gallery && p.gallery[0]) || '';
  if (!src) { prodNone++; continue; }
  if (exists(src)) prodValid++; else prodBroken.push(p.id);
}
console.log(`\n[PRODUCTS] total ${products.length} · valid images ${prodValid} · no image asset ${prodNone} · broken paths ${prodBroken.length}`);
line(prodBroken.length === 0, `PRODUCTS broken image paths = ${prodBroken.length}`);

// ---- SUMMARY ----
console.log('\n================ SUMMARY ================');
console.log(`MEN     : 210 expected · ${menAvail} available · ${menAvail} displayed · missing ${menMissing.length}`);
console.log(`WOMEN   : 236 expected · ${womenAvail} available · ${womenAvail} displayed · missing ${womenMissing.length}`);
console.log(`COUPLES : 100 expected · ${coupleAvail} available · ${coupleAvail} displayed · missing ${coupleMissing.length}`);
console.log(`PRODUCTS: ${products.length} total · ${prodValid} valid images · ${prodNone} no asset · ${prodBroken.length} broken`);
console.log(`BROKEN IMAGE PATHS (look assets): 0 expected`);
if (menMissing.length) console.log('MEN missing:', menMissing.join(', '));
if (womenMissing.length) console.log('WOMEN missing:', womenMissing.join(', '));
if (coupleMissing.length) console.log('COUPLES missing:', coupleMissing.join(', '));
console.log('========================================');
console.log(fail === 0 ? '\naudit-preview-completeness: PASS' : `\naudit-preview-completeness: FAIL (${fail})`);
process.exit(fail === 0 ? 0 : 1);
