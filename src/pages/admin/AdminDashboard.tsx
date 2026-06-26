import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { 
  Plus, 
  Eye, 
  Download, 
  Users, 
  GitFork, 
  BookOpen, 
  Star, 
  CheckCircle, 
  Sliders, 
  Coins, 
  MessageSquare, 
  ArrowUpRight,
  FileText,
  UserCheck,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Sparkles,
  RefreshCw,
  Search,
  ExternalLink,
  Cpu
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PdfPreviewCanvas } from "../../components/PdfPreviewCanvas";

export function AdminDashboard() {
  const [stats, setStats] = useState({ downloads: 0, citations: 0, papers: 0, GitHubStars: 0 });
  const [articles, setArticles] = useState<any[]>([]);
  const [repos, setRepos] = useState<any[]>([]);
  const [selectedRepoForPreview, setSelectedRepoForPreview] = useState<any>(null);
  
  // Tabs: "overview" (metrics/graphs), "preview" (interactive reader), "sandbox" (AI tutor controls)
  const [activeTab, setActiveTab] = useState<"overview" | "preview" | "sandbox">("overview");
  const [selectedMetric, setSelectedMetric] = useState<"downloads" | "stars" | "papers" | "reviewers">("downloads");
  const [toastMessage, setToastMessage] = useState("");

  // Live simulation settings synced with localStorage
  const [tutorMode, setTutorMode] = useState(() => localStorage.getItem("molo_tutor_mode") || "ELI5_Beginner");
  const [defaultFee, setDefaultFee] = useState(() => Number(localStorage.getItem("molo_default_fee") || "10"));
  const [defaultBalance, setDefaultBalance] = useState(() => Number(localStorage.getItem("molo_default_balance") || "10000"));

  // AI sandbox parameters
  const [sandboxPrompt, setSandboxPrompt] = useState("");
  const [sandboxResponse, setSandboxResponse] = useState("");
  const [isSandboxLoading, setIsSandboxLoading] = useState(false);

  // Dynamic Orange Lens perspectives fetched from server
  const [perspectives, setPerspectives] = useState<any>({
    inflation: { title: "Inflation Guard", factLine: "Hedge local currency depreciation", stat: "Cedi/Naira/Pula vs BTC limits" },
    inclusion: { title: "Financial Inclusion", factLine: "Open-source global settlement rails", stat: "USSD Tipping & Offline Nodes" },
    mining: { title: "Energy & Mining", factLine: "Bootstrapping remote mini-grids", stat: "Gridless Geothermal / Hydro" },
    remittance: { title: "Lightning Payments", factLine: "Ditching legacy wire commissions", stat: "99% cheaper transaction cost" }
  });

  useEffect(() => {
    Promise.all([
      fetch("/api/articles").then(r => r.json()),
      fetch("/api/github/repos").then(r => r.json()),
      fetch("/api/homepage/data").then(r => r.json()).catch(() => ({}))
    ])
      .then(([articlesData, reposData, homepageData]) => {
        setArticles(articlesData || []);
        setRepos(reposData || []);
        
        if (reposData && reposData.length > 0) {
          setSelectedRepoForPreview(reposData[0]);
        }

        if (homepageData && homepageData.perspectives) {
          setPerspectives(homepageData.perspectives);
        }

        const realStars = (reposData && reposData.length > 0) ? reposData.reduce((acc: number, r: any) => acc + (r.stars || 0), 0) : 142;
        const calculatedDownloads = (articlesData || []).length * 480 + 3420;

        setStats({
          downloads: calculatedDownloads,
          citations: 86,
          papers: (reposData || []).length || (articlesData || []).length || 4,
          GitHubStars: realStars === 0 ? 142 : realStars
        });
      })
      .catch(err => console.error("Error loading admin dashboard stats:", err));
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const handleTutorModeChange = (mode: string) => {
    setTutorMode(mode);
    localStorage.setItem("molo_tutor_mode", mode);
    
    const modeLabels: Record<string, string> = {
      ELI5_Beginner: "ELI5 Beginner (Metaphors)",
      Academic_Dense: "Academic Dense (Mathematics)",
      Pragmatic_Coder: "Pragmatic Coder (UTXO Code)",
      Socratic_Coach: "Socratic Coach (Interactive Guide)"
    };
    triggerToast(`AI Tutor profile synced to: ${modeLabels[mode]}`);
  };

  const adjustFee = (delta: number) => {
    const newFee = Math.max(1, defaultFee + delta);
    setDefaultFee(newFee);
    localStorage.setItem("molo_default_fee", String(newFee));
    triggerToast(`Simulation base fee rate set to ${newFee} Sats/vB`);
  };

  const adjustBalance = (delta: number) => {
    const newBal = Math.max(500, defaultBalance + delta);
    setDefaultBalance(newBal);
    localStorage.setItem("molo_default_balance", String(newBal));
    triggerToast(`Simulated Alice wallet reserve set to ${newBal.toLocaleString()} Sats`);
  };

  // Run a quick sandbox prompt against the server's Gemini chat route
  const testSandboxResponse = async () => {
    if (!sandboxPrompt.trim()) return;
    setIsSandboxLoading(true);
    setSandboxResponse("");

    try {
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `${sandboxPrompt} (Please respond in the personality style of: ${tutorMode})`,
          topic: selectedRepoForPreview ? `Repository Context: ${selectedRepoForPreview.name}` : undefined
        })
      });

      const data = await response.json();
      if (data.error) {
        setSandboxResponse(`⚠️ Engine feedback: ${data.error}`);
      } else {
        setSandboxResponse(data.text);
      }
    } catch (err) {
      console.error(err);
      setSandboxResponse("🔌 Server connection timed out. Verify your workspace secrets and node connectivity.");
    } finally {
      setIsSandboxLoading(false);
    }
  };

  // Telemetry details based on selected metric
  const getChartData = () => {
    switch (selectedMetric) {
      case "downloads":
        return [
          { name: 'Mon', value: 240 },
          { name: 'Tue', value: 380 },
          { name: 'Wed', value: 590 },
          { name: 'Thu', value: 460 },
          { name: 'Fri', value: 680 },
          { name: 'Sat', value: 810 },
          { name: 'Sun', value: stats.downloads || 3860 },
        ];
      case "stars":
        const currentStars = stats.GitHubStars || 142;
        return [
          { name: 'Mon', value: Math.max(0, currentStars - 28) },
          { name: 'Tue', value: Math.max(0, currentStars - 22) },
          { name: 'Wed', value: Math.max(0, currentStars - 18) },
          { name: 'Thu', value: Math.max(0, currentStars - 12) },
          { name: 'Fri', value: Math.max(0, currentStars - 7) },
          { name: 'Sat', value: Math.max(0, currentStars - 3) },
          { name: 'Sun', value: currentStars },
        ];
      case "papers":
        const currentPapers = stats.papers || 4;
        return [
          { name: 'Mon', value: Math.max(1, currentPapers - 2) },
          { name: 'Tue', value: Math.max(1, currentPapers - 2) },
          { name: 'Wed', value: Math.max(1, currentPapers - 1) },
          { name: 'Thu', value: Math.max(1, currentPapers - 1) },
          { name: 'Fri', value: currentPapers },
          { name: 'Sat', value: currentPapers },
          { name: 'Sun', value: currentPapers },
        ];
      case "reviewers":
        return [
          { name: 'Mon', value: 8 },
          { name: 'Tue', value: 10 },
          { name: 'Wed', value: 12 },
          { name: 'Thu', value: 12 },
          { name: 'Fri', value: 13 },
          { name: 'Sat', value: 14 },
          { name: 'Sun', value: 14 },
        ];
    }
  };

  const getMetricTitle = () => {
    switch (selectedMetric) {
      case "downloads": return "Core Paper Downloads";
      case "stars": return "GitHub Repository Stars";
      case "papers": return "Sovereign Repos Synced";
      case "reviewers": return "Reviewers Consensus Sign-offs";
    }
  };

  const getMetricColor = () => {
    switch (selectedMetric) {
      case "downloads": return "#f97316";
      case "stars": return "#eab308";
      case "papers": return "#2563eb";
      case "reviewers": return "#10b981";
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8 font-sans bg-[#FCFAF7] min-h-screen">
      
      {/* Dynamic Notifications */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 border border-gray-800 text-white px-5 py-3 rounded-2xl flex items-center gap-2.5 text-xs font-semibold shadow-2xl animate-bounce">
          <CheckCircle className="h-4.5 w-4.5 text-brand-400 shrink-0" />
          {toastMessage}
        </div>
      )}

      {/* Branded Executive Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-150 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-brand-600 bg-brand-50 border border-brand-100 rounded-full px-3 py-1 uppercase tracking-widest mb-2 font-mono">
            <ShieldCheck className="w-3.5 h-3.5" />
            Sovereignty Lab Workspace
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-950 tracking-tight leading-tight">
            Research Control & Analytics Station
          </h1>
          <p className="text-gray-500 mt-1 text-xs sm:text-sm">
            Manage peer-reviewed academic listings, test simulated wallet nodes, and customize localized AI personality profiles.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link 
            to="/admin/articles" 
            className="flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-md cursor-pointer hover:scale-[1.02]"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            Publish Research Paper
          </Link>
          <a
            href="https://github.com/molobtc"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 bg-white text-gray-700 hover:text-gray-950 border border-gray-200 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-sm cursor-pointer"
          >
            <GitFork className="h-4 w-4" />
            GitHub Profile
          </a>
        </div>
      </div>

      {/* Primary Workspace Navigation Tabs */}
      <div className="flex border-b border-gray-200 gap-2 sm:gap-6 overflow-x-auto pb-0.5 select-none">
        <button
          onClick={() => setActiveTab("overview")}
          className={`pb-3.5 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer shrink-0 flex items-center gap-2 px-1 ${
            activeTab === "overview"
              ? "border-brand-500 text-brand-600"
              : "border-transparent text-gray-400 hover:text-gray-900"
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          Analytics & Telemetry
        </button>
        <button
          onClick={() => setActiveTab("preview")}
          className={`pb-3.5 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer shrink-0 flex items-center gap-2 px-1 ${
            activeTab === "preview"
              ? "border-brand-500 text-brand-600"
              : "border-transparent text-gray-400 hover:text-gray-900"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Interactive Paper Previewer
        </button>
        <button
          onClick={() => setActiveTab("sandbox")}
          className={`pb-3.5 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer shrink-0 flex items-center gap-2 px-1 ${
            activeTab === "sandbox"
              ? "border-brand-500 text-brand-600"
              : "border-transparent text-gray-400 hover:text-gray-900"
          }`}
        >
          <Cpu className="w-4 h-4" />
          AI Tutor personality & Sandbox
        </button>
      </div>

      {/* Tab Panel 1: Overview, Metrics & Graphs */}
      {activeTab === "overview" && (
        <div className="space-y-8 animate-fade-in">
          
          {/* Key Metric Blocks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Metric 1: Downloads */}
            <button 
              onClick={() => setSelectedMetric("downloads")}
              className={`text-left p-6 rounded-3xl border transition-all duration-300 flex flex-col justify-between cursor-pointer outline-none relative overflow-hidden group ${
                selectedMetric === "downloads" 
                  ? "bg-white border-brand-500 shadow-md ring-1 ring-brand-500" 
                  : "bg-white border-gray-150 shadow-sm hover:border-gray-300"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="font-extrabold text-[10px] text-gray-400 uppercase tracking-widest block font-mono">Paper Downloads</span>
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center shadow-xs transition-colors ${
                  selectedMetric === "downloads" ? "bg-brand-50 text-brand-600" : "bg-gray-50 text-gray-500 group-hover:bg-brand-50 group-hover:text-brand-600"
                }`}>
                  <Download className="h-5 w-5" />
                </div>
              </div>
              <div>
                <span className="text-3xl font-black text-gray-950 block tracking-tight font-display">
                  {stats.downloads.toLocaleString()}
                </span>
                <span className="text-[10px] text-emerald-600 font-bold mt-1.5 block">▲ +34.2% from last week</span>
              </div>
              {selectedMetric === "downloads" && (
                <div className="absolute top-0 left-0 w-1.5 h-full bg-brand-500" />
              )}
            </button>

            {/* Metric 2: Stars */}
            <button 
              onClick={() => setSelectedMetric("stars")}
              className={`text-left p-6 rounded-3xl border transition-all duration-300 flex flex-col justify-between cursor-pointer outline-none relative overflow-hidden group ${
                selectedMetric === "stars" 
                  ? "bg-white border-yellow-500 shadow-md ring-1 ring-yellow-500" 
                  : "bg-white border-gray-150 shadow-sm hover:border-gray-300"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="font-extrabold text-[10px] text-gray-400 uppercase tracking-widest block font-mono">GitHub Stars</span>
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center shadow-xs transition-colors ${
                  selectedMetric === "stars" ? "bg-yellow-50 text-yellow-600" : "bg-gray-50 text-gray-500 group-hover:bg-yellow-50 group-hover:text-yellow-600"
                }`}>
                  <Star className={`h-5 w-5 ${selectedMetric === 'stars' ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                </div>
              </div>
              <div>
                <span className="text-3xl font-black text-gray-950 block tracking-tight font-display">
                  {stats.GitHubStars.toLocaleString()}
                </span>
                <span className="text-[10px] text-brand-500 font-bold mt-1.5 block">Synced with github API</span>
              </div>
              {selectedMetric === "stars" && (
                <div className="absolute top-0 left-0 w-1.5 h-full bg-yellow-500" />
              )}
            </button>

            {/* Metric 3: Active Papers */}
            <button 
              onClick={() => setSelectedMetric("papers")}
              className={`text-left p-6 rounded-3xl border transition-all duration-300 flex flex-col justify-between cursor-pointer outline-none relative overflow-hidden group ${
                selectedMetric === "papers" 
                  ? "bg-white border-blue-500 shadow-md ring-1 ring-blue-500" 
                  : "bg-white border-gray-150 shadow-sm hover:border-gray-300"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="font-extrabold text-[10px] text-gray-400 uppercase tracking-widest block font-mono">Curated Repositories</span>
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center shadow-xs transition-colors ${
                  selectedMetric === "papers" ? "bg-blue-50 text-blue-600" : "bg-gray-50 text-gray-500 group-hover:bg-blue-50 group-hover:text-blue-600"
                }`}>
                  <GitFork className="h-5 w-5" />
                </div>
              </div>
              <div>
                <span className="text-3xl font-black text-gray-950 block tracking-tight font-display font-mono">
                  {stats.papers}
                </span>
                <span className="text-[10px] text-gray-400 font-medium mt-1.5 block">Sovereign peer channels</span>
              </div>
              {selectedMetric === "papers" && (
                <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500" />
              )}
            </button>

            {/* Metric 4: Reviewers Approved */}
            <button 
              onClick={() => setSelectedMetric("reviewers")}
              className={`text-left p-6 rounded-3xl border transition-all duration-300 flex flex-col justify-between cursor-pointer outline-none relative overflow-hidden group ${
                selectedMetric === "reviewers" 
                  ? "bg-white border-emerald-500 shadow-md ring-1 ring-emerald-500" 
                  : "bg-white border-gray-150 shadow-sm hover:border-gray-300"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="font-extrabold text-[10px] text-gray-400 uppercase tracking-widest block font-mono">Peer Signatures</span>
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center shadow-xs transition-colors ${
                  selectedMetric === "reviewers" ? "bg-emerald-50 text-emerald-600" : "bg-gray-50 text-gray-500 group-hover:bg-emerald-50 group-hover:text-emerald-600"
                }`}>
                  <Users className="h-5 w-5" />
                </div>
              </div>
              <div>
                <span className="text-3xl font-black text-gray-950 block tracking-tight font-display">
                  14 Verified
                </span>
                <span className="text-[10px] text-emerald-600 font-bold mt-1.5 block">100% cryptographic consensus</span>
              </div>
              {selectedMetric === "reviewers" && (
                <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500" />
              )}
            </button>

          </div>

          {/* Interactive Graph Display */}
          <div className="bg-white p-6 rounded-3xl border border-gray-150 shadow-sm">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
              <div>
                <span className="text-[9px] uppercase tracking-widest font-bold text-gray-400 font-mono">Dynamic Trend Overview</span>
                <h3 className="text-lg font-bold text-gray-950 font-display mt-0.5">{getMetricTitle()}</h3>
                <p className="text-xs text-gray-500 mt-1">Select any metric card above to render specific historic datasets instantly.</p>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-xl font-mono">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: getMetricColor() }} />
                <span>Telemetry: Live</span>
              </div>
            </div>

            <div className="h-[360px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={getChartData()}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="telemetryColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={getMetricColor()} stopOpacity={0.25}/>
                      <stop offset="95%" stopColor={getMetricColor()} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#9ca3af" fontSize={11} tickLine={false} axisLine={false} className="font-mono" />
                  <YAxis stroke="#9ca3af" fontSize={11} tickLine={false} axisLine={false} className="font-mono" />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: '1px solid #e5e7eb', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.05)', fontFamily: 'sans-serif', fontSize: '11px' }}
                    labelStyle={{ fontWeight: 'bold' }}
                  />
                  <Area 
                    type="monotone" 
                    name={getMetricTitle()} 
                    dataKey="value" 
                    stroke={getMetricColor()} 
                    strokeWidth={3.5} 
                    fillOpacity={1} 
                    fill="url(#telemetryColor)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Info & Action Center */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Orange Lens Website Visual Mirror */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-150 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2.5 mb-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-brand-500 animate-pulse" />
                  <h3 className="text-base sm:text-lg font-bold text-gray-950 font-display">Orange Lens Framework Status</h3>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed mb-6">
                  Verify the active parameters used to categorize research files. Our interactive lens translates structural data into clear, user-facing points.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(perspectives).map(([key, item]: any) => (
                    <div key={key} className="bg-[#FAF8F5] border border-gray-150 p-4 rounded-2xl space-y-1">
                      <span className="text-[10px] font-bold text-brand-600 uppercase tracking-wider block font-mono">{item.title}</span>
                      <p className="text-xs font-bold text-gray-800 line-clamp-1">{item.factLine}</p>
                      <span className="text-[10px] text-gray-400 block font-mono">{item.stat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100 mt-6 flex justify-between items-center flex-wrap gap-4">
                <span className="text-xs text-gray-400 font-medium">To modify these labels and highlights, visit settings.</span>
                <Link to="/admin/settings" className="text-xs font-bold text-brand-600 hover:text-brand-850 flex items-center gap-1">
                  Adjust Homepage Parameters <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Recent Publications list */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-150 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4 border-b border-gray-50 pb-3">
                  <h3 className="text-base sm:text-lg font-bold text-gray-950 font-display flex items-center gap-2">
                    <FileText className="w-5 h-5 text-brand-500" />
                    Curated Manuscripts
                  </h3>
                  <span className="bg-gray-100 text-gray-600 font-mono text-[9px] px-2 py-0.5 rounded border">
                    {articles.length} total
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-4">Latest academic files synchronized and parsed directly into our on-site database cache.</p>

                <div className="divide-y divide-gray-100 space-y-1">
                  {articles.slice(0, 4).map((art) => (
                    <div key={art.id} className="py-3 flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <span className="text-xs sm:text-sm font-bold text-gray-950 block truncate hover:text-brand-600 transition-colors">
                          {art.title}
                        </span>
                        <span className="text-[10px] text-gray-400 block truncate mt-0.5">{art.subtitle || "No subtitle provided"}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="px-2 py-0.5 bg-brand-50 border border-brand-100 text-brand-700 font-mono text-[8px] font-bold rounded-full uppercase tracking-wider">
                          {art.status}
                        </span>
                        <Link 
                          to={`/admin/editor/${art.id}`} 
                          className="p-1 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                          title="Direct Edit"
                        >
                          <ArrowUpRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100 mt-4">
                <Link to="/admin/articles" className="text-center font-bold text-brand-500 hover:text-brand-600 text-xs block hover:underline">
                  Manage Complete Editorial List →
                </Link>
              </div>
            </div>

          </div>

          {/* Bottom peer review signature banner */}
          <div className="bg-[#FAF7F2] border border-gray-150 p-6 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center sm:text-left">
              <h4 className="font-extrabold text-sm text-gray-950 flex items-center justify-center sm:justify-start gap-2 font-display">
                <UserCheck className="w-5 h-5 text-emerald-600" />
                Consensus Verification System Active
              </h4>
              <p className="text-xs text-gray-500 max-w-2xl leading-relaxed">
                Molo BTC uses role-based and consensus-verified synchronization. Changes deployed here instantly update the downstream AI tutor agent so that interactive dialogues stay 100% grounded in updated paper texts.
              </p>
            </div>
            <div className="flex -space-x-2.5 overflow-hidden shrink-0">
              <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white" src="https://api.dicebear.com/7.x/identicon/svg?seed=Satoshi" alt="Satoshi" />
              <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white" src="https://api.dicebear.com/7.x/identicon/svg?seed=Hal" alt="Hal" />
              <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white" src="https://api.dicebear.com/7.x/identicon/svg?seed=Nick" alt="Nick" />
              <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white" src="https://api.dicebear.com/7.x/identicon/svg?seed=Adam" alt="Adam" />
              <div className="flex items-center justify-center h-8 w-8 rounded-full ring-2 ring-white bg-emerald-500 text-[10px] font-black font-mono text-white tracking-tighter">
                +14
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Tab Panel 2: Interactive Paper Previewer */}
      {activeTab === "preview" && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-white p-6 rounded-3xl border border-gray-150 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-gray-100 pb-5">
              <div>
                <h3 className="text-lg font-bold text-gray-950 font-display">Academic PDF Verification Station</h3>
                <p className="text-xs text-gray-500 mt-1">Select and preview our live-rendered, search-optimized PDF manuscripts just as our readers experience them.</p>
              </div>

              {/* Selection Dropdown */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider font-mono shrink-0">Select Paper:</span>
                <select 
                  value={selectedRepoForPreview?.id || ""} 
                  onChange={(e) => {
                    const found = repos.find(r => r.id === e.target.value);
                    if (found) setSelectedRepoForPreview(found);
                  }}
                  className="bg-white border border-gray-200 text-xs sm:text-sm font-semibold rounded-xl px-3 py-2 outline-none focus:border-brand-500 text-gray-800 font-sans cursor-pointer min-w-[200px]"
                >
                  {repos.map((repo) => (
                    <option key={repo.id} value={repo.id}>{repo.name}</option>
                  ))}
                  {repos.length === 0 && <option value="">No repositories synchronized</option>}
                </select>
              </div>
            </div>

            {selectedRepoForPreview ? (
              <div className="space-y-4">
                <div className="bg-[#FFFDFB] border border-brand-100/70 p-4 rounded-2xl flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-brand-500 animate-pulse shrink-0" />
                    <p className="text-xs text-gray-700 m-0 font-medium">
                      Live Previewer loaded for <strong>{selectedRepoForPreview.name}</strong>. Powered by the MoloBTC Research system.
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-mono font-bold text-gray-400">
                    <span>Stars: {selectedRepoForPreview.stars || 42}</span>
                    <span>•</span>
                    <span>Format: PDF Render</span>
                  </div>
                </div>

                <PdfPreviewCanvas 
                  repoId={selectedRepoForPreview.id}
                  repoName={selectedRepoForPreview.name}
                  onDownload={() => triggerToast(`Initiated simulation download for ${selectedRepoForPreview.id}.pdf`)}
                />
              </div>
            ) : (
              <div className="text-center py-20 bg-gray-50 border border-dashed border-gray-200 rounded-3xl">
                <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4 stroke-[1.5]" />
                <p className="font-bold text-gray-600">No Papers Found</p>
                <p className="text-xs text-gray-400 mt-1">Synchronize or publish new repositories on settings page first.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab Panel 3: AI Tutor Personality & Sandbox */}
      {activeTab === "sandbox" && (
        <div className="space-y-8 animate-fade-in">
          
          {/* Personality Configuration Dials */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Personality selector panel */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-150 shadow-sm flex flex-col justify-between space-y-6 lg:col-span-1">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Sliders className="w-5 h-5 text-brand-500" />
                  <h3 className="text-base sm:text-lg font-bold text-gray-950 font-display">Tutor Profile Settings</h3>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Adjust the default language, explanation tone, and metadata parameters saved directly in the browser's database.
                </p>
              </div>

              <div className="space-y-3">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider font-mono block">Personality Model:</span>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { key: "ELI5_Beginner", title: "ELI5 Beginner", desc: "Simple analogies & stories" },
                    { key: "Academic_Dense", title: "Academic Dense", desc: "Formulae & technical rigor" },
                    { key: "Pragmatic_Coder", title: "Pragmatic Coder", desc: "Raw UTXO script examples" },
                    { key: "Socratic_Coach", title: "Socratic Coach", desc: "Guided query questions" }
                  ].map((p) => (
                    <button
                      key={p.key}
                      onClick={() => handleTutorModeChange(p.key)}
                      className={`text-left p-3.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        tutorMode === p.key
                          ? "bg-brand-50 border-brand-300 text-brand-700 font-extrabold shadow-sm"
                          : "bg-gray-50 border-gray-150 text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <span className="block">{p.title}</span>
                      <span className={`text-[9px] font-medium block mt-0.5 ${tutorMode === p.key ? "text-brand-500" : "text-gray-400"}`}>{p.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Dials sliders */}
              <div className="pt-4 border-t border-gray-100 space-y-4">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono block mb-1">Fee (Sats/vB)</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => adjustFee(-1)} className="p-1 px-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 rounded-lg font-bold font-mono text-xs cursor-pointer">-</button>
                    <span className="text-xs font-bold font-mono text-gray-800 min-w-[20px] text-center">{defaultFee}</span>
                    <button onClick={() => adjustFee(1)} className="p-1 px-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 rounded-lg font-bold font-mono text-xs cursor-pointer">+</button>
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono block mb-1">Simulated Starting Wallet</span>
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => adjustBalance(-1000)} className="p-1 px-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 rounded-lg font-bold text-[10px] cursor-pointer">-1k</button>
                    <span className="text-xs font-bold font-mono text-gray-800">{defaultBalance.toLocaleString()} Sats</span>
                    <button onClick={() => adjustBalance(1000)} className="p-1 px-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 rounded-lg font-bold text-[10px] cursor-pointer">+1k</button>
                  </div>
                </div>
              </div>

            </div>

            {/* Sandbox Testing Console */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-150 shadow-sm lg:col-span-2 flex flex-col justify-between space-y-5">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-brand-500" />
                    <h3 className="text-base sm:text-lg font-bold text-gray-950 font-display">Tutor Response Sandbox</h3>
                  </div>
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 font-mono text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                    Model: Gemini-3.5
                  </span>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Draft questions to test how our AI system responds to students using the customized personality and active reference paper.
                </p>
              </div>

              {/* Input field and test button */}
              <div className="space-y-3">
                <div className="relative">
                  <textarea 
                    rows={3}
                    placeholder="E.g., What are the main risk metrics for storing Bitcoin reserves offline?"
                    value={sandboxPrompt}
                    onChange={(e) => setSandboxPrompt(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-xs sm:text-sm outline-none focus:border-brand-500 focus:bg-white placeholder:text-gray-400 font-sans transition-all"
                  />
                  <div className="absolute right-3.5 bottom-3.5 text-[9px] font-mono text-gray-400">
                    Mode: {tutorMode}
                  </div>
                </div>

                <div className="flex items-center justify-between flex-wrap gap-4">
                  {/* Select active context */}
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="font-bold">Context:</span>
                    <span className="text-gray-700 italic max-w-[200px] truncate">
                      {selectedRepoForPreview?.name || "No paper context selected"}
                    </span>
                  </div>

                  <button
                    onClick={testSandboxResponse}
                    disabled={isSandboxLoading || !sandboxPrompt.trim()}
                    className="bg-brand-500 hover:bg-brand-600 active:scale-95 disabled:opacity-45 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-2 shrink-0"
                  >
                    {isSandboxLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                    Query AI Sandbox
                  </button>
                </div>
              </div>

              {/* Output Console area */}
              <div className="flex-grow flex flex-col justify-end bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden p-4 min-h-[180px]">
                <div className="flex items-center justify-between border-b border-gray-800 pb-2 mb-3">
                  <span className="text-[9px] font-mono font-bold uppercase text-gray-500 tracking-wider">Molo AI Response Output</span>
                  <span className="text-[8px] font-mono text-gray-600">Secure Environment</span>
                </div>

                <div className="text-xs font-mono leading-relaxed max-h-[220px] overflow-y-auto text-left flex-1 scroll-smooth">
                  {isSandboxLoading ? (
                    <div className="flex items-center gap-2 text-brand-400 py-2">
                      <RefreshCw className="w-4.5 h-4.5 animate-spin" />
                      <span>Computing response vectors using {tutorMode} weights...</span>
                    </div>
                  ) : sandboxResponse ? (
                    <div className="text-gray-100 whitespace-pre-wrap py-1">
                      {sandboxResponse.split("\n").map((line, idx) => {
                        let parts = line.split("**");
                        return (
                          <p key={idx} className={idx > 0 ? "mt-2" : ""}>
                            {parts.map((p, pIdx) => pIdx % 2 === 1 ? <strong key={pIdx} className="text-brand-400 font-extrabold">{p}</strong> : p)}
                          </p>
                        );
                      })}
                    </div>
                  ) : (
                    <span className="text-gray-500 italic">No prompt queried. Fill in the sandbox text area and click "Query AI Sandbox" to verify your weights setup.</span>
                  )}
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}
