import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { errorResponse } from "@/lib/api-utils";

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
          payments: {
            select: { amount: true, currency: true, provider: true, status: true },
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
      }),
      prisma.license.count({ where }),
    ]);

    return NextResponse.json({ licenses, total, page, limit, pages: Math.ceil(total / limit) });
  } catch (error) {
    return errorResponse(error);
  }
}
