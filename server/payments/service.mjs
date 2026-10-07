// Durable PayU credit-purchase business layer. Credits are created only from a server-verified
// PayU capture and the payment row, credit balance, and ledger entry commit atomically.
// Supports both authenticated (persistent account) and anonymous (HttpOnly cookie) principals.
import crypto from 'node:crypto';
import { query, withTransaction } from '../db/pool.mjs';
import { applyVerifiedPayUPurchase, getTryOnCreditBalance } from '../tryOnCredits.mjs';
import { applyVerifiedAnonymousPayUPurchase, getAnonymousTryOnCreditBalance } from '../anonymousTryOnCredits.mjs';
import { amountPaise, payuProvider, payuRequirements } from './providers.mjs';

export const CREDIT_PRICE_PAISE = 2000;
export const CREDIT_PRICE_INR = 20;
export const CREDIT_PRODUCT_INFO = 'VIRAAS Try-On Credit';
export const paymentProviderName = 'payu';
export const paymentProviderConfigured = payuProvider.configured;
export const paymentStorePersistent = true;
export const paymentRequirements = payuRequirements;

function paymentRef() {
  return `VIR${Date.now().toString(36)}${crypto.randomBytes(6).toString('hex')}`.slice(0, 25);
}

export function normalizeIndianPhone(value) {
  const digits = String(value || '').replace(/[^0-9]/g, '').replace(/^91(?=\d{10}$)/, '');
  return /^[6-9]\d{9}$/.test(digits) ? digits : '';
}

function validRequestKey(value) {
  return typeof value === 'string' && /^[A-Za-z0-9][A-Za-z0-9._:-]{7,127}$/.test(value);
}

function formFor(payment, phone, publicOrigin) {
  const callback = `${publicOrigin}/api/payment/payu/callback`;
  return payuProvider.createCheckout({
    txnid: payment.txnid,
    amount: '20.00',
    productinfo: payment.productinfo,
    firstname: payment.firstname,
    email: payment.email,
    phone: phone || payment.phone || '',
    surl: callback,
    furl: callback,
  });
}

