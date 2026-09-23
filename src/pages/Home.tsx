import { Link } from 'react-router-dom';
import { PRODUCTS, COUPLES, WORLDS, BUDGETS, budgetsWithResults, type Product } from '../lib/data';
import { ProductCard, CoupleCard, SectionHead, ImageFrame } from '../components/ui';
import { ARTICLES } from '../lib/journal';

const ranked = (list: Product[]) => [...list].sort((a, b) => Number(!!b.imageUrl) - Number(!!a.imageUrl) || b.coupleIds.length - a.coupleIds.length);
const passedCouples = COUPLES.filter((c) => c.imageUrl);
const heroImg = (id: string) => COUPLES.find((c) => c.id === id)?.imageUrl;
const worldImage = (slug: string) => passedCouples.find((c) => c.world === slug)?.imageUrl;

export default function Home() {
  const her = ranked(PRODUCTS.filter((p) => p.gender === 'women' && !p.accessory)).slice(0, 8);
  const him = ranked(PRODUCTS.filter((p) => p.gender === 'men' && !p.accessory)).slice(0, 8);
  const trending = ranked(PRODUCTS.filter((p) => p.occasion.includes('garba') && !p.accessory && p.coupleIds.length)).slice(0, 8);
  const acc = PRODUCTS.filter((p) => p.accessory).slice(0, 8);
  const couples = [...passedCouples, ...COUPLES.filter((c) => !c.imageUrl)].slice(0, 6);
  const look = COUPLES[0];
  const lookProducts = [...look.herProductIds, ...look.hisProductIds].map((id) => PRODUCTS.find((p) => p.id === id)!).filter(Boolean);
  const budgets = budgetsWithResults(PRODUCTS);

  return (
    <div className="home">
      {/* 1 HERO */}
      <section className="hero">
        <div className="hero-copy">
          <div className="kicker light">THE FESTIVE EDIT ’26</div>
          <h1>Tradition,<br /><em>reimagined</em> for now.</h1>
          <p>Discover the look. See it on you. Shop the real outfit.</p>
          <div className="hero-ctas">
            <Link to="/women" className="btn btn-light">Shop Women</Link>
            <Link to="/men" className="btn btn-outline-light">Shop Men</Link>
            <Link to="/try-on" className="btn btn-accent">Try an outfit on you</Link>
          </div>
        </div>
        <div className="hero-collage">
          <div className="h1"><ImageFrame src={heroImg('garba-01')} alt="Rani pink lehenga and phulkari dupatta mirror selfie" eager /></div>
          <div className="h2"><ImageFrame src={heroImg('garba-10')} alt="Red flared chaniya twirl at garba night" eager /></div>
          <div className="h3"><ImageFrame src={heroImg('garba-03')} alt="Ivory mirror-work lehenga on diya-lit steps" eager /></div>
        </div>
      </section>

      {/* 2 OCCASIONS */}
      <section className="section">
        <SectionHead kicker="Occasion discovery" title="Dress for the moment" to="/occasions" cta="All occasions" />
        <div className="worlds">
          {WORLDS.map((w) => (
            <Link key={w.slug} to={`/occasions/${w.slug}`} className="world-tile">
              <ImageFrame src={worldImage(w.slug)} alt={`${w.name} looks`} label={w.name} ratio="3 / 4.2" />
              <div className="world-label"><strong>{w.name}</strong><span>{w.blurb}</span></div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3 FOR HER */}
      <section className="section">
        <SectionHead kicker="For her" title="Chaniya, lehenga, saree, sharara" to="/women" cta="Shop women" />
        <div className="grid4">{her.map((p) => <ProductCard key={p.id} p={p} />)}</div>
      </section>

      {/* 4 FOR HIM */}
      <section className="section">
        <SectionHead kicker="For him" title="Modern kurtas, printed shirts, statement layers" to="/men" cta="Shop men" />
        <div className="grid4">{him.map((p) => <ProductCard key={p.id} p={p} />)}</div>
      </section>

      {/* 5 SEE IT ON YOU */}
      <section className="section tryon-band">
        <div>
          <div className="kicker">See it on you</div>
          <h2>Try the outfit before you shop it.</h2>
          <p>Pick a product, upload a photo and preview the look. Uploading a personal photo requires you to be 18+. If you're 16–17, you can still browse, save, share and shop.</p>
          <Link to="/try-on" className="btn btn-dark">Try an outfit on you</Link>
        </div>
        <ol className="steps"><li>Choose a product</li><li>Confirm you're 18+</li><li>Upload a photo</li><li>Preview → Generate</li><li>Save, share or shop</li></ol>
      </section>

      {/* 6 TRENDING */}
      <section className="section">
        <SectionHead kicker="Trending this Navratri" title="Pieces from this season's couple looks" to="/trending" />
        <div className="grid4">{trending.map((p) => <ProductCard key={p.id} p={p} />)}</div>
      </section>

      {/* 7 COUPLE EDIT */}
      <section className="section couple-band">
        <SectionHead kicker="Couple Edit" title="Twinning, not matching" to="/couple-edit" cta="All 100 couple looks" />
        <div className="grid3">{couples.map((c) => <CoupleCard key={c.id} c={c} />)}</div>
      </section>

      {/* 8 ACCESSORIES */}
      <section className="section">
        <SectionHead kicker="Accessories" title="Jhumkas, potlis, juttis" to="/accessories" />
        <div className="grid4">{acc.map((p) => <ProductCard key={p.id} p={p} />)}</div>
      </section>

      {/* 9 BUDGET */}
      <section className="section">
        <SectionHead kicker="Budget collections" title="Festive at every price" />
        <div className="budget-row">{budgets.map((b) => <Link key={b.slug} to={`/trending?budget=${b.slug}`} className="budget-chip">{b.label}</Link>)}</div>
        <p className="muted small">Budgets shown only where products exist. {BUDGETS.length - budgets.length > 0 ? `${BUDGETS.length - budgets.length} band(s) hidden: no current products.` : ''}</p>
      </section>

      {/* 10 COMPLETE THE LOOK */}
      <section className="section ctl">
        <div className="ctl-img"><ImageFrame src={look.imageUrl} alt={look.title} /></div>
        <div>
          <div className="kicker">Complete the look</div>
          <h2>{look.title}</h2>
          <p className="muted">{look.colourStory}</p>
          <ul className="ctl-list">{lookProducts.map((p) => <li key={p.id}><Link to={`/product/${p.id}`}>{p.title}</Link><span>{p.merchant}</span></li>)}</ul>
          <Link to={`/couple-edit/${look.id}`} className="btn btn-dark">Shop this look</Link>
        </div>
      </section>

      {/* 11 JOURNAL */}
      <section className="section">
        <SectionHead kicker="Journal" title="Style notes for the season" to="/journal" />
        <div className="grid3">{ARTICLES.slice(0, 3).map((a) => (
          <Link key={a.slug} to={`/journal/${a.slug}`} className="article-card"><div className="kicker">{a.kicker} · {a.minutes} min</div><h3>{a.title}</h3><p className="muted">{a.intro}</p></Link>
        ))}</div>
      </section>

      {/* 12 WHATSAPP */}
      <section className="section wa-band">
        <div><h2>Stuck between two looks?</h2><p>Message us on WhatsApp for free styling help. We'll send links, never pressure.</p></div>
        <a className="btn btn-light" href="https://wa.me/?text=Hi%20VIRAAS%2C%20help%20me%20pick%20a%20festive%20look" target="_blank" rel="noopener noreferrer">Chat on WhatsApp</a>
      </section>
    </div>
  );
}
