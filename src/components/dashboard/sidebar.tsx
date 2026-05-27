"use client";

import { useAuth, useUser, UserButton } from "@clerk/nextjs";
import {
  LayoutDashboard,
  CreditCard,
  Receipt,
  Settings,
  BarChart3,
  Shield,
} from "lucide-react";
import SignOutButton from "@/components/auth/sign-out-button";
import { Sidebar } from "@/components/shared/sidebar";
import { isOwnerEmail } from "@/lib/owner";

const allSidebarLinks = [
  { href: "/dashboard", label: "Overview", icon: <LayoutDashboard className="w-5 h-5" />, ownerOnly: false },
  { href: "/dashboard/analytics", label: "Analytics", icon: <BarChart3 className="w-5 h-5" />, ownerOnly: true },
  { href: "/dashboard/subscription", label: "Licenses", icon: <CreditCard className="w-5 h-5" />, ownerOnly: false },
  { href: "/dashboard/billing", label: "Billing", icon: <Receipt className="w-5 h-5" />, ownerOnly: false },
  { href: "/dashboard/settings", label: "Settings", icon: <Settings className="w-5 h-5" />, ownerOnly: false },
  { href: "/admin", label: "Admin Panel", icon: <Shield className="w-5 h-5" />, ownerOnly: true },
];

function UserProfile() {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group">
        <UserButton
          appearance={{
            elements: {
              avatarBox: "w-9 h-9 ring-2 ring-vivid-primary/20 ring-offset-2 ring-offset-vivid-surface",
            },
          }}
          userProfileUrl="/dashboard/settings"
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">Account</p>
          <p className="text-xs text-vivid-textDim truncate">Manage profile</p>
        </div>
      </div>
      <SignOutButton variant="menu" />
    </div>
  );
}

function ProCard() {
  return (
    <div className="relative rounded-xl border border-vivid-primary/20 bg-gradient-to-br from-vivid-primary/10 to-vivid-primary/5 p-4 overflow-hidden">
      <div className="absolute top-0 right-0 w-20 h-20 bg-vivid-primary/10 rounded-full blur-2xl" />
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-semibold text-white">Get License</span>
        </div>
        <p className="text-xs text-vivid-textMuted mb-3">
          Unlock all features and priority support
        </p>
        <a
          href="/dashboard/subscription"
          className="inline-flex items-center gap-1 text-xs font-semibold text-vivid-primary hover:text-vivid-primaryDim transition-colors"
        >
          View Plans →
        </a>
      </div>
    </div>
  );
}

export default function DashboardSidebar() {
  const { user } = useUser();
  const owner = isOwnerEmail(user?.primaryEmailAddress?.emailAddress);
  const sidebarLinks = allSidebarLinks.filter((link) => !link.ownerOnly || owner);

  return (
    <Sidebar
      links={sidebarLinks}
      userSection={<UserProfile />}
      bottomAction={<ProCard />}
      logoHref="/"
    />
  );
}
