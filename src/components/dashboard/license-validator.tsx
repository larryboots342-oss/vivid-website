"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Key, ShieldCheck, ShieldAlert, Clock, Infinity, Loader2 } from "lucide-react";
import { PLANS } from "@/lib/constants";

interface LicenseValidatorProps {
  onValidated?: () => void;
}

export default function LicenseValidator({ onValidated }: LicenseValidatorProps) {
  const [key, setKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    license?: {
      key: string;
      tier: string;
      isLifetime: boolean;
      expiresAt: string | null;
      daysRemaining: number | null;
    };
    error?: string;
  } | null>(null);

  async function handleValidate(e: React.FormEvent) {
    e.preventDefault();
    if (!key.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/license/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: key.trim() }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setResult({ success: true, license: data.license });
        toast.success(`License validated! ${data.license.tier} access granted.`);
        onValidated?.();
      } else {
        setResult({ success: false, error: data.error || "Validation failed" });
        toast.error(data.error || "Validation failed");
      }
    } catch {
      setResult({ success: false, error: "Network error. Please try again." });
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const tierColor = (tier: string) => {
    switch (tier.toLowerCase()) {
      case "pro": return "#00e5ff";
      case "elite": return "#b829dd";
      case "enterprise": return "#00ff9d";
      default: return "#707070";
    }
  };

  return (
    <Card className="border-vivid-primary/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2 text-lg">
          <Key className="w-5 h-5 text-vivid-primary" />
          Validate License Key
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-vivid-textMuted">
          Already have a license key? Enter it below to activate it on your account.
          Keys bought on the website or received via email work here.
        </p>

        <form onSubmit={handleValidate} className="flex gap-3">
          <Input
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="VIVID-XXXX-XXXX-XXXX"
            className="font-mono uppercase flex-1"
            disabled={loading}
          />
          <Button type="submit" disabled={loading || !key.trim()} className="shrink-0">
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 mr-1.5" />
                Validate
              </>
            )}
          </Button>
        </form>

        <AnimatePresence mode="wait">
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              {result.success && result.license ? (
                <div className="rounded-xl bg-green-500/10 border border-green-500/20 p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-green-400" />
                    <span className="text-green-400 font-semibold">License Active</span>
                    <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-xs">
                      ● Active
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      className="text-xs uppercase tracking-wider"
                      style={{
                        backgroundColor: `${tierColor(result.license.tier)}20`,
                        color: tierColor(result.license.tier),
                        borderColor: `${tierColor(result.license.tier)}40`,
                      }}
                      variant="outline"
                    >
                      {result.license.tier}
                    </Badge>
                    <code className="text-sm font-mono text-vivid-primary">
                      {result.license.key}
                    </code>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-green-400/80">
                    {result.license.isLifetime ? (
                      <>
                        <Infinity className="w-4 h-4" />
                        Lifetime access — never expires
                      </>
                    ) : (
                      <>
                        <Clock className="w-4 h-4" />
                        {result.license.daysRemaining} day{result.license.daysRemaining !== 1 ? "s" : ""} remaining
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 flex items-center gap-3">
                  <ShieldAlert className="w-5 h-5 text-red-400 shrink-0" />
                  <span className="text-red-400 text-sm">{result.error}</span>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
