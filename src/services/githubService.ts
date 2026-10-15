/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GitHubRepo } from "../types";

const fallbackRepos: GitHubRepo[] = [
  // Official Top-Level Repositories
  {
    id: "bsrf",
    name: "Bitcoin Sovereignty Research Framework (BSRF)",
    description: "A professional research repository for the legal and policy treatment of Bitcoin as sui generis bearer property and adjacent currency. Includes foundational whitepapers, ISA/IEC 62443 custody blueprints, and capital regulation objections.",
    url: "https://github.com/MoloBTC-Org/bsrf",
    stars: 3,
    forks: 0,
    updated_at: "2026-09-30T10:47:52Z",
    language: "Markdown / Policy",
  },
  {
    id: "bsol",
    name: "Bitcoin Sovereign Open Source License (BSOL) v1.0",
    description: "Canonical home of BSOL v1.0 and the Sovereign Bitcoin Knowledge Declaration. A Bitcoin-native gift license treating knowledge as non-rivalrous, refusing enclosure, and establishing sovereign rights.",
    url: "https://github.com/MoloBTC-Org/bsol",
    stars: 1,
    forks: 0,
    updated_at: "2026-09-03T13:07:11Z",
    language: "Legal / License",
  },
  {
    id: "bbpp",
    name: "Bitcoin Best Practice Protocol (BBPP)",
    description: "Framework and future client for monetary-efficient Bitcoin nodes. Identical consensus. Policy and defaults may differ. Documentation first, addressing policy defaults, spam filters, and DATUM templates.",
    url: "https://github.com/MoloBTC-Org/bbpp",
    stars: 0,
    forks: 0,
    updated_at: "2026-10-04T20:17:32Z",
    language: "C++ / Protocol",
  },
  {
    id: "sgas",
    name: "Sovereign Grok Agent Suite (SGAS) v1.0.1",
    description: "A modular collection of documents for building sovereign, secure, and practical AI agent systems with Grok Build for Bitcoin protocol and sovereign research.",
    url: "https://github.com/MoloBTC-Org/sgas",
    stars: 1,
    forks: 0,
    updated_at: "2026-10-04T19:28:10Z",
    language: "Makefile / Agentic",
  },
  // Foundational Research Papers and Tracks under BSRF
  {
    id: "bitcoin-self-custody-sovereign-infrastructure",
    name: "Bitcoin Self-Custody as Sovereign Monetary Infrastructure",
    description: "Historical Patterns, Risk Principles, and Organizational Implementation. A policy whitepaper outlining multi-signature architectures, air-gapped signing, and full-node validation aligned with industrial security standard ISA/IEC 62443.",
    url: "https://github.com/MoloBTC-Org/bsrf/blob/main/foundations/04_Tier1_Sovereign_Monetary_Infrastructure_v1.md",
    stars: 3,
    forks: 0,
    updated_at: "2026-09-30T10:47:52Z",
    language: "PDF/Markdown",
  },
  {
    id: "bitcoin-adjacent-currency-international-law",
    name: "Bitcoin as Adjacent Currency Under International Law",
    description: "The Global Case for Sui Generis Bearer Property, Separate Local Realization Taxation, and Double-Tax Coordination Principles. Grounded in Natural Law and Austrian economics.",
    url: "https://github.com/MoloBTC-Org/bsrf/blob/main/foundations/03_Tier1_Adjacent_Currency_v1.md",
    stars: 3,
    forks: 0,
    updated_at: "2026-09-30T10:47:52Z",
    language: "PDF/Markdown",
  },
  {
    id: "bitcoin-self-custody-research-ecosystem",
    name: "Bitcoin Self-Custody Research Ecosystem",
    description: "Tier 2 - Executive Overview & Reading Guide. Serves as the gateway to the Tier 2 operational collection, outlining structured reading paths for treasury, finance, and security teams.",
    url: "https://github.com/MoloBTC-Org/bsrf/blob/main/begin_here/03_Bitcoin_Self_Custody_Research_Ecosystem_Index_v1.md",
    stars: 3,
    forks: 0,
    updated_at: "2026-09-30T10:47:52Z",
    language: "PDF/Markdown",
  },
  {
    id: "capital-flow-regulations-objection-template",
    name: "Objection / Submission Template: Draft Capital Flow Regulations",
    description: "A comprehensive submission template addressing South Africa's Draft Capital Flow Management Regulations 2026, highlighting constitutional property protections and rights to private compute.",
    url: "https://github.com/MoloBTC-Org/bsrf/blob/main/jurisdictions/south_africa/South_Africa_Public_Comment_Template_v1.md",
    stars: 3,
    forks: 0,
    updated_at: "2026-09-30T10:47:52Z",
    language: "PDF/LaTeX",
  },
  {
    id: "bitcoin-as-sui-generis-bearer-property",
    name: "Bitcoin as Sui Generis Bearer Property",
    description: "The Natural-Law and Austrian Case for Tax-Free Treatment of Self-Custodied Bitcoin. A focused deductive argument analyzing digital scarcity and the limits of legitimate state coercion.",
    url: "https://github.com/MoloBTC-Org/bsrf/blob/main/foundations/02_Tier1_Sui_Generis_Bearer_Property_v1.md",
    stars: 3,
    forks: 0,
    updated_at: "2026-09-30T10:47:52Z",
    language: "PDF/Markdown",
  },
  {
    id: "bitcoin-sovereignty-core-principles",
    name: "Bitcoin Sovereignty Core Principles",
    description: "The Authoritative Foundation of the Bitcoin Sovereignty Research Framework. Detailing the nine core principles including private compute, adjacent currency status, and protection against compelled disclosure.",
    url: "https://github.com/MoloBTC-Org/bsrf/blob/main/begin_here/01_Bitcoin_Sovereignty_Core_Principles_v1.md",
    stars: 3,
    forks: 0,
    updated_at: "2026-09-30T10:47:52Z",
    language: "PDF/Markdown",
  }
];

