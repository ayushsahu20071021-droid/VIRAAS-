import raw from '../data/women-look-catalog.client.json';
import garba001017 from '../data/women-garba-taxonomy-001-017.json';
import garba018034 from '../data/women-garba-taxonomy-018-034.json';
import garba025034 from '../data/women-garba-taxonomy-025-034.json';
import garba035051 from '../data/women-garba-taxonomy-035-051.json';
import garba035051v2 from '../data/women-garba-taxonomy-035-051-v2.json';
import garba052068 from '../data/women-garba-taxonomy-052-068.json';
import garba052068v2 from '../data/women-garba-taxonomy-052-068-v2.json';
import garbaProducts025068 from '../data/women-garba-products-025-068.json';
import {
  createCatalogFilterResolver,
  garmentCategoriesFor,
  type CatalogFilterResolver,
  type GarmentCategory,
} from './catalogCategories';
import type { LookColors, LookPatternOrEmbroidery } from './menCatalog';

/** Stable runtime shape for the approved Women look catalog and its explicit source overlays. */
export interface WomenLook {
  id: string;
  referenceId: string;
  occasion: string;
  outfitDescription: string;
  garmentType: string;
  colors: LookColors;
  patternOrEmbroidery: LookPatternOrEmbroidery;
  layering: string | null;
  bottomwear: string | null;
  footwear: string | null;
  accessories: string | null;
  pose: string | null;
  framing: string | null;
  environment: string | null;
  lighting: string | null;
  sourceProductId?: string | null;
  occasionLabel?: string;
  category?: string;
  subCategory?: string;
  style?: string;
  description?: string;
  primaryColor?: string;
  secondaryColors?: string[];
  pattern?: string;
  work?: string;
  silhouette?: string;
  sleeves?: string;
  dupatta?: string;
  vibe?: string;
  fabric?: string;
  referenceImage?: string;
  productMatchStatus?: string;
  matchType?: string;
  retailer?: string | null;
  price?: string | null;
  productUrl?: string | null;
  imageUrl?: string | null;
  note?: string;
  [key: string]: unknown;
}

type LookOverlay = Partial<WomenLook> & { id: string };

const visualTaxonomy = [
  ...(garba001017 as unknown as LookOverlay[]),
  ...(garba018034 as unknown as LookOverlay[]),
  ...(garba025034 as unknown as LookOverlay[]),
  ...(garba035051 as unknown as LookOverlay[]),
  ...(garba035051v2 as unknown as LookOverlay[]),
  ...(garba052068 as unknown as LookOverlay[]),
  ...(garba052068v2 as unknown as LookOverlay[]),
];
const garbaById = new Map<string, LookOverlay>(visualTaxonomy.map((look) => [look.id, look]));
const garbaProductsById = new Map<string, LookOverlay>(
  (garbaProducts025068 as unknown as LookOverlay[]).map((look) => [look.id, look]),
);

const rawWomenLooks = raw as unknown as WomenLook[];
export const WOMEN_LOOKS: WomenLook[] = rawWomenLooks.map((look) => ({
  ...look,
  ...(garbaById.get(look.id) ?? {}),
  ...(garbaProductsById.get(look.id) ?? {}),
  // The base catalog owns normalized occasion slugs (for routes/filters); overlays may contain
  // display labels such as "Garba / Navratri", which must never replace those stable route keys.
  occasion: look.occasion,
}));
export const womenLookById = new Map<string, WomenLook>(WOMEN_LOOKS.map((look) => [look.id, look]));
export const womenOccasions = [
  { slug: 'garba', label: 'Garba / Navratri', range: '001–068' },
  { slug: 'college-fest', label: 'College Fest', range: '069–110' },
  { slug: 'diwali', label: 'Diwali', range: '111–152' },
  { slug: 'festive-party', label: 'Festive Party', range: '153–194' },
  { slug: 'traditional', label: 'Traditional', range: '195–236' },
] as const;
export const womenOccasionLabel = (slug: string) => womenOccasions.find((o) => o.slug === slug)?.label ?? slug;

/**
 * Women category navigation, derived from the `garmentType` recorded on the 236 approved looks.
 * Only garment types that actually carry looks are listed, so every category link resolves.
 */
export const womenGarmentCategories: GarmentCategory[] = garmentCategoriesFor(WOMEN_LOOKS);
/** Maps `/women/:category` (plus `?occasion=` / `?category=`) onto occasion and garment filters. */
export const resolveWomenCatalogFilter: CatalogFilterResolver = createCatalogFilterResolver(womenOccasions, womenGarmentCategories);
/** Total Women looks, kept in one place so the catalog chrome never hardcodes a count. */
export const WOMEN_LOOK_TOTAL = WOMEN_LOOKS.length;
