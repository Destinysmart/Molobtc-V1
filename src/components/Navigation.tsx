import { useState, useEffect } from "react";
import { 
  Bitcoin, 
  Menu, 
  Search, 
  Shield, 
  X, 
  User, 
  BookOpen, 
  Compass, 
  Briefcase, 
  Sparkles,
  ArrowRight,
  Bookmark,
  Heart
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { SearchOverlay } from "./SearchOverlay";
import molobtcLogo from "../assets/images/molobtc_official_logo_1781542833685.jpg";

export function Navigation() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Global cmd+k shortcut handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  return (
    <>
    <nav className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        <div className="flex items-center gap-8">
          <a href="/" className="flex items-center h-12">
            <img 
              src={molobtcLogo} 
              alt="Molo BTC Logo" 
              className="h-11 md:h-12 w-auto object-contain transform hover:scale-105 transition-transform duration-300"
              referrerPolicy="no-referrer"
            />
          </a>
          <div className="hidden md:flex gap-4 lg:gap-6 text-xs lg:text-sm font-medium">
            <a href="/#research" className="text-gray-550 hover:text-gray-950 transition-colors font-semibold">Research</a>
            <a href="/#donate" className="text-gray-550 hover:text-gray-950 transition-colors font-semibold">Donate</a>
            <a href="/#opportunities" className="text-gray-550 hover:text-gray-950 transition-colors font-semibold">Molo AI</a>
          </div>
        </div>

        <div className="flex items-center gap-2 lg:gap-4">
          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center gap-3 ml-1 lg:ml-2">
            {/* Removed Profile Button */}
          </div>

          {/* Mobile Buttons Flex container */}
          <div className="flex items-center gap-1 md:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg outline-none"
              title="Open Navigation"
            >
              <Menu className="h-5 w-5 stroke-[1.5]" />
            </button>
          </div>
        </div>
      </div>
    </nav>
    <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

    {/* Responsive Modern Mobile Side Overlay Drawer */}
    <AnimatePresence>
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden md:hidden">
          {/* Backdrop Overlay with blur */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-gray-950/45 backdrop-blur-sm"
          />

          {/* Drawer container body sliding from right */}
          <motion.div 
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="absolute inset-y-0 right-0 max-w-xs w-full bg-[#FCFAF7] shadow-2xl border-l border-gray-150 p-6 flex flex-col justify-between overflow-y-auto"
          >
            {/* Upper half of mobile menu drawer */}
            <div>
              <div className="flex items-center justify-between border-b border-gray-150 pb-4 mb-6">
                <a href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center">
                  <img 
                    src={molobtcLogo} 
                    alt="Molo BTC Logo" 
                    className="h-9 w-auto object-contain"
                  />
                </a>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1 px-2.5 bg-gray-100 text-gray-500 rounded-lg text-xs font-mono font-bold hover:bg-gray-150"
                  title="Close Menu"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Study Focus and Navigation list */}
              <div className="space-y-1.5">
                <span className="text-[9px] font-bold text-gray-400 tracking-widest uppercase font-mono block mb-2">Research Corridors</span>
                <a 
                  href="/#research" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 p-3 rounded-xl hover:bg-brand-50/50 hover:text-brand-700 text-gray-750 text-xs font-black uppercase tracking-wider transition-colors"
                >
                  <BookOpen className="w-4.5 h-4.5 text-brand-500" />
                  <span>Research</span>
                </a>
                <a 
                  href="/#donate" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 p-3 rounded-xl hover:bg-brand-50/50 hover:text-brand-700 text-gray-750 text-xs font-black uppercase tracking-wider transition-colors"
                >
                  <Heart className="w-4.5 h-4.5 text-brand-500" />
                  <span>Donate</span>
                </a>
                <a 
                  href="/#opportunities" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 p-3 rounded-xl hover:bg-brand-50/50 hover:text-brand-700 text-gray-750 text-xs font-black uppercase tracking-wider transition-colors"
                >
                  <Sparkles className="w-4.5 h-4.5 text-brand-500" />
                  <span>Molo AI</span>
                </a>
              </div>
            </div>

            {/* Bottom metadata inside mobile drawer */}
            <div className="border-t border-gray-150 pt-5">
              {/* Copyright indicator */}
              <div className="text-[9px] text-gray-400 text-center font-mono select-none">
                moloBTC © 2026 // Stack Connected
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
    </>
  );
}
