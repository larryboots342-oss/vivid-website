import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || undefined;
    const tier = searchParams.get("tier") || undefined;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status === "active") where.isActive = true;
    if (status === "inactive") where.isActive = false;
    if (tier) where.tier = tier;

    const [licenses, total] = await Promise.all([
      prisma.license.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          user: { select: { id: true, email: true, name: true, clerkId: true } },
        },
      }),
      prisma.license.count({ where }),
    ]);

    return NextResponse.json({ licenses, total, page, limit, pages: Math.ceil(total / limit) });
  } catch (error: any) {
    console.error("Admin licenses error:", error);
    const status = error.message === "Unauthorized" ? 401 : error.message === "Forbidden" ? 403 : 500;
    return NextResponse.json({ error: error.message }, { status });
  }
}
