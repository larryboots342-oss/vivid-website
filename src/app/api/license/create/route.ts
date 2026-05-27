import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createUnifiedLicense } from "@/lib/unified-license";
import { sendLicenseEmail } from "@/lib/email";
import { PLANS } from "@/lib/constants";
import { rateLimit } from "@/lib/rate-limit";
import { requireOwner, getClientIp, withRateLimit, errorResponse } from "@/lib/api-utils";

const createLicenseSchema = z.object({
  email: z.string().email(),
  tier: z.string().min(1),
  provider: z.enum(["stripe", "manual"]).optional(),
  providerOrderId: z.string().optional(),
  amount: z.number().optional(),
  currency: z.string().optional(),
});

const limiter = rateLimit({ interval: 60 * 1000 });

export async function POST(req: NextRequest) {
  try {
    await requireOwner();

    const ip = getClientIp(req);
    withRateLimit(limiter, ip, 5);

    const body = await req.json();
    const parsed = createLicenseSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request body", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { email, tier, provider, providerOrderId, amount, currency } = parsed.data;

    const plan = PLANS.find((p) => p.id === tier.toLowerCase());
    if (!plan) {
      return NextResponse.json({ error: "Invalid tier" }, { status: 400 });
    }

    const { licenseKey, expiresAt } = await createUnifiedLicense({
      email,
      tier,
      paymentProvider: provider || "manual",
      paymentOrderId: providerOrderId || undefined,
      paymentAmount: amount,
      paymentCurrency: currency,
    });

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
  } catch (error) {
    return errorResponse(error);
  }
}
