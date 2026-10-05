import { Browse } from "@/components/Browse";
import { listedProducts, prioritySort } from "@/lib/catalog";
import { facetStateFrom, type SearchParams } from "@/lib/query";
import { pageMeta } from "@/lib/seo";

const ACC = ["jewellery", "bags", "footwear", "beauty", "accessories"];

export const metadata = pageMeta(
  "Accessories",
  "Jewellery, bags, footwear, limited beauty and men's accessories — the pieces that complete every VIRAAS look.",
  "/accessories"
);

export default function AccessoriesPage({ searchParams }: { searchParams: SearchParams }) {
  const state = facetStateFrom(searchParams);
  const products = prioritySort(listedProducts().filter((p) => ACC.includes(p.categorySlug)));
  return (
    <Browse
      kicker="Finish the look"
      title="ACCESSORIES"
      sub="Jhumkas, potlis, juttis, mojaris, stoles, kajal — festive finishing pieces, most under ₹999."
      products={products}
      base="/accessories"
      state={state}
    />
  );
}
