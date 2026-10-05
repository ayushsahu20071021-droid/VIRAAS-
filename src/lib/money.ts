// Validated money helpers — no value can ever crash toLocaleString.

export function isValidAmount(n: unknown): n is number {
  return typeof n === "number" && Number.isFinite(n);
}

export function formatINR(n: unknown): string {
  if (!isValidAmount(n)) return "—";
  const v = Math.round(n);
  return `₹${v.toLocaleString("en-IN")}`;
}

export function safeToLocaleString(n: unknown, locale = "en-IN"): string {
  if (!isValidAmount(n)) return "—";
  return n.toLocaleString(locale);
}

export function discountLabel(price: unknown, mrp: unknown): string | null {
  if (!isValidAmount(price) || !isValidAmount(mrp) || mrp <= price || mrp <= 0) return null;
  return `${Math.round(((mrp - price) / mrp) * 100)}% OFF`;
}
