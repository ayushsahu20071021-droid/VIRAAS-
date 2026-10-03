# Trending — 321 Independent · Research-Ready Dataset

Stable IDs **TRD-001 … TRD-321** for the 321 independent Trending products. Client data: `src/data/trending-independent-research.client.json`. Every value is derived only from existing source data; unknown fields are `null` (never guessed). `searchKeywords`/`searchQuery` are research aids and do **not** claim an exact product.

- Records: **321** · all `sourceType = "trending-independent"`: **true**
- `researchStatus = pending`: **321** · `imageStatus = pending`: **321**
- Configured affiliate URLs: **0** · configured prices: **0**

## Field population (present / 321)
| field | present |
|---|---|
| id | 321 |
| sourceType | 321 |
| sourceCatalogId | 321 |
| productName | 321 |
| productType | 321 |
| category | 321 |
| subcategory | 321 |
| gender | 321 |
| occasion | 321 |
| colour | 321 |
| secondaryColours | 220 |
| style | 321 |
| silhouette | 321 |
| fabric | 321 |
| pattern | 321 |
| details | 0 |
| embroidery | 321 |
| neckline | 0 |
| sleeve | 0 |
| fit | 0 |
| length | 0 |
| layering | 0 |
| bottomwear | 0 |
| footwear | 0 |
| accessories | 0 |
| description | 321 |
| visualDirection | 321 |
| referenceDescription | 58 |
| searchKeywords | 321 |
| searchQuery | 321 |
| merchant | 321 |
| merchantUrl | 321 |
| productId | 0 |
| price | 0 |
| currency | 321 |
| affiliateUrl | 0 |
| affiliateSource | 0 |
| imageUrl | 0 |
| imageStatus | 321 |
| imageSource | 0 |
| imageLicenseStatus | 0 |
| researchStatus | 321 |

## Workflow per record
TRD-xxx → read data + searchQuery → find exact real product → verify SKU/merchant/price/image → generate Wishlink URL manually → set affiliateUrl + affiliateSource="wishlink" + exact price + verified image → researchStatus="verified". A visually-similar product must NOT be marked verified.
