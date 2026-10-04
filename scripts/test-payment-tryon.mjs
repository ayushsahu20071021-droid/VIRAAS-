// VIRAAS payment-gated AI Try-On — LOCAL / MOCK test harness.
//
// ZERO-SPEND: this makes NO real Runware API calls, NO real payment-gateway transactions, uses NO
// customer photos, and moves NO money. It exercises only:
//   - the in-memory authorization store state machine (idempotency + atomic single-use), and
//   - the live HTTP server in demo / runware-flux(no-key) modes with the mock (HMAC-signed) gateway.
//
// Run: node scripts/test-payment-tryon.mjs
//
// Covers the 14 required checks (13 tsc + 14 prod build are run by the surrounding pipeline; this
// harness additionally re-asserts "no image bytes in logs" and "no secrets in frontend/logs").

import crypto from 'node:crypto';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MOCK_SECRET = 'harness-mock-secret';
// A tiny valid base64 PNG data URI used as the "customer photo" (synthetic — not a real person).
const TEST_PHOTO =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';

let passed = 0;
let failed = 0;
const results = [];
function check(name, cond, detail = '') {
  if (cond) {
    passed++;
    results.push(`  PASS  ${name}`);
  } else {
    failed++;
    results.push(`  FAIL  ${name}${detail ? `  — ${detail}` : ''}`);
  }
}

