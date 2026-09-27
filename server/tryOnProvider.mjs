// VIRAAS AI Try-On provider abstraction.
//
// The ONLY entry point is tryOnProvider.generateTryOn(). Provider-specific code lives
// here and nowhere else; React/UI never sees provider details. API keys are read from
// server-side env ONLY and are never sent to the browser.
//
// Modes:
//   demo  (default) — NO AI provider is called. Returns a clearly-labelled non-production
//                     response. The user photo is never written to disk or stored.
//   live            — Calls the provider configured via env. Enabled only when the site
//                     owner has (a) set TRYON_MODE=live, and (b) configured a provider whose
//                     privacy / retention / training-use terms they have verified.
//
// Privacy: this module never persists the user photo, never writes it to disk, never puts
// it in a public path, and never logs the raw image / base64 payload.

const MODE = (process.env.TRYON_MODE || 'demo').toLowerCase();
const API_URL = process.env.TRYON_API_URL || '';
const API_KEY = process.env.TRYON_API_KEY || '';
const PROVIDER_NAME = process.env.TRYON_PROVIDER || '';
const TIMEOUT_MS = Number(process.env.TRYON_TIMEOUT_MS || 60000);

// Is real generation actually configured? (live mode + endpoint + key present)
export const tryOnConfigured = MODE === 'live' && Boolean(API_URL) && Boolean(API_KEY);

const demoProvider = {
  name: 'demo',
  configured: false,
  provider: 'none',
  async generateTryOn({ outfitId }) {
    // Demo mode: no AI call, no storage, no fake progress, no fabricated result image.
    return {
      ok: true,
      mode: 'demo',
      outfitId,
      resultImage: null,
      message:
        'DEMO MODE — no AI Try-On provider is connected. This is a layout preview only, not an AI-generated image. Your photo was sent only to the VIRAAS server for this preview and was not written to disk or stored.',
    };
  },
};

const liveProvider = {
  name: 'live',
  configured: tryOnConfigured,
  provider: PROVIDER_NAME || 'configured-provider',
  async generateTryOn({ outfitId, gender, photo, garmentImageUrl, garmentDescription }) {
    if (!API_URL || !API_KEY) {
      // Live requested but not actually configured — never pretend it worked.
      return { ok: false, mode: 'live', configured: false, outfitId, message: 'AI Try-On provider is not configured on the server.' };
    }
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${API_KEY}` },
        // The user photo is the person; the VIRAAS outfit is the clothing reference.
        body: JSON.stringify({
          person_image: photo,
          garment_image: garmentImageUrl || undefined,
          garment_description: garmentDescription || undefined,
          outfit_id: outfitId,
          gender,
        }),
        signal: controller.signal,
      });
      if (!res.ok) return { ok: false, mode: 'live', outfitId, message: `Provider error (${res.status}).` };
      const data = await res.json();
      const resultImage = data.result_image || data.output || data.image || null;
      if (!resultImage) return { ok: false, mode: 'live', outfitId, message: 'Provider returned no image.' };
      return { ok: true, mode: 'live', outfitId, provider: PROVIDER_NAME || undefined, resultImage };
    } catch (e) {
      const aborted = e && e.name === 'AbortError';
      return { ok: false, mode: 'live', outfitId, message: aborted ? 'Provider timed out.' : 'Provider request failed.' };
    } finally {
      clearTimeout(timer);
    }
  },
};

export const tryOnProvider = MODE === 'live' ? liveProvider : demoProvider;
export const tryOnMode = tryOnProvider.name;
