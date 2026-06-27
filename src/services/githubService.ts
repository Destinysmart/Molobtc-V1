/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GitHubRepo } from "../types";

const fallbackRepos: GitHubRepo[] = [
  {
    id: "bitcoin-self-custody-sovereign-infrastructure",
    name: "Bitcoin Self-Custody as Sovereign Monetary Infrastructure",
    description: "Historical Patterns, Risk Principles, and Organizational Implementation. A policy whitepaper outlining multi-signature architectures, air-gapped signing, and full-node validation aligned with industrial security standard ISA/IEC 62443.",
    url: "https://github.com/MoloBTC-Org/bsrf/blob/main/foundations/04_Tier1_Sovereign_Monetary_Infrastructure_v1.md",
    stars: 42,
    forks: 8,
    updated_at: "2026-06-09T12:00:00Z",
    language: "PDF/Markdown",
  },
  {
    id: "bitcoin-adjacent-currency-international-law",
    name: "Bitcoin as Adjacent Currency Under International Law",
    description: "The Global Case for Sui Generis Bearer Property, Separate Local Realization Taxation, and Double-Tax Coordination Principles. Grounded in Natural Law and Austrian economics.",
    url: "https://github.com/MoloBTC-Org/bsrf/blob/main/foundations/03_Tier1_Adjacent_Currency_v1.md",
    stars: 37,
    forks: 5,
    updated_at: "2026-06-15T12:00:00Z",
    language: "PDF/Markdown",
  },
  {
    id: "bitcoin-self-custody-research-ecosystem",
    name: "Bitcoin Self-Custody Research Ecosystem",
    description: "Tier 2 - Executive Overview & Reading Guide. Serves as the gateway to the Tier 2 operational collection, outlining structured reading paths for treasury, finance, and security teams.",
    url: "https://github.com/MoloBTC-Org/bsrf/blob/main/begin%20here/03_Bitcoin_Self_Custody_Research_Ecosystem_Index_v1.md",
    stars: 29,
    forks: 4,
    updated_at: "2026-06-16T12:00:00Z",
    language: "PDF/Markdown",
  },
  {
    id: "capital-flow-regulations-objection-template",
    name: "Objection / Submission Template: Draft Capital Flow Regulations",
    description: "A comprehensive submission template addressing South Africa's Draft Capital Flow Management Regulations 2026, highlighting constitutional property protections and rights to private compute.",
    url: "https://github.com/MoloBTC-Org/bsrf/blob/main/jurisdictions/south%20africa/South_Africa_Public_Comment_Template_v1.md",
    stars: 53,
    forks: 14,
    updated_at: "2026-06-20T12:00:00Z",
    language: "PDF/LaTeX",
  },
  {
    id: "bitcoin-as-sui-generis-bearer-property",
    name: "Bitcoin as Sui Generis Bearer Property",
    description: "The Natural-Law and Austrian Case for Tax-Free Treatment of Self-Custodied Bitcoin. A focused deductive argument analyzing digital scarcity and the limits of legitimate state coercion.",
    url: "https://github.com/MoloBTC-Org/bsrf/blob/main/foundations/02_Tier1_Sui_Generis_Bearer_Property_v1.md",
    stars: 31,
    forks: 6,
    updated_at: "2026-06-12T12:00:00Z",
    language: "PDF/Markdown",
  },
  {
    id: "bitcoin-sovereignty-core-principles",
    name: "Bitcoin Sovereignty Core Principles",
    description: "The Authoritative Foundation of the Bitcoin Sovereignty Research Framework. Detailing the nine core principles including private compute, adjacent currency status, and protection against compelled disclosure.",
    url: "https://github.com/MoloBTC-Org/bsrf/blob/main/begin%20here/01_Bitcoin_Sovereignty_Core_Principles_v1.md",
    stars: 48,
    forks: 11,
    updated_at: "2026-06-05T12:00:00Z",
    language: "PDF/Markdown",
  }
];

