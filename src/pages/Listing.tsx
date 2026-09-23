import { useMemo } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { PRODUCTS, WORLDS, BUDGETS, catSlug, ACCESSORY_CATS, worldName, type Product } from '../lib/data';
import { ProductCard, Empty } from '../components/ui';

type Mode = 'gender' | 'trending' | 'accessories';
type FacetKey = 'gender' | 'category' | 'occasion' | 'colour' | 'budget' | 'style' | 'silhouette' | 'fabric' | 'detail';
const LABEL: Record<FacetKey, string> = { gender: 'Gender', category: 'Category', occasion: 'Occasion', colour: 'Colour', budget: 'Budget', style: 'Style', silhouette: 'Silhouette', fabric: 'Fabric', detail: 'Details' };
const PAGE = 48;

function valuesOf(p: Product, k: FacetKey): string[] {
  switch (k) {
    case 'gender': return [p.gender];
    case 'category': return [catSlug(p.category)];
    case 'occasion': return p.occasion;
    case 'colour': return [p.colour];
    case 'budget': return BUDGETS.filter((b) => p.price >= b.min && p.price <= b.max).map((b) => b.slug);
    case 'style': return p.styleTags;
    case 'silhouette': return [p.silhouette];
    case 'fabric': return [p.fabric];
    case 'detail': return [p.pattern];
  }
}
const display = (k: FacetKey, v: string, list: Product[]) => {
  if (k === 'occasion') return worldName(v);
  if (k === 'budget') return BUDGETS.find((b) => b.slug === v)?.label ?? v;
  if (k === 'category') return list.find((p) => catSlug(p.category) === v)?.category ?? v;
  if (k === 'gender') return v === 'women' ? 'Women' : 'Men';
  return v;
};

export default function Listing({ mode, fixedGender }: { mode: Mode; fixedGender?: 'women' | 'men' }) {
  const params = useParams();
  const gender = fixedGender ?? params.gender;
  const category = params.category;
  const [sp, setSp] = useSearchParams();

  const base = useMemo(() => {
    let list = PRODUCTS;
    if (mode === 'gender') list = list.filter((p) => p.gender === gender);
    if (category) list = list.filter((p) => catSlug(p.category) === category);
    if (mode === 'accessories') list = list.filter((p) => ACCESSORY_CATS.includes(p.category) || p.category === 'Traditional Layer');
    if (mode === 'trending') list = list.filter((p) => !p.accessory);
    return list;
  }, [mode, gender, category]);

  // Context-aware facets: only facets with ≥2 distinct values in the current base are shown
  const facetKeys: FacetKey[] = useMemo(() => {
    const keys: FacetKey[] = ['gender', 'category', 'occasion', 'colour', 'budget', 'style', 'silhouette', 'fabric', 'detail'];
    return keys.filter((k) => {
      if (k === 'gender' && mode === 'gender') return false;
      if (k === 'category' && category) return false;
      const vals = new Set(base.flatMap((p) => valuesOf(p, k)));
      return vals.size >= 2;
    });
  }, [base, mode, category]);

  const active = (k: FacetKey) => sp.get(k === 'category' ? 'cat' : k);
  const results = useMemo(() => {
    let list = base;
    for (const k of facetKeys.concat(['occasion', 'budget'] as FacetKey[])) {
      const v = active(k); if (!v) continue;
      list = list.filter((p) => valuesOf(p, k).includes(v));
    }
    const sort = sp.get('sort');
    const sorted = [...list];
    if (sort === 'price-asc') sorted.sort((a, b) => a.price - b.price);
    else if (sort === 'price-desc') sorted.sort((a, b) => b.price - a.price);
    else sorted.sort((a, b) => Number(!!b.imageUrl) - Number(!!a.imageUrl) || b.coupleIds.length - a.coupleIds.length);
    return sorted;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [base, sp, facetKeys]);

  const set = (k: FacetKey, v: string | null) => {
    const n = new URLSearchParams(sp); const key = k === 'category' ? 'cat' : k;
    if (v === null || n.get(key) === v) n.delete(key); else n.set(key, v);
    n.delete('page'); setSp(n, { replace: true });
  };
  const page = Math.max(1, Number(sp.get('page')) || 1);
  const shown = results.slice(0, page * PAGE);

  const catName = category ? base[0]?.category ?? category : null;
  const title = mode === 'trending' ? 'Trending' : mode === 'accessories' ? 'Accessories' : catName ? `${gender === 'women' ? 'Women' : 'Men'} · ${catName}` : gender === 'women' ? 'Women' : 'Men';

  if (base.length === 0) return <div className="page"><Empty title="Nothing here yet"><Link to="/" className="btn btn-dark">Back home</Link></Empty></div>;

  return (
    <div className="page listing">
      <div className="page-head">
        <div className="crumbs"><Link to="/">Home</Link> / {gender && <Link to={`/${gender}`}>{gender === 'women' ? 'Women' : 'Men'}</Link>}{catName && <> / {catName}</>}</div>
        <h1>{title}</h1>
        <p className="muted">{results.length} styles · Prices are approximate marketplace prices. Always confirm on the merchant's site.</p>
      </div>
      <div className="listing-body">
        <aside className="filters" aria-label="Filters">
          {facetKeys.map((k) => {
            const counts = new Map<string, number>();
            base.forEach((p) => valuesOf(p, k).forEach((v) => counts.set(v, (counts.get(v) ?? 0) + 1)));
            let entries = [...counts.entries()].filter(([, n]) => n > 0);
            if (k === 'budget') entries = BUDGETS.filter((b) => counts.has(b.slug)).map((b) => [b.slug, counts.get(b.slug)!]);
            else if (k === 'occasion') entries = WORLDS.filter((w) => counts.has(w.slug)).map((w) => [w.slug, counts.get(w.slug)!]);
            else entries.sort((a, b) => b[1] - a[1]);
            return (
              <details key={k} open={['occasion', 'category', 'colour', 'budget'].includes(k)} className="facet" data-facet={k}>
                <summary>{LABEL[k]}</summary>
                <div className="facet-opts">{entries.slice(0, 18).map(([v, n]) => (
                  <button key={v} className={`chip ${active(k) === v ? 'on' : ''}`} onClick={() => set(k, v)}>{display(k, v, base)} <span className="muted">{n}</span></button>
                ))}</div>
              </details>
            );
          })}
          {[...sp.keys()].some((k) => k !== 'sort' && k !== 'page') && <button className="btn btn-ghost sm" onClick={() => setSp({}, { replace: true })}>Clear all</button>}
        </aside>
        <div>
          <div className="sortbar">
            <label className="small">Sort{' '}
              <select value={sp.get('sort') ?? ''} onChange={(e) => { const n = new URLSearchParams(sp); if (e.target.value) n.set('sort', e.target.value); else n.delete('sort'); setSp(n, { replace: true }); }}>
                <option value="">Curated</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option>
              </select>
            </label>
          </div>
          {results.length === 0 ? <Empty title="No styles match these filters"><button className="btn btn-dark" onClick={() => setSp({}, { replace: true })}>Clear filters</button></Empty> : (
            <>
              <div className="grid4">{shown.map((p) => <ProductCard key={p.id} p={p} />)}</div>
              {shown.length < results.length && <div className="center"><button className="btn btn-ghost" onClick={() => { const n = new URLSearchParams(sp); n.set('page', String(page + 1)); setSp(n, { replace: true }); }}>Show more ({results.length - shown.length} left)</button></div>}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
