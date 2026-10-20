/**
 * Build-time Prerendering Script (SSG) for MoloBTC
 * 
 * Runs after `vite build` to inject the statically rendered React HomePage
 * directly into `dist/index.html` for production deployment, ensuring search engines
 * and AI crawlers receive complete HTML without JavaScript execution.
 */

import fs from "fs";
import path from "path";
import React from "react";
import { renderToString } from "react-dom/server";
import { createServer } from "vite";

async function prerender() {
  const distIndexPath = path.join(process.cwd(), "dist", "index.html");

  if (!fs.existsSync(distIndexPath)) {
    console.warn("[Prerender] dist/index.html not found. Skipping prerender.");
    return;
  }

  console.log("[Prerender] Starting build-time static HTML prerender for dist/index.html...");

  const vite = await createServer({
    server: { middlewareMode: true, hmr: false },
    appType: "custom",
  });

  try {
    // 1. SSR load HomePage & HelmetProvider
    const { HomePage } = await vite.ssrLoadModule("./src/pages/HomePage.tsx");
    const { HelmetProvider } = await vite.ssrLoadModule("react-helmet-async");

    const helmetContext = {};
    const renderedApp = renderToString(
      React.createElement(
        HelmetProvider,
        { context: helmetContext },
        React.createElement(HomePage)
      )
    );

    console.log(`[Prerender] Successfully rendered HomePage! Length: ${renderedApp.length} characters.`);

    // 2. Read dist/index.html freshly created by vite build
    let rawHtml = fs.readFileSync(distIndexPath, "utf-8");
    let html = rawHtml;

    // Replace the empty root element cleanly (exact match prevents duplicate accumulation)
    if (html.includes('<div id="root"></div>')) {
      html = html.replace('<div id="root"></div>', `<div id="root">${renderedApp}</div>`);
    } else {
      // If root already had content, replace from '<div id="root">' up to its closing tag before noscript/script
      const rootStart = html.indexOf('<div id="root">');
      if (rootStart !== -1) {
        const nextTagMatch = html.slice(rootStart).match(/<\/div>\s*(<noscript|<script)/);
        if (nextTagMatch && nextTagMatch.index !== undefined) {
          const closeDivIndex = rootStart + nextTagMatch.index + 6; // length of '</div>'
          html = html.slice(0, rootStart) + `<div id="root">${renderedApp}</div>` + html.slice(closeDivIndex);
        }
      }
    }

    fs.writeFileSync(distIndexPath, html, "utf-8");
    console.log(`[Prerender] Successfully injected prerendered page into dist/index.html (${html.length} bytes).`);

    // 3. Generate dist/admin/index.html specifically for static hosting platforms like Vercel
    const distAdminDir = path.join(process.cwd(), "dist", "admin");
    if (!fs.existsSync(distAdminDir)) {
      fs.mkdirSync(distAdminDir, { recursive: true });
    }
    const adminLoadingHtml = `<div class="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center p-6"><div class="flex flex-col items-center gap-4 text-center"><div class="w-12 h-12 rounded-2xl bg-amber-50 border border-brand-200 animate-pulse flex items-center justify-center"><span class="text-brand-600 font-mono text-xs font-black">⚡</span></div><div><p class="text-[10px] font-black uppercase tracking-widest text-gray-900 font-mono">Molo BTC Network</p><p class="text-[9px] font-bold text-gray-400 font-mono uppercase mt-0.5">Connecting Sovereign Console...</p></div></div></div>`;
    const adminHtml = rawHtml.replace('<div id="root"></div>', `<div id="root">${adminLoadingHtml}</div>`);
    fs.writeFileSync(path.join(distAdminDir, "index.html"), adminHtml, "utf-8");
    try {
      fs.copyFileSync(path.join(process.cwd(), "vercel.json"), path.join(process.cwd(), "dist", "vercel.json"));
    } catch {}
    console.log("[Prerender] Successfully generated dist/admin/index.html and dist/vercel.json for Vercel.");
    console.log("[Prerender] Done.");
  } catch (error) {
    console.error("[Prerender] Error during prerendering:", error);
    process.exit(1);
  } finally {
    await vite.close();
  }
}

prerender();
