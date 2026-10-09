// Real render audit for the PR #8 change set — renders the ACTUAL React pages with
// react-dom/server through the real Layout (header, floating WhatsApp CTA, footer) and asserts on
// the produced markup. Nothing here re-implements page logic; it renders the shipped components.
//
// Run: npm run audit-rendered-ssr
import React from 'react';
import fs from 'node:fs';
import { renderToString } from 'react-dom/server';
import { Routes, Route } from 'react-router-dom';
import { StaticRouter } from 'react-router';
import Layout from '../src/components/Layout';
import Home from '../src/pages/Home';
import Shop from '../src/pages/Shop';
import Trending from '../src/pages/Trending';
import ProductPage from '../src/pages/Product';
import MenCatalog from '../src/pages/MenCatalog';
import WomenCatalog, { WomenLookDetail } from '../src/pages/WomenCatalog';
import { CoupleEdit } from '../src/pages/Couples';
import { Contact } from '../src/pages/Static';
import { TryOnStatusProvider } from '../src/lib/tryOnStatus';
import { PAYU_VERIFIED_PRODUCTS } from '../src/data/payu-verified-products';
import { report } from './lib/common.mjs';

const render = (location: string, routePath: string, element: React.ReactNode) =>
  renderToString(
    <StaticRouter location={location}>
      <TryOnStatusProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path={routePath} element={element} />
          </Route>
        </Routes>
      </TryOnStatusProvider>
    </StaticRouter>,
  );
const page = (location: string, element: React.ReactNode) => render(location, location, element);
const productPage = (id: string) => render(`/product/${id}`, '/product/:id', <ProductPage />);

/** React emits `<!-- -->` between adjacent text children; drop it (plus the HTML entities) so copy
 *  assertions read like the visible text. */
const text = (html: string) => html
  .replace(/<!-- -->/g, '')
  .replace(/&amp;/g, '&').replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const count = (haystack: string, needle: string) => haystack.split(needle).length - 1;

const checks: [boolean, string][] = [];
const check = (ok: boolean, msg: string) => checks.push([ok, msg]);

/* ---------- 1. SHOP: six verified-price products preserved ---------- */
const shopRaw = page('/shop', <Shop />);
const shop = text(shopRaw);

check(count(shopRaw, 'data-shop-product-id=') === 6, `Shop renders exactly 6 verified-price product cards (${count(shopRaw, 'data-shop-product-id=')})`);
const missingProducts = PAYU_VERIFIED_PRODUCTS.filter((p) => !shopRaw.includes(`data-shop-product-id="${p.id}"`));
check(missingProducts.length === 0, `All 6 known product ids present${missingProducts.length ? ` (missing: ${missingProducts.map((p) => p.id).join(', ')})` : ''}`);
const missingTitles = PAYU_VERIFIED_PRODUCTS.filter((p) => !shop.includes(p.title));
check(missingTitles.length === 0, `All 6 product titles preserved${missingTitles.length ? ` (missing: ${missingTitles.map((p) => p.title).join(' | ')})` : ''}`);
const missingPrices = PAYU_VERIFIED_PRODUCTS.filter((p) => !shop.includes(`₹${p.price.toLocaleString('en-IN')}`));
check(missingPrices.length === 0, `All 6 verified prices preserved${missingPrices.length ? ` (missing: ${missingPrices.map((p) => p.price).join(', ')})` : ''}`);
const mrpProducts = PAYU_VERIFIED_PRODUCTS.filter((p) => p.mrp && p.mrp > p.price);
const missingMrp = mrpProducts.filter((p) => !shop.includes(`MRP ₹${(p.mrp as number).toLocaleString('en-IN')}`));
check(missingMrp.length === 0, `All ${mrpProducts.length} MRP values preserved${missingMrp.length ? ` (missing: ${missingMrp.map((p) => p.mrp).join(', ')})` : ''}`);
const missingRetailers = [...new Set(PAYU_VERIFIED_PRODUCTS.map((p) => p.retailer))].filter((r) => !shop.includes(r));
check(missingRetailers.length === 0, `All retailer names preserved${missingRetailers.length ? ` (missing: ${missingRetailers.join(', ')})` : ''}`);
check(count(shop, 'Price verified') === 6, `Price badges intact (${count(shop, 'Price verified')}/6)`);
const missingUrls = PAYU_VERIFIED_PRODUCTS.filter((p) => !shopRaw.includes(`href="${p.shopUrl}"`));
check(missingUrls.length === 0, `All 6 exact retailer URLs preserved${missingUrls.length ? ` (missing: ${missingUrls.map((p) => p.shopUrl).join(', ')})` : ''}`);
check(count(shop, 'View retailer') === 6, `All 6 “View retailer” buttons preserved (${count(shop, 'View retailer')})`);
check(shop.includes('AI Try-On service is priced at 20 INR per try-on'), 'Shop keeps the AI Try-On payment disclosure');

