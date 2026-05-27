import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payment Successful",
  description: "Your VIVID purchase was successful. Access your license key and download.",
};

export default function SuccessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
