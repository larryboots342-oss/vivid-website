import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { supabase } from "@/lib/supabase";
import { isLicenseValid } from "@/lib/license";
import { rateLimit } from "@/lib/rate-limit";
import { requireAuth, getClientIp, withRateLimit, errorResponse } from "@/lib/api-utils";

const validateLicenseSchema = z.object({
  key: z.string().min(1),
});

const limiter = rateLimit({ interval: 60 * 1000 });

function normalizeKey(key: string): string {
  return key.trim().toUpperCase().replace(/\s+/g, "-");
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    withRateLimit(limiter, ip, 30);

    const userId = await requireAuth();

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

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });
    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

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
  } catch (error) {
    return errorResponse(error);
  }
}
