import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { supabase } from "@/lib/supabase";
import { isLicenseValid } from "@/lib/license";
import { rateLimit } from "@/lib/rate-limit";

const validateLicenseSchema = z.object({
  key: z.string().min(1),
});

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const limiter = rateLimit({ interval: 60 * 1000 });

function normalizeKey(key: string): string {
  return key.trim().toUpperCase().replace(/\s+/g, "-");
}

export async function POST(req: NextRequest) {
  try {
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";
    try {
      limiter.check(ip, 30);
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

    const body = await req.json();
    const parsed = validateLicenseSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "License key required", details: parsed.error.format() },
        { status: 400 }
      );
    }
    const rawKey = parsed.data.key;

    const key = normalizeKey(rawKey);
    if (!key.startsWith("VIVID-")) {
      return NextResponse.json({ error: "Invalid key format" }, { status: 400 });
    }

    // Get current user from Prisma
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });
    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 1. Check if already owned by this user in Prisma
    const existingPrisma = await prisma.license.findUnique({
      where: { key },
    });

    if (existingPrisma) {
      if (existingPrisma.userId && existingPrisma.userId !== dbUser.id) {
        return NextResponse.json(
          { error: "License key is already bound to another account" },
          { status: 403 }
        );
      }

      const valid = isLicenseValid(existingPrisma.expiresAt);
      if (!valid) {
        return NextResponse.json(
          { error: "License has expired" },
          { status: 400 }
        );
      }

      // Bind to current user if not already bound
      if (!existingPrisma.userId) {
        await prisma.license.update({
          where: { key },
          data: { userId: dbUser.id, activatedAt: new Date() },
        });
      }

      return NextResponse.json({
        success: true,
        license: {
          key: existingPrisma.key,
          tier: existingPrisma.tier,
          isActive: true,
          isLifetime: existingPrisma.isLifetime,
          expiresAt: existingPrisma.expiresAt?.toISOString() || null,
          activatedAt: existingPrisma.activatedAt?.toISOString() || null,
          daysRemaining: existingPrisma.isLifetime
            ? null
            : existingPrisma.expiresAt
            ? Math.max(0, Math.ceil((existingPrisma.expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
            : null,
        },
      });
    }

    // 2. Fallback: check Supabase (desktop-created licenses)
    if (supabase) {
      const { data: sbLicense, error } = await supabase
        .from("license_keys")
        .select("*")
        .eq("license_key", key)
        .single();

      if (error || !sbLicense) {
        return NextResponse.json(
          { error: "License key not found" },
          { status: 404 }
        );
      }

      if (sbLicense.status !== "active") {
        return NextResponse.json(
          { error: "License is not active" },
          { status: 400 }
        );
      }

      const expiresAt = sbLicense.expires_at ? new Date(sbLicense.expires_at) : null;
      const valid = isLicenseValid(expiresAt);
      if (!valid) {
        return NextResponse.json(
          { error: "License has expired" },
          { status: 400 }
        );
      }

      // Create Prisma record for this license (sync into website DB)
      const prismaLicense = await prisma.license.create({
        data: {
          userId: dbUser.id,
          key: sbLicense.license_key,
          tier: sbLicense.tier || "pro",
          email: dbUser.email,
          isActive: true,
          isLifetime: !sbLicense.expires_at,
          expiresAt: expiresAt,
          activatedAt: new Date(),
          hwid: sbLicense.hwid || null,
          ipAddress: null,
          country: null,
        },
      });

      return NextResponse.json({
        success: true,
        license: {
          key: prismaLicense.key,
          tier: prismaLicense.tier,
          isActive: true,
          isLifetime: prismaLicense.isLifetime,
          expiresAt: prismaLicense.expiresAt?.toISOString() || null,
          activatedAt: prismaLicense.activatedAt?.toISOString() || null,
          daysRemaining: prismaLicense.isLifetime
            ? null
            : prismaLicense.expiresAt
            ? Math.max(0, Math.ceil((prismaLicense.expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
            : null,
        },
      });
    }

    return NextResponse.json(
      { error: "License key not found" },
      { status: 404 }
    );
  } catch (error: any) {
    console.error("License validation error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
