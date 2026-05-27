import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, errorResponse } from "@/lib/api-utils";

export async function GET() {
  try {
    const userId = await requireAuth();

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        licenses: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!dbUser) {
      return NextResponse.json({ licenses: [] });
    }

    const licenses = dbUser.licenses.map((l) => ({
      id: l.id,
      key: l.key,
      tier: l.tier,
      isActive: l.isActive,
      isLifetime: l.isLifetime,
      expiresAt: l.expiresAt?.toISOString() || null,
    }));

    return NextResponse.json({ licenses });
  } catch (error) {
    return errorResponse(error);
  }
}
