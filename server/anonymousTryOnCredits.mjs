// Anonymous Try-On credits are deliberately isolated from viraas_users and its authenticated ledger.
// Only a one-way hash of the random HttpOnly cookie token is stored; photo bytes are never persisted.
import crypto from 'node:crypto';
import { query, withTransaction } from './db/pool.mjs';

export const ANONYMOUS_SIGNUP_TRYON_CREDITS = 2;
export const NO_TRYON_CREDITS_MESSAGE = 'No Try-On credits remaining.';
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

/** Resolve one opaque cookie token to a principal, granting its initial two credits exactly once. */
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
        // Another request with the same cookie created the principal while this transaction waited.
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
    const grantKey = `anonymous-initial:${anonymousId}`;
    const priorGrant = await client.query(
      "SELECT 1 FROM tryon_anonymous_credit_ledger WHERE anonymous_id=$1 AND event_type='initial_grant' LIMIT 1",
      [anonymousId],
    );
    let balance = balanceOf(account.rows[0].balance);
    if (!priorGrant.rowCount) {
      const updated = await client.query(
        'UPDATE tryon_anonymous_credit_accounts SET balance = balance + 2,updated_at=now() WHERE anonymous_id=$1 RETURNING balance',
        [anonymousId],
      );
      balance = balanceOf(updated.rows[0].balance);
      await client.query(
        `INSERT INTO tryon_anonymous_credit_ledger
          (entry_id,anonymous_id,generation_id,event_type,delta,balance_after,idempotency_key)
         VALUES ($1,$2,NULL,'initial_grant',2,$3,$4)`,
        [uuid(), anonymousId, balance, grantKey],
      );
    }
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

async function readBalance(client, anonymousId) {
  const result = await client.query('SELECT balance FROM tryon_anonymous_credit_accounts WHERE anonymous_id=$1', [anonymousId]);
  return balanceOf(result.rows[0]?.balance);
}
