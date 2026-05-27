import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getGeoFromIP } from "@/lib/geo";
import { parseUserAgent } from "@/lib/ua-parser";
import { auth } from "@clerk/nextjs/server";
import { rateLimit } from "@/lib/rate-limit";
import { getClientIp, withRateLimit, errorResponse } from "@/lib/api-utils";
import { z } from "zod";

const schema = z.object({
  visitorId: z.string().min(1).max(128),
  path: z.string().max(500),
  referrer: z.string().max(1000).optional().nullable(),
  userAgent: z.string().max(1000).optional().nullable(),
});

const limiter = rateLimit({ interval: 60 * 1000 });

function getSourceFromReferrer(referrer: string | null): string {
  if (!referrer) return "Direct";
  const r = referrer.toLowerCase();
  if (r.includes("google")) return "Google";
  if (r.includes("bing")) return "Bing";
  if (r.includes("duckduckgo")) return "DuckDuckGo";
  if (r.includes("facebook") || r.includes("fb")) return "Facebook";
  if (r.includes("twitter") || r.includes("x.com")) return "Twitter / X";
  if (r.includes("discord")) return "Discord";
  if (r.includes("reddit")) return "Reddit";
  if (r.includes("youtube")) return "YouTube";
  if (r.includes("twitch")) return "Twitch";
  if (r.includes("instagram")) return "Instagram";
  if (r.includes("tiktok")) return "TikTok";
  return "Referral";
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    withRateLimit(limiter, ip, 60);

    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input", issues: parsed.error.issues }, { status: 400 });
    }

    const {
      visitorId,
      path,
      referrer,
      userAgent: rawUA,
    } = parsed.data;

    const geo = await getGeoFromIP(ip);
    const ua = parseUserAgent(rawUA || req.headers.get("user-agent"));

    const authData = await auth().catch(() => ({ userId: null }));
    let dbUserId: string | undefined;
    if (authData.userId) {
      const user = await prisma.user.findUnique({
        where: { clerkId: authData.userId },
        select: { id: true },
      });
      if (user) dbUserId = user.id;
    }

    const visitor = await prisma.visitor.upsert({
      where: { visitorId },
      update: {
        lastSeen: new Date(),
        visitCount: { increment: 1 },
        ...(dbUserId ? { userId: dbUserId } : {}),
        ...(geo?.country ? { country: geo.country } : {}),
        ...(geo?.city ? { city: geo.city } : {}),
        ...(geo?.region ? { region: geo.region } : {}),
        ip: ip === "unknown" ? undefined : ip,
        userAgent: rawUA ?? null,
        device: ua.device,
        browser: ua.browser,
        os: ua.os,
        referrer: referrer ?? null,
        source: getSourceFromReferrer(referrer ?? null),
      },
      create: {
        visitorId,
        ...(dbUserId ? { userId: dbUserId } : {}),
        country: geo?.country || undefined,
        city: geo?.city || undefined,
        region: geo?.region || undefined,
        ip: ip === "unknown" ? undefined : ip,
        userAgent: rawUA ?? null,
        device: ua.device,
        browser: ua.browser,
        os: ua.os,
        referrer: referrer ?? null,
        source: getSourceFromReferrer(referrer ?? null),
        visitCount: 1,
      },
    });

    await prisma.pageView.create({
      data: {
        visitorId: visitor.id,
        path,
        referrer: referrer ?? null,
        country: geo?.country || undefined,
        ip: ip === "unknown" ? undefined : ip,
        userAgent: rawUA ?? null,
        device: ua.device,
        browser: ua.browser,
        os: ua.os,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return errorResponse(error);
  }
}
