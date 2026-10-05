import Link from "next/link";
import { Browse } from "@/components/Browse";
import { Img } from "@/components/Img";
import { listedProducts, byGender, womenCategories, prioritySort } from "@/lib/catalog";
import { facetStateFrom, type SearchParams } from "@/lib/query";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "Women — Festive Edit",
  "Chaniya choli, lehengas, shararas, ghararas, sarees, pre-draped sarees, anarkalis, kurta sets, festive sets, jewellery, bags, footwear and beauty — curated for young India.",
  "/women"
);

export default function WomenPage({ searchParams }: { searchParams: SearchParams }) {
  const state = { ...facetStateFrom(searchParams), gender: "women" };
  const products = prioritySort(byGender(listedProducts(), "women"));
  return (
    <Browse
      kicker="For her"
      title="WOMEN"
      sub="Reference-led festive wardrobes — Garba/Navratri first. No co-ords, no fusion detours: just the taxonomy that works across the five worlds."
      products={products}
      base="/women"
      state={state}
      extra={
        <div className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {womenCategories().map((c) => (
            <Link key={c.slug} href={`/women/${c.slug}`} className="border border-ink/10 bg-white px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide transition hover:border-rani hover:text-rani">
              {c.label}
            </Link>
          ))}
        </div>
      }
    />
  );
}
