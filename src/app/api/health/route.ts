import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const checks: Record<string, boolean | string> = {
    supabase_url: !!process.env.SUPABASE_URL,
    supabase_key: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    resend_key: !!process.env.RESEND_API_KEY,
    resend_from: process.env.RESEND_FROM_EMAIL || "noreply@vividaimbot.store",
    supabase_connected: false,
  };

  if (supabase) {
    try {
      const { data, error } = await supabase.from("license_keys").select("id").limit(1);
      checks.supabase_connected = !error && data !== null;
    } catch {
      checks.supabase_connected = false;
    }
  }

  const allOk = checks.supabase_key === true && checks.resend_key === true;

  return NextResponse.json(
    {
      status: allOk ? "ok" : "degraded",
      timestamp: new Date().toISOString(),
      checks,
    },
    { status: allOk ? 200 : 503 }
  );
}
