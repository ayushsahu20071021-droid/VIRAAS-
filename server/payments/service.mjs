// VIRAAS payment SERVICE — the provider-agnostic business layer that the HTTP routes call.
//
// It composes the abstract gateway adapter (./providers.mjs) with the authorization store
// (./store.mjs) and exposes the five conceptual operations the architecture requires:
//
//   createPayment()    create a PENDING payment + gateway order (no money moves in this task)
//   verifyPayment()    SERVER-SIDE verification via a gateway poll (fallback to the webhook)
//   handleWebhook()    verify a signed gateway webhook, then mark VERIFIED + mint ONE authorization
//   getPaymentStatus() read-only status for the paying client (reveals the token only when AUTHORIZED)
//   authorizeTryOn()   idempotently mint the single one-time Try-On authorization for a verified payment
//
// Plus claimForGeneration()/failGeneration() used by the Try-On route to consume the single
// authorization atomically and to preserve a recoverable state on genuine failure.
//
// BUSINESS MODEL: the customer pays VIRAAS. Runware is VIRAAS's AI provider and is billed to the
// VIRAAS Runware account by usage. There is NO customer<->Runware payment anywhere in this flow.
//
// Pricing is configuration only (TRYON_PRICE_INR). No margin/profit math is computed here.

import { paymentProvider, paymentProviderName, paymentProviderConfigured } from './providers.mjs';
import * as store from './store.mjs';

export const PRICE_INR = Number(process.env.TRYON_PRICE_INR || 20);
export const CURRENCY = (process.env.TRYON_CURRENCY || 'INR').toUpperCase();
// Whether a real Try-On requires a verified, paid, one-time authorization. This configuration flag
// cannot enable generation while persistent identity/credits and payment verification are unavailable.
export const paymentRequired = (process.env.TRYON_PAYMENT_REQUIRED || 'false').toLowerCase() === 'true';
// The current payment store is process-memory only, so it must never back a production payment flow.
export const paymentStorePersistent = false;
// The mock gateway is permitted only in an explicitly opted-in, non-production test process.
export const mockPaymentTestsAllowed = process.env.NODE_ENV !== 'production' && process.env.ALLOW_MOCK_PAYMENTS === 'true';

export const paymentConfig = {
  provider: paymentProviderName,
  configured: paymentProviderConfigured, // true only when a REAL gateway has credentials
  paymentRequired,
  priceInr: PRICE_INR,
  currency: CURRENCY,
};

// 1) createPayment — begin a payment. Creates a PENDING record and a gateway order. Returns only
//    browser-safe fields (paymentId capability + checkout descriptor). Never trusts client status.
export async function createPayment({ outfitId } = {}) {
  const rec = store.createRecord({ amountInr: PRICE_INR, currency: CURRENCY, outfitId, provider: paymentProviderName });
  let checkout = null;
  let gatewayOrderId = null;
  try {
    const order = await paymentProvider.createOrder({ paymentId: rec.paymentId, amountInr: PRICE_INR, currency: CURRENCY, outfitId });
    gatewayOrderId = order.gatewayOrderId;
    checkout = order.checkout;
    rec.gatewayOrderId = gatewayOrderId;
  } catch (e) {
    return { ok: false, reason: 'gateway_unavailable', message: e?.message || 'Payment gateway is not available.' };
  }
  return { ok: true, paymentId: rec.paymentId, amountInr: PRICE_INR, currency: CURRENCY, status: rec.status, provider: paymentProviderName, checkout };
}

// 2) verifyPayment — optional SERVER-SIDE poll of the gateway. On a verified result, mark VERIFIED
//    and mint the single authorization (idempotent). This never accepts a client-asserted success.
export async function verifyPayment({ paymentId }) {
  const rec = store.getRecord(paymentId);
  if (!rec) return { ok: false, reason: 'unknown_payment' };
  const res = await paymentProvider.verifyPayment({ gatewayOrderId: rec.gatewayOrderId });
  if (!res.verified) return { ok: false, reason: res.reason || 'not_verified', status: rec.status };
  store.markVerified(paymentId);
  store.authorize(paymentId);
  return { ok: true, status: store.getRecord(paymentId).status };
}

// 3) handleWebhook — the gateway's server-to-server callback. Verify the signature via the adapter,
//    then (and only then) mark VERIFIED and authorize. Idempotent: a duplicate/redelivered webhook
//    does NOT create a second authorization.
export function handleWebhook({ rawBody, headers }) {
  const check = paymentProvider.verifyWebhook({ rawBody, headers });
  if (!check.verified) return { ok: false, reason: check.reason || 'invalid_signature' };
  const paymentId = check.paymentId;
  const rec = store.getRecord(paymentId);
  if (!rec) return { ok: false, reason: 'unknown_payment' };
  const verified = store.markVerified(paymentId, { eventId: check.eventId });
  const auth = store.authorize(paymentId);
  return { ok: true, status: store.getRecord(paymentId).status, duplicate: Boolean(verified.duplicate || auth.duplicate) };
}

// 4) getPaymentStatus — read-only. Reveals the one-time authToken only when AUTHORIZED and only to a
//    caller presenting the (unguessable) paymentId capability.
export function getPaymentStatus({ paymentId }) {
  const v = store.view(paymentId, { includeToken: true });
  if (!v) return { ok: false, reason: 'unknown_payment' };
  return { ok: true, ...v };
}

// 5) authorizeTryOn — idempotently ensure a verified payment has exactly one authorization. Safe to
//    call multiple times; returns the same authorization. Requires the payment to be VERIFIED first.
export function authorizeTryOn({ paymentId }) {
  const rec = store.getRecord(paymentId);
  if (!rec) return { ok: false, reason: 'unknown_payment' };
  const res = store.authorize(paymentId);
  if (!res.ok) return { ok: false, reason: res.reason };
  return { ok: true, status: res.record.status };
}

// --- Generation-time helpers used by the /api/try-on route -----------------------------------

// Atomically claim the single authorization. ok:true for exactly one caller; ok:false thereafter.
export function claimForGeneration({ authToken }) {
  return store.claimForGeneration(authToken);
}

// Record a genuine post-payment generation failure WITHOUT faking success and WITHOUT losing the
// paid authorization (state -> FAILED + recoverable, retaining paymentId for refund/credit later).
export function failGeneration({ generationId, reason }) {
  return store.markFailed(generationId, reason);
}

export { store };
