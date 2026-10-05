import { notFound } from "next/navigation";
import { Browse } from "@/components/Browse";
import { listedProducts, byGender, byCategory, prioritySort, TAXONOMY } from "@/lib/catalog";
import { facetStateFrom, type SearchParams } from "@/lib/query";
import { pageMeta } from "@/lib/seo";

export function generateStaticParams() {
  return TAXONOMY.menCategories.map((c) => ({ category: c.slug }));
}

export function generateMetadata({ params }: { params: { category: string } }) {
  const cat = TAXONOMY.menCategories.find((c) => c.slug === params.category);
  if (!cat) return pageMeta("Not found", "Page not found.", params.category);
  return pageMeta(
    `${cat.label} — Men`,
    `${cat.label} for young Indian festive dressing — Garba, College Fest, Diwali, Festive Party and Traditional.`,
    `/men/${cat.slug}`
  );
}

export default function MenCategoryPage({ params, searchParams }: { params: { category: string }; searchParams: SearchParams }) {
  const cat = TAXONOMY.menCategories.find((c) => c.slug === params.category);
  if (!cat) notFound();
  const state = { ...facetStateFrom(searchParams), gender: "men" };
  const products = prioritySort(byCategory(byGender(listedProducts(), "men"), cat.slug));
  return (
    <Browse
      kicker={`Men / ${cat.label}`}
      title={cat.label.toUpperCase()}
      sub={`Subcategories: ${cat.subcategories.join(" · ")}. ${cat.tryOn ? "Try On enabled on this category." : "Accessory category — completes the look."}`}
      products={products}
      base={`/men/${cat.slug}`}
      state={state}
    />
  );
}
