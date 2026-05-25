import { currentUser } from "@clerk/nextjs/server";
import { OWNER_EMAIL } from "./owner-email";

export { OWNER_EMAIL };

export async function isOwner(): Promise<boolean> {
  const user = await currentUser();
  if (!user) return false;
  const email = user.emailAddresses[0]?.emailAddress;
  return email === OWNER_EMAIL;
}

export function getOwnerEmail(): string {
  return OWNER_EMAIL;
}
