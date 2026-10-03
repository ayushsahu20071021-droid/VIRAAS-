// VIRAAS Connect hub — create a VIRAAS ID, discover people, manage connection requests & connections.
// This is the human social layer (NOT an AI assistant). Private chat lives in Chat.tsx and only opens
// after a mutual connection.
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { social, timeAgo, type Profile, type IncomingRequest, type OutgoingRequest, type ConnectionItem, type Relation } from '../lib/social';
import { useMe, Avatar, ConnectButton, ProfileCard, ReportDialog } from '../components/social';

function Onboarding({ onDone }: { onDone: (p: Profile) => void }) {
  const [viraasId, setViraasId] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [city, setCity] = useState('');
  const [instagramHandle, setInstagramHandle] = useState('');
  const [visibility, setVisibility] = useState<'public' | 'connections'>('public');
  const [age, setAge] = useState(false);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const submit = async () => {
    setErr(''); setBusy(true);
    try { const r = await social.createId({ viraasId, displayName, bio, city, instagramHandle, is18Plus: age, visibility }); onDone(r.me); }
    catch (e) { setErr((e as Error).message); } finally { setBusy(false); }
  };
  return (
    <div className="vc-onboard">
      <h1>VIRAAS Connect</h1>
      <p className="lead">Claim your VIRAAS ID to meet fellow festive-fashion lovers, send a connect request, and — once you both accept — chat privately, one to one.</p>
      <div className="vc-form">
        <label className="vc-label">VIRAAS ID<span className="req">*</span>
          <input value={viraasId} onChange={(e) => setViraasId(e.target.value)} placeholder="e.g. riya.sharma" autoCapitalize="none" />
          <small className="muted">4–24 letters, numbers, dot or underscore. This is public.</small>
        </label>
        <label className="vc-label">Display name
          <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Riya Sharma" />
        </label>
        <label className="vc-label">Bio
          <textarea value={bio} rows={2} maxLength={240} onChange={(e) => setBio(e.target.value)} placeholder="Loves lehengas & Navratri nights" />
        </label>
        <div className="vc-form-2">
          <label className="vc-label">City
            <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Ahmedabad" />
          </label>
          <label className="vc-label">Instagram (optional)
            <input value={instagramHandle} onChange={(e) => setInstagramHandle(e.target.value)} placeholder="@handle" autoCapitalize="none" />
            <small className="muted">Just a public handle — Instagram is never the chat backend.</small>
          </label>
        </div>
        <label className="vc-label">Profile visibility
          <select value={visibility} onChange={(e) => setVisibility(e.target.value as 'public' | 'connections')}>
            <option value="public">Public — discoverable by everyone</option>
            <option value="connections">Connections only — hidden from discovery</option>
          </select>
        </label>
        <label className="vc-check">
          <input type="checkbox" checked={age} onChange={(e) => setAge(e.target.checked)} />
          <span>I confirm I am 18 years or older. VIRAAS Connect is for adults only.</span>
        </label>
        {err && <p className="vc-err">{err}</p>}
        <button className="btn btn-accent" disabled={busy || !viraasId || !age} onClick={submit}>Create my VIRAAS ID</button>
        <p className="muted vc-fineprint">Your date of birth, email and private conversations are never shown on your public profile.</p>
      </div>
    </div>
  );
}

function Discover() {
  const [q, setQ] = useState('');
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const load = (term: string) => { setLoading(true); social.search(term).then((r) => setUsers(r.users)).catch(() => setUsers([])).finally(() => setLoading(false)); };
  useEffect(() => { const t = setTimeout(() => load(q), 200); return () => clearTimeout(t); }, [q]);
  const patch = (viraasId: string, rel: Relation) => setUsers((prev) => prev.map((u) => (u.viraasId === viraasId ? { ...u, relation: rel } : u)));
  return (
    <div>
      <input className="vc-search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search VIRAAS IDs or names…" autoCapitalize="none" />
      {loading ? <p className="muted">Loading…</p> : users.length === 0 ? (
        <p className="muted">No one to show yet. Invite friends to claim a VIRAAS ID, or check back soon.</p>
      ) : (
        <div className="vc-list">{users.map((u) => <ProfileCard key={u.viraasId} profile={u} onChange={(r) => patch(u.viraasId, r)} />)}</div>
      )}
    </div>
  );
}

function Requests() {
  const [incoming, setIncoming] = useState<IncomingRequest[]>([]);
  const [outgoing, setOutgoing] = useState<OutgoingRequest[]>([]);
  const load = () => social.requests().then((r) => { setIncoming(r.incoming); setOutgoing(r.outgoing); }).catch(() => {});
  useEffect(() => { load(); }, []);
  const respond = async (id: string, accept: boolean) => { await (accept ? social.accept(id) : social.decline(id)); load(); };
  return (
    <div>
      <h3 className="vc-subhead">Requests received</h3>
      {incoming.length === 0 ? <p className="muted">No incoming requests.</p> : (
        <div className="vc-list">{incoming.map((r) => (
          <div className="vc-card" key={r.id}>
            <Link to={`/connect/u/${r.from.viraasId}`} className="vc-card-main">
              <Avatar profile={r.from} />
              <span className="vc-card-txt"><strong>{r.from.displayName}</strong><span className="muted">@{r.from.viraasId} · {timeAgo(r.createdAt)}</span></span>
            </Link>
            <span className="vc-btnrow">
              <button className="btn btn-accent sm" onClick={() => respond(r.id, true)}>Accept</button>
              <button className="btn sm" onClick={() => respond(r.id, false)}>Decline</button>
            </span>
          </div>
        ))}</div>
      )}
      <h3 className="vc-subhead">Requests sent</h3>
      {outgoing.length === 0 ? <p className="muted">No pending sent requests.</p> : (
        <div className="vc-list">{outgoing.map((r) => (
          <div className="vc-card" key={r.id}>
            <Link to={`/connect/u/${r.to.viraasId}`} className="vc-card-main">
              <Avatar profile={r.to} />
              <span className="vc-card-txt"><strong>{r.to.displayName}</strong><span className="muted">@{r.to.viraasId} · {timeAgo(r.createdAt)}</span></span>
            </Link>
            <span className="vc-pill muted">Pending</span>
          </div>
        ))}</div>
      )}
    </div>
  );
}

