// Focused VIRAAS Connect integration test. PostgreSQL is emulated only inside this test process;
// production Connect uses the real pg driver/DATABASE_URL and Supabase Auth.
import assert from 'node:assert/strict';
import { newDb } from 'pg-mem';

process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = 'postgresql://test:test@localhost/connect-test';
process.env.SUPABASE_URL = 'https://supabase.test';
process.env.SUPABASE_ANON_KEY = 'test-anon-key';
process.env.VIRAAS_SESSION_SECRET = 'test-only-session-secret-that-is-over-32-chars';
for (const key of ['RAZORPAY_KEY_ID', 'RAZORPAY_KEY_SECRET', 'RAZORPAY_WEBHOOK_SECRET', 'RUNWARE_API_KEY', 'RUNWARE_ZDR']) delete process.env[key];

const memoryDb = newDb({ autoCreateForeignKeyIndices: true });
const { Pool } = memoryDb.adapters.createPg();
const pool = new Pool();
const db = await import('../server/db/pool.mjs');
db.setPoolForTests(pool);
const { migrate } = await import('../server/db/migrate.mjs');
await migrate({ through: '001_core' });

const originalFetch = globalThis.fetch;
globalThis.fetch = async (input, init = {}) => {
  const url = String(input);
  if (url.startsWith('https://supabase.test/auth/v1/signup')) {
    return new Response(JSON.stringify({
      access_token: 'test-access-token', refresh_token: 'test-refresh-token', expires_in: 3600,
      user: { id: 'supabase-connect-user-1', email: 'connect@example.test' },
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }
  throw new Error(`Unexpected external request in Connect test: ${url}`);
};

const { default: app } = await import('../server/app.mjs');
const server = app.listen(0, '127.0.0.1');
await new Promise((resolve) => server.once('listening', resolve));
const baseUrl = `http://127.0.0.1:${server.address().port}`;

async function request(path, { method = 'GET', subject, cookie, body, headers = {} } = {}) {
  const response = await originalFetch(`${baseUrl}${path}`, {
    method,
    headers: {
      ...(subject ? { 'X-Test-Auth-Subject': subject } : {}),
      ...(cookie ? { Cookie: cookie } : {}),
      ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
      ...headers,
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  return { response, data: await response.json().catch(() => ({})) };
}

function birthDate(year, month = 1, day = 1) {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

async function createProfile(subject, input) {
  const result = await request('/api/social/session', { method: 'POST', subject, body: { adultConfirmed: true, ...input } });
  assert.equal(result.response.status, 201, JSON.stringify(result.data));
  assert.match(result.data.me.viraasId, /^[a-z0-9.]{4,24}$/);
  return result.data.me;
}

try {
  const signup = await request('/api/auth/signup', {
    method: 'POST', body: { email: 'connect@example.test', password: 'long-test-password-123' }, headers: { 'X-Forwarded-Proto': 'https' },
  });
  assert.equal(signup.response.status, 201, JSON.stringify(signup.data));
  const setCookie = signup.response.headers.get('set-cookie') || '';
  assert.match(setCookie, /HttpOnly/i);
  assert.match(setCookie, /SameSite=Lax/i);
  assert.match(setCookie, /Secure/i);
  assert.doesNotMatch(JSON.stringify(signup.data), /test-access-token|test-refresh-token/);
  const cookie = setCookie.split(';')[0];
  const authMe = await request('/api/auth/me', { cookie });
  assert.equal(authMe.data.authenticated, true);

  const signedAccount = await pool.query("SELECT user_id, profile_complete FROM viraas_users WHERE auth_subject='supabase-connect-user-1'");
  assert.equal(signedAccount.rowCount, 1, 'real-provider signup creates a persistent account row');
  assert.match(signedAccount.rows[0].user_id, /^[0-9a-f-]{36}$/i);
  assert.equal(signedAccount.rows[0].profile_complete, false, 'sign-up does not bypass adult Connect onboarding');

  const signedProfile = await request('/api/social/session', {
    method: 'POST', cookie,
    body: { adultConfirmed: true, dateOfBirth: birthDate(1992, 2, 12), displayName: 'Signed User', gender: 'other', state: 'Maharashtra', city: 'Mumbai', locality: 'Bandra', bio: '', visibility: 'public' },
  });
  assert.equal(signedProfile.response.status, 201, JSON.stringify(signedProfile.data));
  const signedId = signedProfile.data.me.viraasId;
  assert.ok(signedProfile.data.me.createdAt && signedProfile.data.me.updatedAt);
  const stableProfile = await request('/api/social/session', {
    method: 'POST', cookie,
    body: { adultConfirmed: true, dateOfBirth: birthDate(1992, 2, 12), displayName: 'Changed Name', gender: 'other', state: 'Maharashtra', city: 'Mumbai', locality: 'Bandra' },
  });
  assert.equal(stableProfile.data.me.viraasId, signedId, 'VIRAAS ID is stable across repeated onboarding/login reads');
  const signedMe = await request('/api/social/me', { cookie });
  assert.equal(signedMe.data.me.viraasId, signedId, 'VIRAAS ID is read from the persistent account after a new request');

  const missingConfirmation = await request('/api/social/session', {
    method: 'POST', subject: 'connect-no-confirmation',
    body: { adultConfirmed: false, dateOfBirth: birthDate(1998), displayName: 'No Confirmation', gender: 'female', state: 'Madhya Pradesh', city: 'Jabalpur', locality: 'Vijay Nagar' },
  });
  assert.equal(missingConfirmation.response.status, 400);
  assert.match(missingConfirmation.data.message, /confirm.*18/i);

  const underage = await request('/api/social/session', {
    method: 'POST', subject: 'connect-underage',
    body: { adultConfirmed: true, dateOfBirth: birthDate(new Date().getUTCFullYear() - 17), displayName: 'Too Young', gender: 'female', state: 'Madhya Pradesh', city: 'Jabalpur', locality: 'Vijay Nagar' },
  });
  assert.equal(underage.response.status, 400);
  assert.match(underage.data.message, /18/);
  const underageRow = await pool.query("SELECT age, viraas_id, profile_complete FROM viraas_users WHERE auth_subject='connect-underage'");
  assert.equal(underageRow.rows[0].age, null);
  assert.equal(underageRow.rows[0].viraas_id, null);
  assert.equal(underageRow.rows[0].profile_complete, false);

  const unsafeLocation = await request('/api/social/session', {
    method: 'POST', subject: 'connect-unsafe-location',
    body: { adultConfirmed: true, dateOfBirth: birthDate(1998), displayName: 'Unsafe Location', gender: 'female', state: 'Madhya Pradesh', city: 'Jabalpur', locality: '19.0760,72.8777' },
  });
  assert.equal(unsafeLocation.response.status, 400, 'GPS coordinates are rejected in locality fields');
  const unsafeAddress = await request('/api/social/session', {
    method: 'POST', subject: 'connect-unsafe-address',
    body: { adultConfirmed: true, dateOfBirth: birthDate(1998), displayName: 'Unsafe Address', gender: 'female', state: 'Madhya Pradesh', city: 'Jabalpur', locality: 'House 22, 482001' },
  });
  assert.equal(unsafeAddress.response.status, 400, 'house number and postal code are rejected');

  const abhishek = await createProfile('connect-abhishek', {
    dateOfBirth: birthDate(1998, 4, 15), displayName: 'Abhishek', gender: 'male', state: 'Madhya Pradesh', city: 'Jabalpur', locality: 'Vijay Nagar', visibility: 'public', bio: 'Festive fashion fan',
  });
  assert.ok(abhishek.viraasId && abhishek.createdAt && abhishek.updatedAt);
  assert.equal(abhishek.age >= 18, true);
  assert.equal('address' in abhishek || 'latitude' in abhishek || 'longitude' in abhishek, false, 'profiles expose no exact-address/GPS fields');
  assert.equal('email' in abhishek || 'authSubject' in abhishek, false, 'public profile objects never expose account login identity');
  const priya = await createProfile('connect-priya', {
    dateOfBirth: birthDate(2002, 6, 1), displayName: 'Priya', gender: 'female', state: 'Madhya Pradesh', city: 'Jabalpur', locality: 'Vijay Nagar', visibility: 'public', bio: 'Garba lover',
  });
  const sameGender = await createProfile('connect-same-gender', {
    dateOfBirth: birthDate(1997), displayName: 'Same Gender', gender: 'male', state: 'Madhya Pradesh', city: 'Jabalpur', locality: 'Vijay Nagar', visibility: 'public',
  });
  const nearbyFemale = await createProfile('connect-nearby-female', {
    dateOfBirth: birthDate(2001), displayName: 'Nearby Female', gender: 'female', state: 'Madhya Pradesh', city: 'Jabalpur', locality: 'Civil Lines', visibility: 'public',
  });
  const cityFemale = await createProfile('connect-city-female', {
    dateOfBirth: birthDate(2000), displayName: 'City Female', gender: 'female', state: 'Madhya Pradesh', city: 'Bhopal', locality: 'Arera Colony', visibility: 'public',
  });
  const stateFemale = await createProfile('connect-state-female', {
    dateOfBirth: birthDate(1999), displayName: 'State Female', gender: 'female', state: 'Maharashtra', city: 'Nagpur', locality: 'Dharampeth', visibility: 'public',
  });
  const nonbinary = await createProfile('connect-nonbinary', {
    dateOfBirth: birthDate(1996), displayName: 'Nonbinary Candidate', gender: 'nonbinary', state: 'Madhya Pradesh', city: 'Jabalpur', locality: 'Vijay Nagar', visibility: 'public',
  });
  const hidden = await createProfile('connect-hidden', {
    dateOfBirth: birthDate(1999), displayName: 'Hidden Female', gender: 'female', state: 'Madhya Pradesh', city: 'Jabalpur', locality: 'Vijay Nagar', visibility: 'hidden',
  });

  const repeatedProfile = await request('/api/social/session', {
    method: 'POST', subject: 'connect-abhishek',
    body: { adultConfirmed: true, dateOfBirth: birthDate(1998, 4, 15), displayName: 'Renamed', gender: 'male', state: 'Madhya Pradesh', city: 'Jabalpur', locality: 'Vijay Nagar' },
  });
  assert.equal(repeatedProfile.data.me.viraasId, abhishek.viraasId);
  const publicIds = await pool.query('SELECT count(viraas_id)::int AS n, count(DISTINCT viraas_id)::int AS distinct_n FROM viraas_users WHERE profile_complete=true');
  assert.equal(Number(publicIds.rows[0].n), Number(publicIds.rows[0].distinct_n), 'the database stores a unique public VIRAAS ID per completed profile');

  const discovery = await request('/api/social/users', { subject: 'connect-abhishek' });
  assert.equal(discovery.response.status, 200, JSON.stringify(discovery.data));
  const ids = discovery.data.users.map((user) => user.viraasId);
  assert.equal(ids[0], priya.viraasId, 'same-locality opposite-gender profile ranks first');
  assert.ok(ids.indexOf(priya.viraasId) < ids.indexOf(nearbyFemale.viraasId));
  assert.ok(ids.indexOf(nearbyFemale.viraasId) < ids.indexOf(cityFemale.viraasId));
  assert.ok(ids.indexOf(cityFemale.viraasId) < ids.indexOf(stateFemale.viraasId));
  assert.ok(!ids.includes(sameGender.viraasId));
  assert.ok(!ids.includes(nonbinary.viraasId));
  assert.ok(!ids.includes(hidden.viraasId));
  const exactSearch = await request(`/api/social/users?q=${encodeURIComponent(`@${priya.viraasId}`)}`, { subject: 'connect-abhishek' });
  assert.deepEqual(exactSearch.data.users.map((user) => user.viraasId), [priya.viraasId]);
  const incompatibleRequest = await request(`/api/social/connect/${encodeURIComponent(sameGender.viraasId)}`, { method: 'POST', subject: 'connect-abhishek', body: {} });
  assert.equal(incompatibleRequest.response.status, 404, 'direct ID calls cannot bypass opposite-gender eligibility');

  const hiddenNow = await request('/api/social/me', { method: 'PATCH', subject: 'connect-priya', body: { visibility: 'hidden' } });
  assert.equal(hiddenNow.data.me.visibility, 'hidden');
  assert.equal((await request(`/api/social/users?q=${encodeURIComponent(priya.viraasId)}`, { subject: 'connect-abhishek' })).data.users.length, 0);
  const connectionsOnly = await request('/api/social/me', { method: 'PATCH', subject: 'connect-priya', body: { visibility: 'connections' } });
  assert.equal(connectionsOnly.data.me.visibility, 'connections');
  assert.equal((await request(`/api/social/users?q=${encodeURIComponent(priya.viraasId)}`, { subject: 'connect-abhishek' })).data.users.length, 0);
  assert.equal((await request(`/api/social/connect/${encodeURIComponent(priya.viraasId)}`, { method: 'POST', subject: 'connect-abhishek', body: {} })).response.status, 404);
  await request('/api/social/me', { method: 'PATCH', subject: 'connect-priya', body: { visibility: 'public' } });

  const sent = await request(`/api/social/connect/${encodeURIComponent(priya.viraasId)}`, { method: 'POST', subject: 'connect-abhishek', body: {} });
  assert.equal(sent.data.relation, 'request_sent');
  const incoming = await request('/api/social/requests', { subject: 'connect-priya' });
  assert.equal(incoming.data.incoming.length, 1);
  const declineFlow = await request(`/api/social/connect/${encodeURIComponent(cityFemale.viraasId)}`, { method: 'POST', subject: 'connect-abhishek', body: {} });
  const wrongDecliner = await request(`/api/social/requests/${declineFlow.data.requestId}/decline`, { method: 'POST', subject: 'connect-abhishek', body: {} });
  assert.equal(wrongDecliner.response.status, 403, 'only the recipient can decline a request');
  const declined = await request(`/api/social/requests/${declineFlow.data.requestId}/decline`, { method: 'POST', subject: 'connect-city-female', body: {} });
  assert.equal(declined.data.ok, true);
  assert.equal((await pool.query('SELECT status FROM connect_pairs WHERE request_id=$1', [declineFlow.data.requestId])).rows[0].status, 'DECLINED');
  const prematureChat = await request(`/api/social/conversations/with/${encodeURIComponent(priya.viraasId)}`, { subject: 'connect-abhishek' });
  assert.equal(prematureChat.response.status, 403);
  const accepted = await request(`/api/social/requests/${sent.data.requestId}/accept`, { method: 'POST', subject: 'connect-priya', body: {} });
  assert.equal(accepted.data.relation, 'connected');
  const conversation = await request(`/api/social/conversations/with/${encodeURIComponent(priya.viraasId)}`, { subject: 'connect-abhishek' });
  const sentMessage = await request(`/api/social/conversations/${conversation.data.conversationId}/messages`, { method: 'POST', subject: 'connect-abhishek', body: { text: 'Hello Priya' } });
  assert.equal(sentMessage.response.status, 201);
  assert.equal(sentMessage.data.message.text, 'Hello Priya');
  const outsiderRead = await request(`/api/social/conversations/${conversation.data.conversationId}/messages`, { subject: 'connect-nearby-female' });
  assert.equal(outsiderRead.response.status, 404, 'changing the URL ID never grants access to a stranger');
  const outsiderWrite = await request(`/api/social/conversations/${conversation.data.conversationId}/messages`, { method: 'POST', subject: 'connect-nearby-female', body: { text: 'forged' } });
  assert.equal(outsiderWrite.response.status, 404);
  const unread = await request('/api/social/conversations', { subject: 'connect-priya' });
  assert.equal(unread.data.conversations[0].unread, 1);
  const history = await request(`/api/social/conversations/${conversation.data.conversationId}/messages`, { subject: 'connect-priya' });
  assert.equal(history.data.messages[0].text, 'Hello Priya');
  await request(`/api/social/conversations/${conversation.data.conversationId}/read`, { method: 'POST', subject: 'connect-priya', body: {} });
  const read = await request('/api/social/conversations', { subject: 'connect-priya' });
  assert.equal(read.data.conversations[0].unread, 0);

  await request(`/api/social/block/${encodeURIComponent(priya.viraasId)}`, { method: 'POST', subject: 'connect-abhishek', body: {} });
  assert.equal((await request(`/api/social/conversations/${conversation.data.conversationId}/messages`, { subject: 'connect-priya' })).response.status, 403);
  assert.equal((await request(`/api/social/users?q=${encodeURIComponent(priya.viraasId)}`, { subject: 'connect-abhishek' })).data.users.length, 0);
  assert.equal((await request(`/api/social/users?q=${encodeURIComponent(abhishek.viraasId)}`, { subject: 'connect-priya' })).data.users.length, 0);
  assert.equal((await request(`/api/social/connect/${encodeURIComponent(priya.viraasId)}`, { method: 'POST', subject: 'connect-abhishek', body: {} })).response.status, 403);
  await request(`/api/social/block/${encodeURIComponent(priya.viraasId)}`, { method: 'DELETE', subject: 'connect-abhishek' });
  const report = await request(`/api/social/report/${encodeURIComponent(priya.viraasId)}`, { method: 'POST', subject: 'connect-abhishek', body: { category: 'other', details: 'Test report' } });
  assert.equal(report.data.ok, true);
  assert.equal((await pool.query("SELECT count(*)::int AS n FROM reports WHERE reporter_id=(SELECT user_id FROM viraas_users WHERE auth_subject='connect-abhishek')")).rows[0].n, 1);

  console.log('PASS VIRAAS Connect: persistent account/session, server-side 18+ confirmation and age check, stable unique VIRAAS IDs, safe location, opposite-gender discovery ranking/search, visibility, request acceptance, private participant-only chat, unread/read, block and report.');
} finally {
  server.close();
  globalThis.fetch = originalFetch;
  await db.closePool();
}
