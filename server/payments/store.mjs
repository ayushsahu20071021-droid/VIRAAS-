// VIRAAS payment + one-time Try-On authorization store.
//
// This is the single source of truth for the lifecycle that connects a customer's payment to a
// SINGLE authorized Runware generation. It is intentionally provider-agnostic: the payment gateway
// (Razorpay / Cashfree / mock) lives in ./providers.mjs and only ever *reports verified facts* into
// this store. Nothing here trusts the browser.
//
// Storage note: this reference implementation keeps records in memory (a Map). That is correct and
// safe for a single-process deployment and for the mock/local tests. For a multi-instance production
// deployment this Map must be swapped for a shared, atomic store (e.g. Redis/Postgres) — the
// interface below (create / markVerified / authorize / claimForGeneration / markFailed) is written so
// that swap is a drop-in. No customer photo, base64, or gateway secret is ever stored here.
//
// Authorization lifecycle (one record per payment):
//   PENDING     payment created, customer has not paid yet
//   VERIFIED    the gateway confirmed payment SERVER-SIDE (webhook or server poll) — never the client
//   AUTHORIZED  a single one-time Try-On authorization has been minted (an authToken exists)
//   CONSUMED    the authorization was claimed by exactly one generation (Runware may still be running)
//   FAILED      generation genuinely failed after payment — RECOVERABLE (owed a refund/credit later)
//
// Guarantees enforced here:
//   * A duplicate webhook does NOT create a second authorization (authorize() is idempotent).
//   * A duplicate generation request does NOT double-consume (claimForGeneration() is atomic).
//   * A genuine Runware failure after payment is NOT lost — the record becomes FAILED+recoverable,
//     retaining the paymentId so a refund/credit can be reconciled once a real gateway is chosen.

import crypto from 'node:crypto';

export const AuthState = Object.freeze({
  PENDING: 'PENDING',
  VERIFIED: 'VERIFIED',
  AUTHORIZED: 'AUTHORIZED',
  CONSUMED: 'CONSUMED',
  FAILED: 'FAILED',
});

// paymentId -> record
const records = new Map();
// authToken -> paymentId (reverse index for O(1) generation-time lookup by the secret token)
const tokenIndex = new Map();

const now = () => Date.now();
const newId = (prefix) => `${prefix}_${crypto.randomUUID()}`;
// A high-entropy secret the paying client presents to redeem its single generation.
const newToken = () => crypto.randomBytes(24).toString('base64url');

// A browser-safe projection of a record. NEVER leaks the raw authToken except at authorize()/status
// time to the client that owns the (unguessable) paymentId, and never leaks gateway secrets.
function publicView(r, { includeToken = false } = {}) {
  if (!r) return null;
  return {
    paymentId: r.paymentId,
    provider: r.provider,
    amountInr: r.amountInr,
    currency: r.currency,
    outfitId: r.outfitId,
    status: r.status,
    authorized: r.status === AuthState.AUTHORIZED,
    consumed: r.status === AuthState.CONSUMED,
    recoverable: Boolean(r.recoverable),
    // The one-time token is only revealed once the payment is genuinely AUTHORIZED, and only to a
    // caller that already holds the unguessable paymentId (i.e. the paying client).
    authToken: includeToken && r.status === AuthState.AUTHORIZED ? r.authToken : undefined,
  };
}

// Create a PENDING record when a payment is initiated. gatewayOrderId is filled by the provider.
export function createRecord({ amountInr, currency = 'INR', outfitId, provider, gatewayOrderId = null }) {
  const paymentId = newId('pay');
  const record = {
    paymentId,
    provider,
    gatewayOrderId,
    amountInr,
    currency,
    outfitId: outfitId || null,
    status: AuthState.PENDING,
    authId: null,
    authToken: null,
    generationId: null,
    recoverable: false,
    processedWebhookEvents: new Set(), // idempotency guard for repeated webhook deliveries
    createdAt: now(),
    verifiedAt: null,
    authorizedAt: null,
    consumedAt: null,
    failedAt: null,
    lastFailureReason: null,
  };
  records.set(paymentId, record);
  return record;
}

export function getRecord(paymentId) {
  return records.get(paymentId) || null;
}

export function getByToken(authToken) {
  if (!authToken) return null;
  const paymentId = tokenIndex.get(authToken);
  return paymentId ? records.get(paymentId) || null : null;
}

