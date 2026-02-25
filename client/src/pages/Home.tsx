import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MENU_ITEMS = [
  { id: "find", label: "FIND MATCH", locked: true },
  { id: "class", label: "CREATE A CLASS", link: "/emotes" },
  { id: "operator", label: "OPERATOR", link: "/roadmap" },
  { id: "armory", label: "ARMORY", link: "/assets" },
  { id: "private", label: "PRIVATE MATCH", locked: true },
  { id: "store", label: "STORE", locked: true },
];

const ROTATING_BACKGROUNDS = [
  { src: "/assets/generated/stylebible10_raw_8.png", flipX: true },
  { src: "/assets/generated/stylebible10_raw_5.png", flipX: true },
  { src: "/assets/generated/gemini_batch10_raw_8.png", flipX: false },
  { src: "/assets/generated/bestanchors10_raw_8.png", flipX: false },
];

export default function Home() {
  const [activeMenu, setActiveMenu] = useState(MENU_ITEMS[1].id);
  const [bgIndex, setBgIndex] = useState(0);
  const [showHudNoise, setShowHudNoise] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % ROTATING_BACKGROUNDS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      const idx = MENU_ITEMS.findIndex((m) => m.id === activeMenu);
      if (e.key === "ArrowDown") {
        setActiveMenu(MENU_ITEMS[(idx + 1) % MENU_ITEMS.length].id);
      } else if (e.key === "ArrowUp") {
        setActiveMenu(MENU_ITEMS[(idx - 1 + MENU_ITEMS.length) % MENU_ITEMS.length].id);
      } else if (e.key === "Enter") {
        const current = MENU_ITEMS.find((m) => m.id === activeMenu);
        if (current?.link) window.location.href = current.link;
      } else if (e.key.toLowerCase() === "g") {
        setShowHudNoise(true);
        setTimeout(() => setShowHudNoise(false), 220);
      }
    };

    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [activeMenu]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black text-white font-rajdhani select-none">
      {/* Cinematic rotating background */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.img
            key={bgIndex}
            src={ROTATING_BACKGROUNDS[bgIndex].src}
            alt="Lobby background"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.55 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
            className="w-full h-full object-cover absolute inset-0"
            style={{
              objectPosition: "center center",
              transform: ROTATING_BACKGROUNDS[bgIndex].flipX ? "scaleX(-1)" : "none",
            }}
          />
        </AnimatePresence>

        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/25 to-black/45" />
        <div className="absolute inset-0 bg-[url('/images/grid_pattern.png')] opacity-10 mix-blend-overlay" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay" />
      </div>

      {/* top-left title */}
      <div className="absolute top-8 left-8 z-20 tracking-widest text-white/90 text-3xl font-semibold">
        XBOX LIVE
      </div>

      {/* left menu panel */}
      <div className="absolute top-24 left-8 z-20 w-[300px] bg-black/35 border border-white/15 backdrop-blur-sm">
        {MENU_ITEMS.map((item) => {
          const active = activeMenu === item.id;

          const row = (
            <div
              className={`relative h-11 flex items-center px-5 text-[28px] md:text-[22px] font-medium tracking-wide transition-all ${
                active
                  ? "text-white bg-[#f9c8581f] border-l-4 border-[#f6ca64]"
                  : "text-white/80 hover:text-white hover:bg-white/5"
              } ${item.locked ? "opacity-70" : ""}`}
            >
              {item.label}
              {item.locked && <span className="ml-2 text-xs text-white/40">LOCKED</span>}
            </div>
          );

          return item.link && !item.locked ? (
            <a
              key={item.id}
              href={item.link}
              onMouseEnter={() => setActiveMenu(item.id)}
              className="block border-b border-white/10 last:border-b-0"
            >
              {row}
            </a>
          ) : (
            <button
              key={item.id}
              onMouseEnter={() => setActiveMenu(item.id)}
              className="block w-full text-left border-b border-white/10 last:border-b-0"
              type="button"
            >
              {row}
            </button>
          );
        })}
      </div>



      {/* right player card */}
      <div className="absolute top-28 right-8 z-20 w-[min(520px,calc(100vw-2rem))] bg-black/40 border border-white/20 backdrop-blur-sm">
        <div className="px-4 pt-3 pb-2 text-[30px] md:text-[24px] tracking-wide text-white/95">1/18 PLAYERS</div>
        <div className="px-4 pb-3 border-t border-white/15">
          <div className="mt-2 text-[#f6ca64] text-sm font-bold tracking-wide">LVL 50 [PUNCH]</div>
          <div className="text-white text-lg tracking-wide">Punch The Monkey</div>
          <div className="text-white/45 text-sm mt-1">Add Controller for Split Screen</div>
        </div>
      </div>

      {/* lower-left net status */}
      <div className="absolute bottom-6 left-8 z-20 text-white/70 tracking-widest text-sm">NAT TYPE: OPEN</div>

      {/* bottom command rail */}
      <div className="absolute bottom-4 right-8 z-20 flex items-center gap-5 text-white/75 tracking-wider text-sm">
        <span>ROTATE</span>
        <span>RS</span>
        <span>OPTIONS</span>
        <span>HELP</span>
        <span>X</span>
        <span>FRIENDS</span>
        <span>Y</span>
        <span>BACK</span>
        <span>B</span>
      </div>

      {/* subtle full-screen scanline */}
      <div className="absolute inset-0 z-30 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.22)_50%),linear-gradient(90deg,rgba(100,220,255,0.06),rgba(255,255,255,0.02),rgba(255,180,0,0.04))] bg-[length:100%_2px,3px_100%] bg-repeat" />

      {/* hud glitch pulse */}
      {showHudNoise && (
        <div className="absolute inset-0 z-40 pointer-events-none mix-blend-screen opacity-45">
          <div className="w-full h-full bg-[url('/images/glitch_overlay.png')] bg-cover animate-pulse" />
        </div>
      )}
    </div>
  );
}
