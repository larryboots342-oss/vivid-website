import { Suspense } from "react";
import dynamic from "next/dynamic";
import HeroSection from "@/components/marketing/hero-section";
import { SkeletonHeader, SkeletonCard } from "@/components/ui/skeleton-card";
import { SkeletonGrid } from "@/components/ui/skeleton-grid";

/* ── Below-the-fold sections loaded lazily ────────────────────────── */
const FeaturesShowcase = dynamic(
  () => import("@/components/marketing/features-showcase"),
  {
    loading: () => (
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <SkeletonHeader />
          <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-[180px] gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <SkeletonCard key={i} className="h-full border border-white/5" />
            ))}
          </div>
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
          <SkeletonHeader />
          <SkeletonGrid count={6} className="md:grid-cols-2 lg:grid-cols-3" />
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
          <SkeletonHeader />
          <SkeletonGrid count={3} className="md:grid-cols-3 max-w-6xl mx-auto" />
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
          <SkeletonHeader />
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} className="h-16 border border-white/5" />
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
          <SkeletonCard className="h-12 w-2/3 mb-8 mx-auto" />
          <SkeletonCard className="h-20 w-1/2 mx-auto" />
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
          <SkeletonCard className="h-[400px] border border-white/5" />
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
              <SkeletonCard key={i} className="aspect-video border border-white/5" />
            ))}
          </div>
        </div>
      </section>
    ),
  }
);

const RealReviewsSection = dynamic(
  () => import("@/components/marketing/real-reviews"),
  {
    loading: () => (
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <SkeletonHeader />
          <SkeletonGrid count={3} className="md:grid-cols-2 lg:grid-cols-3" />
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
          <GameCardsSection />
        </Suspense>
        <Suspense fallback={null}>
          <PricingSection />
        </Suspense>
        <Suspense fallback={null}>
          <RealReviewsSection />
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
