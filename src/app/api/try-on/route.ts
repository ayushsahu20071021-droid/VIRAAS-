import { NextResponse } from "next/server";
import { tryOnProvider_generateTryOn } from "@/lib/tryOnProvider";
import { getProduct } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { productId, photoDataUrl, adultConfirmed, size } = body ?? {};

    if (!adultConfirmed) {
      return NextResponse.json({ error: "18+ confirmation required before uploading personal images." }, { status: 403 });
    }
    if (typeof photoDataUrl !== "string" || !photoDataUrl.startsWith("data:image/")) {
      return NextResponse.json({ error: "A valid uploaded photo is required." }, { status: 400 });
    }
    const product = getProduct(String(productId));
    if (!product) {
      return NextResponse.json({ error: "Unknown product." }, { status: 404 });
    }
    if (!product.tryOnEnabled) {
      return NextResponse.json({ error: "Try On is not enabled for this product." }, { status: 400 });
    }

    const result = await tryOnProvider_generateTryOn({
      productId: product.id,
      productImageUrl: product.imageUrl,
      userPhotoDataUrl: photoDataUrl,
      sizes: typeof size === "string" ? size : undefined
    });

    return NextResponse.json({ ok: true, product: { id: product.id, title: product.title, imageUrl: product.imageUrl, sizes: product.sizes }, result });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Try-on failed." }, { status: 500 });
  }
}
