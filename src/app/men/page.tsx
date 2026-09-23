import Link from "next/link";
import { Browse } from "@/components/Browse";
import { listedProducts, byGender, menCategories, prioritySort } from "@/lib/catalog";
import { facetStateFrom, type SearchParams } from "@/lib/query";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "Men — Modern Festive",
  "Modern ethnic shirts, printed ethnic, embroidered ethnic, modern kurtas, festive sets, festive layers, festive separates, contemporary Garba looks and accessories — 18–25, never costume.",
  "/men"
);

export default function MenPage({ searchParams }: { searchParams: SearchParams }) {
  const state = { ...facetStateFrom(searchParams), gender: "men" };
  const products = prioritySort(byGender(listedProducts(), "men"));
  return (
    <Browse
      kicker="For him"
      title="MEN"
      sub="Modern, cool, clean ethnic — ethnic shirts and relaxed kurtas for Garba grounds, fest stages and Diwali terraces. No formalwear catalogue energy."
      products={products}
      base="/men"
      state={state}
      extra={
        <div className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {menCategories().map((c) => (
            <Link key={c.slug} href={`/men/${c.slug}`} className="border border-ink/10 bg-white px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide transition hover:border-rani hover:text-rani">
              {c.label}
            </Link>
          ))}
        </div>
      }
    />
  );
}
