"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AmbientGlow } from "@/components/marketing/ambient-glow";
import { SectionHeader } from "@/components/marketing/section-header";
import {
  Zap,
  Settings,
  Gamepad2,
  Target,
  Keyboard,
  CreditCard,
  Terminal,
  Circle,
  ChevronDown,
  Play,
  Square,
  Save,
  Trash2,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const sidebarItems = [
  { icon: CreditCard, label: "Subscription", active: false },
  { icon: Gamepad2, label: "Executor", active: true },
  { icon: Target, label: "AI Aimbot", active: false },
  { icon: Settings, label: "Settings", active: false },
  { icon: Zap, label: "Active Games", active: false },
  { icon: Gamepad2, label: "Discord", active: false },
];

const gameScripts = [
  "Arsenal",
  "Phantom Forces",
  "Bad Business",
  "Jailbreak",
  "Bedwars",
  "Da Hood",
  "Blox Fruits",
  "Doors",
];

export default function SoftwareGuiHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const guiRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // 3D rotation on scroll
      gsap.fromTo(
        guiRef.current,
        {
          rotateY: -15,
          rotateX: 8,
          scale: 0.85,
          opacity: 0,
        },
        {
          rotateY: 15,
          rotateX: -4,
          scale: 1,
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2,
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative py-24 sm:py-32 overflow-hidden"
      style={{ perspective: "1200px" }}
    >
      <AmbientGlow className="w-[800px] h-[600px] bg-vivid-primary/[0.03]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section header */}
        <div className="mb-16">
          <SectionHeader
            badge={{ icon: Gamepad2, label: "The Software" }}
            title={
              <>
                See It In <span className="gradient-text">Action</span>
              </>
            }
            subtitle="Scroll to explore the VIVID interface. Built for precision, designed for dominance."
          />
        </div>

        {/* 3D GUI Mockup */}
        <div
          ref={guiRef}
          className="max-w-5xl mx-auto"
          style={{ transformStyle: "preserve-3d" }}
        >
          <div
            className="rounded-xl overflow-hidden shadow-2xl shadow-black/60 border border-[#1a1a1a]"
            style={{
              background: "#080808",
              boxShadow: "0 25px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(0,229,255,0.08)",
            }}
          >
            {/* Main layout: sidebar + content */}
            <div className="flex" style={{ height: "520px" }}>
              {/* Sidebar */}
              <div
                className="w-[160px] sm:w-[180px] flex-shrink-0 flex flex-col py-4 px-2.5 gap-1"
                style={{ background: "#060606" }}
              >
                {/* Logo */}
                <div className="flex items-center gap-2 px-2 mb-6">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                    style={{ background: "#00e5ff" }}
                  >
                    V
                  </div>
                  <span className="text-white font-bold text-sm tracking-wide">
                    VIVID
                  </span>
                </div>

                {/* Nav items */}
                {sidebarItems.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors"
                    style={{
                      background: item.active ? "#131313" : "transparent",
                      color: item.active ? "#ffffff" : "#707070",
                      borderLeft: item.active
                        ? "3px solid #00e5ff"
                        : "3px solid transparent",
                      marginLeft: item.active ? "-2.5px" : "0",
                    }}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </div>
                ))}

                {/* Spacer */}
                <div className="flex-1" />

                {/* Status */}
                <div
                  className="px-3 py-2 rounded-lg"
                  style={{ background: "#0f0f0f" }}
                >
                  <div className="flex items-center gap-2">
                    <Circle className="w-2.5 h-2.5 fill-green-400 text-green-400" />
                    <span className="text-[10px] text-[#a0a0a0]">
                      System Ready
                    </span>
                  </div>
                </div>
              </div>

              {/* Right side */}
              <div className="flex-1 flex flex-col min-w-0">
                {/* Header bar */}
                <div
                  className="h-14 flex items-center justify-between px-5 flex-shrink-0"
                  style={{ background: "#0d0d0d" }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[#00e5ff] font-bold text-sm tracking-wide">
                      VIVID
                    </span>
                    <span className="text-[#404040]">/</span>
                    <span
                      className="px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider"
                      style={{ background: "#141414", color: "#a0a0a0" }}
                    >
                      Executor
                    </span>
                  </div>
                  <div
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg border cursor-pointer"
                    style={{ background: "#111111", borderColor: "#252525" }}
                  >
                    <div className="w-5 h-5 rounded-full bg-purple-500/80 flex items-center justify-center text-[10px] text-white font-bold">
                      U
                    </div>
                    <span className="text-[11px] text-[#a0a0a0]">Account</span>
                    <ChevronDown className="w-3 h-3 text-[#707070]" />
                  </div>
                </div>

                {/* Content area */}
                <div className="flex-1 p-3 overflow-hidden">
                  <div
                    className="h-full rounded-lg border flex overflow-hidden"
                    style={{ background: "#0a0a0a", borderColor: "#1a1a1a" }}
                  >
                    {/* Left panel - Game scripts */}
                    <div
                      className="w-[200px] flex-shrink-0 flex flex-col border-r"
                      style={{ background: "#0a0a0a", borderColor: "#1a1a1a" }}
                    >
                      {/* Roblox status */}
                      <div
                        className="px-3 py-2.5 border-b flex items-center justify-between"
                        style={{ borderColor: "#1a1a1a" }}
                      >
                        <div className="flex items-center gap-2">
                          <Circle className="w-2 h-2 fill-green-400 text-green-400" />
                          <span className="text-[10px] text-[#a0a0a0]">
                            Roblox
                          </span>
                        </div>
                        <div
                          className="w-8 h-4 rounded-full relative"
                          style={{ background: "#1a1a1a" }}
                        >
                          <div
                            className="absolute top-0.5 right-0.5 w-3 h-3 rounded-full"
                            style={{ background: "#00e5ff" }}
                          />
                        </div>
                      </div>

                      {/* Game scripts header */}
                      <div
                        className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5"
                        style={{ color: "#ff3860" }}
                      >
                        <Zap className="w-3 h-3" />
                        Game Scripts
                      </div>

                      {/* Game list */}
                      <div className="flex-1 overflow-hidden">
                        {gameScripts.map((game, i) => (
                          <div
                            key={game}
                            className="px-3 py-1.5 text-[11px] transition-colors cursor-pointer"
                            style={{
                              color: i === 0 ? "#ffffff" : "#707070",
                              background: i === 0 ? "#161616" : "transparent",
                            }}
                          >
                            {game}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right panel - Editor */}
                    <div
                      className="flex-1 flex flex-col min-w-0"
                      style={{ background: "#111111" }}
                    >
                      {/* Editor toolbar */}
                      <div
                        className="h-9 flex items-center gap-1 px-2 border-b flex-shrink-0"
                        style={{ borderColor: "#1a1a1a" }}
                      >
                        {[
                          { icon: Play, color: "#00ff9d" },
                          { icon: Square, color: "#ff3860" },
                          { icon: Save, color: "#00e5ff" },
                          { icon: Trash2, color: "#707070" },
                        ].map((btn, i) => (
                          <button
                            key={i}
                            className="w-7 h-7 rounded flex items-center justify-center transition-colors hover:bg-white/5"
                          >
                            <btn.icon
                              className="w-3.5 h-3.5"
                              style={{ color: btn.color }}
                            />
                          </button>
                        ))}
                      </div>

                      {/* Code area */}
                      <div
                        className="flex-1 p-4 font-mono text-[11px] leading-relaxed overflow-hidden"
                        style={{ color: "#a0a0a0" }}
                      >
                        <span style={{ color: "#b829dd" }}>local</span>{" "}
                        <span style={{ color: "#ffffff" }}>Vivid</span> ={" "}
                        <span style={{ color: "#00e5ff" }}>loadstring</span>(
                        <span style={{ color: "#00ff9d" }}>
                          &quot;https://vivid.gg/api/v2&quot;
                        </span>
                        )()
                        <br />
                        <br />
                        <span style={{ color: "#707070" }}>
                          -- Initialize AI Aimbot
                        </span>
                        <br />
                        <span style={{ color: "#ffffff" }}>Vivid</span>.
                        <span style={{ color: "#00e5ff" }}>aimbot</span>.
                        <span style={{ color: "#ffd600" }}>enable</span>({"{"}
                        <br />
                        &nbsp;&nbsp;
                        <span style={{ color: "#a0a0a0" }}>game</span> ={" "}
                        <span style={{ color: "#00ff9d" }}>
                          &quot;Arsenal&quot;
                        </span>
                        ,
                        <br />
                        &nbsp;&nbsp;
                        <span style={{ color: "#a0a0a0" }}>mode</span> ={" "}
                        <span style={{ color: "#00ff9d" }}>
                          &quot;precision&quot;
                        </span>
                        ,
                        <br />
                        &nbsp;&nbsp;
                        <span style={{ color: "#a0a0a0" }}>fov</span> ={" "}
                        <span style={{ color: "#ffd600" }}>120</span>
                        <br />
                        {"}"})
                        <br />
                        <br />
                        <span style={{ color: "#707070" }}>
                          -- Auto-attach on game start
                        </span>
                        <br />
                        <span style={{ color: "#ffffff" }}>Vivid</span>.
                        <span style={{ color: "#00e5ff" }}>autoAttach</span>(
                        <span style={{ color: "#00ff9d" }}>true</span>)
                        <br />
                        <br />
                        <span
                          className="animate-pulse"
                          style={{ color: "#00ff9d" }}
                        >
                          ✓ Ready — AI models loaded (4.2ms inference)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Console */}
                <div
                  className="h-[100px] flex-shrink-0 px-4 py-2 font-mono text-[10px] leading-5 overflow-hidden"
                  style={{ background: "#050505", color: "#707070" }}
                >
                  <div>
                    <span style={{ color: "#00e5ff" }}>[INFO]</span> VIVID
                    v2.7.0 initialized
                  </div>
                  <div>
                    <span style={{ color: "#00ff9d" }}>[OK]</span> ONNX Runtime
                    loaded (DirectML backend)
                  </div>
                  <div>
                    <span style={{ color: "#00e5ff" }}>[INFO]</span> Roblox
                    process detected (PID: 8424)
                  </div>
                  <div>
                    <span style={{ color: "#00ff9d" }}>[OK]</span> Auto-attach
                    enabled — monitoring for injection point
                  </div>
                  <div>
                    <span style={{ color: "#ffd600" }}>[WARN]</span> Arsenal
                    game profile loaded — custom configs applied
                  </div>
                </div>

                {/* Status bar */}
                <div
                  className="h-6 flex items-center justify-between px-4 flex-shrink-0 text-[10px]"
                  style={{ background: "#0a0a0a", color: "#707070" }}
                >
                  <div className="flex items-center gap-4">
                    <span>GPU: NVIDIA RTX 4090</span>
                    <span>FPS: 240</span>
                    <span>Inference: 4.2ms</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                    <span>Connected</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
