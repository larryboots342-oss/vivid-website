import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import PageWrapper from "@/components/ui/page-wrapper";
import { PLANS, CURRENCY_SYMBOL } from "@/lib/constants";
import { isLicenseValid, getDaysRemaining } from "@/lib/license";
import {
  Key,
  Copy,
  Clock,
  Infinity,
  AlertTriangle,
  Download,
  ExternalLink,
  ShoppingCart,
} from "lucide-react";
import Link from "next/link";

async function getBillingData(userId: string) {
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: {
      licenses: {
        orderBy: { createdAt: "desc" },
      },
    },
  });
  return user;
}

function getTierColor(tier: string): string {
  switch (tier.toLowerCase()) {
    case "pro":
      return "#00e5ff";
    case "elite":
      return "#b829dd";
    case "enterprise":
      return "#00ff9d";
    default:
      return "#707070";
  }
}

export default async function BillingPage() {
  const user = await currentUser();
  if (!user) return null;

  let licenses: any[] = [];
  try {
    const dbUser = await getBillingData(user.id);
    licenses = dbUser?.licenses || [];
  } catch (e) {
    console.warn("Billing DB query failed:", e);
  }

  const activeLicenses = licenses.filter((l) => l.isActive && isLicenseValid(l.expiresAt));

  return (
    <PageWrapper className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Licenses & Billing</h1>
        <p className="text-vivid-textMuted">Manage your VIVID license keys and purchases</p>
      </div>

      {/* Active Licenses */}
      {activeLicenses.length > 0 ? (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white">Active Licenses</h2>
          {activeLicenses.map((license) => {
            const daysRemaining = getDaysRemaining(license.expiresAt);
            const tierColor = getTierColor(license.tier);
            const plan = PLANS.find((p) => p.id === license.tier);

            return (
              <Card
                key={license.id}
                className="border-vivid-primary/20 bg-vivid-primary/5"
              >
                <CardHeader>
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ background: `${tierColor}15`, border: `1px solid ${tierColor}40` }}
                      >
                        <Key className="w-5 h-5" style={{ color: tierColor }} />
                      </div>
                      <div>
                        <CardTitle className="text-white flex items-center gap-2">
                          {plan?.name || license.tier}
                          <Badge
                            variant="success"
                            className="text-[10px] uppercase tracking-wider"
                          >
                            Active
                          </Badge>
                        </CardTitle>
                        <CardDescription className="text-vivid-textMuted">
                          {license.isLifetime
                            ? "Lifetime access"
                            : `${daysRemaining} day${daysRemaining !== 1 ? "s" : ""} remaining`}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold text-lg">
                        {CURRENCY_SYMBOL}{plan?.price || "—"}
                      </p>
                      <p className="text-vivid-textDim text-xs">One-time purchase</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg bg-vivid-bg border border-vivid-border p-4">
                    <p className="text-vivid-textDim text-xs mb-1.5">License Key</p>
                    <div className="flex items-center gap-3">
                      <code className="flex-1 text-sm font-mono text-vivid-primary bg-black/30 rounded-lg px-4 py-2.5">
                        {license.key}
                      </code>
                      <CopyButton text={license.key} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-vivid-textDim text-xs uppercase tracking-wider">Tier</p>
                      <p className="text-white font-semibold capitalize">{license.tier}</p>
                    </div>
                    <div>
                      <p className="text-vivid-textDim text-xs uppercase tracking-wider">Type</p>
                      <p className="text-white font-semibold">
                        {license.isLifetime ? "Lifetime" : "Time-Limited"}
                      </p>
                    </div>
                    <div>
                      <p className="text-vivid-textDim text-xs uppercase tracking-wider">Activated</p>
                      <p className="text-white font-semibold">
                        {license.activatedAt
                          ? new Date(license.activatedAt).toLocaleDateString("en-GB")
                          : "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-vivid-textDim text-xs uppercase tracking-wider">Expires</p>
                      <p className="text-white font-semibold">
                        {license.isLifetime ? (
                          <span className="flex items-center gap-1 text-green-400">
                            <Infinity className="w-3 h-3" /> Never
                          </span>
                        ) : license.expiresAt ? (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(license.expiresAt).toLocaleDateString("en-GB")}
                          </span>
                        ) : (
                          "—"
                        )}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="border-vivid-border">
          <CardContent className="py-12 text-center">
            <Key className="w-12 h-12 text-vivid-textDim mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No Active Licenses</h3>
            <p className="text-vivid-textMuted text-sm max-w-md mx-auto mb-6">
              You don&apos;t have any active VIVID licenses. Purchase one to unlock full access.
            </p>
            <Button asChild>
              <Link href="/pricing" className="inline-flex items-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                Purchase License
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* License History */}
      {licenses.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white">License History</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-vivid-border/40">
                  <th className="text-left py-3 px-4 text-vivid-textDim font-medium">License Key</th>
                  <th className="text-left py-3 px-4 text-vivid-textDim font-medium">Tier</th>
                  <th className="text-left py-3 px-4 text-vivid-textDim font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-vivid-textDim font-medium">Purchased</th>
                  <th className="text-left py-3 px-4 text-vivid-textDim font-medium">Expires</th>
                </tr>
              </thead>
              <tbody>
                {licenses.map((license) => {
                  const isActive = license.isActive && isLicenseValid(license.expiresAt);
                  return (
                    <tr
                      key={license.id}
                      className="border-b border-vivid-border/20 hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="py-3 px-4">
                        <code className="text-vivid-primary font-mono text-xs">{license.key}</code>
                      </td>
                      <td className="py-3 px-4 capitalize text-white">{license.tier}</td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={isActive ? "success" : "destructive"}
                          className="text-[10px]"
                        >
                          {isActive ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-vivid-textMuted">
                        {new Date(license.createdAt).toLocaleDateString("en-GB")}
                      </td>
                      <td className="py-3 px-4 text-vivid-textMuted">
                        {license.isLifetime
                          ? "Never"
                          : license.expiresAt
                          ? new Date(license.expiresAt).toLocaleDateString("en-GB")
                          : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Download CTA */}
      <Card className="border-vivid-primary/20">
        <CardContent className="py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-vivid-primary/10 flex items-center justify-center">
                <Download className="w-6 h-6 text-vivid-primary" />
              </div>
              <div>
                <p className="text-white font-semibold">Ready to use VIVID?</p>
                <p className="text-vivid-textMuted text-sm">
                  Download the software and activate with your license key
                </p>
              </div>
            </div>
            <Button asChild>
              <Link href="/download" className="inline-flex items-center gap-2">
                <Download className="w-4 h-4" />
                Download VIVID
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </PageWrapper>
  );
}

function CopyButton({ text }: { text: string }) {
  "use client";
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => {
        navigator.clipboard.writeText(text);
      }}
      className="shrink-0"
    >
      <Copy className="w-4 h-4 mr-1" />
      Copy
    </Button>
  );
}
