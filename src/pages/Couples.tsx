import { Link, useParams, useSearchParams } from 'react-router-dom';
import { COUPLES, WORLDS, coupleById, byId, worldName, coupleImageSrc, type Product } from '../lib/data';
import { formatINR, sumPrices } from '../lib/format';
import { CoupleCard, ImageFrame, ProductCard, SaveButton, ShareRow, Empty } from '../components/ui';
import { coupleAffiliate } from '../lib/coupleAffiliate';

export function CoupleEdit() {
  const [sp, setSp] = useSearchParams();
  const world = sp.get('world');
  const list = COUPLES.filter((c) => !world || c.world === world);
  const passed = COUPLES.filter((c) => coupleImageSrc(c)).length;
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
  const aff = coupleAffiliate(c.id);
  // Try-On maps to the EXACT per-person reference: FOR HER = her outfit, FOR HIM = his outfit. Never combined, never cross-gender.
  const herTryOn = c.herProductIds[0];
  const himTryOn = c.hisProductIds[0];
  const more = COUPLES.filter((x) => x.world === c.world && x.id !== c.id).slice(0, 3);
  return (
    <div className="page couple-detail">
      <div className="crumbs"><Link to="/couple-edit">Couple Edit</Link> / <Link to={`/couple-edit?world=${c.world}`}>{worldName(c.world)}</Link></div>
      <div className="cd">
        <div className="cd-img"><ImageFrame src={coupleImageSrc(c)} alt={`${c.title} — ${c.colourStory}`} label={c.title} detail={`${c.her.desc} / ${c.him.desc}`} ratio="3 / 4.3" eager fit="contain" /></div>
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
          <div className="pdp-ctas"><a href="#shop-look" className="btn btn-dark block">Shop the look</a><SaveButton kind="couple" id={c.id} image={coupleImageSrc(c)} /></div>
          <div className="couple-tryon" id="try-on">
            <div className="kicker">Try on</div>
            <p className="couple-tryon-q">Whose outfit do you want to try?</p>
            <div className="row">
              {herTryOn ? <Link className="btn btn-accent" to={`/try-on?couple=${c.id}&side=her`}>For her</Link> : <button className="btn btn-accent" disabled>For her</button>}
              {himTryOn ? <Link className="btn btn-dark" to={`/try-on?couple=${c.id}&side=him`}>For him</Link> : <button className="btn btn-dark" disabled>For him</button>}
            </div>
            <p className="muted small">Try-On opens the individual outfit — her look or his look, never combined.</p>
          </div>
          <ShareRow path={`/couple-edit/${c.id}`} />
        </div>
      </div>
      <section className="section" id="shop-look">
        <h2>Shop the look</h2>
        <div className="shop-split">
          <div className="shop-option">
            <div className="kicker">For her</div>
            <p className="shop-option-desc">{c.her.desc}</p>
            {aff.herAffiliateUrl
              ? <a className="btn btn-dark block" href={aff.herAffiliateUrl} target="_blank" rel="noopener noreferrer nofollow sponsored">Shop her look</a>
              : <button className="btn btn-dark block" disabled>Affiliate link not configured</button>}
          </div>
          <div className="shop-option">
            <div className="kicker">For him</div>
            <p className="shop-option-desc">{c.him.desc}{c.layer ? `, with ${c.layer.desc}` : ''}</p>
            {aff.himAffiliateUrl
              ? <a className="btn btn-dark block" href={aff.himAffiliateUrl} target="_blank" rel="noopener noreferrer nofollow sponsored">Shop his look</a>
              : <button className="btn btn-dark block" disabled>Affiliate link not configured</button>}
          </div>
        </div>
        <h2 style={{ marginTop: 32 }}>Style it together · Her</h2>
        <div className="grid4">{her.map((p) => <ProductCard key={p.id} p={p} />)}</div>
        <h2 style={{ marginTop: 32 }}>Style it together · Him</h2>
        <div className="grid4">{his.map((p) => <ProductCard key={p.id} p={p} />)}</div>
      </section>
      {more.length > 0 && <section className="section"><h2>More {worldName(c.world)} couples</h2><div className="grid3">{more.map((x) => <CoupleCard key={x.id} c={x} />)}</div></section>}
    </div>
  );
}
