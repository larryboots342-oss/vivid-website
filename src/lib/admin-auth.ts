import { auth } from "@clerk/nextjs/server";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { OWNER_EMAIL } from "@/lib/owner-email";

export async function requireAdmin(): Promise<{ userId: string; isOwner: boolean }> {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const clerkUser = await currentUser();
  const email = clerkUser?.primaryEmailAddress?.emailAddress;

  if (email === OWNER_EMAIL) {
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
