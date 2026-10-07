import crypto from 'node:crypto';

export const SESSION_COOKIE = 'viraas_session';
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30;
const MAX_REFRESH_SKEW_SECONDS = 60;
let cachedSecret;
let cachedKey;

export class AuthProviderError extends Error {
  constructor(message, status = 503) {
    super(message);
    this.name = 'AuthProviderError';
    this.status = status;
  }
}

export function authProviderStatus() {
  const missing = [];
  if (!process.env.SUPABASE_URL) missing.push('SUPABASE_URL');
  if (!process.env.SUPABASE_ANON_KEY) missing.push('SUPABASE_ANON_KEY');
  if (!process.env.VIRAAS_SESSION_SECRET || process.env.VIRAAS_SESSION_SECRET.length < 32) missing.push('VIRAAS_SESSION_SECRET (at least 32 characters)');
  return {
    configured: missing.length === 0,
    provider: 'supabase-email-password',
    methods: ['email', 'password'],
    missing,
  };
}

function getSessionKey() {
  const secret = process.env.VIRAAS_SESSION_SECRET;
  if (!secret || secret.length < 32) throw new AuthProviderError('VIRAAS_SESSION_SECRET must be configured with at least 32 characters.');
  if (cachedSecret !== secret) {
    cachedSecret = secret;
    cachedKey = crypto.scryptSync(secret, 'viraas-session-cookie-v1', 32);
  }
  return cachedKey;
}

function encryptSession(session) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', getSessionKey(), iv);
  const ciphertext = Buffer.concat([cipher.update(JSON.stringify(session)), cipher.final()]);
  return `${iv.toString('base64url')}.${cipher.getAuthTag().toString('base64url')}.${ciphertext.toString('base64url')}`;
}

function decryptSession(value) {
  try {
    const [ivText, tagText, bodyText] = String(value).split('.');
    if (!ivText || !tagText || !bodyText) return null;
    const decipher = crypto.createDecipheriv('aes-256-gcm', getSessionKey(), Buffer.from(ivText, 'base64url'));
    decipher.setAuthTag(Buffer.from(tagText, 'base64url'));
    const body = Buffer.concat([decipher.update(Buffer.from(bodyText, 'base64url')), decipher.final()]);
    const session = JSON.parse(body.toString('utf8'));
    if (!session?.accessToken || !session?.refreshToken || !session?.subject || !Number.isFinite(session.expiresAt)) return null;
    return session;
  } catch {
    return null;
  }
}

function cookieValue(req) {
  const header = req.headers?.cookie || '';
  for (const part of header.split(';')) {
    const [name, ...rest] = part.trim().split('=');
    if (name === SESSION_COOKIE) {
      try { return decodeURIComponent(rest.join('=')); } catch { return rest.join('='); }
    }
  }
  return null;
}

function setCookie(res, req, value, maxAge = SESSION_TTL_SECONDS) {
  const proto = String(req.headers?.['x-forwarded-proto'] || '').split(',')[0].trim();
  const secure = process.env.NODE_ENV === 'production' || req.secure || proto === 'https';
  const parts = [
    `${SESSION_COOKIE}=${encodeURIComponent(value)}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${Math.max(0, Math.floor(maxAge))}`,
  ];
  if (secure) parts.push('Secure');
  res.setHeader('Set-Cookie', parts.join('; '));
}

export function clearSessionCookie(res, req) {
  setCookie(res, req, '', 0);
}

function apiBase() {
  const base = process.env.SUPABASE_URL;
  if (!base || !process.env.SUPABASE_ANON_KEY) throw new AuthProviderError('Supabase Auth is not configured. Set SUPABASE_URL and SUPABASE_ANON_KEY.');
  try {
    const url = new URL(base);
    if (process.env.NODE_ENV === 'production' && url.protocol !== 'https:') throw new Error('https required');
    return `${url.origin}/auth/v1`;
  } catch {
    throw new AuthProviderError('SUPABASE_URL must be a valid HTTPS Supabase project URL.');
  }
}

