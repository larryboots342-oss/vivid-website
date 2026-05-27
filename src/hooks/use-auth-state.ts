"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { OWNER_EMAIL } from "@/lib/owner-email";

interface AuthState {
  isLoaded: boolean;
  isSignedIn: boolean;
  userId: string | null;
  user: ReturnType<typeof useUser>["user"];
  orgRole: string | null;
  isAdmin: boolean;
}

function checkIsOwner(user: ReturnType<typeof useUser>["user"]): boolean {
  if (!user) return false;
  const email = user.primaryEmailAddress?.emailAddress;
  return !!email && email.toLowerCase() === OWNER_EMAIL.toLowerCase();
}

/**
 * Enhanced auth state hook with owner detection.
 * Admin access is strictly restricted to the owner email.
 */
export function useAuthState(): AuthState {
  const { isLoaded, isSignedIn, userId, orgRole } = useAuth();
  const { user } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsAdmin(checkIsOwner(user));
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
 * Hook to check if the current user is the owner.
 */
export function useHasRole(role: "admin" | "user"): boolean {
  const { user } = useUser();
  if (!user) return false;

  const isOwner = checkIsOwner(user);

  if (role === "admin") {
    return isOwner;
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
