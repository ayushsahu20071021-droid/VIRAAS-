import { Link } from 'react-router-dom';
import { useSaved } from '../lib/saved';
import { byId, coupleById } from '../lib/data';
import { ProductCard, CoupleCard, Empty, ShareRow } from '../components/ui';

export default function Saved() {
  const { items, remove } = useSaved();
  const products = items.filter((i) => i.kind === 'product').map((i) => byId.get(i.id)).filter(Boolean);
  const couples = items.filter((i) => i.kind === 'couple').map((i) => coupleById.get(i.id)).filter(Boolean);
  const tryons = items.filter((i) => i.kind === 'tryon');
  return (
    <div className="page">
      <div className="page-head"><div className="kicker">Saved Looks</div><h1>Your festive shortlist</h1><p className="muted">Saved on this device only (localStorage). Nothing is uploaded.</p></div>
      {items.length === 0 ? <Empty title="Nothing saved yet"><p>Tap the heart on any product or couple look.</p><Link to="/couple-edit" className="btn btn-dark">Browse Couple Edit</Link></Empty> : (
        <>
          <ShareRow path="/saved" />
          {couples.length > 0 && <section className="section"><h2>Couple looks</h2><div className="grid3">{couples.map((c) => <CoupleCard key={c!.id} c={c!} />)}</div></section>}
          {products.length > 0 && <section className="section"><h2>Products</h2><div className="grid4">{products.map((p) => <ProductCard key={p!.id} p={p!} />)}</div></section>}
          {tryons.length > 0 && <section className="section"><h2>Try-on results</h2><div className="grid4">{tryons.map((t) => (
            <div key={t.id} className="pcard"><div className="muted small">Try-on for {byId.get(t.id.split(':')[0])?.title ?? 'product'}</div><button className="btn btn-ghost sm" onClick={() => remove('tryon', t.id)}>Remove</button></div>
          ))}</div></section>}
        </>
      )}
    </div>
  );
}
