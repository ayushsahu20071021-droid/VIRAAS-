import { Link } from 'react-router-dom';
import { PAYU_VERIFIED_PRODUCTS } from '../data/payu-verified-products';
import { formatINR } from '../lib/format';
import { ImageFrame } from '../components/ui';
import { COUPLES, coupleImageSrc } from '../lib/data';
import { MEN_LOOK_TOTAL } from '../lib/menCatalog';
import { WOMEN_LOOK_TOTAL } from '../lib/womenCatalog';
import { featuredMenLooks, featuredWomenLooks, menLookImage, womenLookImage } from '../lib/looks';

// SHOP-PAGE-ONLY browse cards. These are navigation into the three existing catalog routes, not
// priced products: they carry no price, no retailer claim and no workbook link, and they are
// deliberately NOT rendered on the homepage (Home keeps its six verified-price cards only).
// Counts come from the live catalogs so the copy can never drift from the records behind it.
const heroWomen = featuredWomenLooks(undefined, 1)[0];
const heroMen = featuredMenLooks(undefined, 1)[0];
const heroCouple = COUPLES.find((c) => coupleImageSrc(c));

const SHOP_COLLECTIONS = [
  {
    id: 'women',
    to: '/women',
    kicker: 'For her',
    title: 'Women',
    cta: 'Browse Women',
    meta: `${WOMEN_LOOK_TOTAL} festive looks — lehenga, chaniya choli, saree and sharara`,
    image: heroWomen ? womenLookImage(heroWomen.id) : undefined,
    alt: 'VIRAAS women’s festive look',
  },
  {
    id: 'men',
    to: '/men',
    kicker: 'For him',
    title: 'Men',
    cta: 'Browse Men',
    meta: `${MEN_LOOK_TOTAL} festive looks — kurta sets, ethnic shirts and festive separates`,
    image: heroMen ? menLookImage(heroMen.id) : undefined,
    alt: 'VIRAAS men’s festive look',
  },
  {
    id: 'couple',
    to: '/couple-edit',
    kicker: 'Together',
    title: 'Couple',
    cta: 'Browse Couple',
    meta: `${COUPLES.length} coordinated couple looks across five festive worlds`,
    image: heroCouple ? coupleImageSrc(heroCouple) : undefined,
    alt: 'VIRAAS Couple Edit festive look',
  },
];

export default function Shop() {
  return (
    <div className="page shop-page">
      <div className="page-head">
        <div className="crumbs"><a href="/">Home</a> / Shop</div>
        <div className="kicker">The VIRAAS Shop</div>
        <h1>Curated pieces with transparent INR pricing.</h1>
        <p className="muted">These are exact mapped products from VIRAAS source links with current verified prices. Product checkout happens on the listed retailer website.</p>
      </div>

      <section className="shop-grid" aria-label="Priced VIRAAS products">
        {PAYU_VERIFIED_PRODUCTS.map((product) => (
          <article className="shop-product-card" key={product.id} data-shop-product-id={product.id}>
            <div className="shop-product-top">
              <span className="shop-retailer">{product.retailer}</span>
              <span className="shop-verified">Price verified</span>
            </div>
            <div className="shop-product-number">VIRAAS CURATED PIECE</div>
            <h2>{product.title}</h2>
            <div className="shop-price-row">
              <strong>{formatINR(product.price)}</strong>
              {product.mrp && product.mrp > product.price && <span className="shop-mrp">MRP {formatINR(product.mrp)}</span>}
            </div>
            <a className="btn btn-shop" href={product.shopUrl} target="_blank" rel="noopener noreferrer nofollow sponsored">
              View retailer
            </a>
          </article>
        ))}
      </section>

      <section className="shop-collections" aria-label="Browse VIRAAS collections">
        <div className="section-head">
          <div>
            <div className="kicker">Keep browsing</div>
            <h2>Three edits, one festive wardrobe.</h2>
          </div>
        </div>
        <div className="shop-collection-grid">
          {SHOP_COLLECTIONS.map((collection) => (
            <Link className="shop-collection-card" to={collection.to} key={collection.id} data-shop-collection={collection.id}>
              <ImageFrame src={collection.image} alt={collection.alt} label={collection.title} ratio="3 / 3.6" />
              <div className="shop-collection-body">
                <div className="kicker">{collection.kicker}</div>
                <h3>{collection.title}</h3>
                <p className="muted">{collection.meta}</p>
                <span className="btn btn-dark sm">{collection.cta} →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="shop-note">
        <div className="kicker">Transparent shopping</div>
        <h2>VIRAAS is the discovery layer.</h2>
        <p>VIRAAS does not process payment for these fashion products. The retailer handles product checkout, shipping, returns and final availability. The separate AI Try-On service is priced at 20 INR per try-on.</p>
      </section>
    </div>
  );
}
