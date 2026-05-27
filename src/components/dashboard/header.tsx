"use client";

import { motion } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import { Shield } from "lucide-react";
import { Header } from "@/components/shared/header";
import { isOwnerEmail } from "@/lib/owner";

export default function DashboardHeader() {
  const { user } = useUser();
  const owner = isOwnerEmail(user?.primaryEmailAddress?.emailAddress);

  const ownerBadge = owner ? (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-vivid-primary/10 border border-vivid-primary/20 text-xs font-medium text-vivid-primary"
    >
      <Shield className="w-3.5 h-3.5" />
      Owner
    </motion.div>
  ) : null;

  return (
    <Header
      badge={ownerBadge}
      showNotifications
    />
  );
}
