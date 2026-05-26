import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
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
      totalRevenue,
      revenueByTier,
      recentPayments,
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
      // REAL revenue: sum of all completed payment amounts
      prisma.payment
        .aggregate({
          where: { status: "completed" },
          _sum: { amount: true },
        })
        .then((r) => r._sum.amount || 0),
      // Revenue by tier from actual payments
      prisma.$queryRaw<
        Array<{ tier: string; count: bigint; revenue: number }>
      >`
        SELECT l.tier,
               COUNT(p.id) as count,
               COALESCE(SUM(p.amount), 0) as revenue
        FROM "Payment" p
        JOIN "License" l ON p."licenseId" = l.id
        WHERE p.status = 'completed'
        GROUP BY l.tier
        ORDER BY revenue DESC
      `,
      // Recent payments for activity feed
      prisma.payment.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        include: {
          user: { select: { name: true, email: true } },
          license: { select: { tier: true, key: true } },
        },
      }),
    ]);

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
        byTier: revenueByTier.map((t) => ({
          tier: t.tier,
          count: Number(t.count),
          revenue: Math.round(Number(t.revenue) * 100) / 100,
        })),
        recent: recentPayments.map((p) => ({
          id: p.id,
          amount: p.amount,
          currency: p.currency,
          provider: p.provider,
          tier: p.license?.tier,
          email: p.user?.email || p.payerEmail,
          name: p.user?.name,
          createdAt: p.createdAt,
        })),
      },
      content: {
        totalVideos,
      },
      activities: recentActivities,
    });
  } catch (error: any) {
    console.error("Admin stats error:", error);
    const status =
      error.message === "Unauthorized"
        ? 401
        : error.message === "Forbidden"
          ? 403
          : 500;
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status }
    );
  }
}
