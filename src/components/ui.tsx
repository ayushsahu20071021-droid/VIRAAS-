import { Link } from 'react-router-dom';
import { useState } from 'react';
import { type Product, type Couple, byId, worldName, coupleImageSrc } from '../lib/data';
import { formatINR, sumPrices } from '../lib/format';
import { useSaved, webShare, copyLink, whatsappUrl } from '../lib/saved';

/** Real image if QA-passed, otherwise a clearly labelled pending state (never a fake photo). */
export function ImageFrame({ src, alt, label, ratio = '3 / 4', eager = false, detail }: { src?: string; alt: string; label?: string; ratio?: string; eager?: boolean; detail?: string }) {
  const [broken, setBroken] = useState(false);
  if (src && !broken) {
    return (
      <div className="frame" style={{ aspectRatio: ratio }}>
        <img src={src} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async" onError={() => setBroken(true)} data-real-image="1" />
      </div>
    );
  }
  return (
    <div className="frame pending" style={{ aspectRatio: ratio }} data-pending-image="1" role="img" aria-label={`${alt} — image pending`}>
      <div className="pending-inner">
        <span className="pending-badge">{broken ? 'Image unavailable' : 'Image pending'}</span>
        <span className="pending-title">{label ?? alt}</span>
        {detail && <span className="pending-detail">{detail}</span>}
        <span className="pending-note">Final approved VIRAAS image will be added here</span>
      </div>
    </div>
  );
}

export function SaveButton({ kind, id, image, compact }: { kind: 'product' | 'couple'; id: string; image?: string; compact?: boolean }) {
  const { isSaved, toggle } = useSaved();
  const on = isSaved(kind, id);
  return (
    <button className={`save-btn ${on ? 'on' : ''} ${compact ? 'compact' : ''}`} aria-pressed={on} aria-label={on ? 'Remove from Saved Looks' : 'Save look'}
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(kind, id, image); }}>
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M12 21s-7.5-4.6-9.5-9.2C1.1 8.4 3.3 5 6.8 5c2 0 3.5 1.1 5.2 3 1.7-1.9 3.2-3 5.2-3 3.5 0 5.7 3.4 4.3 6.8C19.5 16.4 12 21 12 21z" fill={on ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.6" /></svg>
      {!compact && <span>{on ? 'Saved' : 'Save'}</span>}
    </button>
  );
}

export function ShopButton({ p, block }: { p: Product; block?: boolean }) {
  const href = p.affiliateUrl || p.merchantUrl;
  return (
    <div className={`shop-wrap ${block ? 'block' : ''}`}>
      <a className="btn btn-dark" href={href} target="_blank" rel="noopener noreferrer nofollow sponsored" data-merchant={p.merchant}>
        Shop on {p.merchant}
      </a>
      {!p.affiliateUrl && <span className="aff-note">Affiliate link not configured</span>}
    </div>
  );
}

export function ProductCard({ p }: { p: Product }) {
  return (
    <article className="pcard" data-product-id={p.id}>
      <Link to={`/product/${p.id}`} className="pcard-img">
        <ImageFrame src={p.imageUrl} alt={p.title} label={p.category} detail={`${p.colour} · ${p.embroidery}`} />
        <SaveButton kind="product" id={p.id} image={p.imageUrl} compact />
      </Link>
      <div className="pcard-body">
        <div className="pcard-merchant">{p.merchant}</div>
        <Link to={`/product/${p.id}`} className="pcard-title">{p.title}</Link>
        <div className="pcard-price">{formatINR(p.price)} <span className="muted small">approx.</span></div>
        <div className="tags">{[worldName(p.occasion[0]), ...p.styleTags.slice(0, 2)].map((t) => <span key={t} className="tag">{t}</span>)}</div>
        <div className="pcard-actions">
          {p.tryOnEnabled && <Link className="btn btn-ghost sm" to={`/try-on?product=${p.id}`}>Try On</Link>}
          <a className="btn btn-dark sm" href={p.affiliateUrl || p.merchantUrl} target="_blank" rel="noopener noreferrer nofollow sponsored">Shop</a>
        </div>
      </div>
    </article>
  );
}

export function ShareRow({ path, compact }: { path: string; compact?: boolean }) {
  const [msg, setMsg] = useState('');
  const url = typeof window !== 'undefined' ? window.location.origin + path : path;
  return (
    <div className={`share-row ${compact ? 'compact' : ''}`}>
      <button className="btn btn-ghost sm" onClick={async () => { const r = await webShare(url); if (r === 'unsupported') { const ok = await copyLink(url); setMsg(ok ? 'Link copied' : 'Copy failed'); } }}>Share</button>
      <button className="btn btn-ghost sm" onClick={async () => setMsg((await copyLink(url)) ? 'Link copied' : 'Copy failed')}>Copy link</button>
      <a className="btn btn-ghost sm" href={whatsappUrl(url)} target="_blank" rel="noopener noreferrer">WhatsApp</a>
      {msg && <span className="muted small" role="status">{msg}</span>}
    </div>
  );
}

export function CoupleCard({ c, large }: { c: Couple; large?: boolean }) {
  const her = c.herProductIds.map((id) => byId.get(id)).filter(Boolean) as Product[];
  const his = c.hisProductIds.map((id) => byId.get(id)).filter(Boolean) as Product[];
  const total = sumPrices([...her, ...his].map((p) => p.price));
  return (
    <article className={`ccard ${large ? 'large' : ''}`} data-couple-id={c.id}>
      <Link to={`/couple-edit/${c.id}`} className="ccard-img">
        <ImageFrame src={coupleImageSrc(c)} alt={`${c.title} — ${c.colourStory}`} label={c.title} detail={c.colourStory} ratio="3 / 4.3" />
        <span className="ccard-world">{worldName(c.world)}</span>
        <SaveButton kind="couple" id={c.id} image={coupleImageSrc(c)} compact />
      </Link>
      <div className="ccard-body">
        <Link to={`/couple-edit/${c.id}`} className="ccard-title">{c.title}</Link>
        <div className="muted small">{c.colourStory}</div>
        <div className="ccard-meta">
          <span>Her · {her.length} pieces</span><span>His · {his.length} pieces</span>
          {total !== null && <span className="strong">Look ≈ {formatINR(total)}</span>}
        </div>
        <Link to={`/couple-edit/${c.id}`} className="btn btn-dark sm">Style it together</Link>
      </div>
    </article>
  );
}

export function SectionHead({ kicker, title, to, cta }: { kicker?: string; title: string; to?: string; cta?: string }) {
  return (
    <div className="section-head">
      <div>{kicker && <div className="kicker">{kicker}</div>}<h2>{title}</h2></div>
      {to && <Link to={to} className="link-arrow">{cta ?? 'View all'} →</Link>}
    </div>
  );
}

export function Empty({ title, children }: { title: string; children?: React.ReactNode }) {
  return <div className="empty"><h3>{title}</h3>{children}</div>;
}
