import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { errorResponse } from "@/lib/api-utils";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();

    const flags = await prisma.activity.findMany({
      where: { type: "feature_flag" },
      orderBy: { createdAt: "desc" },
    });

    const parsed = flags.map((f) => ({
      id: f.id,
      key: f.title,
      description: f.description,
      enabled: (f.metadata as any)?.enabled ?? false,
      rollout: (f.metadata as any)?.rollout ?? 0,
      createdAt: f.createdAt,
    }));

    return NextResponse.json({ features: parsed });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await requireAdmin();

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true },
    });

    if (!dbUser?.id) {
      return NextResponse.json({ error: "Admin user not found" }, { status: 404 });
    }

    const body = await req.json();
    const { key, description, enabled = false, rollout = 0 } = body;

    const flag = await prisma.activity.create({
      data: {
        userId: dbUser?.id,
        type: "feature_flag",
        title: key,
        description,
        metadata: { enabled, rollout },
      },
    });

    return NextResponse.json(flag);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await requireAdmin();

    const body = await req.json();
    const { featureId, enabled, rollout } = body;

    const existing = await prisma.activity.findUnique({
      where: { id: featureId },
    });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const metadata = (existing.metadata as any) || {};
    if (enabled !== undefined) metadata.enabled = enabled;
    if (rollout !== undefined) metadata.rollout = rollout;

    const updated = await prisma.activity.update({
      where: { id: featureId },
      data: { metadata },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return errorResponse(error);
  }
}
