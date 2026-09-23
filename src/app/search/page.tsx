import Link from "next/link";
import { Browse } from "@/components/Browse";
import { CoupleGrid } from "@/components/CoupleCard";
import { searchProducts, searchCouples, parseQuery } from "@/lib/search";
import { facetStateFrom, type SearchParams } from "@/lib/query";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta("Search", "Search festive looks — garba, navratri, college fest, diwali, chaniya choli, lehenga, ethnic shirts and couple looks.", "/search");

const SUGGESTED = [
  "garba women", "garba men", "navratri women", "college fest women", "college fest men",
  "diwali women", "diwali men", "black festive", "rani pink chaniya", "black chaniya",
  "white lehenga", "embroidered ethnic shirt", "printed ethnic shirt", "modern kurta",
  "chaniya choli", "lehenga", "sharara", "gharara", "saree", "pre draped saree",
  "couple garba", "couple navratri", "college couple", "diwali couple"
];

export default function SearchPage({ searchParams }: { searchParams: SearchParams }) {
  const state = facetStateFrom(searchParams);
  const q = state.q ?? "";
  const parsed = parseQuery(q);
  const wantCouples = parsed.coupleIntent || /couple/i.test(q);
  const products = q ? searchProducts(q) : [];
  const couples = q ? searchCouples(q) : [];

  return (
    <>
      {wantCouples ? (
        <div className="container-page pt-10">
          <p className="kicker">Couple results</p>
          <h1 className="heading-md mt-2">{couples.length} couple {couples.length === 1 ? "look" : "looks"} for “{q}”</h1>
          <div className="mt-8">
            {couples.length ? <CoupleGrid looks={couples.slice(0, 12)} cols={3} /> : <p className="text-sm text-ink-soft">No couple looks match — try “couple garba” or “diwali couple”.</p>}
          </div>
          {/* Search grids render generated photography only (progressive reveal) */}
          <p className="mt-10 text-[12px] font-semibold uppercase tracking-editorial text-ink-soft">Products</p>
        </div>
      ) : null}
      <Browse
        kicker="Search"
        title={q ? `RESULTS FOR “${q.toUpperCase()}”` : "SEARCH VIRAAS"}
        sub={
          q
            ? `Token-based matching — gender tokens are exact, so “women” never matches “men”. Parsed: ${[
                parsed.gender ? `gender=${parsed.gender}` : null,
                parsed.worlds.length ? `worlds=${parsed.worlds.join(",")}` : null,
                parsed.categories.length ? `categories=${parsed.categories.join(",")}` : null,
                parsed.colours.length ? `colours=${parsed.colours.join(",")}` : null
              ].filter(Boolean).join(" · ") || "free text"}`
            : "Try the queries below — they cover the full VIRAAS search contract."
        }
        products={products}
        base="/search"
        state={state}
        extra={
          !q ? (
            <div className="mb-10 flex flex-wrap gap-2">
              {SUGGESTED.map((s) => (
                <Link key={s} href={`/search?q=${encodeURIComponent(s)}`} className="border border-ink/15 bg-white px-3 py-1.5 text-xs hover:border-rani hover:text-rani">
                  {s}
                </Link>
              ))}
            </div>
          ) : null
        }
      />
    </>
  );
}
