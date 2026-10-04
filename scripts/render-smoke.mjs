// Server-level smoke: every route returns the SPA shell, API endpoints respond, try-on enforces 18+ gate.
import { readJSON, report } from './lib/common.mjs';
import { BASE } from './lib/browser.mjs';
import { ROUTES } from './routes.mjs';
const checks = [];
for (const r of ROUTES) { try { const res = await fetch(BASE + r); const t = await res.text(); checks.push([res.status === 200 && t.includes('<div id="root">'), `GET ${r} → ${res.status}`]); } catch (e) { checks.push([false, `GET ${r} → ${e.message}`]); } }
const st = await (await fetch(BASE + '/api/try-on/status')).json();
checks.push([st.mode === 'runware-flux', `try-on mode defaults to Runware FLUX VTO (${st.mode})`]);
checks.push([st.generationAvailable === false && st.creditLedgerAvailable === false && st.topUpAvailable === false, 'generation, credits and top-ups remain unavailable without durable safeguards']);
checks.push([st.requirements?.includes('RUNWARE_API_KEY required'), 'missing Runware key is reported exactly']);
const previews = readJSON('src/data/women-previews.client.json');
const testLookId = Object.entries(previews).find(([, preview]) => preview.live && preview.src)?.[0];
const photo = 'data:image/png;base64,' + Buffer.from('x'.repeat(100)).toString('base64');
const noAge = await fetch(BASE + '/api/try-on', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ womenLookId: testLookId, photo }) });
checks.push([noAge.status === 403, `try-on without 18+ confirmation rejected (${noAge.status})`]);
const refused = await fetch(BASE + '/api/try-on', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ womenLookId: testLookId, photo, ageConfirmed: true }) });
const body = await refused.json();
checks.push([refused.status === 503 && body.ok === false && body.code === 'RUNWARE_API_KEY_REQUIRED' && !body.resultImage, 'try-on refuses without Runware; no preview/simulated image']);
checks.push([!Object.keys(body).some((key) => /api.?key|token|secret/i.test(key)), 'no credential fields in try-on response']);
report('render-smoke', checks);
