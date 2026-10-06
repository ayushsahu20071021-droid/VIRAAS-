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
let tryOnProvider;
let originalTryOnGenerate;
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
  const topUpStatusResponse = await localFetch('/api/try-on/status');
  const topUpStatus = await topUpStatusResponse.json();
  assert.equal(topUpStatus.topUpAvailable, false, '₹20 Try-On top-ups remain postponed');
  const disabledCheckout = await localFetch('/api/payment/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Test-Auth-Subject': 'credit-callback-user', 'Idempotency-Key': 'callback-purchase-0001' },
    body: JSON.stringify({ womenLookId: 'women-look-001', phone: '9876543210' }),
  });
  const disabledCheckoutBody = await disabledCheckout.json();
  assert.equal(disabledCheckout.status, 503);
  assert.equal(disabledCheckoutBody.code, 'PAYMENT_TOP_UP_POSTPONED');
  const created = await payments.createCreditPayment({
    userId: callbackAccount.userId, requestKey: 'callback-purchase-0001', phone: '9876543210',
    profile: { display_name: 'Callback User' }, email: callbackAccount.email,
    returnPath: '/try-on?womenLook=women-look-001', publicOrigin: 'https://viraas.example',
  });
  assert.equal(created.ok, true);
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

  // Anonymous balance uses a random HttpOnly cookie and remains server-side across refreshes.
  const freshAnonymousResponse = await localFetch('/api/try-on/credits', { headers: { 'X-Forwarded-Proto': 'https' } });
  const freshAnonymous = await freshAnonymousResponse.json();
  assert.equal(freshAnonymousResponse.status, 200, JSON.stringify(freshAnonymous));
  assert.equal(freshAnonymous.balance, 2, 'a fresh anonymous cookie identity receives exactly two credits');
  assert.equal(freshAnonymous.initialCredits, 2);
  assert.equal('anonymousId' in freshAnonymous, false, 'the anonymous principal ID is never sent to JavaScript');
  const cookieHeaders = freshAnonymousResponse.headers.getSetCookie?.() || [freshAnonymousResponse.headers.get('set-cookie') || ''];
  const anonymousSetCookie = cookieHeaders.find((value) => value.startsWith('viraas_tryon_anon=')) || '';
  assert.match(anonymousSetCookie, /HttpOnly/i);
  assert.match(anonymousSetCookie, /SameSite=Lax/i);
  assert.match(anonymousSetCookie, /Secure/i);
  assert.match(anonymousSetCookie, /Max-Age=31536000/i);
  const anonymousCookie = anonymousSetCookie.split(';')[0];
  assert.ok(anonymousCookie.startsWith('viraas_tryon_anon='));
  const anonymousToken = decodeURIComponent(anonymousCookie.slice('viraas_tryon_anon='.length));
  assert.match(anonymousToken, /^[A-Za-z0-9_-]{43}$/, 'the cookie contains a cryptographically random 256-bit non-PII token');
  assert.equal(JSON.stringify(freshAnonymous).includes(anonymousToken), false, 'the cookie token never appears in the JSON response');
  const anonymousHash = crypto.createHash('sha256').update(anonymousToken).digest('hex');
  const anonymousIdentityRow = await pool.query('SELECT anonymous_id,token_hash FROM tryon_anonymous_identities WHERE token_hash=$1', [anonymousHash]);
  assert.equal(anonymousIdentityRow.rowCount, 1, 'only the token hash is stored');
  assert.equal(anonymousIdentityRow.rows[0].token_hash, anonymousHash);
  const refreshedAnonymousResponse = await localFetch('/api/try-on/credits', { headers: { Cookie: anonymousCookie } });
  const refreshedAnonymous = await refreshedAnonymousResponse.json();
  assert.equal(refreshedAnonymous.balance, 2, 'refreshing with the same cookie never re-grants or loses credits');
  assert.equal((await pool.query("SELECT count(*)::int AS n FROM tryon_anonymous_credit_ledger WHERE anonymous_id=$1 AND event_type='initial_grant'", [anonymousIdentityRow.rows[0].anonymous_id])).rows[0].n, 1);

  const socialStatus = await (await localFetch('/api/social/status')).json();
  assert.equal(socialStatus.available, true, 'healthy auth and storage advertise Connect as available');
  const signedOutMe = await (await localFetch('/api/social/me')).json();
  assert.equal(signedOutMe.authenticated, false);
  assert.equal(signedOutMe.me, null, 'signed-out Connect returns no profile data');
  for (const privatePath of ['/api/social/users', '/api/social/requests', '/api/social/conversations']) {
    const privateResponse = await localFetch(privatePath);
    assert.equal(privateResponse.status, 401, `${privatePath} stays authentication-gated`);
  }

  const { tryOnProvider: provider } = await import('../server/tryOnProvider.mjs');
  tryOnProvider = provider;
  originalTryOnGenerate = provider.generateTryOn;
  let providerBehavior = 'success';
  let providerCalls = 0;
  let concurrentArrivals = 0;
  let markConcurrentArrivals;
  let releaseConcurrentProvider;
  const concurrentArrivalsReady = new Promise((resolve) => { markConcurrentArrivals = resolve; });
  const concurrentProviderGate = new Promise((resolve) => { releaseConcurrentProvider = resolve; });
  const testPhoto = 'data:image/jpeg;base64,/9j/2Q==';
  provider.generateTryOn = async ({ outfitId, photo, garmentImageUrl }) => {
    providerCalls++;
    assert.equal(photo, testPhoto, 'the existing safely-processed JPEG is passed to the provider in memory');
    assert.match(garmentImageUrl, /^data:image\//, 'the provider receives the exact catalog garment reference');
    if (providerBehavior === 'failure') return { ok: false, mode: 'test-provider', outfitId, message: 'Test provider failure.' };
    if (providerBehavior === 'throw') throw new Error('Test provider exception.');
    if (providerBehavior === 'barrier') {
      concurrentArrivals++;
      if (concurrentArrivals === 2) markConcurrentArrivals();
      await concurrentProviderGate;
    }
    return { ok: true, mode: 'test-provider', outfitId, resultImage: 'data:image/png;base64,iVBORw0KGgo=' };
  };
  const generateAnonymous = (cookie, requestKey, subject = { womenLookId: 'women-look-001' }) => localFetch('/api/try-on', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: cookie, 'Idempotency-Key': requestKey },
    body: JSON.stringify({ ...subject, photo: testPhoto, ageConfirmed: true, consent: true }),
  });

  const firstGeneration = await generateAnonymous(anonymousCookie, 'anonymous-generation-0001');
  const firstGenerationBody = await firstGeneration.json();
  assert.equal(firstGeneration.status, 200, JSON.stringify(firstGenerationBody));
  assert.equal(firstGenerationBody.creditsRemaining, 1, 'reservation reduces 2 to 1 and success consumes that reservation without another deduction');
  const firstGenerationLedger = await pool.query('SELECT event_type,delta,balance_after FROM tryon_anonymous_credit_ledger WHERE anonymous_id=$1 ORDER BY created_at,entry_id', [anonymousIdentityRow.rows[0].anonymous_id]);
  const reservationEntry = firstGenerationLedger.rows.find((row) => row.event_type === 'reserve');
  const consumeEntry = firstGenerationLedger.rows.find((row) => row.event_type === 'consume');
  assert.equal(firstGenerationLedger.rows.filter((row) => row.event_type === 'reserve').length, 1);
  assert.equal(reservationEntry.delta, -1);
  assert.equal(reservationEntry.balance_after, 1, 'the atomic reservation reduces the account to one credit');
  assert.equal(consumeEntry.delta, 0);
  assert.equal(consumeEntry.balance_after, 1, 'consuming a successful reservation never deducts the credit a second time');
  const callsAfterFirst = providerCalls;
  const duplicateGeneration = await generateAnonymous(anonymousCookie, 'anonymous-generation-0001');
  assert.equal(duplicateGeneration.status, 409, 'replaying a consumed request key is rejected');
  assert.equal(providerCalls, callsAfterFirst, 'a duplicate request never calls the provider or consumes again');
  assert.equal(await anonymousCredits.getAnonymousTryOnCreditBalance(anonymousIdentityRow.rows[0].anonymous_id), 1);

  const secondGeneration = await generateAnonymous(anonymousCookie, 'anonymous-generation-0002', { menLookId: 'men-look-001' });
  const secondGenerationBody = await secondGeneration.json();
  assert.equal(secondGeneration.status, 200, JSON.stringify(secondGenerationBody));
  assert.equal(secondGenerationBody.creditsRemaining, 0, 'the second successful generation consumes the remaining credit');
  const thirdGeneration = await generateAnonymous(anonymousCookie, 'anonymous-generation-0003');
  const thirdGenerationBody = await thirdGeneration.json();
  assert.equal(thirdGeneration.status, 402);
  assert.equal(thirdGenerationBody.code, 'NO_TRYON_CREDITS');
  assert.equal(thirdGenerationBody.message, 'No Try-On credits remaining.');

  const failedAnonymousResponse = await localFetch('/api/try-on/credits');
  const failedAnonymousData = await failedAnonymousResponse.json();
  const failedCookieHeader = failedAnonymousResponse.headers.getSetCookie?.() || [failedAnonymousResponse.headers.get('set-cookie') || ''];
  const failedCookie = (failedCookieHeader.find((value) => value.startsWith('viraas_tryon_anon=')) || '').split(';')[0];
  assert.equal(failedAnonymousData.balance, 2);
  const failedToken = decodeURIComponent(failedCookie.slice('viraas_tryon_anon='.length));
  const failedHash = crypto.createHash('sha256').update(failedToken).digest('hex');
  const failedIdentity = await pool.query('SELECT anonymous_id FROM tryon_anonymous_identities WHERE token_hash=$1', [failedHash]);
  assert.equal(failedIdentity.rowCount, 1);
  providerBehavior = 'failure';
  const providerFailure = await generateAnonymous(failedCookie, 'anonymous-provider-failure-01');
  assert.equal(providerFailure.status, 502);
  assert.equal(await anonymousCredits.getAnonymousTryOnCreditBalance(failedIdentity.rows[0].anonymous_id), 2, 'a provider failure releases its reservation exactly once');
  const failedGeneration = await pool.query("SELECT generation_id,status FROM tryon_anonymous_generations WHERE anonymous_id=$1", [failedIdentity.rows[0].anonymous_id]);
  assert.equal(failedGeneration.rows[0].status, 'released');
  const duplicateRelease = await anonymousCredits.releaseAnonymousTryOnCredit({ anonymousId: failedIdentity.rows[0].anonymous_id, generationId: failedGeneration.rows[0].generation_id, failureCode: 'provider_failure' });
  assert.equal(duplicateRelease.duplicate, true);
  assert.equal(duplicateRelease.balance, 2, 'duplicate failure handling never refunds twice');
  providerBehavior = 'throw';
  const providerException = await generateAnonymous(failedCookie, 'anonymous-provider-exception-01');
  assert.equal(providerException.status, 502);
  assert.equal(await anonymousCredits.getAnonymousTryOnCreditBalance(failedIdentity.rows[0].anonymous_id), 2, 'a provider exception also releases the reservation');

  // A simultaneous wave of three unique requests may reserve only the two available credits.
  const concurrentAnonymousResponse = await localFetch('/api/try-on/credits');
  const concurrentAnonymous = await concurrentAnonymousResponse.json();
  const concurrentCookieHeader = concurrentAnonymousResponse.headers.getSetCookie?.() || [concurrentAnonymousResponse.headers.get('set-cookie') || ''];
  const concurrentCookie = (concurrentCookieHeader.find((value) => value.startsWith('viraas_tryon_anon=')) || '').split(';')[0];
  assert.equal(concurrentAnonymous.balance, 2);
  providerBehavior = 'barrier';
  concurrentArrivals = 0;
  const concurrentRequests = [
    generateAnonymous(concurrentCookie, 'anonymous-concurrent-0001'),
    generateAnonymous(concurrentCookie, 'anonymous-concurrent-0002'),
    generateAnonymous(concurrentCookie, 'anonymous-concurrent-0003'),
  ];
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Concurrent provider calls did not reach the barrier.')), 5000);
    concurrentArrivalsReady.then(() => { clearTimeout(timer); resolve(); });
  });
  releaseConcurrentProvider();
  const concurrentResponses = await Promise.all(concurrentRequests);
  const concurrentBodies = await Promise.all(concurrentResponses.map((response) => response.json()));
  assert.deepEqual(concurrentResponses.map((response) => response.status).sort(), [200, 200, 402]);
  assert.equal(concurrentBodies.filter((body) => body.code === 'NO_TRYON_CREDITS' && body.message === 'No Try-On credits remaining.').length, 1);
  const concurrentToken = decodeURIComponent(concurrentCookie.slice('viraas_tryon_anon='.length));
  const concurrentHash = crypto.createHash('sha256').update(concurrentToken).digest('hex');
  const concurrentIdentity = await pool.query('SELECT anonymous_id FROM tryon_anonymous_identities WHERE token_hash=$1', [concurrentHash]);
  assert.equal(await anonymousCredits.getAnonymousTryOnCreditBalance(concurrentIdentity.rows[0].anonymous_id), 0, 'parallel requests cannot overspend below zero');
  assert.equal((await pool.query("SELECT count(*)::int AS n FROM tryon_anonymous_credit_ledger WHERE anonymous_id=$1 AND event_type='reserve'", [concurrentIdentity.rows[0].anonymous_id])).rows[0].n, 2);

  // An authenticated adult account continues to use only its own, exactly-once +2 signup ledger.
  const separateAdult = await makeAdult('anonymous-separate-account-user', 'Separate Account');
  const separateAccountFirst = await localFetch('/api/try-on/credits', { headers: { 'X-Test-Auth-Subject': 'anonymous-separate-account-user', Cookie: failedCookie } });
  assert.equal((await separateAccountFirst.json()).balance, 2);
  const separateAccountRefresh = await localFetch('/api/try-on/credits', { headers: { 'X-Test-Auth-Subject': 'anonymous-separate-account-user', Cookie: failedCookie } });
  assert.equal((await separateAccountRefresh.json()).balance, 2, 'authenticated login does not merge or duplicate the anonymous balance');
  assert.equal(await credits.grantSignupCredits(separateAdult.userId), 2);
  assert.equal(await credits.getTryOnCreditBalance(separateAdult.userId), 2, 'a new authenticated account receives its separate +2 grant only once');
  assert.equal(await anonymousCredits.getAnonymousTryOnCreditBalance(failedIdentity.rows[0].anonymous_id), 2, 'the anonymous balance remains separate from the signed-in account');

  const underAge = await localFetch('/api/try-on', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ womenLookId: 'women-look-001', ageConfirmed: false, consent: false }),
  });
  assert.equal(underAge.status, 403, 'server enforces the explicit 18+ and consent gate');

  console.log('PASS Try-On credits: anonymous and authenticated +2 grants, persistent cookie balance, atomic reservation/consume/release, duplicate and concurrency protection, postponed top-ups, and unchanged signed PayU callback verification.');
} finally {
  if (server) await new Promise((resolve) => server.close(resolve));
  globalThis.fetch = originalFetch;
  await db.closePool();
}
