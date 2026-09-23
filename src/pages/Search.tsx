import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { searchProducts, searchCouples, parseQuery } from '../lib/search';
import { worldName } from '../lib/data';
import { ProductCard, CoupleCard, Empty } from '../components/ui';

const SUGGEST = ['garba women', 'garba men', 'college fest women', 'diwali men', 'black festive outfit', 'pink lehenga', 'chaniya choli', 'pre draped saree', 'sharara', 'ethnic shirt', 'modern kurta', 'couple garba'];

export default function Search() {
  const [sp] = useSearchParams();
  const q = sp.get('q') ?? '';
  const [val, setVal] = useState(q);
  const nav = useNavigate();
  const products = useMemo(() => searchProducts(q), [q]);
  const couples = useMemo(() => searchCouples(q), [q]);
  const pq = parseQuery(q);
  const [limit, setLimit] = useState(48);
  return (
    <div className="page">
      <form className="search-page-bar" onSubmit={(e) => { e.preventDefault(); nav(`/search?q=${encodeURIComponent(val)}`); }}>
        <input value={val} onChange={(e) => setVal(e.target.value)} placeholder="Search VIRAAS" aria-label="Search" />
        <button className="btn btn-dark">Search</button>
      </form>
      <div className="chips-row">{SUGGEST.map((s) => <Link key={s} className="chip" to={`/search?q=${encodeURIComponent(s)}`}>{s}</Link>)}</div>
      {q && <p className="muted small" data-parsed>Understood: {pq.gender ? (pq.gender === 'women' ? 'Women' : 'Men') : 'All'}{pq.occasion ? ` · ${worldName(pq.occasion)}` : ''}{pq.terms.length ? ` · “${pq.terms.join(' ')}”` : ''}{pq.couple ? ' · Couples' : ''}</p>}
      {q && couples.length > 0 && <section className="section"><h2>Couple looks · {couples.length}</h2><div className="grid3">{couples.slice(0, 6).map((c) => <CoupleCard key={c.id} c={c} />)}</div>{couples.length > 6 && <Link className="link-arrow" to={`/couple-edit${pq.occasion ? `?world=${pq.occasion}` : ''}`}>See all couple looks →</Link>}</section>}
      {q && <section className="section"><h2 data-result-count={products.length}>Products · {products.length}</h2>
        {products.length === 0 && couples.length === 0 ? <Empty title={`No results for “${q}”`}><p>Try one of the suggestions above.</p></Empty> :
          <><div className="grid4">{products.slice(0, limit).map((p) => <ProductCard key={p.id} p={p} />)}</div>
            {products.length > limit && <div className="center"><button className="btn btn-ghost" onClick={() => setLimit(limit + 48)}>Show more</button></div>}</>}
      </section>}
    </div>
  );
}
