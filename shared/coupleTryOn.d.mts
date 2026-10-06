export type CoupleSide = 'her' | 'him';

export interface CoupleSideReference {
  ok: true;
  side: CoupleSide;
  productId: string;
  outfitId: string;
  gender: 'women' | 'men';
  garmentImageUrl: string;
  garmentDescription?: string;
}

export interface CoupleSideUnavailable {
  ok: false;
  code: string;
  message: string;
}

export interface CoupleTryOnSource {
  herProductIds?: string[];
  hisProductIds?: string[];
  her?: { desc?: string };
  him?: { desc?: string };
}

export interface CoupleTryOnProduct {
  id?: string;
  gender?: string;
  tryOnEnabled?: boolean;
  status?: string;
  imageUrl?: string;
  category?: string;
  subcategory?: string;
  accessory?: boolean;
  title?: string;
}

export function isViraasGarmentImagePath(value: unknown): boolean;
export function resolveCoupleSide(
  couple: CoupleTryOnSource | null | undefined,
  side: string | null | undefined,
  productsById: Map<string, CoupleTryOnProduct> | Record<string, CoupleTryOnProduct>,
): CoupleSideReference | CoupleSideUnavailable;
