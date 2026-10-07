import crypto from 'node:crypto';
import { query, withTransaction } from './db/pool.mjs';

export const SIGNUP_TRYON_CREDITS = 2;
export const NO_TRYON_CREDITS_MESSAGE = 'No Try-On credits remaining.';
const uuid = () => crypto.randomUUID();
const balanceOf = (value) => Math.max(0, Number(value) || 0);

export class TryOnCreditError extends Error {
  constructor(message = 'Persistent Try-On credits are unavailable.') {
    super(message);
    this.name = 'TryOnCreditError';
    this.code = 'TRYON_CREDIT_LEDGER_UNAVAILABLE';
  }
}

async function readBalance(client, userId) {
  const result = await client.query('SELECT balance FROM tryon_credit_accounts WHERE user_id=$1', [userId]);
  return balanceOf(result.rows[0]?.balance);
}

/** Exactly-once signup grant, called inside profile completion's PostgreSQL transaction. */
export async function grantSignupCreditsInTransaction(client, userId) {
  if (!userId) throw new TryOnCreditError();
  await client.query('INSERT INTO tryon_credit_accounts (user_id,balance) VALUES ($1,0) ON CONFLICT (user_id) DO NOTHING', [userId]);
  const account = await client.query('SELECT balance FROM tryon_credit_accounts WHERE user_id=$1 FOR UPDATE', [userId]);
  if (!account.rowCount) throw new TryOnCreditError();
  const idempotencyKey = `signup:${userId}`;
  const prior = await client.query('SELECT 1 FROM tryon_credit_ledger WHERE idempotency_key=$1', [idempotencyKey]);
  if (prior.rowCount) return balanceOf(account.rows[0].balance);
  const updated = await client.query('UPDATE tryon_credit_accounts SET balance = balance + 2,updated_at=now() WHERE user_id=$1 RETURNING balance', [userId]);
  await client.query(
    `INSERT INTO tryon_credit_ledger (entry_id,user_id,generation_id,event_type,delta,balance_after,idempotency_key)
     VALUES ($1,$2,NULL,'signup_grant',2,$3,$4)`,
    [uuid(), userId, balanceOf(updated.rows[0].balance), idempotencyKey],
  );
  return balanceOf(updated.rows[0].balance);
}

export async function grantSignupCredits(userId) {
  return withTransaction((client) => grantSignupCreditsInTransaction(client, userId));
}

export async function getTryOnCreditBalance(userId) {
  if (!userId) return 0;
  const result = await query('SELECT balance FROM tryon_credit_accounts WHERE user_id=$1', [userId]);
  return balanceOf(result.rows[0]?.balance);
}

/** Atomically reserve one credit before dispatching any Runware request. */
export async function reserveTryOnCredit({ userId, requestKey, outfitId }) {
  if (!userId || typeof requestKey !== 'string' || requestKey.length < 8 || requestKey.length > 128 || !outfitId) throw new TryOnCreditError('A valid account, outfit and idempotency key are required.');
  return withTransaction(async (client) => {
    const account = await client.query('SELECT balance FROM tryon_credit_accounts WHERE user_id=$1 FOR UPDATE', [userId]);
    if (!account.rowCount) return { ok: false, reason: 'no_credits', balance: 0 };
    const existing = await client.query('SELECT generation_id,status FROM tryon_generations WHERE user_id=$1 AND request_key=$2', [userId, requestKey]);
    if (existing.rowCount) return { ok: false, reason: 'duplicate_request', generationId: existing.rows[0].generation_id, status: existing.rows[0].status, balance: balanceOf(account.rows[0].balance) };
    const current = balanceOf(account.rows[0].balance);
    if (current < 1) return { ok: false, reason: 'no_credits', balance: 0 };
    const generationId = uuid();
    const updated = await client.query('UPDATE tryon_credit_accounts SET balance = balance - 1,updated_at=now() WHERE user_id=$1 AND balance>0 RETURNING balance', [userId]);
    if (!updated.rowCount) return { ok: false, reason: 'no_credits', balance: 0 };
    const balance = balanceOf(updated.rows[0].balance);
    await client.query(
      `INSERT INTO tryon_generations (generation_id,user_id,request_key,outfit_id,status)
       VALUES ($1,$2,$3,$4,'reserved')`,
      [generationId, userId, requestKey, String(outfitId).slice(0, 200)],
    );
    await client.query(
      `INSERT INTO tryon_credit_ledger (entry_id,user_id,generation_id,event_type,delta,balance_after,idempotency_key)
       VALUES ($1,$2,$3,'reserve',-1,$4,$5)`,
      [uuid(), userId, generationId, balance, `reserve:${generationId}`],
    );
    return { ok: true, generationId, balance };
  });
}

