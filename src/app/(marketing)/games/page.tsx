import GameCardsSection from "@/components/marketing/game-cards-section";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Games",
  description: "View supported game platforms for VIVID AI assistant.",
};

export default function GamesPage() {
  return (
    <div className="pt-32 pb-16">
      <GameCardsSection />
    </div>
  );
}
