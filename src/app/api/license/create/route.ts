import { NextRequest, NextResponse } from "next/server";
import { createUnifiedLicense } from "@/lib/unified-license";
import { sendLicenseEmail } from "@/lib/email";
import { PLANS } from "@/lib/constants";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { email, tier, provider, providerOrderId, amount, currency } =
      await req.json();

    if (!email || !tier) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const plan = PLANS.find((p) => p.id === tier.toLowerCase());
    if (!plan) {
      return NextResponse.json({ error: "Invalid tier" }, { status: 400 });
    }

    // Create unified license (Prisma + Supabase)
    const { licenseKey, expiresAt } = await createUnifiedLicense({
      email,
      tier,
      paymentProvider: provider || "manual",
      paymentOrderId: providerOrderId || undefined,
      paymentAmount: amount,
      paymentCurrency: currency,
    });

    // Send email if Resend is configured
    const emailResult = await sendLicenseEmail({
      to: email,
      licenseKey,
      tier,
      expiresAt,
    });

    return NextResponse.json({
      success: true,
      licenseKey,
      emailed: emailResult.success,
      message: "License created successfully",
    });
  } catch (error: any) {
    console.error("License create error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
