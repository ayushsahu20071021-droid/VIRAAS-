#!/usr/bin/env node
// final-audit — runs every gate and prints an honest pass/fail summary.
import { execSync } from "node:child_process";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const steps = [
  ["sync-image-status", "node scripts/sync-image-status.mjs", false],
  ["check-catalog", "node scripts/check-catalog.mjs", true],
  ["validate-real-images", "node scripts/validate-real-images.mjs", true],
  ["validate-real-images --strict", "node scripts/validate-real-images.mjs --strict", false],
  ["audit-affiliate", "node scripts/audit-affiliate.mjs", true],
  ["audit-http-images", "node scripts/audit-http-images.mjs", true],
  ["audit-duplicates", "node scripts/audit-duplicates.mjs", true],
  ["typecheck", "npm run -s typecheck", true],
  ["render-smoke", "node scripts/render-smoke.mjs", true],
  ["audit-rendered-browser", "node scripts/audit-rendered-browser.mjs", true]
];

const results = [];
let hardFail = false;
for (const [name, cmd, hard] of steps) {
  let ok = true;
  let out = "";
  try {
    out = execSync(cmd, { cwd: ROOT, stdio: "pipe", encoding: "utf8", timeout: 600000, env: { ...process.env, LD_LIBRARY_PATH: `/tmp/al2023/lib:${process.env.LD_LIBRARY_PATH || ""}` } });
  } catch (e) {
    ok = false;
    out = `${e.stdout || ""}\n${e.stderr || ""}`;
  }
  results.push({ name, ok, hard, tail: out.trim().split("\n").slice(-4).join(" · ") });
  console.log(`${ok ? "✓" : hard ? "✗" : "…"} ${name}`);
  if (!ok && hard) hardFail = true;
}

console.log("\n== final-audit summary ==");
for (const r of results) console.log(`${r.ok ? "PASS" : r.hard ? "FAIL" : "PENDING"}  ${r.name}  ${r.tail ? `(${r.tail})` : ""}`);
console.log(hardFail ? "\nFINAL AUDIT: FAIL (hard gates)" : "\nFINAL AUDIT: core gates PASS — image queue state reported above (strict image gate is separate)");
process.exit(hardFail ? 1 : 0);
