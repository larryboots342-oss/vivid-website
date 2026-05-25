import { Suspense } from "react";
import dynamic from "next/dynamic";
import HeroSection from "@/components/marketing/hero-section";

/* ── Below-the-fold sections loaded lazily ────────────────────────── */
const FeaturesShowcase = dynamic(
  () => import("@/components/marketing/features-showcase"),
  {
    loading: () => (
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="h-12 w-1/3 bg-white/5 rounded-lg animate-pulse mb-16 mx-auto" />
          <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-[180px] gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl bg-white/5 border border-white/5 animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    ),
  }
);

const TestimonialsSection = dynamic(
  () => import("@/components/marketing/testimonials-section"),
  {
    loading: () => (
      <section className="py-32 overflow-hidden">
        <div className="h-12 w-1/3 bg-white/5 rounded-lg animate-pulse mb-16 mx-auto" />
        <div className="space-y-5">
          {Array.from({ length: 2 }).map((_, r) => (
            <div key={r} className="flex gap-5 px-6">
              {Array.from({ length: 4 }).map((_, c) => (
                <div
                  key={c}
                  className="w-[360px] h-[180px] rounded-2xl bg-white/5 border border-white/5 animate-pulse shrink-0"
                />
              ))}
            </div>
          ))}
        </div>
      </section>
    ),
  }
);

const GameCardsSection = dynamic(
  () => import("@/components/marketing/game-cards-section"),
  {
    loading: () => (
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="h-12 w-1/3 bg-white/5 rounded-lg animate-pulse mb-16 mx-auto" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-48 rounded-2xl bg-white/5 border border-white/5 animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    ),
  }
);

const PricingSection = dynamic(
  () => import("@/components/marketing/pricing-section"),
  {
    loading: () => (
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="h-12 w-1/3 bg-white/5 rounded-lg animate-pulse mb-16 mx-auto" />
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-96 rounded-2xl bg-white/5 border border-white/5 animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    ),
  }
);

const FAQSection = dynamic(
  () => import("@/components/marketing/faq-section"),
  {
    loading: () => (
      <section className="py-32 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="h-12 w-1/3 bg-white/5 rounded-lg animate-pulse mb-16 mx-auto" />
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-16 rounded-2xl bg-white/5 border border-white/5 animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    ),
  }
);

const CTASection = dynamic(
  () => import("@/components/marketing/cta-section"),
  {
    loading: () => (
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="h-12 w-2/3 bg-white/5 rounded-lg animate-pulse mb-8 mx-auto" />
          <div className="h-20 w-1/2 bg-white/5 rounded-lg animate-pulse mx-auto" />
        </div>
      </section>
    ),
  }
);

const SoftwareGuiHero = dynamic(
  () => import("@/components/marketing/software-gui-hero"),
  {
    loading: () => (
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="h-[400px] rounded-2xl bg-white/5 border border-white/5 animate-pulse" />
        </div>
      </section>
    ),
  }
);

const VideoPreviews = dynamic(
  () => import("@/components/marketing/video-previews"),
  {
    loading: () => (
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-video rounded-2xl bg-white/5 border border-white/5 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    ),
  }
);

export default function Home() {
  return (
    <main className="relative">
      {/* Hero is critical — load immediately */}
      <HeroSection />

      {/* Everything below the fold is lazy-loaded with skeletons */}
      <div className="relative z-10 bg-vivid-bg">
        <Suspense fallback={null}>
          <SoftwareGuiHero />
        </Suspense>
        <Suspense fallback={null}>
          <FeaturesShowcase />
        </Suspense>
        <Suspense fallback={null}>
          <VideoPreviews />
        </Suspense>
        <Suspense fallback={null}>
          <TestimonialsSection />
        </Suspense>
        <Suspense fallback={null}>
          <GameCardsSection />
        </Suspense>
        <Suspense fallback={null}>
          <PricingSection />
        </Suspense>
        <Suspense fallback={null}>
          <FAQSection />
        </Suspense>
        <Suspense fallback={null}>
          <CTASection />
        </Suspense>
      </div>
    </main>
  );
}
