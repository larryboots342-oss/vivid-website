"use client";

import { useRef, useEffect, Suspense, lazy } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { MagneticButton } from "@/components/ui/magnetic-button";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  Zap,
  Shield,
  Users,
  Star,
  Cpu,
  Sparkles,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

// Heavy 3D scene — skip in dev to keep compile times fast
const ThreeScene =
  process.env.NODE_ENV === "development"
    ? () => null
    : lazy(() => import("./three-scene"));

const trustIndicators = [
  { icon: Shield, label: "Private & Secure" },
  { icon: Cpu, label: "GPU Accelerated" },
  { icon: Zap, label: "Low Latency" },
  { icon: Users, label: "Active Community" },
];

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollProgressRef = useRef(0);
  const textRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -100]);
  const orbY1 = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const orbY2 = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const orbY3 = useTransform(scrollYProgress, [0, 1], [0, -60]);

  // Update scroll progress ref for 3D scene
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (v) => {
      scrollProgressRef.current = v;
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  // GSAP entrance animations
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Text reveal
      gsap.fromTo(
        ".hero-title-line",
        { y: 80, opacity: 0, rotateX: 45 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 1,
          ease: "power3.out",
          stagger: 0.12,
          delay: 0.3,
        }
      );

      gsap.fromTo(
        ".hero-subtitle",
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out", delay: 0.8 }
      );

      gsap.fromTo(
        ".hero-cta",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out", delay: 1.1 }
      );

      gsap.fromTo(
        ".hero-trust",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out", delay: 1.4 }
      );

      // UI panels fly in on scroll
      gsap.fromTo(
        ".ui-panel",
        { x: 100, opacity: 0, scale: 0.8 },
        {
          x: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: "back.out(1.2)",
          stagger: 0.15,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "40% top",
            scrub: 1,
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100dvh] md:min-h-[200vh] overflow-hidden"
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-vivid-bg" />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] rounded-full opacity-30 gpu-layer"
          style={{
            y: orbY1,
            background:
              "radial-gradient(circle, rgba(0,245,255,0.15) 0%, rgba(0,229,255,0.05) 40%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        <motion.div
          className="absolute top-1/3 right-1/4 w-[600px] h-[600px] rounded-full opacity-20 gpu-layer"
          style={{
            y: orbY2,
            background:
              "radial-gradient(circle, rgba(0,200,204,0.2) 0%, transparent 60%)",
            filter: "blur(60px)",
            animation: "pulseGlow 8s ease-in-out infinite",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] rounded-full opacity-15 gpu-layer"
          style={{
            y: orbY3,
            background:
              "radial-gradient(circle, rgba(0,153,170,0.15) 0%, transparent 60%)",
            filter: "blur(50px)",
            animation: "pulseGlow 10s ease-in-out infinite reverse",
          }}
        />
      </div>

      {/* 3D Scene */}
      <div className="sticky top-0 h-[100dvh]">
        <Suspense
          fallback={
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-vivid-primary to-vivid-primaryDim flex items-center justify-center animate-pulse">
                <span className="text-4xl font-bold text-vivid-bg">V</span>
              </div>
            </div>
          }
        >
          <ThreeScene scrollProgress={scrollProgressRef} />
        </Suspense>

        {/* Text overlay */}
        <motion.div
          ref={textRef}
          style={{ opacity, scale, y }}
          className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none"
        >
          <div className="text-center max-w-5xl mx-auto px-6">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-vivid-primary/10 border border-vivid-primary/20 text-vivid-primary text-sm font-medium mb-8 pointer-events-auto backdrop-blur-sm gpu-animate"
            >
              <Sparkles className="w-4 h-4" />
              Next-Gen AI Gaming Assistant
            </motion.div>

            {/* Title */}
            <h1 className="text-fluid-5xl font-bold leading-[0.95] tracking-tight mb-6 md:mb-8 perspective-1000 text-balance">
              <span className="hero-title-line block gradient-text">
                VIVID
              </span>
              <span className="hero-title-line block text-white mt-2">
                AI Engine
              </span>
            </h1>

            {/* Subtitle */}
            <p className="hero-subtitle text-fluid-base text-vivid-textMuted max-w-2xl mx-auto mb-8 md:mb-10 leading-relaxed px-2">
              GPU-accelerated performance. Hardware-optimized inference.
              <span className="hidden md:inline"><br /></span>{" "}
              Experience the next generation of intelligent gaming assistance.
            </p>

            {/* CTAs */}
            <div className="hero-cta flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 pointer-events-auto px-4">
              <MagneticButton
                href="/pricing"
                className="group inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl bg-vivid-primary text-vivid-bg font-bold text-base sm:text-lg hover:bg-vivid-primaryDim transition-all duration-300 glow-primary-strong active:scale-95 gpu-animate touch-target"
                strength={0.2}
              >
                Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </MagneticButton>
              <MagneticButton
                href="/pricing"
                className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl border border-vivid-border/60 text-white font-semibold hover:bg-white/5 backdrop-blur-sm transition-all duration-300 hover:border-vivid-primary/30 active:scale-95 gpu-animate touch-target"
                strength={0.2}
              >
                View Pricing
              </MagneticButton>
            </div>

            {/* Trust indicators */}
            <div className="hero-trust mt-8 md:mt-12 flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-10 px-4">
              {trustIndicators.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-2 text-vivid-textMuted text-sm gpu-animate"
                >
                  <item.icon className="w-4 h-4 text-vivid-primary" />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-vivid-textDim text-xs uppercase tracking-widest">
              Scroll to explore
            </span>
            <div className="w-5 h-8 rounded-full border border-vivid-textDim/30 flex items-start justify-center p-1">
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-1 h-2 rounded-full bg-vivid-primary"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
