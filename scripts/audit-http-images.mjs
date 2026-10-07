// Fetches the actual product/curated-look image references exposed by the app and checks status,
// content type, and size. Product catalog images are included when explicitly present; Men and
// Women look previews and Couple Edit assets are resolved through the same source records as UI.
import { tsImport } from 'tsx/esm/api';
import { readJSON, report } from './lib/common.mjs';
import { BASE } from './lib/browser.mjs';

const { PRODUCTS, COUPLES, coupleImageSrc } = await tsImport('../src/lib/data.ts', import.meta.url);
const menImages = readJSON('src/data/men-final-images.json');
const womenPreviews = readJSON('src/data/women-previews.client.json');
const urls = [...new Set([
  ...Object.values(menImages),
  ...Object.values(womenPreviews).filter((preview) => preview?.live && preview.src).map((preview) => preview.src),
  ...COUPLES.map((couple) => coupleImageSrc(couple)),
  ...PRODUCTS.map((product) => product.imageUrl),
].filter((url) => typeof url === 'string' && url.trim()))];

const bad = [];
for (let i = 0; i < urls.length; i += 32) {
  await Promise.all(urls.slice(i, i + 32).map(async (url) => {
    try {
      const href = /^https?:\/\//i.test(url) ? url : new URL(url, BASE).toString();
      const response = await fetch(href);
      const bytes = await response.arrayBuffer();
      if (response.status !== 200 || !/^image\//.test(response.headers.get('content-type') || '') || bytes.byteLength < 30000) {
        bad.push(`${url} ${response.status} ${response.headers.get('content-type')} ${bytes.byteLength}`);
      }
    } catch (error) {
      bad.push(`${url} ${error.message}`);
    }
  }));
}

report('audit-http-images', [
  [urls.length > 0, `${urls.length} image URLs referenced by live/preview catalogs`],
  [bad.length === 0, `all served 200 image/* and ≥30 KB (${bad.length} bad) ${bad.slice(0, 5).join('; ')}`],
]);
