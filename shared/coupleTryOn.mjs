// Strict resolver shared by the Couple detail UI and API. A side may use only an explicit
// side-specific product-ID relationship from that Couple record and that product's own VIRAAS image.
const EXPECTED_GENDER = Object.freeze({ her: 'women', him: 'men' });
const UNAVAILABLE = Object.freeze({
  her: 'No exact Her garment image is linked to this Couple look. The combined Couple photo and other looks will not be used.',
  him: 'No exact Him garment image is linked to this Couple look. The combined Couple photo and other looks will not be used.',
});

export function isViraasGarmentImagePath(value) {
  if (typeof value !== 'string') return false;
  const imagePath = value.trim().split(/[?#]/, 1)[0];
  if (!imagePath.startsWith('/images/') || imagePath.includes('..') || imagePath.includes('\\') || /%2e|%2f|%5c/i.test(imagePath)) return false;
  if (/^\/images\/couples(?:\/|$)/i.test(imagePath)) return false;
  return /\.(?:png|jpe?g|webp)$/i.test(imagePath);
}

function getProduct(products, id) {
  if (products && typeof products.get === 'function') return products.get(id);
  return products && typeof products === 'object' ? products[id] : undefined;
}

function garmentCategory(product) {
  const category = `${product?.category || ''} ${product?.subcategory || ''}`.toLowerCase();
  return product?.accessory !== true && !/\b(?:accessor(?:y|ies)|jewell?ery|footwear|bags?)\b/.test(category);
}

/** Resolve a single side using only direct herProductIds/hisProductIds; no fuzzy or ordinal joins. */
export function resolveCoupleSide(couple, side, productsById) {
  if (!couple) return { ok: false, code: 'UNKNOWN_COUPLE', message: 'Unknown Couple look.' };
  if (side !== 'her' && side !== 'him') return { ok: false, code: 'COUPLE_SIDE_REQUIRED', message: 'Choose whose outfit to try on.' };
  const expectedGender = EXPECTED_GENDER[side];
  const linkedIds = side === 'her' ? couple.herProductIds : couple.hisProductIds;
  const sideDescription = side === 'her' ? couple.her?.desc : couple.him?.desc;
  for (const id of Array.isArray(linkedIds) ? linkedIds : []) {
    if (typeof id !== 'string') continue;
    const product = getProduct(productsById, id);
    if (product?.gender !== expectedGender || product?.tryOnEnabled !== true || product?.status !== 'live' || !garmentCategory(product) || !isViraasGarmentImagePath(product.imageUrl)) continue;
    return {
      ok: true,
      side,
      productId: product.id,
      outfitId: product.id,
      gender: expectedGender,
      garmentImageUrl: product.imageUrl,
      garmentDescription: sideDescription || product.title || undefined,
    };
  }
  return { ok: false, code: 'COUPLE_SIDE_REFERENCE_MISSING', message: UNAVAILABLE[side] };
}
