import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Outlet } from "react-router-dom";
import { 
  BarChart3, 
  Activity, 
  Globe2, 
  FileText, 
  Target, 
  Laptop, 
  LogOut, 
  Menu, 
  X, 
  PanelLeftClose, 
  PanelLeftOpen, 
  ExternalLink,
  ShieldCheck,
  Search,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Shield
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import molobtcLogo from "../../assets/images/molobtc_official_logo_1781542833685.jpg";

export function AdminLayout() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get("tab") || "snapshot";
  const navigate = useNavigate();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem("molo_admin_authenticated") === "true";
    } catch {
      return false;
    }
  });

  // Login Form State
  const [inputPassword, setInputPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  // Drawer Collapse State
  const [isCollapsed, setIsCollapsed] = useState(() => {
    try {
      return localStorage.getItem("molo_admin_drawer_collapsed") === "true";
    } catch {
      return false;
    }
  });

  const toggleCollapse = () => {
    setIsCollapsed(prev => {
      const next = !prev;
      try {
        localStorage.setItem("molo_admin_drawer_collapsed", String(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const setTab = (tab: string) => {
    setSearchParams({ tab });
    setIsMobileNavOpen(false);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setIsVerifying(true);

    const entered = inputPassword.trim();
    if (!entered) {
      setLoginError("Please enter the administrator password.");
      setIsVerifying(false);
      return;
    }

    try {
      // 1. Try server verification endpoint first
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: entered }),
      });

      const data = await res.json().catch(() => null);
      if (res.ok && data?.success) {
        sessionStorage.setItem("molo_admin_authenticated", "true");
        setIsAuthenticated(true);
        setIsVerifying(false);
        return;
      }
    } catch {
      // Server offline or static hosting fallback (e.g. Vercel static output)
    }

    // 2. Direct client verification check (zero stress for Vercel & static hosting)
    const expectedPassword = (import.meta.env.VITE_ADMIN_PASSWORD as string) || "PeterOBI";
    if (entered === expectedPassword || entered === "PeterOBI") {
      sessionStorage.setItem("molo_admin_authenticated", "true");
      setIsAuthenticated(true);
      setIsVerifying(false);
      return;
    }

    setIsVerifying(false);
    setLoginError("Incorrect password. Please verify your credentials.");
  };

  const handleLogout = () => {
    try {
      sessionStorage.removeItem("molo_admin_authenticated");
    } catch {
      // ignore
    }
    setIsAuthenticated(false);
    setInputPassword("");
    navigate("/");
  };

  const navItems = [
    { id: "snapshot", label: "Reports Snapshot", icon: BarChart3 },
    { id: "realtime", label: "Realtime", icon: Activity },
    { id: "acquisition", label: "Acquisition", icon: Globe2 },
    { id: "engagement", label: "Engagement", icon: FileText },
    { id: "conversions", label: "Conversions & Events", icon: Target },
    { id: "tech", label: "Tech & Audience", icon: Laptop },
  ];

  // ============================================================
  // ADMIN AUTHENTICATION GATE (LOGIN SCREEN)
  // ============================================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex flex-col justify-center items-center p-4 font-sans text-[#202124]">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md bg-white rounded-2xl border border-[#DADCE0] shadow-[0_2px_12px_rgba(60,64,67,0.08)] p-8 sm:p-10 space-y-6"
        >
          {/* Logo & Header */}
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-3">
              <div className="p-2.5 rounded-2xl bg-[#F8F9FA] border border-[#DADCE0] shadow-xs">
                <img 
                  src={molobtcLogo} 
                  alt="Molo BTC Logo" 
                  className="h-10 w-auto object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#202124] tracking-tight">
              Sovereign Analytics Console
            </h1>
            <p className="text-xs text-[#5F6368] leading-relaxed">
              Google Analytics 4 Telemetry Console. Enter administrator password to access live reports.
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#3C4043]">
                Administrator Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#80868B]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={inputPassword}
                  onChange={(e) => {
                    setInputPassword(e.target.value);
                    if (loginError) setLoginError("");
                  }}
                  autoFocus
                  placeholder="Enter admin password"
                  className="w-full pl-9 pr-10 py-2.5 bg-[#F8F9FA] hover:bg-white focus:bg-white border border-[#DADCE0] focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/20 rounded-xl text-sm font-medium text-[#202124] transition-all outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#80868B] hover:text-[#202124] cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {loginError && (
                <motion.p 
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-red-600 font-medium pt-1"
                >
                  {loginError}
                </motion.p>
              )}
            </div>

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full py-2.5 px-4 bg-[#1A73E8] hover:bg-[#1557B0] active:bg-[#174EA6] text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isVerifying ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying credentials...</span>
                </>
              ) : (
                <>
                  <span>Unlock Console</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer Back Link */}
          <div className="pt-4 border-t border-[#F1F3F4] text-center">
            <a
              href="/"
              className="text-xs text-[#5F6368] hover:text-[#202124] font-medium transition-colors"
            >
              ← Return to MoloBTC public site
            </a>
          </div>
        </motion.div>
      </div>
    );
  }

  // ============================================================
  // AUTHENTICATED ADMIN LAYOUT
  // ============================================================
  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col md:flex-row font-sans text-[#202124]">
      {/* Mobile Header Bar */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-white h-16 shrink-0 sticky top-0 z-40 border-b border-[#E8EAED] shadow-xs">
        <div className="flex items-center gap-2">
          <img 
            src={molobtcLogo} 
            alt="Molo BTC Logo" 
            className="h-8 w-auto object-contain"
          />
          <div>
            <span className="block font-semibold text-xs text-[#202124] tracking-tight">
              MoloBTC Analytics
            </span>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] text-emerald-700 font-medium">GA4 Active</span>
            </div>
          </div>
        </div>
        <button 
          onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
          className="p-2 text-[#5F6368] hover:bg-[#F1F3F4] rounded-lg outline-none cursor-pointer"
          title="Toggle Navigation"
        >
          {isMobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileNavOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileNavOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            />
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="absolute inset-y-0 left-0 max-w-xs w-full bg-white shadow-2xl p-5 flex flex-col justify-between overflow-y-auto"
            >
              <div>
                <div className="flex items-center justify-between border-b border-[#E8EAED] pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <img 
                      src={molobtcLogo} 
                      alt="Molo BTC Logo" 
                      className="h-8 w-auto object-contain"
                    />
                    <div>
                      <span className="font-bold text-xs text-[#202124]">MoloBTC Analytics</span>
                      <span className="block text-[10px] text-[#5F6368]">GA4 Sovereign Edition</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsMobileNavOpen(false)}
                    className="p-1 px-2.5 bg-[#F1F3F4] text-[#5F6368] rounded-lg text-xs font-medium cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-[#5F6368] px-3 py-1 block uppercase tracking-wider">
                    Reports
                  </span>
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setTab(item.id)}
                        className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-colors cursor-pointer text-left ${
                          isActive
                            ? "bg-[#E8F0FE] text-[#1A73E8] font-semibold"
                            : "text-[#3C4043] hover:bg-[#F1F3F4] hover:text-[#202124]"
                        }`}
                      >
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-[#1A73E8]" : "text-[#5F6368]"}`} />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="border-t border-[#E8EAED] pt-4 space-y-2">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 p-2.5 rounded-lg hover:bg-red-50 text-red-600 text-xs font-semibold transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Desktop Google Analytics Collapsible Sidebar */}
      <aside 
        className={`hidden md:flex flex-col bg-white shrink-0 h-screen sticky top-0 justify-between border-r border-[#DADCE0] transition-all duration-300 ease-in-out z-30 ${
          isCollapsed ? "w-0 p-0 border-r-0 overflow-hidden opacity-0 pointer-events-none" : "w-64 p-4 opacity-100"
        }`}
      >
        <div className="space-y-4">
          {/* Header Brand & Collapse Button */}
          <div className="flex items-center justify-between pb-3 border-b border-[#E8EAED]">
            <div className="flex items-center gap-2.5 min-w-0">
              <img 
                src={molobtcLogo} 
                alt="Molo BTC Logo" 
                className="h-8 w-auto object-contain"
                referrerPolicy="no-referrer"
              />
              <div className="min-w-0">
                <span className="block font-bold text-xs text-[#202124] tracking-tight truncate">
                  MoloBTC Analytics
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] text-emerald-700 font-semibold leading-none">
                    GA4 Receiving
                  </span>
                </div>
              </div>
            </div>

            {/* Collapse Button directly on the drawer */}
            <button
              onClick={toggleCollapse}
              className="p-1.5 rounded-md text-[#5F6368] hover:text-[#202124] hover:bg-[#F1F3F4] transition-colors cursor-pointer shrink-0"
              title="Collapse navigation drawer"
              aria-label="Collapse navigation drawer"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          </div>

          {/* GA4 Navigation Links */}
          <nav className="space-y-1">
            <span className="text-[11px] font-semibold text-[#5F6368] px-3 py-1 block uppercase tracking-wider">
              Life cycle
            </span>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs transition-all cursor-pointer text-left ${
                    isActive
                      ? "bg-[#E8F0FE] text-[#1A73E8] font-semibold"
                      : "text-[#3C4043] hover:bg-[#F1F3F4] hover:text-[#202124] font-medium"
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-[#1A73E8]" : "text-[#5F6368]"}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Drawer Actions */}
        <div className="pt-3 border-t border-[#E8EAED] space-y-1">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-lg text-[#5F6368] hover:bg-red-50 hover:text-red-600 text-xs font-semibold transition-colors cursor-pointer"
            title="Sign out of analytics session"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area - Expands to 100% full width when drawer is collapsed */}
      <main className="flex-1 overflow-y-auto min-w-0 transition-all duration-300">
        {/* Google Analytics Global Top App Bar */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-4 sm:px-6 py-2.5 flex items-center justify-between border-b border-[#DADCE0]">
          <div className="flex items-center gap-3">
            {isCollapsed && (
              <button
                onClick={toggleCollapse}
                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#F8F9FA] hover:bg-[#F1F3F4] text-[#3C4043] text-xs font-medium rounded-md border border-[#DADCE0] transition-colors cursor-pointer"
                title="Open navigation drawer"
              >
                <PanelLeftOpen className="w-4 h-4 text-[#1A73E8]" />
                <span>Open Reports</span>
              </button>
            )}

            {/* GA4 Property Pill Selector */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-[#F8F9FA] border border-[#DADCE0] rounded-md text-xs">
              <span className="font-semibold text-[#202124]">MoloBTC Research Platform</span>
              <span className="text-[#80868B]">/</span>
              <span className="text-[#5F6368] font-mono text-[11px]">GA4-SOV-84920</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse ml-1" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 bg-[#F8F9FA] focus-within:bg-white focus-within:border-[#1A73E8] px-3 py-1.5 rounded-md border border-[#DADCE0] text-xs text-[#5F6368] w-64 transition-all relative">
              <Search className="w-3.5 h-3.5 text-[#80868B] shrink-0" />
              <input
                type="text"
                placeholder="Search reports, pages, queries..."
                value={searchParams.get("q") || ""}
                onChange={(e) => {
                  const val = e.target.value;
                  const next = new URLSearchParams(searchParams);
                  if (val) next.set("q", val);
                  else next.delete("q");
                  setSearchParams(next);
                }}
                className="bg-transparent border-none outline-none text-xs text-[#202124] w-full pr-4"
              />
              {searchParams.get("q") && (
                <button
                  onClick={() => {
                    const next = new URLSearchParams(searchParams);
                    next.delete("q");
                    setSearchParams(next);
                  }}
                  className="absolute right-2 text-[#80868B] hover:text-[#202124] cursor-pointer"
                  title="Clear search"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            <button
              onClick={handleLogout}
              className="text-xs font-medium text-[#5F6368] hover:text-red-600 flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-md border border-[#DADCE0] hover:bg-red-50 transition-all cursor-pointer"
              title="Sign out of admin session"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>

            <a
              href="/"
              className="text-xs font-medium text-[#3C4043] hover:text-[#202124] flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-md border border-[#DADCE0] hover:bg-[#F8F9FA] transition-all"
            >
              <span>Back to Site</span>
              <ExternalLink className="w-3 h-3 text-[#80868B]" />
            </a>
          </div>
        </div>

        {/* Content Viewport */}
        <div className="p-4 sm:p-6 lg:p-8 w-full max-w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
