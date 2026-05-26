"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import {
  Users,
  Eye,
  Activity,
  Globe,
  Monitor,
  Smartphone,
  Tablet,
  Clock,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Navigation,
  Search,
  MousePointer,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ── Types ───────────────────────────────────────────────────────── */

interface VisitorData {
  summary: {
    totalVisitors: number;
    totalPageViews: number;
    uniqueInRange: number;
    pageViewsInRange: number;
    activeNow: number;
  };
  timeSeries: Array<{ label: string; views: number }>;
  topPages: Array<{ path: string; views: number }>;
  topCountries: Array<{ country: string; visitors: number }>;
  topSources: Array<{ source: string; visitors: number }>;
  deviceBreakdown: Array<{ device: string; count: number }>;
  browserBreakdown: Array<{ browser: string; count: number }>;
  visitors: Array<{
    id: string;
    visitorId: string;
    firstSeen: string;
    lastSeen: string;
    visitCount: number;
    country: string | null;
    city: string | null;
    region: string | null;
    ip: string | null;
    device: string | null;
    browser: string | null;
    os: string | null;
    source: string | null;
    referrer: string | null;
    user: { id: string; email: string; name: string | null } | null;
    pageViews: number;
  }>;
  pagination: { page: number; limit: number; total: number; pages: number };
}

/* ── Colors ──────────────────────────────────────────────────────── */

const COLORS = ["#00f5ff", "#a855f7", "#22c55e", "#f59e0b", "#ef4444", "#6366f1", "#ec4899", "#14b8a6"];
const DEVICE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Desktop: Monitor,
  Mobile: Smartphone,
  Tablet: Tablet,
};

/* ── Stat Card ───────────────────────────────────────────────────── */

function StatCard({
  label,
  value,
  icon: Icon,
  color,
  bg,
  border,
  delay,
  subtext,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bg: string;
  border: string;
  delay: number;
  subtext?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={cn(
        "relative rounded-2xl border p-6 overflow-hidden",
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
        {subtext && <p className="text-xs text-vivid-textDim mt-1">{subtext}</p>}
      </div>
    </motion.div>
  );
}

/* ── Custom Tooltip for Charts ───────────────────────────────────── */

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-vivid-border/50 bg-vivid-surface/95 backdrop-blur-xl px-4 py-3 shadow-xl">
      <p className="text-xs text-vivid-textDim mb-1">{label}</p>
      <p className="text-sm font-semibold text-white">
        {payload[0].value.toLocaleString()} views
      </p>
    </div>
  );
}

