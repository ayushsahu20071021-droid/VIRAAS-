import crypto from 'node:crypto';
import { query, withTransaction } from '../db/pool.mjs';
import { isOwnProfilePhotoUrl } from './profilePhoto.mjs';

export class SocialError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.name = 'SocialError';
    this.status = status;
  }
}

const id = () => crypto.randomUUID();
const lowHigh = (a, b) => a < b ? [a, b] : [b, a];
const nowIso = (v) => v instanceof Date ? v.toISOString() : v ? new Date(v).toISOString() : null;
const REPORT_CATEGORIES = Object.freeze(['harassment', 'inappropriate_content', 'spam', 'impersonation', 'safety_concern', 'other']);

function text(value, max, label, { optional = false } = {}) {
  const result = typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : '';
  if (!result && optional) return '';
  if (!result || result.length > max) throw new SocialError(`${label} is required and must be at most ${max} characters.`);
  return result;
}

function locationText(value, max, label) {
  const result = text(value, max, label);
  const addressOrCoordinates = /\b(?:flat|apartment|apt\.?|house|plot|building|street|st\.?|road|rd\.?|lane|address|pin\s?code|pincode|latitude|longitude|gps|door\s?no|unit\s?no|floor|near|opposite|behind|next\s+to)\b/i.test(result)
    || /^\d{1,5}[,/-]?\s/.test(result)
    || /\b\d{6}\b/.test(result)
    || /(?:^|\s)[+-]?\d{1,3}\.\d{4,}\s*[,/]\s*[+-]?\d{1,3}\.\d{4,}(?:\s|$)/.test(result);
  if (/[\r\n]/.test(result) || addressOrCoordinates) {
    throw new SocialError(`${label} must be a locality, city, or state only. Do not enter a street address, PIN code, or GPS location.`);
  }
  return result;
}

function normalizeGender(value) {
  const gender = String(value || '').toLowerCase();
  if (!['male', 'female', 'nonbinary', 'other'].includes(gender)) throw new SocialError('Choose a valid gender for Connect discovery.');
  return gender;
}

function normalizeVisibility(value) {
  const visibility = String(value || 'public').toLowerCase();
  if (!['public', 'connections', 'hidden'].includes(visibility)) throw new SocialError('Choose a valid profile visibility.');
  return visibility;
}

function ageFromBirthDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new SocialError('Enter your date of birth to confirm that you are 18 or older.');
  const [year, month, day] = value.split('-').map(Number);
  const birth = new Date(Date.UTC(year, month - 1, day));
  if (birth.getUTCFullYear() !== year || birth.getUTCMonth() !== month - 1 || birth.getUTCDate() !== day) {
    throw new SocialError('Enter a valid date of birth.');
  }
  const todayParts = Object.fromEntries(new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(new Date()).map((part) => [part.type, part.value]));
  const todayYear = Number(todayParts.year);
  const todayMonth = Number(todayParts.month);
  const todayDay = Number(todayParts.day);
  if (year > todayYear || (year === todayYear && (month > todayMonth || (month === todayMonth && day > todayDay)))) throw new SocialError('Enter a valid date of birth.');
  let age = todayYear - year;
  if (todayMonth < month || (todayMonth === month && todayDay < day)) age -= 1;
  if (!Number.isInteger(age) || age < 18 || age > 120) throw new SocialError('VIRAAS Connect is for adults 18 and older. Age is checked on the server.');
  return age;
}

