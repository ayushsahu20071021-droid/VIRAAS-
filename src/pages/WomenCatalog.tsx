import { Link, useParams, useSearchParams } from 'react-router-dom';
import { womenLookById, womenOccasionLabel, womenOccasions, type WomenLook } from '../lib/womenCatalog';
import { ImageFrame, SaveButton } from '../components/ui';
import { womenLookDetail, DETAIL_FIELDS } from '../lib/lookDetails';
import womenPreviews from '../data/women-previews.client.json';
import { workbookLookForWomenId, workbookShopUrl } from '../lib/workbook';
import { useTryOnAvailable } from '../lib/tryOnStatus';

type WomenPreview = { qaStatus: string; approval: string; live: boolean; referenceId: string; src: string };
const previewStatus = womenPreviews as Record<string, WomenPreview | undefined>;
const previewSrc = (id: string) => {
  const status = previewStatus[id];
  return status?.live && status.src ? status.src : undefined;
};
export const WOMEN_LIVE_COUNT = Object.values(previewStatus).filter((status) => status?.live).length;

function Card({ look, tryOnAvailable }: { look: WomenLook; tryOnAvailable: boolean }) {
  const workbook = workbookLookForWomenId(look.id);
  const mappedCount = workbook?.look.components.filter((component) => workbookShopUrl(component)).length ?? 0;
  const path = `/women-look/${look.id}`;
  return (
    <article className="men-look-card women-look-card" data-women-look-id={look.id} data-workbook-component-count={mappedCount}>
      <Link to={path} className="men-look-image">
        <ImageFrame src={previewSrc(look.id)} alt={`Women look ${look.referenceId} — ${look.garmentType}`} label={`Look ${look.id.replace('women-look-', '')}`} detail={`Reference ${look.referenceId}`} />
      </Link>
      <div className="men-look-body">
        <div className="kicker">{womenOccasionLabel(look.occasion)}</div>
        <Link to={path} className="men-look-title">Look {look.id.replace('women-look-', '')}</Link>
        <p>{look.outfitDescription.split('. Picked')[0]}.</p>
        <div className="men-look-meta"><span>{look.garmentType}</span><span>{look.colors.primary}</span></div>
        {mappedCount > 0 && <p className="muted small workbook-count">{mappedCount} exact Shop {mappedCount === 1 ? 'link' : 'links'} in the look</p>}
        <div className="men-look-actions">
          {tryOnAvailable && previewSrc(look.id) && <Link className="btn btn-accent sm" to={`/try-on?womenLook=${look.id}`}>Try it on</Link>}
          <Link to={path} className="link-arrow">View outfit details →</Link>
        </div>
      </div>
    </article>
  );
}

export default function WomenCatalog() {
  const tryOnAvailable = useTryOnAvailable();
  const { category } = useParams();
  const [params, setParams] = useSearchParams();
  const query = params.get('q')?.trim().toLowerCase() ?? '';
  const occasion = category || params.get('occasion') || '';
  const list = womenLookById.size
    ? [...womenLookById.values()].filter((look) =>
      (!occasion || look.occasion === occasion) &&
      (!query || `${look.id} ${look.referenceId} ${look.outfitDescription} ${look.garmentType} ${look.colors.primary} ${look.patternOrEmbroidery?.embroidery}`.toLowerCase().includes(query)),
    )
    : [];

  return (
    <div className="page men-catalog women-catalog">
      <div className="page-head">
        <div className="crumbs"><Link to="/">Home</Link> / <Link to="/women">Women</Link>{occasion && <> / {womenOccasionLabel(occasion)}</>}</div>
        <div className="kicker">The Women edit</div>
        <h1>{occasion ? womenOccasionLabel(occasion) : 'Women'}</h1>
        <p className="muted">236 festive looks — lehengas, sarees, anarkalis and more, styled for Garba, Diwali and every celebration.</p>
      </div>
      <div className="men-catalog-toolbar">
        <div className="men-occasion-tabs">
          <Link className={!occasion ? 'active' : ''} to="/women">All · 236</Link>
          {womenOccasions.map((entry) => (
            <Link key={entry.slug} className={occasion === entry.slug ? 'active' : ''} to={`/women/${entry.slug}`}>
              {entry.label} <span>{entry.range}</span>
            </Link>
          ))}
        </div>
        <input
          value={params.get('q') ?? ''}
          onChange={(event) => {
            const next = new URLSearchParams(params);
            const value = event.target.value;
            if (value) next.set('q', value); else next.delete('q');
            setParams(next, { replace: true });
          }}
          placeholder="Search look ID, reference or outfit detail"
          aria-label="Search Women looks"
        />
      </div>
      <div className="men-catalog-summary"><strong>{list.length}</strong> of 236 looks</div>
      {list.length ? (
        <div className="men-look-grid">{list.map((look) => <Card key={look.id} look={look} tryOnAvailable={tryOnAvailable} />)}</div>
      ) : (
        <div className="empty"><h3>No Women looks match</h3><Link className="btn btn-dark" to="/women">Clear filters</Link></div>
      )}
    </div>
  );
}

