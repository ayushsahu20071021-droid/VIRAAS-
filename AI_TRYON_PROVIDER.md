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

```
Browser (user photo, edited/cropped if chosen)
  → base64 over HTTPS → VIRAAS server /api/try-on   (age-gated, validated, size-limited)
     → garment = VIRAAS reference image, inlined as base64 from disk (VIRAAS's own catalog image)
     → server/providers/fluxVto.mjs:
         POST {prompt, person(base64), garment(base64)} to BFL vto-v1 with x-key   (server-side key)
         poll polling_url until Ready
         fetch the 10-min signed result URL SERVER-SIDE, re-encode to base64
  → result returned inline to the browser (browser never sees the provider URL)
```

- User photo: **never** written to disk, **never** hosted at a public URL, **never** logged (logs are
  metadata only: outfit id, gender, byte size, inline/url, mode).
- Result: private by default; Save = device localStorage only; Download/Share = explicit user action.
- No temp files are written, so there is nothing to clean up server-side.

## Couple Try-On limitation (honest)
Couple looks have no individual per-person reference **image** (only a combined couple image, which we
must not use, plus a per-person text description). Image-based VTON needs a garment image, so couple
For-Her / For-Him **AI generation is not possible** until per-person reference images are added. The
routing and mapping are correct and preserved; in `flux` mode couples return an honest error, and in
`demo` mode they still show the labelled layout preview.

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

## Payment-gated Try-On architecture (customer pays VIRAAS → Runware)

**Business model.** The customer pays **VIRAAS** for an AI Try-On. Runware is VIRAAS's AI provider
and its usage is billed to the **VIRAAS Runware account** by actual usage. The customer **never** pays
Runware directly, and there is **no** customer↔Runware payment anywhere in the flow.

### Flow (server-verified, one paid generation)

```
Customer → VIRAAS website → AI Try-On (pick look, 18+ gate, upload/edit photo, consent)
  → POST /api/payment/create            (server creates PENDING payment + gateway order)
  → customer completes payment at the gateway's checkout
  → gateway → POST /api/payment/webhook (server-to-server, SIGNED)
       server verifies the signature → marks payment VERIFIED → mints ONE authorization (AUTHORIZED)
  → browser polls GET /api/payment/status?paymentId=…  → receives the one-time authToken
  → POST /api/try-on { …, authToken }
       server ATOMICALLY claims the authorization (AUTHORIZED → CONSUMED) BEFORE calling the provider
       → Runware FLUX VTO → private dataURI result returned inline
```

### Trust boundary (security)
- A frontend claim such as `{ paymentSuccess: true }` is **never trusted**. The server ignores any
  client-supplied "paid" flag. A payment becomes `VERIFIED` **only** via a cryptographically-verified
  gateway webhook (HMAC signature) or a server-side gateway poll (`/api/payment/verify`).
- The one-time `authToken` is a high-entropy secret minted server-side and revealed only to the caller
  holding the unguessable `paymentId` capability, only once the payment is `AUTHORIZED`.

### One-time authorization state machine (`server/payments/store.mjs`)
`PENDING → VERIFIED → AUTHORIZED → CONSUMED`, with `FAILED` (recoverable) on a genuine post-payment
generation failure.
- **Duplicate webhook** → `authorize()` is idempotent → **no** second authorization (same token).
- **Duplicate generation request** → `claimForGeneration()` is an atomic compare-and-swap
  (`AUTHORIZED → CONSUMED`) → exactly one caller wins → **no** double Runware generation.
- **Genuine Runware failure after payment** → state becomes `FAILED` + `recoverable` (retains
  `paymentId`/`generationId`) — the paid authorization is **not lost** and **not faked**, so a refund
  or credit can be reconciled later. It is **not** auto-reverted to `AUTHORIZED` (that would allow a
  second billed Runware call against one payment). Refund/credit APIs are intentionally **not**
  implemented until a real gateway is selected.

### Provider-agnostic payment gateway (`server/payments/providers.mjs`)
Neither Razorpay nor Cashfree is hard-coded into the flow. A gateway adapter implements
`createOrder()`, `verifyWebhook()` (signature check), and `verifyPayment()` (optional poll). Adapters:
- **`mock`** (default) — test-only, HMAC-signed webhook, **moves no money, makes no network calls**,
  and never reports itself as a configured production gateway.
- **`razorpay`** / **`cashfree`** — documented **stubs**; report *not configured* until their
  credentials are set. Wire the Orders API + signature verification when onboarding completes.

### Configuration (server-side only; see `server/.env.example`)
| Env var | Meaning | Default |
|---|---|---|
| `TRYON_PAYMENT_REQUIRED` | Gate real Try-On behind a verified payment | `false` (demo/preview works, no money) |
| `TRYON_PRICE_INR` | Customer-facing price (config only — **no** margin math) | `20` |
| `TRYON_CURRENCY` | Currency code | `INR` |
| `PAYMENT_PROVIDER` | `mock` \| `razorpay` \| `cashfree` | `mock` |
| `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` / `RAZORPAY_WEBHOOK_SECRET` | Razorpay creds (later) | unset |
| `CASHFREE_APP_ID` / `CASHFREE_SECRET_KEY` | Cashfree creds (later) | unset |

Pricing is decoupled from the Runware integration: change `TRYON_PRICE_INR` at any time without
touching the provider adapters.

### Privacy (unchanged, preserved)
No raw/base64 customer image is logged; the photo is never persisted, never public, never in Git, and
never sent to the payment provider. No gateway secret or provider key is exposed to the browser
(verified against `dist/`). The result is private by default; sharing is an explicit user action.

### What is NOT live yet (blockers to real customer-payment → Runware)
1. A real payment gateway must be selected and its credentials + verified webhook signature wired
   (Razorpay onboarding is problematic; Cashfree onboarding in progress).
2. `TRYON_PAYMENT_REQUIRED=true` must be set once a gateway is live.
3. Runware must be activated separately (`TRYON_MODE=runware-flux`, `RUNWARE_API_KEY`,
   `RUNWARE_ZDR=true` with org-level ZDR confirmed, funded credits) — still **OFF** by default.

### Tests
`npm run test-payment-tryon` — mock/local only (no real API calls, no money): store state machine,
payment-pending blocks Try-On, fake `paymentSuccess` blocked, unverified blocks Runware, one
authorization per verified payment, single-use consumption, duplicate-webhook idempotency,
duplicate-generation guard, failure→recoverable state, no-key/ZDR-false → no live call, no image
bytes in logs, no secrets in frontend. `npm run typecheck` and `npm run build` also pass.
