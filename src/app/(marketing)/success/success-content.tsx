"use client";

import { motion } from "framer-motion";
import { Check, Copy, Download, Mail, Star, Send, X, CheckCircle2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function SuccessContent() {
  const searchParams = useSearchParams();
  const licenseKey = searchParams.get("key") || "Check your email";
  const [copied, setCopied] = useState(false);
  const [showReview, setShowReview] = useState(true);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);

  function copyKey() {
    if (licenseKey === "Check your email") return;
    navigator.clipboard.writeText(licenseKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function submitReview() {
    if (rating === 0) return;
    setReviewLoading(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, content: reviewText }),
      });
      const data = await res.json();
      if (data.success) {
        setReviewSubmitted(true);
      }
    } catch {
      // Silently fail on review — not critical
    } finally {
      setReviewLoading(false);
    }
  }

  return (
    <div className="pt-32 pb-16 px-6 flex items-center justify-center min-h-[70vh]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg w-full text-center space-y-6"
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

        <div className="rounded-xl border border-vivid-border bg-vivid-surface p-6">
          <p className="text-vivid-textDim text-sm mb-2">Your License Key</p>
          <div className="flex items-center gap-3">
            <code className="flex-1 text-lg font-mono text-vivid-primary bg-vivid-bg rounded-lg px-4 py-3 break-all">
              {licenseKey}
            </code>
            {licenseKey !== "Check your email" && (
              <button
                onClick={copyKey}
                className="p-3 rounded-lg bg-vivid-surfaceHover hover:bg-vivid-border transition-colors shrink-0"
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

        {/* Review Prompt — cool & non-mandatory */}
        {showReview && !reviewSubmitted && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="relative rounded-xl border border-vivid-primary/20 bg-gradient-to-br from-vivid-primary/10 to-vivid-primary/5 p-6 text-left"
          >
            <button
              onClick={() => setShowReview(false)}
              className="absolute top-3 right-3 p-1 rounded text-vivid-textDim hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 mb-3">
              <Star className="w-5 h-5 text-vivid-primary fill-vivid-primary" />
              <span className="text-white font-semibold text-sm">Quick favour?</span>
            </div>
            <p className="text-vivid-textMuted text-sm mb-4">
              If you have a second, we&apos;d love a rating. No pressure at all — just helps us grow.
            </p>
            <div className="flex items-center gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-7 h-7 transition-colors ${
                      star <= rating
                        ? "text-amber-400 fill-amber-400"
                        : "text-vivid-border fill-transparent"
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="space-y-3"
              >
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="What do you think so far? (optional)"
                  rows={3}
                  maxLength={300}
                  className="w-full px-4 py-3 rounded-xl bg-vivid-bg/60 border border-vivid-border/60 text-white text-sm placeholder-vivid-textDim focus:outline-none focus:border-vivid-primary/50 resize-none"
                />
                <div className="flex items-center justify-between">
                  <span className="text-xs text-vivid-textDim">{reviewText.length}/300</span>
                  <Button onClick={submitReview} disabled={reviewLoading} size="sm" className="gap-2">
                    {reviewLoading ? "Sending..." : "Send"}
                    <Send className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {reviewSubmitted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center gap-2 text-green-400 text-sm"
          >
            <CheckCircle2 className="w-4 h-4" />
            Thanks for the feedback!
          </motion.div>
        )}

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
