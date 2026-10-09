import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { WORLDS } from '../lib/data';
import { menGarmentCategories } from '../lib/menCatalog';
import { womenGarmentCategories } from '../lib/womenCatalog';
import { useSaved } from '../lib/saved';
import { useTryOnAvailable } from '../lib/tryOnStatus';
import { VIRAAS_WHATSAPP_DISPLAY, whatsappChatUrl, whatsAppTopicForPath } from '../lib/whatsapp';

// Women/Men category navigation is derived from the approved look metadata itself (garmentType),
// so a menu entry can only ever be shown when the catalog actually has looks behind it.
function Mega({ gender }: { gender: 'women' | 'men' }) {
  const categories = gender === 'women' ? womenGarmentCategories : menGarmentCategories;
  return (
    <div className="mega" role="menu">
      <div><h4>Categories</h4>{categories.map((c) => <Link key={c.slug} to={`/${gender}/${c.slug}`}>{c.label}</Link>)}</div>
      <div><h4>Occasions</h4>{WORLDS.map((w) => <Link key={w.slug} to={`/${gender}?occasion=${w.slug}`}>{w.name}</Link>)}</div>
    </div>
  );
}

export default function Layout() {
  const [open, setOpen] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);
  const [q, setQ] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const loc = useLocation();
  const nav = useNavigate();
  const { items } = useSaved();
  const tryOnAvailable = useTryOnAvailable();
  // The site-wide floating WhatsApp CTA is a direct chat to the VIRAAS number; the prefilled
  // message follows the section the visitor is currently browsing.
  const floatingTopic = whatsAppTopicForPath(loc.pathname);
  useEffect(() => { setOpen(null); setMobile(false); setSearchOpen(false); window.scrollTo(0, 0); }, [loc.pathname, loc.search]);

  const item = (to: string, label: string, mega?: 'women' | 'men') => (
    <div className="nav-item" onMouseEnter={() => mega && setOpen(mega)} onMouseLeave={() => setOpen(null)}>
      <NavLink to={to}>{label}</NavLink>
      {mega && open === mega && <Mega gender={mega} />}
    </div>
  );

  return (
    <div className="app">
      <div className="announce">Rooted in tradition. Designed for now.</div>
      <header className="header">
        <div className="header-inner">
          <button className="burger" aria-label="Menu" onClick={() => setMobile((m) => !m)}>☰</button>
          <Link to="/" className="logo" aria-label="VIRAAS home">VIRAAS</Link>
          <nav className={`nav ${mobile ? 'open' : ''}`} aria-label="Main">
            {item('/women', 'Women', 'women')}
            {item('/men', 'Men', 'men')}
            {item('/occasions', 'Occasions')}
            {item('/couple-edit', 'Couple Edit')}
            {item('/trending', 'Trending')}
            {item('/shop', 'Shop')}
            {item('/connect', 'Connect')}
            {item('/journal', 'Journal')}
          </nav>
          <div className="header-actions">
            <button className="icon-btn" aria-label="Search" onClick={() => setSearchOpen((s) => !s)}>
              <svg viewBox="0 0 24 24" width="20" height="20"><circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="1.7" /><path d="M20 20l-4-4" stroke="currentColor" strokeWidth="1.7" /></svg>
              <span className="hide-sm">Search</span>
            </button>
            <Link to="/saved" className="icon-btn" aria-label="Saved Looks">
              <svg viewBox="0 0 24 24" width="20" height="20"><path d="M12 21s-7.5-4.6-9.5-9.2C1.1 8.4 3.3 5 6.8 5c2 0 3.5 1.1 5.2 3 1.7-1.9 3.2-3 5.2-3 3.5 0 5.7 3.4 4.3 6.8C19.5 16.4 12 21 12 21z" fill="none" stroke="currentColor" strokeWidth="1.6" /></svg>
              <span className="hide-sm">Saved Looks</span>{items.length > 0 && <span className="count">{items.length}</span>}
            </Link>
            {tryOnAvailable && <Link to="/try-on" className="btn btn-accent sm">Try On</Link>}
          </div>
        </div>
        {searchOpen && (
          <form className="searchbar" onSubmit={(e) => { e.preventDefault(); if (q.trim()) nav(`/search?q=${encodeURIComponent(q.trim())}`); }}>
            <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Try “garba men”, “pink lehenga”, “pre draped saree”, “couple garba”" aria-label="Search VIRAAS" />
            <button className="btn btn-dark sm" type="submit">Search</button>
          </form>
        )}
      </header>
      <main><Outlet /></main>
      <a
        className="wa-float"
        href={whatsappChatUrl(floatingTopic)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`WhatsApp styling support on ${VIRAAS_WHATSAPP_DISPLAY}`}
        data-whatsapp-topic={floatingTopic}
      >WhatsApp</a>
      <footer className="footer">
        <div className="footer-inner">
          <div>
            <div className="logo light">VIRAAS</div>
            <p className="tagline">Rooted in tradition. Designed for now.</p>
          </div>
          <div>
            <h4>Explore</h4>
            <Link to="/women">Women</Link>
            <Link to="/men">Men</Link>
            <Link to="/occasions">Occasions</Link>
            <Link to="/couple-edit">Couple Edit</Link>
            <Link to="/trending">Trending</Link>
            <Link to="/shop">Shop</Link>
          </div>
          <div>
            <h4>VIRAAS</h4>
            <Link to="/connect">Connect</Link>
            <Link to="/journal">Journal</Link>
            <Link to="/try-on">AI Try-On</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
          </div>
          <div>
            <h4>Policies</h4>
            <Link to="/affiliate-disclosure">Affiliate Disclosure</Link>
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms of Use</Link>
            <Link to="/ai-try-on-privacy">AI Try-On Privacy</Link>
            <Link to="/faq">FAQ</Link>
          </div>
        </div>
        <div className="footer-min">VIRAAS © 2026 · Owned &amp; operated by AYUSH SAHU</div>
      </footer>
    </div>
  );
}
