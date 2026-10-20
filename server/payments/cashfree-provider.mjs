// Cashfree Payments adapter groundwork.
// This module is intentionally not wired into the live checkout yet. Keep PayU as the
// selected provider until Cashfree approves the merchant and sandbox end-to-end tests pass.
// Cashfree secrets must remain server-only; never expose them to Vite/client code.
import crypto from 'node:crypto';

const APP_ID = process.env.CASHFREE_APP_ID || '';
const SECRET_KEY = process.env.CASHFREE_SECRET_KEY || '';
const ENVIRONMENT = (process.env.CASHFREE_ENV || 'sandbox').toLowerCase();
const API_VERSION = process.env.CASHFREE_API_VERSION || '2025-01-01';
const BASE_URL = ENVIRONMENT === 'sandbox'
  ? 'https://sandbox.cashfree.com/pg'
  : ENVIRONMENT === 'production'
    ? 'https://api.cashfree.com/pg'
    : '';

export function cashfreeRequirements() {
  const missing = [];
  if (!APP_ID) missing.push('CASHFREE_APP_ID');
  if (!SECRET_KEY) missing.push('CASHFREE_SECRET_KEY');
  if (!['sandbox', 'production'].includes(ENVIRONMENT)) missing.push('CASHFREE_ENV must be sandbox or production');
  if (!API_VERSION) missing.push('CASHFREE_API_VERSION');
  return missing;
}

async function apiRequest(path, { method = 'GET', body, idempotencyKey } = {}) {
  if (cashfreeRequirements().length) throw new Error('Cashfree credentials are not configured.');
  const headers = {
    accept: 'application/json',
    'content-type': 'application/json',
    'x-api-version': API_VERSION,
    'x-client-id': APP_ID,
    'x-client-secret': SECRET_KEY,
  };
  if (idempotencyKey) headers['x-idempotency-key'] = idempotencyKey;
  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    ...(body ? { body: JSON.stringify(body) } : {}),
    signal: AbortSignal.timeout(12_000),
  });
  const text = await response.text();
  let data;
  try { data = text ? JSON.parse(text) : {}; } catch { data = {}; }
  if (!response.ok) {
    // Do not include response headers, credentials, or request secrets in logs/errors.
    const detail = String(data.message || data.type || `HTTP ${response.status}`).slice(0, 180);
    throw new Error(`Cashfree API request failed: ${detail}`);
  }
  return data;
}

function validOrderId(value) {
  return typeof value === 'string' && /^[A-Za-z0-9_-]{8,45}$/.test(value);
}

/** Create a ₹20 hosted-checkout order. Call only from a trusted server route. */
export async function createCashfreeOrder({ orderId, customerId, customerPhone, customerEmail, returnUrl, notifyUrl }) {
  if (!validOrderId(orderId) || !customerId || !/^https:\/\//i.test(returnUrl || '') || !/^https:\/\//i.test(notifyUrl || '')) {
    throw new Error('Cashfree order details are invalid.');
  }
  const phone = String(customerPhone || '').replace(/\D/g, '');
  const email = String(customerEmail || '').trim().slice(0, 254);
  const customer = {
    customer_id: String(customerId).slice(0, 50),
    ...(phone ? { customer_phone: phone.slice(-10) } : {}),
    ...(email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? { customer_email: email } : {}),
  };
  const data = await apiRequest('/orders', {
    method: 'POST',
    idempotencyKey: orderId,
    body: {
      order_id: orderId,
      order_amount: 20,
      order_currency: 'INR',
      customer_details: customer,
      order_meta: { return_url: returnUrl, notify_url: notifyUrl },
      order_note: 'VIRAAS AI Try-On - one generation',
    },
  });
  if (!data.order_id || data.order_id !== orderId || !data.payment_session_id) {
    throw new Error('Cashfree did not return a usable payment session.');
  }
  return { orderId: data.order_id, paymentSessionId: data.payment_session_id, orderStatus: data.order_status || 'ACTIVE' };
}

/** Fetch the authoritative order state; a browser redirect alone is never payment proof. */
export async function getCashfreeOrder(orderId) {
  if (!validOrderId(orderId)) throw new Error('Cashfree order ID is invalid.');
  return apiRequest(`/orders/${encodeURIComponent(orderId)}`);
}

/** Fetch transactions for an order and identify a captured payment server-side. */
export async function getCashfreePayments(orderId) {
  if (!validOrderId(orderId)) throw new Error('Cashfree order ID is invalid.');
  const data = await apiRequest(`/orders/${encodeURIComponent(orderId)}/payments`);
  return Array.isArray(data) ? data : [];
}

/** Verify Cashfree webhook signature against the exact raw request body bytes/string. */
export function verifyCashfreeWebhookSignature({ signature, timestamp, rawBody }) {
  if (!SECRET_KEY || typeof signature !== 'string' || typeof timestamp !== 'string'
    || typeof rawBody !== 'string' || !/^\d{10,16}$/.test(timestamp)) return false;
  const expected = crypto.createHmac('sha256', SECRET_KEY).update(timestamp + rawBody, 'utf8').digest('base64');
  const a = Buffer.from(signature, 'utf8');
  const b = Buffer.from(expected, 'utf8');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export const cashfreeProvider = {
  name: 'cashfree',
  get configured() { return cashfreeRequirements().length === 0; },
  get environment() { return ENVIRONMENT; },
  createOrder: createCashfreeOrder,
  getOrder: getCashfreeOrder,
  getPayments: getCashfreePayments,
  verifyWebhookSignature: verifyCashfreeWebhookSignature,
};