function validateProfileInput(input, { partial = false, authSubject = '' } = {}) {
  const result = {};
  const has = (key) => Object.prototype.hasOwnProperty.call(input || {}, key);
  if (!partial && input?.adultConfirmed !== true) throw new SocialError('Confirm that you are 18 or older to create a VIRAAS Connect profile.');
  if (!partial || has('displayName')) result.displayName = text(input?.displayName, 60, 'Display name');
  if (!partial) result.age = ageFromBirthDate(input?.dateOfBirth);
  if (!partial || has('gender')) result.gender = normalizeGender(input?.gender);
  if (!partial || has('state')) result.state = locationText(input?.state, 80, 'State');
  if (!partial || has('city')) result.city = locationText(input?.city, 80, 'City');
  if (!partial || has('locality')) result.locality = locationText(input?.locality, 100, 'Locality');
  if (!partial || has('bio')) {
    const bio = typeof input?.bio === 'string' ? input.bio.trim() : '';
    if (bio.length > 500) throw new SocialError('Bio must be at most 500 characters.');
    result.bio = bio;
  }
  if (!partial || has('visibility')) result.visibility = normalizeVisibility(input?.visibility);
  if (has('profilePhoto')) {
    const raw = typeof input.profilePhoto === 'string' ? input.profilePhoto.trim() : '';
    if (raw && raw.length > 1000) throw new SocialError('Profile photo URL is too long.');
    if (raw && !isOwnProfilePhotoUrl(authSubject, raw)) {
      throw new SocialError('Profile photo must be uploaded with the VIRAAS photo upload. External photo URLs are not accepted.');
    }
    result.profilePhoto = raw || null;
  }
  return result;
}

function slugBase(name) {
  const ascii = String(name).normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const slug = ascii.replace(/[^a-z0-9]+/g, '.').replace(/^\.+|\.+$/g, '').slice(0, 14).replace(/\.+$/g, '');
  return slug.length >= 2 ? slug : 'viraas';
}

function newViraasId(displayName) {
  const suffix = crypto.randomBytes(6).toString('hex');
  return `${slugBase(displayName).slice(0, 12)}${suffix}`.slice(0, 24);
}

function publicProfile(row, relation = 'none', requestId = null, self = false) {
  if (!row) return null;
  return {
    viraasId: row.viraas_id,
    displayName: row.display_name,
    age: Number(row.age),
    is18Plus: Number(row.age) >= 18,
    gender: row.gender,
    state: row.state,
    city: row.city,
    locality: row.locality,
    bio: row.bio || '',
    profilePhoto: row.profile_photo || null,
    visibility: row.visibility,
    avatarSeed: row.viraas_id,
    relation,
    requestId: requestId || undefined,
    self: Boolean(self),
    createdAt: nowIso(row.created_at),
    updatedAt: nowIso(row.updated_at),
  };
}

export async function getUserByAuthSubject(authSubject, executor = { query }) {
  const result = await executor.query('SELECT * FROM viraas_users WHERE auth_subject = $1 LIMIT 1', [authSubject]);
  return result.rows[0] || null;
}

async function ensureAccountInTransaction(client, authSubject) {
  const existing = await getUserByAuthSubject(authSubject, client);
  if (existing) return { user: existing, created: false };
  const userId = id();
  const inserted = await client.query(
    `INSERT INTO viraas_users (user_id, auth_subject, visibility, profile_complete)
     VALUES ($1,$2,'hidden',false) ON CONFLICT (auth_subject) DO NOTHING RETURNING *`,
    [userId, authSubject],
  );
  if (!inserted.rowCount) {
    const raced = await getUserByAuthSubject(authSubject, client);
    if (!raced) throw new SocialError('Could not create the VIRAAS account. Try again.', 503);
    return { user: raced, created: false };
  }
  return { user: inserted.rows[0], created: true };
}

export async function createAccount(authSubject) {
  if (!authSubject || typeof authSubject !== 'string' || authSubject.length > 200) throw new SocialError('A verified sign-in session is required.', 401);
  return withTransaction((client) => ensureAccountInTransaction(client, authSubject));
}

export async function getProfileByAuthSubject(authSubject) {
  const row = await getUserByAuthSubject(authSubject);
  return row?.profile_complete ? publicProfile(row, 'self', null, true) : null;
}