/* ---------- 2. SHOP: repetitive description removed ---------- */
check(!shop.includes('Exact VIRAAS workbook link. Price and availability can change on the retailer website.'), 'Repeated “Exact VIRAAS workbook link…” line removed from Shop cards');
check(!shop.includes('Price and availability can change on the retailer website.'), 'Repeated “Price and availability can change…” line removed from Shop cards');

/* ---------- 3. SHOP: three browse cards, and NOT on the homepage ---------- */
const collections = ['women', 'men', 'couple'];
check(collections.every((c) => count(shopRaw, `data-shop-collection="${c}"`) === 1), `Shop renders the 3 browse cards (women/men/couple): ${collections.map((c) => count(shopRaw, `data-shop-collection="${c}"`)).join('/')}`);
const collectionBlock = shopRaw.slice(shopRaw.indexOf('shop-collections'));
check(collectionBlock.includes('href="/women"'), 'Women card links to /women');
check(collectionBlock.includes('href="/men"'), 'Men card links to /men');
check(collectionBlock.includes('href="/couple-edit"'), 'Couple card links to the existing Couple Edit route /couple-edit');
check(['Browse Women', 'Browse Men', 'Browse Couple'].every((c) => shop.includes(c)), 'Cards use the Browse Women / Browse Men / Browse Couple labels');
check(shopRaw.indexOf('shop-collections') > shopRaw.indexOf('data-shop-product-id="kalini-sequinned-lehenga"'), 'The 3 browse cards render BELOW the six verified-price cards');
check(collections.every((c) => collectionBlock.includes(`data-shop-collection="${c}"`) && /data-shop-collection="(women|men|couple)"[\s\S]*?class="frame/.test(collectionBlock)), 'Each browse card carries an image frame from an existing project asset');

const homeRaw = page('/', <Home />);
const home = text(homeRaw);
check(!homeRaw.includes('data-shop-collection'), 'Homepage does NOT render the 3 Shop browse cards');
check(count(homeRaw, 'price-product-card') === 6, `Homepage still renders its 6 verified-price cards (${count(homeRaw, 'price-product-card')})`);

/* ---------- 4. Footer / announcement cleanup ---------- */
const menRaw = page('/men', <MenCatalog />);
const footerPages: [string, string][] = [['/shop', shop], ['/', home], ['/men', text(menRaw)]];
const withDiscoveryCopy = footerPages.filter(([, h]) => h.includes('Discovery & curation only'));
check(withDiscoveryCopy.length === 0, `“Discovery & curation only…” removed from the footer${withDiscoveryCopy.length ? ` (still on ${withDiscoveryCopy.map(([p]) => p).join(', ')})` : ''}`);
const withLegalName = footerPages.filter(([, h]) => h.includes('Legal Name:'));
check(withLegalName.length === 0, `“Legal Name: AYUSH SAHU” line removed${withLegalName.length ? ` (still on ${withLegalName.map(([p]) => p).join(', ')})` : ''}`);
const withBlurb = footerPages.filter(([, h]) => h.includes('VIRAAS is a fashion discovery and curation platform. Product prices and availability'));
check(withBlurb.length === 0, `Repeated footer explainer paragraph removed${withBlurb.length ? ` (still on ${withBlurb.map(([p]) => p).join(', ')})` : ''}`);
const policyLinks = ['/affiliate-disclosure', '/privacy', '/terms', '/ai-try-on-privacy', '/faq', '/contact'];
const missingPolicy = policyLinks.filter((l) => !shopRaw.includes(`href="${l}"`));
check(missingPolicy.length === 0, `Footer keeps required policy links${missingPolicy.length ? ` (missing: ${missingPolicy.join(', ')})` : ''}`);
check(shop.includes('© 2026'), 'Footer keeps the copyright/operator line');

/* ---------- 5. WhatsApp destinations ---------- */
const trendingRaw = page('/trending', <Trending />);
const womenRaw = page('/women', <WomenCatalog />);
const coupleRaw = page('/couple-edit', <CoupleEdit />);
const contactRaw = page('/contact', <Contact />);
const editorialRaw = productPage('TREND-447');

const pages: [string, string][] = [
  ['/shop', shopRaw], ['/', homeRaw], ['/women', womenRaw], ['/men', menRaw],
  ['/couple-edit', coupleRaw], ['/trending', trendingRaw], ['/contact', contactRaw],
  ['/product/TREND-447', editorialRaw],
];
// The ShareRow look-sharing widget is a different action from the support CTAs: it must keep
// opening WhatsApp's own contact picker. Split the markup so the two are audited separately.
const SHARE_ROW = /<div class="share-row[^"]*">[\s\S]*?<\/div>/g;
const shareBlocks = (html: string) => html.match(SHARE_ROW) ?? [];
const supportHtml = (html: string) => html.replace(SHARE_ROW, '');

const waHrefs = (name: string, html: string) =>
  [...html.matchAll(/href="(https:\/\/wa\.me[^"]*)"/g)].map((m) => ({ page: name, href: m[1] }));
const supportWa = pages.flatMap(([name, html]) => waHrefs(name, supportHtml(html)));
const shareWa = pages.flatMap(([name, html]) => waHrefs(name, shareBlocks(html).join('\n')));
check(supportWa.length > 0, `WhatsApp support CTAs found on the audited pages (${supportWa.length})`);
const notDirect = supportWa.filter(({ href }) => !/^https:\/\/wa\.me\/919644424865\?text=/.test(href));
check(notDirect.length === 0, `Every support WhatsApp CTA is a direct chat to +91 96444 24865${notDirect.length ? ` (offenders: ${notDirect.map((h) => `${h.page} → ${h.href}`).join(' | ')})` : ''}`);
check(supportWa.filter(({ href }) => href.startsWith('https://wa.me/?text=')).length === 0, 'No support CTA opens the contact-picker / share screen');
check(shareWa.length === pages.filter(([, html]) => shareBlocks(html).length).length, `Look-sharing widgets audited separately (${shareWa.length} on ${pages.filter(([, html]) => shareBlocks(html).length).length} pages)`);
check(shareWa.every(({ href }) => href.startsWith('https://wa.me/?text=')), 'Every look-sharing WhatsApp action still opens the contact picker (functionality intact)');

const floatTopic = (html: string) => /class="wa-float"[^>]*data-whatsapp-topic="([a-z]+)"/.exec(html)?.[1];
for (const [label, path, topic, html] of [
  ['shop', '/shop', 'general', shopRaw], ['home', '/', 'general', homeRaw],
  ['women', '/women', 'women', womenRaw], ['men', '/men', 'men', menRaw],
  ['couple', '/couple-edit', 'couple', coupleRaw],
] as [string, string, string, string][]) {
  check(floatTopic(html) === topic, `Floating WhatsApp on ${label} (${path}) uses the “${topic}” message (got: ${floatTopic(html)})`);
}
for (const [topic, html, label] of [['women', womenRaw, '/women'], ['men', menRaw, '/men'], ['couple', coupleRaw, '/couple-edit']] as [string, string, string][]) {
  const inline = new RegExp(`data-whatsapp-help="${topic}"`).test(html);
  const inlineHref = /data-whatsapp-help="([a-z]+)"[\s\S]*?href="(https:\/\/wa\.me[^"]*)"/.exec(html)?.[2] ?? '';
  check(inline && /^https:\/\/wa\.me\/919644424865\?text=/.test(inlineHref), `Inline ${topic} help CTA renders on ${label} and is a direct chat`);
}

