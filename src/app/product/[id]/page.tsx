import Link from "next/link";
import { notFound } from "next/navigation";
import { Img } from "@/components/Img";
import { SaveButton } from "@/components/SaveButton";
import { ShareBar } from "@/components/ShareBar";
import { ProductGrid } from "@/components/ProductCard";
import { ALL_PRODUCTS, getProduct, completeTheLook, relatedProducts, WORLD_LABEL, isListed } from "@/lib/catalog";
import { formatINR, discountLabel } from "@/lib/money";
import { pageMeta, productJsonLd } from "@/lib/seo";

export function generateStaticParams() {
  return ALL_PRODUCTS.map((p) => ({ id: p.id }));
}

export function generateMetadata({ params }: { params: { id: string } }) {
  const p = getProduct(params.id);
  if (!p) return pageMeta("Not found", "Product not found.", params.id);
  return pageMeta(
    p.title,
    `${p.description.slice(0, 150)} ${formatINR(p.price)} on ${p.merchant}. Try it on you at VIRAAS.`,
    `/product/${p.id}`
  );
}

export default function ProductPage({ params }: { params: { id: string } }) {
  const p = getProduct(params.id);
  if (!p) notFound();
  const disc = discountLabel(p.price, p.mrp);
  const ctl = completeTheLook(p, 6).filter(isListed);
  const mayLike = relatedProducts(p, 4);
  const sizeInfo = p.gender === "women" ? "Women's sizing — XS (34) to XL (42). True to festive wear; size up for layered drapes." : "Men's sizing — S (38) to XXL (46). Relaxed festive cuts fit true to size.";

  return (
    <div className="container-page py-10 lg:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(p)) }} />
      <nav className="mb-6 text-xs text-ink-soft" aria-label="Breadcrumb">
        <Link href={p.gender === "women" ? "/women" : "/men"} className="hover:text-rani">{p.gender === "women" ? "Women" : "Men"}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${p.gender}/${p.categorySlug}`} className="hover:text-rani">{p.category}</Link>
        <span className="mx-2">/</span>
        <span>{p.title}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr]">
        {/* Gallery */}
        <div>
          <div className="relative overflow-hidden bg-ivory-deep" style={{ aspectRatio: "3/4" }}>
            {isListed(p) ? (
              <Img
                src={p.gallery[0] ?? p.imageUrl}
                alt={`${p.title} — ${p.colour} ${p.silhouette}, ${p.embroidery}, ${p.fabric}, full ${p.category.toLowerCase()} front view`}
                width={1100}
                height={1466}
                priority
                className="h-full w-full"
              />
            ) : (
              <div className="flex h-full items-center justify-center p-10 text-center">
                <div>
                  <p className="font-display text-xl">Production image queued</p>
                  <p className="mt-2 max-w-xs text-sm text-ink-soft">
                    This look renders in strict priority order ({WORLD_LABEL[p.occasion] || p.occasion} · {p.gender}). No placeholders — the real editorial shot lands here.
                  </p>
                </div>
              </div>
            )}
          </div>
          {isListed(p) && p.gallery.length > 1 ? (
            <div className="mt-3 grid grid-cols-4 gap-3">
              {p.gallery.map((g) => (
                <div key={g} className="relative overflow-hidden bg-ivory-deep" style={{ aspectRatio: "3/4" }}>
                  <Img src={g} alt={`${p.title} gallery view`} width={300} height={400} className="h-full w-full" />
                </div>
              ))}
            </div>
          ) : null}
        </div>

        {/* Buy box */}
        <div>
          <p className="kicker">{p.merchant} · {p.brand}</p>
          <h1 className="heading-lg mt-2">{p.title}</h1>
          <div className="mt-4 flex flex-wrap items-baseline gap-3">
            <span className="text-3xl font-700">{formatINR(p.price)}</span>
            {disc ? (
              <>
                <span className="text-sm text-ink-soft line-through">{formatINR(p.mrp)}</span>
                <span className="text-sm font-700 text-rani">{disc}</span>
              </>
            ) : null}
          </div>
          <p className="mt-1 text-xs text-ink-soft">MRP incl. taxes · prices verified {p.lastChecked} — marked CHECK where listing-level detail is unverified.</p>

          <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 border-y border-ink/10 py-5 text-sm">
            <div><dt className="text-[11px] uppercase tracking-editorial text-ink-soft">Colour</dt><dd className="mt-0.5 font-600">{p.colour}{p.secondaryColours.length ? ` + ${p.secondaryColours.join(", ")}` : ""}</dd></div>
            <div><dt className="text-[11px] uppercase tracking-editorial text-ink-soft">Occasion</dt><dd className="mt-0.5 font-600">{WORLD_LABEL[p.occasion] || p.occasion}</dd></div>
            <div><dt className="text-[11px] uppercase tracking-editorial text-ink-soft">Style</dt><dd className="mt-0.5 font-600">{p.styleTags.slice(0, 3).join(" · ")}</dd></div>
            <div><dt className="text-[11px] uppercase tracking-editorial text-ink-soft">Fabric</dt><dd className="mt-0.5 font-600">{p.fabric}</dd></div>
            <div><dt className="text-[11px] uppercase tracking-editorial text-ink-soft">Pattern</dt><dd className="mt-0.5 font-600">{p.pattern}</dd></div>
            <div><dt className="text-[11px] uppercase tracking-editorial text-ink-soft">Embroidery</dt><dd className="mt-0.5 font-600">{p.embroidery}</dd></div>
            <div><dt className="text-[11px] uppercase tracking-editorial text-ink-soft">Silhouette</dt><dd className="mt-0.5 font-600">{p.silhouette}</dd></div>
            <div><dt className="text-[11px] uppercase tracking-editorial text-ink-soft">Sizes</dt><dd className="mt-0.5 font-600">{p.sizes.join(" · ")}</dd></div>
          </dl>
          <p className="mt-3 text-xs text-ink-soft">Size info: {sizeInfo}</p>

          <div id="shop" className="mt-8 flex flex-wrap gap-3">
            {p.tryOnEnabled ? (
              <Link href={`/try-on/${p.id}`} className="btn-primary !bg-rani">Try this outfit on you</Link>
            ) : null}
            <a
              className="btn-primary"
              href={p.merchantUrl === "CHECK" ? undefined : p.merchantUrl}
              target={p.merchantUrl === "CHECK" ? undefined : "_blank"}
              rel="noopener noreferrer nofollow"
              aria-disabled={p.merchantUrl === "CHECK"}
              title={p.merchantUrl === "CHECK" ? "Merchant listing URL unverified" : `Opens ${p.merchant}`}
            >
              Shop this outfit
            </a>
            <SaveButton kind="product" id={p.id} title={p.title} imageUrl={p.imageUrl} meta={`${formatINR(p.price)} · ${p.merchant}`} />
          </div>
          {p.merchantUrl === "CHECK" ? (
            <p className="mt-3 text-xs font-600 text-rani">CHECK — exact marketplace listing URL unverified. Open {p.merchant} and search “{p.title}”.</p>
          ) : null}
          <p className="mt-3 text-xs text-ink-soft">Affiliate status: {p.affiliateUrl ? "Configured" : "Affiliate link not configured"}</p>
          <div className="mt-4">
            <ShareBar title={p.title} url={`/product/${p.id}`} />
          </div>
          <p className="mt-5 text-xs leading-relaxed text-ink-soft">{p.notes}</p>
        </div>
      </div>

      {/* WHY WE PICKED IT */}
      <section className="mt-16 border-t border-ink/10 pt-10">
        <h2 className="heading-md">Why we picked it</h2>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-ink-soft sm:text-base">{p.description}</p>
      </section>

      {/* COMPLETE THE LOOK */}
      <section className="mt-14">
        <h2 className="heading-md">Complete the look</h2>
        <p className="mt-2 text-sm text-ink-soft">Pieces the styling desk would pair with this — same world, real catalog.</p>
        {ctl.length ? (
          <div className="mt-6"><ProductGrid products={ctl} cols={3} /></div>
        ) : (
          <div className="mt-6 border border-dashed border-ink/20 bg-white/60 p-8 text-center text-sm text-ink-soft">
            Pairing pieces render as their production imagery lands (queue priority order).
          </div>
        )}
      </section>

      {/* YOU MAY ALSO LIKE */}
      <section className="mt-14">
        <h2 className="heading-md">You may also like</h2>
        {mayLike.length ? (
          <div className="mt-6"><ProductGrid products={mayLike} /></div>
        ) : (
          <div className="mt-6 border border-dashed border-ink/20 bg-white/60 p-8 text-center text-sm text-ink-soft">
            Related looks render as their production imagery lands (queue priority order).
          </div>
        )}
      </section>
    </div>
  );
}
