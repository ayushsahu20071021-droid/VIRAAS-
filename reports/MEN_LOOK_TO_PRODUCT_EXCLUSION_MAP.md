# VIRAAS — Men Look -> Marketplace Product EXCLUSION Map

**Purpose:** deterministically identify which marketplace men products are duplicate representations of the
210 approved men looks, so they can be **excluded from Trending**. This map is used **only** to choose which
products to exclude. It is **never** used to assign images, never replaces approved men images, and never
modifies men look data. Machine-readable: [`MEN_LOOK_TO_PRODUCT_EXCLUSION_MAP.json`](./MEN_LOOK_TO_PRODUCT_EXCLUSION_MAP.json).

## Method (deterministic & reproducible)
- Candidate pool: men, non-accessory, **excluding Traditional Layer** (which must remain in Trending) = 292 products.
- Score = garment-family identity (same-garment 1000 > ethnic-top-family 500 > cross-garment 100) + colour exact (+50) + occasion (+20).
- Greedy unique assignment: looks processed by id ascending; each takes its highest-scoring **unassigned** product; ties broken by product id ascending.
- No popularity, no price, no random matching, no arbitrary ordering, no image similarity.

## Confidence definitions
- **high** — same garment + exact colour + occasion.
- **medium** — same garment (colour or occasion may differ).
- **low** — no same-garment product remained; matched via ethnic-top family (kurta↔shirt) or cross-garment fallback. These are the least certain and are flagged for review.

## Results
| Metric | Value |
|---|---|
| Men looks | 210 |
| Matched (distinct products) | 210 |
| Unique excluded product IDs | 210 |
| Unmatched looks | 0 |
| high confidence | 65 |
| medium confidence | 91 |
| low confidence | 54 |
| **Resulting Trending count** (767 − 236 women − 210 men) | **321** |

## Honesty note
The marketplace men catalog was generated independently (taxonomy category × colour) and does **not** mirror the
kurta-heavy look set (189 kurta-type looks vs 135 kurta-type products). Same-garment matches are therefore capped;
the remaining assignments needed to reach the target use the documented ethnic-top-family / cross-garment fallback
at **low confidence**. These low-confidence rows are exclusion decisions only — no image or authoritative
relationship is claimed. The women exclusions (236) use the authored `sourceProductId` linkage and are exact.
