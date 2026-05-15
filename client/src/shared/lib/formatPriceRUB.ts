export function formatPriceRUB(value: unknown): string {
  const n = typeof value === "number" ? value : Number(value ?? NaN);
  if (!Number.isFinite(n)) return "—";
  return new Intl.NumberFormat("ru-RU").format(n);
}
