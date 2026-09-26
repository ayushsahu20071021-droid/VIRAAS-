import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { categoriesFor, WORLDS, BUDGETS, budgetsWithResults, PRODUCTS } from '../lib/data';
import { useSaved } from '../lib/saved';

const WOMEN_MENU = ['Chaniya Choli', 'Lehenga', 'Sharara', 'Gharara', 'Saree', 'Pre-Draped Saree', 'Anarkali', 'Kurta Sets', 'Jewellery', 'Bags', 'Footwear'];
const MEN_MENU = ['Modern Kurta', 'Festive Kurta Set', 'Ethnic Shirt', 'Printed Ethnic Shirt', 'Embroidered Ethnic Shirt', 'Festive Jacket', 'Traditional Layer', 'Festive Separates'];
const PLURAL: Record<string, string> = { Saree: 'Sarees', 'Pre-Draped Saree': 'Pre-Draped Sarees', 'Modern Kurta': 'Modern Kurtas', 'Festive Kurta Set': 'Festive Kurta Sets', 'Ethnic Shirt': 'Ethnic Shirts', 'Printed Ethnic Shirt': 'Printed Ethnic Shirts', 'Embroidered Ethnic Shirt': 'Embroidered Shirts', 'Festive Jacket': 'Festive Jackets', 'Traditional Layer': 'Traditional Layers' };

function Mega({ gender }: { gender: 'women' | 'men' }) {
  const cats = categoriesFor(gender);
  const order = gender === 'women' ? WOMEN_MENU : MEN_MENU;
  const visible = order.map((n) => cats.find((c) => c.name === n)).filter((c): c is NonNullable<typeof c> => !!c && c.count > 0);
  const budgets = budgetsWithResults(PRODUCTS.filter((p) => p.gender === gender));
  return (
    <div className="mega" role="menu">
      <div><h4>Categories</h4>{visible.map((c) => <Link key={c.slug} to={`/${gender}/${c.slug}`}>{PLURAL[c.name] ?? c.name}</Link>)}
        {gender === 'men' && <Link to="/search?q=garba%20men">Garba / Navratri</Link>}</div>
      <div><h4>Occasions</h4>{WORLDS.map((w) => <Link key={w.slug} to={`/${gender}?occasion=${w.slug}`}>{w.name}</Link>)}</div>
      <div><h4>Budgets</h4>{budgets.map((b) => <Link key={b.slug} to={`/${gender}?budget=${b.slug}`}>{b.label}</Link>)}</div>
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
  useEffect(() => { setOpen(null); setMobile(false); setSearchOpen(false); window.scrollTo(0, 0); }, [loc.pathname, loc.search]);

  const item = (to: string, label: string, mega?: 'women' | 'men') => (
    <div className="nav-item" onMouseEnter={() => mega && setOpen(mega)} onMouseLeave={() => setOpen(null)}>
      <NavLink to={to}>{label}</NavLink>
      {mega && open === mega && <Mega gender={mega} />}
    </div>
  );

  return (
    <div className="app">
      <div className="announce">Rooted in tradition. Designed for now. · Discovery &amp; curation only. Checkout happens on the retailer's site.</div>
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
            {item('/accessories', 'Accessories')}
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
            <Link to="/try-on" className="btn btn-accent sm">Try On</Link>
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
      <a className="wa-float" href="https://wa.me/?text=Hi%20VIRAAS%2C%20I%20need%20help%20finding%20a%20festive%20look" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp styling support">WhatsApp</a>
      <footer className="footer">
        <div className="footer-inner">
          <div>
            <div className="logo light">VIRAAS</div>
            <p className="tagline">ROOTED IN TRADITION. DESIGNED FOR NOW.</p>
            <p className="muted-light small">Wear your story.</p>
          </div>
          <div><h4>Shop</h4><Link to="/women">Women</Link><Link to="/men">Men</Link><Link to="/couple-edit">Couple Edit</Link><Link to="/accessories">Accessories</Link><Link to="/trending">Trending</Link></div>
          <div><h4>Occasions</h4>{WORLDS.map((w) => <Link key={w.slug} to={`/occasions/${w.slug}`}>{w.name}</Link>)}</div>
          <div><h4>VIRAAS</h4><Link to="/about">About</Link><Link to="/contact">Contact</Link><Link to="/faq">FAQ</Link><Link to="/journal">Journal</Link></div>
          <div><h4>Legal</h4><Link to="/privacy">Privacy</Link><Link to="/terms">Terms</Link><Link to="/affiliate-disclosure">Affiliate Disclosure</Link><Link to="/ai-try-on-privacy">AI Try-On Privacy</Link></div>
        </div>
        <div className="footer-legal">
          <p>VIRAAS may earn a commission when you shop through selected affiliate links.</p>
          <p>VIRAAS is a discovery and curation platform. External retailers complete checkout. VIRAAS does not own inventory or process final merchant checkout. Prices shown are approximate. Always confirm the price on the merchant's site.</p>
          <p>© {new Date().getFullYear()} VIRAAS · Merchants: Myntra · AJIO · Flipkart · Shopsy · Meesho · Nykaa · Budgets: {BUDGETS.length} bands</p>
        </div>
      </footer>
    </div>
  );
}