export async function createCreditPayment({ userId, requestKey, phone, profile, email, returnPath, publicOrigin }) {
  if (!userId || !validRequestKey(requestKey)) return { ok: false, reason: 'invalid_request' };
  if (!payuProvider.configured) return { ok: false, reason: 'not_configured', requirements: payuRequirements() };
  const normalizedPhone = normalizeIndianPhone(phone);
  if (!normalizedPhone) return { ok: false, reason: 'invalid_phone' };
  if (!publicOrigin || !/^https:\/\//i.test(publicOrigin) && process.env.NODE_ENV === 'production') return { ok: false, reason: 'public_origin_unavailable' };
  if (typeof returnPath !== 'string' || !returnPath.startsWith('/try-on?') || returnPath.length > 500) return { ok: false, reason: 'invalid_return_path' };
  const firstname = String(profile?.display_name || '').trim().slice(0, 60);
  const normalizedEmail = String(email || '').trim().toLowerCase().slice(0, 254);
  if (!firstname || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) return { ok: false, reason: 'profile_required' };

  const payment = await withTransaction(async (client) => {
    const txnid = paymentRef();
    const result = await client.query(
      `INSERT INTO payu_credit_payments
        (payment_id,user_id,request_key,txnid,amount_paise,currency,productinfo,firstname,email,return_path,status)
       VALUES ($1,$2,$3,$4,2000,'INR',$5,$6,$7,$8,'pending')
       ON CONFLICT (user_id,request_key) DO NOTHING RETURNING *`,
      [crypto.randomUUID(), userId, requestKey, txnid, CREDIT_PRODUCT_INFO, firstname, normalizedEmail, returnPath],
    );
    if (result.rowCount) return result.rows[0];
    const existing = await client.query('SELECT * FROM payu_credit_payments WHERE user_id=$1 AND request_key=$2 FOR UPDATE', [userId, requestKey]);
    if (!existing.rowCount) throw new Error('Payment idempotency record could not be read.');
    return existing.rows[0];
  });

  if (payment.status === 'succeeded') return { ok: false, reason: 'already_paid', balance: await getTryOnCreditBalance(userId) };
  if (payment.status !== 'pending') return { ok: false, reason: 'payment_closed' };
  if (payment.firstname !== firstname || payment.email.toLowerCase() !== normalizedEmail || payment.return_path !== returnPath) return { ok: false, reason: 'idempotency_mismatch' };
  return { ok: true, paymentId: payment.payment_id, txnid: payment.txnid, principalKind: 'account', status: payment.status, checkout: formFor(payment, normalizedPhone, publicOrigin) };
}

/** Create a ₹20 PayU order linked to an anonymous cookie identity (no signup/login required). */
export async function createAnonymousCreditPayment({ anonymousId, requestKey, phone, returnPath, publicOrigin }) {
  if (!anonymousId || !validRequestKey(requestKey)) return { ok: false, reason: 'invalid_request' };
  if (!payuProvider.configured) return { ok: false, reason: 'not_configured', requirements: payuRequirements() };
  const normalizedPhone = normalizeIndianPhone(phone);
  // Phone is optional for anonymous Try-On; we allow empty. PayU will still show UPI/QR options.
  const safePhone = normalizedPhone || '';
  if (!publicOrigin || !/^https:\/\//i.test(publicOrigin) && process.env.NODE_ENV === 'production') return { ok: false, reason: 'public_origin_unavailable' };
  if (typeof returnPath !== 'string' || !returnPath.startsWith('/try-on?') || returnPath.length > 500) return { ok: false, reason: 'invalid_return_path' };
  const firstname = 'VIRAAS Guest';
  const normalizedEmail = 'guest@viraas.local';

  const payment = await withTransaction(async (client) => {
    const txnid = paymentRef();
    const result = await client.query(
      `INSERT INTO anonymous_payu_payments
        (payment_id,anonymous_id,request_key,txnid,amount_paise,currency,productinfo,firstname,email,phone,return_path,status)
       VALUES ($1,$2,$3,$4,2000,'INR',$5,$6,$7,$8,$9,'pending')
       ON CONFLICT (anonymous_id,request_key) DO NOTHING RETURNING *`,
      [crypto.randomUUID(), anonymousId, requestKey, txnid, CREDIT_PRODUCT_INFO, firstname, normalizedEmail, safePhone, returnPath],
    );
    if (result.rowCount) return result.rows[0];
    const existing = await client.query('SELECT * FROM anonymous_payu_payments WHERE anonymous_id=$1 AND request_key=$2 FOR UPDATE', [anonymousId, requestKey]);
    if (!existing.rowCount) throw new Error('Payment idempotency record could not be read.');
    return existing.rows[0];
  });

  if (payment.status === 'succeeded') return { ok: false, reason: 'already_paid', balance: await getAnonymousTryOnCreditBalance(anonymousId) };
  if (payment.status !== 'pending') return { ok: false, reason: 'payment_closed' };
  if (payment.return_path !== returnPath) return { ok: false, reason: 'idempotency_mismatch' };
  return { ok: true, paymentId: payment.payment_id, txnid: payment.txnid, principalKind: 'anonymous', status: payment.status, checkout: formFor(payment, safePhone, publicOrigin) };
}

export async function getPayUPaymentForCallback(txnid) {
  // Look in both authenticated and anonymous payment tables; the returned row has a principalKind tag.
  const authResult = await query('SELECT payment_id,user_id,NULL AS anonymous_id,txnid,status,amount_paise,productinfo,firstname,email,return_path FROM payu_credit_payments WHERE txnid=$1 LIMIT 1', [txnid]);
  if (authResult.rowCount) return { ...authResult.rows[0], principalKind: 'account' };
  const anonResult = await query('SELECT payment_id,NULL AS user_id,anonymous_id,txnid,status,amount_paise,productinfo,firstname,email,return_path FROM anonymous_payu_payments WHERE txnid=$1 LIMIT 1', [txnid]);
  if (anonResult.rowCount) return { ...anonResult.rows[0], principalKind: 'anonymous' };
  return null;
}

export async function getPaymentStatusForUser({ txnid, userId }) {
  const result = await query('SELECT txnid,status,amount_paise,created_at,updated_at FROM payu_credit_payments WHERE txnid=$1 AND user_id=$2 LIMIT 1', [txnid, userId]);
  if (!result.rowCount) return null;
  const row = result.rows[0];
  const balance = row.status === 'succeeded' ? await getTryOnCreditBalance(userId) : undefined;
  return { txnid: row.txnid, status: row.status, amountInr: Number(row.amount_paise) / 100, principalKind: 'account', ...(balance === undefined ? {} : { balance }) };
}

export async function getAnonymousPaymentStatus({ txnid, anonymousId }) {
  const result = await query('SELECT txnid,status,amount_paise,created_at,updated_at FROM anonymous_payu_payments WHERE txnid=$1 AND anonymous_id=$2 LIMIT 1', [txnid, anonymousId]);
  if (!result.rowCount) return null;
  const row = result.rows[0];
  const balance = row.status === 'succeeded' ? await getAnonymousTryOnCreditBalance(anonymousId) : undefined;
  return { txnid: row.txnid, status: row.status, amountInr: Number(row.amount_paise) / 100, principalKind: 'anonymous', ...(balance === undefined ? {} : { balance }) };
}

export async function markPayUFailed({ txnid, failureCode = 'payment_failed' }) {
  const safeCode = ['payment_failed', 'payment_cancelled'].includes(failureCode) ? failureCode : 'payment_failed';
  return withTransaction(async (client) => {
    // Try authenticated table first
    const authResult = await client.query('SELECT status FROM payu_credit_payments WHERE txnid=$1 FOR UPDATE', [txnid]);
    if (authResult.rowCount) {
      if (authResult.rows[0].status === 'failed') return { ok: true, duplicate: true, principalKind: 'account' };
      if (authResult.rows[0].status === 'succeeded') return { ok: false, reason: 'already_paid' };
      await client.query("UPDATE payu_credit_payments SET status='failed',failure_code=$2,callback_verified_at=now(),updated_at=now() WHERE txnid=$1 AND status='pending'", [txnid, safeCode]);
      return { ok: true, duplicate: false, principalKind: 'account' };
    }
    const anonResult = await client.query('SELECT status FROM anonymous_payu_payments WHERE txnid=$1 FOR UPDATE', [txnid]);
    if (!anonResult.rowCount) return { ok: false, reason: 'unknown_payment' };
    if (anonResult.rows[0].status === 'failed') return { ok: true, duplicate: true, principalKind: 'anonymous' };
    if (anonResult.rows[0].status === 'succeeded') return { ok: false, reason: 'already_paid' };
    await client.query("UPDATE anonymous_payu_payments SET status='failed',failure_code=$2,callback_verified_at=now(),updated_at=now() WHERE txnid=$1 AND status='pending'", [txnid, safeCode]);
    return { ok: true, duplicate: false, principalKind: 'anonymous' };
  });
}

export async function markPayUSuccess(details) {
  if (!details?.txnid || !details?.payuPaymentId || details.amountPaise !== CREDIT_PRICE_PAISE) return { ok: false, reason: 'payment_mismatch' };
  // Determine whether this payment belongs to an authenticated user or an anonymous identity
  // by checking which table contains the txnid.
  const authCheck = await query('SELECT 1 FROM payu_credit_payments WHERE txnid=$1 LIMIT 1', [details.txnid]);
  if (authCheck.rowCount) return applyVerifiedPayUPurchase(details);
  return applyVerifiedAnonymousPayUPurchase(details);
}

export { amountPaise, payuProvider, validRequestKey };
