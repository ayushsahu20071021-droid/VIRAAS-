#!/usr/bin/env node
// audit-duplicates — exact-hash duplicate detection across all generated assets.
import { readFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(readFileSync(join(ROOT, "src/data/image-manifest.json"), "utf8"));

const byHash = new Map();
const bySize = new Map();
let scanned = 0;
const errors = [];
const warnings = [];

for (const item of manifest) {
  const abs = join(ROOT, item.path);
  if (!existsSync(abs)) continue;
  const buf = readFileSync(abs);
  const hash = createHash("sha256").update(buf).digest("hex");
  if (byHash.has(hash)) errors.push(`EXACT DUPLICATE: ${item.key} == ${byHash.get(hash)}`);
  byHash.set(hash, item.key);
  const sizeKey = String(buf.length);
  if (bySize.has(sizeKey)) warnings.push(`same byte-size (${sizeKey}): ${item.key} ~ ${bySize.get(sizeKey)} — visual check advised`);
  bySize.set(sizeKey, item.key);
  scanned++;
}

console.log("== audit-duplicates ==");
console.log(`scanned ${scanned} generated images · exact-hash duplicates: ${errors.length} · same-size warnings: ${warnings.length}`);
for (const w of warnings.slice(0, 6)) console.log("  warn:", w);
if (errors.length) {
  for (const e of errors.slice(0, 20)) console.log("  ✗", e);
  process.exit(1);
}
console.log("PASS audit-duplicates");
