import PricingSection from "@/components/marketing/pricing-section";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Choose the plan that fits your needs. Upgrade or downgrade anytime.",
};

export default function PricingPage() {
  return (
    <div className="pt-32 pb-16">
      <PricingSection />
    </div>
  );
}
