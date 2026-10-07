import { Link } from 'react-router-dom';
import { useSaved } from '../lib/saved';
import { byId, coupleById } from '../lib/data';
import { ProductCard, CoupleCard, Empty, ImageFrame, ShareRow } from '../components/ui';
import { womenLookById } from '../lib/womenCatalog';
import { menLookById } from '../lib/menCatalog';
import womenPreviews from '../data/women-previews.client.json';
import menFinalImages from '../data/men-final-images.json';

const womenImageById = womenPreviews as Record<string, { src?: string }>;
const menImageById = menFinalImages as Record<string, string>;

export default function Saved() {
  const { items, remove } = useSaved();
  const products = items.filter((i) => i.kind === 'product').map((i) => byId.get(i.id)).filter(Boolean);
  const couples = items.filter((i) => i.kind === 'couple').map((i) => coupleById.get(i.id)).filter(Boolean);
  const tryons = items.filter((i) => i.kind === 'tryon');
  const looks = items.filter((i) => i.kind === 'look');
  return (
    <div className="page">
      <div className="page-head"><div className="kicker">Saved Looks</div><h1>Your festive shortlist</h1><p className="muted">Saved on this device only (localStorage). Nothing is uploaded.</p></div>
      {items.length === 0 ? <Empty title="Nothing saved yet"><p>Tap the heart on any product or couple look.</p><Link to="/couple-edit" className="btn btn-dark">Browse Couple Edit</Link></Empty> : (
        <>
          <ShareRow path="/saved" />
          {couples.length > 0 && <section className="section"><h2>Couple looks</h2><div className="grid3">{couples.map((c) => <CoupleCard key={c!.id} c={c!} />)}</div></section>}
          {products.length > 0 && <section className="section"><h2>Products</h2><div className="grid4">{products.map((p) => <ProductCard key={p!.id} p={p!} />)}</div></section>}
          {looks.length > 0 && <section className="section"><h2>Women &amp; Men looks</h2><div className="grid4">{looks.map((item) => {
            const women = womenLookById.get(item.id);
            const men = menLookById.get(item.id);
            const title = women ? `Women · Look ${women.referenceId}` : men ? `Men · Look ${men.referenceId}` : item.id;
            const image = women ? womenImageById[item.id]?.src : men ? menImageById[item.id] : item.image;
            const href = women ? `/women-look/${item.id}` : men ? `/men-look/${item.id}` : '/';
            const tryOnHref = women ? `/try-on?womenLook=${item.id}` : men ? `/try-on?menLook=${item.id}` : undefined;
            return <article key={item.id} className="pcard">
              <Link to={href} className="pcard-img"><ImageFrame src={image} alt={title} label="Saved look" /></Link>
              <div className="pcard-body"><Link to={href} className="pcard-title">{title}</Link><div className="pcard-actions">
                {tryOnHref && <Link className="btn btn-accent sm" to={tryOnHref}>Try On</Link>}
                <button className="btn btn-ghost sm" onClick={() => remove('look', item.id)}>Remove</button>
              </div></div>
            </article>;
          })}</div></section>}
          {tryons.length > 0 && <section className="section"><h2>Try-on results</h2><div className="grid4">{tryons.map((t) => (
            <div key={t.id} className="pcard"><div className="muted small">Try-on for {byId.get(t.id.split(':')[0])?.title ?? 'product'}</div><button className="btn btn-ghost sm" onClick={() => remove('tryon', t.id)}>Remove</button></div>
          ))}</div></section>}
        </>
      )}
    </div>
  );
}
