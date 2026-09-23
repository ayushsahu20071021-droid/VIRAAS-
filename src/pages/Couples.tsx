import { Link, useParams, useSearchParams } from 'react-router-dom';
import { COUPLES, WORLDS, coupleById, byId, worldName, type Product } from '../lib/data';
import { formatINR, sumPrices } from '../lib/format';
import { CoupleCard, ImageFrame, ProductCard, SaveButton, ShareRow, Empty } from '../components/ui';

export function CoupleEdit() {
  const [sp, setSp] = useSearchParams();
  const world = sp.get('world');
  const list = COUPLES.filter((c) => !world || c.world === world);
  const passed = COUPLES.filter((c) => c.imageUrl).length;
  return (
    <div className="page">
      <div className="page-head">
        <div className="kicker">Couple Edit</div>
        <h1>100 couple looks. Five worlds.</h1>
        <p className="muted">Original VIRAAS photography of young couples, based on real festive references. Every look links to pieces you can shop. {passed < COUPLES.length && <span className="pending-inline">{passed} of {COUPLES.length} photos are live. The rest are clearly marked while they're being generated.</span>}</p>
      </div>
      <div className="world-tabs" role="tablist">
        <button className={`chip ${!world ? 'on' : ''}`} onClick={() => setSp({})}>All · {COUPLES.length}</button>
        {WORLDS.map((w) => <button key={w.slug} className={`chip ${world === w.slug ? 'on' : ''}`} onClick={() => setSp({ world: w.slug })}>{w.name} · {COUPLES.filter((c) => c.world === w.slug).length}</button>)}
      </div>
      <div className="grid3 couples-grid">{list.map((c) => <CoupleCard key={c.id} c={c} />)}</div>
    </div>
  );
}

export function CoupleDetail() {
  const { id } = useParams();
  const c = id ? coupleById.get(id) : undefined;
  if (!c) return <div className="page"><Empty title="Look not found"><Link to="/couple-edit" className="btn btn-dark">All couple looks</Link></Empty></div>;
  const her = c.herProductIds.map((x) => byId.get(x)).filter(Boolean) as Product[];
  const his = c.hisProductIds.map((x) => byId.get(x)).filter(Boolean) as Product[];
  const total = sumPrices([...her, ...his].map((p) => p.price));
  const more = COUPLES.filter((x) => x.world === c.world && x.id !== c.id).slice(0, 3);
  return (
    <div className="page couple-detail">
      <div className="crumbs"><Link to="/couple-edit">Couple Edit</Link> / <Link to={`/couple-edit?world=${c.world}`}>{worldName(c.world)}</Link></div>
      <div className="cd">
        <div className="cd-img"><ImageFrame src={c.imageUrl} alt={`${c.title} — ${c.colourStory}`} label={c.title} detail={`${c.her.desc} / ${c.him.desc}`} ratio="3 / 4.3" eager /></div>
        <div className="cd-info">
          <div className="kicker">{worldName(c.world)}</div>
          <h1>{c.title}</h1>
          <p className="colour-story">{c.colourStory}</p>
          <dl className="specs">
            <div><dt>Her</dt><dd>{c.her.desc}</dd></div>
            <div><dt>Him</dt><dd>{c.him.desc}{c.layer ? `, with ${c.layer.desc}` : ''}</dd></div>
            <div><dt>The moment</dt><dd>{c.pose}</dd></div>
          </dl>
          {total !== null && <div className="pdp-price">Full look ≈ {formatINR(total)} <span className="muted small">(approx., {her.length + his.length} pieces)</span></div>}
          <div className="pdp-ctas"><a href="#shop-look" className="btn btn-dark block">Shop the look</a><SaveButton kind="couple" id={c.id} image={c.imageUrl} /></div>
          <ShareRow path={`/couple-edit/${c.id}`} />
        </div>
      </div>
      <section className="section" id="shop-look">
        <h2>Style it together · Her</h2>
        <div className="grid4">{her.map((p) => <ProductCard key={p.id} p={p} />)}</div>
        <h2 style={{ marginTop: 32 }}>Style it together · Him</h2>
        <div className="grid4">{his.map((p) => <ProductCard key={p.id} p={p} />)}</div>
      </section>
      {more.length > 0 && <section className="section"><h2>More {worldName(c.world)} couples</h2><div className="grid3">{more.map((x) => <CoupleCard key={x.id} c={x} />)}</div></section>}
    </div>
  );
}
