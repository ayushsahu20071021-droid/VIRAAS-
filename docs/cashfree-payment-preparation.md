# Cashfree Payment Gateway preparation for VIRAAS

Status: preparation only. This document and `server/payments/cashfree-provider.mjs` do not enable Cashfree checkout in the production app. Existing payment routes and provider selection are unchanged.

## Merchant activation comes first

The Cashfree dashboard currently reports Payment Gateway as **Products In-Review / Activation in Progress**. Do not accept live payments until Cashfree explicitly activates the product and issues production credentials. Sandbox credentials can be used to prepare and test the integration separately.

## Server-only environment variables

Configure these only in the Vercel project's server-side Environment Variables, never in `VITE_*`, browser code, Git, screenshots, or chat:

| Variable | Purpose |
|---|---|
| `CASHFREE_ENV=sandbox` | Keep the provider in sandbox during development. |
| `CASHFREE_APP_ID` | Cashfree sandbox App ID. |
| `CASHFREE_SECRET_KEY` | Cashfree sandbox secret key. |
| `CASHFREE_API_VERSION=2025-01-01` | Cashfree API version header. |

Production values must not be entered until the merchant's Payment Gateway product is approved. Change environment to `production` only as part of an explicitly reviewed launch.

## Intended flow before launch

1. Server creates a unique ₹20 INR order and stores the VIRAAS order record before returning the payment session to the browser.
2. Browser opens Cashfree's hosted checkout using the official Cashfree JS SDK and the server-issued payment session ID.
3. Return URL is only a user-experience redirect. It never grants a Try-On credit.
4. Server fetches the order/payment status from Cashfree and verifies the webhook signature against the exact raw request body.
5. Only a captured, server-verified ₹20 payment can atomically grant exactly one credit. Duplicate webhooks, retries, amount mismatches, reused payment IDs, pending payments, and failed payments must never grant credits twice.
6. Existing Runware generation reservation/release behavior remains unchanged: if generation fails, the credit is returned to the user for retry.
7. Test successful, failed, pending, duplicate webhook, incorrect signature, wrong amount, replayed payment, and Runware-failure cases in sandbox before production.

## Current implementation boundary

The adapter module provides server-side primitives for creating an order, querying order/payment state, and validating webhook signatures. It is deliberately not wired to the live checkout yet: database persistence, webhook route/body capture, payment status reconciliation, atomic credit-ledger support, frontend SDK checkout, sandbox tests, and the provider-switch safety gate must be completed and reviewed before activation.

Do not set any live-provider flag or expose a payment button while onboarding is still under review. Keep the existing production flow unchanged until the Cashfree integration has passed sandbox tests and a separate reviewed launch change is ready.
