import { Link } from 'react-router-dom';
import { COUPLES, WORLDS, PRODUCTS, BUDGETS, budgetsWithResults, coupleImageSrc } from '../lib/data';
import { CoupleCard, LookCard, SectionHead, ImageFrame } from '../components/ui';
import { featuredMenLooks, featuredWomenLooks, menLookImage, womenLookImage, shortDesc } from '../lib/looks';
import { menOccasionLabel } from '../lib/menCatalog';
import { womenOccasionLabel } from '../lib/womenCatalog';
import { ARTICLES } from '../lib/journal';

// Couples carry their approved image via the GENERATED status resolver, not a raw imageUrl.
const withImg = COUPLES.filter((c) => coupleImageSrc(c));
const heroImg = (id: string) => { const c = COUPLES.find((x) => x.id === id); return c ? coupleImageSrc(c) : undefined; };
const worldImage = (slug: string) => { const c = withImg.find((x) => x.world === slug); return c ? coupleImageSrc(c) : undefined; };

export default function Home() {
  // Homepage now features the APPROVED look images (real, QA-passed) — never imageless product placeholders.
  const her = featuredWomenLooks(undefined, 8);
  const him = featuredMenLooks(undefined, 8);
  // Trending this Navratri = approved Garba looks (women + men interleaved for variety).
  const gWomen = featuredWomenLooks('garba', 4);
  const gMen = featuredMenLooks('garba', 4);
  const trending = [gWomen[0], gMen[0], gWomen[1], gMen[1], gWomen[2], gMen[2], gWomen[3], gMen[3]].filter(Boolean);
  const couples = [...withImg, ...COUPLES.filter((c) => !coupleImageSrc(c))].slice(0, 6);
  const look = withImg[0] ?? COUPLES[0];
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
        <SectionHead kicker="For her" title="Chaniya, lehenga, saree, sharara" to="/women" cta="All 236 women looks" />
        <div className="grid4">{her.map((l) => (
          <LookCard key={l.id} to={`/women-look/${l.id}`} image={womenLookImage(l.id)} alt={`Women look ${l.referenceId} — ${l.garmentType}`}
            kicker={womenOccasionLabel(l.occasion)} title={`Look ${l.id.replace('women-look-', '')}`} meta={[l.garmentType, l.colors.primary]}
            tryOnTo={`/try-on?womenLook=${l.id}`} />
        ))}</div>
      </section>

      {/* 4 FOR HIM */}
      <section className="section">
        <SectionHead kicker="For him" title="Modern kurtas, printed shirts, statement layers" to="/men" cta="All 210 men looks" />
        <div className="grid4">{him.map((l) => (
          <LookCard key={l.id} to={`/men-look/${l.id}`} image={menLookImage(l.id)} alt={`Men look ${l.referenceId} — ${l.garmentType}`}
            kicker={menOccasionLabel(l.occasion)} title={`Look ${l.id.replace('men-look-', '')}`} meta={[l.garmentType, l.colors.primary]}
            tryOnTo={`/try-on?menLook=${l.id}`} />
        ))}</div>
      </section>

      {/* 5 SEE IT ON YOU */}
      <section className="section tryon-band">
        <div>
          <div className="kicker">See it on you</div>
          <h2>Try the outfit before you shop it.</h2>
          <p>Pick a look, upload a photo and preview it on you. Uploading a personal photo requires you to be 18+. If you're 16–17, you can still browse, save, share and shop.</p>
          <Link to="/try-on" className="btn btn-dark">Try an outfit on you</Link>
        </div>
        <ol className="steps"><li>Choose a look</li><li>Confirm you're 18+</li><li>Upload a photo</li><li>Preview → Generate</li><li>Save, share or shop</li></ol>
      </section>

      {/* 6 TRENDING */}
      <section className="section">
        <SectionHead kicker="Trending this Navratri" title="This season's most-loved Garba looks" to="/occasions/garba" cta="All Garba looks" />
        <div className="grid4">{trending.map((l) => {
          const isWomen = l.id.startsWith('women-look-');
          return <LookCard key={l.id} to={`/${isWomen ? 'women' : 'men'}-look/${l.id}`} image={isWomen ? womenLookImage(l.id) : menLookImage(l.id)}
            alt={`${isWomen ? 'Women' : 'Men'} Garba look ${l.referenceId}`} kicker="Garba / Navratri"
            title={`Look ${l.id.replace(/^(women|men)-look-/, '')}`} meta={[l.garmentType, l.colors.primary]}
            tryOnTo={`/try-on?${isWomen ? 'womenLook' : 'menLook'}=${l.id}`} />;
        })}</div>
      </section>

      {/* 7 COUPLE EDIT */}
      <section className="section couple-band">
        <SectionHead kicker="Couple Edit" title="Twinning, not matching" to="/couple-edit" cta="All 100 couple looks" />
        <div className="grid3">{couples.map((c) => <CoupleCard key={c.id} c={c} />)}</div>
      </section>

      {/* 8 COMPLETE THE LOOK */}
      <section className="section ctl">
        <div className="ctl-img"><ImageFrame src={coupleImageSrc(look)} alt={look.title} /></div>
        <div>
          <div className="kicker">Complete the look</div>
          <h2>{look.title}</h2>
          <p className="muted">{look.colourStory}</p>
          <dl className="specs">
            <div><dt>Her</dt><dd>{shortDesc(look.her.desc)}</dd></div>
            <div><dt>Him</dt><dd>{shortDesc(look.him.desc)}</dd></div>
            <div><dt>The moment</dt><dd>{look.pose}</dd></div>
          </dl>
          <Link to={`/couple-edit/${look.id}`} className="btn btn-dark">Style this look</Link>
        </div>
      </section>

      {/* 9 BUDGET */}
      <section className="section">
        <SectionHead kicker="Budget collections" title="Festive at every price" />
        <div className="budget-row">{budgets.map((b) => <Link key={b.slug} to={`/trending?budget=${b.slug}`} className="budget-chip">{b.label}</Link>)}</div>
        <p className="muted small">Budgets shown only where products exist. {BUDGETS.length - budgets.length > 0 ? `${BUDGETS.length - budgets.length} band(s) hidden: no current products.` : ''}</p>
      </section>

      {/* 10 JOURNAL */}
      <section className="section">
        <SectionHead kicker="Journal" title="Style notes for the season" to="/journal" />
        <div className="grid3">{ARTICLES.slice(0, 3).map((a) => (
          <Link key={a.slug} to={`/journal/${a.slug}`} className="article-card"><div className="kicker">{a.kicker} · {a.minutes} min</div><h3>{a.title}</h3><p className="muted">{a.intro}</p></Link>
        ))}</div>
      </section>

      {/* 11 WHATSAPP */}
      <section className="section wa-band">
        <div><h2>Stuck between two looks?</h2><p>Message us on WhatsApp for free styling help. We'll send links, never pressure.</p></div>
        <a className="btn btn-light" href="https://wa.me/?text=Hi%20VIRAAS%2C%20help%20me%20pick%20a%20festive%20look" target="_blank" rel="noopener noreferrer">Chat on WhatsApp</a>
      </section>
    </div>
  );
}
