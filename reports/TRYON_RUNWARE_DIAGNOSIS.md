# AI Try-On — Runware FLUX VTO server-side diagnosis (Phase 8)

**Scope reminder:** the Try-On **landing page is complete and unchanged** — 6 Men + 6 Women + 0 Couple = 12 approved featured looks. No featured image was regenerated. The only question here is the **actual AI generation after a user uploads a photo**. No secret is ever exposed.

## Provider / model
- Provider: **Runware FLUX VTO**, model `bfl:flux@vto` (`server/providers/runwareFluxVto.mjs`).
- Real generation is gated: `runwareConfigured = Boolean(RUNWARE_API_KEY) && (RUNWARE_ZDR === 'true')`.

## What the reported error actually tells us
The user-visible message — *"The try-on service is unavailable right now (rate limit or credits)."* — is produced by exactly **one** branch of `mapError()`:

```
if (/rate|quota|429|insufficient|credit|balance/i.test(s)) return 'The try-on service is unavailable right now (rate limit or credits)...';
```

That branch only fires **after an authenticated request reached Runware and Runware returned an error string** containing one of `rate | quota | 429 | insufficient | credit | balance`. By elimination against the other branches, this rules out the alternatives:

| Possible cause | Verdict | Why |
|---|---|---|
| Invalid / missing API key, auth | **Not this** | would hit the `auth\|401\|403` branch → "provider rejected the credentials" |
| Missing key on server | **Not this** | would return "not configured (missing API key)" before any call |
| ZDR not acknowledged | **Not this** | would return the explicit ZDR message before any call |
| Model access / bad payload | **Not this** | would return a generic provider error, not the credit/rate wording |
| Timeout / network | **Not this** | would hit the `timeout` branch |
| Safety/moderation block | **Not this** | would hit the `moderat\|nsfw\|safety` branch |
| **Account credits/balance or plan rate limit** | **THIS** | the only branch matching the observed message |

**Conclusion: this is an account credits/balance (or plan rate-limit) rejection from Runware — NOT a code or configuration bug.** Therefore, per instruction, **no code fix is made** (making one would be inventing a fix for a billing state).

## This sandbox
`RUNWARE_API_KEY` is **unset** here, `RUNWARE_ZDR` unset → server reports `mode: demo, configured: false`. A **real** end-to-end generation test (upload → generate → result → Save → Download → Share → Try Another) **cannot be run in this environment without a key**, and I will **not** fake a success or claim verified AI quality. The flow itself is wired and works in demo mode; real generation depends on the owner action below.

## Exact owner action required (no money spent automatically)
1. **Runware dashboard → Billing / Credits:** Runware is pay-as-you-go — **add credits / top up the balance.** Estimated cost for `bfl:flux@vto` is ≈ **$0.0425–$0.0625 per generation** (1–2 reference inputs); a couple of test runs ≈ **$0.09–$0.13**. *Do not* rely on a zero/negative balance.
2. **Check plan rate limits:** if the balance is positive but you still see 429s, review the plan's concurrency/rate limits in the dashboard.
3. **Deployment env (not this sandbox):** set `TRYON_MODE=runware-flux`, `RUNWARE_API_KEY=<key>`, `RUNWARE_FLUX_MODEL=bfl:flux@vto`. Set `RUNWARE_ZDR=true` **only** if your Runware organization actually has Zero-Data-Retention enabled (enterprise, enabled by Runware on request) — the flag is a local acknowledgement gate, not proof.
4. After credits are added, run the featured-look flow once to confirm; privacy/ZDR behaviour is unchanged (user photo sent base64, never hosted/logged; metadata-only logs).

**No provider switch, no payment gateway, no credentials committed, ZDR intact.**
