"use client";

import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { PLANS, CURRENCY_SYMBOL } from "@/lib/constants";
import { Shield, Clock, ArrowRight } from "lucide-react";

export default function StripeCheckoutPage() {
  const searchParams = useSearchParams();
  const tier = searchParams.get("tier") || "pro";

  const plan = PLANS.find((p) => p.id === tier) || PLANS[1];
  const price = plan.price;

  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    setLoading(true);
    try {
      const res = await fetch("/api/subscription/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error(data.error || "Failed to create checkout session");
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="pt-32 pb-16 px-6 flex items-center justify-center min-h-[70vh]">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <Card className="border-vivid-primary/20">
          <CardHeader>
            <CardTitle className="text-white text-2xl">Complete Your Purchase</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-xl bg-vivid-bg p-4 border border-vivid-border">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-white font-semibold text-lg">{plan.name} License</p>
                  <p className="text-vivid-textMuted text-sm">{plan.durationLabel}</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold text-xl">{CURRENCY_SYMBOL}{price.toFixed(2)}</p>
                  <p className="text-vivid-textMuted text-xs">one-time</p>
                </div>
              </div>
              {plan.durationDays && (
                <div className="flex items-center gap-2 mt-3 px-3 py-2 rounded-lg bg-green-500/10 border border-green-500/20">
                  <Clock className="w-4 h-4 text-green-400" />
                  <p className="text-green-400 text-sm">
                    {plan.durationLabel} from activation
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3 text-sm text-vivid-textMuted">
                <Shield className="w-4 h-4 text-vivid-primary shrink-0 mt-0.5" />
                <span>Secure payment via Stripe. Your card details are never stored on our servers.</span>
              </div>
              <div className="flex items-start gap-3 text-sm text-vivid-textMuted">
                <Clock className="w-4 h-4 text-vivid-primary shrink-0 mt-0.5" />
                <span>Instant license key delivery via email after payment.</span>
              </div>
            </div>

            <Button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full h-12 text-base"
            >
              {loading ? "Creating Session..." : `Purchase ${plan.name}`}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>

            <p className="text-vivid-textDim text-xs text-center">
              By purchasing, you agree to our Terms of Service and Privacy Policy.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
