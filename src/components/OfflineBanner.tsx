import { useState, useEffect } from "react";
import { WifiOff, Wifi, CloudLightning, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function OfflineBanner() {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [showBackOnlineToast, setShowBackOnlineToast] = useState<boolean>(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowBackOnlineToast(true);
      // Automatically fade out the "Back Online" success toast after 4 seconds
      const timeout = setTimeout(() => {
        setShowBackOnlineToast(false);
      }, 4000);
      return () => clearTimeout(timeout);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowBackOnlineToast(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <AnimatePresence>
      {/* 1. persistent offline warning bar */}
      {!isOnline && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-sm z-50 bg-[#FFFBEB] border-2 border-amber-500/30 text-amber-950 p-4 rounded-2xl shadow-xl flex gap-3.5 items-start"
          id="offline-warning-card"
        >
          <div className="p-2 bg-amber-500/10 rounded-xl text-amber-600 shrink-0 mt-0.5">
            <WifiOff className="w-5 h-5 animate-pulse" />
          </div>
          <div className="flex-1 space-y-1">
            <h4 className="text-xs font-black tracking-wider uppercase font-mono text-amber-800 flex items-center gap-1.5">
              <span>Connection Interrupted</span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
            </h4>
            <p className="text-[11px] font-bold text-amber-900/80 leading-relaxed font-sans">
              Molo Research Node has lost contact with the server. Bookmarked articles and previously loaded summaries remain accessible!
            </p>
            <div className="flex items-center gap-1.5 pt-1">
              <CloudLightning className="w-3.5 h-3.5 text-amber-600" />
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-amber-700">Offline-Fallback Active</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* 2. Success dynamic dynamic toast back-online */}
      {showBackOnlineToast && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-sm z-50 bg-emerald-50 border-2 border-emerald-500/20 text-emerald-950 p-4 rounded-2xl shadow-xl flex gap-3.5 items-start"
          id="online-success-card"
        >
          <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-600 shrink-0 mt-0.5">
            <Wifi className="w-5 h-5" />
          </div>
          <div className="flex-1 space-y-0.5">
            <h4 className="text-xs font-black tracking-wider uppercase font-mono text-emerald-800">
              Synchronized & Connected
            </h4>
            <p className="text-[11px] font-bold text-emerald-900/80 leading-relaxed font-sans">
              Internet connection has been restored successfully! Resuming high-frequency database replication updates.
            </p>
          </div>
          <button 
            onClick={() => setShowBackOnlineToast(false)}
            className="text-emerald-500 hover:text-emerald-700 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
