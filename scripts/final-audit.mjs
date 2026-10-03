// Runs every audit and prints an honest gate summary. COMPLETE only if every gate (incl. image completion) passes.
import { execSync } from 'node:child_process';
import fs from 'node:fs'; import path from 'node:path';
import { ROOT, readJSON } from './lib/common.mjs';
const steps = ['check-catalog', 'validate-images', 'audit-affiliate', 'audit-duplicates', 'audit-search', 'audit-http-images', 'render-smoke', 'audit-rendered-browser', 'typecheck'];
const results = {};
for (const s of steps) {
  try { execSync(`npm run -s ${s}`, { cwd: ROOT, stdio: 'pipe', timeout: 600000 }); results[s] = 'PASS'; }
  catch (e) { const out = String(e.stdout || ''); results[s] = /GATE-OPEN/.test(out) && !/\[FAIL\]/.test(out) ? 'PASS (completion gate open)' : 'FAIL'; }
}
const qa = readJSON('data-src/image-qa.json'); const C = readJSON('src/data/couples.json'); const P = readJSON('src/data/catalog.json');
const couplePass = C.filter((c) => qa['couple:' + c.id]?.qa === 'QA_PASS').length;
const prodPass = P.filter((p) => qa['product:' + p.id]?.qa === 'QA_PASS').length;
const fails = Object.values(qa).filter((q) => q.qa === 'QA_FAIL').length;
const allTechnical = Object.values(results).every((r) => r.startsWith('PASS'));
const complete = allTechnical && couplePass === 100 && prodPass === P.length;
const summary = { results, images: { couplePass, coupleTotal: 100, productPass: prodPass, productTotal: P.length, qaFail: fails, pending: 100 - couplePass + P.length - prodPass }, technicalGatesPass: allTechnical, status: complete ? 'COMPLETE' : 'INCOMPLETE — image generation queue still open' };
fs.mkdirSync(path.join(ROOT, 'reports'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'reports/final-audit.json'), JSON.stringify(summary, null, 2));
console.log(JSON.stringify(summary, null, 2));
process.exitCode = complete ? 0 : 1;
