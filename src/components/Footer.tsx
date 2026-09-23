import Link from "next/link";

const WORLDS = [
  ["Garba / Navratri", "/occasions/garba"], ["College Fest", "/occasions/college-fest"],
  ["Diwali", "/occasions/diwali"], ["Festive Party", "/occasions/festive-party"], ["Traditional", "/occasions/traditional"]
];

export function Footer() {
  return (
    <footer className="mt-16 bg-ink text-ivory lg:mt-24">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <p className="font-display text-3xl tracking-[0.22em]">VIRAAS</p>
          <p className="mt-2 text-[11px] uppercase tracking-wide2 text-gold-soft">Rooted in tradition. Designed for now.</p>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-ivory/70">
            Discover the look. See it on you. Shop the real outfit. VIRAAS is a fashion discovery and curation platform —
            we do not hold inventory or process checkout. Purchases complete on the merchant.
          </p>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-editorial text-gold-soft">Occasions</p>
          <ul className="mt-4 space-y-2 text-sm text-ivory/80">
            {WORLDS.map(([label, href]) => <li key={href}><Link href={href} className="hover:text-rani">{label}</Link></li>)}
          </ul>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-editorial text-gold-soft">Shop</p>
          <ul className="mt-4 space-y-2 text-sm text-ivory/80">
            <li><Link href="/women" className="hover:text-rani">Women</Link></li>
            <li><Link href="/men" className="hover:text-rani">Men</Link></li>
            <li><Link href="/couple-edit" className="hover:text-rani">Couple Edit</Link></li>
            <li><Link href="/trending" className="hover:text-rani">Trending</Link></li>
            <li><Link href="/accessories" className="hover:text-rani">Accessories</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-editorial text-gold-soft">VIRAAS</p>
          <ul className="mt-4 space-y-2 text-sm text-ivory/80">
            <li><Link href="/journal" className="hover:text-rani">Journal</Link></li>
            <li><Link href="/saved" className="hover:text-rani">Saved Looks</Link></li>
            <li><Link href="/try-on" className="hover:text-rani">Try On</Link></li>
            <li><Link href="/search" className="hover:text-rani">Search</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-ivory/10">
        <div className="container-page flex flex-col gap-3 py-6 text-xs text-ivory/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 VIRAAS · Wear your story.</p>
      <p>Curated with Myntra · AJIO · Flipkart · Shopsy · Meesho · Nykaa · Affiliate links are configured per merchant — “Affiliate link not configured” shows until set.</p>
        </div>
      </div>
    </footer>
  );
}
