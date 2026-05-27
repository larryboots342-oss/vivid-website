import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getGeoFromIP } from "@/lib/geo";
import { parseUserAgent } from "@/lib/ua-parser";
import { auth } from "@clerk/nextjs/server";
import { rateLimit } from "@/lib/rate-limit";
import { getClientIp, withRateLimit, errorResponse } from "@/lib/api-utils";

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
    const {
      visitorId,
      path,
      referrer,
      userAgent: rawUA,
    } = body;

    if (!visitorId || !path) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

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
        userAgent: rawUA || undefined,
        device: ua.device,
        browser: ua.browser,
        os: ua.os,
        referrer: referrer || undefined,
        source: getSourceFromReferrer(referrer),
      },
      create: {
        visitorId,
        ...(dbUserId ? { userId: dbUserId } : {}),
        country: geo?.country || undefined,
        city: geo?.city || undefined,
        region: geo?.region || undefined,
        ip: ip === "unknown" ? undefined : ip,
        userAgent: rawUA || undefined,
        device: ua.device,
        browser: ua.browser,
        os: ua.os,
        referrer: referrer || undefined,
        source: getSourceFromReferrer(referrer),
        visitCount: 1,
      },
    });

    await prisma.pageView.create({
      data: {
        visitorId: visitor.id,
        path,
        referrer: referrer || undefined,
        country: geo?.country || undefined,
        ip: ip === "unknown" ? undefined : ip,
        userAgent: rawUA || undefined,
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
