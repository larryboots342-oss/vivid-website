"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell } from "lucide-react";

interface HeaderProps {
  title?: string;
  subtitle?: string;
  titleIcon?: React.ReactNode;
  badge?: React.ReactNode;
  showNotifications?: boolean;
  notificationDot?: boolean;
}

export function Header({
  title,
  subtitle,
  titleIcon,
  badge,
  showNotifications = false,
  notificationDot = false,
}: HeaderProps) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const justifyClass = title ? "justify-between" : "justify-end";

  return (
    <header className={`lg:sticky lg:top-0 z-30 flex items-center ${justifyClass} gap-4 px-6 lg:px-8 py-4`}>
      {title && (
        <div className="flex items-center gap-3">
          {titleIcon && (
            <div className="w-8 h-8 rounded-lg bg-vivid-primary/10 border border-vivid-primary/20 flex items-center justify-center">
              {titleIcon}
            </div>
          )}
          <div>
            <h1 className="text-sm font-semibold text-white">{title}</h1>
            {subtitle && (
              <p className="text-xs text-vivid-textDim uppercase tracking-wider">{subtitle}</p>
            )}
          </div>
        </div>
      )}

      <div className="flex items-center gap-3">
        {badge}

        {showNotifications && (
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2.5 rounded-xl text-vivid-textMuted hover:text-white hover:bg-white/5 transition-all duration-200"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {notificationDot && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-vivid-primary rounded-full" />
              )}
            </button>

            <AnimatePresence>
              {notificationsOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setNotificationsOpen(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute right-0 top-full mt-3 w-80 z-50 rounded-2xl border border-vivid-border/60 bg-vivid-surface/95 backdrop-blur-xl shadow-2xl shadow-black/40 overflow-hidden"
                  >
                    <div className="flex items-center justify-between px-5 py-4 border-b border-vivid-border/40">
                      <h3 className="text-sm font-semibold text-white">Notifications</h3>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      <div className="py-8 text-center">
                        <Bell className="w-8 h-8 text-vivid-textDim mx-auto mb-2" />
                        <p className="text-vivid-textMuted text-sm">No notifications yet</p>
                        <p className="text-vivid-textDim text-xs mt-1">
                          You&apos;ll see updates here when they arrive
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </header>
  );
}
