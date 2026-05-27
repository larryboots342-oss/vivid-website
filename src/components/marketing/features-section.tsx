"use client";

import { motion } from "framer-motion";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { AmbientGlow } from "@/components/marketing/ambient-glow";
import { SectionHeader } from "@/components/marketing/section-header";
import { GlowCard } from "@/components/ui/glow-card";
import { containerVariants, itemVariants } from "@/lib/animations";
import {
  Activity,
  BrainCircuit,
  Cpu,
  Eye,
  Gauge,
  Shield,
} from "lucide-react";

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
  const titleRef = useScrollReveal({ selector: ".features-title", y: 50 });
  const cardsRef = useScrollReveal({
    selector: ".feature-card",
    y: 60,
    scale: 0.95,
    stagger: 0.1,
  });

  return (
    <section id="features" className="relative section-padding overflow-hidden">
      <AmbientGlow />

      <div className="max-w-7xl mx-auto relative z-10">
        <div ref={titleRef} className="mb-16 md:mb-20">
          <SectionHeader
            className="features-title"
            badge={{ icon: Activity, label: "Feature Highlights" }}
            title={
              <>
                Powerful <span className="gradient-text">Features</span>
              </>
            }
            subtitle="Every feature is designed around performance, privacy, and precision. No bloat. Just results."
          />
        </div>

        <motion.div
          ref={cardsRef}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, i) => (
            <motion.div key={feature.title} variants={itemVariants}>
              <GlowCard delay={i * 0.1}>
                <div className="feature-card group p-6 sm:p-8 rounded-2xl border border-vivid-border/50 bg-vivid-surface/40 hover:bg-vivid-surface/60 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:border-vivid-primary/20 active:scale-[0.98]">
                  <div className="w-14 h-14 rounded-2xl bg-vivid-primary/10 flex items-center justify-center mb-6 group-hover:bg-vivid-primary/20 group-hover:scale-110 transition-all duration-300">
                    <feature.icon className="w-7 h-7 text-vivid-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 break-words">
                    {feature.title}
                  </h3>
                  <p className="text-vivid-textMuted text-sm md:text-base leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </GlowCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
