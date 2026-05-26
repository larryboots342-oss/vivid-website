"use client";

import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { PLANS, CURRENCY_SYMBOL } from "@/lib/constants";
import { Shield, Clock, ArrowRight, AlertTriangle, RotateCcw } from "lucide-react";

export default function StripeCheckoutContent() {
  const searchParams = useSearchParams();
  const tier = searchParams.get("tier") || "pro";

  const plan = PLANS.find((p) => p.id === tier) || PLANS[1];
  const price = plan.price;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = useCallback(async () => {
    setLoading(true);
    setError(null);
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
        const msg = data.error || "Failed to create checkout session";
        setError(msg);
        toast.error(msg);
      }
    } catch {
      const msg = "Network error. Please check your connection and try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [tier]);

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

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3 p-4 rounded-xl bg-vivid-accent/10 border border-vivid-accent/20 text-sm"
              >
                <AlertTriangle className="w-4 h-4 text-vivid-accent shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-vivid-accent font-medium">{error}</p>
                  <button
                    onClick={() => setError(null)}
                    className="text-vivid-textDim hover:text-white text-xs mt-1 inline-flex items-center gap-1 transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Try again
                  </button>
                </div>
              </motion.div>
            )}

            <Button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full h-12 text-base"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="inline-block w-4 h-4 border-2 border-vivid-bg border-t-transparent rounded-full"
                  />
                  Creating Session...
                </span>
              ) : (
                <>
                  Purchase {plan.name}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
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
