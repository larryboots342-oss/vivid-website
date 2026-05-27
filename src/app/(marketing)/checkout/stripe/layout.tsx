import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your VIVID license purchase securely via Stripe.",
};

export default function StripeCheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
