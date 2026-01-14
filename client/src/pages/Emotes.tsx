import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";

// Emote Data with video paths
const EMOTES = [
  { 
    id: "tactical_stance", 
    name: "TACTICAL STANCE", 
    video: "/images/freepik_a-focused-character-stands-mostly-still-in-the-sce_kling_1080p_16-9_24fps_43817.mp4",
    rarity: "LEGENDARY",
    color: "#ff9500"
  },
  { 
    id: "combat_ready", 
    name: "COMBAT READY", 
    video: "/images/freepik_a-focused-armored-dolphinheaded-soldier-stands-mos_kling_1080p_16-9_24fps_43816.mp4",
    rarity: "EPIC",
    color: "#a855f7"
  },
  { 
    id: "whale_rider", 
    name: "WHALE RIDER", 
    video: "/images/freepik_dynamic_cinematic_shot_of_my_character_riding_on_t_minimax.mp4",
    rarity: "LEGENDARY",
    color: "#ff9500"
  },
  { 
    id: "rooftop_assault", 
    name: "ROOFTOP ASSAULT", 
    video: "/images/freepik_have_my_character_in_combat_on_the_roof_kling_1080p_16_9.mp4",
    rarity: "EPIC",
    color: "#a855f7"
  },
  { 
    id: "futuristic_pose", 
    name: "FUTURISTIC POSE", 
    video: "/images/freepik_a_hyperrealistic_cinematic_shot_of_a_futuristic_an_minimax.mp4",
    rarity: "RARE",
    color: "#3b82f6"
  },
  { 
    id: "valhalla_arrival", 
    name: "VALHALLA ARRIVAL", 
    video: "/images/freepik_a-breathtaking-heavenly-valhalla-fortress-floating_kling_1080p_16-9_24fps_43814.mp4",
    rarity: "LEGENDARY",
    color: "#ff9500"
  },
  { 
    id: "whale_dance", 
    name: "WHALE DANCE", 
    video: "/images/whalevid.mp4",
    rarity: "COMMON",
    color: "#6b7280"
  },
  { 
    id: "stealth_mode", 
    name: "STEALTH MODE", 
    video: "/images/freepik_a-focused-character-stands-mostly-still-in-the-sce_seedance_720p_16-9_24fps_43813.mp4",
    rarity: "RARE",
    color: "#3b82f6"
  },
];

