import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { errorResponse } from "@/lib/api-utils";

function getDateRange(filter: string) {
  const now = new Date();
  const start = new Date(now);
  switch (filter) {
    case "today":
      start.setHours(0, 0, 0, 0);
      break;
    case "week":
      start.setDate(now.getDate() - 7);
      break;
    case "month":
      start.setMonth(now.getMonth() - 1);
      break;
    default:
      start.setHours(0, 0, 0, 0);
  }
  return { start, end: now };
}

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(req.url);
    const filter = searchParams.get("filter") || "today";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "25");
    const { start } = getDateRange(filter);

    const [
      totalVisitors,
      totalPageViews,
      uniqueInRange,
      pageViewsInRange,
      activeNow,
    ] = await Promise.all([
      prisma.visitor.count(),
      prisma.pageView.count(),
      prisma.visitor.count({ where: { lastSeen: { gte: start } } }),
      prisma.pageView.count({ where: { createdAt: { gte: start } } }),
      prisma.visitor.count({
        where: { lastSeen: { gte: new Date(Date.now() - 5 * 60 * 1000) } },
      }),
    ]);

    const isToday = filter === "today";
    const timeSeriesRaw = await prisma.$queryRaw<
      Array<{ bucket: Date; count: bigint }>
    >`
      SELECT DATE_TRUNC(${isToday ? "hour" : "day"}, "createdAt") as bucket,
             COUNT(*) as count
      FROM "PageView"
      WHERE "createdAt" >= ${start}
      GROUP BY bucket
      ORDER BY bucket ASC
    `;

    const timeSeries = timeSeriesRaw.map((row) => ({
      label: isToday
        ? new Date(row.bucket).toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
          })
        : new Date(row.bucket).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
          }),
      views: Number(row.count),
    }));

    const topPages = await prisma.pageView.groupBy({
      by: ["path"],
      where: { createdAt: { gte: start } },
      _count: { path: true },
      orderBy: { _count: { path: "desc" } },
      take: 10,
    });

    const topCountries = await prisma.pageView.groupBy({
      by: ["country"],
      where: { createdAt: { gte: start }, country: { not: null } },
      _count: { country: true },
      orderBy: { _count: { country: "desc" } },
      take: 10,
    });

    const topSources = await prisma.visitor.groupBy({
      by: ["source"],
      where: { lastSeen: { gte: start }, source: { not: null } },
      _count: { source: true },
      orderBy: { _count: { source: "desc" } },
      take: 10,
    });

    const [deviceBreakdown, browserBreakdown] = await Promise.all([
      prisma.visitor.groupBy({
        by: ["device"],
        where: { lastSeen: { gte: start }, device: { not: null } },
        _count: { device: true },
      }),
      prisma.visitor.groupBy({
        by: ["browser"],
        where: { lastSeen: { gte: start }, browser: { not: null } },
        _count: { browser: true },
      }),
    ]);

    const skip = (page - 1) * limit;
    const [visitors, visitorTotal] = await Promise.all([
      prisma.visitor.findMany({
        orderBy: { lastSeen: "desc" },
        skip,
        take: limit,
        include: {
          user: { select: { id: true, email: true, name: true } },
          _count: { select: { pageViews: true } },
        },
      }),
      prisma.visitor.count(),
    ]);

    return NextResponse.json({
      summary: {
        totalVisitors,
        totalPageViews,
        uniqueInRange,
        pageViewsInRange,
        activeNow,
      },
      timeSeries,
      topPages: topPages.map((p) => ({ path: p.path, views: p._count.path })),
      topCountries: topCountries.map((c) => ({
        country: c.country,
        visitors: c._count.country,
      })),
      topSources: topSources.map((s) => ({
        source: s.source,
        visitors: s._count.source,
      })),
      deviceBreakdown: deviceBreakdown.map((d) => ({
        device: d.device,
        count: d._count.device,
      })),
      browserBreakdown: browserBreakdown.map((b) => ({
        browser: b.browser,
        count: b._count.browser,
      })),
      visitors: visitors.map((v) => ({
        id: v.id,
        visitorId: v.visitorId,
        firstSeen: v.firstSeen,
        lastSeen: v.lastSeen,
        visitCount: v.visitCount,
        country: v.country,
        city: v.city,
        region: v.region,
        ip: v.ip,
        device: v.device,
        browser: v.browser,
        os: v.os,
        source: v.source,
        referrer: v.referrer,
        user: v.user,
        pageViews: v._count.pageViews,
      })),
      pagination: {
        page,
        limit,
        total: visitorTotal,
        pages: Math.ceil(visitorTotal / limit),
      },
    });
  } catch (error) {
    return errorResponse(error);
  }
}
