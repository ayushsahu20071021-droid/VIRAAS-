// Anonymous Try-On credits are deliberately isolated from viraas_users and its authenticated ledger.
// Only a one-way hash of the random HttpOnly cookie token is stored; photo bytes are never persisted.
// Every Try-On costs exactly ₹20 INR via PayU; there are NO free credits. A successful PayU
// callback grants exactly +1 credit; if Runware fails the reserved credit is released so the
// anonymous user can retry without paying again.
import crypto from 'node:crypto';
import { query, withTransaction } from './db/pool.mjs';

export const ANONYMOUS_SIGNUP_TRYON_CREDITS = 0; // No free Try-On credits. Every Try-On costs ₹20.
export const NO_TRYON_CREDITS_MESSAGE = 'No Try-On credits remaining. Pay ₹20 to start your Try-On.';
const uuid = () => crypto.randomUUID();
const balanceOf = (value) => Math.max(0, Number(value) || 0);
const TOKEN_HASH_RE = /^[a-f0-9]{64}$/;

export class AnonymousTryOnCreditError extends Error {
  constructor(message = 'Persistent anonymous Try-On credits are unavailable.') {
    super(message);
    this.name = 'AnonymousTryOnCreditError';
    this.code = 'ANONYMOUS_TRYON_LEDGER_UNAVAILABLE';
  }
}

/** Resolve one opaque cookie token to a principal. Balances start at zero; credit is added only
 *  after a server-verified ₹20 PayU payment. No free credits are ever granted. */
export async function ensureAnonymousTryOnAccount(tokenHash) {
  if (typeof tokenHash !== 'string' || !TOKEN_HASH_RE.test(tokenHash)) throw new AnonymousTryOnCreditError('Anonymous Try-On identity is invalid.');
  return withTransaction(async (client) => {
    let identity = await client.query(
      'SELECT anonymous_id,expires_at FROM tryon_anonymous_identities WHERE token_hash=$1 FOR UPDATE',
      [tokenHash],
    );
    let anonymousId;
    if (identity.rowCount) {
      if (new Date(identity.rows[0].expires_at).getTime() <= Date.now()) return { ok: false, reason: 'expired' };
      anonymousId = identity.rows[0].anonymous_id;
      const expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
      await client.query('UPDATE tryon_anonymous_identities SET last_seen_at=now(),expires_at=$2 WHERE anonymous_id=$1', [anonymousId, expiresAt]);
    } else {
      const candidateId = uuid();
      const expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
      const inserted = await client.query(
        `INSERT INTO tryon_anonymous_identities (anonymous_id,token_hash,expires_at)
         VALUES ($1,$2,$3) ON CONFLICT (token_hash) DO NOTHING RETURNING anonymous_id`,
        [candidateId, tokenHash, expiresAt],
      );
      if (inserted.rowCount) {
        anonymousId = inserted.rows[0].anonymous_id;
      } else {
        identity = await client.query(
          'SELECT anonymous_id,expires_at FROM tryon_anonymous_identities WHERE token_hash=$1 FOR UPDATE',
          [tokenHash],
        );
        if (!identity.rowCount) throw new AnonymousTryOnCreditError();
        if (new Date(identity.rows[0].expires_at).getTime() <= Date.now()) return { ok: false, reason: 'expired' };
        anonymousId = identity.rows[0].anonymous_id;
        await client.query('UPDATE tryon_anonymous_identities SET last_seen_at=now(),expires_at=$2 WHERE anonymous_id=$1', [anonymousId, expiresAt]);
      }
    }

    await client.query(
      'INSERT INTO tryon_anonymous_credit_accounts (anonymous_id,balance) VALUES ($1,0) ON CONFLICT (anonymous_id) DO NOTHING',
      [anonymousId],
    );
    const account = await client.query('SELECT balance FROM tryon_anonymous_credit_accounts WHERE anonymous_id=$1 FOR UPDATE', [anonymousId]);
    if (!account.rowCount) throw new AnonymousTryOnCreditError();
    // No initial_grant: new anonymous identities start with 0 credits.
    // Any pre-existing initial_grant ledger entry from migration 004 is left intact for historical
    // records but is never created for new anonymous identities going forward.
    const balance = balanceOf(account.rows[0].balance);
    return { ok: true, anonymousId, balance };
  });
}

export async function getAnonymousTryOnCreditBalance(anonymousId) {
  if (!anonymousId) return 0;
  const result = await query('SELECT balance FROM tryon_anonymous_credit_accounts WHERE anonymous_id=$1', [anonymousId]);
  return balanceOf(result.rows[0]?.balance);
}

