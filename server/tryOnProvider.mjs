// VIRAAS AI Try-On provider abstraction.
//
// The ONLY entry point is tryOnProvider.generateTryOn(). Provider-specific code lives in
// ./providers/* and nowhere else; React/UI never sees provider details. API keys are read from
// server-side env ONLY and are never sent to the browser.
//
// Modes (TRYON_MODE):
//   demo                   — NO AI provider is called. Always refuses; never reports a successful
//                            Try-On or accepts a photo as a generated result.
//   flux                   — FLUX VTO via Black Forest Labs API. See ./providers/fluxVto.mjs.
//   runware-flux           — FLUX VTO via Runware (hosted, no-training, ZDR). See ./providers/runwareFluxVto.mjs.
//   custom / live          — Generic REST adapter for any other provider you host/verify yourself,
//                            configured via TRYON_API_URL + TRYON_API_KEY.
//
// Privacy: no provider path here persists the user photo, writes it to disk, puts it in a public
// path, or logs the raw image / base64 payload.

import { fluxVtoProvider } from './providers/fluxVto.mjs';
import { runwareFluxVtoProvider, runwareConfigured, runwareRequirements } from './providers/runwareFluxVto.mjs';

const MODE = (process.env.TRYON_MODE || 'runware-flux').toLowerCase();
const API_URL = process.env.TRYON_API_URL || '';
const API_KEY = process.env.TRYON_API_KEY || '';
const PROVIDER_NAME = process.env.TRYON_PROVIDER || '';
const TIMEOUT_MS = Number(process.env.TRYON_TIMEOUT_MS || 60000);

const demoProvider = {
  name: 'demo',
  provider: 'none',
  get configured() {
    return false;
  },
  async generateTryOn({ outfitId }) {
    // Demo mode must never masquerade as a successful Try-On or accept a user's photo.
    return {
      ok: false,
      mode: 'demo',
      configured: false,
      outfitId,
      resultImage: null,
      code: 'RUNWARE_API_KEY_REQUIRED',
      message: 'RUNWARE_API_KEY required. No image was generated.',
    };
  },
};

const customProvider = {
  name: 'custom',
  provider: PROVIDER_NAME || 'custom-provider',
  get configured() {
    return Boolean(API_URL) && Boolean(API_KEY);
  },
  async generateTryOn({ outfitId, gender, photo, garmentImageUrl, garmentDescription }) {
    if (!API_URL || !API_KEY) return { ok: false, mode: 'custom', configured: false, outfitId, message: 'Try-On provider is not configured on the server.' };
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${API_KEY}` },
        body: JSON.stringify({ person_image: photo, garment_image: garmentImageUrl || undefined, garment_description: garmentDescription || undefined, outfit_id: outfitId, gender }),
        signal: controller.signal,
      });
      if (!res.ok) return { ok: false, mode: 'custom', outfitId, message: `Provider error (${res.status}).` };
      const data = await res.json();
      const resultImage = data.result_image || data.output || data.image || null;
      if (!resultImage) return { ok: false, mode: 'custom', outfitId, message: 'Provider returned no image.' };
      return { ok: true, mode: 'custom', outfitId, provider: PROVIDER_NAME || undefined, resultImage };
    } catch (e) {
      return { ok: false, mode: 'custom', outfitId, message: e && e.name === 'AbortError' ? 'Provider timed out.' : 'Provider request failed.' };
    } finally {
      clearTimeout(timer);
    }
  },
};

function pick() {
  if (MODE === 'runware-flux') return runwareFluxVtoProvider;
  if (MODE === 'flux') return fluxVtoProvider;
  if (MODE === 'custom' || MODE === 'live') return customProvider;
  return demoProvider;
}

export const tryOnProvider = pick();
export const tryOnMode = tryOnProvider.name;
// This product's Try-On must use the existing Runware adapter, not a silent provider fallback.
export const tryOnRequirements = [
  ...(MODE !== 'runware-flux' ? [`TRYON_MODE=runware-flux required (current mode: ${MODE})`] : []),
  ...runwareRequirements(),
];
export const tryOnConfigured = MODE === 'runware-flux' && runwareConfigured;
