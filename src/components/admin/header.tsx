"use client";

import { Shield, Bell } from "lucide-react";
import { useAuthState } from "@/hooks/use-auth-state";

export default function AdminHeader() {
  const { user } = useAuthState();

  return (
    <header className="lg:sticky lg:top-0 z-30 flex items-center justify-between gap-4 px-6 lg:px-8 py-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-vivid-primary/10 border border-vivid-primary/20 flex items-center justify-center">
          <Shield className="w-4 h-4 text-vivid-primary" />
        </div>
        <div>
          <h1 className="text-sm font-semibold text-white">Admin Panel</h1>
          <p className="text-xs text-vivid-textDim uppercase tracking-wider">
            {user?.primaryEmailAddress?.emailAddress ?? "Admin"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          className="relative p-2.5 rounded-xl text-vivid-textMuted hover:text-white hover:bg-white/5 transition-all duration-200"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-vivid-primary rounded-full" />
        </button>
      </div>
    </header>
  );
}
