import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";

const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  content: z.string().trim().min(5).max(500),
  game: z.string().optional(),
});

export const dynamic = "force-dynamic";

const limiter = rateLimit({ interval: 60 * 1000 });

// GET /api/reviews - Fetch all approved reviews with optional limit
export async function GET(req: NextRequest) {
  try {
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";
    try {
      limiter.check(ip, 10);
    } catch {
      return NextResponse.json(
        { error: "Rate limit exceeded" },
        { status: 429 }
      );
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);

    const [reviews, total, avgRating] = await Promise.all([
      prisma.review.findMany({
        take: limit,
        skip: offset,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              name: true,
              image: true,
            },
          },
        },
      }),
      prisma.review.count(),
      prisma.review.aggregate({
        _avg: { rating: true },
      }),
    ]);

    return NextResponse.json({
      reviews: reviews.map((r) => ({
        id: r.id,
        name: r.user.name?.split(" ")[0] || "User",
        avatar: r.user.name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "U",
        rating: r.rating,
        content: r.content,
        tier: r.tier,
        game: r.game,
        createdAt: r.createdAt.toISOString(),
      })),
      total,
      averageRating: avgRating._avg.rating ? Number(avgRating._avg.rating.toFixed(1)) : 0,
    });
  } catch (error: any) {
    console.error("Reviews GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

// POST /api/reviews - Submit a new review (requires auth + active license)
export async function POST(req: NextRequest) {
  try {
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";
    try {
      limiter.check(ip, 10);
    } catch {
      return NextResponse.json(
        { error: "Rate limit exceeded" },
        { status: 429 }
      );
    }

    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        licenses: {
          where: { isActive: true },
          take: 1,
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Must have at least one active license to review
    if (user.licenses.length === 0) {
      return NextResponse.json(
        { error: "Active license required to leave a review" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const parsed = reviewSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid review data", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { rating, content, game } = parsed.data;

    // Check if user already reviewed
    const existing = await prisma.review.findFirst({
      where: { userId: user.id },
    });

    if (existing) {
      // Update existing review
      const updated = await prisma.review.update({
        where: { id: existing.id },
        data: {
          rating,
          content: content.trim(),
          game: game || null,
          tier: user.licenses[0]?.tier || "pro",
        },
      });
      return NextResponse.json({ success: true, review: updated });
    }

    const review = await prisma.review.create({
      data: {
        userId: user.id,
        rating,
        content: content.trim(),
        tier: user.licenses[0]?.tier || "pro",
        game: game || null,
      },
    });

    return NextResponse.json({ success: true, review });
  } catch (error: any) {
    console.error("Reviews POST error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to submit review" },
      { status: 500 }
    );
  }
}
