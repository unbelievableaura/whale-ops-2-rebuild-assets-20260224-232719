import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CABar() {
  const [showCABar, setShowCABar] = useState(true);

  if (!showCABar) return null;

  return (
    <AnimatePresence>
      {showCABar && (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-cod-orange/20 via-cod-orange/10 to-cod-orange/20 border-b border-cod-orange/30 backdrop-blur-sm"
        >
          <div className="flex items-center justify-center gap-2 sm:gap-4 py-1 px-2 sm:px-4">
            {/* Status Message */}
            <div className="flex items-center gap-1 sm:gap-3">
              <span className="text-[10px] sm:text-xs font-bold tracking-[0.1em] sm:tracking-[0.2em] text-cod-orange">STATUS:</span>
              <span className="text-[10px] sm:text-xs font-mono text-white/80 tracking-wider">NOT OFFICIALLY LAUNCHED</span>
            </div>
            
            {/* Close Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowCABar(false)}
              className="ml-1 sm:ml-2 w-5 h-5 flex items-center justify-center text-white/40 hover:text-white/80 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 sm:w-3.5 sm:h-3.5">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
