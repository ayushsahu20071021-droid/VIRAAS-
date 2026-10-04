// VIRAAS Express application (routes + middleware) — WITHOUT a network listener.
//
// This is the single source of truth for the server. It is imported by:
//   - server/index.mjs  -> starts a long-running HTTP listener for local dev / preview / any
//                          traditional Node host (`npm start`).
//   - api/index.mjs      -> re-exports it as a single Vercel Serverless Function (no app.listen()).
//
// An Express app instance is itself a (req, res) handler, so the exact same routes run both ways
// with NO duplicated backend logic. Nothing about the AI Try-On behaviour, the Runware adapter, the
// ZDR gate, privacy handling, metadata-only logging, or payment gating changes here.
import express from 'express';
import path from 'node:path';
import fs from 'node:fs';
import crypto from 'node:crypto';
import { tryOnProvider, tryOnMode, tryOnConfigured } from './tryOnProvider.mjs';
import * as payments from './payments/service.mjs';
import socialRouter from './social/routes.mjs';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const readJson = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));

const catalog = readJson('src/data/catalog.json');
const byId = new Map(catalog.map((p) => [p.id, p]));
// LIVE (QA-approved) Women preview images — source of truth generated from data-src/image-qa.json.
const womenPreviews = readJson('src/data/women-previews.client.json');
// Men look final images (QA-approved) — the exact garment reference for a Men Try-On.
const menImages = readJson('src/data/men-final-images.json');
// Couple looks — used to resolve the EXACT per-person (her / him) outfit reference. The
// combined couple image is intentionally NOT used as a Try-On clothing reference.
const couples = readJson('src/data/couples.json');
const coupleById = new Map(couples.map((c) => [c.id, c]));

// Where the built/static assets live, so we can inline a garment reference as base64.
const PUBLIC_DIR = path.join(ROOT, 'public');
const DIST_DIR = path.join(ROOT, 'dist');
const PUBLIC_BASE_URL = (process.env.PUBLIC_BASE_URL || '').replace(/\/$/, '');
const MIME = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp' };

