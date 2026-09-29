// VIRAAS Connect — social data store.
//
// ┌───────────────────────────────────────────────────────────────────────────────────────────┐
// │ HONESTY / NON-PRODUCTION NOTICE                                                              │
// │                                                                                             │
// │ This is an IN-MEMORY reference implementation of the VIRAAS Connect data model and business │
// │ rules. It exists so the API contracts and UI are real and testable end-to-end against a     │
// │ running Node server. It is NOT a production datastore:                                       │
// │   • State lives in process memory and is LOST on restart (and is not shared across the      │
// │     multiple stateless instances a serverless host like Vercel spins up).                   │
// │   • There is NO realtime transport — clients poll. Production needs WebSocket/SSE.           │
// │   • Sessions are demo-grade (a signed cookie). Production needs real authentication          │
// │     (verified email/phone, OAuth) and real, auditable age verification.                     │
// │                                                                                             │
// │ The schemas, authorization rules, and API surface here ARE the integration contract: swap   │
// │ the Map-backed helpers below for a real DB + realtime layer without changing routes/UI.     │
// └───────────────────────────────────────────────────────────────────────────────────────────┘
import crypto from 'node:crypto';

// A per-process secret used only to sign the demo session cookie. In production this MUST come from
// a stable secret manager (rotating this logs everyone out). Never sent to the browser in the clear.
const SESSION_SECRET = process.env.VIRAAS_SESSION_SECRET || crypto.randomBytes(32).toString('hex');

// ---- Collections (the data model of section 8E) -------------------------------------------------
/** @type {Map<string, any>} internal userId -> User */
const users = new Map();
/** @type {Map<string, string>} public viraasId (lowercased) -> internal userId */
const viraasIndex = new Map();
/** @type {Map<string, any>} requestId -> ConnectionRequest */
const requests = new Map();
/** @type {Map<string, any>} connectionId -> Connection */
const connections = new Map();
/** @type {Map<string, any>} conversationId -> Conversation */
const conversations = new Map();
/** @type {Map<string, any[]>} conversationId -> Message[] */
const messages = new Map();
/** @type {Map<string, any>} blockId -> Block */
const blocks = new Map();
/** @type {Map<string, any>} reportId -> Report */
const reports = new Map();

const id = (prefix) => `${prefix}_${crypto.randomBytes(9).toString('base64url')}`;
const now = () => new Date().toISOString();

// ---- Session (demo-grade) ----------------------------------------------------------------------
export function signSession(userId) {
  const mac = crypto.createHmac('sha256', SESSION_SECRET).update(userId).digest('base64url');
  return `${userId}.${mac}`;
}
export function verifySession(token) {
  if (typeof token !== 'string' || !token.includes('.')) return null;
  const idx = token.lastIndexOf('.');
  const userId = token.slice(0, idx);
  const mac = token.slice(idx + 1);
  const expected = crypto.createHmac('sha256', SESSION_SECRET).update(userId).digest('base64url');
  // Constant-time compare.
  if (mac.length !== expected.length) return null;
  if (!crypto.timingSafeEqual(Buffer.from(mac), Buffer.from(expected))) return null;
  return users.has(userId) ? userId : null;
}

// ---- Serializers: never leak private fields (dob, email, session) to other users ----------------
export function publicProfile(user, viewerId = null) {
  if (!user) return null;
  const isSelf = viewerId === user.id;
  return {
    viraasId: user.viraasId,
    displayName: user.displayName,
    bio: user.bio || '',
    city: user.city || '',
    avatarSeed: user.avatarSeed,
    instagramHandle: user.instagramHandle || '', // optional, owner-provided public handle only
    createdAt: user.createdAt,
    // 18+ status is a public boolean; the DOB itself is NEVER exposed.
    is18Plus: user.is18Plus === true,
    ...(isSelf ? { self: true } : {}),
  };
}

// ---- Users -------------------------------------------------------------------------------------
const HANDLE_RE = /^[a-z0-9](?:[a-z0-9_.]{2,22}[a-z0-9])$/;

