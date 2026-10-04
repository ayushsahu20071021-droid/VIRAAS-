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

This applies the ordered SQL migrations in `server/db/migrations/`. Run it once for the intended database before deploying. Applying the migration command again is safe. Vercel build and API requests do not run database migrations automatically.

The user row stores a database UUID (`user_id`), a unique stable public VIRAAS ID, display name, calculated age, gender, state, city, locality, bio, profile-photo URL, visibility, and created/updated timestamps. The exact date of birth is validated by the server and discarded. Location fields do not include an exact address or GPS coordinates.

Requests, connection status, conversation metadata, messages, read state, blocks, and reports are stored in PostgreSQL. Private chat is authorized by participant identity and a currently accepted connection on every request.

## Validation without real services

```sh
npm run typecheck
npm run test-connect
npm run build
```

`test-connect` uses `pg-mem` only as a test database and mocks Supabase Auth responses; it does not call a real Supabase project. After configuring the production values and running migrations, verify the deployed `/api/auth/status` and `/api/social/status` routes in an access-permitted browser. A successful local build is not production verification. If Vercel Deployment Protection redirects anonymous requests to its login page, report the route check as blocked rather than claiming it passed.
