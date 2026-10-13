// Unified Trending feed — 500 styles = 210 Men-approved + 236 Women-approved + 54 VIRAAS editorial.
//
// AUTHORITATIVE SOURCE RULE: each Men/Women entry IS the exact existing look record shown on /men and
// /women (same image, title, description, attributes, occasion, Try-On). Nothing is reconstructed,
// heuristically matched, or image-swapped — image AND content come from ONE source record. The 54
// editorial looks are their own trending-only records (TREND-447 … TREND-500); their images are not
// supplied yet, so they render an honest "Coming soon" frame and never a broken image URL.
// One mixed grid, deterministic interleave, no visible Men/Women/Editorial grouping.
import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { MEN_LOOKS, menOccasionLabel } from '../lib/menCatalog';
import { WOMEN_LOOKS, womenOccasionLabel } from '../lib/womenCatalog';
import { menLookImage, womenLookImage, shortDesc } from '../lib/looks';
import { worldName } from '../lib/data';
import { ImageFrame, Empty } from '../components/ui';
import { exactWishlinkShareUrl } from '../lib/productActions';
import { TRENDING_EDITORIAL_LOOKS, TRENDING_EDITORIAL_PENDING_IMAGE, TRENDING_EDITORIAL_TOTAL, trendingEditorialImage } from '../lib/trendingEditorial';
import menLookAffiliate from '../data/men-look-affiliate.json';
import womenLookAffiliate from '../data/women-look-affiliate.json';
import { useTryOnAvailable } from '../lib/tryOnStatus';

type SourceType = 'men-approved' | 'women-approved' | 'trending-editorial';
interface TItem {
  key: string; sourceType: SourceType; sourceProductId: string;
  gender: 'men' | 'women'; category: string; occasion: string[]; colour: string;
  image?: string; title: string; desc: string; detailHref: string; tryOnHref?: string;
  affiliateUrl: string; price: number | null; occasionLabel: string;
}

const menAff = menLookAffiliate as Record<string, { affiliateUrl: string; affiliateSource?: string } | undefined>;
const womenAff = womenLookAffiliate as Record<string, { affiliateUrl: string; affiliateSource?: string } | undefined>;

