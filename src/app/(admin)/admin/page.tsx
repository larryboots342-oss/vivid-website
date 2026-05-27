"use client";

import useSWR from "swr";
import { motion } from "framer-motion";
import {
  Users,
  CreditCard,
  Key,
  TrendingUp,
  Activity,
  ArrowUpRight,
  Clock,
  Shield,
  Zap,
  Gamepad2,
  Video,
  PoundSterling,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CURRENCY_SYMBOL } from "@/lib/constants";

interface AdminStats {
  users: { total: number; recent: any[] };
  licenses: { total: number; active: number; expired: number; lifetime: number; byTier: Array<{ tier: string; count: number }> };
  revenue: {
    total: number;
    byTier: Array<{ tier: string; count: number; revenue: number }>;
    recent: Array<{
      id: string;
      amount: number;
      currency: string;
      provider: string;
      tier: string;
      email: string;
      name: string | null;
      createdAt: string;
    }>;
  };
  content: { totalVideos: number };
  activities: Array<any>;
}

const statCards = [
  { key: "users", label: "Total Users", icon: Users, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  { key: "licenses", label: "Active Licenses", icon: Key, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
  { key: "revenue", label: "Total Revenue", icon: TrendingUp, color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20" },
  { key: "content", label: "Videos", icon: Video, color: "text-pink-400", bg: "bg-pink-500/10", border: "border-pink-500/20" },
];

function StatCard({
  label,
  value,
  icon: Icon,
  color,
  bg,
  border,
  delay,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bg: string;
  border: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={cn(
        "relative rounded-2xl border p-6 overflow-hidden gpu-animate",
        "bg-vivid-surface/40 backdrop-blur-xl hover:bg-vivid-surface/60 transition-all duration-300",
        border
      )}
    >
      <div className={cn("absolute -top-4 -right-4 w-24 h-24 rounded-full blur-2xl opacity-30", bg)} />
      <div className="relative z-10">
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-4", bg, border)}>
          <Icon className={cn("w-5 h-5", color)} />
        </div>
        <p className="text-3xl font-bold text-white mb-1">{value}</p>
        <p className="text-sm text-vivid-textMuted">{label}</p>
      </div>
    </motion.div>
  );
}

export default function AdminOverviewPage() {
  const { data: stats, error, isLoading, mutate } = useSWR<AdminStats>("/api/admin/stats");

  const getStatValue = (key: string) => {
    if (!stats) return "—";
    switch (key) {
      case "users":
        return stats.users.total.toLocaleString();
      case "licenses":
        return stats.licenses.active.toLocaleString();
      case "revenue":
        return `${CURRENCY_SYMBOL}${stats.revenue.total.toLocaleString()}`;
      case "content":
        return stats.content.totalVideos.toLocaleString();
      default:
        return "—";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Overview</h1>
        <p className="text-vivid-textMuted">
          Real-time metrics and system health for VIVID.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-sm text-red-400">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            Failed to load admin stats.
          </div>
          <button
            onClick={() => mutate()}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium hover:bg-red-500/20 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Retry
          </button>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <StatCard
            key={card.key}
            label={card.label}
            value={isLoading ? "..." : error ? "—" : getStatValue(card.key)}
            icon={card.icon}
            color={card.color}
            bg={card.bg}
            border={card.border}
            delay={i * 0.08}
          />
        ))}
      </div>

      {/* Two-column layout */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* License Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="lg:col-span-2 rounded-2xl border border-vivid-border/50 bg-vivid-surface/40 backdrop-blur-xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white">License Breakdown</h2>
            <div className="flex items-center gap-2 text-xs text-vivid-textDim">
              <Activity className="w-3.5 h-3.5" />
              Live
            </div>
          </div>

          {stats ? (
            <div className="space-y-4">
              {stats.licenses.byTier.map((tier) => {
                const total = stats.licenses.active;
                const pct = total > 0 ? Math.round((tier.count / total) * 100) : 0;
                const rev = stats.revenue.byTier.find((r) => r.tier === tier.tier)?.revenue || 0;
                const tierColors: Record<string, string> = {
                  pro: "bg-vivid-primary",
                  elite: "bg-purple-400",
                  enterprise: "bg-green-400",
                };
                return (
                  <div key={tier.tier}>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-white capitalize">{tier.tier}</span>
                      <span className="text-vivid-textMuted">
                        {tier.count} ({pct}%) · <span className="text-green-400">£{rev.toFixed(2)}</span>
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className={cn("h-full rounded-full", tierColors[tier.tier] || "bg-vivid-primary")}
                      />
                    </div>
                  </div>
                );
              })}

              <div className="pt-4 mt-4 border-t border-vivid-border/30 grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{stats.licenses.active}</p>
                  <p className="text-xs text-vivid-textMuted mt-1">Active</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-400">{stats.licenses.lifetime}</p>
                  <p className="text-xs text-vivid-textMuted mt-1">Lifetime</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-vivid-accent">{stats.licenses.expired}</p>
                  <p className="text-xs text-vivid-textMuted mt-1">Expired</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-8 rounded-lg bg-white/5 animate-pulse" />
              ))}
            </div>
          )}
        </motion.div>

        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="rounded-2xl border border-vivid-border/50 bg-vivid-surface/40 backdrop-blur-xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white">Recent Sales</h2>
            <PoundSterling className="w-4 h-4 text-green-400" />
          </div>

          {stats?.revenue.recent && stats.revenue.recent.length > 0 ? (
            <div className="space-y-3">
              {stats.revenue.recent.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center shrink-0">
                    <PoundSterling className="w-3.5 h-3.5 text-green-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">
                      {payment.name || payment.email}
                    </p>
                    <p className="text-xs text-vivid-textMuted capitalize">
                      {payment.tier} · {payment.provider}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold text-green-400">
                      £{payment.amount.toFixed(2)}
                    </p>
                    <p className="text-[10px] text-vivid-textDim">
                      {new Date(payment.createdAt).toLocaleDateString("en-GB")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-vivid-textDim">No transactions yet</p>
          )}
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="rounded-2xl border border-vivid-border/50 bg-vivid-surface/40 backdrop-blur-xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white">Recent Activity</h2>
          <Zap className="w-4 h-4 text-vivid-primary" />
        </div>

        {stats ? (
          <div className="space-y-3">
            {stats.activities.slice(0, 8).map((activity) => (
              <div
                key={activity.id}
                className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-vivid-primary/10 border border-vivid-primary/20 flex items-center justify-center shrink-0">
                  <Activity className="w-3.5 h-3.5 text-vivid-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{activity.title}</p>
                  <p className="text-xs text-vivid-textMuted truncate">
                    {activity.user?.name || activity.user?.email || "System"}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-vivid-textDim shrink-0">
                  <Clock className="w-3 h-3" />
                  <span className="text-xs">
                    {new Date(activity.createdAt).toLocaleDateString("en-GB")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-14 rounded-xl bg-white/5 animate-pulse" />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
