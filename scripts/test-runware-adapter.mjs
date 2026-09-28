// VIRAAS Runware FLUX VTO adapter — no-spend integration test.
//
// Proves the server-side Runware wiring WITHOUT calling the real endpoint or spending a credit, by
// running the REAL adapter (scripts/_runware-probe.mjs) under three env scenarios in child processes
// (env is read at module load, so a fresh process per scenario is required):
//
//   S1  no API key                 -> configured=false, refuses, no network
//   S2  key present, ZDR unset      -> ZDR hard gate refuses immediately, privacy=unverified, no network
//   S3  key present, ZDR=true       -> request is BUILT + DISPATCHED server-side to an UNREACHABLE URL,
//                                      then fails with an honest error (never a fake image)
//
// Run: node scripts/test-runware-adapter.mjs
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const WORKER = path.join(ROOT, 'scripts', '_runware-probe.mjs');
let pass = 0, fail = 0;
const lines = [];
const ok = (n, c, d = '') => { if (c) { pass++; lines.push(`  PASS  ${n}`); } else { fail++; lines.push(`  FAIL  ${n}${d ? ` — ${d}` : ''}`); } };

function run(env) {
  const r = spawnSync(process.execPath, [WORKER], {
    cwd: ROOT,
    env: { ...process.env, RUNWARE_API_KEY: '', RUNWARE_ZDR: '', TRYON_MODE: 'runware-flux', ...env },
    encoding: 'utf8',
  });
  try { return { ...JSON.parse(r.stdout.trim()), _raw: r.stdout }; } catch { return { _raw: r.stdout, _err: r.stderr }; }
}

// S1 — no key
const s1 = run({ RUNWARE_API_KEY: '' });
ok('S1 no key -> configured=false', s1.configured === false);
ok('S1 no key -> refuses (ok:false, missing-key message)', s1.out?.ok === false && /API key/i.test(s1.out?.message || ''));
ok('S1 no key -> no network (instant)', typeof s1.elapsedMs === 'number' && s1.elapsedMs < 50);

// S2 — key but ZDR unset (hard privacy gate)
const s2 = run({ RUNWARE_API_KEY: 'fake-key-not-real', RUNWARE_ZDR: '', RUNWARE_API_URL: 'http://127.0.0.1:1/unreachable' });
ok('S2 ZDR unset -> configured=false', s2.configured === false);
ok('S2 ZDR unset -> refuses with privacy=unverified', s2.out?.ok === false && s2.out?.privacy === 'unverified');
ok('S2 ZDR unset -> NO network attempted (instant, despite unreachable URL)', s2.elapsedMs < 50);

// S3 — ZDR=true: request built + dispatched server-side, honest failure (no fake image)
const s3 = run({ RUNWARE_API_KEY: 'fake-key-not-real', RUNWARE_ZDR: 'true', RUNWARE_API_URL: 'http://127.0.0.1:1/unreachable', TRYON_TIMEOUT_MS: '4000' });
ok('S3 ZDR=true -> configured=true', s3.configured === true);
ok('S3 ZDR=true -> request dispatched then honest failure (no fake image)', s3.out?.ok === false && !s3.out?.resultImage);

console.log('\nVIRAAS Runware adapter — no-spend integration test\n');
console.log(lines.join('\n'));
console.log(`\n${pass} passed, ${fail} failed\n`);
process.exit(fail === 0 ? 0 : 1);
