import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * For one-time license purchases, there is no recurring subscription to cancel.
 * This endpoint now deactivates the user's most recent active license instead.
 */
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: { licenses: { orderBy: { createdAt: "desc" }, take: 1 } },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const latestLicense = user.licenses[0];

    if (!latestLicense) {
      return NextResponse.json(
        { error: "No active license found" },
        { status: 404 }
      );
    }

    // Deactivate the license
    await prisma.license.update({
      where: { id: latestLicense.id },
      data: { isActive: false },
    });

    await prisma.activity.create({
      data: {
        userId: user.id,
        type: "license_deactivated",
        title: "License Deactivated",
        description: `License ${latestLicense.key} was deactivated by user.`,
      },
    });

    return NextResponse.json({
      success: true,
      message: "License deactivated. Your access has been revoked.",
      deactivatedLicense: latestLicense.key,
    });
  } catch (error: any) {
    console.error("Cancel error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