const decodedMessage = (href: string) => {
  const u = new URL(href);
  return { number: u.pathname.replace('/', ''), text: u.searchParams.get('text') ?? '' };
};
const hrefForTopic = (html: string, topic: string) =>
  new RegExp(`href="(https://wa\\.me[^"]*)"[^>]*data-whatsapp-topic="${topic}"`).exec(html)?.[1] ?? '';
const contactTopics = ['general', 'women', 'men', 'couple'].map((t) => ({ t, ...decodedMessage(hrefForTopic(contactRaw, t) || 'https://wa.me/x?text=missing') }));
check(contactTopics.every((c) => c.number === '919644424865'), `Contact page WhatsApp links all target 919644424865 (${contactTopics.map((c) => c.number).join(', ')})`);
check(contactTopics.every((c) => c.text.length > 15), 'Contact page WhatsApp links carry a prefilled message');
const womenMsg = decodedMessage(hrefForTopic(womenRaw, 'women')).text;
const menMsg = decodedMessage(hrefForTopic(menRaw, 'men')).text;
const coupleMsg = decodedMessage(hrefForTopic(coupleRaw, 'couple')).text;
check(/\bwomen’s festive outfit/.test(womenMsg) && !/\smen’s festive outfit/.test(womenMsg), `Women CTA message is women-specific: “${womenMsg}”`);
check(/\smen’s festive outfit/.test(menMsg), `Men CTA message is men-specific: “${menMsg}”`);
check(/\bcouple festive look/.test(coupleMsg), `Couple CTA message is couple-specific: “${coupleMsg}”`);

/* Saved-look / look sharing must keep working: the share button intentionally opens WhatsApp's own
   contact picker so the visitor can choose the recipient. */
