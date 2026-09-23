#!/usr/bin/env node
// Syncs image status into the catalog + manifest:
// - marks manifest entries generated/qa_passed where files exist (records sha256 + bytes)
// - flips product.status: awaiting_image → listed when its image exists
// - sets generatedImageUrl when present
// Never fakes completion: missing files stay 'queued' / 'awaiting_image'.

import { readFileSync, writeFileSync, existsSync, statSync } from "node:fs";
import { createHash } from "node:crypto";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(readFileSync(join(ROOT, "src/data/image-manifest.json"), "utf8"));
const products = JSON.parse(readFileSync(join(ROOT, "src/data/products.json"), "utf8"));

let generated = 0;
for (const item of manifest) {
  const abs = join(ROOT, item.path);
  if (existsSync(abs)) {
    const buf = readFileSync(abs);
    item.bytes = buf.length;
    item.hash = createHash("sha256").update(buf).digest("hex");
    if (item.status === "queued") item.status = "generated";
    generated++;
      } else {
        item.status = "queued";
        item.hash = null;
        item.bytes = null;
      }
  }

const imageExists = new Map();
for (const item of manifest) {
  if (item.hash) imageExists.set(item.refId, item.publicPath);
}
for (const p of products) {
  const found = imageExists.get(p.id);
  if (found) {
    p.status = "listed";
    p.generatedImageUrl = found;
  } else {
    p.status = "awaiting_image";
    p.generatedImageUrl = "";
  }
}

writeFileSync(join(ROOT, "src/data/image-manifest.json"), JSON.stringify(manifest, null, 2));
writeFileSync(join(ROOT, "src/data/products.json"), JSON.stringify(products));

// Tiny generated-assets index for the site layer (progressive reveal — never broken images).
const generatedIndex = {};
for (const item of manifest) {
  if (item.hash) generatedIndex[`${item.kind}:${item.refId}`] = item.publicPath;
}
writeFileSync(join(ROOT, "src/data/generated-images.json"), JSON.stringify(generatedIndex));

const queued = manifest.filter((m) => m.status === "queued");
console.log(`images: ${generated}/${manifest.length} generated`);
console.log(`index entries: ${Object.keys(generatedIndex).length}`);
console.log(`products listed: ${products.filter((p) => p.status === "listed").length}/${products.length}`);
console.log(`next in queue: ${queued.slice(0, 5).map((q) => q.key).join(", ") || "none"}`);
