# VIRAAS — Trending Image Blueprint (340 standalone products)

**Scope:** the 340 Trending products that are **not** reference-linked to an approved look
(the "additional / standalone" Trending set). This document is a **production blueprint only** —
**no images were generated, no catalog data was changed, and no files were created** other than these reports.

Machine-readable source: [`reports/trending-340-image-briefs.json`](./trending-340-image-briefs.json) — one object per product with every field the image team needs.

## Totals

| Metric | Value |
|---|---|
| Total briefs | **340** |
| Unique product IDs | 340 |
| Duplicate IDs | 0 |
| Missing IDs | 0 |
| Women | 222 |
| Men | 118 |

### Recommended image type (per product, not forced uniform)

| Image type | Count | Applied to |
|---|---|---|
| model-worn | 335 | Garments worn on the body (sarees, lehengas, shararas, ghararas, anarkalis, kurtas/kurta-sets, shirts, jackets, bottomwear) |
| styled-editorial | 5 | Draped layers (Traditional Layer — stole / dupatta / shawl) |
| product-only | 0 | — (no isolated hard-goods in the standalone garment set) |
| flat-lay | 0 | — (accessories/small objects are handled in the accessories report, not here) |

### Category breakdown

| Category | Count |
|---|---|
| Saree | 58 |
| Printed Ethnic Shirt | 41 |
| Sharara | 39 |
| Anarkali | 38 |
| Gharara | 29 |
| Pre-Draped Saree | 29 |
| Kurta Sets | 29 |
| Festive Kurta Set | 20 |
| Ethnic Shirt | 20 |
| Modern Kurta | 14 |
| Festive Separates | 8 |
| Embroidered Ethnic Shirt | 6 |
| Traditional Layer | 5 |
| Festive Jacket | 4 |

## What each brief contains

`productId, gender, category, subcategory, occasion, title, colour, style, silhouette, fabric, details,
merchant, currentImageStatus, recommendedImageType, composition, subject, styling, background, lighting,
framing, futureFilename (trending-{id}.webp), prompt`.

- Any source field that is empty/absent is recorded literally as **`NOT SPECIFIED`** — no metadata was invented.
- Prompts are built **only** from the product's own data (colour, fabric, silhouette, embroidery, pattern, garment type).
  No colour, fabric, embroidery, print, motif, jewellery, accessory, logo or brand was invented; prompts stay
  conservative when a field is missing.
- **VIRAAS direction** baked into every prompt: premium Indian fashion editorial, realistic photography, natural skin
  texture, realistic Indian styling when a model is needed, clean composition, catalog quality — and an explicit
  negative: **no text, no watermark, no logo/brand mark, no UI, no price label**.
- `futureFilename` is a **recommendation only** (`trending-{product-id}.webp`). No file was created and no existing
  image path was modified.

## Important note on counts

All 340 standalone products are currently **image-pending** (no approved VIRAAS image yet). The blueprint gives
each one a ready-to-run brief so images can be produced later in the dedicated image-generation phase.
