// VIRAAS Connect profile-photo upload — server-side Supabase Storage integration.
//
// SECURITY MODEL:
//   - The browser NEVER receives Supabase service-role keys or storage secrets. The only
//     Supabase credentials used here are the existing publishable/anon key plus the signed-in
//     user's own access token (already held server-side inside the encrypted session cookie).
//   - The server performs the storage upload; the client only sends image bytes to the
//     authenticated endpoint and receives a public storage URL back.
//   - MIME type is validated against the actual magic bytes (never trusting the client label).
//   - File size is validated server-side (5 MB maximum).
//   - The storage path is server-controlled: <auth subject>/<random uuid>.<ext>, so no client
//     can choose an arbitrary object path.
//   - Only JPEG, PNG and WebP are accepted. Raw bytes live in Supabase Storage, never in
//     PostgreSQL; the profile row stores only the resulting public URL.
import crypto from 'node:crypto';

export const PROFILE_PHOTO_BUCKET = 'connect-profile-photos';
export const MAX_PROFILE_PHOTO_BYTES = 5 * 1024 * 1024; // 5 MB server-enforced maximum
const UPLOAD_TIMEOUT_MS = 20_000;
const SUBJECT_PATTERN = /^[A-Za-z0-9_-]{1,128}$/;
const EXTENSION_BY_TYPE = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };

export class ProfilePhotoError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.name = 'ProfilePhotoError';
    this.status = status;
  }
}

export function storageConfigured() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY);
}

function storageBase() {
  const base = String(process.env.SUPABASE_URL || '').replace(/\/+$/, '');
  try {
    const url = new URL(base);
    if (process.env.NODE_ENV === 'production' && url.protocol !== 'https:') throw new Error('https required');
    return url.origin;
  } catch {
    throw new ProfilePhotoError('Profile photo storage is not configured correctly.', 503);
  }
}

function sniffImageType(buffer) {
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return 'image/jpeg';
  if (buffer.length >= 8 && buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47
    && buffer[4] === 0x0d && buffer[5] === 0x0a && buffer[6] === 0x1a && buffer[7] === 0x0a) return 'image/png';
  if (buffer.length >= 12 && buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP') return 'image/webp';
  return null;
}

// Parses and validates the base64 data-URL payload. Returns the decoded bytes plus the
// verified content type. Throws ProfilePhotoError on any invalid input.
export function parseProfilePhotoDataUrl(value) {
  if (typeof value !== 'string' || !value) throw new ProfilePhotoError('Select a profile photo to upload.');
  const match = /^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/]+={0,2})$/.exec(value);
  if (!match) throw new ProfilePhotoError('Profile photo must be a JPEG, PNG or WebP image.');
  const buffer = Buffer.from(match[2], 'base64');
  if (buffer.length === 0) throw new ProfilePhotoError('Profile photo must be a JPEG, PNG or WebP image.');
  if (buffer.length > MAX_PROFILE_PHOTO_BYTES) throw new ProfilePhotoError('Profile photo must be at most 5 MB.');
  const sniffed = sniffImageType(buffer);
  if (!sniffed) throw new ProfilePhotoError('Profile photo must be a JPEG, PNG or WebP image.');
  if (sniffed !== match[1]) throw new ProfilePhotoError('Profile photo content does not match its declared image type.');
  return { buffer, contentType: sniffed };
}

export function profilePhotoPublicUrl(objectPath) {
  return `${storageBase()}/storage/v1/object/public/${PROFILE_PHOTO_BUCKET}/${objectPath}`;
}

// Strict check used when saving a profile: only URLs produced by this upload endpoint for the
// SAME signed-in user are accepted. Arbitrary external image URLs are rejected.
export function isOwnProfilePhotoUrl(subject, value) {
  if (!subject || typeof value !== 'string') return false;
  let base;
  try { base = new URL(String(process.env.SUPABASE_URL || '').replace(/\/+$/, '')); } catch { return false; }
  let url;
  try { url = new URL(value); } catch { return false; }
  if (url.protocol !== 'https:' || url.host !== base.host) return false;
  const prefix = `/storage/v1/object/public/${PROFILE_PHOTO_BUCKET}/${subject}/`;
  if (!url.pathname.startsWith(prefix)) return false;
  const filename = url.pathname.slice(prefix.length);
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(jpg|jpeg|png|webp)$/i.test(filename);
}

// Uploads validated image bytes to Supabase Storage as the signed-in user. Row-level security
// (migration 006_connect_profile_photos) restricts every object to the owner's own folder.
export async function uploadProfilePhoto(identity, body) {
  if (!identity?.subject) throw new ProfilePhotoError('Please sign in to your VIRAAS account.', 401);
  if (!storageConfigured()) throw new ProfilePhotoError('Profile photo storage is not configured.', 503);
  const subject = String(identity.subject);
  if (!SUBJECT_PATTERN.test(subject)) throw new ProfilePhotoError('Profile photo upload is not available for this account.', 403);
  if (!identity.accessToken) throw new ProfilePhotoError('Your sign-in session expired. Please sign in again.', 401);
  const { buffer, contentType } = parseProfilePhotoDataUrl(body?.image);
  const objectPath = `${subject}/${crypto.randomUUID()}.${EXTENSION_BY_TYPE[contentType]}`;
  const base = storageBase();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), UPLOAD_TIMEOUT_MS);
  let response;
  try {
    response = await fetch(`${base}/storage/v1/object/${PROFILE_PHOTO_BUCKET}/${objectPath}`, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        apikey: process.env.SUPABASE_ANON_KEY,
        Authorization: `Bearer ${identity.accessToken}`,
        'Content-Type': contentType,
        'x-upsert': 'false',
      },
      body: buffer,
    });
  } catch {
    throw new ProfilePhotoError('Profile photo storage is temporarily unavailable. Try again shortly.', 503);
  } finally {
    clearTimeout(timeout);
  }
  if (!response.ok) {
    if (response.status === 401 || response.status === 403) throw new ProfilePhotoError('Profile photo storage rejected the upload. Please sign in again and retry.', 503);
    if (response.status === 404) throw new ProfilePhotoError('Profile photo storage is not ready yet. Try again shortly.', 503);
    throw new ProfilePhotoError('Profile photo upload failed. Try again shortly.', 502);
  }
  return { url: profilePhotoPublicUrl(objectPath), path: objectPath };
}
