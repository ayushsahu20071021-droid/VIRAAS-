# VIRAAS Connect and private chat

VIRAAS Connect is the human-to-human social feature: adult profile → stable VIRAAS ID → discovery → request → recipient acceptance → private 1:1 chat. It is not an AI assistant, group chat, or recommendation bot.

## Persistent implementation

- `server/social/repository.mjs` is the PostgreSQL repository. Accounts, profile fields, requests, connection state, conversations, messages, read markers, blocks, reports, and stable IDs are stored in database tables; there is no Map-backed Connect store or demo-account path.
- `server/db/migrations/001_core.sql` creates the schema; `002_incomplete_accounts.sql` upgrades an already-created database so a real auth account can exist before adult profile completion. `npm run db:migrate` applies ordered migrations.
- `server/auth/provider.mjs` integrates real Supabase Email/Password sessions. The provider issues/refreshes sessions; the server stores them only in an encrypted, `HttpOnly`, `SameSite=Lax` cookie (`Secure` in production). Provider bearer tokens are not returned to the browser or stored in browser storage.
- `server/social/routes.mjs` derives identity from that server-verified session and authorizes every request server-side. No request body can select a user ID.

## Adult onboarding and VIRAAS ID

Onboarding collects display name, date of birth, explicit 18+ confirmation, gender, state, city, locality, bio, optional HTTPS profile-photo URL, and visibility. The server recalculates age using India-local calendar date; it rejects an unconfirmed or under-18 submission and discards the submitted date of birth. The profile stores only calculated age. Database constraints require a completed profile to have a unique VIRAAS ID and adult profile fields. IDs are generated once, persist across sign-in/reload, and are not user-editable.

The location fields and public serializer contain only locality, city, and state. Street/unit/house/PIN/address terms and coordinate-shaped locality values are rejected. No street address, PIN or GPS column is part of the schema.

## Discovery and safety

- Male profiles discover eligible adult female profiles; female profiles discover eligible adult male profiles. Other gender identities see profiles of a different gender.
- Results are ranked locality → city → state → other locations. Search accepts a VIRAAS ID, with or without `@`.
- Hidden profiles are excluded. Connections-only profiles are visible only to accepted connections. Blocks remove both users from each other’s discovery and deny requests/profile/thread access.
- Connect requests persist as `PENDING`, then the recipient may accept (`CONNECTED`) or decline (`DECLINED`). Only the recipient can accept or decline.
- Reports are written to the persistent reports table; report categories and moderation notes are not exposed to the reported user.

## Private chat

A conversation exists only for a pair whose request was accepted. Each message read/write checks that the authenticated account is a conversation participant, that the connection remains active, and that neither participant has blocked the other. A stranger changing the conversation ID in a URL does not grant access. Message history, ordering, unread counts, and read markers are stored in PostgreSQL. The UI polls for updates; delivery is not advertised as socket-realtime. No AI response is mixed into Connect conversations.

## Setup and verification

Exact Connect-only environment variables, migration instructions, and provider setup are in [`docs/connect-production-setup.md`](../docs/connect-production-setup.md): `DATABASE_URL`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `VIRAAS_SESSION_SECRET`.

Run `npm run test-connect` for the zero-spend Connect integration suite. It uses `pg-mem` and mocked Supabase Auth; it is not a production database/provider test. `npm run typecheck` and `npm run build` validate the client build. A real deployment must still be checked with configured production credentials and Vercel access. Deployment Protection redirects are not evidence that a protected API route passed.

## Current limitations

- Auth is real Supabase Email/Password only; OAuth providers and legal-grade identity/age verification are not implemented.
- Chat updates are polled rather than delivered over a realtime socket.
- Production database and Supabase credentials are environment-specific and are not included in this repository.
