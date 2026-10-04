import { Link } from 'react-router-dom';
import { useState } from 'react';
import { type Product, type Couple, byId, worldName, coupleImageSrc } from '../lib/data';
import { formatINR, sumPrices } from '../lib/format';
import { exactMerchantProductUrl, hasVerifiedPrice, productOutboundAction, tryOnHrefForProduct } from '../lib/productActions';
import { useSaved, webShare, copyLink, whatsappUrl } from '../lib/saved';
import { useTryOnAvailable } from '../lib/tryOnStatus';

/** Real image if QA-passed, otherwise a clearly labelled pending state (never a fake photo). */
export function ImageFrame({ src, alt, label, ratio = '3 / 4', eager = false, detail, fit = 'cover' }: { src?: string; alt: string; label?: string; ratio?: string; eager?: boolean; detail?: string; fit?: 'cover' | 'contain' }) {
  const [broken, setBroken] = useState(false);
  if (src && !broken) {
    return (
      <div className={`frame${fit === 'contain' ? ' frame-contain' : ''}`} style={{ aspectRatio: ratio }}>
        <img src={src} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async" onError={() => setBroken(true)} data-real-image="1" style={{ objectFit: fit }} />
      </div>
    );
  }
  return (
    <div className="frame pending" style={{ aspectRatio: ratio }} data-pending-image="1" role="img" aria-label={`${alt} — image pending`}>
      <div className="pending-inner">
        <span className="pending-badge">{broken ? 'Image unavailable' : 'Coming soon'}</span>
        <span className="pending-title">{label ?? alt}</span>
        {detail && <span className="pending-detail">{detail}</span>}
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

export function ProductActionButton({ p, block, small }: { p: Product; block?: boolean; small?: boolean }) {
  const action = productOutboundAction(p);
  if (!action) return null;
  const shop = action.label === 'Shop';
  return (
    <a
      className={`btn ${shop ? 'btn-shop' : 'btn-ghost'} ${small ? 'sm' : ''} ${block ? 'block' : ''}`}
      href={action.href}
      target="_blank"
      rel={shop ? 'noopener noreferrer nofollow sponsored' : 'noopener noreferrer'}
      data-merchant={p.merchant}
    >
      {action.label}
    </a>
  );
}

export function ProductCard({ p }: { p: Product }) {
  const tryOnAvailable = useTryOnAvailable();
  const tryOn = tryOnAvailable ? tryOnHrefForProduct(p) : undefined;
  const outbound = productOutboundAction(p);
  const exactMerchantUrl = exactMerchantProductUrl(p);
  const verifiedPrice = hasVerifiedPrice(p);
  return (
    <article className="pcard" data-product-id={p.id}>
      <Link to={`/product/${p.id}`} className="pcard-img">
        <ImageFrame src={p.imageUrl} alt={p.title} label={p.category} detail={`${p.colour} · ${p.embroidery}`} />
        <SaveButton kind="product" id={p.id} image={p.imageUrl} compact />
      </Link>
      <div className="pcard-body">
        {exactMerchantUrl && <div className="pcard-merchant">{p.merchant}</div>}
        <Link to={`/product/${p.id}`} className="pcard-title">{p.title}</Link>
        {verifiedPrice && <div className="pcard-price">{formatINR(p.price)}</div>}
        <div className="tags">{[worldName(p.occasion[0]), ...p.styleTags.slice(0, 2)].map((t) => <span key={t} className="tag">{t}</span>)}</div>
        {(tryOn || outbound) && <div className="pcard-actions">
          {tryOn && <Link className="btn btn-accent sm" to={tryOn}>Try it on</Link>}
          {outbound && <ProductActionButton p={p} small />}
        </div>}
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
  const outfitProducts = [...her, ...his];
  const total = outfitProducts.length > 0 && outfitProducts.every(hasVerifiedPrice)
    ? sumPrices(outfitProducts.map((p) => p.price))
    : null;
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

/** Card for an APPROVED look (Men/Women): always shows the real approved image. */
export function LookCard({ to, image, alt, kicker, title, meta, tryOnTo }: { to: string; image?: string; alt: string; kicker: string; title: string; meta?: string[]; tryOnTo?: string }) {
  const tryOnAvailable = useTryOnAvailable();
  return (
    <article className="men-look-card">
      <Link to={to} className="men-look-image"><ImageFrame src={image} alt={alt} label={title} /></Link>
      <div className="men-look-body">
        <div className="kicker">{kicker}</div>
        <Link to={to} className="men-look-title">{title}</Link>
        {meta && meta.length > 0 && <div className="men-look-meta">{meta.filter(Boolean).map((m) => <span key={m}>{m}</span>)}</div>}
        <div className="men-look-actions">
          {tryOnAvailable && tryOnTo && <Link className="btn btn-accent sm" to={tryOnTo}>Try it on</Link>}
          <Link to={to} className="link-arrow">View details →</Link>
        </div>
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
