"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function MarketingError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to monitoring service
    console.error("Marketing page error:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-vivid-accent/10 border border-vivid-accent/20 flex items-center justify-center mb-6">
        <AlertTriangle className="w-8 h-8 text-vivid-accent" />
      </div>
      <h1 className="text-2xl font-bold text-white mb-3">
        Something went wrong
      </h1>
      <p className="text-vivid-textMuted max-w-md mb-8">
        We encountered an error loading this page. Please try again or contact
        support if the issue persists.
      </p>
      <div className="flex gap-4">
        <Button
          onClick={reset}
          className="gap-2 bg-vivid-primary text-vivid-bg hover:bg-vivid-primaryDim"
        >
          <RotateCcw className="w-4 h-4" />
          Try Again
        </Button>
      </div>
    </div>
  );
}