// Turn a VIRAAS reference (e.g. "/images/women-previews/women-look-001.png") into something a
// provider can consume: prefer an inline base64 data-URL read from disk (no public hosting needed);
// fall back to an absolute public URL when PUBLIC_BASE_URL is set. The garment is a VIRAAS catalog
// image (not user data); the USER PHOTO is always sent as base64 and never hosted.
//
// On a serverless host (e.g. Vercel) the large public/ image tree is served by the CDN and is NOT
// present on the function's filesystem, so set PUBLIC_BASE_URL to the deployment origin; this branch
// then returns the public catalog-image URL (a VIRAAS asset, never user data) for the provider.
function loadGarment(src) {
  if (!src) return null;
  if (/^https?:\/\//i.test(src) || src.startsWith('data:')) return src;
  const rel = src.replace(/^\//, '').split('?')[0];
  for (const base of [PUBLIC_DIR, DIST_DIR]) {
    const abs = path.join(base, rel);
    if (abs.startsWith(base) && fs.existsSync(abs)) {
      const ext = path.extname(abs).toLowerCase();
      return `data:${MIME[ext] || 'application/octet-stream'};base64,${fs.readFileSync(abs).toString('base64')}`;
    }
  }
  return PUBLIC_BASE_URL ? `${PUBLIC_BASE_URL}${src.startsWith('/') ? '' : '/'}${src}` : null;
}

const app = express();
app.disable('x-powered-by');

// Payment gateway webhook MUST be parsed as a raw body so its signature can be verified byte-for-byte.
// It is registered BEFORE express.json() so the JSON parser never touches it. No customer photo or
// secret is logged here; only a signed, server-verified fact is trusted.
app.post('/api/payment/webhook', express.raw({ type: '*/*', limit: '1mb' }), (req, res) => {
  const rawBody = Buffer.isBuffer(req.body) ? req.body.toString('utf8') : '';
  const result = payments.handleWebhook({ rawBody, headers: req.headers });
  // Always answer 200 to a validly-signed event (even a duplicate) so the gateway stops retrying;
  // reject anything whose signature we could not verify.
  if (!result.ok) return res.status(400).json({ ok: false });
  res.json({ ok: true, status: result.status, duplicate: Boolean(result.duplicate) });
});

app.use(express.json({ limit: '12mb' }));

app.get('/api/health', (_req, res) => res.json({ ok: true }));

// VIRAAS Connect (social) — VIRAAS ID -> Connect request -> mutual accept -> private 1:1 chat.
// This is NOT an AI assistant; it is the human-to-human social layer. See server/social/store.mjs
// for the non-production (in-memory, no realtime) notice.
app.use('/api/social', socialRouter);
// Status the browser is allowed to know: the mode and whether real generation is configured.
// The provider NAME is only exposed once real generation is actually configured.
app.get('/api/try-on/status', (_req, res) =>
  res.json({
    mode: tryOnMode,
    configured: tryOnConfigured,
    provider: tryOnConfigured ? tryOnProvider.provider : null,
    // Payment gating (browser-safe fields only — never the gateway secret).
    paymentRequired: payments.paymentRequired,
    priceInr: payments.PRICE_INR,
    currency: payments.CURRENCY,
    paymentProvider: payments.paymentConfig.provider,
    paymentConfigured: payments.paymentConfig.configured,
    generationAvailable: !tryOnConfigured, // live generation stays closed until persistent account credits exist
  }),
);

// --- Payment routes ------------------------------------------------------------------------------
// createPayment: begin a payment for one Try-On. Returns only browser-safe fields. NEVER trusts any
// client-supplied "paid"/"paymentSuccess" flag — payment can only become VERIFIED via the signed
// webhook (or a server-side gateway poll).
app.post('/api/payment/create', async (req, res) => {
  const { productId, womenLookId, menLookId, coupleId, side } = req.body || {};
  const subject = resolveSubject({ productId, womenLookId, menLookId, coupleId, side });
  const outfitId = subject.error ? undefined : subject.outfitId;
  const out = await payments.createPayment({ outfitId });
  if (!out.ok) return res.status(503).json({ ok: false, message: 'Payment could not be started right now.' });
  res.json(out);
});

// getPaymentStatus: read-only. Reveals the one-time authToken only once the payment is AUTHORIZED,
// and only to a caller holding the unguessable paymentId capability.
app.get('/api/payment/status', (req, res) => {
  const out = payments.getPaymentStatus({ paymentId: String(req.query.paymentId || '') });
  if (!out.ok) return res.status(404).json({ ok: false, message: 'Unknown payment.' });
  res.json(out);
});

// verifyPayment: optional server-side poll fallback (used when a gateway supports polling instead of
// webhooks). Still a SERVER-SIDE check — a client cannot self-verify.
app.post('/api/payment/verify', async (req, res) => {
  const out = await payments.verifyPayment({ paymentId: String((req.body || {}).paymentId || '') });
  res.status(out.ok ? 200 : 402).json(out);
});

// Resolve the Try-On subject into the EXACT VIRAAS reference for the selected outfit.
// Mapping rules (no cross-mapping, ever):
//   Men look    -> that exact Men reference image        (gender: men)
//   Women look  -> that exact QA-approved Women reference (gender: women)
//   Couple/her  -> that couple's exact WOMAN'S outfit     (gender: women) — never the man's, never the combined image
//   Couple/him  -> that couple's exact MAN'S outfit       (gender: men)   — never the woman's, never the combined image
//   Product     -> that product's own reference           (gender: unknown)
function resolveSubject(body) {
  const { productId, womenLookId, menLookId, coupleId, side } = body || {};
  if (menLookId) {
    const src = menImages[menLookId];
    if (!src) return { error: 404, message: 'Unknown look.' };
    return { outfitId: menLookId, gender: 'men', garmentImageUrl: src };
  }
  if (womenLookId) {
    const w = womenPreviews[womenLookId];
    if (!w) return { error: 404, message: 'Unknown look.' };
    if (!w.live || !w.src) return { error: 400, message: 'This look is not available for Try-On yet.' };
    return { outfitId: womenLookId, gender: 'women', garmentImageUrl: w.src };
  }
  if (coupleId) {
    const c = coupleById.get(coupleId);
    if (!c) return { error: 404, message: 'Unknown look.' };
    if (side !== 'her' && side !== 'him') return { error: 400, message: 'Choose whose outfit to try on.' };
    const ids = side === 'her' ? c.herProductIds : c.hisProductIds;
    const product = ids.map((id) => byId.get(id)).find((item) => item?.tryOnEnabled && item.status === 'live' && item.imageUrl);
    if (!product) return { error: 400, message: 'This side of the look does not have an individual live Try-On image yet.' };
    // Never send the combined couple image or a text-only substitute as a garment reference.
    return { outfitId: product.id, gender: product.gender, garmentImageUrl: product.imageUrl, garmentDescription: product.title };
  }
  if (productId) {
    const product = byId.get(productId);
    if (!product) return { error: 404, message: 'Unknown product.' };
    if (!product.tryOnEnabled || !product.imageUrl || product.status !== 'live')
      return { error: 400, message: 'This product does not have a live Try-On image yet.' };
    return { outfitId: productId, gender: 'unknown', garmentImageUrl: product.imageUrl, garmentDescription: product.title };
  }
  return { error: 400, message: 'No product or look selected.' };
}

app.post('/api/try-on', async (req, res) => {
  const reqId = crypto.randomUUID().slice(0, 8);
  const started = Date.now();
  const { photo, ageConfirmed } = req.body || {};
  if (ageConfirmed !== true) return res.status(403).json({ ok: false, message: 'AI Try-On with a personal photo requires age 18+.' });

  const subject = resolveSubject(req.body);
  if (subject.error) return res.status(subject.error).json({ ok: false, message: subject.message });

  // Validate the uploaded photo. NOTE: the raw image / base64 is NEVER logged.
  if (typeof photo !== 'string' || !/^data:image\/(jpeg|png|webp);base64,/.test(photo))
    return res.status(400).json({ ok: false, message: 'Please upload a JPG, PNG or WebP photo.' });
  if (photo.length > 11 * 1024 * 1024) return res.status(413).json({ ok: false, message: 'Photo too large.' });

  // Fail closed for every live provider call until persistent user identity, the two-credit ledger,
  // and verified ₹20 checkout are connected. Do this BEFORE consuming any paid authorization.
  // The demo adapter remains available as a clearly labelled layout preview and makes no provider call.
  if (tryOnConfigured) {
    return res.status(503).json({ ok: false, message: 'AI Try-On is temporarily unavailable.' });
  }

  // PAYMENT GATE. When payment is required, a real generation needs a verified, paid, ONE-TIME
  // authorization. A client-supplied "paymentSuccess" flag is IGNORED — we only accept a valid
  // authToken that maps to a server-side AUTHORIZED record, and we atomically claim it BEFORE
  // calling the provider so a duplicate request can never trigger a second generation.
  let claimed = null;
  if (payments.paymentRequired) {
    const authToken = typeof (req.body || {}).authToken === 'string' ? req.body.authToken : '';
    const claim = payments.claimForGeneration({ authToken });
    if (!claim.ok) {
      const msg =
        claim.reason === 'invalid_token'
          ? 'Payment is required for AI Try-On. Please complete payment to continue.'
          : claim.reason === 'already_consumed' || claim.reason === 'failed'
            ? 'This Try-On authorization has already been used.'
            : 'Payment has not been verified yet. Please complete payment to continue.';
      return res.status(402).json({ ok: false, message: msg });
    }
    claimed = claim; // holds generationId; on genuine failure we mark it recoverable (not lost).
    console.log(`[try-on ${reqId}] authorized generation=${claimed.generationId}`);
  }

  try {
    // Resolve the garment to an inline base64 data-URL (or public URL). Never a user photo.
    const garment = loadGarment(subject.garmentImageUrl);
    // Safe, image-free metadata log only (id, outfit, gender, size in KB) — never the image.
    console.log(`[try-on ${reqId}] outfit=${subject.outfitId} gender=${subject.gender} bytes=${Math.round(photo.length / 1024)}KB garment=${garment ? (garment.startsWith('data:') ? 'inline' : 'url') : 'none'} mode=${tryOnMode}`);
    const out = await tryOnProvider.generateTryOn({
      outfitId: subject.outfitId,
      gender: subject.gender,
      photo,
      garmentImageUrl: garment,
      garmentDescription: subject.garmentDescription,
    });
    console.log(`[try-on ${reqId}] done ok=${out.ok} mode=${out.mode} ${Date.now() - started}ms`);
    // A genuine post-payment failure must NOT be faked or lost: mark the claimed authorization
    // FAILED + recoverable (retains paymentId for a later refund/credit) instead of returning a
    // fake image. We never silently drop the customer's paid authorization.
    if (!out.ok && claimed) payments.failGeneration({ generationId: claimed.generationId, reason: out.message || 'provider_error' });
    res.status(out.ok ? 200 : 502).json(out);
  } catch {
    if (claimed) payments.failGeneration({ generationId: claimed.generationId, reason: 'exception' });
    console.log(`[try-on ${reqId}] error ${Date.now() - started}ms`);
    res.status(500).json({ ok: false, message: 'Try-on failed.' });
  }
});

// Static SPA serving + client-side-routing fallback. On a serverless host these paths are normally
// served by the CDN from the build output, but keeping them here means a single Node process still
// serves the whole site in local dev / preview / any traditional host — with no behaviour change.
const dist = path.join(ROOT, 'dist');
app.use(express.static(dist, { maxAge: '1h', index: false }));
app.get(/^(?!\/api\/).*/, (_req, res) => res.sendFile(path.join(dist, 'index.html')));

export default app;
export { app };
