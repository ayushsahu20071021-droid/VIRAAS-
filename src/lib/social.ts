// VIRAAS Connect API client and public profile types. Browser code only sends cookies implicitly;
// it never reads or stores access tokens, provider keys, or database credentials.
export type Relation =
  | 'self' | 'none' | 'request_sent' | 'request_received' | 'connected' | 'declined' | 'blocked' | 'unavailable';

export interface ConnectStatus {
  ok: true;
  available: boolean;
  persistent: boolean;
  authConfigured: boolean;
  mode: 'postgres' | 'unavailable';
  requirements: string[];
}

export interface Profile {
  viraasId: string;
  displayName: string;
  age: number;
  is18Plus: boolean;
  gender: 'male' | 'female' | 'nonbinary' | 'other';
  state: string;
  city: string;
  locality: string;
  bio: string;
  profilePhoto: string | null;
  avatarSeed: string;
  createdAt: string;
  updatedAt: string;
  self?: boolean;
  relation?: Relation;
  requestId?: string;
  visibility?: 'public' | 'connections' | 'hidden';
}
export interface IncomingRequest { id: string; from: Profile; createdAt: string }
export interface OutgoingRequest { id: string; to: Profile; createdAt: string }
export interface ConnectionItem { connectionId: string; user: Profile; since: string }
export interface ConversationSummary {
  conversationId: string;
  user: Profile;
  lastMessage: { id: string; text: string; senderId: 'me' | 'other'; createdAt: string } | null;
  lastMessageAt: string | null;
  unread: number;
}
export interface ChatMessage { id: string; text: string; senderId: 'me' | 'other'; mine: boolean; createdAt: string; read: boolean }

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api/social${path}`, {
    credentials: 'include',
    headers: init?.body ? { 'Content-Type': 'application/json', ...(init.headers || {}) } : init?.headers,
    ...init,
  });
  let data: any = null;
  try { data = await res.json(); } catch { /* non-JSON */ }
  if (!res.ok || (data && data.ok === false)) throw new Error((data && data.message) || `Request failed (${res.status}).`);
  return data as T;
}

async function authReq<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api/auth${path}`, {
    credentials: 'include',
    headers: init?.body ? { 'Content-Type': 'application/json', ...(init.headers || {}) } : init?.headers,
    ...init,
  });
  let data: any = null;
  try { data = await res.json(); } catch { /* non-JSON */ }
  if (!res.ok || (data && data.ok === false)) throw new Error((data && data.message) || `Request failed (${res.status}).`);
  return data as T;
}
const post = (p: string, body?: unknown) => req(p, { method: 'POST', body: body ? JSON.stringify(body) : undefined });
const authPost = (p: string, body?: unknown) => authReq(p, { method: 'POST', body: body ? JSON.stringify(body) : undefined });

export const auth = {
  status: () => authReq<{ ok: true; configured: boolean; provider: 'supabase-email-password'; methods: string[]; requirements: string[] }>('/status'),
  me: () => authReq<{ ok: true; authenticated: boolean; email: string | null; unavailable?: boolean }>('/me'),
  signup: (email: string, password: string) => authPost('/signup', { email, password }) as Promise<{ ok: true; authenticated: boolean; confirmationRequired: boolean; message: string }>,
  login: (email: string, password: string) => authPost('/login', { email, password }) as Promise<{ ok: true; authenticated: true; message: string }>,
  logout: () => authPost('/logout'),
};

export const social = {
  status: () => req<ConnectStatus>('/status'),
  me: () => req<{ ok: true; authenticated: boolean; email?: string | null; me: Profile | null }>('/me'),
  createId: (p: { dateOfBirth: string; adultConfirmed: boolean; displayName: string; bio?: string; gender: Profile['gender']; state: string; city: string; locality: string; profilePhoto?: string; visibility?: Profile['visibility'] }) =>
    post('/session', p) as Promise<{ ok: true; me: Profile }>,
  updateMe: (p: Partial<Pick<Profile, 'displayName' | 'bio' | 'state' | 'city' | 'locality' | 'profilePhoto' | 'visibility'>>) =>
    req<{ ok: true; me: Profile }>('/me', { method: 'PATCH', body: JSON.stringify(p) }),

  search: (q = '') => req<{ ok: true; users: Profile[] }>(`/users?q=${encodeURIComponent(q)}`),
  profile: (viraasId: string) => req<{ ok: true; profile: Profile }>(`/users/${encodeURIComponent(viraasId)}`),

  connect: (viraasId: string) => post(`/connect/${encodeURIComponent(viraasId)}`) as Promise<{ ok: true; relation: Relation; requestId?: string }>,
  requests: () => req<{ ok: true; incoming: IncomingRequest[]; outgoing: OutgoingRequest[] }>('/requests'),
  accept: (id: string) => post(`/requests/${encodeURIComponent(id)}/accept`),
  decline: (id: string) => post(`/requests/${encodeURIComponent(id)}/decline`),
  connections: () => req<{ ok: true; connections: ConnectionItem[] }>('/connections'),
  disconnect: (connectionId: string) => req(`/connections/${encodeURIComponent(connectionId)}`, { method: 'DELETE' }),

  conversations: () => req<{ ok: true; conversations: ConversationSummary[] }>('/conversations'),
  conversationWith: (viraasId: string) => req<{ ok: true; conversationId: string }>(`/conversations/with/${encodeURIComponent(viraasId)}`),
  messages: (id: string) => req<{ ok: true; conversation: { conversationId: string; user: Profile }; messages: ChatMessage[] }>(`/conversations/${encodeURIComponent(id)}/messages`),
  send: (id: string, text: string) => post(`/conversations/${encodeURIComponent(id)}/messages`, { text }) as Promise<{ ok: true; message: ChatMessage }>,
  markRead: (id: string) => post(`/conversations/${encodeURIComponent(id)}/read`),

  block: (viraasId: string) => post(`/block/${encodeURIComponent(viraasId)}`),
  unblock: (viraasId: string) => req(`/block/${encodeURIComponent(viraasId)}`, { method: 'DELETE' }),
  reportCategories: () => req<{ ok: true; categories: string[] }>('/report/categories'),
  report: (viraasId: string, category: string, details: string) => post(`/report/${encodeURIComponent(viraasId)}`, { category, details }),
};

export function avatarColor(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return `hsl(${h % 360} 45% 42%)`;
}
export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase() || name.slice(0, 2).toUpperCase();
}
export function timeAgo(iso: string | null): string {
  if (!iso) return '';
  const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  if (s < 604800) return `${Math.floor(s / 86400)}d`;
  return new Date(iso).toLocaleDateString();
}
