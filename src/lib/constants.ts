export const APP_NAME = "VIVID";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

// Stripe price IDs for one-time license purchases
export const STRIPE_PRICE_PRO = process.env.STRIPE_PRICE_PRO_ID || "";
export const STRIPE_PRICE_ELITE = process.env.STRIPE_PRICE_ELITE_ID || "";
export const STRIPE_PRICE_ENTERPRISE = process.env.STRIPE_PRICE_ENTERPRISE_ID || "";

export const CURRENCY = "GBP";
export const CURRENCY_SYMBOL = "£";

export interface PlanConfig {
  id: string;
  name: string;
  description: string;
  price: number;
  priceId: string;
  durationDays: number | null; // null = lifetime
  durationLabel: string;
  features: string[];
  notIncluded?: string[];
  popular?: boolean;
  badge?: string;
  badgeColor?: string;
}

export const PLANS: PlanConfig[] = [
  {
    id: "pro",
    name: "Pro",
    description: "7-day full access to all VIVID features. Perfect for trying out the full experience.",
    price: 7,
    priceId: STRIPE_PRICE_PRO,
    durationDays: 7,
    durationLabel: "7 Days Access",
    features: [
      "Full AI Aimbot Suite",
      "Roblox Executor",
      "All Game Scripts",
      "FPS Monitoring",
      "Priority Support",
      "Auto-Attach",
    ],
    badge: "Starter",
    badgeColor: "#00e5ff",
  },
  {
    id: "elite",
    name: "Elite",
    description: "Full month of unrestricted VIVID access. Best value for serious gamers.",
    price: 20,
    priceId: STRIPE_PRICE_ELITE,
    durationDays: 30,
    durationLabel: "30 Days Access",
    features: [
      "Everything in Pro",
      "Advanced AI Models",
      "Custom Configurations",
      "Script Editor",
      "Discord VIP",
      "Early Updates",
    ],
    popular: true,
    badge: "Most Popular",
    badgeColor: "#b829dd",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "Lifetime access with all future updates. Pay once, own forever.",
    price: 100,
    priceId: STRIPE_PRICE_ENTERPRISE,
    durationDays: null,
    durationLabel: "Lifetime Access",
    features: [
      "Everything in Elite",
      "Lifetime Access",
      "All Future Updates",
      "Custom Model Training",
      "Dedicated Support",
      "Team Management",
      "API Access",
    ],
    badge: "Best Value",
    badgeColor: "#00ff9d",
  },
];

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/games", label: "Games" },
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
];

export const DASHBOARD_LINKS = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/subscription", label: "Subscription" },
  { href: "/dashboard/billing", label: "Billing" },
  { href: "/dashboard/settings", label: "Settings" },
];