const rawUrls: Record<string, string> = {
  "bitcoin-self-custody-sovereign-infrastructure": "https://raw.githubusercontent.com/MoloBTC-Org/bsrf/main/foundations/04_Tier1_Sovereign_Monetary_Infrastructure_v1.md",
  "bitcoin-adjacent-currency-international-law": "https://raw.githubusercontent.com/MoloBTC-Org/bsrf/main/foundations/03_Tier1_Adjacent_Currency_v1.md",
  "bitcoin-self-custody-research-ecosystem": "https://raw.githubusercontent.com/MoloBTC-Org/bsrf/main/begin%20here/03_Bitcoin_Self_Custody_Research_Ecosystem_Index_v1.md",
  "capital-flow-regulations-objection-template": "https://raw.githubusercontent.com/MoloBTC-Org/bsrf/main/jurisdictions/south%20africa/South_Africa_Public_Comment_Template_v1.md",
  "bitcoin-as-sui-generis-bearer-property": "https://raw.githubusercontent.com/MoloBTC-Org/bsrf/main/foundations/02_Tier1_Sui_Generis_Bearer_Property_v1.md",
  "bitcoin-sovereignty-core-principles": "https://raw.githubusercontent.com/MoloBTC-Org/bsrf/main/begin%20here/01_Bitcoin_Sovereignty_Core_Principles_v1.md"
};

