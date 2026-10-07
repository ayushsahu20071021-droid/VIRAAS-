import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));
const products = read('src/data/catalog.json');
const workbook = read('src/data/workbook-mappings.json');
const workbookLooks = workbook.sections.filter((s) => ['garba-navratri', 'college-fest'].includes(s.id)).flatMap((s) => s.looks);
const workbookShopLinks = workbookLooks.flatMap((look) => look.components).filter((item) => typeof item.shopUrl === 'string');
const merchantHosts = {
  MYNTRA: 'www.myntra.com',
  AJIO: 'www.ajio.com',
  FLIPKART: 'www.flipkart.com',
  SHOPSY: 'www.shopsy.in',
  MEESHO: 'www.meesho.com',
  NYKAA: 'www.nykaafashion.com',
};
const ids = new Set();
const problems = [];
const counts = {
  products: products.length,
  duplicateProductIds: 0,
  validHttpsMerchantUrlStrings: 0,
  exactProductListings: 0,
  marketplaceSearchUrlsNotEligibleAsProduct: 0,
  wishlinkAffiliateUrls: 0,
  rejectedAffiliateUrls: 0,
  verifiedPrices: 0,
  estimatedPricesNotPublished: 0,
  eligibleProductTryOn: 0,
  tryOnFlagWithoutLiveImage: 0,
  spreadsheetFilesFound: 0,
  workbookLooksMappedOrReviewed: workbookLooks.length,
  workbookComponentShopLinks: workbookShopLinks.length,
};

function httpsUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password ? url : null;
  } catch {
    return null;
  }
}
function wishlink(value) {
  const url = httpsUrl(value);
  return Boolean(url && ['wishlink.com', 'www.wishlink.com'].includes(url.hostname) && /^\/share\/[^/?#]+$/.test(url.pathname));
}

for (const product of products) {
  if (ids.has(product.id)) {
    counts.duplicateProductIds += 1;
    problems.push(`Duplicate productId: ${product.id}`);
  }
  ids.add(product.id);

  if (product.merchantUrl) {
    const url = httpsUrl(product.merchantUrl);
    const expectedHost = merchantHosts[String(product.merchant || '').toUpperCase()];
    if (!url || !expectedHost || url.hostname !== expectedHost) problems.push(`Unsafe or unsupported merchant URL on ${product.id}`);
    else counts.validHttpsMerchantUrlStrings += 1;
  }
  if (product.merchantUrlType === 'product') {
    const url = httpsUrl(product.merchantUrl || '');
    const expectedHost = merchantHosts[String(product.merchant || '').toUpperCase()];
    if (!url || !expectedHost || url.hostname !== expectedHost || /(^|\/)search(?:\/|$)/i.test(url.pathname)) {
      problems.push(`Invalid exact product listing on ${product.id}`);
    } else counts.exactProductListings += 1;
  }
  if (product.merchantUrlType === 'marketplace-search') counts.marketplaceSearchUrlsNotEligibleAsProduct += 1;

  if (product.affiliateUrl) {
    if (product.affiliateSource !== 'wishlink' || !wishlink(product.affiliateUrl)) {
      counts.rejectedAffiliateUrls += 1;
      problems.push(`Non-Wishlink/invalid affiliate URL on ${product.id}`);
    } else counts.wishlinkAffiliateUrls += 1;
  }

  if (product.priceType === 'verified' && Number.isFinite(product.price) && product.price > 0) counts.verifiedPrices += 1;
  else if (product.priceType === 'estimate') counts.estimatedPricesNotPublished += 1;

  const hasLiveImage = Boolean(product.status === 'live' && typeof product.imageUrl === 'string' && product.imageUrl.trim());
  if (product.tryOnEnabled && hasLiveImage) counts.eligibleProductTryOn += 1;
  else if (product.tryOnEnabled) counts.tryOnFlagWithoutLiveImage += 1;
}

const spreadsheetNames = new Set(['.xlsx', '.xls', '.csv', '.ods']);
for (const entry of fs.readdirSync(ROOT, { withFileTypes: true })) {
  if (entry.isFile() && spreadsheetNames.has(path.extname(entry.name).toLowerCase())) counts.spreadsheetFilesFound += 1;
}

const result = {
  status: problems.length ? 'FAIL' : 'PASS — safe action gates',
  counts,
  workbookIntegration: 'PASS — source workbook mappings are stored separately from the base product catalog; exact links are audited by audit-workbook-mapping.',
  problems,
  note: 'This audit does not invent or import base-catalog product URLs. Only explicit HTTPS product listings, exact Wishlink share URLs, verified prices, and live product images qualify for base-catalog actions; source-workbook component links remain separately scoped.',
};
fs.mkdirSync(path.join(ROOT, 'reports'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'reports/audit-product-actions.json'), JSON.stringify(result, null, 2));
console.log(JSON.stringify(result, null, 2));
if (problems.length) process.exitCode = 1;
