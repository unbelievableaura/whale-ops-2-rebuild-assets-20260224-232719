import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MENU_ITEMS = [
  { id: "find", label: "FIND MATCH", desc: "Jump into public matchmaking", locked: true },
  { id: "class", label: "CREATE A CLASS", desc: "Customize loadouts and perks", link: "/emotes" },
  { id: "operator", label: "OPERATOR", desc: "Operator profile and progression", link: "/roadmap" },
  { id: "armory", label: "ARMORY", desc: "Weapons, skins, and unlocks", link: "/assets" },
  { id: "private", label: "PRIVATE MATCH", desc: "Custom rooms and rulesets", locked: true },
  { id: "store", label: "STORE", desc: "Bundles and featured drops", locked: true },
];

const ROTATING_BACKGROUNDS = [
  { src: "/assets/generated/stylebible10_raw_8.png", flipX: true },
  { src: "/assets/generated/stylebible10_raw_5.png", flipX: true },
  { src: "/assets/generated/gemini_batch10_raw_8.png", flipX: false },
  { src: "/assets/generated/bestanchors10_raw_8.png", flipX: false },
];

const CHALLENGES = [
  { label: "Win 1 squad deployment", progress: "0/1" },
  { label: "Eliminate 8 hostiles", progress: "2/8" },
  { label: "Open 5 supply caches", progress: "4/5" },
];