export async function createProfile(authSubject, input) {
  if (!authSubject || typeof authSubject !== 'string' || authSubject.length > 200) throw new SocialError('A verified sign-in session is required.', 401);
  const fields = validateProfileInput(input || {}, { authSubject });
  return withTransaction(async (client) => {
    let account = await getUserByAuthSubject(authSubject, client);
    if (account?.profile_complete) return publicProfile(account, 'self', null, true);
    if (!account) {
      const created = await ensureAccountInTransaction(client, authSubject);
      account = created.user;
    }
    const viraasId = newViraasId(fields.displayName);
    const result = await client.query(
      `UPDATE viraas_users SET viraas_id=$2, display_name=$3, age=$4, gender=$5, state=$6, city=$7, locality=$8,
        bio=$9, profile_photo=$10, visibility=$11, profile_complete=true, updated_at=now()
       WHERE user_id=$1 AND profile_complete=false RETURNING *`,
      [account.user_id, viraasId, fields.displayName, fields.age, fields.gender, fields.state, fields.city, fields.locality, fields.bio, fields.profilePhoto || null, fields.visibility],
    );
    if (!result.rowCount) {
      const current = await getUserByAuthSubject(authSubject, client);
      if (current?.profile_complete) return publicProfile(current, 'self', null, true);
      throw new SocialError('Could not finish VIRAAS Connect onboarding. Try again.', 503);
    }
    return publicProfile(result.rows[0], 'self', null, true);
  });
}

export async function updateProfile(authSubject, input) {
  const fields = validateProfileInput(input || {}, { partial: true, authSubject });
  const allowed = ['displayName', 'age', 'gender', 'state', 'city', 'locality', 'bio', 'profilePhoto', 'visibility'];
  const keys = allowed.filter((key) => Object.prototype.hasOwnProperty.call(fields, key));
  if (!keys.length) throw new SocialError('No editable profile fields were provided.');
  const columns = { displayName: 'display_name', age: 'age', gender: 'gender', state: 'state', city: 'city', locality: 'locality', bio: 'bio', profilePhoto: 'profile_photo', visibility: 'visibility' };
  const values = keys.map((key) => fields[key]);
  const setSql = keys.map((key, index) => `${columns[key]} = $${index + 2}`).join(', ');
  const result = await query(`UPDATE viraas_users SET ${setSql}, updated_at = now() WHERE auth_subject = $1 RETURNING *`, [authSubject, ...values]);
  if (!result.rowCount) throw new SocialError('Complete your VIRAAS Connect profile first.', 404);
  return publicProfile(result.rows[0], 'self', null, true);
}

function oppositeGenderEligible(viewerGender, candidateGender) {
  if (viewerGender === 'male') return candidateGender === 'female';
  if (viewerGender === 'female') return candidateGender === 'male';
  return candidateGender !== viewerGender;
}

async function blockedEither(client, a, b) {
  const result = await client.query(
    'SELECT blocker_id FROM blocks WHERE (blocker_id = $1 AND blocked_id = $2) OR (blocker_id = $2 AND blocked_id = $1) LIMIT 1',
    [a, b],
  );
  return result.rows[0] || null;
}

async function pairRecord(client, a, b, { lock = false } = {}) {
  const [low, high] = lowHigh(a, b);
  const result = await client.query(
    `SELECT * FROM connect_pairs WHERE user_low = $1 AND user_high = $2${lock ? ' FOR UPDATE' : ''}`,
    [low, high],
  );
  return result.rows[0] || null;
}

async function relationWithRow(viewerId, row) {
  if (row.user_id === viewerId) return { relation: 'self', requestId: null };
  const blocked = await blockedEither({ query }, viewerId, row.user_id);
  if (blocked) return { relation: blocked.blocker_id === viewerId ? 'blocked' : 'unavailable', requestId: null };
  const [low, high] = lowHigh(viewerId, row.user_id);
  const result = await query('SELECT * FROM connect_pairs WHERE user_low = $1 AND user_high = $2', [low, high]);
  const pair = result.rows[0];
  if (!pair) return { relation: 'none', requestId: null };
  if (pair.status === 'CONNECTED') return { relation: 'connected', requestId: null };
  if (pair.status === 'PENDING') return { relation: pair.initiated_by === viewerId ? 'request_sent' : 'request_received', requestId: pair.request_id };
  if (pair.status === 'BLOCKED') return { relation: 'unavailable', requestId: null };
  return { relation: 'declined', requestId: null };
}

