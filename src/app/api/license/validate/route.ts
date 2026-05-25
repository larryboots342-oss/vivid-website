import { NextRequest, NextResponse } from "next/server";
import { isLicenseValid, getDaysRemaining } from "@/lib/license";
import { findUnifiedLicense } from "@/lib/unified-license";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { key, hwid } = body;

    if (!key) {
      return NextResponse.json({ valid: false, error: "License key required" }, { status: 400 });
    }

    // Check both Prisma and Supabase
    const result = await findUnifiedLicense(key);

    if (!result) {
      return NextResponse.json({ valid: false, error: "Invalid license key" }, { status: 404 });
    }

    const license = result.license;

    if (!license.isActive) {
      return NextResponse.json({ valid: false, error: "License has been deactivated" }, { status: 403 });
    }

    if (!isLicenseValid(license.expiresAt)) {
      return NextResponse.json({ valid: false, error: "License has expired" }, { status: 403 });
    }

    // HWID binding check (if HWID is set, it must match)
    if (license.hwid && hwid && license.hwid !== hwid) {
      return NextResponse.json(
        { valid: false, error: "License is bound to a different device" },
        { status: 403 }
      );
    }

    // Note: We don't auto-bind HWID here for Supabase fallback results
    // because we don't have a Prisma record to update.
    // The desktop app handles HWID binding via its own Supabase logic.

    const daysRemaining = getDaysRemaining(license.expiresAt);

    return NextResponse.json({
      valid: true,
      tier: license.tier,
      isLifetime: license.isLifetime,
      daysRemaining,
      expiresAt: license.expiresAt?.toISOString() || null,
    });
  } catch (error: any) {
    console.error("License validation error:", error);
    return NextResponse.json(
      { valid: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
