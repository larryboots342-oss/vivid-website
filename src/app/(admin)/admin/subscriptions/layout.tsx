import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Purchase History",
  description: "All license purchases with buyer details.",
};

export default function AdminSubscriptionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
