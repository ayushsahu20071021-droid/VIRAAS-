import Link from "next/link";
import { ProductGrid } from "@/components/ProductCard";
import { buildFacets, applyFacet } from "@/lib/filters";
import { buildHref, facetStateFrom } from "@/lib/query";
import { formatINR } from "@/lib/money";
import type { Product } from "@/lib/types";

type State = ReturnType<typeof facetStateFrom>;

export function ActiveChips({ base, state }: { base: string; state: State }) {
  const chips = Object.entries(state).filter(([k, v]) => v && k !== "q" && k !== "gender");
  if (!chips.length) return null;
  return (
    <div className="mb-6 flex flex-wrap items-center gap-2">
      {chips.map(([k, v]) => (
        <Link key={k} href={buildHref(base, state, { [k]: undefined })} className="border border-ink/15 bg-white px-3 py-1.5 text-xs hover:border-rani hover:text-rani">
          {k}: {String(v)} ✕
        </Link>
      ))}
      <Link href={base} className="text-xs font-600 uppercase tracking-editorial text-rani hover:underline">Clear all</Link>
    </div>
  );
}

export function FilterBar({ base, state, fields }: { base: string; state: State; fields: ReturnType<typeof buildFacets> }) {
  return (
    <aside className="lg:w-64 lg:shrink-0">
      <details open className="lg:!block lg:border-0">
        <summary className="mb-4 cursor-pointer border border-ink/15 bg-white px-4 py-3 text-[12px] font-semibold uppercase tracking-editorial lg:hidden">
          Filters
        </summary>
        <div className="flex flex-col gap-6 lg:sticky lg:top-28">
          {fields.map((f) => (
            <div key={f.key}>
              <p className="text-[11px] font-semibold uppercase tracking-editorial text-ink-soft">{f.label}</p>
              <ul className="mt-2 space-y-1">
                {f.options.map((o) => {
                  const active = (state as Record<string, string | undefined>)[f.key] === o.value;
                  return (
                    <li key={o.value}>
                      <Link
                        href={buildHref(base, state, { [f.key]: active ? undefined : o.value })}
                        className={`flex items-center justify-between gap-2 py-1 text-sm ${active ? "font-700 text-rani" : "text-ink hover:text-rani"}`}
                      >
                        <span>{o.label}</span>
                        <span className="text-[11px] text-ink-soft/70">{o.count}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </details>
    </aside>
  );
}

export function Browse({
  title, kicker, sub, products, base, state, extra
}: {
  title: string;
  kicker: string;
  sub?: string;
  products: Product[];
  base: string;
  state: State;
  extra?: React.ReactNode;
}) {
  let results = products;
  for (const [k, v] of Object.entries(state)) {
    if (!v || k === "q" || k === "gender") continue;
    results = applyFacet(results, k, v);
  }
  const fields = buildFacets(results.length ? results : products, state.gender === "men" ? "men" : state.gender === "women" ? "women" : "all");

  return (
    <div className="container-page py-10 lg:py-14">
      <header className="mb-8 max-w-3xl">
        <p className="kicker">{kicker}</p>
        <h1 className="heading-xl mt-2">{title}</h1>
        {sub ? <p className="mt-4 text-sm leading-relaxed text-ink-soft sm:text-base">{sub}</p> : null}
      </header>
      {extra}
      <div className="flex flex-col gap-8 lg:flex-row">
        <FilterBar base={base} state={state} fields={fields} />
        <div className="min-w-0 flex-1">
          <div className="mb-4 flex items-baseline justify-between gap-4">
            <p className="text-sm text-ink-soft">
              {results.filter((r) => r.status === "listed").length} shown of {results.length} curated {results.length === 1 ? "look" : "looks"}
              {results.length ? ` · ${formatINR(Math.min(...results.map((r) => r.price)))} onwards` : ""}
            </p>
          </div>
          <ActiveChips base={base} state={state} />
          {results.length ? (
            <ProductGrid products={results} />
          ) : (
            <div className="border border-ink/10 bg-white p-10 text-center">
              <p className="font-display text-2xl">Nothing matches these filters yet.</p>
              <p className="mt-2 text-sm text-ink-soft">Clear a filter or browse a world — production imagery lands in strict priority order.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
