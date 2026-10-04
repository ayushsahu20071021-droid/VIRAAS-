// Real headless-browser render audit: no JS errors, no broken <img>, content present, filters non-empty, nav correct.
import { launch, BASE } from './lib/browser.mjs';
import { report } from './lib/common.mjs';
import { ROUTES } from './routes.mjs';
const b = await launch(); const page = await b.newPage({ viewport: { width: 1366, height: 900 } });
const checks = []; let errors = [];
const readinessResponse = await fetch(`${BASE}/api/try-on/status`).catch(() => null);
const readiness = readinessResponse?.ok ? await readinessResponse.json() : null;
const tryOnAvailable = readiness?.generationAvailable === true;
checks.push([Boolean(readiness), 'Try-On readiness endpoint is available to the rendered app']);
const socialResponse = await fetch(`${BASE}/api/social/status`).catch(() => null);
const socialStatus = socialResponse?.ok ? await socialResponse.json() : null;
checks.push([socialStatus?.available === false && socialStatus?.persistent === false, 'Connect reports unavailable until persistent accounts and sign-in are configured']);
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
checks.push([JSON.stringify(nav) === JSON.stringify(['Women', 'Men', 'Occasions', 'Couple Edit', 'Trending', 'Accessories', 'Connect', 'Journal']), `main nav: ${nav.join(' · ')}`]);
const worlds = await page.$$eval('.worlds .world-label strong', (a) => a.map((x) => x.textContent));
checks.push([worlds.length === 5, `homepage shows exactly 5 worlds: ${worlds.join(', ')}`]);
const heroText = await page.textContent('.hero');
const heroHasTryOn = /Try an outfit on you/i.test(heroText);
checks.push([/THE FESTIVE EDIT ’26/.test(heroText) && /Shop Women/i.test(heroText) && /Shop Men/i.test(heroText) && heroHasTryOn === tryOnAvailable, `hero preserves supported CTAs (Try-On available: ${tryOnAvailable})`]);
await page.goto(BASE + '/couple-edit', { waitUntil: 'networkidle' });
checks.push([(await page.$$('.ccard')).length === 100, `couple edit renders ${(await page.$$('.ccard')).length} looks`]);
await page.goto(BASE + '/women/garba', { waitUntil: 'networkidle' });
checks.push([(await page.$$('[data-women-look-id]')).length === 68, 'Women Garba listing retains all 68 numbered looks']);
await page.goto(BASE + '/women/college-fest', { waitUntil: 'networkidle' });
checks.push([(await page.$$('[data-women-look-id]')).length === 42, 'Women College Fest listing retains all 42 numbered looks']);
await page.goto(BASE + '/women/diwali', { waitUntil: 'networkidle' });
checks.push([(await page.$$('[data-women-look-id]')).length === 42, 'Women Diwali listing remains available with 42 existing looks']);

const workbookLookCases = [
  { path: '/women-look/women-look-001', expected: ['https://www.wishlink.com/share/644x25', 'https://www.wishlink.com/share/nxuxu4', 'https://www.wishlink.com/share/6jfykw'] },
  { path: '/women-look/women-look-014', expected: ['https://www.wishlink.com/share/64wdgc', 'https://www.wishlink.com/share/nujaju', 'https://www.wishlink.com/share/6248cj'] },
  { path: '/women-look/women-look-075', expected: ['https://www.wishlink.com/share/64her7', 'https://www.wishlink.com/share/nuvefv', 'https://www.wishlink.com/share/62pbq5'] },
];
for (const test of workbookLookCases) {
  await page.goto(BASE + test.path, { waitUntil: 'networkidle' });
  const shops = await page.$$eval('.workbook-item a.btn-shop', (els) => els.map((el) => el.href));
  const wholeLookTryOn = await page.$eval(`a[href="/try-on?womenLook=${test.path.split('/').pop()}"]`, (el) => Boolean(el)).catch(() => false);
  checks.push([JSON.stringify(shops) === JSON.stringify(test.expected), `${test.path} renders ${shops.length} exact component Shop links`]);
  checks.push([wholeLookTryOn === tryOnAvailable, `${test.path} shows whole-look Try-On only when the server reports generation ready`]);
}
await page.goto(BASE + '/accessories', { waitUntil: 'networkidle' });
const accessory = await page.$eval('[data-accessory-source="college-fest:7"]', (el) => ({
  shop: el.querySelector('a.btn-shop')?.getAttribute('href'),
  itemTryOn: Boolean(el.querySelector('a[href*="try-on"]')),
})).catch(() => null);
checks.push([accessory?.shop === 'https://www.wishlink.com/share/nuvefv' && accessory.itemTryOn === false, 'Accessories exposes the mapped waist-chain Shop link without unsupported item Try-On']);

await page.goto(BASE + '/connect', { waitUntil: 'networkidle' });
const connectText = await page.locator('main').innerText();
checks.push([/temporarily unavailable until secure sign-in and persistent account storage are ready/i.test(connectText), 'Connect clearly refuses account creation while unavailable']);
checks.push([await page.locator('main form').count() === 0, 'unavailable Connect presents no account-creation form']);
await page.goto(BASE + '/chat', { waitUntil: 'networkidle' });
const chatText = await page.locator('main').innerText();
checks.push([/temporarily unavailable until secure sign-in and persistent account storage are ready/i.test(chatText), 'Chat is unavailable rather than suggesting messages can be sent']);
checks.push([await page.locator('main form').count() === 0, 'unavailable Chat presents no message composer']);

await page.goto(BASE + '/try-on?womenLook=women-look-001', { waitUntil: 'networkidle' });
const ageButton = page.getByRole('button', { name: 'I’m 18 or older' });
const ageGateVisible = await ageButton.isVisible().catch(() => false);
if (ageGateVisible) await ageButton.click();
const unavailableButton = page.getByRole('button', { name: 'Try-On unavailable' });
const photoInputs = await page.locator('input[type="file"]').count();
const readinessCopy = await page.locator('[data-tryon-readiness="unavailable"]').innerText().catch(() => '');
checks.push([ageGateVisible, 'selected look retains its explicit 18+ consent gate']);
checks.push([!tryOnAvailable ? (await unavailableButton.isDisabled().catch(() => false)) && photoInputs === 0 : true, 'unavailable Try-On disables progression before photo upload']);
checks.push([tryOnAvailable || /RUNWARE_API_KEY required/.test(readinessCopy), 'unavailable Try-On names its exact Runware requirement']);
checks.push([await page.getByRole('heading', { name: 'Your try-on' }).count() === 0, 'no successful-looking result is rendered without a real image']);
await b.close();
report('audit-rendered-browser', checks);
