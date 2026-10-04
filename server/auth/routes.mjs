import express from 'express';
import { databaseStatus } from '../db/pool.mjs';
import { createAccount } from '../social/repository.mjs';
import { publicRequirements } from '../readiness/messages.mjs';
import {
  AuthProviderError,
  authProviderStatus,
  clearSessionCookie,
  endProviderSession,
  getAuthIdentity,
  readSessionForLogout,
  signInWithEmail,
  signUpWithEmail,
  startSession,
} from './provider.mjs';

const router = express.Router();

function csrfCheck(req, res, next) {
  const origin = req.get('origin');
  if (!origin) return next();
  let originHost;
  try { originHost = new URL(origin).host.toLowerCase(); } catch { return res.status(403).json({ ok: false, message: 'Request origin was not accepted.' }); }
  const expected = String(req.get('x-forwarded-host') || req.get('host') || '').split(',')[0].trim().toLowerCase();
  if (expected && originHost !== expected) return res.status(403).json({ ok: false, message: 'Request origin was not accepted.' });
  return next();
}

async function ensureDatabase(res) {
  const state = await databaseStatus();
  if (!state.ready) {
    res.status(503).json({ ok: false, code: 'DATABASE_NOT_READY', message: 'VIRAAS account storage is unavailable until PostgreSQL is configured and the schema migration has been applied.', requirements: publicRequirements(state.missing) });
    return false;
  }
  return true;
}

function cleanEmail(value) {
  return typeof value === 'string' ? value.trim().toLowerCase().slice(0, 254) : '';
}

function cleanPassword(value) {
  return typeof value === 'string' ? value : '';
}

function fail(res, error) {
  const status = error instanceof AuthProviderError ? error.status : 503;
  return res.status(status).json({ ok: false, message: error?.message || 'Sign-in service is temporarily unavailable.' });
}

router.get('/status', (_req, res) => {
  res.set('Cache-Control', 'no-store');
  const status = authProviderStatus();
  res.json({ ok: true, configured: status.configured, provider: status.provider, methods: status.methods, requirements: publicRequirements(status.missing) });
});

router.get('/me', async (req, res) => {
  res.set('Cache-Control', 'no-store');
  try {
    const identity = await getAuthIdentity(req, res, { optional: true });
    res.json({ ok: true, authenticated: Boolean(identity), email: identity?.email || null });
  } catch (error) {
    if (error instanceof AuthProviderError && error.status === 503) {
      return res.json({ ok: true, authenticated: false, email: null, unavailable: true });
    }
    return fail(res, error);
  }
});

router.post('/signup', csrfCheck, async (req, res) => {
  const email = cleanEmail(req.body?.email);
  const password = cleanPassword(req.body?.password);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ ok: false, message: 'Enter a valid email address.' });
  if (password.length < 12 || password.length > 128) return res.status(400).json({ ok: false, message: 'Use a password between 12 and 128 characters.' });
  if (!await ensureDatabase(res)) return;
  try {
    const result = await signUpWithEmail(email, password);
    if (result.user?.id) await createAccount(String(result.user.id));
    if (result.session) await startSession(req, res, result.session);
    res.status(result.session ? 201 : 202).json({
      ok: true,
      authenticated: Boolean(result.session),
      confirmationRequired: result.confirmationRequired,
      message: result.confirmationRequired ? 'Check your email to confirm your VIRAAS account, then sign in to continue.' : 'Account created. Adults can now complete VIRAAS Connect onboarding to create a stable VIRAAS ID.'
    });
  } catch (error) { return fail(res, error); }
});

router.post('/login', csrfCheck, async (req, res) => {
  const email = cleanEmail(req.body?.email);
  const password = cleanPassword(req.body?.password);
  if (!email || !password) return res.status(400).json({ ok: false, message: 'Enter your email and password.' });
  if (!await ensureDatabase(res)) return;
  try {
    const { user, session } = await signInWithEmail(email, password);
    await createAccount(String(user.id));
    await startSession(req, res, session);
    res.json({ ok: true, authenticated: true, message: 'Signed in.' });
  } catch (error) { return fail(res, error); }
});

router.post('/logout', csrfCheck, async (req, res) => {
  const session = readSessionForLogout(req);
  await endProviderSession(session);
  clearSessionCookie(res, req);
  res.json({ ok: true, authenticated: false });
});

export default router;
