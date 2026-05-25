import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { isLicenseValid, getDaysRemaining } from "@/lib/license";

export const dynamic = "force-dynamic";

/**
 * Returns the user's license status (not subscription status).
 * For one-time license purchases.
 */
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
          const tierRank: Record<string, number> = { pro: 1, elite: 2, enterprise: 3 };
          return (tierRank[current.tier] || 0) > (tierRank[highest.tier] || 0)
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
  } catch (error: any) {
    console.error("Status error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