const rawUrls: Record<string, string> = {
  "bsrf": "https://raw.githubusercontent.com/MoloBTC-Org/bsrf/main/README.md",
  "bsol": "https://raw.githubusercontent.com/MoloBTC-Org/bsol/main/README.md",
  "bbpp": "https://raw.githubusercontent.com/MoloBTC-Org/bbpp/main/README.md",
  "sgas": "https://raw.githubusercontent.com/MoloBTC-Org/sgas/main/README.md",
  "bitcoin-self-custody-sovereign-infrastructure": "https://raw.githubusercontent.com/MoloBTC-Org/bsrf/main/foundations/04_Tier1_Sovereign_Monetary_Infrastructure_v1.md",
  "bitcoin-adjacent-currency-international-law": "https://raw.githubusercontent.com/MoloBTC-Org/bsrf/main/foundations/03_Tier1_Adjacent_Currency_v1.md",
  "bitcoin-self-custody-research-ecosystem": "https://raw.githubusercontent.com/MoloBTC-Org/bsrf/main/begin_here/03_Bitcoin_Self_Custody_Research_Ecosystem_Index_v1.md",
  "capital-flow-regulations-objection-template": "https://raw.githubusercontent.com/MoloBTC-Org/bsrf/main/jurisdictions/south_africa/South_Africa_Public_Comment_Template_v1.md",
  "bitcoin-as-sui-generis-bearer-property": "https://raw.githubusercontent.com/MoloBTC-Org/bsrf/main/foundations/02_Tier1_Sui_Generis_Bearer_Property_v1.md",
  "bitcoin-sovereignty-core-principles": "https://raw.githubusercontent.com/MoloBTC-Org/bsrf/main/begin_here/01_Bitcoin_Sovereignty_Core_Principles_v1.md"
};