/** Reserve atomically before Runware; the account row lock serializes concurrent requests. */
export async function reserveAnonymousTryOnCredit({ anonymousId, requestKey, outfitId }) {
  if (!anonymousId || typeof requestKey !== 'string' || requestKey.length < 8 || requestKey.length > 128 || !outfitId) {
    throw new AnonymousTryOnCreditError('A valid anonymous account, outfit and idempotency key are required.');
  }
  return withTransaction(async (client) => {
    const account = await client.query('SELECT balance FROM tryon_anonymous_credit_accounts WHERE anonymous_id=$1 FOR UPDATE', [anonymousId]);
    if (!account.rowCount) throw new AnonymousTryOnCreditError();
    const existing = await client.query(
      'SELECT generation_id,status FROM tryon_anonymous_generations WHERE anonymous_id=$1 AND request_key=$2',
      [anonymousId, requestKey],
    );
    if (existing.rowCount) {
      return {
        ok: false, reason: 'duplicate_request', generationId: existing.rows[0].generation_id,
        status: existing.rows[0].status, balance: balanceOf(account.rows[0].balance),
      };
    }
    if (balanceOf(account.rows[0].balance) < 1) {
      return { ok: false, reason: 'no_credits', balance: 0, message: NO_TRYON_CREDITS_MESSAGE };
    }
    const updated = await client.query(
      'UPDATE tryon_anonymous_credit_accounts SET balance = balance - 1,updated_at=now() WHERE anonymous_id=$1 AND balance>0 RETURNING balance',
      [anonymousId],
    );
    if (!updated.rowCount) return { ok: false, reason: 'no_credits', balance: 0, message: NO_TRYON_CREDITS_MESSAGE };
    const generationId = uuid();
    const balance = balanceOf(updated.rows[0].balance);
    await client.query(
      `INSERT INTO tryon_anonymous_generations (generation_id,anonymous_id,request_key,outfit_id,status)
       VALUES ($1,$2,$3,$4,'reserved')`,
      [generationId, anonymousId, requestKey, String(outfitId).slice(0, 200)],
    );
    await client.query(
      `INSERT INTO tryon_anonymous_credit_ledger
        (entry_id,anonymous_id,generation_id,event_type,delta,balance_after,idempotency_key)
       VALUES ($1,$2,$3,'reserve',-1,$4,$5)`,
      [uuid(), anonymousId, generationId, balance, `anonymous-reserve:${generationId}`],
    );
    return { ok: true, generationId, balance };
  });
}

export async function consumeAnonymousTryOnCredit({ anonymousId, generationId }) {
  if (!anonymousId || !generationId) throw new AnonymousTryOnCreditError();
  return withTransaction(async (client) => {
    const generation = await client.query(
      'SELECT status FROM tryon_anonymous_generations WHERE generation_id=$1 AND anonymous_id=$2 FOR UPDATE',
      [generationId, anonymousId],
    );
    if (!generation.rowCount) return { ok: false, reason: 'unknown_generation' };
    if (generation.rows[0].status === 'consumed') {
      return { ok: true, duplicate: true, balance: await readBalance(client, anonymousId) };
    }
    if (generation.rows[0].status !== 'reserved') return { ok: false, reason: 'not_reserved' };
    const updated = await client.query(
      "UPDATE tryon_anonymous_generations SET status='consumed',updated_at=now() WHERE generation_id=$1 AND anonymous_id=$2 AND status='reserved'",
      [generationId, anonymousId],
    );
    if (!updated.rowCount) return { ok: false, reason: 'not_reserved' };
    const balance = await readBalance(client, anonymousId);
    await client.query(
      `INSERT INTO tryon_anonymous_credit_ledger
        (entry_id,anonymous_id,generation_id,event_type,delta,balance_after,idempotency_key)
       VALUES ($1,$2,$3,'consume',0,$4,$5)`,
      [uuid(), anonymousId, generationId, balance, `anonymous-consume:${generationId}`],
    );
    return { ok: true, duplicate: false, balance };
  });
}

