## VIRAAS — The Festive Edit '26

**Rooted in tradition. Designed for now.** · Discover the look → See it on you → Shop the real outfit.

### What's in this PR
- **823 unique products** (505 women / 318 men) — reference-led taxonomy, ₹161–4,989 (all under the ₹5,000 preferred line, hard cap ₹8,000 validator-enforced), 0 fake duplicates
- **100 couple looks** — exactly 20 in each of the **5 public worlds** (Garba/Navratri first), matched-not-matching colour stories, 26-direction pose library, real linked catalog products (4–6 per look)
- Full Next.js 14 platform: homepage (exact 13-section order), Women/Men mega menus (correct taxonomies only), 5 occasion worlds, Couple Edit + detail, product pages (Try This Outfit On You / Shop / Why We Picked It / Complete The Look / You May Also Like), **token-based gender-safe search**, context-aware filters with zero-result hiding, **Try-On** (18+ gate → upload → generate → save/share/shop, /api/try-on provider abstraction, labelled demo mode), Saved Looks (localStorage + Web Share/Copy/WhatsApp), Journal (12 articles), SEO (sitemap = real pages only, robots, JSON-LD without fake ratings)
- **Persistent image-generation queue**: 946 exact prompts in §58 priority order. Arena's image API caps at **10 images/turn** — 10 Garba couple photos generated + QA-passed this session; the queue continues across turns. **No placeholders, ever** (per §59).
- Validation suite (npm run): check-catalog ✓ · audit-affiliate ✓ (affiliateUrl empty everywhere, "Affiliate link not configured" UI, no Amazon) · audit-http-images ✓ · audit-duplicates ✓ · typecheck ✓ · build ✓ (1,705 pages) · render-smoke ✓ (ghost occasions blocked) · audit-rendered-browser ✓ (real Chromium, 15 routes × 320→1440px) · validate-real-images — honest FAIL until the image queue drains

### Honest status (see FINAL_REPORT.md)
Real images 10 / 946 (pending queue) · failed QA 0 · placeholders 0. Completion is **not** declared until the image gate passes.

**DO NOT MERGE** (per instructions).