const docsMap: Record<string, string> = {
  "bsrf": `# Bitcoin Sovereignty Research Framework (BSRF)
**A professional research repository for the legal and policy treatment of Bitcoin as sui generis bearer property and adjacent currency.**
*Canonical Repository: https://github.com/MoloBTC-Org/bsrf*  
*License: Bitcoin Sovereign Open Source License (BSOL v1.0)*

## Scope and Purpose
This repository provides legal, policy, and technical blueprints establishing:
1. **Sui Generis Bearer Property**: Digital scarcity homesteading through Proof-of-Work energy expenditure.
2. **Adjacent Currency Recognition**: Bitcoin functioning as an autonomous global commons currency beyond administrative double taxation.
3. **Right to Sovereign Compute**: The constitutional protection of running self-hosted validation nodes.
4. **ISA/IEC 62443 Enterprise Custody**: Applying industrial automation zones and conduits to institutional key security.
`,
  "bsol": `# Bitcoin Sovereign Open Source License (BSOL) v1.0
**Canonical home of BSOL v1.0 and the Sovereign Bitcoin Knowledge Declaration.**
*Published by: MoloBTC-Org*  
*Steward: Jacques Strydom, PMP (Jabulani Jakes)*  
*Website: www.MoloBTC.africa*

## What this is
BSOL is a Bitcoin-native gift license.
It is for Bitcoin-related code, papers, analyses, curricula, declarations, designs, and reference implementations.
It treats knowledge and code as non-rivalrous. It refuses enclosure. It places no responsibility on the user of a work published under it.

## How to use it
1. Copy \`LICENSE.md\` into the root of your project.
2. If you want people to find the terms, point to that file. That is the whole method.
Attribution is voluntary. If you name the source, you are recording a method, not paying a toll.
`,
  "bbpp": `# Bitcoin Best Practice Protocol (BBPP)
**Framework first. Explicit client later. Identical consensus.**
*Published by: MoloBTC-Org*  
*License: BSOL v1.0*

## Core Mission
A purpose-driven project for Bitcoin (and other UTXO proof-of-work payment networks) that treats **monetary efficiency** as something you can measure, not a slogan.

## Key Principles & Scope
- **Policy Defaults & Antispam**: Zero datacarriersize, parasite rejection, and seven active antispam rules.
- **Template Sovereignty**: DATUM decentralized mining template generation (hasher sees the mempool).
- **Post-Validation Storage**: Efficient monetary node architectures.
- **Non-Goals**: No consensus changes, no hard fork on the primary line, no arbitrary on-chain bloat.
`,
  "sgas": `# Sovereign Grok Agent Suite (SGAS) v1.0.1
**A modular collection of documents for building sovereign, secure, and practical AI agent systems with Grok Build.**
*Canonical hub: github.com/MoloBTC-Org/sgas*  
*License: BSOL v1.0*  
*Authorship: Jacques Strydom, PMP (@JabulaniJakes) in collaboration with Grok (xAI)*

## Architecture
- **Sovereignty & Local-First**: Worktrees, plan mode, strict permissions, and private compute.
- **Zero Trust MCP Servers**: Secure tool calling interfaces for autonomous agents.
- **Hardware-Aware Tiers**: Entry, Balanced, and Top tiers supporting emerging-market infrastructure.
- **Grok-Native Pipelines**: Full integration from prompt engineering to local execution.
`,
  "bitcoin-self-custody-sovereign-infrastructure": `# Bitcoin Self-Custody as Sovereign Monetary Infrastructure
**Historical Patterns, Risk Principles, and Organizational Implementation**
*Compiled by Jabulani Jakes, Research Collaboration with Grok (built by xAI), 9 June 2026*

## Executive Summary
This policy whitepaper synthesizes three essential layers of organizational sovereign security:
1. **Historical and Institutional Patterns**: Analyzing centralized monetary power and its systemic vulnerabilities.
2. **Strategic Risk-Mitigation Framework**: Grounded in observable 2026 developments and aligned with industrial control system security standard ISA/IEC 62443 (Zones and Conduits).
3. **Practical Implementation Pathways**: Detailing multi-signature setups, air-gapped signing computers, and localized full-node routing.

It positions self-custody not as a simple IT preference, but as a core fiduciary and sovereign responsibility for modern institutions.
`,
  "bitcoin-adjacent-currency-international-law": `# Bitcoin as Adjacent Currency Under International Law
**The Case for Sui Generis Bearer Property, Separate Local Realization Taxation, and Double-Tax Coordination**
*Prepared by Jabulani Jakes in collaboration with Grok, xAI, June 2026*

## Abstract & Legal Position
This research establishes the global normative case for treating self-custodied Bitcoin as an *adjacent currency* operating in the international commons of protocol and energy. 
- Bitcoin is functionally a **Sui Generis Bearer Asset**.
- Mere holding, moving, or unrealized appreciation must remain outside the tax base.
- States should limit taxing rights strictly to local, realized economic activity.
`,
  "bitcoin-self-custody-research-ecosystem": `# Bitcoin Self-Custody Research Ecosystem
**Tier 2 — Executive Overview & Reading Guide**
*Prepared by Jacques Strydom, PMP (Project Owner & Creator) & MoloBTC, June 2026*

## Introduction
This reading guide serves as the authoritative gateway to the Tier 2 operational research collection for boards, treasury officers, and technical security teams.
`,
  "capital-flow-regulations-objection-template": `# Objection & Submission Template: Capital Flow Management
**Objection to the Draft Capital Flow Management Regulations 2026**
*Prepared by MoloBTC, June 2026*

## Summary of Objection
This template provides the legal and constitutional grounds to object to proposed Capital Flow Management restrictions, defending property protections, privacy of mind, and the right to private compute.
`,
  "bitcoin-as-sui-generis-bearer-property": `# Bitcoin as Sui Generis Bearer Property
**The Natural-Law and Austrian Case for Tax-Free Treatment of Self-Custodied Bitcoin**
*Prepared by Jabulani Jakes & Grok, June 2026*

## Core Deductive Arguments
This paper outlines the philosophical and economic case for the exemption of self-custodied Bitcoin from arbitrary capital levies and holding taxes.
`,
  "bitcoin-sovereignty-core-principles": `# Bitcoin Sovereignty Core Principles
**The Authoritative Foundation of the Bitcoin Sovereignty Research Framework**
*Published by MoloBTC Research Lab, Version 1.0, June 2026*

## The Nine Pillars of Sovereignty
1. Sui Generis Bearer Property
2. Adjacent Currency Recognition
3. Right to Sovereign Private Compute
4. Self-Custody as the Highest Standard
5. No Compelled Key Disclosure
6. Realization-Based Taxation with Territorial Nexus
7. Absolute Freedom of Transaction
8. Thermodynamic Consensus Security
9. No Issuer-Dependence
`
};

