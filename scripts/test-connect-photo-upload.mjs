// Focused test for the authenticated VIRAAS Connect profile-photo upload endpoint and the
// profile-photo URL validation. PostgreSQL is emulated with pg-mem and Supabase Storage is
// mocked; no real Supabase project is contacted.
import assert from 'node:assert/strict';
import { newDb } from 'pg-mem';

process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = 'postgresql://test:test@localhost/connect-photo-upload-test';
process.env.SUPABASE_URL = 'https://supabase.test';
process.env.SUPABASE_ANON_KEY = 'test-anon-key';
process.env.VIRAAS_SESSION_SECRET = 'test-only-session-secret-that-is-over-32-chars';

const memoryDb = newDb({ autoCreateForeignKeyIndices: true });
const { Pool } = memoryDb.adapters.createPg();
const pool = new Pool();
const db = await import('../server/db/pool.mjs');
db.setPoolForTests(pool);
const { migrateTestDatabase } = await import('./test-db.mjs');
await migrateTestDatabase({ pool, memoryDb });

const originalFetch = globalThis.fetch;
const storageUploads = [];
globalThis.fetch = async (input, init = {}) => {
  const url = String(input);
  if (url.startsWith('https://supabase.test/storage/v1/object/connect-profile-photos/')) {
    storageUploads.push({ url, init });
    const path = url.slice('https://supabase.test/storage/v1/object/connect-profile-photos/'.length);
    return new Response(JSON.stringify({ Key: `connect-profile-photos/${path}` }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }
  throw new Error(`Unexpected external request in photo upload test: ${url}`);
};

const { default: app } = await import('../server/app.mjs');
const server = app.listen(0, '127.0.0.1');
await new Promise((resolve) => server.once('listening', resolve));
const baseUrl = `http://127.0.0.1:${server.address().port}`;

async function request(path, { method = 'GET', subject, body } = {}) {
  const response = await originalFetch(`${baseUrl}${path}`, {
    method,
    headers: {
      ...(subject ? { 'X-Test-Auth-Subject': subject } : {}),
      ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  return { response, data: await response.json().catch(() => ({})) };
}

function dataUrl(type, bytes) {
  return `data:${type};base64,${Buffer.from(bytes).toString('base64')}`;
}
const JPEG_BYTES = [0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01];
const PNG_BYTES = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d];
const WEBP_BYTES = [...Buffer.from('RIFF'), 0x24, 0x00, 0x00, 0x00, ...Buffer.from('WEBPVP8 ')];
function birthDate(year, month = 1, day = 1) {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}
const baseProfile = { adultConfirmed: true, dateOfBirth: birthDate(1995, 3, 8), displayName: 'Photo User', gender: 'female', state: 'Madhya Pradesh', city: 'Jabalpur', locality: 'Vijay Nagar', visibility: 'public' };

// Unit-level validation of the pure parser.
const { parseProfilePhotoDataUrl, isOwnProfilePhotoUrl, MAX_PROFILE_PHOTO_BYTES } = await import('../server/social/profilePhoto.mjs');
assert.equal(parseProfilePhotoDataUrl(dataUrl('image/jpeg', JPEG_BYTES)).contentType, 'image/jpeg');
assert.equal(parseProfilePhotoDataUrl(dataUrl('image/png', PNG_BYTES)).contentType, 'image/png');
assert.equal(parseProfilePhotoDataUrl(dataUrl('image/webp', WEBP_BYTES)).contentType, 'image/webp');
assert.throws(() => parseProfilePhotoDataUrl(dataUrl('image/gif', [0x47, 0x49, 0x46, 0x38])), /JPEG, PNG or WebP/);
assert.throws(() => parseProfilePhotoDataUrl(dataUrl('image/png', JPEG_BYTES)), /does not match/);
assert.throws(() => parseProfilePhotoDataUrl('data:text/html;base64,PGI+'), /JPEG, PNG or WebP/);
assert.throws(() => parseProfilePhotoDataUrl('not-a-data-url'), /JPEG, PNG or WebP/);
assert.throws(() => parseProfilePhotoDataUrl(dataUrl('image/jpeg', [...JPEG_BYTES, ...new Array(MAX_PROFILE_PHOTO_BYTES).fill(1)])), /at most 5 MB/);

try {
  // 1. Unauthenticated requests are rejected.
  const anon = await request('/api/social/profile/photo', { method: 'POST', body: { image: dataUrl('image/jpeg', JPEG_BYTES) } });
  assert.equal(anon.response.status, 401, 'upload requires an authenticated VIRAAS account');

  // 2. Missing / invalid payloads are rejected.
  assert.equal((await request('/api/social/profile/photo', { method: 'POST', subject: 'photo-user', body: {} })).response.status, 400);
  assert.equal((await request('/api/social/profile/photo', { method: 'POST', subject: 'photo-user', body: { image: 'https://evil.example.com/x.jpg' } })).response.status, 400);
  assert.equal((await request('/api/social/profile/photo', { method: 'POST', subject: 'photo-user', body: { image: dataUrl('image/gif', [0x47, 0x49, 0x46, 0x38, 0x39, 0x61]) } })).response.status, 400, 'GIF is not an allowed MIME type');
  const spoofed = await request('/api/social/profile/photo', { method: 'POST', subject: 'photo-user', body: { image: dataUrl('image/png', JPEG_BYTES) } });
  assert.equal(spoofed.response.status, 400, 'declared MIME type must match the actual image bytes');

  // 3. Oversized images are rejected server-side (5 MB maximum).
  const oversized = Buffer.alloc(MAX_PROFILE_PHOTO_BYTES + 1, 7);
  oversized[0] = 0xff; oversized[1] = 0xd8; oversized[2] = 0xff;
  const tooBig = await request('/api/social/profile/photo', { method: 'POST', subject: 'photo-user', body: { image: dataUrl('image/jpeg', oversized) } });
  assert.equal(tooBig.response.status, 400);
  assert.match(tooBig.data.message, /5 MB/);

  // 4. A valid upload succeeds, is performed by the server with the user token, and uses a
  //    server-controlled storage path inside the user's own folder.
  storageUploads.length = 0;
  const uploaded = await request('/api/social/profile/photo', { method: 'POST', subject: 'photo-user', body: { image: dataUrl('image/jpeg', JPEG_BYTES) } });
  assert.equal(uploaded.response.status, 201, JSON.stringify(uploaded.data));
  assert.equal(storageUploads.length, 1, 'the server performs the storage upload');
  const storageCall = storageUploads[0];
  assert.equal(storageCall.init.method, 'POST');
  assert.equal(storageCall.init.headers.Authorization, 'Bearer test-access-token', 'storage upload uses the signed-in user token, never a service-role key');
  assert.equal(storageCall.init.headers.apikey, 'test-anon-key');
  assert.equal(storageCall.init.headers['Content-Type'], 'image/jpeg');
  assert.deepEqual([...storageCall.init.body], JPEG_BYTES, 'the exact validated bytes are stored, not a client URL');
  assert.match(storageCall.url, /^https:\/\/supabase\.test\/storage\/v1\/object\/connect-profile-photos\/photo-user\/[0-9a-f-]{36}\.jpg$/);
  assert.equal(uploaded.data.url, `https://supabase.test/storage/v1/object/public/connect-profile-photos/${uploaded.data.path}`);
  assert.match(uploaded.data.path, /^photo-user\/[0-9a-f-]{36}\.jpg$/);
  const photoUrl = uploaded.data.url;

  // PNG and WebP are also accepted.
  assert.equal((await request('/api/social/profile/photo', { method: 'POST', subject: 'photo-user', body: { image: dataUrl('image/png', PNG_BYTES) } })).response.status, 201);
  assert.equal((await request('/api/social/profile/photo', { method: 'POST', subject: 'photo-user', body: { image: dataUrl('image/webp', WEBP_BYTES) } })).response.status, 201);

  // 5. The uploaded photo URL is saved with the profile and survives a fresh read.
  const created = await request('/api/social/session', { method: 'POST', subject: 'photo-user', body: { ...baseProfile, profilePhoto: photoUrl } });
  assert.equal(created.response.status, 201, JSON.stringify(created.data));
  assert.equal(created.data.me.profilePhoto, photoUrl);
  const reread = await request('/api/social/me', { subject: 'photo-user' });
  assert.equal(reread.data.me.profilePhoto, photoUrl, 'photo persists across requests (refresh-safe)');
  const stored = await pool.query("SELECT profile_photo FROM viraas_users WHERE auth_subject='photo-user'");
  assert.equal(stored.rows[0].profile_photo, photoUrl, 'only the storage URL is stored in PostgreSQL, never raw bytes');

  // 6. Arbitrary external image URLs are rejected at profile save time.
  const external = await request('/api/social/session', { method: 'POST', subject: 'photo-external', body: { ...baseProfile, displayName: 'External URL', profilePhoto: 'https://evil.example.com/profile.jpg' } });
  assert.equal(external.response.status, 400, 'arbitrary external photo URLs are not accepted');
  assert.match(external.data.message, /upload/i);
  const otherUser = await request('/api/social/session', { method: 'POST', subject: 'photo-victim', body: { ...baseProfile, displayName: 'Victim', profilePhoto: photoUrl } });
  assert.equal(otherUser.response.status, 400, 'a photo uploaded by another account cannot be attached');

  // 7. The photo remains optional.
  const noPhoto = await request('/api/social/session', { method: 'POST', subject: 'photo-none', body: { ...baseProfile, displayName: 'No Photo', gender: 'male' } });
  assert.equal(noPhoto.response.status, 201);
  assert.equal(noPhoto.data.me.profilePhoto, null);

  // 8. Discovery/profile payloads expose the saved photo.
  const discovery = await request('/api/social/users?q=', { subject: 'photo-none' });
  const found = discovery.data.users.find((user) => user.viraasId === created.data.me.viraasId);
  assert.ok(found, 'profile with photo appears in discovery');
  assert.equal(found.profilePhoto, photoUrl, 'discovery cards use the saved photo');

  // 9. PATCH /me applies the same strict photo validation.
  const patchedExternal = await request('/api/social/me', { method: 'PATCH', subject: 'photo-user', body: { profilePhoto: 'https://evil.example.com/other.png' } });
  assert.equal(patchedExternal.response.status, 400);
  const secondUpload = await request('/api/social/profile/photo', { method: 'POST', subject: 'photo-user', body: { image: dataUrl('image/webp', WEBP_BYTES) } });
  assert.equal(secondUpload.response.status, 201);
  const patched = await request('/api/social/me', { method: 'PATCH', subject: 'photo-user', body: { profilePhoto: secondUpload.data.url } });
  assert.equal(patched.response.status, 200);
  assert.equal(patched.data.me.profilePhoto, secondUpload.data.url);

  // 10. URL ownership helper sanity checks.
  assert.equal(isOwnProfilePhotoUrl('photo-user', photoUrl), true);
  assert.equal(isOwnProfilePhotoUrl('photo-other', photoUrl), false);
  assert.equal(isOwnProfilePhotoUrl('photo-user', 'https://supabase.test/storage/v1/object/public/connect-profile-photos/photo-user/../x.jpg'), false);
  assert.equal(isOwnProfilePhotoUrl('photo-user', 'http://supabase.test/storage/v1/object/public/connect-profile-photos/photo-user/whatever.jpg'), false);

  console.log('PASS Connect profile-photo upload: authenticated server-side upload to Supabase Storage, JPEG/PNG/WebP MIME validation with magic-byte sniffing, 5 MB size cap, server-controlled storage paths, strict own-bucket URL validation on profile save, optional photo, persistence and discovery rendering.');
} finally {
  server.close();
  globalThis.fetch = originalFetch;
  await db.closePool();
}
