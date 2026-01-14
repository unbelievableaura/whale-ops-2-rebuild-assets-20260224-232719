import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import CABar from "@/components/CABar";

// Roadmap phases with accomplishments
const ROADMAP_PHASES = [
  {
    id: "phase_1",
    phase: "PHASE 1",
    title: "DEPLOYMENT",
    status: "COMPLETED",
    statusColor: "#00ff00",
    image: "/images/loading_bg.png",
    accomplishments: [
      "Website Launch",
      "Community Building",
      "Social Media Presence",
      "Initial Marketing Campaign"
    ]
  },
  {
    id: "phase_2",
    phase: "PHASE 2",
    title: "INFILTRATION",
    status: "IN PROGRESS",
    statusColor: "#ff9500",
    image: "/images/emotes_bg.png",
    accomplishments: [
      "Token Launch",
      "DEX Listings",
      "Partnership Announcements",
      "Community Events"
    ]
  },
  {
    id: "phase_3",
    phase: "PHASE 3",
    title: "DOMINATION",
    status: "UPCOMING",
    statusColor: "#666666",
    image: "/images/whale_soldier.png",
    accomplishments: [
      "CEX Listings",
      "Major Collaborations",
      "Merchandise Store",
      "Utility Expansion"
    ]
  },
  {
    id: "phase_4",
    phase: "PHASE 4",
    title: "GLOBAL OPS",
    status: "CLASSIFIED",
    statusColor: "#ff0000",
    image: "/images/loading_bg.png",
    accomplishments: [
      "???",
      "???",
      "???",
      "???"
    ]
  }
];

export default function Roadmap() {
  const [expandedPhase, setExpandedPhase] = useState<string | null>("phase_1");

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black text-white font-rajdhani select-none">
      <CABar />

      {/* Dark Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5" />
        <div className="absolute inset-0 overflow-hidden opacity-20">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 bg-gradient-to-b from-transparent via-orange-500 to-transparent"
              style={{ left: `${15 + i * 18}%`, height: '150%', top: '-25%' }}
              animate={{ opacity: [0.3, 0.8, 0.3], scaleY: [1, 1.1, 1] }}
              transition={{ duration: 2 + i * 0.5, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
        </div>
      </div>

      <div className="absolute inset-0 z-20 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.15)_50%)] bg-[length:100%_2px] bg-repeat" />

      <div className="relative z-10 w-full h-screen flex flex-col p-4 sm:p-6 md:p-12 overflow-y-auto">
        <div className="flex justify-between items-start mb-6 sm:mb-8 mt-8">
          <div className="w-[90%]">
            <div className="text-sm font-bold tracking-[0.2em] text-white/60 mb-[-5px]">MISSION BRIEFING</div>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tighter font-black-ops text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] leading-[0.85]">
              ROADMAP
            </h1>
          </div>
          <Link href="/lobby">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-3 sm:px-6 py-2 bg-white/5 border border-white/20 text-white/80 font-bold tracking-widest text-xs sm:text-sm hover:bg-white/10 hover:border-white/40 transition-all">
              ← BACK
            </motion.button>
          </Link>
        </div>

        <div className="flex-1 flex flex-col gap-3 max-w-4xl mx-auto w-full pb-8">
          {ROADMAP_PHASES.map((phase, index) => (
            <motion.div key={phase.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="relative">
              <motion.div
                onClick={() => setExpandedPhase(expandedPhase === phase.id ? null : phase.id)}
                className={`relative cursor-pointer overflow-hidden border-2 transition-all duration-300 ${expandedPhase === phase.id ? 'border-cod-orange shadow-[0_0_30px_rgba(255,149,0,0.3)]' : 'border-white/10 hover:border-white/30'}`}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="absolute inset-0 z-0">
                  <img src={phase.image} alt={phase.title} className="w-full h-full object-cover opacity-30" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
                </div>

                <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cod-orange z-20" />
                <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cod-orange z-20" />
                <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cod-orange z-20" />
                <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cod-orange z-20" />

                <div className="relative z-10 p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="text-cod-orange font-bold tracking-[0.2em] text-xs sm:text-sm">{phase.phase}</div>
                      <h2 className="text-xl sm:text-2xl md:text-3xl font-black tracking-wide">{phase.title}</h2>
                    </div>
                    <div className="px-2 sm:px-3 py-1 text-[10px] sm:text-xs font-bold tracking-widest border" style={{ borderColor: phase.statusColor, color: phase.statusColor, backgroundColor: `${phase.statusColor}15` }}>
                      {phase.status}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-white/40 text-xs">
                    <motion.span animate={{ rotate: expandedPhase === phase.id ? 90 : 0 }} transition={{ duration: 0.2 }}>▶</motion.span>
                    <span>{expandedPhase === phase.id ? 'CLICK TO COLLAPSE' : 'CLICK TO EXPAND'}</span>
                  </div>
                </div>

                <AnimatePresence>
                  {expandedPhase === phase.id && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="relative z-10 overflow-hidden">
                      <div className="px-4 sm:px-6 pb-4 sm:pb-6 pt-2 border-t border-white/10">
                        <div className="text-xs font-bold tracking-[0.2em] text-cod-orange mb-3">OBJECTIVES</div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {phase.accomplishments.map((item, i) => (
                            <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="flex items-center gap-2">
                              <div className="w-2 h-2 rotate-45" style={{ backgroundColor: phase.status === "COMPLETED" ? "#00ff00" : phase.status === "IN PROGRESS" ? "#ff9500" : "#444" }} />
                              <span className={`text-sm ${phase.status === "CLASSIFIED" ? "blur-sm" : ""}`}>{item}</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {index < ROADMAP_PHASES.length - 1 && (
                <div className="absolute left-6 sm:left-8 top-full w-0.5 h-3 bg-gradient-to-b from-cod-orange/50 to-transparent" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
