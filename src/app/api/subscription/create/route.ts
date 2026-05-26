import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { stripe, getPriceId } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    if (!stripe) {
      return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
    }

    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { tier } = body;

    if (!tier || !["pro", "elite", "enterprise"].includes(tier)) {
      return NextResponse.json({ error: "Invalid tier" }, { status: 400 });
    }

    let user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    // Auto-create user from Clerk if not in database (webhook may have missed them)
    if (!user) {
      const clerk = await clerkClient();
      const clerkUser = await clerk.users.getUser(userId);
      const primaryEmail = clerkUser.emailAddresses.find(
        (e) => e.id === clerkUser.primaryEmailAddressId
      );
      const email = primaryEmail?.emailAddress;
      if (!email) {
        return NextResponse.json({ error: "User email not found" }, { status: 400 });
      }
      user = await prisma.user.create({
        data: {
          clerkId: userId,
          email,
          name: [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") || null,
          image: clerkUser.imageUrl,
          role: (clerkUser.publicMetadata?.role as string) || "user",
        },
      });
    }

    const priceId = getPriceId(tier);
    if (!priceId) {
      return NextResponse.json({ error: "Price not configured" }, { status: 500 });
    }

    // Create or reuse Stripe customer
    let customerId: string;
    const existingCustomer = await stripe.customers.list({
      email: user.email,
      limit: 1,
    });

    if (existingCustomer.data.length > 0) {
      customerId = existingCustomer.data[0].id;
    } else {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name || undefined,
        metadata: { userId: user.id, clerkId: userId },
      });
      customerId = customer.id;
    }

    // Capture buyer IP for admin tracking
    const forwarded = req.headers.get("x-forwarded-for");
    const buyerIp = forwarded ? forwarded.split(",")[0].trim() : "";

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
      metadata: {
        userId: user.id,
        clerkId: userId,
        tier,
        buyerIp: buyerIp || "",
      },
      allow_promotion_codes: true,
      billing_address_collection: "auto",
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
