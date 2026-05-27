import { NextRequest, NextResponse } from "next/server";
import { requireAuth, errorResponse } from "@/lib/api-utils";

/**
 * For one-time license purchases, there is no Stripe Billing Portal.
 * This endpoint redirects users to their license management page.
 */
export async function POST(req: NextRequest) {
  try {
    await requireAuth();

    return NextResponse.json({
      url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing`,
      message: "One-time licenses are managed from your billing dashboard.",
    });
  } catch (error) {
    return errorResponse(error);
  }
}
