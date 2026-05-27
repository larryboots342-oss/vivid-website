/**
 * Unified License Data Layer
 *
 * All purchase flows (Stripe, manual) write to BOTH:
 * - Prisma `License` model (website ORM)
 * - Supabase `license_keys` table (desktop app)
 *
 * Validation checks Prisma first, then Supabase fallback.
 */

import { prisma } from "@/lib/prisma";
import { supabase } from "@/lib/supabase";
import { generateLicenseKey, getExpirationDate } from "@/lib/license";

interface CreateLicenseInput {
  userId?: string;
  email: string;
  tier: string;
  paymentProvider: "stripe" | "manual";
  paymentOrderId?: string;
  paymentAmount?: number | string;
  paymentCurrency?: string;
  ipAddress?: string;
  country?: string;
  hwid?: string;
  displayName?: string;
  licenseSignature?: string;
}

/**
 * Create a license in BOTH Prisma and Supabase
 */
export async function createUnifiedLicense(input: CreateLicenseInput) {
  const licenseKey = generateLicenseKey();
  const tier = input.tier.toLowerCase();
  const isLifetime = tier === "enterprise";
  const expiresAt = getExpirationDate(tier);
  const now = new Date();
  const nowIso = now.toISOString();

  // 1. Create in Prisma
  const prismaLicense = await prisma.license.create({
    data: {
      userId: input.userId || null,
      key: licenseKey,
      tier,
      email: input.email,
      isActive: true,
      isLifetime,
      expiresAt,
      activatedAt: now,
      ipAddress: input.ipAddress || null,
      country: input.country || null,
    },
  });

  // 2. Create payment record in Prisma (real revenue tracking)
  const amount =
    typeof input.paymentAmount === "string"
      ? parseFloat(input.paymentAmount)
      : typeof input.paymentAmount === "number"
        ? input.paymentAmount
        : 0;

  if (amount > 0) {
    await prisma.payment.create({
      data: {
        userId: input.userId || null,
        licenseId: prismaLicense.id,
        provider: input.paymentProvider,
        orderId: input.paymentOrderId || null,
        amount,
        currency: input.paymentCurrency || "GBP",
        status: "completed",
        payerEmail: input.email,
        ipAddress: input.ipAddress || null,
        country: input.country || null,
      },
    });
  }

  // 3. Create in Supabase (CRITICAL — desktop app depends on this)
  if (!supabase) {
    throw new Error("Supabase client is not configured. License cannot be created.");
  }

  const { error: supabaseError } = await supabase.from("license_keys").insert({
    license_key: licenseKey,
    tier,
    status: "active",
    email: input.email,
    user_id: input.userId || null,
    hwid: input.hwid || null,
    license_signature: input.licenseSignature || null,
    display_name: input.displayName || null,
    created_at: nowIso,
    updated_at: nowIso,
    activated_at: nowIso,
    expires_at: expiresAt ? expiresAt.toISOString() : null,
    trial_expires_at: null,
    account_id: null,
    payment_provider: input.paymentProvider,
    payment_order_id: input.paymentOrderId || null,
    payment_amount: input.paymentAmount != null ? String(input.paymentAmount) : null,
    payment_currency: input.paymentCurrency || "GBP",
    paid_at: nowIso,
  });

  if (supabaseError) {
    // Rollback Prisma license to keep systems in sync
    await prisma.license.delete({ where: { id: prismaLicense.id } }).catch(() => {});
    throw new Error(
      `Supabase license insert failed: ${supabaseError.message}. ` +
      `Prisma license has been rolled back to prevent data inconsistency.`
    );
  }

  return { licenseKey, prismaLicense, expiresAt };
}

/**
 * Find a license by key — checks Prisma first, then Supabase fallback
 */
export async function findUnifiedLicense(key: string) {
  // 1. Check Prisma first
  const prismaLicense = await prisma.license.findUnique({
    where: { key },
  });

  if (prismaLicense) {
    return { source: "prisma" as const, license: prismaLicense };
  }

  // 2. Fallback to Supabase
  if (supabase) {
    const { data, error } = await supabase
      .from("license_keys")
      .select("*")
      .eq("license_key", key)
      .single();

    if (data && !error) {
      // Map Supabase shape to Prisma-like shape
      return {
        source: "supabase" as const,
        license: {
          id: data.id || `sb_${key}`,
          key: data.license_key,
          tier: data.tier,
          email: data.email,
          isActive: data.status === "active",
          isLifetime: !data.expires_at,
          expiresAt: data.expires_at ? new Date(data.expires_at) : null,
          activatedAt: data.activated_at ? new Date(data.activated_at) : null,
          hwid: data.hwid || null,
          createdAt: data.created_at ? new Date(data.created_at) : new Date(),
        },
      };
    }
  }

  return null;
}
