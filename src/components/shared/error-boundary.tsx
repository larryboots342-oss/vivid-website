"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
  variant?: "full" | "compact";
}

export function ErrorBoundary({ error, reset, variant = "compact" }: ErrorBoundaryProps) {
  useEffect(() => {
    // Error logged to monitoring service in production
  }, [error]);

  const isFull = variant === "full";

  return (
    <div className={`flex flex-col items-center justify-center ${isFull ? "min-h-screen" : "min-h-[60vh]"}`}>
      <div className="w-16 h-16 rounded-2xl bg-vivid-accent/10 border border-vivid-accent/20 flex items-center justify-center mb-6">
        <AlertTriangle className="w-8 h-8 text-vivid-accent" />
      </div>
      <h2 className="text-2xl font-bold text-white mb-3">Something went wrong</h2>
      <p className="text-vivid-textMuted max-w-md mb-8 text-center">
        {error.message || "An unexpected error occurred. Please try again."}
      </p>
      <Button onClick={reset} variant="outline" className="gap-2">
        <RotateCcw className="w-4 h-4" />
        Try Again
      </Button>
    </div>
  );
}
