import { PAYU_VERIFIED_PRODUCTS } from '../data/payu-verified-products';
import { formatINR } from '../lib/format';

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
          <article className="shop-product-card" key={product.id}>
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
            <p className="shop-source">{product.sourceLabel}. Price and availability can change on the retailer website.</p>
            <a className="btn btn-shop" href={product.shopUrl} target="_blank" rel="noopener noreferrer nofollow sponsored">
              View retailer
            </a>
          </article>
        ))}
      </section>

      <section className="shop-note">
        <div className="kicker">Transparent shopping</div>
        <h2>VIRAAS is the discovery layer.</h2>
        <p>VIRAAS does not process payment for these fashion products. The retailer handles product checkout, shipping, returns and final availability. The separate AI Try-On service is priced at 20 INR per try-on.</p>
      </section>
    </div>
  );
}
