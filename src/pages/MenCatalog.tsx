import { Link, useParams, useSearchParams } from 'react-router-dom';
import { MEN_LOOKS, menLookById, menOccasionLabel, menOccasions, type MenLook } from '../lib/menCatalog';
import { ImageFrame } from '../components/ui';

function PlaceholderCard({ look }: { look: MenLook }) {
  return <article className="men-look-card" data-men-look-id={look.id}>
    <Link to={`/men-look/${look.id}`} className="men-look-image">
      <ImageFrame alt={`${look.id} reference ${look.referenceId}`} label={`Look ${look.id.replace('men-look-', '')}`} detail={`Reference ${look.referenceId} · Final image placeholder`} />
    </Link>
    <div className="men-look-body">
      <div className="kicker">{menOccasionLabel(look.occasion)}</div>
      <Link to={`/men-look/${look.id}`} className="men-look-title">Look {look.id.replace('men-look-', '')}</Link>
      <p>{look.outfitDescription.split('. Picked')[0]}.</p>
      <div className="men-look-meta"><span>{look.garmentType}</span><span>{look.colors.primary}</span></div>
      <Link to={`/men-look/${look.id}`} className="link-arrow">View outfit details →</Link>
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
      <div className="kicker">The Men edit · 210 reference-driven looks</div>
      <h1>{occasion ? menOccasionLabel(occasion) : 'Men'}</h1>
      <p className="muted">Every look is mapped to one printed reference panel. Final approved images will be added later; this preview uses intentional image placeholders.</p>
    </div>
    <div className="men-catalog-toolbar">
      <div className="men-occasion-tabs"><Link className={!occasion ? 'active' : ''} to="/men">All · 210</Link>{menOccasions.map((o) => <Link key={o.slug} className={occasion === o.slug ? 'active' : ''} to={`/men/${o.slug}`}>{o.label} <span>{o.range}</span></Link>)}</div>
      <input value={q} onChange={(e) => { const v = e.target.value; const next = new URLSearchParams(params); if (v) next.set('q', v); else next.delete('q'); setParams(next, { replace: true }); }} placeholder="Search look ID, reference or outfit detail" aria-label="Search Men looks" />
    </div>
    <div className="men-catalog-summary"><strong>{filtered.length}</strong> of 210 looks · placeholders only · canonical mappings unchanged</div>
    {filtered.length ? <div className="men-look-grid">{filtered.map((look) => <PlaceholderCard key={look.id} look={look} />)}</div> : <div className="empty"><h3>No Men looks match</h3><Link className="btn btn-dark" to="/men">Clear filters</Link></div>}
  </div>;
}

export function MenLookDetail() {
  const { id } = useParams();
  const look = id ? menLookById.get(id) : undefined;
  if (!look) return <div className="page"><div className="empty"><h3>Men look not found</h3><Link className="btn btn-dark" to="/men">Back to Men</Link></div></div>;
  return <div className="page men-detail">
    <div className="crumbs"><Link to="/">Home</Link> / <Link to="/men">Men</Link> / {look.id}</div>
    <div className="men-detail-grid"><ImageFrame alt={`${look.id} reference ${look.referenceId}`} label={`Look ${look.id.replace('men-look-', '')}`} detail={`Reference ${look.referenceId} · Final image placeholder`} ratio="3 / 4" />
      <div><div className="kicker">{menOccasionLabel(look.occasion)} · {look.referenceId}</div><h1>Look {look.id.replace('men-look-', '')}</h1><p className="men-detail-lead">{look.outfitDescription.split('. Picked')[0]}.</p><dl className="specs"><div><dt>Garment</dt><dd>{look.garmentType}</dd></div><div><dt>Colour</dt><dd>{look.colors.primary}{look.colors.secondary?.length ? ` · ${look.colors.secondary.join(', ')}` : ''}</dd></div><div><dt>Pattern</dt><dd>{look.patternOrEmbroidery.pattern} · {look.patternOrEmbroidery.embroidery}</dd></div><div><dt>Layering</dt><dd>{look.layering ?? 'None recorded'}</dd></div><div><dt>Bottomwear</dt><dd>{look.bottomwear ?? 'Not recorded'}</dd></div><div><dt>Footwear</dt><dd>{look.footwear ?? 'Not recorded'}</dd></div><div><dt>Accessories</dt><dd>{look.accessories ?? 'Not recorded'}</dd></div></dl><p className="placeholder-callout">Final Men image placeholder · replace this reserved frame with the manually approved image later.</p><Link className="btn btn-dark" to={`/men/${look.occasion}`}>Browse {menOccasionLabel(look.occasion)}</Link></div>
    </div>
  </div>;
}
