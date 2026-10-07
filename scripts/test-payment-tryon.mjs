// Focused, zero-spend tests for the FINAL VIRAAS Try-On model:
//   - Try-On is completely anonymous; no signup/login required.
//   - Every Try-On costs exactly ₹20 INR via PayU hosted checkout.
//   - No free credits. Successful PayU callback grants exactly +1 credit.
//   - Duplicate callbacks never double-grant.
//   - Payment/order is server-linked to the HttpOnly anonymous identity cookie.
//   - Runware failure releases the reserved credit so user can retry without paying again.
//   - Connect/private routes remain authentication-gated (no anonymous messaging).
// PayU is stubbed only inside this test process; no real payment or Runware request is made.
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
process.env.TRYON_MODE = 'runware-flux';
process.env.RUNWARE_FLUX_MODEL = 'bfl:flux@vto';
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
const anonymousCredits = await import('../server/anonymousTryOnCredits.mjs');
const payments = await import('../server/payments/service.mjs');
const { payuProvider } = await import('../server/payments/providers.mjs');
const originalFetch = globalThis.fetch;
let expectedTxn = '';
let verifyCalls = 0;

// Mock PayU verify_payment endpoint
globalThis.fetch = async (input, init = {}) => {
  const url = String(input);
  if (url.startsWith('https://test.payu.in/merchant/postservice.php')) {
    verifyCalls++;
    const form = new URLSearchParams(String(init.body || ''));
    assert.equal(form.get('key'), process.env.PAYU_MERCHANT_KEY);
    assert.equal(form.get('command'), 'verify_payment');
    assert.equal(form.get('var1'), expectedTxn);
    assert.equal(form.get('hash'), crypto.createHash('sha512').update(`${process.env.PAYU_MERCHANT_KEY}|verify_payment|${expectedTxn}|${process.env.PAYU_MERCHANT_SALT}`).digest('hex'));
    // Look in both tables
    const authStored = await pool.query('SELECT productinfo,firstname,email FROM payu_credit_payments WHERE txnid=$1', [expectedTxn]);
    const anonStored = await pool.query('SELECT productinfo,firstname,email FROM anonymous_payu_payments WHERE txnid=$1', [expectedTxn]);
    const stored = authStored.rowCount ? authStored : anonStored;
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
let tryOnProvider;
let originalTryOnGenerate;
try {
  // --- Authenticated account credits still work for signup grants (used by Connect persistence) ---
  const account = await makeAdult('credit-test-user', 'Asha Test');
  const initial = await credits.getTryOnCreditBalance(account.userId);
  assert.equal(initial, 2, 'profile completion grants exactly two persistent signup credits (Connect accounts only)');
  assert.equal(await credits.grantSignupCredits(account.userId), 2, 'a repeated login/session never re-grants signup credits');
  assert.equal(await credits.getTryOnCreditBalance(account.userId), 2);

  // --- ₹20 amount constants ---
  assert.equal(payments.paymentStorePersistent, true);
  assert.equal(payments.paymentProviderConfigured, true);
  assert.equal(payments.paymentProviderName, 'payu');
  assert.equal(payments.CREDIT_PRICE_INR, 20);
  assert.equal(payments.CREDIT_PRICE_PAISE, 2000);
  assert.equal(payments.amountPaise('20.00'), 2000);
  assert.equal(payments.amountPaise('20.01'), 2001);
  assert.equal(payments.amountPaise('20.000'), null);

  // --- PayU hash verification ---
  const dummyCheckout = payuProvider.createCheckout({
    txnid: 'TESTTXN01', amount: '20.00', productinfo: 'VIRAAS Try-On Credit',
    firstname: 'VIRAAS Guest', email: 'guest@viraas.local', phone: '',
    surl: 'https://example.com/cb', furl: 'https://example.com/cb',
  });
  assert.equal(dummyCheckout.fields.amount, '20.00');
  const requestHashInput = [dummyCheckout.fields.key,dummyCheckout.fields.txnid,dummyCheckout.fields.amount,dummyCheckout.fields.productinfo,dummyCheckout.fields.firstname,dummyCheckout.fields.email,'','','','','','','','','','',process.env.PAYU_MERCHANT_SALT].join('|');
  assert.equal(dummyCheckout.fields.hash, crypto.createHash('sha512').update(requestHashInput).digest('hex'));
  const callback = { ...dummyCheckout.fields, status: 'success', hash: '' };
  callback.hash = payuReverseHash(callback);
  assert.equal(payuProvider.verifyCallbackHash(callback), true);
  assert.equal(payuProvider.verifyCallbackHash({ ...callback, amount: '1.00' }), false, 'changed amount invalidates hash');
  assert.equal(payuProvider.verifyCallbackHash({ ...callback, key: 'attacker-key' }), false);

  // --- Start server to test HTTP endpoints ---
  process.env.RUNWARE_API_KEY = 'test-only-runware-key';
  process.env.RUNWARE_ZDR = 'true';
  const { default: app } = await import('../server/app.mjs');
  server = app.listen(0, '127.0.0.1');
  await new Promise((resolve) => server.once('listening', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  const localFetch = async (url, init) => originalFetch(`${base}${url}`, init);

  // /api/try-on/status advertises ₹20 payment requirement
  const statusResponse = await localFetch('/api/try-on/status');
  const statusBody = await statusResponse.json();
  assert.equal(statusBody.paymentRequired, true, 'Try-On requires payment');
  assert.equal(statusBody.priceInr, 20, 'price is ₹20');
  assert.equal(statusBody.topUpAvailable, true, '₹20 PayU checkout is enabled');

  // --- Fresh anonymous identity starts with ZERO credits (no free credits) ---
  const freshAnonymousResponse = await localFetch('/api/try-on/credits', { headers: { 'X-Forwarded-Proto': 'https' } });
  const freshAnonymous = await freshAnonymousResponse.json();
  assert.equal(freshAnonymousResponse.status, 200, JSON.stringify(freshAnonymous));
  assert.equal(freshAnonymous.balance, 0, 'NEW anonymous identity has 0 credits — no free credits!');
  assert.equal(freshAnonymous.priceInr, 20);
  assert.equal('anonymousId' in freshAnonymous, false, 'anonymous id never sent to JS');
  assert.equal('initialCredits' in freshAnonymous, false, 'no initialCredits field exposed');
  const cookieHeaders = freshAnonymousResponse.headers.getSetCookie?.() || [freshAnonymousResponse.headers.get('set-cookie') || ''];
  const anonymousSetCookie = cookieHeaders.find((value) => value.startsWith('viraas_tryon_anon=')) || '';
  assert.match(anonymousSetCookie, /HttpOnly/i);
  assert.match(anonymousSetCookie, /SameSite=Lax/i);
  assert.match(anonymousSetCookie, /Secure/i);
  assert.match(anonymousSetCookie, /Max-Age=31536000/i);
  const anonymousCookie = anonymousSetCookie.split(';')[0];
  const anonymousToken = decodeURIComponent(anonymousCookie.slice('viraas_tryon_anon='.length));
  assert.match(anonymousToken, /^[A-Za-z0-9_-]{43}$/, '256-bit random token');
  const anonymousHash = crypto.createHash('sha256').update(anonymousToken).digest('hex');
  const anonIdentityRow = await pool.query('SELECT anonymous_id,token_hash FROM tryon_anonymous_identities WHERE token_hash=$1', [anonymousHash]);
  assert.equal(anonIdentityRow.rowCount, 1);
  assert.equal(anonIdentityRow.rows[0].token_hash, anonymousHash);

  // Verify NO initial_grant was created for this new anonymous identity
  const grantCount = (await pool.query("SELECT count(*)::int AS n FROM tryon_anonymous_credit_ledger WHERE anonymous_id=$1 AND event_type='initial_grant'", [anonIdentityRow.rows[0].anonymous_id])).rows[0].n;
  assert.equal(grantCount, 0, 'new anonymous identities do not receive any free grant');

  // Refreshing credits doesn't grant free credits
  const refreshedResponse = await localFetch('/api/try-on/credits', { headers: { Cookie: anonymousCookie } });
  const refreshed = await refreshedResponse.json();
  assert.equal(refreshed.balance, 0, 'refreshing does not grant free credits');

  // --- Trying to generate without credits returns 402 NO_TRYON_CREDITS ---
  const testPhoto = 'data:image/jpeg;base64,/9j/2Q==';
  const genNoCredit = await localFetch('/api/try-on', {
    method: 'POST', headers: { 'Content-Type': 'application/json', Cookie: anonymousCookie, 'Idempotency-Key': 'gen-no-credit-01' },
    body: JSON.stringify({ womenLookId: 'women-look-001', photo: testPhoto, ageConfirmed: true, consent: true }),
  });
  const genNoCreditBody = await genNoCredit.json();
  assert.equal(genNoCredit.status, 402, 'generation without credits returns 402');
  assert.equal(genNoCreditBody.code, 'NO_TRYON_CREDITS');
  assert.equal(genNoCreditBody.priceInr, 20, '402 response exposes ₹20 price');

  // --- Create anonymous PayU payment via /api/payment/create (no auth required) ---
  const payResp = await localFetch('/api/payment/create', {
    method: 'POST', credentials: 'include',
    headers: { 'Content-Type': 'application/json', Cookie: anonymousCookie, 'Idempotency-Key': 'anon-payment-001' },
    body: JSON.stringify({ womenLookId: 'women-look-001' }),
  });
  const payBody = await payResp.json();
  assert.equal(payResp.status, 200, JSON.stringify(payBody));
  assert.equal(payBody.ok, true);
  assert.equal(payBody.priceInr, 20);
  assert.ok(payBody.txnid, 'payment returned a txnid');
  assert.equal(payBody.checkout.endpoint, 'https://test.payu.in/_payment');
  assert.equal(payBody.checkout.fields.amount, '20.00');
  assert.equal(payBody.checkout.fields.productinfo, 'VIRAAS Try-On Credit');
  assert.equal(JSON.stringify(payBody).includes(process.env.PAYU_MERCHANT_SALT), false, 'salt never returned to browser');
  expectedTxn = payBody.txnid;

  // Payment is linked to the anonymous identity in DB
  const payRow = await pool.query('SELECT payment_id,anonymous_id,amount_paise,status,txnid FROM anonymous_payu_payments WHERE txnid=$1', [expectedTxn]);
  assert.equal(payRow.rowCount, 1);
  assert.equal(payRow.rows[0].anonymous_id, anonIdentityRow.rows[0].anonymous_id);
  assert.equal(payRow.rows[0].amount_paise, 2000, 'amount is exactly ₹20 = 2000 paise');
  assert.equal(payRow.rows[0].status, 'pending');
  // No photo bytes stored in payment record
  const payCols = Object.keys(payRow.rows[0]);
  assert.ok(!payCols.includes('photo') && !payCols.includes('photo_data') && !payCols.includes('image'), 'no photo bytes in payment table');

  // --- Simulate PayU callback (signed) ---
  const responseFields = { ...payBody.checkout.fields, status: 'success' };
  responseFields.hash = payuReverseHash(responseFields);
  const cbResp = await localFetch('/api/payment/payu/callback', {
    method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(responseFields), redirect: 'manual',
  });
  assert.equal(cbResp.status, 303, 'verified callback returns 303 redirect');
  assert.match(cbResp.headers.get('location') || '', /payment=success/);
  // After successful callback — balance should be 1
  const afterPay = await localFetch('/api/try-on/credits', { headers: { Cookie: anonymousCookie } });
  const afterPayBody = await afterPay.json();
  assert.equal(afterPayBody.balance, 1, 'successful PayU payment grants exactly 1 credit to anonymous identity');

  // Duplicate callback does NOT grant twice
  const cbDup = await localFetch('/api/payment/payu/callback', {
    method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(responseFields), redirect: 'manual',
  });
  assert.equal(cbDup.status, 303);
  const afterDup = await localFetch('/api/try-on/credits', { headers: { Cookie: anonymousCookie } });
  assert.equal((await afterDup.json()).balance, 1, 'duplicate callback does not grant a second credit');

  // Ledger has exactly one payu_purchase entry for this identity
  const purchaseEntries = (await pool.query("SELECT count(*)::int AS n FROM tryon_anonymous_credit_ledger WHERE anonymous_id=$1 AND event_type='payu_purchase'", [anonIdentityRow.rows[0].anonymous_id])).rows[0].n;
  assert.equal(purchaseEntries, 1, 'exactly one payu_purchase ledger entry');

  // --- Payment status from another cookie (different anonymous identity) returns 404 ---
  // i.e., payment status must be scoped to the current cookie identity
  const otherCookieResponse = await localFetch('/api/try-on/credits', { headers: { 'X-Forwarded-Proto': 'https' } });
  const otherCookieHeader = otherCookieResponse.headers.getSetCookie?.() || [otherCookieResponse.headers.get('set-cookie') || ''];
  const otherCookie = (otherCookieHeader.find((v) => v.startsWith('viraas_tryon_anon=')) || '').split(';')[0];
  const otherStatus = await localFetch(`/api/payment/status?txnid=${encodeURIComponent(expectedTxn)}`, { headers: { Cookie: otherCookie } });
  assert.equal(otherStatus.status, 404, 'a different anonymous identity cannot see another\'s payment');

  // --- Failed payment grants zero credits ---
  const failedPayResp = await localFetch('/api/payment/create', {
    method: 'POST', headers: { 'Content-Type': 'application/json', Cookie: anonymousCookie, 'Idempotency-Key': 'anon-payment-failed-01' },
    body: JSON.stringify({ menLookId: 'men-look-001' }),
  });
  const failedPayBody = await failedPayResp.json();
  assert.equal(failedPayBody.ok, true);
  const failedTxn = failedPayBody.txnid;
  await payments.markPayUFailed({ txnid: failedTxn, failureCode: 'payment_failed' });
  const afterFailed = await localFetch('/api/try-on/credits', { headers: { Cookie: anonymousCookie } });
  assert.equal((await afterFailed.json()).balance, 1, 'failed payment does not grant any credit');
  const failedStatus = await payments.getAnonymousPaymentStatus({ txnid: failedTxn, anonymousId: anonIdentityRow.rows[0].anonymous_id });
  assert.equal(failedStatus.status, 'failed');

  // --- Provider mocking for generation tests ---
  const { tryOnProvider: provider } = await import('../server/tryOnProvider.mjs');
  tryOnProvider = provider;
  originalTryOnGenerate = provider.generateTryOn;
  let providerBehavior = 'success';
  let providerCalls = 0;
  provider.generateTryOn = async ({ outfitId, photo, garmentImageUrl }) => {
    providerCalls++;
    assert.equal(photo, testPhoto);
    assert.match(garmentImageUrl, /^data:image\//);
    if (providerBehavior === 'failure') return { ok: false, mode: 'test-provider', outfitId, message: 'Test provider failure.' };
    if (providerBehavior === 'throw') throw new Error('Test provider exception.');
    return { ok: true, mode: 'test-provider', outfitId, resultImage: 'data:image/png;base64,iVBORw0KGgo=' };
  };
  const generateAnon = (cookie, requestKey, subject = { womenLookId: 'women-look-001' }) => localFetch('/api/try-on', {
    method: 'POST', headers: { 'Content-Type': 'application/json', Cookie: cookie, 'Idempotency-Key': requestKey },
    body: JSON.stringify({ ...subject, photo: testPhoto, ageConfirmed: true, consent: true }),
  });

  // --- Successful generation consumes the 1 paid credit ---
  const successGen = await generateAnon(anonymousCookie, 'anon-gen-success-01');
  const successGenBody = await successGen.json();
  assert.equal(successGen.status, 200, JSON.stringify(successGenBody));
  assert.equal(successGenBody.creditsRemaining, 0, 'generation consumes the paid credit to 0');
  assert.equal(await anonymousCredits.getAnonymousTryOnCreditBalance(anonIdentityRow.rows[0].anonymous_id), 0);

  // Runware failure releases credit
  const failCookieResp = await localFetch('/api/payment/create', {
    method: 'POST', headers: { 'Content-Type': 'application/json', Cookie: anonymousCookie, 'Idempotency-Key': 'anon-payment-fail-gen-01' },
    body: JSON.stringify({ womenLookId: 'women-look-001' }),
  });
  const failPayBody = await failCookieResp.json();
  // Simulate PayU success for this payment
  const failRespFields = { ...failPayBody.checkout.fields, status: 'success' };
  failRespFields.hash = payuReverseHash(failRespFields);
  expectedTxn = failPayBody.txnid;
  await localFetch('/api/payment/payu/callback', {
    method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(failRespFields), redirect: 'manual',
  });
  const balAfterFailPay = await anonymousCredits.getAnonymousTryOnCreditBalance(anonIdentityRow.rows[0].anonymous_id);
  assert.equal(balAfterFailPay, 1, 'second purchase gives another credit');

  providerBehavior = 'failure';
  const provFail = await generateAnon(anonymousCookie, 'anon-gen-provfail-01');
  const provFailBody = await provFail.json();
  assert.equal(provFail.status, 502);
  assert.equal(provFailBody.creditReleased, true, 'Runware failure releases credit');
  assert.equal(await anonymousCredits.getAnonymousTryOnCreditBalance(anonIdentityRow.rows[0].anonymous_id), 1, 'credit was released; can retry without paying again');

  // Provider exception also releases
  providerBehavior = 'throw';
  const provThrow = await generateAnon(anonymousCookie, 'anon-gen-provthrow-01');
  assert.equal(provThrow.status, 502);
  assert.equal(await anonymousCredits.getAnonymousTryOnCreditBalance(anonIdentityRow.rows[0].anonymous_id), 1, 'exception also releases credit');

  // --- Try-On does NOT require authentication ---
  // (Demonstrated by all above calls using anonymous cookie only, no X-Test-Auth-Subject header)
  const noAuthCredits = await localFetch('/api/try-on/credits');
  assert.equal(noAuthCredits.status, 200, 'unauthenticated request gets anonymous balance (sets new cookie)');

  // --- Connect/social routes REQUIRE authentication ---
  const socialStatus = await (await localFetch('/api/social/status')).json();
  assert.equal(socialStatus.available, true);
  const signedOutMe = await (await localFetch('/api/social/me')).json();
  assert.equal(signedOutMe.authenticated, false);
  assert.equal(signedOutMe.me, null);
  for (const privatePath of ['/api/social/users', '/api/social/requests', '/api/social/conversations']) {
    const privateResponse = await localFetch(privatePath);
    assert.equal(privateResponse.status, 401, `${privatePath} stays authentication-gated`);
  }

  // Age/consent gate enforced by server
  const underAge = await localFetch('/api/try-on', {
    method: 'POST', headers: { 'Content-Type': 'application/json', Cookie: anonymousCookie, 'Idempotency-Key': 'age-gate-01' },
    body: JSON.stringify({ womenLookId: 'women-look-001', photo: testPhoto, ageConfirmed: false, consent: false }),
  });
  assert.equal(underAge.status, 403, 'server enforces 18+ and consent gate');

  console.log('PASS Final VIRAAS Try-On: anonymous ₹20 PayU flow, zero free credits, idempotent +1 credit grant, duplicate callback protection, Runware failure releases credit, payment/identity linkage, no anonymous Connect access.');
} finally {
  if (server) await new Promise((resolve) => server.close(resolve));
  if (tryOnProvider && originalTryOnGenerate) tryOnProvider.generateTryOn = originalTryOnGenerate;
  globalThis.fetch = originalFetch;
  await db.closePool();
}
