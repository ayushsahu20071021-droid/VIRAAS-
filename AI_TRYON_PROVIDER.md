# VIRAAS AI Virtual Try-On — Provider Research & Decision

_Last updated: 2026-09-27_

## Goal
Turn **(VIRAAS selected outfit reference) + (user photo)** into a realistic image of that **same
coordinated outfit** worn by that person — for Indian ethnic/festive fashion (lehenga + choli +
dupatta, saree + blouse + drape, kurta + bottom + dupatta, salwar/suit sets, layered looks).

The hard requirement: coordinated multi-piece sets must **stay multi-piece** and not collapse into a
single one-piece "dress" (the failure mode observed earlier with FASHN VTON v1.5).

## Options evaluated (2026)

| Provider / model | Multi-garment / ethnic sets | License (commercial) | Privacy / retention / training | Self-host | Approx. cost | Verdict |
|---|---|---|---|---|---|---|
| **Runware FLUX VTO (`bfl:flux@vto`)** | **Yes** — same FLUX VTO; up to 4 garments via 2×2 grid, full-outfit + model-to-model, **prompt-steerable** | Yes (commercial) | ✅ **Never trains on API data (with or without ZDR); ZDR (enterprise, org-level) = input media not retained, outputs deleted at TTL; `dataURI` output = nothing stored** | No (hosted API) | ~$0.0425–0.0475 / generation | **Selected — best privacy path** |
| **FLUX VTO (Black Forest Labs) direct, "vto-v1"** | **Yes** — up to 4 garments, full-outfit + layering + **model-to-model** transfer, **prompt-steerable** | Output commercial-use OK | ⚠️ **Standard API trains on inputs/outputs by default, no clean opt-out; ZDR only on Enterprise/dedicated** | No (API only) | ~$0.04–0.06 / generation | Kept as secondary; ZDR-only |
| FASHN v1.6 / Try-On Max | Partial — category-based (tops/bottoms/one-pieces), up to 3 layers; **collapses coordinated ethnic sets** | Yes | Auto-deletes inputs after 72h; commercial by default | No | $0.075 / gen | Rejected on quality for ethnic sets |
| Google Vertex AI Virtual Try-On (`virtual-try-on-001`, GA Jan 2026) | Product/garment oriented; ethnic multi-piece unverified | Yes (GCP) | **Strong** — GCP DPA, not used to train Google models; data-residency options | No | GCP metered | Strong privacy alt; needs per-garment images + GCP project |
| Kling Kolors v1.5 (Kuaishou) | Single garment on-model | Yes | Per fal / Kuaishou | No | $0.07 / gen | Not multi-garment |
| Leffa (on fal) | Explicit garment type (upper/lower/dress) | Commercial on fal | Per fal | Yes (heavy) | $0.10 / gen | Single-garment; local run exhausted T4 RAM |
| IDM-VTON / CatVTON | Research quality | **Non-commercial / research-only** | n/a | Yes | — | **Excluded from production (license)** |

## Decision (updated)

**Primary production approach: Runware-hosted FLUX VTO (`bfl:flux@vto`), used with Zero-Data-Retention.**

Runware serves the *same* FLUX VTO capability (multi-garment / full-outfit / model-to-model + prompt
steering) but with a materially better privacy posture than BFL's own standard API:

