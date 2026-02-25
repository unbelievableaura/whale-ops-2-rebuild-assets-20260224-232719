import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
// CABar removed
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

// Menu Items Data
const MENU_ITEMS = [
  { id: "start", label: "START GAME", active: false, locked: true, tooltip: "COMING SOON" },
  { id: "emotes", label: "EMOTES", active: false, link: "/emotes" },
  { id: "roadmap", label: "ROADMAP", active: false, link: "/roadmap" },
];

export default function Home() {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [activeMenu, setActiveMenu] = useState(MENU_ITEMS[0].id);
  const [showGlitch, setShowGlitch] = useState(false);
  const [uiVisible, setUiVisible] = useState(true);
  const [showTrailerModal, setShowTrailerModal] = useState(false);
  const [bgIndex, setBgIndex] = useState(0);
  const trailerModalRef = useRef<HTMLVideoElement>(null);

  // CA bar is shown by default, user can dismiss it

  const ROTATING_BACKGROUNDS = [
    { src: "/assets/generated/stylebible10_raw_8.png", flipX: true },
    { src: "/assets/generated/stylebible10_raw_5.png", flipX: true },
    { src: "/assets/generated/gemini_batch10_raw_8.png", flipX: false },
    { src: "/assets/generated/bestanchors10_raw_8.png", flipX: false },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % ROTATING_BACKGROUNDS.length);
    }, 5000);
    return () => clearInterval(interval);
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


      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.img
            key={bgIndex}
            src={ROTATING_BACKGROUNDS[bgIndex].src}
            alt="Lobby background"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="w-full h-full object-cover absolute inset-0"
            style={{
              objectPosition: '35% center',
              transform: ROTATING_BACKGROUNDS[bgIndex].flipX ? 'scaleX(-1)' : 'none'
            }}
          />
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
        <div className="flex-1 flex items-center pb-[57px] md:pb-[229px]">
          <div className="flex gap-4 items-start relative">
            {/* Main Menu List */}
            <div className="flex flex-col gap-3 sm:gap-4 w-full md:w-72 pl-0 md:pl-4" style={{paddingTop: '49px'}}>
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
                            text-[20px] sm:text-[22px] font-bold uppercase tracking-wide cursor-not-allowed transition-all duration-300 block opacity-40
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
                        text-[20px] sm:text-[22px] font-bold uppercase tracking-wide cursor-pointer transition-all duration-300 block
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
              <div className="flex items-center gap-2 text-white/60">
                <div className="px-2 py-0.5 border border-white/30 rounded text-[10px]">BG</div>
                <span>Static Image</span>
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

      {/* Trailer Preview - Bottom Right */}
      <div className="hidden md:block absolute bottom-36 right-6 z-30">
        <div 
          className="relative group cursor-pointer"
          onClick={() => setShowTrailerModal(true)}
        >
          {/* Corner Accents */}
          <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-cod-orange z-20" />
          <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-cod-orange z-20" />
          <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-cod-orange z-20" />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-cod-orange z-20" />
          
          {/* Video Container */}
          <div className="w-[400px] aspect-video bg-black/80 border border-white/20 overflow-hidden relative">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
            >
              <source src="/images/trailer.mp4" type="video/mp4" />
            </video>
            
            {/* Play icon overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-16 h-16 rounded-full bg-black/60 border-2 border-cod-orange flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-cod-orange ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            </div>
            
            {/* Scanline overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.15)_50%)] bg-[length:100%_2px] pointer-events-none" />
          </div>
          
          {/* Label */}
          <div className="absolute -bottom-6 left-0 right-0 text-center">
            <span className="text-[10px] font-bold tracking-[0.2em] text-white/50 uppercase">Click to Watch Trailer</span>
          </div>
        </div>
      </div>

      {/* Trailer Modal Overlay */}
      <AnimatePresence>
        {showTrailerModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90"
            onClick={() => setShowTrailerModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="relative w-[90vw] max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Corner Accents */}
              <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-cod-orange z-20" />
              <div className="absolute -top-2 -right-2 w-6 h-6 border-t-2 border-r-2 border-cod-orange z-20" />
              <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-2 border-l-2 border-cod-orange z-20" />
              <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-cod-orange z-20" />
              
              {/* Close Button */}
              <button
                onClick={() => setShowTrailerModal(false)}
                className="absolute -top-12 right-0 flex items-center gap-2 text-white/70 hover:text-white transition-colors"
              >
                <span className="text-xs font-bold tracking-widest">CLOSE</span>
                <div className="w-8 h-8 rounded-full border border-white/40 flex items-center justify-center hover:border-cod-orange hover:text-cod-orange transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              </button>
              
              {/* Video Container */}
              <div className="aspect-video bg-black border-2 border-white/20 overflow-hidden">
                <video
                  ref={trailerModalRef}
                  autoPlay
                  controls
                  playsInline
                  className="w-full h-full object-contain"
                >
                  <source src="/images/trailer.mp4" type="video/mp4" />
                </video>
              </div>
              
              {/* Title */}
              <div className="mt-4 text-center">
                <h3 className="text-xl font-black tracking-widest text-white">WHALE OPS TRAILER</h3>
                <p className="text-xs font-bold tracking-[0.2em] text-cod-orange mt-1">OFFICIAL PREVIEW</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
