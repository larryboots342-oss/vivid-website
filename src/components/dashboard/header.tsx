"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import { Bell, Shield } from "lucide-react";
import { OWNER_EMAIL } from "@/lib/owner-email";

export default function DashboardHeader() {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const { user } = useUser();

  const isOwner = user?.primaryEmailAddress?.emailAddress === OWNER_EMAIL;

  return (
    <header className="lg:sticky lg:top-0 z-30 flex items-center justify-end gap-4 px-6 lg:px-8 py-4">
      {/* Owner Badge */}
      {isOwner && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-vivid-primary/10 border border-vivid-primary/20 text-xs font-medium text-vivid-primary"
        >
          <Shield className="w-3.5 h-3.5" />
          Owner
        </motion.div>
      )}

      {/* Notifications */}
      <div className="relative">
        <button
          onClick={() => setNotificationsOpen(!notificationsOpen)}
          className="relative p-2.5 rounded-xl text-vivid-textMuted hover:text-white hover:bg-white/5 transition-all duration-200"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
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
    </header>
  );
}