async function authRequest(path, { method = 'POST', body, accessToken } = {}) {
  const base = apiBase();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12_000);
  try {
    const response = await fetch(`${base}/${path}`, {
      method,
      signal: controller.signal,
      headers: {
        apikey: process.env.SUPABASE_ANON_KEY,
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...(body ? { 'Content-Type': 'application/json' } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      if (response.status === 429) throw new AuthProviderError('Sign-in provider is rate limiting requests. Try again shortly.', 429);
      if (response.status >= 500) throw new AuthProviderError('Sign-in provider is temporarily unavailable. Try again shortly.', 503);
      throw new AuthProviderError('Email or password was not accepted. Check your details and try again.', 401);
    }
    return data;
  } catch (error) {
    if (error instanceof AuthProviderError) throw error;
    throw new AuthProviderError('Could not reach Supabase Auth. Try again shortly.', 503);
  } finally {
    clearTimeout(timeout);
  }
}

function sessionFrom(data) {
  const subject = data?.user?.id;
  const accessToken = data?.access_token;
  const refreshToken = data?.refresh_token;
  if (!subject || !accessToken || !refreshToken) return null;
  const expiresAt = Number(data.expires_at) || Math.floor(Date.now() / 1000) + (Number(data.expires_in) || 3600);
  return { subject: String(subject), accessToken: String(accessToken), refreshToken: String(refreshToken), expiresAt, email: data.user?.email ? String(data.user.email) : null };
}

export async function signUpWithEmail(email, password) {
  if (!authProviderStatus().configured) throw new AuthProviderError('Email sign-in is not configured.', 503);
  const data = await authRequest('signup', { body: { email, password } });
  return { user: data.user || null, session: sessionFrom(data), confirmationRequired: !data.access_token };
}

export async function signInWithEmail(email, password) {
  if (!authProviderStatus().configured) throw new AuthProviderError('Email sign-in is not configured.', 503);
  const data = await authRequest('token?grant_type=password', { body: { email, password } });
  const session = sessionFrom(data);
  if (!session) throw new AuthProviderError('The sign-in provider did not return a valid session.', 503);
  return { user: data.user, session };
}

async function refreshSession(session) {
  const data = await authRequest('token?grant_type=refresh_token', { body: { refresh_token: session.refreshToken } });
  const next = sessionFrom(data);
  if (!next || next.subject !== session.subject) throw new AuthProviderError('Your sign-in session expired. Please sign in again.', 401);
  return next;
}

async function verifyAccessToken(accessToken) {
  return authRequest('user', { method: 'GET', accessToken });
}

export async function getAuthIdentity(req, res, { optional = false } = {}) {
  // Explicit test-only identity injection; unreachable unless the Node process itself is in test mode.
  if (process.env.NODE_ENV === 'test' && req.headers?.['x-test-auth-subject']) {
    return { subject: String(req.headers['x-test-auth-subject']), email: 'test@example.invalid', accessToken: 'test-access-token', testIdentity: true };
  }

  if (!authProviderStatus().configured) {
    if (optional) return null;
    throw new AuthProviderError('Email sign-in is unavailable until Supabase Auth and VIRAAS_SESSION_SECRET are configured.', 503);
  }

  const encrypted = cookieValue(req);
  if (!encrypted) {
    if (optional) return null;
    throw new AuthProviderError('Please sign in to your VIRAAS account.', 401);
  }

  let session = decryptSession(encrypted);
  if (!session) {
    clearSessionCookie(res, req);
    if (optional) return null;
    throw new AuthProviderError('Your sign-in session is invalid. Please sign in again.', 401);
  }

  const now = Math.floor(Date.now() / 1000);
  if (session.expiresAt <= now + MAX_REFRESH_SKEW_SECONDS) {
    try {
      session = await refreshSession(session);
      setCookie(res, req, encryptSession(session));
    } catch (error) {
      clearSessionCookie(res, req);
      if (optional) return null;
      throw error;
    }
  }

  // The session cookie is authenticated with AES-GCM and can only be minted from a Supabase-issued
  // session or refresh response. This lets serverless requests validate the identity without a
  // network round-trip on every chat poll; access-token expiry and refresh still remain enforced.
  // accessToken stays server-side (used by the authenticated profile-photo storage upload); it is
  // never serialized into any client-facing response.
  return { subject: session.subject, email: session.email || null, accessToken: session.accessToken };
}

export async function startSession(req, res, session) {
  if (!session?.accessToken || !session?.refreshToken) throw new AuthProviderError('The sign-in provider did not return a usable session.', 503);
  setCookie(res, req, encryptSession(session));
}

export async function endProviderSession(session) {
  if (!session?.accessToken || !authProviderStatus().configured) return;
  try { await authRequest('logout', { accessToken: session.accessToken }); } catch { /* cookie removal is still authoritative locally */ }
}

export function readSessionForLogout(req) {
  const encrypted = cookieValue(req);
  return encrypted ? decryptSession(encrypted) : null;
}
