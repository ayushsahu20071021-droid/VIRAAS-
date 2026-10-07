// Real PayU India Hosted Checkout adapter. Merchant salt is server-only; the browser receives only
// PayU's required public merchant key, payment fields, and request hash. No mock provider exists.
import crypto from 'node:crypto';

const KEY = process.env.PAYU_MERCHANT_KEY || '';
const SALT = process.env.PAYU_MERCHANT_SALT || '';
const ENVIRONMENT = (process.env.PAYU_ENV || 'production').toLowerCase();
const TEST_MODE = ENVIRONMENT === 'test';
const CHECKOUT_URL = TEST_MODE ? 'https://test.payu.in/_payment' : 'https://secure.payu.in/_payment';
const VERIFY_URL = TEST_MODE
  ? 'https://test.payu.in/merchant/postservice.php?form=2'
  : 'https://info.payu.in/merchant/postservice.php?form=2';

const sha512 = (value) => crypto.createHash('sha512').update(value, 'utf8').digest('hex');
function amountPaise(value) {
  if (typeof value !== 'string' && typeof value !== 'number') return null;
  const text = String(value).trim();
  if (!/^\d{1,8}(?:\.\d{1,2})?$/.test(text)) return null;
  const [whole, fraction = ''] = text.split('.');
  return Number(whole) * 100 + Number((fraction + '00').slice(0, 2));
}

export function payuRequirements() {
  const missing = [];
  if (!KEY) missing.push('PAYU_MERCHANT_KEY');
  if (!SALT) missing.push('PAYU_MERCHANT_SALT');
  if (!['production', 'test'].includes(ENVIRONMENT)) missing.push('PAYU_ENV must be production or test');
  return missing;
}

export const payuProvider = {
  name: 'payu',
  get configured() { return payuRequirements().length === 0; },
  checkoutUrl: CHECKOUT_URL,
  /** Create signed hosted-checkout fields from server-verified account/payment data. */
  createCheckout({ txnid, amount = '20.00', productinfo, firstname, email, phone, surl, furl }) {
    if (!this.configured) throw new Error('PayU credentials are not configured.');
    const payload = {
      key: KEY,
      txnid,
      amount,
      productinfo,
      firstname,
      email,
      phone,
      surl,
      furl,
      udf1: '', udf2: '', udf3: '', udf4: '', udf5: '',
    };
    const hashInput = [
      payload.key, payload.txnid, payload.amount, payload.productinfo, payload.firstname, payload.email,
      payload.udf1, payload.udf2, payload.udf3, payload.udf4, payload.udf5, '', '', '', '', '', SALT,
    ].join('|');
    return { endpoint: CHECKOUT_URL, fields: { ...payload, hash: sha512(hashInput) } };
  },
  /** Verify the reverse hash PayU posts to both success and failure URLs. */
  verifyCallbackHash(payload) {
    if (!this.configured || !payload || typeof payload.hash !== 'string' || payload.key !== KEY) return false;
    const reverseInput = [
      SALT, payload.status || '', '', '', '', '', '',
      payload.udf5 || '', payload.udf4 || '', payload.udf3 || '', payload.udf2 || '', payload.udf1 || '',
      payload.email || '', payload.firstname || '', payload.productinfo || '', payload.amount || '', payload.txnid || '', payload.key || '',
    ].join('|');
    let expected = sha512(reverseInput);
    // PayU includes additional_charges as the leading field in the reverse hash when present.
    if (payload.additional_charges) expected = sha512(`${payload.additional_charges}|${reverseInput}`);
    const received = payload.hash.toLowerCase();
    const a = Buffer.from(received, 'hex');
    const b = Buffer.from(expected, 'hex');
    return a.length === b.length && a.length === 64 && crypto.timingSafeEqual(a, b);
  },
  /** Confirm the hosted-checkout callback using PayU's server-to-server verify_payment API. */
  async verifyPayment(txnid) {
    if (!this.configured) throw new Error('PayU credentials are not configured.');
    const command = 'verify_payment';
    const signature = sha512([KEY, command, txnid, SALT].join('|'));
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 12_000);
    try {
      const body = new URLSearchParams({ form: '2', key: KEY, command, var1: txnid, hash: signature });
      const response = await fetch(VERIFY_URL, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
        signal: controller.signal,
      });
      if (!response.ok) throw new Error(`PayU verification returned HTTP ${response.status}.`);
      const data = await response.json();
      const detail = data?.transaction_details?.[txnid];
      if (!detail || Number(data?.status) !== 1) return { verified: false, reason: 'transaction_not_found' };
      const status = String(detail.status || '').toLowerCase();
      const unmapped = String(detail.unmappedstatus || '').toLowerCase();
      const captured = status === 'success' && (!unmapped || unmapped === 'captured');
      const failed = ['failure', 'failed', 'bounced', 'dropped', 'usercancelled'].includes(status) || ['bounced', 'dropped', 'failed'].includes(unmapped);
      return {
        verified: true,
        captured,
        failed,
        txnid: String(detail.txnid || txnid),
        payuPaymentId: String(detail.mihpayid || ''),
        amountPaise: amountPaise(detail.amount),
        productinfo: String(detail.productinfo || ''),
        firstname: String(detail.firstname || ''),
        email: String(detail.email || ''),
        status,
        unmappedStatus: unmapped,
      };
    } catch (error) {
      if ((error).name === 'AbortError') throw new Error('PayU payment verification timed out.');
      throw error;
    } finally {
      clearTimeout(timer);
    }
  },
};

export { amountPaise };
