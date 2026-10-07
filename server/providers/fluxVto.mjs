// FLUX VTO (Black Forest Labs) provider adapter — ISOLATED here so no provider-specific
// code leaks into the server routes or the React UI.
//
// Why this provider: FLUX VTO is currently the only widely-available try-on model that natively
// supports multi-garment / full-outfit composition (up to 4 garments), layering, and model-to-model
// transfer with a natural-language prompt. That combination is what lets a coordinated Indian
// ethnic look (lehenga + choli + dupatta, saree + blouse + drape, kurta + bottom + dupatta) be
// transferred as SEPARATE pieces instead of collapsing into a single one-piece dress.
//
// IMPORTANT PRIVACY GATE:
// The STANDARD Black Forest Labs API trains on user inputs/outputs by default and provides no clean
// programmatic opt-out (perpetual, irrevocable license per BFL's Privacy Policy / ToS). Zero-Data-
// Retention (ZDR) is only offered on an enterprise / dedicated deployment (or a verified ZDR reseller).
// Because VIRAAS uploads are personal photos, this adapter REFUSES to send a photo unless the owner
// has explicitly acknowledged a Zero-Data-Retention deployment via BFL_VTO_ZDR=true. This makes it
// impossible to accidentally stream customer photos to a train-by-default endpoint.
//
// This module never writes the photo to disk, never logs the raw image/base64, and consumes the
// provider's short-lived (10-minute) signed result URL server-side, returning the result inline so
// the browser never receives the provider URL.

const API_KEY = process.env.BFL_API_KEY || '';
const API_BASE = (process.env.BFL_API_BASE || 'https://api.bfl.ai').replace(/\/$/, '');
const ENDPOINT = process.env.BFL_VTO_ENDPOINT || '/v1/flux-tools/vto-v1';
const ZDR_ACK = (process.env.BFL_VTO_ZDR || '').toLowerCase() === 'true';
const TIMEOUT_MS = Number(process.env.TRYON_TIMEOUT_MS || 60000);
const POLL_INTERVAL_MS = Number(process.env.BFL_POLL_INTERVAL_MS || 1500);

// Real generation is only "configured" when a key exists AND ZDR has been acknowledged.
export const fluxConfigured = Boolean(API_KEY) && ZDR_ACK;

// Strip a data-URL prefix down to raw base64 (BFL expects raw base64 or an http(s) URL).
function toRawBase64(input) {
  if (typeof input !== 'string') return '';
  const i = input.indexOf('base64,');
  return i >= 0 ? input.slice(i + 'base64,'.length) : input;
}
const isHttpUrl = (s) => typeof s === 'string' && /^https?:\/\//i.test(s);

// Build a prompt that forces coordinated ethnic sets to stay as separate garments.
function buildPrompt(gender, garmentDescription) {
  const who = gender === 'men' ? 'man' : gender === 'women' ? 'woman' : 'person';
  const desc = garmentDescription ? ` The outfit is: ${garmentDescription}.` : '';
  return (
    `The ${who} in image 1, keeping exactly their face, body shape and pose, now wearing the complete ` +
    `outfit worn by the model in image 2.${desc} Preserve every garment as a separate, distinct piece — ` +
    `for example a lehenga skirt, a fitted choli/blouse and a draped dupatta must each remain visible and ` +
    `must NOT be merged into a single one-piece dress; a kurta, its bottom and any dupatta/stole must stay ` +
    `separate. Faithfully keep the colours, print, embroidery and fabric of image 2. ` +
    `Full-length, realistic festive fashion photograph, natural proportions, no extra limbs or artifacts.`
  );
}

async function poll(pollUrl, signal) {
  const deadline = Date.now() + TIMEOUT_MS;
  while (Date.now() < deadline) {
    const r = await fetch(pollUrl, { headers: { accept: 'application/json', 'x-key': API_KEY }, signal });
    if (!r.ok) throw new Error(`poll-http-${r.status}`);
    const data = await r.json();
    const status = data.status;
    if (status === 'Ready') return data.result?.sample;
    if (status && status !== 'Pending' && status !== 'Processing' && status !== 'Queued') {
      throw new Error(`status-${status}`);
    }
    await new Promise((res) => setTimeout(res, POLL_INTERVAL_MS));
  }
  throw new Error('timeout');
}

export const fluxVtoProvider = {
  name: 'flux',
  provider: 'flux-vto',
  get configured() {
    return fluxConfigured;
  },
  async generateTryOn({ outfitId, gender, photo, garmentImageUrl, garmentDescription }) {
    if (!API_KEY) return { ok: false, mode: 'flux', configured: false, outfitId, message: 'FLUX VTO is not configured on the server (missing API key).' };
    // Hard privacy gate — never send a personal photo to a train-by-default endpoint.
    if (!ZDR_ACK)
      return {
        ok: false, mode: 'flux', configured: false, privacy: 'unverified', outfitId,
        message: 'FLUX VTO is not enabled: a Zero-Data-Retention deployment has not been acknowledged (set BFL_VTO_ZDR=true only when using a ZDR endpoint whose no-training/no-retention terms you have verified).',
      };
    if (!garmentImageUrl)
      return { ok: false, mode: 'flux', outfitId, message: 'No garment reference image is available for this look, so an AI try-on cannot be generated.' };

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      const payload = {
        prompt: buildPrompt(gender, garmentDescription),
        person: toRawBase64(photo),
        garment: isHttpUrl(garmentImageUrl) ? garmentImageUrl : toRawBase64(garmentImageUrl),
        output_format: 'jpeg',
        safety_tolerance: 2,
      };
      const submit = await fetch(`${API_BASE}${ENDPOINT}`, {
        method: 'POST',
        headers: { accept: 'application/json', 'x-key': API_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      if (!submit.ok) return { ok: false, mode: 'flux', outfitId, message: `Provider rejected the request (${submit.status}).` };
      const meta = await submit.json();
      const pollUrl = meta.polling_url || `${API_BASE}/v1/get_result?id=${meta.id}`;
      const sampleUrl = await poll(pollUrl, controller.signal);
      if (!sampleUrl) return { ok: false, mode: 'flux', outfitId, message: 'Provider returned no image.' };

      // Consume the short-lived signed URL server-side; return the image inline (never expose the URL).
      const img = await fetch(sampleUrl, { signal: controller.signal });
      if (!img.ok) return { ok: false, mode: 'flux', outfitId, message: 'Could not retrieve the generated image.' };
      const buf = Buffer.from(await img.arrayBuffer());
      const contentType = img.headers.get('content-type') || 'image/jpeg';
      const resultImage = `data:${contentType};base64,${buf.toString('base64')}`;
      return { ok: true, mode: 'flux', provider: 'flux-vto', outfitId, resultImage };
    } catch (e) {
      const msg = e && e.name === 'AbortError' ? 'Provider timed out.' : mapError(String(e.message || e));
      return { ok: false, mode: 'flux', outfitId, message: msg };
    } finally {
      clearTimeout(timer);
    }
  },
};

function mapError(m) {
  if (m.includes('timeout')) return 'The try-on timed out. Please try again.';
  if (m.includes('Moderated')) return 'The photo or outfit was blocked by the provider’s safety filter.';
  if (m.includes('poll-http-429') || m.includes('-429')) return 'The try-on service is busy (rate limited). Please try again shortly.';
  return 'The try-on provider could not complete this request.';
}
