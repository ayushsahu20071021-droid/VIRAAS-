// Runware-hosted FLUX VTO provider adapter — ISOLATED here so no provider-specific code
// leaks into the server routes or the React UI.
//
// Source: https://runware.ai/docs/models/bfl-flux-virtual-try-on
//         https://runware.ai/docs/platform/zero-data-retention
//
// Why Runware for FLUX VTO:
//   - Same FLUX VTO capability (multi-garment / full-outfit / model-to-model + prompt steering).
//   - Runware NEVER uses API data to train or improve models (with or without ZDR) — unlike BFL's
//     standard API which trains on inputs by default. This is a materially better privacy posture.
//   - `outputType: "dataURI"` returns the result INLINE with no file stored, so no provider URL is
//     ever exposed to the browser and there is nothing to fetch/expire.
//   - Zero Data Retention (enterprise, org-level): input media is not retained; outputs deleted at TTL.
//
// PRIVACY GATE: this adapter REFUSES to send a personal photo unless the owner has explicitly
// acknowledged a Zero-Data-Retention deployment via RUNWARE_ZDR=true. Never fakes a result.
//
// This module never writes the photo to disk, never logs the raw image/base64, and never exposes
// provider credentials to the browser.

import crypto from 'node:crypto';

const API_KEY = process.env.RUNWARE_API_KEY || '';
const API_URL = process.env.RUNWARE_API_URL || 'https://api.runware.ai/v1';
const MODEL = process.env.RUNWARE_FLUX_MODEL || 'bfl:flux@vto';
const ZDR_ACK = (process.env.RUNWARE_ZDR || '').toLowerCase() === 'true';
const TIMEOUT_MS = Number(process.env.TRYON_TIMEOUT_MS || 60000);
const OUTPUT_TTL = Number(process.env.RUNWARE_OUTPUT_TTL || 120);

// Real generation is only "configured" when a key exists AND ZDR has been acknowledged.
export const runwareConfigured = Boolean(API_KEY) && ZDR_ACK;
export function runwareRequirements() {
  const missing = [];
  if (!API_KEY) missing.push('RUNWARE_API_KEY required');
  if (!ZDR_ACK) missing.push('RUNWARE_ZDR=true required after organization-level Zero-Data-Retention is enabled and verified');
  return missing;
}

const isHttpUrl = (s) => typeof s === 'string' && /^https?:\/\//i.test(s);
const isDataUri = (s) => typeof s === 'string' && s.startsWith('data:');

// Build a prompt that forces coordinated ethnic sets to stay as separate garments and preserves
// colours, prints, embroidery, borders, fabric, silhouette, drape, layering, folds and the person.
function buildPrompt(gender, garmentDescription) {
  const desc = garmentDescription ? ` The outfit of image 2 is: ${garmentDescription}.` : '';
  const ethnicRule =
    'Preserve the coordinated garments as separate clothing pieces. ' +
    'Do not reinterpret the lehenga and choli as a one-piece dress. ' +
    'Preserve the dupatta as a separate draped garment.';
  const menRule =
    'Keep the kurta, its bottom (churidar/pyjama/trousers) and any dupatta or stole as separate pieces; ' +
    'do not merge them into a single garment.';
  const rule = gender === 'men' ? `${ethnicRule} ${menRule}` : ethnicRule;
  return (
    `The person of image 1, maintaining exactly their face, identity, body proportions, pose and camera angle, ` +
    `now wearing the complete outfit shown on the model in image 2.${desc} ${rule} ` +
    `Preserve the exact garment colours, print placement, embroidery, decorative borders and fabric texture from ` +
    `image 2, keeping the same silhouette, natural drape, layering, realistic folds and shadows. ` +
    `Full-length, photorealistic festive fashion photograph with natural proportions and no extra limbs or artifacts.`
  );
}

// Compose up to 4 garment component images into a 2x2 grid on white (Runware's documented
// multi-garment workflow). Requires `sharp`; if unavailable or on error, falls back to the first
// image. VIRAAS currently ships single on-model references, so this path is dormant until separate
// per-garment component images exist.
async function composeGrid(images) {
  const list = images.filter(Boolean).slice(0, 4);
  if (list.length <= 1) return list[0] || null;
  try {
    const sharp = (await import('sharp')).default;
    const CELL = 512;
    const toBuf = async (src) => {
      const raw = isDataUri(src) ? Buffer.from(src.slice(src.indexOf('base64,') + 7), 'base64') : Buffer.from(await (await fetch(src)).arrayBuffer());
      return sharp(raw).resize(CELL, CELL, { fit: 'contain', background: '#ffffff' }).png().toBuffer();
    };
    const cells = await Promise.all(list.map(toBuf));
    const positions = [
      { left: 0, top: 0 }, { left: CELL, top: 0 }, { left: 0, top: CELL }, { left: CELL, top: CELL },
    ];
    const composited = await sharp({ create: { width: CELL * 2, height: CELL * 2, channels: 3, background: '#ffffff' } })
      .composite(cells.map((input, i) => ({ input, ...positions[i] })))
      .jpeg({ quality: 92 })
      .toBuffer();
    return `data:image/jpeg;base64,${composited.toString('base64')}`;
  } catch {
    return list[0];
  }
}