export function WomenLookDetail() {
  const { id } = useParams();
  const look = id ? womenLookById.get(id) : undefined;
  if (!look) {
    return <div className="page"><div className="empty"><h3>Women look not found</h3><Link className="btn btn-dark" to="/women">Back to Women</Link></div></div>;
  }

  const workbook = workbookLookForWomenId(look.id);
  const items = workbook?.look.components ?? [];
  const firstVerifiedShopUrl = items.map((component) => workbookShopUrl(component)).find((url): url is string => Boolean(url));
  const image = previewSrc(look.id);

  return (
    <div className="page men-detail" data-women-look-id={look.id}>
      <div className="crumbs"><Link to="/">Home</Link> / <Link to="/women">Women</Link> / {look.id}</div>
      <div className="men-detail-grid">
        <ImageFrame src={previewSrc(look.id)} alt={`Women look ${look.referenceId} — ${look.garmentType}`} label={`Look ${look.id.replace('women-look-', '')}`} detail={`Reference ${look.referenceId}`} ratio="3 / 4" fit="contain" />
        <div>
          <div className="kicker">{womenOccasionLabel(look.occasion)} · {look.referenceId}</div>
          <h1>Look {look.id.replace('women-look-', '')}</h1>
          <p className="men-detail-lead">{look.outfitDescription}</p>
          <dl className="specs">
            {DETAIL_FIELDS.map((field) => (
              <div key={field.key}><dt>{field.label}</dt><dd>{womenLookDetail(look.id)?.[field.key] ?? 'Not clearly visible in reference'}</dd></div>
            ))}
          </dl>
          <div className="row" aria-label="Women look actions">
            <SaveButton kind="look" id={look.id} image={image} />
            {image && <Link className="btn btn-accent" to={`/try-on?womenLook=${look.id}`}>Try On</Link>}
            {firstVerifiedShopUrl && <a className="btn btn-shop" href={firstVerifiedShopUrl} target="_blank" rel="noopener noreferrer nofollow sponsored">Shop</a>}
            <Link className="btn btn-dark" to={`/women/${look.occasion}`}>Browse {womenOccasionLabel(look.occasion)}</Link>
          </div>
        </div>
      </div>

      {workbook && (
        <section className="section workbook-components" data-workbook-section={workbook.section.id} data-workbook-look={workbook.look.number}>
          <div className="kicker">{workbook.section.label} · Look {workbook.look.number}</div>
          <h2>Shop the pieces in this look</h2>
          {items.length > 0 ? (
            <div className="workbook-item-list">
              {items.map((component, index) => {
                const url = workbookShopUrl(component);
                const itemName = component.sourceTitle || 'Product name not listed';
                return (
                  <article className="workbook-item" key={`${look.id}-${index}`} data-workbook-item={index + 1}>
                    <div className="workbook-item-copy">
                      <p>{itemName}</p>
                    </div>
                    {url ? (
                      <a className="btn btn-shop sm" href={url} target="_blank" rel="noopener noreferrer nofollow sponsored" aria-label={`Shop ${itemName}`}>
                        Shop
                      </a>
                    ) : (
                      <span className="muted small">Shop link unavailable</span>
                    )}
                  </article>
                );
              })}
            </div>
          ) : (
            <p className="muted">No product links are listed for this look.</p>
          )}
        </section>
      )}
    </div>
  );
}
