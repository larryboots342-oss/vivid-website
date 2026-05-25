import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  const checks: Record<string, boolean | string> = {
    paypal_client_id: !!process.env.PAYPAL_CLIENT_ID,
    paypal_secret: !!process.env.PAYPAL_CLIENT_SECRET,
    paypal_api_url: process.env.PAYPAL_API_URL || "https://api-m.sandbox.paypal.com",
    supabase_url: !!process.env.SUPABASE_URL,
    supabase_key: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    resend_key: !!process.env.RESEND_API_KEY,
    resend_from: process.env.RESEND_FROM_EMAIL || "noreply@vivid-aimbot.com",
    supabase_connected: false,
  };

  if (supabase) {
    try {
      const { error } = await supabase
        .from("license_keys")
        .select("count", { count: "exact", head: true });
      checks.supabase_connected = !error;
    } catch {
      checks.supabase_connected = false;
    }
  }

  const allOk =
    checks.paypal_client_id === true &&
    checks.paypal_secret === true &&
    checks.supabase_key === true &&
    checks.resend_key === true;

  return NextResponse.json(
    {
      status: allOk ? "ready" : "missing_config",
      checks,
      timestamp: new Date().toISOString(),
    },
    { status: allOk ? 200 : 503 }
  );
}
