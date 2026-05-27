import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { errorResponse } from "@/lib/api-utils";
import { z } from "zod";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const role = searchParams.get("role") || undefined;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const where: any = {};
    if (search) {
      where.OR = [
        { email: { contains: search, mode: "insensitive" } },
        { name: { contains: search, mode: "insensitive" } },
      ];
    }
    if (role) where.role = role;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        select: {
          id: true,
          clerkId: true,
          email: true,
          name: true,
          image: true,
          role: true,
          emailVerified: true,
          createdAt: true,
          updatedAt: true,
          licenses: {
            select: {
              id: true,
              key: true,
              tier: true,
              isActive: true,
              isLifetime: true,
              expiresAt: true,
            },
          },
          _count: { select: { activities: true } },
        },
      }),
      prisma.user.count({ where }),
    ]);

    return NextResponse.json({ users, total, page, limit, pages: Math.ceil(total / limit) });
  } catch (error) {
    return errorResponse(error);
  }
}

const patchSchema = z.object({
  clerkId: z.string().min(1),
  role: z.enum(["user", "admin"]).optional(),
  name: z.string().min(1).max(100).optional(),
});

export async function PATCH(req: NextRequest) {
  try {
    await requireAdmin();

    const body = await req.json();
    const parsed = patchSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request body", details: parsed.error.format() }, { status: 400 });
    }
    const { clerkId, role, name } = parsed.data;

    const updateData: any = {};
    if (role !== undefined) updateData.role = role;
    if (name !== undefined) updateData.name = name;

    const updated = await prisma.user.update({
      where: { clerkId },
      data: updateData,
      select: { id: true, clerkId: true, email: true, name: true, role: true },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await requireAdmin();

    const body = await req.json();
    const parsed = z.object({ clerkId: z.string().min(1) }).safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request body", details: parsed.error.format() }, { status: 400 });
    }
    const { clerkId } = parsed.data;

    await prisma.user.delete({ where: { clerkId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return errorResponse(error);
  }
}
