# Trending — Final 321 · Image Source Research Manifest (Phase 5)

Real-image source research for the final 321 Trending products. **No AI images were generated. No images were downloaded. No scraping was performed.**

## Result
| status | count |
|---|---|
| NO_USABLE_SOURCE | 321 |
| **total** | **321** |

- **Usable / authorized exact-product images: 0**
- **Pending permission: 0**
- **No usable source: 321**

## Why (evidence-based finding — a decision is required)
Every one of the 321 products is a curated **style archetype**, not an exact retail SKU:
- `merchantUrlType = marketplace-search` for **all 321** — the `productUrl` is a search query (e.g. `meesho.com/search?q=women Wine Mirror-Work Gharara Set`), **not** an exact product page.
- `brand = "Marketplace sellers (varies)"` for all 321 — no specific listing/SKU.
- `priceType = "estimate"` — an approximate style price, not a live listing.
- 0 products have an exact product-page URL.

A representative search for one product name returned **many different products** from different sellers, in different colours/variants, at wildly different prices — none of which is "the exact product." Using any of them would violate the explicit rules (no visually-similar products, no other variants, no other merchant's product, no unlicensed scraping). No authorized affiliate/product feed, license, or brand asset is configured.

**Conclusion:** exact real product images cannot be legitimately sourced for these archetype products as the data currently stands. The existing `imagePrompt` visual direction is preserved on every product but is a *creative brief*, not a real photo. Per the rules, **no image is forced and none is faked.**

## Options to unlock real images (owner decision — see chat)
1. **Authorized affiliate/product feed** (Myntra/AJIO/Flipkart/Meesho/Nykaa affiliate catalog API): map each archetype to a real feed SKU and use the feed-provided image (status → `AFFILIATE_FEED`). Requires owner to provision feed access/credentials.
2. **Re-scope Trending to real SKUs**: replace archetype entries with specific real listings (exact product URL + licensed/feed image). Changes product identity — must happen before affiliate mapping.
3. **Licensed/brand-provided imagery** for selected products (status → `LICENSED`/`BRAND_PROVIDED`).
4. **Keep the honest image-pending state** on Trending (real name/merchant/approx-price/occasion/category/description + Shop CTA shown; no fabricated photo) until 1–3 is available.

Per-product records: `reports/TRENDING_FINAL_321_IMAGE_SOURCE_MANIFEST.json`.
