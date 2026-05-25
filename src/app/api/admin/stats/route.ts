import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PLANS } from "@/lib/constants";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();

    // Get stats in parallel
    const [
      totalUsers,
      totalLicenses,
      activeLicenses,
      expiredLicenses,
      lifetimeLicenses,
      recentUsers,
      licenseByTier,
      recentActivities,
      totalVideos,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.license.count(),
      prisma.license.count({ where: { isActive: true } }),
      prisma.license.count({
        where: {
          isActive: true,
          isLifetime: false,
          expiresAt: { lt: new Date() },
        },
      }),
      prisma.license.count({ where: { isLifetime: true } }),
      prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          role: true,
          createdAt: true,
        },
      }),
      prisma.license.groupBy({
        by: ["tier"],
        _count: { tier: true },
        where: { isActive: true },
      }),
      prisma.activity.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
        include: {
          user: { select: { name: true, email: true } },
        },
      }),
      prisma.video.count(),
    ]);

    // Calculate total revenue from active licenses
    const tierPriceMap: Record<string, number> = {
      pro: PLANS.find((p) => p.id === "pro")?.price || 7,
      elite: PLANS.find((p) => p.id === "elite")?.price || 20,
      enterprise: PLANS.find((p) => p.id === "enterprise")?.price || 100,
    };

    const totalRevenue = licenseByTier.reduce((sum, tier) => {
      const price = tierPriceMap[tier.tier] || 0;
      return sum + tier._count.tier * price;
    }, 0);

    return NextResponse.json({
      users: {
        total: totalUsers,
        recent: recentUsers,
      },
      licenses: {
        total: totalLicenses,
        active: activeLicenses,
        expired: expiredLicenses,
        lifetime: lifetimeLicenses,
        byTier: licenseByTier.map((t) => ({
          tier: t.tier,
          count: t._count.tier,
        })),
      },
      revenue: {
        total: Math.round(totalRevenue * 100) / 100,
        byTier: licenseByTier.map((t) => ({
          tier: t.tier,
          count: t._count.tier,
          revenue: Math.round((t._count.tier * (tierPriceMap[t.tier] || 0)) * 100) / 100,
        })),
      },
      content: {
        totalVideos,
      },
      activities: recentActivities,
    });
  } catch (error: any) {
    console.error("Admin stats error:", error);
    const status = error.message === "Unauthorized" ? 401 : error.message === "Forbidden" ? 403 : 500;
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status }
    );
  }
}
