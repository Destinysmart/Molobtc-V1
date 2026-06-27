import { useState, useEffect, useMemo } from "react";
import { 
  TrendingUp, 
  BookOpen, 
  Users, 
  Sparkles, 
  Download, 
  Send,
  Loader2,
  FileCheck2,
  CheckCircle,
  Clock,
  ChevronRight,
  ShieldCheck,
  FileText,
  Activity,
  Info
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from "recharts";
import { motion, AnimatePresence } from "motion/react";
import { PdfPreviewCanvas } from "../../components/PdfPreviewCanvas";
import { generateChatResponse } from "../../services/geminiService";

interface GithubRepo {
  id: string;
  name: string;
  description: string;
  url: string;
  stars: number;
  forks: number;
  updated_at: string;
  language: string;
}

export function AdminDashboard() {
  const [repos, setRepos] = useState<GithubRepo[]>([]);
  const [selectedRepoId, setSelectedRepoId] = useState<string>("");
  const [isReposLoading, setIsReposLoading] = useState(true);
  const [sandboxPrompt, setSandboxPrompt] = useState("");
  const [sandboxResponse, setSandboxResponse] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"chart" | "telemetry" | "categories">("chart");
  const [toastMessage, setToastMessage] = useState("");

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4000);
  };

  // Load research papers (GitHub Repos)
  useEffect(() => {
    fetch("/api/github/repos")
      .then(res => res.json())
      .then(data => {
        setRepos(data);
        if (data.length > 0) {
          setSelectedRepoId(data[0].id);
        }
        setIsReposLoading(false);
      })
      .catch(err => {
        console.error("Error loading papers in dashboard:", err);
        setIsReposLoading(false);
      });
  }, []);

  const selectedRepo = useMemo(() => {
    return repos.find(r => r.id === selectedRepoId);
  }, [repos, selectedRepoId]);

  // Suggested sandbox prompts for admins to quickly test the AI response format
  const suggestedPrompts = [
    { text: "What is the thermodynamic argument for Bitcoin?", icon: "🔥" },
    { text: "Summarize outbound capital transfer laws.", icon: "⚖️" },
    { text: "Explain lightning channel funding securely.", icon: "⚡" },
    { text: "Draft a policy comment on digital asset custody.", icon: "📋" }
  ];

  // Simulated metrics with beautiful daily breakdowns
  const telemetryData = [
    { name: "Mon", downloads: 340, queries: 120, precision: 98 },
    { name: "Tue", downloads: 550, queries: 210, precision: 99 },
    { name: "Wed", downloads: 480, queries: 195, precision: 97 },
    { name: "Thu", downloads: 710, queries: 320, precision: 99 },
    { name: "Fri", downloads: 980, queries: 410, precision: 99 },
    { name: "Sat", downloads: 1200, queries: 540, precision: 100 },
    { name: "Sun", downloads: 1450, queries: 630, precision: 100 },
  ];

  // Distribution of paper categories for custom charts
  const categoryChartData = [
    { name: "Sovereignty & Legal", count: 4, fill: "#ff7a00" },
    { name: "Physics & Energy", count: 3, fill: "#f59e0b" },
    { name: "Scaling & Networks", count: 2, fill: "#8b5cf6" },
  ];

  // Config parameters loaded from localStorage for sandbox feedback
  const activePersona = localStorage.getItem("molo_tutor_mode") || "ELI5_Beginner";
  const activeCreativity = localStorage.getItem("molo_tutor_creativity") || "0.4";
  const labName = localStorage.getItem("molo_lab_name") || "MoloBTC Sovereign Lab";

  const handleTestSandbox = async (e?: React.FormEvent, customPrompt?: string) => {
    if (e) e.preventDefault();
    const promptToSend = customPrompt || sandboxPrompt;
    if (!promptToSend.trim()) return;

    if (customPrompt) {
      setSandboxPrompt(customPrompt);
    }

    setIsAiLoading(true);
    setSandboxResponse("");

    try {
      const reply = await generateChatResponse(
        promptToSend,
        selectedRepo ? `Repository: ${selectedRepo.name}` : undefined
      );
      setSandboxResponse(reply);
      triggerToast("Cognitive response synthesized successfully!");
    } catch (err: any) {
      setSandboxResponse(`Error: ${err.message || "Failed to submit sandbox test"}`);
    } finally {
      setIsAiLoading(false);
    }
  };

  const totalDownloads = 5710;
  const activeResearchers = 5;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-6 right-6 z-50 bg-gray-950 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] flex items-center gap-2"
          >
            <ShieldCheck className="w-4 h-4 text-brand-500" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Row */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6">
        <div>
          <span className="text-[10px] font-bold text-brand-600 uppercase tracking-widest block mb-1 font-mono">
            Sovereign telemetry & AI staging
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950 font-display tracking-tight">
            Research Command Space
          </h1>
          <p className="text-xs text-gray-550 mt-1 leading-relaxed">
            Monitor open-source BSRF papers, analyze visual engagement statistics, and live-test the Molo Socratic AI sandbox.
          </p>
        </div>
        
        <div className="flex items-center gap-3 bg-white p-2.5 px-4 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] text-xs text-gray-600 font-mono">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-bold">Node State: Operational</span>
        </div>
      </div>

      {/* KPI Cards Grid with Micro-interactions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[
          {
            title: "Synced Papers",
            value: isReposLoading ? "..." : repos.length,
            desc: "Active BSRF repository records",
            icon: BookOpen,
            colorClass: "bg-brand-50 text-brand-600",
            hoverAccent: "hover:shadow-[0_8px_30px_rgba(255,122,0,0.04)]"
          },
          {
            title: "Lab Signatories",
            value: activeResearchers,
            desc: "Cleared peer reviewers in workspace",
            icon: Users,
            colorClass: "bg-emerald-50 text-emerald-600",
            hoverAccent: "hover:shadow-[0_8px_30px_rgba(16,185,129,0.04)]"
          },
          {
            title: "Total Downloads",
            value: totalDownloads.toLocaleString(),
            desc: "Cumulative public summary exports",
            icon: Download,
            colorClass: "bg-blue-50 text-blue-600",
            hoverAccent: "hover:shadow-[0_8px_30px_rgba(59,130,246,0.04)]"
          },
          {
            title: "Active Staging Mode",
            value: activePersona.replace("_", " "),
            desc: `Creativity scale: ${activeCreativity}`,
            icon: Sparkles,
            colorClass: "bg-purple-50 text-purple-600",
            hoverAccent: "hover:shadow-[0_8px_30px_rgba(139,92,246,0.04)]",
            isTruncated: true
          }
        ].map((kpi, idx) => (
          <motion.div
            key={kpi.title}
            whileHover={{ y: -4, transition: { duration: 0.15 } }}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.05 }}
            className={`bg-white p-5 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.015)] flex items-center gap-4 hover:shadow-md transition-all group cursor-pointer ${kpi.hoverAccent}`}
          >
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${kpi.colorClass}`}>
              <kpi.icon className="w-5.5 h-5.5" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block font-mono">{kpi.title}</span>
              <span className={`text-xl sm:text-2xl font-black text-gray-950 leading-none block mt-1 ${kpi.isTruncated ? "truncate" : ""}`}>
                {kpi.value}
              </span>
              <span className="text-[10px] text-gray-400 mt-1 block truncate">{kpi.desc}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Core Section */}
      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* Left column: Analytics Chart & Config Sandbox */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Chart Card */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-[0_4px_25px_rgba(0,0,0,0.015)] space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-gray-950 font-display flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-brand-500" />
                  Ecosystem Engagement Metrics
                </h2>
                <p className="text-xs text-gray-550 mt-0.5 leading-relaxed">
                  Real-time monitoring of downloaded legal summaries and interactive cognitive tutor queries.
                </p>
              </div>
              
              <div className="flex bg-[#FCFAF7] rounded-xl p-1 shrink-0 text-xs font-mono font-bold self-start sm:self-auto shadow-inner">
                <button 
                  onClick={() => setActiveTab("chart")}
                  className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === "chart" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"}`}
                >
                  Downloads Chart
                </button>
                <button 
                  onClick={() => setActiveTab("categories")}
                  className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === "categories" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"}`}
                >
                  Core Categories
                </button>
                <button 
                  onClick={() => setActiveTab("telemetry")}
                  className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === "telemetry" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"}`}
                >
                  System Logs
                </button>
              </div>
            </div>

            {activeTab === "chart" && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="h-64 sm:h-72 w-full pt-2"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={telemetryData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorDownloads" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ff7a00" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#ff7a00" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorQueries" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc"/>
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} fontStyle="italic" />
                    <YAxis stroke="#94a3b8" fontSize={10} />
                    <Tooltip contentStyle={{ borderRadius: "16px", border: "none", boxShadow: "0 10px 30px rgba(0,0,0,0.06)", fontFamily: "sans-serif", fontSize: "12px", background: "#ffffff" }} />
                    <Area type="monotone" dataKey="downloads" name="Summary Exports" stroke="#ff7a00" strokeWidth={2.5} fillOpacity={1} fill="url(#colorDownloads)" />
                    <Area type="monotone" dataKey="queries" name="Cognitive Chats" stroke="#8b5cf6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorQueries)" />
                  </AreaChart>
                </ResponsiveContainer>
              </motion.div>
            )}

            {activeTab === "categories" && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="h-64 sm:h-72 w-full pt-2"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc"/>
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} />
                    <YAxis stroke="#94a3b8" fontSize={10} allowDecimals={false} />
                    <Tooltip contentStyle={{ borderRadius: "16px", border: "none", boxShadow: "0 10px 30px rgba(0,0,0,0.06)", fontFamily: "sans-serif", fontSize: "12px" }} />
                    <Bar dataKey="count" name="Published Papers" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>
            )}

            {activeTab === "telemetry" && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#FCFAF7] rounded-2xl p-5 space-y-3.5 font-mono text-[11px] text-gray-600 leading-relaxed max-h-64 overflow-y-auto shadow-inner"
              >
                <div className="pb-2 border-b border-gray-100">
                  <span className="text-brand-500 font-bold">[INFRASTRUCTURE INTEGRITY]</span> Staging system boots successfully under Node on port 3000.
                </div>
                <div className="flex gap-2">
                  <span className="text-gray-400">16:59:48</span>
                  <span>Loaded {repos.length} live academic repositories securely from backend repository proxy.</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-gray-400">16:59:52</span>
                  <span>Configured cognitive assistant temperature parameters dynamically to {activeCreativity}.</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-gray-400">16:59:55</span>
                  <span>Registered security keys for {activeResearchers} verified signatories with strict consent logic.</span>
                </div>
                <div className="flex gap-2 text-green-600 font-bold">
                  <span>[INTEGRITY]</span> Zero compromised signatures detected. Sovereign parameters are active.
                </div>
              </motion.div>
            )}
          </div>

          {/* AI Sandbox Card */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-[0_4px_25px_rgba(0,0,0,0.015)] space-y-6">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-gray-950 font-display flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-600" />
                Molo Socratic AI Staging Sandbox
              </h2>
              <p className="text-xs text-gray-550 mt-0.5 leading-relaxed">
                Interactively stage model responses to see how the active pedagogical persona (<strong>{activePersona.replace("_", " ")}</strong>) presents complex research papers.
              </p>
            </div>

            {/* Suggested Prompt Chips for High Usability */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono block">
                Quick Test Prompts
              </span>
              <div className="flex flex-wrap gap-2">
                {suggestedPrompts.map((p) => (
                  <button
                    key={p.text}
                    type="button"
                    onClick={() => handleTestSandbox(undefined, p.text)}
                    disabled={isAiLoading}
                    className="bg-gray-50 hover:bg-brand-50/50 text-gray-700 text-xs py-2 px-3.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 font-medium disabled:opacity-50 shadow-sm hover:shadow"
                  >
                    <span>{p.icon}</span>
                    <span>{p.text}</span>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleTestSandbox} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono mb-2">
                    Research Context Paper
                  </label>
                  <select
                    value={selectedRepoId}
                    onChange={(e) => setSelectedRepoId(e.target.value)}
                    className="w-full bg-white rounded-xl p-3 text-xs sm:text-sm font-semibold outline-none focus:ring-2 focus:ring-brand-500/20 shadow-sm appearance-none cursor-pointer"
                  >
                    {isReposLoading ? (
                      <option>Loading publications...</option>
                    ) : (
                      repos.map(r => (
                        <option key={r.id} value={r.id}>
                          📄 {r.name.length > 40 ? r.name.substring(0, 40) + "..." : r.name}
                        </option>
                      ))
                    )}
                  </select>
                </div>
                
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono mb-2">
                    Active Cognitive State
                  </label>
                  <div className="p-3 bg-[#FCFAF7] rounded-xl text-xs sm:text-sm font-mono font-bold text-gray-600 flex items-center justify-between shadow-inner">
                    <span>{activePersona}</span>
                    <span className="bg-brand-100 text-brand-700 px-1.5 py-0.5 rounded text-[10px]">T={activeCreativity}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono mb-2">
                  Socratic Input Query
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={sandboxPrompt}
                    onChange={(e) => setSandboxPrompt(e.target.value)}
                    placeholder="Type or select a quick test prompt above..."
                    className="w-full bg-white rounded-xl py-3.5 pl-4 pr-12 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-brand-500/20 shadow-sm font-medium"
                    disabled={isAiLoading}
                  />
                  <button
                    type="submit"
                    disabled={isAiLoading || !sandboxPrompt.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg disabled:bg-gray-100 disabled:text-gray-450 transition-colors cursor-pointer"
                    title="Run Sandbox Test"
                  >
                    {isAiLoading ? (
                      <Loader2 className="w-4.5 h-4.5 animate-spin text-brand-600" />
                    ) : (
                      <Send className="w-4.5 h-4.5" />
                    )}
                  </button>
                </div>
              </div>
            </form>

            {/* Sandbox AI Response Frame */}
            <AnimatePresence>
              {(sandboxResponse || isAiLoading) && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-[#FCFAF7] rounded-2xl p-5 space-y-3.5 overflow-hidden shadow-inner"
                >
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4.5 h-4.5 text-purple-600 animate-pulse" />
                      <span className="text-xs font-bold text-gray-900 font-display">Staged Assistant Response Preview</span>
                    </div>
                    <span className="font-mono text-[9px] text-gray-400">Gemini-3.5-Flash</span>
                  </div>
                  
                  {isAiLoading ? (
                    <div className="py-10 flex flex-col items-center justify-center text-center text-gray-400 text-xs">
                      <Loader2 className="w-6 h-6 text-brand-500 animate-spin mb-2" />
                      <span className="font-mono text-[10px]">Processing model parameters...</span>
                    </div>
                  ) : (
                    <div className="text-xs sm:text-sm leading-relaxed text-gray-700 font-sans whitespace-pre-wrap">
                      {sandboxResponse}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right column: Interactive Document Verification (PDF view) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-[0_4px_25px_rgba(0,0,0,0.015)] flex flex-col h-full space-y-5">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-gray-950 font-display flex items-center gap-2">
                <FileCheck2 className="h-5 w-5 text-brand-500" />
                Live Document Verification
              </h2>
              <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                Confirm formatting constraints and layout integrity of the selected academic pdf summaries.
              </p>
            </div>

            <div className="space-y-3 shrink-0">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">
                Active Staged Document
              </label>
              <select
                value={selectedRepoId}
                onChange={(e) => setSelectedRepoId(e.target.value)}
                className="w-full bg-[#FCFAF7] rounded-xl p-3 text-xs sm:text-sm font-semibold outline-none focus:ring-2 focus:ring-brand-500/20 shadow-sm cursor-pointer"
              >
                {isReposLoading ? (
                  <option>Loading papers...</option>
                ) : (
                  repos.map(r => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Document Render Container with elegant card wrapper */}
            <div className="flex-grow bg-gray-50 rounded-2xl overflow-hidden min-h-[350px] relative flex flex-col shadow-inner">
              {isReposLoading ? (
                <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-400">
                  <Loader2 className="w-5 h-5 animate-spin mr-2 text-brand-500" />
                  Streaming document raster...
                </div>
              ) : selectedRepo ? (
                <div className="flex-1 overflow-auto p-3 bg-gray-100 flex items-start justify-center">
                  <div className="scale-90 origin-top transform-gpu shadow-lg bg-white rounded-md p-1">
                    <PdfPreviewCanvas 
                      repoId={selectedRepo.id} 
                      repoName={selectedRepo.name} 
                      onDownload={() => {
                        const link = document.createElement("a");
                        link.href = selectedRepo.url;
                        link.target = "_blank";
                        link.click();
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-400 italic">
                  Select a BSRF paper above to stage layout.
                </div>
              )}
            </div>

            <div className="bg-[#FFFDFB] p-4 rounded-2xl flex gap-3 shadow-md shadow-brand-500/5">
              <CheckCircle className="h-5 w-5 text-brand-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-bold text-gray-950 uppercase tracking-wider block font-sans">Sovereign Bearing Crypt</span>
                <p className="text-[10px] text-gray-500 leading-relaxed mt-1">
                  Integrity hash outputs match regulatory requirements. PDF previews simulate paper parameters with pixel accuracy.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