// Mark a payment VERIFIED from a SERVER-SIDE verified fact (webhook signature or server poll).
// Idempotent: repeated calls (duplicate webhooks) do not regress or duplicate state.
// `eventId` (when present) is de-duplicated so a redelivered webhook is a no-op.
export function markVerified(paymentId, { eventId = null } = {}) {
  const r = records.get(paymentId);
  if (!r) return { ok: false, reason: 'unknown_payment' };
  if (eventId) {
    if (r.processedWebhookEvents.has(eventId)) return { ok: true, record: r, duplicate: true };
    r.processedWebhookEvents.add(eventId);
  }
  if (r.status === AuthState.PENDING) {
    r.status = AuthState.VERIFIED;
    r.verifiedAt = now();
  }
  // If already VERIFIED/AUTHORIZED/CONSUMED/FAILED, keep the stronger state (idempotent).
  return { ok: true, record: r };
}

// Mint EXACTLY ONE one-time Try-On authorization for a verified payment. Idempotent: calling it
// again for the same payment returns the SAME authorization/token, never a second one. This is what
// prevents a duplicate webhook (verify -> authorize) from creating a duplicate authorization.
export function authorize(paymentId) {
  const r = records.get(paymentId);
  if (!r) return { ok: false, reason: 'unknown_payment' };
  if (r.status === AuthState.PENDING) return { ok: false, reason: 'not_verified' };
  if (r.status === AuthState.AUTHORIZED) return { ok: true, record: r, duplicate: true };
  // Already consumed or failed — do not re-mint a token for a spent authorization.
  if (r.status === AuthState.CONSUMED || r.status === AuthState.FAILED)
    return { ok: false, reason: 'already_used', record: r };
  // VERIFIED -> AUTHORIZED (mint the single token exactly once).
  r.authId = newId('auth');
  r.authToken = newToken();
  r.status = AuthState.AUTHORIZED;
  r.authorizedAt = now();
  tokenIndex.set(r.authToken, paymentId);
  return { ok: true, record: r };
}

// Atomically claim the single authorization for a generation. Returns ok:true for EXACTLY ONE
// caller; every subsequent call (duplicate generation request / double click / retry) gets
// ok:false. The state moves AUTHORIZED -> CONSUMED *before* Runware is called, so a second request
// can never trigger a second Runware generation from the same paid authorization.
export function claimForGeneration(authToken) {
  const r = getByToken(authToken);
  if (!r) return { ok: false, reason: 'invalid_token' };
  if (r.status === AuthState.CONSUMED) return { ok: false, reason: 'already_consumed', record: r };
  if (r.status === AuthState.FAILED) return { ok: false, reason: 'failed', record: r };
  if (r.status !== AuthState.AUTHORIZED) return { ok: false, reason: 'not_authorized', record: r };
  // Compare-and-swap: this single synchronous transition is the concurrency guard. We keep the
  // token mapped (its record is now CONSUMED, so a replay is rejected above with a precise reason)
  // rather than deleting it, so repeat presentations get a clear "already used" error.
  r.status = AuthState.CONSUMED;
  r.consumedAt = now();
  r.generationId = newId('gen');
  return { ok: true, record: r, generationId: r.generationId };
}

// A generation that had CLAIMED the authorization genuinely failed (e.g. Runware error). We do NOT
// fake success and we do NOT silently drop the paid authorization: the record becomes FAILED and
// recoverable, retaining paymentId/generationId for later refund/credit reconciliation. We do NOT
// auto-revert to AUTHORIZED — that would allow a second Runware call against a single payment.
export function markFailed(generationId, reason = 'generation_failed') {
  for (const r of records.values()) {
    if (r.generationId === generationId) {
      r.status = AuthState.FAILED;
      r.failedAt = now();
      r.recoverable = true;
      r.lastFailureReason = String(reason).slice(0, 200);
      return { ok: true, record: r };
    }
  }
  return { ok: false, reason: 'unknown_generation' };
}

export function view(paymentId, opts) {
  return publicView(records.get(paymentId), opts);
}

// Test/diagnostic helpers only (never exposed over HTTP).
export function _reset() {
  records.clear();
  tokenIndex.clear();
}
export function _all() {
  return [...records.values()];
}