async function canViewProfile(viewerId, row) {
  if (row.user_id === viewerId) return true;
  if (await blockedEither({ query }, viewerId, row.user_id)) return false;
  if (row.visibility === 'hidden' || !row.profile_complete || Number(row.age) < 18) return false;
  const viewer = await query('SELECT gender FROM viraas_users WHERE user_id=$1 AND profile_complete=true', [viewerId]);
  if (!viewer.rowCount || !oppositeGenderEligible(viewer.rows[0].gender, row.gender)) return false;
  if (row.visibility === 'public') return true;
  const [low, high] = lowHigh(viewerId, row.user_id);
  const result = await query("SELECT 1 FROM connect_pairs WHERE user_low=$1 AND user_high=$2 AND status='CONNECTED'", [low, high]);
  return Boolean(result.rowCount);
}

export async function getPublicProfile(viewerId, viraasId) {
  const result = await query('SELECT * FROM viraas_users WHERE lower(viraas_id) = lower($1) LIMIT 1', [String(viraasId || '').replace(/^@/, '')]);
  const row = result.rows[0];
  if (!row || !(await canViewProfile(viewerId, row))) throw new SocialError('This VIRAAS profile is not available.', 404);
  const relation = await relationWithRow(viewerId, row);
  return publicProfile(row, relation.relation, relation.requestId, row.user_id === viewerId);
}

export async function searchUsers(viewerId, rawTerm = '') {
  const term = String(rawTerm || '').trim().replace(/^@/, '').slice(0, 80);
  const viewerResult = await query('SELECT * FROM viraas_users WHERE user_id = $1', [viewerId]);
  const viewer = viewerResult.rows[0];
  if (!viewer) throw new SocialError('Complete your VIRAAS Connect profile first.', 404);
  const params = [viewerId, viewer.gender, viewer.locality, viewer.city, viewer.state];
  let where = `user_id <> $1 AND profile_complete=true AND age >= 18 AND visibility IN ('public','connections')
    AND (($2::text='male' AND gender='female') OR ($2::text='female' AND gender='male') OR ($2::text NOT IN ('male','female') AND gender <> $2))`;
  if (term) {
    const escaped = term.toLowerCase().replace(/[\\%_]/g, '\\$&');
    params.push(term.toLowerCase(), `%${escaped}%`);
    where += ` AND (lower(viraas_id) = $6 OR lower(viraas_id) LIKE $7 OR lower(display_name) LIKE $7)`;
  }
  const candidates = await query(
    `SELECT * FROM viraas_users WHERE ${where}
     ORDER BY CASE WHEN lower(locality)=lower($3) THEN 0
                   WHEN lower(city)=lower($4) THEN 1
                   WHEN lower(state)=lower($5) THEN 2 ELSE 3 END,
              created_at DESC
     LIMIT 1000`,
    params,
  );
  const [pairsResult, blocksResult] = await Promise.all([
    query('SELECT * FROM connect_pairs WHERE user_low=$1 OR user_high=$1', [viewerId]),
    query('SELECT * FROM blocks WHERE blocker_id=$1 OR blocked_id=$1', [viewerId]),
  ]);
  const pairs = new Map(pairsResult.rows.map((pair) => [pair.user_low === viewerId ? pair.user_high : pair.user_low, pair]));
  const blocked = new Set(blocksResult.rows.map((block) => block.blocker_id === viewerId ? block.blocked_id : block.blocker_id));
  return candidates.rows
    .filter((row) => !blocked.has(row.user_id) && (row.visibility === 'public' || pairs.get(row.user_id)?.status === 'CONNECTED'))
    .map((row) => {
      const pair = pairs.get(row.user_id);
      let relation = 'none';
      if (pair?.status === 'CONNECTED') relation = 'connected';
      else if (pair?.status === 'PENDING') relation = pair.initiated_by === viewerId ? 'request_sent' : 'request_received';
      else if (pair?.status === 'DECLINED') relation = 'declined';
      const locationRank = row.locality.toLowerCase() === viewer.locality.toLowerCase() ? 0
        : row.city.toLowerCase() === viewer.city.toLowerCase() ? 1
          : row.state.toLowerCase() === viewer.state.toLowerCase() ? 2 : 3;
      const exactId = term && row.viraas_id.toLowerCase() === term ? 0 : 1;
      return { row, relation, requestId: pair?.status === 'PENDING' ? pair.request_id : null, locationRank, exactId };
    })
    .sort((a, b) => a.exactId - b.exactId || a.locationRank - b.locationRank || new Date(b.row.created_at).getTime() - new Date(a.row.created_at).getTime())
    .slice(0, 50)
    .map(({ row, relation, requestId }) => publicProfile(row, relation, requestId, false));
}

