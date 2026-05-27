import { NextRequest, NextResponse } from "next/server";
import { errorResponse, getClientIp, withRateLimit } from "@/lib/api-utils";
import { rateLimit } from "@/lib/rate-limit";

const limiter = rateLimit({ interval: 60 * 1000 });

export async function GET(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    withRateLimit(limiter, ip, 10);

    return NextResponse.json(
      { message: "Launcher download coming soon" },
      { status: 200 }
    );
  } catch (error) {
    return errorResponse(error);
  }
}
