import { CoupleGrid } from "@/components/CoupleCard";
import { ALL_COUPLES, WORLDS } from "@/lib/catalog";
import { pageMeta } from "@/lib/seo";
import Link from "next/link";

export const metadata = pageMeta(
  "Couple Edit — Matched, Not Matching",
  "100 real-human youthful Indian couple looks across Garba, College Fest, Diwali, Festive Party and Traditional — 20 per world. Candid, aesthetic, reference-led.",
  "/couple-edit"
);

export default function CoupleEditPage() {
  const byWorld = WORLDS.map((w) => ({ world: w, looks: ALL_COUPLES.filter((c) => c.world === w.slug) }));
  return (
    <div className="container-page py-12 lg:py-16">
      <header className="max-w-3xl">
        <p className="kicker">Real-human · 18–25 · Reference-led</p>
        <h1 className="heading-xl mt-2">COUPLE EDIT</h1>
        <p className="mt-3 font-display text-2xl italic text-rani">MATCHED, NOT MATCHING.</p>
        <p className="mt-4 text-sm leading-relaxed text-ink-soft sm:text-base">
          100 couple looks — exactly 20 in each of the five worlds. Colour harmony is intentional, poses stay candid,
          and every look shops back to real catalog products. Garba/Navratri leads, always.
        </p>
      </header>

      {byWorld.map(({ world, looks }) => (
        <section key={world.slug} className="mt-14">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide2 text-rani">Priority {world.priority}</p>
              <h2 className="heading-md mt-1">{world.label} — {looks.length} looks</h2>
            </div>
            <Link href={`/occasions/${world.slug}`} className="text-[12px] font-semibold uppercase tracking-editorial text-rani hover:underline">
              Shop {world.label} →
            </Link>
          </div>
          <CoupleGrid looks={looks} />
        </section>
      ))}
    </div>
  );
}
