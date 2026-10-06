// The browser only receives an opaque, random HttpOnly cookie. PostgreSQL stores its SHA-256 hash,
// never the token itself or any user photo/personal identifier.
import crypto from 'node:crypto';
import { ensureAnonymousTryOnAccount } from './anonymousTryOnCredits.mjs';

export const ANONYMOUS_TRYON_COOKIE = 'viraas_tryon_anon';
export const ANONYMOUS_TRYON_COOKIE_TTL_SECONDS = 60 * 60 * 24 * 365;
const TOKEN_RE = /^[A-Za-z0-9_-]{43}$/;

function readCookie(req) {
  const header = req.headers?.cookie || '';
  for (const part of header.split(';')) {
    const [name, ...rest] = part.trim().split('=');
    if (name !== ANONYMOUS_TRYON_COOKIE) continue;
    const encoded = rest.join('=');
    try { return decodeURIComponent(encoded); } catch { return encoded; }
  }
  return null;
}

function validToken(value) {
  if (typeof value !== 'string' || !TOKEN_RE.test(value)) return false;
  const bytes = Buffer.from(value, 'base64url');
  return bytes.length === 32 && bytes.toString('base64url') === value;
}

function newToken() {
  return crypto.randomBytes(32).toString('base64url');
}

function tokenHash(token) {
  return crypto.createHash('sha256').update(token, 'utf8').digest('hex');
}

function appendCookie(res, cookie) {
  const prior = res.getHeader('Set-Cookie');
  const values = prior == null ? [] : Array.isArray(prior) ? prior : [String(prior)];
  res.setHeader('Set-Cookie', [...values, cookie]);
}

function setCookie(res, req, token) {
  const forwardedProto = String(req.headers?.['x-forwarded-proto'] || '').split(',')[0].trim().toLowerCase();
  const secure = process.env.NODE_ENV === 'production' || req.secure === true || forwardedProto === 'https';
  const parts = [
    `${ANONYMOUS_TRYON_COOKIE}=${encodeURIComponent(token)}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${ANONYMOUS_TRYON_COOKIE_TTL_SECONDS}`,
  ];
  if (secure) parts.push('Secure');
  appendCookie(res, parts.join('; '));
}

/** Set a random cookie on the SPA document response before browser JavaScript runs. */
export function initializeAnonymousTryOnCookie(req, res) {
  const current = readCookie(req);
  if (validToken(current)) return;
  setCookie(res, req, newToken());
}

/** Resolve the cookie identity without ever returning the token to a client response. */
export async function resolveAnonymousTryOnIdentity(req, res, { allowNewCookie = false } = {}) {
  let token = readCookie(req);
  if (!validToken(token)) {
    if (!allowNewCookie) return { ok: false, reason: 'session_required' };
    token = newToken();
  }

  let account = await ensureAnonymousTryOnAccount(tokenHash(token));
  if (!account.ok && account.reason === 'expired') {
    if (!allowNewCookie) return { ok: false, reason: 'session_expired' };
    token = newToken();
    account = await ensureAnonymousTryOnAccount(tokenHash(token));
  }
  if (!account.ok) return account;

  // Refresh the cookie's sliding expiry without exposing its value to frontend JavaScript.
  setCookie(res, req, token);
  return { ok: true, anonymousId: account.anonymousId, balance: account.balance };
}
