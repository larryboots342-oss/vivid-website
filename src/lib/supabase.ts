import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn(
    "Supabase credentials missing. License creation will fail until SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are configured."
  );
}

export const supabase =
  supabaseUrl && supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey)
    : null;

export function generateLicenseKey(): string {
  const segments = [];
  for (let i = 0; i < 4; i++) {
    segments.push(
      Math.random().toString(36).substring(2, 6).toUpperCase()
    );
  }
  return `VIVID-${segments.join("-")}`;
}
