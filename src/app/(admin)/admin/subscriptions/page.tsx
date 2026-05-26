"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Key,
  ChevronLeft,
  ChevronRight,
  Crown,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Infinity,
  Globe,
  Wifi,
  Calendar,
  Mail,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface License {
  id: string;
  key: string;
  tier: string;
  isActive: boolean;
  isLifetime: boolean;
  expiresAt: string | null;
  email: string;
  createdAt: string;
  ipAddress: string | null;
  country: string | null;
  user: { id: string; email: string; name: string | null; clerkId: string } | null;
  payments: Array<{ amount: number; currency: string; provider: string; status: string }>;
}

const statusColors: Record<string, string> = {
  active: "bg-green-500/10 text-green-400 border-green-500/20",
  inactive: "bg-vivid-accent/10 text-vivid-accent border-vivid-accent/20",
  expired: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
};

const tierColors: Record<string, string> = {
  pro: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
  elite: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  enterprise: "text-green-400 bg-green-500/10 border-green-500/20",
};

function formatDate(date: string | null) {
  if (!date) return "—";
  return new Date(date).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminLicensesPage() {
  const [licenses, setLicenses] = useState<License[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [tierFilter, setTierFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchLicenses = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (statusFilter) params.set("status", statusFilter);
    if (tierFilter) params.set("tier", tierFilter);
    params.set("page", String(page));
    const res = await fetch(`/api/admin/subscriptions?${params}`);
    const data = await res.json();
    setLicenses(data.licenses || []);
    setTotalPages(data.pages || 1);
    setLoading(false);
  };

  useEffect(() => {
    fetchLicenses();
  }, [page, statusFilter, tierFilter]);

  const getLicenseStatus = (license: License) => {
    if (!license.isActive) return "inactive";
    if (license.isLifetime) return "active";
    if (license.expiresAt && new Date(license.expiresAt) < new Date()) return "expired";
    return "active";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Purchase History</h1>
          <p className="text-vivid-textMuted">All license purchases with buyer details</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="h-10 px-3 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm outline-none focus:border-vivid-primary/50"
          >
            <option value="">All statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <select
            value={tierFilter}
            onChange={(e) => { setTierFilter(e.target.value); setPage(1); }}
            className="h-10 px-3 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm outline-none focus:border-vivid-primary/50"
          >
            <option value="">All tiers</option>
            <option value="pro">Pro</option>
            <option value="elite">Elite</option>
            <option value="enterprise">Enterprise</option>
          </select>
        </div>
      </div>

      <div className="rounded-2xl border border-vivid-border/50 bg-vivid-surface/40 backdrop-blur-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-vivid-border/40">
                <th className="px-4 py-4 text-xs font-semibold text-vivid-textDim uppercase tracking-wider">Customer</th>
                <th className="px-4 py-4 text-xs font-semibold text-vivid-textDim uppercase tracking-wider">License</th>
                <th className="px-4 py-4 text-xs font-semibold text-vivid-textDim uppercase tracking-wider">Tier</th>
                <th className="px-4 py-4 text-xs font-semibold text-vivid-textDim uppercase tracking-wider">Status</th>
                <th className="px-4 py-4 text-xs font-semibold text-vivid-textDim uppercase tracking-wider">Paid</th>
                <th className="px-4 py-4 text-xs font-semibold text-vivid-textDim uppercase tracking-wider">Purchased</th>
                <th className="px-4 py-4 text-xs font-semibold text-vivid-textDim uppercase tracking-wider">IP / Country</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-vivid-border/30">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-4 py-4"><div className="h-10 rounded-lg bg-white/5 animate-pulse w-40" /></td>
                    <td className="px-4 py-4"><div className="h-8 rounded-lg bg-white/5 animate-pulse w-32" /></td>
                    <td className="px-4 py-4"><div className="h-8 rounded-lg bg-white/5 animate-pulse w-20" /></td>
                    <td className="px-4 py-4"><div className="h-8 rounded-lg bg-white/5 animate-pulse w-24" /></td>
                    <td className="px-4 py-4"><div className="h-8 rounded-lg bg-white/5 animate-pulse w-28" /></td>
                    <td className="px-4 py-4"><div className="h-8 rounded-lg bg-white/5 animate-pulse w-32" /></td>
                  </tr>
                ))
              ) : (
                licenses.map((license, i) => {
                  const status = getLicenseStatus(license);
                  const tierStyle = tierColors[license.tier] || "bg-white/5 text-vivid-textDim border-white/10";
                  return (
                    <motion.tr
                      key={license.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="hover:bg-white/[0.02] transition-colors"
                    >
                      {/* Customer */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-vivid-primary/10 flex items-center justify-center shrink-0">
                            <Mail className="w-4 h-4 text-vivid-primary" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-white truncate">
                              {license.user?.name || "—"}
                            </p>
                            <p className="text-xs text-vivid-textMuted truncate">
                              {license.user?.email || license.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* License Key */}
                      <td className="px-4 py-4">
                        <code className="text-xs font-mono text-vivid-primary">{license.key}</code>
                      </td>

                      {/* Tier */}
                      <td className="px-4 py-4">
                        <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold capitalize border", tierStyle)}>
                          <Crown className="w-3 h-3" />
                          {license.tier}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4">
                        <span className={cn(
                          "inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border",
                          statusColors[status] || "bg-white/5 text-vivid-textDim border-white/10"
                        )}>
                          {status === "active" && <CheckCircle2 className="w-3 h-3" />}
                          {status === "inactive" && <AlertTriangle className="w-3 h-3" />}
                          {status === "expired" && <Clock className="w-3 h-3" />}
                          {status}
                        </span>
                      </td>

                      {/* Paid */}
                      <td className="px-4 py-4">
                        {license.payments && license.payments.length > 0 ? (
                          <div className="flex flex-col gap-0.5">
                            <span className="text-sm font-medium text-green-400">
                              £{license.payments[0].amount.toFixed(2)}
                            </span>
                            <span className="text-[10px] text-vivid-textDim uppercase">
                              {license.payments[0].provider}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-vivid-textDim">—</span>
                        )}
                      </td>

                      {/* Purchased */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5 text-xs text-vivid-textMuted">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(license.createdAt)}
                        </div>
                        {license.isLifetime ? (
                          <span className="text-xs text-green-400 flex items-center gap-1 mt-0.5">
                            <Infinity className="w-3 h-3" /> Lifetime
                          </span>
                        ) : license.expiresAt ? (
                          <span className="text-xs text-vivid-textDim flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3" />
                            Exp: {new Date(license.expiresAt).toLocaleDateString("en-GB")}
                          </span>
                        ) : null}
                      </td>

                      {/* IP / Country */}
                      <td className="px-4 py-4">
                        {license.ipAddress ? (
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-xs text-vivid-textMuted">
                              <Wifi className="w-3.5 h-3.5" />
                              <span className="font-mono">{license.ipAddress}</span>
                            </div>
                            {license.country && (
                              <div className="flex items-center gap-1.5 text-xs text-vivid-textDim">
                                <Globe className="w-3.5 h-3.5" />
                                {license.country}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-vivid-textDim">—</span>
                        )}
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-vivid-border/40">
          <p className="text-xs text-vivid-textDim">Page {page} of {totalPages}</p>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} className="p-2 rounded-lg bg-white/[0.04] border border-white/10 text-vivid-textMuted hover:text-white disabled:opacity-30 transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="p-2 rounded-lg bg-white/[0.04] border border-white/10 text-vivid-textMuted hover:text-white disabled:opacity-30 transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
