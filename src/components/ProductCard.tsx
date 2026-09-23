import Link from "next/link";
import { Img } from "@/components/Img";
import { SaveButton } from "@/components/SaveButton";
import { formatINR, discountLabel } from "@/lib/money";
import { WORLD_LABEL } from "@/lib/catalog";
import type { Product } from "@/lib/types";

export function ProductCard({ product, aspect = "3/4" }: { product: Product; aspect?: string }) {
  const disc = discountLabel(product.price, product.mrp);
  return (
    <article className="group relative card-surface">
      <Link href={`/product/${product.id}`} className="block">
        <div className="relative overflow-hidden bg-ivory-deep" style={{ aspectRatio: aspect }}>
          <Img
            src={product.imageUrl}
            alt={`${product.title} — ${product.colour} ${product.category.toLowerCase()} with ${product.embroidery.toLowerCase()} (${WORLD_LABEL[product.occasion] || product.occasion} edit)`}
            width={900}
            height={1200}
            className="h-full w-full transition duration-500 group-hover:scale-[1.03]"
          />
        </div>
      </Link>
      <div className="absolute right-3 top-3">
        <SaveButton kind="product" id={product.id} title={product.title} imageUrl={product.imageUrl} meta={`${formatINR(product.price)} · ${product.merchant}`} />
      </div>
      <div className="flex flex-col gap-1.5 p-4">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/product/${product.id}`} className="line-clamp-2 text-sm font-600 leading-snug hover:text-rani">
            {product.title}
          </Link>
        </div>
        <p className="text-[11px] uppercase tracking-editorial text-ink-soft/80">{product.merchant}</p>
        <div className="flex flex-wrap items-baseline gap-2">
          <span className="text-base font-700">{formatINR(product.price)}</span>
          {disc ? (
            <>
              <span className="text-xs text-ink-soft/60 line-through">{formatINR(product.mrp)}</span>
              <span className="text-[11px] font-700 text-rani">{disc}</span>
            </>
          ) : null}
        </div>
        <div className="mt-1 flex flex-wrap gap-1.5">
          {[product.embroidery, product.pattern, WORLD_LABEL[product.occasion] || product.occasion].slice(0, 3).map((t) => (
            <span key={t} className="border border-ink/10 px-2 py-0.5 text-[10px] uppercase tracking-wide text-ink-soft">{t}</span>
          ))}
          {product.tryOnEnabled ? (
            <span className="border border-rani/40 bg-rani/5 px-2 py-0.5 text-[10px] font-700 uppercase tracking-wide text-rani">Try On</span>
          ) : null}
        </div>
        <div className="mt-2 flex items-center gap-2">
          <Link href={`/product/${product.id}#shop`} className="btn-primary !px-4 !py-2 !text-[11px]">Shop</Link>
          {product.tryOnEnabled ? (
            <Link href={`/try-on/${product.id}`} className="btn-secondary !px-4 !py-2 !text-[11px]">Try On</Link>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export function ProductGrid({ products, cols = 4 }: { products: Product[]; cols?: 2 | 3 | 4 }) {
  const colClass = cols === 2 ? "sm:grid-cols-2" : cols === 3 ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-4";
  return (
    <div className={`grid grid-cols-2 gap-4 sm:gap-5 lg:gap-6 ${colClass}`}>
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
