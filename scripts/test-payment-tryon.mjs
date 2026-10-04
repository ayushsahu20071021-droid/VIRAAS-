// VIRAAS payment / Try-On fail-closed test harness.
//
// ZERO-SPEND: synthetic 1x1 input only. The HTTP tests prove that unavailable generation and payment
// integrations refuse safely. The pure store checks exercise idempotency mechanics only; the current
// store is in-memory and is NOT production-ready. No real gateway or Runware request is made.
//
// Run: node scripts/test-payment-tryon.mjs

import crypto from 'node:crypto';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MOCK_SECRET = 'harness-mock-secret';
const TEST_PHOTO = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';

let passed = 0;
let failed = 0;
const results = [];
function check(name, condition, detail = '') {
  if (condition) {
    passed++;
    results.push(`  PASS  ${name}`);
  } else {
    failed++;
    results.push(`  FAIL  ${name}${detail ? ` — ${detail}` : ''}`);
  }
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const json = async (response) => ({ status: response.status, body: await response.json().catch(() => null) });
const mockSign = (raw) => crypto.createHmac('sha256', MOCK_SECRET).update(raw).digest('hex');

function startServer({ port, mode, extraEnv = {} }) {
  const child = spawn(process.execPath, ['server/index.mjs'], {
    cwd: ROOT,
    env: {
      ...process.env,
      NODE_ENV: 'test',
      PORT: String(port),
      TRYON_MODE: mode,
      TRYON_PAYMENT_REQUIRED: 'true',
      PAYMENT_PROVIDER: 'mock',
      MOCK_PAYMENT_SECRET: MOCK_SECRET,
      TRYON_PRICE_INR: '20',
      RUNWARE_API_KEY: '',
      RUNWARE_ZDR: '',
      BFL_API_KEY: '',
      ALLOW_MOCK_PAYMENTS: '',
      ...extraEnv,
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let log = '';
  child.stdout.on('data', (data) => { log += data.toString(); });
  child.stderr.on('data', (data) => { log += data.toString(); });
  return { child, getLog: () => log };
}

async function waitForHealth(port, timeoutMs = 8000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/api/health`);
      if (response.ok) return true;
    } catch { /* wait until the child server listens */ }
    await sleep(150);
  }
  return false;
}

async function tryOn(port, body) {
  return json(await fetch(`http://127.0.0.1:${port}/api/try-on`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }));
}

async function stop(server) {
  if (server.child.exitCode !== null) return;
  server.child.kill('SIGTERM');
  await new Promise((resolve) => {
    const timer = setTimeout(() => { server.child.kill('SIGKILL'); resolve(); }, 1500);
    server.child.once('exit', () => { clearTimeout(timer); resolve(); });
  });
}

async function main() {
  // A — pure in-memory payment-store mechanics. This does NOT establish persistence or production safety.
  const store = await import('../server/payments/store.mjs');
  const service = await import('../server/payments/service.mjs');
  store._reset();
  check('A1 payment store explicitly remains nonpersistent', service.paymentStorePersistent === false);
  const record = store.createRecord({ amountInr: 20, currency: 'INR', outfitId: 'women-look-001', provider: 'mock' });
  check('A2 new in-memory payment record starts PENDING', record.status === 'PENDING');
  const premature = store.authorize(record.paymentId);
  check('A3 authorization is refused before verification', !premature.ok && premature.reason === 'not_verified');
  const verified = store.markVerified(record.paymentId, { eventId: 'evt-1' });
  const duplicate = store.markVerified(record.paymentId, { eventId: 'evt-1' });
  check('A4 verified state is idempotent for a duplicate event', verified.ok && duplicate.duplicate === true);
  const authorized = store.authorize(record.paymentId);
  const repeated = store.authorize(record.paymentId);
  check('A5 authorization is minted once and reused idempotently', authorized.ok && repeated.duplicate === true && repeated.record.authToken === authorized.record.authToken);
  const claimed = store.claimForGeneration(authorized.record.authToken);
  const secondClaim = store.claimForGeneration(authorized.record.authToken);
  check('A6 one-time authorization can be claimed only once', claimed.ok && !secondClaim.ok && secondClaim.reason === 'already_consumed');
  const failedGeneration = store.markFailed(claimed.generationId, 'provider_error');
  const failedRecord = store.getRecord(record.paymentId);
  check('A7 failed in-memory generation remains recoverable with payment id', failedGeneration.ok && failedRecord.recoverable === true && failedRecord.paymentId === record.paymentId);

  // B — legacy/demo provider mode must never report a generated image or trust client payment claims.
  const demo = startServer({ port: 8791, mode: 'demo' });
  try {
    const up = await waitForHealth(8791);
    check('B0 demo server starts for local fail-closed tests', up);
    if (up) {
      const status = await json(await fetch('http://127.0.0.1:8791/api/try-on/status'));
      check('B1 demo status advertises generation as unavailable', status.body?.generationAvailable === false && status.body?.configured === false);
      check('B2 demo status reports Runware configuration requirement', status.body?.requirements?.includes('RUNWARE_API_KEY required'));

      const underAge = await tryOn(8791, { womenLookId: 'women-look-001', photo: TEST_PHOTO, ageConfirmed: false });
      check('B3 server enforces 18+ confirmation before generation', underAge.status === 403 && underAge.body?.ok === false);
      const refused = await tryOn(8791, { womenLookId: 'women-look-001', photo: TEST_PHOTO, ageConfirmed: true });
      check('B4 demo refuses instead of returning a simulated result', refused.status === 503 && refused.body?.ok === false && !refused.body?.resultImage);
      check('B5 missing Runware key has the exact required message', refused.body?.message === 'RUNWARE_API_KEY required. Try-On was not started.');
      const forged = await tryOn(8791, { womenLookId: 'women-look-001', photo: TEST_PHOTO, ageConfirmed: true, paymentSuccess: true, paid: true, authToken: 'fake-token' });
      check('B6 client payment-success fields cannot bypass Try-On readiness', forged.status === 503 && forged.body?.ok === false && !forged.body?.resultImage);

      const paymentCreate = await json(await fetch('http://127.0.0.1:8791/api/payment/create', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ womenLookId: 'women-look-001' }),
      }));
      check('B7 payment creation is refused without a real provider and persistent store', paymentCreate.status === 503 && paymentCreate.body?.code === 'PAYMENT_NOT_CONFIGURED');
      const paymentStatus = await json(await fetch('http://127.0.0.1:8791/api/payment/status?paymentId=unknown'));
      check('B8 payment status is gated when durable verification is unavailable', paymentStatus.status === 503 && paymentStatus.body?.code === 'PAYMENT_NOT_CONFIGURED');
      const paymentVerify = await json(await fetch('http://127.0.0.1:8791/api/payment/verify', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ paymentId: 'unknown' }),
      }));
      check('B9 payment verification is gated when durable storage is unavailable', paymentVerify.status === 503 && paymentVerify.body?.code === 'PAYMENT_NOT_CONFIGURED');
      const event = { event: 'payment.captured', paymentId: paymentCreate.body?.paymentId || 'unknown', eventId: 'evt-test' };
      const raw = JSON.stringify(event);
      const webhook = await json(await fetch('http://127.0.0.1:8791/api/payment/webhook', {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'x-mock-signature': mockSign(raw) }, body: raw,
      }));
      check('B10 webhook is refused without a real provider and persistent store', webhook.status === 503 && webhook.body?.code === 'PAYMENT_NOT_CONFIGURED');
      const logs = demo.getLog();
      check('B11 synthetic photo bytes never appear in server logs', !logs.includes('base64,') && !logs.includes(TEST_PHOTO.slice(30, 60)));
      check('B12 mock/provider secrets never appear in server logs', !logs.includes(MOCK_SECRET) && !logs.includes('RUNWARE_API_KEY='));
    }
  } finally { await stop(demo); }

  // C — Runware mode without a key reports the exact requirement and exits before generation.
  const noKey = startServer({ port: 8792, mode: 'runware-flux' });
  try {
    const up = await waitForHealth(8792);
    check('C0 Runware server without a key starts for local tests', up);
    if (up) {
      const status = await json(await fetch('http://127.0.0.1:8792/api/try-on/status'));
      check('C1 Runware without a key remains unconfigured', status.body?.mode === 'runware-flux' && status.body?.configured === false);
      check('C2 status marks generation, credits and top-ups unavailable', status.body?.generationAvailable === false && status.body?.creditLedgerAvailable === false && status.body?.topUpAvailable === false);
      const refused = await tryOn(8792, { menLookId: 'men-look-001', photo: TEST_PHOTO, ageConfirmed: true, paymentSuccess: true });
      check('C3 no-key request returns the exact Runware configuration message', refused.status === 503 && refused.body?.code === 'RUNWARE_API_KEY_REQUIRED' && refused.body?.message === 'RUNWARE_API_KEY required. Try-On was not started.');
      check('C4 no-key request does not return an image', refused.body?.ok === false && !refused.body?.resultImage);
      const payment = await json(await fetch('http://127.0.0.1:8792/api/payment/create', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ menLookId: 'men-look-001' }),
      }));
      check('C5 no real checkout is created', payment.status === 503 && payment.body?.code === 'PAYMENT_NOT_CONFIGURED');
      const logs = noKey.getLog();
      check('C6 no-key test makes no live Runware call and logs no photo bytes', !logs.includes('api.runware.ai') && !logs.includes('base64,'));
    }
  } finally { await stop(noKey); }

  // D — Even configured Runware credentials cannot bypass the missing durable identity/credit ledger.
  const configured = startServer({
    port: 8793,
    mode: 'runware-flux',
    extraEnv: {
      RUNWARE_API_KEY: 'test-only-key-never-sent',
      RUNWARE_ZDR: 'true',
      RUNWARE_API_URL: 'http://127.0.0.1:1/v1',
    },
  });
  try {
    const up = await waitForHealth(8793);
    check('D0 configured test Runware server starts', up);
    if (up) {
      const status = await json(await fetch('http://127.0.0.1:8793/api/try-on/status'));
      check('D1 provider readiness does not imply generation or credit readiness', status.body?.configured === true && status.body?.generationAvailable === false && status.body?.creditLedgerAvailable === false);
      const refused = await tryOn(8793, { womenLookId: 'women-look-001', photo: TEST_PHOTO, ageConfirmed: true });
      check('D2 missing persistent credit ledger blocks generation before Runware', refused.status === 503 && refused.body?.code === 'PERSISTENT_CREDIT_LEDGER_REQUIRED' && !refused.body?.resultImage);
      const logs = configured.getLog();
      check('D3 blocked configured request never reaches the Runware endpoint or logs photo bytes', !logs.includes('127.0.0.1:1/v1') && !logs.includes('api.runware.ai') && !logs.includes('base64,'));
      check('D4 fake test key never appears in logs', !logs.includes('test-only-key-never-sent'));
    }
  } finally { await stop(configured); }

  console.log('\nVIRAAS payment / Try-On fail-closed tests\n');
  console.log(results.join('\n'));
  console.log(`\n${passed} passed, ${failed} failed\n`);
  process.exit(failed === 0 ? 0 : 1);
}

main().catch((error) => {
  console.error('harness error:', error);
  process.exit(1);
});
