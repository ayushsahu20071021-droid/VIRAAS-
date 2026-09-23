import Link from "next/link";
import { notFound } from "next/navigation";
import { Img } from "@/components/Img";
import { SaveButton } from "@/components/SaveButton";
import { ShareBar } from "@/components/ShareBar";
import { ProductCard } from "@/components/ProductCard";
import { ALL_COUPLES, getCouple, coupleProducts, WORLD_LABEL, WORLDS, isCoupleReady } from "@/lib/catalog";
import { formatINR } from "@/lib/money";
import { pageMeta } from "@/lib/seo";

export function generateStaticParams() {
  return ALL_COUPLES.map((c) => ({ id: c.id }));
}

export function generateMetadata({ params }: { params: { id: string } }) {
  const look = getCouple(params.id);
  if (!look) return pageMeta("Not found", "Couple look not found.", params.id);
  return pageMeta(
    `${look.title} — Couple Edit`,
    `${look.colourStory}. ${look.poseDirection}. Shop the full look for ${formatINR(look.totalPrice)} across linked VIRAAS products.`,
    `/couple-edit/${look.id}`
  );
}

export default function CoupleDetailPage({ params }: { params: { id: string } }) {
  const look = getCouple(params.id);
  if (!look) notFound();
  const { her, his } = coupleProducts(look);
  const others = ALL_COUPLES.filter((c) => c.world === look.world && c.id !== look.id).slice(0, 4);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProductGroup",
    name: look.title,
    description: look.description,
    image: look.imageUrl,
    productGroupID: look.id,
    offers: { "@type": "AggregateOffer", priceCurrency: "INR", lowPrice: Math.min(...[...her, ...his].map((p) => p.price), look.totalPrice), highPrice: look.totalPrice }
  };

  return (
    <div className="container-page py-10 lg:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav className="mb-6 text-xs text-ink-soft" aria-label="Breadcrumb">
        <Link href="/couple-edit" className="hover:text-rani">Couple Edit</Link>
        <span className="mx-2">/</span>
        <Link href={`/occasions/${look.world}`} className="hover:text-rani">{WORLD_LABEL[look.world] || look.world}</Link>
        <span className="mx-2">/</span>
        <span>{look.title}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <div className="relative overflow-hidden bg-ink" style={{ aspectRatio: "3/4" }}>
            <Img src={look.imageUrl} alt={`${look.title} — youthful Indian couple ${look.poseDirection} in ${look.colourStory} at ${WORLD_LABEL[look.world] || look.world}`} width={1000} height={1333} priority className="h-full w-full" />
          </div>
          <div className="mt-4 flex items-center justify-between gap-4">
            <SaveButton kind="couple" id={look.id} title={look.title} imageUrl={look.imageUrl} meta={look.colourStory} />
            <ShareBar title={look.title} url={`/couple-edit/${look.id}`} />
          </div>
        </div>
        <div>
          <p className="kicker">{WORLD_LABEL[look.world] || look.world} · Couple Edit</p>
          <h1 className="heading-lg mt-2">{look.title}</h1>
          <p className="mt-2 font-display text-lg italic text-rani">{look.colourStory}</p>
          <p className="mt-4 text-sm leading-relaxed text-ink-soft sm:text-base">{look.description}</p>

          <dl className="mt-6 grid grid-cols-2 gap-4 border-y border-ink/10 py-5 text-sm">
            <div>
              <dt className="text-[11px] uppercase tracking-editorial text-ink-soft">Colour story</dt>
              <dd className="mt-1 font-600">{look.colourStory}</dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-editorial text-ink-soft">Pose direction</dt>
              <dd className="mt-1 font-600">{look.poseDirection}</dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-editorial text-ink-soft">Full look total</dt>
              <dd className="mt-1 font-600">{formatINR(look.totalPrice)}</dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-editorial text-ink-soft">World</dt>
              <dd className="mt-1 font-600">{WORLD_LABEL[look.world] || look.world}</dd>
            </div>
          </dl>

          <div className="mt-6 flex flex-wrap gap-2">
            {look.tags.map((t) => (
              <span key={t} className="border border-ink/10 px-2.5 py-1 text-[11px] uppercase tracking-wide text-ink-soft">{t}</span>
            ))}
          </div>

          <h2 className="heading-md mt-10">Shop the look</h2>
          <p className="mt-2 text-sm text-ink-soft">Matched, not matching — every piece connects to a real VIRAAS catalog product.</p>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div>
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-editorial text-rani">For her ({formatINR(her.reduce((s, p) => s + p.price, 0))})</p>
              <div className="grid gap-4">
                {her.filter((p) => p.status === "listed").map((p) => <ProductCard key={p.id} product={p} />)}
                {!her.some((p) => p.status === "listed") ? <p className="text-xs text-ink-soft">Her pieces render as production frames land — {her.length} linked catalog items ready.</p> : null}
              </div>
            </div>
            <div>
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-editorial text-rani">For him ({formatINR(his.reduce((s, p) => s + p.price, 0))})</p>
              <div className="grid gap-4">
                {his.filter((p) => p.status === "listed").map((p) => <ProductCard key={p.id} product={p} />)}
                {!his.some((p) => p.status === "listed") ? <p className="text-xs text-ink-soft">His pieces render as production frames land — {his.length} linked catalog items ready.</p> : null}
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="mt-16">
        <h2 className="heading-md">More {WORLD_LABEL[look.world] || look.world} couple looks</h2>
        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {others.filter(isCoupleReady).map((c) => (
            <Link key={c.id} href={`/couple-edit/${c.id}`} className="group block overflow-hidden bg-ink text-ivory">
              <div className="relative" style={{ aspectRatio: "3/4" }}>
                <Img src={c.imageUrl} alt={`${c.title} — couple edit`} width={600} height={800} className="h-full w-full transition group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 to-transparent" />
              </div>
              <p className="p-3 font-display text-sm">{c.title}</p>
            </Link>
          ))}
          {others.filter(isCoupleReady).length === 0 ? (
            <p className="col-span-2 text-sm text-ink-soft lg:col-span-4">More frames from this world render as production photography lands.</p>
          ) : null}
        </div>
      </section>
      <p className="mt-10 text-xs text-ink-soft">
        Worlds: {WORLDS.map((w) => w.label).join(" · ")} — exactly these five, no ghost occasions.
      </p>
    </div>
  );
}
