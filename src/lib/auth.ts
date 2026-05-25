import { auth as clerkAuth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

/* ------------------------------------------------------------------ */
/*  Server-side auth helpers                                          */
/* ------------------------------------------------------------------ */

export type AuthUser = {
  id: string;
  clerkId: string;
  email: string;
  name: string | null;
  image: string | null;
  role: string;
};

/**
 * Get the current authenticated user with database sync.
 * Redirects to sign-in if not authenticated.
 */
export async function getCurrentUser(): Promise<AuthUser> {
  const { userId: clerkId } = await clerkAuth();

  if (!clerkId) {
    redirect("/sign-in");
  }

  const user = await prisma.user.findUnique({
    where: { clerkId },
    select: {
      id: true,
      clerkId: true,
      email: true,
      name: true,
      image: true,
      role: true,
    },
  });

  if (!user) {
    // User exists in Clerk but not in DB yet — webhook may be pending
    const clerkUser = await currentUser();
    if (!clerkUser) redirect("/sign-in");

    const email = clerkUser.emailAddresses[0]?.emailAddress;
    if (!email) redirect("/sign-in");

    const newUser = await prisma.user.create({
      data: {
        clerkId,
        email,
        name: `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim() || null,
        image: clerkUser.imageUrl,
      },
    });

    return {
      id: newUser.id,
      clerkId: newUser.clerkId,
      email: newUser.email,
      name: newUser.name,
      image: newUser.image,
      role: newUser.role ?? "user",
    };
  }

  return {
    ...user,
    role: user.role ?? "user",
  };
}

/**
 * Get the current user without redirecting.
 * Returns null if not authenticated.
 */
export async function getCurrentUserOrNull(): Promise<AuthUser | null> {
  try {
    return await getCurrentUser();
  } catch {
    return null;
  }
}

/**
 * Check if user is authenticated (boolean).
 */
export async function isAuthenticated(): Promise<boolean> {
  const { userId } = await clerkAuth();
  return !!userId;
}

/**
 * Require a specific role. Redirects if not met.
 */
export async function requireRole(
  role: "admin" | "user"
): Promise<AuthUser> {
  const user = await getCurrentUser();
  if (user.role !== role && user.role !== "admin") {
    redirect("/dashboard");
  }
  return user;
}

/**
 * Get auth session info for API routes.
 */
export async function getAuthSession(): Promise<{
  userId: string | null;
  sessionId: string | null;
  orgId: string | null | undefined;
}> {
  const { userId, sessionId, orgId } = await clerkAuth();
  return { userId, sessionId, orgId };
}

/* ------------------------------------------------------------------ */
/*  Client-side auth helpers (for use in "use client" components)     */
/* ------------------------------------------------------------------ */

export const PUBLIC_ROUTES = [
  "/",
  "/features",
  "/games",
  "/pricing",
  "/download",
  "/success",
  "/sign-in",
  "/sign-up",
  "/forgot-password",
];

export const AUTH_ROUTES = ["/sign-in", "/sign-up", "/forgot-password"];

export const PROTECTED_ROUTES = ["/dashboard", "/dashboard/(.*)"];

export const ADMIN_ROUTES = ["/admin", "/admin/(.*)"];
