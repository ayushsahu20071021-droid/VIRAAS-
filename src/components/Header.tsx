"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { loadSaved } from "@/lib/saved";

const WOMEN_CATS = [
  ["Chaniya Choli", "/women/chaniya-choli"], ["Lehenga", "/women/lehenga"], ["Sharara", "/women/sharara"],
  ["Gharara", "/women/gharara"], ["Sarees", "/women/sarees"], ["Pre-Draped Sarees", "/women/pre-draped-sarees"],
  ["Anarkali", "/women/anarkali"], ["Kurta Sets", "/women/kurta-sets"], ["Festive Sets", "/women/festive-sets"],
  ["Jewellery", "/women/jewellery"], ["Bags", "/women/bags"], ["Footwear", "/women/footwear"], ["Beauty", "/women/beauty"]
];
const MEN_CATS = [
  ["Modern Ethnic Shirts", "/men/modern-ethnic-shirts"], ["Printed Ethnic", "/men/printed-ethnic"],
  ["Embroidered Ethnic", "/men/embroidered-ethnic"], ["Modern Kurtas", "/men/modern-kurtas"],
  ["Festive Sets", "/men/festive-sets"], ["Festive Layers", "/men/festive-layers"],
  ["Festive Separates", "/men/festive-separates"], ["Contemporary Garba", "/men/contemporary-garba"],
  ["Accessories", "/men/accessories"]
];
const OCCASIONS = [
  ["Garba / Navratri", "/occasions/garba"], ["College Fest", "/occasions/college-fest"],
  ["Diwali", "/occasions/diwali"], ["Festive Party", "/occasions/festive-party"], ["Traditional", "/occasions/traditional"]
];

