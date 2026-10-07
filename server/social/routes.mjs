// VIRAAS Connect routes backed only by PostgreSQL. Identity is supplied by the configured Supabase
// Auth provider in an encrypted, httpOnly session cookie; no request body can choose its user id.
import express from 'express';
import { authProviderStatus, getAuthIdentity } from '../auth/provider.mjs';
import { databaseStatus } from '../db/pool.mjs';
import * as repo from './repository.mjs';
import { uploadProfilePhoto } from './profilePhoto.mjs';
import { publicRequirements } from '../readiness/messages.mjs';

const router = express.Router();

function sendError(res, error) {
  const status = Number(error?.status) || 503;
  return res.status(status).json({ ok: false, message: error?.message || 'VIRAAS Connect is temporarily unavailable.' });
}

function route(handler) {
  return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
}

async function requireReady(_req, res, next) {
  try {
    const db = await databaseStatus();
    const auth = authProviderStatus();
    const readiness = await repo.socialReadiness(auth, db);
    if (!readiness.available) {
      return res.status(503).json({
        ok: false,
        code: 'VIRAAS_CONNECT_NOT_CONFIGURED',
        message: 'VIRAAS Connect is unavailable until persistent PostgreSQL storage and Supabase email sign-in are configured and migrated. No account or message was saved.',
        requirements: publicRequirements(readiness.requirements),
      });
    }
    return next();
  } catch (error) { return sendError(res, error); }
}

async function context(req, res, { profileRequired = true, ensureAccount = false } = {}) {
  try {
    const identity = await getAuthIdentity(req, res);
    let user = await repo.getUserByAuthSubject(identity.subject);
    if (!user && ensureAccount) user = (await repo.createAccount(identity.subject)).user;
    if (profileRequired && (!user || !user.profile_complete)) {
      res.status(409).json({ ok: false, code: 'PROFILE_REQUIRED', message: 'Complete adult VIRAAS Connect onboarding first.' });
      return null;
    }
    if (!user) {
      res.status(409).json({ ok: false, code: 'ACCOUNT_REQUIRED', message: 'A persistent VIRAAS account is required.' });
      return null;
    }
    return { identity, user };
  } catch (error) {
    sendError(res, error);
    return null;
  }
}

router.get('/status', route(async (_req, res) => {
  res.set('Cache-Control', 'no-store');
  const db = await databaseStatus();
  const auth = authProviderStatus();
  const state = await repo.socialReadiness(auth, db);
  res.json({
    ok: true,
    ...state,
    mode: state.available ? 'postgres' : 'unavailable',
    requirements: publicRequirements(state.requirements),
  });
}));

router.get('/report/categories', (_req, res) => res.json({ ok: true, categories: repo.reportCategories() }));
router.use(requireReady);

// Authenticated profile-photo upload. The server validates MIME type and size, generates a
// server-controlled storage path, performs the Supabase Storage upload with the signed-in
// user's own token, and returns only the resulting public URL. No storage secret reaches the browser.
router.post('/profile/photo', route(async (req, res) => {
  const identity = await getAuthIdentity(req, res);
  const photo = await uploadProfilePhoto(identity, req.body || {});
  res.status(201).json({ ok: true, ...photo });
}));

// The email/password account exists at the auth provider first. This creates the VIRAAS profile,
// generates one stable globally unique public ID, and grants the two signup credits exactly once.
router.post('/session', route(async (req, res) => {
  const ctx = await context(req, res, { profileRequired: false, ensureAccount: true });
  if (!ctx) return;
  const me = await repo.createProfile(ctx.identity.subject, req.body || {});
  res.status(201).json({ ok: true, me });
}));

router.get('/me', route(async (req, res) => {
  try {
    const identity = await getAuthIdentity(req, res, { optional: true });
    if (!identity) return res.json({ ok: true, authenticated: false, me: null });
    const me = await repo.getProfileByAuthSubject(identity.subject);
    return res.json({ ok: true, authenticated: true, email: identity.email || null, me });
  } catch (error) { return sendError(res, error); }
}));

