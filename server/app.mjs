// VIRAAS Express application shared by the local server and the Vercel function entrypoint.
// All user identity, payment verification and Try-On credit decisions are server-authoritative.
import express from 'express';
import path from 'node:path';
import fs from 'node:fs';
import crypto from 'node:crypto';
import { tryOnProvider, tryOnMode, tryOnConfigured, tryOnRequirements } from './tryOnProvider.mjs';
import * as payments from './payments/service.mjs';
import { resolvePublicAssetBase } from './publicAssets.mjs';
import { initializeAnonymousTryOnCookie, resolveAnonymousTryOnIdentity } from './anonymousTryOnIdentity.mjs';
import * as anonymousTryOnCredits from './anonymousTryOnCredits.mjs';
import { resolveCoupleSide } from '../shared/coupleTryOn.mjs';
import { databaseStatus } from './db/pool.mjs';
import { getAuthIdentity } from './auth/provider.mjs';
import * as social from './social/repository.mjs';
import {
  NO_TRYON_CREDITS_MESSAGE,
  consumeTryOnCredit,
  grantSignupCredits,
  releaseTryOnCredit,
  reserveTryOnCredit,
} from './tryOnCredits.mjs';
import authRouter from './auth/routes.mjs';
import socialRouter from './social/routes.mjs';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const readJson = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));
const catalog = readJson('src/data/catalog.json');
const byId = new Map(catalog.map((product) => [product.id, product]));
const womenPreviews = readJson('src/data/women-previews.client.json');
const menImages = readJson('src/data/men-final-images.json');
const couples = readJson('src/data/couples.json');
const coupleById = new Map(couples.map((couple) => [couple.id, couple]));
const PUBLIC_DIR = path.resolve(ROOT, 'public');
const DIST_DIR = path.resolve(ROOT, 'dist');
const publicAssets = resolvePublicAssetBase();
const PUBLIC_BASE_URL = publicAssets.base;
const MIME = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp' };
const MAX_PHOTO_BYTES = 2_750_000;
const MAX_PHOTO_BASE64_CHARS = Math.ceil(MAX_PHOTO_BYTES / 3) * 4 + 8;
const TRYON_TOP_UP_ENABLED = false; // ₹20 top-ups remain postponed; existing PayU verification stays available.