async function getTargetForConnect(client, viewerId, viraasId) {
  const result = await client.query('SELECT * FROM viraas_users WHERE lower(viraas_id) = lower($1) LIMIT 1', [String(viraasId || '').replace(/^@/, '')]);
  const target = result.rows[0];
  if (!target || target.user_id === viewerId || !target.profile_complete || Number(target.age) < 18) throw new SocialError('That VIRAAS profile is not available.', 404);
  const viewer = await client.query('SELECT gender FROM viraas_users WHERE user_id=$1 AND profile_complete=true', [viewerId]);
  if (!viewer.rowCount || !oppositeGenderEligible(viewer.rows[0].gender, target.gender)) throw new SocialError('That VIRAAS profile is not available.', 404);
  if (await blockedEither(client, viewerId, target.user_id)) throw new SocialError('This connection is unavailable.', 403);
  if (target.visibility !== 'public') {
    const [low, high] = lowHigh(viewerId, target.user_id);
    const connected = await client.query("SELECT 1 FROM connect_pairs WHERE user_low=$1 AND user_high=$2 AND status='CONNECTED'", [low, high]);
    if (!connected.rowCount) throw new SocialError('This VIRAAS profile is not available.', 404);
  }
  return target;
}

export async function sendRequest(viewerId, viraasId) {
  return withTransaction(async (client) => {
    const target = await getTargetForConnect(client, viewerId, viraasId);
    const [low, high] = lowHigh(viewerId, target.user_id);
    const existing = await pairRecord(client, viewerId, target.user_id, { lock: true });
    if (existing?.status === 'CONNECTED') return { relation: 'connected', requestId: null };
    if (existing?.status === 'BLOCKED') throw new SocialError('This connection is unavailable.', 403);
    if (existing?.status === 'PENDING') {
      return { relation: existing.initiated_by === viewerId ? 'request_sent' : 'request_received', requestId: existing.request_id };
    }
    const requestId = id();
    if (existing) {
      await client.query(
        `UPDATE connect_pairs SET request_id=$3, initiated_by=$4, status='PENDING', declined_by=NULL, created_at=now(), updated_at=now()
         WHERE user_low=$1 AND user_high=$2`,
        [low, high, requestId, viewerId],
      );
    } else {
      await client.query(
        `INSERT INTO connect_pairs (connection_id, request_id, user_low, user_high, initiated_by, status)
         VALUES ($1, $2, $3, $4, $5, 'PENDING')`,
        [id(), requestId, low, high, viewerId],
      );
    }
    return { relation: 'request_sent', requestId };
  });
}

async function acceptConnection(client, row, userId) {
  if (row.status !== 'PENDING' || row.initiated_by === userId) throw new SocialError('Only the person who received this connect request can accept it.', 403);
  if (await blockedEither(client, row.user_low, row.user_high)) throw new SocialError('This connection is unavailable.', 403);
  await client.query("UPDATE connect_pairs SET status='CONNECTED', declined_by=NULL, updated_at=now() WHERE connection_id=$1", [row.connection_id]);
  await client.query(
    `INSERT INTO conversations (conversation_id, user_low, user_high)
     VALUES ($1, $2, $3) ON CONFLICT (user_low, user_high) DO NOTHING`,
    [id(), row.user_low, row.user_high],
  );
  const conversation = await client.query('SELECT conversation_id FROM conversations WHERE user_low=$1 AND user_high=$2', [row.user_low, row.user_high]);
  return { relation: 'connected', conversationId: conversation.rows[0]?.conversation_id || null };
}

