"use client";

import { motion } from "framer-motion";
import { Check, Copy, Download, Mail } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const licenseKey = searchParams.get("key") || "Check your email";
  const [copied, setCopied] = useState(false);

  function copyKey() {
    if (licenseKey === "Check your email") return;
    navigator.clipboard.writeText(licenseKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="pt-32 pb-16 px-6 flex items-center justify-center min-h-[70vh]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg w-full text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center"
        >
          <Check className="w-10 h-10 text-green-400" />
        </motion.div>

        <h1 className="text-3xl font-bold text-white mb-2">
          Payment Successful!
        </h1>
        <p className="text-vivid-textMuted mb-8">
          Thank you for your purchase. Your license key has been emailed to you.
        </p>

        <div className="rounded-xl border border-vivid-border bg-vivid-surface p-6 mb-6">
          <p className="text-vivid-textDim text-sm mb-2">Your License Key</p>
          <div className="flex items-center gap-3">
            <code className="flex-1 text-lg font-mono text-vivid-primary bg-vivid-bg rounded-lg px-4 py-3">
              {licenseKey}
            </code>
            {licenseKey !== "Check your email" && (
              <button
                onClick={copyKey}
                className="p-3 rounded-lg bg-vivid-surfaceHover hover:bg-vivid-border transition-colors"
                aria-label="Copy license key"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-green-400" />
                ) : (
                  <Copy className="w-5 h-5 text-vivid-textMuted" />
                )}
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <a
            href="/download"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-vivid-primary text-vivid-bg font-semibold hover:bg-vivid-primaryDim transition-colors"
          >
            <Download className="w-5 h-5" />
            Download VIVID
          </a>
          <p className="text-vivid-textDim text-xs flex items-center justify-center gap-1">
            <Mail className="w-3 h-3" />
            Can&apos;t find your key? Check your spam folder or contact support.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
