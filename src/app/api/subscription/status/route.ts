import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isLicenseValid, getDaysRemaining } from "@/lib/license";
import { TIER_RANK } from "@/lib/tiers";
import { requireAuth, errorResponse } from "@/lib/api-utils";

/**
 * Returns the user's license status (not subscription status).
 * For one-time license purchases.
 */
export async function GET(req: NextRequest) {
  try {
    const userId = await requireAuth();

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        licenses: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!user) {
      return NextResponse.json({
        hasLicense: false,
        tier: null,
        licenses: [],
      });
    }

    const activeLicenses = user.licenses.filter((l) =>
      l.isActive && isLicenseValid(l.expiresAt)
    );

    const highestTier = activeLicenses.length > 0
      ? activeLicenses.reduce((highest, current) => {
          return (TIER_RANK[current.tier] || 0) > (TIER_RANK[highest.tier] || 0)
            ? current
            : highest;
        })
      : null;

    return NextResponse.json({
      hasLicense: activeLicenses.length > 0,
      tier: highestTier?.tier || null,
      licenses: activeLicenses.map((l) => ({
        id: l.id,
        key: l.key,
        tier: l.tier,
        isActive: l.isActive,
        isLifetime: l.isLifetime,
        daysRemaining: getDaysRemaining(l.expiresAt),
        expiresAt: l.expiresAt?.toISOString() || null,
        createdAt: l.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    return errorResponse(error);
  }
}
