"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, X, Send, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ReviewPrompt({ onDismiss }: { onDismiss?: () => void }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [content, setContent] = useState("");
  const [game, setGame] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  async function handleSubmit() {
    if (rating === 0) {
      toast.error("Please select a star rating");
      return;
    }
    if (content.trim().length < 5) {
      toast.error("Please write at least a few words");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, content: content.trim(), game: game || undefined }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        toast.success("Thank you for your review!");
      } else {
        toast.error(data.error || "Failed to submit review");
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-2xl border border-vivid-primary/20 bg-gradient-to-br from-vivid-primary/10 to-vivid-primary/5 p-6"
      >
        <button
          onClick={() => {
            setDismissed(true);
            onDismiss?.();
          }}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-vivid-textDim hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>

        {submitted ? (
          <div className="text-center py-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-3" />
            </motion.div>
            <h3 className="text-lg font-bold text-white mb-1">Thanks!</h3>
            <p className="text-vivid-textMuted text-sm">
              Your feedback helps us improve VIVID for everyone.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-vivid-primary/20 flex items-center justify-center">
                <Star className="w-5 h-5 text-vivid-primary fill-vivid-primary" />
              </div>
              <div>
                <h3 className="text-white font-semibold">How&apos;s VIVID working for you?</h3>
                <p className="text-vivid-textMuted text-xs">
                  Quick review — totally optional but appreciated
                </p>
              </div>
            </div>

            {/* Star Rating */}
            <div className="flex items-center gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition-transform hover:scale-110"
                  aria-label={`${star} stars`}
                >
                  <Star
                    className={`w-7 h-7 transition-colors ${
                      star <= (hoverRating || rating)
                        ? "text-amber-400 fill-amber-400"
                        : "text-vivid-border fill-transparent"
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Review Text */}
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What do you like most? (optional)"
              rows={3}
              maxLength={500}
              className="w-full px-4 py-3 rounded-xl bg-vivid-bg/60 border border-vivid-border/60 text-white text-sm placeholder-vivid-textDim focus:outline-none focus:border-vivid-primary/50 resize-none mb-3"
            />

            {/* Game */}
            <input
              type="text"
              value={game}
              onChange={(e) => setGame(e.target.value)}
              placeholder="What game do you mainly play? (optional)"
              maxLength={30}
              className="w-full px-4 py-2.5 rounded-xl bg-vivid-bg/60 border border-vivid-border/60 text-white text-sm placeholder-vivid-textDim focus:outline-none focus:border-vivid-primary/50 mb-4"
            />

            <div className="flex items-center justify-between">
              <span className="text-xs text-vivid-textDim">
                {content.length}/500
              </span>
              <Button
                onClick={handleSubmit}
                disabled={loading || rating === 0}
                size="sm"
                className="gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                {loading ? "Sending..." : "Submit Review"}
              </Button>
            </div>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
