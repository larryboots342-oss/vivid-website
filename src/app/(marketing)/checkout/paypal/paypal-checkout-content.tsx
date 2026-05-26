"use client";

import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { PLANS, CURRENCY_SYMBOL } from "@/lib/constants";
import { Shield, ArrowRight, AlertTriangle, RotateCcw } from "lucide-react";

export default function PayPalCheckoutContent() {
  const searchParams = useSearchParams();
  const tier = searchParams.get("tier") || "pro";

  const plan = PLANS.find((p) => p.id === tier) || PLANS[0];

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = useCallback(async () => {
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/paypal/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier, email }),
      });
      const data = await res.json();
      if (data.orderID) {
        window.location.href = `https://www.paypal.com/checkoutnow?token=${data.orderID}`;
      } else {
        const msg = data.error || "Failed to create order.";
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
  }, [tier, email]);

  return (
    <div className="pt-32 pb-16 px-6 flex items-center justify-center min-h-[70vh]">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-white text-2xl">Checkout with PayPal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-xl bg-vivid-bg p-4 border border-vivid-border">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-vivid-textMuted text-sm">{plan.name} License</p>
                  <p className="text-vivid-textMuted text-xs">{plan.durationLabel}</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold">{CURRENCY_SYMBOL}{plan.price.toFixed(2)}</p>
                  <p className="text-vivid-textMuted text-xs">one-time</p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm text-vivid-textMuted mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl bg-vivid-bg border border-vivid-border text-white placeholder-vivid-textDim focus:outline-none focus:border-vivid-primary transition-colors"
              />
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

            <div className="space-y-2">
              <Button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full bg-[#0070ba] hover:bg-[#005ea6]"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    />
                    Creating Order...
                  </span>
                ) : (
                  "Continue to PayPal"
                )}
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <a href={`/checkout/stripe?tier=${tier}`}>
                  Pay with Stripe
                </a>
              </Button>
            </div>

            <div className="flex items-start gap-3 text-sm text-vivid-textMuted">
              <Shield className="w-4 h-4 text-vivid-primary shrink-0 mt-0.5" />
              <span>Your license key will be emailed immediately after payment confirmation.</span>
            </div>

            <p className="text-vivid-textDim text-xs text-center">
              You will be redirected to PayPal to complete your purchase.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
