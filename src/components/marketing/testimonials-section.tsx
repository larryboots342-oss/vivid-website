"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Star, Quote, BadgeCheck, Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */
interface Testimonial {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  role: string;
  content: string;
  rating: number;
  tier: "Basic" | "Pro" | "Enterprise";
  verified: boolean;
  game?: string;
}

/* ------------------------------------------------------------------ */
/*  Data                                                              */
/* ------------------------------------------------------------------ */
const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Jake",
    handle: "@jakey",
    avatar: "JK",
    role: "Immortal Rank",
    content:
      "been using vivid for 3 weeks now, honestly way smoother than the other stuff ive tried. doesnt feel robotic at all, just helps me stay on target in those clutch moments",
    rating: 5,
    tier: "Pro",
    verified: true,
    game: "Valorant",
  },
  {
    id: "2",
    name: "Tom",
    handle: "@tomw",
    avatar: "TW",
    role: "Faceit Level 10",
    content:
      "got the lifetime deal during launch, best purchase ive made for cs2. no fps drops, no weird stutters. just works every time i boot it up",
    rating: 5,
    tier: "Enterprise",
    verified: true,
    game: "CS2",
  },
  {
    id: "3",
    name: "Liam",
    handle: "@liam_fn",
    avatar: "LF",
    role: "Competitive",
    content:
      "fortnite tracking on this is insane. i was losing boxes in build fights before, now i actually hit my shots while piece controlling. worth every penny",
    rating: 5,
    tier: "Pro",
    verified: true,
    game: "Fortnite",
  },
  {
    id: "4",
    name: "Ryan",
    handle: "@ry",
    avatar: "RY",
    role: "Casual",
    content:
      "im not even that good at games but this made me feel like i know what im doing lol. setup was literally download, paste key, play. even my mates noticed im hitting more shots",
    rating: 5,
    tier: "Basic",
    verified: true,
    game: "Roblox",
  },
  {
    id: "5",
    name: "Dan",
    handle: "@danv",
    avatar: "DV",
    role: "Radiant",
    content:
      "had vivid for 2 months now, zero issues. support actually replies on discord which is rare these days. if youre on the fence just get it",
    rating: 5,
    tier: "Enterprise",
    verified: true,
    game: "Valorant",
  },
  {
    id: "6",
    name: "Kieran",
    handle: "@kiz",
    avatar: "KZ",
    role: "Content Creator",
    content:
      "use it on stream almost every day, chat always asks what my sens is haha. never had a ban or even a warning in 4 months of daily use. solid",
    rating: 5,
    tier: "Enterprise",
    verified: true,
    game: "CS2",
  },
  {
    id: "7",
    name: "Josh",
    handle: "@joshh",
    avatar: "JH",
    role: "Arena Grind",
    content:
      "copped the pro key last month and immediately upgraded to lifetime after seeing how clean it is. flicks feel crispy, tracking is smooth. no complaints at all",
    rating: 5,
    tier: "Pro",
    verified: true,
    game: "Fortnite",
  },
  {
    id: "8",
    name: "Connor",
    handle: "@conn",
    avatar: "CN",
    role: "Weekend Warrior",
    content:
      "bought the 7 day just to test it out, ended up buying the month same day. been playing since cod4 and this is the first tool that actually feels like an extension of my aim rather than aimbotting",
    rating: 5,
    tier: "Basic",
    verified: true,
    game: "Roblox",
  },
];

/* ------------------------------------------------------------------ */
/*  Avatar Generator                                                  */
/* ------------------------------------------------------------------ */
function Avatar({ initials, tier }: { initials: string; tier: string }) {
  const tierColors: Record<string, string> = {
    Basic: "from-slate-400 to-slate-600",
    Pro: "from-vivid-primary to-blue-500",
    Enterprise: "from-amber-400 to-orange-500",
  };

  return (
    <div
      className={cn(
        "w-11 h-11 rounded-full bg-gradient-to-br flex items-center justify-center text-sm font-bold text-white shadow-lg",
        tierColors[tier] || tierColors.Basic
      )}
    >
      {initials}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Star Rating                                                       */
/* ------------------------------------------------------------------ */
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "w-3.5 h-3.5 transition-colors duration-300",
            i < rating
              ? "text-amber-400 fill-amber-400"
              : "text-vivid-border fill-transparent"
          )}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Individual Testimonial Card                                       */
