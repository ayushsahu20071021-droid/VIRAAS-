// Shared VIRAAS Connect UI atoms + the current-user hook. Kept separate so both the Connect hub and
// the Chat pages reuse the exact same avatar, connect-button and report dialog behaviour.
import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, social, avatarColor, initials, type Profile, type Relation } from '../lib/social';

// Loads the signed-in VIRAAS user (or null). `loading` distinguishes "checking" from "signed out".
export function useMe() {
  const [me, setMe] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [available, setAvailable] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const refresh = useCallback(async () => {
    try {
      const status = await social.status();
      setAvailable(status.available);
      if (!status.available) { setMe(null); setAuthenticated(false); return; }
      const r = await social.me();
      setMe(r.me);
      setAuthenticated(r.authenticated);
    } catch {
      setAvailable(false);
      setMe(null);
      setAuthenticated(false);
    } finally { setLoading(false); }
  }, []);
  useEffect(() => { refresh(); }, [refresh]);
  return { me, loading, available, authenticated, setMe, refresh, setAuthenticated };
}

export function AuthPanel({ onSuccess }: { onSuccess: () => void | Promise<void> }) {
  const [mode, setMode] = useState<'login' | 'signup'>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [notice, setNotice] = useState('');
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setErr(''); setNotice(''); setBusy(true);
    try {
      if (mode === 'login') {
        await auth.login(email, password);
        await onSuccess();
      } else {
        const result = await auth.signup(email, password);
        if (result.authenticated) await onSuccess();
        else setNotice(result.message);
      }
    } catch (e) { setErr((e as Error).message); }
    finally { setBusy(false); }
  };
  return (
    <div className="vc-onboard">
      <h1>VIRAAS Connect</h1>
      <p className="lead">Sign in with email to create your VIRAAS account. Adults can create a discoverable Connect profile and chat privately after a request is accepted.</p>
      <form className="vc-form" onSubmit={submit}>
        <h2>{mode === 'signup' ? 'Create your VIRAAS account' : 'Welcome back'}</h2>
        <label className="vc-label">Email address
          <input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label className="vc-label">Password
          <input type="password" required minLength={mode === 'signup' ? 12 : 1} maxLength={128} autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} value={password} onChange={(e) => setPassword(e.target.value)} />
          {mode === 'signup' && <small className="muted">Use at least 12 characters.</small>}
        </label>
        {err && <p className="vc-err" role="alert">{err}</p>}
        {notice && <p className="vc-notice" role="status">{notice}</p>}
        <div className="vc-btnrow">
          <button className="btn btn-accent" type="submit" disabled={busy}>{busy ? 'Please wait…' : mode === 'signup' ? 'Create account' : 'Sign in'}</button>
          <button className="btn sm" type="button" onClick={() => { setMode(mode === 'signup' ? 'login' : 'signup'); setErr(''); setNotice(''); }}>
            {mode === 'signup' ? 'I already have an account' : 'Create an account'}
          </button>
        </div>
        <p className="muted vc-fineprint">VIRAAS Connect profiles are for adults 18 and older. No public profile is created until you complete adult onboarding.</p>
      </form>
    </div>
  );
}

export function ConnectUnavailable({ title = 'VIRAAS Connect' }: { title?: string }) {
  return (
    <div className="container vc-page">
      <div className="vc-onboard">
        <h1>{title}</h1>
        <p className="lead">Account creation, discovery and private chat are temporarily unavailable until secure sign-in and persistent account storage are ready.</p>
        <Link className="btn btn-dark" to="/women">Continue browsing</Link>
      </div>
    </div>
  );
}

export function Avatar({ profile, size = 44 }: { profile: Pick<Profile, 'displayName' | 'avatarSeed' | 'profilePhoto'>; size?: number }) {
  return (
    <span
      className="vc-avatar"
      style={{ width: size, height: size, background: avatarColor(profile.avatarSeed), fontSize: size * 0.38 }}
      aria-hidden
    >
      {profile.profilePhoto
        ? <img src={profile.profilePhoto} alt="" loading="lazy" referrerPolicy="no-referrer" />
        : initials(profile.displayName)}
    </span>
  );
}

