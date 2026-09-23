import fs from 'node:fs'; import path from 'node:path';
import { ROOT, readJSON, report } from './lib/common.mjs';
const ALLOWED = ['MYNTRA','AJIO','FLIPKART','SHOPSY','MEESHO','NYKAA'];
const HOSTS = { MYNTRA: 'www.myntra.com', AJIO: 'www.ajio.com', FLIPKART: 'www.flipkart.com', SHOPSY: 'www.shopsy.in', MEESHO: 'www.meesho.com', NYKAA: 'www.nykaafashion.com' };
const P = readJSON('src/data/catalog.json');
const FORBIDDEN = new RegExp(['am','azon'].join(''), 'i'); // constructed to keep the forbidden word out of source
const scanDirs = ['src','server','scripts','data-src','public','index.html','README.md','FINAL_REPORT.md','package.json','dist'];
const hits = [];
function scan(p) { const full = path.join(ROOT, p); if (!fs.existsSync(full)) return; const st = fs.statSync(full);
  if (st.isDirectory()) { for (const f of fs.readdirSync(full)) if (!['images','node_modules'].includes(f)) scan(path.join(p, f)); return; }
  if (!/\.(m?js|tsx?|json|md|html|css)$/.test(p)) return;
  if (FORBIDDEN.test(fs.readFileSync(full, 'utf8'))) hits.push(p); }
scanDirs.forEach(scan);
const badMerchant = P.filter((p) => !ALLOWED.includes(p.merchant));
const badHost = P.filter((p) => { try { return new URL(p.merchantUrl).host !== HOSTS[p.merchant]; } catch { return true; } });
const affFilled = P.filter((p) => p.affiliateUrl !== '');
const trackingParams = P.filter((p) => /[?&](affid|aff_id|tag|utm_|ref=|clickid|subid)/i.test(p.merchantUrl));
const used = [...new Set(P.map((p) => p.merchant))].sort();
report('audit-affiliate', [
  [badMerchant.length === 0, `only allowed merchants (used: ${used.join(', ')})`],
  [badHost.length === 0, `merchantUrl host matches merchant (${badHost.length} bad)`],
  [affFilled.length === 0, `affiliateUrl empty on all ${P.length} products (${affFilled.length} filled)`],
  [P.every((p) => p.affiliateSource === ''), 'affiliateSource empty (not configured)'],
  [trackingParams.length === 0, `no invented tracking parameters (${trackingParams.length})`],
  [hits.length === 0, `forbidden marketplace absent from code/data/docs/build (${hits.length} files${hits.length ? ': ' + hits.join(', ') : ''})`],
]);