router.patch('/me', route(async (req, res) => {
  const ctx = await context(req, res);
  if (!ctx) return;
  const me = await repo.updateProfile(ctx.identity.subject, req.body || {});
  res.json({ ok: true, me });
}));

router.get('/users', route(async (req, res) => {
  const ctx = await context(req, res);
  if (!ctx) return;
  const users = await repo.searchUsers(ctx.user.user_id, req.query.q || '');
  res.json({ ok: true, users });
}));

router.get('/users/:viraasId', route(async (req, res) => {
  const ctx = await context(req, res);
  if (!ctx) return;
  const profile = await repo.getPublicProfile(ctx.user.user_id, req.params.viraasId);
  res.json({ ok: true, profile });
}));

router.post('/connect/:viraasId', route(async (req, res) => {
  const ctx = await context(req, res);
  if (!ctx) return;
  const result = await repo.sendRequest(ctx.user.user_id, req.params.viraasId);
  res.json({ ok: true, ...result });
}));

router.get('/requests', route(async (req, res) => {
  const ctx = await context(req, res);
  if (!ctx) return;
  res.json({ ok: true, ...(await repo.listRequests(ctx.user.user_id)) });
}));

router.post('/requests/:id/accept', route(async (req, res) => {
  const ctx = await context(req, res);
  if (!ctx) return;
  res.json({ ok: true, ...(await repo.acceptRequest(ctx.user.user_id, req.params.id)) });
}));

router.post('/requests/:id/decline', route(async (req, res) => {
  const ctx = await context(req, res);
  if (!ctx) return;
  res.json(await repo.declineRequest(ctx.user.user_id, req.params.id));
}));

router.get('/connections', route(async (req, res) => {
  const ctx = await context(req, res);
  if (!ctx) return;
  res.json({ ok: true, connections: await repo.listConnections(ctx.user.user_id) });
}));

router.delete('/connections/:id', route(async (req, res) => {
  const ctx = await context(req, res);
  if (!ctx) return;
  res.json(await repo.disconnect(ctx.user.user_id, req.params.id));
}));

router.get('/conversations', route(async (req, res) => {
  const ctx = await context(req, res);
  if (!ctx) return;
  res.json({ ok: true, conversations: await repo.listConversations(ctx.user.user_id) });
}));

router.get('/conversations/with/:viraasId', route(async (req, res) => {
  const ctx = await context(req, res);
  if (!ctx) return;
  res.json({ ok: true, ...(await repo.conversationWith(ctx.user.user_id, req.params.viraasId)) });
}));

router.get('/conversations/:id/messages', route(async (req, res) => {
  const ctx = await context(req, res);
  if (!ctx) return;
  res.json({ ok: true, ...(await repo.getMessages(ctx.user.user_id, req.params.id)) });
}));

router.post('/conversations/:id/messages', route(async (req, res) => {
  const ctx = await context(req, res);
  if (!ctx) return;
  res.status(201).json({ ok: true, ...(await repo.sendMessage(ctx.user.user_id, req.params.id, req.body?.text)) });
}));

router.post('/conversations/:id/read', route(async (req, res) => {
  const ctx = await context(req, res);
  if (!ctx) return;
  res.json(await repo.markRead(ctx.user.user_id, req.params.id));
}));

router.post('/block/:viraasId', route(async (req, res) => {
  const ctx = await context(req, res);
  if (!ctx) return;
  res.json(await repo.blockUser(ctx.user.user_id, req.params.viraasId));
}));

router.delete('/block/:viraasId', route(async (req, res) => {
  const ctx = await context(req, res);
  if (!ctx) return;
  res.json(await repo.unblockUser(ctx.user.user_id, req.params.viraasId));
}));

router.post('/report/:viraasId', route(async (req, res) => {
  const ctx = await context(req, res);
  if (!ctx) return;
  res.json(await repo.createReport(ctx.user.user_id, req.params.viraasId, req.body?.category, req.body?.details));
}));

router.use((error, _req, res, _next) => sendError(res, error));

export default router;
