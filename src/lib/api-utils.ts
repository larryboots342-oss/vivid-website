import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

// ── Auth guard ──
export async function requireAuth() {
  const { userId } = await auth();
  if (!userId) {
    throw new ApiError("Unauthorized", 401);
  }
  return userId;
}

// ── Owner guard ──
export async function requireOwner() {
  const { userId } = await auth();
  if (!userId) {
    throw new ApiError("Unauthorized", 401);
  }
  const { isOwner } = await import("./owner");
  const owner = await isOwner(userId);
  if (!owner) {
    throw new ApiError("Forbidden", 403);
  }
  return userId;
}

// ── Rate limit helper ──
export function withRateLimit(limiter: any, token: string, limit: number) {
  try {
    limiter.check(token, limit);
  } catch {
    throw new ApiError("Rate limit exceeded", 429);
  }
}

// ── IP extraction ──
export function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  return forwarded ? forwarded.split(",")[0].trim() : "unknown";
}

// ── Standard error response ──
export class ApiError extends Error {
  constructor(message: string, public status: number = 500) {
    super(message);
  }
}

export function errorResponse(error: unknown) {
  if (error instanceof ApiError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }
  console.error("API Error:", error);
  return NextResponse.json({ error: "Internal server error" }, { status: 500 });
}

export function successResponse(data: any, status: number = 200) {
  return NextResponse.json(data, { status });
}
