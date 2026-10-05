"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { SaveButton } from "@/components/SaveButton";
import { ShareBar } from "@/components/ShareBar";

interface Props {
  product: { id: string; title: string; imageUrl: string; sizes: string[] };
}

type Stage = "gate" | "upload" | "preview" | "result";

export function TryOnFlow({ product }: Props) {
  const [stage, setStage] = useState<Stage>("gate");
  const [adult, setAdult] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const [size, setSize] = useState(product.sizes[0] ?? "M");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ mode: string; label: string; message: string; disclaimer: string } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      setPhoto(String(reader.result));
      setStage("preview");
    };
    reader.readAsDataURL(f);
  }

  async function generate() {
    if (!photo) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/try-on", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, photoDataUrl: photo, adultConfirmed: true, size })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Try-on failed");
      setResult(data.result);
      setStage("result");
      // Demo composite: user photo + real product image, clearly labelled.
      const canvas = canvasRef.current;
      if (canvas && photo) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          const W = 1000, H = 640;
          canvas.width = W;
          canvas.height = H;
          ctx.fillStyle = "#14100E";
          ctx.fillRect(0, 0, W, H);
          const userImg = new Image();
          const prodImg = new Image();
          userImg.src = photo;
          prodImg.src = product.imageUrl;
          await Promise.all([
            new Promise((r) => { userImg.onload = r; userImg.onerror = r; }),
            new Promise((r) => { prodImg.onload = r; prodImg.onerror = r; })
          ]);
          const drawCover = (img: HTMLImageElement, x: number, y: number, w: number, h: number) => {
            const s = Math.max(w / (img.width || 1), h / (img.height || 1));
            const dw = (img.width || 1) * s, dh = (img.height || 1) * s;
            ctx.drawImage(img, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
          };
          drawCover(userImg, 0, 0, W / 2, H);
          drawCover(prodImg, W / 2, 0, W / 2, H);
          ctx.fillStyle = "#E01E77";
          ctx.fillRect(0, H - 54, W, 54);
          ctx.fillStyle = "#FAF5EE";
          ctx.font = "600 22px sans-serif";
          ctx.fillText("DEMO OUTPUT — composed preview, not a photorealistic render", 18, H - 20);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Try-on failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-8">
      {stage === "gate" ? (
        <div className="border border-ink/15 bg-white p-6">
          <p className="text-[11px] font-semibold uppercase tracking-editorial text-rani">Step 1 · Age gate</p>
          <h2 className="mt-2 font-display text-2xl">18+ only for personal-image upload</h2>
          <p className="mt-3 text-sm text-ink-soft">
            Virtual try-on uploads a photo of you. Confirm you are 18 or older to continue. Your photo is processed per
            request only and is never stored by VIRAAS.
          </p>
          <label className="mt-5 flex items-start gap-3 text-sm">
            <input type="checkbox" checked={adult} onChange={(e) => setAdult(e.target.checked)} className="mt-1" />
            <span>I confirm I am 18+ and consent to uploading my photo for this try-on request.</span>
          </label>
          <button disabled={!adult} onClick={() => setStage("upload")} className="btn-primary mt-6 disabled:cursor-not-allowed disabled:opacity-40">
            Continue
          </button>
        </div>
      ) : null}

      {stage === "upload" ? (
        <div className="border border-ink/15 bg-white p-6">
          <p className="text-[11px] font-semibold uppercase tracking-editorial text-rani">Step 2 · Upload</p>
          <h2 className="mt-2 font-display text-2xl">Upload a clear, front-facing photo</h2>
          <p className="mt-3 text-sm text-ink-soft">Good light, simple background, full upper body. JPG or PNG.</p>
          <input type="file" accept="image/*" onChange={onFile} className="mt-5 block w-full text-sm" aria-label="Upload your photo" />
        </div>
      ) : null}

      {stage === "preview" && photo ? (
        <div className="border border-ink/15 bg-white p-6">
          <p className="text-[11px] font-semibold uppercase tracking-editorial text-rani">Step 3 · Preview</p>
          <h2 className="mt-2 font-display text-2xl">Ready to generate</h2>
          <div className="mt-5 grid grid-cols-2 gap-4">
            <div>
              <p className="mb-2 text-xs uppercase tracking-editorial text-ink-soft">Your photo</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo} alt="Your uploaded photo preview" className="w-full object-cover" style={{ aspectRatio: "3/4" }} />
            </div>
            <div>
              <p className="mb-2 text-xs uppercase tracking-editorial text-ink-soft">{product.title}</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={product.imageUrl} alt={product.title} className="w-full object-cover" style={{ aspectRatio: "3/4" }} />
            </div>
          </div>
          <label className="mt-5 block text-sm">
            <span className="text-[11px] uppercase tracking-editorial text-ink-soft">Size</span>
            <select value={size} onChange={(e) => setSize(e.target.value)} className="mt-1 block w-40 border border-ink/20 bg-ivory px-3 py-2">
              {product.sizes.map((s) => <option key={s}>{s}</option>)}
            </select>
          </label>
          <div className="mt-6 flex flex-wrap gap-3">
            <button onClick={generate} disabled={busy} className="btn-primary disabled:opacity-50">{busy ? "Generating…" : "Generate"}</button>
            <button onClick={() => { setStage("upload"); setResult(null); }} className="btn-secondary">Try another photo</button>
          </div>
          {error ? <p className="mt-4 text-sm text-rani">{error}</p> : null}
        </div>
      ) : null}

      {stage === "result" && result ? (
        <div className="border border-ink/15 bg-white p-6">
          <p className="text-[11px] font-semibold uppercase tracking-editorial text-rani">Result · {result.label}</p>
          <canvas ref={canvasRef} className="mt-4 w-full bg-ink" style={{ aspectRatio: "1000/640", maxHeight: 420 }} aria-label="Demo try-on composite result" />
          <p className="mt-4 text-sm text-ink-soft">{result.message}</p>
          <p className="mt-2 text-xs font-600 text-rani">{result.disclaimer}</p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <SaveButton kind="product" id={`tryon-${product.id}`} title={`Try-on · ${product.title}`} imageUrl={product.imageUrl} meta={result.label} />
            <ShareBar title={`My VIRAAS try-on — ${product.title}`} url={`/try-on/${product.id}`} />
            <button onClick={() => { setStage("upload"); setResult(null); }} className="btn-secondary">Try another</button>
            <Link href={`/product/${product.id}#shop`} className="btn-primary">Shop this outfit</Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
