# Trending — FINAL 321 (data source of truth)

**FINAL independent Trending dataset.** Underlying data lives in `src/data/trending-final.client.json` (verified byte-for-byte identical to this derivation). This report is the human-readable source of truth for the final product list and its existing data.

## Derivation (validated)
| step | count |
|---|---|
| Original Trending universe (767) | 767 |
| − Men counterparts (exclusion map) | 210 |
| − Women counterparts (sourceProductId) | 236 |
| **= FINAL** | **321** |

- Unique product IDs: **321** · Duplicate IDs: **0** · Invalid IDs: **0**
- Men in final: **114** · Women in final: **207**
- Traditional Layer kept as apparel: **32**
- Men/Women exclusion overlap: **0**
- Amazon: **0**

The Men exclusion map is used **only** to identify duplicate marketplace products to remove — never for image assignment, replacing Men images, or modifying Men look content.

## Existing data / visual reference coverage (present / 321)
| field | present | missing |
|---|---|---|
| merchant | 321 | 0 |
| merchantUrl | 321 | 0 |
| affiliateUrl | 0 | 321 |
| affiliateSource | 0 | 321 |
| title | 321 | 0 |
| description | 321 | 0 |
| colour | 321 | 0 |
| fabric | 321 | 0 |
| silhouette | 321 | 0 |
| pattern | 321 | 0 |
| embroidery | 321 | 0 |
| price | 321 | 0 |
| occasion | 321 | 0 |
| styleTags | 321 | 0 |
| reference | 58 | 263 |
| imagePrompt_existingVisualDirection | 321 | 0 |
| imageUrl_real | 0 | 321 |
| generatedImageUrl | 0 | 321 |

- Products with an existing visual direction (`imagePrompt`): **321/321** (preserved verbatim; not rewritten).
- Products with an existing `reference` tag: **58/321**.
- Products with a **real** `imageUrl` already on file: **0/321** (the rest await Phase 5 real-image research).
- Missing `description`: 0 · Missing `imagePrompt`: 0

## Merchant coverage
| merchant | count |
|---|---|
| MYNTRA | 61 |
| MEESHO | 59 |
| AJIO | 53 |
| SHOPSY | 52 |
| NYKAA | 51 |
| FLIPKART | 45 |

Full per-product records (all fields preserved): `reports/TRENDING_FINAL_321_DATA.json`.
