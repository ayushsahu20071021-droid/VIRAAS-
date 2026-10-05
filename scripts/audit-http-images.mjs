#!/usr/bin/env node
// audit-http-images — no remote/hotlinked images. All visuals are local originals.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const errors = [];
const products = JSON.parse(readFileSync(join(ROOT, "src/data/products.json"), "utf8"));
const couples = JSON.parse(readFileSync(join(ROOT, "src/data/couples.json"), "utf8"));

for (const p of products) {
  for (const field of ["imageUrl", "generatedImageUrl"]) {
    const v = p[field];
    if (v && /^(https?:)?\/\//i.test(v)) errors.push(`${p.id}: remote ${field}`);
  }
  for (const g of p.gallery) if (/^(https?:)?\/\//i.test(g)) errors.push(`${p.id}: remote gallery entry`);
}
for (const c of couples) if (/^(https?:)?\/\//i.test(c.imageUrl)) errors.push(`${c.id}: remote imageUrl`);

function walk(dir, cb) {
  for (const f of readdirSync(dir)) {
    const pth = join(dir, f);
    const st = statSync(pth);
    if (st.isDirectory()) {
      if (!["node_modules", ".next", ".git"].includes(f)) walk(pth, cb);
    } else cb(pth);
  }
}
walk(join(ROOT, "src"), (f) => {
  if (!/\.(ts|tsx)$/.test(f)) return;
  const txt = readFileSync(f, "utf8");
  const re = /(?:src|imageUrl|image)\s*[:=]\s*["'`](https?:)?\/\/[^"'`]+["'`]/g;
  let m;
  while ((m = re.exec(txt))) {
    if (!m[0].includes("schema.org")) errors.push(`${f}: remote image ref ${m[0].slice(0, 80)}`);
  }
  if (/<img[^>]+src=["']https?:\/\//i.test(txt)) errors.push(`${f}: <img> with remote src`);
});

console.log("== audit-http-images ==");
console.log("all product/couple/hero imagery referenced via local /images/ paths only");
if (errors.length) {
  console.log(`ERRORS: ${errors.length}`);
  for (const e of errors.slice(0, 30)) console.log("  ✗", e);
  process.exit(1);
}
console.log("PASS audit-http-images");
