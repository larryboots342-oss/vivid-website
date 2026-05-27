import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, errorResponse, getClientIp, withRateLimit } from "@/lib/api-utils";
import { rateLimit } from "@/lib/rate-limit";

const limiter = rateLimit({ interval: 60 * 1000 });

export async function GET(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    withRateLimit(limiter, ip, 30);

    const videos = await prisma.video.findMany({
      where: { isPublic: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ videos });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await requireAdmin();

    const body = await req.json();
    const { title, game, duration, url, thumbnailUrl } = body;

    if (!title || !url) {
      return NextResponse.json(
        { error: "Title and URL are required" },
        { status: 400 }
      );
    }

    const video = await prisma.video.create({
      data: {
        title,
        game: game || "General",
        duration: duration || null,
        url,
        thumbnailUrl: thumbnailUrl || null,
        isPublic: true,
        uploadedBy: userId,
      },
    });

    return NextResponse.json({ success: true, video });
  } catch (error) {
    return errorResponse(error);
  }
}
