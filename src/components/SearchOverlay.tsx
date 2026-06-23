import { useState, useEffect } from "react";
import { Search, X, Bitcoin, FileText, Newspaper, TrendingUp, Zap } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");

  // Handle keyboard shortcuts (Escape to close)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden"; // Prevent scrolling when open
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Handle cmd+K to open (should be done in parent component, but we can do it here if we want a global shortcut, but let's do it in App or Navigation)

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col pt-16 sm:pt-24 px-4 sm:px-6">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Search container */}
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative mx-auto w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
          >
            {/* Search Input Area */}
            <div className="relative flex items-center border-b border-gray-100 px-4">
              <Search className="h-5 w-5 text-gray-400 stroke-[2] shrink-0" />
              <input
                autoFocus
                type="text"
                className="w-full bg-transparent p-5 text-lg text-gray-900 placeholder:text-gray-400 outline-none"
                placeholder="Search articles, guides, and tutorials..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button 
                onClick={onClose}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5 stroke-[2]" />
              </button>
            </div>

            {/* Results Area */}
            <div className="overflow-y-auto px-4 py-6 bg-gray-50/50 flex-1">
              {query.length === 0 ? (
                <div>
                  <h3 className="text-xs font-semibold text-gray-400 tracking-wider uppercase mb-4 px-2">Popular Searches</h3>
                  <div className="flex flex-wrap gap-2 mb-8 px-2">
                    {["Lightning Network", "Cold Outreach", "Invoicing", "Taxes"].map((term) => (
                      <button key={term} onClick={() => setQuery(term)} className="inline-flex items-center gap-1.5 rounded-full bg-white border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 hover:border-brand-300 hover:text-brand-600 transition-colors shadow-sm">
                        <TrendingUp className="h-3.5 w-3.5" />
                        {term}
                      </button>
                    ))}
                  </div>

                  <h3 className="text-xs font-semibold text-gray-400 tracking-wider uppercase mb-4 px-2">Suggested Categories</h3>
                  <div className="space-y-1">
                    <a href="#" className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-white hover:shadow-sm hover:ring-1 hover:ring-gray-200 transition-all group">
                       <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                         <Newspaper className="h-5 w-5 stroke-[2]" />
                       </div>
                       <div className="text-left">
                         <h4 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">Client Acquisition</h4>
                         <p className="text-xs text-gray-500">Guides to finding and closing Bitcoin-native clients</p>
                       </div>
                    </a>
                    <a href="#" className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-white hover:shadow-sm hover:ring-1 hover:ring-gray-200 transition-all group">
                       <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                         <Zap className="h-5 w-5 stroke-[2]" />
                       </div>
                       <div className="text-left">
                         <h4 className="text-sm font-semibold text-gray-900 group-hover:text-brand-600 transition-colors">Lightning Network</h4>
                         <p className="text-xs text-gray-500">Setting up nodes and receiving instant invoices</p>
                       </div>
                    </a>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Mock Results */}
                  <div>
                    <h3 className="text-xs font-semibold text-gray-400 tracking-wider uppercase mb-3 px-2">Articles</h3>
                    <div className="space-y-1">
                      <a href="#" className="flex items-center gap-4 w-full p-3 rounded-xl hover:bg-white hover:shadow-sm hover:ring-1 hover:ring-gray-200 transition-all group">
                         <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
                           <FileText className="h-5 w-5 stroke-[2]" />
                         </div>
                         <div className="text-left flex-1 min-w-0">
                           <h4 className="text-sm font-semibold text-gray-900 group-hover:text-brand-600 transition-colors truncate">
                             Understanding {query} in 2026
                           </h4>
                           <p className="text-xs text-gray-500 truncate">A comprehensive guide for freelancers and digital nomads.</p>
                         </div>
                      </a>
                      <a href="#" className="flex items-center gap-4 w-full p-3 rounded-xl hover:bg-white hover:shadow-sm hover:ring-1 hover:ring-gray-200 transition-all group">
                         <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
                           <FileText className="h-5 w-5 stroke-[2]" />
                         </div>
                         <div className="text-left flex-1 min-w-0">
                           <h4 className="text-sm font-semibold text-gray-900 group-hover:text-brand-600 transition-colors truncate">
                             Top 5 Tools for {query}
                           </h4>
                           <p className="text-xs text-gray-500 truncate">Improve your remote work setup with these essentials.</p>
                         </div>
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-white px-4 py-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
               <div className="flex items-center gap-4">
                 <span className="flex items-center gap-1"><kbd className="rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5 font-sans font-medium text-gray-500">↑↓</kbd> to navigate</span>
                 <span className="flex items-center gap-1"><kbd className="rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5 font-sans font-medium text-gray-500">enter</kbd> to select</span>
               </div>
               <span className="flex items-center gap-1"><kbd className="rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5 font-sans font-medium text-gray-500">esc</kbd> to close</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
