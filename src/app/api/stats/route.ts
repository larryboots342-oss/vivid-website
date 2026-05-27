import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { errorResponse } from "@/lib/api-utils";

export async function GET() {
  try {
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
    console.error("Stats API error:", error);
    // Return fallback zeros so the UI doesn't break
    return NextResponse.json({
      activeLicenses: 0,
      totalReviews: 0,
      averageRating: 0,
      supportStatus: "24/7",
    });
  }
}
