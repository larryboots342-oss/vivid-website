"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  BrainCircuit,
  Cpu,
  Shield,
  Gauge,
  Gamepad2,
  Activity,
  Layers,
  Code2,
  Zap,
  Eye,
  Fingerprint,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

interface FeatureCard {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  size: "small" | "medium" | "large" | "wide";
  gradient: string;
  accentColor: string;
  glowColor: string;
  stats?: { label: string; value: string };
}

const features: FeatureCard[] = [
  {
    id: "ai-inference",
    title: "Local AI Inference",
    description:
      "Our models run entirely on your GPU using DirectML and ONNX Runtime. Zero cloud latency, complete privacy.",
    icon: BrainCircuit,
    size: "large",
    gradient: "from-vivid-primary/20 via-vivid-primary/5 to-transparent",
    accentColor: "text-vivid-primary",
    glowColor: "rgba(0, 245, 255, 0.15)",
    stats: { label: "Inference Time", value: "< 4.2ms" },
  },
  {
    id: "gpu-accel",
    title: "GPU Accelerated",
    description: "DirectML, CUDA, and TensorRT support for maximum speed.",
    icon: Cpu,
    size: "small",
    gradient: "from-purple-500/20 via-purple-500/5 to-transparent",
    accentColor: "text-purple-400",
    glowColor: "rgba(168, 85, 247, 0.15)",
  },
  {
    id: "privacy",
    title: "Privacy First",
    description:
      "Everything runs locally. No data leaves your PC. No telemetry. No logging.",
    icon: Shield,
    size: "medium",
    gradient: "from-green-500/20 via-green-500/5 to-transparent",
    accentColor: "text-green-400",
    glowColor: "rgba(74, 222, 128, 0.15)",
    stats: { label: "Data Shared", value: "0 bytes" },
  },
  {
    id: "fps-monitor",
    title: "Real-time FPS Monitoring",
    description:
      "Built-in performance bar tracks hardware in real-time. Optimize settings on the fly.",
    icon: Gauge,
    size: "wide",
    gradient: "from-orange-500/20 via-orange-500/5 to-transparent",
    accentColor: "text-orange-400",
    glowColor: "rgba(251, 146, 60, 0.15)",
    stats: { label: "FPS Impact", value: "< 2%" },
  },
  {
    id: "multi-game",
    title: "Multi-Game Support",
    description: "Roblox, Fortnite, CS2, Valorant, and more coming soon.",
    icon: Gamepad2,
    size: "medium",
    gradient: "from-red-500/20 via-red-500/5 to-transparent",
    accentColor: "text-red-400",
    glowColor: "rgba(248, 113, 113, 0.15)",
    stats: { label: "Games", value: "6+" },
  },
  {
    id: "adaptive",
    title: "Adaptive Smoothing",
    description:
      "Kalman-filtered motion paths with configurable curves. Linear, exponential, Perlin noise.",
    icon: Activity,
    size: "small",
    gradient: "from-yellow-500/20 via-yellow-500/5 to-transparent",
    accentColor: "text-yellow-400",
    glowColor: "rgba(250, 204, 21, 0.15)",
  },
  {
    id: "custom-models",
    title: "Custom Model Training",
    description: "Train models on your own datasets for personalized targeting.",
    icon: Layers,
    size: "small",
    gradient: "from-pink-500/20 via-pink-500/5 to-transparent",
    accentColor: "text-pink-400",
    glowColor: "rgba(244, 114, 182, 0.15)",
  },
  {
    id: "api-access",
    title: "API Access",
    description: "RESTful API for programmatic license management.",
    icon: Code2,
    size: "medium",
    gradient: "from-cyan-500/20 via-cyan-500/5 to-transparent",
    accentColor: "text-cyan-400",
    glowColor: "rgba(34, 211, 238, 0.15)",
    stats: { label: "Uptime", value: "99.9%" },
  },
  {
    id: "intelligent",
    title: "Intelligent Targeting",
    description:
      "YOLO-based neural networks trained on custom datasets for precise, game-aware assistance.",
    icon: Eye,
    size: "wide",
    gradient: "from-indigo-500/20 via-indigo-500/5 to-transparent",
    accentColor: "text-indigo-400",
    glowColor: "rgba(129, 140, 248, 0.15)",
    stats: { label: "Accuracy", value: "99.2%" },
  },
  {
    id: "fingerprint",
    title: "Hardware Fingerprint",
    description: "Undetectable by anti-cheat systems through hardware-level operation.",
    icon: Fingerprint,
    size: "small",
    gradient: "from-emerald-500/20 via-emerald-500/5 to-transparent",
    accentColor: "text-emerald-400",
    glowColor: "rgba(52, 211, 153, 0.15)",
  },
  {
    id: "power",
    title: "Instant Power",
    description: "One-click activation with zero configuration required.",
    icon: Zap,
    size: "small",
    gradient: "from-amber-500/20 via-amber-500/5 to-transparent",
    accentColor: "text-amber-400",
    glowColor: "rgba(251, 191, 36, 0.15)",
  },
  {
    id: "premium",
    title: "Premium Experience",
    description: "Dedicated support, early access, and VIP Discord channel.",
    icon: Sparkles,
    size: "medium",
    gradient: "from-violet-500/20 via-violet-500/5 to-transparent",
    accentColor: "text-violet-400",
    glowColor: "rgba(167, 139, 250, 0.15)",
  },
];

