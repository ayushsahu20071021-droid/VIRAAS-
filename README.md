# VIRAAS

**ROOTED IN TRADITION. DESIGNED FOR NOW.** Discover the look. See it on you. Shop the real outfit.

VIRAAS is an Indian festive-fashion discovery platform. It does not own inventory or process retailer checkout. Exact shop links appear only when an existing verified workbook or product mapping provides one; absent mappings do not produce invented URLs.

## Existing app and curated data

This repository contains the existing VIRAAS application and curated data. Do not regenerate, replace, or audit-fix the catalog as part of a deploy. The standard build is intentionally non-destructive.

- Women, Men, Occasions, Couple Edit, Trending, Connect, and Journal remain the primary navigation.
- Accessories has been removed from navigation; `/accessories` redirects to `/women`.
- Women and Men look details support Save and Try On, and show Shop only for a verified existing link.
- Couple Her/Him Try-On references resolve only through explicit side-specific product IDs with a matching live garment image. An unresolved side stays unavailable; a combined Couple image or unrelated look is never substituted.

## Stack and commands

- Vite + React + TypeScript SPA (`src/`)
- Express API (`server/`), shared by `npm start` and `api/index.mjs` on Vercel
- PostgreSQL persistence for Connect, chat, Try-On credits, and PayU orders
- Supabase Email/Password Auth wrapped in the encrypted, HttpOnly `viraas_session` cookie
- Runware-hosted FLUX VTO (`bfl:flux@vto`) for real AI generation only; no generated/demo success fallback

```bash
npm install
npm run dev                 # Vite on port 5173
npm run typecheck
npm run build               # typecheck + Vite build; does not regenerate catalog data
npm start                   # Express app on port 8787
npm run db:migrate          # operator-run migrations; never runs during build/deploy
npm run test-connect
npm run test-payment-tryon
npm run test-runware-adapter
```

Use `npm run build-data` only when deliberately changing source catalog inputs. Vercel's build must remain non-destructive to all curated JSON, image, workbook, and verified link mappings.

## Try-On, credits, payment and privacy

- Each completed adult VIRAAS account receives exactly two persistent signup credits. The server atomically reserves a credit before calling Runware, consumes it on success, and releases it on generation failure. At zero, the app says exactly `No Try-On credits remaining.`
- A real ₹20 PayU Hosted Checkout purchase adds exactly one credit after both the PayU response hash and server-to-server `verify_payment` result match the stored order. Replayed callbacks cannot grant another credit. No client-provided paid flag grants credits.
- Runware stays unavailable until its server-side key is configured and the organization's Zero-Data-Retention deployment is verified. A result is never simulated.
- The selected photo is processed and re-encoded in the browser, consent and server-verified 18+ checks are required, the upload is size-limited, and the photo is never written to disk or logged. The PayU request never includes a Try-On photo. The Runware key, PayU salt, database URL, and Supabase credentials are server-side only.
- Connect profiles, accepted connections, chat, blocks, and reports use PostgreSQL; only accepted, unblocked participants can access their private conversation. No localStorage/demo profile or chat fallback exists.
- AI Stylist is postponed.

Production setup variables and the migration order are documented in `server/.env.example` and `docs/connect-production-setup.md`. The PayU and Runware integrations still require the project owner's genuine server-side credentials and Runware ZDR enablement. Never commit secrets or paste keys into chat.

## Image pipeline

1. Raw image assets go in the ignored `.raw/` directory.
2. `npm run ingest-images` imports images under `public/images/` and records hashes/dimensions.
3. A human verifies each image against its source and records QA in `data-src/image-qa.json`.
4. `npm run build-data` regenerates catalog and image-queue outputs from approved source data.

## Product and affiliate links

- `merchantUrlType: "marketplace-search"` is not a product listing and is not exposed as a product CTA.
- Exact merchant listings use `merchantUrlType: "product"`; only explicit HTTPS listing URLs are eligible for “View product”.
- Affiliate Shop is shown only for an exact verified existing Wishlink `/share/…` URL with `affiliateSource: "wishlink"`. Empty or invalid URLs produce no Shop button.
- Estimated prices, generic sizes and inactive Shop buttons are not presented as verified SKU information.

## Audits

```bash
npm run check-catalog
npm run validate-images
npm run audit-affiliate
npm run audit-duplicates
npm run audit-search
npm run audit-http-images
npm run audit-product-actions
npm run audit-workbook-mapping
npm run render-smoke
npm run audit-rendered-browser
npm run final-audit
```

Some render audits expect the local API/site to be running. A successful local build is not production verification; deployed routes and real provider behavior must be checked in the production browser before saying they are live.
