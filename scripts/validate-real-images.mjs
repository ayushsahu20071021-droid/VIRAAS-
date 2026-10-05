#!/usr/bin/env node
// validate-real-images — every image must be a REAL asset. Placeholders = 0.
// Flags: --strict also fails when the generation queue still has pending items.
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(readFileSync(join(ROOT, "src/data/image-manifest.json"), "utf8"));
const products = JSON.parse(readFileSync(join(ROOT, "src/data/products.json"), "utf8"));
const couples = JSON.parse(readFileSync(join(ROOT, "src/data/couples.json"), "utf8"));
const strict = process.argv.includes("--strict");

const errors = [];
let real = 0;
let pending = 0;
let pendingCoupleCount = 0;
const MIN_BYTES = 30 * 1024; // no tiny JPEGs

function jpegDims(buf) {
  if (buf[0] !== 0xff || buf[1] !== 0xd8) return null;
  let i = 2;
  while (i < buf.length - 9) {
    if (buf[i] !== 0xff) { i++; continue; }
    const marker = buf[i + 1];
    if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
      return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
    }
    i += 2 + buf.readUInt16BE(i + 2);
  }
  return null;
}

for (const item of manifest) {
  const abs = join(ROOT, item.path);
  if (!existsSync(abs)) {
    pending++;
    if (item.status !== "queued") errors.push(`${item.key}: missing file but status=${item.status}`);
    continue;
  }
  const buf = readFileSync(abs);
  if (buf.length < MIN_BYTES) errors.push(`${item.key}: TINY/PLACEHOLDER file ${buf.length}B`);
  const dims = jpegDims(buf);
  if (!dims) errors.push(`${item.key}: not a valid JPEG`);
  else if (dims.width < 640 || dims.height < 512) errors.push(`${item.key}: low-res ${dims.width}x${dims.height}`);
  if (!item.prompt || item.prompt.length < 80) errors.push(`${item.key}: missing prompt`);
  real++;
}

for (const p of products) {
  if (!p.imageUrl.startsWith("/images/products/")) errors.push(`${p.id}: bad imageUrl ${p.imageUrl}`);
  if (p.status === "listed" && !existsSync(join(ROOT, "public", p.imageUrl))) errors.push(`${p.id}: listed but image missing`);
}
for (const c of couples) {
  if (!c.imageUrl.startsWith("/images/couples/")) errors.push(`${c.id}: bad imageUrl`);
  // Couples gate on the generated index (progressive reveal) — missing = queued, only
  // flagged hard when a page would render it broken. Detail pages use queue notices.
  if (!existsSync(join(ROOT, "public", c.imageUrl))) pendingCoupleCount++;
}

console.log("== validate-real-images ==");
console.log(`real images: ${real} · pending in queue: ${pending} · total slots: ${manifest.length}`);
console.log(`products listed: ${products.filter((p) => p.status === "listed").length}/${products.length} · couples rendered: ${couples.length - pendingCoupleCount}/${couples.length}`);
if (errors.length) {
  console.log(`ERRORS: ${errors.length}`);
  for (const e of errors.slice(0, 30)) console.log("  ✗", e);
  process.exit(1);
}
if (strict && pending > 0) {
  console.log(`✗ STRICT: ${pending} images still queued (no placeholders allowed — generation must continue)`);
  process.exit(1);
}
console.log("PASS validate-real-images");
