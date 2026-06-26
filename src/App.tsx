/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { OfflineBanner } from "./components/OfflineBanner";

// Dynamic optimized code-splitting chunks
const HomePage = lazy(() => import("./pages/HomePage").then(m => ({ default: m.HomePage })));
const ArticlePage = lazy(() => import("./pages/ArticlePage").then(m => ({ default: m.ArticlePage })));
const DonatePage = lazy(() => import("./pages/DonatePage").then(m => ({ default: m.DonatePage })));

// Super lightweight instant feedback indicator for slow 3G phones
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
          <p className="text-[9px] font-bold text-gray-400 font-mono uppercase mt-0.5">Fetching Corridors...</p>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Suspense fallback={<AsyncPageSync />}>
          <OfflineBanner />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/article/:slug" element={<ArticlePage />} />
            <Route path="/donate" element={<DonatePage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </HelmetProvider>
  );
}
