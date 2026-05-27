import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, errorResponse, getClientIp, withRateLimit } from "@/lib/api-utils";
import { rateLimit } from "@/lib/rate-limit";
import { z } from "zod";

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
    const schema = z.object({
      title: z.string().min(1).max(200),
      url: z.string().url().max(500),
      thumbnailUrl: z.string().url().max(500).optional(),
      description: z.string().max(2000).optional(),
    });
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request body", details: parsed.error.format() }, { status: 400 });
    }
    const { title, url, thumbnailUrl } = parsed.data;
    const game = body.game;
    const duration = body.duration;

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
