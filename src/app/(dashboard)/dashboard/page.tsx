"use client";

import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import DashboardContent from "./dashboard-content";
import UserDashboardContent from "@/components/dashboard/user-dashboard-content";

interface DashboardData {
  firstName: string;
  memberSince: string;
  hasLicense: boolean;
  tier: string;
  licenses: Array<{
    id: string;
    key: string;
    tier: string;
    isActive: boolean;
    isLifetime: boolean;
    expiresAt: string | null;
    activatedAt: string | null;
    createdAt: string;
  }>;
  activities: Array<{
    id: string;
    type: string;
    title: string;
    description: string | null;
    createdAt: string;
  }>;
  isOwner: boolean;
}

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const justPurchased = searchParams.get("success") === "true";

  const { data } = useSWR<DashboardData>("/api/dashboard");

  if (!data) {
    return (
      <div className="space-y-8 max-w-5xl mx-auto">
        <div className="h-32 rounded-2xl bg-white/5 animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-48 rounded-2xl bg-white/5 animate-pulse" />
            <div className="h-64 rounded-2xl bg-white/5 animate-pulse" />
          </div>
          <div className="space-y-6">
            <div className="h-40 rounded-2xl bg-white/5 animate-pulse" />
            <div className="h-32 rounded-2xl bg-white/5 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  const dashboardData = {
    firstName: data.firstName,
    memberSince: data.memberSince,
    hasLicense: data.hasLicense,
    tier: data.tier,
    licenses: data.licenses,
    activities: data.activities,
  };

  if (data.isOwner) {
    return <DashboardContent data={dashboardData} justPurchased={justPurchased} />;
  }

  return <UserDashboardContent data={dashboardData} justPurchased={justPurchased} />;
}
