// VIRAAS private chat — 1:1 only, LOCKED until a mutual connection exists (enforced server-side).
//
// HONESTY: new messages arrive via POLLING (a short interval fetch), NOT a realtime socket.
// Messages and unread state are persisted in PostgreSQL. There are no group chats, no AI replies,
// and no fabricated messages.
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { social, timeAgo, type ChatMessage, type ConversationSummary, type Profile } from '../lib/social';
import { useMe, Avatar, ReportDialog, ConnectUnavailable } from '../components/social';

export default function ChatList() {
  const { me, loading, available } = useMe();
  const [items, setItems] = useState<ConversationSummary[]>([]);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!me) return;
    let alive = true;
    const tick = () => social.conversations().then((r) => { if (alive) { setItems(r.conversations); setReady(true); } }).catch(() => setReady(true));
    tick();
    const iv = setInterval(tick, 5000);
    return () => { alive = false; clearInterval(iv); };
  }, [me]);
  if (loading) return <div className="container vc-page"><p className="muted">Loading…</p></div>;
  if (!available) return <ConnectUnavailable title="VIRAAS Connect chats" />;
  if (!me) return <div className="container vc-page"><p className="muted">Please <Link to="/connect">sign in to VIRAAS Connect</Link> to see your chats.</p></div>;
  return (
    <div className="container vc-page">
      <div className="vc-header">
        <h1>Chats</h1>
        <Link to="/connect" className="btn sm">Find people</Link>
      </div>
      {!ready ? <p className="muted">Loading conversations…</p> : items.length === 0 ? (
        <p className="muted">No conversations yet. When you and someone both accept a connect request, a private chat opens here.</p>
      ) : (
        <div className="vc-list">{items.map((c) => (
          <Link className="vc-card vc-chatrow" key={c.conversationId} to={`/chat/${c.conversationId}`}>
            <span className="vc-card-main">
              <Avatar profile={c.user} />
              <span className="vc-card-txt">
                <strong>{c.user.displayName}</strong>
                <span className="muted vc-preview">
                  {c.lastMessage ? `${c.lastMessage.senderId === 'me' ? 'You: ' : ''}${c.lastMessage.text}` : 'Say hello'}
                </span>
              </span>
            </span>
            <span className="vc-chatmeta">
              {c.lastMessageAt && <span className="muted">{timeAgo(c.lastMessageAt)}</span>}
              {c.unread > 0 && <span className="vc-unread">{c.unread}</span>}
            </span>
          </Link>
        ))}</div>
      )}
    </div>
  );
}

export function Conversation() {
  const { conversationId = '' } = useParams();
  const { me, loading, available } = useMe();
  const [other, setOther] = useState<Profile | null>(null);
  const [msgs, setMsgs] = useState<ChatMessage[]>([]);
  const [text, setText] = useState('');
  const [err, setErr] = useState('');
  const [ready, setReady] = useState(false);
  const [menu, setMenu] = useState(false);
  const [reporting, setReporting] = useState(false);
  const nav = useNavigate();
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!me) return;
    let alive = true;
    const tick = async () => {
      try {
        const r = await social.messages(conversationId);
        if (!alive) return;
        setOther(r.conversation.user);
        setMsgs(r.messages);
        setReady(true);
        social.markRead(conversationId).catch(() => {});
      } catch (e) { if (alive) { setErr((e as Error).message); setReady(true); } }
    };
    tick();
    const iv = setInterval(tick, 3000);
    return () => { alive = false; clearInterval(iv); };
  }, [me, conversationId]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs.length]);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = text.trim();
    if (!body) return;
    setText('');
    try {
      const r = await social.send(conversationId, body);
      setMsgs((prev) => [...prev, r.message]);
    } catch (e2) { setErr((e2 as Error).message); }
  };

  if (loading) return <div className="container vc-page"><p className="muted">Loading…</p></div>;
  if (!available) return <ConnectUnavailable title="VIRAAS Connect chats" />;
  if (!me) return <div className="container vc-page"><p className="muted">Please <Link to="/connect">sign in</Link> to chat.</p></div>;
  if (err && !other) return (
    <div className="container vc-page">
      <p className="vc-err">{err}</p>
      <p className="muted">You can only open a private chat with a connected user.</p>
      <Link to="/chat" className="btn sm">Back to chats</Link>
    </div>
  );

  return (
    <div className="vc-thread">
      <div className="vc-thread-head">
        <Link to="/chat" className="vc-back">←</Link>
        {other && (
          <Link to={`/connect/u/${other.viraasId}`} className="vc-thread-user">
            <Avatar profile={other} size={38} />
            <span><strong>{other.displayName}</strong><span className="muted">@{other.viraasId}</span></span>
          </Link>
        )}
        <div className="vc-thread-menu">
          <button className="icon-btn" aria-label="Conversation options" onClick={() => setMenu((m) => !m)}>⋯</button>
          {menu && other && (
            <div className="vc-menu">
              <button onClick={() => { setMenu(false); setReporting(true); }}>Report</button>
              <button onClick={async () => { await social.block(other.viraasId); nav('/chat'); }}>Block &amp; disconnect</button>
            </div>
          )}
        </div>
      </div>

      <div className="vc-messages">
        {!ready ? <p className="muted vc-center">Loading…</p> : msgs.length === 0 ? (
          <p className="muted vc-center">This is the beginning of your private conversation. Messages are visible only to the two of you.</p>
        ) : msgs.map((m) => (
          <div key={m.id} className={`vc-msg ${m.mine ? 'mine' : 'theirs'}`}>
            <span className="vc-bubble">{m.text}</span>
            <span className="vc-msgmeta">{timeAgo(m.createdAt)}{m.mine && (m.read ? ' · Read' : ' · Sent')}</span>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <form className="vc-composer" onSubmit={send}>
        <input value={text} onChange={(e) => setText(e.target.value)} maxLength={2000} placeholder="Message…" aria-label="Message" />
        <button className="btn btn-accent sm" type="submit" disabled={!text.trim()}>Send</button>
      </form>
      {reporting && other && <ReportDialog viraasId={other.viraasId} onClose={() => setReporting(false)} />}
    </div>
  );
}
