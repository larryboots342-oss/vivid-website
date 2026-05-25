import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { stripe, getTierFromPriceId } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { sendLicenseEmail } from "@/lib/email";
import { createUnifiedLicense } from "@/lib/unified-license";
import { getCountryFromIp } from "@/lib/geo";

export const dynamic = "force-dynamic";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

export async function POST(req: NextRequest) {
  try {
    if (!stripe) {
      return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
    }

    const payload = await req.text();
    const signature = (await headers()).get("stripe-signature") || "";

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    } catch (err: any) {
      console.error("Webhook signature verification failed:", err.message);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const tier = session.metadata?.tier || "pro";

        if (!userId || session.payment_status !== "paid") break;

        const user = await prisma.user.findUnique({
          where: { id: userId },
        });

        if (!user) {
          console.error("User not found for license creation:", userId);
          break;
        }

        // Geolocation
        const buyerIp = session.metadata?.buyerIp || undefined;
        const country = buyerIp ? await getCountryFromIp(buyerIp) : null;

        // Create unified license (Prisma + Supabase)
        const { licenseKey, expiresAt } = await createUnifiedLicense({
          userId,
          email: user.email,
          tier,
          paymentProvider: "stripe",
          paymentOrderId: session.id,
          paymentAmount: session.amount_total ? session.amount_total / 100 : undefined,
          paymentCurrency: session.currency?.toUpperCase() || "GBP",
          ipAddress: buyerIp,
          country: country || undefined,
        });

        // Send license email
        const emailResult = await sendLicenseEmail({
          to: user.email,
          licenseKey,
          tier,
          expiresAt,
        });

        if (!emailResult.success) {
          console.error("Failed to send license email:", emailResult.error);
        }

        // Create activity record
        await prisma.activity.create({
          data: {
            userId,
            type: "license_created",
            title: "License Purchased",
            description: `${tier} license purchased via Stripe. Key: ${licenseKey}`,
            metadata: { licenseKey, tier, provider: "stripe" },
          },
        });

        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const userId = paymentIntent.metadata?.userId;

        if (userId) {
          await prisma.activity.create({
            data: {
              userId,
              type: "payment_failed",
              title: "Payment Failed",
              description: "Your payment could not be processed. Please try again.",
            },
          });
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Stripe webhook error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
