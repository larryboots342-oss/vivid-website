"use client";

import { Suspense } from "react";
import PayPalCheckoutContent from "./paypal-checkout-content";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

function CheckoutSkeleton() {
  return (
    <div className="pt-32 pb-16 px-6 flex items-center justify-center min-h-[70vh]">
      <Card className="max-w-md w-full border-vivid-border/40">
        <CardContent className="p-8 space-y-6">
          <div className="h-8 w-2/3 bg-white/5 rounded animate-pulse" />
          <div className="h-24 w-full bg-white/5 rounded animate-pulse" />
          <div className="h-12 w-full bg-white/5 rounded animate-pulse" />
          <div className="flex justify-center">
            <Loader2 className="w-6 h-6 text-vivid-primary animate-spin" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function PayPalCheckoutPage() {
  return (
    <Suspense fallback={<CheckoutSkeleton />}>
      <PayPalCheckoutContent />
    </Suspense>
  );
}
