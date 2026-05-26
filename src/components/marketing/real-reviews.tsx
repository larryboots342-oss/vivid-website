"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star, Quote, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Review {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  content: string;
  tier: string;
  game?: string;
  createdAt: string;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "w-3.5 h-3.5",
            i < rating
              ? "text-amber-400 fill-amber-400"
              : "text-vivid-border fill-transparent"
          )}
        />
      ))}
    </div>
  );
}

export default function RealReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState({ total: 0, average: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/reviews?limit=6")
      .then((r) => r.json())
      .then((data) => {
        setReviews(data.reviews || []);
        setStats({ total: data.total || 0, average: data.averageRating || 0 });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="relative section-padding overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <Loader2 className="w-8 h-8 text-vivid-primary animate-spin mx-auto" />
        </div>
      </section>
    );
  }

  // Don't show section if no real reviews yet
  if (reviews.length === 0) {
    return null;
  }

  return (
    <section id="reviews" className="relative section-padding overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-vivid-primary/[0.03] rounded-full blur-[180px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-vivid-primary/10 border border-vivid-primary/20 text-vivid-primary text-sm font-medium mb-6"
          >
            <Star className="w-4 h-4 fill-vivid-primary" />
            Verified Reviews
          </motion.div>

          <h2 className="text-fluid-3xl font-bold mb-4 text-balance">
            From Real <span className="gradient-text">Players</span>
          </h2>
          <p className="text-fluid-base text-vivid-textMuted max-w-2xl mx-auto leading-relaxed">
            Only verified license holders can leave reviews. 
            {stats.total > 0 && (
              <span className="text-white font-medium"> {stats.average}/5</span>
            )} average from {stats.total} review{stats.total !== 1 ? "s" : ""}.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {reviews.map((review, i) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="group relative"
            >
              <div className="h-full rounded-2xl border border-vivid-border/40 bg-vivid-surface/40 backdrop-blur-xl p-6 flex flex-col gap-4 hover:border-vivid-border/70 transition-colors duration-300">
                <Quote className="w-8 h-8 text-vivid-primary/20" />
                <p className="text-[15px] text-vivid-text leading-relaxed flex-1">
                  &ldquo;{review.content}&rdquo;
                </p>
                {review.game && (
                  <div className="inline-flex self-start px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[11px] text-vivid-textMuted font-medium uppercase tracking-wider">
                    {review.game}
                  </div>
                )}
                <div className="flex items-center justify-between pt-4 border-t border-vivid-border/30">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-vivid-primary to-blue-500 flex items-center justify-center text-sm font-bold text-white">
                      {review.avatar}
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-white block">
                        {review.name}
                      </span>
                      <span className="text-[10px] text-vivid-textDim uppercase tracking-wider">
                        {review.tier}
                      </span>
                    </div>
                  </div>
                  <StarRating rating={review.rating} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
