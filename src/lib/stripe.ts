import Stripe from "stripe";

const stripeKey = process.env.STRIPE_SECRET_KEY;

export const stripe = stripeKey
  ? new Stripe(stripeKey, {
      apiVersion: "2025-02-24.acacia",
      typescript: true,
    })
  : null;

// One-time license price IDs
export const STRIPE_PRICE_PRO = process.env.STRIPE_PRICE_PRO_ID || "";
export const STRIPE_PRICE_ELITE = process.env.STRIPE_PRICE_ELITE_ID || "";
export const STRIPE_PRICE_ENTERPRISE = process.env.STRIPE_PRICE_ENTERPRISE_ID || "";

export const PRICE_MAP: Record<string, string> = {
  pro: STRIPE_PRICE_PRO,
  elite: STRIPE_PRICE_ELITE,
  enterprise: STRIPE_PRICE_ENTERPRISE,
};

export function getPriceId(tier: string): string {
  return PRICE_MAP[tier.toLowerCase()] || "";
}

export function getTierFromPriceId(priceId: string): string | null {
  for (const [tier, id] of Object.entries(PRICE_MAP)) {
    if (id === priceId) return tier;
  }
  return null;
}

export function getTierName(tier: string): string {
  const names: Record<string, string> = {
    pro: "Pro",
    elite: "Elite",
    enterprise: "Enterprise",
  };
  return names[tier.toLowerCase()] || tier;
}
