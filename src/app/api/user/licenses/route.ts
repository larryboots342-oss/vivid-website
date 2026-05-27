import { NextRequest, NextResponse } from "next/server";
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
      activatedAt: l.activatedAt?.toISOString() || null,
      createdAt: l.createdAt.toISOString(),
    }));

    return NextResponse.json({ licenses });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const userId = await requireAuth();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing license id" }, { status: 400 });
    }

    const license = await prisma.license.findFirst({
      where: { id, user: { clerkId: userId } },
    });
    if (!license) {
      return NextResponse.json({ error: "License not found" }, { status: 404 });
    }

    await prisma.license.update({
      where: { id },
      data: { isActive: false },
    });

    return NextResponse.json({ success: true, message: "License revoked" });
  } catch (error) {
    return errorResponse(error);
  }
}
