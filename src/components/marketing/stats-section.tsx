"use client";

import { motion } from "framer-motion";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { SectionHeader } from "@/components/marketing/section-header";
import { TrendingUp, Users, Zap, Award } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: 12500,
    suffix: "+",
    label: "Active Users",
    description: "Gamers trust VIVID daily",
  },
  {
    icon: Zap,
    value: 4,
    suffix: "ms",
    label: "Inference Time",
    description: "Ultra-low latency",
  },
  {
    icon: TrendingUp,
    value: 99,
    suffix: "%",
    label: "Uptime",
    description: "Reliable performance",
  },
  {
    icon: Award,
    value: 6,
    suffix: "+",
    label: "Games Supported",
    description: "And growing weekly",
  },
];

export default function StatsSection() {
  return (
    <section className="relative section-padding overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-vivid-primary/[0.03] rounded-full blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16"
        >
          <SectionHeader
            badge={{ icon: TrendingUp, label: "By The Numbers" }}
            title={
              <>
                Trusted by <span className="gradient-text">Thousands</span>
              </>
            }
            subtitle="Real metrics from our growing community of competitive gamers."
          />
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: i * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group relative rounded-2xl border border-vivid-border/40 bg-vivid-surface/30 backdrop-blur-sm p-6 sm:p-8 text-center hover:border-vivid-primary/20 transition-all duration-500 hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-xl bg-vivid-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-vivid-primary/20 group-hover:scale-110 transition-all duration-300">
                <stat.icon className="w-6 h-6 text-vivid-primary" />
              </div>
              <div className="text-3xl sm:text-4xl font-bold text-white mb-2 tracking-tight">
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-sm font-semibold text-vivid-text mb-1">
                {stat.label}
              </div>
              <div className="text-xs text-vivid-textMuted">
                {stat.description}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
