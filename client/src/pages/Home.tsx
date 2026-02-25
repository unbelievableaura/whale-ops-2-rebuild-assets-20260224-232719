import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TOP_NAV = ["PLAY", "WEAPONS", "BATTLE PASS", "OPERATORS", "CHALLENGES", "BARRACKS", "STORE"];

const PLAYLISTS = [
  { id: "battle-royale", label: "BATTLE ROYALE", active: true, link: "/emotes" },
  { id: "armored", label: "ARMORED ROYALE QUADS", link: "/roadmap" },
  { id: "plunder", label: "PLUNDER TRIOS", link: "/assets" },
  { id: "practice", label: "PRACTICE MODES & TRIALS", locked: true },
];

const ROTATING_BACKGROUNDS = [
  { src: "/assets/generated/stylebible10_raw_8.png", flipX: true },
  { src: "/assets/generated/stylebible10_raw_5.png", flipX: true },
  { src: "/assets/generated/gemini_batch10_raw_8.png", flipX: false },
  { src: "/assets/generated/bestanchors10_raw_8.png", flipX: false },
];

export default function Home() {
  const [activePlaylist, setActivePlaylist] = useState(PLAYLISTS[0].id);
  const [activeTop, setActiveTop] = useState(TOP_NAV[0]);
  const [bgIndex, setBgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setBgIndex((prev) => (prev + 1) % ROTATING_BACKGROUNDS.length), 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      const idx = PLAYLISTS.findIndex((m) => m.id === activePlaylist);
      if (e.key === "ArrowDown") {
        setActivePlaylist(PLAYLISTS[(idx + 1) % PLAYLISTS.length].id);
      } else if (e.key === "ArrowUp") {
        setActivePlaylist(PLAYLISTS[(idx - 1 + PLAYLISTS.length) % PLAYLISTS.length].id);
      } else if (e.key === "Enter") {
        const current = PLAYLISTS.find((m) => m.id === activePlaylist);
        if (current?.link) window.location.href = current.link;
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [activePlaylist]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black text-white font-rajdhani select-none">
      {/* background */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.img
            key={bgIndex}
            src={ROTATING_BACKGROUNDS[bgIndex].src}
            alt="Lobby background"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
            className="w-full h-full object-cover absolute inset-0"
            style={{ transform: ROTATING_BACKGROUNDS[bgIndex].flipX ? "scaleX(-1)" : "none" }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/35 to-black/65" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-transparent to-black/45" />
        <div className="absolute inset-0 bg-[url('/images/grid_pattern.png')] opacity-10 mix-blend-overlay" />
      </div>

      {/* top nav strip */}
      <div className="absolute top-0 left-0 right-0 z-20 h-20 bg-black/55 border-b border-white/15 backdrop-blur-sm px-6 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="text-3xl font-black tracking-tight leading-none">
            <div>CALL OF DUTY</div>
            <div className="text-4xl -mt-2">PUNCH OPS</div>
          </div>
          <div className="hidden md:flex items-center gap-6 ml-6 text-sm tracking-widest">
            {TOP_NAV.map((item) => (
              <button
                key={item}
                type="button"
                onMouseEnter={() => setActiveTop(item)}
                className={`pb-1 border-b-2 transition-colors ${
                  activeTop === item ? "text-[#f6ca64] border-[#f6ca64]" : "text-white/65 border-transparent hover:text-white"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold">Rank 55</div>
          <div className="text-white/70 text-sm">Social · 1 / 20</div>
        </div>
      </div>

      {/* left playlist panel */}
      <div className="absolute top-24 left-6 z-20 w-[320px] space-y-2">
        {PLAYLISTS.map((item) => {
          const active = activePlaylist === item.id;
          const block = (
            <div
              className={`h-20 px-4 flex items-center justify-between border transition-all ${
                active
                  ? "bg-[#d7b24f26] border-[#f6ca64] shadow-[inset_0_0_0_1px_rgba(246,202,100,0.45)]"
                  : "bg-black/35 border-white/20 hover:bg-white/10"
              }`}
            >
              <div>
                <div className={`text-3xl md:text-[28px] font-semibold tracking-wide ${active ? "text-[#f6ca64]" : "text-white/85"}`}>
                  {item.label}
                </div>
                {item.locked && <div className="text-white/45 text-sm">LOCKED</div>}
              </div>
              {active && <div className="text-white/80">●</div>}
            </div>
          );
          return item.link && !item.locked ? (
            <a key={item.id} href={item.link} onMouseEnter={() => setActivePlaylist(item.id)} className="block">
              {block}
            </a>
          ) : (
            <button key={item.id} type="button" onMouseEnter={() => setActivePlaylist(item.id)} className="block w-full text-left">
              {block}
            </button>
          );
        })}
        <div className="h-10 px-4 flex items-center justify-between bg-black/35 border border-white/20 text-white/70">
          <span>Squad Fill</span>
          <span>Fill</span>
        </div>
      </div>

      {/* center marker */}
      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
        <div className="text-center mt-20">
          <div className="text-[#9bc1ff] text-xl font-bold">55</div>
          <div className="text-white/90 text-2xl tracking-wide">PunchTheMonkey</div>
        </div>
      </div>

      {/* right mission panel */}
      <div className="absolute top-24 right-6 z-20 w-[360px] bg-black/40 border border-white/20 backdrop-blur-sm">
        <div className="px-4 py-3 border-b border-white/15">
          <div className="text-white/70 text-sm">Mission</div>
          <div className="text-[#9bc1ff] text-2xl">Demonstrator Royale</div>
          <div className="text-white/65 text-sm mt-1">(2/7) Get a Point Blank Double Kill using a Shotgun 3 times</div>
        </div>
        <div className="px-4 py-3">
          <div className="flex justify-between items-center mb-2">
            <div className="text-white/90 text-2xl">Daily Challenges</div>
            <div className="text-white/60">1h 49m</div>
          </div>
          {[
            "Kill 3 downed enemies",
            "Complete 5 Recon Contract(s)",
            "Start 1 Contract(s) in Downtown Tavorsk",
          ].map((c, i) => (
            <div key={c} className="flex items-center justify-between py-2 border-t border-white/10 text-sm">
              <div className="text-white/75">{c}</div>
              <div className={`text-xs ${i === 0 ? "text-[#f6ca64]" : "text-white/40"}`}>{i === 0 ? "3/3" : "0/5"}</div>
            </div>
          ))}
        </div>
      </div>

      {/* map tile bottom-right */}
      <div className="absolute bottom-16 right-6 z-20 w-[360px] bg-black/45 border border-white/20">
        <img src="/images/valhalla_map.jpg" alt="Map overview" className="w-full h-36 object-cover opacity-85" />
        <div className="p-3 border-t border-white/15">
          <div className="text-3xl font-semibold">Verdansk Map Overview</div>
          <div className="text-white/70 text-sm">A closer look at the massive area.</div>
        </div>
      </div>

      {/* bottom bar */}
      <div className="absolute left-0 right-0 bottom-0 z-20 h-10 bg-black/55 border-t border-white/15 px-6 flex items-center justify-between text-sm text-white/70 tracking-wide">
        <div className="flex items-center gap-5">
          <span>◯ Back</span>
          <span>✕ Select</span>
          <span>☰ Options</span>
        </div>
        <div className="text-right">
          <span>Party Privacy: Public</span>
          <span className="ml-4">NAT Type: Open</span>
        </div>
      </div>

      <div className="absolute inset-0 z-30 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.2)_50%)] bg-[length:100%_2px]" />
    </div>
  );
}