export async function acceptRequest(userId, requestId) {
  return withTransaction(async (client) => {
    const result = await client.query('SELECT * FROM connect_pairs WHERE request_id=$1 FOR UPDATE', [requestId]);
    const row = result.rows[0];
    if (!row) throw new SocialError('This connect request is no longer available.', 404);
    if (row.user_low !== userId && row.user_high !== userId) throw new SocialError('This connect request is not yours.', 403);
    return acceptConnection(client, row, userId);
  });
}

export async function declineRequest(userId, requestId) {
  return withTransaction(async (client) => {
    const result = await client.query('SELECT * FROM connect_pairs WHERE request_id=$1 FOR UPDATE', [requestId]);
    const row = result.rows[0];
    if (!row) throw new SocialError('This connect request is no longer available.', 404);
    if ((row.user_low !== userId && row.user_high !== userId) || row.initiated_by === userId) throw new SocialError('Only the recipient can decline this connect request.', 403);
    if (row.status !== 'PENDING') throw new SocialError('This connect request is no longer pending.', 409);
    await client.query("UPDATE connect_pairs SET status='DECLINED', declined_by=$2, updated_at=now() WHERE connection_id=$1", [row.connection_id, userId]);
    return { ok: true };
  });
}

export async function listRequests(userId) {
  const result = await query(
    `SELECT cp.request_id, cp.initiated_by, cp.created_at, u.*
     FROM connect_pairs cp
     JOIN viraas_users u ON u.user_id = CASE WHEN cp.user_low = $1 THEN cp.user_high ELSE cp.user_low END
     WHERE cp.status='PENDING' AND (cp.user_low=$1 OR cp.user_high=$1)
     ORDER BY cp.created_at DESC`,
    [userId],
  );
  const incoming = [];
  const outgoing = [];
  for (const row of result.rows) {
    const item = { id: row.request_id, createdAt: nowIso(row.created_at), from: null, to: null };
    if (row.initiated_by === userId) {
      item.to = publicProfile(row, 'request_sent', row.request_id);
      outgoing.push(item);
    } else {
      item.from = publicProfile(row, 'request_received', row.request_id);
      incoming.push(item);
    }
  }
  return { incoming, outgoing };
}

export async function listConnections(userId) {
  const result = await query(
    `SELECT cp.connection_id, cp.updated_at, u.*
     FROM connect_pairs cp
     JOIN viraas_users u ON u.user_id = CASE WHEN cp.user_low = $1 THEN cp.user_high ELSE cp.user_low END
     WHERE cp.status='CONNECTED' AND (cp.user_low=$1 OR cp.user_high=$1)
       AND NOT EXISTS (SELECT 1 FROM blocks b WHERE (b.blocker_id=$1 AND b.blocked_id=u.user_id) OR (b.blocker_id=u.user_id AND b.blocked_id=$1))
     ORDER BY cp.updated_at DESC`,
    [userId],
  );
  return result.rows.map((row) => ({ connectionId: row.connection_id, since: nowIso(row.updated_at), user: publicProfile(row, 'connected') }));
}

export async function disconnect(userId, connectionId) {
  const result = await query(
    `UPDATE connect_pairs SET status='DECLINED', declined_by=$2, updated_at=now()
     WHERE connection_id=$1 AND status='CONNECTED' AND (user_low=$2 OR user_high=$2) RETURNING connection_id`,
    [connectionId, userId],
  );
  if (!result.rowCount) throw new SocialError('Connection was not found.', 404);
  return { ok: true };
}

async function requireConnectedPair(client, userId, otherId) {
  if (await blockedEither(client, userId, otherId)) throw new SocialError('This conversation is unavailable.', 403);
  const [low, high] = lowHigh(userId, otherId);
  const result = await client.query("SELECT * FROM connect_pairs WHERE user_low=$1 AND user_high=$2 AND status='CONNECTED' FOR UPDATE", [low, high]);
  if (!result.rowCount) throw new SocialError('Private chat is available only after both people accept the connect request.', 403);
  return result.rows[0];
}

async function ensureConversation(client, userId, otherId) {
  await requireConnectedPair(client, userId, otherId);
  const [low, high] = lowHigh(userId, otherId);
  await client.query('INSERT INTO conversations (conversation_id, user_low, user_high) VALUES ($1,$2,$3) ON CONFLICT (user_low,user_high) DO NOTHING', [id(), low, high]);
  const result = await client.query('SELECT * FROM conversations WHERE user_low=$1 AND user_high=$2', [low, high]);
  return result.rows[0];
}

