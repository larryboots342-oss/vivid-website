"use client";

import Link from "next/link";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { AmbientGlow } from "@/components/marketing/ambient-glow";
import { ArrowRight, Download } from "lucide-react";

export default function CTASection() {
  const sectionRef = useScrollReveal({
    selector: ".cta-content",
    y: 60,
    scale: 0.95,
    duration: 1,
  });

  return (
    <section className="relative section-padding overflow-hidden">
      <AmbientGlow className="bg-vivid-primary/5" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div ref={sectionRef} className="cta-content gpu-animate">
          <h2 className="text-fluid-3xl font-bold text-white mb-4 md:mb-6 text-balance">
            Ready to <span className="gradient-text">dominate</span>?
          </h2>
          <p className="text-vivid-textMuted text-fluid-base max-w-2xl mx-auto mb-8 md:mb-10 leading-relaxed px-4">
            Join thousands of gamers who have already upgraded their experience.
            Download VIVID for free and see the difference.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/download"
              className="group inline-flex items-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl bg-vivid-primary text-vivid-bg font-bold text-base sm:text-lg hover:bg-vivid-primaryDim transition-all duration-300 glow-primary-strong active:scale-95 sm:hover:scale-105 touch-target"
            >
              <Download className="w-5 h-5 flex-shrink-0" />
              Download Free
            </Link>
            <Link
              href="/pricing"
              className="group inline-flex items-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl border border-vivid-border/60 text-white font-semibold hover:bg-white/5 backdrop-blur-sm transition-all duration-300 hover:border-vivid-primary/30 active:scale-95 sm:hover:scale-105 touch-target"
            >
              View Pricing
              <ArrowRight className="w-5 h-5 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