export default function Emotes() {
  const [selectedEmote, setSelectedEmote] = useState<typeof EMOTES[0] | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hoveredEmote, setHoveredEmote] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleEmoteClick = (emote: typeof EMOTES[0]) => {
    setSelectedEmote(emote);
    setIsPlaying(true);
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
  };

  useEffect(() => {
    if (videoRef.current && isPlaying) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }
  }, [selectedEmote, isPlaying]);

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-black text-white font-rajdhani select-none">
      {/* Background with subtle gradient */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5" />
        {/* Animated orange streaks in background */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 bg-gradient-to-b from-transparent via-orange-500 to-transparent"
              style={{
                left: `${15 + i * 18}%`,
                height: '150%',
                top: '-25%',
              }}
              animate={{
                opacity: [0.3, 0.8, 0.3],
                scaleY: [1, 1.1, 1],
              }}
              transition={{
                duration: 2 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full min-h-screen flex flex-col p-6 md:p-12">
        
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <div className="text-sm font-bold tracking-[0.2em] text-white/60 mb-[-5px]">ARMORY</div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter font-black-ops text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
              EMOTES
            </h1>
          </div>
          
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 bg-white/5 border border-white/20 text-white/80 font-bold tracking-widest text-sm hover:bg-white/10 hover:border-white/40 transition-all"
            >
              ← BACK TO LOBBY
            </motion.button>
          </Link>
        </div>

        {/* Main Layout */}
        <div className="flex-1 flex flex-col lg:flex-row gap-8">
          
          {/* Video Preview Panel */}
          <div className="lg:w-1/2 flex flex-col">
            <div className="relative aspect-video bg-black/80 border-2 border-white/10 overflow-hidden group">
              {/* Corner Accents */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cod-orange z-20" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cod-orange z-20" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cod-orange z-20" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cod-orange z-20" />
              
              <AnimatePresence mode="wait">
                {selectedEmote ? (
                  <motion.video
                    key={selectedEmote.id}
                    ref={videoRef}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full object-cover"
                    onEnded={handleVideoEnd}
                    muted
                    playsInline
                  >
                    <source src={selectedEmote.video} type="video/mp4" />
                  </motion.video>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="w-full h-full flex items-center justify-center"
                  >
                    <div className="text-center">
                      <div className="text-6xl mb-4 opacity-20">🐋</div>
                      <div className="text-white/40 tracking-widest text-sm">SELECT AN EMOTE TO PREVIEW</div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Playing Indicator */}
              {isPlaying && selectedEmote && (
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/80 px-3 py-1 z-20">
                  <div className="w-2 h-2 bg-cod-green rounded-full animate-pulse" />
                  <span className="text-xs font-bold tracking-widest text-cod-green">PLAYING</span>
                </div>
              )}

              {/* Scanline overlay */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.15)_50%)] bg-[length:100%_2px] pointer-events-none z-10" />
            </div>

            {/* Selected Emote Info */}
            {selectedEmote && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="mt-4 p-4 bg-black/60 border border-white/10"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-black tracking-wide">{selectedEmote.name}</h2>
                    <div 
                      className="text-xs font-bold tracking-[0.3em] mt-1"
                      style={{ color: selectedEmote.color }}
                    >
                      {selectedEmote.rarity}
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setIsPlaying(true);
                      if (videoRef.current) {
                        videoRef.current.currentTime = 0;
                        videoRef.current.play();
                      }
                    }}
                    className="px-6 py-2 bg-cod-orange/20 border border-cod-orange/50 text-cod-orange font-bold tracking-widest text-sm hover:bg-cod-orange/30 transition-all"
                  >
                    REPLAY
                  </motion.button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Emote Grid */}
          <div className="lg:w-1/2">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold tracking-widest text-white/60">AVAILABLE EMOTES</h3>
              <div className="text-sm text-white/40">{EMOTES.length} UNLOCKED</div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {EMOTES.map((emote, index) => (
                <motion.button
                  key={emote.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleEmoteClick(emote)}
                  onMouseEnter={() => setHoveredEmote(emote.id)}
                  onMouseLeave={() => setHoveredEmote(null)}
                  className={`
                    relative aspect-square bg-black/60 border-2 transition-all duration-300 overflow-hidden group
                    ${selectedEmote?.id === emote.id 
                      ? 'border-cod-orange shadow-[0_0_20px_rgba(255,149,0,0.3)]' 
                      : 'border-white/10 hover:border-white/30'}
                  `}
                >
                  {/* Rarity indicator bar */}
                  <div 
                    className="absolute top-0 left-0 right-0 h-1"
                    style={{ backgroundColor: emote.color }}
                  />
                  
                  {/* Video thumbnail preview on hover */}
                  {hoveredEmote === emote.id && (
                    <video
                      className="absolute inset-0 w-full h-full object-cover opacity-60"
                      autoPlay
                      muted
                      loop
                      playsInline
                    >
                      <source src={emote.video} type="video/mp4" />
                    </video>
                  )}
                  
                  {/* Emote Icon/Placeholder */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className={`text-4xl transition-all duration-300 ${hoveredEmote === emote.id ? 'opacity-0' : 'opacity-40'}`}>
                      🐋
                    </div>
                  </div>

                  {/* Emote Name */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-2">
                    <div className="text-[10px] font-bold tracking-wider text-white/90 truncate">
                      {emote.name}
                    </div>
                  </div>

                  {/* Selection indicator */}
                  {selectedEmote?.id === emote.id && (
                    <motion.div
                      layoutId="selectedIndicator"
                      className="absolute inset-0 border-2 border-cod-orange pointer-events-none"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    />
                  )}
                </motion.button>
              ))}
            </div>

            {/* Rarity Legend */}
            <div className="mt-6 flex flex-wrap gap-4 text-xs font-bold tracking-widest">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#ff9500]" />
                <span className="text-white/60">LEGENDARY</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#a855f7]" />
                <span className="text-white/60">EPIC</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#3b82f6]" />
                <span className="text-white/60">RARE</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#6b7280]" />
                <span className="text-white/60">COMMON</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="mt-8 pt-4 border-t border-white/10 flex justify-between items-center">
          <div className="flex gap-6 text-sm font-bold tracking-widest text-white/50">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full border border-white/40 flex items-center justify-center text-[10px]">X</div>
              <span>Select</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full border border-white/40 flex items-center justify-center text-[10px] text-cod-green">△</div>
              <span>Equip</span>
            </div>
          </div>
          
          <div className="text-xs font-mono text-white/30 tracking-widest">
            WHALE OPS™ EMOTE SYSTEM v2.1
          </div>
        </div>
      </div>

      {/* Scanline Effect */}
      <div className="absolute inset-0 z-40 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] bg-repeat" />
    </div>
  );
}
