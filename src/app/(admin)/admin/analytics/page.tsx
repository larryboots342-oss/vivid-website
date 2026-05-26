"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Users,
  Key,
  PoundSterling,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CURRENCY_SYMBOL } from "@/lib/constants";

interface AnalyticsData {
  users: { total: number; recent: any[] };
  licenses: { total: number; active: number; expired: number; lifetime: number; byTier: Array<{ tier: string; count: number }> };
  revenue: { total: number; byTier: Array<{ tier: string; count: number; revenue: number }> };
  content: { totalVideos: number };
  activities: Array<any>;
}

function MetricCard({
  title,
  value,
  icon: Icon,
  color,
  delay,
}: {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="rounded-2xl border border-vivid-border/50 bg-vivid-surface/40 backdrop-blur-xl p-6 gpu-animate hover:bg-vivid-surface/60 transition-all"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", color.replace("text-", "bg-").replace("400", "500/10"))}>
          <Icon className={cn("w-5 h-5", color)} />
        </div>
      </div>
      <p className="text-2xl font-bold text-white mb-1">{value}</p>
      <p className="text-sm text-vivid-textMuted">{title}</p>
    </motion.div>
  );
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Analytics</h1>
        <p className="text-vivid-textMuted">Revenue, growth, and engagement metrics</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Users"
          value={loading ? "..." : data?.users.total.toLocaleString() || "0"}
          icon={Users}
          color="text-blue-400"
          delay={0}
        />
        <MetricCard
          title="Active Licenses"
          value={loading ? "..." : data?.licenses.active.toLocaleString() || "0"}
          icon={Key}
          color="text-purple-400"
          delay={0.08}
        />
        <MetricCard
          title="Total Revenue"
          value={loading ? "..." : `${CURRENCY_SYMBOL}${data?.revenue.total.toLocaleString() || "0"}`}
          icon={PoundSterling}
          color="text-green-400"
          delay={0.16}
        />
        <MetricCard
          title="Conversion Rate"
          value={loading ? "..." : (data && data.users.total > 0 ? `${((data.licenses.active / data.users.total) * 100).toFixed(1)}%` : "0%")}
          icon={TrendingUp}
          color="text-pink-400"
          delay={0.24}
        />
      </div>

      {/* Revenue by Tier */}
      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="rounded-2xl border border-vivid-border/50 bg-vivid-surface/40 backdrop-blur-xl p-6"
        >
          <h2 className="text-lg font-bold text-white mb-6">Revenue by Tier</h2>
          {data ? (
            <div className="space-y-5">
              {data.revenue.byTier.map((tier) => {
                const totalRevenue = data.revenue.total;
                const pct = totalRevenue > 0 ? Math.round((tier.revenue / totalRevenue) * 100) : 0;
                const colors: Record<string, string> = {
                  pro: "bg-vivid-primary",
                  elite: "bg-purple-400",
                  enterprise: "bg-green-400",
                };
                return (
                  <div key={tier.tier}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-white capitalize">{tier.tier}</span>
                      <span className="text-sm text-vivid-textMuted">
                        {CURRENCY_SYMBOL}{tier.revenue.toLocaleString()} ({pct}%)
                      </span>
                    </div>
                    <div className="h-2.5 rounded-full bg-white/5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className={cn("h-full rounded-full", colors[tier.tier] || "bg-vivid-primary")}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-8 rounded-lg bg-white/5 animate-pulse" />
              ))}
            </div>
          )}
        </motion.div>

        {/* License Health */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="rounded-2xl border border-vivid-border/50 bg-vivid-surface/40 backdrop-blur-xl p-6"
        >
          <h2 className="text-lg font-bold text-white mb-6">License Health</h2>
          {data ? (
            <div className="space-y-4">
              {[
                { label: "Active", value: data.licenses.active, total: data.licenses.total, color: "bg-green-400" },
                { label: "Lifetime", value: data.licenses.lifetime, total: data.licenses.total, color: "bg-vivid-primary" },
                { label: "Expired", value: data.licenses.expired, total: data.licenses.total, color: "bg-vivid-accent" },
              ].map((item) => {
                const pct = item.total > 0 ? Math.round((item.value / item.total) * 100) : 0;
                return (
                  <div key={item.label} className="flex items-center gap-4">
                    <div className="w-24 text-sm text-vivid-textMuted">{item.label}</div>
                    <div className="flex-1 h-8 rounded-lg bg-white/5 overflow-hidden relative">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8 }}
                        className={cn("h-full", item.color)}
                        style={{ opacity: 0.6 }}
                      />
                      <span className="absolute inset-0 flex items-center px-3 text-xs font-medium text-white">
                        {item.value} ({pct}%)
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-8 rounded-lg bg-white/5 animate-pulse" />
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Activity Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="rounded-2xl border border-vivid-border/50 bg-vivid-surface/40 backdrop-blur-xl p-6"
      >
        <h2 className="text-lg font-bold text-white mb-6">System Activity</h2>
        {data ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.activities.slice(0, 12).map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-vivid-primary/10 border border-vivid-primary/20 flex items-center justify-center shrink-0">
                  <Activity className="w-3.5 h-3.5 text-vivid-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-white truncate">{activity.title}</p>
                  <p className="text-xs text-vivid-textMuted truncate">
                    {activity.user?.name || activity.user?.email || "System"}
                  </p>
                  <p className="text-[10px] text-vivid-textDim mt-1">
                    {new Date(activity.createdAt).toLocaleString("en-GB")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-16 rounded-xl bg-white/5 animate-pulse" />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
