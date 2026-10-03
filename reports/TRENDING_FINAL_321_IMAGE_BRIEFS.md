# VIRAAS — Trending Final 321 Image Briefs

One image brief per product for the **final 321 Trending products only**. Each brief is derived solely from the
product's own catalog attributes (garment, colour, fabric, pattern, embroidery, silhouette, occasion). Machine-readable:
[`TRENDING_FINAL_321_IMAGE_BRIEFS.json`](./TRENDING_FINAL_321_IMAGE_BRIEFS.json).

## Rules applied
- No text, watermark, logo, or fabricated brand marks in any brief.
- No reuse/mapping of approved Men/Women/Couple catalog images to marketplace products.
- Output target per product: `public/images/trending/trending-product-<id>.webp`.
- Missing attributes recorded as `NOT SPECIFIED` (nothing invented).

## Coverage
| Metric | Value |
|---|---|
| Briefs | 321 |
| Men | 114 |
| Women | 207 |
| Unique output paths | 321 |

## Example brief
```
Full-length studio ecommerce fashion photograph of a Navy men's Printed Shirt, in Cotton, with blue and white print with white stole embroidery, and Printed pattern, Relaxed Printed Shirt silhouette. Worn by a professional model, front-facing, natural confident pose, neutral seamless light-grey studio backdrop, soft even softbox lighting, true-to-life fabric texture and colour, sharp focus, high resolution, centered composition with head-to-toe framing. Styled for garba, college-fest, diwali, festive-party occasion. No text, no watermark, no logo, no brand marks, no graphics overlay.
```
