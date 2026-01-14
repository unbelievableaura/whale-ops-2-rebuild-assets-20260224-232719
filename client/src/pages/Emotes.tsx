import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";

// Only 2 emotes with the provided videos
const EMOTES = [
  { 
    id: "emote_1", 
    name: "TACTICAL STANCE", 
    video: "/images/emote_1.mp4",
    preview: "/images/emotes_bg.png",
    rarity: "LEGENDARY",
    color: "#ff9500"
  },
  { 
    id: "emote_2", 
    name: "COMBAT READY", 
    video: "/images/emote_2.mp4",
    preview: "/images/emotes_bg.png",
    rarity: "EPIC",
    color: "#a855f7"
  },
];

export default function Emotes() {
  const [selectedEmote, setSelectedEmote] = useState<typeof EMOTES[0] | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleEmoteClick = (emote: typeof EMOTES[0]) => {
    setSelectedEmote(emote);
    setIsPlaying(true);
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
  };

  // Play video immediately when emote is selected
  useEffect(() => {
    if (videoRef.current && selectedEmote && isPlaying) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(console.error);
    }
  }, [selectedEmote, isPlaying]);

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-black text-white font-rajdhani select-none">
      {/* Dark Background with subtle effects */}
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
        <div className="flex-1 flex flex-col lg:flex-row gap-8 items-center justify-center">
          
          {/* Video Preview Panel - Shows image preview, plays video on click */}
          <div className="lg:w-2/3 flex flex-col">
            <div className="relative aspect-video bg-black/80 border-2 border-white/10 overflow-hidden group max-w-4xl mx-auto w-full">
              {/* Corner Accents */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cod-orange z-20" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cod-orange z-20" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cod-orange z-20" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cod-orange z-20" />
              
              <AnimatePresence mode="wait">
                {selectedEmote ? (
                  isPlaying ? (
                    // Video playing
                    <motion.video
                      key={`${selectedEmote.id}-video`}
                      ref={videoRef}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="w-full h-full object-cover"
                      onEnded={handleVideoEnd}
                      autoPlay
                      muted
                      playsInline
                    >
                      <source src={selectedEmote.video} type="video/mp4" />
                    </motion.video>
                  ) : (
                    // Image preview (after video ends or before replay)
                    <motion.img
                      key={`${selectedEmote.id}-preview`}
                      src={selectedEmote.preview}
                      alt={selectedEmote.name}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="w-full h-full object-cover"
                    />
                  )
                ) : (
                  // Default state - show the preview image
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="w-full h-full relative"
                  >
                    <img 
                      src="/images/emotes_bg.png" 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-white/60 tracking-widest text-sm">SELECT AN EMOTE TO PREVIEW</div>
                      </div>
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
                className="mt-4 p-4 bg-black/60 border border-white/10 max-w-4xl mx-auto w-full"
              >
                <div className="flex justify-between items-center">
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
                        videoRef.current.play().catch(console.error);
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

          {/* Emote Buttons - Vertical on the right */}
          <div className="lg:w-1/3 flex flex-col items-center lg:items-start gap-4">
            <h3 className="text-lg font-bold tracking-widest text-white/60 mb-2">AVAILABLE EMOTES</h3>
            
            <div className="flex flex-row lg:flex-col gap-4">
              {EMOTES.map((emote, index) => (
                <motion.button
                  key={emote.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, x: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleEmoteClick(emote)}
                  className={`
                    relative w-40 h-40 bg-black/60 border-2 transition-all duration-300 overflow-hidden group
                    ${selectedEmote?.id === emote.id 
                      ? 'border-cod-orange shadow-[0_0_30px_rgba(255,149,0,0.4)]' 
                      : 'border-white/10 hover:border-white/30'}
                  `}
                >
                  {/* Rarity indicator bar */}
                  <div 
                    className="absolute top-0 left-0 right-0 h-1 z-10"
                    style={{ backgroundColor: emote.color }}
                  />
                  
                  {/* Preview Image as thumbnail */}
                  <img 
                    src={emote.preview} 
                    alt={emote.name}
                    className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                  />

                  {/* Emote Name */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-3 z-10">
                    <div className="text-xs font-bold tracking-wider text-white/90 text-center">
                      {emote.name}
                    </div>
                  </div>

                  {/* Selection glow */}
                  {selectedEmote?.id === emote.id && (
                    <motion.div
                      layoutId="selectedGlow"
                      className="absolute inset-0 border-2 border-cod-orange pointer-events-none z-20"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    />
                  )}
                </motion.button>
              ))}
            </div>

            {/* Rarity Legend */}
            <div className="mt-6 flex flex-col gap-2 text-xs font-bold tracking-widest">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#ff9500]" />
                <span className="text-white/60">LEGENDARY</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#a855f7]" />
                <span className="text-white/60">EPIC</span>
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
