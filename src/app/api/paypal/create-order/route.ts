import { NextRequest, NextResponse } from "next/server";
import { PLANS, CURRENCY, CURRENCY_SYMBOL } from "@/lib/constants";

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
    throw new Error(data.error_description || "Failed to get PayPal access token");
  }
  return data.access_token;
}

export async function POST(req: NextRequest) {
  try {
    const { tier, email } = await req.json();

    if (!tier || !email) {
      return NextResponse.json(
        { error: "Missing tier or email" },
        { status: 400 }
      );
    }

    const plan = PLANS.find((p) => p.id === tier.toLowerCase());
    if (!plan) {
      return NextResponse.json({ error: "Invalid tier" }, { status: 400 });
    }

    const accessToken = await getAccessToken();
    const unitAmount = plan.price.toFixed(2);

    const orderRes = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "PayPal-Request-Id": `vivid-${Date.now()}-${email}`,
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: CURRENCY,
              value: unitAmount,
            },
            description: `VIVID ${plan.name} License — ${plan.durationLabel}`,
            custom_id: JSON.stringify({ tier, email }),
          },
        ],
        application_context: {
          brand_name: "VIVID",
          landing_page: "BILLING",
          user_action: "PAY_NOW",
          return_url: `${req.nextUrl.origin}/api/paypal/capture-order`,
          cancel_url: `${req.nextUrl.origin}/pricing`,
        },
      }),
    });

    const orderData = await orderRes.json();
    if (!orderRes.ok) {
      console.error("PayPal order creation failed:", orderData);
      return NextResponse.json(
        { error: orderData.message || "Failed to create PayPal order" },
        { status: 500 }
      );
    }

    return NextResponse.json({ orderID: orderData.id });
  } catch (error: any) {
    console.error("PayPal create order error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
