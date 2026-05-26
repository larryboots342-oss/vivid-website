"use client";

import { Suspense } from "react";
import SuccessContent from "./success-content";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

function SuccessSkeleton() {
  return (
    <div className="pt-32 pb-16 px-6 flex items-center justify-center min-h-[70vh]">
      <Card className="max-w-lg w-full border-vivid-border/40">
        <CardContent className="p-8 text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-white/5 animate-pulse" />
          <div className="h-8 w-1/2 bg-white/5 rounded animate-pulse mx-auto" />
          <div className="h-16 w-full bg-white/5 rounded animate-pulse" />
          <Loader2 className="w-6 h-6 text-vivid-primary animate-spin mx-auto" />
        </CardContent>
      </Card>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<SuccessSkeleton />}>
      <SuccessContent />
    </Suspense>
  );
}
