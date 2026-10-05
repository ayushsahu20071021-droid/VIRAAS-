import Link from "next/link";
import { Browse } from "@/components/Browse";
import { COLLECTIONS, listedProducts, prioritySort } from "@/lib/catalog";
import { facetStateFrom, type SearchParams } from "@/lib/query";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "Trending",
  "Editorial trending picks from the VIRAAS styling desk — no fake popularity, just what works on the ground this festive season.",
  "/trending"
);

export default function TrendingPage({ searchParams }: { searchParams: SearchParams }) {
  const state = facetStateFrom(searchParams);
  const products = prioritySort(listedProducts());
  return (
    <Browse
      kicker="Stylists' radar"
      title="TRENDING"
      sub="Editorial picks only — VIRAAS does not fabricate popularity, ratings or reviews. This is what our styling desk keeps seeing across pandals, fest grounds and terraces."
      products={products}
      base="/trending"
      state={state}
      extra={
        <div className="mb-10 grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {COLLECTIONS.trending.map((t) => (
            <Link key={t.id} href={`/search?${new URLSearchParams({ ...(t.query.colour ? { colour: String(t.query.colour) } : {}), ...(t.query.world ? { occasion: String(t.query.world) } : {}) }).toString()}`} className="border border-ink/10 bg-white p-5 hover:border-rani">
              <p className="font-display text-lg">{t.title}</p>
              <p className="mt-1 text-xs text-ink-soft">{t.sub}</p>
            </Link>
          ))}
        </div>
      }
    />
  );
}
