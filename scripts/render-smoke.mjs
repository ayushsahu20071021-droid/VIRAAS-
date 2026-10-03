// Server-level smoke: every route returns the SPA shell, API endpoints respond, try-on enforces 18+ gate.
import { readJSON, report } from './lib/common.mjs';
import { BASE } from './lib/browser.mjs';
import { ROUTES } from './routes.mjs';
const checks = [];
for (const r of ROUTES) { try { const res = await fetch(BASE + r); const t = await res.text(); checks.push([res.status === 200 && t.includes('<div id="root">'), `GET ${r} → ${res.status}`]); } catch (e) { checks.push([false, `GET ${r} → ${e.message}`]); } }
const st = await (await fetch(BASE + '/api/try-on/status')).json();
checks.push([st.mode === 'demo', `try-on mode: ${st.mode} (TRYON_MODE=demo)`]);
const pid = readJSON('src/data/catalog.json').find((p) => p.tryOnEnabled).id;
const photo = 'data:image/png;base64,' + Buffer.from('x'.repeat(100)).toString('base64');
const noAge = await fetch(BASE + '/api/try-on', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ productId: pid, photo }) });
checks.push([noAge.status === 403, `try-on without 18+ confirmation rejected (${noAge.status})`]);
const ok = await fetch(BASE + '/api/try-on', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ productId: pid, photo, ageConfirmed: true }) });
const body = await ok.json();
checks.push([ok.status === 200 && body.mode === 'demo' && /DEMO/.test(body.message), 'try-on demo response clearly labelled DEMO']);
checks.push([!JSON.stringify(body).match(/key|token|secret/i), 'no secrets in try-on response']);
report('render-smoke', checks);