const catalogFirst = JSON.parse(fs.readFileSync(new URL('../src/data/catalog.client.json', import.meta.url), 'utf8'))[0];
const productShare = productPage(catalogFirst.id);
const shareHref = /share-row[\s\S]*?href="(https:\/\/wa\.me[^"]*)"/.exec(productShare)?.[1] ?? '';
check(shareHref.startsWith('https://wa.me/?text=') && shareHref.includes(encodeURIComponent(`/product/${catalogFirst.id}`)), `Look-sharing WhatsApp action preserved (opens contact picker with the look link): ${shareHref.slice(0, 70)}…`);
check(!/^https:\/\/wa\.me\/919644424865/.test(shareHref), 'Look-sharing action was NOT redirected at the VIRAAS business number');

/* ---------- 6. Trending = 500 ---------- */
const trendingText = text(trendingRaw);
check(trendingText.includes('500 styles'), `Trending header shows the 500 target (rendered: “${/(\d+) styles ·/.exec(trendingText)?.[0]}”)`);
check(!trendingText.includes('767'), 'Trending no longer displays 767');
check(!trendingRaw.includes('/images/trending-editorial/'), 'No editorial image URL is emitted while the assets are missing (no broken <img>)');

// Page 11 x 48 = 528 slots, so every one of the 500 feed records is rendered and counted.
const trendingAllRaw = render('/trending?page=11', '/trending', <Trending />);
const feedTotal = count(trendingAllRaw, 'class="pcard"');
const menCards = count(trendingAllRaw, 'data-source-type="men-approved"');
const womenCards = count(trendingAllRaw, 'data-source-type="women-approved"');
const editorialCards = count(trendingAllRaw, 'data-source-type="trending-editorial"');
check(feedTotal === 500, `Trending feed renders 500 cards (${feedTotal})`);
check(menCards === 210, `Men catalog looks in the feed unchanged at 210 (${menCards})`);
check(womenCards === 236, `Women catalog looks in the feed unchanged at 236 (${womenCards})`);
check(editorialCards === 54, `Editorial looks in the feed = 54 (${editorialCards})`);
check(count(trendingAllRaw, 'data-pending-image=') >= 54, `Every editorial look renders the labelled pending frame (${count(trendingAllRaw, 'data-pending-image=')} pending frames)`);
check(count(trendingAllRaw, '<img ') === 446, `Only the 446 approved looks render a real <img> (${count(trendingAllRaw, '<img ')})`);

for (const id of ['TREND-447', 'TREND-500']) {
  const html = id === 'TREND-447' ? editorialRaw : productPage(id);
  const t = text(html);
  check(html.includes(`data-trending-editorial-id="${id}"`), `/product/${id} renders the editorial look page`);
  check(!/<img /.test(html), `/product/${id} ships no <img> while its image is pending`);
  check(html.includes('data-editorial-image-pending'), `/product/${id} states honestly that the image is not supplied yet`);
  check(!t.includes('View retailer') && !t.includes('Buy from retailer'), `/product/${id} claims no retailer link`);
  check(/TREND-\d{3}/.test(t) && t.includes('VIRAAS editorial'), `/product/${id} is labelled as a VIRAAS editorial look`);
}

/* ---------- 7. Production surfaces untouched ---------- */
// Main navigation must be exactly what shipped before this change set.
const navItems = [...shopRaw.matchAll(/class="nav-item"[^>]*>[\s\S]*?<a[^>]*>([^<]+)<\/a>/g)].map((m) => m[1].trim());
const expectedNav = ['Women', 'Men', 'Occasions', 'Couple Edit', 'Trending', 'Shop', 'Connect', 'Journal'];
check(JSON.stringify(navItems) === JSON.stringify(expectedNav), `Main navigation unchanged (${navItems.join(' · ') || 'NONE FOUND'})`);

const catalogSampleRaw = productPage(catalogFirst.id);
const catalogSample = text(catalogSampleRaw);
check(catalogSample.includes(catalogFirst.title) && !catalogSample.includes('Product not found'), `Existing catalog product page still resolves (${catalogFirst.id})`);
check(catalogSampleRaw.includes('class="specs"') && /aria-label="Product actions"|Save look/.test(catalogSampleRaw), 'Existing catalog product page keeps its spec sheet and actions');

// The workbook component Shop links on a Women look must be untouched by this change set.
const workbookCase = render('/women-look/women-look-001', '/women-look/:id', <WomenLookDetail />);
const workbookHrefs = [...workbookCase.matchAll(/class="workbook-item"[\s\S]*?href="(https:\/\/[^"]+)"/g)].map((m) => m[1]);
const expectedWorkbook = ['https://www.wishlink.com/share/644x25', 'https://www.wishlink.com/share/nxuxu4', 'https://www.wishlink.com/share/6jfykw'];
check(JSON.stringify(workbookHrefs) === JSON.stringify(expectedWorkbook), `Workbook component Shop links on /women-look/women-look-001 unchanged (${workbookHrefs.length} links)`);

report('audit-rendered-ssr', checks);
