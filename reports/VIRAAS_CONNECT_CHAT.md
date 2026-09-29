# VIRAAS Connect + Private Chat (Task #7, Phase 8)

**What this is:** the human-to-human social layer — **VIRAAS ID → public profile → connect request → mutual acceptance → private 1-to-1 chat.** It is **not** an AI assistant, not a fashion recommendation bot, not a group chat, and Instagram is **not** the chat backend (only an optional public handle on a profile).

## Delivered (real, testable end-to-end against the Node server)

### Data model (§8E) — `server/social/store.mjs`
`User` · `ConnectionRequest` · `Connection` · `Conversation` · `Message` · `Block` · `Report`.

### API (§8A–8G) — `server/social/routes.mjs`, mounted at `/api/social`
- **Session / profile:** `POST /session` (create VIRAAS ID), `GET /me`, `PATCH /me`, `POST /logout`.
- **Discovery / profiles:** `GET /users?q=`, `GET /users/:viraasId`.
- **Connect flow:** `POST /connect/:viraasId`, `GET /requests`, `POST /requests/:id/accept|decline`, `GET /connections`, `DELETE /connections/:id`.
- **Chat (locked until mutual):** `GET /conversations`, `GET /conversations/with/:viraasId`, `GET /conversations/:id/messages`, `POST /conversations/:id/messages`, `POST /conversations/:id/read`.
- **Safety:** `POST /block/:viraasId`, `DELETE /block/:viraasId`, `GET /report/categories`, `POST /report/:viraasId`.

### Client (§8H) — premium, mobile-first
`src/lib/social.ts` (typed API client), `src/components/social.tsx` (avatar, connect-button state machine, report dialog, `useMe`), `src/pages/Connect.tsx` (onboarding + Discover/Requests/Connections + public profile), `src/pages/Chat.tsx` (chat list + thread). Routes added in `src/main.tsx` (`/connect`, `/connect/u/:viraasId`, `/chat`, `/chat/:conversationId`); nav entry "Connect" added in `src/components/Layout.tsx`. No existing page changed behaviour.

## Security & safety properties (verified by API smoke test)
- **18+ gate is server-side (§8B):** a profile cannot be created without `is18Plus === true`; an underage attempt returns `403`. DOB itself is never collected/exposed.
- **Chat locked until mutual (§8C):** `conversations/with` and message read/write return `403` unless a live `Connection` exists. No one-sided DM.
- **Authorization (§8F):** conversation access requires being a participant; a **stranger changing the conversation id in the URL gets `404`** (verified). No cross-user data exposure.
- **Privacy:** public profile serializer exposes only handle/name/bio/city/avatar/18+ boolean/optional IG handle — **never** DOB, email, or private conversations.
- **Block severs** connection + pending requests and hides users from search both directions.
- **Report is confidential (§8G):** reporter identity is stored for moderation only and never echoed to the reported user; categories: harassment, spam, impersonation, inappropriate, underage, other.

## HONEST production gaps (§8I) — required backend NOT present in this environment
This is a working **reference implementation and integration contract**, not a production deployment. To go live, the following must be provided (the schemas/routes/UI are designed to accept them with no UI change):

1. **Persistent database.** State currently lives in **process memory** (`Map`s) and is **lost on restart**; on a serverless host (Vercel) it is **not shared across instances**. Swap the Map-backed helpers in `store.mjs` for a real DB (Postgres/Mongo/Firestore). *No realtime/persistent claim is made.*
2. **Realtime transport.** New messages currently arrive via **client polling** (3s in a thread, 5s in the list) — this is **not realtime**. Production needs WebSocket or SSE.
3. **Real authentication.** Identity is a demo-grade **signed httpOnly session cookie** issued at profile creation. Production needs verified email/phone or OAuth, plus session revocation.
4. **Real age verification.** The 18+ gate is a server-enforced self-attestation. Legal-grade assurance needs a real age-verification step.
5. **Moderation tooling & storage** for the `Report` queue (currently in-memory), plus rate limiting/anti-abuse.

No fabricated messages, no fake "online" presence, no AI replies exist anywhere in this feature.

## How to run locally
`node server/index.mjs` (serves the built SPA + `/api/social` on `:8787`), or `vite` dev on `:5173` which proxies `/api` → `:8787`.
