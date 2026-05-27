import { randomBytes, createHash } from "crypto";

/**
 * Generate a VIVID license key in format: VIVID-XXXX-XXXX-XXXX
 * X = alphanumeric uppercase
 */
export function generateLicenseKey(): string {
  const segments = 3;
  const segmentLength = 4;
  const parts: string[] = [];

  for (let i = 0; i < segments; i++) {
    const bytes = randomBytes(segmentLength);
    const segment = Array.from(bytes)
      .map((b) => "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"[b % 36])
      .join("");
    parts.push(segment);
  }

  return `VIVID-${parts.join("-")}`;
}

/**
 * Calculate expiration date based on tier
 */
export function getExpirationDate(tier: string): Date | null {
  const now = new Date();

  switch (tier.toLowerCase()) {
    case "pro":
      return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days
    case "elite":
      return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days
    case "enterprise":
      return null; // Lifetime
    default:
      return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  }
}

/**
 * Check if a license is valid (not expired)
 */
export function isLicenseValid(expiresAt: Date | string | null): boolean {
  if (expiresAt === null) return true; // Lifetime
  const date = typeof expiresAt === "string" ? new Date(expiresAt) : expiresAt;
  return new Date() < date;
}

/**
 * Get days remaining for a license
 */
export function getDaysRemaining(expiresAt: Date | string | null): number | null {
  if (expiresAt === null) return null; // Lifetime
  const date = typeof expiresAt === "string" ? new Date(expiresAt) : expiresAt;
  const diff = date.getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (24 * 60 * 60 * 1000)));
}

/**
 * Hash a HWID for storage comparison
 */
export function hashHwid(hwid: string): string {
  return createHash("sha256").update(hwid).digest("hex");
}
