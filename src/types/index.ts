export interface SubscriptionTier {
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  cta: string;
  href: string;
  popular: boolean;
}

export interface UserSubscription {
  id: string;
  status: string;
  tier: string;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
}

export interface License {
  id: string;
  key: string;
  tier: string;
  isActive: boolean;
  createdAt: Date;
  expiresAt: Date | null;
}

export interface LicenseData {
  id: string;
  key: string;
  tier: string;
  isActive: boolean;
  isLifetime: boolean;
  expiresAt: string | null;
}

export interface ActivityItem {
  id: string;
  type: string;
  title: string;
  description: string | null;
  createdAt: Date;
}

export interface ActivityData {
  id: string;
  type: string;
  title: string;
  description: string | null;
  createdAt: string;
}

export interface Review {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  content: string;
  tier: string;
  game?: string;
  createdAt: string;
}

export interface GameCard {
  name: string;
  status: "available" | "soon";
  statusText: string;
  description: string;
  color: string;
  borderColor: string;
  accent: string;
}

export interface FeatureItem {
  icon: string;
  title: string;
  description: string;
}
