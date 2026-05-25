import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { sendLicenseEmail } from "@/lib/email";
import { createUnifiedLicense } from "@/lib/unified-license";
import { PLANS, CURRENCY } from "@/lib/constants";
import { getCountryFromIp } from "@/lib/geo";

export const dynamic = "force-dynamic";

const PAYPAL_API = process.env.PAYPAL_API_URL || "https://api-m.sandbox.paypal.com";

async function getAccessToken(): Promise<string> {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error("PayPal credentials not configured");
  }
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const res = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error_description || "PayPal auth failed");
  }
  return data.access_token;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.redirect(`${req.nextUrl.origin}/pricing?error=missing_token`);
    }

    const accessToken = await getAccessToken();

    // Capture the payment
    const captureRes = await fetch(
      `${PAYPAL_API}/v2/checkout/orders/${token}/capture`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const captureData = await captureRes.json();
    if (!captureRes.ok) {
      console.error("PayPal capture failed:", captureData);
      return NextResponse.redirect(
        `${req.nextUrl.origin}/pricing?error=payment_failed`
      );
    }

    const purchaseUnit = captureData.purchase_units?.[0];
    const payment = purchaseUnit?.payments?.captures?.[0];
    const customId = JSON.parse(purchaseUnit?.custom_id || "{}");
    const { tier, email } = customId;

    if (!tier || !email) {
      return NextResponse.redirect(
        `${req.nextUrl.origin}/pricing?error=invalid_order`
      );
    }

    // Capture buyer IP + geolocation for admin tracking
    const forwarded = req.headers.get("x-forwarded-for");
    const buyerIp = forwarded ? forwarded.split(",")[0].trim() : "";
    const country = buyerIp ? await getCountryFromIp(buyerIp) : null;

    // Create unified license (Prisma + Supabase)
    const { licenseKey, expiresAt } = await createUnifiedLicense({
      email,
      tier,
      paymentProvider: "paypal",
      paymentOrderId: captureData.id,
      paymentAmount: payment?.amount?.value,
      paymentCurrency: payment?.amount?.currency_code || CURRENCY,
      ipAddress: buyerIp || undefined,
      country: country || undefined,
    });

    // Send license email
    const emailResult = await sendLicenseEmail({
      to: email,
      licenseKey,
      tier,
      expiresAt,
    });

    if (!emailResult.success) {
      console.error("Failed to send license email:", emailResult.error);
    }

    // Insert payment record to Supabase for tracking
    if (supabase) {
      const now = new Date().toISOString();
      await supabase.from("payments").insert({
        provider: "paypal",
        provider_order_id: captureData.id,
        amount: parseFloat(payment?.amount?.value || "0"),
        currency: payment?.amount?.currency_code || CURRENCY,
        status: "completed",
        payer_email: email,
        created_at: now,
        completed_at: now,
      });
    }

    // Redirect to success page
    return NextResponse.redirect(
      `${req.nextUrl.origin}/success?key=${encodeURIComponent(licenseKey)}`
    );
  } catch (error: any) {
    console.error("PayPal capture error:", error);
    return NextResponse.redirect(
      `${req.nextUrl.origin}/pricing?error=server_error`
    );
  }
}