- **Runware never uses API data to train or improve models** — with *or* without ZDR
  ([source](https://runware.ai/docs/platform/zero-data-retention)). This is the key differentiator vs
  BFL direct, whose standard API trains on inputs by default.
- **Zero Data Retention** (enterprise, org-level, enabled by Runware on request): prompts and input
  media are not retained; generated media is deleted when its `ttl` expires (60s default).
- The adapter requests **`outputType: "dataURI"`**, so the result is returned **inline in the API
  response with no file stored** — nothing to fetch, expose, or expire, and the browser never sees a
  provider URL.

**Runware model ID:** `bfl:flux@vto`.
**Pricing (documented):** ~**$0.0375 first input MP + $0.005 per additional input/output MP**, i.e.
roughly **$0.0425 (1 ref) – $0.0475 (2 refs)** per generation. Confirm current pricing on Runware.
**ZDR status:** available on enterprise accounts only, enabled per-organization via Runware Sales.
**Commercial use:** permitted.

The BFL-direct adapter (below) is kept as a secondary option. Both are gated so live generation is OFF
until credentials + a verified ZDR deployment are configured.

### Runware adapter specifics
- File: `server/providers/runwareFluxVto.mjs`. Endpoint `POST https://api.runware.ai/v1`,
  `Authorization: Bearer <RUNWARE_API_KEY>`, body = one `imageInference` task with
  `model: bfl:flux@vto`, `positivePrompt`, `inputs.referenceImages: [{image,role:"person"},{image,role:"garment"}]`,
  `outputType:"dataURI"`.
- **Hard privacy gate:** refuses to send any photo unless `RUNWARE_ZDR=true`.
- **Prompt engineering** explicitly preserves colours, print placement, embroidery, borders, fabric
  texture, silhouette, drape, layering, folds/shadows, the user's face/identity/proportions/pose/camera
  angle, and includes the exact ethnic rule:
  _"Preserve the coordinated garments as separate clothing pieces. Do not reinterpret the lehenga and
  choli as a one-piece dress. Preserve the dupatta as a separate draped garment."_
- **Multi-garment:** builds a documented **2×2 grid** (`composeGrid`, lazy `sharp`) when ≥2 separate
  component images are provided. VIRAAS currently ships single **on-model full-look** references, so the
  model-reference workflow + strong prompt is used; the grid path activates automatically if per-garment
  component images are ever added.
- **Env vars:** `TRYON_MODE=runware-flux`, `RUNWARE_API_KEY`, `RUNWARE_FLUX_MODEL=bfl:flux@vto`,
  `RUNWARE_ZDR=true`, optional `RUNWARE_API_URL`, `RUNWARE_OUTPUT_TTL`.
- **Live generation configured?** **No.** Ships disabled (no key, `RUNWARE_ZDR` unset) — honest
  "being configured" state until the owner sets credentials.

---

### Secondary approach: FLUX VTO (Black Forest Labs direct), used exclusively via a Zero-Data-Retention deployment.

**Why:** It is the only currently-available try-on model that natively supports multi-garment /
full-outfit composition **and** model-to-model transfer **and** natural-language prompt steering.
VIRAAS references are full on-model looks, so we use model-to-model transfer plus a prompt that
explicitly instructs the model to keep the lehenga/choli/dupatta (or kurta/bottom/dupatta) as
**separate garments** — directly targeting the one-piece-collapse failure.

**Non-negotiable privacy caveat (verified in BFL's own policies):** BFL's *standard* API states that
inputs (uploaded images) and outputs are used to train/improve their models, under a perpetual,
irrevocable licence, with no clean programmatic opt-out. That is **not acceptable for customer
photos.** Zero-Data-Retention (no storage, no training, purge after response) is only offered on
BFL's **Enterprise / dedicated** tier (or a verified ZDR reseller). Therefore the adapter is **gated**:
it refuses to send any user photo unless the owner sets `BFL_VTO_ZDR=true`, which must only be set
when pointing at a verified ZDR endpoint.

Because turning this on requires a paid, privacy-verified account (which must not be purchased
automatically), **production generation ships disabled**; the app stays in the honest
"being configured" state until the owner completes setup.

## Data flow (when enabled)

```text
Browser: select photo → local crop/face-hide controls → canvas re-encodes bounded JPEG and strips source metadata
  → explicit 18+ and photo consent → HTTPS POST /api/try-on with the edited photo
     → server authenticates the adult VIRAAS account and validates the reference/photo
     → PostgreSQL atomically reserves one credit before calling Runware
     → Runware FLUX VTO under verified organization-level ZDR, outputType=dataURI
     → PostgreSQL consumes the reservation on success or releases it on provider failure
  → private result returned inline; the browser only saves/downloads/shares after the user's action
```

- The original photo is not uploaded if browser-side processing fails. The server rejects raw or oversize photos, never writes photo bytes to disk, and never logs them. Runware output is inline; no provider result URL is exposed to the browser.
- PayU receives fixed order/billing fields only, never a Try-On photo. The selected image exists only in request/provider memory and is not stored in PostgreSQL.
- The result is private by default. Saving a generated result is a separate user action; downloaded/shared copies are controlled by the user.
- Credits are persistent: two exactly-once free credits for a completed adult account; each successful Try-On costs one credit; a real verified ₹20 PayU purchase adds exactly one credit.

## Couple reference resolution

Couple-side Try-On uses only a direct, explicit `herProductIds` or `hisProductIds` relationship from the selected Couple record. The referenced product must be live, enabled for Try-On, have the expected gender, be a garment (not an accessory), and point to a VIRAAS image path outside the combined Couple-image directory. If that exact side cannot be proven, only that side is unavailable. The combined Couple image, text description, random catalog item, inferred mapping, and invented URL are never substituted.

## Owner setup to go live (recommended: Runware)
1. Create a Runware account and request **Zero Data Retention** for your organization
   (Runware → Contact Sales). Verify: input-media retention (none under ZDR), output TTL, no-training
   policy, commercial use, DPA.
2. Set server env (see `server/.env.example`): `TRYON_MODE=runware-flux`, `RUNWARE_API_KEY=…`,
   `RUNWARE_FLUX_MODEL=bfl:flux@vto`, and **`RUNWARE_ZDR=true`**.
3. Deploy so `public/images/**` reference images are present (they are inlined as base64), or set
   `PUBLIC_BASE_URL`.
4. Run one real Garba women + men generation and confirm garments stay separate before announcing.

Pricing to expect: roughly **$0.0425–0.0475 per generation** on Runware FLUX VTO (varies by
input/output megapixels); confirm current pricing at https://runware.ai.

### Alternative: BFL direct
Set `TRYON_MODE=flux`, `BFL_API_KEY`, `BFL_API_BASE=<your ZDR endpoint>`, `BFL_VTO_ZDR=true`. Only use
a Zero-Data-Retention BFL endpoint — the standard BFL API trains on inputs by default.

---

## Persistent credit and PayU architecture

**Business model.** Customers pay VIRAAS, not Runware. Runware usage is billed to the VIRAAS provider account. The Try-On credit balance and payment order are persisted in PostgreSQL.

### Flow

```text
Completed adult VIRAAS account → exactly two signup credits (one-time ledger grant)
  → photo/reference validation → atomic PostgreSQL credit reservation
  → real Runware FLUX VTO call
       success → consume the reservation and return the inline image
       failure → release the reservation; return no generated/demo image

No credits → server creates a fixed ₹20 PayU order and signed Hosted Checkout fields
  → browser POSTs to PayU (no photo included)
  → PayU POSTs signed success/failure response to /api/payment/payu/callback
  → VIRAAS validates PayU's reverse hash AND calls verify_payment server-to-server
  → one atomic PostgreSQL transaction marks the order captured, adds exactly one credit,
    and writes an idempotent ledger entry
```

### Trust boundary and idempotency

- `PAYU_MERCHANT_SALT`, Runware key, database URL and Supabase credentials are server-side only. PayU receives the required public merchant key and a SHA-512 request hash; it never receives a Try-On photo.
- A callback, redirect, client flag, or query string never grants credits. VIRAAS checks the reverse PayU hash, exact transaction/order/amount/customer fields, then reconciles the transaction through PayU's `verify_payment` API before applying a credit.
- `₹20.00` and `INR` are fixed in server code and constrained in PostgreSQL. A verified PayU capture ID, order ID, user/request key, and ledger idempotency key prevent replay or duplicate grants.
- A generation request requires a persistent authenticated adult account, explicit consent, a valid exact VIRAAS reference, a bounded browser-processed JPEG and a unique `Idempotency-Key`. The database row lock reserves one credit before Runware is called. A client cannot grant, consume, or release credits.
- If PostgreSQL, Runware ZDR, Runware credentials, or PayU credentials are not ready, the feature fails closed. There is no mock checkout, demo result, or client-trusted payment-success path.

### Server configuration

See `server/.env.example` and `docs/connect-production-setup.md`. Required production systems are the existing PostgreSQL/Supabase database plus migrations `001_core`, `002_incomplete_accounts`, and `003_tryon_credits_payu`; Supabase Email/Password Auth and `VIRAAS_SESSION_SECRET`; Runware FLUX VTO with verified organization-level ZDR; and the merchant's PayU Hosted Checkout key/salt. Set `PUBLIC_BASE_URL=https://viraas-in.vercel.app` if Vercel's project production URL is not provided automatically. Migrations are run manually via `npm run db:migrate`; the deploy build never runs migrations.

### Tests and live status

`npm run test-payment-tryon` uses `pg-mem` plus a test-only PayU HTTP stub to exercise the signed callback, server-side verification, exact price/credit grant, generation reserve/consume/release, and replay protection without contacting PayU or Runware and without moving money. `npm run test-connect`, `npm run test-runware-adapter`, `npm run typecheck`, and `npm run build` cover the other local integration boundaries. A test stub is not production evidence: use genuine merchant/provider credentials and verify the actual production browser before claiming live transactions or generation.