export function Header() {
  const [open, setOpen] = useState<string | null>(null);
  const [drawer, setDrawer] = useState(false);
  const [q, setQ] = useState("");
  const [savedCount, setSavedCount] = useState(0);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setSavedCount(loadSaved().length);
    const h = () => setSavedCount(loadSaved().length);
    window.addEventListener("viraas:saved", h as EventListener);
    return () => window.removeEventListener("viraas:saved", h as EventListener);
  }, []);

  useEffect(() => {
    setDrawer(false);
    setOpen(null);
  }, [pathname]);

  const navLink = "px-0.5 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] hover:text-rani transition xl:tracking-editorial";

  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-ivory/95 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-3 lg:h-20">
        <button className="xl:hidden -ml-1 p-2" aria-label="Open menu" onClick={() => setDrawer(true)}>
          <span className="block h-px w-6 bg-ink" /><span className="mt-1.5 block h-px w-6 bg-ink" /><span className="mt-1.5 block h-px w-6 bg-ink" />
        </button>

        <Link href="/" className="font-display text-2xl font-600 tracking-[0.22em] lg:text-3xl">
          VIRAAS
        </Link>

        <nav className="hidden items-center gap-4 xl:flex xl:gap-5" aria-label="Main">
          <button className={navLink} onMouseEnter={() => open !== "women" && setOpen("women")} onClick={() => setOpen(open === "women" ? null : "women")} aria-expanded={open === "women"}>Women</button>
          <button className={navLink} onMouseEnter={() => open !== "men" && setOpen("men")} onClick={() => setOpen(open === "men" ? null : "men")} aria-expanded={open === "men"}>Men</button>
          <button className={navLink} onMouseEnter={() => open !== "occ" && setOpen("occ")} onClick={() => setOpen(open === "occ" ? null : "occ")} aria-expanded={open === "occ"}>Occasions</button>
          <Link href="/couple-edit" className={navLink}>Couple Edit</Link>
          <Link href="/trending" className={navLink}>Trending</Link>
          <Link href="/accessories" className={navLink}>Accessories</Link>
          <Link href="/journal" className={navLink}>Journal</Link>
        </nav>

        <div className="flex items-center gap-0.5 sm:gap-1">
          <form
            className="hidden items-center border-b border-ink/20 md:flex"
            onSubmit={(e) => {
              e.preventDefault();
              router.push(`/search?q=${encodeURIComponent(q)}`);
            }}
          >
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search garba, lehenga, shirts…"
              aria-label="Search"
              className="w-28 bg-transparent px-2 py-1.5 text-sm outline-none lg:w-40 xl:w-52"
            />
            <button aria-label="Submit search" className="px-2 py-1.5 text-sm">⌕</button>
          </form>
          <Link href="/saved" className="relative px-1.5 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] hover:text-rani" aria-label="Saved Looks">
            Saved{savedCount > 0 ? <span className="ml-1 rounded-full bg-rani px-1.5 py-0.5 text-[10px] text-ivory">{savedCount}</span> : null}
          </Link>
          <Link href="/try-on" className="hidden px-1.5 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] hover:text-rani sm:block">Try On</Link>
          <button className="px-2 py-2 text-[12px] font-semibold uppercase tracking-editorial hover:text-rani" onClick={() => setOpen(open === "menu" ? null : "menu")} aria-label="Profile menu">Menu</button>
        </div>
      </div>

      {open && open !== "menu" ? (
        <div className="hidden border-t border-ink/10 bg-white xl:block" onMouseLeave={() => setOpen(null)}>
          <div className="container-page grid grid-cols-4 gap-8 py-8">
            {open === "women" ? (
              <>
                <div className="col-span-1">
                  <p className="kicker">For Her</p>
                  <p className="mt-3 font-display text-2xl">Reference-led<br />festive wardrobes.</p>
                  <Link href="/women" className="mt-4 inline-block text-[12px] font-semibold uppercase tracking-editorial text-rani">Shop all women →</Link>
                </div>
                <ul className="col-span-3 grid grid-cols-3 gap-x-8 gap-y-2">
                  {WOMEN_CATS.map(([label, href]) => (
                    <li key={href}><Link href={href} className="block py-1.5 text-sm hover:text-rani">{label}</Link></li>
                  ))}
                </ul>
              </>
            ) : null}
            {open === "men" ? (
              <>
                <div className="col-span-1">
                  <p className="kicker">For Him</p>
                  <p className="mt-3 font-display text-2xl">Modern ethnic.<br />18–25 energy.</p>
                  <Link href="/men" className="mt-4 inline-block text-[12px] font-semibold uppercase tracking-editorial text-rani">Shop all men →</Link>
                </div>
                <ul className="col-span-3 grid grid-cols-3 gap-x-8 gap-y-2">
                  {MEN_CATS.map(([label, href]) => (
                    <li key={href}><Link href={href} className="block py-1.5 text-sm hover:text-rani">{label}</Link></li>
                  ))}
                </ul>
              </>
            ) : null}
            {open === "occ" ? (
              <>
                <div className="col-span-1">
                  <p className="kicker">Occasions</p>
                  <p className="mt-3 font-display text-2xl">Five worlds.<br />One festive year.</p>
                </div>
                <ul className="col-span-3 grid grid-cols-3 gap-x-8 gap-y-2">
                  {OCCASIONS.map(([label, href]) => (
                    <li key={href}><Link href={href} className="block py-1.5 text-sm hover:text-rani">{label}</Link></li>
                  ))}
                </ul>
              </>
            ) : null}
          </div>
        </div>
      ) : null}

      {open === "menu" ? (
        <div className="hidden border-t border-ink/10 bg-white xl:block" onMouseLeave={() => setOpen(null)}>
          <div className="container-page flex flex-wrap gap-6 py-6 text-sm">
            <Link href="/search" className="hover:text-rani">Search</Link>
            <Link href="/saved" className="hover:text-rani">Saved Looks</Link>
            <Link href="/try-on" className="hover:text-rani">Try On</Link>
            <Link href="/journal" className="hover:text-rani">Journal</Link>
            <Link href="/couple-edit" className="hover:text-rani">Couple Edit</Link>
          </div>
        </div>
      ) : null}

      {drawer ? (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setDrawer(false)} />
          <div className="absolute inset-y-0 left-0 flex w-[86%] max-w-sm flex-col bg-ivory p-6">
            <div className="flex items-center justify-between">
              <span className="font-display text-2xl tracking-[0.22em]">VIRAAS</span>
              <button onClick={() => setDrawer(false)} aria-label="Close menu" className="p-2 text-2xl leading-none">×</button>
            </div>
            <form className="mt-6 flex border-b border-ink/20" onSubmit={(e) => { e.preventDefault(); setDrawer(false); router.push(`/search?q=${encodeURIComponent(q)}`); }}>
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search festive looks…" aria-label="Search" className="w-full bg-transparent py-2 text-base outline-none" />
              <button className="px-2" aria-label="Submit search">⌕</button>
            </form>
            <div className="mt-6 flex-1 overflow-y-auto">
              {[["Women", "/women", WOMEN_CATS], ["Men", "/men", MEN_CATS], ["Occasions", "/couple-edit", OCCASIONS]].map(([title, href, cats]) => (
                <details key={title as string} className="border-b border-ink/10 py-3">
                  <summary className="cursor-pointer text-[13px] font-semibold uppercase tracking-editorial">{title as string}</summary>
                  <ul className="mt-2 space-y-1 pl-2">
                    {(cats as string[][]).map(([label, catHref]) => (
                      <li key={catHref}><Link href={catHref} className="block py-1 text-sm">{label}</Link></li>
                    ))}
                    <li><Link href={href as string} className="block py-1 text-sm text-rani">Shop all →</Link></li>
                  </ul>
                </details>
              ))}
              <div className="mt-4 flex flex-col gap-3 text-[13px] font-semibold uppercase tracking-editorial">
                <Link href="/couple-edit">Couple Edit</Link>
                <Link href="/trending">Trending</Link>
                <Link href="/accessories">Accessories</Link>
                <Link href="/journal">Journal</Link>
                <Link href="/saved">Saved Looks</Link>
                <Link href="/try-on">Try On</Link>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
