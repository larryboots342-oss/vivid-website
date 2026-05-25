import FeaturesSection from "@/components/marketing/features-section";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Features",
  description: "Explore the powerful features of VIVID AI-powered gaming assistant.",
};

export default function FeaturesPage() {
  return (
    <div className="pt-32 pb-16">
      <FeaturesSection />
    </div>
  );
}
