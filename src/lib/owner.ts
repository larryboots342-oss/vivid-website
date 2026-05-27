import { prisma } from "./prisma";
import { OWNER_EMAIL } from "./owner-email";

export { OWNER_EMAIL };

export async function isOwner(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { email: true },
  });
  return user?.email === OWNER_EMAIL;
}

export function isOwnerEmail(email?: string | null): boolean {
  return email === OWNER_EMAIL;
}

export function getOwnerEmail(): string {
  return OWNER_EMAIL;
}
