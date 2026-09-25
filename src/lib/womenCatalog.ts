import raw from '../data/women-look-catalog.client.json';
export type WomenLook = typeof raw[number];
export const WOMEN_LOOKS = raw as WomenLook[];
export const womenLookById = new Map(WOMEN_LOOKS.map((look) => [look.id, look]));
export const womenOccasions = [
  { slug: 'garba', label: 'Garba / Navratri', range: '001–068' },
  { slug: 'college-fest', label: 'College Fest', range: '069–110' },
  { slug: 'diwali', label: 'Diwali', range: '111–152' },
  { slug: 'festive-party', label: 'Festive Party', range: '153–194' },
  { slug: 'traditional', label: 'Traditional', range: '195–236' },
] as const;
export const womenOccasionLabel = (slug: string) => womenOccasions.find((o) => o.slug === slug)?.label ?? slug;
