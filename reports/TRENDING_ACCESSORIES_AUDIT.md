# VIRAAS — Trending + Accessories Production Audit

_Audit-only pass. No image generation started. Approved Men/Women/Couple assets and all Couple data untouched._

## Architecture (ground truth)

- The **shop catalog** (`src/data/catalog.json`, generated from `data-src/taxonomy.mjs` by `scripts/build-catalog.mjs`) holds **861 products** — women 525, men 336.
- **Trending page** = `PRODUCTS.filter(p => !p.accessory)` → **767 styles**.
- **Accessories page** = category ∈ {Jewellery, Bags, Footwear, Beauty} **or** category = Traditional Layer → **126 styles**.
- **Approved core catalog is a SEPARATE dataset**: `men-look-catalog` (**210** looks, images `public/images/men-previews/men-look-NNN.png`) and `women-look-catalog` (**236** looks, images `public/images/women-previews/women-look-NNN.png`), rendered by the `/men` and `/women` look pages. These are the LOCKED approved assets and were not touched.
- The shop catalog and the approved look catalog are **different data**. Shop product ids (e.g. `w-lehenga-ivory-mirror-work-blouse`) do **not** correspond 1:1 to `men-look-NNN` / `women-look-NNN`, and shop `reference` values point to reference **sheets** (REF-M#, REF-W#, REF-S#) / couple refs (GARBA-REF-#, LOOK-#, REF-C#), not to individual approved preview images. **⇒ No safe 1:1 image mapping from a shop product to an approved preview image exists.** All shop-product imagery belongs to the next controlled generation phase.

## Validation results (current state)

| Check | Result |
|---|---|
| Duplicate product IDs | **0** |
| Metadata near-duplicates (gender+category+title+colour+silhouette+fabric) | **0** |
| Products missing a required commerce field | **0** |
| Amazon references (merchant / merchantUrl / affiliateUrl) | **0** |
| Invalid gender values | **0** |
| Invalid / empty occasion values | **0** |
| Occasion slugs in use | exactly the 5 public worlds: garba, college-fest, diwali, festive-party, traditional |
| Invented affiliate URLs | **0** (all 861 affiliateUrl empty → honest "Affiliate link not configured yet") |
| Allowed merchants only | ✅ SHOPSY 127, MYNTRA 160, NYKAA 142, FLIPKART 133, MEESHO 142, AJIO 157 |
| `check-catalog.mjs` | PASS except the **pre-existing** couple↔product colour/category mismatch (60) — LOCKED, not in scope, not touched |
| typecheck (`tsc -p tsconfig.json`) | **PASS** |
| production build (`vite build`) + `build-catalog.mjs` | **PASS** |

The catalog is **structurally clean**: no duplicate IDs, no near-duplicates, no broken commerce, no Amazon, no bad gender/occasion mappings. The single universal gap is imagery — **every one of the 861 products is `status: image-pending` with an empty `imageUrl`** (renders the honest "Image pending / Final approved VIRAAS image will be added here" state). That is the entire missing-asset surface and is deferred to the next controlled generation phase.

---

## PART A — TRENDING (767 records audited)

| Bucket | Count |
|---|---|
| **A. Strong match to approved Men catalog** (men, reference-linked) | **206** |
| **B. Strong match to approved Women catalog** (women, reference-linked) | **221** |
| **C. Valid additional Trending product** (standalone, no reference) | **340** (men 118 + women 222) |
| **D. Duplicate / near-duplicate** | **0** |
| **E. Broken / invalid / irrelevant** | **0** |
| **F. Missing visual asset** | **767** (overlay — all Trending products are image-pending) |
| **G. Uncertain / manual review** | **0** |

- Primary buckets A + B + C = 206 + 221 + 340 = **767** ✅ (mutually exclusive).
- Gender split: men **324** (206 ref-linked + 118 standalone), women **443** (221 ref-linked + 222 standalone).
- Sort remains **Curated** (imageUrl-present, then couple-link count). No views/likes/purchases/ratings/bestseller/social-proof — **A6 satisfied**.
- Filters preserved (Gender, Category, Occasion, Colour, Budget, Style, Silhouette, Fabric, Details, Sort) — **A7 satisfied**. Occasion taxonomy is exactly the 5 public worlds; no wedding/sangeet added.
- **No records removed or merged** (0 duplicates, 0 broken to remove).

## PART B — ACCESSORIES (126 records audited)

Reframed at the presentation layer to the **Garba / Navratri Accessories Edit**.

| Category | Count | Verdict |
|---|---|---|
| Jewellery | 30 | Valid — jhumka, choker, bangle stack, kamarbandh, nose pin, ghungroo anklets, maang tikka, hathphool, statement ring, juda hair pin (gold / silver / oxidised) |
| Footwear | 30 | Valid — mojari, jutti, kolhapuri, block heels, men's ethnic loafers |
| Bags | 18 | Valid — potli, festive clutch, kutchi sling, brocade box clutch |
| Traditional Layer | 32 | Valid — phulkari dupatta, block-print stole, bandhani dupatta, sequin stole, paisley shawl, solid cotton dupatta |
| Beauty | 16 | **Manual review** — lipstick, kajal, setting spray, garba glitter bindi; B2 admits beauty "only if genuinely represented". Kept for now, flagged for owner decision. |

| Bucket | Count |
|---|---|
| Valid Garba / Navratri accessories | **110** clear + **16** beauty (review) = **126** |
| Removed / invalid | **0** (audit-only; none removed) |
| Duplicates | **0** (colour variants are the standard gold/silver/oxidised set — B6 explicitly permits) |
| Missing visual assets | **126** (all image-pending) |
| Manual review | **16** (Beauty inclusion in a Garba/Navratri edit) |

Notes:
- The accessories are already genuine festive/garba accessory **types** used to complete the approved looks — not marketplace spam. No colour-swap inflation beyond the standard metal/colour set.
- **Occasion tagging is synthetic**: 94/126 accessories are tagged with all 5 occasions and 126/126 carry `garba`. This falsely implies "belongs to every occasion" (B4). Correcting the tags requires editing the source taxonomy and regenerating the catalog — deferred to the controlled next phase to avoid risking the LOCKED approved data via the non-deterministic build step. The page has been reframed to a Garba/Navratri Edit in the meantime.
- **32 Traditional Layer** items appear on both the Trending and Accessories pages (pre-existing overlap, by design of the two view filters).

## PART C — Commerce (both Trending + Accessories)

- merchant / merchantUrl / affiliateUrl / affiliateSource, Shop CTA and Try-On flags **preserved** (no changes to catalog data this pass).
- 0 affiliate URLs configured → honest "Affiliate link not configured yet" retained. **No invented URLs, no fake tracking, no EarnKaro, no commissions.**
- Merchants limited to Myntra, AJIO, Flipkart, Shopsy, Meesho, Nykaa. **Amazon absent.**
- Try-On: Trending 721/767 enabled; Accessories 0/126 (correct — accessories are not try-on garments).

## PART D/E — Protection & no generation

- Approved 210 Men images, 236 Women images, 100 Couple images: **not regenerated**.
- Couple mappings / Try-On / Her–Him mappings: **untouched**.
- **No image-generation job started.** Precise missing-asset lists produced for the next phase:
  - `reports/missing-trending-images.json` — 767 items.
  - `reports/missing-accessories-images.json` — 126 items.

## Change made this pass (safe, reversible, presentation-only)

- `src/pages/Listing.tsx`: Accessories page title → **"Garba / Navratri Accessories Edit"** with a "Complete the look" kicker and honest intro. No data, filters, counts, mappings, or approved assets changed.

## Recommended next (controlled) phases

1. Controlled image generation for the 861 image-pending shop products using the two missing-asset lists (batched, per-occasion).
2. Source-level occasion-tag correction for accessories (scope to garba/relevant occasions) via `data-src/taxonomy.mjs` + a single reviewed rebuild.
3. Owner decision on Beauty (16) inclusion in the Garba/Navratri accessories edit.
4. Owner-supplied affiliate URLs (kept empty/honest until then).
