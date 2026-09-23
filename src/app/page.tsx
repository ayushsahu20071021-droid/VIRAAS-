import Link from "next/link";
import { Img, SectionHead } from "@/components/Img";
import { ProductGrid } from "@/components/ProductCard";
import { CoupleGrid } from "@/components/CoupleCard";
import { SaveButton } from "@/components/SaveButton";
import { formatINR } from "@/lib/money";
import {
  ALL_COUPLES, COLLECTIONS, JOURNAL, listedProducts, prioritySort, byGender, byWorld
} from "@/lib/catalog";
import type { Product } from "@/lib/types";

const WORLDS = [
  { slug: "garba", label: "Garba / Navratri", img: "/images/heroes/occasion-garba.jpg", note: "Mirror work · Bandhani · Garba ground energy" },
  { slug: "college-fest", label: "College Fest", img: "/images/heroes/occasion-college-fest.jpg", note: "Light festive · Campus cool · Under budget" },
  { slug: "diwali", label: "Diwali", img: "/images/heroes/occasion-diwali.jpg", note: "Diyas · Terraces · Statement looks" },
  { slug: "festive-party", label: "Festive Party", img: "/images/heroes/occasion-festive-party.jpg", note: "Evening sleek · Black · Wine · Emerald" },
  { slug: "traditional", label: "Traditional", img: "/images/heroes/occasion-traditional.jpg", note: "Craft · Sarees · Modern proportions" }
];

function pickFew(products: Product[], n: number): Product[] {
  return prioritySort(products).slice(0, n);
}

function queryHref(q: Record<string, string | number | boolean>): string {
  const map: Record<string, string> = {};
  if (q.world) map.occasion = String(q.world);
  if (q.gender) map.gender = String(q.gender);
  if (q.colour) map.colour = String(q.colour);
  if (q.maxPrice) map.price = Number(q.maxPrice) <= 999 ? "0-999" : Number(q.maxPrice) <= 1999 ? "1000-1999" : "2000-3499";
  if (q.accessories) map.q = "accessories";
  return `/search?${new URLSearchParams(map).toString()}`;
}

