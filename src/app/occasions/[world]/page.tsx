import Link from "next/link";
import { notFound } from "next/navigation";
import { Browse } from "@/components/Browse";
import { Img } from "@/components/Img";
import { CoupleGrid } from "@/components/CoupleCard";
import { ALL_COUPLES, listedProducts, byWorld, prioritySort, WORLDS, WORLD_LABEL, readyCouples } from "@/lib/catalog";
import { facetStateFrom, type SearchParams } from "@/lib/query";
import { pageMeta } from "@/lib/seo";

export function generateStaticParams() {
  return WORLDS.map((w) => ({ world: w.slug }));
}

export function generateMetadata({ params }: { params: { world: string } }) {
  const w = WORLDS.find((x) => x.slug === params.world);
  if (!w) return pageMeta("Not found", "Page not found.", params.world);
  const desc: Record<string, string> = {
    garba: "Garba / Navratri dressing — chaniya choli, mirror work, bandhani, contemporary Garba looks for men. Priority one at VIRAAS.",
    "college-fest": "College Fest looks — lightweight lehengas, printed ethnic shirts, campus-friendly pricing.",
    diwali: "Diwali festive looks — lehengas, sarees, pre-draped sarees, anarkalis, modern kurtas under diya light.",
    "festive-party": "Festive Party looks — black, wine, emerald, ivory and navy evening ethnic.",
    traditional: "Traditional looks — sarees, chaniya, anarkalis, kurta sets with modern youthful proportions."
  };
  return pageMeta(`${w.label} — Occasion World`, desc[w.slug] || `Shop ${w.label} at VIRAAS.`, `/occasions/${w.slug}`);
}

const HEROES: Record<string, string> = {
  garba: "/images/heroes/occasion-garba.jpg",
  "college-fest": "/images/heroes/occasion-college-fest.jpg",
  diwali: "/images/heroes/occasion-diwali.jpg",
  "festive-party": "/images/heroes/occasion-festive-party.jpg",
  traditional: "/images/heroes/occasion-traditional.jpg"
};

export default function OccasionPage({ params, searchParams }: { params: { world: string }; searchParams: SearchParams }) {
  const w = WORLDS.find((x) => x.slug === params.world);
  if (!w) notFound();
  const state = { ...facetStateFrom(searchParams) };
  const products = prioritySort(byWorld(listedProducts(), w.slug));
  const couples = ALL_COUPLES.filter((c) => c.world === w.slug);
  return (
    <>
      <section className="relative bg-ink text-ivory">
        <div className="relative h-[42vh] min-h-[320px] overflow-hidden">
          <Img src={HEROES[w.slug]} alt={`${w.label} occasion world at VIRAAS`} width={1600} height={900} className="absolute inset-0 h-full w-full object-cover opacity-80" sizes="100vw" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-ink to-ink/25" />
          <div className="container-page relative flex h-full flex-col justify-end pb-10">
            <p className="text-[11px] font-semibold uppercase tracking-wide2 text-gold-soft">Occasion world · Priority {w.priority}</p>
            <h1 className="heading-xl mt-2">{w.label.toUpperCase()}</h1>
          </div>
        </div>
      </section>
      <Browse
        kicker={WORLD_LABEL[w.slug]}
        title={`The ${w.label} edit`}
        sub="Women and men, one world. Filters stay useful — zero-result options never show."
        products={products}
        base={`/occasions/${w.slug}`}
        state={state}
        extra={
          <div className="mb-12">
            <div className="mb-5 flex items-end justify-between">
              <div>
                <p className="kicker">Couple Edit</p>
                <h2 className="heading-md mt-1">{couples.length} looks · matched, not matching</h2>
                <p className="mt-1 text-xs text-ivory/60">{readyCouples(couples).length} of {couples.length} production frames rendered</p>
              </div>
              <Link href="/couple-edit" className="text-[12px] font-semibold uppercase tracking-editorial text-rani hover:underline">All couple looks →</Link>
            </div>
            <CoupleGrid looks={couples.slice(0, 4)} />
          </div>
        }
      />
    </>
  );
}
