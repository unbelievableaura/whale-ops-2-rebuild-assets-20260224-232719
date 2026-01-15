import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CABar from "@/components/CABar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

// Menu Items Data
const MENU_ITEMS = [
  { id: "start", label: "START GAME", active: false, locked: true, tooltip: "COMING SOON" },
  { id: "emotes", label: "EMOTES", active: false, link: "/emotes" },
  { id: "roadmap", label: "ROADMAP", active: false, link: "/roadmap" },
  { id: "twitter", label: "X", active: false, link: "https://twitter.com" },
  { id: "dexscreener", label: "DEXSCREENER", active: false, link: "https://dexscreener.com" },
  { id: "pump", label: "PUMP.FUN", active: false, link: "https://pump.fun" },
];

export default function Home() {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [activeMenu, setActiveMenu] = useState(MENU_ITEMS[0].id);
  const [showGlitch, setShowGlitch] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [uiVisible, setUiVisible] = useState(true);

  const BACKGROUND_VIDEOS = [
    "/images/freepik_a-focused-character-stands-mostly-still-in-the-sce_kling_1080p_16-9_24fps_43817.mp4",
    "/images/freepik_a_hyperrealistic_cinematic_shot_of_a_futuristic_an_minimax.mp4",
    "/images/freepik_dynamic_cinematic_shot_of_my_character_riding_on_t_minimax.mp4",
    "/images/freepik_have_my_character_in_combat_on_the_roof_kling_1080p_16_9.mp4"
  ];

  // CA bar is shown by default, user can dismiss it

  useEffect(() => {
    // Cycle background videos every 6 seconds
    const videoInterval = setInterval(() => {
      setCurrentVideoIndex(prev => (prev + 1) % BACKGROUND_VIDEOS.length);
    }, 6000);

    return () => clearInterval(videoInterval);
  }, []);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 5;
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.9) {
        setShowGlitch(true);
        setTimeout(() => setShowGlitch(false), 150);
      }
    }, 2000);
    return () => clearInterval(glitchInterval);
  }, []);

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const currentIndex = MENU_ITEMS.findIndex(item => item.id === activeMenu);
      
      if (e.key === "ArrowDown") {
        const nextIndex = (currentIndex + 1) % MENU_ITEMS.length;
        setActiveMenu(MENU_ITEMS[nextIndex].id);
      } else if (e.key === "ArrowUp") {
        const prevIndex = (currentIndex - 1 + MENU_ITEMS.length) % MENU_ITEMS.length;
        setActiveMenu(MENU_ITEMS[prevIndex].id);
      } else if (e.key === "Enter") {
        const currentItem = MENU_ITEMS.find(item => item.id === activeMenu);
        if (currentItem?.link) {
          if (currentItem.link.startsWith("/")) {
            window.location.href = currentItem.link;
          } else {
            window.open(currentItem.link, "_blank");
          }
        }
      } else if (e.key === "1") { // L1
        setCurrentVideoIndex(prev => (prev - 1 + BACKGROUND_VIDEOS.length) % BACKGROUND_VIDEOS.length);
      } else if (e.key === "2") { // R1
        setCurrentVideoIndex(prev => (prev + 1) % BACKGROUND_VIDEOS.length);
      } else if (e.key === "Escape") { // O (Circle)
        setUiVisible(prev => !prev);
      } else if (e.key === "g") { // Triangle (mapped to 'g' for glitch)
        setShowGlitch(true);
        setTimeout(() => setShowGlitch(false), 300);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeMenu]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black text-white font-rajdhani select-none">
      {/* CA Bar Component */}
      <CABar />

      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.video
            key={currentVideoIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            autoPlay
            loop
            playsInline
            className={`w-full h-full object-cover absolute inset-0 ${
              currentVideoIndex === 1 || currentVideoIndex === 2 || currentVideoIndex === 3 ? "scale-x-[-1]" : ""
            }`}
          >
            <source src={BACKGROUND_VIDEOS[currentVideoIndex]} type="video/mp4" />
          </motion.video>
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent" />
        <div className="absolute inset-0 bg-[url('/images/grid_pattern.png')] opacity-10 mix-blend-overlay" />
        
        {/* Dust Particles Overlay (Simulated with CSS) */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay" />
      </div>

      {/* Main Content Container */}
      <div className={`relative z-10 w-full h-full flex flex-col p-4 sm:p-6 md:p-12 transition-opacity duration-500 ${uiVisible ? 'opacity-100' : 'opacity-0'}`}>
        
        {/* Top Bar */}
        <div className={`flex flex-col md:flex-row justify-between items-start w-full mb-8 gap-4 md:gap-0 mt-8`}>
          <div className="flex items-center gap-4 w-[90%]">
            <div className="flex flex-col w-full">
              <div className="text-sm font-bold tracking-[0.2em] text-white/60 mb-[-5px]">LOBBY</div>
              {/* Stacked logo for mobile */}
              <img 
                src="/images/whale-ops-logo-mobile.svg" 
                alt="WHALE OPS" 
                className="md:hidden w-full max-w-[280px] h-auto drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] mix-blend-screen"
                style={{paddingTop: '12px', filter: 'drop-shadow(0 0 15px rgba(255,255,255,0.3))'}}
              />
              {/* Horizontal logo for desktop */}
              <img 
                src="/images/whale-ops-logo.svg" 
                alt="WHALE OPS" 
                className="hidden md:block w-full max-w-[750px] h-auto drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] mix-blend-screen"
                style={{paddingTop: '12px', filter: 'drop-shadow(0 0 15px rgba(255,255,255,0.3))'}}
              />
            </div>
          </div>
          
          {/* Player Info */}
          <div className="flex flex-col items-start md:items-end gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 bg-black/80 px-4 py-1 backdrop-blur-md whitespace-nowrap">
              <span className="text-sm font-bold tracking-widest text-white/90">1 Players (18 Max)</span>
            </div>
            <div className="text-left md:text-right flex flex-col gap-2">
              <div className="text-cod-green font-bold text-xl tracking-wide drop-shadow-[0_0_5px_rgba(0,255,0,0.5)] whitespace-nowrap">
                [Whale] THE WHITE WHALE
              </div>
              <div className="text-xs text-white/50 tracking-wider uppercase hidden md:block whitespace-nowrap">Add controller for Split Screen</div>
            </div>
          </div>
        </div>

        {/* Middle Section - Menu */}
        <div className="flex-1 flex items-center pb-0 md:pb-[229px]">
          <div className="flex gap-4 items-start relative">
            {/* Main Menu List */}
            <div className="flex flex-col gap-3 sm:gap-4 w-full md:w-72 pl-0 md:pl-4">
              {MENU_ITEMS.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 + (index * 0.05) }}
                  className="group relative flex items-center"
                  onMouseEnter={() => setActiveMenu(item.id)}
                >
                  {/* Vertical Selection Line */}
                  {activeMenu === item.id && (
                    <motion.div 
                      layoutId="activeLine"
                      className="absolute -left-4 w-1.5 h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "100%" }}
                      exit={{ opacity: 0, height: 0 }}
                    />
                  )}
                  
                  {item.locked ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span
                          className={`
                            text-[16px] sm:text-[18px] font-bold uppercase tracking-wide cursor-not-allowed transition-all duration-300 block opacity-40
                            ${activeMenu === item.id 
                              ? 'text-white/60' 
                              : 'text-white/30'}
                          `}
                        >
                          🔒 {item.label}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="bg-black/90 border-cod-orange text-cod-orange font-bold tracking-widest text-xs">
                        {item.tooltip}
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    <a 
                      href={item.link}
                      target={item.link && !item.link.startsWith("/") ? "_blank" : undefined}
                      rel={item.link && !item.link.startsWith("/") ? "noopener noreferrer" : undefined}
                      className={`
                        text-[16px] sm:text-[18px] font-bold uppercase tracking-wide cursor-pointer transition-all duration-300 block
                        ${activeMenu === item.id 
                          ? 'text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.6)] scale-105 origin-left' 
                          : 'text-white/40 hover:text-white/80'}
                      `}
                    >
                      {item.label}
                    </a>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section - Map & Status */}
        <div className="w-full mt-auto">
          
          {/* Map Preview & Party Info */}
          <div className="flex items-end gap-8 hidden md:flex">
            {/* Map Card */}
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="relative group"
            >
              {/* Map Preview Card */}
              <div className="relative w-64 h-36 bg-black/80 border-2 border-white/20 overflow-hidden group cursor-pointer">
                <img 
                  src="/images/valhalla_map.jpg" 
                  alt="Map Preview" 
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                />
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/90 to-transparent p-3">
                  <div className="text-xl font-bold text-white tracking-wider">VALHALLA</div>
                  <div className="text-xs font-bold text-cod-orange tracking-widest uppercase">PVP</div>
                </div>
              </div>
              {/* Corner Accents */}
              <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-white/50" />
              <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-white/50" />
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-white/50" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-white/50" />
            </motion.div>

            {/* Party Status Text */}
            <div className="mb-4">
              <div className="text-white/90 font-bold tracking-wide text-lg">You are Party Leader</div>
              <div className="text-white/60 text-sm tracking-wider uppercase">Party Privacy: Open</div>
            </div>
          </div>

          {/* Bottom Bar - Controls & Loading */}
          <div className="w-full border-t border-white/10 mt-6 pt-4 flex justify-center md:justify-between items-center relative">
            {/* Loading Bar */}
            <div className="absolute top-0 left-0 h-[1px] bg-cod-orange/50 transition-all duration-200" style={{ width: `${loadingProgress}%` }} />
            
            {/* Left Controls */}
            <div className="hidden md:flex gap-6 text-sm font-bold tracking-widest text-white/70">
              <div className="flex items-center gap-2 hover:text-white cursor-pointer transition-colors">
                <div className="w-5 h-5 rounded-full border border-white/40 flex items-center justify-center text-[10px]">X</div>
                <span>Select</span>
              </div>
              <div className="flex items-center gap-2 hover:text-white cursor-pointer transition-colors" onClick={() => setUiVisible(false)}>
                <div className="w-5 h-5 rounded-full border border-white/40 flex items-center justify-center text-[10px] text-cod-red">O</div>
                <span>Hide UI</span>
              </div>
            </div>

            {/* Center Loading Status */}
            <div className="relative md:absolute md:left-1/2 md:-translate-x-1/2 text-xs font-mono text-white/40 tracking-[0.2em]">
              INITIALIZING TACTICAL INTERFACE... {Math.round(loadingProgress)}%
            </div>

            {/* Right Controls */}
            <div className="hidden md:flex gap-6 text-sm font-bold tracking-widest text-white/70">
              <div className="flex items-center gap-2 hover:text-white cursor-pointer transition-colors">
                <div className="px-2 py-0.5 border border-white/40 rounded text-[10px] cursor-pointer" onClick={() => setCurrentVideoIndex(prev => (prev - 1 + BACKGROUND_VIDEOS.length) % BACKGROUND_VIDEOS.length)}>L1</div>
                <span>Cycle Background</span>
                <div className="px-2 py-0.5 border border-white/40 rounded text-[10px] cursor-pointer" onClick={() => setCurrentVideoIndex(prev => (prev + 1) % BACKGROUND_VIDEOS.length)}>R1</div>
              </div>
              <div className="flex items-center gap-2 hover:text-white cursor-pointer transition-colors" onClick={() => {
                setShowGlitch(true);
                setTimeout(() => setShowGlitch(false), 300);
              }}>
                <div className="w-5 h-5 rounded-full border border-white/40 flex items-center justify-center text-[10px] text-cod-green">△</div>
                <span>Glitch</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Glitch Overlay Effect */}
      {showGlitch && (
        <div className="absolute inset-0 z-50 pointer-events-none mix-blend-color-dodge opacity-50">
          <div className="w-full h-full bg-[url('/images/glitch_overlay.png')] bg-cover animate-pulse" />
        </div>
      )}
      
      {/* Scanline Effect */}
      <div className="absolute inset-0 z-40 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] bg-repeat" />
    </div>
  );
}
