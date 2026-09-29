// VIRAAS Connect — HTTP API (Express router mounted at /api/social).
//
// Every route enforces authorization SERVER-SIDE (section 8F): identity comes from a signed session
// cookie, never from a client-supplied user id. Private chat is LOCKED until a mutual connection
// exists (section 8C). The 18+ gate is enforced at profile creation (section 8B). See store.mjs for
// the non-production notice — this is a real, testable API contract backed by an in-memory store.
import express from 'express';
import * as store from './store.mjs';

const COOKIE = 'viraas_sid';

function parseCookies(req) {
  const out = {};
  const raw = req.headers.cookie;
  if (!raw) return out;
  for (const part of raw.split(';')) {
    const i = part.indexOf('=');
    if (i === -1) continue;
    out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim());
  }
  return out;
}
function setSessionCookie(res, token) {
  // httpOnly so client JS can never read it; SameSite=Lax; Path=/. (Secure is added by the proxy/CDN
  // in production over HTTPS.) 30-day demo session.
  res.append('Set-Cookie', `${COOKIE}=${encodeURIComponent(token)}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${60 * 60 * 24 * 30}`);
}
function clearSessionCookie(res) {
  res.append('Set-Cookie', `${COOKIE}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0`);
}
function currentUserId(req) {
  return store.verifySession(parseCookies(req)[COOKIE]);
}
// Auth guard: 401 if no valid session.
function requireAuth(req, res, next) {
  const uid = currentUserId(req);
  if (!uid) return res.status(401).json({ ok: false, message: 'Sign in to VIRAAS Connect first.' });
  req.userId = uid;
  next();
}
// Turn a store result ({error, message} | data) into an HTTP response.
function send(res, result, okStatus = 200) {
  if (result && result.error) return res.status(result.error).json({ ok: false, message: result.message });
  return res.status(okStatus).json({ ok: true, ...result });
}

const router = express.Router();

// ---- Session / profile -------------------------------------------------------------------------
// Create a VIRAAS ID (onboarding). Requires an explicit 18+ acknowledgement (enforced in the store).
router.post('/session', (req, res) => {
  const { viraasId, displayName, bio, city, instagramHandle, is18Plus, visibility } = req.body || {};
  const out = store.createUser({ viraasId, displayName, bio, city, instagramHandle, is18Plus, visibility });
  if (out.error) return res.status(out.error).json({ ok: false, message: out.message });
  setSessionCookie(res, store.signSession(out.user.id));
  res.json({ ok: true, me: store.publicProfile(out.user, out.user.id) });
});
// Who am I (used by the app to decide onboarding vs. app shell).
router.get('/me', (req, res) => {
  const uid = currentUserId(req);
  if (!uid) return res.json({ ok: true, me: null });
  res.json({ ok: true, me: store.publicProfile(store.getUser(uid), uid) });
});
router.post('/logout', (req, res) => { clearSessionCookie(res); res.json({ ok: true }); });
router.patch('/me', requireAuth, (req, res) => {
  const u = store.updateUser(req.userId, req.body || {});
  res.json({ ok: true, me: store.publicProfile(u, req.userId) });
});

// ---- Discovery / profiles ----------------------------------------------------------------------
router.get('/users', requireAuth, (req, res) => {
  res.json({ ok: true, users: store.searchUsers(req.userId, req.query.q || '') });
});
router.get('/users/:viraasId', requireAuth, (req, res) => {
  const u = store.getUserByViraasId(req.params.viraasId);
  if (!u) return res.status(404).json({ ok: false, message: 'User not found.' });
  // Never reveal that someone blocked the viewer beyond a generic "unavailable" relation.
  res.json({ ok: true, profile: { ...store.publicProfile(u, req.userId), relation: store.relationTo(req.userId, u.id) } });
});

// ---- Connect flow ------------------------------------------------------------------------------
router.post('/connect/:viraasId', requireAuth, (req, res) => send(res, store.sendRequest(req.userId, req.params.viraasId)));
router.get('/requests', requireAuth, (req, res) =>
  res.json({ ok: true, incoming: store.incomingRequests(req.userId), outgoing: store.outgoingRequests(req.userId) }));
router.post('/requests/:id/accept', requireAuth, (req, res) => send(res, store.respondRequest(req.userId, req.params.id, true)));
router.post('/requests/:id/decline', requireAuth, (req, res) => send(res, store.respondRequest(req.userId, req.params.id, false)));
router.get('/connections', requireAuth, (req, res) => res.json({ ok: true, connections: store.listConnections(req.userId) }));
router.delete('/connections/:id', requireAuth, (req, res) => send(res, store.disconnect(req.userId, req.params.id)));

// ---- Conversations & messages (locked until mutual connection) ----------------------------------
router.get('/conversations', requireAuth, (req, res) => res.json({ ok: true, conversations: store.listConversations(req.userId) }));
router.get('/conversations/with/:viraasId', requireAuth, (req, res) => send(res, store.getConversationWith(req.userId, req.params.viraasId)));
router.get('/conversations/:id/messages', requireAuth, (req, res) => send(res, store.getMessages(req.userId, req.params.id)));
router.post('/conversations/:id/messages', requireAuth, (req, res) => send(res, store.sendMessage(req.userId, req.params.id, (req.body || {}).text), 201));
router.post('/conversations/:id/read', requireAuth, (req, res) => send(res, store.markRead(req.userId, req.params.id)));

// ---- Safety: block / unblock / report ----------------------------------------------------------
router.post('/block/:viraasId', requireAuth, (req, res) => send(res, store.blockUser(req.userId, req.params.viraasId)));
router.delete('/block/:viraasId', requireAuth, (req, res) => send(res, store.unblockUser(req.userId, req.params.viraasId)));
router.get('/report/categories', (_req, res) => res.json({ ok: true, categories: store.REPORT_CATEGORIES }));
router.post('/report/:viraasId', requireAuth, (req, res) =>
  send(res, store.reportUser(req.userId, req.params.viraasId, (req.body || {}).category, (req.body || {}).details)));

// Non-PII stats for the audit.
router.get('/_stats', (_req, res) => res.json({ ok: true, stats: store.stats() }));

export default router;