// Inline only trusted catalog references where present on disk. On Vercel, resolve them to the
// deployment's configured public origin; never derive an asset origin from an untrusted Host header.
function loadGarment(src) {
  if (typeof src !== 'string' || !src) return null;
  if (/^https:\/\//i.test(src) || src.startsWith('data:image/')) return src;
  if (/^http:\/\//i.test(src) && process.env.NODE_ENV !== 'production') return src;
  const rel = src.replace(/^\//, '').split('?')[0];
  for (const base of [PUBLIC_DIR, DIST_DIR]) {
    const abs = path.resolve(base, rel);
    if (abs.startsWith(`${base}${path.sep}`) && fs.existsSync(abs)) {
      const ext = path.extname(abs).toLowerCase();
      const type = MIME[ext];
      if (!type) return null;
      return `data:${type};base64,${fs.readFileSync(abs).toString('base64')}`;
    }
  }
  return PUBLIC_BASE_URL ? `${PUBLIC_BASE_URL}${src.startsWith('/') ? '' : '/'}${src}` : null;
}

const app = express();
app.disable('x-powered-by');
app.use(express.json({ limit: '4mb', strict: true }));
app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api/auth', authRouter);
app.use('/api/social', socialRouter);

function sameOrigin(req, res, next) {
  const origin = req.get('origin');
  const fetchSite = req.get('sec-fetch-site');
  if (fetchSite === 'cross-site') return res.status(403).json({ ok: false, message: 'Cross-site request rejected.' });
  if (origin) {
    let originUrl;
    try { originUrl = new URL(origin); } catch { return res.status(403).json({ ok: false, message: 'Request origin was not accepted.' }); }
    const expectedHost = String(req.get('x-forwarded-host') || req.get('host') || '').split(',')[0].trim().toLowerCase();
    if (!expectedHost || originUrl.host.toLowerCase() !== expectedHost) return res.status(403).json({ ok: false, message: 'Request origin was not accepted.' });
  }
  next();
}

async function adultAccount(req, res) {
  try {
    const db = await databaseStatus();
    if (!db.ready) {
      res.status(503).json({ ok: false, code: 'DATABASE_NOT_READY', message: 'Persistent VIRAAS accounts and Try-On credits are unavailable until PostgreSQL is configured and fully migrated.' });
      return null;
    }
    const identity = await getAuthIdentity(req, res);
    const user = await social.getUserByAuthSubject(identity.subject);
    if (!user?.profile_complete) {
      res.status(409).json({ ok: false, code: 'PROFILE_REQUIRED', message: 'Complete your adult VIRAAS account profile before using AI Try-On or purchasing credits.', accountPath: '/connect' });
      return null;
    }
    if (Number(user.age) < 18) {
      res.status(403).json({ ok: false, code: 'ADULTS_ONLY', message: 'AI Try-On and credit purchases are available only to adults 18+.' });
      return null;
    }
    return { identity, user };
  } catch (error) {
    res.status(Number(error?.status) || 503).json({ ok: false, message: error?.message || 'A verified VIRAAS account is required.' });
    return null;
  }
}

// Try-On uses the authenticated user's existing ledger only when they have a completed adult
// VIRAAS profile. Everyone else uses a separate anonymous cookie identity; Connect/auth routes
// continue to use their original authenticated-only middleware.
async function tryOnPrincipal(req, res, { allowNewAnonymousCookie = false } = {}) {
  const db = await databaseStatus();
  if (!db.ready) {
    res.status(503).json({ ok: false, code: 'DATABASE_NOT_READY', message: 'Persistent Try-On credits are temporarily unavailable until PostgreSQL is configured and fully migrated.' });
    return null;
  }

  let identity = null;
  try { identity = await getAuthIdentity(req, res, { optional: true }); }
  catch { /* an expired or unavailable optional login falls back to the anonymous Try-On session */ }
  if (identity) {
    let user;
    try { user = await social.getUserByAuthSubject(identity.subject); }
    catch {
      res.status(503).json({ ok: false, code: 'TRYON_CREDIT_LEDGER_UNAVAILABLE', message: 'Persistent Try-On credits are temporarily unavailable.' });
      return null;
    }
    if (user?.profile_complete) {
      const age = Number(user.age);
      if (!Number.isFinite(age) || age < 18) {
        res.status(403).json({ ok: false, code: 'ADULTS_ONLY', message: 'AI Try-On is available only to adults 18+.' });
        return null;
      }
      try {
        const balance = await grantSignupCredits(user.user_id);
        return { kind: 'account', userId: user.user_id, balance };
      } catch {
        res.status(503).json({ ok: false, code: 'TRYON_CREDIT_LEDGER_UNAVAILABLE', message: 'Persistent Try-On credits are temporarily unavailable.' });
        return null;
      }
    }
  }

  try {
    const anonymous = await resolveAnonymousTryOnIdentity(req, res, { allowNewCookie: allowNewAnonymousCookie });
    if (!anonymous.ok) {
      const code = anonymous.reason === 'session_expired' ? 'ANONYMOUS_TRYON_SESSION_EXPIRED' : 'ANONYMOUS_TRYON_SESSION_REQUIRED';
      res.status(428).json({ ok: false, code, message: 'Your anonymous Try-On session is missing or expired. Refresh the page to continue.' });
      return null;
    }
    return { kind: 'anonymous', anonymousId: anonymous.anonymousId, balance: anonymous.balance };
  } catch {
    res.status(503).json({ ok: false, code: 'TRYON_CREDIT_LEDGER_UNAVAILABLE', message: 'Persistent anonymous Try-On credits are temporarily unavailable.' });
    return null;
  }
}

async function reservePrincipalCredit(principal, requestKey, outfitId) {
  return principal.kind === 'anonymous'
    ? anonymousTryOnCredits.reserveAnonymousTryOnCredit({ anonymousId: principal.anonymousId, requestKey, outfitId })
    : reserveTryOnCredit({ userId: principal.userId, requestKey, outfitId });
}

async function consumePrincipalCredit(principal, generationId) {
  return principal.kind === 'anonymous'
    ? anonymousTryOnCredits.consumeAnonymousTryOnCredit({ anonymousId: principal.anonymousId, generationId })
    : consumeTryOnCredit({ userId: principal.userId, generationId });
}

async function releasePrincipalCredit(principal, generationId, failureCode) {
  return principal.kind === 'anonymous'
    ? anonymousTryOnCredits.releaseAnonymousTryOnCredit({ anonymousId: principal.anonymousId, generationId, failureCode })
    : releaseTryOnCredit({ userId: principal.userId, generationId, failureCode });
}

// Browser-safe capabilities only. Server-ledger balances are returned by the Try-On credits route.
app.get('/api/try-on/status', async (_req, res) => {
  res.set('Cache-Control', 'no-store');
  const db = await databaseStatus();
  const assetRequirements = publicAssets.requirement ? [publicAssets.requirement] : [];
  const tryOnReady = tryOnMode === 'runware-flux' && tryOnConfigured && db.ready && assetRequirements.length === 0;
  const topUpReady = TRYON_TOP_UP_ENABLED && payments.paymentProviderConfigured && tryOnReady;
  res.json({
    mode: tryOnMode,
    configured: tryOnConfigured,
    provider: tryOnConfigured ? tryOnProvider.provider : null,
    paymentRequired: false,
    priceInr: payments.CREDIT_PRICE_INR,
    currency: 'INR',
    paymentConfigured: payments.paymentProviderConfigured,
    paymentProvider: payments.paymentProviderName,
    generationAvailable: tryOnReady,
    creditLedgerAvailable: db.ready,
    topUpAvailable: topUpReady,
    requirements: [
      ...tryOnRequirements,
      ...assetRequirements,
      ...(!db.ready ? db.missing : []),
      ...(!payments.paymentProviderConfigured ? payments.paymentRequirements() : []),
    ],
  });
});

app.get('/api/try-on/credits', sameOrigin, async (req, res) => {
  res.set('Cache-Control', 'no-store');
  const principal = await tryOnPrincipal(req, res, { allowNewAnonymousCookie: true });
  if (!principal) return;
  res.json({ ok: true, balance: principal.balance, initialCredits: 2, noCreditsMessage: NO_TRYON_CREDITS_MESSAGE });
});

function resolveSubject(body) {
  const { productId, womenLookId, menLookId, coupleId, side } = body || {};
  if (menLookId) {
    const src = menImages[menLookId];
    if (!src) return { error: 404, message: 'Unknown Men look.' };
    return { outfitId: menLookId, gender: 'men', garmentImageUrl: src, returnPath: `/try-on?menLook=${encodeURIComponent(menLookId)}` };
  }
  if (womenLookId) {
    const look = womenPreviews[womenLookId];
    if (!look) return { error: 404, message: 'Unknown Women look.' };
    if (!look.live || !look.src) return { error: 400, message: 'This Women look is not available for Try-On yet.' };
    return { outfitId: womenLookId, gender: 'women', garmentImageUrl: look.src, returnPath: `/try-on?womenLook=${encodeURIComponent(womenLookId)}` };
  }
  if (coupleId) {
    const couple = coupleById.get(coupleId);
    if (!couple) return { error: 404, message: 'Unknown Couple look.' };
    const resolved = resolveCoupleSide(couple, side, byId);
    if (!resolved.ok) return { error: 400, message: resolved.message };
    return {
      outfitId: resolved.outfitId,
      gender: resolved.gender,
      garmentImageUrl: resolved.garmentImageUrl,
      garmentDescription: resolved.garmentDescription,
      returnPath: `/try-on?couple=${encodeURIComponent(coupleId)}&side=${resolved.side}`,
    };
  }
  if (productId) {
    const product = byId.get(productId);
    if (!product) return { error: 404, message: 'Unknown product.' };
    if (!product.tryOnEnabled || !product.imageUrl || product.status !== 'live') return { error: 400, message: 'This product does not have its own live Try-On image.' };
    return { outfitId: productId, gender: 'unknown', garmentImageUrl: product.imageUrl, garmentDescription: product.title, returnPath: `/try-on?product=${encodeURIComponent(productId)}` };
  }
  return { error: 400, message: 'No product or look selected.' };
}

function validPhoto(dataUrl) {
  if (typeof dataUrl !== 'string' || dataUrl.length > MAX_PHOTO_BASE64_CHARS) return null;
  const match = /^data:image\/jpeg;base64,([A-Za-z0-9+/]+={0,2})$/.exec(dataUrl);
  if (!match) return null;
  const encoded = match[1];
  if (encoded.length % 4 !== 0) return null;
  const bytes = Buffer.from(encoded, 'base64');
  if (!bytes.length || bytes.length > MAX_PHOTO_BYTES || bytes.toString('base64') !== encoded) return null;
  // Browser-side re-encoding is required; verify the bytes really are JPEG before Runware receives them.
  if (bytes.length < 4 || bytes[0] !== 0xff || bytes[1] !== 0xd8 || bytes.at(-2) !== 0xff || bytes.at(-1) !== 0xd9) return null;
  return dataUrl;
}

function validGeneratedImage(dataUrl) {
  return typeof dataUrl === 'string'
    && /^data:image[/](?:jpeg|png|webp);base64,[A-Za-z0-9+/]+={0,2}$/i.test(dataUrl);
}

function validRequestKey(value) {
  return typeof value === 'string' && /^[A-Za-z0-9][A-Za-z0-9._:-]{7,127}$/.test(value);
}

function paymentReturnPath(payment, state) {
  const separator = payment.return_path.includes('?') ? '&' : '?';
  return `${payment.return_path}${separator}payment=${state}&txnid=${encodeURIComponent(payment.txnid)}`;
}

// PayU Hosted Checkout POSTs its signed response here. The redirect is only UX: credit is granted
// after both the reverse hash and PayU's authenticated verify_payment response are checked server-side.
app.post('/api/payment/payu/callback', express.urlencoded({ extended: false, limit: '32kb' }), async (req, res) => {
  const payload = req.body || {};
  const txnid = typeof payload.txnid === 'string' ? payload.txnid : '';
  let payment = null;
  try {
    if (!payments.payuProvider.verifyCallbackHash(payload)) return res.status(400).send('Payment response could not be verified.');
    payment = await payments.getPayUPaymentForCallback(txnid);
    if (!payment) return res.status(404).send('Payment record not found.');
    if (payments.amountPaise(payload.amount) !== Number(payment.amount_paise)
      || payload.productinfo !== payment.productinfo
      || payload.firstname !== payment.firstname
      || String(payload.email || '').toLowerCase() !== String(payment.email || '').toLowerCase()) {
      return res.status(400).send('Payment details did not match the VIRAAS order.');
    }
    const verified = await payments.payuProvider.verifyPayment(txnid);
    if (!verified.verified || verified.txnid !== txnid) {
      res.set('Cache-Control', 'no-store');
      return res.redirect(303, paymentReturnPath(payment, 'pending'));
    }
    let state = 'pending';
    if (verified.captured && verified.amountPaise === Number(payment.amount_paise)
      && verified.productinfo === payment.productinfo && verified.firstname === payment.firstname
      && verified.email.toLowerCase() === payment.email.toLowerCase() && verified.payuPaymentId) {
      const applied = await payments.markPayUSuccess(verified);
      if (applied.ok) state = 'success';
      else return res.status(409).send('Payment is verified but could not be applied. Contact VIRAAS support with your order reference.');
    } else if (verified.failed) {
      await payments.markPayUFailed({ txnid, failureCode: payload.status === 'failure' ? 'payment_failed' : 'payment_cancelled' });
      state = 'failed';
    }
    res.set('Cache-Control', 'no-store');
    return res.redirect(303, paymentReturnPath(payment, state));
  } catch {
    // Do not log callback contents, PII, gateway responses, image bytes, or secret material.
    if (payment) {
      res.set('Cache-Control', 'no-store');
      return res.redirect(303, paymentReturnPath(payment, 'pending'));
    }
    return res.status(503).send('Payment verification is temporarily unavailable. No credit was granted.');
  }
});

app.post('/api/payment/create', sameOrigin, async (req, res) => {
  const account = await adultAccount(req, res);
  if (!account) return;
  res.set('Cache-Control', 'no-store');
  if (!TRYON_TOP_UP_ENABLED) {
    return res.status(503).json({ ok: false, code: 'PAYMENT_TOP_UP_POSTPONED', message: '₹20 Try-On credit top-ups are postponed. No payment was created.' });
  }
});

app.get('/api/payment/status', sameOrigin, async (req, res) => {
  const account = await adultAccount(req, res);
  if (!account) return;
  const status = await payments.getPaymentStatusForUser({ txnid: String(req.query.txnid || ''), userId: account.user.user_id });
  if (!status) return res.status(404).json({ ok: false, message: 'Unknown payment.' });
  res.set('Cache-Control', 'no-store');
  res.json({ ok: true, ...status });
});

// Browser-requested verification is still a server-side PayU verify_payment call; it can never
// manufacture a successful status or credit using client-supplied payment fields.
app.post('/api/payment/verify', sameOrigin, async (req, res) => {
  const account = await adultAccount(req, res);
  if (!account) return;
  const txnid = String(req.body?.txnid || '');
  const payment = await payments.getPayUPaymentForCallback(txnid);
  if (!payment || payment.user_id !== account.user.user_id) return res.status(404).json({ ok: false, message: 'Unknown payment.' });
  if (!payments.paymentProviderConfigured) return res.status(503).json({ ok: false, message: 'PayU verification is not configured.' });
  try {
    const verified = await payments.payuProvider.verifyPayment(txnid);
    if (verified.verified && verified.captured && verified.amountPaise === Number(payment.amount_paise)
      && verified.productinfo === payment.productinfo && verified.firstname === payment.firstname
      && verified.email.toLowerCase() === payment.email.toLowerCase() && verified.payuPaymentId) {
      const result = await payments.markPayUSuccess(verified);
      if (!result.ok) return res.status(409).json({ ok: false, message: 'The verified payment could not be applied.' });
    } else if (verified.verified && verified.failed) {
      await payments.markPayUFailed({ txnid });
    }
    const status = await payments.getPaymentStatusForUser({ txnid, userId: account.user.user_id });
    res.set('Cache-Control', 'no-store');
    res.json({ ok: true, ...status });
  } catch {
    res.status(503).json({ ok: false, message: 'PayU could not confirm this payment yet. No credit was granted.' });
  }
});

app.post('/api/try-on', sameOrigin, async (req, res) => {
  res.set('Cache-Control', 'no-store');
  const { ageConfirmed, consent, photo } = req.body || {};
  if (ageConfirmed !== true || consent !== true) return res.status(403).json({ ok: false, message: 'AI Try-On requires age 18+ and explicit photo consent.' });
  if (tryOnMode !== 'runware-flux' || !tryOnConfigured) {
    const missingKey = tryOnRequirements.includes('RUNWARE_API_KEY required');
    const message = missingKey ? 'RUNWARE_API_KEY required. Try-On was not started.' : `${tryOnRequirements[0] || 'Runware FLUX VTO is not ready.'}. No Try-On was started.`;
    return res.status(503).json({ ok: false, code: missingKey ? 'RUNWARE_API_KEY_REQUIRED' : 'RUNWARE_NOT_READY', mode: tryOnMode, message });
  }
  const subject = resolveSubject(req.body || {});
  if (subject.error) return res.status(subject.error).json({ ok: false, message: subject.message });
  const safePhoto = validPhoto(photo);
  if (!safePhoto) return res.status(400).json({ ok: false, message: 'Choose a supported photo that can be safely processed under 2.75 MB.' });
  const requestKey = req.get('Idempotency-Key');
  if (!validRequestKey(requestKey)) return res.status(400).json({ ok: false, message: 'A valid generation request key is required.' });
  const garment = loadGarment(subject.garmentImageUrl);
  if (!garment) return res.status(503).json({ ok: false, message: 'This exact VIRAAS garment reference is not available to the Try-On service.' });
  const principal = await tryOnPrincipal(req, res, { allowNewAnonymousCookie: false });
  if (!principal) return;

  let reservation;
  try {
    reservation = await reservePrincipalCredit(principal, requestKey, subject.outfitId);
  } catch {
    return res.status(503).json({ ok: false, code: 'TRYON_CREDIT_LEDGER_UNAVAILABLE', message: 'Persistent Try-On credits are temporarily unavailable. No generation was started.' });
  }
  if (!reservation.ok) {
    if (reservation.reason === 'no_credits') return res.status(402).json({ ok: false, code: 'NO_TRYON_CREDITS', message: reservation.message || NO_TRYON_CREDITS_MESSAGE, balance: 0 });
    return res.status(409).json({ ok: false, code: 'DUPLICATE_GENERATION_REQUEST', message: 'This generation request has already been used. Please start a new Try-On attempt.', balance: reservation.balance });
  }

  const requestId = crypto.randomUUID().slice(0, 8);
  const startedAt = Date.now();
  let settled = false;
  try {
    // Do not log or persist the uploaded image. It exists in this request/provider call only.
    console.log(`[try-on ${requestId}] reserved outfit=${subject.outfitId} bytes=${Buffer.byteLength(safePhoto)} mode=${tryOnMode}`);
    const result = await tryOnProvider.generateTryOn({
      outfitId: subject.outfitId,
      gender: subject.gender,
      photo: safePhoto,
      garmentImageUrl: garment,
      garmentDescription: subject.garmentDescription,
    });
    if (!result?.ok || !validGeneratedImage(result.resultImage)) {
      const released = await releasePrincipalCredit(principal, reservation.generationId, 'provider_failure');
      settled = Boolean(released.ok);
      console.log(`[try-on ${requestId}] failed elapsed=${Date.now() - startedAt}ms credit_released=${settled}`);
      return res.status(502).json({
        ok: false,
        ...(result?.mode ? { mode: result.mode } : {}),
        message: result?.message || 'Runware returned no valid generated image. The reserved credit has been returned.',
        ...(released.ok ? { balance: released.balance } : {}),
      });
    }
    const consumed = await consumePrincipalCredit(principal, reservation.generationId);
    if (!consumed.ok) throw new Error('Credit reservation could not be finalized.');
    settled = true;
    console.log(`[try-on ${requestId}] success elapsed=${Date.now() - startedAt}ms`);
    return res.json({ ...result, creditsRemaining: consumed.balance });
  } catch {
    if (!settled) {
      try { await releasePrincipalCredit(principal, reservation.generationId, 'provider_exception'); }
      catch { /* leave the already-deducted reservation fail-closed if the database is unavailable */ }
    }
    console.log(`[try-on ${requestId}] error elapsed=${Date.now() - startedAt}ms`);
    return res.status(502).json({ ok: false, message: 'Try-On failed. If the provider did not complete, the reserved credit has been returned.' });
  }
});

const dist = path.join(ROOT, 'dist');
app.use(express.static(dist, { maxAge: '1h', index: false }));
app.get(/^(?!\/api\/).*/, (req, res) => {
  initializeAnonymousTryOnCookie(req, res);
  res.sendFile(path.join(dist, 'index.html'));
});

export default app;
export { app };
