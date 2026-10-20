import { useState, useEffect, useMemo } from "react";
import { Search, X, FileText, Newspaper, Shield, Video, Bot, Zap, ArrowRight, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { trackEvent, trackSearchQuery } from "../services/analytics";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchItem {
  id: string;
  title: string;
  description: string;
  category: "Whitepaper" | "Policy Analysis" | "Open Protocol" | "AI & Tools" | "Media & Interview" | "Support";
  url: string;
  isExternal?: boolean;
  tags: string[];
}

const MOLOBTC_SEARCH_CATALOG: SearchItem[] = [
  {
    id: "bsrf",
    title: "Bitcoin Sovereignty Research Framework (BSRF)",
    description: "Canonical research framework breaking down Bitcoin sovereignty, self-custody principles, and African monetary independence.",
    category: "Whitepaper",
    url: "/#research",
    tags: ["bsrf", "framework", "sovereignty", "research", "whitepaper", "custody", "foundations"],
  },
  {
    id: "bsol",
    title: "Bitcoin Sovereign Open Source License (BSOL) v1.0",
    description: "An ethical open-source software license protecting Bitcoin developer sovereignty, user rights, and censorship resistance.",
    category: "Open Protocol",
    url: "https://github.com/MoloBTC-Org/bsol",
    isExternal: true,
    tags: ["bsol", "license", "open source", "steward", "copyright", "developer", "jacques strydom"],
  },
  {
    id: "bbpp",
    title: "Bitcoin Best Practice Protocol (BBPP)",
    description: "Operational best practices and rigorous standards for enterprise, node runners, and African individuals securing Bitcoin reserves.",
    category: "Open Protocol",
    url: "https://github.com/MoloBTC-Org/bbpp",
    isExternal: true,
    tags: ["bbpp", "protocol", "best practice", "security", "nodes", "multisig", "hardware"],
  },
  {
    id: "sgas",
    title: "Sovereign Grok Agent Suite (SGAS) v1.0.1",
    description: "Autonomous AI agent architecture tailored for sovereign Bitcoin research, protocol verification, and data intelligence.",
    category: "AI & Tools",
    url: "https://github.com/MoloBTC-Org/sgas",
    isExternal: true,
    tags: ["sgas", "agent", "grok", "ai", "intelligence", "autonomous", "suite"],
  },
  {
    id: "capital-flow-regulations",
    title: "South Africa Capital Flow Regulations Objection Template",
    description: "Official public comment template and legal analysis refuting proposed draft exchange controls on Bitcoin self-custody in South Africa.",
    category: "Policy Analysis",
    url: "/#research",
    tags: ["south africa", "capital flow", "regulation", "objection", "policy", "sarb", "fmf", "exchange control", "legal"],
  },
  {
    id: "sui-generis-bearer-property",
    title: "Bitcoin as Sui Generis Bearer Property",
    description: "Jurisprudential treatise explaining why cryptographic bearer assets cannot be treated like custodial book entries under property law.",
    category: "Whitepaper",
    url: "/#research",
    tags: ["sui generis", "bearer property", "property law", "jurisprudence", "pillar 1", "unencumbered"],
  },
  {
    id: "self-custody-ecosystem",
    title: "Bitcoin Self-Custody Research Ecosystem Index",
    description: "Comprehensive architectural directory and operational guide for maintaining resilient, non-custodial Bitcoin infrastructure.",
    category: "Whitepaper",
    url: "/#research",
    tags: ["self custody", "index", "ecosystem", "nodes", "cold storage", "hardware wallets"],
  },
  {
    id: "sovereign-monetary-infrastructure",
    title: "Tier 1 Sovereign Monetary Infrastructure",
    description: "Architectural blueprint positioning Bitcoin as foundational neutral reserve layer for developing African markets.",
    category: "Whitepaper",
    url: "/#research",
    tags: ["tier 1", "monetary", "infrastructure", "africa", "settlement", "energy"],
  },
  {
    id: "nine-pillars-sovereignty",
    title: "Nine Non-Negotiable Pillars of Bitcoin Sovereignty",
    description: "The core ethical and technical manifesto of MoloBTC: sui generis bearer rights, private compute, and uncompelled mental entropy.",
    category: "Whitepaper",
    url: "/#research",
    tags: ["nine pillars", "principles", "core", "sovereignty", "manifesto", "entropy", "private compute"],
  },
  {
    id: "molobtc-profile",
    title: "What Is MoloBTC? Africa's Open-Source Bitcoin Project",
    description: "Bitcoin Africa Story profile exploring MoloBTC's mission to translate Bitcoin across technology, law, and tax for Africa.",
    category: "Media & Interview",
    url: "https://www.bitcoinafricastory.com/news/molobtc",
    isExternal: true,
    tags: ["bitcoin africa story", "media", "interview", "profile", "molobtc", "article"],
  },
  {
    id: "fmf-interview",
    title: "Can South Africa's Government Control Bitcoin? (FMF Interview)",
    description: "Executive discussion between @jabulanijakes and David Ansara (CEO, Free Market Foundation) analyzing draft South African regulations.",
    category: "Media & Interview",
    url: "https://www.youtube.com/watch?v=CM03_3vOqWM&t=9s",
    isExternal: true,
    tags: ["fmf", "free market foundation", "david ansara", "jabulani jakes", "video", "interview", "youtube"],
  },
  {
    id: "regulation-fight",
    title: "Can South Africa Control Bitcoin? The Regulation Fight",
    description: "In-depth investigative analysis highlighting why proposed draft restrictions on private wallet holdings face constitutional hurdles.",
    category: "Media & Interview",
    url: "https://www.bitcoinafricastory.com/news/can-south-africa-control-bitcoin-the-regulation-fight",
    isExternal: true,
    tags: ["regulation", "fight", "south africa", "constitution", "bitcoin africa story", "article"],
  },
  {
    id: "molo-ai-explorer",
    title: "Molo AI: Interactive Sovereign Explorer",
    description: "AI research assistant trained on the 9 pillars of sovereignty, BSRF whitepapers, and African regulatory developments.",
    category: "AI & Tools",
    url: "/#molo-ai",
    tags: ["molo ai", "ai", "explorer", "chat", "research assistant", "gemini"],
  },
  {
    id: "support-blink",
    title: "Support MoloBTC via Blink Lightning Network",
    description: "Direct peer-to-peer Lightning Network contributions supporting independent African open-source research and educational tools.",
    category: "Support",
    url: "/#support",
    tags: ["support", "donate", "blink", "lightning network", "sats", "bitcoin"],
  },
];

const CURATED_TOPICS = [
  "BSRF Whitepapers",
  "South Africa Regulations",
  "Bitcoin Self-Custody",
  "BSOL License",
  "BBPP Protocols",
  "Free Market Foundation",
  "Blink Lightning",
];

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      setQuery("");
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const filteredResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    return MOLOBTC_SEARCH_CATALOG.filter((item) => {
      return (
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    });
  }, [query]);

  const handleSelect = (item: SearchItem) => {
    trackEvent("Select Search Result", {
      title: item.title,
      category: item.category,
      url: item.url,
    });

    onClose();
    if (item.isExternal) {
      window.open(item.url, "_blank", "noopener,noreferrer");
    } else if (item.url.startsWith("/#")) {
      const hash = item.url.replace("/", "");
      window.location.hash = hash;
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const getCategoryIcon = (category: SearchItem["category"]) => {
    switch (category) {
      case "Whitepaper":
        return <FileText className="h-4 w-4 text-amber-600" />;
      case "Policy Analysis":
        return <Shield className="h-4 w-4 text-blue-600" />;
      case "Open Protocol":
        return <FileText className="h-4 w-4 text-emerald-600" />;
      case "AI & Tools":
        return <Bot className="h-4 w-4 text-purple-600" />;
      case "Media & Interview":
        return <Video className="h-4 w-4 text-rose-600" />;
      case "Support":
        return <Zap className="h-4 w-4 text-amber-500" />;
      default:
        return <Newspaper className="h-4 w-4 text-gray-500" />;
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col pt-12 sm:pt-20 px-4 sm:px-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-neutral-950/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Search container */}
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative mx-auto w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[82vh] border border-neutral-200/80"
          >
            {/* Search Input Area */}
            <div className="relative flex items-center border-b border-neutral-150 px-4 sm:px-5 bg-white">
              <Search className="h-5 w-5 text-amber-600 stroke-[2.2] shrink-0" />
              <input
                autoFocus
                type="text"
                className="w-full bg-transparent py-4 sm:py-5 px-3.5 text-base sm:text-lg text-neutral-900 placeholder:text-neutral-400 outline-none font-medium"
                placeholder="Search MoloBTC research, whitepapers, policy & media..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="p-1.5 text-neutral-400 hover:text-neutral-700 transition-colors mr-1 cursor-pointer"
                  title="Clear input"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <button
                onClick={onClose}
                className="rounded-xl p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors cursor-pointer"
                aria-label="Close search"
              >
                <X className="h-5 w-5 stroke-[2]" />
              </button>
            </div>

            {/* Results or Empty State Illustration Area */}
            <div className="overflow-y-auto px-4 sm:px-6 py-6 bg-neutral-50/60 flex-1">
              {query.trim().length === 0 ? (
                <div className="py-4 text-center flex flex-col items-center">
                  {/* High-quality MoloBTC Brand Illustration */}
                  <div className="relative w-full max-w-xs sm:max-w-sm h-44 sm:h-52 mb-4 flex items-center justify-center select-none pointer-events-none">
                    <svg
                      viewBox="0 0 360 220"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-full h-full drop-shadow-sm"
                    >
                      <defs>
                        {/* Gradients */}
                        <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
                          <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.35" />
                          <stop offset="60%" stopColor="#EA580C" stopOpacity="0.12" />
                          <stop offset="100%" stopColor="#EA580C" stopOpacity="0" />
                        </radialGradient>
                        <linearGradient id="lensGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#FBBF24" />
                          <stop offset="45%" stopColor="#F59E0B" />
                          <stop offset="100%" stopColor="#D97706" />
                        </linearGradient>
                        <linearGradient id="frameGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#292524" />
                          <stop offset="100%" stopColor="#1C1917" />
                        </linearGradient>
                        <linearGradient id="docGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#FFFFFF" />
                          <stop offset="100%" stopColor="#F8FAFC" />
                        </linearGradient>
                        <linearGradient id="africaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.15" />
                          <stop offset="100%" stopColor="#EA580C" stopOpacity="0.05" />
                        </linearGradient>
                      </defs>

                      {/* Ambient background glow */}
                      <circle cx="180" cy="110" r="100" fill="url(#sunGlow)" />

                      {/* Stylized African Continent Contour Silhouette in the background */}
                      <path
                        d="M175 42 C195 40, 218 52, 222 70 C226 84, 216 98, 220 112 C225 128, 206 148, 192 165 C186 172, 178 180, 174 186 C170 178, 165 165, 160 152 C152 135, 142 120, 142 104 C142 86, 148 76, 156 64 C163 52, 168 44, 175 42 Z"
                        fill="url(#africaGrad)"
                        stroke="#F59E0B"
                        strokeOpacity="0.25"
                        strokeWidth="1.2"
                        strokeDasharray="4 4"
                      />

                      {/* Research Parchment / Document Sheets in perspective */}
                      <g opacity="0.92">
                        {/* Back document */}
                        <rect
                          x="94"
                          y="62"
                          width="68"
                          height="88"
                          rx="8"
                          transform="rotate(-10 94 62)"
                          fill="url(#docGrad)"
                          stroke="#E2E8F0"
                          strokeWidth="1.2"
                        />
                        <line x1="104" y1="78" x2="142" y2="72" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
                        <line x1="106" y1="88" x2="148" y2="81" stroke="#E2E8F0" strokeWidth="2" strokeLinecap="round" />
                        <line x1="108" y1="98" x2="136" y2="93" stroke="#E2E8F0" strokeWidth="2" strokeLinecap="round" />

                        {/* Right document */}
                        <rect
                          x="196"
                          y="58"
                          width="70"
                          height="92"
                          rx="8"
                          transform="rotate(9 196 58)"
                          fill="url(#docGrad)"
                          stroke="#E2E8F0"
                          strokeWidth="1.2"
                        />
                        <line x1="208" y1="82" x2="248" y2="88" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
                        <line x1="206" y1="92" x2="252" y2="99" stroke="#E2E8F0" strokeWidth="2" strokeLinecap="round" />
                        <line x1="204" y1="102" x2="238" y2="108" stroke="#E2E8F0" strokeWidth="2" strokeLinecap="round" />
                      </g>

                      {/* Constellation orbit rings & nodes */}
                      <circle cx="180" cy="110" r="76" stroke="#F59E0B" strokeOpacity="0.2" strokeWidth="1" strokeDasharray="3 5" />
                      <circle cx="180" cy="110" r="50" stroke="#EA580C" strokeOpacity="0.25" strokeWidth="1" />

                      {/* Node connection lines */}
                      <line x1="180" y1="60" x2="180" y2="160" stroke="#F59E0B" strokeOpacity="0.2" strokeWidth="1" />
                      <circle cx="180" cy="60" r="3.5" fill="#F59E0B" />
                      <circle cx="230" cy="110" r="3" fill="#EA580C" />
                      <circle cx="130" cy="110" r="3" fill="#F59E0B" />

                      {/* Iconic MoloBTC Orange Lens Glasses (Centerpiece) */}
                      <g transform="translate(0, -2)">
                        {/* Bridge */}
                        <path d="M166 112 C172 108, 188 108, 194 112" stroke="url(#frameGrad)" strokeWidth="6" strokeLinecap="round" />
                        
                        {/* Left Frame & Orange Lens */}
                        <rect x="114" y="98" width="52" height="38" rx="14" fill="url(#lensGrad)" stroke="url(#frameGrad)" strokeWidth="5" />
                        {/* Right Frame & Orange Lens */}
                        <rect x="194" y="98" width="52" height="38" rx="14" fill="url(#lensGrad)" stroke="url(#frameGrad)" strokeWidth="5" />

                        {/* Lens Sheen / Reflection Highlights */}
                        <path d="M120 105 Q140 102 158 106" stroke="#FFFFFF" strokeOpacity="0.75" strokeWidth="2.5" strokeLinecap="round" />
                        <path d="M200 105 Q220 102 238 106" stroke="#FFFFFF" strokeOpacity="0.75" strokeWidth="2.5" strokeLinecap="round" />

                        {/* Glowing Bitcoin Symbol in right lens */}
                        <circle cx="220" cy="117" r="10" fill="#FFFFFF" fillOpacity="0.25" />
                        <text x="220" y="122" fontSize="13" fontWeight="bold" fontFamily="sans-serif" fill="#FFFFFF" textAnchor="middle">₿</text>
                        {/* Research compass/cross in left lens */}
                        <circle cx="140" cy="117" r="10" fill="#FFFFFF" fillOpacity="0.2" />
                        <line x1="140" y1="110" x2="140" y2="124" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
                        <line x1="133" y1="117" x2="147" y2="117" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
                      </g>
                    </svg>
                  </div>

                  {/* Brand aligned messaging */}
                  <h3 className="text-base sm:text-lg font-bold text-neutral-900 mb-1.5">
                    Explore MoloBTC Sovereign Research
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-500 max-w-md mx-auto leading-relaxed mb-6">
                    Search canonical research whitepapers, South African policy comment templates, open-source protocol specs, and media interviews.
                  </p>

                  {/* Curated MoloBTC Discovery Tags */}
                  <div className="w-full">
                    <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-3">
                      Recommended Topics
                    </p>
                    <div className="flex flex-wrap justify-center gap-2 max-w-xl mx-auto">
                      {CURATED_TOPICS.map((topic) => (
                        <button
                          key={topic}
                          onClick={() => {
                            trackSearchQuery(topic, "navbar");
                            setQuery(topic);
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-white border border-neutral-200 text-xs font-medium text-neutral-700 hover:border-amber-400 hover:text-amber-700 hover:bg-amber-50/40 transition-all shadow-sm cursor-pointer"
                        >
                          {topic}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : filteredResults.length > 0 ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between px-2 pb-1">
                    <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                      Research Results ({filteredResults.length})
                    </p>
                    <span className="text-xs text-neutral-400">Click to open</span>
                  </div>

                  {filteredResults.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleSelect(item)}
                      className="group p-4 bg-white rounded-2xl border border-neutral-200/80 hover:border-amber-300 hover:shadow-md transition-all cursor-pointer flex items-start gap-3.5"
                    >
                      <div className="p-2.5 rounded-xl bg-neutral-100 group-hover:bg-amber-50 transition-colors shrink-0 mt-0.5">
                        {getCategoryIcon(item.category)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wide">
                            {item.category}
                          </span>
                        </div>
                        <h4 className="text-sm sm:text-base font-bold text-neutral-900 group-hover:text-amber-600 transition-colors line-clamp-1">
                          {item.title}
                        </h4>
                        <p className="text-xs text-neutral-500 mt-1 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                      <div className="self-center p-2 text-neutral-300 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all shrink-0">
                        {item.isExternal ? (
                          <ExternalLink className="h-4 w-4" />
                        ) : (
                          <ArrowRight className="h-4 w-4" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200/60 flex items-center justify-center mx-auto mb-3 text-amber-600">
                    <Search className="h-6 w-6 stroke-[1.8]" />
                  </div>
                  <h4 className="text-sm font-bold text-neutral-800 mb-1">
                    No research found for &ldquo;{query}&rdquo;
                  </h4>
                  <p className="text-xs text-neutral-500 max-w-sm mx-auto mb-4">
                    Try searching for &ldquo;BSRF&rdquo;, &ldquo;regulation&rdquo;, &ldquo;custody&rdquo;, or &ldquo;BSOL&rdquo;.
                  </p>
                  <button
                    onClick={() => setQuery("")}
                    className="text-xs font-semibold text-amber-600 hover:text-amber-700 underline cursor-pointer"
                  >
                    Clear search and view topics
                  </button>
                </div>
              )}
            </div>

            {/* Clean Modern Footer without unnecessary shortcut signs/symbols */}
            <div className="bg-white px-5 py-3 border-t border-neutral-150 flex items-center justify-between text-xs text-neutral-500">
              <span className="font-medium text-neutral-600">
                MoloBTC • Open-Source Bitcoin Research
              </span>
              <button
                onClick={onClose}
                className="text-neutral-500 hover:text-neutral-900 transition-colors font-medium cursor-pointer"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
