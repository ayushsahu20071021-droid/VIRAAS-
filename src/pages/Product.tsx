import { Link, useParams } from 'react-router-dom';
import { byId, PRODUCTS, COUPLES, worldName, type Product } from '../lib/data';
import { formatINR } from '../lib/format';
import { ImageFrame, SaveButton, ProductActionButton, ShareRow, ProductCard, Empty, CoupleCard, LookCard } from '../components/ui';
import { exactMerchantProductUrl, hasVerifiedPrice, productOutboundAction, tryOnHrefForProduct } from '../lib/productActions';
import { womenLookForProduct, womenLookImage } from '../lib/looks';
import { womenOccasionLabel } from '../lib/womenCatalog';

function completeTheLook(p: Product): Product[] {
  // Prefer the actual couple look this product appears in
  const couple = COUPLES.find((c) => p.coupleIds.includes(c.id));
  if (couple) {
    const ids = p.gender === 'women' ? couple.herProductIds : couple.hisProductIds;
    const other = ids.filter((id) => id !== p.id).map((id) => byId.get(id)!).filter(Boolean);
    if (other.length) return other;
  }
  const tone = ['Black', 'Navy', 'Emerald', 'Wine', 'Royal Blue'].includes(p.colour) ? 'Oxidised Silver' : 'Gold';
  const occ = p.occasion[0];
  const pick = (cat: string) => PRODUCTS.find((x) => x.gender === p.gender && x.category === cat && x.occasion.includes(occ) && (x.colour === tone || x.colour === 'Tan' || x.colour === 'Gold' || x.colour === 'Silver'));
  return (p.gender === 'women' ? ['Jewellery', 'Footwear', 'Bags'] : ['Traditional Layer', 'Footwear', 'Festive Separates']).map(pick).filter((x): x is Product => !!x && x.id !== p.id);
}

function whyPicked(p: Product): string[] {
  const out: string[] = [];
  if (p.coupleIds.length) out.push(`Appears in ${p.coupleIds.length} VIRAAS Couple Edit look${p.coupleIds.length > 1 ? 's' : ''}.`);
  if (p.reference) out.push(`Follows the ${p.reference.split(' ')[0]} reference direction for this season: ${p.embroidery}.`);
  out.push(`${p.fabric} in a ${p.silhouette.toLowerCase()} cut. Easy to move in for ${p.occasion.map(worldName).join(', ')}.`);
  if (p.styleTags.includes('Mirror Work')) out.push('Mirror work catches garba lights and camera flash.');
  if (p.priceType === 'verified' && p.price <= 1499) out.push('Sits in the under-₹1,499 budget band.');
  return out;
}

export default function ProductPage() {
  const { id } = useParams();
  const p = id ? byId.get(id) : undefined;
  if (!p) return <div className="page"><Empty title="Product not found"><Link to="/" className="btn btn-dark">Back home</Link></Empty></div>;
  const ctl = completeTheLook(p);
  const similar = PRODUCTS.filter((x) => x.id !== p.id && x.gender === p.gender && x.category === p.category && (x.colour === p.colour || x.embroidery === p.embroidery)).slice(0, 4);
  const inCouples = COUPLES.filter((c) => p.coupleIds.includes(c.id)).slice(0, 3);
  const featuredLook = womenLookForProduct(p.id);
  const tryOnHref = tryOnHrefForProduct(p);
  const exactMerchantUrl = exactMerchantProductUrl(p);
  const hasPrice = hasVerifiedPrice(p);
  const hasOutbound = Boolean(productOutboundAction(p));
  const gallery = p.gallery.length ? p.gallery : [''];

  return (
    <div className="page product">
      <div className="crumbs"><Link to="/">Home</Link> / <Link to={`/${p.gender}`}>{p.gender === 'women' ? 'Women' : 'Men'}</Link> / <Link to={`/${p.gender}/${p.category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}>{p.category}</Link></div>
      <div className="pdp">
        <div className="pdp-gallery">{gallery.map((g, i) => <ImageFrame key={i} src={g} alt={p.title} label={p.category} detail={`${p.colour} · ${p.embroidery} · ${p.fabric}`} eager />)}</div>
        <div className="pdp-info">
          {exactMerchantUrl && <div className="pcard-merchant">{p.merchant}</div>}
          <h1>{p.title}</h1>
          {hasPrice && <div className="pdp-price">{formatINR(p.price)}</div>}
          <dl className="specs">
            <div><dt>Colour</dt><dd>{p.colour}{p.secondaryColours.length ? ` with ${p.secondaryColours.join(', ')}` : ''}</dd></div>
            <div><dt>Occasion</dt><dd>{p.occasion.map((o) => <Link key={o} to={`/occasions/${o}`} className="tag">{worldName(o)}</Link>)}</dd></div>
            <div><dt>Style</dt><dd>{p.styleTags.join(' · ')}</dd></div>
            <div><dt>Fabric</dt><dd>{p.fabric}</dd></div>
            <div><dt>Details</dt><dd>{p.embroidery}</dd></div>
            <div><dt>Silhouette</dt><dd>{p.silhouette}</dd></div>
          </dl>
          <div className="pdp-ctas">
            <div className="pdp-primary-actions" aria-label="Product actions">
              {tryOnHref && <Link to={tryOnHref} className="btn btn-accent">Try it on</Link>}
              <ProductActionButton p={p} />
            </div>
            <SaveButton kind="product" id={p.id} image={p.imageUrl} />
          </div>
          <ShareRow path={`/product/${p.id}`} />
          <section className="why"><h3>Why we picked it</h3><ul>{whyPicked(p).map((w) => <li key={w}>{w}</li>)}</ul><p className="muted small">{p.description}</p></section>
          {hasOutbound && <p className="muted small">VIRAAS does not sell this item. Confirm current product details with the seller before purchasing.</p>}
        </div>
      </div>
      {featuredLook && <section className="section"><h2>Seen in this VIRAAS look</h2><div className="grid4"><LookCard to={`/women-look/${featuredLook.id}`} image={womenLookImage(featuredLook.id)} alt={`Women look ${featuredLook.referenceId} — ${featuredLook.garmentType}`} kicker={womenOccasionLabel(featuredLook.occasion)} title={`Look ${featuredLook.id.replace('women-look-', '')}`} meta={[featuredLook.garmentType, featuredLook.colors.primary]} tryOnTo={`/try-on?womenLook=${featuredLook.id}`} /></div></section>}
      {ctl.length > 0 && <section className="section"><h2>Complete the look</h2><div className="grid4">{ctl.map((x) => <ProductCard key={x.id} p={x} />)}</div></section>}
      {inCouples.length > 0 && <section className="section"><h2>Seen in the Couple Edit</h2><div className="grid3">{inCouples.map((c) => <CoupleCard key={c.id} c={c} />)}</div></section>}
      {similar.length > 0 && <section className="section"><h2>You may also like</h2><div className="grid4">{similar.map((x) => <ProductCard key={x.id} p={x} />)}</div></section>}
    </div>
  );
}
