import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { OWNER_EMAIL } from "@/lib/owner-email";

function generateVisitorId() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const isPublicRoute = createRouteMatcher([
  "/",
  "/features",
  "/games",
  "/pricing",
  "/download",
  "/success",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/forgot-password",
  "/api/webhooks/(.*)",
  "/api/license/validate",
  "/api/license/verify",
  "/api/health",
  "/robots.txt",
  "/sitemap.xml",
]);

const isAuthRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/forgot-password",
]);

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl;

  // ── Visitor cookie (all page routes) ──────────────────────────
  const isPageRoute = !pathname.startsWith("/api/") && !pathname.startsWith("/_next/");
  let response: NextResponse;

  try {
    // ── Public routes ─────────────────────────────────────────────
    if (isPublicRoute(req)) {
      let authData: { userId: string | null };
      try {
        authData = await auth();
      } catch (err) {
        authData = { userId: null };
      }
      if (authData.userId && isAuthRoute(req)) {
        response = NextResponse.redirect(new URL("/dashboard", req.url));
      } else {
        response = NextResponse.next();
      }
      if (isPageRoute) {
        const existing = req.cookies.get("vivid_vid")?.value;
        if (!existing) {
          response.cookies.set("vivid_vid", generateVisitorId(), {
            httpOnly: false,
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 365, // 1 year
            path: "/",
          });
        }
      }
      return response;
    }

    // ── API routes ────────────────────────────────────────────────
    if (pathname.startsWith("/api/")) {
      if (pathname.startsWith("/api/subscription")) {
        let authData: { userId: string | null };
        try {
          authData = await auth();
        } catch (err) {
          console.error("Middleware auth error:", err);
          authData = { userId: null };
        }
        if (!authData.userId) {
          return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
          });
        }
      }
      return NextResponse.next();
    }

    // ── Everything else (checkout, dashboard, etc.) requires auth ─
    let authData: { userId: string | null; sessionClaims: unknown | null };
    try {
      authData = await auth();
    } catch (err) {
      console.error("Middleware auth error:", err);
      authData = { userId: null, sessionClaims: null };
    }
    const userId = authData.userId;

    if (!userId) {
      const signInUrl = new URL("/sign-in", req.url);
      signInUrl.searchParams.set("redirect_url", req.url);
      response = NextResponse.redirect(signInUrl);
    } else {
      response = NextResponse.next();
    }

    if (isPageRoute) {
      const existing = req.cookies.get("vivid_vid")?.value;
      if (!existing) {
        response.cookies.set("vivid_vid", generateVisitorId(), {
          httpOnly: false,
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 365,
          path: "/",
        });
      }
    }

    return response;
  } catch (error) {
    return new Response("Internal Server Error", { status: 500 });
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
