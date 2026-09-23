#!/usr/bin/env node
// render-smoke — boots the production server and smoke-tests every real route class.
import { spawn, execSync } from "node:child_process";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PORT = 4317;
const BASE = `http://127.0.0.1:${PORT}`;

const ROUTES = [
  ["/", "VIRAAS"],
  ["/", "DRESS FOR THE MOMENT"],
  ["/", "COUPLE EDIT"],
  ["/", "SEE IT ON YOU"],
  ["/women", "WOMEN"],
  ["/men", "MEN"],
  ["/women/chaniya-choli", "CHANIYA CHOLI"],
  ["/men/modern-ethnic-shirts", "MODERN ETHNIC SHIRTS"],
  ["/occasions/garba", "Garba"],
  ["/occasions/college-fest", "College Fest"],
  ["/occasions/diwali", "Diwali"],
  ["/occasions/festive-party", "Festive Party"],
  ["/occasions/traditional", "Traditional"],
  ["/couple-edit", "MATCHED, NOT MATCHING"],
  ["/couple-edit/CL-G-01", "Shop the look"],
  ["/trending", "TRENDING"],
  ["/accessories", "ACCESSORIES"],
  ["/journal", "JOURNAL"],
  ["/journal/garba-night-dress-code", "Garba"],
  ["/search?q=garba%20women", "RESULTS"],
  ["/saved", "SAVED LOOKS"],
  ["/try-on", "TRY AN OUTFIT ON YOU"],
  ["/sitemap.xml", "occasions/garba"],
  ["/robots.txt", "Sitemap"]
];

async function waitPort(port, tries = 60) {
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/`);
      if (res.ok) return true;
    } catch { /* not up yet */ }
    await new Promise((r) => setTimeout(r, 1000));
  }
  return false;
}

const server = spawn("npx", ["next", "start", "-p", String(PORT)], { cwd: ROOT, stdio: "ignore", detached: true });
let failed = 0;
try {
  const up = await waitPort(PORT);
  if (!up) throw new Error("server did not start");

  for (const [route, needle] of ROUTES) {
    const res = await fetch(BASE + route);
    const html = await res.text();
    const ok = res.status === 200 && html.includes(needle);
    if (!ok) {
      failed++;
      console.log(`  ✗ ${route} (status ${res.status}, missing "${needle}")`);
    } else {
      console.log(`  ✓ ${route}`);
    }
  }

  // ghost occasion routes must NOT exist
  for (const ghost of ["/occasions/wedding", "/occasions/sangeet", "/occasions/haldi", "/occasions/engagement"]) {
    const res = await fetch(BASE + ghost);
    if (res.status === 200) {
      failed++;
      console.log(`  ✗ ghost occasion route exists: ${ghost}`);
    } else {
      console.log(`  ✓ ghost route blocked: ${ghost}`);
    }
  }
} catch (e) {
  failed++;
  console.log("  ✗ server error:", e.message);
} finally {
  try { process.kill(-server.pid); } catch { try { server.kill(); } catch { /* gone */ } }
}

console.log("== render-smoke ==");
if (failed) {
  console.log(`FAIL render-smoke (${failed} problems)`);
  process.exit(1);
}
console.log("PASS render-smoke");
