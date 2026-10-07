// VIRAAS Connect hub — create a VIRAAS ID, discover people, manage connection requests & connections.
// This is the human social layer (NOT an AI assistant). Private chat lives in Chat.tsx and only opens
// after a mutual connection.
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { auth, social, timeAgo, type Profile, type IncomingRequest, type OutgoingRequest, type ConnectionItem, type Relation } from '../lib/social';
import { useMe, AuthPanel, Avatar, ConnectButton, ProfileCard, ReportDialog, ConnectUnavailable } from '../components/social';
import { ProfilePhotoUpload } from '../components/ProfilePhotoUpload';
import { prepareProfilePhoto } from '../lib/profilePhoto';

function Onboarding({ onDone }: { onDone: (p: Profile) => void }) {
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [adultConfirmed, setAdultConfirmed] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [gender, setGender] = useState<Profile['gender']>('female');
  const [bio, setBio] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [locality, setLocality] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const previewRef = useRef('');
  const [visibility, setVisibility] = useState<'public' | 'connections' | 'hidden'>('public');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const adultBoundary = new Date();
  adultBoundary.setFullYear(adultBoundary.getFullYear() - 18);
  const maxBirthDate = `${adultBoundary.getFullYear()}-${String(adultBoundary.getMonth() + 1).padStart(2, '0')}-${String(adultBoundary.getDate()).padStart(2, '0')}`;
  const selectPhoto = (file: File) => {
    if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    previewRef.current = URL.createObjectURL(file);
    setPhotoPreview(previewRef.current);
    setPhotoFile(file);
  };
  const removePhoto = () => {
    if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    previewRef.current = '';
    setPhotoPreview('');
    setPhotoFile(null);
  };
  useEffect(() => () => { if (previewRef.current) URL.revokeObjectURL(previewRef.current); }, []);
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setErr(''); setBusy(true);
    try {
      let profilePhoto = '';
      if (photoFile) {
        const image = await prepareProfilePhoto(photoFile);
        const uploaded = await social.uploadProfilePhoto(image);
        profilePhoto = uploaded.url;
      }
      const r = await social.createId({ dateOfBirth, adultConfirmed, displayName, gender, bio, state, city, locality, profilePhoto, visibility });
      onDone(r.me);
    } catch (e) { setErr((e as Error).message); } finally { setBusy(false); }
  };
  return (
    <div className="vc-onboard">
      <h1>VIRAAS Connect</h1>
      <p className="lead">Complete your adult profile to get a stable VIRAAS ID, discover eligible fashion lovers, and chat privately after you both accept a request.</p>
      <p className="muted">Creating a public Connect profile is optional and for adults only. You can continue browsing without a public profile. <Link to="/women">Continue browsing</Link>.</p>
      <form className="vc-form" onSubmit={submit}>
        <label className="vc-label">Display name<span className="req">*</span>
          <input required maxLength={60} value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Riya Sharma" autoComplete="name" />
        </label>
        <label className="vc-label">Date of birth<span className="req">*</span>
          <input type="date" required max={maxBirthDate} value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} autoComplete="bday" />
          <small className="muted">VIRAAS Connect is for adults 18+. Your date of birth is checked by the server and not stored.</small>
        </label>
        <label className="vc-check"><input type="checkbox" checked={adultConfirmed} onChange={(event) => setAdultConfirmed(event.target.checked)} required /> <span>I confirm that I am 18 or older.</span></label>
        <label className="vc-label">Gender for adult discovery<span className="req">*</span>
          <select value={gender} onChange={(e) => setGender(e.target.value as Profile['gender'])}>
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="nonbinary">Non-binary</option>
            <option value="other">Another identity</option>
          </select>
          <small className="muted">Male and female profiles discover each other. Other identities are shown profiles with a different gender. You can hide your profile at any time.</small>
        </label>
        <label className="vc-label">Bio (optional)
          <textarea value={bio} rows={2} maxLength={500} onChange={(e) => setBio(e.target.value)} placeholder="Loves lehengas & Navratri nights" />
        </label>
        <div className="vc-form-2">
          <label className="vc-label">Locality<span className="req">*</span>
            <input required maxLength={100} value={locality} onChange={(e) => setLocality(e.target.value)} placeholder="Vijay Nagar" autoComplete="address-level3" />
            <small className="muted">Locality only — no house, street, PIN code or GPS.</small>
          </label>
          <label className="vc-label">City<span className="req">*</span>
            <input required maxLength={80} value={city} onChange={(e) => setCity(e.target.value)} placeholder="Jabalpur" autoComplete="address-level2" />
          </label>
        </div>
        <label className="vc-label">State<span className="req">*</span>
          <input required maxLength={80} value={state} onChange={(e) => setState(e.target.value)} placeholder="Madhya Pradesh" autoComplete="address-level1" />
        </label>
        <ProfilePhotoUpload preview={photoPreview} disabled={busy} onSelect={selectPhoto} onRemove={removePhoto} />
        <label className="vc-label">Profile visibility
          <select value={visibility} onChange={(e) => setVisibility(e.target.value as 'public' | 'connections' | 'hidden')}>
            <option value="public">Public — discoverable by eligible adults</option>
            <option value="connections">Connections only</option>
            <option value="hidden">Hidden — not discoverable</option>
          </select>
        </label>
        {err && <p className="vc-err" role="alert">{err}</p>}
        <button className="btn btn-accent" type="submit" disabled={busy || !dateOfBirth || !adultConfirmed || !displayName || !locality || !city || !state}>{busy ? 'Creating…' : 'Create my VIRAAS ID'}</button>
        <p className="muted vc-fineprint">Your exact date of birth and email are not shown or stored in your Connect profile. Your generated VIRAAS ID stays stable.</p>
      </form>
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
      <input className="vc-search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by VIRAAS ID, e.g. @riya123…" autoCapitalize="none" />
      {loading ? <p className="muted">Loading…</p> : users.length === 0 ? (
        <p className="muted">{q.trim() ? 'No eligible adult profile matches that VIRAAS ID.' : 'No eligible adult profiles to show yet. Check back soon.'}</p>
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

function ProfileVisibility({ me, onChange }: { me: Profile; onChange: (profile: Profile) => void }) {
  const [visibility, setVisibility] = useState<NonNullable<Profile['visibility']>>(me.visibility || 'public');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => { setVisibility(me.visibility || 'public'); }, [me.viraasId, me.visibility]);
  const update = async (next: NonNullable<Profile['visibility']>) => {
    setVisibility(next); setBusy(true); setError('');
    try {
      const result = await social.updateMe({ visibility: next });
      onChange(result.me);
    } catch (err) {
      setVisibility(me.visibility || 'public');
      setError((err as Error).message || 'Visibility could not be updated.');
    } finally { setBusy(false); }
  };
  return (
    <div className="vc-visibility">
      <label className="vc-label">Profile visibility
        <select aria-label="Profile visibility" value={visibility} disabled={busy} onChange={(event) => void update(event.target.value as NonNullable<Profile['visibility']>)}>
          <option value="public">Public — discoverable by eligible adults</option>
          <option value="connections">Connections only</option>
          <option value="hidden">Hidden — not discoverable</option>
        </select>
      </label>
      <p className="muted small">You can change this at any time. Hidden profiles do not appear in discovery.</p>
      {error && <p className="vc-err" role="alert">{error}</p>}
    </div>
  );
}

export default function Connect() {
  const { me, loading, available, authenticated, setMe, refresh, setAuthenticated } = useMe();
  const [tab, setTab] = useState<'discover' | 'requests' | 'connections'>('discover');
  if (loading) return <div className="container vc-page"><p className="muted">Loading VIRAAS Connect…</p></div>;
  if (!available) return <ConnectUnavailable />;
  if (!authenticated) return <div className="container vc-page"><AuthPanel onSuccess={refresh} /></div>;
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
          <button className="btn sm" onClick={async () => { await auth.logout(); setMe(null); setAuthenticated(false); }}>Sign out</button>
        </div>
      </div>
      <ProfileVisibility me={me} onChange={setMe} />
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
  const { me, loading, available } = useMe();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [err, setErr] = useState('');
  const [reporting, setReporting] = useState(false);
  const nav = useNavigate();
  const load = () => social.profile(viraasId).then((r) => setProfile(r.profile)).catch((e) => setErr((e as Error).message));
  useEffect(() => { if (me) load(); /* eslint-disable-next-line */ }, [viraasId, me]);
  if (loading) return <div className="container vc-page"><p className="muted">Loading…</p></div>;
  if (!available) return <ConnectUnavailable />;
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
          <div className="muted">@{profile.viraasId} · {profile.age}</div>
          <div className="muted">{profile.locality} · {profile.city}{profile.state ? `, ${profile.state}` : ''}</div>
          {profile.is18Plus && <span className="vc-pill">18+</span>}
        </div>
      </div>
      {profile.bio && <p className="vc-profile-bio">{profile.bio}</p>}
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
