import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { errorResponse, getClientIp, withRateLimit } from "@/lib/api-utils";
import { rateLimit } from "@/lib/rate-limit";

const limiter = rateLimit({ interval: 60 * 1000 });

export async function GET(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    withRateLimit(limiter, ip, 30);

    const [licenseCount, reviewCount, avgRating] = await Promise.all([
      prisma.license.count({
        where: { isActive: true },
      }),
      prisma.review.count(),
      prisma.review.aggregate({
        _avg: { rating: true },
      }),
    ]);

    return NextResponse.json({
      activeLicenses: licenseCount,
      totalReviews: reviewCount,
      averageRating: avgRating._avg.rating ? Number(avgRating._avg.rating.toFixed(1)) : 0,
      supportStatus: "24/7",
    });
  } catch (error) {
    // Return fallback zeros so the UI doesn't break
    return NextResponse.json({
      activeLicenses: 0,
      totalReviews: 0,
      averageRating: 0,
      supportStatus: "24/7",
    });
  }
}
