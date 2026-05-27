import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { errorResponse } from "@/lib/api-utils";
import { z } from "zod";

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
    const parsed = postSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request body", details: parsed.error.format() }, { status: 400 });
    }
    const { title, description, priority = "medium" } = parsed.data;

    const ticket = await prisma.activity.create({
      data: {
        userId: dbUser?.id,
        type: "support",
        title,
        description,
        metadata: { status: "open", priority, adminCreated: true },
      },
    });

    return NextResponse.json(ticket);
  } catch (error) {
    return errorResponse(error);
  }
}

const postSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  priority: z.enum(["low", "medium", "high", "critical"]).optional(),
});

const patchSchema = z.object({
  ticketId: z.string().min(1),
  status: z.enum(["open", "in_progress", "resolved", "closed"]).optional(),
  priority: z.enum(["low", "medium", "high", "critical"]).optional(),
});

export async function PATCH(req: NextRequest) {
  try {
    await requireAdmin();

    const body = await req.json();
    const parsed = patchSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request body", details: parsed.error.format() }, { status: 400 });
    }
    const { ticketId, status, priority } = parsed.data;

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
  } catch (error) {
    return errorResponse(error);
  }
}
