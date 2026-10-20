import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { OfflineBanner } from "./components/OfflineBanner";
import { trackPageView } from "./services/analytics";
import { HomePage } from "./pages/HomePage";

function AnalyticsTracker() {
  const location = useLocation();
  useEffect(() => {
    trackPageView(location.pathname + location.hash);
  }, [location.pathname, location.hash]);
  return null;
}

// Admin Layout & Sovereign Analytics Dashboard
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout").then(m => ({ default: m.AdminLayout })));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard").then(m => ({ default: m.AdminDashboard })));

// Lightweight loading indicator
function AsyncPageSync() {
  return (
    <div className="min-h-screen bg-[#FCFAF7] flex flex-col items-center justify-center p-6" id="loading-fallback">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="relative">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-brand-200 animate-pulse flex items-center justify-center">
            <span className="text-brand-600 font-mono text-xs font-black">⚡</span>
          </div>
          <div className="absolute inset-0 rounded-2xl border-2 border-brand-500/20 animate-ping opacity-60" />
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-900 font-mono">Molo BTC Network</p>
          <p className="text-[9px] font-bold text-gray-400 font-mono uppercase mt-0.5">Connecting Sovereign Corridors...</p>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <AnalyticsTracker />
        <Suspense fallback={<AsyncPageSync />}>
          <OfflineBanner />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/donate" element={<Navigate to="/#support" replace />} />
            <Route path="/article/*" element={<Navigate to="/#research" replace />} />

            {/* Sovereign Analytics Admin Route */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="*" element={<Navigate to="/admin" replace />} />
            </Route>

            {/* Fallback to homepage */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </HelmetProvider>
  );
}
