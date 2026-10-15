import { Link, useParams } from 'react-router-dom';
import { ARTICLES } from '../lib/journal';
import { Empty } from '../components/ui';
import { VIRAAS_WHATSAPP_DISPLAY, whatsappChatUrl } from '../lib/whatsapp';

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
    <p>For styling help, message us on <a href={whatsappChatUrl('general')} target="_blank" rel="noopener noreferrer" data-whatsapp-topic="general">WhatsApp ({VIRAAS_WHATSAPP_DISPLAY})</a>.</p>
    <p>For orders, deliveries, returns and refunds, contact the retailer you bought from. VIRAAS does not process orders.</p>
    <p>Partnerships and press: use the WhatsApp link above, and we'll share an email address.</p>
    <p>Start with a topic: <a href={whatsappChatUrl('women')} target="_blank" rel="noopener noreferrer" data-whatsapp-topic="women">Women's outfits</a> · <a href={whatsappChatUrl('men')} target="_blank" rel="noopener noreferrer" data-whatsapp-topic="men">Men's outfits</a> · <a href={whatsappChatUrl('couple')} target="_blank" rel="noopener noreferrer" data-whatsapp-topic="couple">Couple outfits</a></p>
  </Prose>
);
export const FAQ = () => (
  <Prose title="FAQ">
    <h2>Do you sell these products?</h2><p>No. VIRAAS curates and links out. Checkout happens on the retailer's site.</p>
    <h2>Why is the price different on the retailer's site?</h2><p>Prices on VIRAAS are approximate prices for the style. Marketplace prices change often, so always check the retailer's price.</p>
    <h2>How do I shop a look?</h2><p>VIRAAS is a discovery platform and does not accept product orders or payments. The Shop page currently has no retailer checkout buttons. If you choose to visit a retailer, its listing and policies govern the purchase.</p>
    <h2>Who can use AI Try-On?</h2><p>Photo upload is for users aged 18+. Users aged 16–17 can browse, save, share and shop.</p>
    <h2>Where are my Saved Looks stored?</h2><p>On your device only (browser localStorage).</p>
    <h2>Why do some images say “Coming soon”?</h2><p>We only publish original VIRAAS visuals that pass our quality check. A few are still on the way.</p>
  </Prose>
);
export const Privacy = () => (
  <Prose title="Privacy Policy">
    <p>VIRAAS doesn't need an account. Saved Looks stay in your browser's localStorage and never reach our servers.</p>
    <p>When you tap Shop, you leave VIRAAS, and the retailer's privacy policy applies from then on. Affiliate partners may set cookies on the retailer's site.</p>
    <p>AI Try-On is currently unavailable, and no personal photo is sent for generation. If the service is enabled later, this notice will describe the provider and its data handling before photo upload is available. See <Link to="/ai-try-on-privacy">AI Try-On Privacy</Link>.</p>
    <p>We don't sell personal data.</p>
  </Prose>
);
export const Terms = () => (
  <Prose title="Terms of Use">
    <p>VIRAAS provides fashion discovery, curation and outbound links. We aren't a party to any purchase you make with a retailer.</p>
    <p>Product names, prices, colours and availability are indicative. The retailer's listing is authoritative.</p>
    <p>AI Try-On is currently unavailable and no payment is currently accepted for it. If enabled in future, results will be illustrative and may not show exact fit, colour or drape.</p>
    <p>Original VIRAAS images may not be reused commercially without permission.</p>
  </Prose>
);
export const RefundCancellation = () => (
  <Prose title="Cancellation & Refund Policy">
    <p><strong>Operated by:</strong> AYUSH SAHU (VIRAAS). Contact: <a href="mailto:aayushsahu21102007@gmail.com">aayushsahu21102007@gmail.com</a> or <a href={whatsappChatUrl('general')} target="_blank" rel="noopener noreferrer">WhatsApp ({VIRAAS_WHATSAPP_DISPLAY})</a>.</p>
    <h2>Fashion products</h2>
    <p>VIRAAS is a fashion discovery and affiliate-curation platform. VIRAAS does not sell, stock, ship or collect payment for the fashion products displayed on this website. Any product purchase is completed directly with the external retailer, and that retailer's cancellation, return and refund policy applies. Please contact the retailer for an order placed on its website.</p>
    <h2>VIRAAS digital services</h2>
    <p>AI Try-On is currently unavailable and VIRAAS is not currently accepting payment for Try-On. Do not make a payment for this service until it is explicitly enabled on the website. If a payment is accidentally captured without a service being provided, contact us with the transaction ID and payment date.</p>
    <p>Once paid AI Try-On is launched, a cancellation requested before generation starts will be eligible for a full refund. A completed generation is normally non-refundable, except for a failed service, duplicate charge, or payment captured without a usable result. Approved refunds will be sent to the original payment method; bank/payment-provider posting times may vary. We will review a complete request and communicate the outcome by email or WhatsApp.</p>
    <h2>How to request help</h2>
    <p>Email <a href="mailto:aayushsahu21102007@gmail.com">aayushsahu21102007@gmail.com</a> or message <a href={whatsappChatUrl('general')} target="_blank" rel="noopener noreferrer">WhatsApp ({VIRAAS_WHATSAPP_DISPLAY})</a>. Include your name, transaction ID (if any), date and reason. Never share your UPI PIN, OTP or full card details.</p>
  </Prose>
);
export const ShippingDelivery = () => (
  <Prose title="Shipping & Delivery Policy">
    <p><strong>Operated by:</strong> AYUSH SAHU (VIRAAS). Contact: <a href="mailto:aayushsahu21102007@gmail.com">aayushsahu21102007@gmail.com</a> or <a href={whatsappChatUrl('general')} target="_blank" rel="noopener noreferrer">WhatsApp ({VIRAAS_WHATSAPP_DISPLAY})</a>.</p>
    <h2>Fashion products</h2>
    <p>VIRAAS does not own inventory, accept orders, pack or ship physical products. When you choose to shop, the retailer handles checkout, delivery, shipping fees, tracking, returns and delivery estimates. Please check the retailer's product page and policies before purchasing.</p>
    <h2>VIRAAS digital services</h2>
    <p>AI Try-On is currently unavailable and no paid digital service is currently being delivered. If the service is enabled in future, the website will explain the delivery process and expected turnaround before payment is accepted. No physical shipment is involved in AI Try-On.</p>
  </Prose>
);
export const AffiliateDisclosure = () => (
  <Prose title="Affiliate Disclosure">
    <p className="lead">VIRAAS may earn a commission when you shop through selected affiliate links.</p>
    <p>This never changes the price you pay. Some looks don't have an active Shop link yet — those simply aren't shoppable through VIRAAS until a verified link is added.</p>
    <p>We link only to Myntra, AJIO, Flipkart, Shopsy, Meesho and Nykaa.</p>
  </Prose>
);
export const TryOnPrivacy = () => (
  <Prose title="AI Try-On Privacy">
    <p>AI Try-On with a personal photo is only for users aged 18 and above. It works the same way for Men, Women and Couple looks.</p>
    <h2>What happens to your photo</h2>
    <p>Try-On generation is currently disabled. You can browse looks, but the app will not accept or send a personal photo for generation. If Try-On is enabled later, this notice will be updated with the provider, transmission details and verified retention terms before photo upload is made available.</p>
    <h2>Provider status</h2>
    <p>VIRAAS is configured to use Runware FLUX VTO, but live generation is not available until the server credentials, organization-level Zero Data Retention, persistent VIRAAS identity and credit ledger, and payment safeguards are ready. When the API key is absent, the Try-On status page reports <code>RUNWARE_API_KEY required</code>. No preview image is substituted for an AI result.</p>
    <h2>Your result</h2>
    <p>A generated result is private to you. It is never added to the catalog or made public automatically. If you Save it, it is stored only in your browser (localStorage) on your device. Download and Share are actions you choose — sharing uses your device’s own share sheet and does not create a public link.</p>
    <h2>Please note</h2>
    <p>Don’t upload photos of other people without their consent, or photos of anyone under 18.</p>
  </Prose>
);
export const NotFound = () => <div className="page"><Empty title="Page not found"><Link to="/" className="btn btn-dark">Back home</Link></Empty></div>;
