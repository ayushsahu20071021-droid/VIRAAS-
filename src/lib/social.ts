// VIRAAS Connect — browser API client + shared types.
//
// Talks to the server routes at /api/social (see server/social/routes.mjs). The session lives in an
// httpOnly cookie the browser sends automatically (credentials: 'include'); this file never sees or
// stores a token, a user id, or any secret. All authorization is enforced on the server.
//
// NOTE (honesty): messages are fetched by POLLING while a conversation is open. This is NOT realtime;
// a production build needs a WebSocket/SSE transport and a persistent database. See store.mjs.

export type Relation =
  | 'self' | 'none' | 'request_sent' | 'request_received' | 'connected' | 'blocked' | 'unavailable';

export interface Profile {
  viraasId: string;
  displayName: string;
  bio: string;
  city: string;
  avatarSeed: string;
  instagramHandle: string;
  createdAt: string;
  is18Plus: boolean;
  self?: boolean;
  relation?: Relation;
  visibility?: 'public' | 'connections';
}
export interface IncomingRequest { id: string; from: Profile; createdAt: string }
export interface OutgoingRequest { id: string; to: Profile; createdAt: string }
export interface ConnectionItem { connectionId: string; user: Profile; since: string }
export interface ConversationSummary {
  conversationId: string;
  user: Profile;
  lastMessage: { text: string; senderId: 'me' | 'them'; createdAt: string } | null;
  lastMessageAt: string | null;
  unread: number;
}
export interface ChatMessage { id: string; text: string; mine: boolean; createdAt: string; read: boolean }

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api/social${path}`, {
    credentials: 'include',
    headers: init?.body ? { 'Content-Type': 'application/json' } : undefined,
    ...init,
  });
  let data: any = null;
  try { data = await res.json(); } catch { /* non-JSON */ }
  if (!res.ok || (data && data.ok === false)) {
    const message = (data && data.message) || `Request failed (${res.status}).`;
    throw new Error(message);
  }
  return data as T;
}
const post = (p: string, body?: unknown) => req(p, { method: 'POST', body: body ? JSON.stringify(body) : undefined });

export const social = {
  me: () => req<{ ok: true; me: Profile | null }>('/me'),
  createId: (p: { viraasId: string; displayName?: string; bio?: string; city?: string; instagramHandle?: string; is18Plus: boolean; visibility?: 'public' | 'connections' }) =>
    post('/session', p) as Promise<{ ok: true; me: Profile }>,
  updateMe: (p: Partial<Pick<Profile, 'displayName' | 'bio' | 'city' | 'instagramHandle'>>) =>
    req<{ ok: true; me: Profile }>('/me', { method: 'PATCH', body: JSON.stringify(p) }),
  logout: () => post('/logout'),

  search: (q = '') => req<{ ok: true; users: Profile[] }>(`/users?q=${encodeURIComponent(q)}`),
  profile: (viraasId: string) => req<{ ok: true; profile: Profile }>(`/users/${encodeURIComponent(viraasId)}`),

  connect: (viraasId: string) => post(`/connect/${encodeURIComponent(viraasId)}`) as Promise<{ ok: true; relation: Relation }>,
  requests: () => req<{ ok: true; incoming: IncomingRequest[]; outgoing: OutgoingRequest[] }>('/requests'),
  accept: (id: string) => post(`/requests/${id}/accept`),
  decline: (id: string) => post(`/requests/${id}/decline`),
  connections: () => req<{ ok: true; connections: ConnectionItem[] }>('/connections'),
  disconnect: (connectionId: string) => req(`/connections/${connectionId}`, { method: 'DELETE' }),

  conversations: () => req<{ ok: true; conversations: ConversationSummary[] }>('/conversations'),
  conversationWith: (viraasId: string) => req<{ ok: true; conversationId: string }>(`/conversations/with/${encodeURIComponent(viraasId)}`),
  messages: (id: string) => req<{ ok: true; conversation: { id: string; user: Profile }; messages: ChatMessage[] }>(`/conversations/${id}/messages`),
  send: (id: string, text: string) => post(`/conversations/${id}/messages`, { text }) as Promise<{ ok: true; message: ChatMessage }>,
  markRead: (id: string) => post(`/conversations/${id}/read`),

  block: (viraasId: string) => post(`/block/${encodeURIComponent(viraasId)}`),
  unblock: (viraasId: string) => req(`/block/${encodeURIComponent(viraasId)}`, { method: 'DELETE' }),
  reportCategories: () => req<{ ok: true; categories: string[] }>('/report/categories'),
  report: (viraasId: string, category: string, details: string) => post(`/report/${encodeURIComponent(viraasId)}`, { category, details }),
};

// A tiny deterministic avatar (initials on a colour derived from avatarSeed) — no external service,
// no uploaded photos exposed. Used across Connect/Chat.
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
