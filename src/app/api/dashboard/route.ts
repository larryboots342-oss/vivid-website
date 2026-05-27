import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, errorResponse } from "@/lib/api-utils";
import { isLicenseValid } from "@/lib/license";
import { TIER_RANK } from "@/lib/tiers";
import { isOwner } from "@/lib/owner";

export async function GET() {
  try {
    const userId = await requireAuth();

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        licenses: {
          orderBy: { createdAt: "desc" },
        },
        activities: {
          orderBy: { createdAt: "desc" },
          take: 5,
        },
      },
    });

    const owner = await isOwner(userId);

    if (!dbUser) {
      return NextResponse.json({
        firstName: "User",
        memberSince: new Date().toISOString(),
        hasLicense: false,
        tier: "free",
        licenses: [],
        activities: [],
        isOwner: owner,
      });
    }

    const activeLicenses = dbUser.licenses.filter((l) =>
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
      firstName: dbUser.name?.split(" ")[0] || "User",
      memberSince: dbUser.createdAt.toISOString(),
      hasLicense: activeLicenses.length > 0,
      tier: highestTier?.tier || "free",
      licenses: dbUser.licenses.map((l) => ({
        id: l.id,
        key: l.key,
        tier: l.tier,
        isActive: l.isActive,
        isLifetime: l.isLifetime,
        expiresAt: l.expiresAt?.toISOString() || null,
        activatedAt: l.activatedAt?.toISOString() || null,
        createdAt: l.createdAt.toISOString(),
      })),
      activities: dbUser.activities.map((a) => ({
        id: a.id,
        type: a.type,
        title: a.title,
        description: a.description,
        createdAt: a.createdAt.toISOString(),
      })),
      isOwner: owner,
    });
  } catch (error) {
    return errorResponse(error);
  }
}
