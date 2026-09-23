// Try-On provider abstraction. Product-first virtual try-on.
// TRYON_MODE=demo → labelled demo output. Real providers plug in server-side
// only — keys are NEVER exposed to the client.

export interface TryOnRequest {
  productId: string;
  productImageUrl: string;
  userPhotoDataUrl: string;
  sizes?: string;
}

export interface TryOnResult {
  mode: "demo" | "provider";
  label: string;
  productImageUrl: string;
  composite: "client-canvas" | "remote";
  remoteImageUrl?: string;
  message: string;
  disclaimer: string;
}

export interface TryOnProvider {
  name: string;
  generateTryOn(req: TryOnRequest): Promise<TryOnResult>;
}

const DEMO_DISCLAIMER =
  "Demo output — composed preview for fit visualization only. Not a photorealistic render. 18+ gate applies to personal-image upload. Your photo is processed for this request only and is not stored.";

class DemoTryOnProvider implements TryOnProvider {
  name = "demo";
  async generateOn(req: TryOnRequest): Promise<TryOnResult> {
    return this.generateTryOn(req);
  }
  async generateTryOn(req: TryOnRequest): Promise<TryOnResult> {
    void req;
    return {
      mode: "demo",
      label: "DEMO TRY-ON PREVIEW",
      productImageUrl: req.productImageUrl,
      composite: "client-canvas",
      message: "Demo mode (TRYON_MODE=demo). Your photo and the real product image are composed side-by-side in your browser.",
      disclaimer: DEMO_DISCLAIMER
    };
  }
}

/** Real remote provider slot — configured only via server-side env keys. */
class RemoteTryOnProvider implements TryOnProvider {
  name = "remote";
  async generateTryOn(req: TryOnRequest): Promise<TryOnResult> {
    const key = process.env.TRYON_PROVIDER_KEY;
    if (!key) {
      throw new Error("TRYON_PROVIDER_KEY not configured");
    }
    // Provider integration point — the key never leaves the server.
    void req;
    void key;
    return {
      mode: "provider",
      label: "TRY-ON RESULT",
      productImageUrl: req.productImageUrl,
      composite: "remote",
      message: "Provider render requested.",
      disclaimer: "18+ gate applies to personal-image upload."
    };
  }
}

export function getTryOnProvider(): TryOnProvider {
  const mode = process.env.TRYON_MODE || "demo";
  return mode === "demo" ? new DemoTryOnProvider() : new RemoteTryOnProvider();
}

export async function tryOnProvider_generateTryOn(req: TryOnRequest): Promise<TryOnResult> {
  return getTryOnProvider().generateTryOn(req);
}
