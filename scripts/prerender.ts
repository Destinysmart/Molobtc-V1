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
    let html = fs.readFileSync(distIndexPath, "utf-8");

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
    console.log("[Prerender] Done.");
  } catch (error) {
    console.error("[Prerender] Error during prerendering:", error);
    process.exit(1);
  } finally {
    await vite.close();
  }
}

prerender();
