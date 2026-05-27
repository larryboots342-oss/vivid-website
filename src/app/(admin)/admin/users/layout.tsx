import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Users",
  description: "Manage accounts, roles, and permissions.",
};

export default function AdminUsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
