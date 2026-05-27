import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { isLicenseValid } from "@/lib/license";
import { isOwner } from "@/lib/owner";
import { TIER_RANK } from "@/lib/tiers";
import DashboardContent from "./dashboard-content";
import UserDashboardContent from "@/components/dashboard/user-dashboard-content";

async function getDashboardData(clerkId: string) {
  const dbUser = await prisma.user.findUnique({
    where: { clerkId },
    include: {
      licenses: {
        orderBy: { createdAt: "desc" },
      },
      activities: {
        orderBy: { createdAt: "desc" },
        take: 5,
      },
    },
  });

  if (!dbUser) {
    return null;
  }

  const activeLicenses = dbUser.licenses.filter((l) =>
    l.isActive && isLicenseValid(l.expiresAt)
  );

  const highestTier = activeLicenses.length > 0
    ? activeLicenses.reduce((highest, current) => {
        return (TIER_RANK[current.tier] || 0) > (TIER_RANK[highest.tier] || 0)
          ? current
          : highest;
      })
    : null;

  return {
    firstName: dbUser.name?.split(" ")[0] || "User",
    memberSince: dbUser.createdAt.toISOString(),
    hasLicense: activeLicenses.length > 0,
    tier: highestTier?.tier || "free",
    licenses: dbUser.licenses.map((l) => ({
      id: l.id,
      key: l.key,
      tier: l.tier,
      isActive: l.isActive,
      isLifetime: l.isLifetime,
      expiresAt: l.expiresAt?.toISOString() || null,
    })),
    activities: dbUser.activities.map((a) => ({
      id: a.id,
      type: a.type,
      title: a.title,
      description: a.description,
      createdAt: a.createdAt.toISOString(),
    })),
  };
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const owner = await isOwner();
  const params = await searchParams;
  const justPurchased = params.success === "true";

  // Gracefully handle missing database — fall back to Clerk data
  let data = null;
  try {
    data = await getDashboardData(user.id);
  } catch (e) {
    // DB not configured yet — render with Clerk fallback data
    console.error("Dashboard DB query failed, using fallback:", e);
  }

  const dashboardData = data || {
    firstName: user.firstName || user.username || "User",
    memberSince: new Date().toISOString(),
    hasLicense: false,
    tier: "free",
    licenses: [],
    activities: [],
  };

  // Owner sees the full admin dashboard, regular users see the cool user dashboard
  if (owner) {
    return <DashboardContent data={dashboardData} justPurchased={justPurchased} />;
  }

  return <UserDashboardContent data={dashboardData} justPurchased={justPurchased} />;
}
