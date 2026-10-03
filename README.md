# VIRAAS

**ROOTED IN TRADITION. DESIGNED FOR NOW.** Discover the look. See it on you. Shop the real outfit.

VIRAAS is an Indian festive fashion discovery platform. It combines curation, AI Try-On and affiliate shopping for 16–30 year olds.
VIRAAS does not own inventory and does not process checkout. External retailers complete checkout.

## Stack
- Vite + React + TypeScript SPA (`src/`)
- Express server (`server/`) serves `dist/` and `/api/try-on` through `tryOnProvider.generateTryOn()`
- Data sources live in `data-src/`. `scripts/build-catalog.mjs` generates `src/data/*.json` and the image queue.

## Run
```bash
npm install
npm run build          # builds catalog + typecheck + vite build
npm start              # http://0.0.0.0:8787 (TRYON_MODE=demo by default)
```

## Image pipeline
1. Raw generated images go in `.raw/couples/<id>.png` or `.raw/products/<id>.png` (git-ignored).
2. `npm run ingest-images` converts them to webp under `public/images/` and records the sha256 and dimensions.
3. A human or agent inspects each image against its reference and sets `qa: "QA_PASS"` in `data-src/image-qa.json`.
4. `npm run build-data` publishes only `QA_PASS` images. Everything else shows a labelled "Image pending" state.

The queue is stored in `public/image-queue.json`, `public/image-queue-ordered.json` and `public/image-manifest.json`.

## Affiliate links
Every `affiliateUrl` is empty. Add EarnKaro links manually later. Until then the UI shows "Affiliate link not configured" and links to a plain marketplace search.
Allowed merchants: MYNTRA, AJIO, FLIPKART, SHOPSY, MEESHO, NYKAA.

## Audits
`check-catalog`, `validate-images`, `audit-affiliate`, `audit-duplicates`, `audit-search`, `audit-http-images`, `render-smoke`, `audit-rendered-browser` (these need `npm start` running), `typecheck`, `build`, `final-audit`.