/**
 * Service to orchestrate calls to/from our MoloBTC GitHub API Proxy Layer on the server.
 * Includes caching protocols and resilient fallback data handlers.
 */
export class GitHubService {
  private static instance: GitHubService;

  private constructor() {}

  public static getInstance(): GitHubService {
    if (!GitHubService.instance) {
      GitHubService.instance = new GitHubService();
    }
    return GitHubService.instance;
  }

  /**
   * Fetches all public code documentation & research repositories synced under MoloBTC.
   * Auto-heals and uses high-fidelity offline fallbacks if the server-side API is missing (e.g. on static hosts like Vercel).
   */
  public async getRepositories(): Promise<GitHubRepo[]> {
    console.log("[GitHubService] getRepositories() called.");
    try {
      console.log("[GitHubService] Fetching from Express backend API: /api/github/repos");
      const response = await fetch("/api/github/repos");
      console.log("[GitHubService] Backend response received. Status:", response.status, "OK:", response.ok);
      
      if (!response.ok) {
        throw new Error(`HTTP status non-ok: ${response.status}`);
      }
      
      const contentType = response.headers.get("content-type");
      console.log("[GitHubService] Backend response Content-Type:", contentType);
      if (contentType && contentType.includes("text/html")) {
        throw new Error("HTML response received instead of JSON (likely static router redirect)");
      }

      const data = await response.json();
      console.log("[GitHubService] Successfully parsed JSON from backend. Data:", data);
      if (!Array.isArray(data)) {
        throw new Error("Invalid format received from backend: data is not an array");
      }
      return data;
    } catch (err) {
      console.warn("[GitHubService] Express backend API unavailable or failed. Engaging sovereign offline repository cache...", err);
      
      // Attempt to retrieve live stars/forks count directly from GitHub API for real-time authenticity
      try {
        console.log("[GitHubService] Fetching live stats directly from public GitHub API: https://api.github.com/orgs/MoloBTC-Org/repos");
        const ghRes = await fetch("https://api.github.com/orgs/MoloBTC-Org/repos", {
          headers: { "Accept": "application/vnd.github.v3+json" }
        });
        console.log("[GitHubService] Public GitHub API response status:", ghRes.status, "OK:", ghRes.ok);
        if (ghRes.ok) {
          const ghData = await ghRes.json();
          if (Array.isArray(ghData)) {
            const statsMap: Record<string, { stars: number; forks: number; updated_at?: string }> = {};
            ghData.forEach((r: any) => {
              statsMap[r.name.toLowerCase()] = {
                stars: r.stargazers_count ?? 0,
                forks: r.forks_count ?? 0,
                updated_at: r.updated_at
              };
            });
            const mapped = fallbackRepos.map(repo => {
              const directStat = statsMap[repo.id.toLowerCase()];
              const parentStat = statsMap["bsrf"];
              return {
                ...repo,
                stars: directStat ? directStat.stars : (parentStat ? parentStat.stars : repo.stars),
                forks: directStat ? directStat.forks : (parentStat ? parentStat.forks : repo.forks),
                updated_at: directStat?.updated_at || parentStat?.updated_at || repo.updated_at
              };
            });
            console.log("[GitHubService] Mapped fallback repos with live GitHub stats:", mapped);
            return mapped;
          }
        } else {
          console.warn("[GitHubService] Public GitHub API returned non-ok status. Might be rate-limited.");
        }
      } catch (ghErr) {
        console.error("[GitHubService] Failed to query live stats from public GitHub API:", ghErr);
      }
      
      console.log("[GitHubService] Returning static fallbackRepos:", fallbackRepos);
      return fallbackRepos;
    }
  }

