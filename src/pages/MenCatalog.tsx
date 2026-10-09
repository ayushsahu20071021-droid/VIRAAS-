import { Link, useParams, useSearchParams } from 'react-router-dom';
import {
  MEN_LOOK_TOTAL,
  MEN_LOOKS,
  menGarmentCategories,
  menLookById,
  menOccasionLabel,
  menOccasions,
  resolveMenCatalogFilter,
  type MenLook,
} from '../lib/menCatalog';
import { categoriesWithinOccasion, categoryHref, garmentKeyOf } from '../lib/catalogCategories';
import { ImageFrame, SaveButton } from '../components/ui';
import { menLookDetail, DETAIL_FIELDS } from '../lib/lookDetails';
import menFinalImages from '../data/men-final-images.json';
import menLookAffiliate from '../data/men-look-affiliate.json';
import { useTryOnAvailable } from '../lib/tryOnStatus';

const finalImages = menFinalImages as Record<string, string>;
const lookAff = menLookAffiliate as Record<string, { affiliateUrl: string; affiliateSource: string } | undefined>;
const shopUrl = (id: string) => { const a = lookAff[id]; return a?.affiliateSource === 'wishlink' && /^https:\/\/(?:www\.)?wishlink\.com\/share\/[^/?#]+(?:[?#].*)?$/.test(a.affiliateUrl) ? a.affiliateUrl : ''; };
const MEN_LIVE_COUNT = MEN_LOOKS.filter((l) => finalImages[l.id]).length;

function LookCard({ look, tryOnAvailable }: { look: MenLook; tryOnAvailable: boolean }) {
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
        {tryOnAvailable && <Link className="btn btn-accent sm" to={`/try-on?menLook=${look.id}`}>Try it on</Link>}
        <Link to={`/men-look/${look.id}`} className="link-arrow">View outfit details →</Link>
      </div>
    </div>
  </article>;
}

const CATALOG_BASE = '/men';

export default function MenCatalog() {
  const tryOnAvailable = useTryOnAvailable();
  const { category } = useParams();
  const [params, setParams] = useSearchParams();
  const q = params.get('q')?.trim().toLowerCase() ?? '';
  // `/men/:category` accepts an occasion slug (garba, college-fest, …) or a garment-category
  // slug derived from the looks themselves. Anything else stays unresolved on purpose.
  const filter = resolveMenCatalogFilter(category, { occasion: params.get('occasion'), category: params.get('category') });
  const { occasion, garmentType, unresolved, requested } = filter;
  const filtered = unresolved ? [] : MEN_LOOKS.filter((look) => (!occasion || look.occasion === occasion) && (!garmentType || garmentKeyOf(look) === garmentType) && (!q || `${look.id} ${look.referenceId} ${look.outfitDescription} ${look.garmentType} ${look.colors.primary}`.toLowerCase().includes(q)));
  const heading = [occasion ? menOccasionLabel(occasion) : '', garmentType].filter(Boolean).join(' · ');
  // Category chips are recounted for the active occasion, so the page never offers an empty pair.
  const visibleCategories = categoriesWithinOccasion(MEN_LOOKS, menGarmentCategories, occasion);
  return <div className="page men-catalog">
    <div className="page-head">
      <div className="crumbs"><Link to="/">Home</Link> / <Link to="/men">Men</Link>{heading && <> / {heading}</>}</div>
      <div className="kicker">The Men edit</div>
      <h1>{heading || 'Men'}</h1>
      <p className="muted">{MEN_LOOK_TOTAL} festive looks — kurtas, ethnic shirts, jackets and separates, styled for Garba, Diwali and every celebration.</p>
    </div>
    <div className="men-catalog-toolbar">
      <div className="men-occasion-tabs"><Link className={!occasion && !garmentType && !unresolved ? 'active' : ''} to="/men">All · {MEN_LOOK_TOTAL}</Link>{menOccasions.map((o) => <Link key={o.slug} className={occasion === o.slug ? 'active' : ''} to={`/men/${o.slug}`}>{o.label} <span>{o.range}</span></Link>)}</div>
      <input value={q} onChange={(e) => { const v = e.target.value; const next = new URLSearchParams(params); if (v) next.set('q', v); else next.delete('q'); setParams(next, { replace: true }); }} placeholder="Search look ID, reference or outfit detail" aria-label="Search Men looks" />
    </div>
    <div className="men-category-row">
      <span className="men-filter-label">Categories</span>
      <div className="men-category-tabs">
        {garmentType && <Link to={occasion ? `${CATALOG_BASE}/${occasion}` : CATALOG_BASE}>All categories</Link>}
        {visibleCategories.map((entry) => <Link key={entry.slug} className={garmentType === entry.label ? 'active' : ''} to={categoryHref(CATALOG_BASE, entry.slug, params, occasion)}>{entry.label} <span>{entry.count}</span></Link>)}
      </div>
    </div>
    <div className="men-catalog-summary"><strong>{filtered.length}</strong> of {MEN_LOOK_TOTAL} looks</div>
    {filtered.length ? <div className="men-look-grid">{filtered.map((look) => <LookCard key={look.id} look={look} tryOnAvailable={tryOnAvailable} />)}</div> : <div className="empty"><h3>No Men looks match</h3>{unresolved && requested && <p className="muted small">“{requested}” has no Men looks yet, so nothing is invented for it. Browse the categories above instead.</p>}<Link className="btn btn-dark" to="/men">Clear filters</Link></div>}
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
        <div className="row" aria-label="Men look actions">
          <SaveButton kind="look" id={look.id} image={src} />
          {src && <Link className="btn btn-accent" to={`/try-on?menLook=${look.id}`}>Try On</Link>}
          {shopUrl(look.id) && <a className="btn btn-shop" href={shopUrl(look.id)} target="_blank" rel="noopener noreferrer nofollow sponsored">View retailer</a>}
          <Link className="btn btn-dark" to={`/men/${look.occasion}`}>Browse {menOccasionLabel(look.occasion)}</Link>
        </div>
      </div>
    </div>
  </div>;
}
