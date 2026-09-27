// VIRAAS production server: serves the built SPA from dist/ and the /api/try-on endpoint.
import express from 'express';
import path from 'node:path';
import fs from 'node:fs';
import crypto from 'node:crypto';
import { tryOnProvider, tryOnMode, tryOnConfigured } from './tryOnProvider.mjs';

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
app.use(express.json({ limit: '12mb' }));

app.get('/api/health', (_req, res) => res.json({ ok: true }));
// Status the browser is allowed to know: the mode and whether real generation is configured.
// The provider NAME is only exposed once real generation is actually configured.
app.get('/api/try-on/status', (_req, res) =>
  res.json({ mode: tryOnMode, configured: tryOnConfigured, provider: tryOnConfigured ? tryOnProvider.provider : null }),
);

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
    // Use the exact per-person garment reference. There is no individual per-person image for
    // couples, so we pass the exact gendered outfit description (never the combined image).
    const person = side === 'her' ? c.her : c.him;
    return {
      outfitId: `${coupleId}:${side}`,
      gender: side === 'her' ? 'women' : 'men',
      garmentImageUrl: null,
      garmentDescription: person?.desc || '',
    };
  }
  if (productId) {
    const product = byId.get(productId);
    if (!product) return { error: 404, message: 'Unknown product.' };
    if (!product.tryOnEnabled) return { error: 400, message: 'This product is not eligible for Try-On.' };
    return { outfitId: productId, gender: 'unknown', garmentImageUrl: product.imageUrl || null, garmentDescription: product.title };
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
    res.status(out.ok ? 200 : 502).json(out);
  } catch {
    console.log(`[try-on ${reqId}] error ${Date.now() - started}ms`);
    res.status(500).json({ ok: false, message: 'Try-on failed.' });
  }
});

const dist = path.join(ROOT, 'dist');
app.use(express.static(dist, { maxAge: '1h', index: false }));
app.get(/^(?!\/api\/).*/, (_req, res) => res.sendFile(path.join(dist, 'index.html')));

const port = Number(process.env.PORT || 8787);
app.listen(port, '0.0.0.0', () => console.log(`VIRAAS server on :${port} (try-on mode: ${tryOnMode}, configured: ${tryOnConfigured})`));
