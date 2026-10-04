# VIRAAS

**ROOTED IN TRADITION. DESIGNED FOR NOW.** Discover the look. See it on you. Shop the real outfit.

VIRAAS is an Indian festive-fashion discovery platform. It does not own inventory or process retailer checkout. Product-level seller links and verified prices are shown only when an exact listing has been configured; generated marketplace-search URLs are not presented as product links.

## Stack
- Vite + React + TypeScript SPA (`src/`)
- Express API (`server/`), served locally by `npm start` and through `api/index.mjs` on Vercel
- One server-side Try-On provider entry point: `tryOnProvider.generateTryOn()`
- Curated/source data lives in `data-src/` and `src/data/`; `scripts/build-catalog.mjs` is an explicit data-generation command, not part of the deploy build

## Run and build
```bash
npm install
npm run dev             # Vite preview on port 5173
npm run typecheck       # TypeScript check, no emit
npm run build           # typecheck + Vite build; does not rewrite catalog data
npm start               # Express app on port 8787
```

Use `npm run build-data` only when deliberately regenerating catalog/image-queue outputs from `data-src/`. Vercel runs `npm run build`, which must remain non-destructive to the curated JSON catalogs.

## Try-On, account and chat status
- `/try-on` keeps the 18+ confirmation, private photo flow and provider abstraction. Without a configured provider it returns a clearly labelled layout preview, not an AI image.
- The Runware key is server-side only. A live provider call stays fail-closed until durable VIRAAS identity, the two-free-credit ledger and verified ₹20 checkout are connected.
- `/connect` and `/chat` are the existing VIRAAS Connect / human-to-human private-chat experience. They are not an AI stylist. Their current server store is in-memory and must not be treated as production-persistent identity or chat storage.
- No Google/Facebook sign-in or AI-chat model is claimed as connected.

See `server/.env.example` for the existing provider/payment variable names. Never commit secrets or paste keys into chat.

## Image pipeline
1. Raw image assets go in the ignored `.raw/` directory.
2. `npm run ingest-images` imports images under `public/images/` and records hashes/dimensions.
3. A human verifies each image against its source and records QA in `data-src/image-qa.json`.
4. `npm run build-data` regenerates catalog and image-queue outputs from the approved source data.

## Product and affiliate links
- `merchantUrlType: "marketplace-search"` is not a product listing and is not exposed as a product CTA.
- Exact merchant listings use `merchantUrlType: "product"`; only explicit HTTPS listing URLs are eligible for “View product”.
- Affiliate Shop is shown only for an exact Wishlink `/share/…` URL with `affiliateSource: "wishlink"`. Empty or invalid URLs produce no Shop button.
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
npm run render-smoke
npm run audit-rendered-browser
npm run final-audit
```
Some render audits expect the local API/site to be running. `FINAL_REPORT.md` records the current integration status and any remaining blockers.
