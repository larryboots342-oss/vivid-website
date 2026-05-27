import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { currentUser } from "@clerk/nextjs/server";
import { z } from "zod";
import { createUnifiedLicense } from "@/lib/unified-license";
import { sendLicenseEmail } from "@/lib/email";
import { PLANS } from "@/lib/constants";
import { OWNER_EMAIL } from "@/lib/owner-email";
import { rateLimit } from "@/lib/rate-limit";

const createLicenseSchema = z.object({
  email: z.string().email(),
  tier: z.string().min(1),
  provider: z.enum(["stripe", "manual"]).optional(),
  providerOrderId: z.string().optional(),
  amount: z.number().optional(),
  currency: z.string().optional(),
});

export const dynamic = "force-dynamic";

const limiter = rateLimit({ interval: 60 * 1000 });

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const clerkUser = await currentUser();
    const clerkEmail = clerkUser?.primaryEmailAddress?.emailAddress;
    if (clerkEmail !== OWNER_EMAIL) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Owner is exempt from rate limiting
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";
    try {
      limiter.check(ip, 5);
    } catch {
      return NextResponse.json(
        { error: "Rate limit exceeded" },
        { status: 429 }
      );
    }

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
