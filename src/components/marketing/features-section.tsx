"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Activity,
  BrainCircuit,
  Cpu,
  Eye,
  Gauge,
  Shield,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: BrainCircuit,
    title: "Local AI Inference",
    description:
      "Our models run entirely on your GPU using DirectML and ONNX Runtime. No cloud processing, no latency, complete privacy.",
  },
  {
    icon: Gauge,
    title: "Real-time FPS Monitoring",
    description:
      "Built-in performance bar tracks your hardware in real-time. Optimize settings on the fly for maximum smoothness.",
  },
  {
    icon: Cpu,
    title: "Hardware-Accelerated",
    description:
      "Leverages DirectML, CUDA, and TensorRT for maximum inference speed. ~4.2ms per frame on modern GPUs.",
  },
  {
    icon: Eye,
    title: "Intelligent Targeting",
    description:
      "YOLO-based neural networks trained on custom datasets provide precise, game-aware assistance.",
  },
  {
    icon: Shield,
    title: "Privacy First",
    description:
      "Everything runs locally on your machine. No data leaves your PC. No telemetry. No logging of your gameplay.",
  },
  {
    icon: Activity,
    title: "Adaptive Smoothing",
    description:
      "Kalman-filtered motion paths with configurable curves. Linear, exponential, adaptive, Perlin noise, and cubic bezier.",
  },
];

export default function FeaturesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo(
        ".features-title",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
          },
        }
      );

      // Cards stagger
      gsap.fromTo(
        ".feature-card",
        { y: 60, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: cardsRef.current,
            start: "top 85%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="features" ref={sectionRef} className="relative section-padding overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-vivid-primary/3 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="features-title text-center mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-vivid-primary/10 border border-vivid-primary/20 text-vivid-primary text-xs font-semibold uppercase tracking-wider mb-6">
            <Activity className="w-3.5 h-3.5" />
            Feature Highlights
          </div>
          <h2 className="text-fluid-3xl font-bold mb-4 md:mb-6 text-balance">
            Powerful <span className="gradient-text">Features</span>
          </h2>
          <p className="text-vivid-textMuted text-fluid-base max-w-2xl mx-auto leading-relaxed px-4">
            Every feature is designed around performance, privacy, and precision.
            No bloat. Just results.
          </p>
        </div>

        <div ref={cardsRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="feature-card group p-6 sm:p-8 rounded-2xl border border-vivid-border/50 bg-vivid-surface/40 hover:bg-vivid-surface/60 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:border-vivid-primary/20 active:scale-[0.98]"
            >
              <div className="w-14 h-14 rounded-2xl bg-vivid-primary/10 flex items-center justify-center mb-6 group-hover:bg-vivid-primary/20 group-hover:scale-110 transition-all duration-300">
                <feature.icon className="w-7 h-7 text-vivid-primary" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-vivid-textMuted text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
