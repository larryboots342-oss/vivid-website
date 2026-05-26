"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Infinity, AlertTriangle, Key } from "lucide-react";

interface LicenseCountdownProps {
  licenses: Array<{
    id: string;
    key: string;
    tier: string;
    isActive: boolean;
    isLifetime: boolean;
    expiresAt: string | null;
  }>;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
  expired: boolean;
}

function calcTimeLeft(expiresAt: string | null): TimeLeft {
  if (!expiresAt) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, totalMs: Infinity, expired: false };
  }
  const totalMs = new Date(expiresAt).getTime() - Date.now();
  if (totalMs <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, totalMs: 0, expired: true };
  }
  const days = Math.floor(totalMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((totalMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((totalMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((totalMs % (1000 * 60)) / 1000);
  return { days, hours, minutes, seconds, totalMs, expired: false };
}

function tierColor(tier: string): string {
  switch (tier.toLowerCase()) {
    case "pro": return "#00e5ff";
    case "elite": return "#b829dd";
    case "enterprise": return "#00ff9d";
    default: return "#707070";
  }
}

function tierBg(tier: string): string {
  switch (tier.toLowerCase()) {
    case "pro": return "rgba(0,229,255,0.08)";
    case "elite": return "rgba(184,41,221,0.08)";
    case "enterprise": return "rgba(0,255,157,0.08)";
    default: return "rgba(112,112,112,0.08)";
  }
}

export default function LicenseCountdown({ licenses }: LicenseCountdownProps) {
  const activeLicenses = licenses.filter((l) => l.isActive && !l.isLifetime && l.expiresAt);
  const lifetimeLicenses = licenses.filter((l) => l.isActive && l.isLifetime);

  // Pick the license with the most urgent expiry
  const targetLicense = activeLicenses.length > 0
    ? activeLicenses.reduce((urgent, current) => {
        const u = new Date(urgent.expiresAt!).getTime();
        const c = new Date(current.expiresAt!).getTime();
        return c < u ? current : urgent;
      })
    : null;

  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(
    targetLicense ? calcTimeLeft(targetLicense.expiresAt) : null
  );

  useEffect(() => {
    if (!targetLicense) return;
    const interval = setInterval(() => {
      setTimeLeft(calcTimeLeft(targetLicense.expiresAt));
    }, 1000);
    return () => clearInterval(interval);
  }, [targetLicense]);

  if (!targetLicense && lifetimeLicenses.length === 0) {
    return (
      <Card className="border-vivid-border/50">
        <CardContent className="py-8 text-center">
          <Key className="w-10 h-10 text-vivid-textDim mx-auto mb-3" />
          <p className="text-white font-medium">No Active License</p>
          <p className="text-sm text-vivid-textMuted mt-1">
            Purchase a license to unlock full features.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (lifetimeLicenses.length > 0 && !targetLicense) {
    const l = lifetimeLicenses[0];
    return (
      <Card
        className="border-green-500/20"
        style={{ backgroundColor: tierBg(l.tier) }}
      >
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white text-base flex items-center gap-2">
              <Key className="w-4 h-4" style={{ color: tierColor(l.tier) }} />
              {l.tier.charAt(0).toUpperCase() + l.tier.slice(1)} License
            </CardTitle>
            <Badge
              variant="outline"
              className="text-[10px] uppercase tracking-wider"
              style={{
                borderColor: `${tierColor(l.tier)}40`,
                color: tierColor(l.tier),
              }}
            >
              Lifetime
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-green-400">
            <Infinity className="w-5 h-5" />
            <span className="font-semibold">Never Expires</span>
          </div>
          <code className="text-xs font-mono text-vivid-textMuted mt-2 block">{l.key}</code>
        </CardContent>
      </Card>
    );
  }

  if (!timeLeft || !targetLicense) return null;

  const tc = tierColor(targetLicense.tier);
  const urgent = timeLeft.days <= 3 && !timeLeft.expired;

  return (
    <Card
      className={urgent ? "border-red-500/30" : "border-vivid-primary/20"}
      style={{ backgroundColor: tierBg(targetLicense.tier) }}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white text-base flex items-center gap-2">
            <Key className="w-4 h-4" style={{ color: tc }} />
            {targetLicense.tier.charAt(0).toUpperCase() + targetLicense.tier.slice(1)} License
          </CardTitle>
          {timeLeft.expired ? (
            <Badge variant="destructive" className="text-[10px]">Expired</Badge>
          ) : urgent ? (
            <Badge variant="destructive" className="text-[10px]">Expiring Soon</Badge>
          ) : (
            <Badge
              variant="outline"
              className="text-[10px] uppercase tracking-wider"
              style={{ borderColor: `${tc}40`, color: tc }}
            >
              Active
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {timeLeft.expired ? (
          <div className="flex items-center gap-2 text-red-400">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-semibold">License Expired</span>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 text-vivid-textMuted text-sm">
              <Clock className="w-4 h-4" />
              Time Remaining
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[
                { value: timeLeft.days, label: "Days" },
                { value: timeLeft.hours, label: "Hours" },
                { value: timeLeft.minutes, label: "Mins" },
                { value: timeLeft.seconds, label: "Secs" },
              ].map((unit) => (
                <motion.div
                  key={unit.label}
                  className="rounded-xl border text-center py-3"
                  style={{
                    borderColor: urgent ? "rgba(239,68,68,0.2)" : `${tc}20`,
                    backgroundColor: urgent ? "rgba(239,68,68,0.05)" : "rgba(0,0,0,0.2)",
                  }}
                  animate={{ scale: unit.label === "Secs" ? [1, 1.02, 1] : 1 }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <div
                    className="text-xl font-bold tabular-nums"
                    style={{ color: urgent ? "#ef4444" : tc }}
                  >
                    {String(unit.value).padStart(2, "0")}
                  </div>
                  <div className="text-[10px] text-vivid-textDim uppercase tracking-wider mt-0.5">
                    {unit.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
        <code className="text-xs font-mono text-vivid-textMuted block">{targetLicense.key}</code>
      </CardContent>
    </Card>
  );
}
