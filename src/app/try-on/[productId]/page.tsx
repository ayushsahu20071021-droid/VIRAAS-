import Link from "next/link";
import { notFound } from "next/navigation";
import { Img } from "@/components/Img";
import { TryOnFlow } from "@/components/TryOnFlow";
import { ALL_PRODUCTS, getProduct, isListed, WORLD_LABEL } from "@/lib/catalog";
import { formatINR } from "@/lib/money";
import { pageMeta } from "@/lib/seo";

export function generateStaticParams() {
  return ALL_PRODUCTS.filter((p) => p.tryOnEnabled).map((p) => ({ productId: p.id }));
}

export function generateMetadata({ params }: { params: { productId: string } }) {
  const p = getProduct(params.productId);
  if (!p) return pageMeta("Not found", "Product not found.", params.productId);
  return pageMeta(`Try on — ${p.title}`, `See ${p.title} on you. 18+ gate, demo-labelled output, then shop the real outfit on ${p.merchant}.`, `/try-on/${p.id}`);
}

export default function TryOnProductPage({ params }: { params: { productId: string } }) {
  const p = getProduct(params.productId);
  if (!p || !p.tryOnEnabled) notFound();
  return (
    <div className="container-page py-10 lg:py-14">
      <nav className="mb-6 text-xs text-ink-soft" aria-label="Breadcrumb">
        <Link href="/try-on" className="hover:text-rani">Try On</Link>
        <span className="mx-2">/</span>
        <span>{p.title}</span>
      </nav>
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="relative overflow-hidden bg-ivory-deep" style={{ aspectRatio: "3/4" }}>
          {isListed(p) ? (
            <Img src={p.imageUrl} alt={`${p.title} — try-on reference garment shot`} width={1000} height={1333} priority className="h-full w-full" />
          ) : (
            <div className="flex h-full items-center justify-center p-10 text-center">
              <p className="text-sm text-ink-soft">Production image queued — {WORLD_LABEL[p.occasion] || p.occasion} · {p.gender}</p>
            </div>
          )}
        </div>
        <div>
          <p className="kicker">Try this outfit on you</p>
          <h1 className="heading-lg mt-2">{p.title}</h1>
          <p className="mt-3 text-lg font-700">{formatINR(p.price)} <span className="ml-2 text-xs font-500 uppercase tracking-editorial text-ink-soft">{p.merchant}</span></p>
          <p className="mt-4 text-sm leading-relaxed text-ink-soft">{p.description}</p>
          <TryOnFlow product={{ id: p.id, title: p.title, imageUrl: p.imageUrl, sizes: p.sizes }} />
        </div>
      </div>
    </div>
  );
}