export async function conversationWith(userId, viraasId) {
  return withTransaction(async (client) => {
    const targetResult = await client.query('SELECT * FROM viraas_users WHERE lower(viraas_id)=lower($1) LIMIT 1', [String(viraasId || '').replace(/^@/, '')]);
    const target = targetResult.rows[0];
    if (!target || target.user_id === userId) throw new SocialError('This conversation is unavailable.', 404);
    const conversation = await ensureConversation(client, userId, target.user_id);
    return { conversationId: conversation.conversation_id };
  });
}

export async function listConversations(userId) {
  const result = await query(
    'SELECT * FROM conversations WHERE user_low=$1 OR user_high=$1 ORDER BY COALESCE(last_message_at, created_at) DESC LIMIT 100',
    [userId],
  );
  const conversations = await Promise.all(result.rows.map(async (conversation) => {
    const otherId = userId === conversation.user_low ? conversation.user_high : conversation.user_low;
    const pair = await pairRecord({ query }, userId, otherId);
    if (pair?.status !== 'CONNECTED' || await blockedEither({ query }, userId, otherId)) return null;
    const [profileResult, messageResult, unreadResult] = await Promise.all([
      query('SELECT * FROM viraas_users WHERE user_id=$1', [otherId]),
      query('SELECT * FROM messages WHERE conversation_id=$1 ORDER BY created_at DESC, message_id DESC LIMIT 1', [conversation.conversation_id]),
      query('SELECT count(*) AS count FROM messages WHERE conversation_id=$1 AND sender_id<>$2 AND read_at IS NULL', [conversation.conversation_id, userId]),
    ]);
    const profile = profileResult.rows[0];
    const last = messageResult.rows[0];
    return {
      conversationId: conversation.conversation_id,
      user: publicProfile(profile, 'connected'),
      lastMessage: last ? { id: last.message_id, senderId: last.sender_id === userId ? 'me' : 'other', text: last.body, createdAt: nowIso(last.created_at) } : null,
      lastMessageAt: nowIso(conversation.last_message_at),
      unread: Number(unreadResult.rows[0]?.count || 0),
      _sortAt: new Date(conversation.last_message_at || conversation.created_at).getTime(),
    };
  }));
  return conversations.filter(Boolean).sort((a, b) => b._sortAt - a._sortAt).map(({ _sortAt, ...item }) => item);
}

async function getConversationForUser(client, userId, conversationId) {
  const result = await client.query('SELECT * FROM conversations WHERE conversation_id=$1 AND (user_low=$2 OR user_high=$2)', [conversationId, userId]);
  const conversation = result.rows[0];
  if (!conversation) throw new SocialError('Conversation was not found.', 404);
  await requireConnectedPair(client, userId, userId === conversation.user_low ? conversation.user_high : conversation.user_low);
  return conversation;
}

export async function getMessages(userId, conversationId) {
  return withTransaction(async (client) => {
    const conversation = await getConversationForUser(client, userId, conversationId);
    const otherId = userId === conversation.user_low ? conversation.user_high : conversation.user_low;
    const profileResult = await client.query('SELECT * FROM viraas_users WHERE user_id=$1', [otherId]);
    const items = await client.query('SELECT * FROM messages WHERE conversation_id=$1 ORDER BY created_at DESC, message_id DESC LIMIT 100', [conversationId]);
    const messages = items.rows.reverse().map((row) => ({
      id: row.message_id,
      text: row.body,
      senderId: row.sender_id === userId ? 'me' : 'other',
      mine: row.sender_id === userId,
      read: row.sender_id === userId ? Boolean(row.read_at) : false,
      createdAt: nowIso(row.created_at),
    }));
    return { conversation: { conversationId, user: publicProfile(profileResult.rows[0], 'connected') }, messages };
  });
}

