// VIRAAS payment GATEWAY adapters — provider-agnostic.
//
// The rest of the app never imports a specific gateway. It talks to the abstract shape below, so
// Razorpay OR Cashfree (or any other gateway) can be plugged in later by only editing this file.
// No gateway is hard-coded into the flow and NO real credentials are required for this task.
//
// A gateway adapter implements:
//   name
//   configured                      -> boolean: are real credentials present?
//   async createOrder({ paymentId, amountInr, currency, outfitId })
//        -> { gatewayOrderId, checkout }   // `checkout` is browser-safe (public key/order id only)
//   verifyWebhook({ rawBody, headers })
//        -> { verified, paymentId?, gatewayOrderId?, eventId?, reason? }  // SERVER-SIDE signature check
//   async verifyPayment({ gatewayOrderId })
//        -> { verified, reason? }          // optional server-side poll (fallback to webhook)
//
// SECURITY: a gateway adapter is the ONLY thing allowed to assert `verified: true`, and only after a
// cryptographic signature / server-side check. A raw client claim like { paymentSuccess: true } is
// never accepted anywhere.

import crypto from 'node:crypto';

const PROVIDER = (process.env.PAYMENT_PROVIDER || 'mock').toLowerCase();

// ---------------------------------------------------------------------------
// MOCK gateway — for local/mock tests ONLY. It performs NO network calls and moves NO real money.
// It signs its "webhook" with HMAC-SHA256 over a shared secret so we can exercise the exact
// server-side signature-verification path a real gateway uses. Enabled only when
// PAYMENT_PROVIDER=mock (the default while no real gateway is chosen).
// ---------------------------------------------------------------------------
const MOCK_SECRET = process.env.MOCK_PAYMENT_SECRET || 'mock-webhook-secret-dev-only';

function mockSign(payloadString) {
  return crypto.createHmac('sha256', MOCK_SECRET).update(payloadString).digest('hex');
}

const mockProvider = {
  name: 'mock',
  // The mock is a *test harness*, never a real gateway. It never reports itself as a configured
  // production payment provider, so real payment collection is never implied.
  get configured() {
    return false;
  },
  async createOrder({ paymentId, amountInr, currency }) {
    // No network, no money. Returns a synthetic order id + browser-safe checkout descriptor.
    const gatewayOrderId = `mock_order_${crypto.randomUUID()}`;
    return {
      gatewayOrderId,
      checkout: { provider: 'mock', gatewayOrderId, amountInr, currency, note: 'MOCK — no real payment is collected.' },
    };
  },
  // Verify a mock webhook exactly like a real one: recompute the HMAC over the raw body and compare.
  verifyWebhook({ rawBody, headers }) {
    const signature = headers?.['x-mock-signature'] || headers?.['X-Mock-Signature'];
    if (!signature) return { verified: false, reason: 'missing_signature' };
    const raw = typeof rawBody === 'string' ? rawBody : JSON.stringify(rawBody);
    const expected = mockSign(raw);
    // Constant-time comparison to avoid signature timing oracles.
    const a = Buffer.from(signature);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return { verified: false, reason: 'bad_signature' };
    let evt;
    try {
      evt = typeof rawBody === 'string' ? JSON.parse(rawBody) : rawBody;
    } catch {
      return { verified: false, reason: 'bad_payload' };
    }
    if (evt?.event !== 'payment.captured' && evt?.status !== 'paid') return { verified: false, reason: 'not_a_success_event' };
    return { verified: true, paymentId: evt.paymentId, gatewayOrderId: evt.gatewayOrderId, eventId: evt.eventId || null };
  },
  async verifyPayment() {
    // The mock has no server to poll; verification happens via the signed webhook path above.
    return { verified: false, reason: 'mock_uses_webhook' };
  },
  // Test-only helper so the harness can produce a correctly-signed webhook.
  _signForTest(payloadObject) {
    const raw = JSON.stringify(payloadObject);
    return { rawBody: raw, headers: { 'x-mock-signature': mockSign(raw) } };
  },
};

// ---------------------------------------------------------------------------
// RAZORPAY adapter — STUB. Wiring points are documented; NO credentials, NO SDK, NO network calls
// are added by this task (Razorpay onboarding is unresolved). When ready, implement createOrder via
// the Orders API and verifyWebhook via X-Razorpay-Signature (HMAC-SHA256 of the raw body with the
// webhook secret). Until keys exist it reports NOT configured and never asserts a verified payment.
// ---------------------------------------------------------------------------
const razorpayProvider = {
  name: 'razorpay',
  get configured() {
    return Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET && process.env.RAZORPAY_WEBHOOK_SECRET);
  },
  async createOrder() {
    throw new Error('Razorpay is not configured yet (set RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET / RAZORPAY_WEBHOOK_SECRET and implement Orders API).');
  },
  verifyWebhook() {
    // Must verify X-Razorpay-Signature = HMAC_SHA256(rawBody, RAZORPAY_WEBHOOK_SECRET) before trusting.
    return { verified: false, reason: 'razorpay_not_configured' };
  },
  async verifyPayment() {
    return { verified: false, reason: 'razorpay_not_configured' };
  },
};

// ---------------------------------------------------------------------------
// CASHFREE adapter — STUB. Same shape. When ready, implement createOrder via the Orders API and
// verifyWebhook via the x-webhook-signature header (per Cashfree's documented scheme). Currently
// under onboarding, so no credentials, SDK, or network calls are added.
// ---------------------------------------------------------------------------
const cashfreeProvider = {
  name: 'cashfree',
  get configured() {
    return Boolean(process.env.CASHFREE_APP_ID && process.env.CASHFREE_SECRET_KEY);
  },
  async createOrder() {
    throw new Error('Cashfree is not configured yet (set CASHFREE_APP_ID / CASHFREE_SECRET_KEY and implement Orders API).');
  },
  verifyWebhook() {
    // Must verify Cashfree's x-webhook-signature over the raw body before trusting.
    return { verified: false, reason: 'cashfree_not_configured' };
  },
  async verifyPayment() {
    return { verified: false, reason: 'cashfree_not_configured' };
  },
};

const REGISTRY = { mock: mockProvider, razorpay: razorpayProvider, cashfree: cashfreeProvider };

export const paymentProvider = REGISTRY[PROVIDER] || mockProvider;
export const paymentProviderName = paymentProvider.name;
// Whether a REAL (money-moving) gateway is connected. The mock is never "configured".
export const paymentProviderConfigured = paymentProvider.configured;
export { mockProvider }; // exported so the test harness can sign a mock webhook
