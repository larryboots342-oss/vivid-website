"use client";

import { useState } from "react";
import useSWR from "swr";
import { motion } from "framer-motion";
import {
  Search,
  Shield,
  User,
  Mail,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Crown,
  CheckCircle2,
  Key,
  Infinity,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { isLicenseValid } from "@/lib/license";
import { TIER_RANK } from "@/lib/tiers";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { toast } from "sonner";

interface AdminUser {
  id: string;
  clerkId: string;
  email: string;
  name: string | null;
  image: string | null;
  role: string;
  emailVerified: string | null;
  createdAt: string;
  licenses: Array<{
    id: string;
    key: string;
    tier: string;
    isActive: boolean;
    isLifetime: boolean;
    expiresAt: string | null;
  }>;
  _count: { activities: number };
}

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [page, setPage] = useState(1);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; userId: string; userName: string }>({
    open: false,
    userId: "",
    userName: "",
  });
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteDialog.userId) return;
    setDeleting(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clerkId: deleteDialog.userId }),
      });
      if (res.ok) {
        toast.success("User deleted");
        mutate();
      } else {
        toast.error("Failed to delete user");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setDeleting(false);
      setDeleteDialog({ open: false, userId: "", userName: "" });
    }
  };

  const queryKey = `/api/admin/users?${new URLSearchParams({
    ...(search && { search }),
    ...(roleFilter && { role: roleFilter }),
    page: String(page),
  }).toString()}`;

  const { data, isLoading, mutate } = useSWR<{ users: AdminUser[]; total: number; pages: number }>(queryKey);

  const users = data?.users || [];
  const totalPages = data?.pages || 1;

  const updateRole = async (clerkId: string, newRole: string) => {
    // Optimistic update
    const previousUsers = users;
    mutate(
      {
        users: users.map((u) => (u.clerkId === clerkId ? { ...u, role: newRole } : u)),
        total: data?.total || 0,
        pages: totalPages,
      },
      false
    );

    try {
      await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clerkId, role: newRole }),
      });
      mutate();
    } catch {
      // Rollback on error
      mutate(
        {
          users: previousUsers,
          total: data?.total || 0,
          pages: totalPages,
        },
        false
      );
    }
  };

  const getHighestTier = (licenses: AdminUser["licenses"]) => {
    const active = licenses.filter((l) => l.isActive && isLicenseValid(l.expiresAt ? new Date(l.expiresAt) : null));
    if (active.length === 0) return null;
    return active.reduce((highest, current) =>
      (TIER_RANK[current.tier] || 0) > (TIER_RANK[highest.tier] || 0) ? current : highest
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Users</h1>
          <p className="text-vivid-textMuted">Manage accounts, roles, and permissions</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-vivid-textDim" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search users..."
              className="h-10 pl-9 pr-4 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder:text-vivid-textDim focus:border-vivid-primary/50 outline-none text-sm w-64"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
            className="h-10 px-3 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm outline-none focus:border-vivid-primary/50"
          >
            <option value="">All roles</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      <div className="rounded-2xl border border-vivid-border/50 bg-vivid-surface/40 backdrop-blur-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-vivid-border/40">
                <th className="px-6 py-4 text-xs font-semibold text-vivid-textDim uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-xs font-semibold text-vivid-textDim uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-xs font-semibold text-vivid-textDim uppercase tracking-wider">License</th>
                <th className="px-6 py-4 text-xs font-semibold text-vivid-textDim uppercase tracking-wider">Joined</th>
                <th className="px-6 py-4 text-xs font-semibold text-vivid-textDim uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-vivid-border/30">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4"><div className="h-10 rounded-lg bg-white/5 animate-pulse w-48" /></td>
                    <td className="px-6 py-4"><div className="h-8 rounded-lg bg-white/5 animate-pulse w-20" /></td>
                    <td className="px-6 py-4"><div className="h-8 rounded-lg bg-white/5 animate-pulse w-24" /></td>
                    <td className="px-6 py-4"><div className="h-8 rounded-lg bg-white/5 animate-pulse w-24" /></td>
                    <td className="px-6 py-4"><div className="h-8 rounded-lg bg-white/5 animate-pulse w-16" /></td>
                  </tr>
                ))
              ) : (
                users.map((u, i) => {
                  const highestTier = getHighestTier(u.licenses);
                  return (
                    <motion.tr
                      key={u.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-vivid-primary to-blue-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
                            {u.name?.[0] || u.email[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{u.name || "—"}</p>
                            <p className="text-xs text-vivid-textMuted">{u.email}</p>
                          </div>
                          {u.emailVerified && (
                            <span title="Email verified">
                              <CheckCircle2 className="w-3.5 h-3.5 text-green-400 shrink-0" />
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold",
                          u.role === "admin"
                            ? "bg-vivid-primary/15 text-vivid-primary border border-vivid-primary/20"
                            : "bg-white/5 text-vivid-textMuted border border-white/10"
                        )}>
                          {u.role === "admin" ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {highestTier ? (
                          <span className={cn(
                            "inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium capitalize",
                            highestTier.isLifetime
                              ? "bg-green-500/10 text-green-400"
                              : "bg-vivid-primary/10 text-vivid-primary"
                          )}>
                            {highestTier.isLifetime ? <Infinity className="w-3 h-3" /> : <Key className="w-3 h-3" />}
                            {highestTier.tier}
                          </span>
                        ) : (
                          <span className="text-xs text-vivid-textDim">Free</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-vivid-textMuted">
                          {new Date(u.createdAt).toLocaleDateString("en-GB")}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <select
                            value={u.role}
                            onChange={(e) => updateRole(u.clerkId, e.target.value)}
                            className="h-10 px-2 rounded-lg bg-white/[0.04] border border-white/10 text-white text-sm outline-none focus:border-vivid-primary/50"
                          >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                          </select>
                          <button
                            onClick={() => setDeleteDialog({ open: true, userId: u.clerkId, userName: u.name || u.email })}
                            className="h-10 w-10 rounded-lg bg-white/[0.04] border border-white/10 text-vivid-accent hover:bg-vivid-accent/10 flex items-center justify-center transition-colors touch-target"
                            title="Delete user"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-vivid-border/40">
          <p className="text-xs text-vivid-textDim">
            Page {page} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="p-2 rounded-lg bg-white/[0.04] border border-white/10 text-vivid-textMuted hover:text-white disabled:opacity-30 transition-colors touch-target"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="p-2 rounded-lg bg-white/[0.04] border border-white/10 text-vivid-textMuted hover:text-white disabled:opacity-30 transition-colors touch-target"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      <ConfirmDialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, userId: "", userName: "" })}
        onConfirm={handleDelete}
        title="Delete User?"
        description={`Are you sure you want to delete ${deleteDialog.userName}? This action cannot be undone.`}
        confirmText="Delete"
        isLoading={deleting}
      />
      </div>
    </div>
  );
}
