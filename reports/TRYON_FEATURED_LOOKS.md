# VIRAAS — /try-on Featured Try-On Looks (12)

The 12 placeholder shop-product cards on the main `/try-on` page were replaced with **12 approved production looks**
(6 Men + 6 Women, **no Couple looks**). Each card shows the exact approved production image and opens the existing
VIRAAS Try-On flow for that exact look via its `?menLook=` / `?womenLook=` reference. **No images were generated**;
these are existing approved images from `public/images/men-previews/` and `public/images/women-previews/`.

Labelled **"Featured Try-On looks"** — no popularity / bestseller / most-viewed / trending claims (no behavioural data
exists). Selection prioritised category, occasion and visual diversity, strong outfit identity and Try-On suitability.

## Men (6)

| # | Look ID | Title (approved metadata) | Category (garmentType) | Occasion | Image path |
|---|---|---|---|---|---|
| 1 | men-look-001 | Off-White Kurta | Kurta | Garba / Navratri | /images/men-previews/men-look-001.png |
| 2 | men-look-045 | Black Kurta | Kurta | College Fest | /images/men-previews/men-look-045.png |
| 3 | men-look-131 | Orange Ethnic Jacket / Layered Set | Ethnic Jacket / Layered Set | Festive Party | /images/men-previews/men-look-131.png |
| 4 | men-look-025 | Red Ethnic Shirt | Ethnic Shirt | Garba / Navratri | /images/men-previews/men-look-025.png |
| 5 | men-look-152 | Burgundy Waistcoat / Layered Set | Waistcoat / Layered Set | Festive Party | /images/men-previews/men-look-152.png |
| 6 | men-look-108 | Cream Kurta-Pajama Set | Kurta-Pajama Set | Diwali | /images/men-previews/men-look-108.png |

Covers all 5 approved Men garment types; occasions garba/college-fest/festive-party/diwali.

## Women (6)

| # | Look ID | Title (approved metadata) | Category (garmentType) | Occasion | Image path |
|---|---|---|---|---|---|
| 1 | women-look-034 | Red Lehenga | Lehenga | Garba / Navratri | /images/women-previews/women-look-034.png |
| 2 | women-look-003 | Multicolour Chaniya Choli | Chaniya Choli | Garba / Navratri | /images/women-previews/women-look-003.png |
| 3 | women-look-159 | Teal Sharara Set | Sharara Set | Festive Party | /images/women-previews/women-look-159.png |
| 4 | women-look-113 | Lemon Yellow Anarkali | Anarkali | Diwali | /images/women-previews/women-look-113.png |
| 5 | women-look-077 | Ivory Crop Top & Skirt | Crop Top & Skirt | College Fest | /images/women-previews/women-look-077.png |
| 6 | women-look-153 | Dusty Pink Kurta Set | Kurta Set | Festive Party | /images/women-previews/women-look-153.png |

6 distinct garment types; occasions garba/festive-party/diwali/college-fest; colours span red, multicolour, teal,
lemon yellow, ivory, dusty pink.

## Behaviour

- Each card CTA is **"Try On"** → `/try-on?menLook={id}` or `/try-on?womenLook={id}`, which the existing
  `resolveSubject()` flow already handles (age gate → privacy → upload → generate). No Try-On provider, Runware
  config, API architecture, privacy behaviour, upload flow or generation logic was changed.
- Titles/categories/occasions are derived from the approved look catalogs only — no product details invented, no
  outfit redesigned. Cards are look/try-on cards, **not** affiliate shop cards.
- No card shows "Image pending" or the "Final approved VIRAAS image will be added here" placeholder.