/* ------------------------------------------------------------------ */
function TestimonialCard({
  testimonial,
}: {
  testimonial: Testimonial;
}) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      style={{ willChange: "transform" }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group relative flex-shrink-0 w-[300px] sm:w-[360px] md:w-[420px]"
    >
      {/* Glow backdrop */}
      <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-vivid-primary/0 via-vivid-primary/10 to-vivid-primary/0 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-700" />

      <div
        className={cn(
          "relative h-full rounded-2xl border border-vivid-border/40 bg-vivid-surface/40 backdrop-blur-xl p-6",
          "transition-all duration-500",
          "group-hover:border-vivid-border/70 group-hover:bg-vivid-surface/70",
          "flex flex-col gap-4 gpu-animate"
        )}
      >
        {/* Quote icon */}
        <Quote className="w-8 h-8 text-vivid-primary/20 group-hover:text-vivid-primary/40 transition-colors duration-500" />

        {/* Content */}
        <p className="text-[15px] text-vivid-text leading-relaxed flex-1">
          &ldquo;{testimonial.content}&rdquo;
        </p>

        {/* Game tag */}
        {testimonial.game && (
          <div className="inline-flex self-start px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[11px] text-vivid-textMuted font-medium uppercase tracking-wider">
            {testimonial.game}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-vivid-border/30">
          <div className="flex items-center gap-3">
            <Avatar initials={testimonial.avatar} tier={testimonial.tier} />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-semibold text-white">
                  {testimonial.name}
                </span>
                {testimonial.verified && (
                  <BadgeCheck className="w-3.5 h-3.5 text-vivid-primary" />
                )}
              </div>
              <span className="text-xs text-vivid-textMuted">
                {testimonial.role}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1">
            <StarRating rating={testimonial.rating} />
            <span
              className={cn(
                "text-[10px] font-semibold uppercase tracking-wider",
                testimonial.tier === "Enterprise" && "text-amber-400",
                testimonial.tier === "Pro" && "text-vivid-primary",
                testimonial.tier === "Basic" && "text-slate-400"
              )}
            >
              {testimonial.tier}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Marquee Row                                                       */
/* ------------------------------------------------------------------ */
function MarqueeRow({
  items,
  direction = "left",
  speed = 40,
  isPaused,
}: {
  items: Testimonial[];
  direction?: "left" | "right";
  speed?: number;
  isPaused: boolean;
}) {
  const rowRef = useRef<HTMLDivElement>(null);

  // Duplicate for seamless loop
  const duplicated = [...items, ...items, ...items];

  const animationStyle: React.CSSProperties = {
    animationPlayState: isPaused ? "paused" : "running",
  };

  return (
    <div className="relative overflow-hidden py-2">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-r from-vivid-bg to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-l from-vivid-bg to-transparent z-10 pointer-events-none" />

      <div
        ref={rowRef}
        className={cn(
          "flex gap-5 w-max",
          direction === "left" ? "animate-marquee-left" : "animate-marquee-right"
        )}
        style={{
          ...animationStyle,
          animationDuration: `${speed}s`,
        }}
      >
        {duplicated.map((t, i) => (
          <TestimonialCard key={`${t.id}-${i}`} testimonial={t} />
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Section                                                           */
/* ------------------------------------------------------------------ */
export default function TestimonialsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".testimonials-title",
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 85%",
          },
        }
      );

      gsap.fromTo(
        ".testimonials-subtitle",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          delay: 0.15,
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 85%",
          },
        }
      );

      gsap.fromTo(
        ".testimonials-stats",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          delay: 0.3,
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 85%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const row1 = testimonials.slice(0, 4);
  const row2 = testimonials.slice(4, 8);

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      className="relative section-padding overflow-hidden"
    >
      {/* Background ambiance */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-vivid-primary/[0.03] rounded-full blur-[180px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[400px] bg-purple-500/[0.02] rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div ref={titleRef} className="text-center mb-16 px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-vivid-primary/10 border border-vivid-primary/20 text-vivid-primary text-sm font-medium mb-8"
          >
            <Star className="w-4 h-4 fill-vivid-primary" />
            Trusted by Gamers
          </motion.div>

          <h2 className="testimonials-title text-fluid-3xl font-bold mb-4 md:mb-6 text-balance">
            Loved by{" "}
            <span className="gradient-text">Thousands</span>
          </h2>
          <p className="testimonials-subtitle text-fluid-base text-vivid-textMuted max-w-2xl mx-auto leading-relaxed px-4">
            Join over 12,000 players who have elevated their game with
            VIVID&apos;s AI-powered precision.
          </p>

          {/* Trust stats */}
          <div className="testimonials-stats flex flex-wrap justify-center gap-8 md:gap-16 mt-12">
            {[
              { value: "12K+", label: "Active Users" },
              { value: "4.9/5", label: "Average Rating" },
              { value: "99.2%", label: "Uptime" },
              { value: "24/7", label: "Support" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white">
                  {stat.value}
              </div>
                <div className="text-xs sm:text-sm text-vivid-textMuted uppercase tracking-widest mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Marquee rows */}
        <div
          className="space-y-5"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocus={() => setIsPaused(true)}
          onBlur={() => setIsPaused(false)}
        >
          <MarqueeRow
            items={row1}
            direction="left"
            speed={50}
            isPaused={isPaused}
          />
          <MarqueeRow
            items={row2}
            direction="right"
            speed={55}
            isPaused={isPaused}
          />
        </div>

        {/* Pause indicator */}
        <div className="flex justify-center mt-8">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsPaused((p) => !p)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-vivid-textMuted text-sm hover:text-white hover:border-white/20 transition-colors duration-300"
          >
            {isPaused ? (
              <>
                <Play className="w-3.5 h-3.5" /> Resume
              </>
            ) : (
              <>
                <Pause className="w-3.5 h-3.5" /> Pause
              </>
            )}
          </motion.button>
        </div>
      </div>
    </section>
  );
}
