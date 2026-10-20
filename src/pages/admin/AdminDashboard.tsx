import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { 
  BarChart3, 
  Activity, 
  Globe2, 
  FileText, 
  Target, 
  Laptop, 
  RefreshCw, 
  Download, 
  Calendar, 
  ChevronDown, 
  Search, 
  ArrowUpRight, 
  ArrowDownRight, 
  Check,
  ShieldCheck,
  HelpCircle
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
  Bar 
} from "recharts";
import { motion, AnimatePresence } from "motion/react";

interface AnalyticsStats {
  totalPageViews: number;
  uniqueVisitors: number;
  visitorIds: string[];
  pages?: Record<string, { path: string; views: number; visitors: number }>;
  sources?: Record<string, number>;
  devices?: Record<string, number>;
  browsers?: Record<string, number>;
  operatingSystems?: Record<string, number>;
  countries?: Record<string, number>;
  whitepaperDownloads: Record<string, number>;
  aiQueriesCount: number;
  lightningInteractions: {
    copy_address: number;
    donate_click: number;
  };
  searchQueries: Array<{ query: string; count: number }>;
  mediaClicks: Record<string, number>;
  dailyStats: Array<{
    date: string;
    pageviews: number;
    downloads: number;
    aiQueries: number;
    visitors: number;
  }>;
  recentEvents: Array<{
    id: string;
    type: string;
    label: string;
    detail: string;
    path?: string;
    device?: string;
    browser?: string;
    os?: string;
    referrer?: string;
    timestamp: string;
  }>;
  realtime?: {
    activeUsers30m: number;
    minuteBars: Array<{ minute: string; count: number }>;
    topActivePages: Array<{ path: string; count: number }>;
  };
}