export function createUser({ viraasId, displayName, bio, city, instagramHandle, is18Plus }) {
  const handle = String(viraasId || '').trim().toLowerCase();
  if (!HANDLE_RE.test(handle)) return { error: 400, message: 'Choose a VIRAAS ID: 4–24 letters, numbers, dot or underscore.' };
  if (viraasIndex.has(handle)) return { error: 409, message: 'That VIRAAS ID is already taken.' };
  // 18+ gate is enforced HERE, server-side — a profile cannot exist without it.
  if (is18Plus !== true) return { error: 403, message: 'VIRAAS Connect is for adults 18 and over.' };
  const uid = id('usr');
  const user = {
    id: uid,
    viraasId: handle,
    displayName: String(displayName || '').trim().slice(0, 40) || handle,
    bio: String(bio || '').trim().slice(0, 240),
    city: String(city || '').trim().slice(0, 40),
    instagramHandle: String(instagramHandle || '').trim().replace(/^@/, '').slice(0, 40),
    avatarSeed: crypto.randomBytes(4).toString('hex'),
    is18Plus: true,
    createdAt: now(),
  };
  users.set(uid, user);
  viraasIndex.set(handle, uid);
  return { user };
}

export function getUser(userId) { return users.get(userId) || null; }
export function getUserByViraasId(viraasId) {
  const uid = viraasIndex.get(String(viraasId || '').trim().toLowerCase());
  return uid ? users.get(uid) : null;
}
export function updateUser(userId, patch) {
  const u = users.get(userId);
  if (!u) return null;
  if (patch.displayName !== undefined) u.displayName = String(patch.displayName).trim().slice(0, 40) || u.displayName;
  if (patch.bio !== undefined) u.bio = String(patch.bio).trim().slice(0, 240);
  if (patch.city !== undefined) u.city = String(patch.city).trim().slice(0, 40);
  if (patch.instagramHandle !== undefined) u.instagramHandle = String(patch.instagramHandle).trim().replace(/^@/, '').slice(0, 40);
  return u;
}

export function searchUsers(viewerId, q = '') {
  const term = String(q || '').trim().toLowerCase();
  const out = [];
  for (const u of users.values()) {
    if (u.id === viewerId) continue;
    if (isBlockedEither(viewerId, u.id)) continue; // never surface blocked/blocking users
    if (term && !u.viraasId.includes(term) && !u.displayName.toLowerCase().includes(term)) continue;
    out.push({ ...publicProfile(u, viewerId), relation: relationTo(viewerId, u.id) });
  }
  out.sort((a, b) => a.viraasId.localeCompare(b.viraasId));
  return out.slice(0, 60);
}

// ---- Blocks ------------------------------------------------------------------------------------
export function isBlockedEither(a, b) {
  for (const bl of blocks.values()) {
    if ((bl.blockerId === a && bl.blockedId === b) || (bl.blockerId === b && bl.blockedId === a)) return true;
  }
  return false;
}
function findBlock(blockerId, blockedId) {
  for (const bl of blocks.values()) if (bl.blockerId === blockerId && bl.blockedId === blockedId) return bl;
  return null;
}
export function blockUser(blockerId, blockedViraasId) {
  const target = getUserByViraasId(blockedViraasId);
  if (!target) return { error: 404, message: 'User not found.' };
  if (target.id === blockerId) return { error: 400, message: 'You cannot block yourself.' };
  if (!findBlock(blockerId, target.id)) {
    const b = { id: id('blk'), blockerId, blockedId: target.id, createdAt: now() };
    blocks.set(b.id, b);
  }
  // Blocking severs any active connection and pending requests between the two.
  for (const [cid, c] of connections) if (pair(c.userA, c.userB, blockerId, target.id)) connections.delete(cid);
  for (const [rid, r] of requests) if (pair(r.fromUserId, r.toUserId, blockerId, target.id) && r.status === 'pending') { r.status = 'declined'; r.respondedAt = now(); }
  return { ok: true };
}
export function unblockUser(blockerId, blockedViraasId) {
  const target = getUserByViraasId(blockedViraasId);
  if (!target) return { error: 404, message: 'User not found.' };
  const b = findBlock(blockerId, target.id);
  if (b) blocks.delete(b.id);
  return { ok: true };
}

// ---- Relationship helpers ----------------------------------------------------------------------
function pair(a, b, x, y) { return (a === x && b === y) || (a === y && b === x); }

export function findConnection(a, b) {
  for (const c of connections.values()) if (pair(c.userA, c.userB, a, b)) return c;
  return null;
}
function pendingRequestBetween(a, b) {
  for (const r of requests.values()) if (r.status === 'pending' && pair(r.fromUserId, r.toUserId, a, b)) return r;
  return null;
}
/** The relationship state VIEWER has toward OTHER — drives the Connect button. */
export function relationTo(viewerId, otherId) {
  if (viewerId === otherId) return 'self';
  if (findBlock(viewerId, otherId)) return 'blocked';           // viewer blocked them
  if (findBlock(otherId, viewerId)) return 'unavailable';        // they blocked viewer (do not reveal specifics)
  if (findConnection(viewerId, otherId)) return 'connected';
  const req = pendingRequestBetween(viewerId, otherId);
  if (req) return req.fromUserId === viewerId ? 'request_sent' : 'request_received';
  return 'none';
}

