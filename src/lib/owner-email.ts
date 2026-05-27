export const OWNER_EMAIL = process.env.OWNER_EMAIL;
if (!OWNER_EMAIL) {
  throw new Error("OWNER_EMAIL environment variable is required");
}
