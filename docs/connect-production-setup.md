# VIRAAS Connect: production setup

VIRAAS Connect uses a real PostgreSQL database and Supabase Email/Password Auth. There is no in-memory account store or demo-account fallback. Until the variables below are configured and the schema is migrated, Connect reports unavailable and does not accept profiles, requests, or messages.

## Exact server environment variables

Set these as server-side Environment Variables on the **existing Vercel project** (and in the local shell when running the migration):

| Variable | Required value |
|---|---|
| `DATABASE_URL` | PostgreSQL connection URI for the existing VIRAAS Supabase database. Use the Transaction Pooler URI on port `6543` for Vercel and include `sslmode=require`. |
| `SUPABASE_URL` | Existing Supabase project URL, such as `https://<project-ref>.supabase.co`. |
| `SUPABASE_ANON_KEY` | The matching Supabase anon/publishable API key; server-side Auth uses it for the real email/password endpoints. |
| `VIRAAS_SESSION_SECRET` | A cryptographically random value of at least 32 characters. Generate one with `openssl rand -base64 48`. |

Enable **Email** in the existing Supabase project's Authentication providers. Email/password is the implemented provider; no OAuth flow is simulated. The four variables above are the complete Connect credential set.

Never put these values in `VITE_*`, client code, or Git. In Vercel, set them under **Project Settings → Environment Variables** for the Production environment. Set local values in a trusted shell, not in committed files.

## Apply the persistent schema

From the repository root, with `DATABASE_URL` configured:

```sh
npm run db:migrate
```

This applies the ordered SQL migrations in `server/db/migrations/`, including `003_tryon_credits_payu.sql` for persistent credit balances, generation reservations, a ledger, and PayU orders. Run it once for the intended database before deploying. Applying the migration command again is safe. Vercel build and API requests do not run database migrations automatically.

The user row stores a database UUID (`user_id`), a unique stable public VIRAAS ID, display name, calculated age, gender, state, city, locality, bio, profile-photo URL, visibility, and created/updated timestamps. The exact date of birth is validated by the server and discarded. Location fields do not include an exact address or GPS coordinates.

Requests, connection status, conversation metadata, messages, read state, blocks, and reports are stored in PostgreSQL. Private chat is authorized by participant identity and a currently accepted connection on every request.

## Try-On credits, Runware and PayU

The same database stores exactly two one-time signup credits per completed adult profile, atomic Try-On reservations and ledger entries, and PayU orders. For persistent free credits and real Try-On, first configure the database/auth/session values above, apply the migrations, and set the Runware variables from `server/.env.example`:

- `TRYON_MODE=runware-flux`, `RUNWARE_API_KEY`, `RUNWARE_FLUX_MODEL=bfl:flux@vto`, and `RUNWARE_ZDR=true` only after Runware has enabled and the owner has verified organization-level Zero-Data Retention.

PayU is optional for launch and does not gate free credits or real Runware generation. Until the existing merchant's production checkout callback is configured, the ₹20 top-up remains unavailable and the app must not create or imply a payment. Before enabling live purchases, set:

- `PAYU_ENV=production`, `PAYU_MERCHANT_KEY`, and `PAYU_MERCHANT_SALT` for the existing merchant's PayU Hosted Checkout.
- `PUBLIC_BASE_URL=https://viraas-in.vercel.app` if Vercel's production URL environment value is not available. PayU must be able to POST its signed success/failure response to `/api/payment/payu/callback`.

The price is fixed server-side at ₹20 for exactly one additional credit. The app grants that credit only after checking PayU's reverse response hash and reconciling `verify_payment` server-to-server. No browser flag or redirect query parameter is proof of payment. If PostgreSQL, Runware, or verified ZDR is unavailable, free credits or generation fail closed; missing PayU credentials only disable top-ups.

## Validation without real services

```sh
npm run typecheck
npm run test-connect
npm run build
```

`test-connect` uses `pg-mem` only as a test database and mocks Supabase Auth responses; it does not call a real Supabase project. After configuring the production values and running migrations, verify the deployed `/api/auth/status` and `/api/social/status` routes in an access-permitted browser. A successful local build is not production verification. If Vercel Deployment Protection redirects anonymous requests to its login page, report the route check as blocked rather than claiming it passed.