  /**
   * Fetches the actual markdown/plain-text documentation files (e.g. LICENSE, README.md)
   * stored in a given MoloBTC repository. Supports client-side Raw content fetches & high-fidelity local fallbacks.
   */
  public async getRepositoryReadme(repoName: string): Promise<string> {
    console.log(`[GitHubService] getRepositoryReadme() called for repo: ${repoName}`);
    try {
      console.log(`[GitHubService] Fetching readme from Express backend: /api/github/repos/${repoName}/contents`);
      const response = await fetch(`/api/github/repos/${encodeURIComponent(repoName)}/contents`);
      console.log(`[GitHubService] Backend readme response status: ${response.status}, OK: ${response.ok}`);
      
      if (!response.ok) {
        throw new Error(`HTTP status non-ok: ${response.status}`);
      }
      
      const contentType = response.headers.get("content-type");
      console.log(`[GitHubService] Backend readme response Content-Type: ${contentType}`);
      if (contentType && contentType.includes("text/html")) {
        throw new Error("HTML response received instead of JSON");
      }

      const data = await response.json();
      console.log("[GitHubService] Parsed readme response successfully:", data);
      if (data && typeof data.content === "string") {
        return data.content;
      }
      throw new Error("Invalid payload format: 'content' field is missing or not a string");
    } catch (err) {
      console.warn(`[GitHubService] Express backend readme API unavailable for ${repoName}. Resolving sovereign direct/raw backup...`, err);
      
      // 1. Try to fetch directly from raw.githubusercontent.com (No CORS issues, perfect for Vercel SPA)
      const rawKey = Object.keys(rawUrls).find(k => k.toLowerCase() === repoName.toLowerCase() || repoName.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(repoName.toLowerCase()));
      const rawUrl = rawKey ? rawUrls[rawKey] : rawUrls[repoName];
      console.log(`[GitHubService] Checking direct Raw URL for ${repoName}: ${rawUrl || "None"}`);
      if (rawUrl) {
        try {
          console.log(`[GitHubService] Fetching directly from Raw GitHub: ${rawUrl}`);
          const rawResponse = await fetch(rawUrl);
          console.log(`[GitHubService] Raw response status: ${rawResponse.status}, OK: ${rawResponse.ok}`);
          if (rawResponse.ok) {
            const rawText = await rawResponse.text();
            if (rawText && !rawText.trim().startsWith("<!DOCTYPE")) {
              console.log(`[GitHubService] Successfully fetched Raw markdown of length: ${rawText.length}`);
              return rawText;
            } else {
              console.warn("[GitHubService] Raw fetch returned HTML instead of Markdown.");
            }
          }
        } catch (rawErr) {
          console.error(`[GitHubService] Direct GitHub raw content pull failed for ${repoName}:`, rawErr);
        }
      }

      // 2. Fallback to local pre-compiled high-fidelity documents
      const docKey = Object.keys(docsMap).find(k => k.toLowerCase() === repoName.toLowerCase() || repoName.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(repoName.toLowerCase()));
      const offlineDoc = docKey ? docsMap[docKey] : docsMap[repoName];
      console.log(`[GitHubService] Returning offline backup doc for ${repoName}. Exists: ${!!offlineDoc}`);
      return offlineDoc || `# Repository: ${repoName}\nThis is an active research project by MoloBTC exploring advanced Bitcoin utilities, scaling state mechanics, and legal sovereign frameworks across the continent.\n\n*Content resolved from offline cache.*`;
    }
  }
}

export const githubService = GitHubService.getInstance();
export { fallbackRepos };
