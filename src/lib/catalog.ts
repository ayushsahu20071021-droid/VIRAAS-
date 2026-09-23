import productsData from "@/data/products.json";
import couplesData from "@/data/couples.json";
import journalData from "@/data/journal.json";
import collectionsData from "@/data/collections.json";
import taxonomyData from "@/data/taxonomy.json";
import type { Product, CoupleLook, JournalArticle, WorldMeta } from "@/lib/types";

export const ALL_PRODUCTS = productsData as unknown as Product[];
export const ALL_COUPLES = couplesData as unknown as CoupleLook[];
export const JOURNAL = journalData as unknown as JournalArticle[];
export const COLLECTIONS = collectionsData as unknown as {
  trending: { id: string; title: string; sub: string; query: Record<string, string | number | boolean> }[];
  budget: { id: string; title: string; sub: string; maxPrice: number; query: Record<string, string | number | boolean> }[];
  completeTheLook: { id: string; title: string; query: Record<string, string | number | boolean> }[];
};
export const TAXONOMY = taxonomyData as unknown as {
  worlds: WorldMeta[];
  womenCategories: { slug: string; label: string; subcategories: string[]; tryOn: boolean }[];
  menCategories: { slug: string; label: string; subcategories: string[]; tryOn: boolean }[];
};

export const WORLDS = TAXONOMY.worlds;
export const WORLD_LABEL = Object.fromEntries(WORLDS.map((w) => [w.slug, w.label]));

export const isListed = (p: { status: string }) => p.status === "listed";

export function listedProducts(): Product[] {
  return ALL_PRODUCTS.filter(isListed);
}

export function getProduct(id: string): Product | undefined {
  return ALL_PRODUCTS.find((p) => p.id === id);
}

export function getCouple(id: string): CoupleLook | undefined {
  return ALL_COUPLES.find((c) => c.id === id);
}

export function byWorld(products: Product[], world: string): Product[] {
  return products.filter((p) => p.occasion === world);
}

export function byGender(products: Product[], gender: "women" | "men"): Product[] {
  return products.filter((p) => p.gender === gender);
}

export function byCategory(products: Product[], categorySlug: string): Product[] {
  return products.filter((p) => p.categorySlug === categorySlug);
}

export function womenCategories() {
  return TAXONOMY.womenCategories;
}
export function menCategories() {
  return TAXONOMY.menCategories;
}

/** Priority-ordered sort: Garba first, then College Fest, Diwali, Festive Party, Traditional. */
export function prioritySort<T extends { occasion: string; id: string }>(items: T[]): T[] {
  const order = Object.fromEntries(WORLDS.map((w) => [w.slug, w.priority]));
  return [...items].sort((a, b) => (order[a.occasion] ?? 9) - (order[b.occasion] ?? 9) || a.id.localeCompare(b.id));
}

export function relatedProducts(product: Product, count = 4): Product[] {
  const pool = ALL_PRODUCTS.filter(
    (p) => p.id !== product.id && isListed(p) && p.gender === product.gender && p.occasion === product.occasion
  );
  const accessory = (p: Product) =>
    ["jewellery", "bags", "footwear", "beauty", "accessories"].includes(p.categorySlug);
  const wantAccessory = !accessory(product);
  const preferred = pool.filter((p) => accessory(p) === wantAccessory);
  const base = preferred.length >= count ? preferred : pool;
  return base.slice(0, count);
}

export function completeTheLook(product: Product, count = 6): Product[] {
  const isAcc = ["jewellery", "bags", "footwear", "beauty", "accessories"].includes(product.categorySlug);
  const pool = ALL_PRODUCTS.filter(
    (p) => p.id !== product.id && isListed(p) && p.occasion === product.occasion && (isAcc ? p.gender === product.gender : true)
  );
  const outfit = pool.filter((p) => (product.gender === "women" ? p.gender === "women" : p.gender === "men") && !["jewellery", "bags", "footwear", "beauty", "accessories"].includes(p.categorySlug));
  const extras = pool.filter((p) => ["jewellery", "bags", "footwear", "beauty", "accessories"].includes(p.categorySlug));
  const out = [...outfit.slice(0, Math.ceil(count / 2)), ...extras.slice(0, Math.floor(count / 2))];
  return out.slice(0, count);
}

export function coupleProducts(look: CoupleLook): { her: Product[]; his: Product[] } {
  const pick = (ids: string[]) => ids.map(getProduct).filter((p): p is Product => Boolean(p));
  return { her: pick(look.herProductIds), his: pick(look.hisProductIds) };
}

// Progressive reveal: only couple looks whose production image exists render as cards.
import generatedImagesData from "@/data/generated-images.json";
const generatedKeys = new Set(Object.keys(generatedImagesData as Record<string, string>));

export function isCoupleReady(look: CoupleLook): boolean {
  return generatedKeys.has(`couple:${look.id}`);
}

export function readyCouples(looks?: CoupleLook[]): CoupleLook[] {
  return (looks ?? ALL_COUPLES).filter(isCoupleReady);
}

export function coupleReadyCount(world?: string): number {
  return ALL_COUPLES.filter((c) => (!world || c.world === world) && isCoupleReady(c)).length;
}
