"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { X, Menu } from "lucide-react";

interface SidebarLink {
  href: string;
  label: string;
  icon: React.ReactNode;
}

interface SidebarProps {
  links: SidebarLink[];
  bottomAction?: React.ReactNode;
  userSection?: React.ReactNode;
  logoHref?: string;
}

export function Sidebar({ links, bottomAction, userSection, logoHref = "/" }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 rounded-xl bg-vivid-surface/90 border border-vivid-border/50 text-white touch-target min-w-[44px] min-h-[44px] flex items-center justify-center"
        aria-label="Open sidebar"
      >
        <Menu className="w-5 h-5" />
      </button>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      <aside className={`fixed top-0 left-0 z-40 h-[100dvh] w-72 bg-vivid-surface/95 backdrop-blur-2xl border-r border-vivid-border/50 transition-transform duration-300 lg:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex flex-col h-full p-6 safe-top safe-bottom">
          {/* Logo */}
          <div className="flex items-center justify-between mb-8">
            <Link href={logoHref} className="flex items-center gap-3 min-h-[44px]">
              <div className="w-9 h-9 rounded-lg bg-vivid-primary/20 flex items-center justify-center">
                <span className="text-vivid-primary font-bold text-lg">V</span>
              </div>
              <span className="text-white font-bold text-lg">VIVID</span>
            </Link>
            <button 
              onClick={() => setMobileOpen(false)} 
              className="lg:hidden p-2 text-vivid-textMuted hover:text-white touch-target min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Links */}
          <nav className="flex-1 space-y-1">
            {links.map((link) => {
              const active = pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-colors relative min-h-[44px] ${active ? "text-white bg-white/5" : "text-vivid-textMuted hover:text-white hover:bg-white/5"}`}
                >
                  {active && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-vivid-primary rounded-r-full"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  {link.icon}
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          {userSection && <div className="mt-auto pt-6 border-t border-vivid-border/50">{userSection}</div>}

          {/* Bottom action */}
          {bottomAction && <div className="mt-4">{bottomAction}</div>}
        </div>
      </aside>
    </>
  );
}