export async function sendMessage(userId, conversationId, rawBody) {
  const body = typeof rawBody === 'string' ? rawBody.trim() : '';
  if (!body || body.length > 2000) throw new SocialError('Message must be between 1 and 2,000 characters.');
  return withTransaction(async (client) => {
    const conversation = await getConversationForUser(client, userId, conversationId);
    const inserted = await client.query(
      'INSERT INTO messages (message_id, conversation_id, sender_id, body) VALUES ($1,$2,$3,$4) RETURNING *',
      [id(), conversationId, userId, body],
    );
    await client.query('UPDATE conversations SET last_message_at=$2 WHERE conversation_id=$1', [conversationId, inserted.rows[0].created_at]);
    const row = inserted.rows[0];
    return { message: { id: row.message_id, text: row.body, senderId: 'me', mine: true, read: false, createdAt: nowIso(row.created_at) }, conversationId: conversation.conversation_id };
  });
}

export async function markRead(userId, conversationId) {
  return withTransaction(async (client) => {
    await getConversationForUser(client, userId, conversationId);
    const result = await client.query('UPDATE messages SET read_at=now() WHERE conversation_id=$1 AND sender_id<>$2 AND read_at IS NULL', [conversationId, userId]);
    return { ok: true, marked: result.rowCount };
  });
}

export async function blockUser(userId, viraasId) {
  return withTransaction(async (client) => {
    const target = await client.query('SELECT user_id FROM viraas_users WHERE lower(viraas_id)=lower($1) LIMIT 1', [String(viraasId || '').replace(/^@/, '')]);
    const otherId = target.rows[0]?.user_id;
    if (!otherId || otherId === userId) throw new SocialError('This VIRAAS profile is not available.', 404);
    await client.query('INSERT INTO blocks (blocker_id, blocked_id) VALUES ($1,$2) ON CONFLICT DO NOTHING', [userId, otherId]);
    const [low, high] = lowHigh(userId, otherId);
    await client.query("UPDATE connect_pairs SET status='BLOCKED', updated_at=now() WHERE user_low=$1 AND user_high=$2", [low, high]);
    return { ok: true };
  });
}

export async function unblockUser(userId, viraasId) {
  return withTransaction(async (client) => {
    const target = await client.query('SELECT user_id FROM viraas_users WHERE lower(viraas_id)=lower($1) LIMIT 1', [String(viraasId || '').replace(/^@/, '')]);
    const otherId = target.rows[0]?.user_id;
    if (!otherId || otherId === userId) throw new SocialError('This VIRAAS profile is not available.', 404);
    await client.query('DELETE FROM blocks WHERE blocker_id=$1 AND blocked_id=$2', [userId, otherId]);
    const [low, high] = lowHigh(userId, otherId);
    await client.query("UPDATE connect_pairs SET status='DECLINED', declined_by=$3, updated_at=now() WHERE user_low=$1 AND user_high=$2 AND status='BLOCKED'", [low, high, userId]);
    return { ok: true };
  });
}

export async function createReport(userId, viraasId, reason, details = '') {
  const category = String(reason || '').toLowerCase();
  if (!REPORT_CATEGORIES.includes(category)) throw new SocialError('Choose a valid report reason.');
  const note = typeof details === 'string' ? details.trim().slice(0, 1000) : '';
  const target = await query('SELECT user_id FROM viraas_users WHERE lower(viraas_id)=lower($1) LIMIT 1', [String(viraasId || '').replace(/^@/, '')]);
  const reportedId = target.rows[0]?.user_id;
  if (!reportedId || reportedId === userId) throw new SocialError('This VIRAAS profile is not available.', 404);
  await query('INSERT INTO reports (report_id, reporter_id, reported_id, reason, details) VALUES ($1,$2,$3,$4,$5)', [id(), userId, reportedId, category, note]);
  return { ok: true };
}

export function reportCategories() { return [...REPORT_CATEGORIES]; }

export async function socialReadiness(authStatus, database) {
  const missing = [...(database.missing || []), ...(authStatus.missing || [])];
  return {
    available: Boolean(database.ready && authStatus.configured),
    persistent: Boolean(database.ready),
    authConfigured: Boolean(authStatus.configured),
    requirements: [...new Set(missing)],
  };
}
