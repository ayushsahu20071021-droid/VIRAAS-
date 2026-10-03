import raw from '../data/women-look-catalog.client.json';
import garba001017 from '../data/women-garba-taxonomy-001-017.json';
import garba018034 from '../data/women-garba-taxonomy-018-034.json';
import garba025034 from '../data/women-garba-taxonomy-025-034.json';
import garba035051 from '../data/women-garba-taxonomy-035-051.json';
import garba035051v2 from '../data/women-garba-taxonomy-035-051-v2.json';
import garba052068 from '../data/women-garba-taxonomy-052-068.json';
import garba052068v2 from '../data/women-garba-taxonomy-052-068-v2.json';
import garbaProducts025068 from '../data/women-garba-products-025-068.json';

const garbaVisualTaxonomy = [
  ...garba001017,
  ...garba018034,
  ...garba025034,
  ...garba035051,
  ...garba035051v2,
  ...garba052068,
  ...garba052068v2,
];
const garbaById = new Map(garbaVisualTaxonomy.map((look) => [look.id, look]));
const garbaProductsById = new Map(garbaProducts025068.map((look) => [look.id, look]));

export type WomenLook = typeof raw[number] & Partial<typeof garbaVisualTaxonomy[number]> & Partial<typeof garbaProducts025068[number]>;
export const WOMEN_LOOKS = raw.map((look) => ({
  ...look,
  ...(garbaById.get(look.id) ?? {}),
  ...(garbaProductsById.get(look.id) ?? {}),
})) as WomenLook[];
export const womenLookById = new Map(WOMEN_LOOKS.map((look) => [look.id, look]));
export const womenOccasions = [
  { slug: 'garba', label: 'Garba / Navratri', range: '001–068' },
  { slug: 'college-fest', label: 'College Fest', range: '069–110' },
  { slug: 'diwali', label: 'Diwali', range: '111–152' },
  { slug: 'festive-party', label: 'Festive Party', range: '153–194' },
  { slug: 'traditional', label: 'Traditional', range: '195–236' },
] as const;
export const womenOccasionLabel = (slug: string) => womenOccasions.find((o) => o.slug === slug)?.label ?? slug;
