"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function getVisitorId(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|; )vivid_vid=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}

function getReferrer(): string | null {
  if (typeof document === "undefined") return null;
  const ref = document.referrer;
  if (!ref) return null;
  try {
    const refUrl = new URL(ref);
    if (refUrl.origin === window.location.origin) return null;
    return ref;
  } catch {
    return ref;
  }
}

async function trackPageView(path: string) {
  const visitorId = getVisitorId();
  if (!visitorId) return;

  if (path.startsWith("/admin") || path.startsWith("/api/")) return;

  try {
    await fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        visitorId,
        path,
        referrer: getReferrer(),
        userAgent: navigator.userAgent,
      }),
    });
  } catch {
    // Silently fail
  }
}

export default function VisitorTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const trackedPath = useRef<string | null>(null);

  useEffect(() => {
    const fullPath = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "");
    if (trackedPath.current === fullPath) return;
    trackedPath.current = fullPath;

    const timer = setTimeout(() => {
      trackPageView(fullPath);
    }, 100);

    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  return null;
}
