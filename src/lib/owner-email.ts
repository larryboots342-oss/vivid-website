export const OWNER_EMAIL = process.env.OWNER_EMAIL || "coryholes1234@gmail.com";

if (!OWNER_EMAIL && process.env.NODE_ENV === "production") {
  throw new Error("OWNER_EMAIL environment variable must be set in production");
}
