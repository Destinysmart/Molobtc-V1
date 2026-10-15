/**
 * Build-time Prerendering Script (SSG) for MoloBTC
 * 
 * Renders the React Homepage component into static HTML during build time
 * so that initial HTML responses are fully populated for search engines and AI crawlers
 * that do not execute JavaScript (Bingbot, Perplexity, GPTBot, ClaudeBot, etc.).
 */

import fs from "fs";
import path from "path";
import React from "react";
import { renderToString } from "react-dom/server";
import { createServer } from "vite";

async function prerender() {
  console.log("[Prerender] Starting build-time static HTML prerender...");

  const vite = await createServer({
    server: { middlewareMode: true, hmr: false },
    appType: "custom",
  });

  try {
    // 1. SSR load the HomePage and HelmetProvider modules
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

    // 2. Guaranteed fallback links for crawlers (Goal 3)
    const mediaFallbackHtml = `
    <!-- Guaranteed fallback for crawlers & non-JS clients (Bitcoin Africa Story coverage) -->
    <noscript>
      <div id="static-media-fallback" style="padding: 24px 16px; background-color: #FFFBF7; text-align: center; border-top: 1px solid rgba(0,0,0,0.06); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <p style="font-size: 13px; font-weight: 700; color: #4B5563; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 0.05em;">As featured in:</p>
        <div style="display: flex; gap: 20px; justify-content: center; flex-wrap: wrap;">
          <a href="https://www.bitcoinafricastory.com/news/molobtc" target="_blank" rel="noopener" style="color: #EA580C; text-decoration: underline; font-size: 13px; font-weight: 600;">
            Bitcoin Africa Story: What Is MoloBTC? Africa's Open-Source Bitcoin Project
          </a>
          <a href="https://www.bitcoinafricastory.com/news/can-south-africa-control-bitcoin-the-regulation-fight" target="_blank" rel="noopener" style="color: #EA580C; text-decoration: underline; font-size: 13px; font-weight: 600;">
            Bitcoin Africa Story: Can South Africa Control Bitcoin? The Regulation Fight
          </a>
        </div>
      </div>
    </noscript>`;

    // 3. Define SEO metadata tags to inject into HTML head
    const seoMetaHead = `
    <title>moloBTC - Africa's Bitcoin Research &amp; Discovery Platform</title>
    <meta name="title" content="moloBTC - Africa's Bitcoin Research &amp; Discovery Platform" />
    <meta name="description" content="See Bitcoin through the Orange Lens. Discover curated pathways, simplified research, directories and opportunities across the African Bitcoin ecosystem." />
    <link rel="canonical" href="https://www.molobtc.africa/" />
    
    <!-- Open Graph / Facebook / LinkedIn / WhatsApp -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://www.molobtc.africa/" />
    <meta property="og:title" content="moloBTC - Africa's Bitcoin Research &amp; Discovery Platform" />
    <meta property="og:description" content="See Bitcoin through the Orange Lens. Discover curated pathways, simplified research, directories and opportunities across the African Bitcoin ecosystem." />
    <meta property="og:image" content="https://res.cloudinary.com/dqrptx2qp/image/upload/v1785424033/Image_2024-02-08_at_04.18_ujbm5g.jpg" />
    <meta property="og:site_name" content="moloBTC" />
    
    <!-- Twitter / X -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="https://www.molobtc.africa/" />
    <meta name="twitter:title" content="moloBTC - Africa's Bitcoin Research &amp; Discovery Platform" />
    <meta name="twitter:description" content="See Bitcoin through the Orange Lens. Discover curated pathways, simplified research, directories and opportunities across the African Bitcoin ecosystem." />
    <meta name="twitter:image" content="https://res.cloudinary.com/dqrptx2qp/image/upload/v1785424033/Image_2024-02-08_at_04.18_ujbm5g.jpg" />
    `;

    // 4. Inject into target files: dist/index.html (production) and index.html (source template)
    const targets = [
      path.join(process.cwd(), "dist", "index.html"),
      path.join(process.cwd(), "index.html")
    ];

    for (const targetPath of targets) {
      if (!fs.existsSync(targetPath)) continue;

      let html = fs.readFileSync(targetPath, "utf-8");

      // Replace or inject title and meta
      if (html.includes("<title>")) {
        html = html.replace(/<title>[\s\S]*?<\/title>/i, "");
      }
      // Replace existing SEO meta tags if any
      html = html.replace(/<\/head>/i, `<!-- SEO_START -->${seoMetaHead}<!-- SEO_END -->\n  </head>`);

      // Inject rendered content inside <div id="root"></div>
      html = html.replace(
        /<div id="root">[\s\S]*?<\/div>/i,
        `<div id="root">${renderedApp}</div>`
      );

      // Inject static media fallback if not already present
      if (!html.includes("id=\"static-media-fallback\"")) {
        html = html.replace(
          /(<div id="root">[\s\S]*?<\/div>)/i,
          `$1\n${mediaFallbackHtml}`
        );
      }

      fs.writeFileSync(targetPath, html, "utf-8");
      console.log(`[Prerender] Successfully updated ${path.relative(process.cwd(), targetPath)} (${html.length} bytes).`);
    }

    console.log("[Prerender] Complete. Prerendered HTML contains full content and crawlable outbound links.");
  } catch (error) {
    console.error("[Prerender] Failed to prerender:", error);
    process.exit(1);
  } finally {
    await vite.close();
  }
}

prerender();