// Deterministic FNV-1a hash → a stable, mixed, never-reshuffled curated order.
const stableKey = (id: string): number => { let h = 2166136261; for (let i = 0; i < id.length; i++) { h ^= id.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };

// Build the 500 items ONCE from the authoritative sources.
const ITEMS: TItem[] = [
  ...MEN_LOOKS.map((l): TItem => ({
    key: l.id, sourceType: 'men-approved', sourceProductId: l.id,
    gender: 'men', category: l.garmentType, occasion: [l.occasion], colour: l.colors.primary,
    image: menLookImage(l.id), title: `Look ${l.id.replace('men-look-', '')}`, desc: shortDesc(l.outfitDescription),
    detailHref: `/men-look/${l.id}`, tryOnHref: menLookImage(l.id) ? `/try-on?menLook=${l.id}` : undefined,
    affiliateUrl: menAff[l.id]?.affiliateSource === 'wishlink' ? exactWishlinkShareUrl(menAff[l.id]?.affiliateUrl || '') || '' : '', price: null, occasionLabel: menOccasionLabel(l.occasion),
  })),
  ...WOMEN_LOOKS.map((l): TItem => ({
    key: l.id, sourceType: 'women-approved', sourceProductId: l.id,
    gender: 'women', category: l.garmentType, occasion: [l.occasion], colour: l.colors.primary,
    image: womenLookImage(l.id), title: `Look ${l.id.replace('women-look-', '')}`, desc: shortDesc(l.outfitDescription),
    detailHref: `/women-look/${l.id}`, tryOnHref: womenLookImage(l.id) ? `/try-on?womenLook=${l.id}` : undefined,
    affiliateUrl: womenAff[l.id]?.affiliateSource === 'wishlink' ? exactWishlinkShareUrl(womenAff[l.id]?.affiliateUrl || '') || '' : '', price: null, occasionLabel: womenOccasionLabel(l.occasion),
  })),
  // 54 trending-only editorial looks. Image stays undefined until the asset is actually uploaded,
  // so the card shows the labelled pending frame instead of a broken URL. No price, retailer or
  // affiliate link is claimed for them.
  ...TRENDING_EDITORIAL_LOOKS.map((l): TItem => ({
    key: l.id, sourceType: 'trending-editorial', sourceProductId: l.id,
    gender: l.gender, category: l.category, occasion: l.occasion, colour: l.colour,
    image: trendingEditorialImage(l.id), title: l.title, desc: shortDesc(l.description),
    detailHref: `/product/${l.id}`, tryOnHref: undefined,
    affiliateUrl: '', price: null,
    occasionLabel: l.occasionLabel || (l.occasion[0] ? worldName(l.occasion[0]) : ''),
  })),
];

// The visible total is derived from the records, never hardcoded, so the copy cannot drift.
const TRENDING_TOTAL = MEN_LOOKS.length + WOMEN_LOOKS.length + TRENDING_EDITORIAL_TOTAL;

const fmtINR = (n: number) => `₹${n.toLocaleString('en-IN')}`;
const HAS_VERIFIED_PRICE = ITEMS.some((item) => item.price !== null);
const PAGE = 48;
type FacetKey = 'gender' | 'category' | 'occasion' | 'colour';
const LABEL: Record<FacetKey, string> = { gender: 'Gender', category: 'Category', occasion: 'Occasion', colour: 'Colour' };
const valuesOf = (it: TItem, k: FacetKey): string[] =>
  k === 'gender' ? [it.gender] : k === 'category' ? [it.category] : k === 'occasion' ? it.occasion : [it.colour];
const displayVal = (k: FacetKey, v: string): string =>
  k === 'gender' ? (v === 'women' ? 'Women' : 'Men') : k === 'occasion' ? worldName(v) : v;

function Card({ it }: { it: TItem }) {
  const tryOnAvailable = useTryOnAvailable();
  return (
    <article className="pcard" data-product-id={it.sourceProductId} data-source-type={it.sourceType}>
      <Link to={it.detailHref} className="pcard-img">
        <ImageFrame src={it.image} alt={`${it.title} — ${it.category}`} label={it.category} detail={`${it.colour}`} />
      </Link>
      <div className="pcard-body">
        <div className="pcard-merchant">{it.occasionLabel}</div>
        <Link to={it.detailHref} className="pcard-title">{it.title}</Link>
        {it.price !== null && <div className="pcard-price">{fmtINR(it.price)} <span className="muted small">approx.</span></div>}
        <p className="pcard-desc">{it.desc}</p>
        <div className="tags"><span className="tag">{it.category}</span><span className="tag">{it.colour}</span></div>
        <div className="pcard-actions">
          {tryOnAvailable && it.tryOnHref
            ? <Link className="btn btn-accent sm" to={it.tryOnHref}>Try it on</Link>
            : <Link className="btn btn-ghost sm" to={it.detailHref}>{it.sourceType === 'trending-editorial' ? 'View style' : 'View look'}</Link>}
          {it.affiliateUrl && <a className="btn btn-shop sm" href={it.affiliateUrl} target="_blank" rel="noopener noreferrer nofollow sponsored">Shop</a>}
        </div>
      </div>
    </article>
  );
}

export default function Trending() {
  const [sp, setSp] = useSearchParams();
  const facetKeys: FacetKey[] = ['occasion', 'gender', 'category', 'colour'];
  const active = (k: FacetKey) => sp.get(k);

  const results = useMemo(() => {
    let list = ITEMS;
    for (const k of facetKeys) { const v = active(k); if (v) list = list.filter((it) => valuesOf(it, k).includes(v)); }
    const sorted = [...list];
    const sort = sp.get('sort');
    if (sort === 'price-asc') sorted.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
    else if (sort === 'price-desc') sorted.sort((a, b) => (b.price ?? -Infinity) - (a.price ?? -Infinity));
    else sorted.sort((a, b) => stableKey(a.key) - stableKey(b.key)); // deterministic mixed curated order
    return sorted;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sp]);

  const set = (k: FacetKey, v: string | null) => {
    const n = new URLSearchParams(sp);
    if (v === null || n.get(k) === v) n.delete(k); else n.set(k, v);
    n.delete('page'); setSp(n, { replace: true });
  };
  const page = Math.max(1, Number(sp.get('page')) || 1);
  const shown = results.slice(0, page * PAGE);

  return (
    <div className="page listing">
      <div className="page-head">
        <div className="crumbs"><Link to="/">Home</Link> / Trending</div>
        <h1>Trending</h1>
        <p className="muted">
          {TRENDING_TOTAL} styles · the VIRAAS Men &amp; Women edits, mixed with our editorial trending picks
          {TRENDING_EDITORIAL_PENDING_IMAGE > 0 && ` · ${TRENDING_EDITORIAL_PENDING_IMAGE} editorial looks are still image-pending`}
          .
        </p>
      </div>
      <div className="listing-body">
        <aside className="filters" aria-label="Filters">
          {facetKeys.map((k) => {
            const counts = new Map<string, number>();
            ITEMS.forEach((it) => valuesOf(it, k).forEach((v) => counts.set(v, (counts.get(v) ?? 0) + 1)));
            const entries = [...counts.entries()].sort((a, b) => (k === 'gender' ? a[0].localeCompare(b[0]) : b[1] - a[1]));
            return (
              <details key={k} open={['occasion', 'gender', 'category'].includes(k)} className="facet" data-facet={k}>
                <summary>{LABEL[k]}</summary>
                <div className="facet-opts">{entries.slice(0, 20).map(([v, n]) => (
                  <button key={v} className={`chip ${active(k) === v ? 'on' : ''}`} onClick={() => set(k, v)}>{displayVal(k, v)} <span className="muted">{n}</span></button>
                ))}</div>
              </details>
            );
          })}
          {[...sp.keys()].some((k) => k !== 'sort' && k !== 'page') && <button className="btn btn-ghost sm" onClick={() => setSp({}, { replace: true })}>Clear all</button>}
        </aside>
        <div>
          <div className="sortbar">
            <span className="small muted">{results.length} styles</span>
            <label className="small">Sort{' '}
              <select value={sp.get('sort') ?? ''} onChange={(e) => { const n = new URLSearchParams(sp); if (e.target.value) n.set('sort', e.target.value); else n.delete('sort'); setSp(n, { replace: true }); }}>
                <option value="">Curated</option>{HAS_VERIFIED_PRICE && <><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option></>}
              </select>
            </label>
          </div>
          {results.length === 0 ? <Empty title="No styles match these filters"><button className="btn btn-dark" onClick={() => setSp({}, { replace: true })}>Clear filters</button></Empty> : (
            <>
              <div className="grid4">{shown.map((it) => <Card key={it.key} it={it} />)}</div>
              {shown.length < results.length && <div className="center"><button className="btn btn-ghost" onClick={() => { const n = new URLSearchParams(sp); n.set('page', String(page + 1)); setSp(n, { replace: true }); }}>Show more ({results.length - shown.length} left)</button></div>}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