/* ── Main Page ───────────────────────────────────────────────────── */

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<VisitorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"today" | "week" | "month">("today");
  const [page, setPage] = useState(1);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/visitors?filter=${filter}&page=${page}&limit=25`);
      const json = await res.json();
      setData(json);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [filter, page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const stats = data?.summary;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Visitor Analytics</h1>
          <p className="text-vivid-textMuted">Real-time traffic, geography, and behaviour</p>
        </div>
        <div className="flex items-center gap-2 bg-white/[0.03] border border-white/10 rounded-xl p-1">
          {(["today", "week", "month"] as const).map((f) => (
            <button
              key={f}
              onClick={() => { setFilter(f); setPage(1); }}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize",
                filter === f
                  ? "bg-vivid-primary/15 text-vivid-primary border border-vivid-primary/20"
                  : "text-vivid-textMuted hover:text-white"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          label="Total Visitors"
          value={loading ? "—" : stats?.totalVisitors.toLocaleString() || "0"}
          icon={Users}
          color="text-blue-400"
          bg="bg-blue-500/10"
          border="border-blue-500/20"
          delay={0}
          subtext="All time"
        />
        <StatCard
          label="Total Page Views"
          value={loading ? "—" : stats?.totalPageViews.toLocaleString() || "0"}
          icon={Eye}
          color="text-purple-400"
          bg="bg-purple-500/10"
          border="border-purple-500/20"
          delay={0.05}
          subtext="All time"
        />
        <StatCard
          label="Active Now"
          value={loading ? "—" : stats?.activeNow.toLocaleString() || "0"}
          icon={Activity}
          color="text-green-400"
          bg="bg-green-500/10"
          border="border-green-500/20"
          delay={0.1}
          subtext="Last 5 minutes"
        />
        <StatCard
          label={`Unique ${filter === "today" ? "Today" : filter === "week" ? "This Week" : "This Month"}`}
          value={loading ? "—" : stats?.uniqueInRange.toLocaleString() || "0"}
          icon={Globe}
          color="text-cyan-400"
          bg="bg-cyan-500/10"
          border="border-cyan-500/20"
          delay={0.15}
        />
        <StatCard
          label={`Views ${filter === "today" ? "Today" : filter === "week" ? "This Week" : "This Month"}`}
          value={loading ? "—" : stats?.pageViewsInRange.toLocaleString() || "0"}
          icon={MousePointer}
          color="text-pink-400"
          bg="bg-pink-500/10"
          border="border-pink-500/20"
          delay={0.2}
        />
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Traffic Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="lg:col-span-2 rounded-2xl border border-vivid-border/50 bg-vivid-surface/40 backdrop-blur-xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white">Traffic Overview</h2>
            <div className="flex items-center gap-2 text-xs text-vivid-textDim">
              <Clock className="w-3.5 h-3.5" />
              {filter === "today" ? "Hourly" : "Daily"}
            </div>
          </div>
          <div className="h-[280px]">
            {data?.timeSeries && data.timeSeries.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.timeSeries} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00f5ff" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#00f5ff" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis
                    dataKey="label"
                    tick={{ fill: "#6b7280", fontSize: 11 }}
                    axisLine={{ stroke: "rgba(255,255,255,0.08)" }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "#6b7280", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="views"
                    stroke="#00f5ff"
                    strokeWidth={2}
                    fill="url(#viewsGradient)"
                    animationDuration={800}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-vivid-textDim text-sm">
                No data for selected period
              </div>
            )}
          </div>
        </motion.div>

        {/* Device Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="rounded-2xl border border-vivid-border/50 bg-vivid-surface/40 backdrop-blur-xl p-6"
        >
          <h2 className="text-lg font-bold text-white mb-6">Devices</h2>
          <div className="h-[200px]">
            {data?.deviceBreakdown && data.deviceBreakdown.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.deviceBreakdown}
                    dataKey="count"
                    nameKey="device"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    stroke="none"
                    animationDuration={800}
                  >
                    {data.deviceBreakdown.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }: any) => {
                      if (!active || !payload?.length) return null;
                      return (
                        <div className="rounded-xl border border-vivid-border/50 bg-vivid-surface/95 px-3 py-2 shadow-xl">
                          <p className="text-sm font-medium text-white">{payload[0].name}</p>
                          <p className="text-xs text-vivid-textMuted">{payload[0].value} visitors</p>
                        </div>
                      );
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-vivid-textDim text-sm">
                No data
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-3 mt-2 justify-center">
            {data?.deviceBreakdown.map((d, i) => {
              const DeviceIcon = DEVICE_ICONS[d.device] || Monitor;
              return (
                <div key={d.device} className="flex items-center gap-1.5 text-xs">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <DeviceIcon className="w-3 h-3 text-vivid-textDim" />
                  <span className="text-vivid-textMuted">{d.device}</span>
                  <span className="text-vivid-textDim">({d.count})</span>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Second Row: Top Pages + Countries + Sources + Browsers */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="rounded-2xl border border-vivid-border/50 bg-vivid-surface/40 backdrop-blur-xl p-6"
        >
          <h2 className="text-lg font-bold text-white mb-6">Top Pages</h2>
          {data?.topPages && data.topPages.length > 0 ? (
            <div className="space-y-3">
              {data.topPages.map((p, i) => (
                <div key={p.path} className="flex items-center gap-3">
                  <span className="text-xs text-vivid-textDim w-5">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${data.topPages[0].views > 0 ? (p.views / data.topPages[0].views) * 100 : 0}%` }}
                        transition={{ duration: 0.6, delay: 0.1 * i }}
                        className="h-full rounded-full bg-vivid-primary"
                        style={{ opacity: 0.7 }}
                      />
                    </div>
                  </div>
                  <code className="text-xs text-vivid-textMuted truncate max-w-[180px]">{p.path}</code>
                  <span className="text-xs text-vivid-text font-medium w-10 text-right">{p.views}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-vivid-textDim">No page view data</p>
          )}
        </motion.div>

        {/* Top Countries */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="rounded-2xl border border-vivid-border/50 bg-vivid-surface/40 backdrop-blur-xl p-6"
        >
          <h2 className="text-lg font-bold text-white mb-6">Geography</h2>
          {data?.topCountries && data.topCountries.length > 0 ? (
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.topCountries.slice(0, 6)} layout="vertical" margin={{ top: 0, right: 20, left: 20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                  <XAxis type="number" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis
                    type="category"
                    dataKey="country"
                    tick={{ fill: "#9ca3af", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    width={80}
                  />
                  <Tooltip
                    content={({ active, payload }: any) => {
                      if (!active || !payload?.length) return null;
                      return (
                        <div className="rounded-xl border border-vivid-border/50 bg-vivid-surface/95 px-3 py-2 shadow-xl">
                          <p className="text-sm font-medium text-white">{payload[0].payload.country}</p>
                          <p className="text-xs text-vivid-textMuted">{payload[0].value} visitors</p>
                        </div>
                      );
                    }}
                  />
                  <Bar dataKey="visitors" fill="#00f5ff" radius={[0, 4, 4, 0]} animationDuration={800}>
                    {data.topCountries.slice(0, 6).map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-sm text-vivid-textDim">No geographic data</p>
          )}
        </motion.div>
      </div>

      {/* Third Row: Sources + Browsers */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Traffic Sources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="rounded-2xl border border-vivid-border/50 bg-vivid-surface/40 backdrop-blur-xl p-6"
        >
          <h2 className="text-lg font-bold text-white mb-6">Traffic Sources</h2>
          {data?.topSources && data.topSources.length > 0 ? (
            <div className="space-y-3">
              {data.topSources.map((s, i) => (
                <div key={s.source} className="flex items-center gap-3">
                  <Navigation className="w-4 h-4 text-vivid-textDim shrink-0" />
                  <span className="text-sm text-white flex-1">{s.source}</span>
                  <div className="flex-1 max-w-[200px]">
                    <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${data.topSources[0].visitors > 0 ? (s.visitors / data.topSources[0].visitors) * 100 : 0}%` }}
                        transition={{ duration: 0.6, delay: 0.1 * i }}
                        className="h-full rounded-full bg-purple-400"
                        style={{ opacity: 0.7 }}
                      />
                    </div>
                  </div>
                  <span className="text-xs text-vivid-textMuted w-10 text-right">{s.visitors}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-vivid-textDim">No source data</p>
          )}
        </motion.div>

        {/* Browser Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="rounded-2xl border border-vivid-border/50 bg-vivid-surface/40 backdrop-blur-xl p-6"
        >
          <h2 className="text-lg font-bold text-white mb-6">Browsers</h2>
          {data?.browserBreakdown && data.browserBreakdown.length > 0 ? (
            <div className="space-y-3">
              {data.browserBreakdown.map((b, i) => (
                <div key={b.browser} className="flex items-center gap-3">
                  <Search className="w-4 h-4 text-vivid-textDim shrink-0" />
                  <span className="text-sm text-white flex-1">{b.browser}</span>
                  <div className="flex-1 max-w-[200px]">
                    <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${data.browserBreakdown[0].count > 0 ? (b.count / data.browserBreakdown[0].count) * 100 : 0}%` }}
                        transition={{ duration: 0.6, delay: 0.1 * i }}
                        className="h-full rounded-full bg-green-400"
                        style={{ opacity: 0.7 }}
                      />
                    </div>
                  </div>
                  <span className="text-xs text-vivid-textMuted w-10 text-right">{b.count}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-vivid-textDim">No browser data</p>
          )}
        </motion.div>
      </div>

      {/* Visitors Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.55 }}
        className="rounded-2xl border border-vivid-border/50 bg-vivid-surface/40 backdrop-blur-xl overflow-hidden"
      >
        <div className="p-6 pb-4">
          <h2 className="text-lg font-bold text-white">Recent Visitors</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-vivid-border/40">
                <th className="px-6 py-3 text-xs font-semibold text-vivid-textDim uppercase tracking-wider">Visitor</th>
                <th className="px-6 py-3 text-xs font-semibold text-vivid-textDim uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-xs font-semibold text-vivid-textDim uppercase tracking-wider">IP Address</th>
                <th className="px-6 py-3 text-xs font-semibold text-vivid-textDim uppercase tracking-wider">Device / Browser</th>
                <th className="px-6 py-3 text-xs font-semibold text-vivid-textDim uppercase tracking-wider">Source</th>
                <th className="px-6 py-3 text-xs font-semibold text-vivid-textDim uppercase tracking-wider">Views</th>
                <th className="px-6 py-3 text-xs font-semibold text-vivid-textDim uppercase tracking-wider">Last Seen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-vivid-border/30">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4"><div className="h-8 rounded-lg bg-white/5 animate-pulse w-32" /></td>
                    <td className="px-6 py-4"><div className="h-8 rounded-lg bg-white/5 animate-pulse w-24" /></td>
                    <td className="px-6 py-4"><div className="h-8 rounded-lg bg-white/5 animate-pulse w-28" /></td>
                    <td className="px-6 py-4"><div className="h-8 rounded-lg bg-white/5 animate-pulse w-32" /></td>
                    <td className="px-6 py-4"><div className="h-8 rounded-lg bg-white/5 animate-pulse w-20" /></td>
                    <td className="px-6 py-4"><div className="h-8 rounded-lg bg-white/5 animate-pulse w-12" /></td>
                    <td className="px-6 py-4"><div className="h-8 rounded-lg bg-white/5 animate-pulse w-20" /></td>
                  </tr>
                ))
              ) : (
                data?.visitors.map((v) => (
                  <tr key={v.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-vivid-primary/10 flex items-center justify-center shrink-0">
                          <Users className="w-4 h-4 text-vivid-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-white">
                            {v.user?.name || "Anonymous"}
                          </p>
                          {v.user?.email && (
                            <p className="text-xs text-vivid-textMuted">{v.user.email}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-vivid-textMuted">
                        <MapPin className="w-3.5 h-3.5 text-vivid-textDim" />
                        {[v.city, v.region, v.country].filter(Boolean).join(", ") || "Unknown"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <code className="text-xs font-mono text-vivid-primary">{v.ip || "—"}</code>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs text-vivid-text">{v.device || "—"}</span>
                        <span className="text-xs text-vivid-textDim">{v.browser} {v.os ? `· ${v.os}` : ""}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-vivid-textMuted">{v.source || "—"}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-white">{v.pageViews}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-vivid-textDim">
                        {new Date(v.lastSeen).toLocaleString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data && data.pagination.pages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-vivid-border/40">
            <p className="text-xs text-vivid-textDim">
              Page {data.pagination.page} of {data.pagination.pages}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="p-2 rounded-lg bg-white/[0.04] border border-white/10 text-vivid-textMuted hover:text-white disabled:opacity-30 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(data.pagination.pages, p + 1))}
                disabled={page >= data.pagination.pages}
                className="p-2 rounded-lg bg-white/[0.04] border border-white/10 text-vivid-textMuted hover:text-white disabled:opacity-30 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
