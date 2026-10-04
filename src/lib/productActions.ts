import type { Product } from './data';

const MERCHANT_HOSTS: Record<string, string> = {
  MYNTRA: 'www.myntra.com',
  AJIO: 'www.ajio.com',
  FLIPKART: 'www.flipkart.com',
  SHOPSY: 'www.shopsy.in',
  MEESHO: 'www.meesho.com',
  NYKAA: 'www.nykaafashion.com',
};

export interface ProductOutboundAction {
  href: string;
  label: 'Shop' | 'View product';
}

function httpsUrl(value: string): URL | undefined {
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' || url.username || url.password) return undefined;
    return url;
  } catch {
    return undefined;
  }
}

export function exactWishlinkShareUrl(value: string): string | undefined {
  const url = typeof value === 'string' ? httpsUrl(value) : undefined;
  if (!url || (url.hostname !== 'wishlink.com' && url.hostname !== 'www.wishlink.com') || !/^\/share\/[^/?#]+$/.test(url.pathname)) return undefined;
  return value;
}

/**
 * Resolve a product-level Try-On only when that exact product has its own live image reference.
 * Approved VIRAAS look Try-On remains available from the look cards/pages; it is not silently
 * substituted for a different product record.
 */
export function tryOnHrefForProduct(product: Product): string | undefined {
  if (!product.tryOnEnabled || product.status !== 'live' || !product.imageUrl) return undefined;
  return `/try-on?product=${encodeURIComponent(product.id)}`;
}

function isSupportedMerchantListing(product: Product, url: URL): boolean {
  const expectedHost = MERCHANT_HOSTS[product.merchant.trim().toUpperCase()];
  return Boolean(expectedHost && url.hostname === expectedHost);
}

export function exactMerchantProductUrl(product: Product): string | undefined {
  const url = typeof product.merchantUrl === 'string' ? httpsUrl(product.merchantUrl) : undefined;
  return url && product.merchantUrlType === 'product' && isSupportedMerchantListing(product, url)
    ? product.merchantUrl
    : undefined;
}

export function hasVerifiedPrice(product: Product): boolean {
  return product.priceType === 'verified' && Number.isFinite(product.price) && product.price > 0;
}

/**
 * External CTAs are intentionally strict: never expose generated marketplace-search URLs as if
 * they were product listings. A Wishlink action is available only for an explicitly configured,
 * exact Wishlink share URL; otherwise an explicitly typed HTTPS product listing can be opened.
 */
export function productOutboundAction(product: Product): ProductOutboundAction | undefined {
  const affiliate = exactWishlinkShareUrl(product.affiliateUrl);
  if (affiliate && product.affiliateSource.toLowerCase() === 'wishlink') {
    return { href: affiliate, label: 'Shop' };
  }

  const merchant = typeof product.merchantUrl === 'string' ? httpsUrl(product.merchantUrl) : undefined;
  if (merchant && product.merchantUrlType === 'product' && isSupportedMerchantListing(product, merchant)) {
    return { href: product.merchantUrl, label: 'View product' };
  }
  return undefined;
}