export const runwareFluxVtoProvider = {
  name: 'runware-flux',
  provider: 'runware-flux-vto',
  get configured() {
    return runwareConfigured;
  },
  async generateTryOn({ outfitId, gender, photo, garmentImageUrl, garmentImages, garmentDescription }) {
    if (!API_KEY) return { ok: false, mode: 'runware-flux', configured: false, outfitId, code: 'RUNWARE_API_KEY_REQUIRED', message: 'RUNWARE_API_KEY required. Try-On was not started.' };
    // Hard privacy gate — never send a personal photo unless ZDR is explicitly acknowledged.
    if (!ZDR_ACK)
      return {
        ok: false, mode: 'runware-flux', configured: false, privacy: 'unverified', outfitId,
        message: 'Runware FLUX VTO is not enabled: Zero-Data-Retention has not been acknowledged (set RUNWARE_ZDR=true only when your Runware organization has ZDR enabled).',
      };

    // Resolve the garment reference (single on-model VIRAAS look, or a 2x2 grid of components).
    const garment = Array.isArray(garmentImages) && garmentImages.length > 1 ? await composeGrid(garmentImages) : garmentImageUrl;
    if (!garment)
      return { ok: false, mode: 'runware-flux', outfitId, message: 'No garment reference image is available for this look, so an AI try-on cannot be generated.' };

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      const task = {
        taskType: 'imageInference',
        taskUUID: crypto.randomUUID(),
        model: MODEL,
        positivePrompt: buildPrompt(gender, garmentDescription),
        // Result comes back INLINE (no file stored, nothing to expire) — best for privacy.
        outputType: 'dataURI',
        outputFormat: 'JPEG',
        includeCost: true,
        ttl: OUTPUT_TTL,
        inputs: {
          referenceImages: [
            { image: photo, role: 'person' },   // private user photo (data URI / base64)
            { image: garment, role: 'garment' }, // VIRAAS reference (inlined) or grid
          ],
        },
      };
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${API_KEY}` },
        body: JSON.stringify([task]),
        signal: controller.signal,
      });
      const body = await res.json().catch(() => null);
      if (!res.ok) {
        const msg = body?.errors?.[0]?.message || `Provider error (${res.status}).`;
        return { ok: false, mode: 'runware-flux', outfitId, message: mapError(msg) };
      }
      if (body?.errors?.length) return { ok: false, mode: 'runware-flux', outfitId, message: mapError(body.errors[0]?.message || 'Provider error.') };

      const item = Array.isArray(body?.data) ? body.data.find((d) => d.taskType === 'imageInference') || body.data[0] : null;
      if (!item) return { ok: false, mode: 'runware-flux', outfitId, message: 'Provider returned no image.' };

      let resultImage = item.imageDataURI || null;
      if (!resultImage && item.imageBase64Data) resultImage = `data:image/jpeg;base64,${item.imageBase64Data}`;
      if (!resultImage && (item.imageURL || item.imageUrl)) {
        // Fallback: consume the (TTL-limited) URL server-side; never expose it to the browser.
        const img = await fetch(item.imageURL || item.imageUrl, { signal: controller.signal });
        if (!img.ok) return { ok: false, mode: 'runware-flux', outfitId, message: 'Could not retrieve the generated image.' };
        const buf = Buffer.from(await img.arrayBuffer());
        resultImage = `data:${img.headers.get('content-type') || 'image/jpeg'};base64,${buf.toString('base64')}`;
      }
      if (!resultImage) return { ok: false, mode: 'runware-flux', outfitId, message: 'Provider returned no image.' };
      return { ok: true, mode: 'runware-flux', provider: 'runware-flux-vto', outfitId, resultImage, cost: item.cost };
    } catch (e) {
      return { ok: false, mode: 'runware-flux', outfitId, message: e && e.name === 'AbortError' ? 'The try-on timed out. Please try again.' : mapError(String(e.message || e)) };
    } finally {
      clearTimeout(timer);
    }
  },
};

function mapError(m) {
  const s = String(m || '');
  if (/timeout/i.test(s)) return 'The try-on timed out. Please try again.';
  if (/moderat|nsfw|safety/i.test(s)) return 'The photo or outfit was blocked by the provider’s safety filter.';
  if (/rate|quota|429|insufficient|credit|balance/i.test(s)) return 'The try-on service is unavailable right now (rate limit or credits). Please try again later.';
  if (/auth|api key|unauthorized|401|403/i.test(s)) return 'The try-on provider rejected the credentials.';
  return 'The try-on provider could not complete this request.';
}