export async function releaseAnonymousTryOnCredit({ anonymousId, generationId, failureCode = 'provider_failure' }) {
  if (!anonymousId || !generationId) throw new AnonymousTryOnCreditError();
  const safeFailure = ['provider_failure', 'provider_exception'].includes(failureCode) ? failureCode : 'provider_failure';
  return withTransaction(async (client) => {
    const generation = await client.query(
      'SELECT status FROM tryon_anonymous_generations WHERE generation_id=$1 AND anonymous_id=$2 FOR UPDATE',
      [generationId, anonymousId],
    );
    if (!generation.rowCount) return { ok: false, reason: 'unknown_generation' };
    if (generation.rows[0].status === 'released') {
      return { ok: true, duplicate: true, balance: await readBalance(client, anonymousId) };
    }
    if (generation.rows[0].status !== 'reserved') return { ok: false, reason: 'not_reserved' };
    const account = await client.query(
      'UPDATE tryon_anonymous_credit_accounts SET balance = balance + 1,updated_at=now() WHERE anonymous_id=$1 RETURNING balance',
      [anonymousId],
    );
    if (!account.rowCount) throw new AnonymousTryOnCreditError();
    const balance = balanceOf(account.rows[0].balance);
    const updated = await client.query(
      "UPDATE tryon_anonymous_generations SET status='released',failure_code=$2,updated_at=now() WHERE generation_id=$1 AND anonymous_id=$3 AND status='reserved'",
      [generationId, safeFailure, anonymousId],
    );
    if (!updated.rowCount) throw new AnonymousTryOnCreditError();
    await client.query(
      `INSERT INTO tryon_anonymous_credit_ledger
        (entry_id,anonymous_id,generation_id,event_type,delta,balance_after,idempotency_key)
       VALUES ($1,$2,$3,'release',1,$4,$5)`,
      [uuid(), anonymousId, generationId, balance, `anonymous-release:${generationId}`],
    );
    return { ok: true, duplicate: false, balance };
  });
}

/** Apply one verified ₹20 PayU capture to an anonymous identity and grant exactly one credit
 *  in the same database transaction. Replays are idempotent (never double-grant). */
export async function applyVerifiedAnonymousPayUPurchase({ txnid, payuPaymentId, amountPaise, productinfo, firstname, email }) {
  if (!txnid || !payuPaymentId || Number(amountPaise) !== 2000) throw new AnonymousTryOnCreditError('Verified PayU payment details are invalid.');
  return withTransaction(async (client) => {
    const paymentResult = await client.query('SELECT * FROM anonymous_payu_payments WHERE txnid=$1 FOR UPDATE', [txnid]);
    if (!paymentResult.rowCount) return { ok: false, reason: 'unknown_payment' };
    const payment = paymentResult.rows[0];
    if (payment.status === 'succeeded') return { ok: true, duplicate: true, balance: await readBalance(client, payment.anonymous_id) };
    if (payment.status !== 'pending' || Number(payment.amount_paise) !== 2000 || Number(amountPaise) !== Number(payment.amount_paise)
      || payment.productinfo !== productinfo || payment.firstname !== firstname || payment.email.toLowerCase() !== String(email).toLowerCase()) {
      return { ok: false, reason: 'payment_mismatch' };
    }

    await client.query('INSERT INTO tryon_anonymous_credit_accounts (anonymous_id,balance) VALUES ($1,0) ON CONFLICT (anonymous_id) DO NOTHING', [payment.anonymous_id]);
    const account = await client.query('SELECT balance FROM tryon_anonymous_credit_accounts WHERE anonymous_id=$1 FOR UPDATE', [payment.anonymous_id]);
    if (!account.rowCount) throw new AnonymousTryOnCreditError();
    const existingCapture = await client.query('SELECT anonymous_id FROM anonymous_payu_payments WHERE payu_payment_id=$1 AND txnid<>$2', [payuPaymentId, txnid]);
    if (existingCapture.rowCount) return { ok: false, reason: 'payment_replayed' };

    const updatedPayment = await client.query(
      `UPDATE anonymous_payu_payments SET status='succeeded',payu_payment_id=$2,callback_verified_at=now(),updated_at=now()
       WHERE txnid=$1 AND status='pending' RETURNING payment_id`,
      [txnid, payuPaymentId],
    );
    if (!updatedPayment.rowCount) return { ok: false, reason: 'payment_already_processed' };
    const updatedAccount = await client.query('UPDATE tryon_anonymous_credit_accounts SET balance = balance + 1,updated_at=now() WHERE anonymous_id=$1 RETURNING balance', [payment.anonymous_id]);
    const balance = balanceOf(updatedAccount.rows[0].balance);
    await client.query(
      `INSERT INTO tryon_anonymous_credit_ledger (entry_id,anonymous_id,generation_id,event_type,delta,balance_after,idempotency_key)
       VALUES ($1,$2,NULL,'payu_purchase',1,$3,$4)`,
      [uuid(), payment.anonymous_id, balance, `anonymous-payu:${payuPaymentId}`],
    );
    return { ok: true, duplicate: false, balance, anonymousId: payment.anonymous_id };
  });
}

async function readBalance(client, anonymousId) {
  const result = await client.query('SELECT balance FROM tryon_anonymous_credit_accounts WHERE anonymous_id=$1', [anonymousId]);
  return balanceOf(result.rows[0]?.balance);
}
