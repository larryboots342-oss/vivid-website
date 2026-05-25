import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

/* Mock ticket system using Activity model with type="support" */

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || undefined;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const where: any = { type: "support" };
    if (status) {
      where.metadata = { path: ["status"], equals: status };
    }

    const [tickets, total] = await Promise.all([
      prisma.activity.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          user: { select: { id: true, email: true, name: true } },
        },
      }),
      prisma.activity.count({ where }),
    ]);

    return NextResponse.json({ tickets, total, page, limit, pages: Math.ceil(total / limit) });
  } catch (error: any) {
    console.error("Admin tickets error:", error);
    const status = error.message === "Unauthorized" ? 401 : error.message === "Forbidden" ? 403 : 500;
    return NextResponse.json({ error: error.message }, { status });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await requireAdmin();

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true },
    });

    const body = await req.json();
    const { title, description, priority = "medium" } = body;

    const ticket = await prisma.activity.create({
      data: {
        userId: dbUser?.id || userId,
        type: "support",
        title,
        description,
        metadata: { status: "open", priority, adminCreated: true },
      },
    });

    return NextResponse.json(ticket);
  } catch (error: any) {
    console.error("Admin ticket create error:", error);
    const status = error.message === "Unauthorized" ? 401 : error.message === "Forbidden" ? 403 : 500;
    return NextResponse.json({ error: error.message }, { status });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await requireAdmin();

    const body = await req.json();
    const { ticketId, status, priority } = body;

    const existing = await prisma.activity.findUnique({
      where: { id: ticketId },
    });

    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const metadata = (existing.metadata as any) || {};
    if (status !== undefined) metadata.status = status;
    if (priority !== undefined) metadata.priority = priority;

    const updated = await prisma.activity.update({
      where: { id: ticketId },
      data: { metadata },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("Admin ticket patch error:", error);
    const status = error.message === "Unauthorized" ? 401 : error.message === "Forbidden" ? 403 : 500;
    return NextResponse.json({ error: error.message }, { status });
  }
}