export default function Home() {
  const [activeMenu, setActiveMenu] = useState(MENU_ITEMS[1].id);
  const [bgIndex, setBgIndex] = useState(0);
  const [hudFlash, setHudFlash] = useState(false);

  const currentMenu = MENU_ITEMS.find((m) => m.id === activeMenu) ?? MENU_ITEMS[0];

  useEffect(() => {
    const interval = setInterval(() => setBgIndex((prev) => (prev + 1) % ROTATING_BACKGROUNDS.length), 5500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const pulse = setInterval(() => {
      if (Math.random() > 0.8) {
        setHudFlash(true);
        setTimeout(() => setHudFlash(false), 160);
      }
    }, 2200);
    return () => clearInterval(pulse);
  }, []);

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      const idx = MENU_ITEMS.findIndex((m) => m.id === activeMenu);
      if (e.key === "ArrowDown") setActiveMenu(MENU_ITEMS[(idx + 1) % MENU_ITEMS.length].id);
      else if (e.key === "ArrowUp") setActiveMenu(MENU_ITEMS[(idx - 1 + MENU_ITEMS.length) % MENU_ITEMS.length].id);
      else if (e.key === "Enter") {
        const current = MENU_ITEMS.find((m) => m.id === activeMenu);
        if (current?.link) window.location.href = current.link;
      } else if (e.key.toLowerCase() === "g") {
        setHudFlash(true);
        setTimeout(() => setHudFlash(false), 240);
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [activeMenu]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black text-white font-rajdhani select-none">
      {/* Background stack */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.img
            key={bgIndex}
            src={ROTATING_BACKGROUNDS[bgIndex].src}
            alt="Lobby background"
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 0.62, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 1.1, ease: "easeInOut" }}
            className="w-full h-full object-cover absolute inset-0"
            style={{ transform: ROTATING_BACKGROUNDS[bgIndex].flipX ? "scaleX(-1)" : "none" }}
          />
        </AnimatePresence>

        {/* cinematic lighting */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/78 via-black/30 to-black/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/72 via-transparent to-black/28" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(196,235,255,0.17),transparent_45%)]" />

        {/* atmosphere */}
        <motion.div
          animate={{ opacity: [0.04, 0.1, 0.05], x: [0, 8, -6, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-screen"
        />
        <div className="absolute inset-0 bg-[url('/images/grid_pattern.png')] opacity-10 mix-blend-overlay" />
      </div>

      {/* top status */}
      <div className="absolute top-5 left-7 z-20 flex items-center gap-4">
        <div className="text-4xl font-semibold tracking-[0.12em] text-white/95">XBOX LIVE</div>
        <div className="h-8 w-px bg-white/30" />
        <div className="text-white/60 tracking-[0.18em] text-sm">PUNCH OPS DEPLOYMENT</div>
      </div>

      {/* left menu */}
      <div className="absolute top-20 left-6 z-20 w-[340px] bg-black/26 border border-white/15 backdrop-blur-md shadow-[0_0_35px_rgba(0,0,0,0.35)]">
        {MENU_ITEMS.map((item) => {
          const active = activeMenu === item.id;
          const row = (
            <div
              className={`relative h-14 flex items-center px-5 border-b border-white/10 last:border-b-0 transition-all ${
                active
                  ? "text-white bg-[linear-gradient(90deg,rgba(242,195,95,0.24),rgba(242,195,95,0.08),transparent)]"
                  : "text-white/82 hover:text-white hover:bg-white/6"
              } ${item.locked ? "opacity-70" : ""}`}
            >
              {active && <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#f3c35f]" />}
              <span className="text-[26px] md:text-[23px] tracking-wide">{item.label}</span>
              {item.locked && <span className="ml-2 text-xs text-white/40">LOCKED</span>}
            </div>
          );
          return item.link && !item.locked ? (
            <a key={item.id} href={item.link} onMouseEnter={() => setActiveMenu(item.id)} className="block">
              {row}
            </a>
          ) : (
            <button key={item.id} type="button" onMouseEnter={() => setActiveMenu(item.id)} className="block w-full text-left">
              {row}
            </button>
          );
        })}

        <div className="px-5 py-4 border-t border-white/10 bg-black/20">
          <div className="text-[#f3c35f] text-xs tracking-[0.22em] font-bold">SELECTED</div>
          <div className="text-white text-2xl leading-tight">{currentMenu.label}</div>
          <div className="text-white/65 text-sm mt-1">{currentMenu.desc}</div>
        </div>
      </div>

      {/* right player card */}
      <div className="absolute top-24 right-6 z-20 w-[min(620px,calc(100vw-2rem))] bg-black/28 border border-white/20 backdrop-blur-md shadow-[0_0_35px_rgba(0,0,0,0.45)]">
        <div className="px-5 pt-4 pb-3 text-[30px] md:text-[24px] tracking-[0.1em] text-white/95 border-b border-white/15">1/18 PLAYERS</div>
        <div className="px-5 py-4 flex items-start justify-between gap-4">
          <div>
            <div className="text-[#f3c35f] text-sm font-bold tracking-[0.08em]">LVL 50 [PUNCH]</div>
            <div className="text-white text-[42px] md:text-[34px] leading-none tracking-wide mt-1">Punch The Monkey</div>
            <div className="text-white/45 text-sm mt-2">Add Controller for Split Screen</div>
          </div>
          <div className="text-right text-sm text-white/60">
            <div>Ping: 23ms</div>
            <div>Region: US-W</div>
            <div>Party: Open</div>
          </div>
        </div>
      </div>

      {/* mission/challenges module */}
      <div className="absolute top-[230px] right-6 z-20 w-[min(620px,calc(100vw-2rem))] bg-black/30 border border-white/16 backdrop-blur-md">
        <div className="px-5 py-3 border-b border-white/12 flex items-center justify-between">
          <div>
            <div className="text-white/65 text-sm tracking-widest">MISSION</div>
            <div className="text-[#9ec8ff] text-2xl">Jungle Recon Protocol</div>
          </div>
          <div className="text-white/60 text-sm">Expires 1h 42m</div>
        </div>

        <div className="px-5 py-3 space-y-2">
          {CHALLENGES.map((c, i) => (
            <div key={c.label} className="bg-black/35 border border-white/10 px-3 py-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/78">{c.label}</span>
                <span className={`${i === 2 ? "text-[#f3c35f]" : "text-white/55"}`}>{c.progress}</span>
              </div>
              <div className="mt-2 h-1 bg-white/10">
                <div
                  className="h-full bg-gradient-to-r from-[#f3c35f] to-[#8ec7ff]"
                  style={{ width: i === 0 ? "10%" : i === 1 ? "25%" : "80%" }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* map tile */}
      <div className="absolute bottom-16 right-6 z-20 w-[320px] bg-black/30 border border-white/20 backdrop-blur-sm">
        <img src="/images/valhalla_map.jpg" alt="Map tile" className="w-full h-32 object-cover opacity-90" />
        <div className="p-3 border-t border-white/12">
          <div className="text-white text-[28px] leading-none">VALHALLA MAP BRIEF</div>
          <div className="text-white/65 text-sm mt-1">Terrain intel and insertion overview.</div>
        </div>
      </div>

      {/* bottom bars */}
      <div className="absolute bottom-5 left-6 z-20 text-white/70 tracking-[0.1em] text-sm">NAT TYPE: OPEN</div>
      <div className="absolute bottom-4 right-6 z-20 flex items-center gap-5 text-white/74 tracking-wider text-sm">
        <span>ROTATE</span><span>RS</span><span>OPTIONS</span><span>HELP</span><span>X</span><span>FRIENDS</span><span>Y</span><span>BACK</span><span>B</span>
      </div>

      {/* scanlines + cinematic flicker */}
      <div className="absolute inset-0 z-30 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.24)_50%),linear-gradient(90deg,rgba(120,220,255,0.04),rgba(255,255,255,0.015),rgba(255,190,100,0.04))] bg-[length:100%_2px,3px_100%] bg-repeat" />

      {hudFlash && (
        <div className="absolute inset-0 z-40 pointer-events-none mix-blend-screen opacity-45">
          <div className="w-full h-full bg-[url('/images/glitch_overlay.png')] bg-cover animate-pulse" />
        </div>
      )}
    </div>
  );
}