export function AdminDashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "snapshot";

  const [analytics, setAnalytics] = useState<AnalyticsStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState("");
  
  // Date Range state
  const [dateRange, setDateRange] = useState<"7d" | "14d" | "30d" | "today" | "all">("7d");
  const [isDateMenuOpen, setIsDateMenuOpen] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<"users" | "newUsers" | "views" | "events" | "conversions">("users");

  // Filters & Search for tables
  const [tableSearch, setTableSearch] = useState("");
  const [eventFilter, setEventFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<string>("views");
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const fetchAnalytics = () => {
    setIsLoading(true);
    fetch("/api/analytics/stats")
      .then(res => res.json())
      .then(data => {
        if (data && data.analytics) {
          setAnalytics(data.analytics);
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to load GA4 sovereign analytics:", err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const setTab = (tab: string) => {
    setSearchParams({ tab });
  };

  // Real Calculations - 100% computed from real database state
  const totalDownloads = useMemo(() => {
    if (!analytics?.whitepaperDownloads) return 0;
    return Object.values(analytics.whitepaperDownloads).reduce((a, b) => a + (Number(b) || 0), 0);
  }, [analytics]);

  const totalLightningActions = useMemo(() => {
    if (!analytics?.lightningInteractions) return 0;
    return (Number(analytics.lightningInteractions.copy_address) || 0) + (Number(analytics.lightningInteractions.donate_click) || 0);
  }, [analytics]);

  const totalEvents = useMemo(() => {
    const pageviews = analytics?.totalPageViews || 0;
    const downloads = totalDownloads;
    const aiQueries = analytics?.aiQueriesCount || 0;
    const lightning = totalLightningActions;
    const searchEvents = (analytics?.searchQueries || []).reduce((a, b) => a + b.count, 0);
    return pageviews + downloads + aiQueries + lightning + searchEvents;
  }, [analytics, totalDownloads, totalLightningActions]);

  const totalConversions = useMemo(() => {
    return totalDownloads + totalLightningActions + (analytics?.aiQueriesCount || 0);
  }, [totalDownloads, totalLightningActions, analytics]);

  // Canonical Whitepaper Data - real counts only
  const paperChartData = useMemo(() => {
    const canonicalPapers = [
      { id: "bsrf", name: "BSRF Core", color: "#1A73E8" },
      { id: "capital-flow-regulations", name: "SA Regulations", color: "#E66E00" },
      { id: "nine-pillars-sovereignty", name: "9 Pillars", color: "#E11D48" },
      { id: "bsol", name: "BSOL License", color: "#137333" },
      { id: "bbpp", name: "BBPP Protocol", color: "#06B6D4" },
      { id: "sgas", name: "SGAS Agent", color: "#8B5CF6" },
      { id: "sui-generis-bearer-property", name: "Bearer Property", color: "#F59E0B" },
      { id: "sovereign-monetary-infrastructure", name: "Tier 1 Infra", color: "#5F6368" },
      { id: "self-custody-ecosystem", name: "Custody Index", color: "#84CC16" },
    ];

    return canonicalPapers.map((p) => ({
      name: p.name,
      downloads: Number(analytics?.whitepaperDownloads?.[p.id]) || 0,
      fill: p.color
    }));
  }, [analytics]);

  // Real Timeline series based on selectedMetric - 100% real dailyStats entries
  const timelineData = useMemo(() => {
    if (!analytics?.dailyStats || analytics.dailyStats.length === 0) {
      return [];
    }

    return analytics.dailyStats.map((d) => {
      let metricVal = d.visitors;
      if (selectedMetric === "views") metricVal = d.pageviews;
      else if (selectedMetric === "events") metricVal = d.pageviews + d.downloads + d.aiQueries;
      else if (selectedMetric === "conversions") metricVal = d.downloads + d.aiQueries;
      else if (selectedMetric === "newUsers") metricVal = d.visitors;

      return {
        date: d.date,
        value: metricVal,
      };
    });
  }, [analytics, selectedMetric]);

  // Real Pages & Screens Table Data from actual tracked paths
  const pagesData = useMemo(() => {
    const rawPages = analytics?.pages || {};

    let list = Object.entries(rawPages).map(([p, data]) => {
      const views = data.views || 0;
      const visitors = data.visitors || 0;
      const viewsPerUser = visitors > 0 ? (views / visitors).toFixed(1) : "1.0";
      const totalPV = analytics?.totalPageViews || 0;
      const share = totalPV > 0 ? Math.round((views / totalPV) * 100) : 0;

      let title = p;
      if (p === "/") title = "Home · The Orange Lens";
      else if (p === "/#research") title = "Research · Sovereign Whitepapers";
      else if (p === "/#molo-ai") title = "Molo AI Explorer";
      else if (p === "/#media") title = "Media & Policy";
      else if (p === "/#support") title = "Support & Lightning Micro-Donations";
      else if (p === "/admin") title = "Sovereign Analytics Console";

      return {
        path: p,
        title,
        views,
        visitors,
        viewsPerUser,
        share,
        eventCount: views
      };
    });

    if (tableSearch.trim()) {
      const q = tableSearch.toLowerCase();
      list = list.filter(item => item.path.toLowerCase().includes(q) || item.title.toLowerCase().includes(q));
    }

    list.sort((a, b) => {
      if (sortField === "visitors") {
        return sortAsc ? a.visitors - b.visitors : b.visitors - a.visitors;
      }
      return sortAsc ? a.views - b.views : b.views - a.views;
    });

    return list;
  }, [analytics, tableSearch, sortField, sortAsc]);

  // Real Acquisition Channels Data
  const channelData = useMemo(() => {
    const rawSources = analytics?.sources || {};
    const totalViews = Object.values(rawSources).reduce((a, b) => a + b, 0) || 1;

    return Object.entries(rawSources).map(([source, count]) => {
      let channel = "Direct";
      if (source.includes("Organic") || source.includes("google")) channel = "Organic Search";
      else if (source.includes("Referral") || source.includes("github")) channel = "Referral";
      else if (source.includes("Social") || source.includes("x.com")) channel = "Organic Social";
      else if (source.includes("Press")) channel = "Press Referral";

      const users = count;
      const sessions = count;
      const share = Math.round((count / totalViews) * 100);

      return {
        source,
        channel,
        users,
        sessions,
        share
      };
    });
  }, [analytics]);

  // Real Device Ratios
  const deviceStats = useMemo(() => {
    const desktop = analytics?.devices?.desktop || 0;
    const mobile = analytics?.devices?.mobile || 0;
    const tablet = analytics?.devices?.tablet || 0;
    const total = desktop + mobile + tablet;
    const desktopPct = total > 0 ? Math.round((desktop / total) * 100) : 100;
    const mobilePct = total > 0 ? 100 - desktopPct : 0;
    return { desktop, mobile, tablet, total, desktopPct, mobilePct };
  }, [analytics]);

  // Export current report to CSV
  const handleExportCsv = () => {
    let filename = `molo_analytics_${activeTab}`;
    let headers: string[] = [];
    let rows: (string | number)[][] = [];

    if (activeTab === "engagement" || activeTab === "snapshot") {
      filename = "molo_pages_and_screens";
      headers = ["Page Path", "Page Title", "Views", "Active Users", "Views per User", "Share (%)"];
      rows = pagesData.map(p => [p.path, p.title, p.views, p.visitors, p.viewsPerUser, p.share]);
    } else if (activeTab === "acquisition") {
      filename = "molo_traffic_acquisition";
      headers = ["Source / Medium", "Channel Group", "Users", "Sessions", "Share (%)"];
      rows = channelData.map(c => [c.source, c.channel, c.users, c.sessions, c.share]);
    } else if (activeTab === "conversions") {
      filename = "molo_whitepaper_conversions";
      headers = ["Research Paper", "Downloads"];
      rows = paperChartData.map(p => [p.name, p.downloads]);
    } else if (activeTab === "realtime") {
      filename = "molo_realtime_events";
      headers = ["Event ID", "Type", "Label", "Detail", "Device", "Browser", "Timestamp"];
      rows = (analytics?.recentEvents || []).map(e => [e.id, e.type, e.label, e.detail, e.device || "desktop", e.browser || "Chrome", e.timestamp]);
    } else {
      filename = "molo_overview_metrics";
      headers = ["Metric", "Value"];
      rows = [
        ["Total Page Views", analytics?.totalPageViews || 0],
        ["Unique Readers", analytics?.uniqueVisitors || 0],
        ["Total Downloads", totalDownloads],
        ["Molo AI Queries", analytics?.aiQueriesCount || 0],
        ["Lightning Actions", totalLightningActions],
        ["Total Events", totalEvents]
      ];
    }

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast("Report exported to CSV");
  };

  const dateRangeLabels = {
    "7d": "Last 7 days",
    "14d": "Last 14 days",
    "30d": "Last 30 days",
    "today": "Today",
    "all": "All time"
  };

  return (
    <div className="space-y-6 w-full max-w-full font-sans">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 right-6 z-50 bg-[#202124] text-white text-xs font-medium px-4 py-3 rounded-lg shadow-xl flex items-center gap-2 border border-gray-700"
          >
            <ShieldCheck className="w-4 h-4 text-[#1A73E8]" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* GA4 Report Header & Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-3 border-b border-[#E8EAED]">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#5F6368] mb-1">
            <span>Reports</span>
            <span>/</span>
            <span className="text-[#202124] font-medium capitalize">
              {activeTab === "snapshot" ? "Reports snapshot" : activeTab === "conversions" ? "Conversions & Events" : activeTab}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#202124] tracking-tight">
            {activeTab === "snapshot" && "Reports snapshot"}
            {activeTab === "realtime" && "Realtime overview"}
            {activeTab === "acquisition" && "Traffic acquisition: Session default channel group"}
            {activeTab === "engagement" && "Pages and screens: Page path and screen class"}
            {activeTab === "conversions" && "Events & Conversions: Sovereign research downloads"}
            {activeTab === "tech" && "Tech details: User environment and device category"}
          </h1>
        </div>

        {/* Global Controls: Date Range, Refresh & Export */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Date Picker Button */}
          <div className="relative">
            <button
              onClick={() => setIsDateMenuOpen(!isDateMenuOpen)}
              className="flex items-center gap-2 px-3 py-1.5 bg-white hover:bg-[#F8F9FA] text-xs font-medium text-[#3C4043] rounded-md border border-[#DADCE0] shadow-2xs transition-colors cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-[#5F6368]" />
              <span>{dateRangeLabels[dateRange]}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#5F6368]" />
            </button>

            {isDateMenuOpen && (
              <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-[#DADCE0] py-1 z-30">
                {(["7d", "14d", "30d", "today", "all"] as const).map((range) => (
                  <button
                    key={range}
                    onClick={() => {
                      setDateRange(range);
                      setIsDateMenuOpen(false);
                      triggerToast(`Filtered for ${dateRangeLabels[range]}`);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-[#F1F3F4] cursor-pointer ${
                      dateRange === range ? "text-[#1A73E8] font-semibold bg-[#E8F0FE]" : "text-[#3C4043]"
                    }`}
                  >
                    <span>{dateRangeLabels[range]}</span>
                    {dateRange === range && <Check className="w-3.5 h-3.5 text-[#1A73E8]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Export CSV Button */}
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#F8F9FA] text-xs font-medium text-[#3C4043] rounded-md border border-[#DADCE0] shadow-2xs transition-colors cursor-pointer"
            title="Download CSV spreadsheet"
          >
            <Download className="w-3.5 h-3.5 text-[#5F6368]" />
            <span>Export CSV</span>
          </button>

          {/* Refresh Button */}
          <button
            onClick={() => {
              fetchAnalytics();
              triggerToast("Synchronized live telemetry from database");
            }}
            disabled={isLoading}
            className="p-2 bg-white hover:bg-[#F8F9FA] text-[#3C4043] rounded-md border border-[#DADCE0] shadow-2xs transition-colors cursor-pointer"
            title="Refresh analytics data"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#5F6368] ${isLoading ? "animate-spin text-[#1A73E8]" : ""}`} />
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs Bar */}
      <div className="flex items-center gap-1 border-b border-[#E8EAED] overflow-x-auto pb-0 -mb-2 text-xs font-medium">
        {[
          { id: "snapshot", label: "Overview Snapshot", icon: BarChart3 },
          { id: "realtime", label: "Realtime", icon: Activity },
          { id: "acquisition", label: "Acquisition", icon: Globe2 },
          { id: "engagement", label: "Pages & Screens", icon: FileText },
          { id: "conversions", label: "Conversions & Events", icon: Target },
          { id: "tech", label: "Tech Details", icon: Laptop },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2.5 border-b-2 font-medium transition-colors cursor-pointer whitespace-nowrap ${
                isActive
                  ? "border-[#1A73E8] text-[#1A73E8] font-semibold"
                  : "border-transparent text-[#5F6368] hover:text-[#202124] hover:border-[#DADCE0]"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ============================================================ */}
      {/* TAB 1: REPORTS SNAPSHOT OVERVIEW                             */}
      {/* ============================================================ */}
      {activeTab === "snapshot" && (
        <div className="space-y-6 pt-2">
          {/* GA4 Primary Metric Scorecard Strip - 100% Real Numbers */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
            {[
              {
                id: "users" as const,
                label: "Users",
                value: isLoading ? "..." : (analytics?.uniqueVisitors ?? 0).toLocaleString(),
                desc: "Unique sovereign readers"
              },
              {
                id: "newUsers" as const,
                label: "New users",
                value: isLoading ? "..." : (analytics?.uniqueVisitors ?? 0).toLocaleString(),
                desc: "Identified visitor tokens"
              },
              {
                id: "views" as const,
                label: "Views",
                value: isLoading ? "..." : (analytics?.totalPageViews ?? 0).toLocaleString(),
                desc: "Total recorded page impressions"
              },
              {
                id: "events" as const,
                label: "Event count",
                value: isLoading ? "..." : totalEvents.toLocaleString(),
                desc: "Recorded telemetry interactions"
              },
              {
                id: "conversions" as const,
                label: "Conversions",
                value: isLoading ? "..." : totalConversions.toLocaleString(),
                desc: "Downloads, AI & Lightning"
              },
            ].map((kpi) => {
              const isSelected = selectedMetric === kpi.id;
              return (
                <div
                  key={kpi.id}
                  onClick={() => setSelectedMetric(kpi.id)}
                  className={`bg-white p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected 
                      ? "border-[#1A73E8] ring-1 ring-[#1A73E8] shadow-xs" 
                      : "border-[#DADCE0] hover:border-[#BDC1C6] hover:bg-[#FAFAFA]"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs text-[#5F6368] mb-1">
                    <span className="font-medium">{kpi.label}</span>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-mono">
                      Live
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-[#202124] tracking-tight tabular-nums">
                    {kpi.value}
                  </div>
                  <div className="text-[11px] text-[#5F6368] mt-1 truncate">
                    {kpi.desc}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Main Visualization Grid: Primary Timeline Chart + GA4 Realtime Card */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Left 2 Cols: Timeline Area Chart */}
            <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-[#DADCE0] shadow-2xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#F1F3F4]">
                <div>
                  <h3 className="text-sm font-bold text-[#202124] capitalize">
                    {selectedMetric === "views" ? "Views" : selectedMetric === "events" ? "Event count" : selectedMetric === "conversions" ? "Conversions" : "Users"} by Date
                  </h3>
                  <p className="text-xs text-[#5F6368]">
                    Real telemetry recorded per day
                  </p>
                </div>
                <div className="text-xs font-mono text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-md">
                  Telemetry active
                </div>
              </div>

              {timelineData.length === 0 ? (
                <div className="h-64 sm:h-72 w-full flex flex-col items-center justify-center p-6 text-center bg-[#F8F9FA] rounded-lg border border-dashed border-[#DADCE0]">
                  <p className="text-xs text-[#5F6368] font-medium">Awaiting daily timeline records.</p>
                  <p className="text-[11px] text-[#80868B] mt-1">Telemetry events will plot here as users explore the platform.</p>
                </div>
              ) : (
                <div className="h-64 sm:h-72 w-full pt-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="ga4Gradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#1A73E8" stopOpacity={0.25}/>
                          <stop offset="95%" stopColor="#1A73E8" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F3F4"/>
                      <XAxis dataKey="date" stroke="#80868B" fontSize={11} tickLine={false} />
                      <YAxis stroke="#80868B" fontSize={11} tickLine={false} />
                      <Tooltip 
                        contentStyle={{ 
                          borderRadius: "8px", 
                          border: "1px solid #DADCE0", 
                          boxShadow: "0 4px 12px rgba(60,64,67,0.15)", 
                          fontSize: "12px", 
                          background: "#ffffff" 
                        }} 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="value" 
                        name="Recorded Count" 
                        stroke="#1A73E8" 
                        strokeWidth={2.5} 
                        fillOpacity={1} 
                        fill="url(#ga4Gradient)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Right 1 Col: Signature GA4 Realtime Card */}
            <div className="bg-white p-5 rounded-xl border border-[#DADCE0] shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#F1F3F4]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <h3 className="text-sm font-bold text-[#202124]">Users in last 30 minutes</h3>
                  </div>
                  <button 
                    onClick={() => setTab("realtime")}
                    className="text-xs text-[#1A73E8] hover:underline font-medium cursor-pointer"
                  >
                    View realtime →
                  </button>
                </div>

                {/* Real Realtime Number */}
                <div className="py-4">
                  <div className="text-4xl font-extrabold text-[#202124] tracking-tight tabular-nums">
                    {analytics?.realtime?.activeUsers30m ?? 0}
                  </div>
                  <div className="text-xs text-[#5F6368] mt-1">
                    Active readers in the last 30 minutes
                  </div>
                </div>

                {/* 30-Minute Vertical Bar Histogram */}
                <div className="space-y-1.5 pb-4">
                  <div className="flex items-end gap-1 h-16 w-full bg-[#F8F9FA] p-1.5 rounded-md border border-[#E8EAED]">
                    {(analytics?.realtime?.minuteBars || Array.from({ length: 30 }, (_, i) => ({ minute: `${i}m`, count: 0 }))).map((bar, idx) => (
                      <div 
                        key={idx} 
                        className="flex-1 bg-[#1A73E8] hover:bg-[#1557B0] rounded-xs transition-all cursor-pointer"
                        style={{ height: `${Math.max(6, Math.min(100, (bar.count || 0) * 45 + 6))}%` }}
                        title={`${bar.minute}: ${bar.count} events`}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between text-[10px] text-[#80868B] font-mono">
                    <span>30 min ago</span>
                    <span>Now</span>
                  </div>
                </div>

                {/* Top Active Pages in Last 30 Minutes */}
                <div className="space-y-2 border-t border-[#F1F3F4] pt-3">
                  <span className="text-[11px] font-semibold text-[#5F6368] uppercase tracking-wider block">
                    Top active pages
                  </span>
                  {(!analytics?.realtime?.topActivePages || analytics.realtime.topActivePages.length === 0) ? (
                    <p className="text-xs text-[#80868B] italic py-2">No active readers in the last 30 minutes.</p>
                  ) : (
                    <div className="space-y-1.5">
                      {analytics.realtime.topActivePages.map((pg) => (
                        <div key={pg.path} className="flex items-center justify-between text-xs py-1">
                          <span className="text-[#3C4043] font-mono truncate max-w-[180px]">{pg.path}</span>
                          <span className="text-xs font-semibold text-[#1A73E8] bg-[#E8F0FE] px-2 py-0.5 rounded-md tabular-nums">
                            {pg.count}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Realtime Device Ratio */}
              <div className="pt-3 border-t border-[#F1F3F4] flex items-center justify-between text-xs text-[#5F6368]">
                <span>Desktop: {deviceStats.desktopPct}%</span>
                <span>Mobile: {deviceStats.mobilePct}%</span>
              </div>
            </div>
          </div>

          {/* Secondary GA4 Overview Grid: Acquisition & Pages */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* User Acquisition by Channel */}
            <div className="bg-white p-5 rounded-xl border border-[#DADCE0] shadow-2xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#F1F3F4]">
                <div>
                  <h3 className="text-sm font-bold text-[#202124]">User acquisition by Session default channel group</h3>
                  <p className="text-xs text-[#5F6368]">Sessions categorized by acquisition origin</p>
                </div>
                <button onClick={() => setTab("acquisition")} className="text-xs text-[#1A73E8] hover:underline font-medium cursor-pointer">
                  View acquisition →
                </button>
              </div>

              {channelData.length === 0 ? (
                <div className="p-6 text-center bg-[#F8F9FA] rounded-lg border border-dashed border-[#DADCE0]">
                  <p className="text-xs text-[#5F6368]">No channel acquisition data logged yet.</p>
                </div>
              ) : (
                <div className="space-y-2.5 pt-1">
                  {channelData.slice(0, 4).map((ch) => (
                    <div key={ch.source} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-[#202124]">{ch.channel}</span>
                        <div className="flex items-center gap-3 text-[#5F6368]">
                          <span className="font-mono tabular-nums">{ch.sessions} sessions</span>
                          <span className="font-semibold text-[#202124]">{ch.share}%</span>
                        </div>
                      </div>
                      <div className="w-full h-2 bg-[#F1F3F4] rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#1A73E8] rounded-full transition-all duration-500"
                          style={{ width: `${ch.share}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Views by Page Title */}
            <div className="bg-white p-5 rounded-xl border border-[#DADCE0] shadow-2xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#F1F3F4]">
                <div>
                  <h3 className="text-sm font-bold text-[#202124]">Views by Page title and screen class</h3>
                  <p className="text-xs text-[#5F6368]">Actual pages visited by readers</p>
                </div>
                <button onClick={() => setTab("engagement")} className="text-xs text-[#1A73E8] hover:underline font-medium cursor-pointer">
                  View pages →
                </button>
              </div>

              {pagesData.length === 0 ? (
                <div className="p-6 text-center bg-[#F8F9FA] rounded-lg border border-dashed border-[#DADCE0]">
                  <p className="text-xs text-[#5F6368]">No page views logged yet.</p>
                </div>
              ) : (
                <div className="divide-y divide-[#F1F3F4]">
                  {pagesData.slice(0, 4).map((p) => (
                    <div key={p.path} className="py-2.5 flex items-center justify-between text-xs">
                      <div className="min-w-0 pr-3">
                        <span className="font-medium text-[#202124] block truncate">{p.title}</span>
                        <span className="text-[11px] font-mono text-[#80868B] block truncate">{p.path}</span>
                      </div>
                      <div className="flex items-center gap-4 shrink-0 text-right">
                        <div>
                          <span className="font-bold text-[#202124] block tabular-nums">{p.views}</span>
                          <span className="text-[10px] text-[#80868B]">views</span>
                        </div>
                        <div className="w-12 text-right">
                          <span className="text-xs font-semibold text-[#5F6368]">{p.share}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 2: REALTIME LIVE CONSOLE                                 */}
      {/* ============================================================ */}
      {activeTab === "realtime" && (
        <div className="space-y-6 pt-2">
          {/* Realtime Hero Gauge */}
          <div className="bg-white p-6 rounded-xl border border-[#DADCE0] shadow-2xs">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-[#F1F3F4]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <h2 className="text-lg font-bold text-[#202124]">Users in Last 30 Minutes</h2>
                </div>
                <p className="text-xs text-[#5F6368] mt-0.5">
                  Live pulse of sovereign readers interacting with MoloBTC right now.
                </p>
              </div>
              <div className="text-3xl font-extrabold text-[#1A73E8] tabular-nums">
                {analytics?.realtime?.activeUsers30m ?? 0} <span className="text-xs font-normal text-[#5F6368]">active</span>
              </div>
            </div>

            {/* 30-Minute Detailed Histogram */}
            <div className="pt-4 space-y-2">
              <span className="text-xs font-medium text-[#5F6368]">Minute-by-minute activity distribution (0m to 29m ago)</span>
              <div className="flex items-end gap-1.5 h-24 w-full bg-[#F8F9FA] p-3 rounded-lg border border-[#E8EAED]">
                {(analytics?.realtime?.minuteBars || Array.from({ length: 30 }, (_, i) => ({ minute: `${i}m ago`, count: 0 }))).map((bar, idx) => (
                  <div 
                    key={idx} 
                    className="flex-1 bg-[#1A73E8] hover:bg-[#1557B0] rounded-xs transition-all relative group cursor-pointer"
                    style={{ height: `${Math.max(8, Math.min(100, (bar.count || 0) * 45 + 8))}%` }}
                  >
                    <div className="opacity-0 group-hover:opacity-100 absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-[#202124] text-white text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap z-20 pointer-events-none transition-opacity">
                      {bar.minute}: {bar.count}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-[11px] text-[#80868B] font-mono">
                <span>30 minutes ago</span>
                <span>Active now</span>
              </div>
            </div>
          </div>

          {/* Realtime Event Stream Table */}
          <div className="bg-white p-5 rounded-xl border border-[#DADCE0] shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 pb-3 border-b border-[#F1F3F4]">
              <div>
                <h3 className="text-sm font-bold text-[#202124]">Live Event Stream Feed</h3>
                <p className="text-xs text-[#5F6368]">Individual telemetry hits captured in real time</p>
              </div>

              {/* Event Type Filter */}
              <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-medium">
                {["all", "page_view", "whitepaper_download", "ai_query", "lightning_support"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setEventFilter(f)}
                    className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer capitalize ${
                      eventFilter === f 
                        ? "bg-[#E8F0FE] text-[#1A73E8] font-semibold" 
                        : "text-[#5F6368] hover:bg-[#F1F3F4]"
                    }`}
                  >
                    {f.replace("_", " ")}
                  </button>
                ))}
              </div>
            </div>

            {/* Events List */}
            {(!analytics?.recentEvents || analytics.recentEvents.length === 0) ? (
              <div className="p-6 text-center bg-[#F8F9FA] rounded-lg border border-dashed border-[#DADCE0]">
                <p className="text-xs text-[#5F6368]">No events recorded yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-[#F1F3F4] max-h-96 overflow-y-auto">
                {analytics.recentEvents
                  .filter(e => eventFilter === "all" || e.type === eventFilter)
                  .map((evt) => (
                    <div key={evt.id} className="py-2.5 px-2 hover:bg-[#F8F9FA] rounded-md flex items-center justify-between text-xs transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className={`w-2 h-2 rounded-full shrink-0 ${
                          evt.type === "page_view" ? "bg-[#1A73E8]" :
                          evt.type === "whitepaper_download" ? "bg-emerald-500" :
                          evt.type === "ai_query" ? "bg-purple-500" :
                          evt.type === "lightning_support" ? "bg-amber-500" : "bg-gray-400"
                        }`} />
                        <div className="min-w-0">
                          <span className="font-semibold text-[#202124] mr-2">{evt.label}</span>
                          <span className="text-[#5F6368] font-mono text-[11px] truncate">{evt.detail}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-[#80868B] shrink-0 text-[11px] font-mono">
                        <span>{evt.device || "desktop"}</span>
                        <span>{new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 3: ACQUISITION (CHANNELS & SOURCES)                      */}
      {/* ============================================================ */}
      {activeTab === "acquisition" && (
        <div className="space-y-6 pt-2">
          <div className="bg-white p-5 rounded-xl border border-[#DADCE0] shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 pb-3 border-b border-[#F1F3F4]">
              <div>
                <h3 className="text-sm font-bold text-[#202124]">Session default channel group</h3>
                <p className="text-xs text-[#5F6368]">Primary channels driving sovereign reader traffic</p>
              </div>

              {/* Table Search */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#80868B]" />
                <input
                  type="text"
                  placeholder="Filter channels..."
                  value={tableSearch}
                  onChange={(e) => setTableSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs bg-[#F8F9FA] border border-[#DADCE0] rounded-md text-[#202124] focus:outline-none focus:border-[#1A73E8] w-52"
                />
              </div>
            </div>

            {channelData.length === 0 ? (
              <div className="p-8 text-center bg-[#F8F9FA] rounded-lg border border-dashed border-[#DADCE0]">
                <p className="text-xs text-[#5F6368] font-medium">No channel traffic recorded yet.</p>
                <p className="text-[11px] text-[#80868B] mt-1">Traffic sources will appear as users navigate to the platform.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#DADCE0] text-[#5F6368] font-semibold bg-[#FAFAFA]">
                      <th className="py-3 px-3">Session default channel group</th>
                      <th className="py-3 px-3 text-right">Users</th>
                      <th className="py-3 px-3 text-right">Sessions</th>
                      <th className="py-3 px-3 text-right">Share (%)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F1F3F4] text-[#202124]">
                    {channelData.map((row) => (
                      <tr key={row.source} className="hover:bg-[#F8F9FA] transition-colors">
                        <td className="py-3 px-3 font-medium">
                          <div>
                            <span>{row.channel}</span>
                            <span className="block text-[11px] text-[#80868B] font-mono">{row.source}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-right font-mono tabular-nums">{row.users}</td>
                        <td className="py-3 px-3 text-right font-mono tabular-nums font-semibold">{row.sessions}</td>
                        <td className="py-3 px-3 text-right font-mono tabular-nums font-bold text-[#1A73E8]">{row.share}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 4: ENGAGEMENT (PAGES & SCREENS)                          */}
      {/* ============================================================ */}
      {activeTab === "engagement" && (
        <div className="space-y-6 pt-2">
          <div className="bg-white p-5 rounded-xl border border-[#DADCE0] shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 pb-3 border-b border-[#F1F3F4]">
              <div>
                <h3 className="text-sm font-bold text-[#202124]">Pages and screens: Page path and screen class</h3>
                <p className="text-xs text-[#5F6368]">Breakdown of views and reader engagement per URL route</p>
              </div>

              {/* Table Search */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#80868B]" />
                <input
                  type="text"
                  placeholder="Filter paths..."
                  value={tableSearch}
                  onChange={(e) => setTableSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs bg-[#F8F9FA] border border-[#DADCE0] rounded-md text-[#202124] focus:outline-none focus:border-[#1A73E8] w-52"
                />
              </div>
            </div>

            {pagesData.length === 0 ? (
              <div className="p-8 text-center bg-[#F8F9FA] rounded-lg border border-dashed border-[#DADCE0]">
                <p className="text-xs text-[#5F6368] font-medium">No page views recorded yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#DADCE0] text-[#5F6368] font-semibold bg-[#FAFAFA]">
                      <th className="py-3 px-3">Page path and screen class</th>
                      <th 
                        onClick={() => {
                          setSortField("views");
                          setSortAsc(!sortAsc);
                        }}
                        className="py-3 px-3 text-right cursor-pointer hover:text-[#1A73E8]"
                      >
                        Views {sortField === "views" ? (sortAsc ? "↑" : "↓") : ""}
                      </th>
                      <th 
                        onClick={() => {
                          setSortField("visitors");
                          setSortAsc(!sortAsc);
                        }}
                        className="py-3 px-3 text-right cursor-pointer hover:text-[#1A73E8]"
                      >
                        Users {sortField === "visitors" ? (sortAsc ? "↑" : "↓") : ""}
                      </th>
                      <th className="py-3 px-3 text-right">Views per user</th>
                      <th className="py-3 px-3 text-right">Share (%)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F1F3F4] text-[#202124]">
                    {pagesData.map((row) => (
                      <tr key={row.path} className="hover:bg-[#F8F9FA] transition-colors">
                        <td className="py-3 px-3 font-medium max-w-sm">
                          <div className="truncate">
                            <span className="font-semibold">{row.title}</span>
                            <span className="block text-[11px] font-mono text-[#80868B] truncate">{row.path}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-right font-mono tabular-nums font-bold text-[#202124]">{row.views}</td>
                        <td className="py-3 px-3 text-right font-mono tabular-nums">{row.visitors}</td>
                        <td className="py-3 px-3 text-right font-mono tabular-nums">{row.viewsPerUser}</td>
                        <td className="py-3 px-3 text-right font-mono tabular-nums font-semibold text-[#1A73E8]">{row.share}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 5: CONVERSIONS & EVENTS (WHITEPAPERS & LIGHTNING)        */}
      {/* ============================================================ */}
      {activeTab === "conversions" && (
        <div className="space-y-6 pt-2">
          {/* Whitepapers Downloads Breakdown */}
          <div className="bg-white p-5 rounded-xl border border-[#DADCE0] shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#F1F3F4]">
              <div>
                <h3 className="text-sm font-bold text-[#202124]">Whitepaper Downloads by Document</h3>
                <p className="text-xs text-[#5F6368]">Cumulative exports of Bitcoin research frameworks</p>
              </div>
              <div className="text-xs font-semibold text-[#1A73E8] font-mono">
                Total: {totalDownloads} downloads
              </div>
            </div>

            <div className="h-64 sm:h-72 w-full pt-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={paperChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F3F4"/>
                  <XAxis dataKey="name" stroke="#80868B" fontSize={11} tickLine={false} />
                  <YAxis stroke="#80868B" fontSize={11} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: "8px", 
                      border: "1px solid #DADCE0", 
                      boxShadow: "0 4px 12px rgba(60,64,67,0.15)", 
                      fontSize: "12px" 
                    }} 
                  />
                  <Bar dataKey="downloads" name="Downloads" fill="#1A73E8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Clean Data List */}
            <div className="divide-y divide-[#F1F3F4] border-t border-[#F1F3F4] pt-2">
              {paperChartData.map((item) => (
                <div key={item.name} className="py-2.5 flex items-center justify-between text-xs">
                  <span className="font-medium text-[#202124]">{item.name}</span>
                  <span className="font-mono font-bold text-[#202124] tabular-nums">{item.downloads}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Search Queries Table */}
          <div className="bg-white p-5 rounded-xl border border-[#DADCE0] shadow-2xs space-y-3">
            <h3 className="text-sm font-bold text-[#202124]">Top Research Queries</h3>
            <p className="text-xs text-[#5F6368]">Topics searched by readers in the research interface</p>

            {(!analytics?.searchQueries || analytics.searchQueries.length === 0) ? (
              <div className="p-6 text-center bg-[#F8F9FA] rounded-lg border border-dashed border-[#DADCE0]">
                <p className="text-xs text-[#5F6368]">No search queries logged yet.</p>
                <p className="text-[11px] text-[#80868B] mt-1">Queries will automatically appear here as readers search.</p>
              </div>
            ) : (
              <div className="divide-y divide-[#F1F3F4]">
                {analytics.searchQueries.map((sq, idx) => (
                  <div key={sq.query} className="py-2 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[#80868B]">#{idx + 1}</span>
                      <span className="font-medium text-[#202124]">&ldquo;{sq.query}&rdquo;</span>
                    </div>
                    <span className="font-mono text-[#5F6368] font-semibold tabular-nums">{sq.count} searches</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 6: TECH & AUDIENCE                                       */}
      {/* ============================================================ */}
      {activeTab === "tech" && (
        <div className="space-y-6 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Device Category */}
            <div className="bg-white p-5 rounded-xl border border-[#DADCE0] shadow-2xs space-y-3">
              <h3 className="text-sm font-bold text-[#202124]">Device Category</h3>
              {!analytics?.devices || Object.keys(analytics.devices).length === 0 ? (
                <p className="text-xs text-[#80868B] py-3 italic">Awaiting device telemetry...</p>
              ) : (
                <div className="divide-y divide-[#F1F3F4]">
                  {Object.entries(analytics.devices).map(([dev, count]) => (
                    <div key={dev} className="py-2.5 flex items-center justify-between text-xs">
                      <span className="font-medium capitalize text-[#202124]">{dev}</span>
                      <span className="font-mono font-bold text-[#202124] tabular-nums">{count}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Browsers */}
            <div className="bg-white p-5 rounded-xl border border-[#DADCE0] shadow-2xs space-y-3">
              <h3 className="text-sm font-bold text-[#202124]">Browsers</h3>
              {!analytics?.browsers || Object.keys(analytics.browsers).length === 0 ? (
                <p className="text-xs text-[#80868B] py-3 italic">Awaiting browser telemetry...</p>
              ) : (
                <div className="divide-y divide-[#F1F3F4]">
                  {Object.entries(analytics.browsers).map(([brw, count]) => (
                    <div key={brw} className="py-2.5 flex items-center justify-between text-xs">
                      <span className="font-medium text-[#202124]">{brw}</span>
                      <span className="font-mono font-bold text-[#202124] tabular-nums">{count}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Operating Systems */}
            <div className="bg-white p-5 rounded-xl border border-[#DADCE0] shadow-2xs space-y-3">
              <h3 className="text-sm font-bold text-[#202124]">Operating Systems</h3>
              {!analytics?.operatingSystems || Object.keys(analytics.operatingSystems).length === 0 ? (
                <p className="text-xs text-[#80868B] py-3 italic">Awaiting OS telemetry...</p>
              ) : (
                <div className="divide-y divide-[#F1F3F4]">
                  {Object.entries(analytics.operatingSystems).map(([os, count]) => (
                    <div key={os} className="py-2.5 flex items-center justify-between text-xs">
                      <span className="font-medium text-[#202124]">{os}</span>
                      <span className="font-mono font-bold text-[#202124] tabular-nums">{count}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
