"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Key,
  Download,
  Copy,
  Check,
  Calendar,
  Shield,
  Zap,
  ExternalLink,
  MessageCircle,
  Clock,
  Infinity,
  Crown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getDaysRemaining } from "@/lib/license";
import ReviewPrompt from "./review-prompt";
import { Suspense } from "react";

interface LicenseData {
  id: string;
  key: string;
  tier: string;
  isActive: boolean;
  isLifetime: boolean;
  expiresAt: string | null;
}

interface ActivityData {
  id: string;
  type: string;
  title: string;
  description: string | null;
  createdAt: string;
}

interface UserDashboardData {
  firstName: string;
  memberSince: string;
  hasLicense: boolean;
  tier: string;
  licenses: LicenseData[];
  activities: ActivityData[];
}

const tierConfig: Record<string, { color: string; bg: string; label: string }> = {
  free: { color: "text-vivid-textMuted", bg: "bg-vivid-surfaceHover", label: "Free" },
  pro: { color: "text-cyan-400", bg: "bg-cyan-500/10", label: "Pro" },
  elite: { color: "text-purple-400", bg: "bg-purple-500/10", label: "Elite" },
  enterprise: { color: "text-green-400", bg: "bg-green-500/10", label: "Enterprise" },
};

function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(date).toLocaleDateString("en-GB", { month: "short", day: "numeric" });
}