export async function consumeTryOnCredit({ userId, generationId }) {
  if (!userId || !generationId) throw new TryOnCreditError();
  return withTransaction(async (client) => {
    const generation = await client.query('SELECT status FROM tryon_generations WHERE generation_id=$1 AND user_id=$2 FOR UPDATE', [generationId, userId]);
    if (!generation.rowCount) return { ok: false, reason: 'unknown_generation' };
    if (generation.rows[0].status === 'consumed') return { ok: true, duplicate: true, balance: await readBalance(client, userId) };
    if (generation.rows[0].status !== 'reserved') return { ok: false, reason: 'not_reserved' };
    const updated = await client.query("UPDATE tryon_generations SET status='consumed',updated_at=now() WHERE generation_id=$1 AND user_id=$2 AND status='reserved'", [generationId, userId]);
    if (!updated.rowCount) return { ok: false, reason: 'not_reserved' };
    const balance = await readBalance(client, userId);
    await client.query(
      `INSERT INTO tryon_credit_ledger (entry_id,user_id,generation_id,event_type,delta,balance_after,idempotency_key)
       VALUES ($1,$2,$3,'consume',0,$4,$5)`,
      [uuid(), userId, generationId, balance, `consume:${generationId}`],
    );
    return { ok: true, duplicate: false, balance };
  });
}

export async function releaseTryOnCredit({ userId, generationId, failureCode = 'provider_failure' }) {
  if (!userId || !generationId) throw new TryOnCreditError();
  const safeFailure = ['provider_failure', 'provider_exception'].includes(failureCode) ? failureCode : 'provider_failure';
  return withTransaction(async (client) => {
    const generation = await client.query('SELECT status FROM tryon_generations WHERE generation_id=$1 AND user_id=$2 FOR UPDATE', [generationId, userId]);
    if (!generation.rowCount) return { ok: false, reason: 'unknown_generation' };
    if (generation.rows[0].status === 'released') return { ok: true, duplicate: true, balance: await readBalance(client, userId) };
    if (generation.rows[0].status !== 'reserved') return { ok: false, reason: 'not_reserved' };
    const account = await client.query('UPDATE tryon_credit_accounts SET balance = balance + 1,updated_at=now() WHERE user_id=$1 RETURNING balance', [userId]);
    if (!account.rowCount) throw new TryOnCreditError();
    const balance = balanceOf(account.rows[0].balance);
    const updated = await client.query("UPDATE tryon_generations SET status='released',failure_code=$2,updated_at=now() WHERE generation_id=$1 AND user_id=$3 AND status='reserved'", [generationId, safeFailure, userId]);
    if (!updated.rowCount) throw new TryOnCreditError();
    await client.query(
      `INSERT INTO tryon_credit_ledger (entry_id,user_id,generation_id,event_type,delta,balance_after,idempotency_key)
       VALUES ($1,$2,$3,'release',1,$4,$5)`,
      [uuid(), userId, generationId, balance, `release:${generationId}`],
    );
    return { ok: true, duplicate: false, balance };
  });
}

/** Apply one verified PayU capture and exactly one credit in the same database transaction. */
export async function applyVerifiedPayUPurchase({ txnid, payuPaymentId, amountPaise, productinfo, firstname, email }) {
  if (!txnid || !payuPaymentId || Number(amountPaise) !== 2000) throw new TryOnCreditError('Verified PayU payment details are invalid.');
  return withTransaction(async (client) => {
    const paymentResult = await client.query('SELECT * FROM payu_credit_payments WHERE txnid=$1 FOR UPDATE', [txnid]);
    if (!paymentResult.rowCount) return { ok: false, reason: 'unknown_payment' };
    const payment = paymentResult.rows[0];
    if (payment.status === 'succeeded') return { ok: true, duplicate: true, balance: await readBalance(client, payment.user_id) };
    if (payment.status !== 'pending' || Number(payment.amount_paise) !== 2000 || Number(amountPaise) !== Number(payment.amount_paise)
      || payment.productinfo !== productinfo || payment.firstname !== firstname || payment.email.toLowerCase() !== String(email).toLowerCase()) {
      return { ok: false, reason: 'payment_mismatch' };
    }

    await client.query('INSERT INTO tryon_credit_accounts (user_id,balance) VALUES ($1,0) ON CONFLICT (user_id) DO NOTHING', [payment.user_id]);
    const account = await client.query('SELECT balance FROM tryon_credit_accounts WHERE user_id=$1 FOR UPDATE', [payment.user_id]);
    const existingCapture = await client.query('SELECT user_id FROM payu_credit_payments WHERE payu_payment_id=$1 AND txnid<>$2', [payuPaymentId, txnid]);
    if (existingCapture.rowCount) return { ok: false, reason: 'payment_replayed' };

    const updatedPayment = await client.query(
      `UPDATE payu_credit_payments SET status='succeeded',payu_payment_id=$2,callback_verified_at=now(),updated_at=now()
       WHERE txnid=$1 AND status='pending' RETURNING payment_id`,
      [txnid, payuPaymentId],
    );
    if (!updatedPayment.rowCount) return { ok: false, reason: 'payment_already_processed' };
    const updatedAccount = await client.query('UPDATE tryon_credit_accounts SET balance = balance + 1,updated_at=now() WHERE user_id=$1 RETURNING balance', [payment.user_id]);
    const balance = balanceOf(updatedAccount.rows[0].balance);
    await client.query(
      `INSERT INTO tryon_credit_ledger (entry_id,user_id,generation_id,event_type,delta,balance_after,idempotency_key)
       VALUES ($1,$2,NULL,'payu_purchase',1,$3,$4)`,
      [uuid(), payment.user_id, balance, `payu:${payuPaymentId}`],
    );
    return { ok: true, duplicate: false, balance };
  });
}
