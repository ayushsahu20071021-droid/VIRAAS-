# Final Outfit Details + Couple Shop-the-Look + Couple Try-On — Phase Report

_No AI generation and no backend changes were made in this phase. No approved image was
regenerated, cropped, remapped, renamed, or deleted. Product catalog, occasion taxonomy,
existing affiliate sources, and the Try-On architecture were left unchanged._

## 1. Men & Women outfit details (9 fields each)

Every look now carries individually-matched values for all nine "Get Outfit Details" fields —
Garment, Colour, Pattern, Layering, Bottomwear, Footwear, Accessories, Pose/framing, Setting/light.

- **Text fields** (garment, colour, pattern, layering, bottomwear) derive per-look from that
  look's locked outfit definition in the client catalog — never a shared/combined description.
- **Visual fields** (pose/framing, setting/light, plus men footwear/accessories seen in the
  reference) come from inspecting every approved image via labelled contact sheets
  (men-01..10 = 210 tiles, women-01..12 = 236 tiles).
- **No invention:** where a field is genuinely not determinable from the reference, an honest
  value is used ("Not clearly visible in reference", "No additional layer",
  "Not applicable (floor-length anarkali)", etc.). Long-skirt women looks that hide footwear keep
  the honest footwear fallback rather than a guessed shoe.

Generated data: `src/data/men-look-details.json` (210), `src/data/women-look-details.json` (236),
built by `scripts/build-look-details.mjs` from the catalogs + `src/data/look-details-visual.json`
(hand-recorded observations expanded by `scripts/gen-visual-overlay.mjs`). Read by
`src/lib/lookDetails.ts`; rendered on the Men and Women look-detail pages.

## 2. Couples — content preserved

Couple images, descriptions, "Style it together" grids, and her/him product mappings are
untouched. The non-deterministic `build-catalog` step was **not** run, so protected data files
were not churned.

## 3. Couple Shop the Look — FOR HER / FOR HIM

The Shop-the-Look section now shows two clearly-separated options — **For her** (her outfit) and
**For him** (his outfit) — never combined. The existing "Style it together" product grids remain
below.

## 4. Affiliate links — UI/data placeholders only

New file `src/data/couple-affiliate.json` holds `herAffiliateUrl` / `himAffiliateUrl` for all 100
couples, **initially empty**. Empty → the button shows **"Affiliate link not configured"**. When
the owner later pastes a real URL into that file, the FOR HER / FOR HIM button opens **exactly**
that URL, untransformed (`target="_blank" rel="noopener noreferrer nofollow sponsored"`). VIRAAS
never generates, guesses, or modifies affiliate URLs — no EarnKaro links, no tracking params.

## 5. Couple AI Try-On selection

Each couple detail has a **Try on** block asking **"Whose outfit do you want to try?"** with two
buttons: **For her** → `/try-on?product=<her main product>`, **For him** →
`/try-on?product=<his main product>`. This reuses the EXISTING Try-On product entry point — no new
backend, no generation, no couple-image modification, never combined.

## 6. Final counts (see `reports/outfit-details-audit.json`)

| Metric | Result |
| --- | --- |
| Men details | **210 / 210** |
| Women details | **236 / 236** |
| Couple content preserved | **100 / 100** |
| Total | **546 / 546** |
| Remaining generic "Not recorded" (Men/Women) | **0** |
| Empty / invalid (Men/Women) | **0** |
| Broken image mappings | **0** (approved images untouched) |
| Incorrect detail mappings | **0** |
| Couple Shop-the-Look (Her + Him) | **100 / 100** |
| Couple Try-On (Her + Him) | **100 / 100** |
| Cross-mapped couples | **0** |
| Invented affiliate URLs | **0** |
| Product-catalog affiliate URLs touched | **0** |
| Typecheck (`tsc`) | **PASS** |
| Build (`vite build`) | **PASS** |
