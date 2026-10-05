import { notFound } from "next/navigation";
import { Browse } from "@/components/Browse";
import { listedProducts, byGender, byCategory, womenCategories, prioritySort, TAXONOMY } from "@/lib/catalog";
import { facetStateFrom, type SearchParams } from "@/lib/query";
import { pageMeta } from "@/lib/seo";

export function generateStaticParams() {
  return TAXONOMY.womenCategories.map((c) => ({ category: c.slug }));
}

export function generateMetadata({ params }: { params: { category: string } }) {
  const cat = TAXONOMY.womenCategories.find((c) => c.slug === params.category);
  if (!cat) return pageMeta("Not found", "Page not found.", params.category);
  return pageMeta(
    `${cat.label} — Women`,
    `${cat.label} for Garba, College Fest, Diwali, Festive Party and Traditional — curated youth pricing under ₹8,000.`,
    `/women/${cat.slug}`
  );
}

export default function WomenCategoryPage({ params, searchParams }: { params: { category: string }; searchParams: SearchParams }) {
  const cat = TAXONOMY.womenCategories.find((c) => c.slug === params.category);
  if (!cat) notFound();
  const state = { ...facetStateFrom(searchParams), gender: "women" };
  const products = prioritySort(byCategory(byGender(listedProducts(), "women"), cat.slug));
  return (
    <Browse
      kicker={`Women / ${cat.label}`}
      title={cat.label.toUpperCase()}
      sub={`Subcategories: ${cat.subcategories.join(" · ")}. ${cat.tryOn ? "Try On enabled on this category." : "Accessory category — completes the look."}`}
      products={products}
      base={`/women/${cat.slug}`}
      state={state}
    />
  );
}
