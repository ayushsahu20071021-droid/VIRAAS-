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
| **FLUX VTO (Black Forest Labs), "vto-v1" / VTO v2** | **Yes** — up to 4 garments, full-outfit + layering + **model-to-model** transfer, **prompt-steerable** | Output commercial-use OK | ⚠️ **Standard API trains on inputs/outputs by default, no clean opt-out; Zero-Data-Retention only on Enterprise/dedicated (or verified ZDR reseller e.g. Runware)** | No (API only) | ~$0.04–0.06 / generation | **Selected — but ZDR-only** |
| FASHN v1.6 / Try-On Max | Partial — category-based (tops/bottoms/one-pieces), up to 3 layers; **collapses coordinated ethnic sets** | Yes | Auto-deletes inputs after 72h; commercial by default | No | $0.075 / gen | Rejected on quality for ethnic sets |
| Google Vertex AI Virtual Try-On (`virtual-try-on-001`, GA Jan 2026) | Product/garment oriented; ethnic multi-piece unverified | Yes (GCP) | **Strong** — GCP DPA, not used to train Google models; data-residency options | No | GCP metered | Strong privacy alt; needs per-garment images + GCP project |
| Kling Kolors v1.5 (Kuaishou) | Single garment on-model | Yes | Per fal / Kuaishou | No | $0.07 / gen | Not multi-garment |
| Leffa (on fal) | Explicit garment type (upper/lower/dress) | Commercial on fal | Per fal | Yes (heavy) | $0.10 / gen | Single-garment; local run exhausted T4 RAM |
| IDM-VTON / CatVTON | Research quality | **Non-commercial / research-only** | n/a | Yes | — | **Excluded from production (license)** |

## Decision

**Primary production approach: FLUX VTO (Black Forest Labs), used exclusively via a Zero-Data-Retention deployment.**

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

## Owner setup to go live
1. Create a Black Forest Labs account and obtain an **Enterprise / Zero-Data-Retention** endpoint
   (or a reseller with a written ZDR/no-training DPA). Verify: input retention, output retention,
   training use, deletion, signed-URL behaviour, DPA.
2. Set server env (see `server/.env.example`): `TRYON_MODE=flux`, `BFL_API_KEY=…`,
   `BFL_API_BASE=<your ZDR endpoint>`, and **`BFL_VTO_ZDR=true`**.
3. Deploy so `public/images/**` reference images are present (they are inlined as base64), or set
   `PUBLIC_BASE_URL`.
4. Run one real Garba women + men generation and confirm garments stay separate before announcing.

Pricing to expect: roughly **$0.04–0.06 per generation** on FLUX VTO (varies by resolution/route);
confirm current pricing at https://bfl.ai/pricing.
