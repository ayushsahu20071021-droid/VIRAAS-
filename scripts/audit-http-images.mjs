// Fetches every referenced image over HTTP from the running server and checks status + content-type + size.
import { readJSON, report } from './lib/common.mjs';
import { BASE } from './lib/browser.mjs';
const P = readJSON('src/data/catalog.json'); const C = readJSON('src/data/couples.json');
const urls = [...new Set([...C.map((c) => c.imageUrl), ...P.map((p) => p.imageUrl)].filter(Boolean))];
const bad = [];
await Promise.all(urls.map(async (u) => { try { const r = await fetch(BASE + u); const b = await r.arrayBuffer(); if (r.status !== 200 || !/^image\//.test(r.headers.get('content-type') || '') || b.byteLength < 30000) bad.push(`${u} ${r.status} ${r.headers.get('content-type')} ${b.byteLength}`); } catch (e) { bad.push(`${u} ${e.message}`); } }));
report('audit-http-images', [[urls.length > 0, `${urls.length} image URLs referenced`], [bad.length === 0, `all served 200 image/* (${bad.length} bad) ${bad.slice(0, 5).join('; ')}`]]);
