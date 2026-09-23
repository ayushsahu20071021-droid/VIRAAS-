import { Link, useParams } from 'react-router-dom';
import { ARTICLES } from '../lib/journal';
import { Empty } from '../components/ui';

export function Journal() {
  return (
    <div className="page">
      <div className="page-head"><div className="kicker">Journal</div><h1>Style notes</h1><p className="muted">{ARTICLES.length} guides for the festive season.</p></div>
      <div className="grid3">{ARTICLES.map((a) => (
        <Link key={a.slug} to={`/journal/${a.slug}`} className="article-card"><div className="kicker">{a.kicker} · {a.minutes} min</div><h3>{a.title}</h3><p className="muted">{a.intro}</p></Link>
      ))}</div>
    </div>
  );
}
export function Article() {
  const { slug } = useParams();
  const a = ARTICLES.find((x) => x.slug === slug);
  if (!a) return <div className="page"><Empty title="Article not found"><Link to="/journal" className="btn btn-dark">Journal</Link></Empty></div>;
  return (
    <article className="page prose">
      <div className="kicker">{a.kicker} · {a.minutes} min read</div>
      <h1>{a.title}</h1>
      <p className="lead">{a.intro}</p>
      {a.sections.map((s) => <section key={s.h}><h2>{s.h}</h2><p>{s.p}</p></section>)}
      <div className="article-links"><h3>Shop the story</h3>{a.links.map((l) => <Link key={l.to} to={l.to} className="btn btn-ghost sm">{l.label} →</Link>)}</div>
    </article>
  );
}

const Prose = ({ title, children }: { title: string; children: React.ReactNode }) => <div className="page prose"><h1>{title}</h1>{children}</div>;

export const About = () => (
  <Prose title="About VIRAAS">
    <p className="lead">ROOTED IN TRADITION. DESIGNED FOR NOW.</p>
    <p>VIRAAS is a fashion discovery and curation platform for young India, built around five festive worlds: Garba, College Fest, Diwali, Festive Party and Traditional.</p>
    <p><strong>VIRAAS is a discovery/curation platform. External retailers complete checkout. VIRAAS does not own inventory or process final merchant checkout.</strong></p>
    <p>When you tap Shop, you go to the retailer (Myntra, AJIO, Flipkart, Shopsy, Meesho or Nykaa), where you see live prices, sizes, stock and return policies. Prices on VIRAAS are approximate style prices, not live listings.</p>
    <p>Our Couple Edit photography and product visuals are original VIRAAS compositions inspired by real festive fashion references. We do not republish third-party photos.</p>
    <p>Wear your story.</p>
  </Prose>
);
export const Contact = () => (
  <Prose title="Contact">
    <p>For styling help, message us on <a href="https://wa.me/?text=Hi%20VIRAAS" target="_blank" rel="noopener noreferrer">WhatsApp</a>.</p>
    <p>For orders, deliveries, returns and refunds, contact the retailer you bought from. VIRAAS does not process orders.</p>
    <p>Partnerships and press: use the WhatsApp link above, and we'll share an email address.</p>
  </Prose>
);
export const FAQ = () => (
  <Prose title="FAQ">
    <h2>Do you sell these products?</h2><p>No. VIRAAS curates and links out. Checkout happens on the retailer's site.</p>
    <h2>Why is the price different on the retailer's site?</h2><p>Prices on VIRAAS are approximate prices for the style. Marketplace prices change often, so always check the retailer's price.</p>
    <h2>Why does it say “Affiliate link not configured”?</h2><p>For that product, the Shop button opens a regular marketplace search. Affiliate tracking hasn't been set up for it yet.</p>
    <h2>Who can use AI Try-On?</h2><p>Photo upload is for users aged 18+. Users aged 16–17 can browse, save, share and shop.</p>
    <h2>Where are my Saved Looks stored?</h2><p>On your device only (browser localStorage).</p>
    <h2>Why do some images say “Image pending”?</h2><p>We only publish original VIRAAS visuals that pass our quality check. Pending items are still in the generation queue.</p>
  </Prose>
);
export const Privacy = () => (
  <Prose title="Privacy Policy">
    <p>VIRAAS doesn't need an account. Saved Looks stay in your browser's localStorage and never reach our servers.</p>
    <p>When you tap Shop, you leave VIRAAS, and the retailer's privacy policy applies from then on. Affiliate partners may set cookies on the retailer's site.</p>
    <p>AI Try-On photos are covered by the <Link to="/ai-try-on-privacy">AI Try-On Privacy</Link> notice.</p>
    <p>We don't sell personal data.</p>
  </Prose>
);
export const Terms = () => (
  <Prose title="Terms of Use">
    <p>VIRAAS provides fashion discovery, curation and outbound links. We aren't a party to any purchase you make with a retailer.</p>
    <p>Product names, prices, colours and availability are indicative. The retailer's listing is authoritative.</p>
    <p>AI Try-On results are illustrative and may not show exact fit, colour or drape.</p>
    <p>Original VIRAAS images may not be reused commercially without permission.</p>
  </Prose>
);
export const AffiliateDisclosure = () => (
  <Prose title="Affiliate Disclosure">
    <p className="lead">VIRAAS may earn a commission when you shop through selected affiliate links.</p>
    <p>This never changes the price you pay. Where a product says “Affiliate link not configured”, the link is a plain marketplace link with no affiliate tracking.</p>
    <p>We link only to Myntra, AJIO, Flipkart, Shopsy, Meesho and Nykaa.</p>
  </Prose>
);
export const TryOnPrivacy = () => (
  <Prose title="AI Try-On Privacy">
    <p>AI Try-On with a personal photo is only for users aged 18 and above.</p>
    <p>Your photo is sent to our <code>/api/try-on</code> endpoint only to generate the preview. In demo mode, no AI provider is called, and the photo is never written to disk or stored.</p>
    <p>If a live provider is enabled in future, photos will be processed only to create your result and deleted afterwards. We'll list the provider on this page.</p>
    <p>Don't upload photos of other people without their consent, or photos of anyone under 18.</p>
  </Prose>
);
export const NotFound = () => <div className="page"><Empty title="Page not found"><Link to="/" className="btn btn-dark">Back home</Link></Empty></div>;
