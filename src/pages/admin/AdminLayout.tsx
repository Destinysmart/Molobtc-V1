import React, { useState } from "react";
import { NavLink, Link, Outlet } from "react-router-dom";
import { LayoutDashboard, FileSpreadsheet, Settings, Users, LogOut, Shield, Menu, X } from "lucide-react";

export function AdminLayout() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm transition-all ${
      isActive
        ? "bg-brand-500 text-white shadow-md shadow-brand-500/10"
        : "text-gray-650 hover:bg-gray-100 hover:text-gray-955"
    }`;

  const mobileNavClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
      isActive
        ? "bg-brand-500 text-white shadow-md shadow-brand-500/10"
        : "text-gray-700 bg-white/70 hover:bg-gray-100"
    }`;

  return (
    <div className="flex h-screen bg-[#FCFAF7] flex-col md:flex-row relative">
      
      {/* Mobile Admin Header Navigation */}
      <header className="flex md:hidden items-center justify-between px-4 h-16 bg-white border-b border-gray-200 z-30 sticky top-0 shrink-0">
        <Link to="/" className="flex items-center">
          <img 
            src="/src/assets/images/molobtc_official_logo_1781542833685.jpg" 
            alt="Molo BTC Logo" 
            className="h-8 w-auto object-contain"
          />
        </Link>
        
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-bold text-brand-600 bg-brand-50 border border-brand-100 rounded px-2 py-0.5 uppercase tracking-wide">
            Lab Admin
          </span>
          <button 
            onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg outline-none"
            title="Toggle Admin Navigation"
          >
            {isMobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Admin Navigation Dropdown Drawer */}
      {isMobileNavOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-b border-gray-200 p-4 space-y-2 z-20 shadow-lg absolute top-16 left-0 right-0 max-h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-2 px-2 font-mono">
            Researcher Control Panel
          </div>
          <nav className="space-y-1">
            <NavLink to="/admin" end className={mobileNavClass} onClick={() => setIsMobileNavOpen(false)}>
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </NavLink>
            <NavLink to="/admin/articles" className={mobileNavClass} onClick={() => setIsMobileNavOpen(false)}>
              <FileSpreadsheet className="h-4 w-4" />
              Research Papers
            </NavLink>
            <NavLink to="/admin/users" className={mobileNavClass} onClick={() => setIsMobileNavOpen(false)}>
              <Users className="h-4 w-4" />
              Research Team
            </NavLink>
            <NavLink to="/admin/settings" className={mobileNavClass} onClick={() => setIsMobileNavOpen(false)}>
              <Settings className="h-4 w-4" />
              Lab Settings
            </NavLink>
          </nav>
          
          <div className="pt-4 border-t border-gray-150 flex flex-col gap-3">
            <div className="rounded-xl bg-gray-50 border border-gray-150 p-3 flex items-center gap-3">
              <Shield className="h-4 w-4 text-brand-500 shrink-0" />
              <div className="min-w-0">
                <span className="text-[9px] font-bold text-gray-400 block uppercase">Log-in Session</span>
                <span className="text-[10px] font-bold text-gray-700 truncate block">lead-researcher@molo.org</span>
              </div>
            </div>
            <Link 
              to="/" 
              className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-600 hover:text-gray-950 transition-colors"
              onClick={() => setIsMobileNavOpen(false)}
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Exit Workspace</span>
            </Link>
          </div>
        </div>
      )}

      {/* Sidebar navigation */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col hidden md:flex shrink-0">
        <div className="p-5 border-b border-gray-105 flex items-center justify-center">
          <img 
            src="/src/assets/images/molobtc_official_logo_1781542833685.jpg" 
            alt="Molo BTC Logo" 
            className="h-11 w-auto object-contain transform hover:scale-102 transition-transform"
            referrerPolicy="no-referrer"
          />
        </div>
        
        <nav className="flex-1 p-4 space-y-1.5">
          <NavLink to="/admin" end className={navClass}>
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </NavLink>
          <NavLink to="/admin/articles" className={navClass}>
            <FileSpreadsheet className="h-4 w-4" />
            Research Papers
          </NavLink>
          <NavLink to="/admin/users" className={navClass}>
            <Users className="h-4 w-4" />
            Research Team
          </NavLink>
          <NavLink to="/admin/settings" className={navClass}>
            <Settings className="h-4 w-4" />
            Lab Settings
          </NavLink>
        </nav>
        
        {/* Workspace Footer actions */}
        <div className="p-4 border-t border-gray-100 bg-[#FCFAF7]">
           <div className="rounded-xl bg-white border border-gray-150 p-3.5 mb-3 flex items-center gap-2">
             <Shield className="h-4 w-4 text-brand-500 shrink-0" />
             <div className="truncate">
               <span className="text-[10px] font-bold text-gray-400 block uppercase">Root Author Space</span>
               <span className="text-[11px] font-bold text-gray-800 truncate block">lead-researcher@molo.org</span>
             </div>
           </div>

           <Link to="/" className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-gray-500 hover:text-gray-955 transition-colors">
             <LogOut className="h-4 w-4" />
             Exit Workspace
           </Link>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto w-full">
        <Outlet />
      </main>
    </div>
  );
}
