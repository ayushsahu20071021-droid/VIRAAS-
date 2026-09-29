// Shared VIRAAS Connect UI atoms + the current-user hook. Kept separate so both the Connect hub and
// the Chat pages reuse the exact same avatar, connect-button and report dialog behaviour.
import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { social, avatarColor, initials, type Profile, type Relation } from '../lib/social';

// Loads the signed-in VIRAAS user (or null). `loading` distinguishes "checking" from "signed out".
export function useMe() {
  const [me, setMe] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const refresh = useCallback(async () => {
    try { const r = await social.me(); setMe(r.me); } catch { setMe(null); } finally { setLoading(false); }
  }, []);
  useEffect(() => { refresh(); }, [refresh]);
  return { me, loading, setMe, refresh };
}

export function Avatar({ profile, size = 44 }: { profile: Pick<Profile, 'displayName' | 'avatarSeed'>; size?: number }) {
  return (
    <span
      className="vc-avatar"
      style={{ width: size, height: size, background: avatarColor(profile.avatarSeed), fontSize: size * 0.38 }}
      aria-hidden
    >
      {initials(profile.displayName)}
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
        <button className="btn btn-accent sm" disabled={busy} onClick={() => act(() => social.connect(profile.viraasId), 'connected')}>Accept</button>
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
          <span className="muted">@{profile.viraasId}</span>
          {profile.bio && <span className="vc-bio">{profile.bio}</span>}
        </span>
      </Link>
      <ConnectButton profile={profile} onChange={onChange} />
    </div>
  );
}
