// Focused, zero-spend tests for durable Try-On credits and PayU Hosted Checkout verification.
// PayU is stubbed only inside this test process; no payment or Runware request is made.
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { newDb } from 'pg-mem';

process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = 'postgresql://test:test@localhost/viraas-credit-test';
process.env.SUPABASE_URL = 'https://supabase.test';
process.env.SUPABASE_ANON_KEY = 'test-anon-key';
process.env.VIRAAS_SESSION_SECRET = 'test-only-session-secret-that-is-over-32-chars';
process.env.PAYU_ENV = 'test';
process.env.PAYU_MERCHANT_KEY = 'test-payubiz-key';
process.env.PAYU_MERCHANT_SALT = 'test-only-payU-salt-not-for-production';
process.env.RUNWARE_API_KEY = '';
process.env.RUNWARE_ZDR = '';

const memoryDb = newDb({ autoCreateForeignKeyIndices: true });
const { Pool } = memoryDb.adapters.createPg();
const pool = new Pool();
const db = await import('../server/db/pool.mjs');
db.setPoolForTests(pool);
const { migrateTestDatabase } = await import('./test-db.mjs');
await migrateTestDatabase({ pool, memoryDb });

const { createAccount, createProfile } = await import('../server/social/repository.mjs');
const credits = await import('../server/tryOnCredits.mjs');
const payments = await import('../server/payments/service.mjs');
const { payuProvider } = await import('../server/payments/providers.mjs');
const originalFetch = globalThis.fetch;
let expectedTxn = '';
let verifyCalls = 0;