const mockSign = (raw) => crypto.createHmac('sha256', MOCK_SECRET).update(raw).digest('hex');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ---- server process helper ---------------------------------------------------------------------
function startServer({ port, mode, extraEnv = {} }) {
  const child = spawn(process.execPath, ['server/index.mjs'], {
    cwd: ROOT,
    env: {
      ...process.env,
      PORT: String(port),
      TRYON_MODE: mode,
      TRYON_PAYMENT_REQUIRED: 'true',
      PAYMENT_PROVIDER: 'mock',
      MOCK_PAYMENT_SECRET: MOCK_SECRET,
      TRYON_PRICE_INR: '20',
      // Ensure no live creds leak in from the environment.
      RUNWARE_API_KEY: '',
      RUNWARE_ZDR: '',
      BFL_API_KEY: '',
      ...extraEnv,
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let log = '';
  child.stdout.on('data', (d) => (log += d.toString()));
  child.stderr.on('data', (d) => (log += d.toString()));
  return { child, getLog: () => log };
}

async function waitForHealth(port, timeoutMs = 8000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const r = await fetch(`http://127.0.0.1:${port}/api/health`);
      if (r.ok) return true;
    } catch {
      /* not up yet */
    }
    await sleep(150);
  }
  return false;
}

const j = async (r) => ({ status: r.status, body: await r.json().catch(() => null) });

async function main() {
  // =====================================================================================
  // PART A — store state machine (pure, deterministic, no network)
  // =====================================================================================
  const store = await import('../server/payments/store.mjs');
  store._reset();
  const rec = store.createRecord({ amountInr: 20, currency: 'INR', outfitId: 'women-look-001', provider: 'mock' });
  check('A1 new payment starts PENDING', rec.status === 'PENDING');

  // authorize before verify must be refused
  const preAuth = store.authorize(rec.paymentId);
  check('A2 authorize refused before verification', !preAuth.ok && preAuth.reason === 'not_verified');

  // verify (idempotent) — simulate duplicate webhook event id
  const v1 = store.markVerified(rec.paymentId, { eventId: 'evt-1' });
  const v2 = store.markVerified(rec.paymentId, { eventId: 'evt-1' });
  check('A3 verify sets VERIFIED', v1.ok && store.getRecord(rec.paymentId).status === 'VERIFIED');
  check('A4 duplicate webhook event is a no-op', v2.duplicate === true);

  // authorize once, twice (idempotent — same token, no duplicate authorization)
  const au1 = store.authorize(rec.paymentId);
  const au2 = store.authorize(rec.paymentId);
  check('A5 authorize mints AUTHORIZED', au1.ok && au1.record.status === 'AUTHORIZED' && Boolean(au1.record.authToken));
  check('A6 second authorize returns SAME token (no duplicate auth)', au2.duplicate === true && au2.record.authToken === au1.record.authToken);

  // atomic claim — only once
  const token = au1.record.authToken;
  const c1 = store.claimForGeneration(token);
  const c2 = store.claimForGeneration(token);
  check('A7 first claim succeeds -> CONSUMED', c1.ok && store.getRecord(rec.paymentId).status === 'CONSUMED');
  check('A8 second claim is refused (no double-consume)', !c2.ok && c2.reason === 'already_consumed');

  // failure preserves recoverable state
  const f = store.markFailed(c1.generationId, 'runware_down');
  const failedRec = store.getRecord(rec.paymentId);
  check('A9 genuine failure -> FAILED + recoverable, paymentId retained', f.ok && failedRec.status === 'FAILED' && failedRec.recoverable === true && failedRec.paymentId === rec.paymentId);

  // =====================================================================================
  // PART B — HTTP flow, demo mode (payment REQUIRED, mock gateway)
  // =====================================================================================
  const A = startServer({ port: 8791, mode: 'demo' });
  const upA = await waitForHealth(8791);
  check('B0 demo server (payment-required) is up', upA);
  if (upA) {
    // Try-On with NO payment -> blocked (402)
    const noPay = await j(await fetch('http://127.0.0.1:8791/api/try-on', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ womenLookId: 'women-look-001', photo: TEST_PHOTO, ageConfirmed: true }),
    }));
    check('T1 payment pending blocks Try-On (402)', noPay.status === 402 && noPay.body?.ok === false);

    // Fake frontend "paymentSuccess" is IGNORED -> still blocked (402)
    const fake = await j(await fetch('http://127.0.0.1:8791/api/try-on', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ womenLookId: 'women-look-001', photo: TEST_PHOTO, ageConfirmed: true, paymentSuccess: true, paid: true, authToken: 'not-a-real-token' }),
    }));
    check('T2 fake frontend paymentSuccess is NOT trusted (402)', fake.status === 402 && fake.body?.ok === false);

    // Create payment
    const created = await j(await fetch('http://127.0.0.1:8791/api/payment/create', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ womenLookId: 'women-look-001' }),
    }));
    const paymentId = created.body?.paymentId;
    check('T3a payment created (PENDING, priced)', created.body?.ok === true && created.body?.status === 'PENDING' && created.body?.amountInr === 20 && Boolean(paymentId));

    // Status before payment -> no token, unverified blocks Runware
    const stPending = await j(await fetch(`http://127.0.0.1:8791/api/payment/status?paymentId=${paymentId}`));
    check('T3b unverified payment exposes NO authToken', stPending.body?.status === 'PENDING' && !stPending.body?.authToken);

    // Signed webhook -> VERIFIED + one authorization
    const evt = { event: 'payment.captured', paymentId, gatewayOrderId: created.body?.checkout?.gatewayOrderId, eventId: 'wh-1' };
    const raw = JSON.stringify(evt);
    const wh1 = await j(await fetch('http://127.0.0.1:8791/api/payment/webhook', {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'x-mock-signature': mockSign(raw) }, body: raw,
    }));
    check('T4a signed webhook accepted (AUTHORIZED)', wh1.body?.ok === true && wh1.body?.status === 'AUTHORIZED');

    // Duplicate webhook -> no duplicate authorization (token unchanged)
    const stAfter1 = await j(await fetch(`http://127.0.0.1:8791/api/payment/status?paymentId=${paymentId}`));
    const token1 = stAfter1.body?.authToken;
    const wh2 = await j(await fetch('http://127.0.0.1:8791/api/payment/webhook', {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'x-mock-signature': mockSign(raw) }, body: raw,
    }));
    const stAfter2 = await j(await fetch(`http://127.0.0.1:8791/api/payment/status?paymentId=${paymentId}`));
    check('T4b verified mock payment creates ONE authorization (token present)', Boolean(token1));
    check('T6 duplicate webhook does NOT duplicate authorization (same token)', wh2.body?.duplicate === true && stAfter2.body?.authToken === token1);

    // Bad-signature webhook rejected
    const badWh = await j(await fetch('http://127.0.0.1:8791/api/payment/webhook', {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'x-mock-signature': 'deadbeef' }, body: raw,
    }));
    check('T4c bad-signature webhook rejected (400)', badWh.status === 400);

    // Authorized generation succeeds ONCE (demo)
    const gen1 = await j(await fetch('http://127.0.0.1:8791/api/try-on', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ womenLookId: 'women-look-001', photo: TEST_PHOTO, ageConfirmed: true, authToken: token1 }),
    }));
    check('T5a authorized Try-On is allowed (200)', gen1.status === 200 && gen1.body?.ok === true);

    // Same token again -> refused (already consumed)
    const gen2 = await j(await fetch('http://127.0.0.1:8791/api/try-on', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ womenLookId: 'women-look-001', photo: TEST_PHOTO, ageConfirmed: true, authToken: token1 }),
    }));
    check('T5b/T7 same authorization cannot be consumed twice (402)', gen2.status === 402 && gen2.body?.ok === false);

    // No image bytes / secrets in the demo server logs
    const logA = A.getLog();
    check('T11 no base64 image bytes in logs (demo)', !logA.includes('base64,') && !logA.includes(TEST_PHOTO.slice(30, 60)));
    check('T12a no gateway/provider secret in logs', !logA.includes(MOCK_SECRET) && !logA.includes('RUNWARE_API_KEY='));
  }
  A.child.kill('SIGKILL');

  // =====================================================================================
  // PART C — HTTP flow, runware-flux mode with NO key + ZDR unset (paid, but must NOT call live)
  // =====================================================================================
  const B = startServer({ port: 8792, mode: 'runware-flux' }); // no RUNWARE_API_KEY, no ZDR
  const upB = await waitForHealth(8792);
  check('C0 runware-flux server (no key) is up', upB);
  if (upB) {
    const status = await j(await fetch('http://127.0.0.1:8792/api/try-on/status'));
    check('T9/T10 runware-flux with no key + ZDR unset reports NOT configured', status.body?.mode === 'runware-flux' && status.body?.configured === false);

    // Pay + authorize
    const created = await j(await fetch('http://127.0.0.1:8792/api/payment/create', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ menLookId: 'men-look-001' }),
    }));
    const paymentId = created.body?.paymentId;
    const evt = { event: 'payment.captured', paymentId, eventId: 'wh-c1' };
    const raw = JSON.stringify(evt);
    await fetch('http://127.0.0.1:8792/api/payment/webhook', {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'x-mock-signature': mockSign(raw) }, body: raw,
    });
    const st = await j(await fetch(`http://127.0.0.1:8792/api/payment/status?paymentId=${paymentId}`));
    const token = st.body?.authToken;

    // Authorized generation attempt — provider refuses (no key / ZDR) with NO live call; the paid
    // authorization must become FAILED + recoverable, not lost, and not faked.
    const gen = await j(await fetch('http://127.0.0.1:8792/api/try-on', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ menLookId: 'men-look-001', photo: TEST_PHOTO, ageConfirmed: true, authToken: token }),
    }));
    check('T3/T8a paid+authorized but unconfigured provider fails honestly (no fake image)', gen.body?.ok === false && !gen.body?.resultImage);

    // Its authorization must now be spent (recoverable) — a retry with the same token is refused.
    const retry = await j(await fetch('http://127.0.0.1:8792/api/try-on', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ menLookId: 'men-look-001', photo: TEST_PHOTO, ageConfirmed: true, authToken: token }),
    }));
    check('T8b failed generation preserves spent state (retry refused, recoverable server-side)', retry.status === 402);

    const logB = B.getLog();
    check('T8c no live Runware call attempted (no api.runware.ai in logs) & no image bytes', !logB.includes('api.runware.ai') && !logB.includes('base64,'));
  }
  B.child.kill('SIGKILL');

  // =====================================================================================
  // PART D — configured live provider stays blocked BEFORE the paid authorization is consumed
  // =====================================================================================
  const D = startServer({
    port: 8793,
    mode: 'runware-flux',
    extraEnv: {
      RUNWARE_API_KEY: 'test-only-key-never-sent',
      RUNWARE_ZDR: 'true',
      // If the route accidentally reaches the provider, this local closed port fails immediately.
      RUNWARE_API_URL: 'http://127.0.0.1:1/v1',
    },
  });
  const upD = await waitForHealth(8793);
  check('D0 configured Runware server is up', upD);
  if (upD) {
    const liveStatus = await j(await fetch('http://127.0.0.1:8793/api/try-on/status'));
    check('D1 configured live provider reports generation unavailable', liveStatus.body?.configured === true && liveStatus.body?.generationAvailable === false);

    const created = await j(await fetch('http://127.0.0.1:8793/api/payment/create', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ womenLookId: 'women-look-001' }),
    }));
    const paymentId = created.body?.paymentId;
    const evt = { event: 'payment.captured', paymentId, eventId: 'wh-d1' };
    const raw = JSON.stringify(evt);
    await fetch('http://127.0.0.1:8793/api/payment/webhook', {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'x-mock-signature': mockSign(raw) }, body: raw,
    });
    const before = await j(await fetch(`http://127.0.0.1:8793/api/payment/status?paymentId=${paymentId}`));
    const authToken = before.body?.authToken;
    const blocked = await j(await fetch('http://127.0.0.1:8793/api/try-on', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ womenLookId: 'women-look-001', photo: TEST_PHOTO, ageConfirmed: true, authToken }),
    }));
    check('D2 configured live generation is blocked (503) before provider call', blocked.status === 503 && blocked.body?.ok === false && !blocked.body?.resultImage);

    const after = await j(await fetch(`http://127.0.0.1:8793/api/payment/status?paymentId=${paymentId}`));
    check('D3 blocked generation leaves paid authorization unconsumed', after.body?.status === 'AUTHORIZED' && after.body?.authToken === authToken && after.body?.consumed === false);
  }
  D.child.kill('SIGKILL');

  // ---- summary ----------------------------------------------------------------------------------
  console.log('\nVIRAAS payment-gated Try-On — mock/local tests\n');
  console.log(results.join('\n'));
  console.log(`\n${passed} passed, ${failed} failed\n`);
  process.exit(failed === 0 ? 0 : 1);
}

main().catch((e) => {
  console.error('harness error:', e);
  process.exit(1);
});
