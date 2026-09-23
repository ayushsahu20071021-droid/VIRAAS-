// Context-aware filters — only useful facets; zero-result values hidden.
import type { Product } from "@/lib/types";

export interface FilterField {
  key: "category" | "occasion" | "colour" | "style" | "price" | "fabric" | "embroidery" | "pattern";
  label: string;
  options: { value: string; label: string; count: number }[];
}

const PRICE_BANDS = [
  { value: "0-999", label: "Under ₹999", min: 0, max: 999 },
  { value: "1000-1999", label: "₹1,000–₹1,999", min: 1000, max: 1999 },
  { value: "2000-3499", label: "₹2,000–₹3,499", min: 2000, max: 3499 },
  { value: "3500-5000", label: "₹3,500–₹5,000", min: 3500, max: 5000 },
  { value: "5000-8000", label: "₹5,000–₹8,000", min: 5000, max: 8000 }
];

export interface FacetState {
  category?: string;
  occasion?: string;
  colour?: string;
  style?: string;
  price?: string;
  fabric?: string;
  pattern?: string;
  embroidery?: string;
}

function occLabel(slug: string): string {
  return ({ "garba": "Garba / Navratri", "college-fest": "College Fest", diwali: "Diwali", "festive-party": "Festive Party", traditional: "Traditional" } as Record<string, string>)[slug] || slug;
}

function counts<T>(items: T[], key: (x: T) => string): Map<string, number> {
  const m = new Map<string, number>();
  for (const it of items) {
    const k = key(it);
    if (k) m.set(k, (m.get(k) || 0) + 1);
  }
  return m;
}

/** Build facet fields from products, hiding any option that would yield 0 results. */
export function buildFacets(products: Product[], gender: "women" | "men" | "all"): FilterField[] {
  const fields: FilterField[] = [];

  const catCounts = counts(products, (p) => p.category);
  const catOptions = Array.from(catCounts.entries())
    .map(([value, count]) => ({ value, label: value, count }))
    .sort((a, b) => b.count - a.count);
  if (catOptions.length > 1) fields.push({ key: "category", label: "Category", options: catOptions });

  const worldCounts = counts(products, (p) => p.occasion);
  const worldOptions = Array.from(worldCounts.entries())
    .map(([value, count]) => ({ value, label: occLabel(value), count }))
    .sort((a, b) => (a.value > b.value ? 1 : -1));
  if (worldOptions.length > 1) fields.push({ key: "occasion", label: "Occasion", options: worldOptions });

  const colourCounts = counts(products, (p) => p.colour);
  const colourOptions = Array.from(colourCounts.entries()).map(([value, count]) => ({ value, label: value, count })).sort((a, b) => b.count - a.count);
  if (colourOptions.length > 1) fields.push({ key: "colour", label: "Colour", options: colourOptions });

  const styleCounts = new Map<string, number>();
  for (const p of products) for (const s of p.styleTags) styleCounts.set(s, (styleCounts.get(s) || 0) + 1);
  const styleOptions = Array.from(styleCounts.entries()).map(([value, count]) => ({ value, label: value, count })).sort((a, b) => b.count - a.count);
  if (styleOptions.length > 1) fields.push({ key: "style", label: "Style", options: styleOptions.slice(0, 12) });

  const priceOptions = PRICE_BANDS.map((band) => ({
    value: band.value,
    label: band.label,
    count: products.filter((p) => p.price >= band.min && p.price <= band.max).length
  })).filter((o) => o.count > 0);
  if (priceOptions.length > 0) fields.push({ key: "price", label: "Price", options: priceOptions });

  const fabricCounts = counts(products, (p) => p.fabric);
  const fabricOptions = Array.from(fabricCounts.entries()).map(([value, count]) => ({ value, label: value, count })).sort((a, b) => b.count - a.count);
  if (fabricOptions.length > 1) fields.push({ key: "fabric", label: "Fabric", options: fabricOptions.slice(0, 10) });

  const embCounts = counts(products, (p) => p.embroidery);
  const patCounts = counts(products, (p) => p.pattern);
  const patEmb = [...Array.from(embCounts.entries()).map(([value, count]) => ({ value: `emb:${value}`, label: value, count })), ...Array.from(patCounts.entries()).map(([value, count]) => ({ value: `pat:${value}`, label: value, count }))]
    .filter((o) => o.count > 0)
    .sort((a, b) => b.count - a.count);
  if (patEmb.length > 1) fields.push({ key: "pattern", label: "Pattern / Embroidery", options: patEmb.slice(0, 12) });

  void gender;
  return fields;
}

