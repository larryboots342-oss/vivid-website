import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { isOwner } from "@/lib/owner";

export async function requireAdmin(): Promise<{ userId: string; isOwner: boolean }> {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const owner = await isOwner(userId);
  if (owner) {
    return { userId, isOwner: true };
  }

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { role: true },
  });

  if (dbUser?.role !== "admin") {
    throw new Error("Forbidden");
  }

  return { userId, isOwner: false };
}
