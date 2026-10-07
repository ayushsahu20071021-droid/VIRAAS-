// Shared, data-driven navigation for the Women/Men look catalogs.
//
// Category navigation must never advertise something the catalog cannot back up, so the
// category list is derived from the `garmentType` metadata already recorded on every approved
// look record — nothing here is hardcoded, and no mapping is invented for a category that has
// no looks. A URL that matches neither an occasion slug nor a garment-category slug resolves as
// "unresolved" so the pages can show their honest empty state.
import { catSlug } from './data';

/** The minimal look shape both catalogs guarantee (MenLook and WomenLook satisfy this). */
export interface CatalogLookLike {
  occasion: string;
  garmentType: string;
}

export interface GarmentCategory {
  /** Display label taken verbatim from the look metadata. */
  label: string;
  /** Route slug, built with the same helper the rest of the site uses. */
  slug: string;
  /** Number of looks carrying this garmentType, so a menu entry is provably non-empty. */
  count: number;
}

export interface CatalogOccasion {
  slug: string;
  label: string;
}

export interface CatalogFilter {
  /** Matched occasion slug ('' when the URL does not select an occasion). */
  occasion: string;
  /** Matched garmentType label ('' when the URL does not select a category). */
  garmentType: string;
  /** True when the URL asked for a category that no look carries. */
  unresolved: boolean;
  /** The raw unmatched segment, used to name the category in the empty state. */
  requested: string;
}

export type CatalogFilterResolver = (
  pathCategory: string | undefined | null,
  query?: { occasion?: string | null; category?: string | null },
) => CatalogFilter;

/** The category key a look belongs to — the same normalization the filters below use. */
export const garmentKeyOf = (look: CatalogLookLike): string =>
  typeof look.garmentType === 'string' ? look.garmentType.trim() : '';

/**
 * Garment categories for a gender, computed from its own look metadata and ordered by how many
 * looks each one carries. Categories with zero looks (or a slug collision) never appear.
 */
export function garmentCategoriesFor(looks: readonly CatalogLookLike[]): GarmentCategory[] {
  const counts = new Map<string, number>();
  for (const look of looks) {
    const label = garmentKeyOf(look);
    if (!label) continue;
    counts.set(label, (counts.get(label) ?? 0) + 1);
  }
  const taken = new Set<string>();
  return [...counts.entries()]
    .map(([label, count]) => ({ label, slug: catSlug(label), count }))
    .filter((entry) => {
      if (entry.count <= 0 || !entry.slug || taken.has(entry.slug)) return false;
      taken.add(entry.slug);
      return true;
    })
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}

/**
 * Builds the route/query resolver for one gender's catalog. Occasion slugs keep their existing
 * meaning (path form `/women/garba` and query form `/women?occasion=garba`), and garment-category
 * slugs are additionally accepted in the path (`/women/lehenga`) or as `?category=lehenga`.
 */
export function createCatalogFilterResolver(
  occasions: readonly CatalogOccasion[],
  categories: readonly GarmentCategory[],
): CatalogFilterResolver {
  const occasionSlugs = new Set(occasions.map((occasion) => occasion.slug));
  const garmentBySlug = new Map(categories.map((category) => [category.slug, category.label]));
  return (pathCategory, query = {}) => {
    const path = (pathCategory ?? '').trim();
    const occasionValue = (query.occasion ?? '').trim();
    const categoryValue = (query.category ?? '').trim();
    const filter: CatalogFilter = { occasion: '', garmentType: '', unresolved: false, requested: '' };
    if (path) {
      if (occasionSlugs.has(path)) filter.occasion = path;
      else if (garmentBySlug.has(path)) filter.garmentType = garmentBySlug.get(path)!;
      else {
        filter.unresolved = true;
        filter.requested = path;
      }
    }
    // An explicit query wins over nothing, but never overrides what the path already selected.
    if (occasionValue) {
      if (occasionSlugs.has(occasionValue)) filter.occasion = filter.occasion || occasionValue;
      else {
        filter.unresolved = true;
        filter.requested = filter.requested || occasionValue;
      }
    }
    if (categoryValue) {
      const label = garmentBySlug.get(categoryValue);
      if (label) filter.garmentType = filter.garmentType || label;
      else {
        filter.unresolved = true;
        filter.requested = filter.requested || categoryValue;
      }
    }
    return filter;
  };
}

/**
 * The same categories recounted inside the active occasion, so an in-page category chip is only
 * ever offered when that occasion actually has matching looks. Categories outside the current
 * selection are dropped rather than linked to an empty page.
 */
export function categoriesWithinOccasion(
  looks: readonly CatalogLookLike[],
  categories: readonly GarmentCategory[],
  occasion: string,
): GarmentCategory[] {
  if (!occasion) return [...categories];
  const counts = new Map<string, number>();
  for (const look of looks) {
    if (look.occasion !== occasion) continue;
    const label = garmentKeyOf(look);
    if (!label) continue;
    counts.set(label, (counts.get(label) ?? 0) + 1);
  }
  return categories
    .map((category) => ({ ...category, count: counts.get(category.label) ?? 0 }))
    .filter((category) => category.count > 0);
}

/**
 * Link to a garment category while keeping the active occasion tab and the search box, so a
 * category chip never silently drops a filter the shopper already applied.
 */
export function categoryHref(base: string, slug: string, search: URLSearchParams, occasion: string): string {
  const params = new URLSearchParams(search);
  params.delete('category');
  if (occasion) params.set('occasion', occasion);
  else params.delete('occasion');
  const query = params.toString();
  return `${base}/${slug}${query ? `?${query}` : ''}`;
}