/* ------------------------------------------------------------------ */
/*  Individual Feature Card                                           */
/* ------------------------------------------------------------------ */
function BentoCard({
  feature,
  index,
}: {
  feature: FeatureCard;
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const isInView = useInView(cardRef, { once: true, margin: "-50px" });
  const shouldReduceMotion = useReducedMotion();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const sizeClasses = {
    small: "col-span-1 row-span-1",
    medium: "col-span-1 row-span-1 md:row-span-2",
    large: "col-span-1 md:col-span-2 row-span-1 md:row-span-2",
    wide: "col-span-1 md:col-span-2 row-span-1",
  };

  const Icon = feature.icon;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={
        isInView
          ? { opacity: 1, y: 0, scale: 1 }
          : { opacity: 0, y: 40, scale: 0.95 }
      }
      transition={{
        duration: 0.6,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={cn("relative group gpu-animate", sizeClasses[feature.size])}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Spotlight effect */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0"
        style={{
          background: isHovered
            ? `radial-gradient(600px circle at ${mousePosition.x}% ${mousePosition.y}%, ${feature.glowColor}, transparent 40%)`
            : "none",
        }}
      />

      {/* Card */}
      <div
        className={cn(
          "relative h-full rounded-2xl border border-vivid-border/50 bg-vivid-surface/40 backdrop-blur-xl p-6 overflow-hidden transition-all duration-500 gpu-animate",
          "group-hover:border-vivid-border group-hover:bg-vivid-surface/60",
          "flex flex-col"
        )}
      >
        {/* Background gradient */}
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-700",
            feature.gradient
          )}
        />

        {/* Animated background blobs */}
        <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-700"
          style={{ background: feature.glowColor }}
        />
        <div className="absolute -bottom-10 -left-10 w-24 h-24 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-700 delay-100"
          style={{ background: feature.glowColor }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full">
          {/* Icon */}
          <motion.div
            className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300",
              "bg-white/5 border border-white/10",
              "group-hover:scale-110 group-hover:border-white/20"
            )}
            whileHover={shouldReduceMotion ? undefined : { rotate: [0, -10, 10, 0] }}
            transition={{ duration: 0.5 }}
          >
            <Icon
              className={cn(
                "w-6 h-6 transition-colors duration-300",
                feature.accentColor
              )}
            />
          </motion.div>

          {/* Title */}
          <h3 className="text-lg font-bold text-white mb-2 group-hover:text-vivid-primary transition-colors duration-300">
            {feature.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-vivid-textMuted leading-relaxed flex-1">
            {feature.description}
          </p>

          {/* Stats (if present) */}
          {feature.stats && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-4 pt-4 border-t border-vivid-border/30"
            >
              <p className="text-[10px] text-vivid-textDim uppercase tracking-widest mb-1">
                {feature.stats.label}
              </p>
              <p className={cn("text-2xl font-bold", feature.accentColor)}>
                {feature.stats.value}
              </p>
            </motion.div>
          )}

          {/* Decorative corner accent */}
          <div
            className="absolute top-0 right-0 w-20 h-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: `radial-gradient(circle at top right, ${feature.glowColor}, transparent 70%)`,
            }}
          />
        </div>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Section Component                                                 */
/* ------------------------------------------------------------------ */
export default function FeaturesShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".showcase-title",
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
        ".showcase-subtitle",
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
    }, sectionRef);

    return () => ctx.revert();
  }, [shouldReduceMotion]);

  return (
    <section
      id="features-showcase"
      ref={sectionRef}
      className="relative section-padding overflow-hidden"
    >
      {/* Ambient background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-vivid-primary/3 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/3 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div ref={titleRef} className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-vivid-primary/10 border border-vivid-primary/20 text-vivid-primary text-sm font-medium mb-8"
          >
            <Sparkles className="w-4 h-4" />
            Feature Highlights
          </motion.div>

          <h2 className="showcase-title text-fluid-3xl font-bold mb-4 md:mb-6 text-balance">
            Built for{" "}
            <span className="gradient-text">Performance</span>
          </h2>
          <p className="showcase-subtitle text-fluid-base text-vivid-textMuted max-w-2xl mx-auto leading-relaxed px-4">
            Every feature engineered for speed, privacy, and precision.
            Experience the next generation of AI-powered gaming assistance.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 auto-rows-[160px] sm:auto-rows-[180px] gap-3 sm:gap-4">
          {features.map((feature, index) => (
            <BentoCard key={feature.id} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
