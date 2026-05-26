"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CreditCard,
  Key,
  Calendar,
  Activity,
  Zap,
  Shield,
  TrendingUp,
  ArrowUpRight,
  Download,
  ExternalLink,
  Infinity,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import ReviewPrompt from "@/components/dashboard/review-prompt";
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

interface DashboardData {
  firstName: string;
  memberSince: string;
  hasLicense: boolean;
  tier: string;
  licenses: LicenseData[];
  activities: ActivityData[];
}

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  badge,
  badgeVariant,
  delay,
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeVariant?: "default" | "success" | "secondary";
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <Card className="group hover:border-vivid-primary/20 transition-all duration-300 hover:-translate-y-1">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-vivid-primary/10 flex items-center justify-center group-hover:bg-vivid-primary/20 transition-colors">
                <Icon className="w-4 h-4 text-vivid-primary" />
              </div>
              <CardTitle className="text-sm font-medium text-vivid-textMuted">
                {title}
              </CardTitle>
            </div>
            {badge && (
              <Badge variant={badgeVariant || "default"}>{badge}</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">{value}</span>
          </div>
          <p className="text-vivid-textMuted text-xs mt-1">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function ActivityItem({
  type,
  title,
  description,
  time,
  delay,
}: {
  type: string;
  title: string;
  description: string | null;
  time: string;
  delay: number;
}) {
  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    license_created: Key,
    license_deactivated: Shield,
    payment_failed: CreditCard,
    security: Shield,
    update: Zap,
    default: Activity,
  };

  const colorMap: Record<string, string> = {
    license_created: "bg-green-500/10 text-green-400",
    license_deactivated: "bg-vivid-accent/10 text-vivid-accent",
    payment_failed: "bg-red-500/10 text-red-400",
    security: "bg-yellow-500/10 text-yellow-400",
    update: "bg-purple-500/10 text-purple-400",
    default: "bg-vivid-surfaceHover text-vivid-textMuted",
  };

  const Icon = iconMap[type] || iconMap.default;
  const colors = colorMap[type] || colorMap.default;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
      className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/[0.02] transition-colors group"
    >
      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", colors)}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white group-hover:text-vivid-primary transition-colors">
          {title}
        </p>
        {description && (
          <p className="text-xs text-vivid-textMuted mt-0.5">{description}</p>
        )}
      </div>
      <span className="text-xs text-vivid-textDim shrink-0">{time}</span>
    </motion.div>
  );
}

function QuickAction({
  icon: Icon,
  label,
  href,
  delay,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        href={href}
        className="flex items-center gap-3 p-4 rounded-xl border border-vivid-border/60 bg-vivid-surface/30 hover:border-vivid-primary/30 hover:bg-vivid-primary/5 transition-all duration-300 group"
      >
        <div className="w-10 h-10 rounded-lg bg-vivid-primary/10 flex items-center justify-center group-hover:bg-vivid-primary/20 transition-colors">
          <Icon className="w-5 h-5 text-vivid-primary" />
        </div>
        <span className="text-sm font-medium text-white group-hover:text-vivid-primary transition-colors">
          {label}
        </span>
        <ArrowUpRight className="w-4 h-4 ml-auto text-vivid-textDim group-hover:text-vivid-primary transition-colors" />
      </Link>
    </motion.div>
  );
}

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

function getDaysUntilExpiry(expiresAt: string | null): string {
  if (!expiresAt) return "Lifetime";
  const diff = new Date(expiresAt).getTime() - Date.now();
  const days = Math.max(0, Math.ceil(diff / (24 * 60 * 60 * 1000)));
  return days === 0 ? "Expires today" : `${days} day${days !== 1 ? "s" : ""} left`;
}

