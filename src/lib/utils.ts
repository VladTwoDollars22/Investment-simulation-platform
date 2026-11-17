export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function formatCurrency(
  value: number,
  options: { compact?: boolean; decimals?: boolean } = {},
) {
  const { compact = false, decimals = false } = options;

  if (compact && Math.abs(value) >= 1000) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: Math.abs(value) >= 100_000 ? 0 : 1,
    }).format(value);
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: decimals ? 2 : 0,
  }).format(value);
}

export function formatMultiple(multiple: number) {
  if (multiple === 0) return "0×";
  if (multiple < 0.1) return `${multiple.toFixed(2)}×`;
  if (multiple < 10) return `${Number(multiple.toFixed(2))}×`;
  return `${Number(multiple.toFixed(1))}×`;
}

export function polylinePoints(values: number[], width = 120, height = 40) {
  if (values.length === 0) return "";
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = max - min || 1;
  const step = values.length > 1 ? width / (values.length - 1) : width;

  return values
    .map((value, index) => {
      const x = index * step;
      const y = height - ((value - min) / range) * height;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
}

