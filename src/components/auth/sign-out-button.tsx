"use client";

import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { LogOut, Loader2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface SignOutButtonProps {
  variant?: "default" | "ghost" | "menu";
  className?: string;
}

export default function SignOutButton({
  variant = "default",
  className,
}: SignOutButtonProps) {
  const { signOut } = useClerk();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut({ redirectUrl: "/" });
    } catch {
      router.push("/");
    }
  };

  const variants = {
    default:
      "inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-vivid-textMuted hover:text-white hover:bg-white/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
    ghost:
      "inline-flex items-center gap-2 text-sm text-vivid-textMuted hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
    menu:
      "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-vivid-textMuted hover:text-white hover:bg-white/5 transition-colors w-full text-left disabled:opacity-50 disabled:cursor-not-allowed",
  };

  return (
    <button
      onClick={handleSignOut}
      disabled={loading}
      className={cn(variants[variant], className)}
      aria-label={variant !== "menu" ? "Sign out" : undefined}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <LogOut className="w-4 h-4" />
      )}
      {variant === "menu" && <span>Sign out</span>}
    </button>
  );
}