export default function DashboardContent({ data, justPurchased }: { data: DashboardData; justPurchased?: boolean }) {
  const { firstName, memberSince, hasLicense, tier, licenses, activities } = data;

  const planName = tier.charAt(0).toUpperCase() + tier.slice(1);
  const planBadge = hasLicense ? "Active" : "Free";
  const planBadgeVariant = hasLicense ? "success" : "secondary";

  const activeLicenses = licenses.filter((l) => l.isActive);
  const latestLicense = activeLicenses[0];
  const expiryText = latestLicense
    ? latestLicense.isLifetime
      ? "Lifetime access"
      : getDaysUntilExpiry(latestLicense.expiresAt)
    : "No active license";

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <h1 className="text-3xl font-bold text-white mb-1">
          Welcome back, {firstName}
        </h1>
        <p className="text-vivid-textMuted">
          Here&apos;s what&apos;s happening with your account
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Plan"
          value={planName}
          description={expiryText}
          icon={hasLicense ? Key : CreditCard}
          badge={planBadge}
          badgeVariant={planBadgeVariant as "default" | "success" | "secondary"}
          delay={0.1}
        />
        <StatCard
          title="Licenses"
          value={String(licenses.length)}
          description={`${activeLicenses.length} active license key${activeLicenses.length !== 1 ? "s" : ""}`}
          icon={Key}
          delay={0.15}
        />
        <StatCard
          title="Usage"
          value="—"
          description="No usage data yet"
          icon={Activity}
          delay={0.2}
        />
        <StatCard
          title="Member Since"
          value={new Date(memberSince).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}
          description="Account created"
          icon={Calendar}
          delay={0.25}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-white text-lg">Quick Actions</CardTitle>
              <CardDescription className="text-vivid-textMuted">
                Common tasks and shortcuts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <QuickAction icon={Download} label="Download VIVID" href="/download" delay={0.35} />
              {!hasLicense && (
                <QuickAction icon={CreditCard} label="Get a License" href="/pricing" delay={0.4} />
              )}
              <QuickAction icon={Key} label="View Licenses" href="/dashboard/billing" delay={0.45} />
              <QuickAction icon={ExternalLink} label="Visit Website" href="/" delay={0.5} />
            </CardContent>
          </Card>
        </motion.div>

        {/* Activity Feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="lg:col-span-2"
        >
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-white text-lg">Recent Activity</CardTitle>
                <CardDescription className="text-vivid-textMuted">
                  Latest events from your account
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-1">
              {activities.length > 0 ? (
                activities.map((activity, i) => (
                  <ActivityItem
                    key={activity.id}
                    type={activity.type}
                    title={activity.title}
                    description={activity.description}
                    time={formatRelativeTime(activity.createdAt)}
                    delay={0.4 + i * 0.05}
                  />
                ))
              ) : (
                <div className="p-8 text-center">
                  <Activity className="w-8 h-8 text-vivid-textDim mx-auto mb-3" />
                  <p className="text-sm text-vivid-textMuted">No activity yet</p>
                  <p className="text-xs text-vivid-textDim mt-1">
                    Activities will appear here as you use VIVID
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* License Keys Table */}
      {licenses.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white text-lg">Your License Keys</CardTitle>
                  <CardDescription className="text-vivid-textMuted">
                    All your VIVID license keys and their status
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-vivid-border/40">
                      <th className="text-left py-3 px-4 text-vivid-textDim font-medium">Key</th>
                      <th className="text-left py-3 px-4 text-vivid-textDim font-medium">Tier</th>
                      <th className="text-left py-3 px-4 text-vivid-textDim font-medium">Status</th>
                      <th className="text-left py-3 px-4 text-vivid-textDim font-medium">Expires</th>
                    </tr>
                  </thead>
                  <tbody>
                    {licenses.map((license) => (
                      <tr
                        key={license.id}
                        className="border-b border-vivid-border/20 hover:bg-white/[0.02] transition-colors"
                      >
                        <td className="py-3 px-4">
                          <code className="text-vivid-primary font-mono text-xs">{license.key}</code>
                        </td>
                        <td className="py-3 px-4">
                          <span className="capitalize text-white">{license.tier}</span>
                        </td>
                        <td className="py-3 px-4">
                          <Badge
                            variant={license.isActive ? "success" : "destructive"}
                            className="text-xs"
                          >
                            {license.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-vivid-textMuted">
                          {license.isLifetime ? (
                            <span className="flex items-center gap-1 text-green-400">
                              <Infinity className="w-3 h-3" /> Lifetime
                            </span>
                          ) : license.expiresAt ? (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(license.expiresAt).toLocaleDateString("en-GB")}
                            </span>
                          ) : (
                            "—"
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Post-purchase review prompt */}
      {justPurchased && (
        <Suspense fallback={null}>
          <ReviewPrompt />
        </Suspense>
      )}

      {/* Usage Section — only shows when real data exists */}
      {activities.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white text-lg">Usage Overview</CardTitle>
                  <CardDescription className="text-vivid-textMuted">
                    Your inference usage over the last 30 days
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="py-12 text-center">
                <Activity className="w-8 h-8 text-vivid-textDim mx-auto mb-3" />
                <p className="text-sm text-vivid-textMuted">No usage data yet</p>
                <p className="text-xs text-vivid-textDim mt-1">
                  Usage statistics will appear once you start using VIVID
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
