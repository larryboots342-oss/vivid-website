import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const OWNER_EMAIL = "coryholes1234@gmail.com";

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
  "/api/paypal/(.*)",
  "/api/license/(.*)",
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

  try {
    // ── Public routes ─────────────────────────────────────────────
    if (isPublicRoute(req)) {
      const authData = await auth().catch(() => ({ userId: null }));
      if (authData.userId && isAuthRoute(req)) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
      return NextResponse.next();
    }

    // ── API routes ────────────────────────────────────────────────
    if (pathname.startsWith("/api/")) {
      if (pathname.startsWith("/api/subscription")) {
        const authData = await auth().catch(() => ({ userId: null }));
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
    const authData = await auth().catch(() => ({ userId: null, sessionClaims: null }));
    const userId = authData.userId;
    const sessionClaims = authData.sessionClaims;

    if (!userId) {
      const signInUrl = new URL("/sign-in", req.url);
      signInUrl.searchParams.set("redirect_url", req.url);
      return NextResponse.redirect(signInUrl);
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
