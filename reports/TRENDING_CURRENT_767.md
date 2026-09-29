# VIRAAS — Current Trending Snapshot (767)

**Frozen snapshot of the live Trending page BEFORE deduplication.** Read-only; no records modified.
Machine-readable: [`TRENDING_CURRENT_767.json`](./TRENDING_CURRENT_767.json).

## Totals
| Metric | Value |
|---|---|
| Records | 767 |
| Unique product IDs | 767 |
| Duplicate IDs | 0 |
| Men | 324 |
| Women | 443 |

## Validation
| Check | Result |
|---|---|
| 767 records | PASS |
| Unique product IDs | PASS |
| Allowed merchants only | PASS |
| Amazon = 0 | PASS |
| Invented affiliate URLs = 0 | PASS |
| Fake analytics/popularity/ratings/reviews/stock | NONE (not present in dataset) |

Merchants present: SHOPSY, FLIPKART, MYNTRA, AJIO, MEESHO, NYKAA.

## Fields captured per product
productId, merchant, merchantUrl, affiliateUrl, affiliateSource, productName, category, subcategory, gender,
occasion, colour, style, silhouette, fabric, details, approxPrice, reference, imageStatus.
Missing source values are recorded as `NOT SPECIFIED` (nothing invented). All 767 are currently image-pending.
