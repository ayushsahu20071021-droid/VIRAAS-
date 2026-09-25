import raw from '../data/men-look-catalog.client.json';

export type MenLook = typeof raw[number];
export const MEN_LOOKS = raw as MenLook[];
export const menLookById = new Map(MEN_LOOKS.map((look) => [look.id, look]));
export const menOccasions = [
  { slug: 'garba', label: 'Garba / Navratri', range: '001–042' },
  { slug: 'college-fest', label: 'College Fest', range: '043–084' },
  { slug: 'diwali', label: 'Diwali', range: '085–126' },
  { slug: 'festive-party', label: 'Festive Party', range: '127–168' },
  { slug: 'traditional', label: 'Traditional', range: '169–210' },
] as const;
export const menOccasionLabel = (slug: string) => menOccasions.find((o) => o.slug === slug)?.label ?? slug;