const docsMap: Record<string, string> = {
  "bitcoin-self-custody-sovereign-infrastructure": `# Bitcoin Self-Custody as Sovereign Monetary Infrastructure
**Historical Patterns, Risk Principles, and Organizational Implementation**
*Compiled by Jabulani Jakes, Research Collaboration with Grok (built by xAI), 9 June 2026*

## Executive Summary
This policy whitepaper synthesizes three essential layers of organizational sovereign security:
1. **Historical and Institutional Patterns**: Analyzing centralized monetary power and its systemic vulnerabilities.
2. **Strategic Risk-Mitigation Framework**: Grounded in observable 2026 developments and aligned with industrial control system security standard ISA/IEC 62443 (Zones and Conduits).
3. **Practical Implementation Pathways**: Detailing multi-signature setups, air-gapped signing computers, and localized full-node routing.

It positions self-custody not as a simple IT preference, but as a core fiduciary and sovereign responsibility for modern institutions.

## Crucial Security Implementations
- **Air-Gapped Signers**: Utilizing dedicated, non-networked hardware micro-controllers for localized key generation and transaction signing.
- **Multisig Configurations**: Transitioning from single-point-of-failure storage to 2-of-3 or 3-of-5 distributed setups across geographical boundaries.
- **Sovereign Node Validation**: Routing all transaction broadcasts and state checks through a dedicated self-hosted full node rather than third-party APIs.
`,
  "bitcoin-adjacent-currency-international-law": `# Bitcoin as Adjacent Currency Under International Law
**The Case for Sui Generis Bearer Property, Separate Local Realization Taxation, and Double-Tax Coordination**
*Prepared by Jabulani Jakes in collaboration with Grok, xAI, June 2026*

## Abstract & Legal Position
This research establishes the global normative case for treating self-custodied Bitcoin as an *adjacent currency* operating in the international commons of protocol and energy. 

Because Bitcoin exists as memorized or mathematically recovered knowledge rather than physical or state-licensed property, it defies traditional territorial jurisdictional boundaries. We argue that:
- Bitcoin is functionally a **Sui Generis Bearer Asset**.
- Mere holding, moving, or unrealized appreciation must remain outside the tax base.
- States should limit taxing rights strictly to local, realized economic activity (e.g., conversion to local fiat or local commercial purchases).
- Tax rates and rules must be coordinated internationally via principles analogous to Double Tax Agreements (DTAs) to prevent rights-violating capital blockades.
`,
  "bitcoin-self-custody-research-ecosystem": `# Bitcoin Self-Custody Research Ecosystem
**Tier 2 — Executive Overview & Reading Guide**
*Prepared by Jacques Strydom, PMP (Project Owner & Creator) & MoloBTC, June 2026*

## Introduction
This reading guide serves as the authoritative gateway to the Tier 2 operational research collection. The collection consists of three companion papers designed to enable boards, treasury officers, and technical security teams to align competencies and implement robust Bitcoin custody:

1. **Centralized Monetary Governance**: A review of monetary history and the recurring patterns of administrative debasement.
2. **Organizational Risk-Mitigation Framework**: A technical audit blueprint analyzing counterparty exposures and mitigation protocols.
3. **Critical Monetary Infrastructure**: Practical training and implementation pathways for industrial-grade offline operations.

This ecosystem provides the conceptual scaffolding necessary for complete institutional self-determination and capital preservation.
`,
  "capital-flow-regulations-objection-template": `# Objection & Submission Template: Capital Flow Management
**Objection to the Draft Capital Flow Management Regulations 2026**
*Prepared by MoloBTC, June 2026*

## Summary of Objection
This template provides the legal and constitutional grounds to object to proposed Capital Flow Management restrictions. It outlines how administrative attempts to restrict outbound transactions or compel disclosure of cryptographic keys violate fundamental rights:
- **Constitutional Property Protections**: Restricting private transacting operates as an unconstitutional administrative seizure.
- **Privacy of Mind**: Compelled disclosure of memorized brain-wallets or private words violates the absolute privacy of human consciousness.
- **Right to Private Compute**: Running a Bitcoin full node is a protected expression of mathematical speech and private calculation.

The document contains pre-drafted alternative legislative language designed to recognize Bitcoin as a *sui generis* adjacent currency rather than an exportable capital asset.
`,
  "bitcoin-as-sui-generis-bearer-property": `# Bitcoin as Sui Generis Bearer Property
**The Natural-Law and Austrian Case for Tax-Free Treatment of Self-Custodied Bitcoin**
*Prepared by Jabulani Jakes & Grok, June 2026*

## Core Deductive Arguments
This paper outlines the philosophical and economic case for the exemption of self-custodied Bitcoin from arbitrary capital levies and holding taxes:
1. **Energy-Based Homesteading**: Bitcoin arises spontaneously through purposeful energy expenditure (Proof of Work). It represents direct physical homesteading in the digital digital commons.
2. **Absence of State Privilege**: Unlike corporate stocks, real estate, or fiat banking deposits, Bitcoin requires no state infrastructure, courts, or registries to exist or transfer securely.
3. **The Nature of Holding**: Holding a private key is merely holding mathematical knowledge. Taxing the mere holding of knowledge is an unprecedented and illegitimate overreach of administrative coercion.

We conclude that the state has no rightful claim to levy taxes on the mere holding, movement, or unrealized appreciation of self-custodied cryptographic keys.
`,
  "bitcoin-sovereignty-core-principles": `# Bitcoin Sovereignty Core Principles
**The Authoritative Foundation of the Bitcoin Sovereignty Research Framework**
*Published by MoloBTC Research Lab, Version 1.0, June 2026*

## The Nine Pillars of Sovereignty
This document presents the nine non-negotiable principles required to preserve human liberty and transaction rights in the digital age:
1. **Sui Generis Bearer Property**: Bitcoin is an absolute, issuer-free, self-secured bearer asset.
2. **Adjacent Currency Recognition**: Bitcoin operates as a sovereign parallel currency in the global protocol commons.
3. **Right to Sovereign Private Compute**: The absolute right to run open-source software, including Bitcoin full nodes, on private devices.
4. **Self-Custody as the Highest Standard**: Fiduciary and personal custody must be direct and independent of intermediaries.
5. **No Compelled Key Disclosure**: Protection of private seed words as sacred, non-disclosable mental information.
6. **Realization-Based Taxation with Territorial Nexus**: Strictly taxing only conversion events, never holding or transport.
7. **Absolute Freedom of Transaction**: Banning censorship or blacklisting at the protocol or local application layers.
8. **Thermodynamic Consensus Security**: Preserving pure, unmanipulated Proof-of-Work against administrative regulatory capture.
9. **No Issuer-Dependence**: Clearly separating Bitcoin from debt-based, centralized, or issuer-dependent utility tokens.
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
        console.log("[GitHubService] Fetching live stats directly from public GitHub API: https://api.github.com/repos/MoloBTC-Org/bsrf");
        const ghRes = await fetch("https://api.github.com/repos/MoloBTC-Org/bsrf", {
          headers: { "Accept": "application/vnd.github.v3+json" }
        });
        console.log("[GitHubService] Public GitHub API response status:", ghRes.status, "OK:", ghRes.ok);
        if (ghRes.ok) {
          const ghData = await ghRes.json();
          console.log("[GitHubService] Public GitHub API response parsed:", ghData);
          const stars = ghData.stargazers_count ?? 42;
          const forks = ghData.forks_count ?? 8;
          console.log(`[GitHubService] Applying live stats - Stars: ${stars}, Forks: ${forks} to fallbackRepos.`);
          const mapped = fallbackRepos.map(repo => ({
            ...repo,
            stars,
            forks
          }));
          console.log("[GitHubService] Mapped fallback repos:", mapped);
          return mapped;
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
      const rawUrl = rawUrls[repoName];
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
      const offlineDoc = docsMap[repoName];
      console.log(`[GitHubService] Returning offline backup doc for ${repoName}. Exists: ${!!offlineDoc}`);
      return offlineDoc || `# Repository: ${repoName}\nThis is an active research project by MoloBTC exploring advanced Bitcoin utilities, scaling state mechanics, and legal sovereign frameworks across the continent.\n\n*Content resolved from offline cache.*`;
    }
  }
}

export const githubService = GitHubService.getInstance();

