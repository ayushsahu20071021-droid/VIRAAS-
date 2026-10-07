import raw from '../data/men-look-catalog.client.json';
import {
  createCatalogFilterResolver,
  garmentCategoriesFor,
  type CatalogFilterResolver,
  type GarmentCategory,
} from './catalogCategories';

export interface LookColors {
  primary: string;
  secondary: string[];
}

export interface LookPatternOrEmbroidery {
  pattern: string | null;
  embroidery: string | null;
}

/** Stable runtime shape of an approved Men look record. */
export interface MenLook {
  id: string;
  referenceId: string;
  occasion: string;
  occasionLabel?: string;
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
  [key: string]: unknown;
}

export const MEN_LOOKS = raw as unknown as MenLook[];
export const menLookById = new Map<string, MenLook>(MEN_LOOKS.map((look) => [look.id, look]));
export const menOccasions = [
  { slug: 'garba', label: 'Garba / Navratri', range: '001–042' },
  { slug: 'college-fest', label: 'College Fest', range: '043–084' },
  { slug: 'diwali', label: 'Diwali', range: '085–126' },
  { slug: 'festive-party', label: 'Festive Party', range: '127–168' },
  { slug: 'traditional', label: 'Traditional', range: '169–210' },
] as const;
export const menOccasionLabel = (slug: string) => menOccasions.find((o) => o.slug === slug)?.label ?? slug;

/**
 * Men category navigation, derived from the `garmentType` recorded on the 210 approved looks.
 * Only garment types that actually carry looks are listed, so every category link resolves.
 */
export const menGarmentCategories: GarmentCategory[] = garmentCategoriesFor(MEN_LOOKS);
/** Maps `/men/:category` (plus `?occasion=` / `?category=`) onto occasion and garment filters. */
export const resolveMenCatalogFilter: CatalogFilterResolver = createCatalogFilterResolver(menOccasions, menGarmentCategories);
/** Total Men looks, kept in one place so the catalog chrome never hardcodes a count. */
export const MEN_LOOK_TOTAL = MEN_LOOKS.length;
