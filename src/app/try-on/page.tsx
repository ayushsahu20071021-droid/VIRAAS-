import Link from "next/link";
import { ProductGrid } from "@/components/ProductCard";
import { listedProducts, prioritySort } from "@/lib/catalog";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "Try On — See It On You",
  "Product-first AI virtual try-on: pick an outfit, confirm 18+, upload your photo, generate, save, share and shop the real outfit.",
  "/try-on"
);

export default function TryOnPage() {
  const eligible = prioritySort(listedProducts().filter((p) => p.tryOnEnabled)).slice(0, 8);
  return (
    <div className="container-page py-12 lg:py-16">
      <header className="max-w-3xl">
        <p className="kicker">See it on you</p>
        <h1 className="heading-xl mt-2">TRY AN OUTFIT ON YOU</h1>
        <p className="mt-4 text-sm leading-relaxed text-ink-soft sm:text-base">
          PRODUCT → TRY THIS OUTFIT ON YOU → 18+ GATE → UPLOAD PHOTO → PREVIEW → GENERATE → RESULT → SAVE / SHARE → TRY ANOTHER → SHOP.
          Demo mode is labelled clearly; personal-image upload is 18+ only and never stored.
        </p>
      </header>
      {eligible.length ? (
        <section className="mt-12">
          <h2 className="heading-md">Try-on ready looks</h2>
          <div className="mt-6"><ProductGrid products={eligible} /></div>
        </section>
      ) : (
        <div className="mt-12 border border-dashed border-ink/20 bg-white/60 p-10 text-center">
          <p className="font-display text-xl">Try-on looks rendering</p>
          <p className="mt-2 text-sm text-ink-soft">Product imagery lands in strict priority order — try-on opens per product as its shot arrives.</p>
        </div>
      )}
      <p className="mt-10 text-xs text-ink-soft">
        Every product page with the Try On badge carries the full flow. Keys stay server-side via /api/try-on.
      </p>
    </div>
  );
}
