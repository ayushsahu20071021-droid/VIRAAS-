import catalogRaw from '../data/catalog.client.json';
import couplesRaw from '../data/couples.client.json';
import worldsRaw from '../data/worlds.json';

export type Gender = 'women' | 'men';
export interface Product {
  id: string; gender: Gender; category: string; subcategory: string; title: string;
  merchant: string; brand: string; price: number; priceType: string; mrp: number | null; discount: number | null; currency: string;
  colour: string; secondaryColours: string[]; fabric: string; pattern: string; embroidery: string; silhouette: string;
  occasion: string[]; ageSegment: string[]; styleTags: string[]; sizes: string[];
  imageUrl: string; gallery: string[]; merchantUrl: string; merchantUrlType: string; affiliateUrl: string; affiliateSource: string;
  tryOnEnabled: boolean; generatedImageUrl: string; status: string; lastChecked: string | null; description: string;
  reference: string | null; accessory: boolean; coupleIds: string[];
}
export interface GarmentSpec { cat: string; colour: string; fabric: string; detail: string; desc: string }
export interface Couple {
  id: string; world: string; title: string; ref: string; pose: string; framing: string; setting: string; light: string;
  her: GarmentSpec; him: GarmentSpec; layer?: GarmentSpec; tone: string; colourStory: string; tags: string[];
  herProductIds: string[]; hisProductIds: string[]; imageUrl: string; imageStatus: string;
}
export interface World { slug: string; name: string; long: string; blurb: string }

export const PRODUCTS = catalogRaw as unknown as Product[];
export const COUPLES = couplesRaw as unknown as Couple[];
export const WORLDS = worldsRaw as World[];
export const byId = new Map(PRODUCTS.map((p) => [p.id, p]));
export const coupleById = new Map(COUPLES.map((c) => [c.id, c]));
export const worldName = (slug: string) => WORLDS.find((w) => w.slug === slug)?.name ?? slug;

export const catSlug = (s: string) => s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
export const categoriesFor = (g: Gender) => {
  const m = new Map<string, number>();
  PRODUCTS.filter((p) => p.gender === g).forEach((p) => m.set(p.category, (m.get(p.category) ?? 0) + 1));
  return [...m.entries()].filter(([, n]) => n > 0).map(([name, count]) => ({ name, slug: catSlug(name), count }));
};

export const BUDGETS = [
  { slug: 'under-499', label: 'Under ₹499', min: 0, max: 499 },
  { slug: 'under-799', label: 'Under ₹799', min: 0, max: 799 },
  { slug: 'under-999', label: 'Under ₹999', min: 0, max: 999 },
  { slug: 'under-1499', label: 'Under ₹1,499', min: 0, max: 1499 },
  { slug: 'under-1999', label: 'Under ₹1,999', min: 0, max: 1999 },
  { slug: '1999-2999', label: '₹1,999–₹2,999', min: 1999, max: 2999 },
  { slug: '2999-4999', label: '₹2,999–₹4,999', min: 2999, max: 4999 },
  { slug: '5000-plus', label: '₹5,000+', min: 5000, max: 8000 },
];
export const budgetsWithResults = (list: Product[]) =>
  BUDGETS.filter((b) => list.some((p) => p.price >= b.min && p.price <= b.max));

export const ACCESSORY_CATS = ['Jewellery', 'Bags', 'Footwear', 'Beauty'];