// ---- Connection requests -----------------------------------------------------------------------
export function sendRequest(fromUserId, toViraasId) {
  const to = getUserByViraasId(toViraasId);
  if (!to) return { error: 404, message: 'User not found.' };
  if (to.id === fromUserId) return { error: 400, message: 'You cannot connect with yourself.' };
  if (isBlockedEither(fromUserId, to.id)) return { error: 403, message: 'You cannot connect with this user.' };
  if (findConnection(fromUserId, to.id)) return { error: 409, message: 'You are already connected.' };
  const existing = pendingRequestBetween(fromUserId, to.id);
  if (existing) {
    // If they already requested YOU, sending back auto-accepts (mutual intent).
    if (existing.fromUserId === to.id) return acceptRequest(fromUserId, existing.id);
    return { error: 409, message: 'Request already sent.' };
  }
  const r = { id: id('req'), fromUserId, toUserId: to.id, status: 'pending', createdAt: now(), respondedAt: null };
  requests.set(r.id, r);
  return { request: r, relation: 'request_sent' };
}
export function respondRequest(userId, requestId, accept) {
  const r = requests.get(requestId);
  if (!r) return { error: 404, message: 'Request not found.' };
  if (r.toUserId !== userId) return { error: 403, message: 'Only the recipient can respond to this request.' };
  if (r.status !== 'pending') return { error: 409, message: 'This request was already handled.' };
  r.status = accept ? 'accepted' : 'declined';
  r.respondedAt = now();
  if (!accept) return { ok: true, relation: 'none' };
  return acceptRequest(userId, requestId, r);
}
function acceptRequest(userId, requestId, known) {
  const r = known || requests.get(requestId);
  if (r && r.status === 'pending') { r.status = 'accepted'; r.respondedAt = now(); }
  const other = r.fromUserId === userId ? r.toUserId : r.fromUserId;
  let c = findConnection(userId, other);
  if (!c) { c = { id: id('con'), userA: userId, userB: other, createdAt: now() }; connections.set(c.id, c); }
  ensureConversation(userId, other); // a private conversation becomes available ONLY now
  return { ok: true, connection: c, relation: 'connected' };
}
export function incomingRequests(userId) {
  const out = [];
  for (const r of requests.values()) {
    if (r.status !== 'pending' || r.toUserId !== userId) continue;
    if (isBlockedEither(userId, r.fromUserId)) continue;
    out.push({ id: r.id, from: publicProfile(getUser(r.fromUserId), userId), createdAt: r.createdAt });
  }
  return out.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
export function outgoingRequests(userId) {
  const out = [];
  for (const r of requests.values()) {
    if (r.status !== 'pending' || r.fromUserId !== userId) continue;
    out.push({ id: r.id, to: publicProfile(getUser(r.toUserId), userId), createdAt: r.createdAt });
  }
  return out.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
export function listConnections(userId) {
  const out = [];
  for (const c of connections.values()) {
    if (c.userA !== userId && c.userB !== userId) continue;
    const other = c.userA === userId ? c.userB : c.userA;
    if (isBlockedEither(userId, other)) continue;
    out.push({ connectionId: c.id, user: publicProfile(getUser(other), userId), since: c.createdAt });
  }
  return out.sort((a, b) => b.since.localeCompare(a.since));
}
export function disconnect(userId, connectionId) {
  const c = connections.get(connectionId);
  if (!c) return { error: 404, message: 'Connection not found.' };
  if (c.userA !== userId && c.userB !== userId) return { error: 403, message: 'Not your connection.' };
  connections.delete(connectionId);
  return { ok: true };
}

// ---- Conversations & messages ------------------------------------------------------------------
function ensureConversation(a, b) {
  for (const c of conversations.values()) if (pair(c.participants[0], c.participants[1], a, b)) return c;
  const c = { id: id('cnv'), participants: [a, b], createdAt: now(), lastMessageAt: null };
  conversations.set(c.id, c);
  messages.set(c.id, []);
  return c;
}
function conversationFor(userId, otherId) {
  for (const c of conversations.values()) if (pair(c.participants[0], c.participants[1], userId, otherId)) return c;
  return null;
}
function assertParticipant(userId, conversationId) {
  const c = conversations.get(conversationId);
  if (!c) return { error: 404, message: 'Conversation not found.' };
  // AUTHORIZATION: only a participant may ever read/write. Changing the id in the URL to someone
  // else's conversation returns 403/404 — never another user's data.
  if (!c.participants.includes(userId)) return { error: 404, message: 'Conversation not found.' };
  const other = c.participants[0] === userId ? c.participants[1] : c.participants[0];
  // Chat stays LOCKED unless a live mutual connection exists and neither party is blocked.
  if (isBlockedEither(userId, other)) return { error: 403, message: 'Messaging is unavailable with this user.' };
  if (!findConnection(userId, other)) return { error: 403, message: 'You can only message connected users.' };
  return { conversation: c, other };
}
export function listConversations(userId) {
  const out = [];
  for (const c of conversations.values()) {
    if (!c.participants.includes(userId)) continue;
    const other = c.participants[0] === userId ? c.participants[1] : c.participants[0];
    if (isBlockedEither(userId, other) || !findConnection(userId, other)) continue;
    const msgs = messages.get(c.id) || [];
    const last = msgs[msgs.length - 1] || null;
    const unread = msgs.filter((m) => m.senderId !== userId && !m.readBy.includes(userId)).length;
    out.push({
      conversationId: c.id,
      user: publicProfile(getUser(other), userId),
      lastMessage: last ? { text: last.text, senderId: last.senderId === userId ? 'me' : 'them', createdAt: last.createdAt } : null,
      lastMessageAt: c.lastMessageAt,
      unread,
    });
  }
  return out.sort((a, b) => (b.lastMessageAt || '').localeCompare(a.lastMessageAt || ''));
}
export function getMessages(userId, conversationId) {
  const chk = assertParticipant(userId, conversationId);
  if (chk.error) return chk;
  const msgs = (messages.get(conversationId) || []).map((m) => ({
    id: m.id,
    text: m.text,
    mine: m.senderId === userId,
    createdAt: m.createdAt,
    read: m.readBy.includes(chk.other), // "read" from the sender's perspective = other has read it
  }));
  return { conversation: { id: conversationId, user: publicProfile(getUser(chk.other), userId) }, messages: msgs };
}
export function sendMessage(userId, conversationId, text) {
  const chk = assertParticipant(userId, conversationId);
  if (chk.error) return chk;
  const body = String(text || '').trim();
  if (!body) return { error: 400, message: 'Message cannot be empty.' };
  if (body.length > 2000) return { error: 400, message: 'Message is too long.' };
  const m = { id: id('msg'), conversationId, senderId: userId, text: body, createdAt: now(), deliveredTo: [chk.other], readBy: [userId] };
  const arr = messages.get(conversationId) || [];
  arr.push(m);
  messages.set(conversationId, arr);
  chk.conversation.lastMessageAt = m.createdAt;
  return { message: { id: m.id, text: m.text, mine: true, createdAt: m.createdAt, read: false } };
}
export function markRead(userId, conversationId) {
  const chk = assertParticipant(userId, conversationId);
  if (chk.error) return chk;
  let n = 0;
  for (const m of messages.get(conversationId) || []) {
    if (m.senderId !== userId && !m.readBy.includes(userId)) { m.readBy.push(userId); n++; }
  }
  return { ok: true, marked: n };
}
export function getConversationWith(userId, otherViraasId) {
  const other = getUserByViraasId(otherViraasId);
  if (!other) return { error: 404, message: 'User not found.' };
  const c = conversationFor(userId, other.id);
  if (!c || !findConnection(userId, other.id)) return { error: 403, message: 'You can only message connected users.' };
  return { conversationId: c.id };
}

// ---- Reports (safety) --------------------------------------------------------------------------
export const REPORT_CATEGORIES = ['harassment', 'spam', 'impersonation', 'inappropriate', 'underage', 'other'];
export function reportUser(reporterId, reportedViraasId, category, details) {
  const reported = getUserByViraasId(reportedViraasId);
  if (!reported) return { error: 404, message: 'User not found.' };
  if (reported.id === reporterId) return { error: 400, message: 'You cannot report yourself.' };
  if (!REPORT_CATEGORIES.includes(category)) return { error: 400, message: 'Choose a report reason.' };
  const r = {
    id: id('rpt'),
    reporterId, // stored for moderation ONLY — never returned to the reported user or anyone else
    reportedId: reported.id,
    category,
    details: String(details || '').trim().slice(0, 1000),
    createdAt: now(),
    status: 'received',
  };
  reports.set(r.id, r);
  // The reporter's identity is intentionally NOT echoed back.
  return { ok: true, reportId: r.id };
}

// Diagnostics for the audit (counts only, no PII).
export function stats() {
  return {
    users: users.size, requests: requests.size, connections: connections.size,
    conversations: conversations.size, blocks: blocks.size, reports: reports.size,
  };
}
