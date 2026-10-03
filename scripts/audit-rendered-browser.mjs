// Real headless-browser render audit: no JS errors, no broken <img>, content present, filters non-empty, nav correct.
import { launch, BASE } from './lib/browser.mjs';
import { report } from './lib/common.mjs';
import { ROUTES } from './routes.mjs';
const b = await launch(); const page = await b.newPage({ viewport: { width: 1366, height: 900 } });
const checks = []; let errors = [];
page.on('pageerror', (e) => errors.push(String(e))); page.on('console', (m) => { if (m.type() === 'error' && !/fonts\.g|ERR_|Failed to load resource/.test(m.text())) errors.push(m.text()); });
for (const r of ROUTES) {
  errors = [];
  await page.goto(BASE + r, { waitUntil: 'networkidle' }).catch((e) => errors.push(e.message));
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 1200) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)); } });
  await page.waitForTimeout(250);
  const info = await page.evaluate(() => {
    const imgs = [...document.querySelectorAll('img')];
    return { broken: imgs.filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.src), real: document.querySelectorAll('[data-real-image]').length, pending: document.querySelectorAll('[data-pending-image]').length,
      h1: document.querySelector('h1,h2')?.textContent || '', text: document.body.innerText, emptyFacets: [...document.querySelectorAll('.facet')].filter((f) => f.querySelectorAll('.chip').length < 2).length, nan: /NaN|undefined|₹null/.test(document.querySelector('main')?.innerText || '') };
  });
  const ok = errors.length === 0 && info.broken.length === 0 && info.h1.length > 0 && info.emptyFacets === 0 && !info.nan;
  checks.push([ok, `${r} — real imgs ${info.real}, pending ${info.pending}${errors.length ? ' errors: ' + errors.slice(0, 2).join(' | ') : ''}${info.broken.length ? ' broken: ' + info.broken.length : ''}${info.emptyFacets ? ' empty facets: ' + info.emptyFacets : ''}${info.nan ? ' NaN/undefined text' : ''}`]);
}
await page.goto(BASE + '/', { waitUntil: 'networkidle' });
const nav = await page.$$eval('nav.nav > .nav-item > a', (a) => a.map((x) => x.textContent.trim()));
checks.push([JSON.stringify(nav) === JSON.stringify(['Women', 'Men', 'Occasions', 'Couple Edit', 'Trending', 'Accessories', 'Journal']), `main nav: ${nav.join(' · ')}`]);
const worlds = await page.$$eval('.worlds .world-label strong', (a) => a.map((x) => x.textContent));
checks.push([worlds.length === 5, `homepage shows exactly 5 worlds: ${worlds.join(', ')}`]);
const heroText = await page.textContent('.hero');
checks.push([/THE FESTIVE EDIT ’26/.test(heroText) && /Shop Women/i.test(heroText) && /Shop Men/i.test(heroText) && /Try an outfit on you/i.test(heroText), 'hero copy + 3 CTAs']);
await page.goto(BASE + '/couple-edit', { waitUntil: 'networkidle' });
checks.push([(await page.$$('.ccard')).length === 100, `couple edit renders ${(await page.$$('.ccard')).length} looks`]);
await b.close();
report('audit-rendered-browser', checks);
