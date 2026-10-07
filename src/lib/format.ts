// Guarded INR formatting — never calls toLocaleString on null/undefined/NaN.
export function formatINR(value: unknown): string {
  const n = typeof value === 'number' ? value : Number(value);
  if (value === null || value === undefined || !Number.isFinite(n) || n <= 0) return 'Price on merchant';
  return '₹' + Math.round(n).toLocaleString('en-IN');
}
export function sumPrices(values: Array<number | null | undefined>): number | null {
  const nums = values.filter((v): v is number => typeof v === 'number' && Number.isFinite(v) && v > 0);
  if (nums.length !== values.length || nums.length === 0) return null;
  return nums.reduce((a, b) => a + b, 0);
}