globalThis.fetch = async (input, init = {}) => {
  const url = String(input);
  if (url.startsWith('https://test.payu.in/merchant/postservice.php')) {
    verifyCalls++;
    const form = new URLSearchParams(String(init.body || ''));
    assert.equal(form.get('key'), process.env.PAYU_MERCHANT_KEY);
    assert.equal(form.get('command'), 'verify_payment');
    assert.equal(form.get('var1'), expectedTxn);
    assert.equal(form.get('hash'), crypto.createHash('sha512').update(`${process.env.PAYU_MERCHANT_KEY}|verify_payment|${expectedTxn}|${process.env.PAYU_MERCHANT_SALT}`).digest('hex'));
    const stored = await pool.query('SELECT productinfo,firstname,email FROM payu_credit_payments WHERE txnid=$1', [expectedTxn]);
    assert.equal(stored.rowCount, 1, 'verification can only query a persisted VIRAAS payment record');
    return new Response(JSON.stringify({
      status: 1,
      transaction_details: {
        [expectedTxn]: {
          mihpayid: `payu-test-${expectedTxn}`,
          status: 'success',
          unmappedstatus: 'captured',
          txnid: expectedTxn,
          amount: '20.00',
          productinfo: stored.rows[0].productinfo,
          firstname: stored.rows[0].firstname,
          email: stored.rows[0].email,
        },
      },
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }
  return originalFetch(input, init);
};

function birthDate(year) { return `${year}-04-15`; }
async function makeAdult(subject, name, email = 'test@example.invalid') {
  await createAccount(subject);
  await createProfile(subject, {
    adultConfirmed: true, dateOfBirth: birthDate(1995), displayName: name, gender: 'female',
    state: 'Madhya Pradesh', city: 'Indore', locality: 'Vijay Nagar', visibility: 'hidden',
  });
  const result = await pool.query('SELECT user_id FROM viraas_users WHERE auth_subject=$1', [subject]);
  return { userId: result.rows[0].user_id, email };
}
function payuReverseHash(fields) {
  const raw = [
    process.env.PAYU_MERCHANT_SALT, fields.status, '', '', '', '', '',
    fields.udf5 || '', fields.udf4 || '', fields.udf3 || '', fields.udf2 || '', fields.udf1 || '',
    fields.email, fields.firstname, fields.productinfo, fields.amount, fields.txnid, fields.key,
  ].join('|');
  return crypto.createHash('sha512').update(raw).digest('hex');
}

let server;
try {
  const account = await makeAdult('credit-test-user', 'Asha Test');
  const initial = await credits.getTryOnCreditBalance(account.userId);
  assert.equal(initial, 2, 'profile completion grants exactly two persistent free credits');
  assert.equal(await credits.grantSignupCredits(account.userId), 2, 'a repeated login/session never re-grants signup credits');
  assert.equal(await credits.getTryOnCreditBalance(account.userId), 2);

  const reservation = await credits.reserveTryOnCredit({ userId: account.userId, requestKey: 'generation-0001', outfitId: 'women-look-001' });
  assert.equal(reservation.ok, true);
  assert.equal(reservation.balance, 1);
  const repeatedReservation = await credits.reserveTryOnCredit({ userId: account.userId, requestKey: 'generation-0001', outfitId: 'women-look-001' });
  assert.equal(repeatedReservation.ok, false, 'a repeated request key cannot reserve another credit');
  assert.equal(repeatedReservation.reason, 'duplicate_request');
  assert.equal(await credits.getTryOnCreditBalance(account.userId), 1);

  const released = await credits.releaseTryOnCredit({ userId: account.userId, generationId: reservation.generationId, failureCode: 'provider_failure' });
  assert.equal(released.ok, true);
  assert.equal(released.balance, 2);
  const repeatedRelease = await credits.releaseTryOnCredit({ userId: account.userId, generationId: reservation.generationId, failureCode: 'provider_failure' });
  assert.equal(repeatedRelease.duplicate, true, 'a failed generation releases its reserved credit only once');
  assert.equal(await credits.getTryOnCreditBalance(account.userId), 2);

  const consumedReservation = await credits.reserveTryOnCredit({ userId: account.userId, requestKey: 'generation-0002', outfitId: 'men-look-001' });
  const consumed = await credits.consumeTryOnCredit({ userId: account.userId, generationId: consumedReservation.generationId });
  assert.equal(consumed.ok, true);
  assert.equal(consumed.balance, 1);
  assert.equal((await credits.consumeTryOnCredit({ userId: account.userId, generationId: consumedReservation.generationId })).duplicate, true);
  assert.equal(await credits.getTryOnCreditBalance(account.userId), 1, 'successful generation consumes one reserved credit');

  assert.equal(payments.paymentStorePersistent, true);
  assert.equal(payments.paymentProviderConfigured, true);
  assert.equal(payments.paymentProviderName, 'payu');
  assert.equal(payments.CREDIT_PRICE_INR, 20);
  assert.equal(payments.amountPaise('20.00'), 2000);
  assert.equal(payments.amountPaise('20.01'), 2001);
  assert.equal(payments.amountPaise('20.000'), null);

  const checkout = await payments.createCreditPayment({
    userId: account.userId,
    requestKey: 'purchase-0001',
    phone: '9876543210',
    profile: { display_name: 'Asha Test' },
    email: account.email,
    returnPath: '/try-on?womenLook=women-look-001',
    publicOrigin: 'https://viraas.example',
  });
  assert.equal(checkout.ok, true);
  assert.equal(checkout.checkout.endpoint, 'https://test.payu.in/_payment');
  assert.equal(checkout.checkout.fields.amount, '20.00');
  assert.equal(checkout.checkout.fields.productinfo, 'VIRAAS Try-On Credit');
  const payuFields = checkout.checkout.fields;
  const requestHashInput = [payuFields.key,payuFields.txnid,payuFields.amount,payuFields.productinfo,payuFields.firstname,payuFields.email,payuFields.udf1,payuFields.udf2,payuFields.udf3,payuFields.udf4,payuFields.udf5,'','','','','',process.env.PAYU_MERCHANT_SALT].join('|');
  assert.equal(payuFields.hash, crypto.createHash('sha512').update(requestHashInput).digest('hex'), 'the hosted-checkout request hash follows PayU SHA-512 ordering');
  assert.equal(JSON.stringify(checkout).includes(process.env.PAYU_MERCHANT_SALT), false, 'the PayU merchant salt is never returned to the browser');
  expectedTxn = checkout.txnid;

  const callback = { ...checkout.checkout.fields, status: 'success', hash: '' };
  callback.hash = payuReverseHash(callback);
  assert.equal(payuProvider.verifyCallbackHash(callback), true, 'a valid PayU reverse signature is accepted');
  assert.equal(payuProvider.verifyCallbackHash({ ...callback, amount: '1.00' }), false, 'a changed amount invalidates the PayU response hash');
  assert.equal(payuProvider.verifyCallbackHash({ ...callback, key: 'attacker-key' }), false, 'an untrusted merchant key is rejected');

  const verified = await payuProvider.verifyPayment(checkout.txnid);
  assert.equal(verified.verified, true);
  assert.equal(verified.captured, true);
  assert.equal(verified.amountPaise, 2000);
  assert.equal(verifyCalls, 1);
  const purchase = await payments.markPayUSuccess(verified);
  assert.equal(purchase.ok, true);
  assert.equal(purchase.duplicate, false);
  assert.equal(purchase.balance, 2, 'one verified ₹20 PayU payment adds exactly one credit');
  const replay = await payments.markPayUSuccess(verified);
  assert.equal(replay.ok, true);
  assert.equal(replay.duplicate, true, 'replaying a verified PayU capture is idempotent');
  assert.equal(await credits.getTryOnCreditBalance(account.userId), 2, 'a replay never adds a second credit');

  const failedOrder = await payments.createCreditPayment({
    userId: account.userId,
    requestKey: 'purchase-0002', phone: '9876543210', profile: { display_name: 'Asha Test' }, email: account.email,
    returnPath: '/try-on?menLook=men-look-001', publicOrigin: 'https://viraas.example',
  });
  assert.equal(failedOrder.ok, true);
  const balanceBeforeFailure = await credits.getTryOnCreditBalance(account.userId);
  await payments.markPayUFailed({ txnid: failedOrder.txnid });
  await payments.markPayUFailed({ txnid: failedOrder.txnid });
  assert.equal(await credits.getTryOnCreditBalance(account.userId), balanceBeforeFailure, 'a failed payment does not grant credits');
  assert.equal((await payments.getPaymentStatusForUser({ txnid: failedOrder.txnid, userId: account.userId })).status, 'failed');

  const finalReservationA = await credits.reserveTryOnCredit({ userId: account.userId, requestKey: 'generation-0003', outfitId: 'women-look-003' });
  const finalReservationB = await credits.reserveTryOnCredit({ userId: account.userId, requestKey: 'generation-0004', outfitId: 'men-look-002' });
  assert.equal(finalReservationA.ok, true);
  assert.equal(finalReservationB.ok, true);
  assert.equal(finalReservationB.balance, 0);
  const zero = await credits.reserveTryOnCredit({ userId: account.userId, requestKey: 'generation-0005', outfitId: 'women-look-004' });
  assert.equal(zero.ok, false);
  assert.equal(zero.reason, 'no_credits');
  assert.equal(zero.balance, 0);
  assert.equal(credits.NO_TRYON_CREDITS_MESSAGE, 'No Try-On credits remaining.');

  // The hosted callback path validates the PayU signature and performs a server-side verify call;
  // its HTTP redirect cannot grant a credit without that verification.
  const callbackAccount = await makeAdult('credit-callback-user', 'Callback User');
  // Enable only the configuration gate for the payment-route harness; no Runware request is made.
  process.env.RUNWARE_API_KEY = 'test-only-runware-key';
  process.env.RUNWARE_ZDR = 'true';
  const { default: app } = await import('../server/app.mjs');
  server = app.listen(0, '127.0.0.1');
  await new Promise((resolve) => server.once('listening', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  const localFetch = async (url, init) => originalFetch(`${base}${url}`, init);
  const paymentResponse = await localFetch('/api/payment/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Test-Auth-Subject': 'credit-callback-user', 'Idempotency-Key': 'callback-purchase-0001' },
    body: JSON.stringify({ womenLookId: 'women-look-001', phone: '9876543210' }),
  });
  const created = await paymentResponse.json();
  assert.equal(paymentResponse.status, 200, JSON.stringify(created));
  assert.equal(created.checkout.endpoint, 'https://test.payu.in/_payment');
  expectedTxn = created.txnid;
  const responseFields = { ...created.checkout.fields, status: 'success' };
  responseFields.hash = payuReverseHash(responseFields);
  const callbackResponse = await localFetch('/api/payment/payu/callback', {
    method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(responseFields), redirect: 'manual',
  });
  const callbackText = await callbackResponse.clone().text();
  assert.equal(callbackResponse.status, 303, `verified PayU callback returns the customer to the selected look: ${callbackText}`);
  assert.match(callbackResponse.headers.get('location') || '', /\/try-on\?womenLook=women-look-001&payment=success&txnid=/);
  const callbackBalance = await credits.getTryOnCreditBalance(callbackAccount.userId);
  assert.equal(callbackBalance, 3, 'one verified callback adds one credit to the two signup credits');
  const duplicateCallback = await localFetch('/api/payment/payu/callback', {
    method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(responseFields), redirect: 'manual',
  });
  assert.equal(duplicateCallback.status, 303);
  assert.equal(await credits.getTryOnCreditBalance(callbackAccount.userId), 3, 'a duplicate callback cannot replay the credit grant');

  const creditResponse = await localFetch('/api/try-on/credits', { headers: { 'X-Test-Auth-Subject': 'credit-callback-user' } });
  const creditBody = await creditResponse.json();
  assert.equal(creditBody.balance, 3);
  assert.equal(creditBody.noCreditsMessage, 'No Try-On credits remaining.');
  const underAge = await localFetch('/api/try-on', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ womenLookId: 'women-look-001', ageConfirmed: false, consent: false }),
  });
  assert.equal(underAge.status, 403, 'server enforces the explicit 18+ and consent gate');

  console.log('PASS Try-On credits and PayU: exactly-once two-credit signup grant, atomic reserve/consume/release, verified ₹20 PayU checkout, signed callback and verify_payment reconciliation, ownership, and replay protection.');
} finally {
  if (server) await new Promise((resolve) => server.close(resolve));
  globalThis.fetch = originalFetch;
  await db.closePool();
}
