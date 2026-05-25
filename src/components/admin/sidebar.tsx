"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  BarChart3,
  HelpCircle,
  FileText,
  ToggleLeft,
  Menu,
  X,
  ChevronRight,
  Shield,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import SignOutButton from "@/components/auth/sign-out-button";

const adminLinks = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/subscriptions", label: "Purchases", icon: CreditCard },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/support", label: "Support", icon: HelpCircle },
  { href: "/admin/content", label: "Content", icon: FileText },
  { href: "/admin/features", label: "Features", icon: ToggleLeft },
];

export default function AdminSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-3 rounded-xl glass text-white hover:bg-white/10 transition-colors touch-target"
        aria-label={mobileOpen ? "Close sidebar" : "Open sidebar"}
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        className={cn(
          "fixed top-0 left-0 z-40 h-full w-72 bg-vivid-surface/90 backdrop-blur-2xl border-r border-vivid-border/50",
          "flex flex-col transition-transform duration-300 -translate-x-full lg:translate-x-0"
        )}
        animate={{ x: mobileOpen ? 0 : undefined }}
      >
        {/* Logo */}
        <div className="p-6 pb-4">
          <Link href="/admin" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-vivid-primary to-vivid-primaryDim flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                <Shield className="w-4 h-4 text-vivid-bg" />
              </div>
              <div className="absolute inset-0 rounded-xl bg-vivid-primary/30 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
            <div>
              <span className="text-lg font-bold text-white tracking-tight">
                VIVID
              </span>
              <span className="block text-xs text-vivid-textDim uppercase tracking-wider">
                Admin Panel
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-2 space-y-1">
          <p className="px-3 py-2 text-xs font-semibold text-vivid-textDim uppercase tracking-wider">
            Management
          </p>
          {adminLinks.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== "/admin" && pathname.startsWith(link.href + "/"));
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "relative flex items-center gap-3 px-3 py-3 sm:py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group touch-target",
                  isActive
                    ? "text-vivid-primary"
                    : "text-vivid-textMuted hover:text-white"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="adminSidebarActive"
                    className="absolute inset-0 rounded-xl bg-vivid-primary/10 border border-vivid-primary/20"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                {!isActive && (
                  <div className="absolute inset-0 rounded-xl bg-white/0 group-hover:bg-white/5 transition-colors duration-200" />
                )}
                <link.icon
                  className={cn(
                    "w-5 h-5 relative z-10 transition-colors",
                    isActive
                      ? "text-vivid-primary"
                      : "text-vivid-textDim group-hover:text-white"
                  )}
                />
                <span className="relative z-10">{link.label}</span>
                {isActive && (
                  <ChevronRight className="w-4 h-4 ml-auto relative z-10 text-vivid-primary/60" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Back to app */}
        <div className="px-3 pb-2">
          <div className="relative rounded-xl border border-vivid-primary/20 bg-gradient-to-br from-vivid-primary/10 to-vivid-primary/5 p-4 overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-vivid-primary/10 rounded-full blur-2xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-vivid-primary" />
                <span className="text-sm font-semibold text-white">
                  Main App
                </span>
              </div>
              <p className="text-xs text-vivid-textMuted mb-3">
                Return to the customer dashboard
              </p>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1 text-xs font-semibold text-vivid-primary hover:text-vivid-primaryDim transition-colors"
              >
                Dashboard
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* Sign out */}
        <div className="p-3 border-t border-vivid-border/50">
          <SignOutButton variant="menu" />
        </div>
      </motion.aside>
    </>
  );
}
