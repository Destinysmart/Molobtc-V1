import { useEffect, useState, useMemo, useRef } from "react";
import { Navigation } from "../components/Navigation";
import { Footer } from "../components/Footer";
import { SEO } from "../components/SEO";
import { useGithubState } from "../hooks/useGithubState";
import {   ArrowRight, 
  BookOpen, 
  Download, 
  Github, 
  Bitcoin, 
  Sparkles, 
  Send, 
  Clock, 
  ChevronRight, 
  Layers, 
  ShieldCheck, 
  Cpu, 
  Coins,
  Search,
  ExternalLink,
  RotateCcw,
  Briefcase,
  Compass,
  Map,
  GraduationCap,
  Hammer,
  HelpCircle,
  Lightbulb,
  DollarSign,
  TrendingUp,
  Globe,
  Shuffle,
  Heart,
  Check,
  GitFork,
  Star,
  RefreshCw,
  Mail,
  Twitter,
  Trash2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { PdfPreviewCanvas } from "../components/PdfPreviewCanvas";
import { downloadSovereignPdf } from "../services/pdfGenerator";

// Types for Research Paper
interface ResearchPaper {
  id: string;
  title: string;
  subtitle: string;
  featured_image: string;
  category_id: string;
  status: string;
  abstract: string;
  github_repo: string;
  download_file: string;
  reading_time: string;
  content: string;
  published_at: string;
}

function TypewriterHeader() {
  const fullText = "See Bitcoin Through The Orange Lens";
  const baseLength = 20; // Length of "See Bitcoin Through "
  
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(80);

  useEffect(() => {
    let timer: any;
    
    const handleType = () => {
      if (!isDeleting && displayText === fullText) {
        timer = setTimeout(() => {
          setIsDeleting(true);
          setTypingSpeed(45); // erase faster
        }, 3000); // pause for 3 seconds when fully typed
        return;
      }

      if (isDeleting && displayText === "") {
        setIsDeleting(false);
        setTypingSpeed(80);
        timer = setTimeout(() => {
          setDisplayText(fullText.slice(0, 1));
        }, 500); // pause for a bit when empty
        return;
      }

      const nextText = isDeleting
        ? fullText.slice(0, displayText.length - 1)
        : fullText.slice(0, displayText.length + 1);

      setDisplayText(nextText);
    };

    timer = setTimeout(handleType, typingSpeed);
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, typingSpeed]);

  const basePart = displayText.slice(0, baseLength);
  const accentPart = displayText.slice(baseLength);

  return (
    <span className="inline-block relative min-h-[2em] sm:min-h-[1.2rem]">
      <span>{basePart}</span>
      {accentPart && (
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-brand-500 to-orange-700">
          {accentPart}
        </span>
      )}
      <span 
        className="inline-block w-[3px] h-[0.9em] bg-orange-500 ml-1.5 align-middle animate-pulse" 
        style={{ animationDuration: '0.8s' }}
      />
    </span>
  );
}

export function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeModalTab, setActiveModalTab] = useState<"pdf" | "readme">("pdf");
  
  // GitHub UI Integration State & Service orchestration
  const {
    repos: githubRepos,
    selectedRepo,
    repoContent,
    isLoadingRepos: isGithubLoading,
    isLoadingContent: isRepoContentLoading,
    selectRepository: handleSelectRepo,
  } = useGithubState();

  // Reset modal tab to PDF on select repository
  useEffect(() => {
    if (selectedRepo) {
      setActiveModalTab("pdf");
    }
  }, [selectedRepo]);

  // Helper to resolve repository category
  const getRepoCategory = (repoName: string): string => {
    const name = repoName.toLowerCase();
    if (name.includes("law") || name.includes("sovereign") || name.includes("objection") || name.includes("bearer") || name.includes("license")) {
      return "Sovereignty & Legal";
    }
    if (name.includes("infrastructure") || name.includes("physics") || name.includes("energy") || name.includes("scarcity") || name.includes("thermo")) {
      return "Physics & Energy";
    }
    if (name.includes("principles") || name.includes("ecosystem") || name.includes("channel") || name.includes("lightning") || name.includes("networks")) {
      return "Networks & Scaling";
    }
    return "Sovereignty & Legal"; // default fallback
  };

  const handleDownloadPdf = (repo: any) => {
    // Show download alert
    setShowDownloadAlert(repo.name);
    setTimeout(() => {
      setShowDownloadAlert(null);
    }, 4500);

    // Call the high-fidelity multi-page PDF downloader
    downloadSovereignPdf(repo.id, repo.name);
  };

  // Automatically generate categories for the research based on GitHub repositories
  const generatedCategories = useMemo(() => {
    console.log("[HomePage] Computing generatedCategories. githubRepos:", githubRepos);
    const cats = new Set<string>();
    githubRepos.forEach(repo => {
      const cat = getRepoCategory(repo.name);
      console.log(`[HomePage] Repo "${repo.name}" classified as category: "${cat}"`);
      cats.add(cat);
    });
    const result = Array.from(cats);
    console.log("[HomePage] Computed generatedCategories:", result);
    return result;
  }, [githubRepos]);

  // Dynamically filter repositories based on active category and search
  const filteredRepos = useMemo(() => {
    console.log(`[HomePage] Computing filteredRepos. githubRepos:`, githubRepos, "selectedCategory:", selectedCategory, "searchQuery:", searchQuery);
    const result = githubRepos.filter(repo => {
      // Filter by auto-generated category
      if (selectedCategory !== "all") {
        const cat = getRepoCategory(repo.name);
        if (cat !== selectedCategory) {
          console.log(`[HomePage] Filter out repo "${repo.name}" (category: "${cat}") because selected is "${selectedCategory}"`);
          return false;
        }
      }
      // Filter by quick search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches = repo.name.toLowerCase().includes(q) || repo.description.toLowerCase().includes(q);
        if (!matches) {
          console.log(`[HomePage] Filter out repo "${repo.name}" because it does not match search query: "${q}"`);
          return false;
        }
      }
      return true;
    });
    console.log("[HomePage] Computed filteredRepos:", result);
    return result;
  }, [githubRepos, selectedCategory, searchQuery]);

  // Modal & Detail state
  const [showDownloadAlert, setShowDownloadAlert] = useState<string | null>(null);

  // Molo AI Chat State
  const [userQuery, setUserQuery] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<Array<{role: "user" | "ai"; text: string}>>([]);
  
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isAiLoading]);

  // Active perspective inside custom Orange Lens widget
  const [activePerspective, setActivePerspective] = useState<string>("inflation");

  const [perspectives, setPerspectives] = useState<any>({
    inflation: {
      title: "Inflation Guard",
      factLine: "Hedge local currency depreciation",
      stat: "Cedi/Naira/Pula vs BTC limits",
      description: "Unlike fiat systems subject to sudden sovereign supply spikes, Bitcoin strictly caps total supply at 21M, providing an immutable mathematical store of value.",
      highlight: "Nodes: Hard Cap ➔ 21M ➔ Distributed Hash Ledger"
    },
    inclusion: {
      title: "Financial Inclusion",
      factLine: "Open-source global settlement rails",
      stat: "USSD Tipping & Offline Nodes",
      description: "Bypasses geographical banking blockades using peer-to-peer lightning channels and offline USSD interfaces like Machankura, allowing anyone with a generic mobile phone to save and transact value.",
      highlight: "Nodes: USSD Gateway ➔ Lightning Node ➔ Instant Settlement"
    },
    mining: {
      title: "Energy & Mining Monetisation",
      factLine: "Bootstrapping remote mini-grids",
      stat: "Gridless Geothermal / Methane Capture",
      description: "Stranded energy from African waterfalls, gases, and rivers is harvested by flexible modular computing mines who purchase excess load, funding the setup of local mini-grids.",
      highlight: "Nodes: Excess Hydro ➔ Modular Container Miners ➔ Rural Power Grid"
    },
    remittance: {
      title: "Lightning Payments",
      factLine: "Ditching cross-border agency commissions",
      stat: "99% cheaper than legacy wire models",
      description: "Enables instant micro-remittances and trans-African trading over Layer 2 Lightning networks without intermediaries or currency conversion tariffs.",
      highlight: "Nodes: Sender Wallet ➔ Onion Routing Hub ➔ Payee Instantly"
    }
  });

  useEffect(() => {
    // Fetch dynamic content configurations
    fetch("/api/homepage/data")
      .then(r => {
        if (!r.ok) {
          throw new Error(`HTTP status ${r.status}`);
        }
        const contentType = r.headers.get("content-type");
        if (contentType && contentType.includes("text/html")) {
          throw new Error("HTML response received instead of JSON (likely static host)");
        }
        return r.json();
      })
      .then(data => {
        if (data && data.perspectives && Object.keys(data.perspectives).length > 0) {
          setPerspectives(data.perspectives);
        }
      })
      .catch(err => {
        console.warn("[HomePage] Offline mode fallback active for homepage data. Keeping default offline perspectives.", err);
      });
  }, []);

  // Blink Donation Script Loader & Initializer
  useEffect(() => {
    let script = document.getElementById("blink-donation-script") as HTMLScriptElement | null;
    
    const initWidget = () => {
      const BlinkPayButton = (window as any).BlinkPayButton;
      if (typeof BlinkPayButton !== 'undefined') {
        try {
          BlinkPayButton.init({
            username: 'jabulanijakes',
            containerId: 'blink-pay-button-container',
            themeMode: 'light',
            language: 'en',
            defaultAmount: 1000,
            supportedCurrencies: [
              {
                "code": "sats",
                "name": "sats",
                "isCrypto": true
              },
              {
                "code": "USD",
                "name": "USD",
                "isCrypto": false
              }
            ],
            debug: false
          });
        } catch (e) {
          console.error("Error initializing BlinkPayButton:", e);
        }
      } else {
        setTimeout(initWidget, 100);
      }
    };

    if (!script) {
      script = document.createElement("script");
      script.id = "blink-donation-script";
      script.src = "https://blinkbitcoin.github.io/donation-button.blink.sv/js/blink-pay-button.js";
      script.async = true;
      script.onload = () => {
        initWidget();
      };
      script.onerror = (err) => {
        console.error("Failed to load Blink Pay button script:", err);
      };
      document.body.appendChild(script);
    } else {
      initWidget();
    }

    return () => {
      const container = document.getElementById("blink-pay-button-container");
      if (container) {
        container.innerHTML = "";
      }
    };
  }, []);

  // Chat with Gemini API on Server
  const handleAiChat = async (promptText: string) => {
    if (!promptText.trim()) return;

    setChatHistory(prev => [...prev, { role: "user", text: promptText }]);
    setUserQuery("");
    setIsAiLoading(true);

    try {
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          prompt: promptText,
          topic: selectedRepo ? `Repository: ${selectedRepo.name}` : undefined
        }),
      });

      const data = await response.json();
      if (data.error) {
        setChatHistory(prev => [...prev, { 
          role: "ai", 
          text: `⚠️ Molo error: ${data.error}` 
        }]);
      } else {
        setChatHistory(prev => [...prev, { role: "ai", text: data.text }]);
      }
    } catch (err) {
      console.error(err);
      setChatHistory(prev => [...prev, { 
        role: "ai", 
        text: "🔌 Connection issue. It looks like the Gemini server is bootloading. Please check GEMINI_API_KEY inside the secrets drawer if this persists." 
      }]);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FCFAF7] text-gray-900 font-sans selection:bg-brand-500 selection:text-white scroll-smooth">
      <SEO 
        title="moloBTC - Africa's Bitcoin Research & Discovery Platform" 
        description="See Bitcoin through the Orange Lens. Discover curated pathways, simplified research, directories and opportunities across the African Bitcoin ecosystem." 
      />
      <Navigation />

      {/* Hero Section with Full-Width Background Image */}
      <section className="relative w-full h-[55vh] sm:h-[65vh] md:h-[75vh] lg:h-[80vh] min-h-[480px] max-h-[800px] overflow-hidden bg-neutral-950 flex items-center">
        {/* Background Image Container */}
        <div className="absolute inset-0 w-full h-full select-none pointer-events-none">
          <img 
            src="https://res.cloudinary.com/dqrptx2qp/image/upload/v1782481905/Molobtc_header_llkobw.png" 
            alt="moloBTC - See Bitcoin Through The Orange Lens" 
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
          {/* Gentle, cinematic gradient overlay to ensure readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-900/40 to-neutral-950/20 md:bg-gradient-to-r md:from-neutral-950/95 md:via-neutral-950/60 md:to-transparent" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center md:items-start text-center md:text-left justify-center h-full text-white">
          <div className="max-w-2xl bg-black/30 md:bg-transparent backdrop-blur-sm md:backdrop-blur-none p-6 sm:p-8 md:p-0 rounded-3xl border border-white/5 md:border-none">
            {/* Tagline Badge */}
            <motion.span 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-block bg-brand-500/90 text-white text-[11px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6 font-mono border border-brand-400/25 shadow-lg shadow-brand-500/20"
            >
              Orange Lens Research
            </motion.span>

            {/* Title / Header */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight mb-6 select-none min-h-[4.5rem] sm:min-h-[3.5rem] md:min-h-[4rem]"
            >
              <TypewriterHeader />
            </motion.h1>

            {/* Subtitle / Paragraph */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="text-sm sm:text-base md:text-lg text-neutral-200 leading-relaxed font-sans max-w-xl mb-8 font-medium"
            >
              MoloBTC helps Africans understand, explore, and navigate Bitcoin through peer-reviewed research, simplified technical explanations, and direct entryways to help you learn, build, mine, and earn.
            </motion.p>

            {/* Interactive Call-To-Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4"
            >
              <button 
                onClick={() => {
                  const el = document.querySelector("#research");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-full sm:w-auto px-6 py-3.5 bg-brand-500 hover:bg-brand-600 active:scale-95 text-white font-semibold rounded-2xl shadow-lg shadow-brand-500/25 hover:shadow-brand-500/35 transition-all text-sm flex items-center justify-center gap-2 border border-brand-400/20"
              >
                <BookOpen className="w-4 h-4" />
                Explore Research
              </button>
              <button 
                onClick={() => {
                  const el = document.querySelector("#discover");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-full sm:w-auto px-6 py-3.5 bg-white/10 hover:bg-white/15 active:scale-95 text-white font-semibold rounded-2xl backdrop-blur-md transition-all text-sm flex items-center justify-center gap-2 border border-white/15 hover:border-white/25"
              >
                <Compass className="w-4 h-4" />
                Discover Tools
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* DOWNLOAD SUCCESS ALERT */}
        <AnimatePresence>
          {showDownloadAlert && (
            <motion.div 
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              className="fixed bottom-6 right-6 z-[80] max-w-md bg-white rounded-2xl border-l-4 border-brand-500 shadow-2xl p-5 flex items-start gap-4 border border-gray-100"
            >
              <div className="flex-shrink-0 bg-brand-50 text-brand-600 rounded-xl p-2.5">
                <Download className="w-6 h-6 stroke-[2]" />
              </div>
              <div className="flex-grow">
                <span className="font-bold text-gray-950 block text-sm">Download Started!</span>
                <span className="text-xs text-gray-500 mt-1 block leading-relaxed">
                  You have downloaded the summary text file for <strong>"{showDownloadAlert}"</strong>. Visit our physical GitHub repo to check active code drafts.
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>



        {/* SECTION: THREE PILLARS CORES */}
        <section className="mb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            
            {/* Pillar 1: Research */}
            <motion.div 
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-150 shadow-sm hover:shadow-xl transition-all hover:border-brand-300 flex flex-col justify-between group cursor-pointer"
              onClick={() => {
                const el = document.querySelector("#research");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <div className="space-y-4">
                <div className="w-12 h-12 bg-orange-50 text-brand-500 rounded-2xl flex items-center justify-center border border-brand-100 group-hover:bg-brand-500 group-hover:text-white transition-all transform group-hover:scale-105 duration-300">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="heading-display text-xl sm:text-2xl font-bold text-gray-950 group-hover:text-brand-600 transition-colors">Research</h3>
                <p className="text-gray-550 text-xs sm:text-sm leading-relaxed">
                  Technical Bitcoin concepts simplified into clear, visual, beginner-friendly explanations.
                </p>
                <div className="pt-2 flex flex-wrap gap-1.5">
                  {["Proof of Work", "Lightning Network", "Self-Custody", "Monetary Economics"].map((tag) => (
                    <span key={tag} className="bg-gray-50 text-gray-500 font-mono text-[9px] px-2 py-0.5 rounded border border-gray-150">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-8 text-xs font-bold text-brand-600 group-hover:text-brand-850 flex items-center gap-1">
                Explore research catalog <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>

            {/* Pillar 2: Discover */}
            <motion.div 
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-150 shadow-sm hover:shadow-xl transition-all hover:border-brand-300 flex flex-col justify-between group cursor-pointer"
              onClick={() => {
                const el = document.querySelector("#molo-ai");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <div className="space-y-4">
                <div className="w-12 h-12 bg-orange-50 text-brand-500 rounded-2xl flex items-center justify-center border border-brand-100 group-hover:bg-brand-500 group-hover:text-white transition-all transform group-hover:scale-105 duration-300">
                  <Compass className="w-6 h-6" />
                </div>
                <h3 className="heading-display text-xl sm:text-2xl font-bold text-gray-950 group-hover:text-brand-600 transition-colors">Discover</h3>
                <p className="text-gray-550 text-xs sm:text-sm leading-relaxed">
                  Explore Molo AI, your Bitcoin knowledge assistant. Ask questions about Bitcoin, Lightning, mining, wallets, economics, open-source projects, and discover beginner-friendly answers powered by our research library.
                </p>
                <div className="pt-2 flex flex-wrap gap-1.5">
                  {["Molo AI", "Bitcoin Q&A", "Research Assistant", "Lightning", "Open Source"].map((tag) => (
                    <span key={tag} className="bg-gray-50 text-gray-500 font-mono text-[9px] px-2 py-0.5 rounded border border-gray-150">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-8 text-xs font-bold text-brand-600 group-hover:text-brand-850 flex items-center gap-1">
                Explore Molo AI <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>

            {/* Pillar 3: Connect */}
            <motion.div 
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-150 shadow-sm hover:shadow-xl transition-all hover:border-brand-300 flex flex-col justify-between group cursor-pointer md:col-span-2 lg:col-span-1"
              onClick={() => {
                const el = document.querySelector("#support");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <div className="space-y-4">
                <div className="w-12 h-12 bg-orange-50 text-brand-500 rounded-2xl flex items-center justify-center border border-brand-100 group-hover:bg-brand-500 group-hover:text-white transition-all transform group-hover:scale-105 duration-300">
                  <Briefcase className="w-6 h-6" />
                </div>
                <h3 className="heading-display text-xl sm:text-2xl font-bold text-gray-950 group-hover:text-brand-600 transition-colors">Connect</h3>
                <p className="text-gray-550 text-xs sm:text-sm leading-relaxed">
                  Support the growth of Molo BTC through Bitcoin donations, contribute to open-source development, or help expand accessible Bitcoin education across Africa.
                </p>
                <div className="pt-2 flex flex-wrap gap-1.5">
                  {["Donations", "Open Source", "Community", "Bitcoin", "Support"].map((tag) => (
                    <span key={tag} className="bg-gray-50 text-gray-500 font-mono text-[9px] px-2 py-0.5 rounded border border-gray-150">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-8 text-xs font-bold text-brand-600 group-hover:text-brand-850 flex items-center gap-1">
                Support Molo BTC <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>

          </div>
        </section>

        {/* SECTION: NEW RESEARCH THAT MAKES BITCOIN EASY TO UNDERSTAND */}
        <section id="research" className="scroll-margin-top mb-24">
          
          {/* Repositioned Research Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-gray-100 pb-8 gap-6">
            <div className="max-w-2xl">
              <span className="text-[11px] font-bold text-brand-600 uppercase tracking-widest block mb-2">curated archives</span>
              <h2 className="heading-display text-2xl sm:text-4xl font-extrabold text-gray-950">
                Research That Makes Bitcoin Easier To Understand
              </h2>
              <p className="text-gray-650 text-xs sm:text-sm mt-3 leading-relaxed">
                We translate complex Bitcoin topics into practical, beginner-friendly research designed to help Africans understand Bitcoin without requiring a technical background.
              </p>
            </div>

            {/* Quick search */}
            <div className="relative w-full max-w-sm shrink-0">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 stroke-[2]" />
              <input 
                type="text" 
                placeholder="Search specific summaries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-xs sm:text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Categories for self-generating research */}
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                selectedCategory === "all" 
                  ? "bg-gray-950 text-white shadow-md shadow-gray-950/20" 
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              All Research
            </button>
            {generatedCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat 
                    ? "bg-gray-950 text-white shadow-md shadow-gray-950/20" 
                    : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* GitHub instructions block */}
          <div className="bg-brand-50/40 border border-brand-100 rounded-2xl p-4 sm:p-5 mb-8 flex flex-col sm:flex-row items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-brand-500/10 flex items-center justify-center shrink-0">
              <Github className="w-5 h-5 text-brand-600" />
            </div>
            <div className="text-center sm:text-left">
              <h4 className="text-xs sm:text-sm font-bold text-gray-900">Sovereign Source Integration Enabled</h4>
              <p className="text-[11px] sm:text-xs text-gray-500 mt-1 leading-relaxed">
                Reading public repositories directly from <strong>github.com/MoloBTC-Org</strong>. This system fetches the legal license files, markdown logs, and open-source specifications to train our on-site <strong>Molo AI</strong>.
              </p>
            </div>
          </div>

          {/* GitHub Repos Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {isGithubLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white rounded-3xl border border-gray-100 p-6 space-y-4 animate-pulse">
                  <div className="flex justify-between items-center">
                    <div className="h-4 bg-gray-200 rounded w-24" />
                    <div className="h-4 bg-gray-200 rounded w-12" />
                  </div>
                  <div className="h-6 bg-gray-200 rounded w-4/5" />
                  <div className="h-12 bg-gray-200 rounded w-full" />
                  <div className="flex gap-4">
                    <div className="h-4 bg-gray-200 rounded w-16" />
                    <div className="h-4 bg-gray-200 rounded w-16" />
                  </div>
                </div>
              ))
            ) : (
              filteredRepos.map((repo) => {
                const repoCat = getRepoCategory(repo.name);
                
                return (
                  <div
                    key={repo.id}
                    className="bg-white rounded-3xl border border-gray-100 hover:border-brand-100 shadow-sm flex flex-col justify-between overflow-hidden hover:shadow-xl transition-all group cursor-pointer"
                    onClick={() => handleSelectRepo(repo)}
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                        <span className="bg-brand-50 text-brand-700 font-mono text-[9px] font-bold px-2 py-0.5 rounded border border-brand-100 uppercase tracking-wider">
                          ⚡ {repoCat}
                        </span>

                        <div className="flex items-center gap-3 text-gray-500 font-mono text-xs">
                          <span className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 text-brand-500 fill-brand-500" />
                            {repo.stars || 42}
                          </span>
                          <span className="flex items-center gap-1">
                            <GitFork className="w-3.5 h-3.5" />
                            {repo.forks || 8}
                          </span>
                        </div>
                      </div>

                      <h3 className="heading-display font-extrabold text-lg sm:text-xl text-gray-950 leading-snug group-hover:text-brand-500 transition-colors mb-2">
                        {repo.name}
                      </h3>

                      <p className="text-xs sm:text-sm text-gray-650 min-h-[4rem] leading-relaxed mb-4 line-clamp-3">
                        {repo.description}
                      </p>

                      <div className="flex items-center gap-4 text-[11px] font-mono text-gray-450 border-t border-gray-50 pt-3">
                        <span>Format: <strong className="text-gray-700">{repo.language || "PDF"}</strong></span>
                        <span>Updated: <strong className="text-gray-700">{repo.updated_at ? new Date(repo.updated_at).toLocaleDateString() : "Just now"}</strong></span>
                      </div>
                    </div>

                    <div className="bg-[#FFFDFB] border-t border-gray-50 px-6 py-4 flex flex-wrap items-center justify-between gap-3">
                      <span className="text-xs font-semibold text-brand-600 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1.5">
                        Read Repository Files <ArrowRight className="w-4 h-4" />
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownloadPdf(repo);
                          }}
                          className="p-1.5 px-3 bg-brand-500 text-white hover:bg-brand-600 font-sans text-[11px] font-bold rounded-xl transition-all shadow-sm inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Download
                        </button>
                        <a
                          href={repo.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                          className="p-1.5 px-3 bg-white text-gray-600 hover:text-gray-900 font-mono text-[10px] font-bold border border-gray-200 hover:border-brand-500 rounded-xl transition-all shadow-sm"
                        >
                          GITHUB ↗
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })
            )}

            {!isGithubLoading && filteredRepos.length === 0 && (
              <div className="col-span-2 text-center py-16 bg-white rounded-3xl border border-dashed border-gray-200">
                <Github className="w-12 h-12 text-gray-300 mx-auto mb-4 stroke-[1.5]" />
                <p className="font-bold text-gray-600">No matching GitHub repositories synced</p>
                <p className="text-gray-450 text-xs mt-1">Try shifting your search phrase or choosing another category</p>
              </div>
            )}
          </div>
        </section>

        {/* SECTION: SUPPORT & DONATE */}
        <section id="support" className="scroll-margin-top mb-24 max-w-4xl mx-auto px-4">
          <div className="bg-[#FAF8F5] rounded-3xl p-6 sm:p-10 relative overflow-hidden border border-brand-100/10 shadow-[0_8px_30px_rgb(0,0,0,0.015)] transition-all duration-300 hover:shadow-[0_12px_40px_rgb(0,0,0,0.03)]">
            <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 h-64 w-64 rounded-full bg-brand-50/20 blur-3xl pointer-events-none" />
            
            <div className="text-center max-w-xl mx-auto mb-10">
              <span className="text-[10px] font-bold text-brand-600 uppercase tracking-widest bg-brand-50/80 px-3 py-1 rounded-full inline-flex items-center gap-1.5 mb-3">
                <Heart className="h-3 w-3 text-brand-500 fill-brand-500 animate-pulse" />
                <span>Support Open Source</span>
              </span>
              <h2 className="heading-display text-2xl sm:text-4xl font-black text-gray-950">Support Molo BTC</h2>
              <p className="text-xs sm:text-sm text-gray-550 leading-relaxed mt-2">
                Help keep Bitcoin education free, tracker-free, and accessible to everyone. Your support directly funds server infrastructure and interactive tools.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-stretch">
              {/* Left Widget Pane */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_12px_30px_rgba(0,0,0,0.015)] flex flex-col justify-center items-center min-h-[260px] transition-all duration-300 hover:shadow-[0_12px_30px_rgba(0,0,0,0.03)]">
                <div id="blink-pay-button-container" className="w-full flex justify-center"></div>
              </div>

              {/* Right Side Info */}
              <div className="flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-orange-50/80 flex items-center justify-center shrink-0 border border-brand-100/20">
                      <Sparkles className="h-4 w-4 text-brand-600" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-950 uppercase tracking-wider">Lightning & On-Chain</h4>
                      <p className="text-[11px] text-gray-550 leading-relaxed mt-1">
                        Contribute any custom amount instantly via Lightning or On-Chain. Powered securely by Blink Bitcoin.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-orange-50/80 flex items-center justify-center shrink-0 border border-brand-100/20">
                      <Heart className="h-4 w-4 text-brand-600" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-950 uppercase tracking-wider">100% Peer-to-Peer</h4>
                      <p className="text-[11px] text-gray-550 leading-relaxed mt-1">
                        No intermediaries, no trackers, no paywalls. Every satoshi directly supports server hosting and educational research.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <p className="text-[11px] text-gray-500">
                    Contribute to our repository instead?{" "}
                    <a 
                      href="https://github.com/MoloBTC-Org" 
                      target="_blank" 
                      rel="noreferrer" 
                      className="text-brand-600 font-semibold hover:underline inline-flex items-center gap-1 hover:text-brand-700 transition-colors"
                    >
                      Star us on GitHub <ExternalLink className="h-3 w-3" />
                    </a>
                  </p>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* SECTION: CONTACT */}
        <section id="contact" className="scroll-margin-top mb-24 max-w-4xl mx-auto px-4 -mt-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 sm:p-8 bg-white rounded-3xl border border-gray-150/60 shadow-[0_8px_30px_rgb(0,0,0,0.015)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.03)] transition-all duration-300">
            <div className="space-y-1 max-w-md text-left">
              <h3 className="heading-display text-lg font-bold text-gray-950">Let's Build Together</h3>
              <p className="text-xs sm:text-sm text-gray-550 leading-relaxed">
                Have questions, collaboration ideas, or want to contribute? Reach out and connect with the Molo BTC team.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-3 items-center">
              <a 
                href="mailto:molobtc@proton.me" 
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-150 rounded-xl transition-all"
              >
                <Mail className="w-3.5 h-3.5 text-gray-500" />
                <span>Email Us</span>
              </a>
              <a 
                href="https://x.com/moloBTC" 
                target="_blank" 
                rel="noreferrer" 
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-150 rounded-xl transition-all"
              >
                <Twitter className="w-3.5 h-3.5 text-gray-500" />
                <span>Follow on X</span>
              </a>
              <a 
                href="https://github.com/MoloBTC-Org" 
                target="_blank" 
                rel="noreferrer" 
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-gray-950 hover:bg-gray-900 rounded-xl transition-all shadow-sm"
              >
                <Github className="w-3.5 h-3.5 text-gray-200" />
                <span>GitHub</span>
              </a>
            </div>
          </div>
        </section>

        {/* SECTION: MOLO AI EXPLORER TUTOR */}
        <section id="molo-ai" className="scroll-margin-top mb-24 max-w-4xl mx-auto px-4">
          <div className="bg-[#120F0D] text-white rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.05)] border border-white/[0.03]">
            <span id="ai-explorer" className="absolute top-0 left-0" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-brand-950/40 via-transparent to-transparent pointer-events-none" />
            
            <div className="relative z-10 space-y-6">
              {/* Header */}
              <div className="text-center max-w-xl mx-auto mb-4">
                <span className="text-[10px] font-bold text-brand-400 bg-brand-950/80 px-3 py-1 rounded-full inline-flex items-center gap-1.5 mb-3 border border-brand-900/40 uppercase tracking-widest">
                  <Sparkles className="w-3 h-3 text-brand-400 animate-pulse" />
                  <span>Interactive Assistant</span>
                </span>
                <h2 className="heading-display text-2xl sm:text-3xl font-black text-white">Molo AI</h2>
                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed mt-2">
                  Ask any question about Bitcoin, Lightning, mining, economics, and open-source projects for instant, clear answers.
                </p>
              </div>

              {/* Chat Card (ChatGPT Inspired) */}
              <div className="bg-[#181412] border border-white/5 rounded-2xl overflow-hidden flex flex-col h-[520px] shadow-2xl relative">
                
                {/* Chat Card Header */}
                <div className="bg-white/[0.02] border-b border-white/5 px-4 sm:px-6 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-semibold tracking-wide text-gray-300">Molo AI</span>
                    <span className="text-[9px] font-mono font-bold tracking-wider uppercase text-gray-500 bg-white/5 px-2 py-0.5 rounded-full">Connected</span>
                  </div>
                  {chatHistory.length > 0 && (
                    <button 
                      onClick={() => setChatHistory([])}
                      className="hover:bg-white/5 p-1.5 px-3 rounded-lg text-gray-400 hover:text-white transition-all flex items-center gap-1.5 text-xs font-medium"
                      title="Clear conversation"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-gray-400 hover:text-red-400 transition-colors" />
                      <span className="hidden sm:inline">Clear Chat</span>
                    </button>
                  )}
                </div>

                {/* Chat Card Body */}
                <div className="flex-grow p-4 sm:p-6 overflow-y-auto space-y-4 text-xs font-sans text-left flex flex-col">
                  {chatHistory.length === 0 ? (
                    /* Welcome State */
                    <div className="flex-grow flex flex-col items-center justify-center text-center max-w-lg mx-auto py-6">
                      <div className="w-12 h-12 rounded-2xl bg-brand-950 border border-brand-900/50 flex items-center justify-center mb-4">
                        <Sparkles className="w-6 h-6 text-brand-400" />
                      </div>
                      <h3 className="text-lg font-bold text-white tracking-tight">Welcome to Molo AI</h3>
                      <p className="text-xs text-gray-400 leading-relaxed mt-1 mb-8 max-w-sm">
                        Your conversational Bitcoin knowledge assistant. Ask anything to get started.
                      </p>
                      
                      {/* Suggested prompts displayed as modern chips */}
                      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {[
                          "Explain the Lightning Network",
                          "What is self-custody?",
                          "Find Bitcoin communities in Africa",
                          "How does Bitcoin mining work?",
                          "Recommend beginner resources"
                        ].map((promptText, i) => (
                          <button
                            key={i}
                            onClick={() => handleAiChat(promptText)}
                            disabled={isAiLoading}
                            className="text-left text-xs bg-white/[0.02] border border-white/5 hover:bg-white/[0.08] hover:border-brand-500/40 p-3 px-4 rounded-xl text-gray-300 transition-all active:scale-[0.98] duration-200 cursor-pointer block leading-snug"
                          >
                            {promptText}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    /* Chat History */
                    <div className="space-y-4 flex-grow">
                      {chatHistory.map((item, idx) => (
                        <div 
                          key={idx} 
                          className={`flex ${item.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-[85%] rounded-2xl p-4 leading-relaxed shadow-sm ${
                            item.role === 'user' 
                              ? 'bg-brand-600 text-white rounded-br-none font-medium' 
                              : 'bg-white/[0.03] border border-white/5 text-gray-100 rounded-bl-none'
                          }`}>
                            {item.text.split("\n").map((line, lIdx) => {
                              let parts = line.split("**");
                              return (
                                <p key={lIdx} className={lIdx > 0 ? "mt-2" : ""}>
                                  {parts.map((part, pIdx) => 
                                    pIdx % 2 === 1 ? <strong key={pIdx} className="text-brand-300 font-bold">{part}</strong> : part
                                  )}
                                </p>
                              );
                            })}
                          </div>
                        </div>
                      ))}

                      {isAiLoading && (
                        <div className="flex justify-start">
                          <div className="bg-white/[0.03] border border-white/5 text-gray-100 rounded-2xl rounded-bl-none p-4 flex items-center gap-2">
                            <div className="flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                              <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                              <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-bounce" />
                            </div>
                            <span className="text-gray-400 font-mono text-[10px] ml-1">Molo AI is typing...</span>
                          </div>
                        </div>
                      )}
                      
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </div>

                {/* Sticky input at bottom */}
                <div className="bg-white/[0.01] border-t border-white/5 p-3.5 sm:p-4">
                  <div className="flex gap-2 items-center bg-[#201B18] border border-white/5 focus-within:border-brand-500/40 rounded-xl px-1.5 py-1.5 transition-all">
                    <input
                      type="text"
                      placeholder="Ask any Bitcoin ecosystem or concept query..."
                      value={userQuery}
                      onChange={(e) => setUserQuery(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAiChat(userQuery)}
                      disabled={isAiLoading}
                      className="flex-grow bg-transparent outline-none border-none text-xs text-white placeholder:text-gray-500 px-3 py-2 font-sans"
                    />
                    <button
                      onClick={() => handleAiChat(userQuery)}
                      disabled={isAiLoading || !userQuery.trim()}
                      className="bg-brand-600 hover:bg-brand-500 text-white rounded-lg p-2 font-semibold transition-all shadow-md flex items-center justify-center disabled:opacity-45 shrink-0 active:scale-95"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </section>

      </main>

      {/* GITHUB REPOSITORY DYNAMIC MARKDOWN VIEWER */}
      <AnimatePresence>
        {selectedRepo && (
          <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog">
            {/* Overlay backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => handleSelectRepo(null)}
              className="fixed inset-0 bg-gray-950/60 backdrop-blur-md" 
            />

            <div className="flex min-h-screen items-center justify-center p-4 text-center">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.4 }}
                className="relative z-10 w-full max-w-4xl rounded-3xl bg-white p-6 sm:p-10 text-left shadow-2xl border border-gray-150 inline-block overflow-hidden"
              >
                {/* Header elements */}
                <div className="flex items-center justify-between border-b border-gray-100 pb-5 mb-6">
                  <div className="flex items-center gap-3">
                    <span className="bg-brand-500 text-white font-mono text-[10px] font-bold px-2.5 py-1 rounded">
                      🐙 LIVE REPO SPEC
                    </span>
                    <span className="text-xs text-gray-400 font-mono flex items-center gap-2">
                      <Star className="w-3.5 h-3.5 text-brand-500 fill-brand-500" />
                      {selectedRepo.stars || 42} Stars
                    </span>
                    <span className="text-xs text-gray-400 font-mono flex items-center gap-2">
                      <GitFork className="w-3.5 h-3.5 text-gray-500" />
                      {selectedRepo.forks || 8} Forks
                    </span>
                  </div>

                  <button 
                    onClick={() => handleSelectRepo(null)}
                    className="p-1 px-3 bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-500 rounded-xl text-xs font-bold font-mono transition-colors"
                  >
                    CLOSE [ESC]
                  </button>
                </div>

                <div className="grid md:grid-cols-12 gap-8 items-start">
                  
                  {/* Left Dynamic File Content Stream */}
                  <div className="md:col-span-8 space-y-6">
                    <div>
                      <h3 className="heading-display text-2xl sm:text-3xl font-extrabold text-gray-950 leading-tight">
                        {selectedRepo.name}
                      </h3>
                      <p className="text-semibold text-gray-650 mt-2 text-xs sm:text-sm">
                        {selectedRepo.description}
                      </p>
                    </div>

                    {/* Navigation Tabs inside Modal */}
                    <div className="flex border-b border-gray-200 gap-6">
                      <button
                        onClick={() => setActiveModalTab("pdf")}
                        className={`pb-3 text-sm font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
                          activeModalTab === "pdf"
                            ? "border-brand-500 text-brand-600 font-bold"
                            : "border-transparent text-gray-500 hover:text-gray-900"
                        }`}
                      >
                        <BookOpen className="w-4 h-4" />
                        PDF Document Preview
                      </button>
                      <button
                        onClick={() => setActiveModalTab("readme")}
                        className={`pb-3 text-sm font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
                          activeModalTab === "readme"
                            ? "border-brand-500 text-brand-600 font-bold"
                            : "border-transparent text-gray-500 hover:text-gray-900"
                        }`}
                      >
                        <Github className="w-4 h-4" />
                        Dynamic README & Files
                      </button>
                    </div>

                    {activeModalTab === "pdf" ? (
                      <div className="space-y-4">
                        <PdfPreviewCanvas 
                          repoId={selectedRepo.id}
                          repoName={selectedRepo.name}
                          onDownload={() => handleDownloadPdf(selectedRepo)}
                        />
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="bg-[#FFFDFB] border border-brand-100/70 p-4 rounded-xl flex items-center gap-2.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shrink-0" />
                          <p className="text-[11px] text-gray-600 m-0">
                            Dynamic content pulled directly from the GitHub repository files. No hardcoded mock data.
                          </p>
                        </div>

                        {isRepoContentLoading ? (
                          <div className="space-y-4 py-8">
                            <div className="h-4 bg-gray-150 rounded w-1/3 animate-pulse" />
                            <div className="h-4 bg-gray-100 rounded w-5/6 animate-pulse" />
                            <div className="h-4 bg-gray-100 rounded w-4/5 animate-pulse" />
                            <div className="h-4 bg-gray-100 rounded w-full animate-pulse" />
                          </div>
                        ) : (
                          <div className="bg-gray-50 border border-gray-150 rounded-2xl p-5 sm:p-6 text-gray-850 font-sans max-h-[420px] overflow-y-auto shadow-inner text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                            {repoContent}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Right metadata / GitHub action links panel */}
                  <div className="md:col-span-4 bg-[#FCFAF7] border border-gray-150 p-5 rounded-2xl min-h-[300px] flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-mono tracking-wider font-bold text-gray-400 uppercase block mb-4">Repository Coordinates</span>
                      
                      <div className="space-y-4">
                        <div>
                          <span className="text-[10px] text-gray-550 uppercase block">GitHub Link:</span>
                          <a 
                            href={selectedRepo.url} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="text-xs font-mono font-bold text-brand-600 hover:text-brand-800 break-all flex items-center gap-1 mt-1 hover:underline"
                          >
                            <Github className="w-3.5 h-3.5 inline shrink-0" />
                            {selectedRepo.url.replace("https://", "")}
                            <ExternalLink className="w-3 h-3 shrink-0" />
                          </a>
                        </div>

                        <div>
                          <span className="text-[10px] text-gray-550 uppercase block">Code Language:</span>
                          <span className="text-xs font-bold text-gray-800 mt-1 block">{selectedRepo.language || "Markdown"}</span>
                        </div>

                        <div>
                          <span className="text-[10px] text-gray-550 uppercase block">Host Entity:</span>
                          <span className="text-xs font-bold text-gray-800 mt-1 block">molobtc (Sovereign Unit)</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom downloads/discuss trigger */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                      <a
                        href={selectedRepo.url}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full bg-gray-950 hover:bg-gray-900 text-white rounded-xl py-3 text-xs sm:text-sm font-semibold transition-all shadow-md inline-flex items-center justify-center gap-2 border border-gray-950"
                      >
                        <Github className="w-4 h-4" />
                        Clone From GitHub
                      </a>
                      <button
                        onClick={() => {
                          const repoName = selectedRepo.name;
                          handleSelectRepo(null);
                          setTimeout(() => {
                            const chatInput = document.querySelector("#molo-ai");
                            chatInput?.scrollIntoView({ behavior: "smooth" });
                            // Prepopulate the query
                            setUserQuery(`Can you explain the main mechanics and context of the molobtc repo: "${repoName}"?`);
                          }, 300);
                        }}
                        className="w-full border border-gray-200 hover:border-brand-500/50 bg-white hover:bg-gray-50 text-gray-750 hover:text-brand-600 rounded-xl py-2.5 text-xs font-semibold mt-2 transition-all inline-flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-brand-500 font-bold" />
                        Discuss with Molo AI
                      </button>
                    </div>

                  </div>

                </div>

              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
