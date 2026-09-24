import { Link, useParams } from 'react-router-dom';
import { WORLDS, COUPLES, PRODUCTS, coupleImageSrc } from '../lib/data';
import { ImageFrame, ProductCard, CoupleCard, SectionHead, Empty } from '../components/ui';

const img = (slug: string) => { const c = COUPLES.find((x) => x.world === slug); return c ? coupleImageSrc(c) : undefined; };

export function Occasions() {
  return (
    <div className="page">
      <div className="page-head"><div className="kicker">Occasions</div><h1>Dress for the moment</h1></div>
      <div className="worlds">{WORLDS.map((w) => (
        <Link key={w.slug} to={`/occasions/${w.slug}`} className="world-tile">
          <ImageFrame src={img(w.slug)} alt={w.name} label={w.name} ratio="3 / 4.2" />
          <div className="world-label"><strong>{w.name}</strong><span>{w.blurb}</span></div>
        </Link>))}</div>
    </div>
  );
}

export function World() {
  const { world } = useParams();
  const w = WORLDS.find((x) => x.slug === world);
  if (!w) return <div className="page"><Empty title="Occasion not found"><Link to="/occasions" className="btn btn-dark">All occasions</Link></Empty></div>;
  const rank = (a: typeof PRODUCTS[number], b: typeof PRODUCTS[number]) => Number(!!b.imageUrl) - Number(!!a.imageUrl) || b.coupleIds.length - a.coupleIds.length;
  const women = PRODUCTS.filter((p) => p.gender === 'women' && !p.accessory && p.occasion.includes(w.slug)).sort(rank);
  const men = PRODUCTS.filter((p) => p.gender === 'men' && !p.accessory && p.occasion.includes(w.slug)).sort(rank);
  const couples = COUPLES.filter((c) => c.world === w.slug);
  return (
    <div className="page">
      <div className="world-hero">
        <div className="world-hero-img"><ImageFrame src={img(w.slug)} alt={w.name} label={w.name} ratio="16 / 9" eager /></div>
        <div className="world-hero-copy"><div className="kicker light">{w.long}</div><h1>{w.name}</h1><p>{w.blurb}</p></div>
      </div>
      <section className="section"><SectionHead kicker="For her" title={`${w.name} for women`} to={`/women?occasion=${w.slug}`} cta={`All ${women.length}`} /><div className="grid4">{women.slice(0, 8).map((p) => <ProductCard key={p.id} p={p} />)}</div></section>
      <section className="section"><SectionHead kicker="For him" title={`${w.name} for men`} to={`/men?occasion=${w.slug}`} cta={`All ${men.length}`} /><div className="grid4">{men.slice(0, 8).map((p) => <ProductCard key={p.id} p={p} />)}</div></section>
      <section className="section"><SectionHead kicker="Couple Edit" title={`${w.name} couple looks`} to={`/couple-edit?world=${w.slug}`} cta={`All ${couples.length}`} /><div className="grid3">{couples.slice(0, 6).map((c) => <CoupleCard key={c.id} c={c} />)}</div></section>
    </div>
  );
}