export function applyFacet(products: Product[], key: string, value: string): Product[] {
  if (!value) return products;
  if (key === "price") {
    const band = PRICE_BANDS.find((b) => b.value === value);
    return band ? products.filter((p) => p.price >= band.min && p.price <= band.max) : products;
  }
  if (key === "pattern" && value.startsWith("emb:")) return products.filter((p) => p.embroidery === value.slice(4));
  if (key === "pattern" && value.startsWith("pat:")) return products.filter((p) => p.pattern === value.slice(4));
  if (key === "category") return products.filter((p) => p.category === value);
  if (key === "occasion") return products.filter((p) => p.occasion === value);
  if (key === "colour") return products.filter((p) => p.colour === value || p.secondaryColours.includes(value));
  if (key === "style") return products.filter((p) => p.styleTags.includes(value));
  if (key === "fabric") return products.filter((p) => p.fabric === value);
  return products;
}

export interface CoupleFacetState {
  world?: string;
  colourStory?: string;
  pose?: string;
  price?: string;
}

export function buildCoupleFacets<T extends { world: string; colourStory: string; poseDirection: string; totalPrice: number }>(looks: T[]) {
  const fields: { key: keyof CoupleFacetState; label: string; options: { value: string; label: string; count: number }[] }[] = [];
  const wc = counts(looks, (l) => l.world);
  if (wc.size > 1) fields.push({ key: "world", label: "World", options: Array.from(wc.entries()).map(([value, count]) => ({ value, label: occLabel(value), count })) });

  const cc = counts(looks, (l) => l.colourStory.split("·")[0].replace("Her ", "").trim());
  if (cc.size > 1) fields.push({ key: "colourStory", label: "Colour Story", options: Array.from(cc.entries()).map(([value, count]) => ({ value, label: value, count })).sort((a, b) => b.count - a.count).slice(0, 10) });

  const pc = counts(looks, (l) => l.poseDirection);
  if (pc.size > 1) fields.push({ key: "pose", label: "Pose / Style", options: Array.from(pc.entries()).map(([value, count]) => ({ value, label: value, count })).sort((a, b) => b.count - a.count).slice(0, 12) });

  const priceOptions = PRICE_BANDS.map((band) => ({ value: band.value, label: band.label, count: looks.filter((l) => l.totalPrice >= band.min && l.totalPrice <= band.max).length })).filter((o) => o.count > 0);
  if (priceOptions.length) fields.push({ key: "price", label: "Price (total look)", options: priceOptions });
  return fields;
}

export function applyCoupleFacet<T extends { world: string; colourStory: string; poseDirection: string; totalPrice: number }>(looks: T[], key: string, value: string): T[] {
  if (!value) return looks;
  if (key === "world") return looks.filter((l) => l.world === value);
  if (key === "colourStory") return looks.filter((l) => l.colourStory.split("·")[0].replace("Her ", "").trim() === value);
  if (key === "pose") return looks.filter((l) => l.poseDirection === value);
  if (key === "price") {
    const band = PRICE_BANDS.find((b) => b.value === value);
    return band ? looks.filter((l) => l.totalPrice >= band.min && l.totalPrice <= band.max) : looks;
  }
  return looks;
}
