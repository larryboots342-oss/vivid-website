"use client";

import {
  LayoutDashboard,
  Users,
  CreditCard,
  BarChart3,
  HelpCircle,
  FileText,
  ToggleLeft,
} from "lucide-react";
import SignOutButton from "@/components/auth/sign-out-button";
import { Sidebar } from "@/components/shared/sidebar";

const adminLinks = [
  { href: "/admin", label: "Overview", icon: <LayoutDashboard className="w-5 h-5" /> },
  { href: "/admin/users", label: "Users", icon: <Users className="w-5 h-5" /> },
  { href: "/admin/subscriptions", label: "Purchases", icon: <CreditCard className="w-5 h-5" /> },
  { href: "/admin/analytics", label: "Analytics", icon: <BarChart3 className="w-5 h-5" /> },
  { href: "/admin/support", label: "Support", icon: <HelpCircle className="w-5 h-5" /> },
  { href: "/admin/content", label: "Content", icon: <FileText className="w-5 h-5" /> },
  { href: "/admin/features", label: "Features", icon: <ToggleLeft className="w-5 h-5" /> },
];

export default function AdminSidebar() {
  return (
    <Sidebar
      links={adminLinks}
      bottomAction={<SignOutButton variant="menu" />}
      logoHref="/admin"
    />
  );
}
