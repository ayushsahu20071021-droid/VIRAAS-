// Unified resolver for the 546 APPROVED look images (Men 210 + Women 236 + Couples 100).
// These are the only look assets that have real, QA-approved images; product-catalog
// items intentionally have no image assets and fall back to a labelled pending frame.
import { MEN_LOOKS, type MenLook } from './menCatalog';
import { WOMEN_LOOKS, type WomenLook } from './womenCatalog';
import menFinalImages from '../data/men-final-images.json';
import womenPreviews from '../data/women-previews.client.json';

const menImg = menFinalImages as Record<string, string>;
type WomenPreview = { qaStatus: string; approval: string; live: boolean; referenceId: string; src: string };
const womenPrev = womenPreviews as Record<string, WomenPreview | undefined>;

/** Approved Men look image, or undefined if none is wired. */
export const menLookImage = (id: string): string | undefined => menImg[id] || undefined;
/** Approved (live/QA-passed) Women look image, or undefined. */
export const womenLookImage = (id: string): string | undefined => {
  const s = womenPrev[id];
  return s?.live && s.src ? s.src : undefined;
};

// Reverse map: product id -> approved Women look (looks record their sourceProductId).
const womenLookByProduct = new Map<string, WomenLook>();
for (const look of WOMEN_LOOKS) {
  const pid = (look as { sourceProductId?: string }).sourceProductId;
  if (pid && womenLookImage(look.id) && !womenLookByProduct.has(pid)) womenLookByProduct.set(pid, look);
}
/** The approved Women look that features a given product (if any), for cross-surfacing. */
export const womenLookForProduct = (productId: string): WomenLook | undefined => womenLookByProduct.get(productId);

export const shortDesc = (d: string) => d.split('. Picked')[0].replace(/\.$/, '') + '.';

/** Featured approved Men looks (only those with a real image), optionally by occasion. */
export const featuredMenLooks = (occasion?: string, n = 8): MenLook[] =>
  MEN_LOOKS.filter((l) => (!occasion || l.occasion === occasion) && menLookImage(l.id)).slice(0, n);
/** Featured approved Women looks (only those with a real image), optionally by occasion. */
export const featuredWomenLooks = (occasion?: string, n = 8): WomenLook[] =>
  WOMEN_LOOKS.filter((l) => (!occasion || l.occasion === occasion) && womenLookImage(l.id)).slice(0, n);

export const MEN_LIVE_COUNT = MEN_LOOKS.filter((l) => menLookImage(l.id)).length;
export const WOMEN_LIVE_COUNT = WOMEN_LOOKS.filter((l) => womenLookImage(l.id)).length;
