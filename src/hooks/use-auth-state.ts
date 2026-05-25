"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

interface AuthState {
  isLoaded: boolean;
  isSignedIn: boolean;
  userId: string | null;
  user: ReturnType<typeof useUser>["user"];
  orgRole: string | null;
  isAdmin: boolean;
}

/**
 * Enhanced auth state hook with role detection.
 * Use this in client components instead of raw useAuth for consistent state.
 */
export function useAuthState(): AuthState {
  const { isLoaded, isSignedIn, userId, orgRole } = useAuth();
  const { user } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!user) {
      setIsAdmin(false);
      return;
    }
    const role =
      (user.publicMetadata?.role as string) ||
      (user.unsafeMetadata?.role as string);
    setIsAdmin(role === "admin");
  }, [user]);

  return {
    isLoaded,
    isSignedIn: !!isSignedIn,
    userId: userId ?? null,
    user,
    orgRole: orgRole ?? null,
    isAdmin,
  };
}

/**
 * Hook to check if the current user has a specific role.
 */
export function useHasRole(role: "admin" | "user"): boolean {
  const { user } = useUser();
  if (!user) return false;

  const userRole =
    (user.publicMetadata?.role as string) ||
    (user.unsafeMetadata?.role as string) ||
    "user";

  if (role === "admin") {
    return userRole === "admin";
  }

  return true; // All authenticated users are at least "user"
}

/**
 * Hook to track session activity for analytics.
 */
export function useSessionActivity(): {
  sessionStart: Date | null;
  isActive: boolean;
} {
  const { isSignedIn } = useAuth();
  const [sessionStart, setSessionStart] = useState<Date | null>(null);

  useEffect(() => {
    if (isSignedIn && !sessionStart) {
      setSessionStart(new Date());
    }
    if (!isSignedIn) {
      setSessionStart(null);
    }
  }, [isSignedIn, sessionStart]);

  return {
    sessionStart,
    isActive: !!isSignedIn,
  };
}
