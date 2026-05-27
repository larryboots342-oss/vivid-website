import { auth } from "@clerk/nextjs/server";
import { isOwner } from "@/lib/owner";

export async function requireAdmin(): Promise<{ userId: string; isOwner: true }> {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const owner = await isOwner(userId);
  if (!owner) throw new Error("Forbidden");

  return { userId, isOwner: true };
}
