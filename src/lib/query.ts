// facet helpers

export type SearchParams = { [key: string]: string | string[] | undefined };

export function sp(key: string, params: SearchParams): string | undefined {
  const v = params[key];
  return Array.isArray(v) ? v[0] : v;
}

export function facetStateFrom(params: SearchParams): Record<string, string | undefined> {
  return {
    q: sp("q", params),
    gender: sp("gender", params),
    category: sp("category", params),
    occasion: sp("occasion", params),
    colour: sp("colour", params),
    style: sp("style", params),
    price: sp("price", params),
    fabric: sp("fabric", params),
    pattern: sp("pattern", params)
  };
}

export function buildHref(base: string, state: Record<string, string | undefined>, patch: Record<string, string | undefined>): string {
  const merged = { ...state, ...patch };
  const qs = Object.entries(merged)
    .filter(([, v]) => v)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v as string)}`)
    .join("&");
  return qs ? `${base}?${qs}` : base;
}

export const FACET_LABELS: Record<string, string> = {
  category: "Category", occasion: "Occasion", colour: "Colour", style: "Style",
  price: "Price", fabric: "Fabric", pattern: "Pattern / Embroidery"
};