function LicenseKeyCard({ license }: { license: LicenseData }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(license.key);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const daysLeft = getDaysRemaining(license.expiresAt);
  const tierStyle = tierConfig[license.tier] || tierConfig.free;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <Card className="overflow-hidden border-vivid-border/60">
        <div className={cn("h-1", tierStyle.bg.replace("/10", "/40"))} />
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", tierStyle.bg)}>
                <Key className={cn("w-4 h-4", tierStyle.color)} />
              </div>
              <CardTitle className="text-white text-base">
                {tierStyle.label} License
              </CardTitle>
            </div>
            <Badge
              variant={license.isActive ? "success" : "destructive"}
              className="text-xs"
            >
              {license.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* License Key */}
          <div className="relative">
            <div className="flex items-center gap-2 p-3 rounded-xl bg-vivid-bg border border-vivid-border/60 font-mono text-sm">
              <code className="text-vivid-primary truncate flex-1">{license.key}</code>
              <button
                onClick={handleCopy}
                className="shrink-0 p-1.5 rounded-lg hover:bg-white/5 transition-colors"
                aria-label="Copy license key"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4 text-vivid-textDim" />
                )}
              </button>
            </div>
          </div>

          {/* Status row */}
          <div className="flex items-center gap-4 text-sm">
            {license.isLifetime ? (
              <span className="flex items-center gap-1.5 text-green-400">
                <Infinity className="w-4 h-4" />
                Lifetime access
              </span>
            ) : daysLeft !== null ? (
              <span className={cn(
                "flex items-center gap-1.5",
                daysLeft <= 3 ? "text-vivid-accent" : daysLeft <= 7 ? "text-yellow-400" : "text-vivid-textMuted"
              )}>
                <Clock className="w-4 h-4" />
                {daysLeft === 0 ? "Expires today" : `${daysLeft} day${daysLeft !== 1 ? "s" : ""} left`}
              </span>
            ) : (
              <span className="text-vivid-textMuted">No expiration</span>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function UserDashboardContent({ data, justPurchased }: { data: UserDashboardData; justPurchased?: boolean }) {
  const { firstName, hasLicense, tier, licenses, activities } = data;

  const tierStyle = tierConfig[tier] || tierConfig.free;
  const activeLicenses = licenses.filter((l) => l.isActive);
  const latestLicense = activeLicenses[0];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Post-purchase review prompt */}
      {justPurchased && (
        <Suspense fallback={null}>
          <ReviewPrompt />
        </Suspense>
      )}
      {/* Welcome Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-2xl border border-vivid-border/60 bg-gradient-to-br from-vivid-surface to-vivid-surface/50 p-8"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-vivid-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-vivid-primary/3 rounded-full blur-2xl" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <Badge className={cn("text-xs border-0", tierStyle.bg, tierStyle.color)}>
              {hasLicense ? tierStyle.label : "Free Account"}
            </Badge>
            {hasLicense && (
              <Badge variant="success" className="text-xs border-0 bg-green-500/10 text-green-400">
                <Shield className="w-3 h-3 mr-1" />
                Licensed
              </Badge>
            )}
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, {firstName}
          </h1>
          <p className="text-vivid-textMuted max-w-lg">
            {hasLicense
              ? "Your VIVID license is active. Download the software and start dominating."
              : "Upgrade to a license plan to unlock the full power of VIVID AI."}
          </p>
        </div>
      </motion.div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - License & Download */}
        <div className="lg:col-span-2 space-y-6">
          {/* License Status */}
          {hasLicense && latestLicense ? (
            <LicenseKeyCard license={latestLicense} />
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="border-vivid-border/60">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-vivid-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Crown className="w-8 h-8 text-vivid-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    No Active License
                  </h3>
                  <p className="text-vivid-textMuted text-sm mb-6 max-w-sm mx-auto">
                    Get a license to unlock GPU-accelerated AI inference, hardware optimization, and more.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link href="/pricing">
                      <Button className="bg-vivid-primary text-vivid-bg hover:bg-vivid-primaryDim font-semibold gap-2">
                        <Zap className="w-4 h-4" />
                        View Plans
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="border-vivid-border/60">
              <CardHeader>
                <CardTitle className="text-white text-base">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Link
                  href="/download"
                  className="flex items-center gap-3 p-4 rounded-xl border border-vivid-border/60 bg-vivid-surface/30 hover:border-vivid-primary/30 hover:bg-vivid-primary/5 transition-all duration-300 group"
                >
                  <div className="w-10 h-10 rounded-lg bg-vivid-primary/10 flex items-center justify-center group-hover:bg-vivid-primary/20 transition-colors">
                    <Download className="w-5 h-5 text-vivid-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white group-hover:text-vivid-primary transition-colors">
                      Download VIVID
                    </p>
                    <p className="text-xs text-vivid-textMuted">Latest version</p>
                  </div>
                </Link>

                <Link
                  href="/dashboard/billing"
                  className="flex items-center gap-3 p-4 rounded-xl border border-vivid-border/60 bg-vivid-surface/30 hover:border-vivid-primary/30 hover:bg-vivid-primary/5 transition-all duration-300 group"
                >
                  <div className="w-10 h-10 rounded-lg bg-vivid-primary/10 flex items-center justify-center group-hover:bg-vivid-primary/20 transition-colors">
                    <Key className="w-5 h-5 text-vivid-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white group-hover:text-vivid-primary transition-colors">
                      My Licenses
                    </p>
                    <p className="text-xs text-vivid-textMuted">View all keys</p>
                  </div>
                </Link>

                <Link
                  href="/pricing"
                  className="flex items-center gap-3 p-4 rounded-xl border border-vivid-border/60 bg-vivid-surface/30 hover:border-vivid-primary/30 hover:bg-vivid-primary/5 transition-all duration-300 group"
                >
                  <div className="w-10 h-10 rounded-lg bg-vivid-primary/10 flex items-center justify-center group-hover:bg-vivid-primary/20 transition-colors">
                    <Zap className="w-5 h-5 text-vivid-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white group-hover:text-vivid-primary transition-colors">
                      Upgrade Plan
                    </p>
                    <p className="text-xs text-vivid-textMuted">More features</p>
                  </div>
                </Link>

                <a
                  href="https://discord.gg/vivid"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 rounded-xl border border-vivid-border/60 bg-vivid-surface/30 hover:border-vivid-primary/30 hover:bg-vivid-primary/5 transition-all duration-300 group"
                >
                  <div className="w-10 h-10 rounded-lg bg-vivid-primary/10 flex items-center justify-center group-hover:bg-vivid-primary/20 transition-colors">
                    <MessageCircle className="w-5 h-5 text-vivid-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white group-hover:text-vivid-primary transition-colors">
                      Support
                    </p>
                    <p className="text-xs text-vivid-textMuted">Get help</p>
                  </div>
                </a>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Right column - Stats & Info */}
        <div className="space-y-6">
          {/* Plan Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <Card className="border-vivid-border/60">
              <CardHeader>
                <CardTitle className="text-white text-base">Plan Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-vivid-textMuted">Current Plan</span>
                  <span className={cn("text-sm font-semibold", tierStyle.color)}>
                    {tierStyle.label}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-vivid-textMuted">License Keys</span>
                  <span className="text-sm font-semibold text-white">
                    {activeLicenses.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-vivid-textMuted">Status</span>
                  <span className={cn(
                    "text-sm font-semibold",
                    hasLicense ? "text-green-400" : "text-vivid-textMuted"
                  )}>
                    {hasLicense ? "Active" : "None"}
                  </span>
                </div>
                {latestLicense && !latestLicense.isLifetime && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-vivid-textMuted">Expires</span>
                    <span className="text-sm font-semibold text-white">
                      {latestLicense.expiresAt
                        ? new Date(latestLicense.expiresAt).toLocaleDateString("en-GB")
                        : "—"}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Download Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            <Card className="border-vivid-primary/20 bg-gradient-to-br from-vivid-primary/10 to-vivid-primary/5">
              <CardContent className="p-6 text-center">
                <Download className="w-8 h-8 text-vivid-primary mx-auto mb-3" />
                <h3 className="text-white font-semibold mb-1">VIVID v2.7.0</h3>
                <p className="text-vivid-textMuted text-xs mb-4">
                  Windows • 27 MB
                </p>
                <Link href="/download">
                  <Button className="w-full bg-vivid-primary text-vivid-bg hover:bg-vivid-primaryDim font-semibold gap-2">
                    <Download className="w-4 h-4" />
                    Download
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>

          {/* Activity Feed */}
          {activities.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="border-vivid-border/60">
                <CardHeader>
                  <CardTitle className="text-white text-base">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {activities.slice(0, 4).map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-vivid-primary mt-1.5 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white truncate">{activity.title}</p>
                        <p className="text-xs text-vivid-textDim">{formatRelativeTime(activity.createdAt)}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>

      {/* Getting Started Banner */}
      {!hasLicense && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
        >
          <Card className="border-vivid-border/60 overflow-hidden">
            <div className="p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-vivid-primary to-vivid-primaryDim flex items-center justify-center shrink-0">
                <Zap className="w-8 h-8 text-vivid-bg" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-xl font-bold text-white mb-1">
                  Ready to upgrade?
                </h3>
                <p className="text-vivid-textMuted text-sm mb-0">
                  Choose a plan that fits your play style. Pro for £7, Elite for £20, or Enterprise for lifetime access at £100.
                </p>
              </div>
              <Link href="/pricing">
                <Button className="bg-vivid-primary text-vivid-bg hover:bg-vivid-primaryDim font-semibold shrink-0 gap-2">
                  View Pricing
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
