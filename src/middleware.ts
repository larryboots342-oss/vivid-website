import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const OWNER_EMAIL = "coryholes1234@gmail.com";

/* ── Route matchers ─────────────────────────────────────────────── */
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

const isApiRoute = createRouteMatcher(["/api/(.*)"]);

const isDashboardRoute = createRouteMatcher(["/dashboard(.*)"]);

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

/* ── Middleware ─────────────────────────────────────────────────── */
export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();
  const url = req.nextUrl;
  const pathname = url.pathname;

  // ── 1. Always allow public routes ──────────────────────────────
  if (isPublicRoute(req)) {
    // If user is already signed in and tries to access auth pages,
    // redirect them to dashboard
    if (userId && isAuthRoute(req)) {
      return Response.redirect(new URL("/dashboard", req.url));
    }
    return;
  }

  // ── 2. API route protection ────────────────────────────────────
  if (isApiRoute(req)) {
    // Subscription APIs require auth
    if (pathname.startsWith("/api/subscription")) {
      if (!userId) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }
    }
    return;
  }

  // ── 3. Admin route protection ──────────────────────────────────
  if (isAdminRoute(req)) {
    if (!userId) {
      return Response.redirect(new URL("/sign-in", req.url));
    }
    // Check admin role from session claims, metadata, or owner email
    const role = (sessionClaims?.metadata as any)?.role;
    const email = (sessionClaims?.email as string) || "";
    const isAdminUser = role === "admin" || email === OWNER_EMAIL;
    if (!isAdminUser) {
      return Response.redirect(new URL("/dashboard", req.url));
    }
    return;
  }

  // ── 4. Dashboard & protected routes ────────────────────────────
  if (!userId) {
    // Redirect unauthenticated users to sign-in with return URL
    const signInUrl = new URL("/sign-in", req.url);
    signInUrl.searchParams.set("redirect_url", req.url);
    return Response.redirect(signInUrl);
  }

  // ── 5. User is authenticated — allow access ────────────────────
  return;
});

/* ── Config ─────────────────────────────────────────────────────── */
export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
