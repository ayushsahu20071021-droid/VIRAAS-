# VIRAAS — MARKETPLACE RESEARCH (2026-09-23)

Research across the six permitted merchants (no Amazon). Findings grounded the catalog's
pricing bands, naming language and merchant assignment. Exact product URLs were NOT fabricated:
unverified listing URLs are marked `CHECK` in every product's `merchantUrl` field.

## Sources consulted

| Merchant | Surface | Observed pricing / language |
|---|---|---|
| Myntra | Lehengas category & brand naming (Sangria lehenga choli listings) | "Bandhani Printed Lehenga With Choli & Dupatta", "Zari Embroidered Ready to Wear Lehenga Choli"; mid-band youth festive ~₹1,500–4,999 |
| AJIO | Festive Kurta Sets (verified URL `ajio.com/s/festive-kurta-sets-4826-77561`) | Offer prices around ₹1,050–1,500 from ~₹4,999 — youth festive band |
| Meesho | Ethnic Sharara (verified URL `meesho.com/ethnic-sharara/pl/5ox`) | Sharara sets ₹300 start; typical run ₹1,169–1,334; naming "Adrika Graceful Sharara", "Aakarsha Pretty Sharara" |
| Flipkart | Festive Kurtas / Ethnic Sets (verified theme URLs) | Heavy youth band under ₹999 (₹200–811 shirt-pant & kurta sets); naming "Men Cotton Blend Shirt Pant Set" |
| Shopsy | Kurtas for Men (verified URL `shopsy.in/kurtas-for-men-online`) | Entry band ₹141–382 kurtas; naming "Men Printed Kurta", "Men Embroidered Kurta" |
| Nykaa | Lipstick/Kajal (verified URL `nykaa.com/dp/lipstick-kajal`) | Beauty minis ₹162–849; naming "Kajal", "Matte Lip Crayon", "Festive Glam Kit" |

## Derived VIRAAS pricing rules

- Preferred under ₹5,000 · hard cap ₹8,000 · every price finite integers in ₹INR.
- Bands: men shirts/kurtas ₹399–2,999 · women ensembles ₹599–4,999 · accessories ₹149–1,999 · beauty ₹149–899.
- Discount = (mrp − price)/mrp; mrp always > price, both ≤ ₹7,999.

## Derived naming language

"{Pattern} {Embroidery} {Garment} in {Colour}" — e.g. "Bandhani Mirror Work Chaniya Choli in Rani Pink",
"Chest Motif Embroidery Modern Ethnic Shirt in Black". Seller-style curation label "VIRAAS Edit"
(avoids fabricating third-party brand availability).

## Verified URLs used (everything else = CHECK)

- `https://www.myntra.com/lehengas`
- `https://www.ajio.com/s/festive-kurta-sets-4826-77561`
- `https://www.meesho.com/ethnic-sharara/pl/5ox`
- `https://www.flipkart.com/mens-ethnic-sets/festive-kurtas-under-999~theme/pr?sid=clo%2Ccfv%2Citg%2Cpme`
- `https://www.flipkart.com/clothing-and-accessories/kurtas-ethnic-sets-and-bottoms/ethnic-sets/festive-kurtas~theme/pr?sid=clo%2Ccfv%2Citg`
- `https://www.shopsy.in/kurtas-for-men-online`
- `https://www.nykaa.com/dp/lipstick-kajal`

## Honesty constraints applied

- No stock, ratings, reviews, popularity or commissions invented anywhere in data or UI.
- `affiliateUrl` / `affiliateSource` empty on every product (EarnKaro links added manually later).
- Merchant attribution is curation-level; listing-level URLs marked `CHECK` until verified.
