// Couple Shop-the-Look affiliate placeholders — UI/data fields ONLY.
// Both URLs start EMPTY. When the site owner later pastes a real affiliate URL into
// src/data/couple-affiliate.json, the FOR HER / FOR HIM buttons open EXACTLY that URL,
// untransformed. VIRAAS never generates, guesses, or modifies these URLs.
import raw from '../data/couple-affiliate.json';

export interface CoupleAffiliate {
  herAffiliateUrl: string;
  himAffiliateUrl: string;
}

const DATA = raw as Record<string, CoupleAffiliate>;

export const coupleAffiliate = (coupleId: string): CoupleAffiliate =>
  DATA[coupleId] ?? { herAffiliateUrl: '', himAffiliateUrl: '' };
