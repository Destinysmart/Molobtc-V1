import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  ShieldAlert
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import molobtcLogo from "../../assets/images/molobtc_official_logo_1781542833685.jpg";

export function AdminLayout() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { path: "/admin", name: "Dashboard", icon: LayoutDashboard, end: true },
    { path: "/admin/articles", name: "Research Papers", icon: BookOpen },
    { path: "/admin/users", name: "Research Team", icon: Users },
    { path: "/admin/settings", name: "Lab Settings", icon: Settings },
  ];

  const handleLogout = () => {
    navigate("/");
  };

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
      isActive
        ? "bg-brand-500 text-white shadow-md shadow-brand-500/20"
        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
    }`;

  const mobileNavClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 p-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
      isActive
        ? "bg-brand-500 text-white"
        : "text-gray-700 hover:bg-brand-50/50 hover:text-brand-700"
    }`;

  return (
    <div className="min-h-screen bg-[#FCFAF7] flex flex-col md:flex-row font-sans text-gray-800">
      {/* Mobile Admin Header Navigation */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-white h-16 shrink-0 sticky top-0 z-40 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <NavLink to="/admin" className="flex items-center">
          <img 
            src={molobtcLogo} 
            alt="Molo BTC Logo" 
            className="h-9 w-auto object-contain"
          />
          <span className="ml-2.5 font-display font-extrabold text-sm text-gray-950 uppercase tracking-wider">
            Lab Admin
          </span>
        </NavLink>
        <button 
          onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
          className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg outline-none"
          title="Toggle Admin Navigation"
        >
          {isMobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      {/* Mobile Admin Navigation Dropdown Drawer */}
      <AnimatePresence>
        {isMobileNavOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileNavOpen(false)}
              className="fixed inset-0 bg-gray-950/45 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="absolute inset-y-0 left-0 max-w-xs w-full bg-white shadow-2xl p-6 flex flex-col justify-between overflow-y-auto"
            >
              <div>
                <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
                  <div className="flex items-center">
                    <img 
                      src={molobtcLogo} 
                      alt="Molo BTC Logo" 
                      className="h-8 w-auto object-contain"
                    />
                    <span className="ml-2 font-display font-extrabold text-xs text-gray-950 uppercase tracking-wider">
                      Lab Admin
                    </span>
                  </div>
                  <button 
                    onClick={() => setIsMobileNavOpen(false)}
                    className="p-1 px-2.5 bg-gray-100 text-gray-500 rounded-lg text-xs font-mono font-bold hover:bg-gray-150"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[9px] font-bold text-gray-400 tracking-widest uppercase font-mono block mb-2">Navigation</span>
                  {navItems.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      end={item.end}
                      className={mobileNavClass}
                      onClick={() => setIsMobileNavOpen(false)}
                    >
                      <item.icon className="w-4.5 h-4.5" />
                      <span>{item.name}</span>
                    </NavLink>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-100 pt-5">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 p-3 rounded-xl hover:bg-red-50 text-red-600 text-xs font-black uppercase tracking-wider transition-colors"
                >
                  <LogOut className="w-4.5 h-4.5" />
                  <span>Exit Workspace</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar Navigation */}
      <aside className="hidden md:flex flex-col w-64 bg-white p-6 shrink-0 h-screen sticky top-0 justify-between shadow-[2px_0_15px_rgba(0,0,0,0.015)]">
        <div className="space-y-8">
          <NavLink to="/admin" className="flex items-center justify-center py-2">
            <div className="text-center">
              <img 
                src={molobtcLogo} 
                alt="Molo BTC Logo" 
                className="h-12 w-auto mx-auto object-contain transform hover:scale-105 transition-transform"
                referrerPolicy="no-referrer"
              />
              <span className="mt-2 block font-display font-black text-[10px] text-gray-400 uppercase tracking-widest">
                Sovereign Research Space
              </span>
            </div>
          </NavLink>

          <nav className="space-y-1.5">
            <span className="text-[9px] font-bold text-gray-400 tracking-widest uppercase font-mono block px-4 mb-2">Management Workspace</span>
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={navClass}
              >
                <item.icon className="w-4.5 h-4.5 shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="space-y-4">
          <div className="bg-[#FCFAF7] p-4 rounded-2xl shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-brand-500/10 flex items-center justify-center">
                <ShieldAlert className="w-4 h-4 text-brand-600" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-900 leading-tight">ROOT AUTHOR SPACE</p>
                <p className="text-[9px] text-gray-400 font-mono leading-none mt-0.5">lead-researcher@molo.org</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-4 py-3 rounded-xl hover:bg-red-50 text-red-600 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
          >
            <LogOut className="w-4.5 h-4.5 shrink-0" />
            <span>Exit Workspace</span>
          </button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-8 md:p-10">
        <Outlet />
      </main>
    </div>
  );
}
