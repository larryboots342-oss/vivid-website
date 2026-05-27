"use client";

import { motion } from "framer-motion";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { SectionHeader } from "@/components/marketing/section-header";
import { GlowCard } from "@/components/ui/glow-card";
import { containerVariants, itemVariants } from "@/lib/animations";
import { Check, Clock } from "lucide-react";

const games = [
  {
    name: "Roblox",
    status: "available" as const,
    statusText: "Available Now",
    description: "Fully optimized with intelligent target acquisition.",
    color: "from-red-500/20 to-orange-500/20",
    borderColor: "border-red-500/30",
    accent: "text-red-400",
  },
  {
    name: "Fortnite",
    status: "soon" as const,
    statusText: "Coming Very Soon",
    description: "Building precision assistance for Battle Royale.",
    color: "from-purple-500/20 to-pink-500/20",
    borderColor: "border-purple-500/30",
    accent: "text-purple-400",
  },
  {
    name: "Counter-Strike 2",
    status: "soon" as const,
    statusText: "Coming Very Soon",
    description: "Tactical precision for competitive play.",
    color: "from-yellow-500/20 to-orange-500/20",
    borderColor: "border-yellow-500/30",
    accent: "text-yellow-400",
  },
  {
    name: "Overwatch 2",
    status: "soon" as const,
    statusText: "Coming Very Soon",
    description: "Hero-based assistance optimized for every role.",
    color: "from-orange-500/20 to-red-500/20",
    borderColor: "border-orange-500/30",
    accent: "text-orange-400",
  },
  {
    name: "Apex Legends",
    status: "soon" as const,
    statusText: "Coming Very Soon",
    description: "Legend-agnostic precision for the Arena.",
    color: "from-red-500/20 to-red-700/20",
    borderColor: "border-red-500/30",
    accent: "text-red-400",
  },
  {
    name: "Valorant",
    status: "soon" as const,
    statusText: "Coming Very Soon",
    description: "Tactical shooter precision at its finest.",
    color: "from-red-500/20 to-pink-500/20",
    borderColor: "border-red-500/30",
    accent: "text-red-400",
  },
];

export default function GameCardsSection() {
  const titleRef = useScrollReveal({ selector: ".games-title", y: 50 });
  const cardsRef = useScrollReveal({
    selector: ".game-card",
    y: 60,
    scale: 0.95,
    stagger: 0.08,
  });

  return (
    <section id="showcase" className="relative section-padding">
      <div className="max-w-7xl mx-auto">
        <div ref={titleRef} className="mb-16 md:mb-20">
          <SectionHeader
            className="games-title"
            badge={{ icon: Clock, label: "Platform Support" }}
            title={
              <>
                Supported <span className="gradient-text">Platforms</span>
              </>
            }
            subtitle="Currently optimized for Roblox, with more platforms launching very soon. Our AI models adapt to each game's unique mechanics."
          />
        </div>

        <motion.div
          ref={cardsRef}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="game-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-4 sm:px-0"
        >
          {games.map((game, i) => (
            <motion.div key={game.name} variants={itemVariants}>
              <GlowCard delay={i * 0.08}>
                <div
                  className={`game-card group relative rounded-2xl border ${game.borderColor} bg-gradient-to-br ${game.color} p-5 sm:p-8 overflow-hidden hover:-translate-y-2 transition-all duration-500 gpu-animate active:scale-[0.98] break-words`}
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-vivid-primary/5" />

                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
                      <h3 className="text-xl sm:text-2xl font-bold text-white">{game.name}</h3>
                      {game.status === "available" ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-semibold border border-green-500/30">
                          <Check className="w-3 h-3" />
                          {game.statusText}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold border border-amber-500/20">
                          <Clock className="w-3 h-3" />
                          {game.statusText}
                        </span>
                      )}
                    </div>

                    <p className="text-vivid-textMuted mb-6">{game.description}</p>

                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-current opacity-60" />
                      <span className={`text-sm ${game.accent} font-medium`}>
                        {game.status === "available"
                          ? "Active Development"
                          : "In Development"}
                      </span>
                    </div>
                  </div>
                </div>
              </GlowCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
