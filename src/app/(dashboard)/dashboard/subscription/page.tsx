import { Metadata } from "next";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Licenses",
  description: "Manage your VIVID license keys and plans",
};
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import PageWrapper from "@/components/ui/page-wrapper";
import { PLANS, CURRENCY_SYMBOL } from "@/lib/constants";
import { isLicenseValid, getDaysRemaining } from "@/lib/license";
import { TIER_RANK } from "@/lib/tiers";
import Link from "next/link";
import {
  Check,
  X,
  ArrowRight,
  Zap,
  Sparkles,
  Crown,
  Key,
  ShoppingCart,
  Clock,
  Infinity,
} from "lucide-react";
import { cn } from "@/lib/utils";

async function getLicenses(userId: string) {
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: {
      licenses: {
        orderBy: { createdAt: "desc" },
      },
    },
  });
  return user?.licenses || [];
}

function PlanIcon({ planId }: { planId: string }) {
  if (planId === "enterprise") return <Crown className="w-5 h-5" />;
  if (planId === "pro") return <Sparkles className="w-5 h-5" />;
  return <Zap className="w-5 h-5" />;
}

export default async function SubscriptionPage() {
  const user = await currentUser();
  if (!user) return null;

  let licenses: any[] = [];
  try {
    licenses = await getLicenses(user.id);
  } catch (e) {
    console.warn("Subscription DB query failed:", e);
  }

  const activeLicenses = licenses.filter((l) => l.isActive && isLicenseValid(l.expiresAt));
  const highestTier = activeLicenses.length > 0
    ? activeLicenses.reduce((highest, current) => {
        return (TIER_RANK[current.tier] || 0) > (TIER_RANK[highest.tier] || 0)
          ? current
          : highest;
      })
    : null;
  const currentTier = highestTier?.tier || "free";

  return (
    <PageWrapper className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Licenses</h1>
        <p className="text-vivid-textMuted">Manage your VIVID license keys and plans</p>
      </div>

      {/* Current License Banner */}
      {highestTier && (
        <Card className="border-vivid-primary/20 bg-vivid-primary/5">
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{
                    background: currentTier === "enterprise"
                      ? "#00ff9d15"
                      : currentTier === "elite"
                      ? "#b829dd15"
                      : "#00e5ff15",
                    border: `1px solid ${
                      currentTier === "enterprise"
                        ? "#00ff9d40"
                        : currentTier === "elite"
                        ? "#b829dd40"
                        : "#00e5ff40"
                    }`,
                  }}
                >
                  <Key
                    className="w-5 h-5"
                    style={{
                      color:
                        currentTier === "enterprise"
                          ? "#00ff9d"
                          : currentTier === "elite"
                          ? "#b829dd"
                          : "#00e5ff",
                    }}
                  />
                </div>
                <div>
                  <CardTitle className="text-white flex items-center gap-2">
                    Current License: {highestTier.tier.charAt(0).toUpperCase() + highestTier.tier.slice(1)}
                  </CardTitle>
                  <CardDescription className="text-vivid-textMuted">
                    {highestTier.isLifetime
                      ? "Lifetime access — never expires"
                      : `${getDaysRemaining(highestTier.expiresAt)} days remaining`}
                  </CardDescription>
                </div>
              </div>
              <Badge variant="success">Active</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-vivid-textDim text-xs uppercase tracking-wider">Plan</p>
                <p className="text-white font-semibold capitalize">{highestTier.tier}</p>
              </div>
              <div>
                <p className="text-vivid-textDim text-xs uppercase tracking-wider">Type</p>
                <p className="text-white font-semibold">
                  {highestTier.isLifetime ? "Lifetime" : "Time-Limited"}
                </p>
              </div>
              <div>
                <p className="text-vivid-textDim text-xs uppercase tracking-wider">Activated</p>
                <p className="text-white font-semibold">
                  {highestTier.activatedAt
                    ? new Date(highestTier.activatedAt).toLocaleDateString("en-GB")
                    : "—"}
                </p>
              </div>
              <div>
                <p className="text-vivid-textDim text-xs uppercase tracking-wider">Status</p>
                <p className="text-white font-semibold">
                  {highestTier.isActive ? "Active" : "Inactive"}
                </p>
              </div>
            </div>

            <div className="rounded-lg bg-vivid-bg border border-vivid-border p-4">
              <p className="text-vivid-textDim text-xs mb-1.5">License Key</p>
              <code className="text-sm font-mono text-vivid-primary">{highestTier.key}</code>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Plan Comparison */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Available Plans</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {PLANS.map((plan) => {
            const isCurrent = currentTier === plan.id;
            return (
              <Card
                key={plan.id}
                className={`relative ${
                  isCurrent
                    ? "border-vivid-primary bg-vivid-primary/5"
                    : "border-vivid-border"
                }`}
              >
                {isCurrent && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge variant="default">Current Plan</Badge>
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center",
                        isCurrent ? "bg-vivid-primary/20" : "bg-vivid-surfaceHover"
                      )}
                    >
                      <PlanIcon planId={plan.id} />
                    </div>
                    <div>
                      <CardTitle className="text-white">{plan.name}</CardTitle>
                    </div>
                  </div>
                  <CardDescription className="text-vivid-textMuted">
                    {plan.description}
                  </CardDescription>
                  <div className="pt-2">
                    <span className="text-3xl font-bold text-white">
                      {CURRENCY_SYMBOL}{plan.price.toFixed(2)}
                    </span>
                    <span className="text-vivid-textMuted"> one-time</span>
                    <p className="text-vivid-textDim text-xs mt-1">
                      {plan.durationLabel}
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-vivid-text">
                        <Check className="w-4 h-4 text-green-400 shrink-0" />
                        {feature}
                      </li>
                    ))}
                    {plan.notIncluded?.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-vivid-textDim">
                        <X className="w-4 h-4 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {!isCurrent && (
                    <Button className="w-full" asChild>
                      <Link href={`/checkout/stripe?tier=${plan.id}`}>
                        {activeLicenses.length === 0 ? "Purchase" : "Upgrade to " + plan.name}
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </Button>
                  )}
                  {isCurrent && (
                    <Button variant="outline" className="w-full" disabled>
                      Current Plan
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </PageWrapper>
  );
}
