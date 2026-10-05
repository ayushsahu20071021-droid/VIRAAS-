#!/usr/bin/env node
// audit-rendered-browser — real headless Chromium audit of ACTUAL rendered pages.
// Checks: console errors, broken images, horizontal overflow at 320–1440px,
// key content, gender-token search correctness. Saves screenshots per route/width.
process.env.LD_LIBRARY_PATH = `/tmp/al2023/lib:${process.env.LD_LIBRARY_PATH || ""}`;

import { spawn } from "node:child_process";
import { mkdirSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import chromiumPkg from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

const chromium = chromiumPkg.default || chromiumPkg;
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PORT = 4319;
const BASE = `http://127.0.0.1:${PORT}`;
const OUT = join(ROOT, "artifacts", "qa");
mkdirSync(OUT, { recursive: true });

const manifest = JSON.parse(readFileSync(join(ROOT, "src/data/image-manifest.json"), "utf8"));
const queuedPaths = new Set(manifest.filter((m) => m.status === "queued").map((m) => m.publicPath));
const products = JSON.parse(readFileSync(join(ROOT, "src/data/products.json"), "utf8"));
const firstListed = products.find((p) => p.status === "listed") || products[0];
const firstTryOn = products.find((p) => p.tryOnEnabled);

const ROUTES = [
  ["home", "/", ["VIRAAS", "DRESS FOR THE MOMENT", "FOR HER", "FOR HIM", "SEE IT ON YOU", "TRENDING", "COUPLE EDIT", "ACCESSORIES", "BUDGET COLLECTIONS", "COMPLETE THE LOOK", "JOURNAL"]],
  ["women", "/women", ["WOMEN", "Chaniya Choli"]],
  ["men", "/men", ["MEN", "Modern Ethnic Shirts"]],
  ["garba", "/occasions/garba", ["GARBA"]],
  ["college-fest", "/occasions/college-fest", ["COLLEGE FEST"]],
  ["diwali", "/occasions/diwali", ["DIWALI"]],
  ["festive-party", "/occasions/festive-party", ["FESTIVE PARTY"]],
  ["traditional", "/occasions/traditional", ["TRADITIONAL"]],
  ["couple-edit", "/couple-edit", ["COUPLE EDIT", "MATCHED, NOT MATCHING", "20 looks"]],
  ["couple-detail", "/couple-edit/CL-G-01", ["Shop the look", "Colour story"]],
  ["product", `/product/${firstListed.id}`, ["Why we picked it", "Shop this outfit", "Complete the look"]],
  ["search", "/search?q=garba%20women", ["RESULTS"]],
  ["filters", "/women?colour=Black", ["WOMEN", "Filters"]],
  ["try-on", firstTryOn ? `/try-on/${firstTryOn.id}` : "/try-on", ["18", "Generate|Upload|Try-on|TRY"]],
  ["saved", "/saved", ["SAVED LOOKS"]]
];

const WIDTHS = [320, 375, 390, 430, 768, 1024, 1440];

async function waitPort(port, tries = 90) {
  for (let i = 0; i < tries; i++) {
    try { const r = await fetch(`http://127.0.0.1:${port}/`); if (r.ok) return true; } catch { /* wait */ }
    await new Promise((r) => setTimeout(r, 1000));
  }
  return false;
}

const server = spawn("npx", ["next", "start", "-p", String(PORT)], { cwd: ROOT, stdio: "ignore", detached: true });
const errors = [];
const pendingImageRefs = new Set();
let checks = 0;

try {
  if (!(await waitPort(PORT))) throw new Error("server did not start");
  const execPath = await chromium.executablePath();
  const browser = await puppeteer.launch({
    executablePath: execPath,
    args: [...chromium.args, "--no-sandbox", "--disable-dev-shm-usage"],
    headless: true
  });

  for (const [name, route, needles] of ROUTES) {
    for (const width of WIDTHS) {
      const page = await browser.newPage();
      const consoleErrors = [];
      page.on("console", (msg) => { if (msg.type() === "error") consoleErrors.push(msg.text()); });
      page.on("pageerror", (e) => consoleErrors.push(String(e)));
      await page.setViewport({ width, height: 900 });
      const res = await page.goto(BASE + route, { waitUntil: "networkidle2", timeout: 45000 });
      checks++;
      if (!res || (res.status() !== 200 && res.status() !== 304)) errors.push(`${name}@${width}: status ${res && res.status()}`);

      const audit = await page.evaluate(() => {
        const imgs = [...document.querySelectorAll("img")];
        const broken = imgs.filter((i) => i.complete && i.naturalWidth === 0 && i.currentSrc).map((i) => i.getAttribute("src") || i.currentSrc);
        const overflow = document.documentElement.scrollWidth - document.documentElement.clientWidth;
        const text = document.body.innerText;
        return { broken, overflow, textLen: text.length, text };
      });

      // Queue-aware classification: manifest-queued assets are PENDING (reported),
      // anything else broken is a hard structural failure.
      const pendingImgs = [];
      for (const src of audit.broken) {
        const path = src.startsWith("http") ? new URL(src).pathname : src;
        if (queuedPaths.has(path)) pendingImgs.push(path);
        else errors.push(`${name}@${width}: broken image ${src}`);
      }
      if (pendingImgs.length) pendingImageRefs.add(pendingImgs[0]);
      if (audit.overflow > 2) errors.push(`${name}@${width}: horizontal overflow ${audit.overflow}px`);
      if (audit.textLen < 200) errors.push(`${name}@${width}: suspiciously empty page`);
      for (const needle of needles) {
        const alts = needle.toLowerCase().split("|");
        const hay = audit.text.toLowerCase();
        if (!alts.some((a) => hay.includes(a))) errors.push(`${name}@${width}: missing content "${needle}"`);
      }
      const realConsole = consoleErrors.filter((e) => !/favicon|Failed to load resource: net::ERR_BLOCKED|404 \(Not Found\)/i.test(e));
      if (realConsole.length) errors.push(`${name}@${width}: console ${realConsole[0].slice(0, 120)}`);

      if (width === 375 || width === 1440) {
        await page.screenshot({ path: join(OUT, `${name}-${width}.png`), fullPage: false });
      }
      await page.close();
    }
  }

  // gender token search: "women" must never match men products
  const page = await browser.newPage();
  await page.goto(`${BASE}/search?q=women`, { waitUntil: "networkidle2" });
  const html = await page.content();
  if (/\/product\/VRS-M-/.test(html)) errors.push('search "women": men products leaked into results');
  await page.goto(`${BASE}/search?q=men`, { waitUntil: "networkidle2" });
  const htmlMen = await page.content();
  if (/\/product\/VRS-W-/.test(htmlMen)) errors.push('search "men": women products leaked into results');
  await page.goto(`${BASE}/search?q=couple%20garba`, { waitUntil: "networkidle2" });
  const htmlCouple = await page.content();
  if (!htmlCouple.includes("CL-G-")) errors.push('search "couple garba": no couple results');
  await page.close();

  await browser.close();
} catch (e) {
  errors.push(`fatal: ${e.message}`);
} finally {
  try { process.kill(-server.pid); } catch { try { server.kill(); } catch { /* gone */ } }
}

console.log("== audit-rendered-browser ==");
console.log(`rendered ${checks} page/viewport combos · widths ${WIDTHS.join(",")} · screenshots in artifacts/qa/`);
console.log(`pending queue images referenced on pages: ${pendingImageRefs.size} (generation continues per manifest priority)`);
if (errors.length) {
  console.log(`ERRORS: ${errors.length}`);
  for (const e of errors.slice(0, 40)) console.log("  ✗", e);
  process.exit(1);
}
console.log("PASS audit-rendered-browser");
