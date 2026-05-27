"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { SectionHeader } from "@/components/marketing/section-header";
import { GlowCard } from "@/components/ui/glow-card";
import { MagneticButton } from "@/components/ui/magnetic-button";
import {
  Check,
  X,
  Zap,
  Infinity,
  Clock,
  Crown,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { PLANS, type PlanConfig } from "@/lib/constants";
import { cn } from "@/lib/utils";

function PlanCard({ plan, index }: { plan: PlanConfig; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const isPopular = plan.popular;

  return (
    <GlowCard
      delay={index * 0.12}
      className="overflow-visible"
      glowColor=
        isPopular
          ? "rgba(0, 245, 255, 0.1)"
          : "rgba(0, 229, 255, 0.06)"
      }
    >
      <motion.div
        layout
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          "relative rounded-2xl border p-7 sm:p-8 transition-all duration-500 gpu-animate flex flex-col h-full",
          isPopular
            ? "border-vivid-primary/40 bg-gradient-to-b from-vivid-primary/[0.08] to-transparent shadow-[0_0_40px_rgba(0,245,255,0.08)]"
            : "border-vivid-border/50 bg-vivid-surface/30 hover:border-vivid-primary/25 hover:bg-vivid-surface/50"
        )}
        style={{
          transform: isHovered && !isPopular ? "translateY(-6px)" : undefined,
        }}
      >
      {/* Popular glow */}
      {isPopular && (
        <div className="absolute -top-px left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-vivid-primary to-transparent" />
      )}

      {/* Badge */}
      {plan.badge && (
        <div
          className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
          style={{
            backgroundColor: `${plan.badgeColor}15`,
            border: `1px solid ${plan.badgeColor}40`,
            color: plan.badgeColor,
          }}
        >
          {plan.badge}
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div
            className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center",
              isPopular ? "bg-vivid-primary/15" : "bg-white/5"
            )}
          >
            {plan.id === "pro" && <Zap className="w-6 h-6 text-vivid-primary" />}
            {plan.id === "elite" && <Sparkles className="w-6 h-6 text-purple-400" />}
            {plan.id === "enterprise" && <Crown className="w-6 h-6 text-green-400" />}
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{plan.name}</h3>
            <p className="text-xs text-vivid-textDim uppercase tracking-wider">
              {plan.durationLabel}
            </p>
          </div>
        </div>

        <div className="flex items-baseline gap-1 mb-2">
          <span className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
            £{plan.price}
          </span>
          <span className="text-vivid-textMuted text-sm">one-time</span>
        </div>
        <p className="text-base text-vivid-textMuted leading-relaxed">
          {plan.description}
        </p>
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-vivid-border/60 to-transparent mb-6" />

      {/* Features */}
      <ul className="space-y-3.5 mb-8 flex-1">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-vivid-primary/10 flex items-center justify-center shrink-0 mt-0.5">
              <Check className="w-3 h-3 text-vivid-primary" />
            </div>
            <span className="text-base text-vivid-text">{feature}</span>
          </li>
        ))}
        {plan.notIncluded?.map((feature) => (
          <li key={feature} className="flex items-start gap-3 opacity-40">
            <div className="w-5 h-5 rounded-full bg-vivid-border flex items-center justify-center shrink-0 mt-0.5">
              <X className="w-3 h-3 text-vivid-textDim" />
            </div>
            <span className="text-base text-vivid-textMuted">{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <MagneticButton
        href={`/checkout/stripe?tier=${plan.id}`}
        className={cn(
          "group relative flex items-center justify-center gap-2 w-full px-6 py-4 rounded-xl font-bold text-sm transition-all duration-300 overflow-hidden touch-target",
          isPopular
            ? "bg-vivid-primary text-vivid-bg hover:shadow-[0_0_30px_rgba(0,245,255,0.3)]"
            : "bg-white/5 text-white border border-vivid-border/60 hover:border-vivid-primary/40 hover:bg-vivid-primary/10"
        )}
        strength={0.15}
      >
        <span className="relative z-10">Get {plan.name}</span>
        <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
      </MagneticButton>
      </motion.div>
    </GlowCard>
  );
}

export default function PricingSection() {
  const sectionRef = useScrollReveal({ selector: ".pricing-title", y: 50 });

  return (
    <section id="pricing" className="relative section-padding">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-vivid-primary/[0.02] rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div ref={sectionRef} className="mb-16">
          <SectionHeader
            className="pricing-title"
            badge={{ icon: Crown, label: "License Tiers" }}
            title={
              <>
                Choose Your <span className="gradient-text">Access</span>
              </>
            }
            subtitle="One-time purchase. Instant delivery. No recurring fees. Your license key is emailed immediately after payment."
          />
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {PLANS.map((plan, i) => (
            <PlanCard key={plan.id} plan={plan} index={i} />
          ))}
        </div>

        {/* Trust footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex flex-wrap items-center justify-center gap-6 px-8 py-4 rounded-2xl border border-vivid-border/30 bg-vivid-surface/20">
            <div className="flex items-center gap-2 text-sm text-vivid-textMuted">
              <Check className="w-4 h-4 text-vivid-primary" />
              Instant Email Delivery
            </div>
            <div className="flex items-center gap-2 text-sm text-vivid-textMuted">
              <Check className="w-4 h-4 text-vivid-primary" />
              Secure Stripe Checkout
            </div>
            <div className="flex items-center gap-2 text-sm text-vivid-textMuted">
              <Check className="w-4 h-4 text-vivid-primary" />
              HWID Protection
            </div>
            <div className="flex items-center gap-2 text-sm text-vivid-textMuted">
              <Check className="w-4 h-4 text-vivid-primary" />
              24/7 Support
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
