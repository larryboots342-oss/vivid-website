export const TIER_RANK: Record<string, number> = {
  standard: 0,
  pro: 1,
  elite: 2,
  enterprise: 3,
};

export const TIER_LABELS: Record<string, string> = {
  standard: "Standard",
  pro: "Pro",
  elite: "Elite",
  enterprise: "Enterprise",
};

export function compareTiers(a: string, b: string): number {
  return (TIER_RANK[a] ?? 0) - (TIER_RANK[b] ?? 0);
}
