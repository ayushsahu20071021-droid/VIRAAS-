// Try-On provider abstraction. The only entry point is tryOnProvider.generateTryOn().
// Mode is chosen by TRYON_MODE (default "demo"). API keys are read server-side only and never sent to the browser.

const MODE = (process.env.TRYON_MODE || 'demo').toLowerCase();

const demoProvider = {
  name: 'demo',
  async generateTryOn({ productId }) {
    // Demo mode: no AI call, no storage, no fake progress. Returns a clearly labelled demo result.
    return {
      ok: true,
      mode: 'demo',
      productId,
      message: 'DEMO MODE: no AI try-on model is connected. You are seeing your photo next to the selected outfit. Your photo was not stored.',
    };
  },
};

const liveProvider = {
  name: 'live',
  async generateTryOn({ productId, photo, garmentImageUrl }) {
    const endpoint = process.env.TRYON_API_URL;
    const key = process.env.TRYON_API_KEY;
    if (!endpoint || !key) {
      return { ok: false, mode: 'live', message: 'Try-on provider is not configured on the server.' };
    }
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({ person_image: photo, garment_image: garmentImageUrl, product_id: productId }),
    });
    if (!res.ok) return { ok: false, mode: 'live', message: `Provider error (${res.status})` };
    const data = await res.json();
    return { ok: true, mode: 'live', productId, resultImage: data.result_image || data.output || null };
  },
};

export const tryOnProvider = MODE === 'live' ? liveProvider : demoProvider;
export const tryOnMode = tryOnProvider.name;
