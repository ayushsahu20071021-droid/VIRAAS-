import { Link, useParams, useSearchParams } from 'react-router-dom';
import { MEN_LOOKS, menLookById, menOccasionLabel, menOccasions, type MenLook } from '../lib/menCatalog';
import { ImageFrame } from '../components/ui';
import { menLookDetail, DETAIL_FIELDS } from '../lib/lookDetails';
import menFinalImages from '../data/men-final-images.json';
import menLookAffiliate from '../data/men-look-affiliate.json';

const finalImages = menFinalImages as Record<string, string>;
const lookAff = menLookAffiliate as Record<string, { affiliateUrl: string; affiliateSource: string } | undefined>;
const shopUrl = (id: string) => { const a = lookAff[id]; return a?.affiliateUrl || ''; };
const MEN_LIVE_COUNT = MEN_LOOKS.filter((l) => finalImages[l.id]).length;

function LookCard({ look }: { look: MenLook }) {
  return <article className="men-look-card" data-men-look-id={look.id}>
    <Link to={`/men-look/${look.id}`} className="men-look-image">
      <ImageFrame src={finalImages[look.id]} alt={`Men look ${look.referenceId} — ${look.garmentType}`} label={`Look ${look.id.replace('men-look-', '')}`} detail={`Reference ${look.referenceId}`} />
    </Link>
    <div className="men-look-body">
      <div className="kicker">{menOccasionLabel(look.occasion)}</div>
      <Link to={`/men-look/${look.id}`} className="men-look-title">Look {look.id.replace('men-look-', '')}</Link>
      <p>{look.outfitDescription.split('. Picked')[0]}.</p>
      <div className="men-look-meta"><span>{look.garmentType}</span><span>{look.colors.primary}</span></div>
      <div className="men-look-actions">
        <Link className="btn btn-ghost sm" to={`/try-on?menLook=${look.id}`}>Try this look</Link>
        <Link to={`/men-look/${look.id}`} className="link-arrow">View outfit details →</Link>
      </div>
    </div>
  </article>;
}

export default function MenCatalog() {
  const { category } = useParams();
  const [params, setParams] = useSearchParams();
  const q = params.get('q')?.trim().toLowerCase() ?? '';
  const occasion = category || params.get('occasion') || '';
  const filtered = MEN_LOOKS.filter((look) => (!occasion || look.occasion === occasion) && (!q || `${look.id} ${look.referenceId} ${look.outfitDescription} ${look.garmentType} ${look.colors.primary}`.toLowerCase().includes(q)));
  return <div className="page men-catalog">
    <div className="page-head">
      <div className="crumbs"><Link to="/">Home</Link> / <Link to="/men">Men</Link>{occasion && <> / {menOccasionLabel(occasion)}</>}</div>
      <div className="kicker">The Men edit</div>
      <h1>{occasion ? menOccasionLabel(occasion) : 'Men'}</h1>
      <p className="muted">210 festive looks — kurtas, ethnic shirts, jackets and separates, styled for Garba, Diwali and every celebration.</p>
    </div>
    <div className="men-catalog-toolbar">
      <div className="men-occasion-tabs"><Link className={!occasion ? 'active' : ''} to="/men">All · 210</Link>{menOccasions.map((o) => <Link key={o.slug} className={occasion === o.slug ? 'active' : ''} to={`/men/${o.slug}`}>{o.label} <span>{o.range}</span></Link>)}</div>
      <input value={q} onChange={(e) => { const v = e.target.value; const next = new URLSearchParams(params); if (v) next.set('q', v); else next.delete('q'); setParams(next, { replace: true }); }} placeholder="Search look ID, reference or outfit detail" aria-label="Search Men looks" />
    </div>
    <div className="men-catalog-summary"><strong>{filtered.length}</strong> of 210 looks</div>
    {filtered.length ? <div className="men-look-grid">{filtered.map((look) => <LookCard key={look.id} look={look} />)}</div> : <div className="empty"><h3>No Men looks match</h3><Link className="btn btn-dark" to="/men">Clear filters</Link></div>}
  </div>;
}

export function MenLookDetail() {
  const { id } = useParams();
  const look = id ? menLookById.get(id) : undefined;
  if (!look) return <div className="page"><div className="empty"><h3>Men look not found</h3><Link className="btn btn-dark" to="/men">Back to Men</Link></div></div>;
  const src = finalImages[look.id];
  return <div className="page men-detail">
    <div className="crumbs"><Link to="/">Home</Link> / <Link to="/men">Men</Link> / {look.id}</div>
    <div className="men-detail-grid"><ImageFrame src={src} alt={`Men look ${look.referenceId} — ${look.garmentType}`} label={`Look ${look.id.replace('men-look-', '')}`} detail={`Reference ${look.referenceId}`} ratio="3 / 4" fit="contain" />
      <div><div className="kicker">{menOccasionLabel(look.occasion)} · {look.referenceId}</div><h1>Look {look.id.replace('men-look-', '')}</h1><p className="men-detail-lead">{look.outfitDescription.split('. Picked')[0]}.</p>{(() => { const d = menLookDetail(look.id); return <dl className="specs">{DETAIL_FIELDS.map((f) => <div key={f.key}><dt>{f.label}</dt><dd>{d?.[f.key] ?? 'Not clearly visible in reference'}</dd></div>)}</dl>; })()}
        <div className="look-shop"><div className="kicker">Shop the look</div>{shopUrl(look.id) ? <a className="btn btn-shop" href={shopUrl(look.id)} target="_blank" rel="noopener noreferrer nofollow sponsored">Shop this look</a> : <button className="btn btn-shop" disabled aria-disabled="true">Shop this look</button>}</div>
        <div className="row">{src && <Link className="btn btn-accent" to={`/try-on?menLook=${look.id}`}>Try this look</Link>}<Link className="btn btn-dark" to={`/men/${look.occasion}`}>Browse {menOccasionLabel(look.occasion)}</Link></div>
      </div>
    </div>
  </div>;
}