export default function HomePage() {
  const listed = listedProducts();
  const women = pickFew(byGender(listed, "women"), 8);
  const men = pickFew(byGender(listed, "men"), 8);
  const trending = pickFew(listed, 8);
  const accessories = pickFew(listed.filter((p) => ["jewellery", "bags", "footwear", "beauty", "accessories"].includes(p.categorySlug)), 8);
  const coupleLead = ALL_COUPLES.slice(0, 8);
  const budgetPicks = COLLECTIONS.budget.map((b) => ({
    ...b,
    items: pickFew(listed.filter((p) => p.price <= b.maxPrice && (b.query.world ? p.occasion === b.query.world : true) && (b.query.gender ? p.gender === b.query.gender : true)), 3)
  }));
  const ctl = COLLECTIONS.completeTheLook.map((c) => ({ ...c, items: pickFew(listed.filter((p) => p.occasion === c.query.world && ["jewellery", "bags", "footwear", "beauty", "accessories"].includes(p.categorySlug)), 4) }));

  return (
    <>
      {/* 1. HERO */}
      <section className="relative bg-ink text-ivory">
        <div className="relative h-[78vh] min-h-[520px] w-full overflow-hidden lg:h-[86vh]">
          <Img src="/images/heroes/hero-main.jpg" alt="Young Indian friends in festive looks under Navratri fairy lights — hot pink chaniya, ivory bandhani lehenga, black ethnic shirt, wine embroidered shirt" width={1920} height={1080} priority className="absolute inset-0 h-full w-full object-cover object-center opacity-90" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/20" />
          <div className="container-page relative flex h-full flex-col justify-end pb-14 lg:pb-20">
            <p className="text-[11px] font-semibold uppercase tracking-wide2 text-gold-soft">The Festive Edit ’26</p>
            <h1 className="heading-xl mt-3 max-w-3xl">Tradition, reimagined for now.</h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-ivory/85 sm:text-base">
              Discover the look. See it on you. Shop the real outfit. — Garba, College Fest, Diwali, Festive Party & Traditional,
              curated for 18–25 India.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/women" className="btn-primary !bg-rani">Shop Women</Link>
              <Link href="/men" className="btn-ghost">Shop Men</Link>
              <Link href="/try-on" className="btn-ghost">Try an outfit on you</Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. OCCASION DISCOVERY */}
      <section className="container-page py-16 lg:py-24">
        <SectionHead kicker="Five worlds" title="DRESS FOR THE MOMENT" sub="Exactly five occasion worlds — pick the night, we'll dress the frame." />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-5 lg:gap-5">
          {WORLDS.map((w, i) => (
            <Link key={w.slug} href={`/occasions/${w.slug}`} className={`group relative overflow-hidden bg-ink text-ivory ${i === 0 ? "col-span-2 lg:col-span-1" : ""}`}>
              <div className="relative" style={{ aspectRatio: "3/4" }}>
                <Img src={w.img} alt={`${w.label} occasion world — VIRAAS edit`} width={800} height={1066} className="h-full w-full transition duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/85 to-transparent" />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-4">
                <p className="text-[10px] font-semibold uppercase tracking-wide2 text-gold-soft">{i === 0 ? "Priority one" : `World ${i + 1}`}</p>
                <h3 className="mt-1 font-display text-lg sm:text-xl">{w.label}</h3>
                <p className="mt-1 hidden text-[11px] text-ivory/75 sm:block">{w.note}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. FOR HER */}
      <section className="container-page py-12 lg:py-16">
        <SectionHead kicker="For her" title="FOR HER" sub="Chaniya choli, lehengas, sarees and festive sets — reference-led, movement-first." href="/women" cta="All women's edits" />
        {women.length ? <ProductGrid products={women} /> : <QueueNote label="Women's product photography renders in priority order — Garba/Navratri first." />}
      </section>

      {/* 4. FOR HIM */}
      <section className="container-page py-12 lg:py-16">
        <SectionHead kicker="For him" title="FOR HIM" sub="Modern ethnic shirts, printed & embroidered shirts, modern kurtas — 18–25, never costume." href="/men" cta="All men's edits" />
        {men.length ? <ProductGrid products={men} /> : <QueueNote label="Men's product photography renders in priority order — Garba/Navratri first." />}
      </section>

      {/* 5. SEE IT ON YOU */}
      <section className="bg-ivory-deep">
        <div className="container-page grid items-center gap-10 py-16 lg:grid-cols-2 lg:py-24">
          <div className="relative overflow-hidden" style={{ aspectRatio: "4/5" }}>
            <Img src="/images/heroes/see-it-on-you.jpg" alt="Young woman taking a mirror selfie in a hot pink and ivory festive outfit" width={1000} height={1250} className="h-full w-full" />
          </div>
          <div>
            <p className="kicker">Virtual try-on</p>
            <h2 className="heading-lg mt-2">SEE IT ON YOU</h2>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-ink-soft sm:text-base">
              Every look is product-first. Pick an outfit, upload your photo behind an 18+ gate, and see the drape on you
              before you shop the real outfit on the merchant. Wear your story.
            </p>
            <ol className="mt-6 space-y-2 text-sm text-ink-soft">
              <li>1 · Find a look with the Try On badge</li>
              <li>2 · Confirm 18+ and upload your photo</li>
              <li>3 · Generate · Save · Share · Shop</li>
            </ol>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/try-on" className="btn-primary">Try an outfit on you</Link>
              <Link href="/women/lehenga" className="btn-secondary">Browse try-on looks</Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. TRENDING */}
      <section className="container-page py-16 lg:py-24">
        <SectionHead kicker="Stylists' radar" title="TRENDING" sub="What our styling desk keeps seeing across pandals, fest grounds and terraces — editorial picks only." href="/trending" cta="Full trending edit" />
        {trending.length ? <ProductGrid products={trending} /> : <QueueNote label="Trending edits populate as production imagery lands." />}
        <div className="mt-8 grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {COLLECTIONS.trending.map((t) => (
            <Link key={t.id} href={queryHref(t.query)} className="border border-ink/10 bg-white p-5 transition hover:border-rani">
              <p className="font-display text-lg">{t.title}</p>
              <p className="mt-1 text-xs text-ink-soft">{t.sub}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* 7. COUPLE EDIT */}
      <section className="bg-ink text-ivory">
        <div className="container-page py-16 lg:py-24">
          <div className="mb-10 max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-editorial text-gold-soft">Real-human · Youthful · Reference-led</p>
            <h2 className="heading-lg mt-2">COUPLE EDIT</h2>
            <p className="mt-3 font-display text-xl italic text-rani">MATCHED, NOT MATCHING.</p>
            <p className="mt-4 text-sm leading-relaxed text-ivory/75">
              100 couple looks across five worlds — candid, believable, 18–25. Garba first, always.
            </p>
          </div>
          {coupleLead.some((c) => true) ? (
            <div className="[&_article]:border-ivory/10">
              <CoupleGrid looks={coupleLead} />
            </div>
          ) : null}
          <div className="mt-10">
            <Link href="/couple-edit" className="btn-ghost">Enter Couple Edit</Link>
          </div>
        </div>
      </section>

      {/* 8. ACCESSORIES */}
      <section className="container-page py-16 lg:py-24">
        <div className="grid gap-8 lg:grid-cols-[1fr_2fr]">
          <div>
            <SectionHead kicker="Finish it" title="ACCESSORIES" sub="Jewellery, bags, footwear, beauty and men's extras — the pieces that sell the look." href="/accessories" cta="All accessories" />
            <div className="relative hidden overflow-hidden lg:block" style={{ aspectRatio: "4/3" }}>
              <Img src="/images/heroes/accessories-banner.jpg" alt="Festive accessories flat lay — jhumkas, mirror-work potli, juttis, bangles, kajal" width={900} height={675} className="h-full w-full" />
            </div>
          </div>
          <div>{accessories.length ? <ProductGrid products={accessories} cols={3} /> : <QueueNote label="Accessory stills queue at priority 16." />}</div>
        </div>
      </section>

      {/* 9. BUDGET COLLECTIONS */}
      <section className="container-page py-12 lg:py-16">
        <SectionHead kicker="Honest pricing" title="BUDGET COLLECTIONS" sub="Youth-first Indian festive pricing — most under ₹5,000, nothing above ₹8,000." />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {budgetPicks.map((b) => (
            <div key={b.id} className="card-surface flex flex-col p-5">
              <p className="font-display text-xl">{b.title}</p>
              <p className="mt-1 text-xs text-ink-soft">{b.sub}</p>
              <ul className="mt-4 flex-1 space-y-2 text-sm">
                {b.items.map((p) => (
                  <li key={p.id} className="flex items-baseline justify-between gap-2">
                    <Link href={`/product/${p.id}`} className="line-clamp-1 hover:text-rani">{p.title}</Link>
                    <span className="shrink-0 font-600">{formatINR(p.price)}</span>
                  </li>
                ))}
                {!b.items.length ? <li className="text-xs text-ink-soft">Rendering…</li> : null}
              </ul>
              <Link href={queryHref(b.query)} className="mt-4 text-[11px] font-semibold uppercase tracking-editorial text-rani hover:underline">
                Shop the edit →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 10. COMPLETE THE LOOK */}
      <section className="container-page py-12 lg:py-16">
        <SectionHead kicker="Styling desk" title="COMPLETE THE LOOK" sub="Outfit plus the three pieces that finish it — all shoppable." />
        <div className="grid gap-6 lg:grid-cols-4">
          {ctl.map((c) => (
            <div key={c.id} className="relative overflow-hidden bg-ink p-6 text-ivory">
              <p className="font-display text-xl">{c.title}</p>
              <ul className="mt-4 space-y-2 text-sm text-ivory/85">
                {c.items.map((p) => (
                  <li key={p.id} className="flex items-center justify-between gap-2">
                    <Link href={`/product/${p.id}`} className="line-clamp-1 hover:text-rani">{p.title}</Link>
                    <span className="shrink-0">{formatINR(p.price)}</span>
                  </li>
                ))}
                {!c.items.length ? <li className="text-xs text-ivory/60">Rendering…</li> : null}
              </ul>
              <div className="mt-5">
                <SaveButton kind="collection" id={c.id} title={c.title} imageUrl="/images/heroes/accessories-banner.jpg" meta="Complete the look" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 11. JOURNAL */}
      <section className="container-page py-12 lg:py-16">
        <SectionHead kicker="Journal" title="JOURNAL" sub="Styling notes from the VIRAAS desk — Garba to Diwali, budgets to couple colour stories." href="/journal" cta="Read the journal" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {JOURNAL.slice(0, 4).map((a) => (
            <Link key={a.id} href={`/journal/${a.slug}`} className="group card-surface">
              <div className="relative overflow-hidden" style={{ aspectRatio: "4/3" }}>
                <Img src={a.imageUrl} alt={`${a.title} — VIRAAS journal`} width={800} height={600} className="h-full w-full transition duration-500 group-hover:scale-105" />
              </div>
              <div className="p-5">
                <p className="text-[10px] font-semibold uppercase tracking-wide2 text-rani">{a.tags[0]}</p>
                <h3 className="mt-2 font-display text-lg leading-snug group-hover:text-rani">{a.title}</h3>
                <p className="mt-2 line-clamp-2 text-xs text-ink-soft">{a.dek}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 12. WHATSAPP SUPPORT */}
      <section className="container-page pb-16 lg:pb-24">
        <div className="flex flex-col items-start justify-between gap-6 border border-ink/10 bg-white p-8 sm:flex-row sm:items-center lg:p-12">
          <div>
            <p className="kicker">We're human</p>
            <h2 className="heading-md mt-2">WhatsApp Support</h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-soft">
              Sizing doubts, colour questions, couple coordination panics — the styling desk replies on WhatsApp.
              Share any look straight to WhatsApp from its page.
            </p>
          </div>
          <a
            className="btn-primary shrink-0"
            href="https://wa.me/?text=Hi%20VIRAAS%20styling%20desk%20%E2%80%94%20I%20need%20help%20with%20a%20festive%20look."
            target="_blank"
            rel="noopener noreferrer"
          >
            Message the styling desk
          </a>
        </div>
      </section>
      {/* 13. FOOTER — rendered in the site shell below */}
    </>
  );
}

function QueueNote({ label }: { label: string }) {
  return (
    <div className="border border-dashed border-ink/20 bg-white/60 p-10 text-center">
      <p className="font-display text-xl">Production imagery in queue</p>
      <p className="mt-2 text-sm text-ink-soft">{label}</p>
    </div>
  );
}
