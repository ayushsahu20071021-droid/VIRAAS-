# VIRAAS — Final Trending Dataset (321)

**This is the source-of-truth Trending dataset.** It is a real dataset of 321 product records
(`src/data/trending-final.client.json`), not a display-count change, CSS hide, or pagination trick. Machine-readable:
[`TRENDING_FINAL_321.json`](./TRENDING_FINAL_321.json).

## Derivation
| Step | Count |
|---|---|
| Current Trending (non-accessory) | 767 |
| − Women duplicate counterparts (authored `sourceProductId`) | −236 |
| − Men duplicates (deterministic exclusion map, Phase 2) | −210 |
| **Final Trending** | **321** |

## Composition
| Metric | Value |
|---|---|
| Records | 321 |
| Unique product IDs | 321 |
| Duplicate IDs | 0 |
| Men | 114 |
| Women | 207 |
| Traditional Layer (kept as apparel) | 32 |

## Validation
| Check | Result |
|---|---|
| Exactly 321 records | PASS |
| 321 unique IDs, 0 duplicates | PASS |
| 236 women removed via valid source linkage | PASS |
| 210 men removed via documented exclusion map | PASS |
| Traditional Layer retained (not deleted) | PASS (32 kept) |
| No Amazon | PASS |
| No invented affiliate URLs | PASS |
| No fake analytics/ratings/reviews/stock/popularity | NONE present |

Catalog records are untouched (women-look linkage 236/236 preserved); the 446 counterparts remain in the catalog
but are excluded from the Trending view via this dedicated dataset.
