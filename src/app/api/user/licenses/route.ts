import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
  } catch (error: any) {
    console.error("User licenses API error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
