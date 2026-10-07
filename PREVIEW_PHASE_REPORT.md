# VIRAAS — Final Visual Preview + Image Completeness Phase

**Goal:** make the site visually complete and verify every approved outfit/look image
displays correctly, before the AI Virtual Try-On phase. **AI Try-On was NOT started.**

## Outcome

| Area | Expected | Available | Displayed | Missing |
|---|---|---|---|---|
| **Men looks** | 210 | 210 | 210 | **0** |
| **Women looks** | 236 | 236 | 236 | **0** |
| **Couple looks** | 100 | 100 | 100 | **0** |
| **Total approved looks** | **546** | **546** | **546** | **0** |

| Product images | Value |
|---|---|
| Total products in catalog | 861 |
| Products with a valid image asset | **0** |
| Products with no image asset (legitimate, reported) | **861** |
| Broken product image paths | **0** |

- **Unnecessary placeholders: 0** (no surface shows a placeholder where a real look image exists).
- **Broken image paths (look assets): 0.**
- **Typecheck: PASS · Build: PASS · Preview: PASS** (dev server on :5173, all look assets serve 200).

## What changed (UI/display only — no image or catalog data was modified)

1. **Homepage (hybrid):**
   - Fixed a real bug: couples resolve their image via `coupleImageSrc()` → `/images/couples/<id>.webp`,
     but the homepage was reading the always-empty `imageUrl`. Hero, occasion tiles and "Complete the look"
     now use the resolver → real couple images render.
   - "For Her" / "For Him" / "Trending this Navratri" now feature the **approved Women/Men look images**
     (real, QA-passed) instead of the imageless product catalog, keeping the existing card design.
   - Imageless "Accessories" row removed from the homepage; Budget chips (text-only) retained.
2. **Occasion pages** (`/occasions/:world`): "For Her" / "For Him" now showcase the approved look
   images for that occasion; couple + hero already used real images.
3. **Men catalog & detail:** removed all "placeholder / coming later" copy (all 210 are live), added a
   **Try this look** CTA, and the large detail image uses `object-fit: contain` so the full outfit shows
   without cropping.
4. **Women catalog & detail:** copy updated to "all 236 live", CTA label unified to **Try this look**,
   detail image uses `contain`.
5. **Couple Edit & detail:** "photos live" counter now counts the resolver (100/100), detail image uses
   `contain`, saved-thumbnail uses the resolver.
6. **Product detail:** products keep their legitimate labelled placeholder (no invented images); where an
   approved Women look features the product, a **"Seen in this VIRAAS look"** card surfaces the real look
   image (additive, no product-data change).
7. **Try-On page:** added Men looks as a **visual-preview-only** entry point (`?menLook=`) — image + info +
   view/share, **no upload, no generation, no backend/provider change**. The "Try this look" CTA is only a
   visual entry point in this phase.
8. **`ImageFrame`:** added a `fit` prop; look/couple **detail** images render with `contain` (no stretch,
   no distortion, no unnecessary crop); grid cards keep `cover` for uniformity. Graceful error → labelled
   pending state; lazy loading preserved.

## Image display quality
- `object-fit` used throughout (never `width/height` stretch) → aspect ratio preserved, no distortion.
- Detail/preview images use `contain` on a soft neutral background so full-length and wider outfits are
  never cropped.
- Existing responsive breakpoints retained (grids collapse to 3→2→1 columns; detail grid stacks on mobile,
  image first). `loading="lazy"`/`decoding="async"` kept; `onError` falls back to a labelled frame.

## Products — image status (reported, not invented)
All 861 catalog products have **no image asset** (the product-photo queue was never generated; this
matches the repo's own `FINAL_REPORT.md`). None were invented. Full per-record list:
`reports/product-image-audit.json`. Counts by gender/category:

- **Women (525):** Chaniya Choli 95, Lehenga 85, Saree 70, Anarkali 45, Kurta Sets 42, Sharara 42,
  Pre-Draped Saree 34, Gharara 30, Jewellery 30, Bags 18, Footwear 18, Beauty 16.
- **Men (336):** Modern Kurta 95, Printed Ethnic Shirt 55, Festive Kurta Set 40, Ethnic Shirt 32,
  Traditional Layer 32, Embroidered Ethnic Shirt 30, Festive Jacket 26, Festive Separates 14, Footwear 12.

These are **legitimate placeholders** (category A): no valid image asset exists, so a clearly-labelled
"Image pending" frame is shown. They are reported here and are the intended input to a future product-image
phase — not part of this preview task.

## Protection rules honoured
No changes to: Men 210 images/QA/references/definitions · Women images/content · Couple images/content ·
product source data (names/prices/ratings/merchants) · affiliate URLs · occasion taxonomy · the Try-On
generation backend. No images regenerated; no new product images created; no affiliate links added.

## Validation performed
- `scripts/audit-preview-completeness.mjs` — 546/546 look images present, valid, unique, wired; 0 broken. **PASS**
- `npm run check-catalog` — **PASS**
- `tsc -p tsconfig.json` (incl. `--noUnusedLocals`) — **PASS**
- `vite build` (production bundle) — **PASS**
- Dev server (`:5173`) — all look/couple assets serve HTTP 200; SPA loads with no runtime errors.
- Representative looks confirmed wired: Men 001/050/100/150/200/210; Women across all 5 occasions;
  Couples across all 5 worlds.

> Note: headless-browser (Playwright/Chromium) DOM auditing could not run in this fresh sandbox — the
> required system libraries (`libnspr4` etc.) are unavailable and not installable here. Rendered-DOM
> verification is therefore best done via the **live preview**; the image wiring is proven programmatically
> against the exact JSON the app consumes. A ready-to-run render check is included at
> `scripts/audit-preview-render.mjs` for environments where the browser is present.
