import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";

// Password for access
const ACCESS_PASSWORD = "alpha";

export default function Loading() {
  const [, setLocation] = useLocation();
  const { isAuthenticated, authenticate } = useAuth();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [flickerIntensity, setFlickerIntensity] = useState(1);
  const inputRef = useRef<HTMLInputElement>(null);

  // Random flicker effect
  useEffect(() => {
    const flickerInterval = setInterval(() => {
      // Random flicker between 0.85 and 1
      setFlickerIntensity(0.85 + Math.random() * 0.15);
    }, 100 + Math.random() * 200);

    return () => clearInterval(flickerInterval);
  }, []);

  // Redirect to lobby if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      setLocation("/lobby");
    }
  }, [isAuthenticated, setLocation]);

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current && !isAuthenticated) {
      inputRef.current.focus();
    }
  }, [isAuthenticated]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password.toLowerCase() === ACCESS_PASSWORD.toLowerCase()) {
      setIsUnlocking(true);
      setError(false);
      authenticate(); // Save authentication state
      // Transition to lobby after unlock animation (3 seconds to show ACCESS GRANTED)
      setTimeout(() => {
        setLocation("/lobby");
      }, 3000);
    } else {
      setError(true);
      setPassword("");
      // Shake animation handled by CSS
      setTimeout(() => setError(false), 500);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black text-white font-rajdhani select-none">
      {/* Background Image with flicker */}
      <motion.div 
        className="absolute inset-0 z-0"
        animate={{ opacity: flickerIntensity }}
        transition={{ duration: 0.05 }}
      >
        <img 
          src="/images/loading_bg.png" 
          alt="WHALE OPS" 
          className="w-full h-full object-cover object-center"
        />
        {/* Dark overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/20" />
      </motion.div>

      {/* Vignette Effect */}
      <div 
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, transparent 40%, rgba(0,0,0,0.4) 70%, rgba(0,0,0,0.9) 100%)'
        }}
      />

      {/* Animated orange streaks */}
      <div className="absolute inset-0 z-5 overflow-hidden opacity-30 pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 bg-gradient-to-b from-transparent via-orange-500 to-transparent"
            style={{
              left: `${10 + i * 20}%`,
              height: '150%',
              top: '-25%',
            }}
            animate={{
              opacity: [0.2, 0.6, 0.2],
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

      {/* Scanline Effect */}
      <div className="absolute inset-0 z-20 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_2px,3px_100%] bg-repeat" />

      {/* Noise/Grain overlay */}
      <div className="absolute inset-0 z-15 pointer-events-none opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      {/* Main Content */}
      <div className="relative z-30 w-full h-screen flex flex-col items-center justify-end pb-24">
        
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mb-8 text-center w-[90%] mx-auto"
        >
          <img 
            src="/images/whale-ops-logo.svg" 
            alt="WHALE OPS" 
            className="w-full max-w-[800px] h-auto drop-shadow-[0_0_50px_rgba(255,255,255,0.4)] filter brightness-110"
            style={{ filter: 'drop-shadow(0 0 30px rgba(255,255,255,0.3))' }}
          />
        </motion.div>

        {/* Password Input */}
        <AnimatePresence mode="wait">
          {!isUnlocking ? (
            <motion.form
              key="password-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              onSubmit={handleSubmit}
              className="flex flex-col items-center gap-4 w-full px-4"
            >
              <div className="text-xs font-bold tracking-[0.3em] text-white/50 mb-2">
                ENTER ACCESS CODE
              </div>
              
              <div className={`relative ${error ? 'animate-shake' : ''}`}>
                {/* Corner accents */}
                <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-cod-orange" />
                <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-cod-orange" />
                <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-cod-orange" />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-cod-orange" />
                
                <input
                  ref={inputRef}
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="••••••••"
                  className={`
                    w-full max-w-[280px] px-6 py-3 bg-black/80 border-2 text-center font-mono text-lg tracking-[0.3em]
                    focus:outline-none focus:border-cod-orange transition-all
                    ${error ? 'border-red-500 text-red-400' : 'border-white/20 text-white'}
                  `}
                />
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-500 text-xs font-bold tracking-widest"
                >
                  ACCESS DENIED
                </motion.div>
              )}

              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-4 px-8 py-3 bg-cod-orange/20 border border-cod-orange/50 text-cod-orange font-bold tracking-[0.2em] text-sm hover:bg-cod-orange/30 hover:border-cod-orange transition-all"
              >
                CONTINUE
              </motion.button>

              <div className="mt-6 text-xs text-white/30 tracking-widest">
                PRESS ENTER TO SUBMIT
              </div>
            </motion.form>
          ) : (
            <motion.div
              key="unlocking"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-4"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-cod-green text-lg font-bold tracking-[0.3em]"
              >
                ACCESS GRANTED
              </motion.div>
              <div className="w-48 h-1 bg-cod-green/30 overflow-hidden mt-2">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2.5, ease: "easeOut" }}
                  className="h-full bg-cod-green"
                />
              </div>
              <div className="text-xs text-white/50 tracking-widest">
                INITIALIZING TACTICAL INTERFACE...
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-6 left-0 right-0 flex justify-between items-center px-4 sm:px-8 text-[10px] sm:text-xs text-white/30 tracking-widest"
        >
          <div>WHALE OPS™ v1.0</div>
          <div></div>
        </motion.div>
      </div>

      {/* CSS for shake animation */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}
