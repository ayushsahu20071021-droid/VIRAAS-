import { Link, useParams } from 'react-router-dom';
import { WORLDS, COUPLES, coupleImageSrc } from '../lib/data';
import { ImageFrame, LookCard, CoupleCard, SectionHead, Empty } from '../components/ui';
import { featuredMenLooks, featuredWomenLooks, menLookImage, womenLookImage } from '../lib/looks';
import { menOccasionLabel } from '../lib/menCatalog';
import { womenOccasionLabel } from '../lib/womenCatalog';
import { MEN_LOOKS } from '../lib/menCatalog';
import { WOMEN_LOOKS } from '../lib/womenCatalog';

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
  // Occasion pages showcase the APPROVED look images (real, QA-passed) for this occasion.
  const womenTotal = WOMEN_LOOKS.filter((l) => l.occasion === w.slug && womenLookImage(l.id)).length;
  const menTotal = MEN_LOOKS.filter((l) => l.occasion === w.slug && menLookImage(l.id)).length;
  const women = featuredWomenLooks(w.slug, 8);
  const men = featuredMenLooks(w.slug, 8);
  const couples = COUPLES.filter((c) => c.world === w.slug);
  return (
    <div className="page">
      <div className="world-hero">
        <div className="world-hero-img"><ImageFrame src={img(w.slug)} alt={w.name} label={w.name} ratio="16 / 9" eager /></div>
        <div className="world-hero-copy"><div className="kicker light">{w.long}</div><h1>{w.name}</h1><p>{w.blurb}</p></div>
      </div>
      <section className="section"><SectionHead kicker="For her" title={`${w.name} for women`} to={`/women/${w.slug}`} cta={`All ${womenTotal}`} /><div className="grid4">{women.map((l) => (
        <LookCard key={l.id} to={`/women-look/${l.id}`} image={womenLookImage(l.id)} alt={`Women look ${l.referenceId} — ${l.garmentType}`}
          kicker={womenOccasionLabel(l.occasion)} title={`Look ${l.id.replace('women-look-', '')}`} meta={[l.garmentType, l.colors.primary]} tryOnTo={`/try-on?womenLook=${l.id}`} />
      ))}</div></section>
      <section className="section"><SectionHead kicker="For him" title={`${w.name} for men`} to={`/men/${w.slug}`} cta={`All ${menTotal}`} /><div className="grid4">{men.map((l) => (
        <LookCard key={l.id} to={`/men-look/${l.id}`} image={menLookImage(l.id)} alt={`Men look ${l.referenceId} — ${l.garmentType}`}
          kicker={menOccasionLabel(l.occasion)} title={`Look ${l.id.replace('men-look-', '')}`} meta={[l.garmentType, l.colors.primary]} tryOnTo={`/try-on?menLook=${l.id}`} />
      ))}</div></section>
      <section className="section"><SectionHead kicker="Couple Edit" title={`${w.name} couple looks`} to={`/couple-edit?world=${w.slug}`} cta={`All ${couples.length}`} /><div className="grid3">{couples.slice(0, 6).map((c) => <CoupleCard key={c.id} c={c} />)}</div></section>
    </div>
  );
}
