"use client";

import { Shield } from "lucide-react";
import { Header } from "@/components/shared/header";
import { useAuthState } from "@/hooks/use-auth-state";

export default function AdminHeader() {
  const { user } = useAuthState();

  return (
    <Header
      title="Admin Panel"
      subtitle={user?.primaryEmailAddress?.emailAddress ?? "Admin"}
      titleIcon={<Shield className="w-4 h-4 text-vivid-primary" />}
      showNotifications
      notificationDot
    />
  );
}