function Connections() {
  const [items, setItems] = useState<ConnectionItem[]>([]);
  const load = () => social.connections().then((r) => setItems(r.connections)).catch(() => {});
  useEffect(() => { load(); }, []);
  const nav = useNavigate();
  const openChat = async (viraasId: string) => { try { const r = await social.conversationWith(viraasId); nav(`/chat/${r.conversationId}`); } catch { /* ignore */ } };
  const remove = async (id: string) => { await social.disconnect(id); load(); };
  return items.length === 0 ? <p className="muted">No connections yet. Discover people and send a request.</p> : (
    <div className="vc-list">{items.map((c) => (
      <div className="vc-card" key={c.connectionId}>
        <Link to={`/connect/u/${c.user.viraasId}`} className="vc-card-main">
          <Avatar profile={c.user} />
          <span className="vc-card-txt"><strong>{c.user.displayName}</strong><span className="muted">@{c.user.viraasId} · connected {timeAgo(c.since)}</span></span>
        </Link>
        <span className="vc-btnrow">
          <button className="btn btn-dark sm" onClick={() => openChat(c.user.viraasId)}>Message</button>
          <button className="btn sm" onClick={() => remove(c.connectionId)}>Disconnect</button>
        </span>
      </div>
    ))}</div>
  );
}

export default function Connect() {
  const { me, loading, setMe } = useMe();
  const [tab, setTab] = useState<'discover' | 'requests' | 'connections'>('discover');
  if (loading) return <div className="container vc-page"><p className="muted">Loading VIRAAS Connect…</p></div>;
  if (!me) return <div className="container vc-page"><Onboarding onDone={setMe} /></div>;
  return (
    <div className="container vc-page">
      <div className="vc-header">
        <div className="vc-me">
          <Avatar profile={me} size={52} />
          <div><strong>{me.displayName}</strong><div className="muted">@{me.viraasId}</div></div>
        </div>
        <div className="vc-btnrow">
          <Link to="/chat" className="btn btn-dark sm">My Chats</Link>
          <button className="btn sm" onClick={async () => { await social.logout(); setMe(null); }}>Sign out</button>
        </div>
      </div>
      <div className="vc-tabs" role="tablist">
        {(['discover', 'requests', 'connections'] as const).map((t) => (
          <button key={t} role="tab" aria-selected={tab === t} className={`vc-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {t === 'discover' ? 'Discover' : t === 'requests' ? 'Requests' : 'Connections'}
          </button>
        ))}
      </div>
      <div className="vc-tabpanel">
        {tab === 'discover' && <Discover />}
        {tab === 'requests' && <Requests />}
        {tab === 'connections' && <Connections />}
      </div>
    </div>
  );
}

// Public profile view (/connect/u/:viraasId). Shows only public fields; offers Connect/Message plus
// Block and Report. Never shows DOB, email, or private conversations.
export function ConnectProfile() {
  const { viraasId = '' } = useParams();
  const { me, loading } = useMe();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [err, setErr] = useState('');
  const [reporting, setReporting] = useState(false);
  const nav = useNavigate();
  const load = () => social.profile(viraasId).then((r) => setProfile(r.profile)).catch((e) => setErr((e as Error).message));
  useEffect(() => { if (me) load(); /* eslint-disable-next-line */ }, [viraasId, me]);
  if (loading) return <div className="container vc-page"><p className="muted">Loading…</p></div>;
  if (!me) return <div className="container vc-page"><p className="muted">Please <Link to="/connect">sign in to VIRAAS Connect</Link> to view profiles.</p></div>;
  if (err) return <div className="container vc-page"><p className="vc-err">{err}</p><Link to="/connect" className="btn sm">Back</Link></div>;
  if (!profile) return <div className="container vc-page"><p className="muted">Loading…</p></div>;
  const rel = profile.relation ?? 'none';
  return (
    <div className="container vc-page vc-profile">
      <Link to="/connect" className="vc-back">← Connect</Link>
      <div className="vc-profile-head">
        <Avatar profile={profile} size={88} />
        <div>
          <h1>{profile.displayName}</h1>
          <div className="muted">@{profile.viraasId}{profile.city && ` · ${profile.city}`}</div>
          {profile.is18Plus && <span className="vc-pill">18+</span>}
        </div>
      </div>
      {profile.bio && <p className="vc-profile-bio">{profile.bio}</p>}
      {profile.instagramHandle && (
        <p className="muted">Instagram: @{profile.instagramHandle} <span className="vc-fineprint">(handle only — chat stays inside VIRAAS)</span></p>
      )}
      {!profile.self && (
        <div className="vc-btnrow vc-profile-actions">
          <ConnectButton profile={profile} onChange={(r) => setProfile({ ...profile, relation: r })} />
          {rel !== 'blocked' && (
            <button className="btn sm" onClick={async () => { await social.block(profile.viraasId); nav('/connect'); }}>Block</button>
          )}
          <button className="btn sm" onClick={() => setReporting(true)}>Report</button>
        </div>
      )}
      {reporting && <ReportDialog viraasId={profile.viraasId} onClose={() => setReporting(false)} />}
    </div>
  );
}
