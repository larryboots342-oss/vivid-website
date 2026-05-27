import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your account preferences, profile, and notifications.",
};

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
