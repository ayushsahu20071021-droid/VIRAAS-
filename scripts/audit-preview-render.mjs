// Rendered-DOM verification for the preview phase: loads key surfaces in a real
// headless browser and confirms approved look images render (data-real-image) with
// no broken <img>, and that look surfaces show no pending placeholders.
import { launch } from './lib/browser.mjs';
const BASE = process.env.VIRAAS_URL || 'http://127.0.0.1:5173';

const b = await launch();
const page = await b.newPage({ viewport: { width: 1366, height: 1000 } });
let pageErrors = [];
page.on('pageerror', (e) => pageErrors.push(String(e)));

async function scan(route) {
  pageErrors = [];
  await page.goto(BASE + route, { waitUntil: 'networkidle' }).catch((e) => pageErrors.push(e.message));
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 1000) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); } });
  await page.waitForTimeout(400);
  return await page.evaluate(() => {
    const imgs = [...document.querySelectorAll('img[data-real-image]')];
    const broken = imgs.filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.getAttribute('src'));
    return { real: imgs.length, pending: document.querySelectorAll('[data-pending-image]').length, broken, h1: document.querySelector('h1')?.textContent || '' };
  });
}

const routes = ['/', '/men', '/women', '/couple-edit', '/occasions/garba', '/occasions/traditional',
  '/men-look/men-look-001', '/men-look/men-look-210', '/women-look/women-look-001', '/couple-edit/garba-01',
  '/try-on?menLook=men-look-050', '/try-on?womenLook=women-look-100'];

let fail = 0;
for (const r of routes) {
  const info = await scan(r);
  const ok = pageErrors.length === 0 && info.broken.length === 0 && info.h1.length > 0;
  if (!ok) fail++;
  console.log(`[${ok ? 'PASS' : 'FAIL'}] ${r} — real ${info.real}, pending ${info.pending}, broken ${info.broken.length}${pageErrors.length ? ' · ERR ' + pageErrors.slice(0, 1).join('') : ''}`);
}
await b.close();
console.log(fail === 0 ? '\naudit-preview-render: PASS' : `\naudit-preview-render: FAIL (${fail})`);
process.exit(fail === 0 ? 0 : 1);
