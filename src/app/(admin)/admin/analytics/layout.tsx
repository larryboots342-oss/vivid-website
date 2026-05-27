import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Visitor Analytics",
  description: "Real-time traffic, geography, and behaviour analytics.",
};

export default function AdminAnalyticsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
