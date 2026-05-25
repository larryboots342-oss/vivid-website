import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

/**
 * For one-time license purchases, there is no Stripe Billing Portal.
 * This endpoint redirects users to their license management page.
 */
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({
      url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing`,
      message: "One-time licenses are managed from your billing dashboard.",
    });
  } catch (error: any) {
    console.error("Portal error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