// The Connect button reflects the exact relationship state and performs the correct action.
// Chat is never reachable from here unless the relation is `connected`.
export function ConnectButton({ profile, onChange }: { profile: Profile; onChange?: (r: Relation) => void }) {
  const rel = profile.relation ?? 'none';
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const nav = useNavigate();
  const act = async (fn: () => Promise<unknown>, next: Relation) => {
    setBusy(true); setErr('');
    try { await fn(); onChange?.(next); } catch (e) { setErr((e as Error).message); } finally { setBusy(false); }
  };
  if (rel === 'self') return null;
  if (rel === 'unavailable') return <span className="vc-pill muted">Unavailable</span>;
  if (rel === 'blocked')
    return <button className="btn sm" disabled={busy} onClick={() => act(() => social.unblock(profile.viraasId), 'none')}>Unblock</button>;
  if (rel === 'connected')
    return (
      <button className="btn btn-dark sm" onClick={async () => {
        try { const r = await social.conversationWith(profile.viraasId); nav(`/chat/${r.conversationId}`); } catch (e) { setErr((e as Error).message); }
      }}>Message</button>
    );
  if (rel === 'request_sent') return <span className="vc-pill muted">Request sent</span>;
  if (rel === 'request_received')
    return (
      <span className="vc-btnrow">
        <button className="btn btn-accent sm" disabled={busy || !profile.requestId} onClick={() => profile.requestId && act(() => social.accept(profile.requestId!), 'connected')}>Accept</button>
      </span>
    );
  return (
    <span>
      <button className="btn btn-accent sm" disabled={busy} onClick={() => act(() => social.connect(profile.viraasId), 'request_sent')}>Connect</button>
      {err && <span className="vc-err"> {err}</span>}
    </span>
  );
}

export function ReportDialog({ viraasId, onClose }: { viraasId: string; onClose: () => void }) {
  const [cats, setCats] = useState<string[]>([]);
  const [category, setCategory] = useState('');
  const [details, setDetails] = useState('');
  const [done, setDone] = useState(false);
  const [err, setErr] = useState('');
  useEffect(() => { social.reportCategories().then((r) => setCats(r.categories)).catch(() => {}); }, []);
  const submit = async () => {
    setErr('');
    try { await social.report(viraasId, category, details); setDone(true); } catch (e) { setErr((e as Error).message); }
  };
  return (
    <div className="vc-modal" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="vc-modal-body" onClick={(e) => e.stopPropagation()}>
        {done ? (
          <>
            <h3>Report received</h3>
            <p className="muted">Thank you. Our team will review this report. Your identity is not shared with the reported person.</p>
            <button className="btn btn-dark sm" onClick={onClose}>Close</button>
          </>
        ) : (
          <>
            <h3>Report @{viraasId}</h3>
            <p className="muted">Reports are confidential — the person you report is never told who reported them.</p>
            <label className="vc-label">Reason
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">Choose a reason…</option>
                {cats.map((c) => <option key={c} value={c}>{c[0].toUpperCase() + c.slice(1)}</option>)}
              </select>
            </label>
            <label className="vc-label">Details (optional)
              <textarea value={details} maxLength={1000} rows={3} onChange={(e) => setDetails(e.target.value)} placeholder="What happened?" />
            </label>
            {err && <p className="vc-err">{err}</p>}
            <div className="vc-btnrow">
              <button className="btn sm" onClick={onClose}>Cancel</button>
              <button className="btn btn-dark sm" disabled={!category} onClick={submit}>Submit report</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export function ProfileCard({ profile, onChange }: { profile: Profile; onChange?: (r: Relation) => void }) {
  return (
    <div className="vc-card">
      <Link to={`/connect/u/${profile.viraasId}`} className="vc-card-main">
        <Avatar profile={profile} />
        <span className="vc-card-txt">
          <strong>{profile.displayName}</strong>
          <span className="muted">@{profile.viraasId} · {profile.age}</span>
          <span className="muted">{profile.locality} · {profile.city}{profile.state ? `, ${profile.state}` : ''}</span>
          {profile.bio && <span className="vc-bio">{profile.bio}</span>}
        </span>
      </Link>
      <ConnectButton profile={profile} onChange={onChange} />
    </div>
  );
}
