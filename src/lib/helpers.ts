const SUFFIXES = ["K", "M", "B", "T", "Qa", "Qi"];

export function formatNumber(n: number): string {
  if (!Number.isFinite(n)) return "0";
  if (n < 1_000) {
    if (Number.isInteger(n)) return n.toLocaleString();
    return n.toFixed(1);
  }

  const tier = Math.min(
    Math.floor(Math.log10(Math.abs(n)) / 3),
    SUFFIXES.length,
  );

  if (tier === 0) return Math.floor(n).toLocaleString();

  const suffix = SUFFIXES[tier - 1];
  const scale = 10 ** (tier * 3);
  const scaled = n / scale;

  if (scaled >= 999.95) {
    const next = SUFFIXES[tier];
    if (next) return `1.0${next}`;
  }

  if (scaled < 10) return `${scaled.toFixed(1)}${suffix}`;

  if (Number.isInteger(scaled)) return `${scaled.toLocaleString()}${suffix}`;

  return `${scaled.toFixed(1)}${suffix}`;
}

export function itemCost(baseCost: number, owned: number): number {
  return Math.round(baseCost * 1.15 ** owned);
}
